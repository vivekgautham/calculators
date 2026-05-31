import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";

interface FedRatesContextType {
  startDate: Dayjs;
  endDate: Dayjs;
  setStartDate: (date: Dayjs) => void;
  setEndDate: (date: Dayjs) => void;
}

const FedRatesContext = createContext<FedRatesContextType | undefined>(undefined);

export const FedRatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(15, "year"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  return (
    <FedRatesContext.Provider
      value={{
        startDate,
        endDate,
        setStartDate,
        setEndDate,
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
