import React, { memo } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconComponent } from './PrimaryButton';

type Props = {
  label: string;
  Icon?: IconComponent;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'glass' | 'accent';
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
/** same 24px icon box as PrimaryButton — sizes never differ between classes */
const ICON = 24;

function SecondaryButtonBase({
  label,
  Icon,
  onPress,
  disabled = false,
  tone = 'glass',
  height = 48,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const accent =
    tone === 'accent' ? theme.colors.neon.green : theme.colors.neon.cyan;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height, opacity: disabled ? 0.45 : 1 }, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.inner,
          {
            transform: [{ scale }],
            borderColor:
              tone === 'accent'
                ? 'rgba(184,242,160,0.35)'
                : theme.colors.ui.border,
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={accent} strokeWidth={2.4} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: theme.radius.md,
  },
  inner: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.glass,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: ICON,
    color: theme.colors.text.primary,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
