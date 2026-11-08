import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import ArenaMapScreen from './src/screens/ArenaMapScreen';
import BonusScreen from './src/screens/BonusScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen, { Session } from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import NoticeScreen from './src/screens/NoticeScreen';
import PaytableScreen from './src/screens/PaytableScreen';
import SettingsScreen, { Settings } from './src/screens/SettingsScreen';
import useVirtualBalance from './src/hooks/useVirtualBalance';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'bonus'
  | 'gameover'
  | 'paytable'
  | 'arenamap'
  | 'notice'
  | 'settings';

const EMPTY_SESSION: Session = {
  spins: 0,
  net: 0,
  bestLine: 0,
  bonuses: 0,
  lastWin: 0,
};

/** State machine only — no gameplay lives here. */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [session, setSession] = useState<Session>(EMPTY_SESSION);
  const [totalSpins, setTotalSpins] = useState(0);
  const [settings, setSettings] = useState<Settings>({
    turbo: false,
    sound: true,
    haptics: true,
  });

  const wallet = useVirtualBalance();

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startSession = useCallback(() => {
    setSession(EMPTY_SESSION);
    setScreen('game');
  }, []);

  const toggleTurbo = useCallback(() => {
    setSettings(prev => ({ ...prev, turbo: !prev.turbo }));
  }, []);

  const toggleSetting = useCallback((key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleHome = useCallback(() => {
    setScreen(session.spins > 0 ? 'gameover' : 'menu');
  }, [session.spins]);

  const handleBonusDone = useCallback((won: number) => {
    setSession(prev => ({
      ...prev,
      net: prev.net + won,
      bonuses: prev.bonuses + 1,
      lastWin: won,
    }));
    setScreen('game');
  }, []);

  // Android BACK must step back inside the app. Without this it finished the
  // Activity from every sub-screen, so leaving Paytable/Settings dropped the
  // user (and the UI walkthrough) out to the launcher and forced a cold start.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'loader' || screen === 'menu') {
        return false;
      }
      if (screen === 'game') {
        handleHome();
        return true;
      }
      if (screen === 'bonus') {
        return true;
      }
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, [handleHome, screen]);

  let content = null;

  if (screen === 'loader') {
    content = <LoaderScreen onDone={goMenu} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        balance={wallet.balance}
        totalSpins={totalSpins}
        onPlay={startSession}
        onPaytable={() => setScreen('paytable')}
        onArenaMap={() => setScreen('arenamap')}
        onNotice={() => setScreen('notice')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        wallet={wallet}
        session={session}
        onSession={setSession}
        totalSpins={totalSpins}
        onTotalSpins={setTotalSpins}
        turbo={settings.turbo}
        onToggleTurbo={toggleTurbo}
        onHome={handleHome}
        onBonus={() => setScreen('bonus')}
        onGameOver={() => setScreen('gameover')}
      />
    );
  } else if (screen === 'bonus') {
    content = (
      <BonusScreen
        balance={wallet.balance}
        spinSize={wallet.spinSize}
        onAward={wallet.award}
        onDone={handleBonusDone}
      />
    );
  } else if (screen === 'gameover') {
    content = (
      <GameOverScreen
        session={session}
        balance={wallet.balance}
        onPlayAgain={startSession}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'paytable') {
    content = <PaytableScreen onClose={goMenu} />;
  } else if (screen === 'arenamap') {
    content = <ArenaMapScreen totalSpins={totalSpins} onClose={goMenu} />;
  } else if (screen === 'notice') {
    content = <NoticeScreen onClose={goMenu} />;
  } else {
    content = (
      <SettingsScreen
        balance={wallet.balance}
        settings={settings}
        onToggle={toggleSetting}
        onResetBalance={wallet.reset}
        onClose={goMenu}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#040E18',
  },
});
