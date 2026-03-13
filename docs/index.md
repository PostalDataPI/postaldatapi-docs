---
sidebar_position: 0
title: PostalDataPI Documentation
slug: /
---

# PostalDataPI Documentation

PostalDataPI is a global postal code API covering 70+ countries with sub-10ms response times. Look up, validate, and search postal codes with a simple REST API.

## Why PostalDataPI?

- **Global coverage** -- 70+ countries, from the US to Japan to Germany
- **Fast** -- Sub-10ms response times
- **Simple** -- One flat rate ($0.000028/query), no tiers, no surprises
- **Free to start** -- 1,000 queries free, no credit card required
- **Official SDKs** -- Python and Node.js clients available

## Get Started

1. **[Quick Start](/getting-started/quickstart)** -- Make your first API call in under 5 minutes
2. **[Authentication](/getting-started/authentication)** -- API keys, pricing, and rate limits

## API Reference

| Endpoint | Description |
|----------|-------------|
| [POST /api/lookup](/api-reference/lookup) | Get city and state for a postal code |
| [POST /api/validate](/api-reference/validate) | Check if a postal code exists |
| [POST /api/city](/api-reference/city-search) | Find postal codes by city name |
| [POST /api/metazip](/api-reference/metazip) | Get coordinates, timezone, county, and more |
| [POST /api/aboutapi](/api-reference/about) | API version and coverage info |

## SDKs

| Language | Package | Install |
|----------|---------|---------|
| [Python](/sdks/python) | `postaldatapi` | `pip install postaldatapi` |
| [Node.js](/sdks/node) | `postaldatapi` | `npm install postaldatapi` |

## Guides

- [Country Codes](/guides/country-codes) -- Full list of 70+ supported countries
- [Error Handling](/guides/error-handling) -- HTTP status codes and SDK error classes
