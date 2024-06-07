import React from 'react';
import PropTypes from 'prop-types';

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import BaseModal from './BaseModal.jsx';
import {defaultModalProps, constants} from '../constants/Cases';

import Recruit from '../../../opus-logic/cases/classes/caseflow/Recruit';
import {Footer, Dismiss} from '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {MultipleAppointmentsBlock} from '../components/AppointmentBlocks.jsx';

/*******************************************************************************
*
* @desc - React JSX modal that entering a job number and getting the name results
*
********************************************************************************/
export default class RecruitMergeModal extends BaseModal {
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
    selectedPerson: PropTypes.object,
    modal_body_div_class: PropTypes.string
  };
  static defaultProps = {
    ...defaultModalProps,
    showModal: true,
    modalSize: '  ',
    nextModal: 'NEW_APPOINTMENT',
    previousModal: 'RECRUIT_UID',
    modal_body_div_class: '',
    ulBaseClass: ' noBullet '
  };

  /**
  *
  * @desc - Instance variables
  *
  **/
  Recruit = new Recruit(this.props);
  apptBlocks = [];

  /**
  *
  * @desc - State vars
  *
  **/
  state = {
    showModal: this.props.showModal || true,

    recruitPersonName: '',
    recruitPersonApplicantId: null,
    recruitPersonEmail: '',

    existingPersonName: '',
    existingPersonUID: null,
    existingPersonEmail: ''
  }

  /**
  *
  * @desc - State vars
  * @param {Object} props - input props
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
    this.initializeModalPaths();
    this.initRecruitData();
    this.initAppointments();
  }

  /**
  *
  * @desc - Sets modal path in redux
  * @returns {void}
  *
  **/
  initializeModalPaths() {
    let {recruitMerge} = constants.modalNames;
    this.props.setPreviousModalofOtherModalInGlobalState({newAppointment: recruitMerge});
    this.props.mergeRecruitTypeInGlobalState('N'); //reset the merge flag when this modal is loaded
  }

  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @return {void}
   *
  **/
  componentWillReceiveProps({showModal} = {}) {
    this.setState({showModal});
  }

  /**
  *
  * @desc - Initialize the local state variables with the selected Recruit person
  * @return {void}
  *
  **/
  initRecruitData() {
    let {appointeeInfo = {}} = this.props.selectedPerson;
    let {fullName: recruitPersonName, applicantId: recruitPersonApplicantId,
      contactValue: recruitPersonEmail} = appointeeInfo;
    this.setState({recruitPersonName, recruitPersonApplicantId,
      recruitPersonEmail});
  }

  /**
  *
  * @desc - Initialize the local state variables with the selected UID person
  * @return {void}
  *
  **/
  initAppointments() {
    let {appointmentInfo, appointeeInfo} = this.props.selectedUIDPerson;
    let {fullName, uid, contactValue} = appointeeInfo;
    this.setState({existingPersonName: fullName, existingPersonUID: uid,
      existingPersonEmail: contactValue});

    this.apptBlocks = this.Recruit.getAppointmentBlocks(appointmentInfo);
  }

  /**
  *
  * @desc - Sets the merge flag to Y
  * @return {void}
  *
  **/
  onClickMerge = () => {
    // Set contactValue for selectedPerson with recruit email when merging
    this.props.selectedPerson.appointeeInfo.contactValue = this.state.existingPersonEmail;
    this.props.selectedPerson.appointeeInfo.uid = this.state.existingPersonUID;
    this.setMergeFlagAndNextModal('Y');
  }

  /**
  *
  * @desc - Sets the merge flag to N
  * @return {void}
  *
  **/
  onClickDontMerge = () => {
    this.setMergeFlagAndNextModal('N');
  }

  /**
  *
  * @desc - Sets the merge flag and next modal
  * @param {String} mergeFlag - Y/N to indicate whether or not to merge records
  * @return {void}
  *
  **/
  setMergeFlagAndNextModal(mergeFlag) {
    let {mergeRecruitTypeInGlobalState} = this.props;
    mergeRecruitTypeInGlobalState(mergeFlag);

    let {changeCurrentModalInGlobalState} = this.props;
    changeCurrentModalInGlobalState(this.nextModal || this.props.nextModal);
  }

  /**
  *
  * @desc - returns specific body jsx for this modal
  * @return {JSX} - body
  *
  **/
  getModalBody() {
    let {recruitPersonName, recruitPersonApplicantId, recruitPersonEmail,
      existingPersonName, existingPersonUID, existingPersonEmail} = this.state;

    return(
      <div>
        <p>
          We've found the following person with this UID.
        </p>
        <ul className={this.props.ulBaseClass}>
          <li className="strong">{existingPersonName}</li>
          <li>UID: {existingPersonUID}</li>
          <li>Email: {existingPersonEmail}</li>
        </ul>
        <MultipleAppointmentsBlock apptDisplays={this.apptBlocks}
          showToggleLink={false} showOnStart />
          <br/>
        <p>
          Are these the same people?  Would you like to merge their records?
        </p>
        <ul className={this.props.ulBaseClass}>
          <li className="strong">{recruitPersonName}</li>
          <li>Email: {recruitPersonEmail}</li>
        </ul>
        <p>
          Doing so will combine their records in Opus under the same UID
          once you’ve started this appointment case.
          If this is not the same person, Cancel or go back and try entering
          another UID.
        </p>
      </div>
    );
  }

  /**
  *
  * @desc - Gets footer
  * @param {Object} props - var to enable next  button
  * @return {void}
  *
  **/
  getModalFooter() {
    return (
      <Footer>
        <button className="btn btn-primary left"
          onClick={this.onClickMerge}>
          Merge Records
        </button>
        <button className="btn btn-primary left"
          onClick={this.onClickDontMerge}>
          Do Not Merge Records
        </button>
        <button className="left btn btn-link" onClick={this.onClickBack}>
          Back
        </button>
        <Dismiss className="left btn btn-link">Cancel</Dismiss>
      </Footer>
    );
  }
}
