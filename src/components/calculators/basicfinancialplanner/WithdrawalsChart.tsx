import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LayersIcon from "@mui/icons-material/Layers";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useBasicFinancialPlanner } from "./BasicFinancialPlannerContext";

const formatNumber = (value: number): string => {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  let formatted = absoluteValue.toString();
  if (absoluteValue >= 1000000000) {
    formatted = (absoluteValue / 1000000000).toFixed(1) + "B";
  } else if (absoluteValue >= 1000000) {
    formatted = (absoluteValue / 1000000).toFixed(1) + "M";
  } else if (absoluteValue >= 1000) {
    formatted = (absoluteValue / 1000).toFixed(0) + "K";
  } else {
    formatted = absoluteValue.toFixed(0);
  }

  return sign + formatted;
};

const formatCurrency = (val: number): string => {
  return Math.round(val).toLocaleString();
};

interface CustomTooltipContext extends Highcharts.Point {
  points?: Highcharts.Point[];
}

const WithdrawalsChart: React.FC = () => {
  const {
    planData,
    withdrawalTaxRate,
    totalNetExpenses,
    totalTaxes,
    totalWithdrawn,
  } = useBasicFinancialPlanner();

  const [viewType, setViewType] = useState<"annual" | "cumulative">("annual");
  const [layoutType, setLayoutType] = useState<"stacked" | "grouped">(
    "stacked",
  );

  const chartOptions: Highcharts.Options = useMemo(() => {
    // Only withdrawal years (Year 1 to N)
    const withdrawalRows = planData.filter((d) => d.year > 0);
    const categories = withdrawalRows.map((d) => `Yr ${d.year}`);

    let cumNet = 0;
    let cumTax = 0;
    let cumGross = 0;

    const netExpenseData: number[] = [];
    const taxAmountData: number[] = [];
    const grossWithdrawnData: number[] = [];

    for (const row of withdrawalRows) {
      if (viewType === "cumulative") {
        cumNet += row.netExpense;
        cumTax += row.taxAmount;
        cumGross += row.withdrawnAmount;
        netExpenseData.push(Math.round(cumNet));
        taxAmountData.push(Math.round(cumTax));
        grossWithdrawnData.push(Math.round(cumGross));
      } else {
        netExpenseData.push(Math.round(row.netExpense));
        taxAmountData.push(Math.round(row.taxAmount));
        grossWithdrawnData.push(Math.round(row.withdrawnAmount));
      }
    }

    const isStacked = layoutType === "stacked";
    const isCumulative = viewType === "cumulative";

    // In stacked mode: Net Expense + Tax on Withdrawal form stacked columns, with Gross Withdrawn as spline line
    // In grouped mode: All 3 are side-by-side columns
    const series: Highcharts.SeriesOptionsType[] = isStacked
      ? [
          {
            type: "column",
            name: isCumulative
              ? "Cumul. Net Living Expense"
              : "Net Living Expense",
            data: netExpenseData,
            color: "#0284c7",
            stack: "withdrawals",
          },
          {
            type: "column",
            name: isCumulative
              ? "Cumul. Tax on Withdrawal"
              : "Tax on Withdrawal",
            data: taxAmountData,
            color: "#d97706",
            stack: "withdrawals",
          },
          {
            type: "spline",
            name: isCumulative
              ? "Cumul. Gross Withdrawn"
              : "Total Gross Withdrawn",
            data: grossWithdrawnData,
            color: "#0f172a",
            lineWidth: 2.5,
            marker: {
              enabled: true,
              radius: withdrawalRows.length > 25 ? 2.5 : 4,
              symbol: "circle",
              fillColor: "#0f172a",
            },
          },
        ]
      : [
          {
            type: "column",
            name: isCumulative
              ? "Cumul. Net Living Expense"
              : "Net Living Expense",
            data: netExpenseData,
            color: "#0284c7",
          },
          {
            type: "column",
            name: isCumulative
              ? "Cumul. Tax on Withdrawal"
              : "Tax on Withdrawal",
            data: taxAmountData,
            color: "#d97706",
          },
          {
            type: "column",
            name: isCumulative
              ? "Cumul. Gross Withdrawn"
              : "Total Gross Withdrawn",
            data: grossWithdrawnData,
            color: "#334155",
          },
        ];

    return {
      chart: {
        zooming: {
          type: "x",
        },
      },
      title: {
        text: isCumulative
          ? "Cumulative Withdrawals: Living Expenses & Taxes"
          : "Annual Withdrawals: Living Expenses & Taxes",
        style: {
          fontWeight: "700",
          fontSize: "16px",
          color: "#1e293b",
        },
      },
      subtitle: {
        text:
          withdrawalTaxRate > 0
            ? `${withdrawalTaxRate}% tax applied upon withdrawal &bull; Net expense inflated annually`
            : "Tax-free withdrawals (0% tax rate) &bull; Net expense inflated annually",
        style: {
          color: "#64748b",
          fontSize: "12px",
        },
      },
      xAxis: {
        categories: categories,
        title: {
          text: "Year",
        },
        crosshair: true,
      },
      yAxis: {
        title: {
          text: isCumulative
            ? "Cumulative Amount ($)"
            : "Annual Withdrawal Amount ($)",
        },
        min: 0,
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            const val = this.value as number;
            return "$" + formatNumber(val);
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        borderRadius: 8,
        shadow: true,
        formatter: function (this: CustomTooltipContext): string {
          const category = String(this.x ?? "");
          const points = this.points || [this];

          let s = `<div style="font-size:12px; padding: 6px 8px; line-height: 1.6; font-family: sans-serif; min-width: 220px;">`;
          s += `<div style="font-weight: 700; color: #1e293b; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${category}</div>`;

          let netVal = 0;
          let taxVal = 0;
          let grossVal = 0;

          points.forEach((p: Highcharts.Point) => {
            const name = p.series.name;
            const val = p.y || 0;
            if (name.includes("Net Living Expense")) netVal = val;
            else if (name.includes("Tax on Withdrawal")) taxVal = val;
            else if (name.includes("Gross Withdrawn")) grossVal = val;
          });

          // If grossVal wasn't captured from a point, calculate it
          if (grossVal === 0 && (netVal > 0 || taxVal > 0)) {
            grossVal = netVal + taxVal;
          }

          const taxPercent =
            grossVal > 0 ? ((taxVal / grossVal) * 100).toFixed(1) : "0";

          s += `<div style="display:flex; justify-content:space-between; margin-bottom: 3px;">`;
          s += `<span style="color:#0284c7; font-weight:600;">Net Living Expense:</span>`;
          s += `<span style="font-weight:700;">$${formatCurrency(netVal)}</span>`;
          s += `</div>`;

          s += `<div style="display:flex; justify-content:space-between; margin-bottom: 3px;">`;
          s += `<span style="color:#d97706; font-weight:600;">Tax on Withdrawal:</span>`;
          s += `<span style="font-weight:700;">$${formatCurrency(taxVal)} <span style="color:#64748b; font-weight: normal; font-size: 11px;">(${taxPercent}%)</span></span>`;
          s += `</div>`;

          s += `<div style="display:flex; justify-content:space-between; margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0;">`;
          s += `<span style="color:#0f172a; font-weight:700;">Total Gross Withdrawn:</span>`;
          s += `<span style="font-weight:800; color:#0f172a;">$${formatCurrency(grossVal)}</span>`;
          s += `</div>`;

          s += `</div>`;
          return s;
        },
      },
      plotOptions: {
        column: {
          stacking: isStacked ? "normal" : undefined,
          pointPadding: 0.05,
          groupPadding: 0.1,
          borderWidth: 0,
        },
      },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemStyle: {
          color: "#334155",
          fontSize: "12px",
          fontWeight: "600",
        },
      },
      series: series,
      credits: {
        enabled: false,
      },
    };
  }, [planData, withdrawalTaxRate, viewType, layoutType]);

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      {/* Header controls & summary badges */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={1.5}
        sx={{ mb: 1.5, px: 1 }}
      >
        {/* Quick KPI badges */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ gap: 0.8 }}
        >
          <Chip
            label={`Net Expenses: $${formatCurrency(totalNetExpenses)}`}
            size="small"
            sx={{
              bgcolor: "#f0f9ff",
              color: "#0369a1",
              border: "1px solid #bae6fd",
              fontWeight: 700,
              fontSize: "11px",
            }}
          />
          <Chip
            label={`Total Taxes: $${formatCurrency(totalTaxes)}`}
            size="small"
            sx={{
              bgcolor: "#fffbeb",
              color: "#b45309",
              border: "1px solid #fde68a",
              fontWeight: 700,
              fontSize: "11px",
            }}
          />
          <Chip
            label={`Gross Withdrawn: $${formatCurrency(totalWithdrawn)}`}
            size="small"
            sx={{
              bgcolor: "#f8fafc",
              color: "#334155",
              border: "1px solid #cbd5e1",
              fontWeight: 700,
              fontSize: "11px",
            }}
          />
        </Stack>

        {/* View and Layout toggles */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(_, val) => val && setViewType(val)}
            size="small"
          >
            <ToggleButton
              value="annual"
              sx={{ fontWeight: 600, fontSize: "11px", px: 1.5, py: 0.5 }}
            >
              <BarChartIcon sx={{ mr: 0.5, fontSize: 16 }} /> Annual
            </ToggleButton>
            <ToggleButton
              value="cumulative"
              sx={{ fontWeight: 600, fontSize: "11px", px: 1.5, py: 0.5 }}
            >
              <ShowChartIcon sx={{ mr: 0.5, fontSize: 16 }} /> Cumulative
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={layoutType}
            exclusive
            onChange={(_, val) => val && setLayoutType(val)}
            size="small"
          >
            <ToggleButton
              value="stacked"
              sx={{ fontWeight: 600, fontSize: "11px", px: 1.5, py: 0.5 }}
            >
              <LayersIcon sx={{ mr: 0.5, fontSize: 16 }} /> Stacked
            </ToggleButton>
            <ToggleButton
              value="grouped"
              sx={{ fontWeight: 600, fontSize: "11px", px: 1.5, py: 0.5 }}
            >
              <ViewColumnIcon sx={{ mr: 0.5, fontSize: 16 }} /> Grouped
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default WithdrawalsChart;
