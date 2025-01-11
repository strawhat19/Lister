import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors, View } from '@/components/theme/Themed';
import { useClientOnlyValue } from '@/components/theme/useClientOnlyValue';

export default function TabLayout({ backgroundColor = colors.columnBG }) {
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
          title: `Columns`,
          headerTitleStyle: {
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
          },
          // headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name={`home`} color={color} size={18} />,
          headerRight: () => (
            // <Link href={`/modal`} asChild>
              <>
                <View style={{ display: `flex`, flexDirection: `row` }}>
                  {/* <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        size={18}
                        name={`chevron-left`}
                        color={ThemedColors[colorScheme ?? `dark`].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        size={18}
                        name={`chevron-right`}
                        color={ThemedColors[colorScheme ?? `dark`].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable> */}
                </View>
              </>
            // {/* </Link> */}
          ),
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