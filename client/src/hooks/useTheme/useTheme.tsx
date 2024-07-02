import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export enum ThemeMode {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

interface Context {
  theme: ThemeMode | undefined;
  switchTheme: (newTheme: ThemeMode) => void;
}

const ThemeContext = createContext<Context | undefined>(undefined);

export const ThemeContextProvider = ThemeContext.Provider;

export const ThemeContextWrapper = ({ children }: { children: ReactNode }): JSX.Element => {
  const [theme, setTheme] = useState<ThemeMode | undefined>(undefined);
  const [isSystemDark, setIsSystemDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme && Object.values(ThemeMode).includes(storedTheme as ThemeMode)) {
      setTheme(storedTheme as ThemeMode);
    } else {
      setTheme(ThemeMode.SYSTEM);
    }
    setIsSystemDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    const rootElem = document.querySelector('html');

    if (rootElem && theme !== undefined) {
      // remove old theme classes
      rootElem.classList.remove('light', 'dark');

      // if dark or system theme is dark
      if (theme === ThemeMode.DARK || (theme === ThemeMode.SYSTEM && isSystemDark)) {
        rootElem.classList.add('dark');
      } else {
        rootElem.classList.add('light');
      }

      if (window.localStorage.getItem('theme') !== theme) {
        window.localStorage.setItem('theme', theme.toString());
      }
    }
  }, [isSystemDark, theme]);

  const switchTheme = (newTheme: ThemeMode): void => setTheme(newTheme);

  const value = {
    switchTheme,
    theme,
    isSystemDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Context => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ContextProvider');
  }
  return context;
};
