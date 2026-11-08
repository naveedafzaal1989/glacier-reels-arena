import React, { memo } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Lock } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

export type Chip = {
  id: string;
  label: string;
  locked?: boolean;
  caption?: string;
  active?: boolean;
};

type Props = {
  chips: Chip[];
  onSelect: (id: string) => void;
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function ChipItem({ chip, onSelect }: { chip: Chip; onSelect: (id: string) => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={chip.label}
      hitSlop={HIT}
      onPress={() => onSelect(chip.id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.chip,
          chip.active ? styles.chipActive : styles.chipIdle,
          { transform: [{ scale }] },
        ]}>
        {chip.locked ? (
          <Lock size={12} color={theme.colors.text.muted} strokeWidth={2.6} />
        ) : null}
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            chip.active ? styles.labelActive : styles.labelIdle,
          ]}>
          {chip.label}
        </Text>
      </Animated.View>
      {chip.caption ? (
        <Text numberOfLines={1} style={styles.caption}>
          {chip.caption}
        </Text>
      ) : null}
    </Pressable>
  );
}

/** Arena chips. Arenas unlock by spin count only — nothing is for sale. */
function ChipRowBase({ chips, onSelect, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {chips.map(chip => (
        <ChipItem key={chip.id} chip={chip} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 10,
  },
  press: {
    flex: 1,
    height: 60,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: 'rgba(90,209,232,0.18)',
    borderColor: theme.colors.neon.cyan,
  },
  chipIdle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 13,
  },
  labelActive: {
    color: theme.colors.text.primary,
  },
  labelIdle: {
    color: theme.colors.text.muted,
  },
  caption: {
    marginTop: 5,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 11,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});

export const ChipRow = memo(ChipRowBase);
export default ChipRow;
