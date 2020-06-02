import { Button, CircularProgress, TextField, Tooltip, Typography } from '@material-ui/core';
import { BrowserWindow, ipcRenderer, remote, SaveDialogReturnValue } from 'electron';
import FileSaver from 'file-saver';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Dispatch } from 'redux';
import styled, { withTheme } from 'styled-components';

import { BrownianMotionResult, FirstAlgorithmParams, IpcEvents } from '../../models';
import { SetFirstAlgorithmParams, StartFirstAlgorithm, StopFirstAlgorithm } from '../../store/Actions';
import { RootState } from '../../store/RootReducer';
import {
  firstAlgorithmLoadingSelector,
  firstAlgorithmParamsSelector,
  firstAlgorithmResultSelector,
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

const ResultWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  flex-grow:1;
  flex-basis:100%;
  box-sizing:border-box;
`

const ResultActionsWrapper = styled.div`
  padding:20px 0px;
  display:flex;
  justify-content:space-evenly;
  align-items:center;
  align-self:center;
  width:100%;
`

const StyledButton = styled(Button)`
 min-width:200px !important;
`

interface StateFromProps {
  params: FirstAlgorithmParams;
  result: BrownianMotionResult;
  loading: boolean
}

interface DispatchFromProps {
  setParams: (step: FirstAlgorithmParams) => void;
  start: () => void;
  stop: () => void;
}

interface ThemeProps {
  theme: any
}

type Props = DispatchFromProps & StateFromProps & ThemeProps

class FirstAlgorithmScreenInternal extends React.Component<Props> {
  private currentChart: LineChart | undefined;

  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onSaveImage = this.onSaveImage.bind(this);
    this.onSaveData = this.onSaveData.bind(this);
  }

  public onSubmit() {
    this.props.start();
  }

  public onStop() {
    this.props.stop();
  }

  
  public onSaveImage() {
    if (this.currentChart == null) {
      return;
    }

    let chartSVG = (ReactDOM.findDOMNode(this.currentChart) as Element).children![0];

    let svgURL = new XMLSerializer().serializeToString(chartSVG);
    let svgBlob = new Blob([svgURL], { type: "image/svg+xml;charset=utf-8" });
    FileSaver.saveAs(svgBlob, "FirstAlgorithmImage.svg");
  }

  public onSaveData() {
    const win: BrowserWindow = remote.getCurrentWindow();
    remote.dialog.showSaveDialog(win, {
      defaultPath: 'FirstAlgorithmData.json'
    }).then((value: SaveDialogReturnValue) => {
      if (value.filePath != null) {
        ipcRenderer.send(IpcEvents.CopyFile, this.props.result.filePath, value.filePath)
      }
    });
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
              id="T_param"
              variant="outlined"
              label="Параметр T"
              type={'number'}
              value={this.props.params.TParam}
              onChange={(e) => this.props.setParams({ ...this.props.params, TParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="M_param"
              variant="outlined"
              label="Параметр M"
              type={'number'}
              value={this.props.params.MParam}
              onChange={(e) => this.props.setParams({ ...this.props.params, MParam: e.target.value })}
            />
          </SettingWrapper>
          <SettingWrapper>
            <TextField
              id="m_param"
              variant="outlined"
              label="Параметр m"
              type={'number'}
              value={this.props.params.mParam}
              onChange={(e) => this.props.setParams({ ...this.props.params, mParam: e.target.value })}
            />
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
                  ref={(chart: LineChart) => this.currentChart = chart}
                  data={
                    this.props.result.x.map((item: number, index: number) => ({
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
          <ResultActionsWrapper>
            {
              (this.props.result != null && this.props.result.x != null && this.props.result.x.length !== 0) &&
              <StyledButton variant="outlined" color="primary" onClick={() => this.onSaveImage()} disabled={!this.props.result || !this.props.result.x || !this.props.result.x.length}>
                Сохранить изображение
              </StyledButton>
            }
            {
              (this.props.result != null && this.props.result.filePath != null && this.props.result.filePath != '') &&
              <StyledButton variant="outlined" color="primary" onClick={() => this.onSaveData()} disabled={!this.props.result || !this.props.result.filePath}>
                Сохранить данные
              </StyledButton>
            }
          </ResultActionsWrapper>
        </ResultWrapper>
      </Wrapper>
    );
  }
}

function mapStateToProps(state: RootState): StateFromProps {
  return {
    loading: firstAlgorithmLoadingSelector(state),
    params: firstAlgorithmParamsSelector(state),
    result: firstAlgorithmResultSelector(state)
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
    setParams: (params: FirstAlgorithmParams) => dispatch(SetFirstAlgorithmParams(params)),
    start: () => dispatch(StartFirstAlgorithm()),
    stop: () => dispatch(StopFirstAlgorithm())
  };
}

export const FirstAlgorithmScreen = connect(mapStateToProps, mapDispatchToProps)(withTheme(FirstAlgorithmScreenInternal));
