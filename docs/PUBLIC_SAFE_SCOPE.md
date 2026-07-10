# Public-Safe Scope

This document defines what is included and explicitly excluded from `walletwall-holder-wall`.

## Included

- **Holder Wall** — a read-only demonstration of the wallet-cohort treemap concept (static fixture data only), for vault-candidate discovery
- Wallet cohorts: Active Wallets, Whale Wallets, Dormant Wallets — not a single token's holder list
- KPI strip: wallets tracked, whale wallets, active wallets, top-10 concentration (relative to the currently visible cohort, not total token supply), demo snapshot date
- Proportional treemap of wallets sized by USD value, per cohort
- Ranked leaderboard filterable by entity type (whale, exchange, institution)
- Vault-candidate and migration-signal flags as simple demo booleans (not the production scoring formula)
- Public-safe UI components and brand styling
- Synthetic, clearly labeled demo fixture data — all addresses are fake
- Lightweight tests verifying render, fixture display, and absence of forbidden strings

## Explicitly Excluded — Do Not Add

| Category | Excluded Items |
|---|---|
| Secrets | Private API keys, Dune API keys, Alchemy keys, Etherscan keys, Infura project IDs, mnemonics, private keys of any kind |
| Execution | Paid Dune query execution, live data refresh endpoints, backend infrastructure |
| Wallet | Wallet connection (WalletConnect or any provider), signing, transaction construction, authorization flows |
| Vault | Vault write flows, custody, deposit, swap, bridge, or yield execution |
| Data | Real holder addresses, sensitive wallet annotations, production user data, identity attribution |
| History | Private repository git history |
| Config | Vercel project IDs, private deployment metadata, private org config, `.env` files |
| Claims | Claims of production quantum protection, audited vault safety, mainnet readiness, yield, or custody |

## Contribution Boundary

If you identify an implementation opportunity that falls outside the above scope, document it as a follow-up issue rather than implementing it. The product roadmap is owned by the WalletWall team.

## Permitted Follow-Up Topics (Document Only, Do Not Implement Here)

- Live holder data connectors (e.g., Dune Analytics) — requires separate approval and scoping
- User-owned data source wiring
- Authentication or access control for private deployments
- Additional entity type classifications or concentration metrics
