import { itemHeight } from '@/shared/variables';
import { useColorScheme } from './useColorScheme';
import { ThemeProps } from '@/shared/types/types';
import { Platform, StyleSheet } from 'react-native';
import { Text as DefaultText, View as DefaultView } from 'react-native';

// Sizing & Spacing
export const borderRadius = 10;
export const itemCardHeight = 150;
export const taskBorderRadius = 8;
export const itemSimplifiedCardHeight = `auto`;

export const fontFamilies = {
  arial: `Arial`,
  spacemono: `SpaceMono`,
  montserrat: `Montserrat`,
}

export const fontFamily = fontFamilies.spacemono;

// Colors
export const lightColors = {
  cyan: `rgba(0, 255, 255, 1)`,
  ccc: `rgba(204, 204, 204, 1)`,
  white: `rgba(255, 255, 255, 1)`,
  paper: `rgba(240, 240, 240, 1)`,
  cream: `rgba(255, 253, 208, 1)`,
  softPink: `rgba(255, 182, 193, 1)`,
  appleMint: `rgba(174, 230, 216, 1)`,
  appleYellow: `rgba(255, 204, 0, 1)`,
  appleGolden: `rgba(255, 215, 0, 1)`,
  lightGray: `rgba(204, 204, 204, 1)`,
  pastelPink: `rgba(255, 209, 220, 1)`,
  appleGreenMint: `rgba(170, 240, 209, 1)`,
}

export const cardColors = {
  ...lightColors,
  red: `rgba(255, 0, 0, 1)`,
  tomato: `rgba(255, 99, 71, 1)`,
  light: `rgba(47, 149, 220, 1)`,
  hotPink: `rgba(255, 105, 180, 1)`,
  appleBlue: `rgba(0, 122, 255, 1)`,
  coolGray: `rgba(119, 136, 153, 1)`,
  appleGreen: `rgba(52, 199, 89, 1)`,
  lightBlue: `rgba(47, 149, 220, 1)`,
  disabledFont: `rgb(105, 124, 147)`,
  applePurple: `rgba(88, 86, 214, 1)`,
  steelGray: `rgba(112, 128, 144, 1)`,
  neonHotPink: `rgba(255, 20, 147, 1)`,
  electricCyan: `rgba(0, 191, 255, 1)`,
  deepRoyalBlue: `rgba(63, 81, 181, 1)`,
  appleGreenShade: `rgba(0, 125, 27, 1)`,
  lavenderPurple: `rgba(150, 123, 182, 1)`,
  defaultTextInputPlaceholderFontColor: `rgba(136, 136, 136, 1)`,
  appleRed: Platform.OS === `web` ? `rgba(212, 67, 59, 1)` : `rgba(255, 59, 48, 1)`,
}

export const commonColors = {
  black: `rgba(0, 0, 0, 1)`,
  transparent: `transparent`,
  blue: `rgba(0, 0, 255, 1)`,
  navy: `rgba(4, 57, 123, 1)`,
  dark: `rgba(39, 39, 41, 1)`,
  ogDark: `rgba(19, 24, 31, 1)`,
  pasteBlackBG: `rgba(42, 47, 53, 1)`,
  jiraColumnBG: `rgba(35, 38, 42, 1)`,
}

export const allColors = {
  ...cardColors,
  ...commonColors,
  blackGlass: (alpha = 0.5) => `rgba(0, 0, 0, ${alpha})`,
  darkGlass: (alpha = 0.5) => `rgba(39, 39, 41, ${alpha})`,
  whiteGlass: (alpha = 0.5) => `rgba(255, 255, 255, ${alpha})`,
}

export const fontColors = {
  darkFont: allColors.dark,
  lightFont: allColors.white,
}

export const themeColors = {
  error: allColors.red,
  info: allColors.appleBlue,
  success: allColors.appleGreen,
  warning: allColors.appleGolden,
  activeColor: allColors.appleBlue,
  inactiveColor: allColors.disabledFont,
}

