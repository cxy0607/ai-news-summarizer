'use client';

import { useState } from 'react';
import NewsCard from '../components/NewsCard';
import { NewsItem } from '@/types/news';
import { Search, Filter, Sparkles } from 'lucide-react';

// 模拟新闻数据
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '人工智能助力教育变革，个性化学习成为可能',
    content: `近日，教育部联合多家科技企业推出人工智能教育试点项目。该项目利用AI技术分析学生的学习习惯和知识掌握程度，为每个学生生成独一无二的学习路径和推荐内容。

专家表示，这将极大提升教学效率，实现真正的因材施教。通过机器学习算法，系统能够实时调整教学策略，确保每个学生都能在最适合自己的节奏下学习。

目前，该项目已在北上广深等城市的50所中小学进行试点，预计明年将在全国范围内推广。`,
    source: '科技日报',
    publishTime: '2024-01-15',
    category: '科技',
    summary: 'AI技术正在重塑教育行业，个性化学习方案让每个学生都能获得定制化教学体验，提升学习效率300%以上。'
  },
  {
    id: '2',
    title: '量子计算新突破：实现100量子比特稳定运行',
    content: `我国科研团队在量子计算领域取得重大进展，成功实现了100量子比特的稳定运行，创下世界新纪录。

这一突破意味着量子计算机在处理复杂问题时的能力得到质的飞跃。研究人员表示，这项技术将在药物研发、气候预测、金融建模等领域发挥重要作用。

团队负责人王教授介绍，下一步目标是实现1000量子比特的稳定运行，为通用量子计算机的研发奠定基础。`,
    source: '人民网', 
    publishTime: '2024-01-14',
    category: '科技',
    summary: '量子计算机性能再创新高，100量子比特稳定运行为解决复杂科学问题提供新可能，计算速度提升百万倍。'
  },
  {
    id: '3',
    title: '全球气候变化峰会达成新协议，各国承诺加大减排力度',
    content: `第28届联合国气候变化大会在迪拜闭幕，各国代表经过艰难谈判，最终达成历史性协议。

协议要求各国在2030年前将温室气体排放量在2019年基础上减少45%，并在2050年前实现净零排放。发达国家承诺每年向发展中国家提供1000亿美元气候资金。

联合国秘书长表示，这是人类应对气候变化的重要里程碑，但关键在于各国能否将承诺转化为实际行动。`,
    source: '新华网',
    publishTime: '2024-01-13',
    category: '环境',
    summary: '气候变化峰会达成历史性协议，各国承诺加大减排力度，共同应对气候危机，发达国家提供千亿资金支持。'
  },
  {
    id: '4',
    title: '新能源汽车销量创新高，市场占有率突破40%',
    content: `根据最新数据，我国新能源汽车单月销量首次突破100万辆，市场占有率超过40%。

这一数据显示消费者对新能源汽车的接受度大幅提升。专家分析，政策支持、技术进步和基础设施完善是主要推动因素。

预计到2025年，新能源汽车年销量将达到1500万辆，为全球绿色转型贡献中国力量。`,
    source: '经济参考报',
    publishTime: '2024-01-12', 
    category: '汽车',
    summary: '新能源汽车销量突破百万大关，市场占有率超40%，显示绿色出行理念深入人心。'
  },
  {
    id: '5',
    title: '太空旅游新时代：商业航天公司实现每周发射',
    content: `随着SpaceX、蓝色起源等商业航天公司的快速发展，太空旅游正进入常态化阶段。

目前，主要商业航天公司已实现每周一次的发射频率，将游客送往太空边缘体验失重状态。票价也从最初的数千万美元下降到50万美元左右。

行业专家预测，随着技术成熟和竞争加剧，未来5年内太空旅游价格有望进一步下降到20万美元。`,
    source: '科技新闻网',
    publishTime: '2024-01-11',
    category: '航天',
    summary: '商业航天实现每周发射，太空旅游进入常态化，票价大幅下降让更多人实现太空梦。'
  },
  {
    id: '6', 
    title: '生物医药突破：新型抗癌药物进入临床试验',
    content: `我国科研团队研发的新型抗癌药物正式进入临床试验阶段，该药物针对多种实体瘤显示显著疗效。

与传统化疗不同，这种新药采用靶向治疗原理，精准攻击癌细胞而不伤害正常细胞。在动物实验中，治愈率达到85%以上。

如果临床试验成功，这将是癌症治疗领域的重大突破，为全球数千万癌症患者带来希望。`,
    source: '健康报',
    publishTime: '2024-01-10',
    category: '医疗',
    summary: '新型靶向抗癌药物进入临床试验，精准治疗实体瘤，动物实验治愈率超85%，为癌症患者带来新希望。'
  }
];

// 分类选项
const categories = ['全部', '科技', '环境', '汽车', '航天', '医疗'];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  
  // 过滤新闻
  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        news.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 头部 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">AI驱动的智能新闻解读</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            智闻快览
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            让AI为你解读复杂新闻，<span className="font-semibold text-blue-600">30秒</span>掌握热点事件核心，
            <span className="font-semibold text-purple-600">一键</span>关联相关知识
          </p>
        </div>
      </header>

      {/* 搜索和筛选区域 */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-12">
        <div className="glass-card p-2 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3" />
              <input 
                type="text"
                placeholder="搜索热点新闻... 试试 'AI' 或 '新能源'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-lg"
              />
            </div>
            
            {/* 分类筛选 */}
            <div className="flex items-center border-l border-gray-200 pl-4">
              <Filter className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/50 text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 新闻列表 */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* 结果统计 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            最新热点
            <span className="text-gray-500 text-lg ml-2">
              ({filteredNews.length} 条新闻)
            </span>
          </h2>
          
          <div className="text-sm text-gray-500">
            更新于: {new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>

        {/* 新闻网格 */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">未找到相关新闻</h3>
            <p className="text-gray-500">尝试调整搜索关键词或选择其他分类</p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>Powered by Next.js & 百度文心大模型 · 让知识触手可及</p>
        </div>
      </footer>
    </div>
  );
}