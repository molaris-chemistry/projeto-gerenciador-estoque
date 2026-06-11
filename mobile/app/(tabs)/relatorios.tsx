import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/Colors';

export default function RelatoriosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>Análises e estatísticas do estoque</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📊</Text>
          <Text style={styles.placeholderText}>
            Relatórios e gráficos serão implementados aqui
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  placeholder: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  placeholderIcon: {
    fontSize: 48,
  },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
