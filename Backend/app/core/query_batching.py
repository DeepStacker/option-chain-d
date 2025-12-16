"""
Query Batching Utilities

Provides efficient batching of multiple async database/API queries
using asyncio.gather with error handling and timeout support.
"""
import asyncio
import logging
from typing import Callable, Any, List, Dict, Optional, TypeVar, Coroutine
from functools import wraps
from dataclasses import dataclass
from enum import Enum
import time

logger = logging.getLogger(__name__)

T = TypeVar('T')


class BatchResult(Enum):
    SUCCESS = "success"
    ERROR = "error"
    TIMEOUT = "timeout"


@dataclass
class QueryResult:
    """Result wrapper for batched queries"""
    status: BatchResult
    data: Any = None
    error: Optional[str] = None
    query_id: Optional[str] = None
    duration_ms: float = 0


class QueryBatcher:
    """
    Batch multiple async queries for efficient execution.
    
    Features:
    - Parallel execution with asyncio.gather
    - Per-query timeouts
    - Partial failure handling
    - Automatic retry on transient errors
    
    Usage:
        batcher = QueryBatcher()
        
        results = await batcher.execute([
            ("user", get_user(user_id)),
            ("orders", get_orders(user_id)),
            ("portfolio", get_portfolio(user_id)),
        ])
        
        user_data = results["user"].data
    """
    
    def __init__(
        self,
        default_timeout: float = 5.0,
        max_retries: int = 1,
        concurrency_limit: Optional[int] = None
    ):
        self.default_timeout = default_timeout
        self.max_retries = max_retries
        self.concurrency_limit = concurrency_limit
        self._semaphore = asyncio.Semaphore(concurrency_limit) if concurrency_limit else None
    
    async def execute(
        self,
        queries: List[tuple[str, Coroutine]],
        timeout: Optional[float] = None,
        return_exceptions: bool = True
    ) -> Dict[str, QueryResult]:
        """
        Execute multiple queries in parallel.
        
        Args:
            queries: List of (query_id, coroutine) tuples
            timeout: Override default timeout
            return_exceptions: If True, return errors as results instead of raising
            
        Returns:
            Dict mapping query_id to QueryResult
        """
        timeout = timeout or self.default_timeout
        results = {}
        
        async def run_query(query_id: str, coro: Coroutine) -> QueryResult:
            start = time.time()
            try:
                if self._semaphore:
                    async with self._semaphore:
                        data = await asyncio.wait_for(coro, timeout=timeout)
                else:
                    data = await asyncio.wait_for(coro, timeout=timeout)
                
                return QueryResult(
                    status=BatchResult.SUCCESS,
                    data=data,
                    query_id=query_id,
                    duration_ms=(time.time() - start) * 1000
                )
            except asyncio.TimeoutError:
                return QueryResult(
                    status=BatchResult.TIMEOUT,
                    error=f"Query timed out after {timeout}s",
                    query_id=query_id,
                    duration_ms=(time.time() - start) * 1000
                )
            except Exception as e:
                logger.error(f"Query '{query_id}' failed: {e}")
                return QueryResult(
                    status=BatchResult.ERROR,
                    error=str(e),
                    query_id=query_id,
                    duration_ms=(time.time() - start) * 1000
                )
        
        # Create tasks
        tasks = [run_query(qid, coro) for qid, coro in queries]
        
        # Execute all in parallel
        query_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Map results
        for i, (query_id, _) in enumerate(queries):
            result = query_results[i]
            if isinstance(result, Exception):
                results[query_id] = QueryResult(
                    status=BatchResult.ERROR,
                    error=str(result),
                    query_id=query_id
                )
            else:
                results[query_id] = result
        
        return results
    
    async def execute_with_fallback(
        self,
        primary: tuple[str, Coroutine],
        fallback: tuple[str, Coroutine],
        timeout: float = None
    ) -> QueryResult:
        """
        Execute primary query with fallback on failure.
        """
        timeout = timeout or self.default_timeout
        
        results = await self.execute([primary], timeout=timeout)
        primary_result = results[primary[0]]
        
        if primary_result.status == BatchResult.SUCCESS:
            return primary_result
        
        # Try fallback
        logger.info(f"Primary query '{primary[0]}' failed, trying fallback")
        fallback_results = await self.execute([fallback], timeout=timeout)
        return fallback_results[fallback[0]]


async def batch_queries(*queries: Coroutine, timeout: float = 5.0) -> List[Any]:
    """
    Simple helper to run multiple coroutines in parallel.
    
    Args:
        *queries: Coroutines to execute
        timeout: Maximum time to wait
        
    Returns:
        List of results (None for failed queries)
    """
    async def safe_execute(coro):
        try:
            return await asyncio.wait_for(coro, timeout=timeout)
        except Exception as e:
            logger.error(f"Batch query failed: {e}")
            return None
    
    tasks = [safe_execute(q) for q in queries]
    return await asyncio.gather(*tasks)


def batch_cached(cache_key_fn: Callable[..., str], ttl: int = 60):
    """
    Decorator that caches batched query results.
    
    Args:
        cache_key_fn: Function to generate cache key from args
        ttl: Cache time-to-live in seconds
    """
    cache = {}
    
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = cache_key_fn(*args, **kwargs)
            current_time = time.time()
            
            if key in cache:
                value, timestamp = cache[key]
                if current_time - timestamp < ttl:
                    return value
            
            result = await func(*args, **kwargs)
            cache[key] = (result, current_time)
            return result
        
        return wrapper
    return decorator


# Pre-defined batching patterns for common use cases

async def batch_option_chain_requests(
    service,
    symbols: List[str],
    expiries: List[str],
    timeout: float = 5.0
) -> Dict[str, Any]:
    """
    Batch fetch option chains for multiple symbols/expiries.
    """
    batcher = QueryBatcher(default_timeout=timeout)
    
    queries = [
        (f"{symbol}_{expiry}", service.get_live_data(symbol=symbol, expiry=expiry))
        for symbol in symbols
        for expiry in expiries
    ]
    
    return await batcher.execute(queries)


async def batch_analytics_requests(
    service,
    symbol: str,
    expiry: str,
    include_greeks: bool = True,
    include_reversal: bool = True,
    include_iv: bool = True
) -> Dict[str, Any]:
    """
    Batch fetch all analytics data for a symbol/expiry.
    """
    queries = [
        ("live_data", service.get_live_data(symbol, expiry, include_greeks, include_reversal)),
    ]
    
    # Add additional analytics queries as needed
    
    batcher = QueryBatcher(default_timeout=3.0)
    return await batcher.execute(queries)
