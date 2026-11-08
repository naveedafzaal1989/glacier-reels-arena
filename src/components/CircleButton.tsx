import React, { memo } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconComponent } from './PrimaryButton';

type Props = {
  size: number;
  onPress: () => void;
  Icon?: IconComponent;
  /** PNG glyph from the asset contract (icon_home / icon_pause) */
  image?: any;
  label?: string;
  variant?: 'glass' | 'accent';
  active?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** Round control: MINUS / PLUS / TURBO / AUTO discs and the 96px SPIN disc. */
function CircleButtonBase({
  size,
  onPress,
  Icon,
  image,
  label,
  variant = 'glass',
  active = false,
  disabled = false,
  accessibilityLabel,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);
  const radius = size / 2;
  const tint = active ? theme.colors.neon.green : theme.colors.neon.cyan;

  const body = (
    <View style={styles.center}>
      {Icon ? (
        <Icon
          size={ICON}
          color={variant === 'accent' ? theme.colors.text.onAccent : tint}
          strokeWidth={2.6}
        />
      ) : null}
      {image ? <Image source={image} style={styles.image} /> : null}
      {label ? (
        <Text
          style={[
            styles.label,
            variant === 'accent' ? styles.labelAccent : styles.labelGlass,
          ]}>
          {label}
        </Text>
      ) : null}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label || 'button'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.press,
        {
          width: size,
          height: size,
          borderRadius: radius,
          opacity: disabled ? 0.4 : 1,
        },
        variant === 'accent' ? styles.accentShadow : null,
        style,
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.inner,
          { borderRadius: radius, transform: [{ scale }] },
          variant === 'glass'
            ? [
                styles.glass,
                active ? { borderColor: theme.colors.neon.green } : null,
              ]
            : null,
        ]}>
        {variant === 'accent' ? (
          <LinearGradient
            colors={theme.gradients.primary as unknown as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.grad, { borderRadius: radius }]}>
            {body}
          </LinearGradient>
        ) : (
          body
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentShadow: {
    shadowColor: theme.colors.neon.cyan,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 26,
    elevation: 16,
  },
  inner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glass: {
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  grad: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(237,250,255,0.35)',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: ICON,
    height: ICON,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: ICON,
  },
  labelAccent: {
    color: theme.colors.text.onAccent,
  },
  labelGlass: {
    color: theme.colors.text.primary,
  },
});

export const CircleButton = memo(CircleButtonBase);
export default CircleButton;
