import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from "@/constants/theme";

type BadgeType = 'warning' | 'danger' | 'info' | 'success';

interface AlertBadgeProps {
  type: BadgeType;
  label: string;
  size?: 'sm' | 'md';
}

const BADGE_CONFIG: Record<BadgeType, { bg: string; border: string; text: string; icon: string }> = {
  warning: {
    bg: Colors.warningBg,
    border: Colors.warningDim,
    text: Colors.warning,
    icon: '⚠',
  },
  danger: {
    bg: Colors.dangerBg,
    border: Colors.dangerDim,
    text: Colors.danger,
    icon: '↓',
  },
  info: {
    bg: Colors.infoDim,
    border: Colors.infoDim,
    text: Colors.info,
    icon: 'ℹ',
  },
  success: {
    bg: Colors.successBg,
    border: Colors.successDim,
    text: Colors.success,
    icon: '✓',
  },
};

export const AlertBadge: React.FC<AlertBadgeProps> = ({ type, label, size = 'sm' }) => {
  const config = BADGE_CONFIG[type];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? 3 : Spacing.xs,
        },
      ]}
    >
      <Text style={[styles.icon, { color: config.text, fontSize: isSmall ? 9 : 11 }]}>
        {config.icon}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: config.text,
            fontSize: isSmall ? Typography.size.xs : Typography.size.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  icon: {
    fontWeight: Typography.weight.bold,
  },
  label: {
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.3,
  },
});
