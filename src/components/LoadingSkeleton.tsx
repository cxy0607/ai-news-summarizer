// src/components/LoadingSkeleton.tsx
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg">
      {/* 骨架屏图片区域 */}
      <div className="h-40 bg-gray-700/50"></div>
      
      {/* 骨架屏内容区域 */}
      <div className="p-5 space-y-3">
        {/* 分类和来源行 */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-700/50"></div>
          <div className="h-4 w-20 bg-gray-700/50 rounded"></div>
          <div className="ml-auto h-4 w-24 bg-gray-700/50 rounded"></div>
        </div>
        
        {/* 标题行 */}
        <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
        
        {/* 内容摘要行 */}
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
        
        {/* 查看详情按钮 */}
        <div className="h-5 bg-cyan-500/20 rounded w-20 mt-2"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;