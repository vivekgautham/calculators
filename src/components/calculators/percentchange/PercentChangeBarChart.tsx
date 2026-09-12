import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Paper,
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { usePercentChange } from "./PercentChangeContext";

export const PercentChangeBarChart: React.FC = () => {
  const {
    initialValue,
    finalValue,
    totalAbsoluteChange,
    totalPercentChange,
    steps,
    formatCurrency,
    formatPercent,
    showDataLabels,
    setShowDataLabels,
  } = usePercentChange();

  const isUp = totalPercentChange > 0;
  const isDown = totalPercentChange < 0;
  const overlayColor = isUp ? "#16a34a" : isDown ? "#dc2626" : "#0284c7";

  const chartOptions = useMemo<Highcharts.Options>(() => {
    return {
      chart: {
        type: "column",
        backgroundColor: "#ffffff",
        height: 480,
        spacingTop: 25,
        spacingBottom: 20,
        spacingLeft: 20,
        spacingRight: 20,
        animation: {
          duration: 350,
        },
      },
      title: {
        text: undefined,
      },
      xAxis: {
        categories: ["Value"],
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#334155",
          },
        },
        lineColor: "#cbd5e1",
      },
      yAxis: {
        title: {
          text: "Index Value",
          style: {
            color: "#475569",
            fontWeight: "600",
          },
        },
        min: 0,
        gridLineColor: "#f1f5f9",
        gridLineDashStyle: "Dash",
        plotLines: [
          {
            value: initialValue,
            color: "#0284c7",
            dashStyle: "ShortDash",
            width: 2,
            zIndex: 4,
            label: {
              text: `Baseline: ${formatCurrency(initialValue)}`,
              align: "right",
              style: {
                color: "#0284c7",
                fontWeight: "bold",
                fontSize: "12px",
              },
            },
          },
        ],
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ): string {
            return formatCurrency(Number(this.value), 0);
          },
          style: {
            color: "#475569",
          },
        },
      },
      tooltip: {
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        borderRadius: 8,
        shadow: true,
        formatter: function (this: Highcharts.Point): string {
          const sign = totalPercentChange > 0 ? "+" : "";
          const changeColor = isUp ? "#16a34a" : isDown ? "#dc2626" : "#64748b";

          return `
            <div style="padding: 8px; min-width: 210px; font-family: sans-serif;">
              <div style="font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 6px;">
                Value Overview
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 12px; line-height: 1.6;">
                <div><span style="color:#64748b;">Initial Baseline:</span> <b>${formatCurrency(initialValue)}</b></div>
                <div><span style="color:#64748b;">Current Value:</span> <b style="font-size:13px; color:#0f172a;">${formatCurrency(finalValue)}</b></div>
                <div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">
                  <span style="color:#64748b;">Net Percent Change:</span>
                  <b style="color:${changeColor};">${sign}${totalPercentChange.toFixed(2)}% (${totalAbsoluteChange >= 0 ? "+" : ""}${formatCurrency(totalAbsoluteChange)})</b>
                </div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                  Total Changes Applied: <b>${steps.length}</b>
                </div>
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0,
        },
      },
      series: [
        // 1. Initial Baseline Bar (Lighter Background)
        {
          name: "Initial Baseline",
          type: "column",
          data: [Number(initialValue.toFixed(4))],
          color: "rgba(2, 132, 199, 0.15)",
          borderColor: "#0284c7",
          borderWidth: 2,
          borderRadius: 8,
          pointWidth: 160,
          zIndex: 1,
          dataLabels: {
            enabled: showDataLabels && steps.length > 0,
            useHTML: true,
            inside: false,
            formatter: function (this: Highcharts.Point): string {
              return `<div style="text-align:center; font-size:12px; font-weight:600; color:#0284c7;">Initial: ${formatCurrency(initialValue)}</div>`;
            },
          },
        },
        // 2. Current Value Bar (Darker Overlay)
        {
          name: "Current Value",
          type: "column",
          data: [Number(finalValue.toFixed(4))],
          color: overlayColor,
          borderRadius: 8,
          pointWidth: 136,
          zIndex: 2,
          dataLabels: {
            enabled: showDataLabels,
            useHTML: true,
            inside: false,
            formatter: function (this: Highcharts.Point): string {
              if (steps.length === 0) {
                return `<div style="text-align:center; font-size:13px; font-weight:bold; color:#1e293b; margin-bottom: 2px;">
                  ${formatCurrency(finalValue)}
                  <br/>
                  <span style="font-size:11px; color:#0284c7; font-weight:bold;">(Baseline)</span>
                </div>`;
              }
              const sign = totalPercentChange > 0 ? "+" : "";
              const badgeColor = isUp
                ? "#16a34a"
                : isDown
                  ? "#dc2626"
                  : "#0284c7";
              return `<div style="text-align:center; font-size:13px; font-weight:bold; color:#1e293b; margin-bottom: 2px;">
                ${formatCurrency(finalValue)}
                <br/>
                <span style="font-size:11px; color:${badgeColor}; font-weight:bold;">(${sign}${totalPercentChange.toFixed(2)}%)</span>
              </div>`;
            },
          },
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [
    initialValue,
    finalValue,
    totalPercentChange,
    totalAbsoluteChange,
    steps,
    isUp,
    isDown,
    overlayColor,
    showDataLabels,
    formatCurrency,
    formatPercent,
  ]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1e293b" }}
            >
              Percent Change Bar Chart
            </Typography>
            <Chip
              label={
                steps.length === 0
                  ? `${formatCurrency(finalValue)} (Initial)`
                  : `${formatPercent(totalPercentChange, true)} (${formatCurrency(finalValue)})`
              }
              size="small"
              sx={{
                bgcolor: isUp ? "#dcfce7" : isDown ? "#fee2e2" : "#e0f2fe",
                color: isUp ? "#15803d" : isDown ? "#b91c1c" : "#0369a1",
                fontWeight: "bold",
              }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Lighter background represents initial value; darker overlay
            represents current value
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showDataLabels}
              onChange={(e) => setShowDataLabels(e.target.checked)}
            />
          }
          label={
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#475569" }}
            >
              Data Labels
            </Typography>
          }
        />
      </Stack>

      <Box sx={{ width: "100%", height: 480 }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>

      {/* Legend guide bar */}
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        sx={{ mt: 1, pt: 1.5, borderTop: "1px solid #f1f5f9" }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.5,
              bgcolor: "rgba(2, 132, 199, 0.15)",
              border: "2px solid #0284c7",
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#475569", fontWeight: 600 }}
          >
            Initial Baseline ({formatCurrency(initialValue)})
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.5,
              bgcolor: overlayColor,
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#475569", fontWeight: 600 }}
          >
            Current Value ({formatCurrency(finalValue)})
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PercentChangeBarChart;
