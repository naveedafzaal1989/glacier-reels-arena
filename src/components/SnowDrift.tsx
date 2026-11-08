import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SCREEN_H, SCREEN_W } from '../constants/config';
import theme from '../constants/theme';

type Flake = {
  x: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

type Props = { count?: number };

/**
 * Decoration settles after a few passes. An endless loop keeps the window
 * permanently non-idle, which makes `uiautomator dump` time out on every
 * screen (the UI test then sees no buttons at all).
 */
const DRIFT_CYCLES = 3;

/** Drifting snow. Pure decoration — pointerEvents none on every layer. */
function SnowDriftBase({ count = 14 }: Props) {
  const flakes = useMemo<Flake[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * SCREEN_W,
        size: 2 + Math.random() * 2,
        opacity: 0.12 + Math.random() * 0.18,
        duration: 6000 + Math.random() * 3000,
        delay: Math.random() * 4000,
      })),
    [count],
  );

  const values = useRef(flakes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = values.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(flakes[i] ? flakes[i].delay : 0),
          Animated.timing(value, {
            toValue: 1,
            duration: flakes[i] ? flakes[i].duration : 7000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: DRIFT_CYCLES },
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [flakes, values]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.wrap}>
      {flakes.map((flake, i) => {
        const fall = values[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-20, SCREEN_H * 0.9],
        });
        const sway = values[i].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 14, -6],
        });
        return (
          <Animated.View
            key={'flake-' + i}
            pointerEvents="none"
            style={[
              styles.flake,
              {
                left: flake.x,
                width: flake.size,
                height: flake.size,
                borderRadius: flake.size,
                opacity: flake.opacity,
                transform: [{ translateY: fall }, { translateX: sway }],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
  flake: {
    position: 'absolute',
    top: 0,
    backgroundColor: theme.colors.neon.ice,
  },
});

export const SnowDrift = memo(SnowDriftBase);
export default SnowDrift;
