import React, { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useFXRates } from "./FXRatesContext";
import { FRED_URL, SERIES_NAMES } from "./constants";

interface Observation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: Observation[];
}

const FXRatesLineChart: React.FC = () => {
  const { startDate, endDate, selectedSeries } = useFXRates();

  const startStr = startDate?.format("YYYY-MM-DD");
  const endStr = endDate?.format("YYYY-MM-DD");

  const results = useQueries({
    queries: selectedSeries.map((series) => ({
      queryKey: ["fxRate", series, startStr, endStr],
      queryFn: async () => {
        const url = `${FRED_URL}&series_id=${series}&file_type=json`;
        const response = await axios.get<FredResponse>(url);

        let observations = response.data.observations.map((obs) => ({
          date: new Date(obs.date).getTime(),
          dateStr: obs.date, // Keep string for filtering
          value: parseFloat(obs.value),
        })).filter(obs => !isNaN(obs.value));

        // Local filtering
        if (startStr) {
          observations = observations.filter(obs => obs.dateStr >= startStr);
        }
        if (endStr) {
          observations = observations.filter(obs => obs.dateStr <= endStr);
        }

        return {
          series,
          observations,
        };
      },
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const chartOptions = useMemo(() => {
    const seriesData = results
      .map((result) => {
        if (!result.data) return null;
        return {
          name: result.data.series,
          data: result.data.observations.map((obs) => [obs.date, obs.value]),
          marker: { enabled: false },
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return {
      chart: {
        type: "line",
        zoomType: "x",
      },
      title: {
        text: "Foreign Exchange Rates (FRED)",
      },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
      },
      yAxis: {
        title: { text: "Exchange Rate" },
      },
      tooltip: {
        shared: true,
        xDateFormat: "%Y-%m-%d",
      },
      series: seriesData,
      credits: { enabled: false },
    };
  }, [results]);

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
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default FXRatesLineChart;
