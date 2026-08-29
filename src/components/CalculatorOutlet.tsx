import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "semantic-ui-react";
import {
  Stack,
  Box,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SearchIcon from "@mui/icons-material/Search";
import LayersIcon from "@mui/icons-material/Layers";
import GitHubIcon from "@mui/icons-material/GitHub";
import { CALCULATORS_AND_SIMULATORS, getTagStyles } from "../config";
import packageJson from "../../package.json";

function CalculatorOutlet() {
  const [activeCalculator, setActiveCalculator] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const active = params.get("active");
    if (active && CALCULATORS_AND_SIMULATORS.some((c) => c.value === active)) {
      return active;
    }
    const hash = window.location.hash.replace("#", "");
    if (CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)) {
      return hash;
    }
    return "basicfinancialplanner";
  });

  const [openCalculators, setOpenCalculators] = useState<string[]>(() => {
    const params = new URLSearchParams(window.location.search);
    const openParam = params.get("open");
    if (openParam) {
      const split = openParam
        .split(",")
        .filter((val) =>
          CALCULATORS_AND_SIMULATORS.some((c) => c.value === val),
        );
      if (split.length > 0) {
        return split;
      }
    }
    const hash = window.location.hash.replace("#", "");
    const initial = CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)
      ? hash
      : "basicfinancialplanner";
    return [initial];
  });

  const [inputValue, setInputValue] = useState("");

  // Alphabetically sort all calculator options
  const sortedCalculators = useMemo(() => {
    return [...CALCULATORS_AND_SIMULATORS].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const active = params.get("active");
      const openParam = params.get("open");

      let newActive = activeCalculator;
      let newOpen = openCalculators;
      let changed = false;

      if (
        active &&
        CALCULATORS_AND_SIMULATORS.some((c) => c.value === active) &&
        active !== activeCalculator
      ) {
        newActive = active;
        changed = true;
      } else {
        const hash = window.location.hash.replace("#", "");
        if (
          CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash) &&
          hash !== activeCalculator
        ) {
          newActive = hash;
          changed = true;
        }
      }

      if (openParam) {
        const split = openParam
          .split(",")
          .filter((val) =>
            CALCULATORS_AND_SIMULATORS.some((c) => c.value === val),
          );
        if (
          split.length > 0 &&
          JSON.stringify(split) !== JSON.stringify(openCalculators)
        ) {
          newOpen = split;
          changed = true;
        }
      }

      if (changed) {
        setActiveCalculator(newActive);
        setOpenCalculators(newOpen);
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [activeCalculator, openCalculators]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("open", openCalculators.join(","));
    params.set("active", activeCalculator);
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}?${newSearch}${window.location.hash}`;
    window.history.replaceState({}, "", newUrl);
  }, [openCalculators, activeCalculator]);

  const handleCloseTab = (valToClose: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selecting the tab when clicking close
    if (openCalculators.length <= 1) return; // Keep at least one tab open

    const newOpen = openCalculators.filter((c) => c !== valToClose);
    setOpenCalculators(newOpen);

    if (activeCalculator === valToClose) {
      // Switch active tab to the last remaining tab
      setActiveCalculator(newOpen[newOpen.length - 1]);
    }
  };

  const handleCloseAllTabs = () => {
    setOpenCalculators(["basicfinancialplanner"]);
    setActiveCalculator("basicfinancialplanner");
  };

  return (
    <Stack sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 1. Unified Premium Header Bar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: "54px",
          px: 3,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          zIndex: 10,
        }}
      >
        {/* Logo & Brand Title */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            setActiveCalculator("basicfinancialplanner");
            setOpenCalculators((prev) => {
              if (!prev.includes("basicfinancialplanner")) {
                return [...prev, "basicfinancialplanner"];
              }
              return prev;
            });
            setInputValue("");
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              background: "linear-gradient(135deg, #00b5ad 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 181, 173, 0.4)",
            }}
          >
            <Icon
              name="calculator"
              style={{ color: "white", margin: 0, fontSize: "16px" }}
            />
          </Box>
          <Stack spacing={0}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.2px",
                fontSize: "15px",
                lineHeight: 1.2,
                color: "#ffffff",
              }}
            >
              Calculators & Simulators
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontSize: "11px",
                letterSpacing: "0.4px",
                fontWeight: 500,
              }}
            >
              Financial Analytics & Macro Suite
            </Typography>
          </Stack>
        </Stack>

        {/* Right Info Controls */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            icon={<LayersIcon style={{ fontSize: 13, color: "#38bdf8" }} />}
            label={`${openCalculators.length} Open`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.06)",
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: "11px",
              border: "1px solid rgba(255,255,255,0.1)",
              height: "24px",
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontSize: "11px",
              letterSpacing: "0.5px",
            }}
          >
            v{packageJson.version}
          </Typography>

          <Tooltip title="View Source on GitHub" arrow>
            <Box
              component="a"
              href="https://www.github.com/vivekgautham"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                p: 0.6,
                borderRadius: "6px",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#38bdf8",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <GitHubIcon sx={{ fontSize: 18 }} />
            </Box>
          </Tooltip>
        </Stack>
      </Stack>

      {/* 2. Spotlight Search Row */}
      <Box
        sx={{
          py: 1,
          px: 3,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}
      >
        <Autocomplete
          fullWidth
          options={sortedCalculators}
          getOptionLabel={(option) => option.name}
          filterOptions={(options, { inputValue: query }) => {
            const q = query.toLowerCase().trim();
            if (!q) return options;

            return options.filter((opt) => {
              const nameMatch = opt.name.toLowerCase().includes(q);
              const descMatch = opt.description.toLowerCase().includes(q);
              const tagMatch = opt.tags.some((tag) =>
                tag.toLowerCase().includes(q),
              );
              return nameMatch || descMatch || tagMatch;
            });
          }}
          value={null}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(_, newValue) => {
            if (newValue) {
              setOpenCalculators((prev) => {
                if (!prev.includes(newValue.value)) {
                  return [...prev, newValue.value];
                }
                return prev;
              });
              setActiveCalculator(newValue.value);
              setInputValue("");
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Quick search across 20+ calculators & simulators (e.g. 'trading', 'fx rates', 'portfolio', 'tax')..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 19 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused": { bgcolor: "#ffffff" },
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            const restProps = { ...props };
            delete (restProps as Record<string, unknown>).key;
            return (
              <Box
                component="li"
                {...restProps}
                key={option.value}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.2,
                  borderBottom: "1px solid #f1f5f9",
                  width: "100%",
                  "&:hover": {
                    bgcolor: "#f8fafc !important",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    mr: 2,
                    fontSize: "13px",
                  }}
                >
                  {option.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    flexWrap: "wrap",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  {option.tags.map((tag) => {
                    const style = getTagStyles(tag);
                    return (
                      <span
                        key={tag}
                        style={{
                          fontSize: "9px",
                          padding: "2px 5px",
                          borderRadius: "4px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          backgroundColor: style.backgroundColor,
                          color: style.color,
                          border: `1px solid ${style.borderColor}`,
                          letterSpacing: "0.3px",
                          lineHeight: "1",
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </Stack>
              </Box>
            );
          }}
          sx={{ width: "100%" }}
        />
      </Box>

      {/* 3. Modern Chrome/Studio-Style Tabs Bar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          pt: 1,
          pb: 0,
          backgroundColor: "#f1f5f9",
          borderBottom: "1px solid #cbd5e1",
          flexShrink: 0,
        }}
      >
        {/* Scrollable Tabs List */}
        <Stack
          direction="row"
          spacing={0.8}
          alignItems="flex-end"
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexGrow: 1,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: 2,
            },
          }}
        >
          {openCalculators.map((val) => {
            const calc = CALCULATORS_AND_SIMULATORS.find(
              (c) => c.value === val,
            );
            if (!calc) return null;
            const isActive = val === activeCalculator;

            return (
              <Box
                key={val}
                onClick={() => setActiveCalculator(val)}
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  bgcolor: isActive ? "#ffffff" : "rgba(241, 245, 249, 0.8)",
                  border: "1px solid",
                  borderColor: isActive ? "#cbd5e1" : "transparent",
                  borderBottom: isActive
                    ? "1px solid #ffffff"
                    : "1px solid transparent",
                  mb: "-1px", // Seamless connection to content box below
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "all 0.15s ease",
                  boxShadow: isActive
                    ? "0 -2px 8px rgba(0,0,0,0.04), 0 2px 0 #ffffff"
                    : "none",
                  "&:hover": {
                    bgcolor: isActive ? "#ffffff" : "#e2e8f0",
                    color: "#0f172a",
                  },
                }}
              >
                {/* Active Indicator Accent Top Bar */}
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -1,
                      left: 0,
                      right: 0,
                      height: "3px",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      background:
                        "linear-gradient(90deg, #00b5ad 0%, #2563eb 100%)",
                    }}
                  />
                )}

                {/* Active Dot Indicator */}
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#00b5ad",
                      boxShadow: "0 0 6px #00b5ad",
                      flexShrink: 0,
                    }}
                  />
                )}

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "13px",
                    color: isActive ? "#0f172a" : "#64748b",
                    letterSpacing: "-0.1px",
                    transition: "color 0.15s ease",
                  }}
                >
                  {calc.name}
                </Typography>

                {/* Tab Close Button */}
                {openCalculators.length > 1 && (
                  <Box
                    component="span"
                    onClick={(e: React.MouseEvent) => handleCloseTab(val, e)}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      color: isActive ? "#94a3b8" : "#94a3b8",
                      transition: "all 0.15s ease",
                      ml: 0.5,
                      "&:hover": {
                        bgcolor: "#fee2e2",
                        color: "#ef4444",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "12px" }} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>

        {/* Delete All Open Tabs Action */}
        {openCalculators.length > 1 && (
          <Tooltip title="Close all tabs (reset to Home)" arrow>
            <IconButton
              color="error"
              onClick={handleCloseAllTabs}
              size="small"
              sx={{
                ml: 1.5,
                mb: 0.8,
                flexShrink: 0,
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                height: "28px",
                width: "28px",
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "#fee2e2",
                  borderColor: "#ef4444",
                },
              }}
            >
              <DeleteSweepIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* 4. Main Content View Container */}
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 54px - 58px - 44px)",
          overflow: "hidden",
          width: "100vw",
          position: "relative",
          bgcolor: "#ffffff",
          "& > div > div": {
            height: "100% !important",
          },
        }}
      >
        {CALCULATORS_AND_SIMULATORS.map((item) => {
          const isOpen = openCalculators.includes(item.value);
          if (!isOpen) return null;

          const isActive = item.value === activeCalculator;
          const PanelComponent = item.panel;

          return (
            <Box
              key={item.value}
              sx={{
                display: isActive ? "block" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <PanelComponent name={item.name} />
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}

export default CalculatorOutlet;
