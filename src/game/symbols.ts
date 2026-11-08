export type SymbolId =
  | 'fox'
  | 'crystal'
  | 'coin'
  | 'runeA'
  | 'runeK'
  | 'runeQ'
  | 'wild'
  | 'scatter';

export type SymbolDef = {
  key: SymbolId;
  name: string;
  /** always null in this build — every symbol is a drawn frost rune */
  asset: any | null;
  /** short glyph used by the drawn frost runes */
  rune?: string;
  /** rune tint — keeps the three runes visually distinct */
  tint: string;
  /** payouts for 3 / 4 / 5 matching symbols at spin size 5 */
  pays: [number, number, number];
  /** reel strip weight — low value symbols are common */
  weight: number;
  isWild?: boolean;
  isScatter?: boolean;
  /** wild only lands on the middle reels, like a real five-reel machine */
  reels?: number[];
};

/**
 * ONE shared symbol pool. Every reel cell, the paytable screen and the
 * evaluator read from this single array (slot-game-pro section 3).
 */
export const SYMBOLS: SymbolDef[] = [
  {
    key: 'fox',
    name: 'ARCTIC FOX',
    asset: null,
    rune: 'F',
    tint: '#EDFAFF',
    pays: [18, 72, 270],
    weight: 6,
  },
  {
    key: 'crystal',
    name: 'ICE CRYSTAL',
    asset: null,
    rune: 'C',
    tint: '#5AD1E8',
    pays: [13, 50, 180],
    weight: 9,
  },
  {
    key: 'coin',
    name: 'SNOW COIN',
    asset: null,
    rune: 'O',
    tint: '#B8F2A0',
    pays: [8, 34, 120],
    weight: 12,
  },
  {
    key: 'runeA',
    name: 'FROST A',
    asset: null,
    rune: 'A',
    tint: '#5AD1E8',
    pays: [3, 13, 52],
    weight: 22,
  },
  {
    key: 'runeK',
    name: 'FROST K',
    asset: null,
    rune: 'K',
    tint: '#B8F2A0',
    pays: [3, 13, 52],
    weight: 22,
  },
  {
    key: 'runeQ',
    name: 'FROST Q',
    asset: null,
    rune: 'Q',
    tint: '#8FB7CE',
    pays: [3, 13, 52],
    weight: 22,
  },
  {
    key: 'wild',
    name: 'PENGUIN WILD',
    asset: null,
    rune: 'W',
    tint: '#EDFAFF',
    pays: [18, 72, 270],
    weight: 4,
    isWild: true,
    reels: [1, 2, 3],
  },
  {
    key: 'scatter',
    name: 'AURORA SCATTER',
    asset: null,
    rune: '★',
    tint: '#B8F2A0',
    pays: [0, 0, 0],
    weight: 3,
    isScatter: true,
  },
];

const BY_KEY: Record<SymbolId, SymbolDef> = SYMBOLS.reduce((acc, s) => {
  acc[s.key] = s;
  return acc;
}, {} as Record<SymbolId, SymbolDef>);

export function getSymbol(id: SymbolId): SymbolDef {
  return BY_KEY[id];
}

/** The highest paying symbol — a line of pure wilds pays as this one. */
export const TOP_SYMBOL: SymbolId = 'fox';
