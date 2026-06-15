/**
 * App.tsx — Root entry point
 *
 * Wraps the entire app in NavigationContainer and renders the
 * Instagram-style TabNavigator. Tab 2 (🧪 Estoque) hosts the full
 * inventory management UI: Dashboard → Reagentes → ReagenteDetail.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// enableScreens() must be called before any navigator renders
// to activate native screen components from react-native-screens
import { enableScreens } from 'react-native-screens';
import { TabNavigator } from './src/navigation/TabNavigator';

enableScreens();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
