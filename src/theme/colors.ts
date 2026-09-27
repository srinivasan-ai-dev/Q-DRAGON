/**
 * Q-Companion Color System
 * High-contrast palette optimized for outdoor viewing under harsh sunlight.
 * Privacy-focused health monitoring during disasters.
 */

export const Colors = {
  // Core brand
  primary: '#00D1B2',       // Teal-cyan — trust, health, calm
  primaryDark: '#00A896',
  primaryLight: '#33E8CE',
  accent: '#FF6B6B',        // Coral red — alerts, urgency
  accentOrange: '#FF9F43',  // Warm orange — warnings
  accentBlue: '#54A0FF',    // Sky blue — info, connectivity

  // Backgrounds
  bgDark: '#0A0E17',        // Deep navy-black
  bgCard: '#131B2E',        // Card surface
  bgCardLight: '#1A2340',   // Elevated card
  bgElevated: '#1E293B',    // Modal / overlay
  bgSurface: '#0F1629',     // Section background

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0A0E17',

  // Status / Risk
  riskLow: '#22C55E',       // Green
  riskModerate: '#F59E0B',  // Amber
  riskHigh: '#EF4444',      // Red
  riskCritical: '#DC2626',  // Deep red

  // Vitals
  heartRate: '#FF6B6B',
  spo2: '#54A0FF',
  temperature: '#FF9F43',
  respiration: '#A78BFA',   // Purple
  aqi: '#34D399',           // Emerald
  humidity: '#38BDF8',      // Light blue

  // UI
  border: '#1E293B',
  borderLight: '#334155',
  divider: '#1E293B',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Connection status
  connected: '#22C55E',
  disconnected: '#EF4444',
  fallback: '#F59E0B',

  // SOS
  sosRed: '#DC2626',
  sosPulse: '#FCA5A5',
  sosBackground: 'rgba(220, 38, 38, 0.15)',

  // Gradients (pairs)
  gradientPrimary: ['#00D1B2', '#00A896'] as [string, string],
  gradientDanger: ['#EF4444', '#DC2626'] as [string, string],
  gradientWarm: ['#FF9F43', '#FF6B6B'] as [string, string],
  gradientCool: ['#54A0FF', '#A78BFA'] as [string, string],
  gradientCard: ['#131B2E', '#1A2340'] as [string, string],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
