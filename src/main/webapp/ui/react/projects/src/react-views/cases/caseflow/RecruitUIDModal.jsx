import React from 'react';
import PropTypes from 'prop-types';

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import BaseModal from './BaseModal.jsx';
import {defaultModalProps, constants} from '../constants/Cases';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';

import Recruit from '../../../opus-logic/cases/classes/caseflow/Recruit';
import {SearchBarWithButton} from '../../common/components/elements/SearchBarWithButton.jsx';

/*******************************************************************************
*
* @desc - React JSX modal that entering a job number and getting the name results
*
********************************************************************************/
export default class RecruitUIDModal extends BaseModal {
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
    previousModal: 'RECRUIT',
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
    disableNextButton: false,
    showModal: this.props.showModal || true,
    validUID: false,
    statusText: ''
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
  }

  /**
  *
  * @desc - Sets modal path in redux
  * @returns {void}
  *
  **/
  initializeModalPaths() {
    let {recruitUID} = constants.modalNames;
    this.props.setPreviousModalofOtherModalInGlobalState({newAppointment: recruitUID});
    this.props.setSelectedUIDPersonInGlobalState({}); //reset the selectedUIDPerson when this modal is loaded
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
  * @desc - Get the results for the UID entered
  * @param {String} uid - UID
  * @return {void}
  *
  **/
  getUIDResults = async (uid) => {
    var isnum = /^\d+$/.test(uid);
    if(uid.length===9 && isnum){
      let checkUIDPromise = this.Recruit.checkUID(uid);
      this.setState({failurePromise: checkUIDPromise});

      let selectedUIDPerson = await checkUIDPromise;

      let appointeeInfo = this.Recruit.getAppointeeInfo(selectedUIDPerson);
      let {mergeOpusId = null} = appointeeInfo;

      let validUID = this.Recruit.getValidUID(mergeOpusId);
      this.setState({validUID});

      let statusText = this.Recruit.getUIDStatusText(validUID);
      this.setState({statusText});

      if(!validUID){
        // if not a valid UID, make selectedUIDPerson as blank object
        selectedUIDPerson = {};
      }

      //Dispatch the selectedUIDPerson into global state from here
      this.props.setSelectedUIDPersonInGlobalState(selectedUIDPerson);
    }else{
      let statusText = 'Please enter a 9-digit number.'
      this.setState({statusText});
    }
  }

  /**
  *
  * @desc - self-explanatory
  * @return {JSX} - changes the modal
  *
  **/
  onClickNext = () => {
    let {changeCurrentModalInGlobalState} = this.props;

    //Set the next modal based upon if a valid UID was found.  If so, go to the
    //merge modal.  If not, go to the new appointment modal.
    let {validUID} = this.state;
    let next = validUID ? constants.modalNames.recruitMerge :
      (this.nextModal || this.props.nextModal);
    changeCurrentModalInGlobalState(next);
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
        <h2 className="flush-top">
          Was the person previously employed at UCLA?
        </h2>
        <p>
          If so, please enter their UID here.  If not, click "Next".
        </p>
        <SearchBarWithButton
          placeholder={'Please enter a nine-digit number'}
          onClick={this.getUIDResults} buttonText="Check UID"
        />
        <p className='red'>{this.state.statusText}</p>
        <APIResponseModal failurePromise={this.state.failurePromise} />
      </div>
    );
  }
}
