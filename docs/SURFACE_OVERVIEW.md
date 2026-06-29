# Holder Wall — Surface Overview

Holder Wall is a read-only stablecoin holder distribution map. It is one of three surfaces in the WalletWall analytics suite. The other two are [Stable Seer](https://github.com/Wallet-Wall/walletwall-stable-seer) and [Coinstellation](https://github.com/Wallet-Wall/walletwall-coinstellation).

---

## What Holder Wall Shows

- **KPI strip:** total holders, total supply, top-10 and top-100 concentration, median hold days
- **Proportional treemap** of holders sized by USD value
- **Ranked leaderboard** filterable by entity type (exchange, protocol, whale, institution)
- **Per-holder detail:** rank, value, supply percentage, hold days, demo address

## What Holder Wall Does Not Do

- No live Dune execution or paid query paths
- No real holder addresses — all addresses are clearly marked `(demo)`
- No wallet connection or signing
- No production data dependency

## Design Intent

Shows how holder concentration and entity-type distribution are visualized as context for a stablecoin's supply risk profile. In the full product this connects to Dune or a comparable analytics provider — that connection is not present here.

---

## How the Three Surfaces Relate

All three WalletWall surfaces are read-only lenses on the same underlying subject: the safety and exposure profile of stablecoins and the wallets that hold them.

- **Stable Seer** examines the stablecoin itself: peg health, liquidity, and pool structure.
- **Coinstellation** examines a wallet: who it transacts with, what it holds, and how value flows.
- **Holder Wall** (this repo) examines the holder distribution of a stablecoin: concentration, entity type, and holding behavior.

Together they form a read-only analytics picture. Write flows, vault decisions, signing, and execution are intentionally out of scope for all three public repositories.
