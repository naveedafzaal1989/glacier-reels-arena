import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  BOARD_BORDER,
  BOARD_H,
  BOARD_PAD,
  BOARD_W,
  CELL,
  COLS,
  ROWS,
  WIN_LIFT_MS,
} from '../constants/config';
import theme from '../constants/theme';
import { LineWin, WinCell } from '../game/evaluate';
import { SymbolId } from '../game/symbols';
import PaylineOverlay from './PaylineOverlay';
import ReelColumn from './ReelColumn';

type Props = {
  strips: SymbolId[][];
  offsets: Animated.Value[];
  winCells: WinCell[];
  winLines: LineWin[];
  spinning: boolean;
  /** 160ms nudge played when a spin brings no win */
  shakeKey?: number;
};

/**
 * The 5x3 frosted reel board. Geometry follows the BOARD_FRAME formula so
 * the cells can never stick out of the rounded shell.
 */
function ReelBoardBase({
  strips,
  offsets,
  winCells,
  winLines,
  spinning,
  shakeKey = 0,
}: Props) {
  const lift = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const hasWin = winCells.length > 0;

  useEffect(() => {
    if (!hasWin) {
      lift.setValue(0);
      return;
    }
    const anim = Animated.sequence([
      Animated.timing(lift, {
        toValue: 1,
        duration: WIN_LIFT_MS,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0.35,
        duration: WIN_LIFT_MS,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [hasWin, lift, winLines]);

  useEffect(() => {
    if (shakeKey === 0) {
      return;
    }
    const anim = Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 40, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [shakeKey, shake]);

  const shakeX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-4, 4],
  });
  const cellScale = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.shell, { transform: [{ translateX: shakeX }] }]}>
      <View style={styles.reels}>
        {strips.map((strip, i) => (
          <ReelColumn
            key={'reel-' + i}
            strip={strip}
            offset={offsets[i]}
            last={i === COLS - 1}
          />
        ))}

        {spinning ? (
          <View pointerEvents="none" style={styles.smear} />
        ) : null}

        {winCells.map(cell => (
          <Animated.View
            key={'win-' + cell.col + '-' + cell.row}
            pointerEvents="none"
            style={[
              styles.winCell,
              {
                left: cell.col * CELL + 3,
                top: cell.row * CELL + 3,
                width: CELL - 6,
                height: CELL - 6,
                transform: [{ scale: cellScale }],
              },
            ]}
          />
        ))}

        <PaylineOverlay lines={winLines} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: BOARD_W,
    height: BOARD_H,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(90,209,232,0.45)',
    borderRadius: theme.radius.xl - 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    shadowColor: theme.colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 12,
  },
  reels: {
    flexDirection: 'row',
    width: CELL * COLS,
    height: CELL * ROWS,
    borderRadius: 14,
    overflow: 'hidden',
  },
  smear: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(237,250,255,0.05)',
  },
  winCell: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.neon.green,
    backgroundColor: 'rgba(184,242,160,0.12)',
    shadowColor: theme.colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 8,
  },
});

export const ReelBoard = memo(ReelBoardBase);
export default ReelBoard;
