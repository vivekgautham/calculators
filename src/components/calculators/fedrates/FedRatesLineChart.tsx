import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useFedRatesData } from "./hooks/useFedRatesData";
import { AVAILABLE_COLORS } from "../rateofgrowth/RateOfGrowthContext";

const FedRatesLineChart: React.FC = () => {
  const { data, isLoading, isError } = useFedRatesData();

  const chartOptions = useMemo(() => {
    if (!data) return null;

    const series = data.map((s, index) => ({
      name: s.type,
      data: s.observations.map((obs) => [obs.date, obs.value]),
      color: AVAILABLE_COLORS[index % AVAILABLE_COLORS.length],
      type: 'line' as const,
      marker: { enabled: false },
    }));

    return {
      chart: {
        type: "line",
        zooming: {
          type: "x",
        },
      },
      title: {
        text: "Federal Reserve Interest Rates",
      },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
      },
      yAxis: {
        title: { text: "Rate (%)" },
      },
      tooltip: {
        shared: true,
        xDateFormat: "%Y-%m-%d",
        valueSuffix: "%",
      },
      series: series,
      credits: { enabled: false },
    };
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading Fed rates data. Please try a different date range.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    </Box>
  );
};

export default FedRatesLineChart;
