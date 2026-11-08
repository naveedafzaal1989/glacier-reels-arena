import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Coins } from 'lucide-react-native';
import theme from '../constants/theme';
import { VIRTUAL_LABEL } from '../constants/config';
import { formatCoins } from '../utils/format';

type Props = {
  value: number;
  /** compact = header variant without the glass pill */
  compact?: boolean;
  align?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
};

/**
 * Every balance readout carries the words VIRTUAL COINS — the app has no
 * real-money balance, no store and no cash-out.
 */
function BalanceBadgeBase({
  value,
  compact = false,
  align = 'right',
  style,
}: Props) {
  const textAlign = align === 'right' ? 'right' : 'left';

  if (compact) {
    return (
      <View style={[styles.compact, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }, style]}>
        <Text style={[styles.compactValue, { textAlign }]}>
          {formatCoins(value)}
        </Text>
        <Text style={[styles.label, { textAlign }]}>{VIRTUAL_LABEL}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.pill, style]}>
      <Coins size={16} color={theme.colors.neon.green} strokeWidth={2.4} />
      <View style={styles.pillText}>
        <Text style={styles.value}>{formatCoins(value)}</Text>
        <Text style={styles.label}>{VIRTUAL_LABEL}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  pillText: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 20,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  compact: {
    justifyContent: 'center',
  },
  compactValue: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 21,
    color: theme.colors.neon.green,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 12,
    color: theme.colors.text.secondary,
  },
});

export const BalanceBadge = memo(BalanceBadgeBase);
export default BalanceBadge;
