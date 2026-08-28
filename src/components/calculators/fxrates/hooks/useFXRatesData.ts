import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFXRates } from "../FXRatesContext";
import { FXSeriesOption } from "../constants";

interface StaticRatesFile {
  updatedAt: string;
  dates: string[];
  series: Record<string, (number | null)[]>;
}

export interface FXObservation {
  date: number;
  dateStr: string;
  value: number;
}

export interface FXSeriesResult {
  series: FXSeriesOption;
  observations: FXObservation[];
}

export interface FXRatesDataResponse {
  updatedAt?: string;
  seriesList: FXSeriesResult[];
}

export const useFXRatesData = () => {
  const { startDate, endDate, selectedSeries } = useFXRates();

  const startStr = startDate ? startDate.format("YYYY-MM-DD") : "";
  const endStr = endDate ? endDate.format("YYYY-MM-DD") : "";

  return useQuery({
    queryKey: [
      "fxRatesStatic",
      startStr,
      endStr,
      selectedSeries.map((s) => s.id).join(","),
    ],
    queryFn: async (): Promise<FXRatesDataResponse> => {
      const url = `${import.meta.env.BASE_URL}data/fx_rates.json`;
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

      const seriesList: FXSeriesResult[] = selectedSeries
        .map((seriesOption) => {
          const values = data.series[seriesOption.id];
          if (!values) return null;

          const observations: FXObservation[] = [];
          for (const idx of validIndices) {
            const val = values[idx];
            if (val !== null && val !== undefined) {
              observations.push({
                date: new Date(dates[idx]).getTime(),
                dateStr: dates[idx],
                value: val,
              });
            }
          }

          return {
            series: seriesOption,
            observations,
          };
        })
        .filter(Boolean) as FXSeriesResult[];

      return {
        updatedAt: data.updatedAt,
        seriesList,
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
