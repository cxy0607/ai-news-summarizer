// src/contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark'; // 只保留两种模式

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // 实际应用的主题（这里和theme一致）
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  // 实际主题就是当前选择的主题（因为没有系统模式了）
  const getActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
    return currentTheme;
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    setTheme(savedTheme);
    const actual = getActualTheme(savedTheme);
    setActualTheme(actual);
    applyTheme(actual);
  }, []);

  useEffect(() => {
    if (mounted) {
      const actual = getActualTheme(theme);
      setActualTheme(actual);
      applyTheme(actual);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.toggle('dark', newTheme === 'dark');
    root.setAttribute('data-theme', newTheme);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-900 text-gray-100">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};