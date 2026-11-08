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
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

/** Every icon in the app comes from the single chosen library. */
export type IconComponent = LucideIcon;

type Props = {
  label: string;
  Icon?: IconComponent;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
/** fixed icon box — identical on every button in the app (rule #20) */
const ICON = 24;

function PrimaryButtonBase({
  label,
  Icon,
  onPress,
  disabled = false,
  height = 64,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

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
      style={[
        styles.press,
        { height, opacity: disabled ? 0.45 : 1 },
        style,
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.inner, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.primary as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? (
              <Icon size={ICON} color={theme.colors.text.onAccent} strokeWidth={2.6} />
            ) : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.neon.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  inner: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  grad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: ICON,
    color: theme.colors.text.onAccent,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
