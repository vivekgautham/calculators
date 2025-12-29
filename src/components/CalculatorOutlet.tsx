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

function CalculatoryOutlet() {
  const [value, setValue] = React.useState<string | undefined>("sharperatio");

  const handleChange = (
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps,
  ) => {
    setValue(data.name);
  };

  return (
    <Grid columns={2}>
      <GridColumn>
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
    </Grid>
  );
}
export default CalculatoryOutlet;
