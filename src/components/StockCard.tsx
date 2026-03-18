import React from 'react';
import { StockQuote } from '../types';
import { Link } from 'react-router-dom';

interface StockCardProps {
  stock: StockQuote;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isPositive = stock.pct_chg >= 0;

  return (
    <Link to={`/detail/${stock.ts_code}`}>
      <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl">
        {/* 头部 */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{stock.name}</h3>
            <p className="text-white/50 text-sm font-mono">{stock.ts_code}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isPositive ? '涨' : '跌'}
          </span>
        </div>

        {/* 价格 */}
        <div className="mb-4">
          <div className="text-4xl font-black text-white mb-2">
            ¥{stock.close.toFixed(2)}
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {isPositive ? (
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
            <span>({stock.pct_chg > 0 ? '+' : ''}{stock.pct_chg.toFixed(2)}%)</span>
          </div>
        </div>

        {/* 详细数据 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/50 text-xs mb-1">开盘</p>
            <p className="font-bold text-white text-sm">¥{stock.open.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/50 text-xs mb-1">最高</p>
            <p className="font-bold text-green-400 text-sm">¥{stock.high.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/50 text-xs mb-1">最低</p>
            <p className="font-bold text-red-400 text-sm">¥{stock.low.toFixed(2)}</p>
          </div>
        </div>

        {/* 成交信息 */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div>
            <p className="text-white/50 text-xs mb-1">成交量</p>
            <p className="font-semibold text-white text-sm">{(stock.vol / 10000).toFixed(2)}万手</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs mb-1">成交额</p>
            <p className="font-semibold text-white text-sm">{(stock.amount / 10000).toFixed(2)}亿</p>
          </div>
        </div>

        {/* 查看详情提示 */}
        <div className="mt-4 flex items-center justify-center text-white/40 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>点击查看详情</span>
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
