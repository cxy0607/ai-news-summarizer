'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Bookmark, History, Home, User } from 'lucide-react';
import { categories } from '@/data/news';

export default function Navbar() {
  const pathname = usePathname(); // 获取当前路径，用于高亮当前页

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 左侧Logo和首页入口 */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>新闻首页</span>
            </Link>
          </div>

          {/* 中间分类导航（仅在大屏幕显示） */}
          <div className="hidden md:flex items-center space-x-1">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category}
                href={`/categories/${category}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith(`/categories/${category}`) 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* 右侧个人功能入口 */}
          <div className="flex items-center gap-1">
            <Link
              href="/favorites"
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/favorites' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">收藏</span>
            </Link>
            
            <Link
              href="/history"
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/history' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">历史</span>
            </Link>
            
            <Link
              href="/personal"
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/personal' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">我的</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}