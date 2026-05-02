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

### Non-US Example — Mexico (200, the "rich" 18-field example)

The richest non-US records currently return up to 18 fields per postal code. Mexico is one such case:

```json
{
  "meta": {
    "postalCode": "06000",
    "country": "MX",
    "placeName": "Centro (Área 1)",
    "latitude": 19.4364,
    "longitude": -99.1553,
    "adminLevel1": "Ciudad de México",
    "adminLevel2": "Cuauhtémoc",
    "timezone": "America/Mexico_City",
    "admin_name1": "Distrito Federal",
    "admin_code1": "09",
    "admin_name2": "Cuauhtémoc",
    "admin_code2": "015",
    "admin_name3": "Ciudad de México",
    "admin_code3": "06",
    "elevation": 2239,
    "state": "Ciudad de México",
    "municipality": "Cuauhtémoc",
    "city": "Ciudad de México"
  },
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

### Non-US Example — Germany (200, a more typical 12-field example)

```json
{
  "meta": {
    "postalCode": "10115",
    "country": "DE",
    "placeName": "Berlin",
    "latitude": 52.5323,
    "longitude": 13.3846,
    "timezone": "Europe/Berlin",
    "admin_name1": "Berlin",
    "admin_code1": "BE",
    "admin_code2": "00",
    "admin_name3": "Berlin, Stadt",
    "admin_code3": "11000",
    "elevation": 34
  },
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

### Non-US Example — Japan (200)

```json
{
  "meta": {
    "postalCode": "1000001",
    "country": "JP",
    "placeName": "Chiyoda",
    "latitude": 35.6841,
    "longitude": 139.7521,
    "timezone": "Asia/Tokyo",
    "admin_name1": "Tokyo To",
    "admin_code1": "40",
    "admin_name2": "Chiyoda Ku",
    "admin_code2": "1864529",
    "elevation": 32
  },
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

:::tip
**Field count varies by country.** Mexico and a handful of other rich-schema countries currently return up to 18 fields per postal code. Most countries return 10-13. PostalDataPI returns *every populated field for that record* — missing fields are simply omitted, not nulled.
:::

### Response Fields

The `meta` object contains all available fields for the postal code. Available fields vary by country and by data source — not every country returns every field.

**Common to most countries:**

| Field | Type | Description |
|-------|------|-------------|
| `postalCode` (non-US) or `zipcode` (US) | `string` | The postal code |
| `placeName` (non-US) or `city` (US) | `string` | City or place name |
| `latitude` | `number` | Latitude coordinate |
| `longitude` | `number` | Longitude coordinate |
| `timezone` | `string` | IANA timezone identifier (e.g. `"America/Los_Angeles"`) — returned where the data source provides it |
| `elevation` | `number` | Elevation in meters above sea level — returned where the data source provides it |

**US-specific fields:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | `string` | Full state name |
| `stateAbbrev` | `string` | Two-letter state abbreviation |
| `county` | `string` | County name |

**Non-US administrative region fields:**

Non-US records use a multi-level snake_case admin schema. Each country populates the levels it has data for; missing levels are simply omitted from the response.

| Field | Type | Description |
|-------|------|-------------|
| `country` | `string` | ISO 3166-1 alpha-2 country code |
| `admin_name1` | `string` | Top-level administrative region (state, prefecture, region, etc.) |
| `admin_code1` | `string` | Code for level-1 administrative region |
| `admin_name2` | `string` | Second-level administrative region (county, district, ward, etc.) |
| `admin_code2` | `string` | Code for level-2 administrative region |
| `admin_name3` | `string` | Third-level administrative region (municipality, sub-district, etc.) |
| `admin_code3` | `string` | Code for level-3 administrative region |

**Non-US fields available for some rich-schema countries (e.g. Mexico):**

Some countries — Mexico, Brazil, and a handful of others — have richer source data and return additional fields alongside the snake_case schema above:

| Field | Type | Description |
|-------|------|-------------|
| `adminLevel1` | `string` | Camel-case alias for the top-level region (canonical name; differs from `admin_name1` for some sources) |
| `adminLevel2` | `string` | Camel-case alias for the second-level region |
| `state` | `string` | State name (when distinct from `admin_name1`) |
| `municipality` | `string` | Municipality name |
| `city` | `string` | City name (when distinct from `placeName`) |

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
