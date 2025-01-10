import 'react-native-reanimated';

import { useEffect } from 'react';
import Shared from '@/shared/shared';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Themes } from '@/shared/types/types';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/theme/useColorScheme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
  
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <Shared>
      <ThemeProvider value={colorScheme === Themes.Dark ? DarkTheme : DarkTheme}>
        <Stack>
          <Stack.Screen name={`(tabs)`} options={{ headerShown: false }} />
          <Stack.Screen name={`modal`} options={{ presentation: `modal` }} />
        </Stack>
      </ThemeProvider>
    </Shared>
  )
}