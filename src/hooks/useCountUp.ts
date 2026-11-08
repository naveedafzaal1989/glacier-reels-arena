import { useEffect, useRef, useState } from 'react';
import { COUNT_UP_MS } from '../constants/config';

/** Ticks a displayed number towards `target` with an ease-out curve. */
export function useCountUp(target: number, duration: number = COUNT_UP_MS) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = valueRef.current;
    if (from === target) {
      return;
    }
    const startedAt = Date.now();

    const tick = () => {
      const t = Math.min(1, (Date.now() - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (target - from) * eased);
      valueRef.current = next;
      setValue(next);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, duration]);

  return value;
}

export default useCountUp;
