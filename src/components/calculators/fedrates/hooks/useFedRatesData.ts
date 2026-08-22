import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFedRates } from "../FedRatesContext";
import { SeriesOption } from "../constants";

interface StaticRatesFile {
  updatedAt: string;
  dates: string[];
  series: Record<string, (number | null)[]>;
}

export interface FedSeriesResult {
  series: SeriesOption;
  observations: { date: number; value: number }[];
}

export interface FedRatesDataResponse {
  updatedAt?: string;
  seriesList: FedSeriesResult[];
}

export const useFedRatesData = () => {
  const { startDate, endDate, selectedSeries } = useFedRates();

  const startStr = startDate ? startDate.format("YYYY-MM-DD") : "";
  const endStr = endDate ? endDate.format("YYYY-MM-DD") : "";

  return useQuery({
    queryKey: [
      "fedRatesStatic",
      startStr,
      endStr,
      selectedSeries.map((s) => s.id).join(","),
    ],
    queryFn: async (): Promise<FedRatesDataResponse> => {
      const url = `${import.meta.env.BASE_URL}data/fed_rates.json`;
      const response = await axios.get<StaticRatesFile>(url);
      const data = response.data;
      const dates = data.dates || [];

      // Pre-filter date indices
      const validIndices: number[] = [];
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];
        if (startStr && d < startStr) continue;
        if (endStr && d > endStr) continue;
        validIndices.push(i);
      }

      const seriesList: FedSeriesResult[] = selectedSeries
        .map((seriesOption) => {
          const values = data.series[seriesOption.id];
          if (!values) return null;

          const observations: { date: number; value: number }[] = [];
          for (const idx of validIndices) {
            const val = values[idx];
            if (val !== null && val !== undefined) {
              observations.push({
                date: new Date(dates[idx]).getTime(),
                value: val,
              });
            }
          }

          return {
            series: seriesOption,
            observations,
          };
        })
        .filter(Boolean) as FedSeriesResult[];

      return {
        updatedAt: data.updatedAt,
        seriesList,
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
