# Holder Wall — Surface Overview

Holder Wall is a read-only wallet-cohort treemap for vault-candidate discovery. It is one of three surfaces in the WalletWall analytics suite. The other two are [Stable Seer](https://github.com/Wallet-Wall/walletwall-stable-seer) and [Coinstellation](https://github.com/Wallet-Wall/walletwall-coinstellation).

---

## What Holder Wall Shows

- **Wallet cohorts:** Active Wallets, Whale Wallets, and Dormant Wallets — scheduled cohorts, not a single token's holder list
- **KPI strip:** wallets tracked, whale wallets, active wallets, top-10 concentration (relative to the wallets currently visible in the active cohort/filter, not a token's total supply), demo snapshot date
- **Proportional treemap** of wallets sized by USD value, per cohort
- **Ranked leaderboard** filterable by entity type (whale, exchange, institution)
- **Vault-candidate and migration-signal flags** on dormant wallets — simple demo booleans, not the production scoring formula
- **Per-wallet detail:** cohort, rank, value, cohort-specific signals, demo address

## What Holder Wall Does Not Do

- No live Dune execution or paid query paths
- No real wallet addresses — all addresses are clearly marked `(demo)`
- No wallet connection or signing
- No production data dependency
- No claim of measuring a token's total supply concentration — concentration here is always relative to the demo cohort on screen

## Design Intent

Shows how a wallet-cohort treemap organizes wallets into Active / Whale / Dormant groups and surfaces vault-candidate and migration-readiness signals as context for stablecoin vault-readiness discovery. In the full product this connects to Dune or a comparable analytics provider on a daily schedule — that connection is not present here.

---

## How the Three Surfaces Relate

All three WalletWall surfaces are read-only lenses on the same underlying subject: the safety and exposure profile of stablecoins and the wallets that hold them.

- **Stable Seer** examines the stablecoin itself: peg health, liquidity, and pool structure.
- **Coinstellation** examines a wallet: who it transacts with, what it holds, and how value flows.
- **Holder Wall** (this repo) examines wallet cohorts across the network — concentration, entity type, dormancy, and vault-candidate signal — for vault-readiness discovery.

Together they form a read-only analytics picture. Write flows, vault decisions, signing, and execution are intentionally out of scope for all three public repositories.
