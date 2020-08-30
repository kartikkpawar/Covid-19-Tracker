import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrint } from "./util";
import LineGraph from "./LineGraph";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryinfo, setCountryinfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryinfo(data));
  }, []);

  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      });
  };

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryinfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };

  useEffect(() => getCountriesData(), []);

  return (
    <div className="App">
      <div className="left">
        <div className="header">
          <h1> Covid-19 TRACKER </h1>
          <FormControl className="dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide"> Worldwide </MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}> {country.name} </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrint(countryinfo.todayCases)}
            total={prettyPrint(countryinfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrint(countryinfo.todayRecovered)}
            total={prettyPrint(countryinfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrint(countryinfo.todayDeaths)}
            total={prettyPrint(countryinfo.deaths)}
          />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className="right">
        <CardContent>
          {" "}
          <h3>Live Cases By Country</h3> <Table countries={tableData} />
        </CardContent>
        <CardContent>
          {" "}
          <Fragment className="frg">
            <LineGraph casesType={casesType} />
          </Fragment>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
