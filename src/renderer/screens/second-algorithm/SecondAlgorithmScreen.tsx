import { Button, CircularProgress, TextField, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Dispatch } from 'redux';
import styled, { withTheme } from 'styled-components';

import { FirstAlgorithmParams, SecondAlgorithmParams, BrownianMotionResult } from '../../models';
import { StartSecondAlgorithm, StopSecondAlgorithm, SetSecondAlgorithmParams } from '../../store/Actions';
import { RootState } from '../../store/RootReducer';
import {
  secondAlgorithmLoadingSelector,
  secondAlgorithmParamsSelector,
  secondAlgorithmResultSelector,
} from '../../store/Selectors';


const Wrapper = styled.div`
  display:flex;
  width:100%;
  height:100%;
  flex-direction:row;
  align-items:stretch;
  justify-content:flex-start;
  padding:50px 0px;
  box-sizing:border-box;
`

const SettingsWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  flex-grow:1;
  flex-basis:100%;
`

const SettingWrapper = styled.div`
  padding:20px 0px;
  display:flex;
  justify-content:center;
  align-items:center;
  min-width:250px;
`
const ResultItemWrapper = styled.div`

`

const ResultWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  flex-grow:1;
  flex-basis:100%;
  box-sizing:border-box;
`

const StyledButton = styled(Button)`
 min-width:200px !important;
`

interface StateFromProps {
  params: SecondAlgorithmParams;
  result: BrownianMotionResult;
  loading: boolean
}

interface DispatchFromProps {
  setParams: (step: SecondAlgorithmParams) => void;
  start: () => void;
  stop: () => void;
}

interface ThemeProps {
  theme: any
}

type Props = DispatchFromProps & StateFromProps & ThemeProps

class SecondAlgorithmScreenInternal extends React.Component<Props> {
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  public onSubmit() {
    this.props.start();
  }

  public onStop() {
    this.props.stop();
  }

  public render() {
    return (
      <Wrapper>
        <SettingsWrapper>
          <SettingWrapper>
            <Typography variant="h5" color="textPrimary">
              Параметры
            </Typography>
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="H_param"
              variant="outlined"
              label="Параметр H"
              type={'number'}
              value={this.props.params.HParam}
              onChange={(e) => this.props.setParams({ ...this.props.params, HParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="Tetta_param"
              variant="outlined"
              label="Параметр Tetta"
              type={'number'}
              value={this.props.params.TettaParam}
              onChange={(e) => this.props.setParams({ ...this.props.params, TettaParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <Tooltip title="Максиммальное время вычисления в секундах">
              <TextField
                id="timeout"
                variant="outlined"
                label="Max. время (сек)"
                type={'number'}
                value={this.props.params.timeoutSeconds}
                onChange={(e) => this.props.setParams({ ...this.props.params, timeoutSeconds: e.target.value })}
              />
            </Tooltip>
          </SettingWrapper>
          <SettingWrapper>
            <StyledButton variant="contained" color="primary" onClick={() => this.onSubmit()} disabled={this.props.loading}>
              {this.props.loading ? <CircularProgress size={24} color="secondary" /> : "Рассчитать"}
            </StyledButton>
          </SettingWrapper>
          <SettingWrapper>
            <StyledButton variant="contained" color="secondary" onClick={() => this.onStop()} disabled={!this.props.loading}>
              Стоп
            </StyledButton>
          </SettingWrapper>
        </SettingsWrapper>
        <ResultWrapper>
          {
            this.props.result &&
              this.props.result.x &&
              this.props.result.y &&
              this.props.result.x.length > 0 &&
              this.props.result.x.length <= this.props.result.y.length ?
              <ResponsiveContainer width="99%" height={600}>
                <LineChart
                  height={600}
                  data={
                    this.props.result.x.map((item:number, index:number) => ({
                      x: item.toFixed(2),
                      y: this.props.result.y![index]
                    }))
                  } >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Line type="monotone" dataKey="y" dot={false} stroke={this.props.theme.palette.secondary.main} />
                </LineChart>
              </ResponsiveContainer> :
              null
          }
          <SettingWrapper>
            <StyledButton variant="contained" color="secondary" onClick={() => this.onStop()} disabled={!this.props.loading}>
              Стоп
            </StyledButton>
          </SettingWrapper>
        </ResultWrapper>
      </Wrapper>
    );
  }
}

function mapStateToProps(state: RootState): StateFromProps {
  return {
    loading: secondAlgorithmLoadingSelector(state),
    params: secondAlgorithmParamsSelector(state),
    result: secondAlgorithmResultSelector(state)
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
    setParams: (params: SecondAlgorithmParams) => dispatch(SetSecondAlgorithmParams(params)),
    start: () => dispatch(StartSecondAlgorithm()),
    stop: () => dispatch(StopSecondAlgorithm())
  };
}

export const SecondAlgorithmScreen = connect(mapStateToProps, mapDispatchToProps)(withTheme(SecondAlgorithmScreenInternal));
