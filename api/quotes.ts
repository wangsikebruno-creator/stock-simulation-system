import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// 使用自建Tushare代理服务
const TUSHARE_API = 'http://lianghua.nanyangqiankun.top';
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

let cache: { data: any; timestamp: number } | null = null;

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

    // 检查缓存
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION && !symbol) {
      return res.status(200).json({
        success: true,
        data: cache.data,
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

    // 获取今天的日期 (YYYYMMDD格式)
    const today = new Date();
    const tradeDate = today.toISOString().slice(0, 10).replace(/-/g, '');

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
