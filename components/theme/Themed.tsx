/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
*/

import { Platform } from 'react-native';
import { useColorScheme } from './useColorScheme';
import { ThemeProps } from '@/shared/types/types';
import { Text as DefaultText, View as DefaultView } from 'react-native';

// Sizing & Spacing
export const borderRadius = 10;
export const itemCardHeight = 150;

export const cardColors = {
  navy: `#04397b`,
  appleBlue: `#007AFF`,
  appleGreen: `#34C759`,
  applePurple: `#5856D6`,
  appleYellow: `#FFCC00`,
  appleGreenMint: `#AAF0D1`,
  appleGreenShade: `rgba(0, 125, 27, 1)`,
  appleRed: Platform.OS == `web` ? `rgb(212 67 59)` : `#FF3B30`,
}

export const randomCardColor = (colorsObject = cardColors) => {
  const colorValues = Object.values(colorsObject);
  const randomIndex = Math.floor(Math.random() * colorValues.length);
  return colorValues[randomIndex];
}

// Colors
export const colors = {
  ...cardColors,
  ccc: `#cccccc`,
  dark: `#272729`,
  black: `#000000`,
  paper: `#f0f0f0`,
  white: `#ffffff`,
  light: `#2f95dc`,
  mainBG: `#13181f`,
  background: `#13181f`,
  darkTabBorder: `#272729`,
  blackGlass: (alpha) => `rgba(0,0,0, ${alpha})`,
}

export type TextProps = ThemeProps & DefaultText[`props`];
export type ViewProps = ThemeProps & DefaultView[`props`];

export const defaultTabStyles = {
  title: {
    fontSize: 20,
    fontWeight: `bold`,
  },
  separator: {
    height: 1,
    width: `80%`,
    marginVertical: 30,
  },
  container: {
    flex: 1,
    alignItems: `center`,
    justifyContent: `center`,
  },
}

export const ThemedColors = {
  light: {
    text: colors.black,
    tint: colors.light,
    background: colors.white,
    tabIconDefault: colors.ccc,
    tabIconSelected: colors.light,
  },
  dark: {
    tint: colors.dark,
    text: colors.white,
    background: colors.black,
    tabIconDefault: colors.ccc,
    tabIconSelected: colors.dark,
  },
}

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