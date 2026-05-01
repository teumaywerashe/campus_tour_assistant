import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply theme to <html> immediately (called before first render to avoid flash)
function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) return JSON.parse(saved);
  // Fall back to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Apply before React hydrates to prevent flash of wrong theme
const initialDark = getInitialTheme();
applyTheme(initialDark);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(initialDark);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    applyTheme(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
