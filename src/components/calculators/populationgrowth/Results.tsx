import React from "react";
import { Paper, Typography, Box, Alert, Stack, Divider } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  usePopulationGrowth,
  CohortYearData,
  getCountryLabel,
  getFlagEmoji,
} from "./PopulationGrowthContext";

const Results: React.FC = () => {
  const { projectionA, projectionB, scenarioA, scenarioB } =
    usePopulationGrowth();
  const nameA = `${getFlagEmoji(scenarioA.presetKey)} ${getCountryLabel(scenarioA.presetKey, "Scenario A")}`;
  const nameB = `${getFlagEmoji(scenarioB.presetKey)} ${getCountryLabel(scenarioB.presetKey, "Scenario B")}`;

  const getKPIs = (data: CohortYearData[]) => {
    const startData = data[0];
    const lastData = data[data.length - 1];

    const peakTotal = Math.max(...data.map((d) => d.total));
    const peakYear = data.find((d) => d.total === peakTotal)?.year || 0;

    const totalChangePct =
      ((lastData.total - startData.total) / startData.total) * 100;

    return {
      finalPopulation: lastData.total,
      peakPopulation: peakTotal,
      peakYear,
      finalDependency: lastData.oldAgeDependency,
      changePct: totalChangePct,
    };
  };

  const kpiA = getKPIs(projectionA);
  const kpiB = getKPIs(projectionB);

  const formatCompact = (val: number) => {
    return val >= 1000000000
      ? `${(val / 1000000000).toFixed(2)}B`
      : `${(val / 1000000).toFixed(2)}M`;
  };

  const renderScenarioKPIs = (
    title: string,
    kpis: ReturnType<typeof getKPIs>,
    primaryColor: string,
  ) => {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderLeft: `4px solid ${primaryColor}`,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}
        >
          {title} Summary
        </Typography>
        <Stack spacing={2}>
          {/* Final Population */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <GroupsIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Final Population:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {formatCompact(kpis.finalPopulation)} (
              {kpis.changePct >= 0 ? "+" : ""}
              {kpis.changePct.toFixed(1)}%)
            </Typography>
          </Box>

          {/* Peak Population */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <TimelineIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Peak Population:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {formatCompact(kpis.peakPopulation)}{" "}
              <Typography variant="caption" color="text.secondary">
                (Year {kpis.peakYear})
              </Typography>
            </Typography>
          </Box>

          {/* Old Age Dependency */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EscalatorWarningIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Final Dependency Ratio:
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: kpis.finalDependency > 40 ? "#e74c3c" : "inherit",
              }}
            >
              {kpis.finalDependency.toFixed(1)}%
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "right", mt: -1 }}
          >
            (retirees per 100 working-age citizens)
          </Typography>
        </Stack>
      </Paper>
    );
  };

  return (
    <Stack spacing={3}>
      <Divider />

      {/* Side-by-side KPI Projections */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {renderScenarioKPIs(nameA, kpiA, "#00b5ad")}
        {renderScenarioKPIs(nameB, kpiB, "#F39C12")}
      </Box>

      {/* Analytical Breakdown Alert */}
      <Alert
        severity="info"
        icon={<EmojiEventsIcon />}
        sx={{ borderRadius: 2 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Demographic Dependency Analysis:
        </Typography>
        <Typography variant="body2">
          An **Old-Age Dependency Ratio** of over **40%** indicates a heavy
          economic burden, with fewer than 2.5 working-age citizens supporting
          each retiree. * <b>{nameA}</b> ends with a ratio of{" "}
          <b>{kpiA.finalDependency.toFixed(1)}%</b>. * <b>{nameB}</b> ends with
          a ratio of <b>{kpiB.finalDependency.toFixed(1)}%</b>. If fertility
          remains below replacement (2.1) without offsetting migration, the
          dependency ratio will continue climbing, squeezing pension systems and
          labor markets.
        </Typography>
      </Alert>
    </Stack>
  );
};

export default Results;
