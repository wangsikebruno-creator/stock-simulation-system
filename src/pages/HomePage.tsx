import React from 'react';
import { useStocks } from '../context/StockContext';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { stocks, loading, error, refreshStocks } = useStocks();

  if (loading && stocks.length === 0) {
    return <LoadingSpinner text="正在加载股票数据..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            📈 模拟股票实验系统
          </h1>
          <p className="text-gray-600 text-lg">A股实时行情与智能分析</p>
        </div>

        {/* Refresh Button */}
        <div className="mb-8 flex justify-between items-center bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm font-medium text-gray-700">
            {stocks.length > 0 && `共 ${stocks.length} 只股票`}
          </div>
          <button
            onClick={refreshStocks}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            {loading ? '刷新中...' : '🔄 刷新数据'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
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
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">暂无股票数据</p>
              <p className="text-sm mt-2">请检查 Tushare API 配置</p>
            </div>
          )
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>数据来源: Tushare | 数据延迟约15分钟</p>
          <p className="mt-1">⚠️ 本系统仅供学习研究使用，不构成投资建议</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
