export const Colors = {
  // --- Base ---
  background: '#0D0F1A',
  surface: '#151828',
  surfaceElevated: '#1C2035',
  surfaceBorder: '#252A40',
  overlay: 'rgba(13, 15, 26, 0.85)',

  // --- Primary Accents ---
  cyan: '#00D4FF',
  cyanDim: 'rgba(0, 212, 255, 0.15)',
  cyanMid: 'rgba(0, 212, 255, 0.3)',
  violet: '#7C3AED',
  violetDim: 'rgba(124, 58, 237, 0.15)',
  violetLight: '#A78BFA',

  // --- Text ---
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#4B5563',
  textInverse: '#0D0F1A',

  // --- Semantic ---
  success: '#10B981',
  successDim: 'rgba(16, 185, 129, 0.15)',
  successBg: 'rgba(16, 185, 129, 0.1)',

  warning: '#F59E0B',
  warningDim: 'rgba(245, 158, 11, 0.15)',
  warningBg: 'rgba(245, 158, 11, 0.1)',

  danger: '#F43F5E',
  dangerDim: 'rgba(244, 63, 94, 0.15)',
  dangerBg: 'rgba(244, 63, 94, 0.1)',

  info: '#3B82F6',
  infoDim: 'rgba(59, 130, 246, 0.15)',

  // --- Chart Colors ---
  chart: [
    '#00D4FF', // cyan
    '#7C3AED', // violet
    '#10B981', // emerald
    '#F59E0B', // amber
    '#F43F5E', // rose
    '#3B82F6', // blue
    '#A78BFA', // violet-light
    '#34D399', // emerald-light
  ],

  // --- Tab Bar ---
  tabBarBg: '#111320',
  tabBarBorder: '#1E2235',
  tabBarActive: '#00D4FF',
  tabBarInactive: '#4B5563',
  // --- Aliases for UI Components ---
  primary: '#7C3AED',
  gradientPrimary: ['#7C3AED', '#00D4FF'] as const,
  border: '#252A40',
  borderLight: 'rgba(37, 42, 64, 0.5)',
  textTertiary: '#4B5563',
  error: '#F43F5E',
} as const;

export const Typography = {
  fontFamily: {
    regular: undefined, // uses system font
    medium: undefined,
    bold: undefined,
  },

  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },

  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 56,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cyan: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
