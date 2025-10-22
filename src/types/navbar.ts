// src/types/navbar.ts
export interface NavbarProps {
  textColor?: string;
  activeColor?: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu: () => void; // 移除 ? 使其成为必需属性
}