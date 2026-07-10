# Data Fixtures

Holder Wall ships with synthetic, clearly labeled demo data located in `src/data/holder-wall.fixture.json`. All demo addresses are clearly fake and must not be used for identity or attribution purposes.

The fixture models **wallet cohorts**, not a single token's holder list. This mirrors the current product: Holder Wall tracks scheduled wallet cohorts (Active, Whale, Dormant) across the network, independent of any one token selection, for vault-candidate discovery — it is not a token-supply distribution tool.

## Fixture File

| File | Purpose |
|---|---|
| `holder-wall.fixture.json` | Wallet-cohort snapshot: one entry per cohort, each holding ranked demo wallets with type, USD value, and cohort-specific signal flags |

## Fixture Schema

```jsonc
{
  "_note": "DEMO DATA ONLY — synthetic wallet-cohort fixture. All addresses are clearly fake demo labels.",
  "as_of": "<demo snapshot date, e.g. 2026-06-15>",
  "network": "Ethereum (demo)",
  "cohorts": [
    {
      "id": "active" | "whale" | "dormant",
      "name": "Active Wallets" | "Whale Wallets" | "Dormant Wallets",
      "description": "Human-readable cohort description shown in the UI",
      "wallets": [
        {
          "label": "Demo Exchange Relay 1",
          "holderType": "exchange" | "whale" | "institution" | "unknown",
          "address_demo": "0xDEMOEXR1...AAAA",
          "value_usd": 2150000,
          "txCount": 312,          // Active cohort only
          "trades": 6,             // Whale cohort only
          "daysDormant": 612,      // Dormant cohort only
          "vaultCandidate": true,  // Dormant cohort only
          "migrationSignal": true  // Dormant cohort only
        }
      ]
    }
  ]
}
```

Rank is **derived at render time** by sorting each cohort's wallets by `value_usd` — it is not a stored field. A wallet may legitimately appear in more than one cohort (e.g. a wallet that is both recently active and behind a large single trade); the cohorts are not mutually exclusive, matching the real product.

### Entity Types

| Type | Color |
|---|---|
| `exchange` | Steel blue (`#5B7EA6`) |
| `whale` | Terracotta (`#BF4E32`) |
| `institution` | Dark green (`#2F8F67`) |
| `unknown` | Tan (`#C9A47A`) — wallet has no confident entity classification |

`protocol` is intentionally **not** an entity type here. The upstream product removed it: protocol/contract addresses are non-navigable wallets, so a "Protocol" filter always resolved to an empty view. This fixture never included that dead path.

### Concentration semantics

"Top 10 Concentration" is the USD share held by the top 10 wallets **among the wallets currently visible in the active cohort/filter** — it is explicitly not a percentage of a token's total circulating supply. The KPI strip intentionally omits `total_supply_usd`, `top_10_pct_of_supply` / `top_100_pct_of_supply`, and `median_hold_days` — those token-supply concepts do not exist in the current product's Holder Wall model.

### Dormant cohort balances are estimates

Every wallet in the `dormant` cohort represents a **proxy balance estimate**, not a live on-chain read — the UI shows an explicit banner when that cohort is active. `vaultCandidate` and `migrationSignal` are simple demo booleans standing in for the product's real migration-readiness heuristics; they are not the production scoring formula.

## Replacing the Fixture With Your Own Data

To wire Holder Wall to your own data source:

1. Replace the contents of `src/data/holder-wall.fixture.json` with your data, matching the schema above.
2. Ensure your data source is **read-only** — no write access, no private keys, no paid Dune execution in this repo.
3. If connecting to Dune Analytics or a comparable provider, build a separate server-side proxy that holds credentials outside this repository. Never commit API keys here.
4. Use clearly labeled demo addresses or sanitized public addresses only. Do not include real sensitive wallet labels or identity annotations.
5. Update `_note` and `as_of` to reflect the source and freshness.

## Live Connectors

Live holder data connectors (e.g., Dune Analytics) are **out of scope** for this repository unless separately approved and scoped. This repository is intentionally fixture-only to remain publicly safe.
