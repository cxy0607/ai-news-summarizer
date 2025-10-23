// src/components/ThemeToggle.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type ThemeMode = 'light' | 'dark' | 'system';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    const root = document.documentElement;
    
    // 先移除现有的主题类
    root.classList.remove('dark', 'light');
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
      root.setAttribute('data-theme', systemTheme);
    } else {
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
      root.setAttribute('data-theme', newTheme);
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    // 强制重新渲染页面以应用主题
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex bg-gray-800/60 dark:bg-gray-900/80 backdrop-blur-md border border-gray-600/20 rounded-lg p-1">
        <button
          onClick={() => handleThemeChange('light')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            theme === 'light' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">浅色</span>
        </button>
        
        <button
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            theme === 'dark' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">深色</span>
        </button>
        
        <button
          onClick={() => handleThemeChange('system')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            theme === 'system' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">系统</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;