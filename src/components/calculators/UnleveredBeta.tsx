import React from "react";
import {
    Container,
    Header
} from "semantic-ui-react";
import { CALCULATORS_AND_SIMULATORS } from "../../config";
import { PanelProps } from "../../types";

const UnleveredBeta: React.FunctionComponent<PanelProps> = (props) => {

  return (
        <>
            <Container fluid>
            <Header as='h2' textAlign="left">{props.name}</Header>
            <Header as='h5' textAlign="left">
                {CALCULATORS_AND_SIMULATORS.find((item) => item.name === props.name)?.description}
            </Header>
            </Container>
        </>
  );
}

export default UnleveredBeta;
