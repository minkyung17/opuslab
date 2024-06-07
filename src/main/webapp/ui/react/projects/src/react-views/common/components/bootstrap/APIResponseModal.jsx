import React from 'react';
import PropTypes from 'prop-types';
import Modal, {Header, Dismiss, Title, Footer} from
  './ReactBootstrapModal.jsx';
import {messages} from '../../constants/ComponentConstants'

export const Success = ({children} = {}) => {
  return (
    <div className="modal-body">
      <p> <img src="../images/happydossier-small.png" alt="happy folder" /> </p>
      {children}
      <br/>
      <br/>
    </div>
  );
};

export const Failure = ({children} = {}) => {
  return (
    <div className="modal-body">
      <p> <img src="../images/folderdoh.jpg" alt="sad folder" /> </p>
      {children}
      <br/>
      <br/>
    </div>
  );
};

export const Custom = ({children} = {}) => {
  return (<div className="modal-body"> {children} </div>);
};


export default class APIResponseModal extends React.Component {
  /**
   *
   * @desc - Proptypes and default props
   *
   **/
  static defaultProps = {
    promise: null,
    showChildren: false,
    failurePromise: null,
    failureMessage: messages.failure,
    successMessage: messages.success,
    message: null,
    onDismissClick: null,
    onFailureFunc: () => {}
  }
  static propTypes = {
    message: PropTypes.string,
    onFailureFunc: PropTypes.func,
    showChildren: PropTypes.bool,
    successMessage: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
    promise: PropTypes.oneOfType([ PropTypes.instanceOf(Promise), PropTypes.object ]),
    failurePromise: PropTypes.oneOfType([ PropTypes.instanceOf(Promise), PropTypes.object ])
  }

  /**
   *
   * @desc - State and class varibales
   *
   **/
  state = {
    showModal: false
  }

  componentDidMount() {
    let {promise, failurePromise} = this.props;
    this.resolvePromise(promise);
    this.resolveFailurePromise(failurePromise);
  }

  /**
   *
   * @desc - When receiving new promises lets initiate showing the modal to
   *  show if theres success or failure
   * @param {Object} - promise(shows on success or failure) or
   *  failurePromise(shows only on success)
   * @return {Object} - params needed for rowData call
   *
   **/
  componentWillReceiveProps({promise, failurePromise}) {
    this.resolvePromise(promise);
    this.resolveFailurePromise(failurePromise);
  }

  /**
   *
   * @desc - State variables that control css for when promise is resolved
   *
   **/
  defaultAPISuccess = {
    success: true,
    title: 'Success!',
    modalColorClass: ' modal-success ',
    footerButtonClass: ' left btn btn-success '
  };
  defaultAPIFailure = {
    success: false,
    title: 'Error',
    modalColorClass: ' modal-danger ',
    footerButtonClass: 'left btn btn-danger '
  };

  /**
  *
  * @desc - Show modal when promise resolves
  * @param {Promise} promise - failurePromise
  * @return {void}
  *
  **/
  resolvePromise = async (promise) => {
    if(promise && promise !== this.state.resolvedPromise) {
      try {
        await promise;
        this.setState({resolvedPromise: promise, showModal: true,
          ...this.defaultAPISuccess});
      } catch(err) {
        this.props.onFailureFunc();
        this.setState({resolvedPromise: promise, showModal: true,
          ...this.defaultAPIFailure});
      }
    }
  }

  /**
  *
  * @desc - Only shows modal if promise is successful
  * @param {Promise} failurePromise - failurePromise
  * @return {void}
  *
  **/
  resolveFailurePromise = async (failurePromise) => {
    if(failurePromise && failurePromise !== this.state.resolveFailurePromise) {
      try {
        await failurePromise;
        this.setState({resolveFailurePromise: failurePromise});
      } catch(err) {
        this.setState({resolveFailurePromise: failurePromise, showModal: true,
          ...this.defaultAPIFailure});
      }
    }
  }

  /**
  *
  * @desc - When it succeeds
  * @param {Object} - closeButton: if there should be an X on the upper corner
  *   to exit out of the modal
  * @return {JSX} - jsx
  *
  **/
  getHeader({closeButton = true} = {}) {
    let {title, modalColorClass} = this.state;
    return(
      <Header className={modalColorClass} {...{closeButton}}>
        <h1 className="white"> {title} </h1>
      </Header>
    );
  }

  /**
  *
  * @desc - If the promise succeeds
  * @return {JSX} - jsx
  *
  **/
  getSuccessModal({successMessage} = this.props) {
    return (<Success> <p>{successMessage}</p> </Success>);
  }

  /**
  *
  * @desc - If the promise fails
  * @return {JSX} - jsx
  *
  **/
  getFailureModal({failureMessage} = this.props) {
    return (<Failure> <p>{failureMessage}</p> </Failure>);
  }

  /**
   *
   * @desc - Get success or failure jsx
   * @param {Bool} isSuccessful - if the api call was a success or not
   * @return {JSX} - jsx
   *
   **/
  getModalBody(isSuccessful) {
    return isSuccessful ? this.getSuccessModal() : this.getFailureModal();
  }

  /**
  *
  * @desc - Close edit modal for fields
  * @returns {void}
  *
  **/
  closeModal = () => this.setState({showModal: false});

  /**
  *
  * @desc - Footer
  * @return {JSX} - jsx
  *
  **/
  getFooter() {
    return (
      <Footer>
        <Dismiss className={this.state.footerButtonClass}
          onClick={this.props.onDismissClick}>
          OK
        </Dismiss>
      </Footer>
    );
  }

  render() {
    let {state: {success, showModal}, props: {showChildren}} = this;
    let header = this.getHeader();
    let body = showChildren ? this.props.children : this.getModalBody(success);
    let footer = this.getFooter();

    return (
      <Modal backdrop="static" show={showModal} onHide={this.closeModal}>
        {header}
        {body}
        {footer}
      </Modal>
    );
  }
}
