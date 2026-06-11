import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/Colors';

type TabConfig = {
  name: string;
  href: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
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
  onPress?: () => void;
  onLongPress?: () => void;
};

const TabItem = React.forwardRef<View, TabItemProps>(
  ({ isFocused, tab, onPress, onLongPress }, ref) => {
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
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabBar}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} style={styles.tabTrigger} asChild>
            <TabItem tab={tab} />
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
