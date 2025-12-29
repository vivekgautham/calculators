import React from "react";
import {
    Header
} from "semantic-ui-react";
import { PanelProps } from "../../types";

const SharpeRatio: React.FunctionComponent<PanelProps> = ({name}) => {

  return (
    <Header as='h3'>{name}</Header>
  );
}

export default SharpeRatio;
