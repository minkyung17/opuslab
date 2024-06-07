import React from 'react';
import PropTypes from 'prop-types';

//My imports
import {ProfileTableBlock} from '../state-containers/';
import NewProfileModal from './NewProfileModal.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import {ToolTip, ToolTipWrapper} from '../../common/components/elements/ToolTip.jsx';
import {ShowIf, HideIf} from '../../common/components/elements/DisplayIf.jsx';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions';
import NewProfileLogic from '../../../opus-logic/cases/classes/profile/NewProfile';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import {Button} from 'react-bootstrap';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import {FormShell} from '../../common/components/forms/FormRender.jsx';
import {FormSelect} from '../../common/components/forms/FormElements.jsx';

/**
*
* ProfilePage is the page next to the sidebar that holds the table & modals
* @author - Leon Aburime
* @class ProfilePage
* @extends React.Component
*
**/
export default class ProfilePage extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
  static propTypes = {
    uid: PropTypes.string,
    Logic: PropTypes.object,
    adminData: PropTypes.object,
    globalData: PropTypes.object,
    access_token: PropTypes.string,
    opusPersonId: PropTypes.string,
    deletePromise: PropTypes.object,
    profileAPIData: PropTypes.object,
    pathJobAPIData: PropTypes.array,
    deleteAppointmentPromise: PropTypes.object,
    setReloadSignalInGlobalState: PropTypes.func.isRequired,
    setClockPermissionsInGlobalState: PropTypes.func,
    setPersonProfileApiDataInGlobalState: PropTypes.func.isRequired,
    setPersonPathJobApiDataInGlobalState: PropTypes.func.isRequired,
    activePage: PropTypes.string
  }

  static defaultProps = {
    profileAPIData: {
      appointeeInfo: null,
      appointmentInfoList: []
    },
    pathJobAPIData: [],
    setPersonProfileApiDataInGlobalState: () => {
      console.error('You have no state management function for this call!');
    },
    setPersonPathJobApiDataInGlobalState: () => {
      console.error('You have no state management function for this call!');
    }
  }

  /**
  *
  *
  **/
  state = {
    isGetNewApptButtonDisabled: true,
    showAppointments: true,
    showHeader: true,
    opusStatus: '',
    showOpusStatusModal: false,
    isSaveOpusStatusButtonDisabled: false,
    showPathInfoModal: false
  };

  /**
  *
  * @desc - Class variables
  * @return {void}
  *
  **/
  componentWillMount() {
    this.initProfile();
  }

  /**
  *
  * @desc - If new deleteAppointmentPromise or profileAPIData rerender in the
  *   the page
  * @param {Object} - deleteAppointmentPromise, profileAPIData
  * @return {void}
  *
  **/
  componentWillReceiveProps({deleteAppointmentPromise, profileAPIData,
    showAppointments, showHeader, canViewAddNewAppointment}) {
    if(profileAPIData !== this.props.profileAPIData) {
      this.loadPage(profileAPIData);
    }

    if(deleteAppointmentPromise !== this.props.deleteAppointmentPromise) {
      this.setState({deleteAppointmentPromise});
    }

    this.setState({showAppointments, showHeader, canViewAddNewAppointment});
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
  Logic = new NewProfileLogic(this.props);


  /**
   *
   * @desc - guess
   * @return {void}
   *
   **/
  initProfile = async () => {
    let {id: opusPersonId} = util.getUrlArgs();
    if(opusPersonId) {
      this.setState({opusPersonId});
      this.loadPage();
      this.setNewAppointmentDataInState();
    }
  }

  /**
   *
   * @desc - takes a name and sets it as the title of the page
   * @param {String} name -
   * @return {void}
   *
   **/
  setPageTitle(name) {
    if(name) {
      document.title = name + ' - Profile';
    }
  }

  /**
   *
   * @desc - Load page and reload page
   * @param {String} profileAPIData - id of person to reload page with
   * @return {void}
   *
   **/
  loadPage(profileAPIData = this.props.profileAPIData) {
    let {appointeeInfo} = profileAPIData;
    if(appointeeInfo) {
      this.setProfileDataInState(profileAPIData);
      this.setPagePermissions(profileAPIData);
      this.setPageTitle(profileAPIData.appointeeInfo.fullName);

    }
  }

  /**
   *
   * @desc - Gets new appointment data and sets it in state for when the blank
   *  appointment is to be used on button click
   * @return {void}
   *
   **/
  async setNewAppointmentDataInState() {
    let getNewApptPromise = this.getNewAppointmentProfileData();
    this.setState({getNewApptPromise, isGetNewApptButtonDisabled: true});

    //Actual new appointment data
    let appointment = await getNewApptPromise;

    this.setState({appointment, isGetNewApptButtonDisabled: false});
  }

  /**
   *
   * @desc - Load page and reload page
   * @param {String} profileAPIData - id of person to reload page with
   * @return {void}
   *
   **/
  setProfileDataInState(profileAPIData) {
    //Set it in local state
    this.setProfileDataInLocalState(profileAPIData);

    //Set it in global state
    //this.setProfileDataInGlobalState(profileAPIData);
  }

  /**
   *
   * @desc - Set permissions page for clock table
   * @param {String} profileAPIData - id of person to reload page with
   * @return {void}
   *
   **/
  setPagePermissions(profileAPIData) {
    let hasAppointments = this.Logic.hasAppointments(profileAPIData);
    let canViewAddNewAppointment = this.Logic.canViewAddNewAppointment(this.props.activePage);
    let canEditProfileFromAdminData = this.Logic.getCanEditProfileFromAdminData();

    this.setState({canViewAddNewAppointment, hasAppointments, canEditProfileFromAdminData});
  }

  /**
   *
   * @desc - sets profile data locally
   * @param {Object} profileAPIData - set profile data
   * @return {void}
   *
   **/
  setProfileDataInLocalState(profileAPIData = {}) {
    let {opusPersonId} = this.props;
    let {appointeeInfo, appointeeInfo: {uid}} = profileAPIData;

    this.setState({opusPersonId, uid, appointeeInfo});
  }

  /**
  *
  * @desc - When add new appointment button is clicked show the modal
  * @param {Object} fieldData - profile data from API
  * @param {Object} comment - profile data from API
  * @return {void}
  *
  **/
  onClickAddNewAppointment = () => {
    this.showAddProfileModal();
  }

  /**
  *
  * @desc - No appointment so lets get a blank one
  * @param {Object} fieldData - profile data from API
  * @param {Object} comment - profile data from API
  * @return {void}
  *
  **/
  async getNewAppointmentProfileData() {
    let {opusPersonId} = this.props;
    let profileAPIData = await this.Logic.getNewAppointmentProfileData(opusPersonId);
    let {appointmentInfoList} = profileAPIData;
    return appointmentInfoList[0];
  }


  /**
  *
  * @desc - Has passed validations and ready to save
  * @param {Object} fieldData - profile data from API
  * @param {Object} comment - profile data from API
  * @return {void}
  *
  **/
  saveNewApppointment = async (fieldData, comment) => {
    let {state: {appointment}, props: {profileAPIData: {appointeeInfo}}} = this;

    //Lets keep "appointment" pristine...if they want to create more new appts
    let clonedAppointment = util.cloneObject(appointment);
    let saveNewApptPromise = this.Logic.saveNewProfileData(fieldData, clonedAppointment,
      appointeeInfo, {comment});

    this.setState({saveNewApptPromise, showAddProfileModal: false});

    await saveNewApptPromise;
    this.reloadProfile();
  }

  /**
   *
   * @desc - Sets profile data in glbal state which will cause a rerender
   * @return {void}
   *
   **/
  async reloadProfile() {
    let {opusPersonId} = this.props;
    let typeOfReq = this.getTypeOfReq();

    let profileAPIData = await this.Logic.getProfileDataByOpusId(opusPersonId, typeOfReq);
    this.props.setPersonProfileApiDataInGlobalState(profileAPIData);

    let pathJobAPIData = await this.Logic.getPathJobDataByOpusId(opusPersonId);
    this.props.setPersonPathJobApiDataInGlobalState(pathJobAPIData);
  }


  /**
  *
  * @desc - Uses state management system to load profileAPIData into global state
  * @param {Object} profileAPIData - profile data from API
  * @return {void}
  *
  **/
  setProfileDataInGlobalState(profileAPIData = {}) {
    this.props.setPersonProfileApiDataInGlobalState(profileAPIData);
  }

  /**
  *
  * @desc - Uses state management system to load pathJobAPIData into global state
  * @param {Object} pathJobAPIData - path job data from API
  * @return {void}
  *
  **/
  setPathJobDataInGlobalState(pathJobAPIData = {}) {
    this.props.setPersonPathJobApiDataInGlobalState(pathJobAPIData);
  }

  /**
  *
  * @desc - Get page header based upon current active page
  * @return {String} pageHeader
  *
  **/
  getPageHeader() {
    let pageHeader = ''
    if (this.props.activePage === 'profile') {
      pageHeader = 'Active Appointments';
    }
    else if (this.props.activePage === 'inactiveProfile') {
      pageHeader = 'Inactive Appointments';
    }
    return pageHeader;
  }

  /**
  *
  * @desc - Get typeOfReq based upon current active page
  * @return {String} typeOfReq
  *
  **/
  getTypeOfReq() {
    let typeOfReq = '';
    if (this.props.activePage === 'profile') {
      typeOfReq = 'active';
    }
    else if (this.props.activePage === 'inactiveProfile') {
      typeOfReq = 'inactive';
    }
    return typeOfReq;
  }

  /**
  *
  * @desc - Get no current appointments text based upon current active page
  * @return {String} noCurrentApptsText
  *
  **/
  getNoCurrentApptsText() {
    let noCurrentApptsText = '';
    let {canViewAddNewAppointment} = this.state;
    if (this.props.activePage === 'profile') {
      noCurrentApptsText = (<div><ShowIf show={canViewAddNewAppointment}>
        <div>
          This person has no active appointments in Opus. Would you like
          to add a new appointment for them?
        </div>
      </ShowIf>
      <ShowIf show={!canViewAddNewAppointment}>
        <div>
          This person has no active appointments in Opus.
        </div>
      </ShowIf></div>);
    }
    else if (this.props.activePage === 'inactiveProfile') {
      noCurrentApptsText = (
        <div>This person has no inactive appointments in Opus.</div>
      );
    }
    return noCurrentApptsText;
  }

  /**
  *
  * @desc - Title Text
  * @param {Object} appointeeInfo - uid and hire date
  * @return {JSX} - JSX for title
  *
  **/
  getTitleText() {
    let {hasAppointments, showHeader} = this.state;
    let pageHeader = this.getPageHeader();
    let noCurrentApptsText = this.getNoCurrentApptsText();

    return (
      <div>
        <ShowIf show={showHeader}>
          <div>
            <h2> {pageHeader}</h2>
            <p>
              Please contact APO at <a href="mailto:opushelp@ucla.edu">
                opushelp@ucla.edu</a> to make edits to appointments.</p>
            <div>
              <a href='#' className='toggle-message' onClick={this.showPathInfoModal}>View UCPath Information</a>
              <br/><br/>
            </div>
            <div/>
          </div>
        </ShowIf>
        <ShowIf show={!hasAppointments && showHeader}>
          <div>
            {noCurrentApptsText}
          </div>
        </ShowIf>
      </div>
    );
  }

  /**
   *
   * @desc - Show Path info modal
   * @return {void}
   *
   **/
  showPathInfoModal = () => {
    this.setState({showPathInfoModal: true});
  }

  /**
   *
   * @desc - Hide Path info modal
   * @return {void}
   *
   **/
  hidePathInfoModal = () =>
    this.setState({showPathInfoModal: false});

  /**
  *
  * @desc - Gets Path information modal
  * @return {JSX} - JSX
  *
  **/
  getPathInfoModal() {
    let pathJobTables = this.getInnerPathInfoModalContents();

    return (
      <Modal show={this.state.showPathInfoModal} onHide={this.hidePathInfoModal}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title">
            UCPath Appointments
          </h1>
        </Header>
        <Body>
          {this.props.pathJobAPIData.length>0 ?
            <p>These values are imported from UCPath, UCLA's payroll and HR system,
              for comparison with Opus data.</p>
            :
            <p>There are no active academic jobs for this person in UCPath.</p>
          }
          {pathJobTables}
        </Body>
      </Modal>
    );
  }

  formattedMoneyStringValueThatIncludes$AndCommas(value){
    let moneyString = '';
    if(value){
      let moneyInt = parseInt(value);
      moneyString = '$'+moneyInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return moneyString;
  }

  /**
  *
  * @desc - Gets inner Path information modal (i.e. the tables)
  * @return {JSX} - JSX
  *
  **/
  getInnerPathInfoModalContents() {

      return (
        <span>
        {this.props.pathJobAPIData.map((pathJob, index) => {
          return(
            <table key={index} className='table table-bordered'>
              <thead>
                <tr>
                  <th colSpan="2">
                    {pathJob.deptCode}: {pathJob.deptDesc}<br />
                    {pathJob.titleCode}: {pathJob.titleDesc}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Empl ID</td>
                  <td>{pathJob.emplId}</td>
                </tr>
                <tr>
                  <td>Payroll Status</td>
                  <td>{pathJob.payrollStatus}</td>
                </tr>
                <tr>
                  <td>Position #</td>
                  <td>{pathJob.positionNbr}</td>
                </tr>
                <ShowIf show={(pathJob.terminationDt && pathJob.terminationDt!=='')}>
                  <tr>
                    <td>Termination</td>
                    <td>{pathJob.terminationDt}</td>
                  </tr>
                </ShowIf>
                <ShowIf show={(pathJob.expectedReturnDt && pathJob.expectedReturnDt!=='')}>
                  <tr>
                    <td>Expected Return Date</td>
                    <td>{pathJob.expectedReturnDt}</td>
                  </tr>
                </ShowIf>
                <tr>
                  <td>Expected End Date</td>
                  <td>{pathJob.expectedEndDt}</td>
                </tr>
                <tr>
                  <td>Dept. Entry Date</td>
                  <td>{pathJob.deptEntryDt}</td>
                </tr>
                <tr>
                  <td>Job Entry Date</td>
                  <td>{pathJob.jobEntryDt}</td>
                </tr>
                <tr>
                  <td>Step Entry Date</td>
                  <td>{pathJob.stepEntryDt}</td>
                </tr>
                <tr>
                  <td>Job Indicator</td>
                  <td>{pathJob.jobIndicator}</td>
                </tr>
                <tr>
                  <td>Step</td>
                  <td>{pathJob.step}</td>
                </tr>
                <tr>
                  <td>FTE</td>
                  <td>{pathJob.fulltimeEquivalent}</td>
                </tr>
                <tr>
                  <td>Salary Admin Plan</td>
                  <td>{pathJob.salaryAdminPlan}</td>
                </tr>
                <tr>
                  <td>Frequency</td>
                  <td>{pathJob.frequency}</td>
                </tr>
                <tr>
                  <td>Annual Rate</td>
                  <td>{this.formattedMoneyStringValueThatIncludes$AndCommas(pathJob.annualRate)}</td>
                </tr>
                <tr>
                  <th>Rate Code Description</th>
                  <th>Rate</th>
                </tr>
                {pathJob.pathSalaryComponentsMap.pathSalaryComp.map((eachPath, index) => (
                  <tr key={'pathSalaryComp'+index}>
                    <td>{eachPath.salaryRateDesc}</td>
                    <td>{this.formattedMoneyStringValueThatIncludes$AndCommas(eachPath.salaryRateAmt)}</td>
                  </tr>
                ))}
                <tr>
                  <th>Earn Code Description</th>
                  <th>Rate</th>
                </tr>
                {pathJob.pathSalaryComponentsMap.pathSalaryEarn.map((eachPath, index) => (
                  <tr key={'pathSalaryEarn'+index}>
                    <td>{eachPath.salaryRateDesc}</td>
                    <td>{this.formattedMoneyStringValueThatIncludes$AndCommas(eachPath.salaryRateAmt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
      )}
      </span>
    );
  }

  /**
  *
  * @desc - Gets jsx warning modal
  * @return {JSX} - JSX
  *
  **/
  getAddNewProfileWarningModal() {
    let {fullName} = this.props.profileAPIData.appointeeInfo || {};
    return (
      <Modal backdrop="static" onHide={this.hideAddProfileWarningModal}
        show={this.state.showAddProfileWarningModal}>
        <Header className="modal-warning">
          <h1 className=" white "> We Can't Find a Profile </h1>
        </Header>
        <Body>
          This person has no academic appointments in Opus. Would you like
          to enter a current appointment for them?  This will create their Profile.
        </Body>
        <Footer>
          <Button onClick={this.showAddProfileModal} className="left btn btn-warning">
            OK
          </Button>
          <Dismiss className="left btn btn-link"> Cancel</Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
  *
  * @desc - Gets jsx about adding new profile
  * @return {JSX} - JSX
  *
  **/
  getAddNewProfileModal() {
    let {fullName} = this.props.profileAPIData.appointeeInfo;
    return (
      <Modal backdrop="static" onHide={this.hideAddProfileWarningModal}
        show={this.state.showAddProfileModal}>
        <Header className="modal-warning">
          <h1 className=" white "> Create a New Profile </h1>
        </Header>
        <Body>
          This will create a new profile for {fullName}.  Would you like to continue?
        </Body>
        <Footer>
          <Button onClick={this.showAddProfileModal} className="left btn btn-warning">
            Continue
          </Button>
          <Dismiss className="left btn btn-link"> Cancel</Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
  *
  * @desc - Show add profile warning modal
  * @return {void}
  *
  **/
  showAddProfileWarningModal = () =>
    this.setState({showAddProfileWarningModal: true})

  /**
  *
  * @desc - Show add profile warning modal
  * @return {void}
  *
  **/
  hideAddProfileWarningModal = () =>
    this.setState({showAddProfileWarningModal: false})

  /**
  *
  * @desc - Show profile modal on screen
  * @return {void}
  *
  **/
  showAddProfileModal = () => this.setState({showAddProfileModal: true});

  /**
  *
  * @desc - Show add profile warning modal
  * @return {void}
  *
  **/
  hideAddProfileModal = () => this.setState({showAddProfileModal: false})

  /**
  *
  * @desc - The page
  * @return {JSX} - JSX for title
  *
  **/
  render() {
    let {props: {access_token, adminData, globalData, opusPersonId}} = this;
    let {Logic} = this;
    let {props: {profileAPIData}} = this;
    let typeOfReq = this.getTypeOfReq();

    //Takes care of nulls
    let appointmentInfoList = profileAPIData.appointmentInfoList || [];

    return(
      <div>
        <ShowIf show={profileAPIData.appointeeInfo} >
          <div className=" col-md-8 ">
            <APIResponseModal successMessage={`Your edits have been saved. An email
              notification will be sent to you and the appropriate department
              administrator. If you deleted the primary appointment, please review
              the current appointments and update one of them to primary. `}
            promise={this.state.deleteAppointmentPromise}/>

            <APIResponseModal promise={this.state.saveNewApptPromise}/>

            <APIResponseModal failurePromise={this.state.getNewApptPromise}/>

            {this.getAddNewProfileWarningModal()}

            {this.getTitleText()}

            {this.getPathInfoModal()}

            <ShowIf show={this.state.appointment}>
              <NewProfileModal show={this.state.showAddProfileModal}
                title={'New Appointment'} onHide={this.hideAddProfileModal}
                {...{access_token, adminData, globalData, profileAPIData,
                  appointment: this.state.appointment, onClickSave: this.saveNewApppointment}}/>
            </ShowIf>

            <ShowIf show={this.state.showAppointments}>
              <div>
                {appointmentInfoList.map((appointment, index) =>
                  <ProfileTableBlock key={index} {...{Logic, access_token, adminData,
                    globalData, appointment, opusPersonId, profileAPIData, typeOfReq}} />
                )}
              </div>
            </ShowIf>

            <ShowIf show={this.state.canViewAddNewAppointment && this.state.showHeader}>
              <button onClick={this.onClickAddNewAppointment}
                disabled={this.state.isGetNewApptButtonDisabled}
                className="btn btn-primary hidden-print">
                Add New Appointment
              </button>
            </ShowIf>
          </div>
        </ShowIf>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
