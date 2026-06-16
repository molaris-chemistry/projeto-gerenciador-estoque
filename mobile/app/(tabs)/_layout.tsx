import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/Colors';
import { useDashboard } from '@/contexts/DashboardContext';

type TabConfig = {
  name: string;
  href: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  {
    name: 'dashboard',
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'speedometer-outline',
    iconFocused: 'speedometer',
  },
  {
    name: 'index',
    href: '/',
    label: 'Catálogo',
    icon: 'flask-outline',
    iconFocused: 'flask',
  },
  {
    name: 'movimentacoes',
    href: '/movimentacoes',
    label: 'Movimentações',
    icon: 'swap-horizontal-outline',
    iconFocused: 'swap-horizontal',
  },
  {
    name: 'relatorios',
    href: '/relatorios',
    label: 'Relatórios',
    icon: 'bar-chart-outline',
    iconFocused: 'bar-chart',
  },
];

type TabItemProps = {
  isFocused?: boolean;
  tab: TabConfig;
  badgeCount?: number;
  onPress?: () => void;
  onLongPress?: () => void;
};

const TabItem = React.forwardRef<View, TabItemProps>(
  ({ isFocused, tab, badgeCount = 0, onPress, onLongPress }, ref) => {
    return (
      <TouchableOpacity
        ref={ref as any}
        style={styles.tabItem}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
          <Ionicons
            name={isFocused ? tab.iconFocused : tab.icon}
            size={22}
            color={isFocused ? Colors.primary : Colors.textTertiary}
          />
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
          numberOfLines={1}
        >
          {tab.label}
        </Text>
        {isFocused && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  }
);

export default function TabLayout() {
  const { totalAlertas } = useDashboard();

  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabBar}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} style={styles.tabTrigger} asChild>
            <TabItem
              tab={tab}
              badgeCount={tab.name === 'dashboard' ? totalAlertas : 0}
            />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 28,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tabTrigger: {
    flex: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  iconContainer: {
    width: 44,
    height: 32,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: 9,
    fontWeight: FontWeight.bold,
    lineHeight: 12,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
