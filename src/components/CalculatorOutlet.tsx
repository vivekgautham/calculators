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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
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
      {/* Top Header Bar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: "56px",
          px: 3,
          backgroundColor: "#1b1c1d", // Match theme
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}
      >
        {/* Logo / Title */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ cursor: "pointer" }}
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
          <Icon
            name="calculator"
            size="large"
            style={{ color: "#00b5ad", margin: 0 }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: "0.5px" }}
          >
            Advanced Calculators & Simulators
          </Typography>
        </Stack>

        {/* Right GitHub & Version Info */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.5)", fontWeight: "medium" }}
          >
            v{packageJson.version}
          </Typography>
          <Box
            component="a"
            href="https://www.github.com/vivekgautham"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#00b5ad",
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#00e5db",
              },
            }}
          >
            <i className="github icon large" style={{ margin: 0 }}></i>
          </Box>
        </Stack>
      </Stack>

      {/* Dedicated Search Bar Row Below Title */}
      <Box
        sx={{
          py: 1.5,
          px: 3,
          backgroundColor: "#f8f9fa", // Clean off-white sub-bar
          borderBottom: "1px solid #e9ecef",
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
          value={null} // Keep it empty by default so it acts as an open/add field launcher
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
              placeholder="Search by title or tags (e.g., 'trading', 'tax', 'accounting')..."
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ced4da" },
                  "&:hover fieldset": { borderColor: "#00b5ad" },
                  "&.Mui-focused fieldset": { borderColor: "#00b5ad" },
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
                  p: 1.5,
                  borderBottom: "1px solid #f0f0f0",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#1a2035", mr: 2 }}
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
                          fontSize: "8px",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor: style.backgroundColor,
                          color: style.color,
                          border: `1px solid ${style.borderColor}`,
                          letterSpacing: "0.5px",
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

      {/* Dynamic Browser-like Tab Bar Row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 3,
          py: 1,
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          flexShrink: 0,
        }}
      >
        {/* Scrollable Tabs Stack */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexGrow: 1,
            py: 0.2,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ced4da",
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
              <Stack
                key={val}
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => setActiveCalculator(val)}
                sx={{
                  px: 2.2,
                  py: 0.8,
                  borderRadius: "20px", // Rounded pill styling
                  background: isActive
                    ? "linear-gradient(135deg, #00b5ad 0%, #008f89 100%)"
                    : "white",
                  border: "1px solid",
                  borderColor: isActive ? "transparent" : "#dee2e6",
                  cursor: "pointer",
                  userSelect: "none",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "white" : "#495057",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  mr: 0.5,
                  boxShadow: isActive
                    ? "0px 4px 10px rgba(0, 181, 173, 0.25)"
                    : "0px 2px 4px rgba(0,0,0,0.02)",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(135deg, #00c7be 0%, #009d97 100%)"
                      : "#f1f3f5",
                    borderColor: isActive ? "transparent" : "#ced4da",
                    transform: isActive ? "translateY(-1px)" : "none",
                    boxShadow: isActive
                      ? "0px 6px 12px rgba(0, 181, 173, 0.3)"
                      : "0px 3px 6px rgba(0,0,0,0.04)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "inherit",
                    fontSize: "13px",
                    letterSpacing: "0.2px",
                  }}
                >
                  {calc.name}
                </Typography>
                {openCalculators.length > 1 && (
                  <CloseIcon
                    onClick={(e: React.MouseEvent) => handleCloseTab(val, e)}
                    sx={{
                      marginLeft: 1,
                      fontSize: "14px",
                      color: isActive
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.4)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        color: isActive ? "#ffcdd2" : "#d32f2f",
                        transform: "rotate(90deg)",
                      },
                    }}
                  />
                )}
              </Stack>
            );
          })}
        </Stack>

        {/* Delete All Open Tabs Icon Button on the Same Row as Tabs */}
        {openCalculators.length > 1 && (
          <Tooltip title="Close all tabs" arrow>
            <IconButton
              color="error"
              onClick={handleCloseAllTabs}
              size="small"
              sx={{
                ml: 1.5,
                flexShrink: 0,
                border: "1px solid #ef5350",
                borderRadius: "6px",
                height: "32px",
                width: "32px",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "#ffebee",
                  borderColor: "#d32f2f",
                },
              }}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* Main Content View Container (Preserves states using display: none) */}
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 56px - 64px - 44px)", // Offsets for title bar, search bar, and tab bar
          overflow: "hidden",
          width: "100vw",
          position: "relative",
          // Force panels to 100% height instead of 100vh so their internal scrollbars fit the parent viewport
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
