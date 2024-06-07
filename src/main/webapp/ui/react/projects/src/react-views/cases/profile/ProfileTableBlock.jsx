import React from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import {keys, pick} from "lodash";

//My imports
import EditProfileModal from "./ProfileEditModal.jsx";
import ProfileDeleteModal from "./ProfileDeleteModal.jsx";
import * as util from "../../../opus-logic/common/helpers/";
import {ToolTip} from "../../common/components/elements/ToolTip.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import Profile from "../../../opus-logic/cases/classes/profile/Profile";
import ToggleView from "../../common/components/elements/ToggleView.jsx";
import APIModal from "../../common/components/bootstrap/APIResponseModal.jsx";
import {EditIcon, DeleteIcon, CommentIcon} from "../../common/components/elements/Icon.jsx";


import CommentModal from "../../common/components/bootstrap/CommentModal.jsx";
import {DisplayTable, DisplayTableHeader, VisibleDisplayTableBody}
  from "../../common/components/elements/DisplayTables.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";

/******************************************************************************
 *
 * @desc - Each table section using each appointment.
 * @param {Object} adminData- adminData
 * @param {Object} access_token - token for calls
 * @param {Object} globalData - globalData for options
 * @param {Object} appointment - appointment for this table
 *
 ******************************************************************************/

export default class ProfileTable extends React.Component {

  /**
  *
  * @desc - Proptypes for element
  **/
    static propTypes = {
        uid: PropTypes.string,
        Logic: PropTypes.object,
        comments: PropTypes.array,
        appointment: PropTypes.object,
        appointeeInfo: PropTypes.object,
        adminData: PropTypes.object.isRequired,
        setPersonProfileApiDataInGlobalState: PropTypes.func.isRequired,
        setDeleteAppointmentPromiseInGlobalState: PropTypes.func.isRequired
    }

    static defaultProps = {
        uid: null,
        comments: [],
        appointeeInfo: {}
    }

    constructor(props = {}) {
        super(props);
    }


    state = {
        affiliationCategory: "",
        comments: [],
        commentsText: "",
        editComments: "",
        showEditModal: false,
        showCommentModal: false,
        isSaveButtonDisabled: false,
        showDeleteWarningModal: false,
        showAffiliationWarningModal: false,
        showWarningModal: false
    }

  /**
   *
   * @desc - Table will be mounted so lets fill in the rows
   * @return {void}
   *
   **/
    componentWillMount() {
        this.setProfileFieldDataFromAppointment();
    }

  /**
   *
   * @desc - Table receiving props so lets rerender
   * @param {Object} - appointment
   * @return {void}
   *
   **/
    componentWillReceiveProps({appointment}) {
        this.setProfileFieldDataFromAppointment(appointment);
    }

  /**
   *
   * @desc - Table has been mounted so lets fill in the rows
   * @return {void}
   *
   **/
    componentDidUpdate() {
        util.initJQueryBootStrapToolTipandPopover();
    }

  //Class Variables
    Logic = new Profile(this.props);


  /**
   *
   * @desc - Get fieldData, title, sectionNames etc from appointment
   * @param {Object} appointment - appointment from API
   * @return {Object} - various table data
   *
   **/
    setProfileFieldDataFromAppointment(appointment = this.props.appointment) {
        let {fieldData, tableData, tableSectionNames, startingFieldData, tableTitle}
      = this.Logic.getProfileFieldDataFromAppointment(appointment);
        this.fieldData = fieldData;

    //Get if user can edit profile this appointment
        let canEditProfile = this.Logic.getCanEditProfile(appointment);

    //Get if user can delete profile this appointment
        let canDeleteProfile = this.Logic.getCanDeleteProfile(appointment);

    //Set data
        this.Logic.setClassData({fieldData, startingFieldData});

    // Find and set correct titleCode
        let titleCode = this.Logic.setCorrectTitleCode(tableData, fieldData);

    // Find affiliation category header
        let affiliationCategory = appointment.affiliationType.affiliation;

        let appointmentCommentCount = appointment.appointmentCommentCount;

        this.setState({tableTitle, tableData, tableSectionNames, canEditProfile,
      canDeleteProfile, startingFieldData, titleCode, affiliationCategory, appointmentCommentCount});
        this.renderFormFields(this.fieldData);

        return {fieldData, tableData, tableSectionNames, tableTitle};
    }

  /**
   *
   * @desc - Hide this modal
   * @return {void}
   *
   **/
    hideAffiliationWarningModal = () =>
    this.setState({showAffiliationWarningModal: false})

