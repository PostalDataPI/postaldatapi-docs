---
sidebar_position: 5
title: About API
slug: /api-reference/about
---

# POST /api/aboutapi

Returns information about the PostalDataPI API, including version and coverage details. Useful for health checks and verifying connectivity.

## Request

```
POST https://postaldatapi.com/api/aboutapi
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your API key |

## Response

### Success (200)

```json
{
  "About": "PostalDataPI provides postal code lookup, validation, city search, and metadata endpoints for 70+ countries.",
  "version": "2.0.0",
  "coverage": "70+ countries with sub-10ms response times. US ZIP codes, UK postcodes, German PLZ, and more.",
  "usage": "See docs.postaldatapi.com for authentication, rate limits, and endpoint usage.",
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `About` | `string` | API description |
| `version` | `string` | Current API version |
| `coverage` | `string` | Data coverage description |
| `usage` | `string` | Usage guidelines summary |
| `balance` | `number` | Account balance (USD) |

## Example

```bash
curl -X POST https://postaldatapi.com/api/aboutapi \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "YOUR_API_KEY"}'
```

## Errors

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `Missing or invalid 'apiKey'` | No `apiKey` in request body |
| `401` | `Invalid API key` | API key does not exist or was revoked |
