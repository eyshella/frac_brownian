import React from 'react';
import { Typography, TextField } from '@material-ui/core';
import styled from 'styled-components';

const Wrapper = styled.div`
  display:flex;
  width:100%;
  height:100%;
`
export class SecondAlgorithmScreen extends React.Component {


  public render() {

    return (
      <Wrapper>
        <Typography variant="h5" color="textPrimary">
          Второй алгоритм (Не реализован)
        </Typography> 
      </Wrapper>
    );
  }
}
