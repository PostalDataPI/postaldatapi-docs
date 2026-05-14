---
sidebar_position: 6
title: Metazip (legacy alias)
slug: /api-reference/metazip
---

# POST /api/metazip — legacy alias

`/api/metazip` is the original name of the postal-code metadata endpoint. As of May 2026 the canonical endpoint name is **[`/api/metacode`](./metacode)**, which is brand-neutral (works for ZIP codes, postal codes, postcodes, PLZ, and equivalent).

## Behavior

`/api/metazip` continues to work exactly as before. Requests are served by the same handler as `/api/metacode` — the request shape, response shape, billing, rate limiting, and error codes are all identical.

The only difference: responses to `/api/metazip` include two HTTP headers that mark the endpoint as deprecated:

```
Deprecation: true
Link: </api/metacode>; rel="successor-version"
```

These headers follow [RFC 8594 (the Sunset HTTP header)](https://datatracker.ietf.org/doc/html/rfc8594) and the [RFC 8288 `Link` header](https://datatracker.ietf.org/doc/html/rfc8288) deprecation pattern. Machine clients can read them to self-detect deprecation and migrate over time. Human consumers see no visible change.

## What you should do

- **Existing integrations using `/api/metazip`:** keep working. No urgent action required. There is no scheduled removal date.
- **New integrations:** call **[`/api/metacode`](./metacode)** instead. The full endpoint documentation lives there.

## When `/api/metazip` will be removed

There is no scheduled removal date. The endpoint will remain available until telemetry shows zero traffic over an extended period (likely 12–24 months minimum). If a removal is ever scheduled, it will be announced via the `Sunset` HTTP header and in release notes well in advance.

## Why the rename

"Zip" is US-specific terminology. PostalDataPI serves global postal-code data across 240+ countries and territories. `/api/metacode` is a brand-neutral name that aligns with how customers around the world refer to these codes — *ZIP code*, *postal code*, *postcode*, *PLZ*, and so on.
