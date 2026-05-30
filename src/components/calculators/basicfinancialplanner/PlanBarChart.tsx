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

const PlanBarChart: React.FC = () => {
  const { planData } = useBasicFinancialPlanner();

  const chartOptions = useMemo(() => {
    const categories = planData.map((d) => (d.year === 0 ? "Initial" : `Yr ${d.year}`));
    const seriesData = planData.map((d) => ({
      y: d.remainingBalance,
      color: d.remainingBalance < 0 ? "#d32f2f" : "#2e7d32", // Material-UI Error and Success colors
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
        plotLines: [{
          value: 0,
          width: 2,
          color: '#888',
          zIndex: 1
        }],
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            const val = this.value as number;
            const prefix = val < 0 ? "-$" : "$";
            return prefix + formatNumber(Math.abs(val));
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">Balance: </td>' +
          '<td style="padding:0"><b>${point.y:,.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.05,
          groupPadding: 0.05,
          borderWidth: 0,
        },
      },
      series: [{
        name: "Remaining Balance",
        data: seriesData,
        showInLegend: false,
      }],
      credits: {
        enabled: false,
      },
    };
  }, [planData]);

  return (
    <Box sx={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default PlanBarChart;
