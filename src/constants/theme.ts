/**
 * GlacierReelsArena theme.
 * Copy of the RETRO_NEON preset with ONLY the accent hexes overridden to the
 * brief's ice-cyan / aurora-green palette. The `name` field stays 'retro-neon'.
 */
export const theme = {
  name: 'retro-neon',

  colors: {
    bg: {
      deep: '#040E18',
      primary: '#071A2B',
      secondary: '#0E2B44',
      tertiary: '#123752',
      accent: '#16415F',
    },
    neon: {
      cyan: '#5AD1E8',
      cyanDeep: '#2FA9C9',
      green: '#B8F2A0',
      ice: '#EDFAFF',
      violet: '#7C8BE8',
    },
    text: {
      primary: '#EDFAFF',
      secondary: '#8FB7CE',
      accent: '#5AD1E8',
      muted: '#5F8CA5',
      onAccent: '#042130',
    },
    ui: {
      glass: 'rgba(255,255,255,0.06)',
      glassStrong: 'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.12)',
      borderStrong: 'rgba(255,255,255,0.20)',
      divider: 'rgba(255,255,255,0.08)',
      highlight: 'rgba(237,250,255,0.18)',
      sheet: 'rgba(18,55,82,0.86)',
      overlay: 'rgba(2,7,14,0.88)',
    },
  },

  gradients: {
    primary: ['#5AD1E8', '#2FA9C9'] as const,
    win: ['#B8F2A0', '#5AD1E8'] as const,
    surface: ['#0E2B44', '#071A2B'] as const,
    loader: ['#02070E', '#071A2B', '#04101C'] as const,
    menuFade: ['transparent', 'rgba(7,26,43,0.65)', '#071A2B'] as const,
    game: ['rgba(7,26,43,0.72)', 'rgba(4,16,28,0.90)'] as const,
    bonus: ['rgba(10,40,62,0.62)', 'rgba(7,26,43,0.80)'] as const,
    tally: ['rgba(4,16,28,0.90)', 'rgba(7,26,43,0.80)'] as const,
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '900' as const, letterSpacing: 4 },
    title: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 2 },
    section: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 1.6 },
    body: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0.3 },
    caption: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.6 },
    score: {
      fontSize: 44,
      fontWeight: '900' as const,
      letterSpacing: 1,
      fontVariant: ['tabular-nums' as const],
    },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: { sm: 10, md: 16, lg: 20, xl: 24, xxl: 28, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#5AD1E8',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 18,
      elevation: 10,
    },
    button: {
      shadowColor: '#5AD1E8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
      elevation: 14,
    },
    win: {
      shadowColor: '#B8F2A0',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 18,
      elevation: 12,
    },
  },

  animation: {
    ui: { tension: 48, friction: 9 },
    press: { tension: 160, friction: 12 },
    hero: { tension: 42, friction: 7 },
    fast: { duration: 240 },
    smooth: { duration: 360 },
  },
};

export type Theme = typeof theme;
export default theme;
