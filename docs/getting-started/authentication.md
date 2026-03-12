---
sidebar_position: 2
title: Authentication
slug: /getting-started/authentication
---

# Authentication

Every PostalDataPI request requires a valid API key.

## Getting an API Key

1. Sign in at [postaldatapi.com](https://postaldatapi.com) with Google, GitHub, or Microsoft
2. Navigate to **API Keys** in your dashboard
3. Click **Create New Key**
4. Copy the key immediately -- it is only shown once

## Using Your API Key

Include `apiKey` in the JSON body of every request:

```bash
curl -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "90210", "apiKey": "YOUR_API_KEY"}'
```

## Multiple API Keys

Each account can have multiple API keys. This is useful for:

- Separating production and development traffic
- Revoking a compromised key without downtime
- Tracking usage per application

Manage keys from the **API Keys** section of your dashboard.

## Key Security

- Never commit API keys to version control
- Use environment variables to store keys:
  ```bash
  export POSTALDATAPI_API_KEY="your-key-here"
  ```
- Rotate keys periodically via the dashboard
- Revoke any key that may have been exposed

## Pricing and Balance

- New accounts receive **1,000 free queries** (no credit card required)
- After that, queries cost **$0.000028 each** (flat rate, no tiers)
- Minimum recharge: **$5.00** (you get the full $5.00 as credit)
- Every API response includes your current `balance` so you can monitor usage programmatically

## Rate Limiting

Rate limits are optional and disabled by default. If you enable them in your dashboard, every response includes a `rateLimit` object showing current usage against your limits.

When a rate limit is exceeded, the API returns HTTP `429` with a `retryAfter` value indicating how long to wait (in seconds).

## Authentication Errors

| Status | Error | Meaning |
|--------|-------|---------|
| `400` | `Missing required field: apiKey` | No `apiKey` in the request body |
| `401` | `Invalid API key` | The key does not exist or has been revoked |
| `402` | `Insufficient balance` | Account balance is zero -- add funds to continue |
