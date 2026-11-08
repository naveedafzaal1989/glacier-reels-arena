import React, { memo, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  children?: ReactNode;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  /** the 1px lit-from-above frost edge that sells the glass */
  highlight?: boolean;
  tone?: 'glass' | 'sheet';
};

function GlassPanelBase({
  children,
  radius = theme.radius.lg,
  style,
  highlight = true,
  tone = 'glass',
}: Props) {
  return (
    <View
      style={[
        styles.panel,
        {
          borderRadius: radius,
          backgroundColor:
            tone === 'sheet' ? theme.colors.ui.sheet : theme.colors.ui.glass,
        },
        style,
      ]}>
      {highlight ? (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            { borderTopLeftRadius: radius, borderTopRightRadius: radius },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
});

export const GlassPanel = memo(GlassPanelBase);
export default GlassPanel;
