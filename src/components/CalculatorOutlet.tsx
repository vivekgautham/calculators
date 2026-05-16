import React from "react";
import {
  Divider,
  Header,
  Icon,
  Menu,
  MenuItem,
  MenuItemProps,
  Search,
  Sidebar
} from "semantic-ui-react";
import { Stack, Box } from "@mui/material";
import { CALCULATORS_AND_SIMULATORS } from "../config";
import { PanelProps } from "../types";

function CalculatoryOutlet() {
  const [value, setValue] = React.useState<string | undefined>("rateofgrowth");

  const handleChange = (
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps,
  ) => {
    setValue(data.name);
  };

  const currentPanel = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value)?.panel
  const name = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value)?.name ?? 'Rate of Growth'

  return (
    <Stack direction="row" sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '30vw', flexShrink: 0, height: '100%' }}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={true}
          style={{ width: '100%', position: 'relative' }}
        >
          <Divider />
          <Header as='h3' color='teal'>Advanced Calculators & Simulators</Header>
          <Icon name='calculator' size='huge' color='teal'> </Icon>
          <Divider />
          <Search fluid />
          <Divider />
          {CALCULATORS_AND_SIMULATORS.map((item) =>
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
        </Sidebar>
      </Box>
      <Box sx={{ width: '70vw', flexGrow: 1, height: '100%', overflow: 'hidden' }}>
          {currentPanel && React.createElement(currentPanel, {name: name} as PanelProps)}
      </Box>
    </Stack>
  );
}
export default CalculatoryOutlet;