export const themes = {
  dark: {
    ...fontColors,
    ...themeColors,
    taskBG: allColors.black,
    mainBG: allColors.black,
    listsBG: allColors.dark,
    inputBG: allColors.black,
    taskColor: allColors.white,
    inputColor: allColors.white,
    taskBGComplete: allColors.white,
    taskColorComplete: allColors.black,
  },
  light: {
    ...fontColors,
    ...themeColors,
    taskBG: allColors.white,
    mainBG: allColors.white,
    inputBG: allColors.white,
    taskColor: allColors.dark,
    inputColor: allColors.dark,
    listsBG: allColors.steelGray,
    taskBGComplete: allColors.dark,
    taskColorComplete: allColors.white,
  },
  steel: {
    ...fontColors,
    ...themeColors,
    taskBG: allColors.black,
    inputBG: allColors.black,
    taskColor: allColors.white,
    inputColor: allColors.white,
    mainBG: allColors.appleGreen,
    listsBG: allColors.steelGray,
    taskBGComplete: allColors.white,
  },
  gray: {
    ...fontColors,
    ...themeColors,
    taskBG: allColors.black,
    inputBG: allColors.black,
    listsBG: allColors.white,
    taskColor: allColors.white,
    mainBG: allColors.coolGray,
    inputColor: allColors.white,
    activeColor: allColors.black,
    inactiveColor: allColors.white,
    taskBGComplete: allColors.white,
  },
}

export const themeToUse = themes.dark;

export const colors = {
  ...allColors,
  ...themeToUse,
}

export const isLightColor = (colorString) => Object.values(lightColors).includes(colorString);

export const findColorKey = (color: string, colors: Record<string, string | ((alpha: number) => string)>): string | undefined => {
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === `string` && value === color) {
      return key;
    }
  }
  return color;
}

const rgbaToHsl = (rgba: string): [number, number, number] => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error("Invalid RGBA color string");

  const [r, g, b] = match.slice(1, 4).map((v) => parseInt(v, 10) / 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, s * 100, l * 100];
};

// Helper function to calculate hue difference
const hueDifference = (hue1: number, hue2: number) => {
  const diff = Math.abs(hue1 - hue2);
  return Math.min(diff, 360 - diff); // Wraparound difference
};

export const randomCardColor = (colorsObject = cardColors, previousColor?: string): string => {
  const colorValues = Object.values(colorsObject).filter((color) => typeof color === "string") as string[];

  let previousHue: number | null = null;
  if (previousColor) {
    try {
      previousHue = rgbaToHsl(previousColor)[0];
    } catch {
      console.warn("Invalid previous color provided, skipping contrast check.");
    }
  }

  if (previousHue !== null) {
    // Filter colors to ensure contrasting hue
    const contrastingColors = colorValues.filter((color) => {
      try {
        const [hue] = rgbaToHsl(color);
        return hueDifference(previousHue, hue) > 60; // Ensure at least 60° hue difference
      } catch {
        return true; // Keep colors we cannot parse
      }
    });

    // Pick a random contrasting color
    if (contrastingColors.length > 0) {
      const randomIndex = Math.floor(Math.random() * contrastingColors.length);
      return contrastingColors[randomIndex];
    }
  }

  // Fallback: Pick any random color
  const randomIndex = Math.floor(Math.random() * colorValues.length);
  return colorValues[randomIndex];
};

export type TextProps = ThemeProps & DefaultText[`props`];
export type ViewProps = ThemeProps & DefaultView[`props`];

export const globalStyles = StyleSheet.create({
  flexRow: {
    display: `flex`, 
    flexDirection: `row`, 
    alignItems: `center`,
  },
  singleLineInput: { 
    gap: 5, 
    width: `100%`,
    marginTop: 12,
    display: `flex`, 
    overflow: `hidden`,
    flexDirection: `row`, 
    alignItems: `center`,
    position: `relative`,
    maxHeight: itemHeight,
    borderRadius: taskBorderRadius,
    backgroundColor: colors.transparent,
},
})

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