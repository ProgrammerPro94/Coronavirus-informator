import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Checkbox,
  TextField
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat, showDate } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [updated, setUpdatedTime] = useState('');
  const [percent, setPercent] = useState(false);
  const [percentCasesType, setPercentCasesType] = useState('activePercent');
  const [minimumCases, setMinimumCases] = useState();

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setUpdatedTime(showDate(data.updated));
      });
  }, []);

  useEffect(() => {
    console.log('Runned');
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          if (percent) {
          var sortedData = sortData(data, percentCasesType);
          }
          else {
          var sortedData = sortData(data, casesType);
          }
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, [casesType, percent, minimumCases]);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
          setUpdatedTime(showDate(data.updated));
        } else {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);
          setUpdatedTime(showDate(data.updated));
        }

      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Informator</h1>
          <div class="app__checkbox">
            <Checkbox
              defaultChecked
              checked={percent}
              onChange={e => { setPercent(e.target.checked); setMinimumCases(0)}}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <p>UsePercent</p>
          </div>
          <p>Updated: {updated}</p>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => { setCasesType("cases"); setPercentCasesType('activePercent') }}
            title="Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
            others={countryInfo}
          />
          <InfoBox
            onClick={(e) => { setCasesType("recovered"); setPercentCasesType('recoveryRate') }}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
            others={countryInfo}
          />
          <InfoBox
            onClick={(e) => { setCasesType("deaths"); setPercentCasesType('mortalityRate') }}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
            others={countryInfo}
          />
          <InfoBox
            onClick={(e) => { setCasesType("tests"); setPercentCasesType('testsPerPopulation') }}
            title="Tests"
            active={casesType === "tests"}
            cases={numeral(countryInfo.tests).format('0.0a')}
            total={numeral(countryInfo.testsPerOneMillion).format("0.0a")}
            others={countryInfo}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          isPercent={percent}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <div>
              {percent ? (
                <div>
                  <div className='app__titles'>
                  <h3>Live {percentCasesType} by Country</h3>
                  <TextField id="standard-basic" label="Minimum Covid Cases" value={minimumCases} onChange={e => Number(e.target.value) || String(minimumCases).length === 1 ? setMinimumCases(e.target.value) : ''} />
                  </div>
                  <Table countries={tableData} casesType={percentCasesType} isPercent={percent} min={minimumCases} />
                </div>
              ) : (
                  <div>
                    <h3>Live {casesType} by Country</h3>
                    <Table countries={tableData} casesType={casesType} isPercent={percent} min={minimumCases} />
                  </div>
                )}
            </div>
            {casesType !== 'tests' ? (
              <div>
                <h3>Worldwide new {casesType}</h3>
                <LineGraph casesType={casesType} />
              </div>
            ) : (
                <div>
                  <h3>Worldwide new cases</h3>
                  <LineGraph casesType='cases' />
                </div>
              )
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;