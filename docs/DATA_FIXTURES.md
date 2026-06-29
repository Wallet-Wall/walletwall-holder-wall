# Data Fixtures

Holder Wall ships with synthetic, clearly labeled demo data located in `src/data/holder-wall.fixture.json`. All demo addresses are clearly fake and must not be used for identity or attribution purposes.

## Fixture File

| File | Purpose |
|---|---|
| `holder-wall.fixture.json` | Token KPIs and ranked holder rows with type, value, and supply percentage |

## Fixture Schema

```jsonc
{
  "_note": "DEMO DATA ONLY — synthetic holder distribution fixture. All addresses are clearly fake demo labels.",
  "as_of": "<ISO timestamp>",
  "token": {
    "symbol": "USDC",
    "name": "USD Coin (demo)",
    "chain": "Ethereum (demo)"
  },
  "kpis": {
    "total_holders": 42810,
    "total_supply_usd": 8400000000,
    "top_10_pct_of_supply": 68.2,
    "top_100_pct_of_supply": 82.4,
    "median_hold_days": 34,
    "avg_hold_usd": 196200
  },
  "holders": [
    {
      "rank": 1,
      "label": "Demo Exchange Alpha",
      "type": "exchange" | "protocol" | "whale" | "institution",
      "address_demo": "0xDEMOEX01...AAAA",
      "value_usd": 1240000000,
      "pct_supply": 14.76,
      "hold_days": 180
    }
  ]
}
```

### Entity Types

| Type | Color |
|---|---|
| `exchange` | Steel blue (`#5B7EA6`) |
| `protocol` | Muted purple (`#7A6B9E`) |
| `whale` | Terracotta (`#BF4E32`) |
| `institution` | Dark green (`#2F8F67`) |

## Replacing the Fixture With Your Own Data

To wire Holder Wall to your own data source:

1. Replace the contents of `src/data/holder-wall.fixture.json` with your data, matching the schema above.
2. Ensure your data source is **read-only** — no write access, no private keys, no paid Dune execution in this repo.
3. If connecting to Dune Analytics or a comparable provider, build a separate server-side proxy that holds credentials outside this repository. Never commit API keys here.
4. Use clearly labeled demo addresses or sanitized public addresses only. Do not include real sensitive wallet labels or identity annotations.
5. Update `_note` and `as_of` to reflect the source and freshness.

## Live Connectors

Live holder data connectors (e.g., Dune Analytics) are **out of scope** for this repository unless separately approved and scoped. This repository is intentionally fixture-only to remain publicly safe.
