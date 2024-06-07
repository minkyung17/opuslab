import React from 'react';
import PropTypes from 'prop-types';

//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../common/components/bootstrap/ReactBootstrapModal.jsx';
import {ShowIf} from '../common/components/elements/DisplayIf.jsx';
import {messages} from '../common/constants/ComponentConstants'
/******************************************************************************
 *
 * @desc - Success Modal for delete, withdraw, reopen, merge
 *
 ******************************************************************************/
export default class CasesAdminSuccessModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
  static propTypes = {
    showSuccessModal: PropTypes.bool,
    redirectUrl: PropTypes.string,
    comingFromDatatable: PropTypes.bool,
    changeStateOfSuccessModal: PropTypes.func,
    casesAdminTypeStringValue: PropTypes.string
  }

  static defaultProps = {
  }

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Modal
   *
   **/
  constructor(props = {}) {
    super(props);
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    showSuccessModal: false,
    redirectUrl: '',
    showSuccessButton: false,
    dismissModalText: "OK",
    dismissModalClass: "success",
    casesAdminTypeBodyText: ''
  };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props coming in
   * @return {void}
   *
   **/
  componentWillReceiveProps(props) {
    this.setState({showSuccessModal: props.showSuccessModal})
    if(props.comingFromDatatable){
      // If coming from completed cases datatable
        this.setState({
          showSuccessButton: true,
          successButtonText: 'Go To Case Summary',
          redirectUrl: props.redirectUrl,
          dismissModalClass: "link"
        })
        if(props.deleteOnly){
          this.setState({dismissModalText: "Back to Withdrawn Cases"})
        }else{
          this.setState({dismissModalText: "Back to Completed Cases"})
        }
    }
    this.setState({casesAdminTypeBodyText: messages[props.casesAdminTypeStringValue]})
    // Coming from delete or withdraw
    if(this.props.casesAdminTypeStringValue==='delete'
    || this.props.casesAdminTypeStringValue==='withdraw'){
      this.setState({
        showSuccessButton: false,
        dismissModalText: "OK",
        dismissModalClass: "success"
      })
    }
  }

  /**
  *
  * @desc - Hides success modal
  * @return {void}
  *
  **/
  dismissSuccessModal = () => {
    this.props.changeStateOfSuccessModal();
  };

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
  render() {
    let {redirectUrl: href, showSuccessModal,
      showSuccessButton, successButtonText, dismissModalText, dismissModalClass} = this.state;

    return (
      <Modal show={showSuccessModal} onHide={this.dismissSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Success! </h1>
        </Header>
        <Body>
          <p> <img src="../images/happydossier-small.png" alt="happy folder" /> </p>
          {this.state.casesAdminTypeBodyText} <br/> <br/>
        </Body>
        <Footer>
          <ShowIf show={showSuccessButton}>
            <a {...{href}} className="white left btn btn-success" target="_blank" >
              {successButtonText}
            </a>
          </ShowIf>
          <button className={"left btn btn-"+dismissModalClass} onClick={this.dismissSuccessModal}>
            {dismissModalText}
          </button>
        </Footer>
      </Modal>
    );
  }
}
