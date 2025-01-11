import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors, Text, View } from '@/components/theme/Themed';
import { useClientOnlyValue } from '@/components/theme/useClientOnlyValue';

export default function TabLayout({ backgroundColor = colors.columnBG }) {
  let { activeTopName } = useContext<any>(SharedContext);
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: `white`,
        tabBarActiveTintColor: colors.appleBlue,
        headerShown: useClientOnlyValue(false, true),
        tabBarLabelStyle: {
          fontWeight: 700,
        },
        headerStyle: {
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          backgroundColor, // Fully transparent background
        },
        tabBarStyle: {
          paddingTop: 5,
          minHeight: 60,
          backgroundColor,
          paddingBottom: 10,
          borderColor: `transparent`,
        },
      }}>
      <Tabs.Screen
        name={`index`}
        options={{
          title: `Boards`,
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name={`home`} color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name={`profile`}
        options={{
          title: `Profile`,
          headerTitleStyle: {
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color }) => <FontAwesome name={`id-card`} color={color} size={15} />,
        }}
      />
      <Tabs.Screen
        name={`experiments`}
        options={{
          title: `Experiments`,
          headerTitleStyle: {
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color }) => <FontAwesome name={`flask`} color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name={`settings`}
        options={{
          title: `Settings`,
          headerTitleStyle: {
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color }) => <FontAwesome name={`cog`} color={color} size={18} />,
        }}
      />
    </Tabs>
  )
}