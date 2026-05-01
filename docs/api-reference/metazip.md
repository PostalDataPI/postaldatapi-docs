---
sidebar_position: 5
title: Metazip
slug: /api-reference/metazip
---

# POST /api/metazip

Returns all available metadata for a postal code, including coordinates, county (US), timezone (US), and any additional data source fields.

## Request

```
POST https://postaldatapi.com/api/metazip
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zipcode` | `string` or `number` | Yes | The postal code to look up |
| `apiKey` | `string` | Yes | Your API key |
| `country` | `string` | No | ISO 3166-1 alpha-2 country code (default: `"US"`) |

## Response

### US Example (200)

```json
{
  "meta": {
    "zipcode": "90210",
    "city": "Beverly Hills",
    "state": "California",
    "stateAbbrev": "CA",
    "county": "Los Angeles County",
    "latitude": 34.1031,
    "longitude": -118.4163,
    "timezone": "America/Los_Angeles"
  },
  "performance": { "totalTime": "2ms" },
  "balance": 4.99
}
```

### Non-US Example (200)

```json
{
  "meta": {
    "postalCode": "10115",
    "country": "DE",
    "placeName": "Berlin",
    "latitude": 52.532,
    "longitude": 13.3879,
    "adminLevel1": "Berlin",
    "adminLevel1Code": "BE"
  },
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

### Response Fields

The `meta` object contains all available fields for the postal code. Available fields vary by country:

**All countries:**

| Field | Type | Description |
|-------|------|-------------|
| `postalCode` or `zipcode` | `string` | The postal code |
| `placeName` or `city` | `string` | City or place name |
| `latitude` | `number` | Latitude coordinate |
| `longitude` | `number` | Longitude coordinate |

**US-specific fields:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | `string` | Full state name |
| `stateAbbrev` | `string` | Two-letter state abbreviation |
| `county` | `string` | County name |
| `timezone` | `string` | IANA timezone identifier |

**Non-US fields:**

| Field | Type | Description |
|-------|------|-------------|
| `country` | `string` | ISO 3166-1 alpha-2 country code |
| `adminLevel1` | `string` | Top-level administrative region (state, province, etc.) |
| `adminLevel1Code` | `string` | Abbreviated code for the administrative region |
| `adminLevel2` | `string` | Second-level administrative region (if available) |

:::tip
The metazip endpoint returns every field available in the data source. As PostalDataPI adds more data sources, additional fields may appear without a breaking API change.
:::

## Examples

```bash
# US ZIP with rich metadata
curl -X POST https://postaldatapi.com/api/metazip \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "90210", "apiKey": "YOUR_API_KEY"}'

# Japanese postal code
curl -X POST https://postaldatapi.com/api/metazip \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "1000001", "country": "JP", "apiKey": "YOUR_API_KEY"}'
```

## Errors

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `Missing required field: zipcode` | No `zipcode` in request body |
| `401` | `Invalid API key` | API key does not exist or was revoked |
| `402` | `Insufficient balance` | Account balance is zero |
| `404` | `ZIP code not found` | Postal code does not exist in the specified country |
| `429` | `Rate limit exceeded` | Too many requests |

## SDK Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="python" label="Python">

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")

result = client.metazip("90210")
print(result.city)            # Beverly Hills
print(result.latitude)        # 34.1031
print(result.longitude)       # -118.4163
print(result.meta["county"])  # Los Angeles County
print(result.meta["timezone"])  # America/Los_Angeles
```

</TabItem>
<TabItem value="node" label="Node.js">

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

const result = await client.metazip("90210");
console.log(result.city);            // Beverly Hills
console.log(result.latitude);        // 34.1031
console.log(result.longitude);       // -118.4163
console.log(result.meta.county);     // Los Angeles County
console.log(result.meta.timezone);   // America/Los_Angeles
```

</TabItem>
</Tabs>
