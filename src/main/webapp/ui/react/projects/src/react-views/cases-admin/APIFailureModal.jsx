import React from 'react';
import PropTypes from 'prop-types';
import Modal, {Header, Dismiss, Title, Footer} from
  '../common/components/bootstrap/ReactBootstrapModal.jsx';
import {messages} from '../common/constants/ComponentConstants'

export default class APIFailureModal extends React.Component {
  /**
   *
   * @desc - Proptypes and default props
   *
   **/
  static defaultProps = {
    failurePromise: null,
    failureMessage: messages.failure
  }
  static propTypes = {
    failurePromise: PropTypes.oneOfType([ PropTypes.instanceOf(Promise) ])
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
    let {failurePromise} = this.props;
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
  componentWillReceiveProps({failurePromise}) {
    this.resolveFailurePromise(failurePromise);
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
  * @desc - Close edit modal for fields
  * @returns {void}
  *
  **/
  closeModal = () => this.setState({showModal: false});

  render() {
    let {state: {showModal}} = this;


    return (
      <Modal backdrop="static" show={showModal} onHide={this.closeModal}>
        <Header className=" modal-danger " {...{closeButton: true}}>
          <h1 className="white"> Error </h1>
        </Header>

        <div className="modal-body">
          <p>
            <img src="../images/folderdoh.jpg" alt="sad folder" />
          </p>
          <div className="modal-body">
            <p>
              <div dangerouslySetInnerHTML={{__html: this.props.failureMessage}} />
            </p>
          </div>
          <br/>
          <br/>
        </div>

        <Footer>
          <Dismiss className="left btn btn-danger ">
            OK
          </Dismiss>
        </Footer>
      </Modal>
    );
  }
}
