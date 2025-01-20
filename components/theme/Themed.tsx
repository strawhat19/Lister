import { itemHeight } from '@/shared/variables';
import { useColorScheme } from './useColorScheme';
import { ThemeProps } from '@/shared/types/types';
import { Platform, StyleSheet } from 'react-native';
import { Text as DefaultText, View as DefaultView } from 'react-native';

// Sizing & Spacing
export const borderRadius = 4;
export const itemCardHeight = 150;
export const itemSimplifiedCardHeight = `auto`;
export const draggableViewItemBorderRadius = 8;

export const fontFamilies = {
  arial: `Arial`,
  spacemono: `SpaceMono`,
  montserrat: `Montserrat`,
}

export const fontFamily = fontFamilies.spacemono;

// Colors
export const brightColorThreshold = 128;
export const lightColors = {
  lime: `rgba(0, 255, 0, 1)`,
  neon: `rgba(57, 255, 20, 1)`,
  cyan: `rgba(0, 255, 255, 1)`,
  ash: `rgba(178, 190, 181, 1)`,
  yellow: `rgba(255, 255, 0, 1)`,
  orange: `rgba(255, 165, 0, 1)`,
  pink: `rgba(255, 192, 203, 1)`,
  mango: `rgba(255, 194, 77, 1)`,
  paste: `rgba(204, 204, 204, 1)`,
  white: `rgba(255, 255, 255, 1)`,
  paper: `rgba(240, 240, 240, 1)`,
  cream: `rgba(255, 253, 208, 1)`,
  peach: `rgba(255, 218, 185, 1)`,
  beige: `rgba(245, 245, 220, 1)`,
  ivory: `rgba(255, 255, 240, 1)`,
  silver: `rgba(192, 192, 192, 1)`,
  skyBlue: `rgba(135, 206, 235, 1)`,
  offwhite: `rgba(245, 245, 245, 1)`,
  lavender: `rgba(230, 230, 250, 1)`,
  softPink: `rgba(255, 182, 193, 1)`,
  appleGreen: `rgba(52, 199, 89, 1)`,
  appleMint: `rgba(174, 230, 216, 1)`,
  appleYellow: `rgba(255, 204, 0, 1)`,
  appleGolden: `rgba(255, 215, 0, 1)`,
  lightGray: `rgba(204, 204, 204, 1)`,
  pastelPink: `rgba(255, 209, 220, 1)`,
  appleGreenMint: `rgba(170, 240, 209, 1)`,
}

export const cardColors = {
  ...lightColors,
  iosBG: `#3e3e3e`,
  red: `rgba(255, 0, 0, 1)`,
  green: `rgba(0, 128, 0, 1)`,
  navy: `rgba(4, 57, 123, 1)`,
  teal: `rgba(0, 128, 128, 1)`,
  maroon: `rgba(128, 0, 0, 1)`,
  olive: `rgba(128, 128, 0, 1)`,
  brown: `rgba(165, 42, 42, 1)`,
  steel: `rgba(70, 130, 180, 1)`,
  gray: `rgba(128, 128, 128, 1)`,
  darkNavy: `rgba(0, 0, 128, 1)`,
  coral: `rgba(255, 127, 80, 1)`,
  purple: `rgba(128, 0, 128, 1)`,
  tomato: `rgba(255, 99, 71, 1)`,
  light: `rgba(47, 149, 220, 1)`,
  magenta: `rgba(255, 0, 255, 1)`,
  hotPink: `rgba(255, 105, 180, 1)`,
  appleBlue: `rgba(0, 122, 255, 1)`,
  coolGray: `rgba(119, 136, 153, 1)`,
  lightBlue: `rgba(47, 149, 220, 1)`,
  disabledFont: `rgb(105, 124, 147)`,
  applePurple: `rgba(88, 86, 214, 1)`,
  steelGray: `rgba(112, 128, 144, 1)`,
  neonHotPink: `rgba(255, 20, 147, 1)`,
  electricCyan: `rgba(0, 191, 255, 1)`,
  appleBlueMed: `rgba(0, 98, 204, 1)`,
  appleGreenMed: `rgba(42, 159, 71, 1)`,
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
  dark: `rgba(39, 39, 41, 1)`,
  gold: `rgba(255, 215, 0, 1)`,
  ogDark: `rgba(19, 24, 31, 1)`,
  violet: `rgba(138, 43, 226, 1)`,
  golden: `rgba(218, 165, 32, 1)`,
  pasteBlackBG: `rgba(42, 47, 53, 1)`,
  jiraColumnBG: `rgba(35, 38, 42, 1)`,
}

export const allColors = {
  ...cardColors,
  ...commonColors,
  // blackGlass: (alpha = 0.5) => `rgba(0, 0, 0, ${alpha})`,
  // darkGlass: (alpha = 0.5) => `rgba(39, 39, 41, ${alpha})`,
  // whiteGlass: (alpha = 0.5) => `rgba(255, 255, 255, ${alpha})`,
}

export const fontColors = {
  darkFont: allColors.dark,
  lightFont: allColors.white,
}

