import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import axios from "axios";
import { calculateNextDayVolatility, NextDayVolResult } from "./calculations";

export interface LatestMarketData {
  sp500Value: number;
  sp500Date: string;
  vixValue: number;
  vixDate: string;
}

interface NextDayVolContextType {
  spotPrice: number;
  setSpotPrice: (val: number) => void;
  vix: number;
  setVix: (val: number) => void;
  latestData: LatestMarketData | null;
  isLoading: boolean;
  result: NextDayVolResult;
  resetToLatest: () => void;
  applyVixPreset: (presetVix: number) => void;
}

const DEFAULT_SPOT = 7743.41;
const DEFAULT_VIX = 14.21;

const NextDayVolContext = createContext<NextDayVolContextType | undefined>(
  undefined,
);

export const NextDayVolProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [spotPrice, setSpotPrice] = useState<number>(DEFAULT_SPOT);
  const [vix, setVix] = useState<number>(DEFAULT_VIX);
  const [latestData, setLatestData] = useState<LatestMarketData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestData = async () => {
      setIsLoading(true);
      try {
        const [spRes, vixRes] = await Promise.allSettled([
          axios.get<{ value: number; date: string }>(
            `${import.meta.env.BASE_URL}data/sp500.json`,
          ),
          axios.get<{ value: number; date: string }>(
            `${import.meta.env.BASE_URL}data/vix.json`,
          ),
        ]);

        let spVal = DEFAULT_SPOT;
        let spDate = "2026-09-25";
        let vxVal = DEFAULT_VIX;
        let vxDate = "2026-09-22";

        if (spRes.status === "fulfilled" && spRes.value.data?.value) {
          spVal = spRes.value.data.value;
          spDate = spRes.value.data.date;
          setSpotPrice(spVal);
        }

        if (vixRes.status === "fulfilled" && vixRes.value.data?.value) {
          vxVal = vixRes.value.data.value;
          vxDate = vixRes.value.data.date;
          setVix(vxVal);
        }

        setLatestData({
          sp500Value: spVal,
          sp500Date: spDate,
          vixValue: vxVal,
          vixDate: vxDate,
        });
      } catch {
        // Fall back to default state
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestData();
  }, []);

  const result = useMemo(() => {
    return calculateNextDayVolatility(spotPrice, vix);
  }, [spotPrice, vix]);

  const resetToLatest = () => {
    if (latestData) {
      setSpotPrice(latestData.sp500Value);
      setVix(latestData.vixValue);
    } else {
      setSpotPrice(DEFAULT_SPOT);
      setVix(DEFAULT_VIX);
    }
  };

  const applyVixPreset = (presetVix: number) => {
    setVix(presetVix);
  };

  return (
    <NextDayVolContext.Provider
      value={{
        spotPrice,
        setSpotPrice,
        vix,
        setVix,
        latestData,
        isLoading,
        result,
        resetToLatest,
        applyVixPreset,
      }}
    >
      {children}
    </NextDayVolContext.Provider>
  );
};

export const useNextDayVol = (): NextDayVolContextType => {
  const context = useContext(NextDayVolContext);
  if (!context) {
    throw new Error("useNextDayVol must be used within a NextDayVolProvider");
  }
  return context;
};
