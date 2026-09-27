/**
 * Q-Companion Design System
 * Refined dark theme with subtle warmth. Phone-optimized.
 */

export const Colors = {
  // Backgrounds
  bg: '#0C0F18',
  bgCard: '#151926',
  bgInput: '#1A1F30',
  bgInputFocus: '#1E2438',
  bgElevated: '#1C2135',
  bgSheet: '#12151F',

  // Brand
  primary: '#6C9FFF',
  primaryMuted: 'rgba(108, 159, 255, 0.12)',
  accent: '#FF7A8A',
  accentMuted: 'rgba(255, 122, 138, 0.12)',
  teal: '#4ECDC4',
  tealMuted: 'rgba(78, 205, 196, 0.12)',
  amber: '#FFB347',
  amberMuted: 'rgba(255, 179, 71, 0.12)',
  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.12)',

  // Text
  text: '#F0F2F8',
  textSoft: '#A0A8C0',
  textMuted: '#5C6480',
  textInverse: '#0C0F18',

  // Risk
  good: '#4ADE80',
  goodMuted: 'rgba(74, 222, 128, 0.12)',
  warn: '#FBBF24',
  warnMuted: 'rgba(251, 191, 36, 0.12)',
  danger: '#F87171',
  dangerMuted: 'rgba(248, 113, 113, 0.12)',
  critical: '#EF4444',
  criticalMuted: 'rgba(239, 68, 68, 0.15)',

  // Utility
  border: '#1F2536',
  borderFocus: '#6C9FFF',
  divider: '#1A1F2E',
  overlay: 'rgba(0,0,0,0.7)',
  white08: 'rgba(255,255,255,0.08)',
  white04: 'rgba(255,255,255,0.04)',
};

export const S = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const R = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
};

export const F = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 21,
  xxl: 28,
  hero: 42,
};

export const W = {
  regular: '400' as const,
  medium: '500' as const,
  semi: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};
