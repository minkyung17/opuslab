import React from 'react';
import PropTypes from 'prop-types';

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import BaseModal from './BaseModal.jsx';
import {defaultModalProps, constants} from '../constants/Cases';
import * as util from '../../../opus-logic/common/helpers/';
import Recruit from '../../../opus-logic/cases/classes/caseflow/Recruit';
import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions.js';

/*******************************************************************************
*
* @desc - React JSX modal that entering a job number and getting the name results
*
********************************************************************************/
export default class NewAppointmentModal extends BaseModal {

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
    modal_body_div_class: PropTypes.string
  };
  static defaultProps = {
    ...defaultModalProps,
    showModal: true,
    modalSize: '  ',
    nextModal: 'PROPOSED_FIELDS',
    previousModal: 'NAME_SEARCH',
    modal_body_div_class: ''
  };

  /**
  *
  * @desc - Instance variables
  *
  **/
  Recruit = new Recruit(this.props);

  /**
  *
  * @desc - State vars
  *
  **/
  state = {
    showModal: this.props.showModal || true,
    disableNextButton: false
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
    let {newAppointment} = constants.modalNames;
    this.props.setPreviousModalofOtherModalInGlobalState({proposedFields: newAppointment});

    //Set the paths of this or other modals depending on conditions
    this.updateModalPathInfo();

    util.initJQueryBootStrapToolTipandPopover();
  }

  /**
  *
  * @desc - This modal has multiple possible previous paths so we must
  * determine which previousModal is correct - the one set from props in the
  * previous modal (previousModal.newAppointment) or the default value
  * (previousModal)
  * @returns {void}
  *
  **/
  updateModalPathInfo() {
    let {previousModals = {}, previousModal} = this.props;
    //Handles the change of different 'previous' modals
    this.previousModal = previousModals.newAppointment || previousModal;
    this.determineSaveType();
  }

  /**
  *
  * @desc - Determine if the save type is Normal or Recruit
  * @param {String} previousModal - Previous modal
  * @returns {void}
  *
  **/
  determineSaveType() {
    let {chooseSaveTypeInGlobalState, saveType = ''} = this.props;
    if (saveType.toLowerCase() !== 'recruit') {
      chooseSaveTypeInGlobalState('Normal');
    }
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
  * @desc - resets the ModalConductor to new modal
  * @return {void}
  *
  **/
  onClickNext = () => {
    let {setSelectedAppointmentInGlobalState, changeCurrentModalWithSelectedActionTypeInGlobalState}
      = this.props;
    let next = this.nextModal || this.props.nextModal;

    setSelectedAppointmentInGlobalState([]);
    changeCurrentModalWithSelectedActionTypeInGlobalState(next, '3-1');
  }

  /**
  *
  * @desc - Determines which modal to go to when clicking back button
  * @return {void}
  *
  **/
  onClickBack = () => {
    let {previousModal, changeCurrentModalInGlobalState} = this.props;
    if (previousModal) {
      changeCurrentModalInGlobalState(this.previousModal);
    }
  }

  /**
  *
  * @desc - returns specific body jsx for this modal
  * @return {JSX} - body
  *
  **/
  getModalBody() {
    return(
      <div>
        <p>You are starting an Appointment case! Click next to continue.</p>
        <p className="small">
          Did you want to start a different type of case?
          <ToolTip text={descriptions.newApptInstructions} />
        </p>
      </div>
    );
  }
}
