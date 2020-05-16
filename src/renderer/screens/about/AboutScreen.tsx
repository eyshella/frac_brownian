import React from 'react';
import { Grid, Card, CardContent, CardMedia, CardHeader, Typography } from '@material-ui/core';
import styled from 'styled-components';

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
            title={"Fractional Brownian Motion"}
            subheader={"Рагозин Роман Алексеевич"}
          />
          <StyledCardMedia
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
