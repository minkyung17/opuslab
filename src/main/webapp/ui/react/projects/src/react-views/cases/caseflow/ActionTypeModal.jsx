import React from 'react';

/**
*
* @desc - My imports
*
**/
import BaseModal from './BaseModal.jsx';
import {defaultModalProps, constants} from '../constants/Cases';
import {Select} from '../../common/components/forms/SelectOption.jsx';
import ActionType from '../../../opus-logic/cases/classes/caseflow/ActionType';


/*******************************************************************************
*
* @desc - React JSX modal that shows Action Types
*
*******************************************************************************/
export default class ActionTypeModal extends BaseModal {
  /**
  *
  * @desc -
  *
  **/
  static defaultProps = {
    ...defaultModalProps,
    showModal: true,
    nextModal: 'APPOINTMENT', //modalNames.appointment,
    previousModal: 'NAME_SEARCH' //modalNames.nameSearch
  };

  /**
  *
  * @desc - Instance variables
  *
  **/
  Logic = new ActionType(this.props);
  dropdowns = {
    options_value_key: ActionType.code_text,
    options_text_key: ActionType.action_type_display_key
  };

  /**
  *
  * @desc - After component is rendered, determine correct action types to
  *   let the user choose from
  * @param {Object} props - props passed in on startup
  * @return {void}
  *
  **/
  constructor(props = {}) {
    super(props);
  }

  //React State variables
  state = {
    disableNextButton: true,
    showModal: this.props.showModal
  };

  /**
  *
  * @desc - After component is rendered, determine correct action types to
  *   let the user choose from
  * @return {void}
  *
  **/
  componentDidMount() {
    this.setActionListForPerson();
  }

  /**
  *
  * @desc - get persons action types and globally set them
  * @return {void} -
  *
  **/
  setActionListForPerson() {
    let {selectedPerson: {appointmentInfo}} = this.props;
    let actionList = this.Logic.determineSortedActionTypes(appointmentInfo);
    this.setState({actionList});
  }

  /**
  *
  * @desc - If coming from 'Recruit' branch save in state
  * @return {void}
  *
  **/
  updateModalPathInfo() {
    //Its not the recruit branch :-)
    this.props.chooseSaveTypeInGlobalState('Normal');
  }


  /**
  *
  * @desc -
  * @param {String} actionType -
  * @param {Object}  constants - modalNames
  * @param {Object} currentModal -
  * @return {Object} - field values that are now populated
  *
  **/
  formatActionTypeModalFlow(actionType, {modalNames} = constants) {
    let path = this.Logic.getCaseFlowPath(actionType);
    let {pseudoNewAppointment} = this.Logic.getAppointmentTypeFromActionType(actionType);
    let {previousSectionNameOfSection = {}} = path;
    let modalPath = {};

    //If its an exception type only have one set of fields
    if(pseudoNewAppointment) {
      modalPath.nextModal = modalNames.proposedFields;
      modalPath.pseudoNewAppointment = pseudoNewAppointment;
    }

    //Lets set the previous modal of 'Proposed Fields' to this modal
    if(previousSectionNameOfSection.proposedFields) {
      let {proposedFields: beforeProposedFieldsModal} = previousSectionNameOfSection;
      modalPath.proposedFieldsPreviousModal = {proposedFields: beforeProposedFieldsModal};
    }

    return modalPath;
  }


  /**
  *
  * @desc - Whenever user selects an action type update here
  * @param {Object} event - click event
  * @return {void}
  *
  **/
  selectActionType = ({target: {value} = {}} = event) => {
    this.selectedActionType = value;

    let modalPath = this.formatActionTypeModalFlow(this.selectedActionType);
    let {nextModal, proposedFieldsPreviousModal} = modalPath;
    this.nextAssignedModal = nextModal || null;//PROPOSED_FIELDS modal

    let disableNextButton = value ? false : true;
    this.setState({disableNextButton, value});

    //Set modal flow path in state
    this.props.setPreviousModalofOtherModalInGlobalState(proposedFieldsPreviousModal);
    this.props.setAppointmentDirectionsInGlobalState(modalPath);
    this.props.setSelectedAppointmentInGlobalState([]);
  }

  /**
  *
  * @desc - sets next modal with action type
  * @return {void} -
  *
  **/
  onClickNext = () => {
    let {nextModal: next} = this.props;

    //Choose the default next modal or next calculated modal based on dropdown selection
    let nextModal = this.nextAssignedModal || next;//Switch next modal if necessary
    this.props.changeCurrentModalWithSelectedActionTypeInGlobalState(nextModal,
      this.selectedActionType);
  }

  /**
  *
  * @desc -
  * @return {JSX} -
  **/
  getModalBody() {
    let {props: {selectedPerson}, state: {value, actionList}} = this;
    let {appointeeInfo} = selectedPerson;
    let {fullName, officialEmail} = appointeeInfo;
    let {options_value_key: code, options_text_key: actionTypeDisplayText} = this.dropdowns;

    return(
      <div>
        <h2 className="flush-top">{fullName}</h2>
        <p className="small">{officialEmail}</p>
        <p> <label>What type of case would you like to start?</label> </p>
        <Select {...{value}} options_value_key={code} options_text_key={actionTypeDisplayText}
          options={actionList} onChange={this.selectActionType} alphabetized />
        <br/>
        <p> You can choose from the cases that are relevant for the
          person's appointments.
        </p>
        <p>For appointees in more than one department, the Primary department
          generally initiates advancement actions.</p>
      </div>
    );
  }
}
