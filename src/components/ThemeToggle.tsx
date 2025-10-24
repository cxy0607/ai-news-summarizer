// src/components/ThemeToggle.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react'; // 移除Monitor图标

type ThemeMode = 'light' | 'dark'; // 只保留两种模式

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从本地存储获取主题，默认为深色
    const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    const root = document.documentElement;
    
    // 移除所有主题类
    root.classList.remove('dark', 'light');
    
    // 应用新主题
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    root.setAttribute('data-theme', newTheme);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    // 触发主题变更事件
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
      </div>
    </div>
  );
};

export default ThemeToggle;