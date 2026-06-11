// App color palette and design tokens
export const Colors = {
  // Background
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceElevated: '#1A1A28',

  // Brand / Primary
  primary: '#6C63FF',
  primaryLight: '#A78BFA',
  primaryDark: '#4F46E5',

  // Secondary
  secondary: '#9B59B6',

  // Accent
  accent: '#00C9A7',
  accentWarm: '#F7971E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textTertiary: 'rgba(255,255,255,0.35)',
  textMuted: 'rgba(255,255,255,0.2)',

  // Status
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Border
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.04)',

  // Gradients (use as array for LinearGradient)
  gradientPrimary: ['#6C63FF', '#9B59B6'] as const,
  gradientDark: ['#1A0A2E', '#16213E', '#0F3460'] as const,
  gradientSurface: ['#12121A', '#1A1A28'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  hero: 52,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
