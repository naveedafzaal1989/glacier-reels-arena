import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { RotateCw, X } from 'lucide-react-native';
import BalanceBadge from '../components/BalanceBadge';
import CircleButton from '../components/CircleButton';
import GlassPanel from '../components/GlassPanel';
import NoticeBar from '../components/NoticeBar';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';

export type Settings = {
  turbo: boolean;
  sound: boolean;
  haptics: boolean;
};

type Props = {
  balance: number;
  settings: Settings;
  onToggle: (key: keyof Settings) => void;
  onResetBalance: () => void;
  onClose: () => void;
};

const ROWS: { key: keyof Settings; label: string; note: string }[] = [
  { key: 'turbo', label: 'TURBO SPIN', note: 'FASTER REEL STOPS' },
  { key: 'sound', label: 'SOUND', note: 'REEL AND WIN CUES' },
  { key: 'haptics', label: 'HAPTICS', note: 'SOFT ICE-CRACK TICKS' },
];

/** Arena Settings. The reset button is a free top-up, never a purchase. */
export default function SettingsScreen({
  balance,
  settings,
  onToggle,
  onResetBalance,
  onClose,
}: Props) {
  return (
    <ScreenBackground
      overlay={['rgba(7,26,43,0.84)', 'rgba(4,16,28,0.90)']}
      aurora={0.18}
      auroraTop={110}>
      <ScreenHeader
        title="ARENA SETTINGS"
        subtitle="PLAY PREFERENCES"
        leftSlot={
          <CircleButton
            size={44}
            Icon={X}
            onPress={onClose}
            accessibilityLabel="Close settings"
          />
        }
        rightSlot={<BalanceBadge value={balance} compact />}
      />

      <View style={styles.body}>
        {ROWS.map(row => (
          <GlassPanel key={row.key} radius={theme.radius.md} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.note}>{row.note}</Text>
            </View>
            <Switch
              value={settings[row.key]}
              onValueChange={() => onToggle(row.key)}
              thumbColor={settings[row.key] ? theme.colors.neon.cyan : '#7C93A5'}
              trackColor={{
                false: 'rgba(255,255,255,0.12)',
                true: 'rgba(90,209,232,0.35)',
              }}
            />
          </GlassPanel>
        ))}

        <Text style={styles.hint}>
          {'A FREE TOP-UP OF VIRTUAL COINS  ·  NOTHING IS BOUGHT'}
        </Text>

        <SecondaryButton
          label="RESET VIRTUAL BALANCE"
          Icon={RotateCw}
          onPress={onResetBalance}
          height={56}
        />

        <NoticeBar
          text="COINS ARE VIRTUAL, HAVE NO VALUE AND CANNOT BE CASHED OUT."
          style={styles.notice}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 17,
    color: theme.colors.text.primary,
  },
  note: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 12,
    color: theme.colors.text.muted,
  },
  hint: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 14,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  notice: {
    marginTop: 'auto',
  },
});
