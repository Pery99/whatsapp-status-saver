import React, { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: "#25D366",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E0E0E0",
  error: "#F44336",
  success: "#4CAF50",
  overlay: "rgba(0, 0, 0, 0.5)",
};

const darkColors = {
  primary: "#25D366",
  background: "#121212",
  surface: "#1E1E1E",
  card: "#2C2C2C",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#333333",
  error: "#CF6679",
  success: "#4CAF50",
  overlay: "rgba(0, 0, 0, 0.7)",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("auto");
  const systemColorScheme = useColorScheme();

  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, setTheme, toggleTheme, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
