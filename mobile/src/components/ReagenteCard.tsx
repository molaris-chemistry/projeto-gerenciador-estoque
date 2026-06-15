import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';
import { AlertBadge } from './AlertBadge';
import { formatQuantidade, isLowStock, isExpiringSoon } from '../utils/formatters';
import type { Reagente } from '../types';

interface ReagenteCardProps {
  reagente: Reagente;
  onPress: () => void;
}

export const ReagenteCard: React.FC<ReagenteCardProps> = ({ reagente, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }).start();
  };

  const lowStock = isLowStock(reagente.quantidade);
  const expiringSoon = isExpiringSoon(undefined);

  const unitColor = UnitColorMap[reagente.unidade] ?? Colors.cyan;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={4}
        style={[styles.card, Shadow.sm]}
      >
        <View style={[styles.stripe, { backgroundColor: unitColor }]} />

        <View style={[styles.unitBubble, { backgroundColor: `${unitColor}18` }]}>
          <Text style={[styles.unitChar, { color: unitColor }]}>
            {reagente.unidade.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.nome} numberOfLines={2}>
            {reagente.nome}
          </Text>

          {(lowStock || expiringSoon) && (
            <View style={styles.badgesRow}>
              {lowStock && <AlertBadge type="danger" label="Estoque Baixo" />}
              {expiringSoon && <AlertBadge type="warning" label="Validade Próxima" />}
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.quantityValue, { color: lowStock ? Colors.danger : Colors.textPrimary }]}>
            {formatQuantidade(reagente.quantidade, reagente.unidade)}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const UnitColorMap: Record<string, string> = {
  g: Colors.cyan,
  kg: Colors.cyan,
  mL: Colors.violet,
  L: Colors.violet,
  mg: Colors.success,
  mol: Colors.warning,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  stripe: {
    width: 4,
    alignSelf: 'stretch',
  },
  unitBubble: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitChar: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.extrabold,
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  nome: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  rightSection: {
    alignItems: 'flex-end',
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    gap: 4,
    minWidth: 80,
  },
  quantityValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    textAlign: 'right',
  },
  chevron: {
    fontSize: Typography.size.xl,
    color: Colors.textMuted,
    fontWeight: Typography.weight.bold,
  },
});
