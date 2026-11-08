import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Map as MapIcon, Play, Table2 } from 'lucide-react-native';
import AgeBadge from '../components/AgeBadge';
import BalanceBadge from '../components/BalanceBadge';
import ChipRow, { Chip } from '../components/ChipRow';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { ARENAS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  balance: number;
  totalSpins: number;
  onPlay: () => void;
  onPaytable: () => void;
  onArenaMap: () => void;
  onNotice: () => void;
  onSettings: () => void;
};

/** Arena Entrance — M2 bottom-sheet layout over the full-bleed arena art. */
export default function MenuScreen({
  balance,
  totalSpins,
  onPlay,
  onPaytable,
  onArenaMap,
  onNotice,
  onSettings,
}: Props) {
  const sheet = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const [arena, setArena] = useState(ARENAS[0].id);

  useEffect(() => {
    Animated.spring(sheet, {
      toValue: 1,
      tension: theme.animation.ui.tension,
      friction: theme.animation.ui.friction,
      useNativeDriver: true,
    }).start();

    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
      { iterations: 4 },
    );
    drift.start();
    return () => drift.stop();
  }, [float, sheet]);

  const chips: Chip[] = ARENAS.map(a => ({
    id: a.id,
    label: a.label,
    locked: totalSpins < a.unlockAt,
    caption: totalSpins < a.unlockAt ? a.unlockAt + ' SPINS' : undefined,
    active: arena === a.id && totalSpins >= a.unlockAt,
  }));

  const selectArena = useCallback(
    (id: string) => {
      const found = ARENAS.filter(a => a.id === id)[0];
      if (found && totalSpins >= found.unlockAt) {
        setArena(id);
      }
    },
    [totalSpins],
  );

  const slide = sheet.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const lift = float.interpolate({ inputRange: [0, 1], outputRange: [6, -6] });

  return (
    <ScreenBackground
      overlay={['rgba(7,26,43,0.28)', 'rgba(7,26,43,0.55)', 'rgba(7,26,43,0.92)']}
      aurora={0.28}
      snow={8}
      auroraTop={120}>
      <ScreenHeader
        title="ARENA ENTRANCE"
        subtitle="GLACIER BAY"
        leftSlot={<AgeBadge />}
        rightSlot={<BalanceBadge value={balance} compact />}
      />

      <View style={styles.hero}>
        <Animated.View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ transform: [{ translateY: lift }] }}>
          <LinearGradient
            colors={['rgba(47,169,201,0.38)', 'rgba(10,34,53,0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logo}>
            <Text style={styles.logoText}>GR</Text>
            <Text style={styles.logoSub}>ARENA</Text>
          </LinearGradient>
        </Animated.View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheetWrap, { opacity: sheet, transform: [{ translateY: slide }] }]}>
        <LinearGradient
          colors={['rgba(18,55,82,0.90)', 'rgba(10,34,53,0.96)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheet}
          pointerEvents="box-none">
          <View pointerEvents="none" style={styles.sheetEdge} />

          <Text style={styles.title}>GLACIER REELS ARENA</Text>
          <Text style={styles.tagline}>
            {'FROSTY FIVE-REEL FUN  ·  VIRTUAL COINS ONLY'}
          </Text>

          <ChipRow chips={chips} onSelect={selectArena} style={styles.chips} />

          <PrimaryButton label="PLAY NOW" Icon={Play} onPress={onPlay} />

          <View style={styles.row}>
            <View style={styles.slot}>
              <SecondaryButton label="PAYTABLE" Icon={Table2} onPress={onPaytable} />
            </View>
            <View style={styles.slot}>
              <SecondaryButton label="ARENA MAP" Icon={MapIcon} onPress={onArenaMap} />
            </View>
          </View>

          <View style={styles.rowTight}>
            <View style={styles.slot}>
              <SecondaryButton label="PLAY NOTICE" onPress={onNotice} height={44} />
            </View>
            <View style={styles.slot}>
              <SecondaryButton label="SETTINGS" onPress={onSettings} height={44} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(90,209,232,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 62,
    fontWeight: '900',
    letterSpacing: 5,
    lineHeight: 70,
    color: theme.colors.neon.ice,
    textShadowColor: theme.colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    includeFontPadding: false,
  },
  logoSub: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: 4,
    color: theme.colors.neon.green,
  },
  sheetWrap: {
    paddingHorizontal: 0,
  },
  sheet: {
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 26,
    shadowColor: theme.colors.neon.cyan,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 18,
  },
  sheetEdge: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 1.8,
    lineHeight: 30,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  tagline: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  chips: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  rowTight: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  slot: {
    flex: 1,
  },
});
