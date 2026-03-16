import React, { useState } from 'react';
import { AIAnalysis } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface AIPanelProps {
  stockCode: string;
  stockName: string;
}

const AIPanel: React.FC<AIPanelProps> = ({ stockCode, stockName }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analyze?symbol=${stockCode}`);
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.error || 'AI分析失败');
      }
    } catch (err) {
      setError('网络请求失败');
      console.error('Failed to generate analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🤖 AI智能分析</h3>
        <button
          onClick={generateAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '分析中...' : '生成分析'}
        </button>
      </div>

      {loading && <LoadingSpinner text="AI正在分析中，请稍候..." />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-gray-600 mb-2">
              分析对象: {stockName} ({stockCode})
            </p>
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {analysis.analysis}
            </div>
          </div>

          <div className="text-xs text-gray-500 flex justify-between">
            <span>模型: {analysis.model}</span>
            <span>生成时间: {new Date(analysis.timestamp).toLocaleString('zh-CN')}</span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
            ⚠️ 免责声明：以上分析仅供参考，不构成投资建议。投资有风险，入市需谨慎。
          </div>
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="text-center text-gray-500 py-8">
          点击"生成分析"按钮，获取AI智能分析报告
        </div>
      )}
    </div>
  );
};

export default AIPanel;
