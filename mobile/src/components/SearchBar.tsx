import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar reagente...',
  isLoading = false,
  onFocus,
  onBlur,
}) => {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.surfaceBorder, Colors.cyan],
  });

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      <Text style={styles.searchIcon}>🔍</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never" 
      />

      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.cyan} style={styles.rightIcon} />
      ) : value.length > 0 ? (
        <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8}>
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    height: 48,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
    paddingVertical: 0,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 10,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
  },
});
