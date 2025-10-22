'use client';

import React from 'react';
import { X, Brain, Clock, Lightbulb, TrendingUp, Tag, AlertCircle } from 'lucide-react';
import { AISummary } from '@/types/ai';

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiSummary: AISummary | null;
  newsTitle: string;
  isLoading: boolean;
}

const AISummaryModal: React.FC<AISummaryModalProps> = ({
  isOpen,
  onClose,
  aiSummary,
  newsTitle,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI智能解读</h2>
              <p className="text-gray-400 text-sm truncate max-w-md">{newsTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-300/30 border-t-purple-300 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">AI正在分析新闻内容...</p>
              </div>
            </div>
          ) : aiSummary ? (
            <div className="space-y-6">
              {/* 核心摘要 */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  核心摘要
                </h3>
                <p className="text-gray-300 leading-relaxed">{aiSummary.summary}</p>
              </div>

              {/* 时间线 */}
              {aiSummary.timeline && aiSummary.timeline.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    关键时间线
                  </h3>
                  <div className="space-y-2">
                    {aiSummary.timeline.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 知识点 */}
              {aiSummary.knowledgePoints && aiSummary.knowledgePoints.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                    <Brain className="w-5 h-5 text-green-400" />
                    知识点解析
                  </h3>
                  <div className="grid gap-3">
                    {aiSummary.knowledgePoints.map((point, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="text-gray-300 text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 影响分析 */}
              {aiSummary.impact && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    影响分析
                  </h3>
                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <p className="text-gray-300 leading-relaxed">{aiSummary.impact}</p>
                  </div>
                </div>
              )}

              {/* 标签 */}
              {aiSummary.tags && aiSummary.tags.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    相关标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aiSummary.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 错误信息 */}
              {aiSummary.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">AI服务暂时不可用</span>
                  </div>
                  <p className="text-red-300 text-sm">{aiSummary.error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">无法获取AI解读内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal;
