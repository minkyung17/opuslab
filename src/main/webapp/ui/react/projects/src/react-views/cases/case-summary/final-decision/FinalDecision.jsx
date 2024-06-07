import React from "react";
import PropTypes from "prop-types";
import {keys} from "lodash";

//My imports
import * as util from "../../../../opus-logic/common/helpers/";
import {PrePopulateButton} from "../CaseSummaryComponents.jsx";
import {ToolTip} from "../../../common/components/elements/ToolTip.jsx";
import {MultipleAppointmentsBlock} from "../../components/AppointmentBlocks.jsx";
import {EndowedChairBlock} from "../../components/EndowedChairBlock.jsx";
import Permissions from "../../../../opus-logic/common/modules/Permissions";
import CasesAdminPermissions from "../../../../opus-logic/common/modules/CasesAdminPermissions";
import {FormTextArea} from "../../../common/components/forms/FormElements.jsx";
import {HideIf, ShowIf} from "../../../common/components/elements/DisplayIf.jsx";
import {EditIcon, CommentIcon} from "../../../common/components/elements/Icon.jsx";
import {FormShell, VisibleFormGroup} from "../../../common/components/forms/FormRender.jsx";
import APIFailureModal from "../../../cases-admin/APIFailureModal.jsx";
import ProposedFields from "../../../../opus-logic/cases/classes/case-summary/ProposedFields";
import FinalDecisionLogic from "../../../../opus-logic/cases/classes/case-summary/FinalDecision";
import ReopenCase from "../../../../opus-logic/cases-admin/ReopenCase";
import {DisplayTable, DisplayTableHeader, VisibleDisplayTableBody} from
  "../../../common/components/elements/DisplayTables.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {CommentsModal, CommentTitle, CommentList, CommentTextArea, CommentSave,
  CommentBody} from "../../../common/components/bootstrap/CommentComponents.jsx";
import ReopenCaseModal from "../../../cases-admin/ReopenCaseModal.jsx";
import CasesAdminSuccessModal from "../../../cases-admin/CasesAdminSuccessModal.jsx";

export default class FinalDecision extends React.Component {
    static propTypes = {
        caseId: PropTypes.string,
        adminData: PropTypes.object,
        opusCaseInfo: PropTypes.object,
        appointeeInfo: PropTypes.object,
        actionDataInfo: PropTypes.array,
        caseSummaryDataFromAPI: PropTypes.object,
        setCaseSummaryDataAPIInGlobalState: PropTypes.func
    }

  /**
  *
  * @desc - Start everything off
  * @param {Object} props -
  * @return {void}
  *
  **/
    constructor(props = {}) {
        super(props);

        this.initFinalDecision();
        this.changeStateOfSuccessModal = this.changeStateOfSuccessModal.bind(this);
        this.changeStateOfReopenModal = this.changeStateOfReopenModal.bind(this);
    }

    state = {
        comments: [],
        editModalComment: "",
        showCompleteCaseButton: false,
        canReopenCase: false,
        isSaveButtonDisabled: false,
        showFinalDecisionModal: false,
        isCommentSaveButtonDisabled: false,
        isCompleteCaseButtonDisabled: false,
        hideCaseButton: false, //based on role and action type
        showFinalDecisionCommentModal: false,
        showReopenCaseModal: false,
        showSuccessModal: false
    };

  /**
   *
   * @desc - Before it mounts. Calling setState
   * @return {void}
   *
   **/
    async componentWillMount() {
        await this.loadFinalDecisionPage(this.props.caseSummaryDataFromAPI);

    //Refresh comments
        this.refreshComments();

    //Set Completed Cases button visibility based upon role and action type
        this.getCaseButtonPermissions();
    }

  /**
   *
   * @desc - Every time it updates
   * @param {Object} caseSummaryDataFromAPI - if API data is different rerender page
   * @return {void}
   *
   **/
    componentWillReceiveProps({caseSummaryDataFromAPI}) {
    //If this caseSummaryDataFromAPI is different then reload final decision
        if(!this.isCurrentCaseSummaryAPIData(caseSummaryDataFromAPI)) {
            this.loadFinalDecisionPage(caseSummaryDataFromAPI);

      //Update permissions in the case of an SA role changing the proposed series/rank
            this.getCaseButtonPermissions();
        }
    }

  /**
   *
   * @desc - Every time it updates
   * @return {void}
   *
   **/
    componentDidUpdate() {
        util.initJQueryBootStrapToolTipandPopover();
    }

  /**
   *
   * @desc - Class variables
   *
   **/
    Proposed = new ProposedFields(this.props);
    Logic = new FinalDecisionLogic(this.props);
    ReopenLogic = new ReopenCase(this.props);
    Permissions = new Permissions(this.props.adminData);
    CasesAdminPermissions = new CasesAdminPermissions(this.props.adminData);

