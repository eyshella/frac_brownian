import { Button, CircularProgress, TextField, Tooltip, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { BrowserWindow, ipcRenderer, remote, SaveDialogReturnValue } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import { LineChart } from 'recharts';
import { Dispatch } from 'redux';
import styled, { withTheme } from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { SetFirstAlgorithmParams, StartFirstAlgorithm, StopFirstAlgorithm } from '../..//store/Actions';
import { FirstAlgorithmParams, IpcEvents, StochasticProcessData } from '../../models';
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
  padding:0px 0px;
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

const ResultWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  flex-grow:1;
  flex-basis:100%;
  box-sizing:border-box;
  justify-content:flex-start;
`

const ResultParamsWrapper = styled.div`
  padding:20px 0px;
  display:flex;
  justify-content:space-evenly;
  align-items:center;
  align-self:center;
  width:100%;
  flex-direction:column;
`

const StyledButton = styled(Button)`
 min-width:200px !important;
`

const ActionButton = styled(Button)`
 margin:20px 0px !important;
 min-width:100px !important;
 align-self:flex-end;
`

const PathsImage = styled.img`
  width:100%;
`

const StyledTableCell = styled(TableCell)`
  user-select:all;
`

interface StateFromProps {
  params: FirstAlgorithmParams;
  result: StochasticProcessData;
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

interface State {
  currentResultTab: number
}

type Props = DispatchFromProps & StateFromProps & ThemeProps

class FirstAlgorithmScreenInternal extends React.Component<Props, State> {
  private currentChart: LineChart | undefined;

  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onSaveImage = this.onSaveImage.bind(this);
    this.onSaveData = this.onSaveData.bind(this);
    this.state = {
      currentResultTab: 0
    }
  }

  public onSubmit() {
    this.props.start();
  }

  public onStop() {
    this.props.stop();
  }


  public onSaveImage(path: string, defaultName: string = 'image.png') {
    const win: BrowserWindow = remote.getCurrentWindow();
    remote.dialog.showSaveDialog(win, {
      defaultPath: defaultName
    }).then((value: SaveDialogReturnValue) => {
      if (value != null && !value.canceled && value.filePath != null && this.props.result.image != null) {
        ipcRenderer.send(IpcEvents.CopyFile, path, value.filePath)
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
            <TextField
              id="ParamsT"
              variant="outlined"
              label="Разбиение параметров"
              type={'number'}
              value={this.props.params.ParamsT}
              onChange={(e) => this.props.setParams({ ...this.props.params, ParamsT: e.target.value })}
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
        {
          this.props.result.paths.length > 0 &&
          <ResultWrapper>
            <Tabs
              value={this.state.currentResultTab}
              onChange={(event: React.ChangeEvent<{}>, value: number) => {
                this.setState({ currentResultTab: value });
              }}
              aria-label="simple tabs example"
            >
              <Tab label="Траектории" />
              <Tab label="Ковариация" />
              <Tab label="Среднее" />
            </Tabs>
            {
              this.state.currentResultTab === 0 &&
              <>
                {
                  this.props.result.image && this.props.result.image.base64 ?
                    <PathsImage src={`data:image/png;base64,${this.props.result.image.base64}`} /> :
                    null
                }
                {
                  (this.props.result.image && this.props.result.image.filePath) &&
                  <ActionButton variant="outlined" color="primary" onClick={() => this.onSaveImage(this.props.result.image!.filePath)} disabled={!this.props.result.image || !this.props.result.image.filePath}>
                    Сохранить график
                  </ActionButton>
                }
                {
                  (this.props.result.paths && this.props.result.paths.length !== 0) &&
                  <ActionButton variant="outlined" color="primary" onClick={() => this.onSaveData()} disabled={!this.props.result.paths || this.props.result.paths.length === 0}>
                    Сохранить данные
                  </ActionButton>
                }
              </>
            }

            {
              this.props.result.params != null && this.state.currentResultTab === 1 &&
              <ResultParamsWrapper>
                {
                  this.props.result.params && this.props.result.params.covariance && this.props.result.params.covariance.base64 ?
                    <PathsImage src={`data:image/png;base64,${this.props.result.params.covariance.base64}`} /> :
                    null
                }
                {
                  (this.props.result.params && this.props.result.params.covariance && this.props.result.params.covariance.filePath) &&
                  <ActionButton variant="outlined" color="primary" onClick={() => this.onSaveImage(this.props.result.params!.covariance.filePath, 'covariance.png')} disabled={!this.props.result.paths || this.props.result.paths.length === 0}>
                    Сохранить ковариацию
                </ActionButton>
                }
              </ResultParamsWrapper>
            }
            {
              this.props.result.params != null && this.state.currentResultTab === 2 &&
              <ResultParamsWrapper>
                {
                  this.props.result.params && this.props.result.params.mean && this.props.result.params.mean.base64 ?
                    <PathsImage src={`data:image/png;base64,${this.props.result.params.mean.base64}`} /> :
                    null
                }
                {
                  (this.props.result.params && this.props.result.params.mean && this.props.result.params.mean.base64) &&
                  <ActionButton variant="outlined" color="primary" onClick={() => this.onSaveImage(this.props.result.params!.mean.filePath, 'mean.png')} disabled={!this.props.result.paths || this.props.result.paths.length === 0}>
                    Сохранить среднее
                </ActionButton>
                }
              </ResultParamsWrapper>
            }
          </ResultWrapper>
        }
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
