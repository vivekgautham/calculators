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
        backgroundColor: "#ffffff",
        height: 520,
      },
      title: {
        text: "Price & Execution Timeline",
        style: {
          fontWeight: "bold",
          fontSize: "15px",
          color: "#1e293b",
        },
      },
      subtitle: {
        text: "Real-time Last Traded Price (LTP) and Trade Volume",
        style: {
          color: "#64748b",
          fontSize: "12px",
        },
      },
      xAxis: {
        categories: categories.length > 0 ? categories : ["Start"],
        labels: { style: { color: "#475569" } },
        crosshair: true,
      },
      yAxis: [
        {
          title: { text: "Price ($)", style: { color: "#00b5ad" } },
          labels: { style: { color: "#00b5ad" } },
          gridLineColor: "#f1f5f9",
          opposite: false,
        },
        {
          title: { text: "Volume", style: { color: "#d97706" } },
          labels: { style: { color: "#d97706" } },
          gridLineColor: "transparent",
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        borderWidth: 1,
        style: { color: "#1e293b" },
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
          color: "rgba(217, 119, 6, 0.35)",
          yAxis: 1,
        },
      ],
      credits: { enabled: false },
    };
  }, [priceHistory]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "#ffffff",
        height: "100%",
        border: "1px solid #e2e8f0",
      }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default PriceHistoryChart;
