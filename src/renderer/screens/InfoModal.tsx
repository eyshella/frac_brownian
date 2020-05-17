import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@material-ui/core';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { RootState } from '../store/RootReducer';
import { infoModalDescriptionSelector, infoModalTitleSelector, isInfoModalOpenSelector } from '../store/Selectors';
import { CloseInfoModal } from '../store/Actions';


const StyledCard = styled(Card)`
  width:600px;
  max-height:200px;
  z-index:10;
`

const CenteredTypography = styled(Typography)`
  text-align:center;
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    width: '620px',
    backgroundColor:'transparent',
    background:'transparent',
    height: '220px',
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    padding: '10px',
  }
};
//boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)'

interface StateFromProps {
  isOpen: boolean,
  title: string;
  description: string;
}

interface DispatchFromProps {
  close: () => void;
}

type Props = StateFromProps & DispatchFromProps

export class InfoModalInternal extends React.Component<Props> {
  public render() {
    return (
      <Modal isOpen={this.props.isOpen} onRequestClose={this.props.close} style={customStyles}>
        <StyledCard>
          <CardHeader
            title={this.props.title}
          />
          <CardContent >
            <Typography color="textPrimary">
              {`${this.props.description}`}
            </Typography>
          </CardContent>
          <CardActions >
            <Button size="small" color="primary" onClick={() => this.props.close()}>
              Закрыть
            </Button>
          </CardActions>
        </StyledCard>
      </Modal>
    );
  }
}

function mapStateToProps(state: RootState): StateFromProps {
  return {
    isOpen: isInfoModalOpenSelector(state),
    title: infoModalTitleSelector(state),
    description: infoModalDescriptionSelector(state)
  }
}


function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
    close: () => dispatch(CloseInfoModal()),
  }
}

export const InfoModal = connect(mapStateToProps, mapDispatchToProps)(InfoModalInternal);