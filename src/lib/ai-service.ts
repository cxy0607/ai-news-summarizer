// 获取百度千帆的Access Token
async function getAccessToken(): Promise<string> {
  const url = `https://aip.baiducce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.BAIDU_API_KEY}&client_secret=${process.env.BAIDU_SECRET_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }
    
    return data.access_token;
  } catch (error) {
    console.error('获取Access Token失败:', error);
    throw new Error('无法连接到AI服务，请检查网络连接和API配置');
  }
}

// 调用文心大模型生成摘要
export async function generateAISummary(newsContent: string): Promise<any> {
  try {
    // 检查环境变量
    if (!process.env.BAIDU_API_KEY || !process.env.BAIDU_SECRET_KEY) {
      throw new Error('AI服务配置不完整，请检查环境变量');
    }

    // 检查内容长度
    if (!newsContent || newsContent.trim().length < 10) {
      throw new Error('新闻内容过短，无法生成有意义的摘要');
    }

    // 如果内容太长，进行截断（文心模型有长度限制）
    const truncatedContent = newsContent.length > 4000 
      ? newsContent.substring(0, 4000) + '...' 
      : newsContent;

    const accessToken = await getAccessToken();
    
    // 精心设计的提示词
    const prompt = `你是一个专业的新闻编辑和知识管理专家。请对以下新闻内容进行深度分析和结构化总结：

【新闻原文】
${truncatedContent}

【分析要求】
请严格按照以下JSON格式输出结果：

{
  "summary": "这里写一段150字以内的核心摘要，要求：1) 抓住事件本质 2) 突出关键数据 3) 说明重要意义",
  "timeline": [
    "时间点1: 具体事件描述",
    "时间点2: 具体事件描述", 
    "时间点3: 具体事件描述"
  ],
  "knowledgePoints": [
    "领域1: 核心概念1 - 简要解释",
    "领域2: 核心概念2 - 简要解释",
    "领域3: 核心概念3 - 简要解释"
  ],
  "impact": "这里分析该事件可能产生的影响和未来发展趋势，100字左右",
  "tags": ["标签1", "标签2", "标签3", "标签4"]
}

注意：
1. timeline数组包含3-5个关键时间节点
2. knowledgePoints数组包含3-5个相关知识概念  
3. tags数组包含4-6个关键词标签
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
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7, // 控制创造性
          top_p: 0.8,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AI服务请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.result) {
      throw new Error('AI服务返回空结果');
    }

    // 尝试解析AI返回的JSON
    try {
      const parsedResult = JSON.parse(data.result);
      
      // 验证必要字段
      if (!parsedResult.summary) {
        throw new Error('AI返回结果缺少必要字段');
      }
      
      return parsedResult;
    } catch (parseError) {
      console.error('AI返回结果解析失败，返回原始内容:', data.result);
      // 如果解析失败，返回一个结构化的默认响应
      return {
        summary: data.result || 'AI正在思考中，请稍后重试...',
        timeline: [],
        knowledgePoints: [],
        impact: '',
        tags: []
      };
    }
  } catch (error) {
    console.error('AI摘要生成失败:', error);
    
    // 返回友好的错误信息
    return {
      summary: '抱歉，AI服务暂时不可用。请检查网络连接或稍后重试。',
      timeline: [],
      knowledgePoints: [],
      impact: '',
      tags: [],
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

// 测试AI连接
export async function testAIConnection(): Promise<boolean> {
  try {
    const testContent = '这是一个测试内容，用于验证AI服务连接是否正常。';
    const result = await generateAISummary(testContent);
    return !result.error;
  } catch {
    return false;
  }
}