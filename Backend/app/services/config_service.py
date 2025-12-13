"""
Configuration Service
Handles reading and writing admin-managed configuration
"""
import json
import logging
from typing import Optional, Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.config import ConfigRepository, InstrumentRepository
from app.models.config import ConfigCategory
from app.cache.redis import RedisCache, CacheKeys
from app.config.settings import settings

logger = logging.getLogger(__name__)


class ConfigService:
    """
    Configuration service with caching and fallback support.
    Provides interface for reading/writing admin-managed configs.
    """
    
    def __init__(
        self,
        db: AsyncSession,
        cache: Optional[RedisCache] = None
    ):
        self.config_repo = ConfigRepository(db)
        self.instrument_repo = InstrumentRepository(db)
        self.cache = cache
    
    async def get(
        self,
        key: str,
        fallback: Optional[str] = None,
        as_type: Optional[type] = None
    ) -> Optional[Any]:
        """
        Get configuration value with caching and fallback.
        
        Args:
            key: Configuration key
            fallback: Fallback value if not found
            as_type: Type to convert value to (int, float, bool, dict)
            
        Returns:
            Configuration value or fallback
        """
        # Try cache first
        if self.cache:
            cache_key = CacheKeys.config(key)
            cached = await self.cache.get(cache_key)
            if cached is not None:
                return self._convert_type(cached, as_type)
        
        # Try database
        value = await self.config_repo.get_value(key)
        
        if value is not None:
            # Update cache
            if self.cache:
                await self.cache.set(
                    CacheKeys.config(key),
                    value,
                    ttl=settings.REDIS_CONFIG_CACHE_TTL
                )
            return self._convert_type(value, as_type)
        
        # Try settings fallback
        settings_fallback = settings.get_fallback(key)
        if settings_fallback:
            return self._convert_type(settings_fallback, as_type)
        
        # Use provided fallback
        return self._convert_type(fallback, as_type) if fallback else None
    
    async def set(
        self,
        key: str,
        value: Any,
        category: ConfigCategory = ConfigCategory.SYSTEM,
        updated_by: Optional[UUID] = None,
        **kwargs
    ) -> bool:
        """
        Set configuration value.
        
        Args:
            key: Configuration key
            value: Configuration value
            category: Config category
            updated_by: Admin user ID
            **kwargs: Additional config attributes
            
        Returns:
            True if successful
        """
        # Convert value to string
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        else:
            value = str(value)
        
        config = await self.config_repo.set_config(
            key=key,
            value=value,
            category=category,
            updated_by=updated_by,
            **kwargs
        )
        
        # Invalidate cache
        if self.cache and config:
            await self.cache.delete(CacheKeys.config(key))
        
        return config is not None
    
    async def get_all(self, category: Optional[ConfigCategory] = None) -> list:
        """Get all configurations, optionally filtered by category"""
        if category:
            return await self.config_repo.get_by_category(category)
        return await self.config_repo.get_all_active()
    
    async def delete(self, key: str) -> bool:
        """Delete a configuration"""
        config = await self.config_repo.get_by_key(key)
        if config:
            result = await self.config_repo.delete(config.id)
            
            # Invalidate cache
            if self.cache and result:
                await self.cache.delete(CacheKeys.config(key))
            
            return result
        return False
    
    async def get_instruments(self, active_only: bool = True) -> list:
        """Get all trading instruments"""
        if active_only:
            return await self.instrument_repo.get_active()
        return await self.instrument_repo.get_all()
    
    async def get_instrument(self, symbol: str) -> Optional[Any]:
        """Get instrument by symbol"""
        return await self.instrument_repo.get_by_symbol(symbol)
    
    async def create_instrument(self, **kwargs) -> Any:
        """Create a new trading instrument"""
        return await self.instrument_repo.create(**kwargs)
    
    async def invalidate_cache(self, pattern: Optional[str] = None) -> int:
        """Invalidate cache entries"""
        if not self.cache:
            return 0
        
        if pattern:
            return await self.cache.delete_pattern(pattern)
        
        # Clear all config cache
        return await self.cache.delete_pattern("config:*")
    
    def _convert_type(self, value: Optional[str], target_type: Optional[type]) -> Any:
        """Convert string value to target type"""
        if value is None:
            return None
        
        if target_type is None:
            return value
        
        try:
            if target_type == bool:
                return value.lower() in ("true", "1", "yes")
            elif target_type == int:
                return int(value)
            elif target_type == float:
                return float(value)
            elif target_type == dict or target_type == list:
                return json.loads(value)
            return value
        except (ValueError, json.JSONDecodeError):
            logger.warning(f"Failed to convert '{value}' to {target_type}")
            return value


# Factory function for dependency injection
async def get_config_service(
    db: AsyncSession,
    cache: Optional[RedisCache] = None
) -> ConfigService:
    """Get config service instance"""
    return ConfigService(db=db, cache=cache)
