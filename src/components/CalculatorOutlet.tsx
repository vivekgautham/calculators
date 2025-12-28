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

function CalculatoryOutlet() {
  const [value, setValue] = React.useState<string | undefined>("unleveredbeta");

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
          <Header as='h2' color='teal'>Advanced Economics</Header>
          <Icon name='calculator' size='huge' color='teal'> </Icon>
          <Divider />
          <Search />
          <Divider />
          <MenuItem
            name={"sharperatio"}
            active={value === "sharperatio"}
            onClick={handleChange}
            header={value === "sharperatio"}
          >
            Sharpe Ratio
          </MenuItem>
          <MenuItem
            name={"unleveredbeta"}
            active={value === "unleveredbeta"}
            onClick={handleChange}
            header={value === "unleveredbeta"}
          >
            Unlevered Beta
          </MenuItem>
        </Sidebar>
      </GridColumn>
    </Grid>
  );
}
export default CalculatoryOutlet;
