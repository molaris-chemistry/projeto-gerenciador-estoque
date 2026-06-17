import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius as BorderRadius, Typography } from "@/constants/theme";
import { useAuth } from '@/contexts/AuthContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { useDashboard } from '@/contexts/DashboardContext';

const FontSize = Typography.size;
const FontWeight = Typography.weight;

type TabConfig = {
  name: string;
  href: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  {
    name: 'Dashboard',
    href: '/relatorios',
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
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <DashboardProvider>
      <AuthenticatedTabLayout />
    </DashboardProvider>
  );
}

function AuthenticatedTabLayout() {
  const { totalAlertas } = useDashboard();

  return (
    <View style={{ flex: 1 }}>
      <Tabs style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TabSlot />
        </View>
        <TabList style={styles.tabBar}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} style={styles.tabTrigger} asChild>
            <TabItem
              tab={tab}
              badgeCount={tab.name.toLowerCase() === 'dashboard' ? totalAlertas : 0}
            />
          </TabTrigger>
        ))}
      </TabList>
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
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
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderRadius: BorderRadius.full,
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
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
});
