import React from "react";
import {
  Divider,
  Grid,
  GridColumn,
  Header,
  Icon,
  Menu,
  MenuItem,
  MenuItemProps,
  Search,
  Sidebar
} from "semantic-ui-react";
import { CALCULATORS_AND_SIMULATORS } from "../config";
import { PanelProps } from "../types";

function CalculatoryOutlet() {
  const [value, setValue] = React.useState<string | undefined>("sharperatio");

  const handleChange = (
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps,
  ) => {
    setValue(data.name);
  };

  const currentPanel = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value)?.panel
  const name = CALCULATORS_AND_SIMULATORS.find((item) => item.value === value)?.name ?? 'Sharpe Ratio'

  return (
    <Grid columns={2}>
      <GridColumn width={4}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={true}
          width="wide"
        >
          <Divider />
          <Header as='h3' color='teal'>Advanced Calculators & Simulators</Header>
          <Icon name='calculator' size='huge' color='teal'> </Icon>
          <Divider />
          <Search />
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
      </GridColumn>
      <GridColumn width={12}>
          {currentPanel && React.createElement(currentPanel, {name: name} as PanelProps)}
      </GridColumn>

    </Grid>
  );
}
export default CalculatoryOutlet;
