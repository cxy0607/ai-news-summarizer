// src/components/Navbar.tsx
import React from 'react';
import { Menu, X, User, Bookmark, History, Home, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { NavbarProps } from '@/types/navbar';
// 在现有导入中添加
import {  usePathname } from 'next/navigation';


const Navbar: React.FC<NavbarProps> = ({
  textColor = 'text-gray-800',
  activeColor = 'text-blue-600',
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  
  // 获取当前路径
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    // src/components/Navbar.tsx - 第28行修改

<nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 dark:bg-white/80 backdrop-blur-md border-b border-blue-500/20 dark:border-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                智能新闻
              </span>
            </Link>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`${currentPath === '/' ? activeColor : textColor} hover:text-cyan-400 transition-colors flex items-center gap-1.5`}
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>
            <Link 
              href="/favorites" 
              className={`${currentPath === '/favorites' ? activeColor : textColor} hover:text-cyan-400 transition-colors flex items-center gap-1.5`}
            >
              <Bookmark className="w-4 h-4" />
              <span>收藏</span>
            </Link>
            <Link 
              href="/history" 
              className={`${currentPath === '/history' ? activeColor : textColor} hover:text-cyan-400 transition-colors flex items-center gap-1.5`}
            >
              <History className="w-4 h-4" />
              <span>历史</span>
            </Link>
            <Link 
              href="/personal" 
              className={`${currentPath === '/personal' ? activeColor : textColor} hover:text-cyan-400 transition-colors flex items-center gap-1.5`}
            >
              <User className="w-4 h-4" />
              <span>我的</span>
            </Link>
            
            {/* 主题切换和登录/登出按钮 */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">
                    欢迎，{user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>登出</span>
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-1.5 text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>登录</span>
                </Link>
              )}
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={onToggleMobileMenu}
              className={`${textColor} hover:text-cyan-400`}
              aria-label="主菜单"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-blue-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={onToggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                currentPath === '/' ? activeColor : textColor
              }`}
            >
              首页
            </Link>
            <Link
              href="/favorites"
              onClick={onToggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                currentPath === '/favorites' ? activeColor : textColor
              }`}
            >
              收藏
            </Link>
            <Link
              href="/history"
              onClick={onToggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                currentPath === '/history' ? activeColor : textColor
              }`}
            >
              历史
            </Link>
            <Link
              href="/personal"
              onClick={onToggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                currentPath === '/personal' ? activeColor : textColor
              }`}
            >
              我的
            </Link>
            
            {/* 移动端登录/登出按钮 */}
            {isAuthenticated ? (
              <div className="px-3 py-2">
                <div className="text-gray-300 text-sm mb-2">
                  欢迎，{user?.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    onToggleMobileMenu();
                  }}
                  className="flex items-center gap-1.5 text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>登出</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onToggleMobileMenu}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;