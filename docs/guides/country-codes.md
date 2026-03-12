---
sidebar_position: 1
title: Country Codes
slug: /guides/country-codes
---

# Country Codes

PostalDataPI supports 70+ countries. Pass the ISO 3166-1 alpha-2 country code in the `country` parameter. If omitted, `country` defaults to `"US"`.

Country codes are **case-insensitive** -- `"DE"`, `"de"`, and `"De"` all work.

## Supported Countries

| Code | Country | Example Postal Code |
|------|---------|-------------------|
| `AD` | Andorra | `AD100` |
| `AR` | Argentina | `C1002` |
| `AS` | American Samoa | `96799` |
| `AT` | Austria | `1010` |
| `AU` | Australia | `2000` |
| `AX` | Aland Islands | `22100` |
| `BD` | Bangladesh | `1000` |
| `BE` | Belgium | `1000` |
| `BG` | Bulgaria | `1000` |
| `BR` | Brazil | `01001` |
| `CA` | Canada | `K1A` |
| `CH` | Switzerland | `3000` |
| `CL` | Chile | `8320000` |
| `CO` | Colombia | `110111` |
| `CZ` | Czech Republic | `10000` |
| `DE` | Germany | `10115` |
| `DK` | Denmark | `1050` |
| `DO` | Dominican Republic | `10100` |
| `DZ` | Algeria | `16000` |
| `EE` | Estonia | `10111` |
| `ES` | Spain | `28001` |
| `FI` | Finland | `00100` |
| `FO` | Faroe Islands | `100` |
| `FR` | France | `75001` |
| `GB` | United Kingdom | `SW1A` |
| `GF` | French Guiana | `97300` |
| `GL` | Greenland | `3900` |
| `GP` | Guadeloupe | `97100` |
| `GT` | Guatemala | `01001` |
| `GU` | Guam | `96910` |
| `HR` | Croatia | `10000` |
| `HU` | Hungary | `1011` |
| `IE` | Ireland | `D01` |
| `IM` | Isle of Man | `IM1` |
| `IN` | India | `110001` |
| `IS` | Iceland | `101` |
| `IT` | Italy | `00100` |
| `JP` | Japan | `1000001` |
| `KR` | South Korea | `03000` |
| `LI` | Liechtenstein | `9490` |
| `LK` | Sri Lanka | `10100` |
| `LT` | Lithuania | `01100` |
| `LU` | Luxembourg | `1009` |
| `LV` | Latvia | `LV-1001` |
| `MC` | Monaco | `98000` |
| `MD` | Moldova | `MD-2000` |
| `MH` | Marshall Islands | `96960` |
| `MK` | North Macedonia | `1000` |
| `MP` | Northern Mariana Islands | `96950` |
| `MQ` | Martinique | `97200` |
| `MT` | Malta | `VLT 1000` |
| `MX` | Mexico | `01000` |
| `MY` | Malaysia | `50000` |
| `NL` | Netherlands | `1011` |
| `NO` | Norway | `0001` |
| `NZ` | New Zealand | `6011` |
| `PH` | Philippines | `1000` |
| `PK` | Pakistan | `44000` |
| `PL` | Poland | `00-001` |
| `PM` | Saint Pierre and Miquelon | `97500` |
| `PR` | Puerto Rico | `00901` |
| `PT` | Portugal | `1000-001` |
| `RE` | Reunion | `97400` |
| `RO` | Romania | `010011` |
| `RU` | Russia | `101000` |
| `SE` | Sweden | `10005` |
| `SI` | Slovenia | `1000` |
| `SK` | Slovakia | `01001` |
| `SM` | San Marino | `47890` |
| `TH` | Thailand | `10100` |
| `TR` | Turkey | `06100` |
| `US` | United States | `90210` |
| `VA` | Vatican City | `00120` |
| `VI` | US Virgin Islands | `00801` |
| `WF` | Wallis and Futuna | `98600` |
| `YT` | Mayotte | `97600` |
| `ZA` | South Africa | `0001` |

:::note
This list represents countries with loaded data. PostalDataPI continuously expands coverage. If you need a country not listed here, [contact us](mailto:support@postaldatapi.com).
:::

## Usage Example

```bash
# Look up a German postal code
curl -X POST https://postaldatapi.com/api/lookup \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "10115", "country": "DE", "apiKey": "YOUR_API_KEY"}'
```

## Notes on Specific Countries

### United Kingdom (GB)

UK postcodes use the **outcode** format (the first part of the postcode, before the space). For example, use `"SW1A"` rather than `"SW1A 1AA"`. If you pass a full postcode, PostalDataPI automatically extracts the outcode.

### Canada (CA)

Canadian postal codes use the first three characters (Forward Sortation Area). For example, use `"K1A"` rather than `"K1A 0A6"`.

### United States (US)

US is the default country. Five-digit ZIP codes are supported. Leading zeros are preserved (e.g., `"01001"` for Agawam, MA).
