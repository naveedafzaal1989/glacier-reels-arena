import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { CELL, COLS, ROWS } from '../constants/config';
import theme from '../constants/theme';
import { PAYLINES } from '../game/paylines';
import { LineWin } from '../game/evaluate';

type Props = { lines: LineWin[] };

/** Aurora-green polylines drawn over the winning paylines. */
function PaylineOverlayBase({ lines }: Props) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={CELL * COLS} height={CELL * ROWS}>
        {lines.map(win => {
          const rows = PAYLINES[win.lineIndex];
          const points = rows
            .slice(0, win.matches)
            .map((row, col) => {
              const x = col * CELL + CELL / 2;
              const y = row * CELL + CELL / 2;
              return x + ',' + y;
            })
            .join(' ');
          return (
            <Polyline
              key={'line-' + win.lineIndex}
              points={points}
              fill="none"
              stroke={theme.colors.neon.green}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.85}
            />
          );
        })}
      </Svg>
    </View>
  );
}

export const PaylineOverlay = memo(PaylineOverlayBase);
export default PaylineOverlay;