  /**
   *
   * @desc - Save fieldData & editComments that came back and save them in state
   *  to use to save to the API later
   * @param {Object} fieldData -
   * @param {Event} editComments -
   * @return {JSX} - jsx
   *
   **/
    transitionToAffiliationWarningModal = (fieldData, editComments) => {
        this.setState({fieldData, editComments, showAffiliationWarningModal: true,
      showEditModal: false});
    }

  /**
   *
   * @desc - Warning modal for Affiliation
   * @return {JSX} - jsx
   *
   **/
    getAffiliationWarningModal() {
        return (
      <Modal backdrop="static" onHide={this.closeDeleteCaseModal}
        show={this.state.showAffiliationWarningModal}>
        <Header className=" modal-warning " closeButton>
          <Title> <h1 className=" modal-title white "> Warning </h1> </Title>
        </Header>
        <Body>
          <p>
            If you changed the affiliation, please make sure to go back and
            make sure that at least one of the current appointments is primary,
            and that all the others are additional. Please update any other
            appointments (Joint or Split) impacted by this change.
          </p>
          <p>
            If you changed the Appointment Status,
            please make sure that other fields, such as the end date, are updated.
          </p>
        </Body>
        <Footer>
          <Button bsStyle="warning" className="left white"
            disabled={this.state.isAffiliationSaveButtonDisabled}
            onClick={this.saveCase}>
            Save
          </Button>
          <Dismiss onClick={this.hideAffiliationWarningModal}
            className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
   *
   * @desc - Delete case and reload the profile page
   * @return {void}
   *
   **/
    deleteCase = async () => {
    //Extract
        let {appointment, profileAPIData: {appointeeInfo}} = this.props;
        let promise = this.Logic.deleteProfileData(appointment, appointeeInfo);
        this.setState({showDeleteCaseModal: false});

    //Lets set delete appointment in state for the red error modal
        this.props.setDeleteAppointmentPromiseInGlobalState(promise);

    //Wait for promise to resolve
        await promise;

    //Now we can reload the page
        this.reloadProfile();
    }

  /**
   *
   * @desc - Hide the modal
   * @return {void}
   *
   **/
    closeDeleteCaseModal = () => this.setState({showDeleteCaseModal: false});

  /**
   *
   * @desc - Show the modal
   * @return {void}
   *
   **/
    showDeleteCaseModal = () => this.setState({showDeleteCaseModal: true});


  /**
   *
   * @desc - Warning modal for Affiliation
   * @return {JSX} - jsx
   *
   **/
    getDeleteConfirmationModal() {
        let {closeDeleteCaseModal, state: {showDeleteCaseModal}} = this;

        return (
      <ProfileDeleteModal show={showDeleteCaseModal} onHide={closeDeleteCaseModal}
        onClickDelete={this.deleteCase} />);
    }


  /**
   *
   * @desc - Show and hide appropriate modals and send the data to Logic to be
   *  saved
   * @return {void}
   *
   **/
    saveCase = async () => {
        let {fieldData, editComments} = this.state;

    //Hide edit modal and reenable save button for next time
        this.setState({showAffiliationWarningModal: true,
      isAffiliationSaveButtonDisabled: true});

    //let {fieldData, state: {editComments}} = this;
        let {props: {appointment, profileAPIData: {appointeeInfo}}} = this;
        let fieldDataClone = util.cloneObject(fieldData);

    //Get standalone promise
        let promise = this.Logic.saveProfileData(fieldDataClone, appointment,
      appointeeInfo, {comment: editComments});

    //Wait for promise to resolve
        try {
            await promise;
        } catch(e) {
            console.log("ERROR: api call in 'saveCase' in ProfileTableBlock.jsx");
            console.log(e);
        }

    //Save promise and state and get rid of red error
        this.setState({promise, showAffiliationWarningModal: false,
      isAffiliationSaveButtonDisabled: false});

        this.reloadProfile();
    }

  /**
   *
   * @desc - Sets profile data in glbal state which will cause a rerender
   * @return {void}
   *
   **/
    async reloadProfile() {
        let {opusPersonId, typeOfReq} = this.props;
        let profileAPIData = await this.Logic.getProfileDataByOpusId(opusPersonId, typeOfReq);
        this.props.setPersonProfileApiDataInGlobalState(profileAPIData);
    }

  /**
   *
   * @desc - guess :)
   * @return {void}
   *
   **/
    hideEditModal = () => {
        this.setState({showEditModal: false});
    }


  /**
   *
   * @desc - Edit Modal for Profile
   * @param {Array} comments - array of comments from API
   * @return {JSX} - jsx
   *
   **/
    getEditCaseModal() {
        let {props: {access_token, adminData, globalData}} = this;
        let {props: {profileAPIData, appointment}} = this;

        return (
      <EditProfileModal show={this.state.showEditModal} onHide={this.hideEditModal}
        {...{access_token, adminData, globalData, profileAPIData, appointment,
          onClickSave: this.transitionToAffiliationWarningModal}} />
    );
    }

  /**
   * TODO - DELETE this
   * @desc - Renders form fields in modal usually after value change
   * @param {Object} fieldData - current FieldData to turn to form fields
   * @param {Object} additionalState -
   * @return {void}
   *
   **/
    renderFormFields(fieldData = this.fieldData, additionalState = {}) {
        let {main, salary, appointment: apptFieldData} =
      this.Logic.getFieldDataBySection(fieldData);

        this.setState({formFields: fieldData, mainFields: main, salaryFields: salary,
      appointmentFields: apptFieldData, ...additionalState
    });
    }

  /**
   *
   * @desc - Gets comments from api and sets in state to rerender
   * @param {String} appointment - Gets comments from api and sets in state to rerender
   * @return {JSX} - Final Decision Comment Modal
   *
   **/
    async refreshComments(appointment = this.props.appointment) {
        this.setState({comments: []});
        let {appointmentId} = appointment;
        let comments = await this.Logic.getCommentsById(appointmentId);
        this.setState({comments, appointmentCommentCount: comments.length});
    }

  /**
   *
   * @desc - Save text comment to Profile
   * @param {String} commentsText - comments that user wants to save
   * @return {void} - jsx
   **/
    saveComment = async (commentsText) => {
        let {props: {appointment}} = this;
        this.setState({isCommentSaveButtonDisabled: true});
        let commentPromise = this.Logic.saveComment(commentsText, appointment);

        try{
            await commentPromise;
        } catch(e) { //If it fails show error modal and close comment modal
            console.log("ERROR: api call in 'saveComment' in ProfileTableBlock.jsx");
            this.setState({failurePromise: commentPromise, showCommentModal: false});
        }
        this.refreshComments();
        this.setState({commentsText: "", isCommentSaveButtonDisabled: false});
    }

  /**
   *
   * @desc - On Change that updates comments text to be save
   * @param {String} evt - comments that user wants to save
   * @return {void} - jsx
   *
   **/
    updateCommentsText = (evt) => {
        this.setState({commentsText: evt.target.value});
    }

    onCommentModalHide = () => this.setState({showCommentModal: false});

    showCommentModal = () => {
        this.refreshComments();
        this.setState({showCommentModal: true, commentsText: ""});
    }

  /**
   *
   * @desc - Each appointment for Profile
   * @param {Array} comments - array of comments from API
   * @return {JSX} - jsx
   *
   **/
    getCommentsModal(comments = this.state.comments) {
        let {state: {showCommentModal, commentsText}, saveComment, updateCommentsText,
      onCommentModalHide} = this;

        return (<CommentModal {...{comments}} show={showCommentModal}
      text={commentsText} onClickSave={saveComment} onHide={onCommentModalHide}
      updateComment={updateCommentsText} title={'Appointment Comments'}/>);
    }

  /**
   *
   * @desc - Several API response modals for different situations
   * @return {JSX} - jsx
   *
   **/
    getAPIResponseModals() {
        return (
      <div>
        <APIModal successMessage={`Your edits have been saved. An email
          notification will be sent to you and the appropriate department
          administrator. If you deleted the primary appointment, please review
          the current appointments and update one of them to primary. `}
        promise={this.state.deletePromise}/>
        <APIModal successMessage={`Your edits have been saved. An email
          notification will be sent to you and the appropriate department
          administrator.`} promise={this.state.promise} />
        <APIModal successMessage={`Your edits have been saved. An email
          notification will be sent to you and the appropriate department
          administrator.`} promise={this.state.failurePromise} />
      </div>);
    }

  /**
   *
   * @desc - Reset the fieldData from the original so we have the original fields
   * @param {Array} - array of comments from API
   * @return {JSX} - jsx
   *
   **/
    showEditModal = () => {
        this.setState({showEditModal: true});
    }


    // Unlink path position modal

    startUnlink = async () => {
        let {tableData} = this.state;
        if(tableData.positionNbr){
            tableData.positionNbr.buttonDisabled = true;
            this.setState({tableData});
        }

        let {appointment, profileAPIData: {appointeeInfo}} = this.props;
        let promise = this.Logic.unlinkPathPosition(appointment, appointeeInfo);
        this.setState({showWarningModal: false});

      //Wait for promise to resolve
        try {
            await promise;
        }
      catch (e) {
          console.log("ERROR: api call in 'startUnlink' in ProfileTableBlock.jsx");
          console.log(e);
          tableData.positionNbr.buttonDisabled = false;
          this.setState({tableData});
      }

      //Now we can reload the page
        this.reloadProfile();
    }

    showWarningModal = () => {
        this.setState({showWarningModal: true});
    }

    hideWarningModal = () => {
        this.setState({showWarningModal: false});
    }

    getWarningModal = () => {
        let {showWarningModal, isWarningSaveButtonDisabled} = this.state;
        return (
        <Modal backdrop="static" onHide={this.hideWarningModal}
          show={showWarningModal}>
          <Header className=" modal-warning " closeButton>
            <Title> <h1 className="modal-title" > Warning </h1> </Title>
          </Header>
          <Body>
            <p>
              Are you sure you want to unlink this UCPath Position?
            </p>
          </Body>
          <Footer>
            <Button bsStyle="warning" className="left white"
              disabled = {isWarningSaveButtonDisabled}
              onClick={this.startUnlink}>
              Unlink
            </Button>
            <Dismiss onClick={this.hideWarningModal}
              className="left btn btn-link">
              Cancel
            </Dismiss>
          </Footer>
        </Modal>
      );
    }

  /**
   *
   * @desc - Gets main table and sub tables for salary and titleInformation
   * @param {Array} - array of comments from API
   * @return {JSX} - jsx
   *
   **/
    getTable() {
        let {state: {tableSectionNames: {appointment, salary, main},
      tableData, tableTitle, titleCode, affiliationCategory, appointmentCommentCount}} = this;
        let appointmentFields = pick(tableData, appointment);
        let salaryFields = pick(tableData, salary);
        let mainFields = pick(tableData, main);

        return (
      <div>
        <DisplayTable>
          <DisplayTableHeader>
            <ShowIf show={this.state.canEditProfile}>
              <EditIcon onClick={this.showEditModal}/>
            </ShowIf>

            <CommentIcon onClick={this.showCommentModal} placeholder={this.state.appointmentCommentCount} position={null} className={'button edit-icon icon-pencil edit-case-button'} className1={'comment-icon-container-profile-cases'} className2={'comment-icon-centered'}/>

            <ShowIf show={this.state.canDeleteProfile}>
              <DeleteIcon onClick={this.showDeleteCaseModal}/>
            </ShowIf>
            <h2 className="table-heading black">{tableTitle} - {affiliationCategory}</h2>
            <div className="no-bold">
              {titleCode}
            </div>

          </DisplayTableHeader>
        </DisplayTable>

        <ToggleView contentClassName=" col-md-offset-1 "
          showText="Show Details" hideText="Hide Details">

          <DisplayTable>
            <VisibleDisplayTableBody fieldOptions={mainFields} valueKey="displayValue" />
          </DisplayTable>

          <ShowIf show={keys(salaryFields).length}>
            <DisplayTable>
              <DisplayTableHeader> Salary Details </DisplayTableHeader>
              <VisibleDisplayTableBody fieldOptions={salaryFields} valueKey="displayValue" />
            </DisplayTable>
          </ShowIf>

          <ShowIf show={keys(appointmentFields).length}>
            <DisplayTable>
              <DisplayTableHeader> Appointment Details </DisplayTableHeader>
              <VisibleDisplayTableBody fieldOptions={appointmentFields} onClick={this.showWarningModal}
                valueKey="displayValue" />
            </DisplayTable>
          </ShowIf>
        </ToggleView>
        <br />
      </div>
    );
    }

  /**
   *
   * @desc - Each appointment for Profile
   * @return {JSX} - jsx
   *
   **/
    render() {
        return(
      <div>
        {this.getTable()}
        {this.getAPIResponseModals()}
        {this.getAffiliationWarningModal()}
        {this.getDeleteConfirmationModal()}
        {this.getEditCaseModal()}
        {this.getCommentsModal()}
        {this.getWarningModal()}
      </div>
    );
    }
}
