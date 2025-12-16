# CDN Configuration Guide

## Overview
Configure CDN (CloudFlare, AWS CloudFront, or similar) to accelerate static assets and cache API responses.

## Static Assets Configuration

### CloudFlare Page Rules

```yaml
# Cache static assets aggressively
URL Pattern: stockify.com/assets/*
Settings:
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month
  Browser Cache TTL: 1 week

# Cache SW and manifest
URL Pattern: stockify.com/*.js
Settings:
  Cache Level: Cache Everything
  Edge Cache TTL: 1 day

URL Pattern: stockify.com/manifest.json
Settings:
  Cache Level: Cache Everything
  Edge Cache TTL: 1 week
```

### Response Headers (Already Implemented)
The `CacheHeadersMiddleware` in `app/core/cache_headers.py` sets:
- `/api/v1/options/expiries/*`: 5 min cache
- `/api/v1/analytics/*`: 1 min cache
- Static paths: 1 day cache

## API Caching Strategy

### Cacheable Endpoints
| Endpoint | Cache TTL | Notes |
|----------|-----------|-------|
| `/api/v1/options/expiries/{symbol}` | 5 min | Expiry dates change daily |
| `/api/v1/analytics/aggregate/*` | 1 min | Market hours only |
| `/api/v1/charts/profiles` | 30 sec | Profile definitions |

### Non-Cacheable
- `/api/v1/options/chain/*` (real-time data)
- `/api/v1/auth/*` (authentication)
- WebSocket endpoints

## CloudFlare Configuration

```toml
# wrangler.toml (if using Workers)
name = "stockify-cdn"
type = "webpack"

[env.production]
routes = ["stockify.com/*"]

[[kv_namespaces]]
binding = "CACHE"
id = "xxx"
```

## Nginx CDN Caching (Alternative)

```nginx
# Add to nginx.conf

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

# Cache API responses (read-only endpoints)
location /api/v1/analytics/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 60s;
    proxy_cache_use_stale error timeout http_500 http_502 http_503;
    add_header X-Cache-Status $upstream_cache_status;
}
```

## Verification

After CDN setup, verify with:
```bash
# Check cache headers
curl -I https://stockify.com/assets/main.js

# Expected:
# Cache-Control: public, max-age=2592000
# CF-Cache-Status: HIT (if CloudFlare)
```

## Environment Variables

```bash
# .env
CDN_ENABLED=true
CDN_BASE_URL=https://cdn.stockify.com
```
