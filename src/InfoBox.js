import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

const InfoBox = ({ title, cases, total, isRed, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${props.active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography color="textsecondary" className="title">
          {title}
        </Typography>
        <h2 className={`cases ${!isRed && "infoBox-cases--green"}`}>
          {" "}
          {cases}{" "}
        </h2>
        <Typography color="textsecondary" className="total">
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
