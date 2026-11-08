import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Home, Pause, RotateCw, Zap } from 'lucide-react-native';
import BalanceBadge from '../components/BalanceBadge';
import CircleButton from '../components/CircleButton';
import ReelBoard from '../components/ReelBoard';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import SpinSizeControl from '../components/SpinSizeControl';
import StatStrip, { StatItem } from '../components/StatStrip';
import WinToast from '../components/WinToast';
import { REFILL_TOAST, SESSION_LENGTH, SPIN_SIZES } from '../constants/config';
import theme from '../constants/theme';
import { LINE_COUNT } from '../game/paylines';
import { SpinResult } from '../game/evaluate';
import useSlotMachine from '../hooks/useSlotMachine';
import useCountUp from '../hooks/useCountUp';
import { formatCoins, formatDelta } from '../utils/format';

export type Session = {
  spins: number;
  net: number;
  bestLine: number;
  bonuses: number;
  lastWin: number;
};

export type Wallet = {
  balance: number;
  spinSize: number;
  spinIndex: number;
  stepSpinSize: (delta: number) => void;
  charge: (amount: number) => boolean;
  award: (amount: number) => void;
  ensureFloor: () => boolean;
};

type Props = {
  wallet: Wallet;
  session: Session;
  onSession: (next: Session) => void;
  totalSpins: number;
  onTotalSpins: (next: number) => void;
  turbo: boolean;
  onToggleTurbo: () => void;
  onHome: () => void;
  onBonus: () => void;
  onGameOver: () => void;
};

const AUTO_SPINS = 10;

