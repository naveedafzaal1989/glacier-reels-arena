import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { SCREEN_W } from '../constants/config';
import theme from '../constants/theme';

/** Ribbons settle after this many passes — see the note in SnowDrift. */
const DRIFT_CYCLES = 2;
const BAND_W = Math.round(SCREEN_W * 1.7);
const BAND_H = 260;

type Props = {
  /** per-screen opacity — one of the main ways the screens stay distinct */
  opacity?: number;
  top?: number;
};

/** Two slow aurora ribbons. Decorative only, never eats a touch. */
function AuroraSkyBase({ opacity = 0.22, top = 40 }: Props) {
  const driftA = useRef(new Animated.Value(0)).current;
  const driftB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (value: Animated.Value, duration: number, iterations: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
        { iterations },
      );

    const a = loop(driftA, 10000, DRIFT_CYCLES);
    const b = loop(driftB, 13000, DRIFT_CYCLES);
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [driftA, driftB]);

  const moveA = driftA.interpolate({
    inputRange: [0, 1],
    outputRange: [-70, 30],
  });
  const moveB = driftB.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -60],
  });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.wrap, { top, opacity }]}>
      <Animated.View
        pointerEvents="none"
        style={{ transform: [{ translateX: moveA }] }}>
        <Svg width={BAND_W} height={BAND_H}>
          <Defs>
            <LinearGradient id="auroraA" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={theme.colors.neon.cyan} stopOpacity="0" />
              <Stop offset="0.45" stopColor={theme.colors.neon.cyan} stopOpacity="1" />
              <Stop offset="1" stopColor={theme.colors.neon.green} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0 120 C ${BAND_W * 0.2} 40, ${BAND_W * 0.4} 190, ${
              BAND_W * 0.62
            } 96 S ${BAND_W * 0.86} 20, ${BAND_W} 108 L ${BAND_W} 168 C ${
              BAND_W * 0.84
            } 84, ${BAND_W * 0.6} 158, ${BAND_W * 0.38} 220 S ${
              BAND_W * 0.16
            } 110, 0 186 Z`}
            fill="url(#auroraA)"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.second, { transform: [{ translateX: moveB }] }]}>
        <Svg width={BAND_W} height={BAND_H}>
          <Defs>
            <LinearGradient id="auroraB" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={theme.colors.neon.green} stopOpacity="0" />
              <Stop offset="0.5" stopColor={theme.colors.neon.green} stopOpacity="0.9" />
              <Stop offset="1" stopColor={theme.colors.neon.cyan} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0 60 C ${BAND_W * 0.25} 150, ${BAND_W * 0.45} 10, ${
              BAND_W * 0.7
            } 92 S ${BAND_W * 0.9} 150, ${BAND_W} 70 L ${BAND_W} 112 C ${
              BAND_W * 0.88
            } 190, ${BAND_W * 0.66} 140, ${BAND_W * 0.42} 64 S ${
              BAND_W * 0.2
            } 196, 0 112 Z`}
            fill="url(#auroraB)"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: -Math.round(SCREEN_W * 0.35),
    right: 0,
    height: BAND_H * 2,
  },
  second: {
    marginTop: -150,
  },
});

export const AuroraSky = memo(AuroraSkyBase);
export default AuroraSky;
