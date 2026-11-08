import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Home, RotateCw } from 'lucide-react-native';
import BalanceBadge from '../components/BalanceBadge';
import GlassPanel from '../components/GlassPanel';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { COMPLIANCE_FOOTER, VIRTUAL_LABEL } from '../constants/config';
import theme from '../constants/theme';
import { LINE_COUNT } from '../game/paylines';
import useCountUp from '../hooks/useCountUp';
import { formatCoins, formatDelta } from '../utils/format';
import type { Session } from './GameScreen';

type Props = {
  session: Session;
  balance: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

type Stat = { key: string; value: string; label: string; accent: string };

/** Spin Tally — the round result screen reached when a session set ends. */
export default function GameOverScreen({
  session,
  balance,
  onPlayAgain,
  onMenu,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const counted = useCountUp(session.net, 700);

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 48,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const up = session.net >= 0;

  const stats: Stat[] = [];
  if (session.spins > 0) {
    stats.push({
      key: 'spins',
      value: formatCoins(session.spins),
      label: 'SPINS',
      accent: theme.colors.neon.cyan,
    });
  }
  if (session.bestLine > 0) {
    stats.push({
      key: 'best',
      value: formatCoins(session.bestLine),
      label: 'BEST LINE',
      accent: theme.colors.neon.green,
    });
  }
  if (session.bonuses > 0) {
    stats.push({
      key: 'bonus',
      value: formatCoins(session.bonuses),
      label: 'BONUSES',
      accent: theme.colors.neon.ice,
    });
  }
  if (stats.length < 2) {
    stats.push({
      key: 'lines',
      value: String(LINE_COUNT),
      label: 'PAYLINES',
      accent: theme.colors.neon.ice,
    });
  }

  const slide = enter.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });

  return (
    <ScreenBackground
      overlay={['rgba(4,16,28,0.90)', 'rgba(7,26,43,0.80)']}
      aurora={0.24}
      snow={10}
      auroraTop={100}>
      <ScreenHeader
        title="SPIN TALLY"
        subtitle="SESSION RESULT"
        rightSlot={<BalanceBadge value={balance} compact />}
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={{ opacity: enter, transform: [{ translateY: slide }] }}>
          <GlassPanel radius={theme.radius.xl} style={styles.card}>
            <View pointerEvents="none" style={styles.headGlow} />
            <Text style={styles.headline}>SESSION TALLY</Text>

            <Text
              style={[
                styles.big,
                { color: up ? theme.colors.neon.green : theme.colors.text.secondary },
              ]}>
              {formatDelta(counted)}
            </Text>
            <Text style={styles.caption}>{VIRTUAL_LABEL}</Text>

            <View style={styles.statsRow}>
              {stats.map(stat => (
                <View key={stat.key} style={styles.statSlot}>
                  <StatCard
                    value={stat.value}
                    label={stat.label}
                    accent={stat.accent}
                  />
                </View>
              ))}
            </View>
          </GlassPanel>
        </Animated.View>

        <Text style={styles.hint}>
          {'READY FOR ANOTHER SET  ·  COINS ARE VIRTUAL'}
        </Text>

        <PrimaryButton label="SPIN AGAIN" Icon={RotateCw} onPress={onPlayAgain} />

        <SecondaryButton
          label="MENU"
          Icon={Home}
          onPress={onMenu}
          style={styles.menuBtn}
        />

        <Text style={styles.footer}>{COMPLIANCE_FOOTER}</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  card: {
    padding: 22,
    alignItems: 'center',
  },
  headGlow: {
    position: 'absolute',
    top: -40,
    width: 220,
    height: 120,
    borderRadius: 110,
    backgroundColor: 'rgba(90,209,232,0.16)',
  },
  headline: {
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 28,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  big: {
    marginTop: 12,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 52,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  caption: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 15,
    color: theme.colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    alignSelf: 'stretch',
  },
  statSlot: {
    flex: 1,
  },
  hint: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 15,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  menuBtn: {
    marginTop: 12,
  },
  footer: {
    marginTop: 18,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 14,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});
