"""
Admin API Endpoints - Configuration management
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import CurrentAdmin, Cache
from app.core.exceptions import NotFoundException, ValidationException
from app.services.config_service import ConfigService
from app.models.config import ConfigCategory
from app.repositories.config import ConfigRepository, InstrumentRepository
from app.cache.redis import get_redis, RedisCache
from app.schemas.config import (
    ConfigCreate,
    ConfigUpdate,
    ConfigResponse,
    InstrumentCreate,
    InstrumentUpdate,
    InstrumentResponse,
    CacheClearRequest,
    CacheClearResponse,
)
from app.schemas.common import ResponseModel

logger = logging.getLogger(__name__)
router = APIRouter()


async def get_config_service(
    db: AsyncSession = Depends(get_db),
    cache: RedisCache = Depends(get_redis)
) -> ConfigService:
    """Dependency to get config service"""
    return ConfigService(db=db, cache=cache)


# ═══════════════════════════════════════════════════════════════════
# Configuration Endpoints
# ═══════════════════════════════════════════════════════════════════

@router.get("/config", response_model=ResponseModel)
async def list_configs(
    current_user: CurrentAdmin,
    category: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """
    List all configurations (admin only).
    """
    config_repo = ConfigRepository(db)
    
    if category:
        try:
            cat_enum = ConfigCategory(category)
            configs = await config_repo.get_by_category(cat_enum)
        except ValueError:
            raise ValidationException(f"Invalid category: {category}")
    else:
        configs = await config_repo.get_all_active()
    
    return ResponseModel(
        success=True,
        data=[c.to_dict() for c in configs]
    )


@router.get("/config/{key}", response_model=ResponseModel[ConfigResponse])
async def get_config(
    key: str,
    current_user: CurrentAdmin,
    db: AsyncSession = Depends(get_db),
):
    """
    Get configuration by key (admin only).
    """
    config_repo = ConfigRepository(db)
    config = await config_repo.get_by_key(key)
    
    if not config:
        raise NotFoundException("Configuration", key)
    
    return ResponseModel(
        success=True,
        data=ConfigResponse.model_validate(config.to_dict(include_sensitive=True))
    )


@router.post("/config", response_model=ResponseModel[ConfigResponse])
async def create_config(
    config_data: ConfigCreate,
    current_user: CurrentAdmin,
    db: AsyncSession = Depends(get_db),
    cache: RedisCache = Depends(get_redis),
):
    """
    Create a new configuration (admin only).
    """
    config_repo = ConfigRepository(db)
    
    # Check if key exists
    if await config_repo.key_exists(config_data.key):
        raise ValidationException(f"Configuration key '{config_data.key}' already exists")
    
    config = await config_repo.create(
        key=config_data.key,
        value=config_data.value,
        category=ConfigCategory(config_data.category),
        description=config_data.description,
        display_name=config_data.display_name,
        is_sensitive=config_data.is_sensitive,
        value_type=config_data.value_type,
        fallback_value=config_data.fallback_value,
        updated_by=current_user.id,
    )
    await db.commit()
    
    logger.info(f"Config '{config_data.key}' created by {current_user.email}")
    
    return ResponseModel(
        success=True,
        message="Configuration created successfully",
        data=ConfigResponse.model_validate(config.to_dict(include_sensitive=True))
    )


@router.put("/config/{key}", response_model=ResponseModel[ConfigResponse])
async def update_config(
    key: str,
    update_data: ConfigUpdate,
    current_user: CurrentAdmin,
    db: AsyncSession = Depends(get_db),
    cache: RedisCache = Depends(get_redis),
):
    """
    Update a configuration (admin only).
    """
    config_repo = ConfigRepository(db)
    config = await config_repo.get_by_key(key)
    
    if not config:
        raise NotFoundException("Configuration", key)
    
    # Update fields
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict["updated_by"] = current_user.id
    
    updated_config = await config_repo.update(config.id, update_dict)
    await db.commit()
    
    # Invalidate cache
    await cache.delete(f"config:{key}")
    
    logger.info(f"Config '{key}' updated by {current_user.email}")
    
    return ResponseModel(
        success=True,
        message="Configuration updated successfully",
        data=ConfigResponse.model_validate(updated_config.to_dict(include_sensitive=True))
    )


@router.delete("/config/{key}", response_model=ResponseModel)
async def delete_config(
    key: str,
    current_user: CurrentAdmin,
    db: AsyncSession = Depends(get_db),
    cache: RedisCache = Depends(get_redis),
):
    """
    Delete a configuration (admin only).
    """
    config_repo = ConfigRepository(db)
    config = await config_repo.get_by_key(key)
    
    if not config:
        raise NotFoundException("Configuration", key)
    
    await config_repo.delete(config.id)
    await db.commit()
    
    # Invalidate cache
    await cache.delete(f"config:{key}")
    
    logger.info(f"Config '{key}' deleted by {current_user.email}")
    
    return ResponseModel(
        success=True,
        message="Configuration deleted successfully"
    )


# ═══════════════════════════════════════════════════════════════════
# Instrument Endpoints
# ═══════════════════════════════════════════════════════════════════

@router.get("/instruments", response_model=ResponseModel)
async def list_instruments(
    current_user: CurrentAdmin,
    active_only: bool = Query(default=True),
    db: AsyncSession = Depends(get_db),
):
    """
    List all trading instruments (admin only).
    """
    instrument_repo = InstrumentRepository(db)
    
    if active_only:
        instruments = await instrument_repo.get_active()
    else:
        instruments = await instrument_repo.get_all()
    
    return ResponseModel(
        success=True,
        data=[i.to_dict() for i in instruments]
    )


@router.post("/instruments", response_model=ResponseModel[InstrumentResponse])
async def create_instrument(
    instrument_data: InstrumentCreate,
    current_user: CurrentAdmin,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new trading instrument (admin only).
    """
    instrument_repo = InstrumentRepository(db)
    
    # Check if symbol exists
    if await instrument_repo.symbol_exists(instrument_data.symbol):
        raise ValidationException(f"Instrument '{instrument_data.symbol}' already exists")
    
    instrument = await instrument_repo.create(**instrument_data.model_dump())
    await db.commit()
    
    logger.info(f"Instrument '{instrument_data.symbol}' created by {current_user.email}")
    
    return ResponseModel(
        success=True,
        message="Instrument created successfully",
        data=InstrumentResponse.model_validate(instrument.to_dict())
    )


