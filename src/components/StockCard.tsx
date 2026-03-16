import React from 'react';
import { StockQuote } from '../types';
import { Link } from 'react-router-dom';

interface StockCardProps {
  stock: StockQuote;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isPositive = stock.pct_chg >= 0;
  const changeColor = isPositive ? 'text-stock-red' : 'text-stock-green';
  const bgColor = isPositive ? 'bg-red-50' : 'bg-green-50';
  const symbol = isPositive ? '▲' : '▼';

  return (
    <Link to={`/detail/${stock.ts_code}`}>
      <div className={`${bgColor} rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{stock.name}</h3>
            <p className="text-sm text-gray-500">{stock.ts_code}</p>
          </div>
          <div className={`text-2xl font-bold ${changeColor}`}>
            ¥{stock.close.toFixed(2)}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className={`flex items-center ${changeColor} font-semibold`}>
            <span className="mr-1">{symbol}</span>
            <span>{stock.change.toFixed(2)}</span>
            <span className="ml-2">({stock.pct_chg.toFixed(2)}%)</span>
          </div>

          <div className="text-sm text-gray-600">
            <span>成交量: {(stock.vol / 10000).toFixed(2)}万手</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          <span>开: {stock.open.toFixed(2)}</span>
          <span className="ml-3">高: {stock.high.toFixed(2)}</span>
          <span className="ml-3">低: {stock.low.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
