import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { FontAwesome6 } from '@expo/vector-icons';
import { colors } from '@/components/theme/Themed';
import { tabBarIconSize } from '@/shared/variables';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useClientOnlyValue } from '@/components/theme/useClientOnlyValue';

export default function TabLayout({ backgroundColor = colors.transparent }) {
  const { user, selected } = useContext<any>(SharedContext);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.disabled,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { 
          elevation: 0, 
          backgroundColor, 
          shadowOpacity: 0, 
        },
        tabBarLabelStyle: { 
          fontWeight: `bold`, 
          opacity: selected == null ? 1 : 0, 
        },
        tabBarStyle: {
          paddingTop: 5,
          minHeight: 60,
          paddingBottom: 10,
          borderColor: colors.transparent,
          display: user == null ? `none` : `flex`,
          backgroundColor: colors.tabBarBG ?? colors.mainBG,
          pointerEvents: selected == null ? `auto` : `none`,
        },
      }}>
      <Tabs.Screen
        name={`index`}
        options={{
          title: `Boards`,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name={`bars-progress`} size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={`items`}
        options={{ 
          title: `Items`, 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name={`bars-staggered`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
      <Tabs.Screen
        name={`search`}
        options={{ 
          title: `Search`, 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name={`magnifying-glass`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
      <Tabs.Screen
        name={`updates`}
        options={{ 
          title: `Updates`, 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`bell`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
      <Tabs.Screen
        name={`settings`}
        options={{ 
          title: `Settings`, 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name={`user-gear`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
    </Tabs>
  )
}