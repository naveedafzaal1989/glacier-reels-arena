import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { X } from 'lucide-react-native';
import CircleButton from '../components/CircleButton';
import NoticeBar from '../components/NoticeBar';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import { ARENAS } from '../constants/config';
import theme from '../constants/theme';
import { formatCoins } from '../utils/format';

type Props = {
  totalSpins: number;
  onClose: () => void;
};

type Arena = { id: string; label: string; unlockAt: number };

const CARD_H = 132;

function ArenaCard({ arena, totalSpins }: { arena: Arena; totalSpins: number }) {
  const unlocked = totalSpins >= arena.unlockAt;
  const ratio = arena.unlockAt > 0 ? Math.min(1, totalSpins / arena.unlockAt) : 1;
  const fillWidth = (Math.round(ratio * 100) + '%') as `${number}%`;

  return (
    <View
      style={[
        styles.card,
        { borderColor: unlocked ? 'rgba(90,209,232,0.45)' : theme.colors.ui.border },
      ]}>
      <LinearGradient
        colors={
          unlocked
            ? ['#2FA9C9', '#0E2B44']
            : ['#15354E', '#091B2B']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.thumb}>
        <Text
          style={[
            styles.thumbText,
            { color: unlocked ? theme.colors.neon.ice : theme.colors.text.muted },
          ]}>
          {arena.label.slice(0, 1)}
        </Text>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={styles.name}>{arena.label}</Text>
        <Text
          style={[
            styles.state,
            { color: unlocked ? theme.colors.neon.green : theme.colors.text.muted },
          ]}>
          {unlocked
            ? 'UNLOCKED  ·  READY TO PLAY'
            : 'UNLOCKS AT ' + arena.unlockAt + ' SPINS'}
        </Text>

        {unlocked ? null : (
          <View style={styles.track}>
            <View style={[styles.fill, { width: fillWidth }]} />
          </View>
        )}

        {unlocked ? null : (
          <Text style={styles.progress}>
            {formatCoins(totalSpins) + ' / ' + formatCoins(arena.unlockAt)}
          </Text>
        )}
      </View>
    </View>
  );
}

/** Arena Map — arenas unlock by spin count only, nothing is for sale. */
export default function ArenaMapScreen({ totalSpins, onClose }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Arena }) => (
      <ArenaCard arena={item} totalSpins={totalSpins} />
    ),
    [totalSpins],
  );
  const keyExtractor = useCallback((item: Arena) => item.id, []);

  return (
    <ScreenBackground
      overlay={['rgba(7,26,43,0.80)', 'rgba(4,16,28,0.88)']}
      aurora={0.3}
      snow={8}
      auroraTop={120}>
      <ScreenHeader
        title="ARENA MAP"
        subtitle={'TOTAL SPINS ' + formatCoins(totalSpins)}
        leftSlot={
          <CircleButton
            size={44}
            Icon={X}
            onPress={onClose}
            accessibilityLabel="Close arena map"
          />
        }
      />

      <FlatList
        data={ARENAS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <NoticeBar text="ARENAS UNLOCK BY SPIN COUNT ONLY  ·  NOTHING IS FOR SALE" />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    height: CARD_H,
    marginBottom: 14,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.ui.glass,
  },
  thumb: {
    width: 104,
    height: CARD_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
    includeFontPadding: false,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.6,
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  state: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    lineHeight: 14,
  },
  track: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.neon.cyan,
  },
  progress: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 13,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 26,
    paddingTop: 4,
  },
});
