import React, { useCallback } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import CircleButton from '../components/CircleButton';
import NoticeBar from '../components/NoticeBar';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import theme from '../constants/theme';
import { SYMBOLS, SymbolDef } from '../game/symbols';

type Props = { onClose: () => void };

const ROW_H = 72;

function PayRow({ def }: { def: SymbolDef }) {
  const special = def.isWild || def.isScatter;
  const note = def.isWild
    ? 'SUBSTITUTES FOR ALL EXCEPT SCATTER'
    : '3+ STARTS FREE SPINS';

  return (
    <View style={styles.row}>
      <View style={styles.art}>
        {def.asset ? (
          <Image source={def.asset} style={styles.sprite} />
        ) : (
          <View
            style={[
              styles.rune,
              { borderColor: def.tint, backgroundColor: def.tint + '1A' },
            ]}>
            <Text style={[styles.runeText, { color: def.tint }]}>{def.rune}</Text>
          </View>
        )}
      </View>

      <View style={styles.meta}>
        <Text style={styles.name}>{def.name}</Text>
        {special ? (
          <Text style={styles.note}>{note}</Text>
        ) : (
          <Text style={styles.note}>MATCH FROM REEL 1 LEFT TO RIGHT</Text>
        )}
      </View>

      {special ? (
        <Text style={styles.special}>SPECIAL</Text>
      ) : (
        <View style={styles.pays}>
          {def.pays.map((p, i) => (
            <View key={'p' + i} style={styles.payCol}>
              <Text style={styles.payCount}>{'x' + (i + 3)}</Text>
              <Text style={styles.payValue}>{p}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/** Paytable Igloo — every payout is denominated in virtual coins. */
export default function PaytableScreen({ onClose }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: SymbolDef }) => <PayRow def={item} />,
    [],
  );
  const keyExtractor = useCallback((item: SymbolDef) => item.key, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<SymbolDef> | null | undefined, index: number) => ({
      length: ROW_H + 10,
      offset: (ROW_H + 10) * index,
      index,
    }),
    [],
  );

  return (
    <ScreenBackground
      overlay={['rgba(4,16,28,0.88)', 'rgba(7,26,43,0.86)']}
      aurora={0.16}
      auroraTop={110}>
      <ScreenHeader
        title="PAYTABLE"
        subtitle="VIRTUAL COIN PAYOUTS"
        leftSlot={
          <CircleButton
            size={44}
            Icon={X}
            onPress={onClose}
            accessibilityLabel="Close paytable"
          />
        }
      />

      <FlatList
        data={SYMBOLS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        windowSize={5}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <NoticeBar text="ALL PAYOUTS ARE IN VIRTUAL COINS WITH NO REAL VALUE." />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_H,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
  },
  art: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  rune: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runeText: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    includeFontPadding: false,
  },
  meta: {
    flex: 1,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: 17,
    color: theme.colors.text.primary,
  },
  note: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 12,
    color: theme.colors.text.muted,
  },
  pays: {
    flexDirection: 'row',
    gap: 10,
  },
  payCol: {
    minWidth: 34,
    alignItems: 'center',
  },
  payCount: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 12,
    color: theme.colors.text.muted,
  },
  payValue: {
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  special: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    lineHeight: 14,
    color: theme.colors.neon.green,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 26,
    paddingTop: 6,
  },
});
