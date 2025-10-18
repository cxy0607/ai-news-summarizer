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
    // 检查环境变量
    if (!process.env.BAIDU_API_KEY || !process.env.BAIDU_SECRET_KEY) {
      throw new Error('AI服务配置不完整，请检查环境变量');
    }

    // 检查内容长度
    if (!newsContent || newsContent.trim().length < 10) {
      throw new Error('新闻内容过短，无法生成有意义的摘要');
    }

    // 内容截断处理
    const truncatedContent = newsContent.length > 4000 
      ? newsContent.substring(0, 4000) + '...' 
      : newsContent;

    const accessToken = await getAccessToken();
    
    // 优化提示词
    const prompt = `你是一个专业的新闻编辑和知识管理专家。请对以下新闻内容进行深度分析和结构化总结：

【新闻原文】
${truncatedContent}


【分析要求】
请严格按照以下JSON格式输出结果：

{
  "summary": "150字以内的核心摘要，包含事件本质、关键数据和重要意义",
  "timeline": ["时间点1: 事件描述", "时间点2: 事件描述"],
  "knowledgePoints": ["领域1: 概念1 - 解释", "领域2: 概念2 - 解释"],
  "impact": "100字左右的影响分析和未来趋势",
  "tags": ["标签1", "标签2", "标签3", "标签4"]
}

注意：
1. timeline包含3-5个关键时间节点
2. knowledgePoints包含3-5个相关知识概念  
3. tags包含4-6个关键词标签
4. 所有内容用中文表达
5. 确保JSON格式完全正确`;

    const response = await fetch(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k-0329?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          top_p: 0.8,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AI服务请求失败: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.result) {
      throw new Error('AI服务返回空结果');
    }

    // 解析并验证结果
    try {
      const parsedResult: AISummary = JSON.parse(data.result);
      
      // 验证必要字段
      if (!parsedResult.summary || parsedResult.summary.trim() === '') {
        throw new Error('AI返回结果缺少摘要内容');
      }
      
      // 补全可选字段默认值
      return {
        ...parsedResult,
        timeline: parsedResult.timeline || [],
        knowledgePoints: parsedResult.knowledgePoints || [],
        impact: parsedResult.impact || '',
        tags: parsedResult.tags || []
      };
    } catch (parseError) {
      console.error('AI返回结果解析失败:', parseError, '原始内容:', data.result);
      throw new Error('AI返回格式错误，无法解析结果');
    }
  } catch (error) {
    console.error('AI摘要生成失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return {
      summary: '抱歉，AI服务暂时不可用',
      timeline: [],
      knowledgePoints: [],
      impact: '',
      tags: [],
      error: errorMessage
    };
  }
}