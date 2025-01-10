/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
*/

// Apple Ios Colors
export const appleBlue = `#007AFF`;
export const appleGreen = `#34C759`;
export const applePurple = `#5856D6`;
export const appleYellow = `#FFCC00`;
export const appleGreenMint = `#AAF0D1`;
export const appleGreenShade = `rgba(0, 125, 27, 1)`;
export const appleRed = web() ? `rgb(212 67 59)` : `#FF3B30`;

export const paperColor = `#f0f0f0`;
export const tintColorDark = `#fff`;
export const tintColorLight = `#2f95dc`;
export const defaultNavyBlue = `#04397b`;
export const defaultDarkTabBG = `#121212`;
export const defaultDarkTabBorderColor = `#272729`;
export const defaultDarkColor = `rgba(255,255,255,0.1)`;

// Spacing
export const borderRadius = 10;

export const vertImages = {
  hand_leaf: `https://raw.githubusercontent.com/strawhat19/mydex/main/assets/images/hq/nature.jpg`,
  playing_keyboard: `https://raw.githubusercontent.com/strawhat19/mydex/main/assets/images/hq/music.jpg`,
  singing_rockstar: `https://raw.githubusercontent.com/strawhat19/mydex/main/assets/images/hq/singing.jpg`,
  wind_flag: `https://images.pexels.com/photos/933877/pexels-photo-933877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  wind_mills: `https://images.pexels.com/photos/414943/pexels-photo-414943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  jelly_fish: `https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  wind_curtains: `https://images.pexels.com/photos/2724373/pexels-photo-2724373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
}

export const defaultTabStyles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
}

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
}

import { Text as DefaultText, View as DefaultView } from 'react-native';
import { useColorScheme } from './useColorScheme';
import { web } from '@/shared/shared';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}