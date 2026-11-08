import React, { memo, ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * ONE header for every screen (Menu, Game, Bonus, GameOver, Paytable,
 * Arena Map, Notice, Settings). Screens only swap the slots, never the
 * styling, so the chrome cannot drift between them.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  style,
}: Props) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 116,
    paddingTop: 44,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(2,7,14,0.42)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  side: {
    width: 92,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.4,
    lineHeight: 17,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 13,
    marginTop: 2,
    color: theme.colors.text.muted,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
