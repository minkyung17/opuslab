import React from 'react';
import PropTypes from 'prop-types';

import Modal, {Header, Title, Body, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';

/**********************************************************************
*
* @desc - React JSX modal that abstracts all the commonalities for all
* the modals in CaseFlow
*
************************************************************************/
export default class BaseModal extends React.Component {
  /**
  *
  * @desc - State vars
  *
  **/
  static defaultProps = {
    showModal: false
  }
  static propTypes = {
    nextModal: PropTypes.string,
    previousModal: PropTypes.string,
    showModal: PropTypes.bool,
    changeCurrentModalInGlobalState: PropTypes.func
  }


  /**
  *
  * @desc - State vars
  *
  **/
  state = {
    disableNextButton: true,
    showModal: this.props.showModal
  }

  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @return {void}
   *
  **/
  componentWillReceiveProps({showModal} = {}) {
    this.setState({showModal});
  }

  /**
  *
  * @desc - sets next modal by name
  * @param {String} newCurrentModal - name of next modal
  * @return {void}
  *
  **/
  setNextModalInGlobalState(newCurrentModal) {
    this.props.nextModal(newCurrentModal);
  }

  /**
  *
  * @desc - Lets reset the modal to blank
  * @param {String} nullValue - name of next modal
  * @return {void}
  *
  **/
  resetModalFlow = (nullValue = null) => {
    this.props.changeCurrentModalInGlobalState(nullValue);
  };


  /**
  *
  * @desc - does what it says
  * @return {void}
  *
  **/
  closeModal = () => {
    this.props.changeCurrentModalInGlobalState(null);
    this.setState({showModal: false});
  }

  /**
  *
  * @desc -
  * @return {JSX} -
  *
  **/
  getModalBody() {
    return(<div> Forgot the 'getModalBody()' function ;-)</div>);
  }


  /**
  *
  * @desc - gets the header
  * @param {Object} - args
  * @return {JSX} - header jsx
  *
  **/
  getModalHeader({title, closeButton = true} = {}) {
    return(
      <Header className=" modal-info " {...{closeButton}}>
        <h1 className="modal-title" id="ModalHeader">
          <img src={this.getImagePath()} className="modal-header-icon"
            alt="case icon" />
          &nbsp; &nbsp; {title}
        </h1>
      </Header>
    );
  }

  /**
  *
  * @desc - gets the img path default
  * @return {String} - img path
  *
  **/
  getImagePath() {
    return '../images/case.png';
  }

  /**
  *
  * @desc - resets the ModalConductor to new modal
  * @return {void} -
  *
  **/
  onClickNext = () => {
    let {changeCurrentModalInGlobalState} = this.props;
    changeCurrentModalInGlobalState(this.nextModal || this.props.nextModal);
  }

  /**
  *
  * @desc - Determines which modal to go to when clicking back button
  * @return {void}
  *
  **/
  onClickBack = () => {
    let {previousModal, changeCurrentModalInGlobalState} = this.props;
    changeCurrentModalInGlobalState(previousModal);
  }

  /**
  *
  * @desc -
  * @param {Object} -  props
  * @return {JSX} -
  *
  **/
  getModalFooter({disableNextButton = true} = {}) {
    return (
      <Footer>
        {/* <Dismiss className="btn btn-default">Cancel</Dismiss> */}
        <button className="btn btn-primary left" onClick={this.onClickBack}>
          <span className=" icon-left wizard " />
          Back
        </button>
        <button className="btn btn-primary left" disabled={disableNextButton}
          onClick={this.onClickNext}>
          <span className=" icon-right wizard icon-position " />
          Next
        </button>
      </Footer>
    );
  }

  /**
  *
  * @desc -
  * @return {void} -
  *
  **/
  render() {
    let {state: {showModal, disableNextButton}, closeModal} = this;
    let header = this.getModalHeader({title: 'Start a Case'});
    let body = this.getModalBody();
    let footer = this.getModalFooter({disableNextButton});

    return(
      <Modal backdrop="static" ref="modal" show={showModal}
        onHide={closeModal}>
        {header}
        <Body> {body} </Body>
        {footer}
      </Modal>
    );
  }
}
