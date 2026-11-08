import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = { style?: StyleProp<ViewStyle> };

/** Static 18+ badge. Required on the Arena Entrance and the Play Notice. */
function AgeBadgeBase({ style }: Props) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>18+</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 28,
    minWidth: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(184,242,160,0.14)',
    borderWidth: 1,
    borderColor: theme.colors.neon.green,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 14,
    color: theme.colors.neon.green,
  },
});

export const AgeBadge = memo(AgeBadgeBase);
export default AgeBadge;
