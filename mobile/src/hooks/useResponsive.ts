import { useWindowDimensions } from 'react-native';

/**
 * Hook to get responsive dimensions and breakpoints.
 * Usage: const { width, isSmall, isMedium } = useResponsive();
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isSmall: width < 380,
    isMedium: width >= 380 && width < 414,
    isLarge: width >= 414,
    isTablet: width >= 768,
  };
}
