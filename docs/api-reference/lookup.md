---
sidebar_position: 1
title: Lookup
slug: /api-reference/lookup
---

# POST /api/lookup

Look up city and state/region for a postal code.

## Request

```
POST https://postaldatapi.com/api/lookup
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zipcode` | `string` or `number` | Yes | The postal code to look up |
| `apiKey` | `string` | Yes | Your API key |
| `country` | `string` | No | ISO 3166-1 alpha-2 country code (default: `"US"`) |

## Response

### Success (200)

```json
{
  "city": "Beverly Hills",
  "state": "California",
  "ST": "CA",
  "performance": {
    "authTime": "0ms",
    "rateLimitCheckTime": "0ms",
    "balanceTime": "0ms",
    "processingTime": "0ms",
    "totalTime": "2ms"
  },
  "rateLimit": {
    "enabled": false,
    "perMinute": { "limit": null, "current": null, "approachingLimit": false },
    "perHour": { "limit": null, "current": null, "approachingLimit": false },
    "perDay": { "limit": null, "current": null, "approachingLimit": false }
  },
  "balance": 4.99
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `city` | `string` | City or place name |
| `state` | `string` | Full state/region name |
| `ST` | `string` | State/region abbreviation |
| `performance` | `object` | Timing breakdown for the request |
| `rateLimit` | `object` | Current rate limit status |
| `balance` | `number` | Account balance after this query (USD) |

### Non-US Example

```bash
curl -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "10115", "country": "DE", "apiKey": "YOUR_API_KEY"}'
```

```json
{
  "city": "Berlin",
  "state": "Berlin",
  "ST": "BE",
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

## Errors

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `Missing required field: zipcode` | No `zipcode` in request body |
| `400` | `Missing required field: apiKey` | No `apiKey` in request body |
| `400` | `Invalid 'country'` | Country code is not a valid 2-letter ISO code |
| `401` | `Invalid API key` | API key does not exist or was revoked |
| `402` | `Insufficient balance` | Account balance is zero |
| `404` | `ZIP code not found` | Postal code does not exist in the specified country |
| `429` | `Rate limit exceeded` | Too many requests (if rate limits are enabled) |

## SDK Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="python" label="Python">

```python
from postaldatapi import PostalDataPI, NotFoundError

client = PostalDataPI(api_key="YOUR_API_KEY")

# US lookup
result = client.lookup("90210")
print(f"{result.city}, {result.state_abbreviation}")  # Beverly Hills, CA

# German lookup
de = client.lookup("10115", country="DE")
print(de.city)  # Berlin

# Handle not found
try:
    client.lookup("00000")
except NotFoundError:
    print("Postal code not found")
```

</TabItem>
<TabItem value="node" label="Node.js">

```typescript
import { PostalDataPI, NotFoundError } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

// US lookup
const result = await client.lookup("90210");
console.log(`${result.city}, ${result.stateAbbreviation}`);  // Beverly Hills, CA

// German lookup
const de = await client.lookup("10115", { country: "DE" });
console.log(de.city);  // Berlin

// Handle not found
try {
  await client.lookup("00000");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log("Postal code not found");
  }
}
```

</TabItem>
</Tabs>
