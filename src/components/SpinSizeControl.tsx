import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { VIRTUAL_LABEL } from '../constants/config';
import { formatCoins } from '../utils/format';
import CircleButton from './CircleButton';

type Props = {
  value: number;
  canDecrease: boolean;
  canIncrease: boolean;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

/**
 * SPIN SIZE — deliberately never called a bet, stake or wager. The coins are
 * virtual and cannot be bought, sold or cashed out.
 */
function SpinSizeControlBase({
  value,
  canDecrease,
  canIncrease,
  disabled,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>{'SPIN SIZE  ·  ' + VIRTUAL_LABEL}</Text>
      <View style={styles.row}>
        <CircleButton
          size={56}
          Icon={Minus}
          onPress={onDecrease}
          disabled={disabled || !canDecrease}
          accessibilityLabel="Decrease spin size"
        />
        <Text style={styles.value}>{formatCoins(value)}</Text>
        <CircleButton
          size={56}
          Icon={Plus}
          onPress={onIncrease}
          disabled={disabled || !canIncrease}
          accessibilityLabel="Increase spin size"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 14,
    color: theme.colors.text.secondary,
  },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  value: {
    minWidth: 96,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
});

export const SpinSizeControl = memo(SpinSizeControlBase);
export default SpinSizeControl;
