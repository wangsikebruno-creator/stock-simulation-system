import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const TUSHARE_API = 'http://api.tushare.pro';
const CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

const cache = new Map<string, { data: any; timestamp: number }>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { symbol, days = '30' } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: '缺少股票代码参数',
        timestamp: new Date().toISOString(),
      });
    }

    const cacheKey = `${symbol}_${days}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.status(200).json({
        success: true,
        data: cached.data,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    const token = process.env.TUSHARE_TOKEN;
    if (!token) {
      return res.status(500).json({
        success: false,
        error: 'Tushare Token 未配置',
        timestamp: new Date().toISOString(),
      });
    }

    // 计算开始日期
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const startDateStr = startDate.toISOString().slice(0, 10).replace(/-/g, '');
    const endDateStr = endDate.toISOString().slice(0, 10).replace(/-/g, '');

    // 调用Tushare API获取历史数据
    const response = await axios.post(TUSHARE_API, {
      api_name: 'daily',
      token: token,
      params: {
        ts_code: symbol,
        start_date: startDateStr,
        end_date: endDateStr,
      },
      fields: 'trade_date,open,high,low,close,vol',
    });

    if (response.data.code !== 0) {
      return res.status(500).json({
        success: false,
        error: response.data.msg || 'Tushare API 调用失败',
        timestamp: new Date().toISOString(),
      });
    }

    const items = response.data.data.items || [];
    const fields = response.data.data.fields || [];

    // 转换数据格式
    const history = items.map((item: any[]) => {
      const record: any = {};
      fields.forEach((field: string, index: number) => {
        record[field] = item[index];
      });

      // 格式化日期
      const dateStr = record.trade_date.toString();
      const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

      return {
        date: formattedDate,
        open: record.open,
        high: record.high,
        low: record.low,
        close: record.close,
        volume: record.vol,
      };
    }).reverse(); // 按时间正序排列

    // 更新缓存
    cache.set(cacheKey, {
      data: history,
      timestamp: Date.now(),
    });

    return res.status(200).json({
      success: true,
      data: history,
      cached: false,
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