/** Frost Reels — G3 split panel: header / reel area / stat strip / controls. */
export default function GameScreen({
  wallet,
  session,
  onSession,
  totalSpins,
  onTotalSpins,
  turbo,
  onToggleTurbo,
  onHome,
  onBonus,
  onGameOver,
}: Props) {
  const { strips, offsets, spinning, spinningRef, result, spin } = useSlotMachine();
  const [shakeKey, setShakeKey] = useState(0);
  const [toast, setToast] = useState<{ key: number; text: string } | null>(null);
  const [autoLeft, setAutoLeft] = useState(0);

  const autoRef = useRef(0);
  const mounted = useRef(true);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const totalRef = useRef(totalSpins);
  totalRef.current = totalSpins;
  const spinRunner = useRef<() => void>(() => {});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const shownBalance = useCountUp(wallet.balance);
  const winPop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    mounted.current = true;
    const list = timers.current;
    return () => {
      mounted.current = false;
      autoRef.current = 0;
      list.forEach(clearTimeout);
    };
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (mounted.current) {
        fn();
      }
    }, ms);
    timers.current.push(id);
  }, []);

  const handleResult = useCallback(
    (res: SpinResult, stake: number) => {
      if (!mounted.current) {
        return;
      }

      if (res.total > 0) {
        wallet.award(res.total);
        winPop.setValue(0);
        Animated.sequence([
          Animated.timing(winPop, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(winPop, {
            toValue: 0,
            duration: 240,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setShakeKey(k => k + 1);
      }

      const prev = sessionRef.current;
      const next: Session = {
        spins: prev.spins + 1,
        net: prev.net + res.total - stake,
        bestLine: Math.max(prev.bestLine, res.bestLine),
        bonuses: prev.bonuses,
        lastWin: res.total,
      };
      onSession(next);
      onTotalSpins(totalRef.current + 1);

      if (wallet.ensureFloor()) {
        setToast({ key: Date.now(), text: REFILL_TOAST });
      }

      if (res.bonus) {
        autoRef.current = 0;
        setAutoLeft(0);
        later(onBonus, 760);
        return;
      }

      if (next.spins >= SESSION_LENGTH) {
        autoRef.current = 0;
        setAutoLeft(0);
        later(onGameOver, 900);
        return;
      }

      if (autoRef.current > 0) {
        autoRef.current -= 1;
        setAutoLeft(autoRef.current);
        later(() => spinRunner.current(), 620);
      }
    },
    [later, onBonus, onGameOver, onSession, onTotalSpins, wallet, winPop],
  );

  const doSpin = useCallback(() => {
    if (spinningRef.current) {
      return;
    }
    const stake = wallet.spinSize;
    if (!wallet.charge(stake)) {
      if (wallet.ensureFloor()) {
        setToast({ key: Date.now(), text: REFILL_TOAST });
      }
      return;
    }
    spin(stake, {
      turbo,
      onDone: res => handleResult(res, stake),
    });
  }, [handleResult, spin, spinningRef, turbo, wallet]);

  spinRunner.current = doSpin;

  const toggleAuto = useCallback(() => {
    if (autoRef.current > 0) {
      autoRef.current = 0;
      setAutoLeft(0);
      return;
    }
    autoRef.current = AUTO_SPINS;
    setAutoLeft(AUTO_SPINS);
    spinRunner.current();
  }, []);

  const stats: StatItem[] = [
    { key: 'lines', value: String(LINE_COUNT), label: 'LINES' },
    {
      key: 'last',
      value: formatDelta(session.lastWin),
      label: 'LAST WIN',
      tone:
        session.lastWin > 0 ? theme.colors.neon.green : theme.colors.text.muted,
    },
    { key: 'spins', value: formatCoins(totalSpins), label: 'SPINS' },
  ];

  const winY = winPop.interpolate({ inputRange: [0, 1], outputRange: [0, -28] });
  const spinNumber = Math.min(session.spins + 1, SESSION_LENGTH);

  return (
    <ScreenBackground
      overlay={['rgba(7,26,43,0.72)', 'rgba(4,16,28,0.90)']}
      aurora={0.2}
      snow={6}
      auroraTop={150}>
      <ScreenHeader
        title="GLACIER BAY"
        subtitle={'ARENA 1  ·  SPIN ' + spinNumber + '/' + SESSION_LENGTH}
        leftSlot={
          <CircleButton
            size={44}
            Icon={Home}
            onPress={onHome}
            accessibilityLabel="Home"
          />
        }
        rightSlot={<BalanceBadge value={shownBalance} compact />}
      />

      <View style={styles.area}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.winFloat,
            { opacity: winPop, transform: [{ translateY: winY }] },
          ]}>
          <Text style={styles.winText}>{formatDelta(result.total)}</Text>
        </Animated.View>

        <ReelBoard
          strips={strips}
          offsets={offsets}
          winCells={result.cells}
          winLines={result.lines}
          spinning={spinning}
          shakeKey={shakeKey}
        />

        {toast ? (
          <View pointerEvents="none" style={styles.toastWrap}>
            <WinToast
              text={toast.text}
              toastKey={toast.key}
              onHidden={() => setToast(null)}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.stripWrap}>
        <StatStrip items={stats} />
      </View>

      <View style={styles.controls}>
        <SpinSizeControl
          value={wallet.spinSize}
          canDecrease={wallet.spinIndex > 0}
          canIncrease={wallet.spinIndex < SPIN_SIZES.length - 1}
          disabled={spinning}
          onDecrease={() => wallet.stepSpinSize(-1)}
          onIncrease={() => wallet.stepSpinSize(1)}
        />

        <View style={styles.discRow}>
          <CircleButton
            size={56}
            Icon={Zap}
            active={turbo}
            onPress={onToggleTurbo}
            accessibilityLabel="Turbo spin"
          />
          <CircleButton
            size={96}
            label="SPIN"
            variant="accent"
            disabled={spinning}
            onPress={doSpin}
            accessibilityLabel="Spin the reels"
          />
          <CircleButton
            size={56}
            Icon={autoLeft > 0 ? Pause : RotateCw}
            active={autoLeft > 0}
            onPress={toggleAuto}
            accessibilityLabel={autoLeft > 0 ? 'Stop auto spin' : 'Auto spin'}
          />
        </View>

        <Text style={styles.autoHint}>
          {autoLeft > 0 ? 'AUTO  ' + autoLeft + ' LEFT' : 'TAP SPIN  ·  10 LINES'}
        </Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winFloat: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
  },
  winText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.4,
    lineHeight: 32,
    color: theme.colors.neon.green,
    textShadowColor: 'rgba(184,242,160,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
    fontVariant: ['tabular-nums'],
  },
  toastWrap: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
  },
  stripWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  controls: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: 'rgba(18,55,82,0.88)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  discRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  autoHint: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 14,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});
