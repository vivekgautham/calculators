import React, { useMemo, useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useFedRatesData } from "./hooks/useFedRatesData";
import { AVAILABLE_COLORS } from "../rateofgrowth/RateOfGrowthContext";
import dayjs from "dayjs";

const FedRatesLineChart: React.FC = () => {
  const { data, isLoading, isError } = useFedRatesData();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        chartComponentRef.current?.chart?.tooltip?.hide();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        chartComponentRef.current?.chart?.tooltip?.hide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chartOptions: Highcharts.Options | null = useMemo(() => {
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
        events: {
          load: function () {
            const chart = this as any;
            if (chart.pointer) {
              // Disable hover tooltip trigger on pointer movement
              chart.pointer.runPointActions = function () {
                return undefined;
              };
              chart.pointer.reset = function () {
                return undefined;
              };
            }
          },
          click: function (e: any) {
            const chart = this as any;
            if (!e.xAxis || !e.xAxis[0]) {
              chart.tooltip?.hide();
              return;
            }
            const clickedX = e.xAxis[0].value;
            const points: any[] = [];
            chart.series.forEach((s: any) => {
              if (!s.visible || !s.points || s.points.length === 0) return;
              let closest: any = null;
              let minDiff = Infinity;
              for (const p of s.points) {
                const diff = Math.abs(p.x - clickedX);
                if (diff < minDiff) {
                  minDiff = diff;
                  closest = p;
                }
              }
              if (closest) points.push(closest);
            });
            if (points.length > 0) {
              chart.tooltip.refresh(points);
            } else {
              chart.tooltip?.hide();
            }
          },
        },
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
          '<span style="color: #64748b; font-size: 0.85em; display: block; margin-top: 4px;">Click on any date to inspect rates (Esc or click outside to dismiss) • Drag on chart to zoom • Hold Shift to pan</span>',
        ].join("<br/>"),
      },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
      },
      yAxis: {
        title: { text: "Rate (%)" },
      },
      plotOptions: {
        series: {
          stickyTracking: false,
          point: {
            events: {
              click: function () {
                const point = this as any;
                const chart = point.series.chart;
                const xVal = point.x;
                const points: any[] = [];
                chart.series.forEach((s: any) => {
                  if (!s.visible || !s.points) return;
                  const p = s.points.find((pt: any) => pt.x === xVal);
                  if (p) points.push(p);
                });
                if (points.length > 0) {
                  chart.tooltip.refresh(points);
                }
              },
            },
          },
        },
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
    <Box ref={containerRef} sx={{ width: "100%" }}>
      {chartOptions && (
        <HighchartsReact
          ref={chartComponentRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      )}
    </Box>
  );
};

export default FedRatesLineChart;
