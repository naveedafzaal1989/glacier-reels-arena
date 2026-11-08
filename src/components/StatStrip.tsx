import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

export type StatItem = {
  key: string;
  value: string;
  label: string;
  tone?: string;
};

type Props = {
  items: StatItem[];
  style?: StyleProp<ViewStyle>;
};

/** Thin 44px readout between the board and the controls. */
function StatStripBase({ items, style }: Props) {
  if (items.length < 2) {
    return null;
  }

  return (
    <View style={[styles.strip, style]}>
      {items.map((item, i) => (
        <View
          key={item.key}
          style={[styles.cell, i === items.length - 1 ? null : styles.divider]}>
          <Text
            style={[
              styles.value,
              { color: item.tone || theme.colors.text.primary },
            ]}>
            {item.value}
          </Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.ui.divider,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 17,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 12,
    color: theme.colors.text.muted,
  },
});

export const StatStrip = memo(StatStripBase);
export default StatStrip;
