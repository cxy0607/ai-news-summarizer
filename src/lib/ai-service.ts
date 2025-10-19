import { AISummary } from '@/types/ai';

// 获取百度API访问令牌
async function getAccessToken(): Promise<string> {
  const authUrl = 'https://aip.baidubce.com/oauth/2.0/token';
  const grantType = 'client_credentials';
  const { BAIDU_API_KEY, BAIDU_SECRET_KEY } = process.env;

  if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
    throw new Error('百度API密钥未配置');
  }

  const response = await fetch(
    `${authUrl}?grant_type=${grantType}&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
    { method: 'POST' }
  );

  const data = await response.json();
  
  if (!data.access_token) {
    throw new Error(`获取访问令牌失败: ${data.error_description || '未知错误'}`);
  }

  return data.access_token;
}

// 调用文心大模型生成摘要
export async function generateAISummary(newsContent: string): Promise<AISummary> {
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

    const response = await fetch(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k-0329?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      throw new Error(`AI服务请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.result) {
      throw new Error('AI服务返回空结果');
    }

    const parsedResult: AISummary = JSON.parse(data.result);
    return {
      ...parsedResult,
      timeline: parsedResult.timeline || [],
      knowledgePoints: parsedResult.knowledgePoints || [],
      impact: parsedResult.impact || '',
      tags: parsedResult.tags || []
    };
  } catch (error) {
    console.error('AI摘要生成失败:', error);
    return {
      summary: '抱歉，AI服务暂时不可用',
      timeline: [],
      knowledgePoints: [],
      impact: '',
      tags: [],
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}