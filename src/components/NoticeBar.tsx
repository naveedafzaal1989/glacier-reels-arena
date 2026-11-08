import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = { text: string; style?: StyleProp<ViewStyle> };

/** The aurora-green virtual-coins compliance bar. */
function NoticeBarBase({ text, style }: Props) {
  return (
    <View style={[styles.bar, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(184,242,160,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(184,242,160,0.28)',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.neon.green,
  },
});

export const NoticeBar = memo(NoticeBarBase);
export default NoticeBar;
