import React from 'react';
import { StockQuote } from '../types';
import { Link } from 'react-router-dom';

interface StockCardProps {
  stock: StockQuote;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isPositive = stock.pct_chg >= 0;
  const changeColor = isPositive ? 'text-red-600' : 'text-green-600';
  const bgGradient = isPositive
    ? 'bg-gradient-to-br from-red-50 to-white border-red-200'
    : 'bg-gradient-to-br from-green-50 to-white border-green-200';
  const symbol = isPositive ? '▲' : '▼';

  return (
    <Link to={`/detail/${stock.ts_code}`}>
      <div className={`${bgGradient} border-2 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
        {/* 头部：股票名称和价格 */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{stock.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{stock.ts_code}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              ¥{stock.close.toFixed(2)}
            </div>
          </div>
        </div>

        {/* 涨跌幅 */}
        <div className={`flex items-center ${changeColor} font-bold text-lg mb-4`}>
          <span className="mr-1">{symbol}</span>
          <span>{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
          <span className="ml-2">({stock.pct_chg > 0 ? '+' : ''}{stock.pct_chg.toFixed(2)}%)</span>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* 详细数据 */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">开盘</p>
            <p className="font-semibold text-gray-800">¥{stock.open.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">最高</p>
            <p className="font-semibold text-red-600">¥{stock.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">最低</p>
            <p className="font-semibold text-green-600">¥{stock.low.toFixed(2)}</p>
          </div>
        </div>

        {/* 成交量 */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">成交量</span>
            <span className="font-semibold text-gray-700">{(stock.vol / 10000).toFixed(2)}万手</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
