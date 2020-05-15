
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button } from '@material-ui/core';
import { Fonts } from '../utils';
const Wrapper = styled.div`
  display:block;
  width:100%;
  height:100%;
`

export class RootScreen extends React.Component {

  public componentDidMount() {

  }

  public render() {

    return (
      <Wrapper>
        <Fonts />
        <Button color="secondary">Hello World</Button>
      </Wrapper>
    );
  }
}
