import React from "react";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { useFXRates } from "./FXRatesContext";
import { ALLOW_ORIGINS, API_KEY, LOCAL_DEV_URL } from "./constants";
import { AVAILABLE_COLORS } from "../rateofgrowth/RateOfGrowthContext";

interface Observation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: Observation[];
}

const FXRatesLineChart: React.FC = () => {
  const { startDate, endDate, selectedSeries, setRatesData } = useFXRates();

  const startStr = startDate?.format("YYYY-MM-DD");
  const endStr = endDate?.format("YYYY-MM-DD");

  const results = useQueries({
    queries: selectedSeries.map((series) => ({
      queryKey: ["fxRate", series.id, startStr, endStr],
      queryFn: async () => {
        const prodSeriesApi = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=${series.id}&file_type=json`
        const prodUrl = `${ALLOW_ORIGINS}${encodeURIComponent(prodSeriesApi)}`;
        const localDevUrl = `${LOCAL_DEV_URL}&series_id=${series.id}&file_type=json`;
        const url = import.meta.env.DEV ? localDevUrl : prodUrl

        const response = await axios.get<FredResponse>(url);

        const isBaseNotUsd = !series.name.startsWith("USD/");
        const invertedName = isBaseNotUsd
          ? `USD/${series.name.split('/')[0]}`
          : series.name;

        let observations = response.data.observations.map((obs) => {
          const rawValue = parseFloat(obs.value);
          const value = (isBaseNotUsd && rawValue !== 0) ? 1 / rawValue : rawValue;

          return {
            date: new Date(obs.date).getTime(),
            dateStr: obs.date, // Keep string for filtering
            value: value,
          };
        }).filter(obs => !isNaN(obs.value));

        // Local filtering
        if (startStr) {
          observations = observations.filter(obs => obs.dateStr >= startStr);
        }
        if (endStr) {
          observations = observations.filter(obs => obs.dateStr <= endStr);
        }

        return {
          series: {
            ...series,
            name: invertedName
          },
          observations,
        };
      },      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  React.useEffect(() => {
    const data = results
      .map((r) => r.data)
      .filter((d): d is NonNullable<typeof d> => !!d);
    if (data.length > 0) {
      setRatesData(data);
    }
  }, [results, setRatesData]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading exchange rate data.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Stack spacing={3}>
        {results.map((result, index) => {
          if (!result.data) return null;

          const color = AVAILABLE_COLORS[index % AVAILABLE_COLORS.length];

          const options: Highcharts.Options = {
            chart: {
              type: "line",
              zooming: {
                type: "x",
              },
              height: 300,
            },
            title: {
              text: result.data.series.name,
            },
            xAxis: {
              type: "datetime",
              title: { text: "Date" },
            },
            yAxis: {
              title: { text: "Exchange Rate" },
            },
            tooltip: {
              xDateFormat: "%Y-%m-%d",
              valueDecimals: 4,
            },
            series: [{
              name: result.data.series.name,
              data: result.data.observations.map((obs) => [obs.date, obs.value]),
              marker: { enabled: false },
              type: 'line',
              color: color
            }],
            credits: { enabled: false },
            legend: { enabled: false }
          };

          return (
            <Box key={result.data.series.id} sx={{ width: '100%' }}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default FXRatesLineChart;
