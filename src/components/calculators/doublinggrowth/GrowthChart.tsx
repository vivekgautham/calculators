import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box } from "@mui/material";
import { useDoublingGrowth, formatLargeNumber } from "./DoublingGrowthContext";

export const GrowthChart: React.FC = () => {
  const {
    visibleTimeSeries,
    fullTimeSeries,
    scaleType,
    timeUnit,
    growthFactor,
  } = useDoublingGrowth();

  const chartOptions = useMemo(() => {
    const categories = fullTimeSeries.map((d) => `t = ${d.time}`);
    const dataPoints = visibleTimeSeries.map((d) => d.value);

    return {
      chart: {
        type: "area",
        spacingLeft: 15,
        spacingRight: 20,
        spacingTop: 20,
        spacingBottom: 15,
        backgroundColor: "#ffffff",
        height: 460,
        animation: {
          duration: 300,
        },
      },
      title: {
        text: `Live Exponential Growth Trajectory (${growthFactor === 2 ? "Doubling" : `${growthFactor}x Factor`})`,
        style: {
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1e293b",
        },
      },
      subtitle: {
        text: `Plotted on ${scaleType === "logarithmic" ? "Logarithmic (log₁₀)" : "Linear"} Scale`,
        style: {
          color: "#64748b",
          fontSize: "12px",
        },
      },
      xAxis: {
        categories: categories.length > 0 ? categories : ["0"],
        title: {
          text: "Time",
          style: { color: "#64748b", fontWeight: "bold" },
        },
        labels: { style: { color: "#475569" } },
        crosshair: true,
      },
      yAxis: {
        type: scaleType === "logarithmic" ? "logarithmic" : "linear",
        title: {
          text: `Value / Units (${timeUnit || "Units"})`,
          style: { color: "#00b5ad", fontWeight: "bold" },
        },
        labels: {
          style: { color: "#475569" },
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            return formatLargeNumber(this.value as number);
          },
        },
        gridLineColor: "#f1f5f9",
        minorTickInterval: scaleType === "logarithmic" ? "auto" : undefined,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        borderWidth: 1,
        style: { color: "#1e293b" },
        formatter: function (this: any) {
          const point = this.point;
          const idx = point.index ?? 0;
          const stepData = visibleTimeSeries[idx];
          if (!stepData) return "";

          return `
            <div style="padding: 6px;">
              <span style="font-size: 11px; color: #64748b;">Time: <b>${stepData.timeLabel}</b> (Step ${stepData.step})</span><br/>
              <span style="color: #2e7d32; font-size: 14px; font-weight: bold;">Value: ${stepData.formattedValue} ${timeUnit}</span><br/>
              <span style="color: #0284c7; font-size: 11px;">Growth Factor: <b>${stepData.growthFactorFromStart.toLocaleString(
                undefined,
                { maximumFractionDigits: 1 },
              )}x</b> original</span><br/>
              ${
                stepData.incrementalChange > 0
                  ? `<span style="color: #d97706; font-size: 11px;">Added in step: +${formatLargeNumber(
                      stepData.incrementalChange,
                    )} ${timeUnit}</span>`
                  : ""
              }
            </div>
          `;
        },
      },
      plotOptions: {
        area: {
          marker: { enabled: true, radius: 4 },
          lineWidth: 3,
        },
      },
      series: [
        {
          name: `Growth (${timeUnit})`,
          data: dataPoints,
          color: "#00b5ad",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(0, 181, 173, 0.4)"],
              [1, "rgba(0, 181, 173, 0.02)"],
            ],
          },
        },
      ],
      credits: { enabled: false },
    };
  }, [visibleTimeSeries, fullTimeSeries, scaleType, timeUnit, growthFactor]);

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

export default GrowthChart;
