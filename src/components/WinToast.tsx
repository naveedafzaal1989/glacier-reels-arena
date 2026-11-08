import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = {
  text: string;
  tone?: 'info' | 'win';
  /** changing this key replays the entrance */
  toastKey: number;
  onHidden?: () => void;
};

/** Glass toast used for the free daily refill, arena unlocks and bonus totals. */
function WinToastBase({ text, tone = 'info', toastKey, onHidden }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const hiddenRef = useRef(onHidden);
  hiddenRef.current = onHidden;

  useEffect(() => {
    anim.setValue(0);
    const run = Animated.sequence([
      Animated.spring(anim, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(anim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);
    run.start(({ finished }) => {
      if (finished && hiddenRef.current) {
        hiddenRef.current();
      }
    });
    return () => run.stop();
  }, [toastKey, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        tone === 'win' ? styles.win : styles.info,
        { opacity: anim, transform: [{ translateY }] },
      ]}>
      <Text
        style={[
          styles.text,
          { color: tone === 'win' ? theme.colors.neon.green : theme.colors.text.primary },
        ]}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    maxWidth: '92%',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  info: {
    backgroundColor: 'rgba(18,55,82,0.92)',
    borderColor: theme.colors.ui.border,
  },
  win: {
    backgroundColor: 'rgba(18,55,82,0.92)',
    borderColor: 'rgba(184,242,160,0.45)',
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 15,
    textAlign: 'center',
  },
});

export const WinToast = memo(WinToastBase);
export default WinToast;
