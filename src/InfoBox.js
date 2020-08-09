import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import numeral from 'numeral';

function InfoBox({ title, cases, total, active, isRed, others, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
        }`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {title === 'Tests' ? (
            cases + ' Total'
          ): (
            cases
          )}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
        {title === 'Tests' ? (
            total + ' per one million People '
          ): (
            total + ' Total'
          )}
        </Typography>
        {
          title === 'Cases' ? (
            <Typography className="infoBox__active" color='textSecondary'>
              {numeral(others.active).format('0.0a')} Active
            </Typography>
          ) : (
              title === 'Recovered' ? (
                <Typography className="infoBox__active" color="textSecondary">
                  {numeral((others.recovered / others.cases)).format('0.000%')} Recovery Rate
                </Typography>
              ) : (
                title === 'Tests' ? (
                  <Typography className='infoBox__active' color='textSecondary'>
                    {numeral(others.tests / others.population).format('0.000%')} Test on Population
                  </Typography>
                ) : (
                <Typography className="infoBox__active" color="textSecondary">
                  {numeral((others.deaths / others.cases)).format('0.000%')} Mortality Rate
                </Typography>
                )
              )
          )
        }
      </CardContent>
    </Card>
  );
}

export default InfoBox;