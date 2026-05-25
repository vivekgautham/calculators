import React, { useState, useCallback, useEffect } from "react";
import {
  Divider,
  Header,
  Icon,
  Menu,
  MenuItem,
  MenuItemProps,
  Search,
} from "semantic-ui-react";
import { Stack, Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CALCULATORS_AND_SIMULATORS } from "../config";
import { PanelProps } from "../types";

const MIN_WIDTH = 200;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 350;

function CalculatorOutlet() {
  const [value, setValue] = useState<string | undefined>(() => {
    const hash = window.location.hash.replace("#", "");
    return CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)
      ? hash
      : "rateofgrowth";
  });
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    { value }: { value?: string },
  ) => {
    setSearchQuery(value ?? "");
  };

  const filteredCalculators = CALCULATORS_AND_SIMULATORS.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (CALCULATORS_AND_SIMULATORS.some((c) => c.value === hash)) {
        setValue(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (value) {
      window.location.hash = value;
    }
  }, [value]);

  const startResizing = useCallback((_mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleChange = (
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps,
  ) => {
    setValue(data.name);
  };

  const currentPanel = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value)?.panel;
  const name = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value)?.name ?? 'Rate of Growth';

  return (
    <Stack direction="row" sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar Container */}
      <Box
        sx={{
          width: isCollapsed ? 0 : sidebarWidth,
          transition: isResizing ? 'none' : 'width 0.3s ease',
          height: '100%',
          position: 'relative',
          backgroundColor: '#1b1c1d', // Match Semantic UI inverted menu
          flexShrink: 0,
          zIndex: 100,
          borderRight: isResizing ? '2px solid #00b5ad' : 'none'
        }}
      >
        <Box sx={{
          width: sidebarWidth,
          height: '100%',
          overflowX: 'hidden',
          display: isCollapsed ? 'none' : 'block'
        }}>
          <Menu
            inverted
            vertical
            style={{
              width: '100%',
              height: '100%',
              margin: 0,
              borderRadius: 0,
              border: 'none'
            }}
          >
            <Divider />
            <Header as='h3' color='teal' style={{ padding: '0 15px' }}>
                Advanced Calculators & Simulators
            </Header>
            <Icon name='calculator' size='huge' color='teal' style={{ display: 'block', margin: '10px auto' }} />
            <Divider />
            <Box sx={{ p: '0 15px' }}>
                <Search
                  fluid
                  onSearchChange={handleSearchChange}
                  value={searchQuery}
                  showNoResults={false}
                  placeholder="Search calculators..."
                />
            </Box>
            <Divider />
            {filteredCalculators.map((item) =>
                <MenuItem
                  key={item.name}
                  name={item.value}
                  active={value === item.value}
                  onClick={handleChange}
                  header={value === item.value}
                >
                  {item.name}
                </MenuItem>
            )}
          </Menu>
        </Box>

        {/* Resize Handle */}
        {!isCollapsed && (
          <Box
            onMouseDown={startResizing}
            sx={{
              width: '5px',
              cursor: 'col-resize',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              '&:hover': {
                backgroundColor: 'rgba(0, 181, 173, 0.5)',
              },
            }}
          />
        )}

        {/* Toggle Button */}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{
            position: 'absolute',
            right: isCollapsed ? '-40px' : '5px',
            bottom: '20px',
            backgroundColor: '#1b1c1d',
            color: '#00b5ad',
            zIndex: 101,
            border: '1px solid #00b5ad',
            '&:hover': {
              backgroundColor: '#00b5ad',
              color: 'white',
            },
            width: '30px',
            height: '30px',
            transition: 'all 0.3s ease'
          }}
          size="small"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
        width: isCollapsed ? '100vw' : `calc(100vw - ${sidebarWidth}px)`,
        transition: isResizing ? 'none' : 'width 0.3s ease'
      }}>
          {currentPanel && React.createElement(currentPanel, {name: name} as PanelProps)}
      </Box>
    </Stack>
  );
}
export default CalculatorOutlet;
