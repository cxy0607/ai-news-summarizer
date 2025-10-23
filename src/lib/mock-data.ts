import { NewsItem } from '@/types/news';

// 丰富的模拟新闻数据
const mockNewsData: NewsItem[] = [
  {
    id: 'mock-1',
    title: '人工智能在医疗领域取得突破性进展',
    content: '近日，人工智能技术在医疗诊断领域取得重大突破。研究人员开发出一种新的AI算法，能够准确识别早期癌症，准确率达到95%以上。这项技术有望在未来几年内投入临床应用，为患者提供更早、更准确的诊断服务。该算法基于深度学习技术，通过分析大量的医学影像数据，能够识别出人眼难以察觉的细微病变特征。',
    source: '科技日报',
    publishTime: '2024-01-15',
    category: '科技',
    summary: 'AI算法在医疗诊断领域取得重大突破，癌症识别准确率达95%',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
    hasVideo: false,
    mediaType: 'image'
  },
  {
    id: 'mock-2',
    title: '全球气候变化峰会达成新协议',
    content: '在刚刚结束的全球气候变化峰会上，各国代表达成了一项新的协议，承诺在2030年前将温室气体排放量减少50%。这项协议被认为是应对气候变化的重要里程碑，将为全球可持续发展奠定基础。协议还包含了具体的实施计划和资金支持方案，预计将投入超过1000亿美元用于清洁能源项目。',
    source: '环球时报',
    publishTime: '2024-01-14',
    category: '环境',
    summary: '全球气候变化峰会达成新协议，承诺2030年前减排50%',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de446e5b1c1e?w=400&h=250&fit=crop',
    hasVideo: false,
    mediaType: 'image'
  },
  {
    id: 'mock-3',
    title: '新能源汽车销量创历史新高',
    content: '根据最新统计数据，今年新能源汽车销量同比增长120%，创下历史新高。特斯拉、比亚迪等主要厂商的销量都有显著增长。这一趋势表明，新能源汽车正在成为汽车市场的主流选择。政府补贴政策的持续支持和充电基础设施的不断完善，为新能源汽车的快速发展提供了有力保障。',
    source: '汽车之家',
    publishTime: '2024-01-13',
    category: '汽车',
    summary: '新能源汽车销量同比增长120%，创历史新高',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=250&fit=crop',
    hasVideo: false,
    mediaType: 'image'
  },
  {
    id: 'mock-4',
    title: '5G技术助力智慧城市建设',
    content: '随着5G技术的广泛应用，智慧城市建设进入新阶段。多个城市开始部署基于5G的智能交通系统、环境监测网络和公共服务平台。这些应用不仅提高了城市管理效率，也为市民生活带来了更多便利。预计到2025年，全国将有超过100个城市建成智慧城市基础设施。',
    source: '科技日报',
    publishTime: '2024-01-12',
    category: '科技',
    summary: '5G技术助力智慧城市建设，预计2025年覆盖100+城市',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    videoDuration: '120',
    hasVideo: true,
    mediaType: 'video'
  },
  {
    id: 'mock-5',
    title: '量子计算突破：实现1000量子比特运算',
    content: '科学家在量子计算领域取得重大突破，成功实现了1000量子比特的量子运算。这一成就标志着量子计算技术向实用化迈出了重要一步。量子计算机在密码学、药物发现、金融建模等领域具有巨大潜力，有望在未来十年内实现商业化应用。',
    source: '科学网',
    publishTime: '2024-01-11',
    category: '科技',
    summary: '量子计算突破：实现1000量子比特运算，向实用化迈进',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
    videoDuration: '180',
    hasVideo: true,
    mediaType: 'video'
  },
  {
    id: 'mock-6',
    title: '太空探索新里程碑：火星基地建设计划启动',
    content: '国际空间站宣布启动火星基地建设计划，预计在未来15年内建成人类在火星上的第一个永久性基地。该计划将分三个阶段实施，包括前期勘测、基础设施建设和技术验证。这一项目将为人类成为多行星物种奠定重要基础。',
    source: '航天科技',
    publishTime: '2024-01-10',
    category: '科技',
    summary: '火星基地建设计划启动，15年内建成人类首个火星永久基地',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop',
    hasVideo: false,
    mediaType: 'image'
  },
  {
    id: 'mock-7',
    title: '生物技术突破：基因编辑治疗遗传病',
    content: '科学家成功使用CRISPR基因编辑技术治疗遗传性疾病，临床试验结果显示，患者的症状得到显著改善。这一突破为治疗遗传性疾病提供了新的希望，预计将惠及全球数百万患者。该技术已获得多个国家的监管批准，即将进入商业化阶段。',
    source: '生物医学',
    publishTime: '2024-01-09',
    category: '健康',
    summary: '基因编辑技术成功治疗遗传病，为患者带来新希望',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop',
    videoDuration: '240',
    hasVideo: true,
    mediaType: 'video'
  },
  {
    id: 'mock-8',
    title: '可再生能源发电量首次超过化石燃料',
    content: '根据国际能源署最新报告，全球可再生能源发电量首次超过化石燃料发电量，这是一个历史性的里程碑。太阳能和风能是增长最快的可再生能源，其成本在过去十年中下降了80%以上。这一趋势表明，全球能源转型正在加速进行。',
    source: '能源世界',
    publishTime: '2024-01-08',
    category: '环境',
    summary: '可再生能源发电量首次超过化石燃料，能源转型加速',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop',
    hasVideo: false,
    mediaType: 'image'
  },
  {
    id: 'mock-9',
    title: '虚拟现实技术在教育领域的创新应用',
    content: 'VR技术正在改变传统教育模式，通过沉浸式学习体验，学生可以在虚拟环境中进行历史探索、科学实验和语言学习。研究表明，VR教育能够提高学习效果30%以上，为个性化教育提供了新的可能性。',
    source: '教育科技',
    publishTime: '2024-01-07',
    category: '科技',
    summary: 'VR技术革新教育模式，学习效果提升30%以上',
    imageUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4c4a5a8?w=400&h=250&fit=crop',
    hasVideo: false,
    mediaType: 'image'
  },
  {
    id: 'mock-10',
    title: '区块链技术在供应链管理中的应用',
    content: '区块链技术正在供应链管理领域发挥重要作用，通过不可篡改的分布式账本，实现了产品从生产到销售的全流程追溯。这不仅提高了供应链的透明度，还大大降低了欺诈风险，为消费者提供了更可靠的产品信息。',
    source: '区块链日报',
    publishTime: '2024-01-06',
    category: '科技',
    summary: '区块链技术提升供应链透明度，降低欺诈风险',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    videoDuration: '150',
    hasVideo: true,
    mediaType: 'video'
  }
];

// 生成模拟新闻数据
export const getMockNews = (count = 10): NewsItem[] => {
  // 如果请求的数量超过现有数据，则循环使用现有数据
  if (count <= mockNewsData.length) {
    return mockNewsData.slice(0, count);
  }
  
  // 否则循环使用现有数据并添加随机变化
  const result: NewsItem[] = [];
  for (let i = 0; i < count; i++) {
    const baseItem = mockNewsData[i % mockNewsData.length];
    result.push({
      ...baseItem,
      id: `mock-${i + 1}`,
      publishTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    });
  }
  
  return result;
};