import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HolderWall from '../src/HolderWall.jsx';
import fixture from '../src/data/holder-wall.fixture.json';

describe('Holder Wall', () => {
  it('renders the surface', () => {
    render(<HolderWall />);
    expect(screen.getByTestId('holder-wall')).toBeInTheDocument();
  });

  it('renders KPI cards', () => {
    render(<HolderWall />);
    expect(screen.getByText('Total Holders')).toBeInTheDocument();
    expect(screen.getByText('Total Supply')).toBeInTheDocument();
    expect(screen.getByText('Top 10 Hold')).toBeInTheDocument();
    expect(screen.getByText('Top 100 Hold')).toBeInTheDocument();
  });

  it('renders fixture holder labels', () => {
    render(<HolderWall />);
    for (const holder of fixture.holders) {
      expect(screen.getAllByText(holder.label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders treemap tiles for each holder', () => {
    render(<HolderWall />);
    const tiles = screen.getAllByRole('button', {
      name: (n) => n.includes('% of supply'),
    });
    expect(tiles.length).toBe(fixture.holders.length);
  });

  it('shows holder detail on leaderboard row click', () => {
    render(<HolderWall />);
    fireEvent.click(screen.getAllByText(fixture.holders[0].label)[0]);
    expect(screen.getByTestId('holder-detail')).toBeInTheDocument();
  });

  it('filters by entity type', () => {
    render(<HolderWall />);
    fireEvent.click(screen.getByText('Whales'));
    const whaleHolders = fixture.holders.filter((h) => h.type === 'whale');
    for (const h of whaleHolders) {
      expect(screen.getAllByText(h.label).length).toBeGreaterThanOrEqual(1);
    }
    const nonWhale = fixture.holders.find((h) => h.type !== 'whale');
    expect(screen.queryAllByText(nonWhale.label)).toHaveLength(0);
  });

  it('shows disclaimer', () => {
    render(<HolderWall />);
    expect(screen.getByTestId('disclaimer')).toBeInTheDocument();
  });
});
