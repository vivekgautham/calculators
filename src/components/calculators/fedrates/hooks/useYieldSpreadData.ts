import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFedRates } from "../FedRatesContext";

interface StaticRatesFile {
  updatedAt: string;
  dates: string[];
  series: Record<string, (number | null)[]>;
}

export interface SpreadObservation {
  date: number; // timestamp in ms
  dateStr: string; // "YYYY-MM-DD"
  dgs2: number; // 2Y yield (%)
  dgs10: number; // 10Y yield (%)
  spread: number; // 10Y - 2Y yield (%)
  spreadBps: number; // in basis points
  isInverted: boolean; // spread < 0
}

export interface SpreadSummaryStats {
  latestDate: string;
  latestDgs2: number;
  latestDgs10: number;
  latestSpread: number;
  latestSpreadBps: number;
  isCurrentlyInverted: boolean;
  totalDays: number;
  invertedDays: number;
  invertedPercentage: number;
  minSpread: number;
  minSpreadDate: string;
  maxSpread: number;
  maxSpreadDate: string;
  avgSpread: number;
}

export interface YieldSpreadDataResponse {
  updatedAt?: string;
  observations: SpreadObservation[];
  stats: SpreadSummaryStats | null;
}

export const useYieldSpreadData = () => {
  const { startDate, endDate } = useFedRates();

  const startStr = startDate ? startDate.format("YYYY-MM-DD") : "";
  const endStr = endDate ? endDate.format("YYYY-MM-DD") : "";

  return useQuery({
    queryKey: ["yieldSpreadStatic", startStr, endStr],
    queryFn: async (): Promise<YieldSpreadDataResponse> => {
      const url = `${import.meta.env.BASE_URL}data/fed_rates.json`;
      const response = await axios.get<StaticRatesFile>(url);
      const data = response.data;
      const dates = data.dates || [];
      const dgs2Series = data.series["DGS2"] || [];
      const dgs10Series = data.series["DGS10"] || [];

      const observations: SpreadObservation[] = [];
      let invertedCount = 0;
      let minSpread = Infinity;
      let minSpreadDate = "";
      let maxSpread = -Infinity;
      let maxSpreadDate = "";
      let sumSpread = 0;

      for (let i = 0; i < dates.length; i++) {
        const dStr = dates[i];
        if (startStr && dStr < startStr) continue;
        if (endStr && dStr > endStr) continue;

        const val2 = dgs2Series[i];
        const val10 = dgs10Series[i];

        if (
          val2 !== null &&
          val2 !== undefined &&
          val10 !== null &&
          val10 !== undefined
        ) {
          const spread = parseFloat((val10 - val2).toFixed(2));
          const spreadBps = Math.round(spread * 100);
          const isInverted = spread < 0;

          if (isInverted) invertedCount++;
          if (spread < minSpread) {
            minSpread = spread;
            minSpreadDate = dStr;
          }
          if (spread > maxSpread) {
            maxSpread = spread;
            maxSpreadDate = dStr;
          }
          sumSpread += spread;

          observations.push({
            date: new Date(dStr).getTime(),
            dateStr: dStr,
            dgs2: val2,
            dgs10: val10,
            spread,
            spreadBps,
            isInverted,
          });
        }
      }

      let stats: SpreadSummaryStats | null = null;
      if (observations.length > 0) {
        const latest = observations[observations.length - 1];
        stats = {
          latestDate: latest.dateStr,
          latestDgs2: latest.dgs2,
          latestDgs10: latest.dgs10,
          latestSpread: latest.spread,
          latestSpreadBps: latest.spreadBps,
          isCurrentlyInverted: latest.isInverted,
          totalDays: observations.length,
          invertedDays: invertedCount,
          invertedPercentage: parseFloat(
            ((invertedCount / observations.length) * 100).toFixed(1),
          ),
          minSpread: minSpread === Infinity ? 0 : minSpread,
          minSpreadDate,
          maxSpread: maxSpread === -Infinity ? 0 : maxSpread,
          maxSpreadDate,
          avgSpread: parseFloat((sumSpread / observations.length).toFixed(2)),
        };
      }

      return {
        updatedAt: data.updatedAt,
        observations,
        stats,
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
