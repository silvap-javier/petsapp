import { MD3LightTheme as DefaultTheme } from "react-native-paper";

const fontOverrides = {
  regular: { fontFamily: "Poppins-Regular" },
  medium: { fontFamily: "Poppins-Medium" },
  bold: { fontFamily: "Poppins-Bold" }
};

export const petsAppTheme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: "#A0C4A8",
    secondary: "#F2B5A7",
    background: "#FDF6EC",
    surface: "#FFFFFF",
    text: "#333333"
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: { ...DefaultTheme.fonts.regular, ...fontOverrides.regular },
    medium: { ...DefaultTheme.fonts.medium, ...fontOverrides.medium },
    titleLarge: { ...DefaultTheme.fonts.titleLarge, ...fontOverrides.bold }
  }
};

export type PetsAppTheme = typeof petsAppTheme;
