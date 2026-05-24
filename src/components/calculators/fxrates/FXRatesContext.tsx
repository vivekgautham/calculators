import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";

import { SERIES_NAMES } from "./constants";

export interface SeriesData {
  series: string;
  observations: { date: number; dateStr: string; value: number }[];
}

interface FXRatesContextType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  selectedSeries: string[];
  ratesData: SeriesData[];
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  setSelectedSeries: (series: string[]) => void;
  setRatesData: (data: SeriesData[]) => void;
}

const FXRatesContext = createContext<FXRatesContextType | undefined>(undefined);

export const FXRatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'year'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [selectedSeries, setSelectedSeries] = useState<string[]>(SERIES_NAMES);
  const [ratesData, setRatesData] = useState<SeriesData[]>([]);

  return (
    <FXRatesContext.Provider
      value={{
        startDate,
        endDate,
        selectedSeries,
        ratesData,
        setStartDate,
        setEndDate,
        setSelectedSeries,
        setRatesData,
      }}
    >
      {children}
    </FXRatesContext.Provider>
  );
};

export const useFXRates = () => {
  const context = useContext(FXRatesContext);
  if (!context) {
    throw new Error("useFXRates must be used within a FXRatesProvider");
  }
  return context;
};
