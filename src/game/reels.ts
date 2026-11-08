import {
  COLS,
  ROWS,
  SCATTERS_FOR_BONUS,
  STRIP_LEN,
  STRIP_PAD,
} from '../constants/config';
import { SYMBOLS, SymbolId } from './symbols';

/**
 * One weighted strip per reel, built once and shuffled. Low value symbols
 * appear many times, the arctic fox and the scatter only a handful.
 */
function buildStrip(reelIndex: number): SymbolId[] {
  const strip: SymbolId[] = [];
  SYMBOLS.forEach(s => {
    if (s.reels && s.reels.indexOf(reelIndex) === -1) {
      return;
    }
    for (let i = 0; i < s.weight; i++) {
      strip.push(s.key);
    }
  });
  for (let i = strip.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = strip[i];
    strip[i] = strip[j];
    strip[j] = tmp;
  }
  return strip;
}

const REEL_STRIPS: SymbolId[][] = [];
for (let c = 0; c < COLS; c++) {
  REEL_STRIPS.push(buildStrip(c));
}

export function pickSymbol(reelIndex: number): SymbolId {
  const strip = REEL_STRIPS[reelIndex % REEL_STRIPS.length];
  return strip[Math.floor(Math.random() * strip.length)];
}

/** grid[col][row] — 5 reels x 3 visible rows. Decided BEFORE the animation. */
export function generateGrid(luckBoost = 0, forceBonus = false): SymbolId[][] {
  const grid: SymbolId[][] = [];
  for (let c = 0; c < COLS; c++) {
    const col: SymbolId[] = [];
    for (let r = 0; r < ROWS; r++) {
      let id = pickSymbol(c);
      // Gentle pity curve: after a dry run the middle reels favour the wild.
      if (luckBoost > 0 && c > 0 && c < COLS - 1 && Math.random() < 0.12 * luckBoost) {
        id = 'wild';
      }
      col.push(id);
    }
    grid.push(col);
  }
  if (forceBonus) {
    // Plant the scatters on alternating reels so the win reads as a real hit.
    for (let i = 0; i < SCATTERS_FOR_BONUS; i++) {
      const c = Math.min((i * 2) % COLS, COLS - 1);
      grid[c][Math.floor(Math.random() * ROWS)] = 'scatter';
    }
  }
  return grid;
}

/**
 * A spinning strip for one reel: the NEW three symbols sit at the top,
 * random filler in the middle, the CURRENT three at the bottom. The column
 * starts translated so the current symbols are on screen and animates back
 * to 0, which reveals the new ones with a downward fall.
 */
export function buildSpinStrip(
  reelIndex: number,
  next: SymbolId[],
  current: SymbolId[],
): SymbolId[] {
  const strip: SymbolId[] = [pickSymbol(reelIndex), next[0], next[1], next[2]];
  const fillerLen = STRIP_LEN - 2 * ROWS - STRIP_PAD;
  for (let i = 0; i < fillerLen; i++) {
    strip.push(pickSymbol(reelIndex));
  }
  strip.push(current[0], current[1], current[2]);
  return strip;
}

export function initialGrid(): SymbolId[][] {
  return generateGrid();
}
