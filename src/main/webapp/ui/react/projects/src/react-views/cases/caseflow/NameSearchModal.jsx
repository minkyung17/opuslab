import React from 'react';
import PropTypes from 'prop-types';

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import BaseModal from './BaseModal.jsx';
import {modalNames} from '../constants/Cases';
import * as util from '../../../opus-logic/common/helpers/';
import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import AutoComplete from '../../common/components/jquery-ui/AutoComplete.jsx';
import NameSearch from '../../../opus-logic/cases/classes/caseflow/NameSearch';
import {Footer} from '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions.js';

/*******************************************************************************
*
* @desc - React JSX modal that handles gettings names and selecting them
*   and selecting them from the AutoComplete.
*
********************************************************************************/
export default class NameSearchModal extends BaseModal {
  /**
  *
  * @desc - Static vars for props
  *
  **/
  static propTypes = {
    showModal: PropTypes.bool,
    //Will be overriden by whatever STATE MANAGEMENT functions
    setPreviousModalofOtherModalInGlobalState: PropTypes.func,
    setSelectedAppointmentInGlobalState: PropTypes.func
  }
  static defaultProps = {
    showModal: true,
    nextModal: 'ACTION_TYPE',
    setPreviousModalofOtherModalInGlobalState: () => {},
    setSelectedAppointmentInGlobalState: () => {}
  }

  /**
  *
  * @desc - Instance constants
  *
  **/
  noResultsMessage = NameSearch.noResults;
  Logic = new NameSearch(this.props);

