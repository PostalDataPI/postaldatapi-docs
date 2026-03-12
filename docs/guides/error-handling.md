---
sidebar_position: 2
title: Error Handling
slug: /guides/error-handling
---

# Error Handling

PostalDataPI uses standard HTTP status codes. All error responses return a JSON object with an `error` field.

## Error Response Format

```json
{
  "error": "Human-readable error message"
}
```

Some errors include additional fields:

```json
{
  "error": "Insufficient balance",
  "currentBalance": "$0.0000",
  "message": "Please add funds to your account to continue using the API"
}
```

```json
{
  "error": "Rate limit exceeded. Please wait before making another request.",
  "retryAfter": 30
}
```

## HTTP Status Codes

| Status | Name | Description |
|--------|------|-------------|
| `200` | OK | Request succeeded |
| `400` | Bad Request | Missing or invalid parameters |
| `401` | Unauthorized | Invalid or missing API key |
| `402` | Payment Required | Account balance is zero |
| `404` | Not Found | Postal code or city not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

## Handling Errors in Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="python" label="Python SDK">

The Python SDK raises typed exceptions that you can catch individually:

```python
from postaldatapi import (
    PostalDataPI,
    AuthenticationError,
    NotFoundError,
    ValidationError,
    RateLimitError,
    InsufficientBalanceError,
    ServerError,
)

client = PostalDataPI(api_key="YOUR_API_KEY")

try:
    result = client.lookup("00000")
except NotFoundError:
    print("Postal code does not exist")
except AuthenticationError:
    print("Check your API key")
except ValidationError as e:
    print(f"Bad request: {e.message}")
except InsufficientBalanceError:
    print("Add funds at postaldatapi.com")
except RateLimitError:
    print("Slow down -- rate limit exceeded")
except ServerError:
    print("Server error -- try again later")
```

All exceptions inherit from `PostalDataPIError`, so you can also catch them all:

```python
from postaldatapi import PostalDataPIError

try:
    result = client.lookup("90210")
except PostalDataPIError as e:
    print(f"API error {e.status_code}: {e.message}")
```

</TabItem>
<TabItem value="node" label="Node.js SDK">

The Node.js SDK throws typed error classes:

```typescript
import {
  PostalDataPI,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  InsufficientBalanceError,
  ServerError,
} from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

try {
  const result = await client.lookup("00000");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log("Postal code does not exist");
  } else if (err instanceof AuthenticationError) {
    console.log("Check your API key");
  } else if (err instanceof ValidationError) {
    console.log(`Bad request: ${err.message}`);
  } else if (err instanceof InsufficientBalanceError) {
    console.log("Add funds at postaldatapi.com");
  } else if (err instanceof RateLimitError) {
    console.log("Slow down -- rate limit exceeded");
  } else if (err instanceof ServerError) {
    console.log("Server error -- try again later");
  }
}
```

All errors extend `PostalDataPIError`:

```typescript
import { PostalDataPIError } from "postaldatapi";

try {
  const result = await client.lookup("90210");
} catch (err) {
  if (err instanceof PostalDataPIError) {
    console.log(`API error ${err.statusCode}: ${err.message}`);
  }
}
```

</TabItem>
<TabItem value="curl" label="Raw HTTP">

When using the API directly, check the HTTP status code first, then parse the `error` field:

```bash
response=$(curl -s -w "\n%{http_code}" -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "00000", "apiKey": "YOUR_API_KEY"}')

status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$status" -ne 200 ]; then
  echo "Error $status: $(echo $body | jq -r '.error')"
fi
```

</TabItem>
</Tabs>

## Retry Strategy

For `429` (rate limit) responses, use the `retryAfter` value in the response body to determine when to retry. For `500` errors, implement exponential backoff:

```python
import time

def lookup_with_retry(client, postal_code, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.lookup(postal_code)
        except RateLimitError:
            time.sleep(attempt * 2 + 1)
        except ServerError:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
```

## Common Mistakes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `400: Missing required field: apiKey` | `apiKey` not in request body | Add `"apiKey": "..."` to JSON body |
| `400: Missing 'state' or 'ST'` | US city search without state | Add `"ST": "CA"` or `"state": "California"` |
| `401: Invalid API key` | Typo in key, or key was revoked | Check key in dashboard |
| `404: ZIP code not found` | Postal code doesn't exist in that country | Verify postal code and country code |
