---
sidebar_position: 4
title: City Search
slug: /api-reference/city-search
---

# POST /api/city

Find postal codes for a given city name. For US queries, a state is required. For other countries, state/region filtering is optional.

## Request

```
POST https://postaldatapi.com/api/city
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `city` | `string` | Yes | City name to search for |
| `state` | `string` | US only | Full state name (e.g., `"California"`) |
| `ST` | `string` | US only | Two-letter state abbreviation (e.g., `"CA"`) |
| `apiKey` | `string` | Yes | Your API key |
| `country` | `string` | No | ISO 3166-1 alpha-2 country code (default: `"US"`) |

:::note
For US queries, either `state` or `ST` must be provided. For non-US queries, both are optional.
:::

## Response

### Success (200)

```json
{
  "zipcodes": ["90209", "90210", "90211", "90212", "90213"],
  "performance": { "totalTime": "3ms" },
  "balance": 4.99
}
```

### Fuzzy match (200)

If no exact match is found but a close match exists, the response includes the matched city/state:

```json
{
  "zipcodes": ["90209", "90210", "90211"],
  "matchedCity": "Beverly Hills",
  "matchedState": "California",
  "matchedST": "CA",
  "performance": { "totalTime": "4ms" },
  "balance": 4.99
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `zipcodes` | `string[]` | List of postal codes matching the city |
| `matchedCity` | `string` | (optional) Actual city name if fuzzy-matched |
| `matchedState` | `string` | (optional) Actual state name if fuzzy-matched |
| `matchedST` | `string` | (optional) State abbreviation if fuzzy-matched |
| `performance` | `object` | Timing breakdown |
| `balance` | `number` | Account balance after this query (USD) |

## Examples

```bash
# US city search (state required)
curl -X POST https://postaldatapi.com/api/city \
  -H "Content-Type: application/json" \
  -d '{"city": "Beverly Hills", "ST": "CA", "apiKey": "YOUR_API_KEY"}'

# German city search (no state required)
curl -X POST https://postaldatapi.com/api/city \
  -H "Content-Type: application/json" \
  -d '{"city": "Berlin", "country": "DE", "apiKey": "YOUR_API_KEY"}'
```

## Errors

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `Missing required field: city` | No `city` in request body |
| `400` | `Missing 'state' or 'ST' in request body` | US query without state |
| `401` | `Invalid API key` | API key does not exist or was revoked |
| `402` | `Insufficient balance` | Account balance is zero |
| `404` | `No ZIP codes found for the given city/state` | No matching postal codes |
| `429` | `Rate limit exceeded` | Too many requests |

## SDK Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="python" label="Python">

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")

# US city search
result = client.search_city("Beverly Hills", state="CA")
print(result.postal_codes)  # ['90209', '90210', '90211', ...]

# German city search
de = client.search_city("Berlin", country="DE")
print(len(de.postal_codes))  # many Berlin postal codes
```

</TabItem>
<TabItem value="node" label="Node.js">

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

// US city search
const result = await client.searchCity("Beverly Hills", { state: "CA" });
console.log(result.postalCodes);  // ['90209', '90210', '90211', ...]

// German city search
const de = await client.searchCity("Berlin", { country: "DE" });
console.log(de.postalCodes.length);  // many Berlin postal codes
```

</TabItem>
</Tabs>
