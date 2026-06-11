import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={['#1A0A2E', '#16213E', '#0F3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✦ Bem-vindo</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Molaris</Text>
          <Text style={styles.heroSubtitle}>
            Gerenciador de Estoque
          </Text>
          <Text style={styles.heroDescription}>
            Controle completo do seu inventário de química, na palma da sua mão.
          </Text>

          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
            <LinearGradient
              colors={['#6C63FF', '#9B59B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Começar agora →</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Decorative orbs */}
          <View style={[styles.orb, styles.orbTopRight]} />
          <View style={[styles.orb, styles.orbBottomLeft]} />
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>VISÃO GERAL</Text>
          <Text style={styles.sectionTitle}>Resumo do Estoque</Text>

          <View style={styles.statsGrid}>
            {STATS.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <LinearGradient
                  colors={stat.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statIconBg}
                >
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                </LinearGradient>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AÇÕES RÁPIDAS</Text>
          <Text style={styles.sectionTitle}>O que deseja fazer?</Text>

          <View style={styles.actionsGrid}>
            {ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionLabel}>ATIVIDADE</Text>
          <Text style={styles.sectionTitle}>Movimentações Recentes</Text>

          <View style={styles.activityList}>
            {ACTIVITIES.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Text style={[styles.activityBadge, { color: activity.color }]}>
                  {activity.type}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const STATS = [
  {
    icon: '🧪',
    value: '248',
    label: 'Itens',
    gradient: ['#1a1a2e', '#16213e'] as const,
  },
  {
    icon: '⚗️',
    value: '32',
    label: 'Categorias',
    gradient: ['#1a1a2e', '#0f3460'] as const,
  },
  {
    icon: '📦',
    value: '14',
    label: 'Baixo Estoque',
    gradient: ['#2a1a1a', '#3d1a1a'] as const,
  },
  {
    icon: '✅',
    value: '99%',
    label: 'Precisão',
    gradient: ['#1a2a1a', '#1a3d1a'] as const,
  },
];

const ACTIONS = [
  {
    icon: '➕',
    title: 'Novo Item',
    description: 'Cadastrar produto no estoque',
    gradient: ['#6C63FF22', '#9B59B611'] as const,
  },
  {
    icon: '🔍',
    title: 'Buscar',
    description: 'Encontrar produto rapidamente',
    gradient: ['#00C9A722', '#00B4D811'] as const,
  },
  {
    icon: '📊',
    title: 'Relatório',
    description: 'Visualizar estatísticas',
    gradient: ['#F7971E22', '#FFD20011'] as const,
  },
  {
    icon: '🔄',
    title: 'Movimentar',
    description: 'Entrada ou saída de itens',
    gradient: ['#F953C622', '#B91D7311'] as const,
  },
];

const ACTIVITIES = [
  { title: 'Ácido Sulfúrico H₂SO₄', time: 'Há 5 minutos', type: 'ENTRADA', color: '#4ADE80' },
  { title: 'Etanol 96°', time: 'Há 23 minutos', type: 'SAÍDA', color: '#F87171' },
  { title: 'NaOH Solução 1M', time: 'Há 1 hora', type: 'ENTRADA', color: '#4ADE80' },
  { title: 'Glicose P.A.', time: 'Há 2 horas', type: 'SAÍDA', color: '#F87171' },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Hero
  hero: {
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: 58,
  },
  heroSubtitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#A78BFA',
    marginTop: 4,
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
    maxWidth: 280,
    marginBottom: 32,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  orb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.15,
  },
  orbTopRight: {
    backgroundColor: '#6C63FF',
    top: -60,
    right: -60,
  },
  orbBottomLeft: {
    backgroundColor: '#9B59B6',
    bottom: -80,
    left: -40,
  },

  // Sections
  section: {
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  lastSection: {
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6C63FF',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#12121A',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
    fontWeight: '500',
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionGradient: {
    padding: 20,
    minHeight: 130,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 18,
  },

  // Activity
  activityList: {
    gap: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  activityBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
