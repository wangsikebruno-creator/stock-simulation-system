import React from 'react';
import { KLineData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KLineChartProps {
  data: KLineData[];
  title?: string;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, title = 'K线图' }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            formatter={(value: number) => `¥${value.toFixed(2)}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#2563eb"
            name="收盘价"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="open"
            stroke="#10b981"
            name="开盘价"
            strokeWidth={1}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KLineChart;
