import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";

import { SERIES_NAMES } from "./constants";

interface FXRatesContextType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  selectedSeries: string[];
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  setSelectedSeries: (series: string[]) => void;
}

const FXRatesContext = createContext<FXRatesContextType | undefined>(undefined);

export const FXRatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [selectedSeries, setSelectedSeries] = useState<string[]>(SERIES_NAMES.slice(0, 3));

  return (
    <FXRatesContext.Provider
      value={{
        startDate,
        endDate,
        selectedSeries,
        setStartDate,
        setEndDate,
        setSelectedSeries,
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
