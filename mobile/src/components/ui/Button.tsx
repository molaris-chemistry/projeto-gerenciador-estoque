import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Colors,
  Radius as BorderRadius,
  Typography,
  Spacing,
} from "@/constants/theme";

const FontSize = Typography.size;
const FontWeight = Typography.weight;

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const sizeStyles = {
    sm: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: FontSize.sm,
    },
    md: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: 14,
      fontSize: FontSize.base,
    },
    lg: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: 18,
      fontSize: FontSize.lg,
    },
  }[size];

  if (variant === "primary") {
    return (
      <TouchableOpacity
        {...props}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.wrapper, style]}
      >
        <LinearGradient
          colors={Colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            {
              paddingHorizontal: sizeStyles.paddingHorizontal,
              paddingVertical: sizeStyles.paddingVertical,
            },
            isDisabled && styles.disabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              style={[
                styles.textPrimary,
                { fontSize: sizeStyles.fontSize },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : "#fff"}
          size="small"
        />
      ) : (
        <Text
          style={[
            variant === "outline" || variant === "ghost"
              ? styles.textOutline
              : styles.textPrimary,
            { fontSize: sizeStyles.fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  base: {
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  textPrimary: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  textOutline: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
});
