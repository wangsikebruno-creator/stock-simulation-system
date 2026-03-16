// 股票报价数据类型
export interface StockQuote {
  ts_code: string;      // 股票代码 (如: 600000.SH)
  name: string;         // 股票名称
  trade_date: string;   // 交易日期
  open: number;         // 开盘价
  high: number;         // 最高价
  low: number;          // 最低价
  close: number;        // 收盘价
  pre_close: number;    // 前收盘价
  change: number;       // 涨跌额
  pct_chg: number;      // 涨跌幅 (%)
  vol: number;          // 成交量 (手)
  amount: number;       // 成交额 (千元)
}

// K线数据类型
export interface KLineData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// AI分析结果类型
export interface AIAnalysis {
  symbol: string;
  analysis: string;
  timestamp: string;
  model: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  timestamp: string;
}
