import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFedRates } from "../FedRatesContext";

export interface FedRateObservation {
  effectiveDate: string;
  type: string;
  percentRate: number;
}

interface FedRatesResponse {
  refRates: FedRateObservation[];
}

export interface SeriesData {
  type: string;
  observations: { date: number; value: number }[];
}

export const useFedRatesData = () => {
  const { startDate, endDate } = useFedRates();

  const startStr = startDate.format("YYYY-MM-DD");
  const endStr = endDate.format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["fedRates", startStr, endStr],
    queryFn: async () => {
      const url = `https://markets.newyorkfed.org/api/rates/all/search.json?startDate=${startStr}&endDate=${endStr}&type=rate`;
      const response = await axios.get<FedRatesResponse>(url);

      const rates = response.data.refRates || [];

      // Group by type
      const grouped = rates.reduce((acc: Record<string, SeriesData>, curr) => {
        if (!acc[curr.type]) {
          acc[curr.type] = {
            type: curr.type,
            observations: [],
          };
        }
        acc[curr.type].observations.push({
          date: new Date(curr.effectiveDate).getTime(),
          value: curr.percentRate,
        });
        return acc;
      }, {});

      // Sort observations by date for each type
      Object.values(grouped).forEach(series => {
        series.observations.sort((a, b) => a.date - b.date);
      });

      return Object.values(grouped);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
