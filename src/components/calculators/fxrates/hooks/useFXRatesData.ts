import { useQueries, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useFXRates, SeriesData } from "../FXRatesContext";
import { ALLOW_ORIGINS, API_KEY, LOCAL_DEV_URL } from "../constants";

interface Observation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: Observation[];
}

export const useFXRatesData = (): UseQueryResult<SeriesData, Error>[] => {
  const { startDate, endDate, selectedSeries } = useFXRates();

  const startStr = startDate?.format("YYYY-MM-DD");
  const endStr = endDate?.format("YYYY-MM-DD");

  const results = useQueries({
    queries: selectedSeries.map((series) => ({
      queryKey: ["fxRate", series.id, startStr, endStr],
      queryFn: async () => {
        const prodSeriesApi = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=${series.id}&file_type=json`;
        const prodUrl = `${ALLOW_ORIGINS}${encodeURIComponent(prodSeriesApi)}`;
        const localDevUrl = `${LOCAL_DEV_URL}&series_id=${series.id}&file_type=json`;
        const url = import.meta.env.DEV ? localDevUrl : prodUrl;

        const response = await axios.get<FredResponse>(url);

        const isBaseNotUsd = !series.name.startsWith("USD/");
        const invertedName = isBaseNotUsd
          ? `USD/${series.name.split("/")[0]}`
          : series.name;

        let observations = response.data.observations
          .map((obs) => {
            const rawValue = parseFloat(obs.value);
            const value =
              isBaseNotUsd && rawValue !== 0 ? 1 / rawValue : rawValue;

            return {
              date: new Date(obs.date).getTime(),
              dateStr: obs.date, // Keep string for filtering
              value: value,
            };
          })
          .filter((obs) => !isNaN(obs.value));

        // Local filtering
        if (startStr) {
          observations = observations.filter((obs) => obs.dateStr >= startStr);
        }
        if (endStr) {
          observations = observations.filter((obs) => obs.dateStr <= endStr);
        }

        return {
          series: {
            ...series,
            name: invertedName,
          },
          observations,
        };
      },
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });

  return results;
};
