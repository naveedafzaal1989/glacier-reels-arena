import { Dimensions } from 'react-native';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Splash duration — EXACTLY 8000ms (codegen rule #13). */
export const LOADER_DURATION_MS = 8000;

/* ---------------------------------------------------------------- *
 * Reel board geometry (codegen rules #4 / #5)
 * The parent width does NOT include padding for the children's
 * content area, so the frame is subtracted before the cell divide.
 * ---------------------------------------------------------------- */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const COLS = 5;
export const ROWS = 3;
/** header + stat strip + controls block + breathing room */
export const GAME_CHROME_H = 116 + 58 + 248 + 24;
const CELL_BY_W = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / COLS);
const CELL_BY_H = Math.floor(
  (SCREEN_H - GAME_CHROME_H - 2 * BOARD_FRAME) / ROWS,
);
/** the board never outgrows the width OR the height left by the chrome */
export const CELL = Math.max(44, Math.min(CELL_BY_W, CELL_BY_H));
export const BOARD_W = CELL * COLS + 2 * BOARD_FRAME;
export const BOARD_H = CELL * ROWS + 2 * BOARD_FRAME;

/* ---------------------------------------------------------------- *
 * Reel strip / spin timing
 * ---------------------------------------------------------------- */
/** 1 pad cell + 3 new symbols + 9 filler + the 3 symbols we spin away from */
export const STRIP_PAD = 1;
export const STRIP_LEN = 16;
/** resting translateY — the pad cell is parked just above the window */
export const STRIP_REST_Y = -STRIP_PAD * CELL;
/** translateY the strip starts at, so the OLD grid is still on screen */
export const STRIP_START_Y = -(STRIP_LEN - ROWS) * CELL;
export const REEL_SPIN_MS = 850;
export const REEL_STAGGER_MS = 170;
export const REEL_TURBO_SPIN_MS = 420;
export const REEL_TURBO_STAGGER_MS = 80;
export const WIN_LIFT_MS = 300;
export const COUNT_UP_MS = 600;

/* ---------------------------------------------------------------- *
 * Virtual economy — VIRTUAL COINS ONLY, nothing is for sale.
 * ---------------------------------------------------------------- */
export const START_BALANCE = 10000;
export const DAILY_FLOOR = 500;
export const REFILL_TO = 10000;
export const SPIN_SIZES = [5, 10, 25, 50, 100, 250];
export const DEFAULT_SPIN_INDEX = 2; // 25
/** paid spins before the Spin Tally (gameover) screen is shown */
export const SESSION_LENGTH = 5;

/* ---------------------------------------------------------------- *
 * Bonus (free spins)
 * ---------------------------------------------------------------- */
export const FREE_SPINS = 8;
export const SCATTERS_FOR_BONUS = 3;
/** spins without a bonus after which the next one is guaranteed */
export const BONUS_PITY_SPINS = 3;
/** multiplier applied at free spin index 0,2,4,6 */
export const BONUS_MULTIPLIERS = [1, 2, 3, 5];

/* ---------------------------------------------------------------- *
 * Arenas — unlocked by SPIN COUNT only. Nothing is for sale.
 * ---------------------------------------------------------------- */
export const ARENAS = [
  { id: 'bay', label: 'GLACIER BAY', unlockAt: 0 },
  { id: 'ridge', label: 'AURORA RIDGE', unlockAt: 100 },
  { id: 'crown', label: 'FROST CROWN', unlockAt: 250 },
];

/* ---------------------------------------------------------------- *
 * Compliance copy (18+, virtual coins only)
 * ---------------------------------------------------------------- */
export const VIRTUAL_LABEL = 'VIRTUAL COINS';
export const NOTICE_LINES = [
  'ENTERTAINMENT ONLY  ·  NO REAL MONEY IS INVOLVED',
  'COINS ARE VIRTUAL AND HAVE NO VALUE',
  'COINS CANNOT BE BOUGHT, SOLD OR CASHED OUT',
  'THIS APP IS INTENDED FOR PLAYERS AGED 18+',
];
export const COMPLIANCE_FOOTER =
  'COINS ARE VIRTUAL  ·  NOTHING TO WIN OR BUY  ·  18+';
export const REFILL_TOAST = 'DAILY SNOW COIN REFILL  ·  VIRTUAL COINS';
