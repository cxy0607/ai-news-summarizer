import * as RSSParser from 'rss-parser';

const Parser = RSSParser.default;
const parser = new Parser();

// 使用更稳定的RSS源
export const RSS_FEEDS = [
  {
    name: '央视新闻',
    url: 'http://rss.cctv.com/rss/news.xml',
    category: '综合'
  },
  {
    name: '人民网',
    url: 'http://www.people.com.cn/rss/politics.xml',
    category: '政治'
  },
  {
    name: '新华网',
    url: 'http://www.xinhuanet.com/rss/news.xml',
    category: '时事'
  },
  {
    name: '科技新闻',
    url: 'http://rss.cnbeta.com/rss',
    category: '科技'
  }
];

// 备用模拟数据
export function getMockNews() {
  return [
    {
      id: 'mock-1',
      title: '人工智能助力教育变革，个性化学习成为可能',
      content: '近日，教育部联合多家科技企业推出人工智能教育试点项目。该项目利用AI技术分析学生的学习习惯和知识掌握程度，为每个学生生成独一无二的学习路径和推荐内容。专家表示，这将极大提升教学效率，实现真正的因材施教。',
      source: '科技日报',
      publishTime: '2024-01-15',
      category: '科技',
      summary: 'AI技术正在重塑教育行业，个性化学习方案让每个学生都能获得定制化教学体验。'
    },
    {
      id: 'mock-2',
      title: '量子计算新突破：实现100量子比特稳定运行',
      content: '我国科研团队在量子计算领域取得重大进展，成功实现了100量子比特的稳定运行，创下世界新纪录。这一突破意味着量子计算机在处理复杂问题时的能力得到质的飞跃。',
      source: '人民网',
      publishTime: '2024-01-14',
      category: '科技',
      summary: '量子计算机性能再创新高，100量子比特稳定运行为解决复杂科学问题提供新可能。'
    },
    {
      id: 'mock-3',
      title: '全球气候变化峰会达成新协议，各国承诺加大减排力度',
      content: '第28届联合国气候变化大会在迪拜闭幕，各国代表经过艰难谈判，最终达成历史性协议。协议要求各国在2030年前将温室气体排放量在2019年基础上减少45%。',
      source: '新华网',
      publishTime: '2024-01-13',
      category: '环境',
      summary: '气候变化峰会达成历史性协议，各国承诺加大减排力度，共同应对气候危机。'
    },
    {
      id: 'mock-4',
      title: '新能源汽车销量创新高，市场占有率突破40%',
      content: '根据最新数据，我国新能源汽车单月销量首次突破100万辆，市场占有率超过40%。这一数据显示消费者对新能源汽车的接受度大幅提升。',
      source: '经济参考报',
      publishTime: '2024-01-12',
      category: '汽车',
      summary: '新能源汽车销量突破百万大关，市场占有率超40%，显示绿色出行理念深入人心。'
    },
    {
      id: 'mock-5',
      title: '太空旅游新时代：商业航天公司实现每周发射',
      content: '随着SpaceX、蓝色起源等商业航天公司的快速发展，太空旅游正进入常态化阶段。目前，主要商业航天公司已实现每周一次的发射频率。',
      source: '科技新闻网',
      publishTime: '2024-01-11',
      category: '航天',
      summary: '商业航天实现每周发射，太空旅游进入常态化，票价大幅下降让更多人实现太空梦。'
    },
    {
      id: 'mock-6',
      title: '生物医药突破：新型抗癌药物进入临床试验',
      content: '我国科研团队研发的新型抗癌药物正式进入临床试验阶段，该药物针对多种实体瘤显示显著疗效。与传统化疗不同，这种新药采用靶向治疗原理。',
      source: '健康报',
      publishTime: '2024-01-10',
      category: '医疗',
      summary: '新型靶向抗癌药物进入临床试验，精准治疗实体瘤，为癌症患者带来新希望。'
    }
  ];
}

// 获取RSS新闻（带超时和错误处理）
export async function fetchRSSNews(): Promise<any[]> {
  const allNews: any[] = [];
  
  console.log('开始获取RSS新闻...');
  
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`正在获取 ${feed.name} 的新闻...`);
      
      // 设置超时
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('请求超时')), 5000)
      );
      
      // 获取RSS数据
      const fetchPromise = parser.parseURL(feed.url);
      const feedData = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      // 转换新闻项
      if (feedData.items && feedData.items.length > 0) {
        const newsItems = feedData.items.slice(0, 3).map((item: any, index: number) => ({
          id: `rss-${feed.name}-${Date.now()}-${index}`,
          title: item.title || '无标题',
          content: item.contentSnippet || item.summary || item.content || '暂无详细内容',
          source: feed.name,
          publishTime: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: feed.category,
          summary: (item.contentSnippet || item.summary || '').substring(0, 100) + '...',
          link: item.link
        }));
        
        allNews.push(...newsItems);
        console.log(`成功从 ${feed.name} 获取 ${newsItems.length} 条新闻`);
      }
      
    } catch (error) {
if (error instanceof Error) {
  console.error(`从 ${feed.name} 获取新闻失败:`, error.message);
} else {
  console.error(`从 ${feed.name} 获取新闻失败:`, String(error));
}
      // 继续尝试其他源
      continue;
    }
  }
  
  console.log(`总共获取到 ${allNews.length} 条真实新闻`);
  
  // 如果真实新闻太少，补充模拟数据
  if (allNews.length < 3) {
    console.log('真实新闻数量不足，补充模拟数据');
    const mockNews = getMockNews();
    // 去重后合并
    const existingTitles = new Set(allNews.map(news => news.title));
    const uniqueMockNews = mockNews.filter(news => !existingTitles.has(news.title));
    allNews.push(...uniqueMockNews.slice(0, 6 - allNews.length));
  }
  
  return allNews;
}