import React from 'react';
import { Grid, Card, CardContent, CardMedia, CardHeader, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Environment } from '../../../environments/environment';
import { shell } from 'electron'

const Wrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  height:100%;
  width:100%;
`

const StyledCard = styled(Card)`
  width:600px;
  height:600px;
`

const StyledCardMedia = styled(CardMedia)`
  margin:auto;
  width:400px;
  height:400px;
  opacity:0.8;
  transition:opacity .5s ease-in-out;
  cursor:pointer;
  &:hover{
    transition:opacity .5s ease-in-out;
    opacity:1;
    cursor:pointer;
  }
`

const CenteredTypography = styled(Typography)`
  text-align:center;
`

export class AboutScreen extends React.Component {


  public render() {

    return (
      <Wrapper>
        <StyledCard>
          <CardHeader
            title={`Fractional Brownian Motion ${Environment.Version}`}
            subheader={"Рагозин Роман Алексеевич"}
          />
          <StyledCardMedia
            onClick={(e: any) => {
              shell.openExternal('https://spbu.ru/');
            }}
            image="assets/icon.png"
          />
          <CardContent >
            <CenteredTypography color="textPrimary">
              Санкт-Петербургский государственный университет
            </CenteredTypography>
            <CenteredTypography color="textSecondary">
              2020 г.
            </CenteredTypography>
          </CardContent>
        </StyledCard>
      </Wrapper>
    );
  }
}
