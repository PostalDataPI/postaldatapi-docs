---
sidebar_position: 2
title: Node.js SDK
slug: /sdks/node
---

# Node.js SDK

Official TypeScript/Node.js client for PostalDataPI.

## Installation

```bash
npm install postaldatapi
```

Requires Node.js 18+ (uses native `fetch`). Zero runtime dependencies.

## Quick Start

```typescript
import { PostalDataPI } from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

// Look up a US ZIP code
const result = await client.lookup("90210");
console.log(result.city);               // Beverly Hills
console.log(result.state);              // California
console.log(result.stateAbbreviation);  // CA

// Look up a German postal code
const de = await client.lookup("10115", { country: "DE" });
console.log(de.city);  // Berlin
```

## Configuration

```typescript
const client = new PostalDataPI({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://staging.postaldatapi.com",  // override for staging
  timeout: 30_000,  // milliseconds (default: 10000)
});
```

## Methods

### `client.lookup(postalCode, options?)`

Returns city and state/region for a postal code.

```typescript
const result = await client.lookup("90210");
console.log(result.city);               // Beverly Hills
console.log(result.state);              // California
console.log(result.stateAbbreviation);  // CA
console.log(result.balance);            // 4.99
console.log(result.raw);               // full API response object
```

**Returns:** `LookupResult` with fields: `city`, `state`, `stateAbbreviation`, `balance`, `rateLimit`, `raw`

### `client.validate(postalCode, options?)`

Checks whether a postal code exists.

```typescript
const result = await client.validate("90210");
console.log(result.valid);       // true
console.log(result.postalCode);  // 90210
```

**Returns:** `ValidateResult` with fields: `valid`, `postalCode`, `balance`, `raw`

### `client.searchCity(city, options?)`

Finds postal codes for a city name. `options.state` is required for US queries.

```typescript
const result = await client.searchCity("Beverly Hills", { state: "CA" });
console.log(result.postalCodes);  // ['90209', '90210', '90211', ...]
```

**Returns:** `CitySearchResult` with fields: `postalCodes`, `matchedCity`, `matchedState`, `balance`, `raw`

### `client.metazip(postalCode, options?)`

Returns all available metadata for a postal code.

```typescript
const result = await client.metazip("90210");
console.log(result.city);            // Beverly Hills
console.log(result.postalCode);      // 90210
console.log(result.latitude);        // 34.1031
console.log(result.longitude);       // -118.4163
console.log(result.meta.county);     // Los Angeles County
console.log(result.meta.timezone);   // America/Los_Angeles
```

**Returns:** `MetazipResult` with fields: `city`, `postalCode`, `latitude`, `longitude`, `meta`, `balance`, `raw`

### Options

All methods accept an options object:

```typescript
interface RequestOptions {
  country?: string;  // ISO 3166-1 alpha-2 (default: "US")
  state?: string;    // For searchCity only (required for US)
}
```

## Error Handling

```typescript
import {
  PostalDataPI,
  PostalDataPIError,
  AuthenticationError,       // 401
  NotFoundError,             // 404
  ValidationError,           // 400
  RateLimitError,            // 429
  InsufficientBalanceError,  // 402
  ServerError,               // 5xx
} from "postaldatapi";

const client = new PostalDataPI({ apiKey: "YOUR_API_KEY" });

try {
  const result = await client.lookup("00000");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log("Not found");
  } else if (err instanceof PostalDataPIError) {
    console.log(`Error ${err.statusCode}: ${err.message}`);
  }
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  LookupResult,
  ValidateResult,
  CitySearchResult,
  MetazipResult,
} from "postaldatapi";
```

## Tracking Balance

Every response includes the current account balance:

```typescript
const result = await client.lookup("90210");
console.log(`Remaining balance: $${result.balance.toFixed(2)}`);
```

## Source Code

[GitHub](https://github.com/PostalDataPI/postaldatapi-node)
