import React from "react";
import {
    Divider,
    Grid,
    Header,
    Container
} from "semantic-ui-react";
import { PanelProps } from "../../types";
import { CALCULATORS_AND_SIMULATORS } from "../../config";

const SharpeRatio: React.FunctionComponent<PanelProps> = (props) => {

  return (
        <div>
            <Container fluid>
            <Header as='h2' textAlign="left">{props.name}</Header>
            <p>
                {CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)?.description}
            </p>
            </Container>
        </div>
  );
}

export default SharpeRatio;
