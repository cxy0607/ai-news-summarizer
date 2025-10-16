'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NewsItem, AISummary } from '@/types/news';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Bookmark,
  Loader2,
  AlertCircle,
  Clock,
  Tag,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

// 模拟新闻数据库 - 实际项目中应该从API获取
const newsDatabase: { [key: string]: NewsItem } = {
  '1': {
    id: '1',
    title: '人工智能助力教育变革，个性化学习成为可能',
    content: `近日，教育部联合多家科技企业推出人工智能教育试点项目。该项目利用AI技术分析学生的学习习惯和知识掌握程度，为每个学生生成独一无二的学习路径和推荐内容。

专家表示，这将极大提升教学效率，实现真正的因材施教。通过机器学习算法，系统能够实时调整教学策略，确保每个学生都能在最适合自己的节奏下学习。

## 技术原理
该系统基于深度神经网络和自然语言处理技术，能够：
- 实时分析学生答题模式和思考过程
- 识别知识薄弱环节和学习障碍
- 动态调整教学内容和难度等级
- 提供个性化的练习和反馈

## 实施效果
目前，该项目已在北上广深等城市的50所中小学进行试点，初步结果显示：
- 学生学习效率平均提升45%
- 知识掌握牢固度提高60%
- 学习兴趣和参与度显著增强

预计明年将在全国范围内推广，惠及数百万学生。`,
    source: '科技日报',
    publishTime: '2024-01-15',
    category: '科技'
  },
  '2': {
    id: '2',
    title: '量子计算新突破：实现100量子比特稳定运行',
    content: `我国科研团队在量子计算领域取得重大进展，成功实现了100量子比特的稳定运行，创下世界新纪录。

这一突破意味着量子计算机在处理复杂问题时的能力得到质的飞跃。研究人员表示，这项技术将在药物研发、气候预测、金融建模等领域发挥重要作用。

## 技术细节
- 量子比特数量：100个
- 相干时间：达到150微秒
- 保真度：超过99.5%
- 运行温度：接近绝对零度（-273°C）

## 应用前景
团队负责人王教授介绍，这项技术将推动：
1. 新药研发：模拟分子相互作用，加速药物发现
2. 气候科学：建立更精确的地球系统模型
3. 金融科技：优化投资组合和风险管理系统
4. 材料科学：设计具有特殊性能的新材料

下一步目标是实现1000量子比特的稳定运行，为通用量子计算机的研发奠定基础。`,
    source: '人民网',
    publishTime: '2024-01-14',
    category: '科技'
  },
  '3': {
    id: '3',
    title: '全球气候变化峰会达成新协议，各国承诺加大减排力度',
    content: `第28届联合国气候变化大会在迪拜闭幕，各国代表经过艰难谈判，最终达成历史性协议。

协议要求各国在2030年前将温室气体排放量在2019年基础上减少45%，并在2050年前实现净零排放。发达国家承诺每年向发展中国家提供1000亿美元气候资金。

## 主要承诺
- 美国：到2030年减排50-52%（相对于2005年）
- 欧盟：到2030年减排至少55%（相对于1990年）
- 中国：2030年前实现碳达峰，2060年前实现碳中和
- 印度：到2070年实现净零排放

## 资金支持
发达国家同意：
- 2025年前每年提供1000亿美元气候资金
- 其中50%用于适应气候变化影响
- 优先支持最脆弱的发展中国家

联合国秘书长表示，这是人类应对气候变化的重要里程碑，但关键在于各国能否将承诺转化为实际行动。`,
    source: '新华网',
    publishTime: '2024-01-13',
    category: '环境'
  }
};

// 加载动画组件
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <Loader2 
          className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" 
          aria-hidden="true" 
        />
        <p className="text-gray-600" role="status">AI正在深度分析新闻内容...</p>
        <p className="text-sm text-gray-500 mt-2">这可能需要几秒钟时间</p>
      </div>
    </div>
  );
}

// 错误显示组件
function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="glass-card p-6 text-center">
      <AlertCircle 
        className="w-16 h-16 text-red-400 mx-auto mb-4" 
        aria-hidden="true" 
      />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">分析失败</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        aria-label="重新尝试AI分析"
      >
        重新尝试
      </button>
    </div>
  );
}

