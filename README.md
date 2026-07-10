# Holder Wall

Holder Wall is a read-only demonstration of the WalletWall wallet-cohort treemap concept, built for vault-candidate discovery. Inspect wallets grouped into Active, Whale, and Dormant cohorts, see KPIs like wallets tracked and cohort-relative top-10 concentration, explore a proportional treemap sized by USD value, filter by entity type, and click any wallet for its cohort, rank, value, and vault-candidate / migration-signal flags — all from a single focused surface.

This repo is a public-safe conceptual demo — part of the WalletWall org's public research and demonstration surface. It runs entirely on synthetic fixture data labeled with a demo snapshot date, not a live feed, and it is not the complete production application; see [`docs/PUBLIC_SAFE_SCOPE.md`](docs/PUBLIC_SAFE_SCOPE.md) for exactly what is and isn't in scope here.

Holder Wall is part of the [WalletWall](https://walletwall.org) analytics suite.

> **No wallet connection required.** Holder Wall never asks for private keys, seed phrases, or transaction signatures. All data is read-only from static fixture data unless wired by the user to their own read-only source.

## Disclaimers

- **Demo data only.** All values are synthetic fixture data by default.
- **No wallet connection.** This surface never connects to a wallet provider.
- **No custody.** No funds are held, managed, or accessed.
- **No signing.** No transaction construction or signing of any kind.
- **No transactions.** No on-chain write operations.
- **No paid Dune execution.** No live Dune query paths or paid analytics execution.
- **Not financial advice.** Nothing in this surface constitutes financial advice.
- **Not production quantum protection.** No quantum-resistant vault claims.

## Tech Stack

- React 19 + Vite 8
- Static fixture data (no live API dependencies)
- Vitest + Testing Library for tests

## Local Development

```bash
npm install
npm run dev
```

This starts the Vite dev server at `http://localhost:5173`. The app runs entirely on static fixture data — no API keys or environment variables required.

## Commands

```bash
npm run dev             # Vite dev server
npm run build           # Production build
npm run test            # Run test suite
npm run security:audit  # npm audit at moderate severity
npm run check           # test + build + audit
```

## Replacing Fixture Data

Holder Wall ships with synthetic demo data in `src/data/holder-wall.fixture.json`. To wire your own read-only holder data:

1. Replace the fixture file contents with your data, matching the schema in `docs/DATA_FIXTURES.md`.
2. Ensure your data source is read-only — no write access, no private keys, no paid Dune execution.
3. If connecting to Dune or a comparable analytics provider, build a server-side proxy that holds credentials outside this repository.

See `docs/DATA_FIXTURES.md` for the full fixture schema.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md). To report a vulnerability, open a GitHub Security Advisory or email security@walletwall.org.

## Data Attribution

All fixture data is synthetic and for demonstration purposes only. Demo addresses are clearly labeled and do not represent real entities.
