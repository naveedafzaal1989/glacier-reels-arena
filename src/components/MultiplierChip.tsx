import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = { value: number };

/** Free-spin multiplier. Pulses every time it grows. */
function MultiplierChipBase({ value }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [value, pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.chip, { transform: [{ scale }] }]}>
      <Text style={styles.text}>{'x' + value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 56,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(184,242,160,0.16)',
    borderWidth: 1,
    borderColor: theme.colors.neon.green,
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.4,
    lineHeight: 20,
    color: theme.colors.neon.green,
    fontVariant: ['tabular-nums'],
  },
});

export const MultiplierChip = memo(MultiplierChipBase);
export default MultiplierChip;
