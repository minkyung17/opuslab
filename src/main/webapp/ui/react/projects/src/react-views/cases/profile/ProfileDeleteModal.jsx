import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';


//My imports
import * as util from '../../../opus-logic/common/helpers/';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';

export default class ProfileDeleteModal extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  **/
  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired
  }

  static defaultProps = {

  }

  /**
   *
   * @desc - Delete Confirmation Modal
   * @return {JSX} - jsx
   *
   **/
  getDeleteConfirmationModal() {
    return (
      <Modal backdrop="static" show={this.props.show} onHide={this.props.onHide}>
        <Header className=" modal-danger " closeButton>
          <h1 className=" white "> Warning </h1>
        </Header>
        <Body>
          <p>
            Are you sure?  You cannot undo this.
            <br />
            <br />
            Once this appointment is removed,
            any actions in progress will be marked as withdrawn.  Any approved
            actions that are not yet effective will not be visible on the Cases page.
          </p>
        </Body>
        <Footer>
          <Button onClick={this.props.onClickDelete}
            className="left btn btn-danger">Delete</Button>
          <Dismiss onHide={this.props.onHide} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  render() {
    return this.getDeleteConfirmationModal();
  }
}
