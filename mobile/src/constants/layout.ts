import { Platform, type ViewStyle } from 'react-native';

export const scrollableScreen: ViewStyle = {
  flex: 1,
  minHeight: 0,
  ...(Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : {}),
};

export const scrollableListStyle: ViewStyle = {
  flex: 1,
  minHeight: 0,
  ...(Platform.OS === 'web' ? { height: '100%', overflow: 'auto' } : {}),
};

export const scrollViewStyle: ViewStyle = {
  flex: 1,
  minHeight: 0,
  ...(Platform.OS === 'web' ? { height: '100%', overflow: 'auto' } : {}),
};

export const tabRootStyle: ViewStyle = {
  flex: 1,
  minHeight: 0,
  ...(Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : {}),
};

export const shouldClipListSubviews = Platform.OS !== 'web';
