import React from "react";
import PropTypes from "prop-types";
import {keys} from "lodash";
/**
*
* @desc - My Opus Logic imports
*
**/
import * as util from "../../../opus-logic/common/helpers/";
import ProposedFields from "../../../opus-logic/cases/classes/caseflow/ProposedFields";
import CasesDossier from "../../../opus-logic/cases/classes/CasesDossier";
/**
*
* @desc - My View Layer imports
*
**/
import BaseModal from "./BaseModal.jsx";
import {defaultModalProps, tooltips} from "../constants/Cases";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {FormInput} from "../../common/components/forms/FormElements.jsx";
import {MultipleAppointmentsBlock} from "../components/AppointmentBlocks.jsx";
import {EndowedChairBlock} from "../components/EndowedChairBlock.jsx";
import {FormShell, VisibleFormGroup} from "../../common/components/forms/FormRender.jsx";
import APIResponseModal, {Failure} from "../../common/components/bootstrap/APIResponseModal.jsx";
import Modal, {Header, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {ToolTip} from "../../common/components/elements/ToolTip.jsx";
/*******************************************************************************
*
* @desc - React JSX modal that handles gettings names and selecting them &
*   selecting them from the AutoComplete.
* @returns {void}
*
********************************************************************************/
export default class ProposedFieldsModal extends BaseModal {
  /**
  *
  * @desc -
  *
  **/
    static propTypes = {
        nextModal: PropTypes.string,
        showModal: PropTypes.bool,
        modalFooter: PropTypes.object,
        modalHeader: PropTypes.object,
        actionTypes: PropTypes.object,
        selectedPerson: PropTypes.object,
        selectedActionType: PropTypes.string
    };
    static defaultProps = {
        ...defaultModalProps,
        showModal: true,
        previousModal: "APPOINTMENT"
    };

    state = {
        ...this.state,
        apptDisplays: [],
        endowedChairDisplays: [],
        disableSaveButton: false,
        proposedActionFlags: [],
        viewData: {}
    }

  //viewData = {};
    Logic = new ProposedFields(this.props);
    CasesDossierLogic = new CasesDossier(this.props);

  /**
  *
  * @desc - When component is first mounted
  * @param {Object} props - passed in from parent
  * @return {void}
  *
  **/
    constructor(props = {}) {
        super(props);

        this.initProposedFields(props);
    }

  /**
  *
  * @desc - Delaying init for tooltips because for some reason its not working
  * @return {void}
  *
  **/
    componentDidMount() {
        setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
    }

  /**
  *
  * @desc - If state was set or recieved new props
  * @return {void}
  *
  **/
    componentDidUpdate() {
        util.initJQueryBootStrapToolTipandPopover();
    }

  /**
  *
  * @desc - Set data in Logic class, get info for modal to show in this view
  * @param {Object} props - all props
  * @return {void}
  *
  **/
    async initProposedFields(props = this.props) {
    //Extract all data we need to start this page
        let {selectedActionType, selectedAppointment, appointmentDirections,
      selectedPerson, mergeOpusIdFlag} = props;

    //Fields for making and updating forms
        let {opusSortedAppointmentIds, apptDisplays, endowedChairDisplays,
      fieldData, proposedAction, proposedStatusByApptId, appointmentIds, appointmentTemplate,
      statusFieldsTitlesByApptId, appointmentsByApptId} =
        await this.Logic.initProposedFieldsFromAPIData({actionType: selectedActionType,
        appointment: selectedAppointment, selectedPerson, appointmentDirections,
        mergeOpusIdFlag});

    //Extract view data that is just for showing info
        let viewData = this.Logic.getViewDataFromSelectedPerson(selectedPerson,
      selectedAppointment);

    // Find out which flagged actions should display
        let newCheckedProposedActionFlagsArray
    = this.CasesDossierLogic.setProposedActionFlagsDisplayInModal(props.selectedActionType);

    //Set in state to render
        this.setState({fieldData, proposedActionFields: proposedAction, appointmentIds, endowedChairDisplays,
      statusFieldsTitlesByApptId, proposedStatusFieldsByApptId: proposedStatusByApptId, apptDisplays, appointmentTemplate,
      appointmentsByApptId, opusSortedAppointmentIds, viewData, proposedActionFlags: newCheckedProposedActionFlagsArray});
    }

  /**
  *
  * @desc - Sets various data ProposedFields Logic class will need
  * @param {Object} - selectedAppointment & selectedPerson
  * @return {void}
  *
  **/
    setDataForLogicClass({selectedAppointment = {}, selectedPerson = {},
    mergeOpusIdFlag, selectedActionType} = {}) {
        this.Logic.setClassData({selectedAppointment, selectedPerson, mergeOpusIdFlag,
      selectedActionType});
    }

  /**
  *
  * @desc - Update proposed action fields
  * @param {Event} event - on change event
  * @return {void}
  *
  **/
    onChange =  (event) => {
    //Update value
        let {target: {name, value}} = event;
        let {proposedActionFields} = this.state;
        proposedActionFields[name].value = value;

        this.Logic.validateFieldOnUpdate(proposedActionFields[name]);

        //Update dependent fields
        this.Logic.updateFieldDataByToggle(proposedActionFields, name, "active");

        //Update form fields
        this.setState({proposedActionFields});
    }

    onSearchEndowedChairClick = async (event, {appointmentId} = {}) => {
      let {proposedStatusFieldsByApptId} = this.state;
      let proposedStatusFields = proposedStatusFieldsByApptId[appointmentId];
      let {selectedAppointment, selectedPerson} = this.props;
      let opusId = selectedPerson.appointeeInfo.opusPersonId;
      let promise = this.Logic.getEndowedChairDataFromName(event.target.value, opusId, -1);
      let results = await promise;
      let {personWithEndowedChair} = results;
      let series = selectedAppointment[0].titleInformation.series;
      let rank = selectedAppointment[0].titleInformation.rank.rankTypeDisplayText;
      let {endowedChair, endowedChairBlockData} = this.Logic.formatEndowedChairObject(name, results, series, rank);
      this.Logic.setSelectedEndowedChair = endowedChair;
      proposedStatusFields.selectedEndowedChair.value = event.target.value;
      proposedStatusFields.endowedChair.value = '';
      //Update dependent fields
      // this.Logic.updateFieldDataByToggle(proposedActionFields, name, "active");
      this.setState({endowedChairDisplays: endowedChairBlockData, endowedChair, personWithEndowedChair});
      // this.setSelectedPersonInGlobalState(person);
    }

  /**
  *
  * @desc - When a user does something to change the formField
  * @param {Event} event - on change of field data
  * @param {Object} props - appointmentId to use
  * @return {void}
  *
  **/
    onChangeStatusFields = async (event, {appointmentId} = {}) => {
        const fieldsToExclude = this.Logic.getExclusionFieldsForLocation();
        let {name, value} = event.target;
        let {state: {appointmentsByApptId, proposedStatusFieldsByApptId}} = this;
        let proposedStatusFields = proposedStatusFieldsByApptId[appointmentId];
        let {helpText} = this.Logic;
        // console.log(name);
        // console.log(value);
        // console.log(proposedStatusFields);
        if (name === 'endowedChairNameSearch') {
          if(value.length>=3) {
            let endowedChairOptions = await  this.Logic.searchForEndowedChairOnChange(proposedStatusFields, name, value);
            if(endowedChairOptions.endowedOptions.length>0){
              proposedStatusFields.endowedChair.error = null;
              this.setState({endowedChairOptions});
            }else{
              proposedStatusFields.endowedChair.error = "We could not find an active Endowed Chair with that name. Please double check that the Chair you are searching for is active.";
            }
          }else{
            proposedStatusFields.endowedChair.error = null;
          }
        } else  if (fieldsToExclude.includes(name)){
          //Do not reload pag
            event.preventDefault();
            this.Logic.handleLocationFields(name, value, proposedStatusFields);
        }else{
        // Other non location based fields work normally
            proposedStatusFields[name].value = value;

          // If location 1 number input is disabled and user changes appointment percent time, update location 1 number input
            if(name==="appointmentPctTime" && proposedStatusFields.locationDisplayText1
              && proposedStatusFields.locationDisplayText1.isNumberDisabled){
                proposedStatusFields.locationDisplayText1.numberValue = parseInt(value);
            }
        }

        //Update dependent fields
        this.Logic.updateFieldDataByToggle(proposedStatusFields, name, "active");
        this.renderFormFields(proposedStatusFieldsByApptId);

        // Need to set correct location visibility values on departmentCode toggle
        if(name==="departmentCode" && proposedStatusFields.schoolName
          && proposedStatusFields.schoolName.value==="Medicine"
          && proposedStatusFields.locationDisplayText2.visibility===false){
            proposedStatusFields.locationDisplayText1.isNumberDisabled = false;
            proposedStatusFields.locationDisplayText1.showAdd = true;
            proposedStatusFields.locationDisplayText1.showDelete = true;
            proposedStatusFields.locationDisplayText1.isDeleteDisabled = true;
            proposedStatusFields.locationDisplayText1.helpText = helpText;
            if(proposedStatusFields.locationDisplayText1.numberValue===null){
                proposedStatusFields.locationDisplayText1.isAddDisabled = true;
            }
        }else if(name==="departmentCode" && proposedStatusFields.schoolName
          && proposedStatusFields.schoolName.value!=="Medicine"){
            this.Logic.resetLocations(proposedStatusFields);
        }

        this.Logic.validateFieldOnUpdate(proposedStatusFields[name]);

        //Update salary fields from API
        let appointment = appointmentsByApptId[appointmentId];

        await this.Logic.updateFieldDataFromSalaryAPI(name, proposedStatusFields,
          appointment, null, "proposed");

        this.renderFormFields(proposedStatusFieldsByApptId);
    };


  /**
  *
  * @desc - When user clicks off a field
  * @param {Object} event -
  * @param {Object} props -
  * @return {JSX}
  *
  **/
    onBlur = (event, {appointmentId: apptId} = {}) => {
    //Update value
        let {target: {name}} = event;
        let {state: {proposedStatusFieldsByApptId, proposedActionFields}} = this;
        let proposedStatusFields = proposedStatusFieldsByApptId[apptId];
        let allFields = {...proposedActionFields, ...proposedStatusFields};

        this.Logic.validateFieldOnBlur(allFields[name]);

        this.renderFormFields(proposedStatusFieldsByApptId);
    }

  /**
  *
  * @desc - Gets visible proposedStatus fields and set them into state
  * @param {Object} proposedStatusFieldsByApptId -
  * @return {void}
  *
  **/
    renderFormFields = (proposedStatusFieldsByApptId = this.state.proposedStatusFieldsByApptId) => {
        let {proposedActionFields} = this.state;

    //Now update Modal
        this.setState({proposedActionFields, proposedStatusFieldsByApptId});
    }

  /**
  *
  * @desc - Validates before saving
  * @return {JSX}
  *
  **/
    startSaveCase = async () => {
    //Extract fields to validate from state
        let {proposedActionFields, proposedStatusFieldsByApptId, appointmentIds} = this.state;
        this.setState({disableSaveButton: true});

    //Validate proposed action and status fields
        this.Logic.validateProposedFields(proposedActionFields, proposedStatusFieldsByApptId);

    // IOK-577 Appt Sets have multiple appointment Ids
        for(let each of appointmentIds){
            this.Logic.locationValidation(proposedStatusFieldsByApptId[each]);
        }

    //Do these fields have errors?
        let hasErrors = this.Logic.doProposedFieldsHaveErrors(proposedActionFields,
      proposedStatusFieldsByApptId);

    //If any fields have any errors
        if(hasErrors) {
            this.setState({saveError: true, disableSaveButton: false});
        } else { //Set error status to false and save the case
            this.setState({saveError: false, disableSaveButton: true});
            this.saveCase();
        }

    //Lets reset the fields even if they have errors
        this.renderFormFields();
    }

  /**
  *
  * @desc - Extract ui fields, save a case, reload the cases table
  * @return {void}
  *
  **/
    saveCase = async () => {

    //Extract updated data from state
        let {appointmentTemplate, proposedActionFields, proposedStatusFieldsByApptId, proposedActionFlags, endowedChair} = this.state;

    //Extract global data from props
        let {saveType, mergeOpusIdFlag, selectedActionType, selectedAppointment,
      selectedPerson, selectedUIDPerson: {appointeeInfo: selectedUIDPersonAppointeeInfo,
      appointeeInfo: {mergeOpusId} = {}} = {}} = this.props;

    //Go to Logic side to save case
        let promise = this.Logic.saveNewCaseToAPI(selectedAppointment, proposedActionFields,
      proposedStatusFieldsByApptId, {saveType, selectedPerson, mergeOpusId, actionType: selectedActionType, mergeOpusIdFlag,
      selectedUIDPersonAppointeeInfo, endowedChair, appointmentTemplate, proposedActionFlags});

    //If it fails it will have a custom error message
        let caseId = null;
        try {
            caseId = await promise;
        } catch(e) {
            console.log("ERROR: api call in 'saveCase' in ProposedFieldsModal.jsx");
            this.setState({emailFailureMessage: e.responseJSON.message});
        }

    //Case summary caseId so people can click on success link
        this.setCaseSummaryArgs(caseId, selectedActionType);

    //Reset modals and buttons
        this.setState({failurePromise: promise, disableSaveButton: false,
      showSuccessModal: !!caseId, showModal: false});

    }

  /**
  *
  * @desc - Gets actionCategoryId & actionTypeId and sets into state
  * @param {String} caseId - caseId
  * @param {String} actionType - 3-2, 2-7, etc
  * @return {void}
  *
  **/
    setCaseSummaryArgs(caseId, actionType) {
        let href = this.Logic.getCaseCreatedUrl(caseId, actionType);
        this.setState({caseSummaryCaseUrl: href});
    }


  /**
  *
  * @desc - Determines which modal to go to when clicking back button
  * @return {void}
  *
  **/
    onClickBack = () => {
        let dynamicPreviousModal = this.props.previousModals.proposedFields;
        let {previousModal, changeCurrentModalInGlobalState} = this.props;
        changeCurrentModalInGlobalState(dynamicPreviousModal || previousModal);
    }

  /**
  *
  * @desc - Hides success modal
  * @return {void}
  *
  **/
    dismissSuccessModal = () => {
        this.setState({showSuccessModal: false});
    //Make sure the active cases table reloads to have the new cases in there
        this.reloadActiveCasesTable();
    }

  /**
  *
  * @desc - Reload table
  * @return {void}
  *
  **/
    reloadActiveCasesTable() {
        if(window._reloadActiveCases) {
            window._reloadActiveCases();
        }
    }

  /**
  *
  * @desc - Changes checked attribute for proposed action flags
  * @return {void}
  *
  **/
    changeProposedActionFlags(evt, action){
        let proposedActionFlags = this.CasesDossierLogic.changeProposedActionFlags(
      evt.target.checked, action, this.state.proposedActionFlags);
        this.setState({proposedActionFlags: proposedActionFlags});
    }



  /**
  *
  * @desc - This is the create a case modal
  * @return {void}
  *
  **/
    getCaseCreatedModal() {
        let {viewData: {fullName}} = this.state;
        let {caseSummaryCaseUrl: href, showSuccessModal} = this.state;

        return (
      <Modal show={showSuccessModal} onHide={this.dismissSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Congratulations! </h1>
        </Header>
        <Body>
          You have created a case for {fullName}. <br/> <br/>
        </Body>
        <Footer>
          <a {...{href}} className="white left btn btn-success" target="_blank" >
            Go to Case Summary
          </a>
          <Dismiss className="left btn btn-link" onClick={this.dismissSuccessModal}>
            Back to Active Cases
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
  *
  * @desc -
  * @return {JSX} - jsx
  *
  **/
    getModalFooter() {
        return (
      <Footer>
        {/* <Dismiss className="btn btn-default">Cancel</Dismiss> */}
        <button className="btn btn-primary left" onClick={this.onClickBack}>
          <span className=" icon-left wizard" />
          Back
        </button>
        <button className="btn btn-primary left" onClick={this.startSaveCase}
          disabled={this.state.disableSaveButton} >
          Save
        </button>
      </Footer>
    );
    }

  /**
  *
  * @desc - Gets form fields for this Modal
  * @return {JSX}
  *
  **/
    getModalBody() {
      let {modal_body_div_class} = this.props;
    //Extract current state data that will be shown on updated
        let {statusFieldsTitlesByApptId, apptDisplays,
      proposedStatusFieldsByApptId, saveError, endowedChairDisplays,
      opusSortedAppointmentIds, proposedActionFields, viewData,
    } = this.state;

    //Extract onclick events to update fieldData
        let {onBlur, onChange, onSearchClick, onChangeStatusFields} = this;
        return (
      <Body>
        <div className={modal_body_div_class} >
          <h1 className=" flush-top ">{viewData.fullName ? viewData.fullName : null}</h1>

          <p className="small">
            <span>UID: {viewData.uid ? viewData.uid : null}<br /></span>
            <span>Email: {viewData.email ? viewData.email : null}<br /></span>
            {viewData.jobNumberText ? <span>{viewData.jobNumberText}<br /></span> : null}
            {viewData.hireDt ? <span>Hire Date: {viewData.hireDt}<br/></span> : null}
            {viewData.yearsAtCurrentRankText ? <span>{viewData.yearsAtCurrentRankText}<br /></span> : null}
            {viewData.yearsAtCurrentStepText ? <span>{viewData.yearsAtCurrentStepText}<br /></span> : null}
            {viewData.yearsOnTheClock ?
              <span>Years on the Clock: {viewData.yearsOnTheClock}<br/></span>
              :
              null
            }
            {viewData.timeOffTheClock ?
              <span>Time off the Clock: {viewData.timeOffTheClock}<br/></span>
              :
              null
            }
            {viewData.serviceAsProposedEffDt ?
              <span>Service as of Proposed Effective Date: {viewData.serviceAsProposedEffDt}<br/></span>
              :
              null
            }

          </p>

          <MultipleAppointmentsBlock {...{apptDisplays}} />

          <FormShell>

            <h4 className=" form-subtitle ">Proposed Action</h4>

            <VisibleFormGroup fields={proposedActionFields} {...{onChange, onBlur}} />

            {this.state.proposedActionFlags.length>0 ?
              <div className={" form-group "}>
                <div className=' col-sm-4 '>
                  <label className={"  form-control-static control-label "}>
                      Action Flags
                      <ToolTip text={tooltips.proposedActionFlag} />
                  </label>
                </div>
                <div className=' col-sm-8 '>
                  {this.state.proposedActionFlags.map((action, index) =>
                      action.shouldDisplay ?
                      <div key={index} className={" form-control-static "}>
                        <input type="checkbox" className="left" name={action.name}
                          onChange={(evt) => this.changeProposedActionFlags(evt, action)}/>
                          {action.displayName}
                      </div>
                      :
                      null
                  )}
                </div>
              </div>
              :
              null
            }

            {/* {appointmentIds && appointmentIds.map((appointmentId, index) => {
              let appointment = proposedStatusFieldsByApptId[appointmentId]; */}
            {opusSortedAppointmentIds && opusSortedAppointmentIds.map((appointmentId,
              index) => {
              //Do we have fields? Lets get the length
                let {length} = keys(proposedStatusFieldsByApptId[appointmentId]);
                return (
                <div key={index}>
                  <ShowIf show={length}>
                    <div>
                      <h4 className=" form-subtitle ">Proposed Status</h4>
                      <h5> {statusFieldsTitlesByApptId[appointmentId]} </h5>
                      <VisibleFormGroup key={index} {...{onChange: onChangeStatusFields,
                        fields: proposedStatusFieldsByApptId[appointmentId],
                        onBlur, appointmentId}} onSearchClick={this.onSearchEndowedChairClick} />
                    </div>
                  </ShowIf>
                </div>);
            }
            )}
          </FormShell>
          <EndowedChairBlock {...{endowedChairDisplays}} />
          <br/>
          <ShowIf show={this.state.personWithEndowedChair} >
            <p className="error_message"> {this.state.personWithEndowedChair} </p>
          </ShowIf>
          <ShowIf show={saveError}>
            <p className="error_message">Please check form for errors.</p>
          </ShowIf>
        </div>
      </Body>
    );
    }


  /**
  *
  * @desc -
  * @return {JSX} -
  *
  **/
    render() {
        let {state: {showModal, disableNextButton, failurePromise, emailFailureMessage},
      closeModal} = this;
        let caseCreatedModal = this.getCaseCreatedModal();
        let header = this.getModalHeader({title: "Start a Case"});
        let body = this.getModalBody();
        let footer = this.getModalFooter({disableNextButton});
        return(
      <div>
        {caseCreatedModal}
        <APIResponseModal showChildren {...{failurePromise}}>
          <Failure>
            <div dangerouslySetInnerHTML={{__html: emailFailureMessage}} />
          </Failure>
        </APIResponseModal>
        <Modal className="modal-lg" backdrop="static" ref="modal" show={showModal}
          onHide={closeModal}>
          {header}
          {body}
          {footer}
        </Modal>
      </div>
    );
    }
}
