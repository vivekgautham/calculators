import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import dayjs, { Dayjs } from "dayjs";

export interface DailyReserveRunwayContextType {
  totalReserve: number;
  setTotalReserve: (val: number) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  yearsToGo: number;
  setYearsToGo: (years: number) => void;

  // Computed calendar metrics
  startDayjs: Dayjs;
  endDayjs: Dayjs;
  totalDays: number;
  startDateFormatted: string;
  endDateFormatted: string;

  // Daily, Weekly, Monthly, Annual allowances
  dailyAllowanceCash: number;
  weeklyAllowanceCash: number;
  monthlyAllowanceCash: number;
  annualAllowanceCash: number;

  formatCurrency: (val: number, decimals?: number) => string;
  resetDefaults: () => void;
}

const DEFAULT_RESERVE = 250000;
const DEFAULT_YEARS = 5;

const DailyReserveRunwayContext = createContext<
  DailyReserveRunwayContextType | undefined
>(undefined);

export const DailyReserveRunwayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [totalReserve, setTotalReserve] = useState<number>(DEFAULT_RESERVE);
  const [startDate, setStartDate] = useState<string>(() =>
    dayjs().format("YYYY-MM-DD"),
  );
  const [yearsToGo, setYearsToGo] = useState<number>(DEFAULT_YEARS);

  // Parse start date
  const startDayjs = useMemo(() => {
    const parsed = dayjs(startDate);
    return parsed.isValid() ? parsed : dayjs();
  }, [startDate]);

  // Compute exact calendar end date including leap years
  const endDayjs = useMemo(() => {
    const wholeYears = Math.floor(yearsToGo);
    const fractionalDays = Math.round((yearsToGo - wholeYears) * 365.25);
    return startDayjs.add(wholeYears, "year").add(fractionalDays, "day");
  }, [startDayjs, yearsToGo]);

  // Total calendar days
  const totalDays = useMemo(() => {
    return Math.max(1, endDayjs.diff(startDayjs, "day"));
  }, [startDayjs, endDayjs]);

  const startDateFormatted = useMemo(
    () => startDayjs.format("MMMM D, YYYY"),
    [startDayjs],
  );

  const endDateFormatted = useMemo(
    () => endDayjs.format("MMMM D, YYYY"),
    [endDayjs],
  );

  // Daily allowance: Total Reserve / Total Days
  const dailyAllowanceCash = useMemo(() => {
    return totalDays > 0 ? totalReserve / totalDays : 0;
  }, [totalReserve, totalDays]);

  const weeklyAllowanceCash = useMemo(
    () => dailyAllowanceCash * 7,
    [dailyAllowanceCash],
  );

  const monthlyAllowanceCash = useMemo(() => {
    return totalReserve / Math.max(0.1, yearsToGo * 12);
  }, [totalReserve, yearsToGo]);

  const annualAllowanceCash = useMemo(() => {
    return totalReserve / Math.max(0.1, yearsToGo);
  }, [totalReserve, yearsToGo]);

  const formatCurrency = useCallback(
    (val: number, decimals: number = 2): string => {
      const isNeg = val < 0;
      const absFormatted = Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return isNeg ? `-$${absFormatted}` : `$${absFormatted}`;
    },
    [],
  );

  const resetDefaults = useCallback(() => {
    setTotalReserve(DEFAULT_RESERVE);
    setStartDate(dayjs().format("YYYY-MM-DD"));
    setYearsToGo(DEFAULT_YEARS);
  }, []);

  return (
    <DailyReserveRunwayContext.Provider
      value={{
        totalReserve,
        setTotalReserve,
        startDate,
        setStartDate,
        yearsToGo,
        setYearsToGo,

        startDayjs,
        endDayjs,
        totalDays,
        startDateFormatted,
        endDateFormatted,

        dailyAllowanceCash,
        weeklyAllowanceCash,
        monthlyAllowanceCash,
        annualAllowanceCash,

        formatCurrency,
        resetDefaults,
      }}
    >
      {children}
    </DailyReserveRunwayContext.Provider>
  );
};

export const useDailyReserveRunway = (): DailyReserveRunwayContextType => {
  const context = useContext(DailyReserveRunwayContext);
  if (!context) {
    throw new Error(
      "useDailyReserveRunway must be used within a DailyReserveRunwayProvider",
    );
  }
  return context;
};