function NewsDetailContent() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  const news = newsDatabase[newsId];
  
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 调用AI摘要API
  const fetchAISummary = async () => {
    if (!news) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('开始请求AI摘要...');
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          newsContent: news.content 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `请求失败: ${response.status}`);
      }
      
      if (data.success && data.data) {
        setAiSummary(data.data);
        console.log('AI摘要获取成功:', data.data);
      } else {
        throw new Error('AI返回数据格式错误');
      }
    } catch (err) {
      console.error('获取AI摘要失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: aiSummary?.summary || news.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      // 备用方案：复制到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    }
  };

  // 收藏功能
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 这里可以添加实际保存到本地存储的逻辑
  };

  useEffect(() => {
    if (news) {
      fetchAISummary();
    } else {
      setError('新闻不存在');
      setIsLoading(false);
    }
  }, [news]);

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto text-center py-16">
          <AlertCircle 
            className="w-16 h-16 text-gray-400 mx-auto mb-4" 
            aria-hidden="true" 
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">新闻未找到</h1>
          <p className="text-gray-600 mb-8">您访问的新闻内容不存在或已被删除</p>
          <Link 
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
            aria-label="返回新闻首页"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="返回新闻首页"
            >
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              返回首页
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleBookmark}
                aria-label={isBookmarked ? "取消收藏此新闻" : "收藏此新闻"}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark 
                  className="w-5 h-5" 
                  fill={isBookmarked ? 'currentColor' : 'none'} 
                  aria-hidden="true"
                />
              </button>
              
              <button
                onClick={handleShare}
                aria-label="分享此新闻"
                className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 新闻头部信息 */}
        <article className="mb-8">
          <header className="glass-card p-8 mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <span 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium"
                aria-label={`新闻分类: ${news.category}`}
              >
                {news.category}
              </span>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" aria-hidden="true" />
                <span aria-label={`新闻来源: ${news.source}`}>{news.source}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                <span aria-label={`发布时间: ${news.publishTime}`}>{news.publishTime}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {news.title}
            </h1>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="prose prose-lg max-w-none">
                {news.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </header>

          {/* AI解读区域 */}
          <section className="glass-card p-8" aria-labelledby="ai-analysis-title">
            <div className="flex items-center mb-6">
              <div 
                className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3" 
                aria-hidden="true"
              ></div>
              <h2 id="ai-analysis-title" className="text-2xl font-bold text-gray-800">
                🤖 AI深度解读
              </h2>
            </div>
            
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay message={error} onRetry={fetchAISummary} />
            ) : aiSummary ? (
              <div className="space-y-8">
                {/* 核心摘要 */}
                <section aria-labelledby="summary-title">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="w-6 h-6 text-blue-500 mr-3" aria-hidden="true" />
                      <h3 id="summary-title" className="text-xl font-semibold text-gray-800">
                        💡 核心摘要
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {aiSummary.summary}
                    </p>
                  </div>
                </section>
                
                {/* 时间线 */}
                {aiSummary.timeline && aiSummary.timeline.length > 0 && (
                  <section aria-labelledby="timeline-title">
                    <div className="flex items-center mb-4">
                      <Clock className="w-6 h-6 text-green-500 mr-3" aria-hidden="true" />
                      <h3 id="timeline-title" className="text-xl font-semibold text-gray-800">
                        ⏳ 事件脉络
                      </h3>
                    </div>
                    <div className="space-y-3" role="list" aria-label="事件发展时间线">
                      {aiSummary.timeline.map((item, index) => (
                        <div key={index} className="flex items-start" role="listitem">
                          <div 
                            className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1"
                            aria-hidden="true"
                          >
                            <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-700 flex-1 pt-1">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {/* 关联知识点 */}
                {aiSummary.knowledgePoints && aiSummary.knowledgePoints.length > 0 && (
                  <section aria-labelledby="knowledge-points-title">
                    <div className="flex items-center mb-4">
                      <Tag className="w-6 h-6 text-purple-500 mr-3" aria-hidden="true" />
                      <h3 id="knowledge-points-title" className="text-xl font-semibold text-gray-800">
                        🎯 关联知识点
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="list" aria-label="相关知识点列表">
                      {aiSummary.knowledgePoints.map((point, index) => (
                        <div 
                          key={index}
                          className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          role="listitem"
                        >
                          <p className="text-purple-800 font-medium">{point}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {/* 影响分析 */}
                {aiSummary.impact && (
                  <section aria-labelledby="impact-title">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-6 h-6 text-orange-500 mr-3" aria-hidden="true" />
                      <h3 id="impact-title" className="text-xl font-semibold text-gray-800">
                        📈 影响分析
                      </h3>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <p className="text-gray-700 leading-relaxed">{aiSummary.impact}</p>
                    </div>
                  </section>
                )}
                
                {/* 标签 */}
                {aiSummary.tags && aiSummary.tags.length > 0 && (
                  <section aria-labelledby="tags-title">
                    <h3 id="tags-title" className="text-lg font-semibold text-gray-800 mb-3">
                      🏷️ 关键词
                    </h3>
                    <div 
                      className="flex flex-wrap gap-2" 
                      role="list" 
                      aria-label="新闻关键词标签"
                    >
                      {aiSummary.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm font-medium border border-gray-300"
                          role="listitem"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : null}
          </section>
        </article>
      </div>
    </div>
  );
}

// 使用Suspense包装组件
export default function NewsDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewsDetailContent />
    </Suspense>
  );
}