  /**
   *
   * @name isCurrentCaseSummaryDataFromAPI
   * @desc - Gets if actionDataInfo being passed in is the same as the current one
   * @param {Object} caseSummaryDataFromAPI -
   * @returns {Boolean} -
   *
   **/
    isCurrentCaseSummaryAPIData(caseSummaryDataFromAPI) {
        return caseSummaryDataFromAPI === this.props.caseSummaryDataFromAPI;
    }

  /**
   *
   * @desc - Get permissions from Logic side using opusCaseInfo
   * @return {void}
   *
   **/
    initFinalDecision() {
        this.Logic.setFieldDataPermissionsFromOpusCaseInfo(this.props.caseSummaryDataFromAPI);
    }

  /**
  *
  * @desc - Creates fields, copies them for table and starts, sets in state
  * @param {Object} caseSummaryDataFromAPI -
  * @return {void} -
  *
  **/
    loadFinalDecisionPage(caseSummaryDataFromAPI) {
        let {tableData, startingFieldData, showCompleteCaseButton, actionTypeDisplayText,
      apptBlockData, actionDataSortedByAffiliation, finalDecisionMain,
      finalDecisionByApptId, finalDecisionPopup, actionDataInfoByApptId,
      proposedStatusFieldsByApptId, endowedChairBlockData} =
      this.Logic.initFinalDecisionFromAPIData(caseSummaryDataFromAPI);

        this.setState({canReopenCase: this.ReopenLogic.reopenCasePermissions(caseSummaryDataFromAPI.actionDataInfo[0])});

    //Now save all the fields
        this.setState({tableData, startingFieldData, actionDataInfoByApptId,
      finalDecisionMain, finalDecisionByApptId, finalDecisionPopup, endowedChairBlockData,
      showCompleteCaseButton, actionTypeDisplayText, renderFinalDecision: true,
      proposedStatusFieldsByApptId, apptBlockData, actionDataSortedByAffiliation});
    }

  /**
  *
  * @desc - Gets data from API and sets in global state
  * @param {Number} caseId -
  * @return {void} -
  *
  **/
    async reloadPage(caseId = this.props.caseId) {
        let caseSummaryDataFromAPI = await this.Logic.getCasesSummaryData(caseId);

    //Dispatch caseSummaryData into global state
        this.props.setCaseSummaryDataAPIInGlobalState(caseSummaryDataFromAPI);
    }

  /**
   *
   * @desc - Hide comment modal
   * @return {void}
   *
   **/
    onCommentModalHide = () => this.setState({showFinalDecisionCommentModal: false});

  /**
   *
   * @desc - Reset comment to empty in text area and show comment modal
   * @return {void}
   *
   **/
    showFinalDecisionCommentModal = () => this.setState({finalDecisionComments: "",
    showFinalDecisionCommentModal: true});

  /**
   *
   * @desc - Gets comments from api and sets in state to rerender
   * @param {Event} evt - Event from clicking in the comment text area
   * @return {void}
   *
   **/
    onChangeFinalDecisionComment = (evt) => {
        this.setState({finalDecisionComments: evt.target.value});
    }

  /**
   *
   * @desc - Gets comments from api and sets in state to rerender
   * @param {String} caseId - Gets comments from api and sets in state to rerender
   * @return {JSX} - Final Decision Comment Modal
   *
   **/
    async refreshComments(caseId = this.props.caseId) {
        let comments = await this.Logic.getCommentsById(caseId);
        this.setState({comments, caseCommentCount: comments.length});
        return comments;
    }

  /**
   *
   * @desc - Saves final decision comment and refreshes the comments
   * @return {void}
   *
   **/
    saveFinalDecisionComment = async () => {
    //Extract caseId and comments to save
        let {state: {finalDecisionComments}, props: {caseId}} = this;

    //Disable button so we cant save multiple times quickly
        this.setState({isCommentSaveButtonDisabled: true});

    //Now save comment on Logic side
        await this.Logic.saveComments(finalDecisionComments, caseId);

    //Re-enable comment modal buttons and wipe out comment area
        this.setState({finalDecisionComments: "", isCommentSaveButtonDisabled: false});

    //Refresh comments
        this.refreshComments(caseId);
    }

  /**
   *
   * @desc - Gets the modal from clicking on the commont icon on the table
   * @return {JSX} - Final Decision Comment Modal
   *
   **/
    getFinalDecisionCommentModal() {
        let {state: {comments, isCommentSaveButtonDisabled, finalDecisionComments:
      value}, onChangeFinalDecisionComment} = this;
        return (
      <CommentsModal show={this.state.showFinalDecisionCommentModal}
        {...{onHide: this.onCommentModalHide}}>

        <CommentTitle> Final Decision Comments </CommentTitle>

        <CommentBody>
          <CommentTextArea {...{value, maxCount: 250}}
            onChange={onChangeFinalDecisionComment} />

          <CommentSave disabled={isCommentSaveButtonDisabled}
            onClick={this.saveFinalDecisionComment} /><br />

          <CommentList {...{comments}} />
        </CommentBody>

      </CommentsModal>);
    }

