import { AppBar, Box, MuiThemeProvider, createMuiTheme, Container, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { Fonts } from '../utils';
import { AboutScreen } from './about/AboutScreen';
import { FirstAlgorithmScreen } from './first-algorithm/FirstAlgorithmScreen';
import { SecondAlgorithmScreen } from './second-algorithm/SecondAlgorithmScreen';
import { InfoModal } from './InfoModal'

const Wrapper = styled.div`
  display:flex;
  width:100%;
  height:100%;
  flex-direction:row;
`

interface ContentWrapperProps {
  hidden: boolean
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  display:${props => props.hidden ? 'none' : 'flex'};
  width:100%;
  height:100%;
  flex-grow:1;
  padding:20px 100px;
  box-sizing:border-box;
`

const StyledTabs = styled(Tabs)`
  height:100%;
  width:200px;
  flex-shrink:0;
  padding-top:20px;
  padding-right:15px;
  box-sizing:border-box;
  color:white;
`

const theme = createMuiTheme({});


interface State {
  openedTab: number
}

export class RootScreen extends React.Component<any, State> {

  public constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      openedTab: 0
    }
  }

  public componentDidMount() {

  }

  public handleChange(event: React.ChangeEvent<{}>, value: number) {
    if (this.state.openedTab !== value && [0, 1, 2].includes(value)) {
      this.setState({
        openedTab: value
      });
    }
  }

  public render() {
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>

          <Fonts />
          <Box boxShadow={3} bgcolor={"primary.main"}>
            <StyledTabs orientation={'vertical'} value={this.state.openedTab} onChange={this.handleChange}>
              <Tab label="Первый алгоритм" />
              <Tab label="Второй алгоритм" />
              <Tab label="О приложении" />
            </StyledTabs>
          </Box>
          <ContentWrapper hidden={this.state.openedTab !== 0}>
            <FirstAlgorithmScreen></FirstAlgorithmScreen>
          </ContentWrapper>
          <ContentWrapper hidden={this.state.openedTab !== 1}>
            <SecondAlgorithmScreen></SecondAlgorithmScreen>
          </ContentWrapper>
          <ContentWrapper hidden={this.state.openedTab !== 2}>
            <AboutScreen></AboutScreen>
          </ContentWrapper>
        </Wrapper>
        <InfoModal />
      </ThemeProvider>
    );
  }
}
