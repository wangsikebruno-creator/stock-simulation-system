import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: '缺少股票代码参数',
        timestamp: new Date().toISOString(),
      });
    }

    // 获取股票数据
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const quoteResponse = await fetch(`${protocol}://${host}/api/quotes?symbol=${symbol}`);
    const quoteData = await quoteResponse.json();

    if (!quoteData.success || quoteData.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: '股票数据不存在',
        timestamp: new Date().toISOString(),
      });
    }

    const stock = quoteData.data[0];

    // 构建分析提示词
    const prompt = `你是一位专业的A股分析师。请分析以下股票数据：

股票代码：${stock.ts_code}
股票名称：${stock.name}
最新价格：${stock.close} 元
涨跌幅：${stock.pct_chg}%
成交量：${stock.vol} 手
成交额：${stock.amount} 万元
开盘价：${stock.open} 元
最高价：${stock.high} 元
最低价：${stock.low} 元
昨收价：${stock.pre_close} 元

请提供：
1. 技术面分析（K线形态、趋势判断）
2. 短期走势预测
3. 投资建议（仅供参考）

请用简洁的中文回答，控制在300字以内。`;

    let analysis = '';
    let model = '';

    // 优先使用 OpenAI 兼容 API (Claude/DeepSeek)
    const openaiKey = process.env.OPENAI_API_KEY;
    const openaiBaseUrl = process.env.OPENAI_BASE_URL || DEEPSEEK_API;
    const openaiModel = process.env.OPENAI_MODEL || 'deepseek-chat';
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openaiKey) {
      // 使用 OpenAI 兼容 API (Claude/DeepSeek)
      try {
        const isAnthropic = openaiBaseUrl.includes('anthropic.com');

        const requestBody = isAnthropic
          ? {
              model: openaiModel,
              max_tokens: 1024,
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            }
          : {
              model: openaiModel,
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            };

        const apiUrl = isAnthropic
          ? 'https://api.anthropic.com/v1/messages'
          : openaiBaseUrl;

        const headers = isAnthropic
          ? {
              'Content-Type': 'application/json',
              'x-api-key': openaiKey,
              'anthropic-version': '2023-06-01',
            }
          : {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiKey}`,
            };

        const response = await axios.post(apiUrl, requestBody, { headers });

        analysis = response.data.content?.[0]?.text || response.data.choices[0].message.content;
        model = openaiModel;
      } catch (error: any) {
        console.error('AI API Error:', error.response?.data || error.message);
        throw new Error(`AI API 调用失败: ${error.response?.data?.error?.message || error.message}`);
      }
    } else if (geminiKey) {
      // 使用 Gemini
      try {
        const response = await axios.post(
          `${GEMINI_API}?key=${geminiKey}`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }
        );

        analysis = response.data.candidates[0].content.parts[0].text;
        model = 'Google Gemini';
      } catch (error: any) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        throw new Error('Gemini API 调用失败');
      }
    } else {
      return res.status(500).json({
        success: false,
        error: 'AI API Key 未配置（需要 OPENAI_API_KEY 或 GEMINI_API_KEY）',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        symbol: stock.ts_code,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        model: model,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '服务器错误',
      timestamp: new Date().toISOString(),
    });
  }
}
