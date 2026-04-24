---
sidebar_position: 4
title: "Tutorial: Postal Code Lookup in Node.js"
slug: /guides/node-tutorial
---

# How to Look Up Postal Codes in Node.js

This guide walks through building a postal code lookup feature in Node.js and TypeScript using the PostalDataPI SDK. By the end, you will be able to validate addresses, enrich form data, and handle international postal codes in any Node.js application.

## Prerequisites

- Node.js 18+ (uses native `fetch`)
- A PostalDataPI account ([sign up free](https://postaldatapi.com/register) -- 1,000 queries included)
- Your API key from the [dashboard](https://postaldatapi.com/account)

## Install the SDK

```bash
npm install postaldatapi
```

Zero dependencies -- the SDK uses native `fetch` (Node.js 18+).

## Basic Lookup

The simplest use case: look up a postal code and get back the city and region.

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

// US ZIP code
const result = await client.lookup("90210");
console.log(`${result.city}, ${result.stateAbbreviation}`);
// Beverly Hills, CA
```

## International Lookups

Pass the `country` option with an ISO 3166-1 alpha-2 code. The same API key works for all 240+ countries and territories.

```typescript
// German PLZ
const de = await client.lookup("10115", { country: "DE" });
console.log(de.city); // Berlin

// Japanese postal code
const jp = await client.lookup("100-0001", { country: "JP" });
console.log(jp.city); // Chiyoda

// UK postcode (outcode)
const gb = await client.lookup("SW1A", { country: "GB" });
console.log(gb.city); // London

// Canadian postal code (FSA)
const ca = await client.lookup("K1A", { country: "CA" });
console.log(ca.city); // Ottawa
```

## Validate Before Submitting a Form

Use `validate()` to check whether a postal code exists without fetching full metadata.

```typescript
async function isValidPostalCode(
  code: string,
  country = "US"
): Promise<boolean> {
  try {
    const result = await client.validate(code, { country });
    return result.valid;
  } catch {
    return false;
  }
}

// In a form handler
const userZip = "90210";
if (await isValidPostalCode(userZip)) {
  console.log("Valid ZIP code");
} else {
  console.log("Please enter a valid ZIP code");
}
```

## Enrich Address Data

Use `metazip()` to get latitude, longitude, timezone, county, and other metadata.

```typescript
const result = await client.metazip("90210");

console.log(`City: ${result.city}`);
console.log(`Coordinates: ${result.latitude}, ${result.longitude}`);
console.log(`County: ${result.meta.county}`);
console.log(`Timezone: ${result.meta.timezone}`);
```

## Search by City Name

Find all postal codes for a given city. For US queries, the `state` parameter is required.

```typescript
const result = await client.searchCity("Beverly Hills", {
  state: "CA",
});
console.log(result.postalCodes);
// ['90209', '90210', '90211', '90212', '90213']

// International city search
const deResult = await client.searchCity("Berlin", { country: "DE" });
console.log(deResult.postalCodes.slice(0, 5));
// ['10115', '10117', '10119', '10178', '10179']
```

## Track Your Balance

Every API response includes the current account balance:

```typescript
const result = await client.lookup("90210");

if (result.balance < 1.0) {
  console.warn(`Low balance: $${result.balance.toFixed(4)}`);
}
```

## Error Handling Best Practices

The SDK throws typed error classes that you can catch individually:

```typescript
import {
  PostalDataPI,
  NotFoundError,
  AuthenticationError,
  InsufficientBalanceError,
  RateLimitError,
  PostalDataPIError,
} from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

async function safeLookup(postalCode: string, country = "US") {
  try {
    const result = await client.lookup(postalCode, { country });
    return {
      city: result.city,
      state: result.stateAbbreviation,
      balance: result.balance,
    };
  } catch (err) {
    if (err instanceof NotFoundError) return null;
    if (err instanceof AuthenticationError) throw err;
    if (err instanceof InsufficientBalanceError) throw err;
    if (err instanceof RateLimitError) {
      await new Promise((r) => setTimeout(r, 2000));
      return safeLookup(postalCode, country); // Retry once
    }
    if (err instanceof PostalDataPIError) {
      console.error(`API error ${err.statusCode}: ${err.message}`);
      return null;
    }
    throw err;
  }
}
```

## Express.js Example

A minimal Express endpoint that validates and enriches a postal code:

```typescript
import express from "express";
import { PostalDataPI, NotFoundError } from "postaldatapi";

const app = express();
app.use(express.json());

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

app.post("/api/check-postal-code", async (req, res) => {
  const { postal_code, country = "US" } = req.body;

  if (!postal_code) {
    return res.status(400).json({ error: "postal_code is required" });
  }

  try {
    const result = await client.metazip(postal_code, {
      country: country.toUpperCase(),
    });
    res.json({
      valid: true,
      city: result.city,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ valid: false, error: "Postal code not found" });
    } else {
      res.status(500).json({ error: "Internal error" });
    }
  }
});

app.listen(3000);
```

## Next.js API Route Example

Use PostalDataPI in a Next.js App Router API route:

```typescript
// app/api/validate-address/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PostalDataPI, NotFoundError } from "postaldatapi";

const client = new PostalDataPI({ apiKey: process.env.POSTALDATAPI_KEY! });

export async function POST(request: NextRequest) {
  const { postalCode, country = "US" } = await request.json();

  try {
    const result = await client.lookup(postalCode, { country });
    return NextResponse.json({
      valid: true,
      city: result.city,
      state: result.stateAbbreviation,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { valid: false, error: "Invalid postal code" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500 }
    );
  }
}
```

## Batch Processing with Concurrency Control

Process many postal codes with controlled parallelism:

```typescript
async function batchLookup(
  codes: string[],
  country = "US",
  concurrency = 5
) {
  const results: Map<string, { city: string } | null> = new Map();
  const queue = [...codes];

  async function worker() {
    while (queue.length > 0) {
      const code = queue.shift()!;
      try {
        const result = await client.lookup(code, { country });
        results.set(code, { city: result.city });
      } catch {
        results.set(code, null);
      }
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker())
  );

  return results;
}

// Process 100 ZIP codes, 5 at a time
const codes = ["90210", "10001", "60601" /* ... */];
const results = await batchLookup(codes);
```

## Next Steps

- [API Reference](/api-reference/lookup) -- full endpoint documentation
- [Error Handling Guide](/guides/error-handling) -- retry strategies and error codes
- [Country Codes](/guides/country-codes) -- all supported countries
- [Node.js SDK Reference](/sdks/node) -- complete method documentation