  /**
  *
  * @desc - State vars
  *
  **/
  state = {
    disableNextButton: true,
    showModal: this.props.showModal
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
  * @desc - Set the proper 'previous' fields for the next modal
  * @returns {void}
  *
  **/
  componentDidMount() {
    util.initJQueryBootStrapToolTipandPopover();
    this.initializeModalPaths();

    this.clearRecruitData();
  }

  /**
  *
  * @desc - Clear Recruit values in case this came from a cancelled Recruit path
  * No need to clear selectedPerson since it gets overwritten in any path
  * @returns {void}
  *
  **/
  clearRecruitData() {
    this.props.setSelectedUIDPersonInGlobalState({});
    this.props.mergeRecruitTypeInGlobalState('N');
  }

  /**
  *
  * @desc - Sets modal path in redux
  * @returns {void}
  *
  **/
  initializeModalPaths() {
    let {nameSearch} = modalNames;
    this.props.setPreviousModalofOtherModalInGlobalState({newAppointment: nameSearch,
      recruit: nameSearch});
    this.props.setSelectedAppointmentInGlobalState([]);
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
  * @desc -
  * @param {String} newCurrentModal -
  * @return {void}
  *
  **/
  setNextModalInGlobalState(newCurrentModal) {
    this.props.nextModal(newCurrentModal);
  }

  /**
  *
  * @desc - Need to disable/enable buttons based on if they have chosen a valid
  *   name that has appt info.
  * @param {Object} event -
  * @return {void}
  *
  **/
  changeButtonStates = ({target: {value: name = ''} = {}} = event) => {
    let validName = this.Logic.isNameInSet(name);
    let {disableNextButton} = this.state;

    //Lets disable the next button if its not
    if(disableNextButton === false && !validName) {
      this.setState({disableNextButton: true});
    }
  }

  /**
  *
  * @desc - Get name from search field and search and return to AutoComplete response
  *   function
  * @param {Object} - term
  * @param {Function} autoCompleteResponse -
  * @return {Promise} promise -
  *
  **/
  getNamesForAutocomplete = async ({term}, autoCompleteResponse) => {
    let name = term.trim();
    let promise = new Promise((res) => {res([]);});

    //Dont search if null, empty, already searched for, or a fully formatted name in Set
    if(name && !this.Logic.isNameInSet(name)) {
      promise = this.Logic.fetchPossibleNames(name);

      //If modal error
      //this.generalAPICallFailureModal(promise);

      //Get names from the API
      let nameResults = await promise;
      let {nameOptions} = this.Logic.setAndSaveReformattedNameDataFromAPI(
        nameResults);

      autoCompleteResponse(nameOptions);

      //Message to user if no results
      let message = nameOptions.length ? null : this.noResultsMessage;
      this.setState({noResultsMessage: message});
    }

    return promise;
  }

  /**
  *
  * NOTE: This function will be overridden by the state management system so it
  *   WILL NOT even be called. Using Redux as of now.
  *
  * @desc - This will be overridden by the state
  * @param {Object} person - selected person's data
  * @return {void}
  *
  **/
  setSelectedPersonInGlobalState = (person) => {
    this.props.setSelectedPersonInGlobalState(person);
  }


  /**
  *
  * @desc - When user selects person from autocomplete 1. choose next modal
  *    2. Save in state
  * @param {Object} event - selected person's data
  * @param {Object} undefined - value to name
  * @return {void}
  *
  **/
  onSelectPerson = async (event, {value: name}) => {
    //No name so go back
    if(!name) {
      return;
    }

    let promise = this.Logic.getPersonApptDataFromName(name);
    let results = await promise;
    let person = this.Logic.formatPersonObject(name, results);

    this.Logic.setSelectedPerson = person;

    this.chooseNextModal();
    this.setSelectedPersonInGlobalState(person);
    this.setState({disableNextButton: false});
  }

  /**
  *
  * @desc - choose next modal based on if selected user already has appointments
  * @param {Object} appointmentInfo -
  * @param {Object} appointmentSetList -
  * @param {Object} options -
  * @return {void} -
  *
  **/
  chooseNextModal = (appointmentInfo, appointmentSetList, {...options} = {}) => {
    let {new_appt = modalNames.newAppointment, action_container = this.props.nextModal}
      = options;
    let hasValidAppts = this.Logic.personHasValidAppts();
    //let noValidAppts = (!appointmentInfo.length && !appointmentSetList.length);
    this.nextModal = hasValidAppts ? action_container : new_appt;
  }

  /**
  *
  * @desc - self-explanatory
  * @return {JSX} - changes the modal
  *
  **/
  onClickNext = () => {
    this.setState({showModal: false});
    let {changeCurrentModalInGlobalState} = this.props;
    changeCurrentModalInGlobalState(this.nextModal || this.props.nextModal);
  }

  /**
  *
  * @desc - Changes modal to Recruit Modal when the proper button is clicked
  * @return {void}
  *
  **/
  onClickRecruit = () => {
    this.setState({showModal: false});
    this.props.changeCurrentModalInGlobalState(modalNames.recruit);
  };

  /**
  *
  * @desc - returns specific body jsx for this modal
  * @param {Object} changeCurrentModalInGlobalState - function to change current modal
  * @return {JSX} - body
  *
  **/
  getModalBody() {
    return(
      <div>
        <p>
          <label>
            Who would you like to start a case for?
          </label>
        </p>
        <AutoComplete placeholder={'Search for a person by name (last, first) or UID'}
          ref="autocomplete" onChange={this.changeButtonStates}
          options={this.getNamesForAutocomplete} autoCompleteUIOptions={{}}
          onSearchClick={this.onSelectPerson} id={'nameSearchAutocomplete'} />

        <p className="no-results-namesearch">{this.state.noResultsMessage}</p> 
       
        <p>If the person appears in this search, it is best to start the case from here. 
          If this case is associated with a Recruit search, please make a note of the Recruit number in the Comments 
          in the Final Decision modal in the Case Summary. If they have never been at UCLA before, 
          you will likely use the Recruit search and the number need not be manually recorded.</p>

          <p>{'Search for a person in '}
          <a href="#" onClick={this.onClickRecruit}>Recruit</a>.
          <ToolTip text={descriptions.recruit} />
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
  getModalFooter({disableNextButton = true} = {}) {
    return (
      <Footer>
        {/* <Dismiss className="btn btn-default">Cancel</Dismiss> */}
        <button className="btn btn-primary left" disabled={disableNextButton}
          onClick={this.onClickNext}>
          <span className=" icon-right wizard icon-position " />
          Next
        </button>
      </Footer>
    );
  }
}
