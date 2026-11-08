import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Play, X } from 'lucide-react-native';
import AgeBadge from '../components/AgeBadge';
import CircleButton from '../components/CircleButton';
import GlassPanel from '../components/GlassPanel';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import { NOTICE_LINES } from '../constants/config';
import theme from '../constants/theme';

type Props = { onClose: () => void };

/** Play Notice — the plain-language 18+ / virtual coins statement. */
export default function NoticeScreen({ onClose }: Props) {
  return (
    <ScreenBackground
      overlay={['rgba(4,16,28,0.90)', 'rgba(7,26,43,0.84)']}
      aurora={0.14}
      snow={6}
      auroraTop={110}>
      <ScreenHeader
        title="PLAY NOTICE"
        subtitle="ENTERTAINMENT ONLY"
        leftSlot={
          <CircleButton
            size={44}
            Icon={X}
            onPress={onClose}
            accessibilityLabel="Close play notice"
          />
        }
        rightSlot={<AgeBadge />}
      />

      <View style={styles.body}>
        <GlassPanel radius={theme.radius.xl} style={styles.card}>
          <AgeBadge style={styles.badge} />
          <Text style={styles.title}>HOW THIS ARENA WORKS</Text>

          {NOTICE_LINES.map(line => (
            <View key={line} style={styles.line}>
              <Text style={styles.bullet}>·</Text>
              <Text style={styles.lineText}>{line}</Text>
            </View>
          ))}
        </GlassPanel>

        <Text style={styles.hint}>
          {'THERE IS NO STORE, NO PURCHASE AND NO CASH-OUT'}
        </Text>

        <PrimaryButton label="START PLAYING" Icon={Play} onPress={onClose} height={56} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  card: {
    padding: 22,
  },
  badge: {
    alignSelf: 'center',
  },
  title: {
    marginTop: 14,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.8,
    lineHeight: 23,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 19,
    color: theme.colors.neon.green,
  },
  lineText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.9,
    lineHeight: 18,
    color: theme.colors.text.secondary,
  },
  hint: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    lineHeight: 15,
    textAlign: 'center',
    color: theme.colors.neon.green,
  },
});
