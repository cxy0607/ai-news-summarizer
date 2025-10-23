'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AvatarUpload from '@/components/AvatarUpload';
import { Bookmark, History, Settings, HelpCircle, LogOut, User, Mail, Calendar, Edit3, Star, TrendingUp, Bell, Shield, Zap } from 'lucide-react';
import { NewsItem } from '@/types/news';
import { useAuth } from '@/components/AuthContext';

export default function PersonalPage() {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
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
    const bookmarks = localStorage.getItem('favorites');
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

  // 处理头像更新
  const handleAvatarChange = (avatar: string) => {
    // 这里可以调用API更新用户头像
    console.log('头像已更新:', avatar);
  };

  // 处理编辑名称
  const handleEditName = () => {
    if (isEditing) {
      // 保存名称
      console.log('保存名称:', editName);
      setIsEditing(false);
    } else {
      setEditName(user?.name || '');
      setIsEditing(true);
    }
  };

  // 如果正在加载或未登录，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar 
        textColor="text-blue-300"
        activeColor="text-cyan-400"
        isMobileMenuOpen={false}
        onToggleMobileMenu={() => {}}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* 用户信息卡片 */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* 头像区域 */}
              <div className="flex flex-col items-center">
                <AvatarUpload
                  currentAvatar={user.avatar}
                  onAvatarChange={handleAvatarChange}
                  size="lg"
                  className="mb-4"
                />
                <button
                  onClick={handleEditName}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors text-sm"
                >
                  <Edit3 className="w-3 h-3" />
                  {isEditing ? '保存' : '编辑'}
                </button>
              </div>
              
              {/* 用户信息 */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-gray-700/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="输入新名称"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                )}
                <p className="text-gray-400 mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>加入时间: 2024年1月</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>活跃用户</span>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg p-6 text-center hover:shadow-blue-900/20 transition-shadow">
            <Bookmark className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{bookmarkCount}</div>
            <div className="text-gray-400">收藏文章</div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-md border border-green-500/20 rounded-xl shadow-lg p-6 text-center hover:shadow-green-900/20 transition-shadow">
            <History className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{historyCount}</div>
            <div className="text-gray-400">阅读历史</div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-lg p-6 text-center hover:shadow-purple-900/20 transition-shadow">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-gray-400">订阅分类</div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            快捷操作
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/favorites"
              className="flex items-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300 group"
            >
              <Bookmark className="w-6 h-6 text-blue-400 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-semibold text-white">我的收藏</div>
                <div className="text-sm text-gray-400">查看收藏的文章</div>
              </div>
            </Link>
            
            <Link 
              href="/history"
              className="flex items-center p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300 group"
            >
              <History className="w-6 h-6 text-green-400 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-semibold text-white">阅读历史</div>
                <div className="text-sm text-gray-400">查看浏览记录</div>
              </div>
            </Link>
            
            <Link 
              href="/"
              className="flex items-center p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-300 group"
            >
              <Settings className="w-6 h-6 text-purple-400 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-semibold text-white">个性化设置</div>
                <div className="text-sm text-gray-400">自定义阅读偏好</div>
              </div>
            </Link>
            
            <Link 
              href="/"
              className="flex items-center p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300 group"
            >
              <HelpCircle className="w-6 h-6 text-orange-400 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-semibold text-white">帮助中心</div>
                <div className="text-sm text-gray-400">使用指南和FAQ</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            功能特色
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">智能推荐</h3>
              <p className="text-gray-400 text-sm">基于您的阅读习惯，为您推荐个性化新闻内容</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">隐私保护</h3>
              <p className="text-gray-400 text-sm">严格保护您的个人信息和阅读数据安全</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI解读</h3>
              <p className="text-gray-400 text-sm">每条新闻都有AI智能解读，帮您快速理解要点</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}