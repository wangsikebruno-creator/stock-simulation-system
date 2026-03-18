import React, { useMemo } from 'react';
import { useStocks } from '../context/StockContext';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { stocks, loading, error, refreshStocks } = useStocks();

  // 计算市场统计
  const marketStats = useMemo(() => {
    if (stocks.length === 0) return { up: 0, down: 0, avgChange: 0, totalVolume: 0 };

    const up = stocks.filter(s => s.pct_chg > 0).length;
    const down = stocks.filter(s => s.pct_chg < 0).length;
    const avgChange = stocks.reduce((sum, s) => sum + s.pct_chg, 0) / stocks.length;
    const totalVolume = stocks.reduce((sum, s) => sum + s.vol, 0);

    return { up, down, avgChange, totalVolume };
  }, [stocks]);

  if (loading && stocks.length === 0) {
    return <LoadingSpinner text="正在加载股票数据..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 动态背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">实时数据 · AI 驱动</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              智能股票分析
            </span>
          </h1>
          <p className="text-slate-400 text-xl font-light">专业级 A 股实时行情与 AI 智能分析平台</p>
        </div>

        {/* 市场概览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-slate-400 text-sm mb-2">总股票数</div>
            <div className="text-3xl font-bold text-white">{stocks.length}</div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
            <div className="text-slate-400 text-sm mb-2">上涨</div>
            <div className="text-3xl font-bold text-green-400">{marketStats.up}</div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
            <div className="text-slate-400 text-sm mb-2">下跌</div>
            <div className="text-3xl font-bold text-red-400">{marketStats.down}</div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="text-slate-400 text-sm mb-2">平均涨幅</div>
            <div className={`text-3xl font-bold ${marketStats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* 控制栏 */}
        <div className="mb-8 flex justify-between items-center bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-slate-300 font-medium">
              实时监控中
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                更新中...
              </div>
            )}
          </div>
          <button
            onClick={refreshStocks}
            disabled={loading}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? '刷新中' : '刷新数据'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
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
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-slate-400 text-lg mb-2">暂无股票数据</p>
                <p className="text-slate-500 text-sm">请检查 Tushare API 配置</p>
              </div>
            </div>
          )
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-8 py-4">
            <p className="text-slate-400 text-sm mb-1">
              数据来源: <span className="text-blue-400 font-medium">Tushare</span> ·
              AI 引擎: <span className="text-purple-400 font-medium">Claude</span>
            </p>
            <p className="text-slate-500 text-xs">
              ⚠️ 本系统仅供学习研究使用，不构成投资建议
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
