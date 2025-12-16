"""
Business Metrics Collection

Collects and exposes business-level metrics for monitoring and analytics.
Integrates with Prometheus for dashboarding and alerting.
"""
import logging
import time
from typing import Dict, Any, Optional
from functools import wraps
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

# Try to import Prometheus client, fallback to no-op if not available
try:
    from prometheus_client import Counter, Histogram, Gauge, Info
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False
    Counter = Histogram = Gauge = Info = None


class MetricType(Enum):
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"


# ═══════════════════════════════════════════════════════════════════
# Business Metrics Definitions
# ═══════════════════════════════════════════════════════════════════

if PROMETHEUS_AVAILABLE:
    # User metrics
    USERS_ACTIVE = Gauge(
        'stockify_users_active_total',
        'Number of active users',
        ['tier']  # free, premium, pro
    )
    
    USER_LOGINS = Counter(
        'stockify_user_logins_total',
        'Total user login count',
        ['method', 'success']  # method: password, google, firebase
    )
    
    USER_REGISTRATIONS = Counter(
        'stockify_user_registrations_total',
        'Total user registration count',
        ['source']  # web, mobile, api
    )
    
    # Subscription metrics
    SYMBOL_SUBSCRIPTIONS = Gauge(
        'stockify_subscriptions_active',
        'Active WebSocket subscriptions by symbol',
        ['symbol', 'expiry']
    )
    
    SUBSCRIPTION_DURATION = Histogram(
        'stockify_subscription_duration_seconds',
        'Duration of WebSocket subscriptions',
        ['symbol'],
        buckets=[60, 300, 600, 1800, 3600, 7200]  # 1m, 5m, 10m, 30m, 1h, 2h
    )
    
    # Data fetch metrics
    OPTION_CHAIN_FETCHES = Counter(
        'stockify_option_chain_fetches_total',
        'Total option chain data fetches',
        ['symbol', 'source']  # source: cache, api
    )
    
    DATA_FRESHNESS = Gauge(
        'stockify_data_freshness_seconds',
        'Age of cached data in seconds',
        ['symbol', 'data_type']
    )
    
    # API usage metrics
    API_CALLS_BY_ENDPOINT = Counter(
        'stockify_api_calls_total',
        'API calls by endpoint',
        ['endpoint', 'method', 'status']
    )
    
    API_QUOTA_USAGE = Gauge(
        'stockify_api_quota_usage',
        'API quota usage percentage',
        ['api']  # dhan, firebase, etc.
    )
    
    # Trading signals metrics
    SIGNALS_GENERATED = Counter(
        'stockify_signals_generated_total',
        'Trading signals generated',
        ['signal_type', 'symbol']  # signal_type: bullish, bearish, neutral
    )
    
    # Calculator usage
    CALCULATOR_USAGE = Counter(
        'stockify_calculator_usage_total',
        'Calculator usage count',
        ['calculator_type']  # greeks, position_sizing, tca
    )
    
    # Real-time data metrics
    WEBSOCKET_MESSAGES_SENT = Counter(
        'stockify_ws_messages_sent_total',
        'WebSocket messages sent',
        ['message_type', 'priority']
    )
    
    WEBSOCKET_MESSAGE_LATENCY = Histogram(
        'stockify_ws_message_latency_ms',
        'WebSocket message delivery latency in ms',
        ['symbol'],
        buckets=[1, 5, 10, 25, 50, 100, 250, 500, 1000]
    )


# ═══════════════════════════════════════════════════════════════════
# Metric Collection Functions
# ═══════════════════════════════════════════════════════════════════

