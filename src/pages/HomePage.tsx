import React, { useMemo } from 'react';
import { useStocks } from '../context/StockContext';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { stocks, loading, error, refreshStocks } = useStocks();

  // 计算市场统计
  const marketStats = useMemo(() => {
    if (stocks.length === 0) return { up: 0, down: 0, avgChange: 0 };

    const up = stocks.filter(s => s.pct_chg > 0).length;
    const down = stocks.filter(s => s.pct_chg < 0).length;
    const avgChange = stocks.reduce((sum, s) => sum + s.pct_chg, 0) / stocks.length;

    return { up, down, avgChange };
  }, [stocks]);

  if (loading && stocks.length === 0) {
    return <LoadingSpinner text="正在加载股票数据..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* 动态背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">实时数据 · AI 智能分析</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
            智能股票分析平台
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            专业级 A 股实时行情监控与人工智能分析系统
          </p>
        </div>

        {/* 市场概览 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">总股票数</p>
                <p className="text-4xl font-bold text-white">{stocks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">上涨 / 下跌</p>
                <p className="text-4xl font-bold text-white">
                  <span className="text-green-400">{marketStats.up}</span>
                  <span className="text-white/40 text-2xl mx-2">/</span>
                  <span className="text-red-400">{marketStats.down}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">平均涨幅</p>
                <p className={`text-4xl font-bold ${marketStats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${marketStats.avgChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <svg className={`w-6 h-6 ${marketStats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 控制栏 */}
        <div className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">实时监控</span>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <span className="text-blue-300 text-sm">更新中...</span>
              </div>
            )}
          </div>
          <button
            onClick={refreshStocks}
            disabled={loading}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/30"
          >
            {loading ? '刷新中...' : '🔄 刷新数据'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stock Grid */}
        {stocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <StockCard key={stock.ts_code} stock={stock} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-white/70 text-lg mb-2">暂无股票数据</p>
              <p className="text-white/50 text-sm">请检查 Tushare API 配置</p>
            </div>
          )
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-white/50 text-sm space-y-2">
          <p>数据来源: Tushare | 数据延迟约15分钟</p>
          <p>⚠️ 本系统仅供学习研究使用，不构成投资建议</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
