import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box } from "@mui/material";
import { useOrderBook } from "./OrderBookContext";

export const PriceHistoryChart: React.FC = () => {
  const { priceHistory } = useOrderBook();

  const chartOptions = useMemo(() => {
    const categories = priceHistory.map((p) => p.timeLabel);
    const priceData = priceHistory.map((p) => p.price);
    const volumeData = priceHistory.map((p) => p.volume);

    return {
      chart: {
        spacingLeft: 15,
        spacingRight: 15,
        spacingTop: 15,
        spacingBottom: 15,
        backgroundColor: "#1e293b",
        height: 520,
      },
      title: {
        text: "Price & Execution Timeline",
        style: {
          fontWeight: "bold",
          fontSize: "15px",
          color: "#f8fafc",
        },
      },
      subtitle: {
        text: "Real-time Last Traded Price (LTP) and Trade Volume",
        style: {
          color: "#94a3b8",
          fontSize: "12px",
        },
      },
      xAxis: {
        categories: categories.length > 0 ? categories : ["Start"],
        labels: { style: { color: "#cbd5e1" } },
        crosshair: true,
      },
      yAxis: [
        {
          title: { text: "Price ($)", style: { color: "#00b5ad" } },
          labels: { style: { color: "#00b5ad" } },
          gridLineColor: "#334155",
          opposite: false,
        },
        {
          title: { text: "Volume", style: { color: "#ffd54f" } },
          labels: { style: { color: "#ffd54f" } },
          gridLineColor: "transparent",
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: "#0f172a",
        style: { color: "#f8fafc" },
      },
      series: [
        {
          name: "LTP Price ($)",
          type: "spline",
          data: priceData,
          color: "#00b5ad",
          yAxis: 0,
          marker: { enabled: true, radius: 3 },
        },
        {
          name: "Traded Volume",
          type: "column",
          data: volumeData,
          color: "rgba(255, 213, 79, 0.4)",
          yAxis: 1,
        },
      ],
      credits: { enabled: false },
    };
  }, [priceHistory]);

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: 2, bgcolor: "#1e293b", height: "100%" }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default PriceHistoryChart;
