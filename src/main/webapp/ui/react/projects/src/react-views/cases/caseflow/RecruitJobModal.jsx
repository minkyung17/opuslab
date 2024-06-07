import React from 'react';
import PropTypes from 'prop-types';
import {RadioGroup, Radio} from 'react-radio-group';
import {keys} from 'lodash';

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import BaseModal from './BaseModal.jsx';
import {defaultModalProps, constants} from '../constants/Cases';
import * as util from '../../../opus-logic/common/helpers';

import Recruit from '../../../opus-logic/cases/classes/caseflow/Recruit';
import {SearchBarWithButton} from '../../common/components/elements/SearchBarWithButton.jsx';
import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions.js';

/*******************************************************************************
*
* @desc - React JSX modal that entering a job number and getting the name results
*
********************************************************************************/
export default class RecruitJobModal extends BaseModal {
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
    nextModal: 'RECRUIT_UID',
    previousModal: 'NAME_SEARCH',
    modal_body_div_class: ''
  };

  /**
  *
  * @desc - Instance variables
  *
  **/
  Recruit = new Recruit(this.props);
  selectedActionType = '3-1';

  /**
  *
  * @desc - State vars
  *
  **/
  state = {
    disableNextButton: true,
    showModal: this.props.showModal || true,
    nameOptions: [],
    nameToAppointeeInfoResults: {},
    recruitInstructionText: '',
    jobSearchError: ''
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
    util.initJQueryBootStrapToolTipandPopover();
    this.initializeModalPaths();
  }

  /**
  *
  * @desc - Sets modal path in redux
  * @returns {void}
  *
  **/
  initializeModalPaths() {
    let {recruit} = constants.modalNames;
    this.props.setPreviousModalofOtherModalInGlobalState({recruitUID: recruit});
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
  * @desc - Need to disable/enable buttons based on if they have chosen a valid
  *   job number.
  * @param {Object} jobNumber - Job number
  * @return {void}
  *
  **/
  getJobSearchResults = async (jobNumber) => {
    this.jobNumber = jobNumber;

    let jobSearchPromise = this.Recruit.searchJobNumber(jobNumber);

    try {
      let results = await jobSearchPromise;
      this.setState({jobSearchError: ''});
      this.processJobSearchResults(results);
    }
    catch (error) {
      this.setState({jobSearchError: error.responseJSON.message});
      this.setState({nameOptions: []});
      this.setState({nameToAppointeeInfoResults: {}});
      this.setState({recruitInstructionText: ''});
    }
  }

  processJobSearchResults(results) {
    let nameToAppointeeInfoResults = this.Recruit.getFormattedJobSearchResults(results);

    this.setState({nameOptions: keys(nameToAppointeeInfoResults)});
    this.setState({nameToAppointeeInfoResults});
    let {disableNextButton} = this.state;

    let instructionText = this.Recruit.getRecruitInstructionText(results);
    this.setState({recruitInstructionText: instructionText});

    //Lets disable the next button if its not
    if(disableNextButton === false && !nameToAppointeeInfoResults) {
      this.setState({disableNextButton: true});
    }
  }

  /**
  *
  * @desc - Set the selected Recruit person into global state
  * @param {String} name - the name
  * @return {void}
  *
  **/
  selectRecruitPerson = (name) => {
    let {jobNumber} = this;
    let appointeeInfo = {...this.state.nameToAppointeeInfoResults[name], jobNumber};
    this.props.setSelectedPersonInGlobalState({appointeeInfo});
    this.setState({disableNextButton: false});
  }

  /**
  *
  * @desc - resets the ModalConductor to new modal
  * @return {void}
  *
  **/
  onClickNext = () => {
    let {chooseSaveTypeInGlobalState, changeCurrentModalWithSelectedActionTypeInGlobalState} =
      this.props;
    let next = this.nextModal || this.props.nextModal;

    chooseSaveTypeInGlobalState('Recruit');
    changeCurrentModalWithSelectedActionTypeInGlobalState(next, this.selectedActionType);
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
        <h2 className="flush-top">Search for a Person in Recruit </h2>
        <p>
          <label>
            Enter a Recruit Tracking Number <ToolTip text={descriptions.recruit_tracking} />
          </label>
        </p>
        <SearchBarWithButton onClick={this.getJobSearchResults} />
        <p className="red">{this.state.jobSearchError}</p>
        <form>
          <div className=" form-group">
            <RadioGroup name="job-choices" className=" candidateList radio"
              selectedValue={this.state.selectedValue} onChange={this.selectRecruitPerson}>
              <p>{this.state.recruitInstructionText}</p>

              {this.state.nameOptions.map((each, index) =>
                <div key={index} className=" radio">
                  <label>
                    <Radio value={each} className=" radio radioListText "/>{each}
                  </label>
                </div>
              )}
            </RadioGroup>
          </div>
        </form>
      </div>
    );
  }
}
