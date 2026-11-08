import React, { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AuroraSky from './AuroraSky';
import SnowDrift from './SnowDrift';

type Props = {
  /** gradient laid over the base — this is what tells the screens apart */
  overlay: readonly string[];
  aurora?: number;
  snow?: number;
  /** opacity of the deep glacier base layer */
  imageOpacity?: number;
  auroraTop?: number;
  children?: ReactNode;
};

/**
 * The background is drawn, not photographed: a deep glacier gradient base,
 * then a per-screen overlay + aurora opacity so Loader, Menu, Game, Bonus
 * and GameOver never look alike.
 */
const BASE = ['#0A2F4A', '#15688C', '#2FA9C9', '#0B2439', '#04101C'] as const;

function ScreenBackgroundBase({
  overlay,
  aurora = 0.22,
  snow = 0,
  imageOpacity = 1,
  auroraTop = 40,
  children,
}: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={BASE as unknown as string[]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={overlay as string[]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <AuroraSky opacity={aurora} top={auroraTop} />
      {snow > 0 ? <SnowDrift count={snow} /> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071A2B',
  },
  content: {
    flex: 1,
  },
});

export const ScreenBackground = memo(ScreenBackgroundBase);
export default ScreenBackground;
