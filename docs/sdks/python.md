---
sidebar_position: 1
title: Python SDK
slug: /sdks/python
---

# Python SDK

Official Python client for PostalDataPI.

## Installation

```bash
pip install postaldatapi
```

Requires Python 3.8+. The only runtime dependency is `requests`.

## Quick Start

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")

# Look up a US ZIP code
result = client.lookup("90210")
print(result.city)                # Beverly Hills
print(result.state)               # California
print(result.state_abbreviation)  # CA

# Look up a German postal code
de = client.lookup("10115", country="DE")
print(de.city)  # Berlin
```

## Configuration

```python
client = PostalDataPI(
    api_key="YOUR_API_KEY",
    base_url="https://staging.postaldatapi.com",  # override for staging
    timeout=30,  # seconds (default: 10)
)
```

## Methods

### `client.lookup(postal_code, country=None)`

Returns city and state/region for a postal code.

```python
result = client.lookup("90210")
print(result.city)                # Beverly Hills
print(result.state)               # California
print(result.state_abbreviation)  # CA
print(result.balance)             # 4.99
print(result.raw)                 # full API response dict
```

**Returns:** `LookupResult` with fields: `city`, `state`, `state_abbreviation`, `balance`, `rate_limit`, `raw`

### `client.validate(postal_code, country=None)`

Checks whether a postal code exists.

```python
result = client.validate("90210")
print(result.valid)        # True
print(result.postal_code)  # 90210
```

**Returns:** `ValidateResult` with fields: `valid`, `postal_code`, `balance`, `raw`

### `client.search_city(city, state=None, country=None)`

Finds postal codes for a city name. `state` is required for US queries.

```python
result = client.search_city("Beverly Hills", state="CA")
print(result.postal_codes)  # ['90209', '90210', '90211', ...]
```

**Returns:** `CitySearchResult` with fields: `postal_codes`, `matched_city`, `matched_state`, `balance`, `raw`

### `client.metazip(postal_code, country=None)`

Returns all available metadata for a postal code.

```python
result = client.metazip("90210")
print(result.city)            # Beverly Hills
print(result.postal_code)     # 90210
print(result.latitude)        # 34.1031
print(result.longitude)       # -118.4163
print(result.meta["county"])  # Los Angeles County
print(result.meta["timezone"])  # America/Los_Angeles
```

**Returns:** `MetazipResult` with fields: `city`, `postal_code`, `latitude`, `longitude`, `meta`, `balance`, `raw`

## Error Handling

```python
from postaldatapi import (
    PostalDataPI,
    PostalDataPIError,
    AuthenticationError,    # 401
    NotFoundError,          # 404
    ValidationError,        # 400
    RateLimitError,         # 429
    InsufficientBalanceError,  # 402
    ServerError,            # 5xx
)

client = PostalDataPI(api_key="YOUR_API_KEY")

try:
    result = client.lookup("00000")
except NotFoundError:
    print("Not found")
except PostalDataPIError as e:
    print(f"Error {e.status_code}: {e.message}")
```

## Tracking Balance

Every response includes the current account balance:

```python
result = client.lookup("90210")
print(f"Remaining balance: ${result.balance:.2f}")
```

## Source Code

[GitHub](https://github.com/PostalDataPI/postaldatapi-python)
