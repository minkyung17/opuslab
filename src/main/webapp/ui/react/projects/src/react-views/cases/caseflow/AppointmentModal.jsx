import React from 'react';
import PropTypes from 'prop-types';
import {RadioGroup, Radio} from 'react-radio-group';

/**
*
* @desc - My Opus Logic imports
*
**/
import * as util from '../../../opus-logic/common/helpers/';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import Appointment from '../../../opus-logic/cases/classes/caseflow/Appointment';
import AppointmentBlock from '../../../opus-logic/cases/modules/AppointmentBlock';

/**
*
* @desc - My View Layer imports
*
**/
import BaseModal from './BaseModal.jsx';
import {defaultModalProps, constants} from '../constants/Cases';
import {AppointmentHeader, AppointmentSet, SingleAppointment} from
  '../components/AppointmentBlocks.jsx';


/********************************************************************************
*
* @desc -
*
********************************************************************************/
export default class AppointmentModal extends BaseModal {
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
    selectedActionType: PropTypes.string,
    modal_body_div_class: PropTypes.string
  };
  static defaultProps = {
    ...defaultModalProps,
    showModal: true,
    modalSize: '  ',
    nextModal: 'PROPOSED_FIELDS',
    previousModal: 'ACTION_TYPE',
    modal_body_div_class: ''
  };

  /**
  *
  * @desc - Instance Variables
  *
  **/
  apptIds = {apptSet: 'apptSet'};
  Logic = new Appointment(this.props);
  AppointmentBlock = new AppointmentBlock();
  state = {
    disableNextButton: true,
    showModal: this.props.showModal
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


  /**
  *
  * @desc -
  * @return {void}
  *
  **/
  componentDidMount() {
    this.renderAppointments();

    let {appointment} = constants.modalNames;
    this.props.setPreviousModalofOtherModalInGlobalState({proposedFields: appointment});
  }

  /**
  *
  * @desc - Sets the data, gets the data, and shows it in state
  * @return {void}
  *
  **/
  renderAppointments() {
    this.setOpusAppointmentData();
    let appointmentData = this.getOpusAppointmentData();
    this.setApptDataForRender(appointmentData);
  }


  /**
  *
  * @desc - This sets actionTypes, selectedActionType, and the person from
  *   which to appointmentSetList and appointmentInfo
  * @return {void}
  *
  **/
  setOpusAppointmentData() {
    //Get filtered appointment data, sets, and fields
    let {globalData: {actionTypes}, selectedActionType, selectedPerson} = this.props;
    this.Logic.setAppointmentData({actionTypes, selectedActionType,
      selectedPerson});
  }

  /**
  *
  * @desc -
  * @return {Object} appointmentData - filtered and formatted appointmentData
  *
  **/
  getOpusAppointmentData() {
    let appointmentData = this.Logic.formatAndFilterAppointments();
    return appointmentData;
  }

  /**
  *
  * @desc -
  * @param {Object} - filteredAppointmentInfo, filteredAppointmentSetList,
  *   apptSetFields, singleApptFields
  * @return {void}
  *
  **/
  setApptDataForRender({filteredAppointmentInfo, filteredAppointmentSetList,
    apptSetFields, singleApptFields} = {}) {

    let apptDisplays = this.AppointmentBlock.getDisplayFieldsFromAppointments(
      filteredAppointmentSetList);

    this.setState({filteredAppointmentInfo, filteredAppointmentSetList, apptSetFields,
      singleApptFields, apptDisplays});
  }

  /**
  *
  * @desc - Updates the appointment choice user clicks on
  * @param {String} appt_id - id of radio button clicked appointment
  * @return {void}
  *
  **/
  selectedAppointmentOnClick = (appt_id) => {
    this.selectedAppointment = this.Logic.getAppointmentById(appt_id);
    this.setState({disableNextButton: false});
    util.print('selected appts to redux ', this.selectedAppointment);
  }

  /**
  *
  * @desc - self-explanatory
  * @return {JSX} - changes the modal
  *
  **/
  onClickNext = () => {
    let {changeCurrentModalWithSelectedApptInGlobalState, nextModal: next} = this.props;
    //let reset = () => {changeCurrentModalInGlobalState('');};
    changeCurrentModalWithSelectedApptInGlobalState(next, this.selectedAppointment);
  }


  /**
  *
  * @desc -
  * @return {JSX} -
  *
  **/
  getModalBody() {
    let {selectedPerson, modal_body_div_class} = this.props;
    let {apptSetFields = [], singleApptFields = [], selectedValue} = this.state;
    let {apptSetToolTipHeaderText, singleApptTooltipHeaderText} = constants;
    let {appointeeInfo = {}} = selectedPerson;
    let {fullName: name, officialEmail} = appointeeInfo;
    let {apptSet: apptSetId} = this.apptIds;
    let dontDisplay = [];//['apuId'];
    let modalInstructionText = this.Logic.getModalInstructionText(singleApptFields,
      apptSetFields);

    return(
      <div className={modal_body_div_class}>
        <h1 className="flush-top">{name}</h1>
        <p className="small">{officialEmail}</p><br/>
        {modalInstructionText} <br />

        <RadioGroup name="appointment-choices" {...{selectedValue}}
          onChange={this.selectedAppointmentOnClick}>

          <ShowIf show={apptSetFields.length}>
            <label className=" block ">
              <Radio value={apptSetId} className=" col-sm-1 " type="radio" />
              <div className="indent-45">
                <AppointmentHeader title={'Appointment Set'}
                  instructionText={'(Most people choose this option.)'} />
                <AppointmentSet tooltip_text={apptSetToolTipHeaderText}
                  apptDisplays={apptSetFields} dontDisplay={dontDisplay}/>
              </div>
            </label>
          </ShowIf>

          {singleApptFields.map((each, index) => {
            return (
              <label key={index} className=" block " >
                <Radio value={each.appointment.appointmentId} className=" col-sm-1 "/>
                <div className="indent-45">
                  <AppointmentHeader title={'Single Appointment'}
                    instructionText={singleApptTooltipHeaderText} />
                  <SingleAppointment apptDisplay={each}
                    tooltip_text={singleApptTooltipHeaderText}/>
                </div>
              </label>);
          })}
        </RadioGroup>
      </div>
    );
  }
}
