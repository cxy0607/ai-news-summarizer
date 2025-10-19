'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchNews, getMockNews } from '@/lib/rss-service';
import NewsCard from '@/components/NewsCard';
import Navbar from '@/components/Navbar';
import { 
  Search, Filter, X, AlertCircle, Loader2, 
  Cpu, Cloud, Car, Leaf, User, Rocket 
} from 'lucide-react';
import { NewsItem } from '@/types/news';

// 分类列表（独立定义，解决导入错误）
const categories = [
  '科技', 
  '环境', 
  '汽车', 
  '医疗', 
  '航天', 
  '政治'
];

// 科技感粒子背景组件
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 画布尺寸自适应
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 粒子配置
    const particles: { 
      x: number; y: number; size: number; 
      speedX: number; speedY: number; opacity: number 
    }[] = [];
    const particleCount = 50;

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };
    createParticles();

    // 绘制粒子与连线
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // 绘制粒子
        ctx.fillStyle = `rgba(76, 201, 240, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // 粒子移动
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // 边界反弹
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // 粒子间连线
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(76, 201, 240, ${0.1 - distance / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    };
    draw();

    // 清理
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-30"
    />
  );
};

// 分类图标映射
const CategoryIcon = ({ category }: { category: string }) => {
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

// 主页面组件
export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState<boolean>(false);

  // 加载新闻数据
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        setFailedSources([]);
        
        const { news: fetchedNews, failedSources: sources } = await fetchNews(
          activeCategory ?? undefined,
          1,
          12
        );
        
        const finalNews = fetchedNews.length > 0 
          ? fetchedNews 
          : getMockNews().filter(item => !activeCategory || item.category === activeCategory);
        
        setNews(finalNews);
        setFailedSources(sources);
      } catch (err) {
        console.error('加载新闻失败:', err);
        setNews(
          getMockNews().filter(item => !activeCategory || item.category === activeCategory)
        );
        setError('部分新闻源加载失败，已显示可用新闻');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [activeCategory]);

  // 从URL参数初始化分类
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      if (category && categories.includes(category)) {
        setActiveCategory(category);
      }
    }
  }, []);

  // 搜索+分类筛选逻辑
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // 切换分类（更新URL参数）
  const handleCategoryChange = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
    setMobileMenuOpen(false);
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (activeCategory === category) {
        params.delete('category');
      } else {
        params.set('category', category);
      }
      window.history.pushState({}, '', `/?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <ParticleBackground />
      
      <Navbar 
        textColor="text-blue-300"
        activeColor="text-cyan-400"
        isMobileMenuOpen={isNavbarMobileOpen}
        onToggleMobileMenu={() => setIsNavbarMobileOpen(!isNavbarMobileOpen)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            智能新闻聚合平台
          </h1>
          <p className="mt-2 text-gray-400">实时抓取全网科技、环境、汽车等领域新闻</p>
        </div>

        {failedSources.length > 0 && (
          <div className="bg-blue-900/30 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg mb-6 flex items-start backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-cyan-400" />
            <div className="text-sm">
              <p className="font-medium">部分新闻源暂时无法访问:</p>
              <p className="mt-1">{failedSources.join(', ')}</p>
              <p className="mt-1 text-cyan-300">已为您切换到备用新闻源</p>
            </div>
          </div>
        )}

        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-md"></div>
          <div className="relative bg-gray-800/80 backdrop-blur-md border border-blue-500/20 rounded-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索新闻标题或内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan-400 text-gray-200 placeholder-gray-400"
              aria-label="搜索新闻"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="清除搜索"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 backdrop-blur-md border border-blue-500/20 rounded-lg w-full justify-between hover:bg-gray-700/80 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-cyan-400" />
              {activeCategory ? `当前分类: ${activeCategory}` : '所有分类'}
            </span>
          </button>
          
          {mobileMenuOpen && (
            <div className="mt-2 bg-gray-800/80 backdrop-blur-md border border-blue-500/20 rounded-lg p-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-2 transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-900/30 text-cyan-400 border-l-2 border-cyan-400'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <CategoryIcon category={category} />
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
              !activeCategory
                ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            全部
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700'
              }`}
            >
              <CategoryIcon category={category} />
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg shadow-blue-900/10 animate-pulse"
              >
                <div className="h-40 bg-gradient-to-r from-gray-700/50 to-gray-600/50"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                  <div className="mt-4 h-4 bg-gray-700/50 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/30 text-cyan-400 mb-4">
              <X className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">{error}</h2>
            <button
              onClick={() => {
                setLoading(true);
                fetchNews(activeCategory ?? undefined, 1, 12).then(({ news, failedSources }) => {
                  setNews(news.length > 0 ? news : getMockNews());
                  setFailedSources(failedSources);
                  setError(null);
                }).catch(() => {
                  setError('仍然无法加载，请稍后再试');
                }).finally(() => {
                  setLoading(false);
                });
              }}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white rounded-lg hover:from-cyan-600/80 hover:to-blue-700/80 transition-all shadow-lg shadow-blue-500/20"
            >
              重试
            </button>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <div 
                key={item.id}
                className={`animate-fadeIn animate-fadeIn-${index % 12}`}
              >
                <NewsCard 
                  news={item} 
                  index={index}
                  cardClass="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg shadow-blue-900/10 hover:shadow-cyan-500/20 transition-all hover:-translate-y-1"
                  titleClass="text-xl font-bold text-white hover:text-cyan-300 transition-colors"
                  sourceClass="text-cyan-400 text-sm"
                  timeClass="text-gray-400 text-xs"
                  summaryClass="text-gray-300"
                  categoryIcon={<CategoryIcon category={item.category} />}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/30 text-cyan-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">未找到匹配的新闻</h2>
            <p className="text-gray-400 mb-6">尝试使用其他关键词或分类进行搜索</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory(null);
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/');
                }
              }}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white rounded-lg hover:from-cyan-600/80 hover:to-blue-700/80 transition-all shadow-lg shadow-blue-500/20"
            >
              <Filter className="w-4 h-4 mr-2" />
              查看全部新闻
            </button>
          </div>
        )}

        {!loading && filteredNews.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">总新闻数</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{filteredNews.length}</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">当前分类</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{activeCategory || '全部'}</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">可用源数</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{
                (categories.length > 0 ? categories.length : 5) - failedSources.length
              }</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">更新时间</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 bg-gray-900/80 backdrop-blur-lg border-t border-blue-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>智能新闻聚合平台 © {new Date().getFullYear()} | 基于 HTML 解析技术</p>
          <p className="mt-1">科技感设计 · 实时更新 · 多源备份</p>
        </div>
      </footer>
    </div>
  );
}