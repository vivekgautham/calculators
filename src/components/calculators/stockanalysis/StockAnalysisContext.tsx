import React, { createContext, useContext, useState, ReactNode } from "react";

export interface StockDataPoint {
  date: number; // timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockAnalysisContextType {
  data: StockDataPoint[];
  fileName: string;
  setData: (data: StockDataPoint[], fileName: string) => void;
  clearData: () => void;
}

const StockAnalysisContext = createContext<
  StockAnalysisContextType | undefined
>(undefined);

export const StockAnalysisProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setDataState] = useState<StockDataPoint[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const setData = (newData: StockDataPoint[], name: string) => {
    // Sort data by date ascending for charts
    const sortedData = [...newData].sort((a, b) => a.date - b.date);
    setDataState(sortedData);
    setFileName(name);
  };

  const clearData = () => {
    setDataState([]);
    setFileName("");
  };

  return (
    <StockAnalysisContext.Provider
      value={{
        data,
        fileName,
        setData,
        clearData,
      }}
    >
      {children}
    </StockAnalysisContext.Provider>
  );
};

export const useStockAnalysis = () => {
  const context = useContext(StockAnalysisContext);
  if (!context) {
    throw new Error(
      "useStockAnalysis must be used within a StockAnalysisProvider",
    );
  }
  return context;
};
