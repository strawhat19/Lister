import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import Shared from '@/shared/shared';
export { ErrorBoundary } from 'expo-router';
import { Themes } from '@/shared/types/types';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/theme/useColorScheme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

export const unstable_settings = { initialRouteName: `/index` };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  return (
    <Shared>
      <ThemeProvider value={colorScheme === Themes.Dark ? DarkTheme : DarkTheme}>
        <Stack>
          <Stack.Screen name={`index`} options={{ headerShown: false }} />
          <Stack.Screen name={`(tabs)`} options={{ headerShown: false }} />
          <Stack.Screen name={`modal`} options={{ presentation: `modal` }} />
        </Stack>
      </ThemeProvider>
    </Shared>
  )
}