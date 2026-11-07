import React, { useState, useMemo } from "react";
import { Box, Typography, Stack, Chip, Paper, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import GavelIcon from "@mui/icons-material/Gavel";
import TimelineIcon from "@mui/icons-material/Timeline";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import PieChartIcon from "@mui/icons-material/PieChart";
import SavingsIcon from "@mui/icons-material/Savings";
import BoltIcon from "@mui/icons-material/Bolt";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalculateIcon from "@mui/icons-material/Calculate";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import BalanceIcon from "@mui/icons-material/Balance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import LayersIcon from "@mui/icons-material/Layers";
import PercentIcon from "@mui/icons-material/Percent";
import InsightsIcon from "@mui/icons-material/Insights";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GroupsIcon from "@mui/icons-material/Groups";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../config";
import { useAppTheme } from "../context/ThemeContext";

interface CalculatorCatalogProps {
  onSelectCalculator: (calculatorValue: string) => void;
  openCalculators: string[];
}

interface CategoryConfig {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "macro",
    label: "Macro & Economics",
    color: "#0369a1",
    bgColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  {
    id: "portfolio",
    label: "Portfolio & Investment",
    color: "#047857",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  {
    id: "valuation",
    label: "Valuation & Stocks",
    color: "#6d28d9",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
  },
  {
    id: "planning",
    label: "Financial Planning",
    color: "#b45309",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  {
    id: "tax",
    label: "Tax & Accounting",
    color: "#be123c",
    bgColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
  {
    id: "math",
    label: "Math & Modeling",
    color: "#0f766e",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
  },
  {
    id: "all",
    label: "All",
    color: "#334155",
    bgColor: "#f1f5f9",
    borderColor: "#cbd5e1",
  },
];

interface ToolMeta {
  categoryId: string;
  categoryLabel: string;
  icon: React.ComponentType<{ sx?: Record<string, unknown> }>;
  badge?: string;
}

export const TOOL_META_MAP: Record<string, ToolMeta> = {
  // Macro & Economics
  fedrates: {
    categoryId: "macro",
    categoryLabel: "Macro & Economics",
    icon: AccountBalanceIcon,
    badge: "Popular",
  },
  fxrates: {
    categoryId: "macro",
    categoryLabel: "Macro & Economics",
    icon: CurrencyExchangeIcon,
    badge: "Updated",
  },
  dutchauction: {
    categoryId: "macro",
    categoryLabel: "Macro & Economics",
    icon: GavelIcon,
  },
  rateofgrowth: {
    categoryId: "macro",
    categoryLabel: "Macro & Economics",
    icon: TimelineIcon,
  },

  // Portfolio & Investment
  portfolioinmultipleccys: {
    categoryId: "portfolio",
    categoryLabel: "Portfolio & Investment",
    icon: TravelExploreIcon,
  },
  portfolioshockmatrix: {
    categoryId: "portfolio",
    categoryLabel: "Portfolio & Investment",
    icon: CrisisAlertIcon,
    badge: "Stress Test",
  },
  blendedinvestment: {
    categoryId: "portfolio",
    categoryLabel: "Portfolio & Investment",
    icon: PieChartIcon,
  },
  foreigncurrencyfd: {
    categoryId: "portfolio",
    categoryLabel: "Portfolio & Investment",
    icon: SavingsIcon,
  },
  savingspower: {
    categoryId: "portfolio",
    categoryLabel: "Portfolio & Investment",
    icon: BoltIcon,
  },

  // Valuation & Stocks
  stockanalysis: {
    categoryId: "valuation",
    categoryLabel: "Valuation & Stocks",
    icon: CandlestickChartIcon,
  },
  pevaluation: {
    categoryId: "valuation",
    categoryLabel: "Valuation & Stocks",
    icon: AnalyticsIcon,
  },
  nextdayvol: {
    categoryId: "valuation",
    categoryLabel: "Valuation & Stocks",
    icon: TrendingUpIcon,
    badge: "VIX Driven",
  },
  orderbook: {
    categoryId: "valuation",
    categoryLabel: "Valuation & Stocks",
    icon: ViewListIcon,
    badge: "Interactive",
  },

  // Financial Planning
  dailyreserverunway: {
    categoryId: "planning",
    categoryLabel: "Financial Planning",
    icon: CalendarMonthIcon,
    badge: "Essential",
  },
  basicfinancialplanner: {
    categoryId: "planning",
    categoryLabel: "Financial Planning",
    icon: CalculateIcon,
  },
  retirementplanner: {
    categoryId: "planning",
    categoryLabel: "Financial Planning",
    icon: BeachAccessIcon,
  },
  growthtarget: {
    categoryId: "planning",
    categoryLabel: "Financial Planning",
    icon: TrackChangesIcon,
  },

  // Tax & Accounting
  balancesheet: {
    categoryId: "tax",
    categoryLabel: "Tax & Accounting",
    icon: BalanceIcon,
  },
  progressivetax: {
    categoryId: "tax",
    categoryLabel: "Tax & Accounting",
    icon: ReceiptIcon,
  },
  corporatedebttaxsaver: {
    categoryId: "tax",
    categoryLabel: "Tax & Accounting",
    icon: CorporateFareIcon,
  },
  slabstructure: {
    categoryId: "tax",
    categoryLabel: "Tax & Accounting",
    icon: LayersIcon,
  },

  // Math & Modeling
  percentchange: {
    categoryId: "math",
    categoryLabel: "Math & Modeling",
    icon: PercentIcon,
  },
  doublinggrowth: {
    categoryId: "math",
    categoryLabel: "Math & Modeling",
    icon: InsightsIcon,
  },
  areaconverter: {
    categoryId: "math",
    categoryLabel: "Math & Modeling",
    icon: SquareFootIcon,
  },
  ratingsbasedpredictor: {
    categoryId: "math",
    categoryLabel: "Math & Modeling",
    icon: AutoAwesomeIcon,
  },
  populationgrowth: {
    categoryId: "math",
    categoryLabel: "Math & Modeling",
    icon: GroupsIcon,
  },
};

const CalculatorCatalog: React.FC<CalculatorCatalogProps> = ({
  onSelectCalculator,
  openCalculators,
}) => {
  const { preset } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState("macro");

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: CALCULATORS_AND_SIMULATORS.length,
    };
    for (const calc of CALCULATORS_AND_SIMULATORS) {
      const meta = TOOL_META_MAP[calc.value];
      const catId = meta?.categoryId || "math";
      counts[catId] = (counts[catId] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered calculators sorted alphabetically by name within each category
  const filteredCalculators = useMemo(() => {
    const categoryOrder = CATEGORIES.map((c) => c.id);

    return CALCULATORS_AND_SIMULATORS.filter((calc) => {
      const meta = TOOL_META_MAP[calc.value];
      return (
        selectedCategory === "all" || meta?.categoryId === selectedCategory
      );
    }).sort((a, b) => {
      if (selectedCategory === "all") {
        const metaA = TOOL_META_MAP[a.value];
        const metaB = TOOL_META_MAP[b.value];
        const orderA = categoryOrder.indexOf(metaA?.categoryId || "");
        const orderB = categoryOrder.indexOf(metaB?.categoryId || "");
        if (orderA !== orderB) {
          return orderA - orderB;
        }
      }
      return a.name.localeCompare(b.name);
    });
  }, [selectedCategory]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        bgcolor: "#f8fafc",
        p: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Category Filter Pills (wrapped to show all chips) */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2.5,
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <Box
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.8,
                  py: 0.8,
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: isSelected ? 700 : 600,
                  cursor: "pointer",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s ease",
                  bgcolor: isSelected ? preset.primary : "#ffffff",
                  color: isSelected ? "#ffffff" : "#475569",
                  border: "1px solid",
                  borderColor: isSelected ? preset.primary : "#e2e8f0",
                  boxShadow: isSelected
                    ? `0 2px 10px ${preset.glow}`
                    : "0 1px 2px rgba(0,0,0,0.03)",
                  "&:hover": {
                    borderColor: isSelected ? preset.primary : "#cbd5e1",
                    bgcolor: isSelected ? preset.primary : "#f8fafc",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <span>{cat.label}</span>
                <Box
                  component="span"
                  sx={{
                    px: 0.8,
                    py: 0.15,
                    borderRadius: "10px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    bgcolor: isSelected ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                    color: isSelected ? "#ffffff" : "#64748b",
                  }}
                >
                  {count}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Results Counter / Filter Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2, px: 0.5 }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#64748b", fontWeight: 600 }}
          >
            Showing <strong>{filteredCalculators.length}</strong> of{" "}
            <strong>{CALCULATORS_AND_SIMULATORS.length}</strong> calculators
          </Typography>

          {selectedCategory !== "all" && (
            <Button
              size="small"
              variant="text"
              onClick={() => setSelectedCategory("all")}
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: preset.primary,
                textTransform: "none",
              }}
            >
              Show All
            </Button>
          )}
        </Stack>

        {/* Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {filteredCalculators.map((calc) => {
            const meta = TOOL_META_MAP[calc.value];
            const IconComponent = meta?.icon || CalculateIcon;
            const isOpen = openCalculators.includes(calc.value);

            // Find category visual styles
            const catConfig =
              CATEGORIES.find((c) => c.id === meta?.categoryId) ||
              CATEGORIES[1];

            return (
              <Paper
                key={calc.value}
                elevation={0}
                onClick={() => onSelectCalculator(calc.value)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2.4,
                  borderRadius: 2.5,
                  bgcolor: "#ffffff",
                  border: "1px solid",
                  borderColor: isOpen ? preset.primary : "#e2e8f0",
                  boxShadow: isOpen
                    ? `0 4px 16px -2px ${preset.glow}`
                    : "0 2px 6px -1px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: preset.primary,
                    boxShadow: `0 12px 24px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px ${preset.glow}`,
                    "& .launch-btn": {
                      color: preset.primary,
                      transform: "translateX(3px)",
                    },
                    "& .icon-box": {
                      transform: "scale(1.06)",
                      boxShadow: `0 4px 12px ${catConfig.borderColor}`,
                    },
                  },
                }}
              >
                {/* Top Status Accent Bar when Open */}
                {isOpen && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: preset.gradient,
                    }}
                  />
                )}

                <Box>
                  {/* Header Row: Icon, Category & Open Status */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1.8 }}
                  >
                    <Box
                      className="icon-box"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: catConfig.bgColor,
                        color: catConfig.color,
                        border: `1px solid ${catConfig.borderColor}`,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <IconComponent sx={{ fontSize: 22 }} />
                    </Box>

                    <Stack direction="row" spacing={0.6} alignItems="center">
                      {meta?.badge && !isOpen && (
                        <Chip
                          label={meta.badge}
                          size="small"
                          sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            height: 20,
                            bgcolor: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                          }}
                        />
                      )}

                      {isOpen ? (
                        <Chip
                          icon={
                            <CheckCircleIcon
                              sx={{
                                fontSize: "13px !important",
                                color: `${preset.primary} !important`,
                              }}
                            />
                          }
                          label="Open in Tab"
                          size="small"
                          sx={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            height: 22,
                            bgcolor: "#f0fdf4",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: catConfig.color,
                            bgcolor: catConfig.bgColor,
                            px: 1,
                            py: 0.3,
                            borderRadius: "6px",
                            border: `1px solid ${catConfig.borderColor}`,
                          }}
                        >
                          {catConfig.label.split(" ")[0]}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  {/* Tool Title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      fontSize: "15.5px",
                      lineHeight: 1.3,
                      mb: 0.8,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {calc.name}
                  </Typography>

                  {/* Tool Description (clamped to 3 lines) */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "12.5px",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "56px",
                      mb: 1.8,
                    }}
                  >
                    {calc.description}
                  </Typography>

                  {/* Tags */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      flexWrap: "wrap",
                      gap: "4px",
                      mb: 2,
                    }}
                  >
                    {calc.tags.slice(0, 3).map((tag) => {
                      const style = getTagStyles(tag);
                      return (
                        <Box
                          key={tag}
                          component="span"
                          sx={{
                            fontSize: "9.5px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            px: 0.8,
                            py: 0.25,
                            borderRadius: "4px",
                            bgcolor: style.backgroundColor,
                            color: style.color,
                            border: `1px solid ${style.borderColor}`,
                          }}
                        >
                          {tag}
                        </Box>
                      );
                    })}
                    {calc.tags.length > 3 && (
                      <Box
                        component="span"
                        sx={{
                          fontSize: "9.5px",
                          fontWeight: 600,
                          color: "#94a3b8",
                          px: 0.5,
                          py: 0.25,
                        }}
                      >
                        +{calc.tags.length - 3}
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Card Bottom Action */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    pt: 1.2,
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <Typography
                    className="launch-btn"
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      fontSize: "12px",
                      color: isOpen ? preset.primary : "#475569",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {isOpen ? "Switch to Tab" : "Open Calculator"}
                    <ArrowForwardIcon sx={{ fontSize: 13 }} />
                  </Typography>
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default CalculatorCatalog;
