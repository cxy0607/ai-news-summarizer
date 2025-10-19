// src/components/CategoryIcon.tsx
import { Cpu, Cloud, Car, Leaf, User, Rocket } from 'lucide-react';
import React from 'react';

interface CategoryIconProps {
  category: string;
}

// 注意：这里使用默认导出（default export）
const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  const iconMap: Record<string, React.ReactNode> = {
    科技: <Cpu className="w-4 h-4" />,
    环境: <Leaf className="w-4 h-4" />,
    汽车: <Car className="w-4 h-4" />,
    医疗: <User className="w-4 h-4" />,
    航天: <Rocket className="w-4 h-4" />,
    政治: <Cloud className="w-4 h-4" />
  };
  return iconMap[category] || null;
};

export default CategoryIcon;