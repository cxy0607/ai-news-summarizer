// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Home, Bookmark, History, User, Menu, X, 
  MessageSquare, Sun, Moon, Search 
} from 'lucide-react';

export default function Navbar() {
  const [activePath, setActivePath] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 初始化路由和暗黑模式状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 同步当前路由
      setActivePath(window.location.pathname);
      const handleRouteChange = () => setActivePath(window.location.pathname);
      window.addEventListener('popstate', handleRouteChange);

      // 同步暗黑模式设置
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      document.documentElement.classList.toggle('dark', savedDarkMode);

      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, []);

  // 切换暗黑模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  // 反馈功能处理
  const handleFeedback = () => {
    alert('反馈功能：请输入您的建议或问题');
  };

  // 导航项激活样式处理
  const getNavClass = (path: string) => 
    activePath === path 
      ? 'text-blue-600 font-medium' 
      : 'text-gray-600 hover:text-blue-600 transition-colors';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧：Logo + 核心导航 */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">智闻快览</span>
            </Link>
            
            {/* 桌面端导航菜单 */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className={getNavClass('/')}>
                <div className="flex items-center gap-1.5">
                  <Home className="w-4 h-4" />
                  <span>首页</span>
                </div>
              </Link>
              <Link href="/favorites" className={getNavClass('/favorites')}>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  <span>收藏</span>
                </div>
              </Link>
              <Link href="/history" className={getNavClass('/history')}>
                <div className="flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  <span>历史</span>
                </div>
              </Link>
            </div>
          </div>

          {/* 右侧：功能按钮区 */}
          <div className="flex items-center gap-4">
            {/* 搜索按钮 */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="搜索新闻"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* 暗黑模式切换 */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={darkMode ? "切换到浅色模式" : "切换到暗黑模式"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {/* 反馈按钮（仅桌面显示） */}
            <button 
              onClick={handleFeedback}
              className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="反馈建议"
            >
              <MessageSquare className="w-4 h-4" />
              <span>反馈</span>
            </button>
            
            {/* 个人中心入口 */}
            <Link 
              href="/personal" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="个人中心"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">我的</span>
            </Link>
            
            {/* 移动端菜单按钮 - 修复三元运算符语法 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {/* 关键修复：确保三元运算符完整（条件 ? 结果1 : 结果2） */}
              {isMobileMenuOpen ? <X className="h-6 w-6 flex" /> : <Menu className="h-6 w-6 flex" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>首页</span>
            </Link>
            <Link 
              href="/favorites" 
              className="flex items-center gap-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bookmark className="w-5 h-5" />
              <span>收藏</span>
            </Link>
            <Link 
              href="/history" 
              className="flex items-center gap-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <History className="w-5 h-5" />
              <span>历史</span>
            </Link>
            <Link 
              href="/personal" 
              className="flex items-center gap-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>我的</span>
            </Link>
            <button 
              onClick={() => {
                handleFeedback();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 w-full text-left"
            >
              <MessageSquare className="w-5 h-5" />
              <span>反馈</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}