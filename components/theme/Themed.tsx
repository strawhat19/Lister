/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
*/

import { Platform } from 'react-native';
import { useColorScheme } from './useColorScheme';
import { Text as DefaultText, View as DefaultView } from 'react-native';

// Spacing
export const borderRadius = 10;

// Colors
export const colors = {
  black: `#000000`,
  white: `#ffffff`,
  mainBG: `#13181f`,
  appleBlue: `#007AFF`,
  appleGreen: `#34C759`,
  background: `#13181f`,
  applePurple: `#5856D6`,
  appleYellow: `#FFCC00`,
  appleGreenMint: `#AAF0D1`,
  appleGreenShade: `rgba(0, 125, 27, 1)`,
  appleRed: Platform.OS == `web` ? `rgb(212 67 59)` : `#FF3B30`,
}

export const paperColor = `#f0f0f0`;
export const tintColorDark = `#fff`;
export const tintColorLight = `#2f95dc`;
export const defaultNavyBlue = `#04397b`;
export const defaultDarkTabBG = `#121212`;
export const defaultDarkTabBorderColor = `#272729`;
export const defaultDarkColor = `rgba(255,255,255,0.1)`;

// Variables
export const pathToAssets = `assets/images/hq`;
export const pathToGithubAssets = `https://raw.githubusercontent.com/strawhat19/Lister/refs/heads/main/${pathToAssets}`;

export const vertImages = {
  hand_leaf: `${pathToGithubAssets}/nature_hand_leaf.jpg`,
  wind_curtains: `${pathToGithubAssets}/wind_curtains.jpeg`,
  jelly_fish: `${pathToGithubAssets}/nature_jelly_fish.jpeg`,
  wind_flag: `${pathToGithubAssets}/festivals_wind_flag.jpeg`,
  singing_rockstar: `${pathToGithubAssets}/music_singing.jpg`,
  wind_mills: `${pathToGithubAssets}/clean_energy_wind_mills.jpeg`,
  playing_keyboard: `${pathToGithubAssets}/music_playing_keyboard.jpg`,
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

export const ThemedColors = {
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

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof ThemedColors.light & keyof typeof ThemedColors.dark
) {
  const theme = useColorScheme() ?? 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return ThemedColors[theme][colorName];
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