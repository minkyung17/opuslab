import React from 'react';
import PropTypes from 'prop-types';

//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../common/components/bootstrap/ReactBootstrapModal.jsx';
import {ShowIf} from '../common/components/elements/DisplayIf.jsx';
import {messages} from '../common/constants/ComponentConstants'
/******************************************************************************
 *
 * @desc - Success Modal for delete
 *
 ******************************************************************************/
export default class CompensationSuccessModal extends React.Component {

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
    compensationStringValue: PropTypes.string
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
    compensationBodyText: ''
  };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props coming in
   * @return {void}
   *
   **/
  componentWillReceiveProps(props) {
    this.setState({existingProposals: props.existingProposals})
    this.setState({empName: props.empName})
    this.setState({showSuccessModal: props.showSuccessModal})
    this.setState({compensationBodyText: messages[props.compensationStringValue]})
    // Coming from deleteProposal or deleteAllocation
    if(this.props.compensationStringValue==='deleteProposal'
        || this.props.compensationStringValue==='deleteAllocation'
        || this.props.compensationStringValue==='save'
        || this.props.compensationStringValue==='submit'
        || this.props.compensationStringValue==='completeProposalFinalDecision'){
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
      showSuccessButton, successButtonText, dismissModalText, dismissModalClass, existingProposals, empName} = this.state;
      var text = "";
      if(existingProposals != null && existingProposals != undefined){
        text = existingProposals;
      }      

    return (
      <Modal show={showSuccessModal} onHide={this.dismissSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Success! </h1>
        </Header>
        <Body>
          <p> <img src="../images/happydossier-small.png" alt="happy folder" /> </p>
          {this.state.compensationBodyText} <br/> <br/>
          <ShowIf show={this.state.compensationBodyText=='Your proposal has been submitted for review.' && text == ""}>
            <p>
              Action Required:<br/><br/>
              <img src="../images/warning.png" /> Submit appointment letters to AAPO for review. <br/>
              <img src="../images/warning.png" /> Submit exception requests to AAPO, if applicable.  <br/> <br/>
            </p>
          </ShowIf>
          <ShowIf show={this.state.compensationBodyText=='Your proposal has been submitted for review.' && text !== ""}>
            <p>
            Action Required:<br/><br/>
              <img src="../images/warning.png" /> Submit appointment letters to AAPO for review. <br/>
              <img src="../images/warning.png" /> Submit exception requests to AAPO, if applicable.  <br/> <br/>
              There are other administrative compensation proposals for {empName} within the same academic year. <br/><br/>
              {text.split("\n").map((i,key) => {
                return <div key={key}><ul><li>{i}</li></ul></div>;
              })}
              Units must consult with one another to ensure that appointments/compensation are reflected properly and are in compliance with university protocols and guidelines.
            </p>
          </ShowIf>          
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
