---
sidebar_position: 2
title: Validate
slug: /api-reference/validate
---

# POST /api/validate

Check whether a postal code exists. Unlike [Lookup](/api-reference/lookup), this endpoint returns `valid: true` or `valid: false` instead of throwing an error for unknown codes.

## Request

```
POST https://postaldatapi.com/api/validate
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zipcode` | `string` or `number` | Yes | The postal code to validate |
| `apiKey` | `string` | Yes | Your API key |
| `country` | `string` | No | ISO 3166-1 alpha-2 country code (default: `"US"`) |

## Response

### Valid postal code (200)

```json
{
  "valid": true,
  "zipcode": "90210",
  "responseTime": "0ms",
  "performance": { "totalTime": "2ms" },
  "balance": 4.99
}
```

### Invalid postal code (200)

```json
{
  "valid": false,
  "zipcode": "00000",
  "responseTime": "0ms",
  "performance": { "totalTime": "1ms" },
  "balance": 4.99
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | `true` if the postal code exists, `false` otherwise |
| `zipcode` | `string` or `number` | The postal code that was validated (echoed back) |
| `performance` | `object` | Timing breakdown |
| `balance` | `number` | Account balance after this query (USD) |

:::tip
Both valid and invalid postal codes return HTTP `200`. Check the `valid` field to determine existence.
:::

## Examples

```bash
# Valid US ZIP
curl -X POST https://postaldatapi.com/api/validate \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "90210", "apiKey": "YOUR_API_KEY"}'

# Valid UK postcode
curl -X POST https://postaldatapi.com/api/validate \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "SW1A", "country": "GB", "apiKey": "YOUR_API_KEY"}'
```

## Errors

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `Missing required field: zipcode` | No `zipcode` in request body |
| `401` | `Invalid API key` | API key does not exist or was revoked |
| `402` | `Insufficient balance` | Account balance is zero |
| `429` | `Rate limit exceeded` | Too many requests |

## SDK Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="python" label="Python">

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")

result = client.validate("90210")
print(result.valid)        # True
print(result.postal_code)  # 90210

# UK postcode
gb = client.validate("SW1A", country="GB")
print(gb.valid)  # True
```

</TabItem>
<TabItem value="node" label="Node.js">

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

const result = await client.validate("90210");
console.log(result.valid);       // true
console.log(result.postalCode);  // 90210

// UK postcode
const gb = await client.validate("SW1A", { country: "GB" });
console.log(gb.valid);  // true
```

</TabItem>
</Tabs>
