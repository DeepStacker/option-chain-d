"""
Prometheus Alerting Rules Configuration

Defines alerting rules for critical system metrics.
Export these rules to a .yml file for Prometheus Alertmanager.
"""
import yaml
from typing import List, Dict, Any

ALERTING_RULES = {
    "groups": [
        {
            "name": "stockify-critical",
            "rules": [
                # High latency alerts
                {
                    "alert": "HighRequestLatency",
                    "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint)) > 0.2",
                    "for": "5m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "High request latency on {{ $labels.endpoint }}",
                        "description": "P99 latency is above 200ms for 5 minutes"
                    }
                },
                {
                    "alert": "CriticalRequestLatency",
                    "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint)) > 0.5",
                    "for": "2m",
                    "labels": {"severity": "critical"},
                    "annotations": {
                        "summary": "Critical request latency on {{ $labels.endpoint }}",
                        "description": "P99 latency is above 500ms for 2 minutes"
                    }
                },
                
                # Error rate alerts
                {
                    "alert": "HighErrorRate",
                    "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) > 0.01",
                    "for": "5m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "High error rate detected",
                        "description": "Error rate is above 1% for 5 minutes"
                    }
                },
                {
                    "alert": "CriticalErrorRate",
                    "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) > 0.05",
                    "for": "2m",
                    "labels": {"severity": "critical"},
                    "annotations": {
                        "summary": "Critical error rate detected",
                        "description": "Error rate is above 5% for 2 minutes"
                    }
                },
                
                # WebSocket alerts
                {
                    "alert": "HighWebSocketConnections",
                    "expr": "websocket_connections_active > 10000",
                    "for": "5m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "High WebSocket connection count",
                        "description": "Active WebSocket connections exceed 10,000"
                    }
                },
                
                # Database alerts
                {
                    "alert": "DatabaseConnectionPoolExhausted",
                    "expr": "db_pool_available < 5",
                    "for": "2m",
                    "labels": {"severity": "critical"},
                    "annotations": {
                        "summary": "Database connection pool nearly exhausted",
                        "description": "Less than 5 connections available in pool"
                    }
                },
                
                # Redis alerts
                {
                    "alert": "RedisHighMemoryUsage",
                    "expr": "redis_memory_used_bytes / redis_memory_max_bytes > 0.8",
                    "for": "5m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "Redis memory usage high",
                        "description": "Redis is using more than 80% of available memory"
                    }
                },
                {
                    "alert": "RedisDown",
                    "expr": "up{job=\"redis\"} == 0",
                    "for": "1m",
                    "labels": {"severity": "critical"},
                    "annotations": {
                        "summary": "Redis is down",
                        "description": "Redis server is not responding"
                    }
                },
                
                # External API alerts
                {
                    "alert": "DhanAPIHighLatency",
                    "expr": "histogram_quantile(0.95, rate(external_api_duration_seconds_bucket{api=\"dhan\"}[5m])) > 1",
                    "for": "5m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "Dhan API high latency",
                        "description": "P95 latency for Dhan API is above 1 second"
                    }
                },
                {
                    "alert": "DhanAPIErrors",
                    "expr": "rate(external_api_errors_total{api=\"dhan\"}[5m]) > 0.1",
                    "for": "5m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "Dhan API errors detected",
                        "description": "Error rate for Dhan API is elevated"
                    }
                },
                
                # Circuit breaker alerts
                {
                    "alert": "CircuitBreakerOpen",
                    "expr": "circuit_breaker_state == 1",  # 1 = OPEN
                    "for": "0m",
                    "labels": {"severity": "critical"},
                    "annotations": {
                        "summary": "Circuit breaker is OPEN",
                        "description": "Circuit breaker for {{ $labels.name }} is in OPEN state"
                    }
                },
                
                # System alerts
                {
                    "alert": "HighCPUUsage",
                    "expr": "process_cpu_seconds_total > 0.8",
                    "for": "10m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "High CPU usage",
                        "description": "Process CPU usage is above 80%"
                    }
                },
                {
                    "alert": "HighMemoryUsage",
                    "expr": "process_resident_memory_bytes / (1024*1024*1024) > 2",
                    "for": "10m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "High memory usage",
                        "description": "Process is using more than 2GB of memory"
                    }
                }
            ]
        },
        {
            "name": "stockify-business",
            "rules": [
                # Business metrics
                {
                    "alert": "NoActiveSubscriptions",
                    "expr": "sum(websocket_subscriptions_active) == 0",
                    "for": "10m",
                    "labels": {"severity": "info"},
                    "annotations": {
                        "summary": "No active subscriptions",
                        "description": "No users are subscribed to any symbols"
                    }
                },
                {
                    "alert": "LowCacheHitRate",
                    "expr": "rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m])) < 0.7",
                    "for": "15m",
                    "labels": {"severity": "warning"},
                    "annotations": {
                        "summary": "Low cache hit rate",
                        "description": "Cache hit rate is below 70%"
                    }
                }
            ]
        }
    ]
}


def get_alerting_rules() -> Dict[str, Any]:
    """Get alerting rules configuration."""
    return ALERTING_RULES


def export_alerting_rules_yaml() -> str:
    """Export alerting rules as YAML string."""
    return yaml.dump(ALERTING_RULES, default_flow_style=False)


def save_alerting_rules(filepath: str = "alerting_rules.yml"):
    """Save alerting rules to file."""
    with open(filepath, 'w') as f:
        yaml.dump(ALERTING_RULES, f, default_flow_style=False)
