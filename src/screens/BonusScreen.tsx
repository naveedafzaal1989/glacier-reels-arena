import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import BalanceBadge from '../components/BalanceBadge';
import MultiplierChip from '../components/MultiplierChip';
import ReelBoard from '../components/ReelBoard';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import StatStrip, { StatItem } from '../components/StatStrip';
import WinToast from '../components/WinToast';
import { BONUS_MULTIPLIERS, FREE_SPINS } from '../constants/config';
import theme from '../constants/theme';
import { SpinResult } from '../game/evaluate';
import useCountUp from '../hooks/useCountUp';
import useSlotMachine from '../hooks/useSlotMachine';
import { formatCoins, formatDelta } from '../utils/format';

type Props = {
  balance: number;
  spinSize: number;
  onAward: (amount: number) => void;
  onDone: (total: number) => void;
};

function multiplierFor(index: number): number {
  const step = Math.min(BONUS_MULTIPLIERS.length - 1, Math.floor(index / 2));
  return BONUS_MULTIPLIERS[step];
}

/**
 * Aurora Bonus — free spins. No spin size is charged here: the reels run on
 * their own with a growing multiplier, then the app returns to the arena.
 */
export default function BonusScreen({
  balance,
  spinSize,
  onAward,
  onDone,
}: Props) {
  const { strips, offsets, spinning, spinningRef, result, spin } = useSlotMachine();
  const [spinsLeft, setSpinsLeft] = useState(FREE_SPINS);
  const [multiplier, setMultiplier] = useState(BONUS_MULTIPLIERS[0]);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<{ key: number; text: string } | null>(null);

  const doneCount = useRef(0);
  const totalRef = useRef(0);
  const mounted = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runner = useRef<() => void>(() => {});
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const onAwardRef = useRef(onAward);
  onAwardRef.current = onAward;

  const flash = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const shownBalance = useCountUp(balance);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (mounted.current) {
        fn();
      }
    }, ms);
    timers.current.push(id);
  }, []);

  const handleResult = useCallback(
    (res: SpinResult) => {
      if (!mounted.current) {
        return;
      }
      if (res.total > 0) {
        onAwardRef.current(res.total);
        totalRef.current += res.total;
        setTotal(totalRef.current);
      }

      doneCount.current += 1;
      const left = FREE_SPINS - doneCount.current;
      setSpinsLeft(left);
      setMultiplier(multiplierFor(doneCount.current));

      if (left > 0) {
        later(() => runner.current(), 900);
      } else {
        later(() => {
          setToast({ key: Date.now(), text: 'BONUS COMPLETE  ·  VIRTUAL COINS' });
        }, 400);
        later(() => onDoneRef.current(totalRef.current), 2400);
      }
    },
    [later],
  );

  const runSpin = useCallback(() => {
    if (spinningRef.current || !mounted.current) {
      return;
    }
    spin(spinSize, {
      multiplier: multiplierFor(doneCount.current),
      onDone: handleResult,
    });
  }, [handleResult, spin, spinSize, spinningRef]);

  runner.current = runSpin;

  useEffect(() => {
    mounted.current = true;
    const list = timers.current;

    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();

    Animated.spring(titleIn, {
      toValue: 1,
      tension: 48,
      friction: 8,
      useNativeDriver: true,
    }).start();

    const kickoff = setTimeout(() => {
      if (mounted.current) {
        runner.current();
      }
    }, 900);
    list.push(kickoff);

    return () => {
      mounted.current = false;
      list.forEach(clearTimeout);
    };
  }, [flash, titleIn]);

  const stats: StatItem[] = [
    { key: 'free', value: String(spinsLeft), label: 'FREE SPINS' },
    {
      key: 'total',
      value: formatDelta(total),
      label: 'BONUS TOTAL',
      tone: total > 0 ? theme.colors.neon.green : theme.colors.text.muted,
    },
  ];

  const flashOpacity = flash.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.55],
  });
  const titleScale = titleIn.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <ScreenBackground
      overlay={['rgba(10,40,62,0.62)', 'rgba(7,26,43,0.80)']}
      aurora={0.46}
      snow={26}
      auroraTop={130}>
      <ScreenHeader
        title="AURORA BONUS"
        subtitle="FREE SPINS RUNNING"
        rightSlot={<BalanceBadge value={shownBalance} compact />}
      />

      <Animated.View
        pointerEvents="none"
        style={[styles.flash, { opacity: flashOpacity }]}
      />

      <View style={styles.banner}>
        <Animated.View
          pointerEvents="none"
          style={{ transform: [{ scale: titleScale }] }}>
          <Text style={styles.bannerText}>
            {'AURORA BONUS  ·  FREE SPINS'}
          </Text>
        </Animated.View>
        <MultiplierChip value={multiplier} />
      </View>

      <View style={styles.area}>
        <ReelBoard
          strips={strips}
          offsets={offsets}
          winCells={result.cells}
          winLines={result.lines}
          spinning={spinning}
        />
        {toast ? (
          <View pointerEvents="none" style={styles.toastWrap}>
            <WinToast
              text={toast.text}
              tone="win"
              toastKey={toast.key}
              onHidden={() => setToast(null)}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <StatStrip items={stats} />
        <Text style={styles.hint}>
          {'NO SPIN SIZE IS CHARGED  ·  ' + formatCoins(total) + ' VIRTUAL COINS WON'}
        </Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.neon.green,
  },
  banner: {
    marginTop: 14,
    marginHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(184,242,160,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(184,242,160,0.40)',
    shadowColor: theme.colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.6,
    lineHeight: 20,
    color: theme.colors.neon.green,
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastWrap: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 26,
  },
  hint: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    lineHeight: 14,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});
