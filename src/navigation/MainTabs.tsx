import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { VARIANT } from '@constants/student';
import { THEME } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';

export type MainTabsParamList = {
  Shop: undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQty = useCartStore((state) => state.totalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="Shop"
      name="Shop"
      component={ShopStack}
      options={{
        tabBarLabel: 'Cửa hàng',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏬</Text>,
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="Cart"
      name="Cart"
      component={CartScreen}
      options={{
        tabBarLabel: 'Giỏ hàng',
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: {
          backgroundColor: THEME.secondary,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🛒</Text>,
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="Me"
      name="Me"
      component={MeScreen}
      options={{
        tabBarLabel: 'Tôi',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
      }}
    />
  );

  // Tab order based on VARIANT: 'cartFirst' or 'shopFirst'
  const screens =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartScreen, shopScreen, meScreen]
      : [shopScreen, cartScreen, meScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.textLight,
        tabBarStyle: {
          backgroundColor: THEME.surface,
          borderTopWidth: 1,
          borderTopColor: THEME.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {screens}
    </Tab.Navigator>
  );
};

export default MainTabs;