@router.put("/instruments/{instrument_id}", response_model=ResponseModel[InstrumentResponse])
async def update_instrument(
    instrument_id: UUID,
    update_data: InstrumentUpdate,
    current_user: CurrentAdmin,
    db: AsyncSession = Depends(get_db),
):
    """
    Update a trading instrument (admin only).
    """
    instrument_repo = InstrumentRepository(db)
    instrument = await instrument_repo.get_by_id(instrument_id)
    
    if not instrument:
        raise NotFoundException("Instrument", instrument_id)
    
    updated = await instrument_repo.update(
        instrument_id,
        update_data.model_dump(exclude_unset=True)
    )
    await db.commit()
    
    logger.info(f"Instrument '{instrument.symbol}' updated by {current_user.email}")
    
    return ResponseModel(
        success=True,
        message="Instrument updated successfully",
        data=InstrumentResponse.model_validate(updated.to_dict())
    )


# ═══════════════════════════════════════════════════════════════════
# Cache Management Endpoints
# ═══════════════════════════════════════════════════════════════════

@router.post("/cache/clear", response_model=CacheClearResponse)
async def clear_cache(
    request: CacheClearRequest,
    current_user: CurrentAdmin,
    cache: RedisCache = Depends(get_redis),
):
    """
    Clear cache entries (admin only).
    """
    keys_cleared = 0
    
    if request.clear_all:
        await cache.clear_all()
        keys_cleared = -1  # Indicates all cleared
        message = "All cache cleared"
    elif request.pattern:
        keys_cleared = await cache.delete_pattern(request.pattern)
        message = f"Cleared {keys_cleared} keys matching pattern '{request.pattern}'"
    else:
        message = "No pattern specified"
    
    logger.info(f"Cache cleared by {current_user.email}: {message}")
    
    return CacheClearResponse(
        success=True,
        keys_cleared=keys_cleared,
        message=message
    )
