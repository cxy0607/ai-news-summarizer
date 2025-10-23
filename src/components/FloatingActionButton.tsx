'use client';

import React, { useState } from 'react';
import { Plus, X, Bookmark, History, Settings, Search } from 'lucide-react';
import Link from 'next/link';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 菜单项 */}
      <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <Link
          href="/favorites"
          className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-md border border-blue-500/20 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-700/90 transition-all"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-sm font-medium">我的收藏</span>
        </Link>
        
        <Link
          href="/history"
          className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-md border border-green-500/20 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-700/90 transition-all"
        >
          <History className="w-5 h-5" />
          <span className="text-sm font-medium">阅读历史</span>
        </Link>
        
        <Link
          href="/personal"
          className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-md border border-purple-500/20 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-700/90 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">个人中心</span>
        </Link>
      </div>

      {/* 主按钮 */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