  /*****************************************************************************
   *
   * @name FINAL DECISION FIELDS
   * @desc - Section for handling creating Table and Modal for Final Decision
   *  fields. Updating and saving Final Decision field updates
   *
   *****************************************************************************/

  /**
   *
   * @desc - Closes the modal
   * @return {void}
   *
   **/
    closeFinalDecisionModal = () => this.setState({showFinalDecisionModal: false,
    errorMessage: null, editModalComment: ""});

  /**
  *
  * @desc - Open modal, clones starting fields to current final decisino fields
  * @return {void}
  *
  **/
    showFinalDecisionModal = () => {
    //Get starting fields from state
        let {startingFieldData} = this.state;

    //Extract clone function
        let clone = util.cloneObject;

    //Clone all fields on start
        let finalDecisionPopup = clone(startingFieldData.finalDecisionPopup);
        let finalDecisionByApptId = clone(startingFieldData.finalDecisionByApptId);

    //Set state to show only visible fields
        this.setState({showFinalDecisionModal: true, finalDecisionPopup, finalDecisionByApptId});
    }

  /**
  *
  * @desc - Prepopulates finalDecision fields from proposedFields
  * @param {Object} evt - click event
  * @return {void}
  *
  **/
    onClickPrepopulate = async (evt) => {
    //Do not reload page
        evt.preventDefault();

    //Extract and update values
        let {finalDecisionByApptId, finalDecisionPopup, proposedStatusFieldsByApptId} = this.state;

        for(let apptId in proposedStatusFieldsByApptId){
            let fd = finalDecisionByApptId[apptId];
            if(proposedStatusFieldsByApptId[apptId].titleCode){
                this.updateFieldData(proposedStatusFieldsByApptId[apptId].titleCode.name,
          proposedStatusFieldsByApptId[apptId].titleCode.value.toString(), fd);
            }
      //Puts proposed fields into approved fields
            this.Logic.setApprovedValuesFromProposedFieldData(fd,
        proposedStatusFieldsByApptId[apptId]);

      // IOK-1064 Need to set Endowed Chair Name Search field visibility to false
            if(fd.endowedChair && fd.endowedChair.visibility){
              fd.endowedChair.visibility = false;
            }
      //Get salary effective date dropdown options if applicable
            if(fd.salaryEffectiveDt && fd.salaryEffectiveDt.visibility){
                await this.updateFieldDataFromAPI("salaryEffectiveDt", fd, apptId);
            }

      // BRule-120 N/A Value in Step for lecturer series reference data changes
            let actionStatusId = this.state.actionDataInfoByApptId[apptId].actionStatusId;
            if(actionStatusId>1 && actionStatusId<5
        && fd.series && fd.series.value==="Lecturer"
        && fd.rank && (fd.rank.value==="Lecturer SOE" || fd.rank.value==="Lecturer PSOE"
          || fd.rank.value==="Senior Lecturer SOE")
        && fd.step && (fd.step.displayValue==="N/A")
      ){
                fd.step.visibility = false;
                fd.startDateAtStep.visibility = false;
            }
            if(proposedStatusFieldsByApptId[apptId].locationDisplayText1){
                this.Logic.copyLocationValuesForPrepopulate(fd, proposedStatusFieldsByApptId[apptId]);
            }
        }

    // RE-319 BRule-120 Pre-pop. FD modal with Eff. Date and Years Accel/Deferred Dt. from Proposed.
        this.Logic.setFinalDecisionPopUpValuesFromProposedFieldData(
      this.props.caseSummaryDataFromAPI, finalDecisionPopup);

    //Sets them in state to render on showing
        this.setState({finalDecisionByApptId});

        setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
    }

  /**
  *
  * @desc - Maintain edit modal comment value
  * @param {Object} evt - click event
  * @return {void}
  *
  **/
    onChangeEditModalComment = (evt) => {
        this.setState({editModalComment: evt.target.value});
    }

  /**
  *
  * @desc - Maintain values for final decision top section
  * @param {Object} evt - click event
  * @return {void}
  *
  **/
    onChangeFinalDecisionPopup = (evt) => {
        let {name, value} = evt.target;
        let {finalDecisionPopup, finalDecisionPopup: {approvedOutcome}} = this.state;
        finalDecisionPopup[name].value = value;

    //May want to hide certain fields it approvedOutcome is disapproved
        this.Logic.editFieldPropsByOutcomeStatus(approvedOutcome, finalDecisionPopup);

    //Now get only visible fields
        this.setState({finalDecisionPopup});
    }

