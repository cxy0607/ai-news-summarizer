// src/components/Navbar.tsx
import React from 'react';
import { Cpu, Menu, X } from 'lucide-react';

// 完整的导航栏Props类型定义（支持科技感样式定制）
interface NavbarProps {
  /** 自定义外层类名（用于背景、边框等科技感样式） */
  className?: string;
  /** 导航链接默认文本颜色（如科技蓝 text-cyan-400） */
  textColor?: string;
  /** 导航链接hover/激活态颜色 */
  activeColor?: string;
  /** 移动端菜单是否展开（可选，控制响应式交互） */
  isMobileMenuOpen?: boolean;
  /** 移动端菜单切换回调（可选，响应式交互） */
  onToggleMobileMenu?: () => void;
}

// 导航栏组件（显式标注React函数组件类型，绑定Props）
const Navbar: React.FC<NavbarProps> = ({
  className = '',
  textColor = 'text-blue-300',
  activeColor = 'text-cyan-400',
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  return (
    // 外层容器：合并默认样式与自定义className
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}>
      {/* 导航栏主体：科技感玻璃拟态 + 边框 */}
      <div className="bg-gray-900/80 backdrop-blur-lg border-b border-blue-500/20 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 左侧Logo区域（科技感图标+文字） */}
          <div className="flex items-center">
            <Cpu className="w-8 h-8 text-cyan-400 mr-2 transition-transform hover:rotate-12" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              智汇新闻
            </span>
          </div>

          {/* 右侧导航链接（桌面端可见） */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              href="/" 
              label="首页" 
              textColor={textColor} 
              activeColor={activeColor} 
              isActive={window.location.pathname === '/'}
            />
            <NavLink 
              href="/about" 
              label="关于" 
              textColor={textColor} 
              activeColor={activeColor} 
              isActive={window.location.pathname === '/about'}
            />
            <NavLink 
              href="/feedback" 
              label="反馈" 
              textColor={textColor} 
              activeColor={activeColor} 
              isActive={window.location.pathname === '/feedback'}
            />
          </div>

          {/* 移动端菜单按钮（仅移动端可见） */}
          <div className="md:hidden">
            <button
              onClick={onToggleMobileMenu}
              className={`p-2 rounded-md ${textColor} hover:${activeColor} hover:bg-gray-800/50 transition-colors`}
              aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单（展开时显示） */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/90 backdrop-blur-lg border-b border-blue-500/20 px-4 py-3">
          <div className="flex flex-col gap-3">
            <NavLink 
              href="/" 
              label="首页" 
              textColor={textColor} 
              activeColor={activeColor} 
              isActive={window.location.pathname === '/'}
              onClick={onToggleMobileMenu} // 点击后关闭菜单
            />
            <NavLink 
              href="/about" 
              label="关于" 
              textColor={textColor} 
              activeColor={activeColor} 
              isActive={window.location.pathname === '/about'}
              onClick={onToggleMobileMenu}
            />
            <NavLink 
              href="/feedback" 
              label="反馈" 
              textColor={textColor} 
              activeColor={activeColor} 
              isActive={window.location.pathname === '/feedback'}
              onClick={onToggleMobileMenu}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

// 导航链接子组件（复用逻辑，避免重复代码）
interface NavLinkProps {
  href: string;
  label: string;
  textColor: string;
  activeColor: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  textColor,
  activeColor,
  isActive,
  onClick
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? activeColor : textColor
      } hover:${activeColor} focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
    >
      {label}
    </a>
  );
};

// 默认导出（与page.tsx的导入方式匹配）
export default Navbar;