export const themeColors = {
  error: allColors.red,
  warn: allColors.yellow,
  tertiary: allColors.red,
  info: allColors.appleBlue,
  warning: allColors.yellow,
  active: allColors.appleBlue,
  primary: allColors.appleBlue,
  success: allColors.appleGreen,
  secondary: allColors.appleGreen,
  disabled: allColors.disabledFont,
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

const filteredColors: Record<string, string> = Object.entries(colors).reduce((acc, [key, value]) => {
  if (typeof value === "string") {
      acc[key] = value;
  }
  return acc;
}, {} as Record<string, string>);

export const convertToColorNamesRecord = (colors: Record<string, string>): Record<string, string> => {
  const result: Record<string, string> = {};
  const toTitleCase = (str: string): string =>
      str.replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to words
         .replace(/(^|\s)\w/g, match => match.toUpperCase()); // Capitalize each word
  for (const [key, value] of Object.entries(colors)) {
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || /^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+(\.\d+)?)?\)$/.test(value)) {
      result[value] = toTitleCase(key);
    }
  }
  return result;
}

const colorNamesRecord = convertToColorNamesRecord(filteredColors);

export const isLightColor = (colorCode: string): boolean => {
  let r: number, g: number, b: number;

  if (Object.values(lightColors).includes(colorCode)) {
    return true;
  }

  if (colorCode?.startsWith(`#`)) {
    colorCode = colorCode.replace(/^#/, ``);
    if (colorCode.length === 3) colorCode = colorCode.split(``).map(char => char + char).join(``);
    if (colorCode.length !== 6) return false;
    r = parseInt(colorCode.substring(0, 2), 16);
    g = parseInt(colorCode.substring(2, 4), 16);
    b = parseInt(colorCode.substring(4, 6), 16);
  } else if (colorCode?.startsWith(`rgba`)) {
    const match = colorCode.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return false;
    r = parseInt(match[1], 10);
    g = parseInt(match[2], 10);
    b = parseInt(match[3], 10);
  } else {
    return false;
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > brightColorThreshold;
};

export const getFontColor = (colorCode, darkFont = colors.darkFont, lightFont = colors.lightFont) => (
  (isLightColor(colorCode) || colorCode == `transparent`) ? darkFont : lightFont
);

export const findColorCodeToKey = (colorCode: string, colors: Record<string, string | ((alpha: number) => string)>): string | undefined => {
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === `string` && value === colorCode) {
      return key;
    }
  }
  return getColorName(colorCode);
}

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  hex = hex.replace(/^#/, ``);
  if (hex.length === 3) {
    hex = hex.split(``).map(char => char + char).join(``);
  }
  if (hex.length !== 6) return;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const rgbaToHex = (rgba: string): string => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);
  if (!match) {
    return;
  }
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;
  const toHex = (value: number) => value.toString(16).padStart(2, "0").toUpperCase();
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 255 ? toHex(a) : ""}`;
  return hex;
};

export const getFontColorForBackground = (colorCode: string): string | undefined => {
  let r: number, g: number, b: number;
  if (colorCode?.startsWith(`#`)) {
      colorCode = colorCode.replace(/^#/, ``);
      if (colorCode.length === 3) colorCode = colorCode.split(``).map(char => char + char).join(``);
      if (colorCode.length !== 6) return;
      r = parseInt(colorCode.substring(0, 2), 16);
      g = parseInt(colorCode.substring(2, 4), 16);
      b = parseInt(colorCode.substring(4, 6), 16);
  } else if (colorCode?.startsWith(`rgba`)) {
      const match = colorCode.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return;
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
  } else return;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > brightColorThreshold ? colors.darkFont : colors.lightFont;
};

export const getColorName = (color: string): string => {
  let customColorMessage = `Custom Color`;
  let r: number, g: number, b: number;
  if (color?.startsWith(`#`)) {
    color = color.replace(/^#/, "");
    if (color.length === 3) color = color.split("").map(char => char + char).join("");
    if (color.length !== 6) return customColorMessage;
    r = parseInt(color.substring(0, 2), 16);
    g = parseInt(color.substring(2, 4), 16);
    b = parseInt(color.substring(4, 6), 16);
    const hexColor = `#${color.toUpperCase()}`;
    if (colorNamesRecord[hexColor]) return colorNamesRecord[hexColor];
  } else if (color?.startsWith(`rgba`)) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return customColorMessage;
    r = parseInt(match[1], 10);
    g = parseInt(match[2], 10);
    b = parseInt(match[3], 10);
  } else {
    return customColorMessage;
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const lightness = brightness > brightColorThreshold ? `Light` : `Dark`;
  const primaryColor = r > g && r > b ? `Red` : g > r && g > b ? `Green` : b > r && b > g ? `Blue` : `Gray`;

  return `${lightness} ${primaryColor}`;
};

export const detectIfNameIsColor = async (name: string, lastColor: string) => {
  let colorKey;
  let backgroundColor;
  let colorEntries = Object.entries(colors);
  let nameIsColor = colorEntries.find(([key, value]) => 
    key.toLowerCase().split(` `).join(``) == name.toLowerCase().split(` `).join(``)
  );
  
  if (nameIsColor) {
    colorKey = nameIsColor[0];
    backgroundColor = nameIsColor[1];
  } else {
    backgroundColor = await randomCardColor();
    if (lastColor == backgroundColor) {
      backgroundColor = await randomCardColor(undefined, lastColor);
    }
    colorKey = findColorCodeToKey(backgroundColor, colors);
  }

  return {
    colorKey,
    backgroundColor,
  }
}

const rgbaToHsl = (rgba: string): [number, number, number] => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Invalid RGBA color string`);

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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: colors.transparent,
    borderBottomLeftRadius: draggableViewItemBorderRadius,
    borderBottomRightRadius: draggableViewItemBorderRadius,
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
    tabIconDefault: colors.paste,
    tabIconSelected: colors.light,
  },
  dark: {
    tint: colors.dark,
    text: colors.white,
    background: colors.black,
    tabIconDefault: colors.paste,
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