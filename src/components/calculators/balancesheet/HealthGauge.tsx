import React, { useMemo } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box, Typography, Stack, Chip } from "@mui/material";
import { useBalanceSheet } from "./BalanceSheetContext";

// Safely initialize Highcharts modules in Vite ESM environment
if (typeof window !== "undefined") {
  try {
    const moreFn =
      typeof highchartsMore === "function"
        ? highchartsMore
        : (highchartsMore as any)?.default;
    if (typeof moreFn === "function") {
      moreFn(Highcharts);
    }
  } catch (e) {
    console.warn("HighchartsMore module load warning:", e);
  }

  try {
    const solidFn =
      typeof solidGauge === "function"
        ? solidGauge
        : (solidGauge as any)?.default;
    if (typeof solidFn === "function") {
      solidFn(Highcharts);
    }
  } catch (e) {
    console.warn("SolidGauge module load warning:", e);
  }
}

export const HealthGauge: React.FC = () => {
  const { overallHealthScore, healthRating } = useBalanceSheet();

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: "solidgauge",
        backgroundColor: "#ffffff",
        height: 260,
      },
      title: {
        text: "Overall Balance Sheet Health Score",
        style: {
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1e293b",
        },
      },
      pane: {
        center: ["50%", "75%"],
        size: "130%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: "#f1f5f9",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },
      tooltip: {
        enabled: false,
      },
      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0.39, "#d32f2f"], // Red: Distressed
          [0.59, "#d97706"], // Yellow/Orange: Moderate Risk
          [0.79, "#0284c7"], // Blue: Healthy
          [1.0, "#2e7d32"], // Green: Fortress
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70,
        },
        labels: {
          y: 16,
          style: {
            color: "#64748b",
            fontSize: "12px",
            fontWeight: "bold",
          },
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -30,
            borderWidth: 0,
            useHTML: true,
            formatter: function (this: any) {
              return `
                <div style="text-align:center;">
                  <span style="font-size:36px; font-weight:bold; color:${healthRating.color};">${this.y}</span>
                  <span style="font-size:16px; color:#64748b;"> / 100</span>
                </div>
              `;
            },
          },
        },
      },
      series: [
        {
          name: "Health Score",
          data: [overallHealthScore],
          dataLabels: {
            enabled: true,
          },
        },
      ],
      credits: { enabled: false },
    };
  }, [overallHealthScore, healthRating]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "100%", height: 260 }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        sx={{ mt: 1 }}
      >
        <Chip
          label={healthRating.label}
          sx={{
            fontWeight: "bold",
            fontSize: "14px",
            bgcolor: healthRating.color,
            color: "#ffffff",
            px: 1,
          }}
        />
      </Stack>

      <Typography
        variant="body2"
        sx={{ color: "#64748b", mt: 1, maxWidth: 600, mx: "auto" }}
      >
        {healthRating.description}
      </Typography>
    </Paper>
  );
};

export default HealthGauge;
