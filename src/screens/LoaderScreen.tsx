import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenBackground from '../components/ScreenBackground';
import { LOADER_DURATION_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = { onDone: () => void };

const BAR_W = 212;

/**
 * Splash. Deliberately much darker than the Menu (overlay 0.88 + dim art,
 * no chips, no balance, no interactive controls) so the two screens never look alike.
 */
export default function LoaderScreen({ onDone }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: theme.animation.hero.tension,
      friction: theme.animation.hero.friction,
      useNativeDriver: true,
    }).start();

    // width cannot run on the native driver — explicitly false here
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    });
    bar.start();

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    );
    blink.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      bar.stop();
      blink.stop();
    };
  }, [enter, fade, progress, pulse]);

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] });
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [6, BAR_W],
  });
  const captionOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.root, { opacity: fade }]}>
      <ScreenBackground
        overlay={['rgba(2,7,14,0.92)', 'rgba(7,26,43,0.88)', 'rgba(4,16,28,0.94)']}
        aurora={0.18}
        snow={14}
        imageOpacity={0.35}
        auroraTop={90}>
        <View style={styles.body}>
          <Animated.View
            pointerEvents="none"
            style={[styles.brand, { opacity: enter, transform: [{ scale }] }]}>
            <View style={styles.glow} />
            <View style={styles.mark}>
              <Text style={styles.markText}>GR</Text>
            </View>
          </Animated.View>

          <Text style={styles.title}>GLACIER REELS</Text>
          <Text style={styles.sub}>ARENA</Text>
          <Text style={styles.tagline}>
            {'VIRTUAL COINS  ·  18+  ·  ENTERTAINMENT ONLY'}
          </Text>

          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.win as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>

          <Animated.Text
            style={[styles.loading, { opacity: captionOpacity }]}>
            LOADING ARENA
          </Animated.Text>
        </View>
      </ScreenBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#02070E' },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brand: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(90,209,232,0.22)',
  },
  mark: {
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 3,
    borderColor: theme.colors.neon.cyan,
    backgroundColor: 'rgba(10,34,53,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    fontSize: 66,
    fontWeight: '900',
    letterSpacing: 6,
    lineHeight: 76,
    color: theme.colors.neon.ice,
    textShadowColor: theme.colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    includeFontPadding: false,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 44,
    color: theme.colors.neon.ice,
    textShadowColor: theme.colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  sub: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 10,
    lineHeight: 30,
    color: theme.colors.neon.cyan,
  },
  tagline: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    lineHeight: 15,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  track: {
    marginTop: 34,
    width: BAR_W,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fillWrap: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: theme.colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  fill: {
    flex: 1,
  },
  loading: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    lineHeight: 14,
    color: theme.colors.text.muted,
  },
});
