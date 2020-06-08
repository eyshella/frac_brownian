import { Button, CircularProgress, TextField, Tooltip, Typography } from '@material-ui/core';
import { BrowserWindow, ipcRenderer, remote, SaveDialogReturnValue } from 'electron';
import FileSaver from 'file-saver';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Dispatch } from 'redux';
import styled, { withTheme } from 'styled-components';
import * as svgSaver from 'save-svg-as-png';

import { StochasticProcessData, IpcEvents, SecondAlgorithmParams } from '../../models';
import { SetSecondAlgorithmParams, StartSecondAlgorithm, StopSecondAlgorithm } from '../../store/Actions';
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
  flex-basis:50%;
`

const SettingWrapper = styled.div`
  padding:20px 0px;
  display:flex;
  justify-content:center;
  align-items:center;
  min-width:250px;
`
const ResultActionsWrapper = styled.div`
  padding:20px 0px;
  display:flex;
  justify-content:space-evenly;
  align-items:center;
  align-self:center;
  width:100%;
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

const ActionButton = styled(Button)`
 min-width:100px !important;
`

const PathsImage = styled.img`
  width:100%
`

interface StateFromProps {
  params: SecondAlgorithmParams;
  result: StochasticProcessData;
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
    const win: BrowserWindow = remote.getCurrentWindow();
    remote.dialog.showSaveDialog(win, {
      defaultPath: 'image.png'
    }).then((value: SaveDialogReturnValue) => {
      if (value != null && !value.canceled && value.filePath != null && this.props.result.image != null) {
        ipcRenderer.send(IpcEvents.CopyFile, this.props.result.image.filePath, value.filePath)
      }
    });
  }

  public onSaveData() {
    const win: BrowserWindow = remote.getCurrentWindow();
    remote.dialog.showSaveDialog(win, {
      defaultPath: 'data.zip'
    }).then((value: SaveDialogReturnValue) => {
      if (value != null && !value.canceled && value.filePath != null && this.props.result.paths && this.props.result.paths.length !== 0) {
        ipcRenderer.send(IpcEvents.CopyFilesAsZip, this.props.result.paths.map(item => item.filePath), value.filePath)
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
            <TextField
              id="numberOfPaths"
              variant="outlined"
              label="Количество траекторий"
              type={'number'}
              value={this.props.params.numberOfPaths}
              onChange={(e) => this.props.setParams({ ...this.props.params, numberOfPaths: e.target.value })}
            />
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
            this.props.result.image && this.props.result.image.base64 ?
              <PathsImage src={`data:image/png;base64,${this.props.result.image.base64}`} /> :
              null
          }
          <ResultActionsWrapper>
            {
              (this.props.result && this.props.result.image && this.props.result.image.filePath) &&
              <ActionButton variant="outlined" color="primary" onClick={() => this.onSaveImage()} disabled={!this.props.result || !this.props.result.image || !this.props.result.image.filePath}>
                Сохранить Png
              </ActionButton>
            }
            {
              (this.props.result && this.props.result.paths && this.props.result.paths.length !== 0) &&
              <ActionButton variant="outlined" color="primary" onClick={() => this.onSaveData()} disabled={!this.props.result || !this.props.result.paths || this.props.result.paths.length === 0}>
                Сохранить данные
              </ActionButton>
            }
          </ResultActionsWrapper>
        </ResultWrapper >
      </Wrapper >
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