class BusinessMetrics:
    """
    Singleton for collecting business metrics.
    
    Usage:
        metrics = BusinessMetrics()
        metrics.record_login("password", success=True)
        metrics.record_subscription("NIFTY", "2024-12-26")
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self._subscription_start_times: Dict[str, float] = {}
    
    def record_login(self, method: str, success: bool = True):
        """Record a user login attempt."""
        if not PROMETHEUS_AVAILABLE:
            return
        USER_LOGINS.labels(method=method, success=str(success).lower()).inc()
    
    def record_registration(self, source: str = "web"):
        """Record a new user registration."""
        if not PROMETHEUS_AVAILABLE:
            return
        USER_REGISTRATIONS.labels(source=source).inc()
    
    def set_active_users(self, tier: str, count: int):
        """Update active user count by tier."""
        if not PROMETHEUS_AVAILABLE:
            return
        USERS_ACTIVE.labels(tier=tier).set(count)
    
    def record_subscription_start(self, symbol: str, expiry: str, client_id: str):
        """Record when a client subscribes to a symbol."""
        if not PROMETHEUS_AVAILABLE:
            return
        key = f"{client_id}:{symbol}:{expiry}"
        self._subscription_start_times[key] = time.time()
        SYMBOL_SUBSCRIPTIONS.labels(symbol=symbol, expiry=expiry).inc()
    
    def record_subscription_end(self, symbol: str, expiry: str, client_id: str):
        """Record when a client unsubscribes from a symbol."""
        if not PROMETHEUS_AVAILABLE:
            return
        key = f"{client_id}:{symbol}:{expiry}"
        start_time = self._subscription_start_times.pop(key, None)
        
        SYMBOL_SUBSCRIPTIONS.labels(symbol=symbol, expiry=expiry).dec()
        
        if start_time:
            duration = time.time() - start_time
            SUBSCRIPTION_DURATION.labels(symbol=symbol).observe(duration)
    
    def record_option_chain_fetch(self, symbol: str, from_cache: bool = False):
        """Record an option chain data fetch."""
        if not PROMETHEUS_AVAILABLE:
            return
        source = "cache" if from_cache else "api"
        OPTION_CHAIN_FETCHES.labels(symbol=symbol, source=source).inc()
    
    def set_data_freshness(self, symbol: str, data_type: str, age_seconds: float):
        """Set the freshness of cached data."""
        if not PROMETHEUS_AVAILABLE:
            return
        DATA_FRESHNESS.labels(symbol=symbol, data_type=data_type).set(age_seconds)
    
    def record_api_call(self, endpoint: str, method: str, status: int):
        """Record an API call."""
        if not PROMETHEUS_AVAILABLE:
            return
        API_CALLS_BY_ENDPOINT.labels(
            endpoint=endpoint, method=method, status=str(status)
        ).inc()
    
    def set_api_quota_usage(self, api: str, percentage: float):
        """Set API quota usage percentage."""
        if not PROMETHEUS_AVAILABLE:
            return
        API_QUOTA_USAGE.labels(api=api).set(percentage)
    
    def record_signal(self, signal_type: str, symbol: str):
        """Record a trading signal generated."""
        if not PROMETHEUS_AVAILABLE:
            return
        SIGNALS_GENERATED.labels(signal_type=signal_type, symbol=symbol).inc()
    
    def record_calculator_usage(self, calculator_type: str):
        """Record calculator usage."""
        if not PROMETHEUS_AVAILABLE:
            return
        CALCULATOR_USAGE.labels(calculator_type=calculator_type).inc()
    
    def record_ws_message(self, message_type: str, priority: str):
        """Record WebSocket message sent."""
        if not PROMETHEUS_AVAILABLE:
            return
        WEBSOCKET_MESSAGES_SENT.labels(
            message_type=message_type, priority=priority
        ).inc()
    
    def record_ws_latency(self, symbol: str, latency_ms: float):
        """Record WebSocket message latency."""
        if not PROMETHEUS_AVAILABLE:
            return
        WEBSOCKET_MESSAGE_LATENCY.labels(symbol=symbol).observe(latency_ms)


# ═══════════════════════════════════════════════════════════════════
# Decorators for Easy Metric Collection
# ═══════════════════════════════════════════════════════════════════

def track_api_call(endpoint: str):
    """Decorator to track API calls."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            metrics = BusinessMetrics()
            start = time.time()
            try:
                result = await func(*args, **kwargs)
                metrics.record_api_call(endpoint, "GET", 200)
                return result
            except Exception as e:
                metrics.record_api_call(endpoint, "GET", 500)
                raise
        return wrapper
    return decorator


def track_calculator(calculator_type: str):
    """Decorator to track calculator usage."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            metrics = BusinessMetrics()
            metrics.record_calculator_usage(calculator_type)
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# Global instance
metrics = BusinessMetrics()
