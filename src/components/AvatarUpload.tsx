'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatar: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md',
  className = ''
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB');
      return;
    }

    setIsUploading(true);

    try {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onAvatarChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('头像上传失败:', error);
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    onAvatarChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer group relative bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-105`}
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="用户头像"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
        
        {/* 上传遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* 加载状态 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* 删除按钮 */}
      {preview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveAvatar();
          }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          title="删除头像"
          aria-label="删除头像"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* 文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="上传头像"
      />
    </div>
  );
};

export default AvatarUpload;
