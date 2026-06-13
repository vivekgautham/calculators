import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Stack } from "@mui/material";
import { useBlendedInvestment } from "./BlendedInvestmentContext";



const BlendedPieCharts: React.FC = () => {
  const { investments, totalYears } = useBlendedInvestment();

  const initialTotal = useMemo(() => {
    return investments.reduce((sum, inv) => sum + inv.amount, 0);
  }, [investments]);

  const finalTotal = useMemo(() => {
    return investments.reduce((sum, inv) => {
      const r = inv.rate / 100;
      return sum + inv.amount * Math.pow(1 + r, totalYears);
    }, 0);
  }, [investments, totalYears]);

  const initialData = useMemo(() => {
    return investments.map((inv) => ({
      name: inv.name,
      y: inv.amount,
      color: inv.color,
    }));
  }, [investments]);

  const finalData = useMemo(() => {
    return investments.map((inv) => {
      const r = inv.rate / 100;
      const finalValue = inv.amount * Math.pow(1 + r, totalYears);
      return {
        name: inv.name,
        y: parseFloat(finalValue.toFixed(2)),
        color: inv.color,
      };
    });
  }, [investments, totalYears]);

  const getChartOptions = (title: string, total: number, data: any[]) => ({
    chart: {
      type: "pie",
      height: 350,
    },
    title: {
      text: title,
    },
    subtitle: {
      text: `Total: $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      pointFormat: "{series.name}: <b>${point.y:,.2f} ({point.percentage:.1f}%)</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Amount",
        colorByPoint: true,
        data: data,
      },
    ],
    credits: {
      enabled: false,
    },
  });

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ width: "100%" }}>
      <Box sx={{ flex: 1 }}>
        <HighchartsReact highcharts={Highcharts} options={getChartOptions("Initial Composition", initialTotal, initialData)} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <HighchartsReact highcharts={Highcharts} options={getChartOptions(`Final Composition (Year ${totalYears})`, finalTotal, finalData)} />
      </Box>
    </Stack>
  );
};

export default BlendedPieCharts;
