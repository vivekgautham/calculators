import React, { useMemo, useState, useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { AVAILABLE_COLORS } from "../rateofgrowth/RateOfGrowthContext";
import { useFXRatesData } from "./hooks/useFXRatesData";
import dayjs from "dayjs";

interface ExtendedPointerEvent extends Highcharts.PointerEventObject {
  xAxis?: { value: number }[];
}

const FXRatesLineChart: React.FC = () => {
  const { data, isLoading, isError } = useFXRatesData();
  const [chartMode, setChartMode] = useState<"normalized" | "individual">(
    "normalized",
  );

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

  const normalizedOptions: Highcharts.Options | null = useMemo(() => {
    if (!data || !data.seriesList || data.seriesList.length === 0) return null;

    const series = data.seriesList.map((item, index) => {
      const initialValue =
        item.observations.length > 0 ? item.observations[0].value : 1;
      const normalizedData: [number, number][] = item.observations.map((obs) => [
        obs.date,
        parseFloat(
          (((obs.value - initialValue) / initialValue) * 100).toFixed(2),
        ),
      ]);

      return {
        name: `${item.series.code} (${item.series.currencyName})`,
        data: normalizedData,
        color: AVAILABLE_COLORS[index % AVAILABLE_COLORS.length],
        type: "line" as const,
        marker: { enabled: false },
      };
    });

    return {
      chart: {
        type: "line",
        height: 550,
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
          load: function (this: Highcharts.Chart) {
            if (this.pointer) {
              const ptr = this.pointer as unknown as {
                runPointActions?: () => undefined;
                reset?: () => undefined;
              };
              ptr.runPointActions = () => undefined;
              ptr.reset = () => undefined;
            }
          },
          click: function (
            this: Highcharts.Chart,
            e: Highcharts.PointerEventObject,
          ) {
            const extEvent = e as ExtendedPointerEvent;
            if (!extEvent.xAxis || !extEvent.xAxis[0]) {
              this.tooltip?.hide();
              return;
            }
            const clickedX = extEvent.xAxis[0].value;
            const points: Highcharts.Point[] = [];
            this.series.forEach((s) => {
              if (!s.visible || !s.points || s.points.length === 0) return;
              let closest: Highcharts.Point | null = null;
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
              this.tooltip.refresh(points);
            } else {
              this.tooltip?.hide();
            }
          },
        },
      },
      title: {
        text: "Exchange Rate Performance (% Change vs USD)",
      },
      subtitle: {
        useHTML: true,
        text: [
          data.updatedAt
            ? `Source: Federal Reserve Economic Data (FRED) • Last updated: ${dayjs(data.updatedAt).format("MMM D, YYYY")}`
            : "Source: Federal Reserve Economic Data (FRED)",
          '<span style="color: #64748b; font-size: 0.85em; display: block; margin-top: 4px;">Positive % indicates USD strengthened (foreign currency depreciated) • Click on any date to inspect rates • Drag to zoom • Hold Shift to pan</span>',
        ].join("<br/>"),
      },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
      },
      yAxis: {
        title: { text: "% Change from Start Date" },
        labels: {
          format: "{value}%",
        },
        plotLines: [
          {
            value: 0,
            color: "#94a3b8",
            width: 1.5,
            dashStyle: "Dash",
          },
        ],
      },
      plotOptions: {
        series: {
          stickyTracking: false,
          point: {
            events: {
              click: function (this: Highcharts.Point) {
                const chart = this.series.chart;
                const xVal = this.x;
                const points: Highcharts.Point[] = [];
                chart.series.forEach((s) => {
                  if (!s.visible || !s.points) return;
                  const p = s.points.find((pt) => pt.x === xVal);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Error loading exchange rate data from FRED. Please try again.
        </Typography>
      </Box>
    );
  }

  if (!data?.seriesList || data.seriesList.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No currencies selected. Please choose one or more currencies from the
          selector above.
        </Typography>
      </Box>
    );
  }

  return (
    <Box ref={containerRef} sx={{ width: "100%", p: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" component="div">
          Charts & Visualizations
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={chartMode}
          exclusive
          onChange={(_, newMode) => newMode && setChartMode(newMode)}
          aria-label="chart display mode"
        >
          <ToggleButton value="normalized">
            Comparative (% Change)
          </ToggleButton>
          <ToggleButton value="individual">
            Individual Spot Rates
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {chartMode === "normalized" ? (
        normalizedOptions && (
          <HighchartsReact
            ref={chartComponentRef}
            highcharts={Highcharts}
            options={normalizedOptions}
          />
        )
      ) : (
        <Stack spacing={3}>
          {data.seriesList.map((item, index) => {
            const color = AVAILABLE_COLORS[index % AVAILABLE_COLORS.length];

            const options: Highcharts.Options = {
              chart: {
                type: "line",
                zooming: {
                  type: "x",
                },
                height: 320,
              },
              title: {
                text: `${item.series.code} (${item.series.currencyName}) Spot Rate`,
              },
              xAxis: {
                type: "datetime",
                title: { text: "Date" },
              },
              yAxis: {
                title: { text: `${item.series.code} Exchange Rate` },
              },
              tooltip: {
                xDateFormat: "%Y-%m-%d",
                valueDecimals: 4,
              },
              series: [
                {
                  name: item.series.code,
                  data: item.observations.map((obs) => [obs.date, obs.value]),
                  marker: { enabled: false },
                  type: "line",
                  color: color,
                },
              ],
              credits: { enabled: false },
              legend: { enabled: false },
            };

            return (
              <Box
                key={item.series.id}
                sx={{
                  width: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <HighchartsReact highcharts={Highcharts} options={options} />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default FXRatesLineChart;
