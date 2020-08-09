import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries, casesType, isPercent, min }) {
  if (min === undefined) {
    min = 0;
  }
  return (
    <div className="table">
      {countries.map(country => (
        <tr className="table__tr">
          {country['cases'] > min ? (
            <div className='table__wr'>
              <td>{country.country}</td>
              <td>
                {isPercent ? (
                  <strong>{numeral(country[casesType]).format("0.000%")}</strong>
                ) : (
                    <strong>{numeral(country[casesType]).format("0,0")}</strong>
                  )}
              </td>
            </div>
          ) : (
              ''
            )}
        </tr>
      ))}
    </div>
  );
}

export default Table;