import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, Stack } from "@mui/material";
import { useStockAnalysis } from "./StockAnalysisContext";
import dayjs from "dayjs";

const StockChart: React.FC = () => {
  const { data, fileName } = useStockAnalysis();

  const maxPoint = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, p) => (p.close > max.close ? p : max), data[0]);
  }, [data]);

  const minPoint = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((min, p) => (p.close < min.close ? p : min), data[0]);
  }, [data]);

  const chartOptions = useMemo(() => {
    if (data.length === 0) return null;

    const closeData = data.map((d) => [d.date, d.close]);
    const highData = data.map((d) => [d.date, d.high]);
    const lowData = data.map((d) => [d.date, d.low]);

    return {
      chart: {
        type: "line",
        zooming: {
          type: "x",
        },
      },
      title: {
        text: `Price History: ${fileName}`,
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text: "Price",
        },
        labels: {
          format: "${value}",
        },
      },
      tooltip: {
        shared: true,
        xDateFormat: "%b %e, %Y",
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
          name: "Close",
          data: closeData,
          color: "#2E86C1",
          lineWidth: 2,
        },
        {
          name: "High during the period",
          type: "scatter",
          data: maxPoint ? [[maxPoint.date, maxPoint.close]] : [],
          color: "#FFD700",
          marker: {
            enabled: true,
            symbol: "circle",
            radius: 8,
            lineWidth: 2,
            lineColor: "#B8860B",
          },
          tooltip: {
            pointFormat: "<b>High during the period: ${point.y:,.2f}</b><br/>",
          },
          zIndex: 5,
        },
        {
          name: "Low during the period",
          type: "scatter",
          data: minPoint ? [[minPoint.date, minPoint.close]] : [],
          color: "#C70039",
          marker: {
            enabled: true,
            symbol: "circle",
            radius: 8,
            lineWidth: 2,
            lineColor: "#7B0024",
          },
          tooltip: {
            pointFormat: "<b>Low during the period: ${point.y:,.2f}</b><br/>",
          },
          zIndex: 5,
        },
        {
          name: "High",
          data: highData,
          color: "#28B463",
          dashStyle: "Dash",
          lineWidth: 1,
          marker: {
            enabled: false,
            symbol: "triangle",
          },
          visible: false, // Default hidden to avoid clutter
        },
        {
          name: "Low",
          data: lowData,
          color: "#C70039",
          dashStyle: "Dash",
          lineWidth: 1,
          marker: {
            enabled: false,
            symbol: "triangle-down",
          },
          visible: false, // Default hidden to avoid clutter
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [data, fileName, maxPoint, minPoint]);

  if (data.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px dashed #ccc",
          borderRadius: 2,
        }}
      >
        <Typography color="textSecondary">
          No data to display. Please upload a CSV file.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
        {maxPoint && (
          <Box
            sx={{
              flex: 1,
              p: 2,
              bgcolor: "rgba(255, 215, 0, 0.1)",
              borderRadius: 1,
              border: "1px solid #FFD700",
            }}
          >
            <Typography variant="h6" color="primary">
              High during the period
            </Typography>
            <Typography variant="body1">
              The high closing price of{" "}
              <b>
                $
                {maxPoint.close.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </b>{" "}
              was reached on{" "}
              <b>{dayjs(maxPoint.date).format("MMMM D, YYYY")}</b>.
            </Typography>
          </Box>
        )}

        {minPoint && (
          <Box
            sx={{
              flex: 1,
              p: 2,
              bgcolor: "rgba(199, 0, 57, 0.1)",
              borderRadius: 1,
              border: "1px solid #C70039",
            }}
          >
            <Typography variant="h6" color="error">
              Low during the period
            </Typography>
            <Typography variant="body1">
              The low closing price of{" "}
              <b>
                $
                {minPoint.close.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </b>{" "}
              was reached on{" "}
              <b>{dayjs(minPoint.date).format("MMMM D, YYYY")}</b>.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default StockChart;