  /**
   *
   * @desc - Lets create field data
   * @param {Event} name - event from onChange
   * @param {Event} value - event from onChange
   * @param {Event} fieldData - event from onChange
   * @return {Object} fieldData
   *
   **/
    updateFieldData = (name, value, fieldData) => {
        const fieldsToExclude = this.Logic.getExclusionFieldsForLocation();

        if(fieldsToExclude.includes(name)){
            this.Logic.handleLocationFields(name, value, fieldData);
        }else{
      // Other non location based fields work normally
            fieldData[name].value = value;
        // If location 1 number input is disabled and user changes appointment percent time, update location 1 number input
            if(name==="appointmentPctTime" && fieldData.locationDisplayText1 && fieldData.locationDisplayText1.isNumberDisabled){
                fieldData.locationDisplayText1.numberValue = parseInt(value);
            }
        }

    //Update the fields by toggle dependencies
        this.Logic.updateFieldDataByToggle(fieldData, name);

    //Validate the fields after toggling
        this.Logic.validateFieldOnUpdate(fieldData[name]);

    //Return validated data
        return fieldData;
    }

  /**
   *
   * @desc - RUn salary toggles for fieldData
   * @param {String} name - name of field to change
   * @param {Object} fieldData - all fields in section
   * @param {Number} appointmentId -
   * @return {Object} fieldData
   *
   **/
    updateFieldDataFromAPI = async (name, fieldData, appointmentId) => {
    //Get appointment for these set of fields
        let {appointmentInfo} = this.state.actionDataInfoByApptId[appointmentId];

    // Find ActionId
        let actionId = this.props.caseSummaryDataFromAPI.actionDataInfo[0].actionId;

    //Go to API to update
        await this.Logic.updateFieldDataFromSalaryAPI(name, fieldData, appointmentInfo, actionId, "approved");

    //Specifically returns fields
        return fieldData;
    }

  /**
   *
   * @desc - ReRenders fields in modal. Usually after some update
   * @param {Object} finalDecisionByApptId - fields by apptId
   * @param {Object} finalDecisionPopup - top section of fields
   * @return {Object} fieldData
   *
   **/
    renderModalFields(finalDecisionByApptId, finalDecisionPopup = this.state.finalDecisionPopup) {
    //Re-render the modal fields
        this.setState({finalDecisionPopup, finalDecisionByApptId});
    }

  /**
   *
   * @desc - OnBlur validations and updates
   * @param {Object} evt - event handler
   * @param {Object} - apptId
   * @return {void}
   *
   **/
    onBlur = (evt, {appointmentId} = {}) => {
        let {name, value} = evt.target;

      //Return if invalid blur elements
        let canUpdateField = this.Logic.canUpdateFieldDataViaOnBlur(name);
        if(!canUpdateField) {
            return;
        }

    //Get current group of fields being manipulated
        let fieldData = this.state.finalDecisionByApptId[appointmentId];
        fieldData[name].value = value;

    //Validate field data onClick
        this.Logic.validateFieldOnBlur(fieldData[name]);

    //Rerender validation to show errors if any
        this.renderModalFields(this.state.finalDecisionByApptId);
    }

  /**
   *
   * @desc - OnBlur validations and updates
   * @param {Object} evt - event handler
   * @param {Object} - apptId
   * @return {void}
   *
   **/
    onChangeFinalDecisionFields = async (evt, {appointmentId} = {}) => {
        const fieldsToExclude = this.Logic.getExclusionFieldsForLocation();
        let {helpText} = this.Logic;

        if(fieldsToExclude.includes(name)){
        //Do not reload page
            evt.preventDefault();
        }
        let {name, value} = evt.target;
        let {finalDecisionByApptId} = this.state;
        let fieldData = finalDecisionByApptId[appointmentId];

    //Update fieldData by toggling
        this.updateFieldData(name, value, fieldData);

    //Rerender validation to show errors if any
        this.renderModalFields(finalDecisionByApptId);

    //Get salary api fields
        await this.updateFieldDataFromAPI(name, fieldData, appointmentId);

        // Need to set correct location visibility values on departmentCode toggle
        if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value==="Medicine" && fieldData.locationDisplayText2.visibility===false){
            fieldData.locationDisplayText1.isNumberDisabled = false;
            fieldData.locationDisplayText1.showAdd = true;
            fieldData.locationDisplayText1.showDelete = true;
            fieldData.locationDisplayText1.isDeleteDisabled = true;
            fieldData.locationDisplayText1.helpText = helpText;
            if(fieldData.locationDisplayText1.numberValue===null){
                fieldData.locationDisplayText1.isAddDisabled = true;
            }
        }else if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value!=="Medicine"){
            this.Logic.resetLocations(fieldData);
        }

    //Rerender again to show new api field values
        this.renderModalFields(finalDecisionByApptId);
    }

  /*****************************************************************************
   *
   * @name SAVING FINAL DECISION FIELDS
   * @desc - Section handling all the save options
   *
   *****************************************************************************/

   /**
    *
    * @desc - Determines if Complete the Case button is hidden based upon
    * role and action type
    * @return {void}
    *
    **/
    getCaseButtonPermissions = () => {
        if(this.props.caseSummaryDataFromAPI.actionDataInfo){
            this.setState({hideCaseButton: this.CasesAdminPermissions.getCaseButtonPermissions(
         this.props.caseSummaryDataFromAPI.actionDataInfo[0])});
        }
    }

