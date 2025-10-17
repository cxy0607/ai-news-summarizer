// src/components/Navigation.tsx
'use client'; // 标记为客户端组件

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Bookmark, History, Info, Search, Menu, X } from "lucide-react";

export default function Navigation() {
  // 将原本在 layout 中的 useState 逻辑移到这里
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav>
      {/* 导航栏内容 */}
      {isMenuOpen ? (
        <X onClick={() => setIsMenuOpen(false)} />
      ) : (
        <Menu onClick={() => setIsMenuOpen(true)} />
      )}
      {/* 其他导航元素 */}
    </nav>
  );
}