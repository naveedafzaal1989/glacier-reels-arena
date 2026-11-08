import { useCallback, useRef, useState } from 'react';
import {
  DAILY_FLOOR,
  DEFAULT_SPIN_INDEX,
  REFILL_TO,
  SPIN_SIZES,
  START_BALANCE,
} from '../constants/config';

/**
 * The virtual snow coin wallet. Coins are entertainment only: they cannot be
 * bought, sold or cashed out, and the balance refills itself for free once it
 * drops under the daily floor — there is no purchase path anywhere.
 */
export function useVirtualBalance() {
  const [balance, setBalance] = useState(START_BALANCE);
  const [spinIndex, setSpinIndex] = useState(DEFAULT_SPIN_INDEX);
  const [refilled, setRefilled] = useState(0);
  const balanceRef = useRef(START_BALANCE);
  const spinIndexRef = useRef(DEFAULT_SPIN_INDEX);

  const spinSize = SPIN_SIZES[spinIndex];

  const write = useCallback((next: number) => {
    balanceRef.current = next;
    setBalance(next);
  }, []);

  const charge = useCallback(
    (amount: number) => {
      if (balanceRef.current < amount) {
        return false;
      }
      write(balanceRef.current - amount);
      return true;
    },
    [write],
  );

  const award = useCallback(
    (amount: number) => {
      if (amount <= 0) {
        return;
      }
      write(balanceRef.current + amount);
    },
    [write],
  );

  /** Free, automatic top-up. Returns true when it actually fired. */
  const ensureFloor = useCallback(() => {
    if (balanceRef.current >= DAILY_FLOOR) {
      return false;
    }
    write(REFILL_TO);
    setRefilled(n => n + 1);
    return true;
  }, [write]);

  const reset = useCallback(() => {
    write(REFILL_TO);
    setRefilled(n => n + 1);
  }, [write]);

  const stepSpinSize = useCallback((delta: number) => {
    setSpinIndex(prev => {
      const next = Math.min(SPIN_SIZES.length - 1, Math.max(0, prev + delta));
      spinIndexRef.current = next;
      return next;
    });
  }, []);

  return {
    balance,
    balanceRef,
    spinSize,
    spinIndex,
    spinSizes: SPIN_SIZES,
    stepSpinSize,
    charge,
    award,
    ensureFloor,
    reset,
    refilled,
  };
}

export default useVirtualBalance;
