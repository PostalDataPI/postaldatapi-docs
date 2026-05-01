---
sidebar_position: 3
title: Bulk Validate
slug: /api-reference/bulk-validate
---

# POST /api/validate-bulk

Validate up to 1,000 postal codes in a single request. Mixed countries supported. Same flat per-record price as [`/api/validate`](./validate) ($0.000028 per record) — **no bulk discount or premium.** Per-record errors are reported in the `results` array, not as request-level failures.

:::tip
*"Validate 1, validate 1,000 — flat rate, every record."* Most postal APIs charge a premium for bulk operations. PostalDataPI charges the same per-record price whether you send one or a thousand.
:::

## Field naming note

The bulk endpoint uses **modern field names** — `postalCode` and `countryCode`. The single-record endpoints (`/api/lookup`, `/api/validate`, `/api/city`, `/api/metazip`) preserve the legacy `zipcode` and `country` naming for backward compatibility.

## Request

```
POST https://postaldatapi.com/api/validate-bulk
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your API key |
| `records` | `array` | Yes | Array of `{postalCode, countryCode}` objects. Max 1,000. Mixed countries supported. |

### Per-record fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postalCode` | `string` | Yes | The postal code to validate |
| `countryCode` | `string` | Yes | ISO 3166-1 alpha-2 country code (e.g., `"US"`, `"GB"`, `"DE"`) |

## Response

### Success (200)

```json
{
  "results": [
    { "postalCode": "90210",    "countryCode": "US", "valid": true,  "normalized": "90210", "reason": null },
    { "postalCode": "SW1A 1AA", "countryCode": "GB", "valid": true,  "normalized": "SW1A",  "reason": null },
    { "postalCode": "FOO99",    "countryCode": "US", "valid": false, "normalized": null,    "reason": "not_found" },
    { "postalCode": "12345",    "countryCode": "ZZ", "valid": false, "normalized": null,    "reason": "unknown_country" }
  ],
  "totalCost": 0.000112,
  "balance": 4.998888,
  "performance": { "totalTime": "8ms" },
  "rateLimit": { "enabled": false }
}
```

### Per-record fields

| Field | Type | Description |
|-------|------|-------------|
| `postalCode` | `string` | Echoed from the input record |
| `countryCode` | `string` | Echoed from the input record (uppercased) |
| `valid` | `boolean` | Whether the postal code exists in the country's dataset |
| `normalized` | `string` or `null` | Canonical key when valid (e.g. `"SW1A"` for GB outcode-only datasets, FSA prefix for CA), `null` when invalid |
| `reason` | `string` or `null` | Why the record is invalid: `null` when valid, otherwise `"not_found"`, `"invalid_format"`, or `"unknown_country"` |

### Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| `results` | `array` | Per-record results, in the same order as the request |
| `totalCost` | `number` | Total cost of this request in USD (N records × per-query rate) |
| `balance` | `number` | Account balance after this request was charged |
| `performance` | `object` | Timing breakdown |
| `rateLimit` | `object` | Current rate limit status |

## Limits

- **Max records per request:** 1,000. Above that, split into multiple calls.
- **Cost:** N × $0.000028 per request. Flat rate; no bulk discount or premium.
- **Rate limits:** N records count as N queries against your per-minute / per-hour / per-day windows. A bulk request of 100 records consumes 100 from your rate-limit budget.
- **Sync only:** the endpoint blocks until all N records are processed (typically &lt; 1 second for 1,000 records). No async / webhook callback in v1.

## cURL Example

```bash
curl -X POST https://postaldatapi.com/api/validate-bulk \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "YOUR_API_KEY",
    "records": [
      {"postalCode": "90210", "countryCode": "US"},
      {"postalCode": "SW1A 1AA", "countryCode": "GB"},
      {"postalCode": "10115", "countryCode": "DE"}
    ]
  }'
```

## Errors

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `Missing required field: apiKey` | No `apiKey` in request body |
| `400` | `Missing required field: records (must be an array)` | `records` missing or not an array |
| `400` | `records array must contain at least 1 record` | Empty array |
| `400` | `records array exceeds maximum of 1000 per request` | More than 1,000 records |
| `400` | `records[N].postalCode must be a non-empty string` | A record has invalid/missing `postalCode` |
| `400` | `records[N].countryCode must be a 2-letter ISO 3166-1 alpha-2 code` | A record has invalid/missing `countryCode` |
| `401` | `Invalid API key` | API key does not exist or was revoked |
| `402` | `Insufficient balance for bulk request` | Balance is less than `N × $0.000028` — entire request rejected, no partial billing |
| `429` | `Rate limit would be exceeded by this bulk request` | Adding N records would exceed your per-minute/hour/day limit |

## SDK Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="python" label="Python">

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")

result = client.validate_bulk([
    {"postal_code": "90210", "country_code": "US"},
    {"postal_code": "SW1A 1AA", "country_code": "GB"},
    {"postal_code": "FOO99", "country_code": "US"},
])

for r in result.results:
    if r.valid:
        print(f"{r.postal_code} ({r.country_code}) -> {r.normalized}")
    else:
        print(f"{r.postal_code} ({r.country_code}) INVALID: {r.reason}")

print(f"Cost: ${result.total_cost:.6f}")
print(f"Balance: ${result.balance:.6f}")
```

</TabItem>
<TabItem value="node" label="Node.js">

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

const result = await client.validateBulk([
  { postalCode: "90210", countryCode: "US" },
  { postalCode: "SW1A 1AA", countryCode: "GB" },
  { postalCode: "FOO99", countryCode: "US" },
]);

for (const r of result.results) {
  if (r.valid) {
    console.log(`${r.postalCode} (${r.countryCode}) -> ${r.normalized}`);
  } else {
    console.log(`${r.postalCode} (${r.countryCode}) INVALID: ${r.reason}`);
  }
}

console.log(`Cost: $${result.totalCost.toFixed(6)}`);
console.log(`Balance: $${result.balance.toFixed(6)}`);
```

</TabItem>
</Tabs>

## Common use cases

- **CRM data hygiene.** Validate a list of customer postal codes from your CRM in a single batch.
- **Form pre-submission cleanup.** Bulk-validate a CSV of addresses uploaded by a user before kicking off downstream geocoding.
- **Ongoing address-list maintenance.** Periodic validation of a marketing list to flag entries that have become invalid.

For per-record geographic data (city, coordinates, county, etc.), use [`/api/lookup`](./lookup) or [`/api/metazip`](./metazip) on individual records after bulk validation.
