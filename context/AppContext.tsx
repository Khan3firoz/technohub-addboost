
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: { name: string } | null;
  setUser: (user: { name: string } | null) => void;
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize theme based on system preference or local storage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light'; // Default fallback
  });

  const [user, setUser] = useState<{ name: string } | null>({ name: 'Guest' });
  const [isAdmin, setIsAdmin] = useState(false);

  // Toggle Tailwind Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, setUser, isAdmin, toggleAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
