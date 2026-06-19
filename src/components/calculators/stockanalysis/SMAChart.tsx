import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";
import { useStockAnalysis, StockDataPoint } from "./StockAnalysisContext";

const calculateSMA = (data: StockDataPoint[], period: number) => {
  return data
    .map((point, index) => {
      if (index < period - 1) return [point.date, null];
      const slice = data.slice(index - period + 1, index + 1);
      const sum = slice.reduce((acc, p) => acc + p.close, 0);
      return [point.date, parseFloat((sum / period).toFixed(2))];
    })
    .filter((p): p is [number, number] => p[1] !== null);
};

const SMAChart: React.FC = () => {
  const { data, fileName } = useStockAnalysis();

  const chartOptions = useMemo(() => {
    if (data.length === 0) return null;

    const sma20 = calculateSMA(data, 20);
    const sma50 = calculateSMA(data, 50);
    const sma200 = calculateSMA(data, 200);

    return {
      chart: {
        type: "line",
        zooming: {
          type: "x",
        },
      },
      title: {
        text: `Simple Moving Averages (SMA): ${fileName}`,
      },
      subtitle: {
        text: "Trend analysis using 20, 50, and 200 day windows",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text: "Average Price",
        },
        labels: {
          format: "${value}",
        },
      },
      tooltip: {
        shared: true,
        xDateFormat: "%b %e, %Y",
        valuePrefix: "$",
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: "Close Price",
          data: data.map((d) => [d.date, d.close]),
          color: "#A0A0A0", // Darker grey
          lineWidth: 1.5,
          dashStyle: "Solid",
        },
        {
          name: "SMA 20",
          data: sma20,
          color: "#2E86C1", // Blue
          lineWidth: 2,
        },
        {
          name: "SMA 50",
          data: sma50,
          color: "#28B463", // Green
          lineWidth: 2,
        },
        {
          name: "SMA 200",
          data: sma200,
          color: "#8E44AD", // Purple
          lineWidth: 2,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [data, fileName]);

  if (data.length === 0) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      {data.length < 200 && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 1, display: "block", textAlign: "center" }}
        >
          Note: SMA 200 (and possibly SMA 50) may not appear if the data set
          contains fewer than required records.
        </Typography>
      )}
    </Box>
  );
};

export default SMAChart;
