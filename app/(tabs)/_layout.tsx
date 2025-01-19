import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { colors } from '@/components/theme/Themed';
import { tabBarIconSize } from '@/shared/variables';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useClientOnlyValue } from '@/components/theme/useClientOnlyValue';

export default function TabLayout({ backgroundColor = colors.mainBG }) {
  const { selected } = useContext<any>(SharedContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.activeColor,
        headerShown: useClientOnlyValue(false, true),
        tabBarInactiveTintColor: colors.inactiveColor,
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
          backgroundColor,
          paddingBottom: 10,
          borderColor: colors.transparent,
          pointerEvents: selected == null ? `auto` : `none`,
        },
      }}>
      <Tabs.Screen
        name={`index`}
        options={{
          title: `Kanban`,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`id-card`} size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={`notifications`}
        options={{ 
          title: `Notifications`, 
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`bell`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
      <Tabs.Screen
        name={`settings`}
        options={{ 
          title: `Settings`, 
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`gears`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
      <Tabs.Screen
        name={`profile`} 
        options={{ 
          title: `Profile`, 
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`user`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
    </Tabs>
  )
}