// src/hooks/useDarkMode.ts
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/user';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // 从本地存储加载偏好设置
    if (typeof window !== 'undefined') {
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        const prefs: UserPreferences = JSON.parse(savedPrefs);
        setDarkMode(prefs.darkMode);
      }
      
      // 应用暗黑模式类
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // 保存到本地存储
    if (typeof window !== 'undefined') {
      const savedPrefs = localStorage.getItem('userPreferences');
      const prefs: UserPreferences = savedPrefs 
        ? JSON.parse(savedPrefs) 
        : { darkMode: false, subscriptions: [] };
      
      prefs.darkMode = newMode;
      localStorage.setItem('userPreferences', JSON.stringify(prefs));
      
      // 立即更新DOM
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return { darkMode, toggleDarkMode };
}