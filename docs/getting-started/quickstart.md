---
sidebar_position: 1
title: Quick Start
slug: /getting-started/quickstart
---

# Quick Start

Get up and running with PostalDataPI in under 5 minutes.

## 1. Create an Account

Sign up at [postaldatapi.com](https://postaldatapi.com) using Google, GitHub, or Microsoft. Every new account includes **1,000 free queries** -- no credit card required.

## 2. Get Your API Key

After signing in, navigate to the **API Keys** section of your dashboard and create a new key. Copy the key and keep it safe -- it will only be shown once.

## 3. Make Your First Request

All PostalDataPI endpoints accept `POST` requests with a JSON body. Every request must include your `apiKey`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "90210", "apiKey": "YOUR_API_KEY"}'
```

</TabItem>
<TabItem value="python" label="Python SDK">

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")
result = client.lookup("90210")

print(result.city)                # Beverly Hills
print(result.state_abbreviation)  # CA
```

Install with `pip install postaldatapi`.

</TabItem>
<TabItem value="node" label="Node.js SDK">

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });
const result = await client.lookup("90210");

console.log(result.city);               // Beverly Hills
console.log(result.stateAbbreviation);   // CA
```

Install with `npm install postaldatapi`.

</TabItem>
</Tabs>

### Response

```json
{
  "city": "Beverly Hills",
  "state": "California",
  "ST": "CA",
  "performance": {
    "totalTime": "3ms"
  },
  "rateLimit": {
    "enabled": false
  },
  "balance": 4.99
}
```

## 4. Try Other Countries

PostalDataPI supports 70+ countries. Pass a `country` parameter with any ISO 3166-1 alpha-2 code:

<Tabs>
<TabItem value="curl" label="cURL">

```bash
# German postal code
curl -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "10115", "country": "DE", "apiKey": "YOUR_API_KEY"}'

# UK postcode
curl -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "SW1A", "country": "GB", "apiKey": "YOUR_API_KEY"}'
```

</TabItem>
<TabItem value="python" label="Python SDK">

```python
# German postal code
de = client.lookup("10115", country="DE")
print(de.city)  # Berlin

# UK postcode
gb = client.lookup("SW1A", country="GB")
print(gb.city)  # London
```

</TabItem>
<TabItem value="node" label="Node.js SDK">

```typescript
// German postal code
const de = await client.lookup("10115", { country: "DE" });
console.log(de.city);  // Berlin

// UK postcode
const gb = await client.lookup("SW1A", { country: "GB" });
console.log(gb.city);  // London
```

</TabItem>
</Tabs>

## What's Next?

- [Authentication](/getting-started/authentication) -- API key management and security
- [API Reference](/api-reference/lookup) -- Full endpoint documentation
- [Country Codes](/guides/country-codes) -- Complete list of supported countries
- [Error Handling](/guides/error-handling) -- Handle errors gracefully
