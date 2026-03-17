import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// 使用自建Tushare代理服务
const TUSHARE_API = 'http://lianghua.nanyangqiankun.top';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2小时缓存，避免频繁调用
const MIN_REQUEST_INTERVAL = 65 * 1000; // 最小请求间隔65秒（每分钟最多1次）

let cache: { data: any; timestamp: number } | null = null;
let lastRequestTime = 0; // 上次请求时间

// 默认股票列表
const DEFAULT_STOCKS = [
  '600000.SH', // 浦发银行
  '000001.SZ', // 平安银行
  '600519.SH', // 贵州茅台
  '000002.SZ', // 万科A
  '600036.SH', // 招商银行
  '601318.SH', // 中国平安
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { symbol } = req.query;
    const stockCodes = symbol ? [symbol as string] : DEFAULT_STOCKS;

    // 检查缓存（优先使用缓存）
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION && !symbol) {
      return res.status(200).json({
        success: true,
        data: cache.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000 / 60) + '分钟前',
        timestamp: new Date().toISOString(),
      });
    }

    // 检查请求间隔，避免频繁调用
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      // 如果距离上次请求不到65秒，返回缓存数据（即使过期）
      if (cache) {
        return res.status(200).json({
          success: true,
          data: cache.data,
          cached: true,
          message: `请求过于频繁，请${Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000)}秒后再试`,
          timestamp: new Date().toISOString(),
        });
      }
      // 如果没有缓存，返回错误
      return res.status(429).json({
        success: false,
        error: `请求过于频繁，请${Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000)}秒后再试`,
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

    // 获取今天的日期 (YYYYMMDD格式)
    const today = new Date();
    const tradeDate = today.toISOString().slice(0, 10).replace(/-/g, '');

    // 更新最后请求时间
    lastRequestTime = Date.now();

    // 调用Tushare API
    const response = await axios.post(TUSHARE_API, {
      api_name: 'daily',
      token: token,
      params: {
        ts_code: stockCodes.join(','),
        trade_date: tradeDate,
      },
      fields: 'ts_code,trade_date,open,high,low,close,pre_close,change,pct_chg,vol,amount',
    });

    if (response.data.code !== 0) {
      // 如果是频率限制错误，返回缓存数据（即使过期）
      if (cache && (response.data.msg && response.data.msg.includes('上限') || response.data.msg.includes('频率'))) {
        return res.status(200).json({
          success: true,
          data: cache.data,
          cached: true,
          message: '达到API调用限制，返回缓存数据',
          timestamp: new Date().toISOString(),
        });
      }
      return res.status(500).json({
        success: false,
        error: response.data.msg || 'Tushare API 调用失败',
        timestamp: new Date().toISOString(),
      });
    }

    const items = response.data.data.items || [];
    const fields = response.data.data.fields || [];

    // 转换数据格式
    const stocks = items.map((item: any[]) => {
      const stock: any = {};
      fields.forEach((field: string, index: number) => {
        stock[field] = item[index];
      });

      // 添加股票名称 (简化版，实际应该从另一个API获取)
      const nameMap: { [key: string]: string } = {
        '600000.SH': '浦发银行',
        '000001.SZ': '平安银行',
        '600519.SH': '贵州茅台',
        '000002.SZ': '万科A',
        '600036.SH': '招商银行',
        '601318.SH': '中国平安',
      };
      stock.name = nameMap[stock.ts_code] || stock.ts_code;

      return stock;
    });

    // 更新缓存
    if (!symbol) {
      cache = {
        data: stocks,
        timestamp: Date.now(),
      };
    }

    return res.status(200).json({
      success: true,
      data: stocks,
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
