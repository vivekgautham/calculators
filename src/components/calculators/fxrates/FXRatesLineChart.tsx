import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { AVAILABLE_COLORS } from "../rateofgrowth/RateOfGrowthContext";
import { useFXRatesData } from "./hooks/useFXRatesData";

const FXRatesLineChart: React.FC = () => {
  const results = useFXRatesData();

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
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
            series: [
              {
                name: result.data.series.name,
                data: result.data.observations.map((obs) => [
                  obs.date,
                  obs.value,
                ]),
                marker: { enabled: false },
                type: "line",
                color: color,
              },
            ],
            credits: { enabled: false },
            legend: { enabled: false },
          };

          return (
            <Box key={result.data.series.id} sx={{ width: "100%" }}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default FXRatesLineChart;
