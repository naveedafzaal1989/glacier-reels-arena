import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string;
  label: string;
  accent: string;
};

/**
 * Stat pill. No raster icons: an 8px accent dot carries the semantics, the
 * big tabular number carries the data. `width:'100%'` — never flex:1 inside
 * a flex:1 slot, that collapses the card (rule #19a).
 */
function StatCardBase({ value, label, accent }: Props) {
  return (
    <View style={[styles.card, { borderColor: accent + '55' }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.glass,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 26,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 13,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
