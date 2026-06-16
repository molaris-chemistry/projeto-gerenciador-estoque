import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function RootLayout() {
  return (
    <DashboardProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0F' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="reagente/[id]"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
    </DashboardProvider>
  );
}
