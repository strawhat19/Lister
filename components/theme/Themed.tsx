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

// Colors
export const lightColors = {
  appleMint: `rgba(174, 230, 216, 1)`,
  appleYellow: `rgba(255, 204, 0, 1)`,
  appleGolden: `rgba(255, 215, 0, 1)`,
  appleGreenMint: `rgba(170, 240, 209, 1)`,
}

export const cardColors = {
  ...lightColors,
  red: `rgba(255, 0, 0, 1)`,
  navy: `rgba(4, 57, 123, 1)`,
  appleBlue: `rgba(0, 122, 255, 1)`,
  applePurple: `rgba(88, 86, 214, 1)`,
  appleGreen: `rgba(52, 199, 89, 1)`,
  appleGreenShade: `rgba(0, 125, 27, 1)`,
  appleRed: Platform.OS === `web` ? `rgba(212, 67, 59, 1)` : `rgba(255, 59, 48, 1)`,
}

export const colors = {
  ...cardColors,
  ccc: `#cccccc`,
  dark: `#272729`,
  light: `#2f95dc`,
  transparent: `transparent`,
  black: `rgba(0, 0, 0, 1)`,
  mainBG: `rgba(0, 0, 0, 1)`,
  darkGray: `rgba(39, 39, 41, 1)`,
  paper: `rgba(240, 240, 240, 1)`,
  white: `rgba(255, 255, 255, 1)`,
  background: `rgba(19, 24, 31, 1)`,
  lightBlue: `rgba(47, 149, 220, 1)`,
  lightGray: `rgba(204, 204, 204, 1)`,
  darkTabBorder: `rgba(39, 39, 41, 1)`,
  pasteBlackBG: `rgba(42, 47, 53, 1)`,
  jiraColumnBG: `rgba(35, 38, 42, 1)`,
  blackGlass: (alpha) => `rgba(0, 0, 0, ${alpha})`,
}

export const randomCardColor = (colorsObject = cardColors, previousColor?: string) => {
  const colorValues = Object.values(colorsObject);
  if (previousColor && typeof previousColor === `string`) {
    const filteredColors = colorValues.filter(color => color !== previousColor);
    const randomIndex = Math.floor(Math.random() * filteredColors.length);
    return filteredColors[randomIndex];
  }
  const randomIndex = Math.floor(Math.random() * colorValues.length);
  return colorValues[randomIndex];
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