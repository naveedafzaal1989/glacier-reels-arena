import { COLS, ROWS, SCATTERS_FOR_BONUS } from '../constants/config';
import { PAYLINES } from './paylines';
import { getSymbol, SymbolId, TOP_SYMBOL } from './symbols';

export type WinCell = { col: number; row: number };

export type LineWin = {
  lineIndex: number;
  symbol: SymbolId;
  matches: number;
  amount: number;
  cells: WinCell[];
};

export type SpinResult = {
  total: number;
  lines: LineWin[];
  cells: WinCell[];
  /** "col-row" keys for a cheap lookup inside the board */
  cellKeys: string[];
  scatters: number;
  bonus: boolean;
  bestLine: number;
};

export function cellKey(col: number, row: number): string {
  return col + '-' + row;
}

function lineWin(
  grid: SymbolId[][],
  rows: number[],
  lineIndex: number,
  spinSize: number,
): LineWin | null {
  const first = grid[0][rows[0]];
  if (getSymbol(first).isScatter) {
    return null;
  }

  // The base symbol is the first non-wild one in the run.
  let base: SymbolId | null = getSymbol(first).isWild ? null : first;
  let matches = 0;
  const cells: WinCell[] = [];

  for (let c = 0; c < COLS; c++) {
    const id = grid[c][rows[c]];
    const def = getSymbol(id);
    if (def.isScatter) {
      break;
    }
    if (def.isWild) {
      matches++;
      cells.push({ col: c, row: rows[c] });
      continue;
    }
    if (base === null) {
      base = id;
    }
    if (id !== base) {
      break;
    }
    matches++;
    cells.push({ col: c, row: rows[c] });
  }

  if (matches < 3) {
    return null;
  }

  const symbol: SymbolId = base === null ? TOP_SYMBOL : base;
  const pays = getSymbol(symbol).pays;
  const amount = Math.round(pays[matches - 3] * (spinSize / 5));
  if (amount <= 0) {
    return null;
  }

  return {
    lineIndex,
    symbol,
    matches,
    amount,
    cells: cells.slice(0, matches),
  };
}

export function evaluateSpin(
  grid: SymbolId[][],
  spinSize: number,
  multiplier = 1,
): SpinResult {
  const lines: LineWin[] = [];
  let total = 0;
  let bestLine = 0;

  PAYLINES.forEach((rows, index) => {
    const win = lineWin(grid, rows, index, spinSize);
    if (win) {
      win.amount = win.amount * multiplier;
      lines.push(win);
      total += win.amount;
      if (win.amount > bestLine) {
        bestLine = win.amount;
      }
    }
  });

  let scatters = 0;
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (getSymbol(grid[c][r]).isScatter) {
        scatters++;
      }
    }
  }

  const cells: WinCell[] = [];
  const cellKeys: string[] = [];
  lines.forEach(l => {
    l.cells.forEach(cl => {
      const key = cellKey(cl.col, cl.row);
      if (cellKeys.indexOf(key) === -1) {
        cellKeys.push(key);
        cells.push(cl);
      }
    });
  });

  return {
    total,
    lines,
    cells,
    cellKeys,
    scatters,
    bonus: scatters >= SCATTERS_FOR_BONUS,
    bestLine,
  };
}

export const EMPTY_RESULT: SpinResult = {
  total: 0,
  lines: [],
  cells: [],
  cellKeys: [],
  scatters: 0,
  bonus: false,
  bestLine: 0,
};
