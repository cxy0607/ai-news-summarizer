// Navbar组件属性接口
export interface NavbarProps {
  textColor?: string;
  activeColor?: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}