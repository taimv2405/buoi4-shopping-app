import { Stack } from 'expo-router';

import { ProfileProvider } from '@/context/profile';
import { getProduct } from '@/data/products';
import { colors } from '@/theme';

// Root Stack: primary navigation (tabs) + screens that live outside it.
// - product/[productId] is pushed above the tabs, so the tab bar/sidebar is hidden.
// - review is a global modal reachable from any screen without duplicating it per tab.
export default function RootLayout() {
  return (
    <ProfileProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[productId]"
          options={({ route }) => {
            const { productId } = route.params as { productId?: string };
            return {
              title: getProduct(productId)?.name ?? 'Product not found',
              headerBackTitle: 'Back',
            };
          }}
        />
        <Stack.Screen name="review" options={{ presentation: 'modal', title: 'Create Review' }} />
      </Stack>
    </ProfileProvider>
  );
}
