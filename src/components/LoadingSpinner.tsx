// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      {/* 使用Tailwind工具类替代内联样式 */}
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full  animate-spin-slow"></div>
    </div>
  );
};

export default LoadingSpinner;