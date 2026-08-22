import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useFedRatesData } from "./hooks/useFedRatesData";
import { AVAILABLE_COLORS } from "../rateofgrowth/RateOfGrowthContext";
import dayjs from "dayjs";

const FedRatesLineChart: React.FC = () => {
  const { data, isLoading, isError } = useFedRatesData();

  const chartOptions = useMemo(() => {
    if (!data || !data.seriesList || data.seriesList.length === 0) return null;

    const series = data.seriesList.map((s, index) => ({
      name: s.series.name,
      data: s.observations.map((obs) => [obs.date, obs.value]),
      color: AVAILABLE_COLORS[index % AVAILABLE_COLORS.length],
      type: "line" as const,
      marker: { enabled: false },
    }));

    return {
      chart: {
        type: "line",
        height: 650,
        zooming: {
          type: "x",
          mouseWheel: {
            enabled: true,
          },
          pinchType: "x",
        },
        panning: {
          enabled: true,
          type: "x",
        },
        panKey: "shift",
      },
      title: {
        text: "US Treasury Yields & Fed Interest Rates",
      },
      subtitle: {
        useHTML: true,
        text: [
          data.updatedAt
            ? `Source: Federal Reserve Economic Data (FRED) • Last updated: ${dayjs(data.updatedAt).format("MMM D, YYYY")}`
            : "Source: Federal Reserve Economic Data (FRED)",
          '<span style="color: #64748b; font-size: 0.85em; display: block; margin-top: 4px;">Drag on chart or axis to zoom • Hold Shift to pan • Scroll to zoom</span>',
        ].join("<br/>"),
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
        valueDecimals: 2,
      },
      series: series,
      credits: { enabled: false },
    };
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Error loading Fed & Treasury rates data. Please try again.
        </Typography>
      </Box>
    );
  }

  if (!data?.seriesList || data.seriesList.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No series selected. Please choose one or more yields or rates from the
          dropdown above.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {chartOptions && (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </Box>
  );
};

export default FedRatesLineChart;
