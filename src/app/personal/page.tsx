'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Bookmark, History, Settings, HelpCircle, LogOut, User, Mail, Calendar } from 'lucide-react';
import { NewsItem } from '@/types/news';
import { useAuth } from '@/components/AuthContext';

export default function PersonalPage() {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 加载统计数据
  useEffect(() => {
    // 获取收藏数量
    const bookmarks = localStorage.getItem('bookmarks');
    if (bookmarks) {
      setBookmarkCount(JSON.parse(bookmarks).length);
    }

    // 获取历史记录数量
    const history = localStorage.getItem('readingHistory');
    if (history) {
      setHistoryCount(JSON.parse(history).length);
    }
  }, []);

  // 处理登出
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 如果正在加载或未登录，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-300/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 个人中心标题 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="用户头像" 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>注册时间: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* 功能入口列表 */}
        <div className="space-y-4">
          <Link 
            href="/favorites"
            className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">我的收藏</h3>
                  <p className="text-sm text-gray-500 mt-0.5">查看和管理收藏的新闻</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full">
                {bookmarkCount}
              </span>
            </div>
          </Link>

          <Link 
            href="/history"
            className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">阅读历史</h3>
                  <p className="text-sm text-gray-500 mt-0.5">查看浏览过的新闻记录</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full">
                {historyCount}
              </span>
            </div>
          </Link>

          <Link 
            href="/settings"
            className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">设置</h3>
                <p className="text-sm text-gray-500 mt-0.5">偏好设置和账户管理</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/help"
            className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">帮助与反馈</h3>
                <p className="text-sm text-gray-500 mt-0.5">使用帮助和问题反馈</p>
              </div>
            </div>
          </Link>

          {/* 登出按钮 */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-6 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-red-900">退出登录</h3>
                <p className="text-sm text-red-500 mt-0.5">安全退出当前账户</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}