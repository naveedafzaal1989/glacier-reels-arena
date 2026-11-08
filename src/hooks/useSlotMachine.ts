import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  BONUS_PITY_SPINS,
  CELL,
  COLS,
  REEL_SPIN_MS,
  REEL_STAGGER_MS,
  REEL_TURBO_SPIN_MS,
  REEL_TURBO_STAGGER_MS,
  STRIP_REST_Y,
  STRIP_START_Y,
} from '../constants/config';
import { EMPTY_RESULT, SpinResult, evaluateSpin } from '../game/evaluate';
import { buildSpinStrip, generateGrid, initialGrid } from '../game/reels';
import { SymbolId } from '../game/symbols';

export type SpinOptions = {
  turbo?: boolean;
  multiplier?: number;
  onDone?: (result: SpinResult, grid: SymbolId[][]) => void;
};

/**
 * The reel engine. The final grid is decided BEFORE the animation runs; the
 * animation only reveals it. One Animated.Value per reel so the columns can
 * brake one after another, left to right.
 */
export function useSlotMachine() {
  const gridRef = useRef<SymbolId[][]>(initialGrid());
  const [grid, setGrid] = useState<SymbolId[][]>(gridRef.current);
  const [strips, setStrips] = useState<SymbolId[][]>(() =>
    gridRef.current.map((col, i) => buildSpinStrip(i, col, col)),
  );
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult>(EMPTY_RESULT);

  const spinningRef = useRef(false);
  const lossStreak = useRef(0);
  const bonusDry = useRef(0);
  const mounted = useRef(true);

  const offsets = useRef(
    Array.from({ length: COLS }, () => new Animated.Value(STRIP_REST_Y)),
  ).current;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      offsets.forEach(o => o.stopAnimation());
    };
  }, [offsets]);

  const spin = useCallback(
    (spinSize: number, options: SpinOptions = {}) => {
      if (spinningRef.current) {
        return false;
      }
      const { turbo = false, multiplier = 1, onDone } = options;

      spinningRef.current = true;
      setSpinning(true);
      setResult(EMPTY_RESULT);

      const next = generateGrid(
        lossStreak.current >= 5 ? 1 : 0,
        bonusDry.current >= BONUS_PITY_SPINS,
      );
      const nextStrips = next.map((col, i) =>
        buildSpinStrip(i, col, gridRef.current[i]),
      );

      offsets.forEach(o => o.setValue(STRIP_START_Y));
      setStrips(nextStrips);

      const base = turbo ? REEL_TURBO_SPIN_MS : REEL_SPIN_MS;
      const stagger = turbo ? REEL_TURBO_STAGGER_MS : REEL_STAGGER_MS;

      const runs = offsets.map((offset, i) =>
        Animated.sequence([
          Animated.timing(offset, {
            toValue: STRIP_REST_Y + CELL * 0.12,
            duration: base + i * stagger,
            easing: Easing.bezier(0.05, 0.7, 0.15, 1),
            useNativeDriver: true,
          }),
          Animated.spring(offset, {
            toValue: STRIP_REST_Y,
            tension: 170,
            friction: 11,
            useNativeDriver: true,
          }),
        ]),
      );

      Animated.parallel(runs).start(() => {
        if (!mounted.current) {
          return;
        }
        gridRef.current = next;
        setGrid(next);

        const res = evaluateSpin(next, spinSize, multiplier);
        lossStreak.current = res.total > 0 ? 0 : lossStreak.current + 1;
        bonusDry.current = res.bonus ? 0 : bonusDry.current + 1;

        setResult(res);
        spinningRef.current = false;
        setSpinning(false);

        if (onDone) {
          onDone(res, next);
        }
      });

      return true;
    },
    [offsets],
  );

  const clearResult = useCallback(() => {
    setResult(EMPTY_RESULT);
  }, []);

  return {
    grid,
    strips,
    offsets,
    spinning,
    spinningRef,
    result,
    spin,
    clearResult,
  };
}

export default useSlotMachine;
