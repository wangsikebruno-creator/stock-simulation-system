import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StockQuote, KLineData } from '../types';
import KLineChart from '../components/KLineChart';
import AIPanel from '../components/AIPanel';
import LoadingSpinner from '../components/LoadingSpinner';

const DetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<KLineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取股票详情
        const quoteResponse = await fetch(`/api/quotes?symbol=${symbol}`);
        const quoteData = await quoteResponse.json();

        if (quoteData.success && quoteData.data.length > 0) {
          setStock(quoteData.data[0]);
        }

        // 获取历史数据
        const historyResponse = await fetch(`/api/history?symbol=${symbol}&days=30`);
        const historyData = await historyResponse.json();

        if (historyData.success) {
          setHistory(historyData.data);
        }
      } catch (err) {
        setError('加载数据失败');
        console.error('Failed to fetch detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  if (loading) {
    return <LoadingSpinner text="正在加载股票详情..." />;
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 text-lg mb-4">{error || '股票不存在'}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.pct_chg >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const glowColor = isPositive ? 'shadow-green-500/20' : 'shadow-red-500/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 动态背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">返回首页</span>
        </Link>

        {/* Stock Header Card */}
        <div className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl ${glowColor} mb-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white">{stock.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isPositive ? '涨' : '跌'}
                </span>
              </div>
              <p className="text-slate-400 font-mono text-sm">{stock.ts_code}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-white mb-2">¥{stock.close.toFixed(2)}</div>
              <div className={`flex items-center justify-end gap-2 text-2xl font-bold ${changeColor}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {isPositive ? (
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                <span className="text-lg">({stock.pct_chg > 0 ? '+' : ''}{stock.pct_chg.toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          {/* 数据网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">开盘</p>
              <p className="text-xl font-bold text-white">¥{stock.open.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">最高</p>
              <p className="text-xl font-bold text-green-400">¥{stock.high.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">最低</p>
              <p className="text-xl font-bold text-red-400">¥{stock.low.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">昨收</p>
              <p className="text-xl font-bold text-slate-300">¥{stock.pre_close.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">成交量</p>
              <p className="text-xl font-bold text-blue-400">{(stock.vol / 10000).toFixed(2)}万手</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">成交额</p>
              <p className="text-xl font-bold text-purple-400">{(stock.amount / 10000).toFixed(2)}亿</p>
            </div>
          </div>
        </div>

        {/* K Line Chart */}
        {history.length > 0 && (
          <div className="mb-6">
            <KLineChart data={history} title="近30日K线图" />
          </div>
        )}

        {/* AI Analysis Panel */}
        <AIPanel stockCode={stock.ts_code} stockName={stock.name} />
      </div>
    </div>
  );
};

export default DetailPage;
