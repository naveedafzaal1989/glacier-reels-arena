import React, { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { CELL, ROWS } from '../constants/config';
import theme from '../constants/theme';
import { SymbolId } from '../game/symbols';
import SymbolCell from './SymbolCell';

type Props = {
  strip: SymbolId[];
  offset: Animated.Value;
  last?: boolean;
};

/**
 * One clipped reel. The strip is taller than the window; translateY
 * (native driver) slides the new symbols down into view.
 */
function ReelColumnBase({ strip, offset, last = false }: Props) {
  return (
    <View
      style={[
        styles.column,
        { width: CELL, height: CELL * ROWS },
        last ? null : styles.divider,
      ]}>
      <Animated.View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ transform: [{ translateY: offset }] }}>
        {strip.map((id, i) => (
          <SymbolCell key={i + '-' + id} id={id} size={CELL} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    overflow: 'hidden',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.ui.divider,
  },
});

export const ReelColumn = memo(ReelColumnBase);
export default ReelColumn;
