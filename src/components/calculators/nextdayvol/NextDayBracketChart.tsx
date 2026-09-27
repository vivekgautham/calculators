import React, { useMemo } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import {
  Paper,
  Box,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNextDayVol } from "./NextDayVolContext";
import { formatCurrency, formatNumber } from "./calculations";

// Safely initialize highcharts-more for columnrange and errorbar
if (typeof window !== "undefined") {
  try {
    const moreFn =
      typeof highchartsMore === "function"
        ? highchartsMore
        : (
            highchartsMore as unknown as {
              default?: (hc: typeof Highcharts) => void;
            }
          )?.default;
    if (typeof moreFn === "function") {
      moreFn(Highcharts);
    }
  } catch (e) {
    console.warn("HighchartsMore initialization warning:", e);
  }
}

export const NextDayBracketChart: React.FC = () => {
  const { spotPrice, vix, result } = useNextDayVol();

  const chartOptions: Highcharts.Options = useMemo(() => {
    const {
      sigma1Lower,
      sigma1Upper,
      sigma2Lower,
      sigma2Upper,
      expectedMoveDollars,
      dailyVolPercent,
    } = result;

    const yMin = Math.floor(sigma2Lower - expectedMoveDollars * 0.4);
    const yMax = Math.ceil(sigma2Upper + expectedMoveDollars * 0.4);

    return {
      chart: {
        type: "columnrange",
        height: 520,
        backgroundColor: "transparent",
        spacing: [25, 25, 20, 25],
        style: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: [
          "Current Close (Spot)",
          "Next Trading Day (Expected Bracket)",
        ],
        crosshair: false,
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: "700",
            color: "#1e293b",
          },
        },
        lineColor: "#cbd5e1",
        tickLength: 0,
      },
      yAxis: {
        title: {
          text: "S&P 500 Index Level ($)",
          style: {
            color: "#64748b",
            fontSize: "12px",
            fontWeight: "600",
          },
        },
        min: yMin,
        max: yMax,
        gridLineColor: "#f1f5f9",
        gridLineDashStyle: "Dash",
        labels: {
          formatter: function () {
            return formatNumber(this.value as number, 0);
          },
          style: {
            color: "#64748b",
            fontSize: "12px",
            fontWeight: "500",
          },
        },
        plotLines: [
          {
            value: spotPrice,
            color: "#0f172a",
            width: 2,
            dashStyle: "Solid",
            zIndex: 4,
            label: {
              text: `Spot: ${formatCurrency(spotPrice)}`,
              align: "right",
              style: {
                color: "#0f172a",
                fontWeight: "700",
                fontSize: "12px",
                backgroundColor: "#ffffff",
              },
              x: -10,
              y: -5,
            },
          },
          {
            value: sigma1Upper,
            color: "#0284c7",
            width: 1.5,
            dashStyle: "ShortDash",
            zIndex: 3,
            label: {
              text: `+1σ: ${formatCurrency(sigma1Upper)} (+${dailyVolPercent.toFixed(2)}%)`,
              align: "right",
              style: {
                color: "#0284c7",
                fontWeight: "700",
                fontSize: "11px",
              },
              x: -10,
              y: -4,
            },
          },
          {
            value: sigma1Lower,
            color: "#0284c7",
            width: 1.5,
            dashStyle: "ShortDash",
            zIndex: 3,
            label: {
              text: `-1σ: ${formatCurrency(sigma1Lower)} (-${dailyVolPercent.toFixed(2)}%)`,
              align: "right",
              style: {
                color: "#0284c7",
                fontWeight: "700",
                fontSize: "11px",
              },
              x: -10,
              y: 12,
            },
          },
          {
            value: sigma2Upper,
            color: "#7c3aed",
            width: 1.5,
            dashStyle: "Dot",
            zIndex: 3,
            label: {
              text: `+2σ: ${formatCurrency(sigma2Upper)} (+${(dailyVolPercent * 2).toFixed(2)}%)`,
              align: "right",
              style: {
                color: "#7c3aed",
                fontWeight: "700",
                fontSize: "11px",
              },
              x: -10,
              y: -4,
            },
          },
          {
            value: sigma2Lower,
            color: "#7c3aed",
            width: 1.5,
            dashStyle: "Dot",
            zIndex: 3,
            label: {
              text: `-2σ: ${formatCurrency(sigma2Lower)} (-${(dailyVolPercent * 2).toFixed(2)}%)`,
              align: "right",
              style: {
                color: "#7c3aed",
                fontWeight: "700",
                fontSize: "11px",
              },
              x: -10,
              y: 12,
            },
          },
        ],
      },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "top",
        itemStyle: {
          fontSize: "12px",
          fontWeight: "600",
          color: "#334155",
        },
      },
      tooltip: {
        shared: false,
        useHTML: true,
        formatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ctx = this as any;
          if (ctx.series?.name === "Current Spot") {
            return `
              <div style="padding: 6px; font-size: 13px;">
                <b style="color: #0f172a;">Current S&P 500 Spot</b><br/>
                Price: <b>${formatCurrency(ctx.y)}</b>
              </div>
            `;
          }
          if (ctx.series?.name === "95.4% Extreme Range (±2σ)") {
            const low = ctx.point?.low ?? ctx.y;
            const high = ctx.point?.high ?? ctx.y;
            return `
              <div style="padding: 6px; font-size: 13px;">
                <b style="color: #7c3aed;">95.45% Extreme Volatility Range (±2σ)</b><br/>
                High: <b>${formatCurrency(high)}</b> (+${(dailyVolPercent * 2).toFixed(2)}%)<br/>
                Low: <b>${formatCurrency(low)}</b> (-${(dailyVolPercent * 2).toFixed(2)}%)<br/>
                Spread: <b>${formatCurrency(high - low)}</b>
              </div>
            `;
          }
          if (ctx.series?.name === "68.3% Normal Range (±1σ)") {
            const low = ctx.point?.low ?? ctx.y;
            const high = ctx.point?.high ?? ctx.y;
            return `
              <div style="padding: 6px; font-size: 13px;">
                <b style="color: #0284c7;">68.27% Normal Expected Range (±1σ)</b><br/>
                Expected High: <b>${formatCurrency(high)}</b> (+${dailyVolPercent.toFixed(2)}%)<br/>
                Expected Low: <b>${formatCurrency(low)}</b> (-${dailyVolPercent.toFixed(2)}%)<br/>
                Expected 1-Day Move: <b>±${formatCurrency(expectedMoveDollars)} (±${dailyVolPercent.toFixed(2)}%)</b>
              </div>
            `;
          }
          return `<b>${ctx.series?.name}</b>: ${ctx.y}`;
        },
      },
      series: [
        // 1. Current Spot Point
        {
          type: "scatter",
          name: "Current Spot",
          data: [
            {
              x: 0,
              y: spotPrice,
              dataLabels: {
                enabled: true,
                format: "Spot: ${y:,.2f}",
                style: {
                  fontWeight: "bold",
                  color: "#0f172a",
                  fontSize: "13px",
                  textOutline: "none",
                },
              },
            },
          ],
          color: "#0f172a",
          marker: {
            symbol: "diamond",
            radius: 8,
            fillColor: "#0f172a",
          },
          zIndex: 5,
        } as Highcharts.SeriesScatterOptions,

        // 2. Outer 2-Sigma Error Bar / Bracket
        {
          type: "errorbar",
          name: "95.4% Extreme Range (±2σ)",
          data: [
            null, // Category 0 has no bracket
            [1, sigma2Lower, sigma2Upper],
          ],
          color: "#7c3aed",
          whiskerLength: "50%",
          stemWidth: 2.5,
          whiskerWidth: 3,
          zIndex: 2,
        } as unknown as Highcharts.SeriesOptionsType,

        // 3. Inner 1-Sigma Column Range Pillar
        {
          type: "columnrange",
          name: "68.3% Normal Range (±1σ)",
          data: [
            null, // Category 0 has no pillar
            {
              x: 1,
              low: sigma1Lower,
              high: sigma1Upper,
            },
          ],
          color: "rgba(14, 165, 233, 0.28)",
          borderColor: "#0284c7",
          borderWidth: 2,
          borderRadius: 8,
          pointWidth: 80,
          zIndex: 3,
          dataLabels: {
            enabled: true,
            formatter: function () {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const ctx = this as any;
              const point = ctx.point;
              if (ctx.y === point?.high) {
                return `+1σ: ${formatNumber(point.high, 2)}`;
              }
              if (ctx.y === point?.low) {
                return `-1σ: ${formatNumber(point.low, 2)}`;
              }
              return "";
            },
            style: {
              fontSize: "12px",
              fontWeight: "700",
              color: "#0369a1",
              textOutline: "none",
            },
          },
        } as unknown as Highcharts.SeriesOptionsType,

        // 4. Baseline connector across Next Day bracket
        {
          type: "scatter",
          name: "Baseline Mean",
          showInLegend: false,
          data: [
            null,
            {
              x: 1,
              y: spotPrice,
              dataLabels: {
                enabled: true,
                format: "Baseline: ${y:,.2f}",
                style: {
                  fontWeight: "bold",
                  color: "#0f172a",
                  fontSize: "12px",
                  textOutline: "none",
                },
                y: -12,
              },
            },
          ],
          marker: {
            symbol: "circle",
            radius: 5,
            fillColor: "#0f172a",
          },
          zIndex: 6,
        } as Highcharts.SeriesScatterOptions,
      ],
    };
  }, [spotPrice, vix, result]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2.5,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", fontSize: "17px" }}
          >
            Next Trading Day Expected Range Bracket
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Clean probability bracket showing standard 1σ (68.3%) and extreme 2σ
            (95.4%) expected price targets
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label="1σ Bracket = 68.3%"
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: "rgba(14, 165, 233, 0.12)",
              color: "#0284c7",
              border: "1px solid #bae6fd",
            }}
          />
          <Chip
            label="2σ Whisker = 95.5%"
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: "rgba(124, 58, 237, 0.12)",
              color: "#7c3aed",
              border: "1px solid #ddd6fe",
            }}
          />
        </Stack>
      </Stack>

      {/* The Highcharts High/Low Bracket Chart */}
      <Box sx={{ width: "100%", my: 1 }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>

      {/* Reference Statistics Table */}
      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #f1f5f9" }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mb: 1.5,
            textTransform: "uppercase",
            fontSize: "12px",
            letterSpacing: "0.5px",
          }}
        >
          Probability Bracket Breakdown
        </Typography>

        <TableContainer
          component={Box}
          sx={{
            borderRadius: 1.5,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Confidence Level
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Expected Lower Bound
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Expected Upper Bound
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Expected Move Points
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Percentage Move
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Empirical Odds
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ bgcolor: "rgba(14, 165, 233, 0.04)" }}>
                <TableCell sx={{ fontWeight: 700, color: "#0284c7" }}>
                  68.27% (1σ Normal)
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatCurrency(result.sigma1Lower)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatCurrency(result.sigma1Upper)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#0284c7" }}>
                  ±{formatCurrency(result.expectedMoveDollars)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#0284c7" }}>
                  ±{formatNumber(result.dailyVolPercent, 2)}%
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "12px" }}>
                  ~2 in 3 trading days
                </TableCell>
              </TableRow>

              <TableRow sx={{ bgcolor: "rgba(124, 58, 237, 0.04)" }}>
                <TableCell sx={{ fontWeight: 700, color: "#7c3aed" }}>
                  95.45% (2σ Extreme)
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatCurrency(result.sigma2Lower)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatCurrency(result.sigma2Upper)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#7c3aed" }}>
                  ±{formatCurrency(result.expectedMoveDollars * 2)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#7c3aed" }}>
                  ±{formatNumber(result.dailyVolPercent * 2, 2)}%
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "12px" }}>
                  ~19 in 20 trading days
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  99.73% (3σ Tail Event)
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {formatCurrency(result.sigma3Lower)}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {formatCurrency(result.sigma3Upper)}
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#475569" }}>
                  ±{formatCurrency(result.expectedMoveDollars * 3)}
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#475569" }}>
                  ±{formatNumber(result.dailyVolPercent * 3, 2)}%
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "12px" }}>
                  ~369 in 370 trading days
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default NextDayBracketChart;
