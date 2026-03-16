import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockQuote } from '../types';

interface StockContextType {
  stocks: StockQuote[];
  loading: boolean;
  error: string | null;
  refreshStocks: () => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const useStocks = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStocks must be used within StockProvider');
  }
  return context;
};

interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/quotes');
      const data = await response.json();

      if (data.success) {
        setStocks(data.data);
      } else {
        setError(data.error || '获取数据失败');
      }
    } catch (err) {
      setError('网络请求失败');
      console.error('Failed to fetch stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();

    // 每5分钟刷新一次
    const interval = setInterval(fetchStocks, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshStocks = async () => {
    await fetchStocks();
  };

  return (
    <StockContext.Provider value={{ stocks, loading, error, refreshStocks }}>
      {children}
    </StockContext.Provider>
  );
};
