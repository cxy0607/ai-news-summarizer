// src/lib/ai-service.ts
import { AISummary } from '@/types/ai';

// 添加缓存机制
const AI_SUMMARY_CACHE = new Map<string, { data: AISummary; timestamp: number }>();
const CACHE_TTL = 3600000; // 缓存1小时

// 获取百度AI访问令牌
async function getAccessToken(): Promise<string> {
  if (!process.env.BAIDU_API_KEY || !process.env.BAIDU_SECRET_KEY) {
    throw new Error('AI服务配置不完整');
  }

  // 检查本地存储中的缓存令牌
  if (typeof window !== 'undefined') {
    const cachedToken = localStorage.getItem('baidu_ai_token');
    const tokenExpiry = localStorage.getItem('baidu_ai_token_expiry');
    
    if (cachedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      return cachedToken;
    }
  }

  // 无有效缓存，重新获取
  const response = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.BAIDU_API_KEY}&client_secret=${process.env.BAIDU_SECRET_KEY}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`获取访问令牌失败: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.access_token) {
    throw new Error('未能获取有效的访问令牌');
  }

  // 缓存令牌（有效期为30天，提前1天过期）
  if (typeof window !== 'undefined') {
    const expiryTime = Date.now() + (data.expires_in - 86400) * 1000;
    localStorage.setItem('baidu_ai_token', data.access_token);
    localStorage.setItem('baidu_ai_token_expiry', expiryTime.toString());
  }

  return data.access_token;
}

// 调用文心大模型生成摘要（带缓存）
export async function generateAISummary(newsContent: string): Promise<AISummary> {
  // 生成内容哈希作为缓存键
  const contentHash = btoa(newsContent.substring(0, 100));
  
  // 检查缓存
  const cached = AI_SUMMARY_CACHE.get(contentHash);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    if (!process.env.BAIDU_API_KEY || !process.env.BAIDU_SECRET_KEY) {
      throw new Error('AI服务配置不完整');
    }

    if (!newsContent || newsContent.trim().length < 10) {
      throw new Error('新闻内容过短，无法生成摘要');
    }

    // 内容截断处理
    const truncatedContent = newsContent.length > 4000 
      ? newsContent.substring(0, 4000) + '...' 
      : newsContent;

    const accessToken = await getAccessToken();
    
    const prompt = `请对以下新闻内容进行结构化总结：
【新闻原文】${truncatedContent}
请严格按照以下JSON格式输出：
{
  "summary": "150字以内核心摘要",
  "timeline": ["时间点1: 事件描述"],
  "knowledgePoints": ["领域1: 概念1 - 解释"],
  "impact": "100字左右影响分析",
  "tags": ["标签1", "标签2"]
}`;

// 修改 src/lib/ai-service.ts 中的 fetch 调用
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

const response = await fetch(
  `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k-0329?access_token=${accessToken}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    }),
    signal: controller.signal // 使用signal替代timeout
  }
);

clearTimeout(timeoutId);

    if (!response.ok) {
      const errorDetails = await response.text().catch(() => '未知错误');
      throw new Error(`AI服务请求失败: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error('AI服务返回空结果');
    }

    // 验证JSON格式
    try {
      const parsedResult: AISummary = JSON.parse(data.result);
      const result = {
        ...parsedResult,
        timeline: parsedResult.timeline || [],
        knowledgePoints: parsedResult.knowledgePoints || [],
        impact: parsedResult.impact || '',
        tags: parsedResult.tags || []
      };
      
      // 更新缓存
      AI_SUMMARY_CACHE.set(contentHash, { data: result, timestamp: Date.now() });
      return result;
    } catch (parseError) {
      throw new Error(`AI返回格式错误: ${parseError instanceof Error ? parseError.message : '解析失败'}`);
    }
  } catch (error) {
    console.error('AI摘要生成失败:', error);
    const errorMsg = error instanceof Error ? error.message : '未知错误';
    return {
      summary: '抱歉，AI服务暂时不可用',
      timeline: [],
      knowledgePoints: [],
      impact: '',
      tags: [],
      error: process.env.NODE_ENV === 'development' ? errorMsg : '抱歉，AI服务暂时不可用，请稍后再试'
    };
  }
}