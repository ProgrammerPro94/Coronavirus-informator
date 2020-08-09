import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  casesPercent: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  recoveryRate: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
  mortalityRate: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
  tests: {
    hex: "#7dd71f",
    rgb: "rgb(125, 230, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 200,
  },
  testsPerPopulation: {
    hex: "#7dd71f",
    rgb: "rgb(125, 230, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 200,
  }
};

export const sortData = (data, casesType) => {
  let sortedData = [...data];
  sortedData.map(countries => {
    countries['activePercent'] = countries['active']/countries['cases']; 
    countries['recoveryRate'] = countries['recovered']/countries['cases'];
    countries['mortalityRate'] = countries['deaths']/countries['cases'];
    countries['testsPerPopulation'] = countries['tests']/countries['population'];
  });
  console.log(sortedData);
  sortedData.sort((a, b) => {
    if (a[casesType] > b[casesType]) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases", isPercent) => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          {isPercent ? (
          <div>
            <div className="info-confirmed">
            ActiveCases: {numeral(country.activePercent).format("0.00%")}
          </div>
          <div className="info-recovered">
            RecoveryRate: {numeral(country.recoveryRate).format("0.00%")}
          </div>
          <div className="info-deaths">
            MortalityRate: {numeral(country.mortalityRate).format("0.00%")}
          </div>
          <div className="info-deaths">
            TestsPerPopulation: {numeral(country.testsPerPopulation).format("0.00%")}
          </div>
          </div>
          ) : (
            <div>
            <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
          <div className="info-deaths">
            Tests: {numeral(country.tests).format("0,0")}
          </div>
          </div>
          )}
        </div>
      </Popup>
    </Circle>
  ))};


export const showDate = (time) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const updatedTime = new Date(time);
    return `${updatedTime.getDate()} ${months[updatedTime.getMonth()]} ${updatedTime.getHours()}:${updatedTime.getMinutes()}`;
}
