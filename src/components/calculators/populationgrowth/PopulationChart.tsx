import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box } from "@mui/material";
import {
  usePopulationGrowth,
  getCountryLabel,
  getFlagEmoji,
} from "./PopulationGrowthContext";

const PopulationChart: React.FC = () => {
  const { projectionA, projectionB, scenarioA, scenarioB, timeHorizon } =
    usePopulationGrowth();

  const nameA = `${getFlagEmoji(scenarioA.presetKey)} ${getCountryLabel(scenarioA.presetKey, "Scenario A")}`;
  const nameB = `${getFlagEmoji(scenarioB.presetKey)} ${getCountryLabel(scenarioB.presetKey, "Scenario B")}`;

  // Determine dynamic sampling interval based on timeframe
  const interval = timeHorizon > 300 ? 50 : timeHorizon > 150 ? 25 : 10;

  const sampledA = useMemo(() => {
    return projectionA.filter((d) => d.year % interval === 0);
  }, [projectionA, interval]);

  const sampledB = useMemo(() => {
    return projectionB.filter((d) => d.year % interval === 0);
  }, [projectionB, interval]);

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: "column",
        spacingLeft: 10,
        spacingRight: 15,
        spacingTop: 20,
        spacingBottom: 15,
      },
      title: {
        text: "Total Population Projections Comparison",
        style: {
          fontWeight: "bold",
          fontSize: "16px",
          color: "#1a2035",
        },
      },
      subtitle: {
        text: `Simulating long-term population growth trajectories in ${interval}-year intervals`,
        style: {
          color: "#666",
        },
      },
      xAxis: {
        categories: sampledA.map((d) => `Year ${d.year}`),
        crosshair: true,
      },
      yAxis: {
        title: {
          text: "Population",
          style: { fontWeight: "bold" },
        },
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            const val = this.value as number;
            return val >= 1000000000
              ? `${(val / 1000000000).toFixed(1)}B`
              : `${(val / 1000000).toFixed(0)}M`;
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          const self = this as unknown as {
            x?: string;
            points?: Array<{
              y?: number;
              series: { name: string; color: string };
            }>;
          };
          const points = self.points || [];
          const yearStr = self.x || "";
          let html = `<div style="padding: 4px;"><b>${yearStr}</b><br/>`;
          points.forEach((p) => {
            const val = p.y || 0;
            const formattedVal =
              val >= 1000000000
                ? `${(val / 1000000000).toFixed(2)}B`
                : `${(val / 1000000).toFixed(2)}M`;
            html += `<span style="color:${p.series.color}">\u25CF</span> ${p.series.name}: <b>${formattedVal}</b><br/>`;
          });
          html += `</div>`;
          return html;
        },
      },
      series: [
        {
          name: nameA,
          data: sampledA.map((d) => d.total),
          color: "#00b5ad",
        },
        {
          name: nameB,
          data: sampledB.map((d) => d.total),
          color: "#F39C12",
        },
      ],
      credits: { enabled: false },
    };
  }, [sampledA, sampledB, nameA, nameB]);

  return (
    <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default PopulationChart;
