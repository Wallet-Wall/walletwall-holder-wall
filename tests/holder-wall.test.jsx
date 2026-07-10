import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HolderWall from '../src/HolderWall.jsx';
import fixture from '../src/data/holder-wall.fixture.json';

const activeCohort = fixture.cohorts.find((c) => c.id === 'active');
const whaleCohort = fixture.cohorts.find((c) => c.id === 'whale');
const dormantCohort = fixture.cohorts.find((c) => c.id === 'dormant');

describe('Holder Wall', () => {
  it('renders the surface', () => {
    render(<HolderWall />);
    expect(screen.getByTestId('holder-wall')).toBeInTheDocument();
  });

  it('renders KPI cards for the cohort model', () => {
    render(<HolderWall />);
    expect(screen.getByText('Wallets Tracked')).toBeInTheDocument();
    // "Whale Wallets" / "Active Wallets" label both the KPI card and the
    // matching cohort tab, so more than one match is expected here.
    expect(screen.getAllByText('Whale Wallets').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Active Wallets').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Top 10 Concentration')).toBeInTheDocument();
    expect(screen.getByText('Snapshot')).toBeInTheDocument();
  });

  it('defaults to the Active Wallets cohort and renders its wallet labels', () => {
    render(<HolderWall />);
    for (const wallet of activeCohort.wallets) {
      expect(screen.getAllByText(wallet.label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders one treemap tile per visible wallet', () => {
    render(<HolderWall />);
    const tiles = screen.getAllByRole('button', { name: (n) => n.includes('rank') });
    expect(tiles.length).toBe(activeCohort.wallets.length);
  });

  it('switches cohorts via the tab bar', () => {
    render(<HolderWall />);
    fireEvent.click(screen.getByRole('tab', { name: 'Whale Wallets' }));
    for (const wallet of whaleCohort.wallets) {
      expect(screen.getAllByText(wallet.label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('shows the estimated-balance banner only for the Dormant Wallets cohort', () => {
    render(<HolderWall />);
    expect(screen.queryByRole('note')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Dormant Wallets' }));
    expect(screen.getByRole('note')).toHaveTextContent(/proxy estimate/i);
    for (const wallet of dormantCohort.wallets) {
      expect(screen.getAllByText(wallet.label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('shows wallet detail on leaderboard row click', () => {
    render(<HolderWall />);
    fireEvent.click(screen.getAllByText(activeCohort.wallets[0].label)[0]);
    expect(screen.getByTestId('holder-detail')).toBeInTheDocument();
  });

  it('filters the active cohort by entity type, with no protocol option', () => {
    render(<HolderWall />);
    expect(screen.queryByText('Protocol')).not.toBeInTheDocument();
    expect(screen.queryByText(/protocols/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Whale'));
    const whaleWallets = activeCohort.wallets.filter((w) => w.holderType === 'whale');
    for (const w of whaleWallets) {
      expect(screen.getAllByText(w.label).length).toBeGreaterThanOrEqual(1);
    }
    const nonWhale = activeCohort.wallets.find((w) => w.holderType !== 'whale');
    expect(screen.queryAllByText(nonWhale.label)).toHaveLength(0);
  });

  it('marks vault-candidate and migration-signal wallets in the Dormant cohort', () => {
    render(<HolderWall />);
    fireEvent.click(screen.getByRole('tab', { name: 'Dormant Wallets' }));
    const candidateWallet = dormantCohort.wallets.find((w) => w.vaultCandidate);
    const row = screen.getAllByText(candidateWallet.label)
      .map((el) => el.closest('.hw-lb-row'))
      .find(Boolean);
    expect(within(row).getByText('Vault candidate')).toBeInTheDocument();
  });

  it('shows disclaimer', () => {
    render(<HolderWall />);
    expect(screen.getByTestId('disclaimer')).toBeInTheDocument();
  });
});
