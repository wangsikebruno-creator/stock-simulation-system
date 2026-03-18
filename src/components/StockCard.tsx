import React from 'react';
import { StockQuote } from '../types';
import { Link } from 'react-router-dom';

interface StockCardProps {
  stock: StockQuote;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isPositive = stock.pct_chg >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const borderColor = isPositive ? 'border-green-500/30 hover:border-green-500/60' : 'border-red-500/30 hover:border-red-500/60';
  const glowColor = isPositive ? 'hover:shadow-green-500/20' : 'hover:shadow-red-500/20';

  return (
    <Link to={`/detail/${stock.ts_code}`}>
      <div className={`group relative bg-slate-800/40 backdrop-blur-xl border ${borderColor} rounded-2xl p-6 hover:shadow-2xl ${glowColor} transition-all duration-300 cursor-pointer hover:-translate-y-2`}>
        {/* 背景光效 */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isPositive ? 'bg-gradient-to-br from-green-500/5 to-transparent' : 'bg-gradient-to-br from-red-500/5 to-transparent'}`}></div>

        <div className="relative z-10">
          {/* 头部：股票名称和代码 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{stock.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">{stock.ts_code}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isPositive ? '涨' : '跌'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">
                ¥{stock.close.toFixed(2)}
              </div>
            </div>
          </div>

          {/* 涨跌幅 - 大号显示 */}
          <div className={`flex items-center ${changeColor} font-bold text-xl mb-6`}>
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              {isPositive ? (
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
            <span className="ml-2 text-lg">({stock.pct_chg > 0 ? '+' : ''}{stock.pct_chg.toFixed(2)}%)</span>
          </div>

          {/* 详细数据网格 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">开盘</p>
              <p className="font-bold text-white">¥{stock.open.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">最高</p>
              <p className="font-bold text-green-400">¥{stock.high.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">最低</p>
              <p className="font-bold text-red-400">¥{stock.low.toFixed(2)}</p>
            </div>
          </div>

          {/* 成交信息 */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
            <div>
              <p className="text-slate-400 text-xs mb-1">成交量</p>
              <p className="font-semibold text-slate-300">{(stock.vol / 10000).toFixed(2)}万手</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs mb-1">成交额</p>
              <p className="font-semibold text-slate-300">{(stock.amount / 10000).toFixed(2)}亿</p>
            </div>
          </div>

          {/* 查看详情提示 */}
          <div className="mt-4 flex items-center justify-center text-slate-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>点击查看详情</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
