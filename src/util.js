import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";
import "./Map.css";

export const sortData = (data) => {
  const sotredData = [...data];

  sotredData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sotredData;
};

/* this function can also be written as  */
// (a,b)=>{a.cases > b.cases ?-1:1}

const casesTypesColors = {
  cases: {
    hex: "#cc1034",
    rgb: "rgb(204,16,52)",
    half_op: "rgba(204,16,52,0.5)",
    multiplier: "800",
  },
  recovered: {
    hex: "#7dd17d",
    rgb: "rgb(125,215,29)",
    half_op: "rgba(125,215,29,0.5)",
    multiplier: "1200",
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251,68,67)",
    half_op: "rgba(251,68,67,0.5)",
    multiplier: "2000",
  },
};

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypesColors[casesType].hex}
      fillcolor={casesTypesColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypesColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name ">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0")}{" "}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0")}{" "}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0")}{" "}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const prettyPrint = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
