import { Button, CircularProgress, TextField, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { CartesianGrid, Legend, LineChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import styled, { withTheme } from 'styled-components';

import { Point } from '../../models';
import { AlertUtils, TimerUtils } from '../../utils';
import { BrownianMotionCalculator } from '../../calculation';


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

interface State {
  isCalculationInProgress: boolean;
  sectionsAmount: string;
  mParam: string;
  MParam: string;
  HParam: string;
  timeoutSeconds: string;
  resultPoints: Array<Point>
}

class FirstAlgorithmScreenInternal extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      isCalculationInProgress: false,
      sectionsAmount: '1000',
      mParam: '10',
      MParam: '1000',
      HParam: '0.5',
      timeoutSeconds: '600',
      resultPoints: []
    }
  }

  public async onSubmit() {
    if (!this.state.isCalculationInProgress) {
      this.setState({
        isCalculationInProgress: true
      });

      const result: Array<Point> | boolean = await Promise.race([
        this.calculate(),
        TimerUtils.RunAsyncTimer((+this.state.timeoutSeconds) * 1000)
      ]);


      if (!Array.isArray(result)) {
        AlertUtils.ShowErrorAlert('Превышено максимальное время расчета. Попробуйте указать большее время.', 'Операция прервана!')
        this.setState({
          isCalculationInProgress: false
        });
        return;
      }

      this.setState({
        isCalculationInProgress: false,
        resultPoints: result
      });
    }
  }

  public async calculate(): Promise<Array<Point>> {
    // Wait for start spinner
    // TODO: Find better solution here
    await TimerUtils.RunAsyncTimer(1000);

    try {
      const result = await BrownianMotionCalculator.Calculate(+this.state.HParam, +this.state.sectionsAmount, +this.state.mParam, +this.state.MParam);
      return result;
    } catch (e) {
      AlertUtils.ShowErrorAlert(`Во время выполнения програмы возникла ошибка: ${e}`, 'Ошибка');
      return [];
    }
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
              id="number_sections"
              variant="outlined"
              label="Кол-во участков"
              type={'number'}
              value={this.state.sectionsAmount}
              onChange={(e) => this.setState({ sectionsAmount: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="M_param"
              variant="outlined"
              label="Параметр M"
              type={'number'}
              value={this.state.MParam}
              onChange={(e) => this.setState({ MParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="m_param"
              variant="outlined"
              label="Параметр m"
              type={'number'}
              value={this.state.mParam}
              onChange={(e) => this.setState({ mParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="H_param"
              variant="outlined"
              label="Параметр H"
              type={'number'}
              value={this.state.HParam}
              onChange={(e) => this.setState({ HParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <Tooltip title="Максиммальное время вычисления в секундах">
              <TextField
                id="timeout"
                variant="outlined"
                label="Max. время (сек)"
                type={'number'}
                value={this.state.timeoutSeconds}
                onChange={(e) => this.setState({ timeoutSeconds: e.target.value })}
              />
            </Tooltip>
          </SettingWrapper>
          <SettingWrapper>
            <StyledButton variant="contained" color="primary" onClick={() => this.onSubmit()} disabled={this.state.isCalculationInProgress}>
              {this.state.isCalculationInProgress ? <CircularProgress size={24} color="secondary" /> : "Рассчитать"}
            </StyledButton>
          </SettingWrapper>
        </SettingsWrapper>
        <ResultWrapper>
          {
            this.state.resultPoints && this.state.resultPoints.length > 0 ?
              <ResponsiveContainer width="99%" height={600}>
                <LineChart height={600} data={this.state.resultPoints} >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Line type="monotone" dataKey="y" dot={false} stroke={this.props.theme.palette.secondary.main} />
                </LineChart>
              </ResponsiveContainer> :
              null
          }
        </ResultWrapper>
      </Wrapper>
    );
  }
}

export const FirstAlgorithmScreen = withTheme(FirstAlgorithmScreenInternal);