import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper, Box, Slider, Typography, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { usePopulationGrowth, getCountryLabel, getFlagEmoji } from "./PopulationGrowthContext";

const CohortChart: React.FC = () => {
  const {
    projectionA,
    projectionB,
    scenarioA,
    scenarioB,
    timeHorizon,
    timelineYear,
    setTimelineYear,
  } = usePopulationGrowth();

  const nameA = `${getFlagEmoji(scenarioA.presetKey)} ${getCountryLabel(scenarioA.presetKey, "Scenario A")}`;
  const nameB = `${getFlagEmoji(scenarioB.presetKey)} ${getCountryLabel(scenarioB.presetKey, "Scenario B")}`;

  // Safely clamp timelineYear if timeHorizon is reduced
  const activeYear = Math.min(timelineYear, timeHorizon);

  const dataA = projectionA[activeYear] || projectionA[projectionA.length - 1];
  const dataB = projectionB[activeYear] || projectionB[projectionB.length - 1];

  const chartOptions = useMemo(() => {
    if (!dataA || !dataB) return {};

    const totalA = dataA.total || 1;
    const totalB = dataB.total || 1;

    const pctYouthA = (dataA.youth / totalA) * 100;
    const pctWorkingA = (dataA.working / totalA) * 100;
    const pctElderlyA = (dataA.elderly / totalA) * 100;

    const pctYouthB = (dataB.youth / totalB) * 100;
    const pctWorkingB = (dataB.working / totalB) * 100;
    const pctElderlyB = (dataB.elderly / totalB) * 100;

    return {
      chart: {
        type: "bar",
        height: 240,
        spacingLeft: 10,
        spacingRight: 15,
        spacingTop: 15,
        spacingBottom: 15,
      },
      title: {
        text: `Age Structure Distribution - Year ${activeYear}`,
        style: {
          fontWeight: "bold",
          fontSize: "15px",
          color: "#1a2035",
        },
      },
      xAxis: {
        categories: [nameA, nameB],
        title: { text: null },
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: "Percentage of Population (%)",
          align: "high",
        },
        labels: {
          overflow: "justify",
        },
      },
      tooltip: {
        valueSuffix: "%",
        valueDecimals: 1,
        shared: true,
      },
      plotOptions: {
        series: {
          stacking: "normal",
          dataLabels: {
            enabled: true,
            format: "{point.y:.1f}%",
            style: {
              color: "#ffffff",
              textOutline: "none",
            },
          },
        },
      },
      legend: {
        reversed: true,
      },
      series: [
        {
          name: "Elderly (65+)",
          data: [pctElderlyA, pctElderlyB],
          color: "#e74c3c", // red
        },
        {
          name: "Working (15-64)",
          data: [pctWorkingA, pctWorkingB],
          color: "#2ecc71", // green
        },
        {
          name: "Youth (0-14)",
          data: [pctYouthA, pctYouthB],
          color: "#3498db", // blue
        },
      ],
      credits: { enabled: false },
    };
  }, [dataA, dataB, activeYear]);

  return (
    <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack spacing={2.5}>
        <Box>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>

        {/* Interactive Timeline Scrubber */}
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#f8f9fa", borderRadius: 1.5 }}>
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon color="primary" fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Interactive Timeline Scrubber (Year {activeYear})
              </Typography>
            </Box>
            <Slider
              min={0}
              max={timeHorizon}
              step={1}
              value={activeYear}
              onChange={(_, val) => setTimelineYear(val as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `Year ${val}`}
            />
            <Typography variant="caption" color="text.secondary">
              Drag the timeline scrubber to visualize how the age structures shift from young pyramids to aging dependency stacks.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default CohortChart;
