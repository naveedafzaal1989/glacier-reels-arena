import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { getSymbol, SymbolId } from '../game/symbols';

type Props = {
  id: SymbolId;
  size: number;
};

/**
 * One reel cell. Sprites are transparent PNGs dropped straight onto the
 * board — never wrapped in an overflow:hidden circle (rule #7).
 */
function SymbolCellBase({ id, size }: Props) {
  const def = getSymbol(id);
  const inner = size - 14;

  return (
    <View style={[styles.cell, { width: size, height: size }]}>
      <View
        style={[
          styles.pad,
          { width: size - 6, height: size - 6, borderRadius: 12 },
        ]}>
        {def.asset ? (
          <Image
            source={def.asset}
            style={{ width: inner, height: inner, resizeMode: 'contain' }}
          />
        ) : (
          <View
            style={[
              styles.rune,
              {
                width: inner - 6,
                height: inner - 6,
                borderRadius: (inner - 6) / 4,
                borderColor: def.tint,
                backgroundColor: def.tint + '1A',
              },
            ]}>
            <Text
              style={[
                styles.runeText,
                { color: def.tint, fontSize: Math.round(inner * 0.46) },
              ]}>
              {def.rune}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pad: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  rune: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  runeText: {
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
    color: theme.colors.text.primary,
  },
});

export const SymbolCell = memo(SymbolCellBase);
export default SymbolCell;
