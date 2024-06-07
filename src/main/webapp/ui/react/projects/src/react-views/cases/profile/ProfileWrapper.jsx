import React from 'react';
import PropTypes from 'prop-types';


/**
*
* Local Imports
*
**/
import {Header} from './ProfileComponents.jsx';
import {ProfilePage} from '../state-containers';
import * as util from '../../../opus-logic/common/helpers/';
import Permissions from '../../../opus-logic/common/modules/Permissions';
import ProfileLogic from '../../../opus-logic/cases/classes/profile/Profile';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import AutoComplete from '../../common/components/jquery-ui/AutoComplete.jsx';
import SummaryPage from './SummaryPage.jsx';
import AppointmentSetsPage from './AppointmentSetsPage.jsx';
import AcademicHistory from
  '../../../react-views/datatables/pages/AcademicHistoryTable.jsx';
import EightYearClock from
  '../../../react-views/datatables/pages/EightYearClockTable.jsx';
import ExcellenceClock from
  '../../../react-views/datatables/pages/ExcellenceClockPage.jsx';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';

export default class ProfileWrapper extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
  static propTypes = {

    Page: PropTypes.func,
    profileAPIData: PropTypes.object,
    pathJobAPIData: PropTypes.array,
    appointeeInfo: PropTypes.object,
    adminData: PropTypes.object.isRequired,
    canViewEightYearClock: PropTypes.bool,
    canViewExcellenceClock: PropTypes.bool
  };
  static defaultProps = {
    //Pass react page instead of redux container for testing
    Page: ProfilePage,
    profileAPIData: {
      appointeeInfo: {},
      appointmentInfoList: []
    },
    pathJobAPIData: []
  };

  /**
   *
   * @desc - Set it all off
   * @return {void}
   *
   **/
  constructor(props = {}) {
    super(props);
  }

  /**
   *
   * @desc - Instance variables
   *
   **/
  state = {
    activePage: 'profile',
    Page: this.props.Page,
    hasAppointments: false,
    canViewInactiveAppointments: false,
    canViewAppointmentSets: false,
    canEditDeleteAppointmentSets:false,
    canViewAcademicHistory: false,
    showAppointments: true,
    showHeader: true,
    canViewAddNewAppointment: true
  };

  /**
   *
   * @desc - When component will be rendered Get args needed to run the page
   * @return {void}
   *
   **/
  componentWillMount() {
    this.sideBarLinks = Object.values(this.sideBar);
    let {id} = util.getUrlArgs();
    this.setState({opusPersonId: id});
    this.setPageFromUrl();
    this.getProfileAPIDataFromOpusPersonId(id);
    this.getPathJobAPIDataFromOpusPersonId(id);
  }

  /**
   *
   * @desc - Rerun permissions every time we get new properties
   * @return {void}
   *
   **/
  componentWillReceiveProps({profileAPIData}) {
    this.getViewPagePermissions(profileAPIData);
  }

  //Class variables
  Permissions = new Permissions(this.props.adminData);
  Logic = new ProfileLogic(this.props);
  sideBar = {
    summary: {
      name: 'summary',
      title: 'Summary',
      Page: SummaryPage
    },
    profile: {
      name: 'profile',
      title: 'Profile',
      Page: ProfilePage
    },
    inactiveProfile: {
      name: 'inactiveProfile',
      title: 'Inactive Appointments',
      Page: ProfilePage
    },
    appointmentSets: {
      name: 'appointmentSets',
      title: 'Appointment Sets',
      Page: AppointmentSetsPage
    },
    academicHistory: {
      name: 'academicHistory',
      title: 'Academic History',
      Page: AcademicHistory
    },
    eightYearClock: {
      name: 'eightYearClock',
      title: 'Eight Year Clock',
      Page: EightYearClock
    },
    excellenceClock: {
      name: 'excellenceClock',
      title: 'Excellence Clock',
      Page: ExcellenceClock
    }
  }

  /**
   *
   * @desc - Makes api call to get data from profile api via url id
   * @param {String} id -
   * @return {void}
   *
   **/
  async getProfileAPIDataFromOpusPersonId(id, name='profile') {
    if(!id) {
      return;
    }

    let typeOfReq = '';
    if (name === 'profile') {
      typeOfReq = 'active';
    }
    else if (name === 'inactiveProfile') {
      typeOfReq = 'inactive';
    }

    let canViewAddNewAppointment = this.Logic.canViewAddNewAppointment(name);
    this.setState({showAppointments: false, showHeader: false, canViewAddNewAppointment});
    let profileAPIData = await this.Logic.getProfileDataByOpusId(id, typeOfReq);
    this.setState({showAppointments: true, showHeader: true});

    //Set it in global state
    this.props.setPersonProfileApiDataInGlobalState(profileAPIData);
  }

  /**
   *
   * @desc - Makes api call to get data from path job api via url id
   * @param {String} id -
   * @return {void}
   *
   **/
  async getPathJobAPIDataFromOpusPersonId(id) {
    if(!id) {
      return;
    }
    let pathJobAPIData = await this.Logic.getPathJobDataByOpusId(id);
    pathJobAPIData = this.Logic.sortPathJobAPIData(pathJobAPIData);

    //Set it in global state
    this.props.setPersonPathJobApiDataInGlobalState(pathJobAPIData);
  }

  /**
   *
   * @desc - Gets all the permissions that lets(or not) the user edit page etc
   * @param {Object} profileAPIData - profile data from API
   * @return {void}
   *
   **/
  getViewPagePermissions(profileAPIData) {
    let canViewProfile = this.Logic.getCanViewProfile();
    let hasAppointments = this.Logic.hasAppointments(profileAPIData);
    let canViewAcademicHistory = this.Logic.canViewAcademicHistory(profileAPIData);
    let canViewInactiveAppointments = this.Logic.canViewInactiveAppointments(profileAPIData);
    let canViewAppointmentSets = this.Logic.canViewAppointmentSets(profileAPIData);
    let canEditDeleteAppointmentSets = this.Logic.canEditDeleteAppointmentSets(profileAPIData);
    let clockPermissions = this.Logic.getClockViewPermissions(profileAPIData);
    let {canViewEightYearClock, canViewExcellenceClock} = clockPermissions;
    this.setState({hasAppointments, canViewAcademicHistory, canViewInactiveAppointments,
      canViewAppointmentSets, canViewProfile, canViewEightYearClock, canViewExcellenceClock});
  }

  /**
  *
  * @desc - Returns UI class to make a sidebar link bold
  * @param {Object} page - which page is active
  * @return {Boolean} - if the page passed is the active page
  *
  **/
  getUIClass = (page) => page === this.state.activePage ? 'strong' : null;


  /**
   *
   * @desc - get sidebar links
   * @return {JSX} - jsx links
   *
   **/
  getSideBarLinks() {
    let onClick = this.onClickGetPageFromSideBar;
    let {getUIClass: ui} = this;

    return (
      <ul id="leftnav" className="nav nav-pills nav-stacked">
        <ShowIf show={this.props.profileAPIData.appointeeInfo.opusPersonId}>
          <li className={` ${ui('summary')} sidebar-link `}>
            <a {...{name: 'summary', onClick}} href="#">
              Summary
            </a>
          </li>
        </ShowIf>
        <ShowIf show={this.props.profileAPIData.appointeeInfo.opusPersonId}>
          <li className={` ${ui('profile')} sidebar-link `}>
            <a {...{name: 'profile', onClick}} href="#">
              Active Appointments
            </a>
          </li>
        </ShowIf>
        <ShowIf show={this.state.canViewInactiveAppointments}>
          <li className={` ${ui('inactiveProfile')} sidebar-link `}>
            <a {...{name: 'inactiveProfile', onClick}} href="#">
              Inactive Appointments
            </a>
          </li>
        </ShowIf>
        <ShowIf show={this.state.canViewAppointmentSets}>
          <li className={` ${ui('appointmentSets')} sidebar-link `}>
            <a {...{name: 'appointmentSets', onClick}} href="#">
              Appointment Sets
            </a>
          </li>
        </ShowIf>
        <ShowIf show={this.state.canViewAcademicHistory}>
          <li className={` ${ui('academicHistory')} sidebar-link `}>
            <a {...{name: 'academicHistory', onClick}} href="#">
              Academic History
            </a>
          </li>
        </ShowIf>
        <ShowIf show={this.state.canViewEightYearClock}>
          <li className={` ${ui('eightYearClock')} sidebar-link `}>
            <a {...{name: 'eightYearClock', onClick}} href="#">
              Eight Year Clock
            </a>
          </li>
        </ShowIf>
        <ShowIf show={this.state.canViewExcellenceClock}>
          <li className={` ${ui('excellenceClock')} sidebar-link `}>
            <a {...{name: 'excellenceClock', onClick}} href="#">Excellence Review Clock</a>
          </li>
        </ShowIf>
      </ul>);
  }

  /**
   *
   * @desc - Chooses the page on start. Defaults to Profile if none specified
   *  or if the page given is not valid
   * @return {void}
   *
   **/
  setPageFromUrl() {
    let {view = 'profile', page = view} = util.getUrlArgs();
    let {[page]: {Page} = {}} = this.sideBar;
    let {Page: Summary} = this.sideBar.summary;
    this.setState({Page: Page || Summary});
  }

  /**
   *
   * @desc - Guess
   * @param {String} opusPersonId - id of person to reload page with
   * @return {void}
   *
   **/
  reloadPageWithOpusPersonId(opusPersonId) {
    window.open(`?id=${opusPersonId}`, '_self');
  }

  /**
   *
   * @desc - When the user selects a name reload this page
   * @param {Object} event - type event
   * @param {Object} - opusPersonId for reloading page
   * @return {void}
   *
   **/
  onChooseAutoCompleteName = (event, {id: opusPersonId} = {}) => {
    this.reloadPageWithOpusPersonId(opusPersonId);
  }

  /**
   *
   * @desc - Lets search for the person the user enters
   * @param {Object} event - has name to search for
   * @param {Object} response - populates autocomplete dropdown w/ array
   * @return {Object} formattedResults - results ready made for autocomplete
   *
   **/
  onAutocompleteSearchKeypress = async ({term: searchText}, response) => {
    let formattedResultsPromise = this.Logic.getFormattedNameSearchOptions(
      searchText);

    //Send to error modal
    this.setState({failurePromise: formattedResultsPromise});

    //Get from API
    let formattedResults = await formattedResultsPromise;

    //Send back to autocomplete to populate dropdown
    response(formattedResults);

    //Get error message if we did or didnt find people
    let resultsMessage = formattedResults.length ? '' :
      `No results found for "${searchText}".`;

    //Set the message in state
    this.setState({resultsMessage});
    return formattedResults;
  }

  /**
   *
   * @desc - Switch between 8 year, excellence clock, academic history & profile
   * @param {Object} evt -
   * @param {Object} response -
   * @return {void}
   *
   **/
  onClickGetPageFromSideBar = (evt) => {
    let {name} = evt.target;
    let {Page} = this.sideBar[name];
    this.setState({Page, activePage: name});

    if (name === 'inactiveProfile' || name === 'profile') {
      let {id} = util.getUrlArgs();
      this.getProfileAPIDataFromOpusPersonId(id, name);
    }
  }

  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
  render() {
    let {state: {Page, opusPersonId, resultsMessage, failurePromise, activePage, showAppointments, showHeader, canViewAddNewAppointment}} = this;

    let sideBar = this.getSideBarLinks();
    let {Logic} = this;
    let {fullName} = this.props.profileAPIData.appointeeInfo || {};

    return (
      <div>
        <div className="container-fluid" id="main" >
          <APIResponseModal {...{failurePromise}} />
          <Header name={fullName ? `- ${fullName}` : ''} results={resultsMessage}
            headerUIDText={this.props.profileAPIData.appointeeInfo.uid ? this.props.profileAPIData.appointeeInfo.uid : null}
            headerEmailText={this.props.profileAPIData.appointeeInfo.officialEmail ? this.props.profileAPIData.appointeeInfo.officialEmail : null}>
            <AutoComplete placeholder={'Search for a person by name (last, first) or UID'} name={'search-field'}
              options={this.onAutocompleteSearchKeypress} id="profile-search"
              onSearchClick={this.onChooseAutoCompleteName}/>
          </Header>

          <div className="row page-content ">
            <div className="col-md-2 leftnav left-side-nav hidden-print">
              {sideBar}
            </div>
            <div className="col-md-10">
              <Page {...{...this.props, opusPersonId, Logic, activePage, showAppointments, showHeader, canViewAddNewAppointment}} />
            </div>
          </div>
        </div>
      </div>);
  }
}
