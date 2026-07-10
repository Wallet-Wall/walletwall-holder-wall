import { useMemo, useState } from 'react';
import fixture from './data/holder-wall.fixture.json';
import Disclaimer from './components/Disclaimer.jsx';
import './HolderWall.css';

// Kept in sync with the WalletWall product's current Holder Wall entity
// classifications. "protocol" was removed upstream — protocol/contract
// addresses are non-navigable and were excluded from every cohort, so the
// filter always resolved to an empty view. This demo never had that data
// path to begin with, but the type list is kept aligned so it doesn't drift.
const ENTITY_TYPES = ['all', 'whale', 'exchange', 'institution'];

const ENTITY_TYPE_LABEL = {
  all:         'All entities',
  whale:       'Whale',
  exchange:    'Exchange',
  institution: 'Institution',
};

function getEntityColor(type) {
  switch (type) {
    case 'exchange':    return '#5B7EA6';
    case 'whale':       return '#BF4E32';
    case 'institution': return '#2F8F67';
    default:            return '#C9A47A'; // unclassified wallet
  }
}

function fmtUSD(v) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v}`;
}

// Rank is derived from sort order, never stored in the fixture — mirrors how
// the real Holder Wall computes rank from the current query result rather
// than a fixed field, so re-filtering a cohort re-ranks it honestly.
function rankWallets(wallets) {
  return [...wallets]
    .sort((a, b) => b.value_usd - a.value_usd)
    .map((w, i) => ({ ...w, rank: i + 1 }));
}

// Top 10 concentration is relative to the wallets CURRENTLY VISIBLE in this
// cohort/filter — never a percentage of a token's total circulating supply.
// A demo cohort of 8 wallets reporting "62% held by the top 10" would be
// nonsensical read as "supply concentration"; read as "cohort concentration"
// it is an honest (if small-sample) illustration of the real metric's shape.
function top10ConcentrationPct(wallets) {
  const values = wallets.map((w) => w.value_usd).filter((v) => v > 0).sort((a, b) => b - a);
  const total = values.reduce((s, v) => s + v, 0);
  if (total <= 0) return null;
  const top10 = values.slice(0, 10).reduce((s, v) => s + v, 0);
  return (top10 / total) * 100;
}

function walletSecondary(wallet, cohortId) {
  if (cohortId === 'whale') {
    return `${wallet.trades} whale trade${wallet.trades === 1 ? '' : 's'} · ${fmtUSD(wallet.value_usd)}`;
  }
  if (cohortId === 'dormant') {
    return `${wallet.daysDormant}d dormant · est. balance`;
  }
  return `${wallet.txCount} txs · ${fmtUSD(wallet.value_usd)}`;
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="hw-kpi">
      <div className="hw-kpi__label">{label}</div>
      <div className="hw-kpi__value">{value}</div>
      {sub && <div className="hw-kpi__sub">{sub}</div>}
    </div>
  );
}

function Treemap({ wallets, selectedKey, onSelect }) {
  const total = wallets.reduce((s, w) => s + w.value_usd, 0);

  return (
    <div className="hw-treemap" aria-label="Wallet cohort treemap">
      {wallets.map((wallet) => {
        const pct = total > 0 ? (wallet.value_usd / total) * 100 : 0;
        const color = getEntityColor(wallet.holderType);
        const isSelected = selectedKey === wallet.address_demo;
        return (
          <button
            key={wallet.address_demo}
            className={`hw-tile${isSelected ? ' hw-tile--selected' : ''}`}
            style={{
              flexBasis: `${Math.max(pct * 1.5, 8)}%`,
              flexGrow: pct,
              background: color + (isSelected ? 'EE' : '28'),
              borderColor: isSelected ? color : color + '44',
            }}
            onClick={() => onSelect(isSelected ? null : wallet.address_demo)}
            aria-pressed={isSelected}
            aria-label={`${wallet.label}, rank ${wallet.rank}`}
          >
            <div className="hw-tile__symbol" style={{ color: isSelected ? '#fff' : color }}>
              {wallet.rank}
            </div>
            <div
              className="hw-tile__label"
              style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(30,26,20,0.7)' }}
            >
              {wallet.label}
            </div>
            <div
              className="hw-tile__pct"
              style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(30,26,20,0.45)' }}
            >
              {fmtUSD(wallet.value_usd)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function HolderWall() {
  const cohorts = fixture.cohorts;
  const [activeCohortId, setActiveCohortId] = useState(cohorts[0].id);
  const [entityType, setEntityType] = useState('all');
  const [selectedKey, setSelectedKey] = useState(null);

  const activeCohort = cohorts.find((c) => c.id === activeCohortId) ?? cohorts[0];

  const rankedWallets = useMemo(() => rankWallets(activeCohort.wallets), [activeCohort]);

  const filtered = entityType === 'all'
    ? rankedWallets
    : rankedWallets.filter((w) => w.holderType === entityType);

  const selected = selectedKey
    ? rankedWallets.find((w) => w.address_demo === selectedKey) ?? null
    : null;

  // Not deduplicated across cohorts — a wallet that shows up in both Active
  // and Whale (see fixture note) is counted once per cohort here, matching
  // the real Holder Wall's top-level KPI strip.
  const totalWalletsTracked = cohorts.reduce((s, c) => s + c.wallets.length, 0);
  const whaleCohort = cohorts.find((c) => c.id === 'whale');
  const activeWalletsCohort = cohorts.find((c) => c.id === 'active');
  const concentrationPct = top10ConcentrationPct(filtered);

  const selectCohort = (id) => {
    setActiveCohortId(id);
    setEntityType('all');
    setSelectedKey(null);
  };

  return (
    <div className="hw-root" data-testid="holder-wall">
      <div className="hw-header">
        <div>
          <div className="ww-label" style={{ marginBottom: 4 }}>Holder Wall</div>
          <h1 className="hw-heading">
            Wallet Cohort Explorer
            <span className="hw-chain-badge">{fixture.network}</span>
          </h1>
          <p className="hw-subheading">
            Vault-candidate discovery across scheduled wallet cohorts — not a single token's holder list.
          </p>
        </div>
      </div>

      <Disclaimer />

      <div className="hw-kpis">
        <KpiCard label="Wallets Tracked" value={totalWalletsTracked.toLocaleString()} />
        <KpiCard label="Whale Wallets" value={whaleCohort.wallets.length.toLocaleString()} />
        <KpiCard label="Active Wallets" value={activeWalletsCohort.wallets.length.toLocaleString()} />
        <KpiCard
          label="Top 10 Concentration"
          value={concentrationPct == null ? '—' : `${concentrationPct.toFixed(1)}%`}
          sub="of this cohort's USD value"
        />
        <KpiCard label="Snapshot" value={fixture.as_of} sub="demo snapshot, not live" />
      </div>

      <div className="hw-tabs" role="tablist" aria-label="Wallet cohort">
        {cohorts.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === activeCohortId}
            className={`hw-tab${c.id === activeCohortId ? ' hw-tab--active' : ''}`}
            onClick={() => selectCohort(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="hw-cohort-desc">{activeCohort.description}</p>

      {activeCohort.id === 'dormant' && (
        <div className="hw-estimate-banner" role="note">
          Balances in this cohort are a proxy estimate, not a live on-chain balance.
        </div>
      )}

      <div className="hw-filters">
        {ENTITY_TYPES.map((t) => (
          <button
            key={t}
            className={`hw-filter-btn${entityType === t ? ' hw-filter-btn--active' : ''}`}
            onClick={() => { setEntityType(t); setSelectedKey(null); }}
            style={entityType === t && t !== 'all'
              ? { borderColor: getEntityColor(t), color: getEntityColor(t) }
              : undefined}
          >
            {ENTITY_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="hw-body">
        <div className="hw-main">
          <Treemap wallets={filtered} selectedKey={selectedKey} onSelect={setSelectedKey} />

          <div className="hw-leaderboard">
            <div className="ww-label" style={{ marginBottom: 10 }}>{activeCohort.name}</div>
            {filtered.map((wallet) => (
              <button
                key={wallet.address_demo}
                className={`hw-lb-row${selectedKey === wallet.address_demo ? ' hw-lb-row--selected' : ''}`}
                onClick={() => setSelectedKey(selectedKey === wallet.address_demo ? null : wallet.address_demo)}
                aria-pressed={selectedKey === wallet.address_demo}
              >
                <span className="hw-lb-rank">#{wallet.rank}</span>
                <span
                  className="hw-lb-dot"
                  style={{ background: getEntityColor(wallet.holderType) }}
                  aria-hidden="true"
                />
                <span className="hw-lb-label">{wallet.label}</span>
                <span className="hw-lb-type">{wallet.holderType}</span>
                <span className="hw-lb-value">{fmtUSD(wallet.value_usd)}</span>
                <span className="hw-lb-secondary">{walletSecondary(wallet, activeCohort.id)}</span>
                {wallet.vaultCandidate && <span className="hw-lb-flag hw-lb-flag--candidate">Vault candidate</span>}
                {wallet.migrationSignal && <span className="hw-lb-flag hw-lb-flag--signal">Migration signal</span>}
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="hw-detail" data-testid="holder-detail">
            <div className="ww-label" style={{ marginBottom: 10 }}>Wallet Detail</div>
            <div className="hw-detail__title">{selected.label}</div>
            <div
              className="ww-badge"
              style={{
                background: getEntityColor(selected.holderType) + '22',
                color: getEntityColor(selected.holderType),
                border: `1px solid ${getEntityColor(selected.holderType)}44`,
                marginBottom: 16,
              }}
            >
              {selected.holderType}
            </div>

            {[
              ['Cohort',   activeCohort.name],
              ['Rank',     `#${selected.rank}`],
              [
                activeCohort.id === 'dormant' ? 'Value (estimated)' : 'Value (demo)',
                fmtUSD(selected.value_usd),
              ],
              ...(activeCohort.id === 'dormant'
                ? [['Days Dormant', `${selected.daysDormant}d`]]
                : []),
              ...(selected.vaultCandidate != null ? [['Vault Candidate', selected.vaultCandidate ? 'Yes' : 'No']] : []),
              ...(selected.migrationSignal != null ? [['Migration Signal', selected.migrationSignal ? 'Yes' : 'No']] : []),
              ['Address (demo)', selected.address_demo],
            ].map(([k, v]) => (
              <div key={k} className="hw-detail__row">
                <span className="hw-detail__key">{k}</span>
                <span className="hw-detail__val">{v}</span>
              </div>
            ))}

            <button className="hw-detail__close" onClick={() => setSelectedKey(null)}>
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
