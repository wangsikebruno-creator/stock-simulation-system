import React from 'react';
import { KLineData } from '../types';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface KLineChartProps {
  data: KLineData[];
  title?: string;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, title = 'K线图' }) => {
  // 处理数据，添加涨跌标记
  const chartData = data.map((item) => ({
    ...item,
    isRise: item.close >= item.open,
    range: [item.low, item.high],
    body: [Math.min(item.open, item.close), Math.max(item.open, item.close)],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-bold text-gray-800 mb-2">{data.date}</p>
          <p className="text-sm text-gray-600">开盘: ¥{data.open.toFixed(2)}</p>
          <p className="text-sm text-gray-600">收盘: ¥{data.close.toFixed(2)}</p>
          <p className="text-sm text-red-600">最高: ¥{data.high.toFixed(2)}</p>
          <p className="text-sm text-green-600">最低: ¥{data.low.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            涨跌: {data.close >= data.open ? '+' : ''}
            {(data.close - data.open).toFixed(2)} (
            {(((data.close - data.open) / data.open) * 100).toFixed(2)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickFormatter={(value) => `¥${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />

          {/* 影线（最高最低） */}
          <Bar dataKey="range" fill="transparent" barSize={1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} stroke={entry.isRise ? '#ef4444' : '#22c55e'} strokeWidth={1} />
            ))}
          </Bar>

          {/* K线实体 */}
          <Bar dataKey="body" name="K线" barSize={8}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isRise ? '#ef4444' : '#22c55e'} />
            ))}
          </Bar>

          {/* 5日均线 */}
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            name="收盘价"
            strokeWidth={1.5}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KLineChart;
