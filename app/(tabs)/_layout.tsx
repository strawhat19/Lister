import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { colors } from '@/components/theme/Themed';
import { tabBarIconSize } from '@/shared/variables';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useClientOnlyValue } from '@/components/theme/useClientOnlyValue';

export default function TabLayout({ backgroundColor = colors.transparent }) {
  const { user, selected } = useContext<any>(SharedContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.active,
        headerShown: useClientOnlyValue(false, true),
        tabBarInactiveTintColor: colors.disabled,
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
          backgroundColor: colors.mainBG,
          borderColor: colors.transparent,
          display: user == null ? `none` : `flex`,
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
      {/* <Tabs.Screen
        name={`experiments`}
        options={{ 
          title: `Notifications`, 
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`bell`} size={tabBarIconSize} color={color} />
          ), 
        }}
      /> */}
      <Tabs.Screen
        name={`notifications`}
        options={{ 
          title: `Notifications`, 
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
            <FontAwesome name={`gears`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
      <Tabs.Screen
        name={`profile`} 
        options={{ 
          title: `Profile`, 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name={`user`} size={tabBarIconSize} color={color} />
          ), 
        }}
      />
    </Tabs>
  )
}