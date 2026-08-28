import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import { FXSeriesOption, DEFAULT_FX_SERIES } from "./constants";

export interface SeriesObservation {
  date: number;
  dateStr: string;
  value: number;
}

export interface SeriesData {
  series: FXSeriesOption;
  observations: SeriesObservation[];
}

interface FXRatesContextType {
  startDate: Dayjs;
  endDate: Dayjs;
  selectedSeries: FXSeriesOption[];
  setStartDate: (date: Dayjs) => void;
  setEndDate: (date: Dayjs) => void;
  setSelectedSeries: (series: FXSeriesOption[]) => void;
}

const FXRatesContext = createContext<FXRatesContextType | undefined>(undefined);

export const FXRatesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().subtract(5, "year"),
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [selectedSeries, setSelectedSeries] =
    useState<FXSeriesOption[]>(DEFAULT_FX_SERIES);

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