/**
  *
  * @desc - Disable buttons so as not to double save
  * @return {void}
  *
  **/
    disableFinalDecisionButtons() {
        this.setState({isSaveButtonDisabled: true,
      isCompleteCaseButtonDisabled: true,
      isReopenCaseButtonDisabled: true});
    }

  /**
  *
  * @desc - Saving is done. Re-enable the buttons
  * @return {void}
  *
  **/
    resetFinalDecisionModal() {
        this.setState({showFinalDecisionModal: false,
      isSaveButtonDisabled: false,
      showReopenCaseModal: false,
      isCompleteCaseButtonDisabled: false,
      isReopenCaseButtonDisabled: false,
      editModalComment: ""});
    }

  /**
  *
  * @desc - Go to Logic to valid comment using whatever parameters
  * @param {Object} saveType -
  * @return {void}
  *
  **/
    isCommentValid = (saveType = {}) => {
        return this.Logic.isCommentValid(this.state.editModalComment, saveType);
    }

  /**
  *
  * @desc - Go to Logic to valid these fields
  * @return {Boolean} hasErrors - returns if state fields have errors
  *
  **/
    fieldDataHasSaveErrors() {
    //Extract data to validate
        let {finalDecisionPopup, finalDecisionByApptId} = this.state;

        let {actionDataInfo} = this.props;

    //Validate top popup fields
        this.Logic.validateAllFieldDataOnSave(finalDecisionPopup);

    //Validate appointment status fields
        this.Logic.validateKeyedFieldsOnSave(finalDecisionByApptId);

        let hasErrors = this.Logic.doFinalDecisionFieldsHaveErrors(finalDecisionPopup,
      finalDecisionByApptId, actionDataInfo[0]);

        return hasErrors;
    }

  /**
  *
  * @desc - Do you have errors? If not we can save
  * @param {Object} saveType - saveActive, saveComplete, or completeCase
  * @return {Boolean} hasErrors - returns if can save final decision fields
  *
  **/
    canSaveAfterFieldValidations(saveType) {
    //Check if comment is valid by whatever parameters necessary
        let commentIsValid = this.isCommentValid(saveType);

    //Now check rest of fields on modal & get error status
        let hasErrors = this.fieldDataHasSaveErrors();

    //Get error message from Logic file
        let errorMessage = this.Logic.getErrorMessage(hasErrors, commentIsValid);

    //Render message in state
        this.setState({errorMessage});

    //Update the modal fields which shows or wipes errors
        this.renderModalFields(this.state.finalDecisionByApptId);

        return !hasErrors && commentIsValid;
    }

  /**
  *
  * @desc - Validate comment and then save if we can
  * @param {Object} evt - button click event handler
  * @return {void}
  *
  **/
    onClickSaveFinalDecision = async (evt) => {
    //Dont want page to reload so preventDefault
        evt.preventDefault();

    //Figure out save type
        let {showCompleteCaseButton} = this.state;

    // Jira #2893 Reversed saveType results:
    // let saveType = showCompleteCaseButton ? {saveCompleted: true} : {saveActive: true};
        let saveType = showCompleteCaseButton ? {saveActive: true} : {saveCompleted: true};

    // Now validate fields
        let canSave = this.canSaveAfterFieldValidations(saveType);

    //If we can save let send save type
        if(canSave) {
            this.saveFinalDecisionFromUI(saveType);
            this.setState({casesAdminTypeStringValue: "save"});
        }
    }

  /**
  *
  * @desc - Validate comment and then save and complete the case if we can
  * @param {Object} evt - button click event handler
  * @return {void}
  *
  **/
    onClickCompleteCase = async (evt) => {
    //Dont want page to reload so preventDefault
        evt.preventDefault();

    //Figure out save type
        let saveType = {completeCase: true};

    //Now validate fields
        let canSave = this.canSaveAfterFieldValidations(saveType);

    //If we can save let send save type
        if(canSave) {
            this.saveFinalDecisionFromUI(saveType);
            this.setState({casesAdminTypeStringValue: "complete"});
        }
    }

  /**
  *
  * @desc - Validate comment and then save and complete the case if we can
  * @param {Object} saveType - should we complete the case, save a regular case
  * or save a completed case
  * @return {void}
  *
  **/
    async saveFinalDecisionFromUI(saveType) {
    //Must disable buttons to ensure no double/triple saves
        this.disableFinalDecisionButtons();

    //Now save the case with the saveType
        let promise = this.saveFinalDecision(saveType);

    //Wait for api to save or error out before proceeding
        try {
            await promise;
            // IOK-794 Wait for promise and refresh before success modal shows
            //After save, rerender the page
            await this.reloadPage();

            //Refresh comments
            await this.refreshComments();

            this.setState({showSuccessModal : true});
        } catch(e) {
            console.log("ERROR: api call in 'saveFinalDecisionFromUI' in FinalDecision.jsx");
            console.log(e)
            this.setState({promise});
        }
        //Enable the buttons to reset the modal
        this.resetFinalDecisionModal();
    }

  /**
   *
   * @desc - Extract fields from props, state and current data to send to Logic.
   *  Save these fields by saveType
   * @param {String} apptId - id of actionData to get title from
   * @return {String} - shortened name
   *
   **/
    getAcademicTitleFromActionDataByApptId(apptId) {
        let {appointmentInfo} = this.state.actionDataInfoByApptId[apptId];
        return this.Logic.getTableTitleFromAppointment(appointmentInfo);
    }

  /**
   *
   * @desc - Extract fields from props, state and current data to send to Logic.
   *  Save these fields by saveType
   * @param {Object} - what type of saveType it is
   * @return {Promise} promise - promise from save
   *
   **/
    saveFinalDecision({saveActive, saveCompleted, completeCase} = {}) {

    //Extract data to send off to save
        let {props: {caseSummaryDataFromAPI: {actionDataInfo, appointeeInfo, opusCaseInfo,
      opusCaseInfo: {caseId}}}, state: {finalDecisionPopup, editModalComment,
      finalDecisionByApptId}} = this;

    //Choose savetype before sending off to Logic file to save
        let saveType = {saveActive, saveCompleted, completeCase};

    //Lets clone the action fields in case we need to keep the original
        let clonedFinalDecision = util.cloneObject(finalDecisionByApptId);
        let clonedFinalDecisionPopup = util.cloneObject(finalDecisionPopup);

    //Send to Logic file to then make the call to API
        let promise = this.Logic.saveFinalDecisionBySaveType(clonedFinalDecision,
      clonedFinalDecisionPopup, actionDataInfo, {caseId, appointeeInfo,
        opusCaseInfo, saveType, commentsText: editModalComment});

        return promise;
    }


  /**
   *
   * @desc - determines is there is an cases-admin case attached to the opus case
   * @param {Event} evt - click event
   * @param {Object} rowData - case that will be reopened
   * @returns {void}
   *
   **/
    onClickReopenCase = (evt) => {
    //Dont want page to reload so preventDefault
        evt.preventDefault();

    // Need to format data due to data being pulled in being different from completedCases
        let formattedData = {fullName: this.props.caseSummaryDataFromAPI.appointeeInfo.fullName,
      actionType: this.props.actionDataInfo[0].actionTypeInfo.actionTypeDisplayText,
      displayValue_approvedEffectiveDate: this.props.actionDataInfo[0].effectiveDt};

    // If cases-admin case is attached, then open Reopen cases-admin case modal
        if(this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId){
            this.setState({showReopenCaseModal: true,
      reopenData: this.props.caseSummaryDataFromAPI.opusCaseInfo,
      formattedModalData: formattedData,
      showFinalDecisionModal: false});
        }else{
            this.reopenOpusCaseAndInterfolioCase("reopenJustOpusCase",
      this.props.caseSummaryDataFromAPI.opusCaseInfo);
        }
    }

    changeStateOfReopenModal(){
    // Dismissing reopen Modal changes state of reopen modal in parent
    // to disable reopen modal from showing twice due to reopening final decision modal
        this.setState({showReopenCaseModal: false});
    }

  /**
   *
   * @desc - rendering ReopenCaseModal determined by the state of showReopenCaseModal
   * @returns {JSX} - ReopenCaseModal jsx
   *
   **/
    getReopenCaseModal({showReopenCaseModal, formattedModalData} = this.state) {
        let reopenData = formattedModalData;
        return <ReopenCaseModal {...{showReopenCaseModal, reopenData}}
                            reopenOpusCaseAndInterfolioCase={(selection, dataInput) =>
                              this.reopenOpusCaseAndInterfolioCase(selection, dataInput)}
                            changeStateOfReopenModal={this.changeStateOfReopenModal}/>;
    }

  /**
   *
   * @desc - Intermediary to send to the logic class to reopen this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
    reopenOpusCaseAndInterfolioCase = async (ReopenInterfolioCaseSelection, reopenDataInput) => {
    //Must disable buttons to ensure no double/triple saves
        this.disableFinalDecisionButtons();

    // ReopenInterfolioCaseSelection is the input of either 'yes' or 'no' from the reopen case modal or
    // "reopenJustOpusCase" which means there is no cases-admin case attached to it
        let reopenDataLocal = this.state.reopenData;
        if(ReopenInterfolioCaseSelection==="reopenJustOpusCase"){
            reopenDataLocal = reopenDataInput;
        }

    // Case Summary page data is structured differently:
        let caseData = {originalData: reopenDataLocal};

    // //get promise back
        let reopenPromise = this.ReopenLogic.reopenCase(caseData, ReopenInterfolioCaseSelection,
    this.state.editModalComment);

    //Wait for api to save or error out before proceeding
        try {
            await reopenPromise;
            // IOK-794 Wait until promise
            //After save, rerender the page
            await this.reloadPage();

            //Refresh comments
            await this.refreshComments();

            this.setState({showSuccessModal: true, casesAdminTypeStringValue: "reopen"});

            //Change status of case to not completed
            this.setState({showCompleteCaseButton: false, canReopenCase: false});
        } catch(e) {
            console.log("ERROR: api call in 'reopenOpusCaseAndInterfolioCase' in FinalDecision.jsx");
            this.setState({promise: reopenPromise});
        }

        //Enable the buttons to reset the modal
        this.resetFinalDecisionModal();
    }

    changeStateOfSuccessModal(){
    // Dismissing success Modal changes state of success modal in parent
    // to disable success modal from showing twice due to reopening final decision modal
        this.setState({showSuccessModal: false});
    }

  /**
  *
  * @desc - This is the create a case modal
  * @return {void}
  *
  **/
    getCasesAdminSuccessModal({showSuccessModal, casesAdminTypeStringValue} = this.state) {
        return <CasesAdminSuccessModal {...{showSuccessModal,
      casesAdminTypeStringValue}}
      changeStateOfSuccessModal={this.changeStateOfSuccessModal}/>;
    }

  /**
   *
   * @desc - self explanatory
   * @return {JSX} - Final Decision Modal
   *
   **/
    getFinalDecisionModal() {
        let {caseSummaryDataFromAPI: {actionDataInfo, appointeeInfo: {uid, fullName}}}
      = this.props;

        let {actionDataSortedByAffiliation, finalDecisionByApptId, finalDecisionPopup}
      = this.state;

    //If action outcome is disapproved then dont show status(bottom) fields
        let hideFinalStatusFields = this.Logic.shouldFinalStatusFieldsBeHiddenByActionOutcomeStatus(
      finalDecisionPopup.approvedOutcome, actionDataInfo[0]);

    //Get sorted modal fields by affiliation
        let fieldsSortedByAffilation = actionDataSortedByAffiliation.map((
      {appointmentInfo: {appointmentId}}) => {
            return {appointmentId, fields: finalDecisionByApptId[appointmentId]};
        });
        
        return (
      <Modal className="modal-lg" backdrop="static" onHide={this.closeFinalDecisionModal}
        show={this.state.showFinalDecisionModal}>
        <Header className=" modal-info " closeButton>
          <h1 className= " black "> Final Decision </h1>
        </Header>
        <Body>
          <h2 className="flush-top">{fullName}</h2>
          <ShowIf show={uid}>
            <p className= " small ">UID: {uid}</p>
          </ShowIf>

          <MultipleAppointmentsBlock apptDisplays={this.state.apptBlockData}/>
          <br/>
          <PrePopulateButton onClick={this.onClickPrepopulate} />

          <FormShell >
            <h2>{this.state.actionTypeDisplayText}</h2>

            <VisibleFormGroup onChange={this.onChangeFinalDecisionPopup}
              fields={this.state.finalDecisionPopup} />

            <HideIf hide={hideFinalStatusFields}>
              <div>
                {fieldsSortedByAffilation.map(({appointmentId, fields}) =>
                  <div key={appointmentId}>
                    <ShowIf show={keys(fields).length}>
                      <div>
                        <h2>
                          {this.getAcademicTitleFromActionDataByApptId(appointmentId)}
                        </h2>

                      </div>
                    </ShowIf>

                    <VisibleFormGroup id={appointmentId} {...{appointmentId, fields}}
                      onBlur={this.onBlur} onChange={this.onChangeFinalDecisionFields} />
                  </div>
                )}
              </div>
            </HideIf>
            <ShowIf show={actionDataInfo[0].approvedEndowedChairId}>
              <EndowedChairBlock endowedChairDisplays={this.state.endowedChairBlockData}/>
            </ShowIf>
            <br/>
            Comments (Maximum 250 characters.)
            <FormTextArea onChange={this.onChangeEditModalComment}
              value={this.state.editModalComment} />
            <ShowIf show={this.state.errorMessage}>
              <p className="error_message">{this.state.errorMessage}</p>
            </ShowIf>
          </FormShell>
        </Body>
        <Footer>
          <button disabled={this.state.isSaveButtonDisabled}
            className="left btn btn-primary" onClick={this.onClickSaveFinalDecision}>
            Save <ToolTip text={`Save a draft of this information. Saving will
              not close the case.`} />
          </button>
          <ShowIf show={this.state.canReopenCase && !this.state.hideCaseButton}>
          <button disabled={this.state.isReopenCaseButtonDisabled}
            onClick={this.onClickReopenCase} className="left btn btn-primary">
            Reopen the Case
          </button>
        </ShowIf>
          <ShowIf show={this.state.showCompleteCaseButton && !this.state.hideCaseButton}>
            <button disabled={this.state.isCompleteCaseButtonDisabled}
              onClick={this.onClickCompleteCase} className="left btn btn-primary">
              Complete the Case <ToolTip text={`This will send a notice to you
                and the appropriate administrators that the case is completed.
                For future reference, this case will move to the "Completed Cases"
                page.`} />
            </button>
          </ShowIf>
          <Dismiss onClick={this.closeFinalDecisionModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
   *
   * @desc - Gets the top table w/ 'Main' fields & w/ icons to show edit &
   *  comment modal
   * @return {JSX} - Final Decision Table
   *
   **/
    getFinalDecisionMainTable() {
        return (
      <DisplayTable >
        <DisplayTableHeader>
          <ShowIf show={this.Logic.canEditFinalDecision} >
            <EditIcon onClick={this.showFinalDecisionModal} />
          </ShowIf>
          <CommentIcon onClick={this.showFinalDecisionCommentModal} placeholder={this.state.caseCommentCount} className1={'comment-icon-container-profile-cases'} className2={'comment-icon-centered'}/>
        </DisplayTableHeader>
        <VisibleDisplayTableBody fieldOptions={this.state.tableData.finalDecisionMain}
          valueKey="displayValue" />
      </DisplayTable>);
    }

  /**
   *
   * @desc - Get final decision table by each set of fields(or appointments)
   * @param {Object} apptId -
   * @return {JSX} - Final Decision Table
   *
   **/
    getFinalDecisionTable(apptId) {
        let fieldOptions = this.state.tableData.finalDecisionByApptId[apptId];
        let hasFields = Object.keys(fieldOptions).length;
        let actionDataInfo = this.state.actionDataInfoByApptId[apptId];

        let title = this.Logic.getTableTitleFromActionDataInfo(actionDataInfo);
        return (
      <ShowIf key={apptId} show={hasFields}>
        <DisplayTable >
          <DisplayTableHeader> {title} </DisplayTableHeader>
          <VisibleDisplayTableBody valueKey="displayValue" {...{fieldOptions}} />
        </DisplayTable>
      </ShowIf>
    );
    }

  /**
   *
   * @desc - Get final decision table by each set of fields(or appointments)
   *  if actionOutcome is not disabled
   * @param {Object} finalDecisionByApptId -
   * @return {JSX} - Final Decision Table
   *
   **/
    getFinalDecisionTableByApptId() {
        let {state: {actionDataSortedByAffiliation, tableData: {finalDecisionPopup}},
      props: {actionDataInfo}} = this;

        let shouldHideFields = this.Logic.shouldFinalStatusFieldsBeHiddenByActionOutcomeStatus(
      finalDecisionPopup.approvedOutcome, actionDataInfo[0]);

    //Init tables to null to not show if outcome is disabled
        let tables = null;

    //If action outcome is not disapproved we dont show bottom table
        if(!shouldHideFields) {
            tables = actionDataSortedByAffiliation.map(({appointmentInfo: {appointmentId}}) =>
        this.getFinalDecisionTable(appointmentId));
        }

        return tables;
    }

  /**
   *
   * @desc - render
   * @return {JSX}
   *
   **/
    render() {
        if(!this.state.renderFinalDecision) {
            return null;
        }

        let finalDecisionMainTable = this.getFinalDecisionMainTable();
        let finalDecisionTables = this.getFinalDecisionTableByApptId();
        let finalDecisionModal = this.getFinalDecisionModal();
        let finalDecisionCommentModal = this.getFinalDecisionCommentModal();
        let getReopenCaseModal = this.getReopenCaseModal();
        let getCasesAdminSuccessModal = this.getCasesAdminSuccessModal();

        return (
      <div>
        {finalDecisionMainTable}
        {finalDecisionTables}
        {finalDecisionModal}
        {finalDecisionCommentModal}
        {getReopenCaseModal}
        {getCasesAdminSuccessModal}
        <APIFailureModal {...{failurePromise: this.state.promise}} />
      </div>
    );
    }
}
