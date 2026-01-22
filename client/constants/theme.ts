import { Platform } from "react-native";

const primaryLight = "#1B5E20";
const primaryDark = "#4CAF50";

export const Colors = {
  light: {
    text: "#212121",
    textSecondary: "#757575",
    textHint: "#BDBDBD",
    buttonText: "#FFFFFF",
    tabIconDefault: "#757575",
    tabIconSelected: primaryLight,
    link: primaryLight,
    primary: primaryLight,
    primaryLight: "#4CAF50",
    backgroundRoot: "#FAFAFA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#EEEEEE",
    error: "#D32F2F",
    warning: "#F57C00",
    success: "#388E3C",
    categorySupermarket: "#FF6F00",
    categoryTravel: "#1976D2",
    categoryDining: "#E91E63",
    categoryShopping: "#9C27B0",
    categoryBills: "#616161",
    cardVisa: "#1A1F71",
    cardMastercard: "#EB001B",
    cardAmex: "#006FCF",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9E9E9E",
    textHint: "#616161",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryDark,
    link: primaryDark,
    primary: primaryDark,
    primaryLight: "#81C784",
    backgroundRoot: "#121212",
    backgroundDefault: "#1E1E1E",
    backgroundSecondary: "#2C2C2C",
    backgroundTertiary: "#383838",
    error: "#EF5350",
    warning: "#FFB74D",
    success: "#66BB6A",
    categorySupermarket: "#FF9800",
    categoryTravel: "#42A5F5",
    categoryDining: "#F06292",
    categoryShopping: "#BA68C8",
    categoryBills: "#9E9E9E",
    cardVisa: "#5C6BC0",
    cardMastercard: "#EF5350",
    cardAmex: "#42A5F5",
  },
};

export const CategoryColors: Record<string, { light: string; dark: string }> = {
  supermarket: { light: "#FF6F00", dark: "#FF9800" },
  travel: { light: "#1976D2", dark: "#42A5F5" },
  dining: { light: "#E91E63", dark: "#F06292" },
  shopping: { light: "#9C27B0", dark: "#BA68C8" },
  bills: { light: "#616161", dark: "#9E9E9E" },
  other: { light: "#607D8B", dark: "#90A4AE" },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};
