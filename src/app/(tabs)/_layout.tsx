import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { useWindowDimensions, type ColorValue } from 'react-native';

import type { IconName } from '@/components/ui';
import { colors } from '@/theme';

// Wide windows (tablet, landscape phone, desktop web) get a sidebar instead of
// bottom tabs. Same navigator, same routes — only the presentation changes.
const SIDEBAR_BREAKPOINT = 768;

function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ focused, color }: { focused: boolean; color: ColorValue }) {
    return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
  };
}

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= SIDEBAR_BREAKPOINT;

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: '600' },
        tabBarPosition: isWide ? 'left' : 'bottom',
        tabBarLabelPosition: isWide ? 'beside-icon' : 'below-icon',
        tabBarVariant: isWide ? 'material' : 'uikit',
        tabBarActiveBackgroundColor: isWide ? '#E3EAFD' : undefined,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: tabIcon('search', 'search-outline') }} />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', headerShown: false, tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
