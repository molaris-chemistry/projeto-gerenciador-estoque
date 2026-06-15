import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { DashboardScreen } from '../screens/Tab2/DashboardScreen';
import { ReagentesScreen } from '../screens/Tab2/ReagentesScreen';
import { ReagenteDetailScreen } from '../screens/Tab2/ReagenteDetailScreen';
import type { RootTabParamList, Tab2StackParamList } from '../types';

const Tab2Stack = createNativeStackNavigator<Tab2StackParamList>();

const Tab2Navigator: React.FC = () => (
  <Tab2Stack.Navigator screenOptions={{ headerShown: false }}>
    <Tab2Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Tab2Stack.Screen name="Reagentes" component={ReagentesScreen} />
    <Tab2Stack.Screen name="ReagenteDetail" component={ReagenteDetailScreen} />
  </Tab2Stack.Navigator>
);

interface PlaceholderScreenProps {
  icon: string;
  label: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ icon, label }) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.icon}>{icon}</Text>
    <Text style={placeholderStyles.title}>{label}</Text>
    <Text style={placeholderStyles.subtitle}>Em desenvolvimento</Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  icon: { fontSize: 48 },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.textMuted,
  },
});

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, label, focused }) => (
  <View style={tabIconStyles.wrapper}>
    <Text style={tabIconStyles.emoji}>{emoji}</Text>
    <Text style={[tabIconStyles.label, focused && tabIconStyles.labelFocused]}>{label}</Text>
    {focused && <View style={tabIconStyles.activeDot} />}
  </View>
);

const tabIconStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
    width: 64,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: 10,
    fontWeight: Typography.weight.medium,
    color: Colors.tabBarInactive,
    letterSpacing: 0.2,
  },
  labelFocused: {
    color: Colors.tabBarActive,
    fontWeight: Typography.weight.bold,
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.tabBarActive,
  },
});

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.tabBarBg,
        borderTopColor: Colors.tabBarBorder,
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? 88 : 64,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        paddingTop: 8,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Tab1"
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🏠" label="Início" focused={focused} />
        ),
      }}
    >
      {() => <PlaceholderScreen icon="🏠" label="Início" />}
    </Tab.Screen>

    <Tab.Screen
      name="Tab2"
      component={Tab2Navigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🧪" label="Estoque" focused={focused} />
        ),
      }}
    />

    <Tab.Screen
      name="Tab3"
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="📋" label="Turmas" focused={focused} />
        ),
      }}
    >
      {() => <PlaceholderScreen icon="📋" label="Turmas" />}
    </Tab.Screen>

    <Tab.Screen
      name="Tab4"
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="📊" label="Relatórios" focused={focused} />
        ),
      }}
    >
      {() => <PlaceholderScreen icon="📊" label="Relatórios" />}
    </Tab.Screen>

    <Tab.Screen
      name="Tab5"
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="⚙️" label="Config" focused={focused} />
        ),
      }}
    >
      {() => <PlaceholderScreen icon="⚙️" label="Configurações" />}
    </Tab.Screen>
  </Tab.Navigator>
);
