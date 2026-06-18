import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: '#0A0A0F' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="reagente/novo"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="reagente/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="reagente/[id]/editar"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
    </AuthProvider>
  );
}
