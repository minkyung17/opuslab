import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../common/components/bootstrap/ReactBootstrapModal.jsx";
import ToggleView from '../common/components/elements/ToggleView.jsx';
import {ULDisplay} from '../common/components/elements/SimpleDisplays.jsx';

/******************************************************************************
 *
 * @desc - Admin Comp Proposal Revision Request modal
 *
 ******************************************************************************/
export default class AdminCompProposalRevisionsModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        showACProposalRevisionsModal: PropTypes.bool,
        reopenData: PropTypes.object,
        changeStateOfReopenModal: PropTypes.func
    }

    static defaultProps = {
        showACProposalRevisionsModal: false,
        reopenData: {}
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
        showACProposalRevisionsModal: false,
        adminName: "Someone",
        isRevisionButtonDisabled: false,
        revisionData: {
          dashboardRole: "",
          adminName: "",
          emplName: "",
          titleCodeDescription: "",
          organizationName: "",
          requestDate: moment().format("MM/DD/YYYY"),
          comments: ""
        }
  
    };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
    componentWillReceiveProps(props) {
        this.setState({showACProposalRevisionsModal: props.showACProposalRevisionsModal});
        // this.setState({reopenData: props.reopenData});
        this.setModalData(props);
    }

    setModalData = (props) => {
      let {revisionData, isRevisionButtonDisabled} = this.state;

      if(props.Logic){
        if(props.Logic.CasesAdminPermissions && props.Logic.CasesAdminPermissions.dashboardRole){
          revisionData.dashboardRole = props.Logic.CasesAdminPermissions.dashboardRole;
          revisionData.adminName = props.Logic.CasesAdminPermissions.adminData.adminName;
        }
        if(props.clonedAdminCompSummaryData && props.clonedAdminCompSummaryData.acPropComp){
          if(props.clonedAdminCompSummaryData.acPropComp.emplName){
              revisionData.emplName = props.clonedAdminCompSummaryData.acPropComp.emplName;
          }
          if(props.clonedAdminCompSummaryData.acPropComp.titleCodeDescription){
            revisionData.titleCodeDescription = props.clonedAdminCompSummaryData.acPropComp.titleCodeDescription;
          }
          if(props.clonedAdminCompSummaryData.acPropComp.organizationName){
            revisionData.organizationName = props.clonedAdminCompSummaryData.acPropComp.organizationName;
          }
          if(props.clonedAdminCompSummaryData.acPropComp.organizationName){
            revisionData.organizationName = props.clonedAdminCompSummaryData.acPropComp.organizationName;
          }
        }
      }
      // IOK-791 Reset comments field for revision data:
      revisionData.comments = null;
      this.setState({revisionData});

      if(props.isRevisionButtonDisabled!==isRevisionButtonDisabled){
        this.setState({isRevisionButtonDisabled: props.isRevisionButtonDisabled})
      }
    }

  /**
   *
   * @desc - Closes ReopenCase Modal
   * @returns {void}
   *
   **/
    closeACProposalRevisionsModal = () => {
        this.props.hideACProposalRevisionsModal();
    };

    editCommentFields = (e) => {
      let {revisionData} = this.state;
      revisionData.comments = e.target.value;
      this.setState({revisionData})
    }

      /**
   *
   * @desc - Update field data onBlur
   * @param {Event} event - event from onChange
   * @return {void}
   *
   **/
      onBlur = () => {
        console.log("onBlur")
    }

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {
      let {commentName, revisionData, 
        isRevisionButtonDisabled, showACProposalRevisionsModal} = this.state;
      return (
      <Modal show={showACProposalRevisionsModal}
        onHide={this.closeACProposalRevisionsModal}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title" id="ModalHeader">
            Request Revisions
          </h1>
        </Header>
        <Body>
          <p>
            Please enter your requested revisions below. A notification with your comments will be sent to the person who submitted the proposal.
          </p>
          <br/>
          <ToggleView showText={'Show Preview of Revision Request Notification'}
            hideText={'Hide Preview of Revision Request Notification'}>
            <div className="small" style={{marginLeft: "40px"}}>
              Dear Administrator, 
              <br/><br/>
              APO is requesting revisions to the administrative compensation proposal for {revisionData.emplName} for administrative duties in their role as {revisionData.titleCodeDescription} in {revisionData.organizationName}.
              <br/><br/>
              The following comments were entered by {revisionData.adminName} on {revisionData.requestDate}:
              <br/><br/>
              {revisionData.comments}
              <br/><br/>
              The proposal has been reverted to a status of "In Progress." Please edit the proposal and resubmit it.
              <br/><br/>
              Thank you,
              <br/><br/>
              Opus
              <br/><br/>
              UCLA's Academic Information System
              <br/>
              opus.ucla.edu
            </div>
          </ToggleView>
          <br/>
          <p>
            Once you request the revisions, the status of the proposal will revert to "In Progress" and you will <b>not</b> be able to request additional revisions until the proposal has been resubmitted.
          </p>
          <br/>
          <p>
            Requested Revisions
            <textarea {...{id: commentName, name: commentName, value: revisionData.comments, disabled: false, onChange: this.editCommentFields, onBlur: this.onBlur}}
              className={` form-control  `}/>
          </p>
        </Body>
        <Footer>
          <button className="left btn btn-primary"
            disabled={isRevisionButtonDisabled}
            onClick={() => this.props.sendRevisionRequest(revisionData)}>
            Send Revision Request</button>
          <Dismiss onClick={this.closeACProposalRevisionsModal} className=" left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }
}
