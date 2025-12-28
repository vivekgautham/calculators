import { Tab, Tabs, Box } from "@mui/material";
import React from "react";
import {
  SidebarPusher,
  SidebarPushable,
  MenuItem,
  GridColumn,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  MenuItemProps,
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
          <MenuItem
            name={"sharperatio"}
            active={value === "sharperatio"}
            onClick={handleChange}
          >
            Sharpe Ratio
          </MenuItem>
          <MenuItem
            name={"unleveredbeta"}
            active={value === "unleveredbeta"}
            onClick={handleChange}
          >
            Unlevered Beta
          </MenuItem>
        </Sidebar>
      </GridColumn>
    </Grid>
  );
}
export default CalculatoryOutlet;
