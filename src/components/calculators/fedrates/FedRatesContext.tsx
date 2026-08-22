import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import { SeriesOption, DEFAULT_FED_SERIES } from "./constants";

interface FedRatesContextType {
  startDate: Dayjs;
  endDate: Dayjs;
  selectedSeries: SeriesOption[];
  setStartDate: (date: Dayjs) => void;
  setEndDate: (date: Dayjs) => void;
  setSelectedSeries: (series: SeriesOption[]) => void;
}

const FedRatesContext = createContext<FedRatesContextType | undefined>(
  undefined,
);

export const FedRatesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().subtract(10, "year"),
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [selectedSeries, setSelectedSeries] =
    useState<SeriesOption[]>(DEFAULT_FED_SERIES);

  return (
    <FedRatesContext.Provider
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
    </FedRatesContext.Provider>
  );
};

export const useFedRates = () => {
  const context = useContext(FedRatesContext);
  if (!context) {
    throw new Error("useFedRates must be used within a FedRatesProvider");
  }
  return context;
};
