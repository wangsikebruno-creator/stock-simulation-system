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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || '股票不存在'}</p>
          <Link to="/" className="text-blue-600 hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.pct_chg >= 0;
  const changeColor = isPositive ? 'text-stock-red' : 'text-stock-green';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          ← 返回首页
        </Link>

        {/* Stock Header */}
        <div className="bg-white rounded-lg p-6 shadow mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{stock.name}</h1>
              <p className="text-gray-500 mt-1">{stock.ts_code}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-800">¥{stock.close.toFixed(2)}</div>
              <div className={`text-xl font-semibold ${changeColor} mt-1`}>
                {isPositive ? '▲' : '▼'} {stock.change.toFixed(2)} ({stock.pct_chg.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500">开盘</p>
              <p className="text-lg font-semibold">¥{stock.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">最高</p>
              <p className="text-lg font-semibold text-stock-red">¥{stock.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">最低</p>
              <p className="text-lg font-semibold text-stock-green">¥{stock.low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">昨收</p>
              <p className="text-lg font-semibold">¥{stock.pre_close.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">成交量</p>
              <p className="text-lg font-semibold">{(stock.vol / 10000).toFixed(2)}万手</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">成交额</p>
              <p className="text-lg font-semibold">{(stock.amount / 10000).toFixed(2)}亿元</p>
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
