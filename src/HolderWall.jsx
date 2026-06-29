import { useState } from 'react';
import fixture from './data/holder-wall.fixture.json';
import Disclaimer from './components/Disclaimer.jsx';
import './HolderWall.css';

function getEntityColor(type) {
  switch (type) {
    case 'exchange':    return '#5B7EA6';
    case 'protocol':    return '#7A6B9E';
    case 'whale':       return '#BF4E32';
    case 'institution': return '#2F8F67';
    default:            return '#C9A47A';
  }
}

function fmtUSD(v) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v}`;
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

function Treemap({ holders, selectedRank, onSelect }) {
  const total = holders.reduce((s, h) => s + h.value_usd, 0);

  return (
    <div className="hw-treemap" aria-label="Holder distribution treemap">
      {holders.map((holder) => {
        const pct = (holder.value_usd / total) * 100;
        const color = getEntityColor(holder.type);
        const isSelected = selectedRank === holder.rank;
        return (
          <button
            key={holder.rank}
            className={`hw-tile${isSelected ? ' hw-tile--selected' : ''}`}
            style={{
              flexBasis: `${Math.max(pct * 1.5, 8)}%`,
              flexGrow: pct,
              background: color + (isSelected ? 'EE' : '28'),
              borderColor: isSelected ? color : color + '44',
            }}
            onClick={() => onSelect(isSelected ? null : holder.rank)}
            aria-pressed={isSelected}
            aria-label={`${holder.label}, ${holder.pct_supply.toFixed(2)}% of supply`}
          >
            <div
              className="hw-tile__symbol"
              style={{ color: isSelected ? '#fff' : color }}
            >
              {holder.rank}
            </div>
            <div
              className="hw-tile__label"
              style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(30,26,20,0.7)' }}
            >
              {holder.label}
            </div>
            <div
              className="hw-tile__pct"
              style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(30,26,20,0.45)' }}
            >
              {holder.pct_supply.toFixed(2)}%
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function HolderWall() {
  const [selectedRank, setSelectedRank] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const kpis = fixture.kpis;
  const token = fixture.token;

  const TYPES = ['all', 'exchange', 'protocol', 'whale', 'institution'];

  const filtered = typeFilter === 'all'
    ? fixture.holders
    : fixture.holders.filter((h) => h.type === typeFilter);

  const selected = selectedRank
    ? fixture.holders.find((h) => h.rank === selectedRank)
    : null;

  return (
    <div className="hw-root" data-testid="holder-wall">
      <div className="hw-header">
        <div>
          <div className="ww-label" style={{ marginBottom: 4 }}>Holder Wall</div>
          <h1 className="hw-heading">
            {token.symbol} Holder Distribution
            <span className="hw-chain-badge">{token.chain}</span>
          </h1>
          <p className="hw-subheading">
            Read-only holder exposure map — demo fixture data only.
          </p>
        </div>
      </div>

      <Disclaimer />

      <div className="hw-kpis">
        <KpiCard
          label="Total Holders"
          value={kpis.total_holders.toLocaleString()}
        />
        <KpiCard
          label="Total Supply"
          value={fmtUSD(kpis.total_supply_usd)}
        />
        <KpiCard
          label="Top 10 Hold"
          value={`${kpis.top_10_pct_of_supply}%`}
          sub="of supply"
        />
        <KpiCard
          label="Top 100 Hold"
          value={`${kpis.top_100_pct_of_supply}%`}
          sub="of supply"
        />
        <KpiCard
          label="Median Hold"
          value={`${kpis.median_hold_days}d`}
          sub="days held"
        />
      </div>

      <div className="hw-filters">
        {TYPES.map((t) => (
          <button
            key={t}
            className={`hw-filter-btn${typeFilter === t ? ' hw-filter-btn--active' : ''}`}
            onClick={() => { setTypeFilter(t); setSelectedRank(null); }}
            style={typeFilter === t && t !== 'all'
              ? { borderColor: getEntityColor(t), color: getEntityColor(t) }
              : undefined}
          >
            {t === 'all' ? 'All entities' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
          </button>
        ))}
      </div>

      <div className="hw-body">
        <div className="hw-main">
          <Treemap
            holders={filtered}
            selectedRank={selectedRank}
            onSelect={setSelectedRank}
          />

          <div className="hw-leaderboard">
            <div className="ww-label" style={{ marginBottom: 10 }}>Top Holders</div>
            {filtered.map((holder) => (
              <button
                key={holder.rank}
                className={`hw-lb-row${selectedRank === holder.rank ? ' hw-lb-row--selected' : ''}`}
                onClick={() => setSelectedRank(selectedRank === holder.rank ? null : holder.rank)}
                aria-pressed={selectedRank === holder.rank}
              >
                <span className="hw-lb-rank">#{holder.rank}</span>
                <span
                  className="hw-lb-dot"
                  style={{ background: getEntityColor(holder.type) }}
                  aria-hidden="true"
                />
                <span className="hw-lb-label">{holder.label}</span>
                <span className="hw-lb-type">{holder.type}</span>
                <span className="hw-lb-value">{fmtUSD(holder.value_usd)}</span>
                <span className="hw-lb-pct">{holder.pct_supply.toFixed(2)}%</span>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="hw-detail" data-testid="holder-detail">
            <div className="ww-label" style={{ marginBottom: 10 }}>Holder Detail</div>
            <div className="hw-detail__title">{selected.label}</div>
            <div
              className="ww-badge"
              style={{
                background: getEntityColor(selected.type) + '22',
                color: getEntityColor(selected.type),
                border: `1px solid ${getEntityColor(selected.type)}44`,
                marginBottom: 16,
              }}
            >
              {selected.type}
            </div>

            {[
              ['Rank',          `#${selected.rank}`],
              ['Value (demo)',  fmtUSD(selected.value_usd)],
              ['% of Supply',   `${selected.pct_supply.toFixed(2)}%`],
              ['Days Held',     `${selected.hold_days}d`],
              ['Address (demo)', selected.address_demo],
            ].map(([k, v]) => (
              <div key={k} className="hw-detail__row">
                <span className="hw-detail__key">{k}</span>
                <span className="hw-detail__val">{v}</span>
              </div>
            ))}

            <button className="hw-detail__close" onClick={() => setSelectedRank(null)}>
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
