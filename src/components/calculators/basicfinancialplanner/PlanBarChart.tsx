import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
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
    formatted = (absoluteValue / 1000).toFixed(1) + "K";
  } else {
    formatted = absoluteValue.toFixed(0);
  }

  return sign + formatted;
};

interface CustomPoint extends Highcharts.Point {
  projectedBalance?: number;
  netExpense?: number;
  taxAmount?: number;
  withdrawnAmount?: number;
}

const PlanBarChart: React.FC = () => {
  const { planData, withdrawalTaxRate } = useBasicFinancialPlanner();

  const chartOptions = useMemo(() => {
    const categories = planData.map((d) =>
      d.year === 0 ? "Initial" : `Yr ${d.year}`,
    );
    const seriesData = planData.map((d) => ({
      y: d.remainingBalance,
      color: d.remainingBalance < 0 ? "#d32f2f" : "#2e7d32",
      projectedBalance: d.projectedBalance,
      netExpense: d.netExpense,
      taxAmount: d.taxAmount,
      withdrawnAmount: d.withdrawnAmount,
    }));

    return {
      chart: {
        type: "column",
        zooming: {
          type: "x",
        },
      },
      title: {
        text: "Projected Remaining Balance",
      },
      subtitle: {
        text:
          withdrawalTaxRate > 0
            ? `Accounting for ${withdrawalTaxRate}% withdrawal tax on living expenses`
            : "Tax-free withdrawals (0% tax rate)",
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
          text: "Remaining Balance",
        },
        plotLines: [
          {
            value: 0,
            width: 2,
            color: "#888",
            zIndex: 1,
          },
        ],
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            const val = this.value as number;
            const prefix = val < 0 ? "-$" : "$";
            return prefix + formatNumber(Math.abs(val));
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
          const point = this as CustomPoint;
          const category = String(point.category ?? "");
          const isInitial = category === "Initial";
          const val = point.y ?? 0;
          const prefix = val < 0 ? "-$" : "$";
          const valFormatted = prefix + formatNumber(Math.abs(val));
          const color = val < 0 ? "#d32f2f" : "#2e7d32";

          let s = `<div style="font-size:12px; padding: 4px; line-height: 1.5; font-family: sans-serif;">`;
          s += `<div style="font-weight: 700; color: #1e293b; margin-bottom: 4px;">${category}</div>`;
          s += `<div>Remaining Balance: <b style="color:${color};">${valFormatted}</b> ($${Math.round(val).toLocaleString()})</div>`;

          if (!isInitial && point.projectedBalance !== undefined) {
            s += `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">`;
            s += `<div>Projected Balance: <b>$${Math.round(point.projectedBalance).toLocaleString()}</b></div>`;
            s += `<div>Net Living Expense: <b style="color: #0284c7;">$${Math.round(point.netExpense ?? 0).toLocaleString()}</b></div>`;
            if ((point.taxAmount ?? 0) > 0) {
              s += `<div>Withdrawal Tax: <b style="color: #d97706;">$${Math.round(point.taxAmount ?? 0).toLocaleString()}</b></div>`;
            }
            s += `<div>Total Gross Withdrawn: <b>$${Math.round(point.withdrawnAmount ?? 0).toLocaleString()}</b></div>`;
            s += `</div>`;
          }
          s += `</div>`;
          return s;
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.05,
          groupPadding: 0.05,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Remaining Balance",
          data: seriesData,
          showInLegend: false,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [planData, withdrawalTaxRate]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default PlanBarChart;
