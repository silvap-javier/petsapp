// src/theme/Theme.js
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const PetsAppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FDF6EC",
    primary: "#A0C4A8",
    secondary: "#F2B5A7",
    text: "#333333",
    surface: "#FFFFFF",
  },
  roundness: 12,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: "Poppins-Regular",
    },
    medium: {
      fontFamily: "Poppins-Medium",
    },
    bold: {
      fontFamily: "Poppins-Bold",
    },
  },
};

export { petsAppTheme as default, petsAppTheme } from "../theme";
