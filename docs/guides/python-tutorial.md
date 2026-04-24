---
sidebar_position: 3
title: "Tutorial: Postal Code Lookup in Python"
slug: /guides/python-tutorial
---

# How to Look Up Postal Codes in Python

This guide walks through building a postal code lookup feature in Python using the PostalDataPI SDK. By the end, you will be able to validate addresses, enrich form data, and handle international postal codes in any Python application.

## Prerequisites

- Python 3.8+
- A PostalDataPI account ([sign up free](https://postaldatapi.com/register) -- 1,000 queries included)
- Your API key from the [dashboard](https://postaldatapi.com/account)

## Install the SDK

```bash
pip install postaldatapi
```

## Basic Lookup

The simplest use case: look up a postal code and get back the city and region.

```python
from postaldatapi import PostalDataPI

client = PostalDataPI(api_key="YOUR_API_KEY")

# US ZIP code
result = client.lookup("90210")
print(f"{result.city}, {result.state_abbreviation}")
# Beverly Hills, CA
```

## International Lookups

Pass the `country` parameter with an ISO 3166-1 alpha-2 code. The same API key works for all 240+ countries and territories.

```python
# German PLZ
de = client.lookup("10115", country="DE")
print(de.city)  # Berlin

# Japanese postal code
jp = client.lookup("100-0001", country="JP")
print(jp.city)  # Chiyoda

# UK postcode (outcode)
gb = client.lookup("SW1A", country="GB")
print(gb.city)  # London

# Canadian postal code (FSA)
ca = client.lookup("K1A", country="CA")
print(ca.city)  # Ottawa
```

## Validate Before Submitting a Form

Use `validate()` to check whether a postal code exists without fetching full metadata. This is useful for form validation in web apps or data pipelines.

```python
def is_valid_postal_code(code: str, country: str = "US") -> bool:
    try:
        result = client.validate(code, country=country)
        return result.valid
    except Exception:
        return False

# In a form handler
user_zip = "90210"
if is_valid_postal_code(user_zip):
    print("Valid ZIP code")
else:
    print("Please enter a valid ZIP code")
```

## Enrich Address Data

Use `metazip()` to get latitude, longitude, timezone, county, and other metadata. This is useful for shipping calculators, store locators, and analytics.

```python
result = client.metazip("90210")

print(f"City: {result.city}")
print(f"Coordinates: {result.latitude}, {result.longitude}")
print(f"County: {result.meta.get('county')}")
print(f"Timezone: {result.meta.get('timezone')}")
```

## Search by City Name

Find all postal codes for a given city. For US queries, the `state` parameter is required.

```python
result = client.search_city("Beverly Hills", state="CA")
print(result.postal_codes)
# ['90209', '90210', '90211', '90212', '90213']

# International city search
result = client.search_city("Berlin", country="DE")
print(result.postal_codes[:5])
# ['10115', '10117', '10119', '10178', '10179']
```

## Batch Processing

Process a list of postal codes efficiently. The SDK makes one HTTP request per call, so for large batches, consider adding a small delay to stay within rate limits.

```python
import csv

postal_codes = ["90210", "10001", "60601", "30301", "98101"]

for code in postal_codes:
    try:
        result = client.metazip(code)
        print(f"{code}: {result.city} ({result.latitude}, {result.longitude})")
    except Exception as e:
        print(f"{code}: Error - {e}")
```

## Track Your Balance

Every API response includes the current account balance. Use this to monitor spending or trigger alerts.

```python
result = client.lookup("90210")
balance = result.balance

if balance < 1.00:
    print(f"Low balance warning: ${balance:.4f}")
```

## Error Handling Best Practices

Always handle the specific error cases your application cares about:

```python
from postaldatapi import (
    PostalDataPI,
    NotFoundError,
    AuthenticationError,
    InsufficientBalanceError,
    RateLimitError,
    PostalDataPIError,
)

client = PostalDataPI(api_key="YOUR_API_KEY")

def safe_lookup(postal_code: str, country: str = "US") -> dict | None:
    try:
        result = client.lookup(postal_code, country=country)
        return {
            "city": result.city,
            "state": result.state_abbreviation,
            "balance": result.balance,
        }
    except NotFoundError:
        return None  # Postal code doesn't exist
    except AuthenticationError:
        raise  # API key issue -- don't swallow this
    except InsufficientBalanceError:
        raise  # Need to add funds -- don't swallow this
    except RateLimitError:
        import time
        time.sleep(2)
        return safe_lookup(postal_code, country)  # Retry once
    except PostalDataPIError as e:
        print(f"Unexpected API error: {e.status_code} {e.message}")
        return None
```

## Flask Example

A minimal Flask endpoint that validates and enriches a postal code:

```python
from flask import Flask, request, jsonify
from postaldatapi import PostalDataPI, NotFoundError

app = Flask(__name__)
client = PostalDataPI(api_key="YOUR_API_KEY")

@app.route("/api/check-postal-code", methods=["POST"])
def check_postal_code():
    data = request.get_json()
    code = data.get("postal_code", "").strip()
    country = data.get("country", "US").upper()

    if not code:
        return jsonify({"error": "postal_code is required"}), 400

    try:
        result = client.metazip(code, country=country)
        return jsonify({
            "valid": True,
            "city": result.city,
            "latitude": result.latitude,
            "longitude": result.longitude,
        })
    except NotFoundError:
        return jsonify({"valid": False, "error": "Postal code not found"}), 404
```

## Django Example

Add postal code validation to a Django form:

```python
from postaldatapi import PostalDataPI, NotFoundError
from django import forms

client = PostalDataPI(api_key="YOUR_API_KEY")

class AddressForm(forms.Form):
    street = forms.CharField(max_length=200)
    city = forms.CharField(max_length=100)
    postal_code = forms.CharField(max_length=20)
    country = forms.CharField(max_length=2, initial="US")

    def clean_postal_code(self):
        code = self.cleaned_data["postal_code"]
        country = self.cleaned_data.get("country", "US")
        try:
            client.validate(code, country=country)
        except NotFoundError:
            raise forms.ValidationError(f"Invalid postal code: {code}")
        return code
```

## Next Steps

- [API Reference](/api-reference/lookup) -- full endpoint documentation
- [Error Handling Guide](/guides/error-handling) -- retry strategies and error codes
- [Country Codes](/guides/country-codes) -- all supported countries
- [Python SDK Reference](/sdks/python) -- complete method documentation
