import React, { useMemo, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Chip,
  Alert,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs from "dayjs";
import {
  useYieldSpreadData,
  SpreadObservation,
} from "./hooks/useYieldSpreadData";

type ViewMode = "combined" | "spread" | "yields";

const COLOR_10Y = "#2563eb"; // Blue
const COLOR_2Y = "#f59e0b"; // Amber
const COLOR_SPREAD_POS = "#10b981"; // Green
const COLOR_SPREAD_NEG = "#ef4444"; // Red

interface ExtendedPointerEvent extends Highcharts.PointerEventObject {
  xAxis?: { value: number }[];
}

const YieldSpreadChart: React.FC = () => {
  const { data, isLoading, isError } = useYieldSpreadData();
  const [viewMode, setViewMode] = useState<ViewMode>("combined");
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

  const obsMap = useMemo(() => {
    const map = new Map<number, SpreadObservation>();
    if (data?.observations) {
      for (const obs of data.observations) {
        map.set(obs.date, obs);
      }
    }
    return map;
  }, [data?.observations]);

  const chartOptions: Highcharts.Options | null = useMemo(() => {
    if (!data || !data.observations || data.observations.length === 0)
      return null;

    const obs = data.observations;
    const series10Y: [number, number][] = obs.map((o) => [o.date, o.dgs10]);
    const series2Y: [number, number][] = obs.map((o) => [o.date, o.dgs2]);
    const seriesSpread: [number, number][] = obs.map((o) => [o.date, o.spread]);

    // Build series configuration according to active view mode
    let seriesList: Highcharts.SeriesOptionsType[] = [];
    let yAxisConfig: Highcharts.YAxisOptions | Highcharts.YAxisOptions[];

    if (viewMode === "combined") {
      yAxisConfig = [
        {
          title: { text: "Treasury Yield (%)" },
          labels: { format: "{value}%" },
          gridLineWidth: 1,
        },
        {
          title: { text: "10Y - 2Y Spread (%)" },
          labels: { format: "{value}%" },
          opposite: true,
          gridLineWidth: 0,
          plotLines: [
            {
              value: 0,
              color: COLOR_SPREAD_NEG,
              width: 1.5,
              dashStyle: "Dash",
              zIndex: 3,
              label: {
                text: "0.00% (Inversion)",
                align: "right",
                style: { color: COLOR_SPREAD_NEG, fontSize: "10px" },
              },
            },
          ],
        },
      ];

      seriesList = [
        {
          type: "line",
          name: "10-Year Treasury Yield",
          data: series10Y,
          color: COLOR_10Y,
          yAxis: 0,
          lineWidth: 2,
          marker: { enabled: false },
        },
        {
          type: "line",
          name: "2-Year Treasury Yield",
          data: series2Y,
          color: COLOR_2Y,
          yAxis: 0,
          lineWidth: 2,
          marker: { enabled: false },
        },
        {
          type: "area",
          name: "10Y - 2Y Spread",
          data: seriesSpread,
          yAxis: 1,
          threshold: 0,
          lineWidth: 1.5,
          zones: [
            {
              value: 0,
              color: COLOR_SPREAD_NEG,
              fillColor: "rgba(239, 68, 68, 0.2)",
            },
            {
              color: COLOR_SPREAD_POS,
              fillColor: "rgba(16, 185, 129, 0.2)",
            },
          ],
          marker: { enabled: false },
        },
      ];
    } else if (viewMode === "spread") {
      yAxisConfig = {
        title: { text: "10Y - 2Y Yield Spread (%)" },
        labels: { format: "{value}%" },
        plotLines: [
          {
            value: 0,
            color: COLOR_SPREAD_NEG,
            width: 2,
            dashStyle: "Dash",
            zIndex: 4,
            label: {
              text: "0.00% (Yield Curve Inversion Threshold)",
              align: "right",
              style: {
                color: COLOR_SPREAD_NEG,
                fontWeight: "bold",
                fontSize: "11px",
              },
            },
          },
        ],
      };

      seriesList = [
        {
          type: "area",
          name: "10Y - 2Y Spread",
          data: seriesSpread,
          threshold: 0,
          lineWidth: 2,
          zones: [
            {
              value: 0,
              color: COLOR_SPREAD_NEG,
              fillColor: "rgba(239, 68, 68, 0.25)",
            },
            {
              color: COLOR_SPREAD_POS,
              fillColor: "rgba(16, 185, 129, 0.25)",
            },
          ],
          marker: { enabled: false },
        },
      ];
    } else {
      // viewMode === "yields"
      yAxisConfig = {
        title: { text: "Treasury Yield (%)" },
        labels: { format: "{value}%" },
      };

      seriesList = [
        {
          type: "line",
          name: "10-Year Treasury Yield",
          data: series10Y,
          color: COLOR_10Y,
          lineWidth: 2,
          marker: { enabled: false },
        },
        {
          type: "line",
          name: "2-Year Treasury Yield",
          data: series2Y,
          color: COLOR_2Y,
          lineWidth: 2,
          marker: { enabled: false },
        },
      ];
    }

    return {
      chart: {
        height: 520,
        zooming: {
          type: "x",
          mouseWheel: { enabled: true },
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
        text: "2-Year vs 10-Year Treasury Yield & Spread (10Y - 2Y)",
      },
      subtitle: {
        useHTML: true,
        text: [
          data.updatedAt
            ? `Source: FRED • Last updated: ${dayjs(data.updatedAt).format("MMM D, YYYY")}`
            : "Source: FRED",
          '<span style="color: #64748b; font-size: 0.85em; display: block; margin-top: 4px;">Click on any date to inspect rates • Drag to zoom • Hold Shift to pan</span>',
        ].join("<br/>"),
      },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
      },
      yAxis: yAxisConfig,
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
        useHTML: true,
        formatter: function (this: Highcharts.Point) {
          const timestamp = typeof this.x === "number" ? this.x : 0;
          const obsData = obsMap.get(timestamp);
          const dateStr = dayjs(timestamp).format("dddd, MMM D, YYYY");

          let html = `<div style="padding: 4px 6px; font-family: sans-serif; font-size: 12px; min-width: 220px;">`;
          html += `<div style="font-weight: bold; margin-bottom: 6px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">${dateStr}</div>`;

          if (obsData) {
            const spreadSign = obsData.spread > 0 ? "+" : "";
            const statusColor = obsData.isInverted ? "#ef4444" : "#10b981";
            const statusLabel = obsData.isInverted
              ? "⚠️ INVERTED CURVE"
              : "✅ NORMAL CURVE";

            html += `<div style="margin-bottom: 4px; display: flex; justify-content: space-between;">`;
            html += `<span style="color: ${COLOR_10Y}; font-weight: 600;">● 10-Year Yield:</span>`;
            html += `<strong>${obsData.dgs10.toFixed(2)}%</strong>`;
            html += `</div>`;

            html += `<div style="margin-bottom: 4px; display: flex; justify-content: space-between;">`;
            html += `<span style="color: ${COLOR_2Y}; font-weight: 600;">● 2-Year Yield:</span>`;
            html += `<strong>${obsData.dgs2.toFixed(2)}%</strong>`;
            html += `</div>`;

            html += `<div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between;">`;
            html += `<span><strong>10Y - 2Y Spread:</strong></span>`;
            html += `<span style="color: ${statusColor}; font-weight: bold;">${spreadSign}${obsData.spread.toFixed(2)}% (${spreadSign}${obsData.spreadBps} bps)</span>`;
            html += `</div>`;

            html += `<div style="margin-top: 4px; font-size: 11px; color: ${statusColor}; font-weight: bold; text-align: right;">`;
            html += `${statusLabel}`;
            html += `</div>`;
          } else if (this.points) {
            for (const p of this.points) {
              const yVal = typeof p.y === "number" ? p.y.toFixed(2) : "--";
              html += `<div style="margin-bottom: 2px;"><span style="color:${p.color}">●</span> ${p.series.name}: <strong>${yVal}%</strong></div>`;
            }
          }

          html += `</div>`;
          return html;
        },
      },
      series: seriesList,
      credits: { enabled: false },
    };
  }, [data, viewMode, obsMap]);

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
          Error loading 2Y vs 10Y yield data.
        </Typography>
      </Box>
    );
  }

  const stats = data?.stats;

  return (
    <Box ref={containerRef} sx={{ width: "100%", p: 1 }}>
      {/* Top Header & View Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            2-Year vs 10-Year Treasury Yield Spread
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Benchmark 2Y vs 10Y curve slope and yield curve inversion tracking
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          size="small"
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          aria-label="yield spread view mode"
        >
          <ToggleButton
            value="combined"
            sx={{ textTransform: "none", px: 1.5 }}
          >
            <ShowChartIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Yields & Spread
          </ToggleButton>
          <ToggleButton value="spread" sx={{ textTransform: "none", px: 1.5 }}>
            <TimelineIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Spread (10Y - 2Y)
          </ToggleButton>
          <ToggleButton value="yields" sx={{ textTransform: "none", px: 1.5 }}>
            <CompareArrowsIcon sx={{ fontSize: 18, mr: 0.5 }} />
            2Y vs 10Y Yields
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Summary KPI Cards */}
      {stats && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}
        >
          <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">
                Latest 10Y Yield
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: COLOR_10Y }}
              >
                {stats.latestDgs10.toFixed(2)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.latestDate}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">
                Latest 2Y Yield
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: COLOR_2Y }}
              >
                {stats.latestDgs2.toFixed(2)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.latestDate}
              </Typography>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              flex: 1.2,
              minWidth: 180,
              borderColor: stats.isCurrentlyInverted
                ? "error.main"
                : "success.main",
              backgroundColor: stats.isCurrentlyInverted
                ? "rgba(239, 68, 68, 0.04)"
                : "rgba(16, 185, 129, 0.04)",
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="caption" color="text.secondary">
                  Current Spread (10Y - 2Y)
                </Typography>
                <Chip
                  size="small"
                  icon={
                    stats.isCurrentlyInverted ? (
                      <WarningAmberIcon fontSize="small" />
                    ) : (
                      <CheckCircleOutlineIcon fontSize="small" />
                    )
                  }
                  label={stats.isCurrentlyInverted ? "Inverted" : "Normal"}
                  color={stats.isCurrentlyInverted ? "error" : "success"}
                  sx={{ height: 20, fontSize: "0.72rem", fontWeight: "bold" }}
                />
              </Stack>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: stats.isCurrentlyInverted
                    ? COLOR_SPREAD_NEG
                    : COLOR_SPREAD_POS,
                }}
              >
                {stats.latestSpread > 0 ? "+" : ""}
                {stats.latestSpread.toFixed(2)}% (
                {stats.latestSpread > 0 ? "+" : ""}
                {stats.latestSpreadBps} bps)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Slope:{" "}
                {stats.isCurrentlyInverted
                  ? "Downward (Inverted)"
                  : "Upward (Normal)"}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ flex: 1.2, minWidth: 180 }}>
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">
                Inversion Days in Range
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats.invertedDays.toLocaleString()} /{" "}
                {stats.totalDays.toLocaleString()} days
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.invertedPercentage}% of selected period
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ flex: 1.2, minWidth: 180 }}>
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">
                Period Extremes (Min / Max / Avg)
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                Min:{" "}
                <span style={{ color: COLOR_SPREAD_NEG }}>
                  {stats.minSpread.toFixed(2)}%
                </span>{" "}
                ({stats.minSpreadDate})
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Max:{" "}
                <span style={{ color: COLOR_SPREAD_POS }}>
                  +{stats.maxSpread.toFixed(2)}%
                </span>{" "}
                ({stats.maxSpreadDate})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Period Average Spread: {stats.avgSpread > 0 ? "+" : ""}
                {stats.avgSpread.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Main Highcharts Graph */}
      {chartOptions && (
        <HighchartsReact
          ref={chartComponentRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      )}

      {/* Educational Note */}
      <Alert severity="info" sx={{ mt: 2, fontSize: "0.85rem" }}>
        <strong>Why is 2Y vs 10Y important?</strong> Under normal economic
        conditions, the 10-Year yield is higher than the 2-Year yield because
        investors demand a term premium for locking in capital longer. When the
        spread drops below 0.00% (Yield Curve Inversion), short-term yields
        exceed long-term yields, which has historically been a reliable leading
        indicator of economic slowdowns and Federal Reserve easing cycles.
      </Alert>
    </Box>
  );
};

export default YieldSpreadChart;
