import { Stack } from 'expo-router';

import { colors } from '@/theme';

// Profile → Edit Profile drills down inside the Profile tab, so the tab bar stays visible.
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
    </Stack>
  );
}
