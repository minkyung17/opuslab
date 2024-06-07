import React from 'react';
import PropTypes from 'prop-types';
import {Table, Button} from 'react-bootstrap';

//My imports
import * as util from '../../../opus-logic/common/helpers/';
import {ToolTip, ToolTipWrapper} from '../../common/components/elements/ToolTip.jsx';
import {ShowIf, HideIf} from '../../common/components/elements/DisplayIf.jsx';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions';
import SummaryPageLogic from '../../../opus-logic/cases/classes/profile/SummaryPage';
import CasesDossier from '../../../opus-logic/cases/classes/CasesDossier';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {DisplayTable, DisplayTableHeader} from
  '../../common/components/elements/DisplayTables.jsx';
import {EditIcon, DeleteIcon, CommentIcon} from '../../common/components/elements/Icon.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import {FormShell} from '../../common/components/forms/FormRender.jsx';
import {FormElementWrapper, FormSelect, FormInput} from '../../common/components/forms/FormElements.jsx';

/**
*
* ProfilePage is the page next to the sidebar that holds the table & modals
* @author - Moses Jung
* @class ProfilePage
* @extends React.Component
*
**/
export default class SummaryPage extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
  static propTypes = {
    profileAPIData: PropTypes.object,
  }

  static defaultProps = {
  }

  /**
  *
  *
  **/
  state = {
    isOAOrAPO: false,
    canEditProfileFromAdminData: false,
    canEditSummary: false,
    canEditStatus: false,
    showOpusStatusModal: false,
    profileSummaryDisplayInfo: {
      opusStatus: null,
      startingOpusStatusField: null,
      firstName: {value: '', error: null},
      middleName: {value: null, error: null},
      lastName: {value: '', error: null},
      officialEmail: {value: '', error: null}
    },
    profileSummaryAPIData: {},
    appointeeInfo: {}
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
  componentWillReceiveProps() {
    // if(profileAPIData !== this.state.profileAPIData) {
    //   this.loadPage(profileAPIData);
    // }
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
  Logic = new SummaryPageLogic(this.props);


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
      this.getProfileSummaryAPIDataFromOpusPersonId(opusPersonId);
    }
    let isOAOrAPO = this.Logic.isOAOrAPO();
    this.setState({isOAOrAPO})
  }


  /**
   *
   * @desc - Makes api call to get data from profile api via url id
   * @param {String} id -
   * @return {void}
   *
   **/
  async getProfileSummaryAPIDataFromOpusPersonId(id) {
    if(!id) {
      return;
    }

    let profileSummaryAPIData = await this.Logic.getProfileSummaryDataByOpusId(id);

    this.loadPage(profileSummaryAPIData);
  }

  /**
   *
   * @desc - Load page and reload page
   * @param {String} profileSummaryAPIData - id of person to reload page with
   * @return {void}
   *
   **/
  loadPage(profileSummaryAPIData = this.state.profileSummaryAPIData) {
    let {appointeeInfo} = profileSummaryAPIData;

    if(appointeeInfo) {
      let canEditProfileFromAdminData = this.Logic.getCanEditProfileFromAdminData();
      let canEditSummary = this.Logic.canEditSummary(profileSummaryAPIData);
      let canEditStatus = this.Logic.canEditStatus(profileSummaryAPIData);

      let {profileSummaryDisplayInfo, startingProfileSummaryDisplayInfo}
        = this.Logic.setUpProfileSummaryDisplayInfo(profileSummaryAPIData.appointeeInfo);

      let editable = false;
      if(appointeeInfo.hrStatus==='Inactive' || appointeeInfo.hrStatus===null || appointeeInfo.hrStatus===''){
        editable = true;
      }

      this.setState({profileSummaryAPIData, appointeeInfo, canEditProfileFromAdminData, canEditSummary,
        canEditStatus, editable, profileSummaryDisplayInfo, startingProfileSummaryDisplayInfo});
    }
  }

  /*****************************************************************************
   *
   * @name OPUS STATUS
   * @desc - Section for Creating Table and Modal. Updating and saving
   *  opusStatus changes
   *
   *****************************************************************************/

  /**
   *
   * @desc - Show opus status modal
   * @return {void}
   *
   **/
  showOpusStatusModal = () => {
    let {profileSummaryDisplayInfo} = this.state;
    profileSummaryDisplayInfo.opusStatus = util.cloneObject(profileSummaryDisplayInfo.startingOpusStatusField);
    this.setState({showOpusStatusModal: true, profileSummaryDisplayInfo});
  }

  /**
   *
   * @desc - Hide opus status modal
   * @return {void}
   *
   **/
  hideOpusStatusModal = () => {
    this.setState({showOpusStatusModal: false,
      profileSummaryDisplayInfo: util.cloneObject(this.state.startingProfileSummaryDisplayInfo)});
  }

  /**
   *
   * @desc - Onchange opus status modal
   * @param {Event} evt - opusStatus updates from this evt
   * @return {void}
   *
   **/
  onChangeProfileSummary = (evt, typeOfReq) => {
    let {profileSummaryDisplayInfo} = this.state;
    if(typeOfReq==='opusStatus'){
      //Update field value
      profileSummaryDisplayInfo.opusStatus.value = evt.target.value;
    }else{
      profileSummaryDisplayInfo[typeOfReq].value = evt.target.value;
    }

    //Update field in UI
    this.setState({profileSummaryDisplayInfo});
  }

  /**
  *
  * @desc - Onclick save the opusStatus
  * @return {void}
  *
  **/
  saveProfileSummary = async () => {
    let {editable, profileSummaryDisplayInfo} = this.state;
    let {opusStatus} = profileSummaryDisplayInfo;

    let status = this.Logic.validateAllFieldDataOnSave({opusStatus});
    profileSummaryDisplayInfo.opusStatus = status.opusStatus;

    let hasErrors = false;
    let promise = this.Logic.validateProfileData(profileSummaryDisplayInfo, editable, this.props.opusPersonId);
    let returningObject = await promise;
    //Now rerender this field to show error if any
    this.setState({profileSummaryDisplayInfo: returningObject.profileSummaryDisplayInfo});

    //If there are no errors lets save
    if(!returningObject.hasErrors) {
      this.saveProfileSummaryToAPI();
    }
  }

  /**
   *
   * @desc - Onclick save the opusStatus
   * @return {void}
   *
   **/
  saveProfileSummaryToAPI = async () => {
    // TODO: send data back when Sony is finished
    let {profileSummaryDisplayInfo, appointeeInfo} = this.state;

    //Disable so we cant save multiple times
    this.setState({isSaveProfileSummaryButtonDisabled: true});

    let apiPromise = this.Logic.saveProfileSummary(profileSummaryDisplayInfo, appointeeInfo.opusPersonId);

    //Catch the promise so execution is not stopped if it has failed
    try {
      await apiPromise;
    } catch(e) {
      console.log("ERROR: api call in 'saveProfileSummaryToAPI' in SummaryPage.jsx")
      console.log(e);
    }

    //Enable the save button, hide apo modal, and send promise to error modal
    this.setState({apiPromise, isSaveProfileSummaryButtonDisabled: false,
      showOpusStatusModal: false});

    //Reload the modal
    this.getProfileSummaryAPIDataFromOpusPersonId(this.state.opusPersonId);
  }

  dismissModal(){
    window.location.reload();
  }

  /**
   *
   * @desc - Gets opus status modal
   * @return {JSX} - Opus status modal
   *
   **/
  getOpusStatusModal() {
    const {editable, profileSummaryDisplayInfo, canEditStatus} = this.state;
    return (
      <Modal backdrop="static" show={this.state.showOpusStatusModal}
        onHide={this.hideOpusStatusModal}>
        <Header className=" modal-info modal-header " closeButton>
          <Title> <h1 className=" modal-title black ">Edit Profile Summary</h1> </Title>
        </Header>
        <Body>
          <FormShell>
            <FormInput name="firstName" disabled={!editable}
              displayName={'First Name'} value={profileSummaryDisplayInfo.firstName.value}
              onChange={(e) => this.onChangeProfileSummary(e, 'firstName')}
              hasError={profileSummaryDisplayInfo.firstName.error!==null} error={profileSummaryDisplayInfo.firstName.error} />
            <FormInput name="middleName" disabled={!editable}
              displayName={'Middle Name (optional)'} value={profileSummaryDisplayInfo.middleName.value}
              onChange={(e) => this.onChangeProfileSummary(e, 'middleName')} />
            <FormInput name="lastName" disabled={!editable}
              displayName={'Last Name'} value={profileSummaryDisplayInfo.lastName.value}
              onChange={(e) => this.onChangeProfileSummary(e, 'lastName')}
              hasError={profileSummaryDisplayInfo.lastName.error!==null} error={profileSummaryDisplayInfo.lastName.error} />
            <FormInput name="officialEmail" disabled={!editable}
              displayName={'Email'} value={profileSummaryDisplayInfo.officialEmail.value}
              onChange={(e) => this.onChangeProfileSummary(e, 'officialEmail')}
              hasError={profileSummaryDisplayInfo.officialEmail.error!==null} error={profileSummaryDisplayInfo.officialEmail.error} />
            <FormSelect name="opusStatus" {...profileSummaryDisplayInfo.opusStatus}
              includeBlankOption={false} disabled={canEditStatus}
              onChange={(e) => this.onChangeProfileSummary(e, 'opusStatus')} />
          </FormShell>
        </Body>
        <Footer>
          <Button className="left btn btn-primary" onClick={this.saveProfileSummary}
            disabled={this.state.isSaveProfileSummaryButtonDisabled}>
            Save
          </Button>
          <Dismiss onClick={this.hideOpusStatusModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
  *
  * @desc - The page
  * @return {JSX} - JSX for title
  *
  **/
  render() {
    let {isOAOrAPO, profileSummaryAPIData, appointeeInfo, apiPromise} = this.state;

    return(
      <div className=" col-md-8 ">
        <HideIf hide={profileSummaryAPIData.appointeeInfo}>
          <p>
            View and edit appointments, excellence clock and eight year clock
            information.
          </p>
        </HideIf>
        <ShowIf show={profileSummaryAPIData.appointeeInfo}>
          <div>
            <h2> Summary</h2>
            <p>
              This is a summary of this appointee's personal information in Opus. If you spot an error,
              please email <a href="mailto:opushelp@ucla.edu">opushelp@ucla.edu</a>
            </p>
            <Table bordered responsive>
              <DisplayTableHeader>
                <ShowIf show={this.state.canEditSummary}>
                  <EditIcon position={' right '} onClick={this.showOpusStatusModal}/>
                </ShowIf>
              </DisplayTableHeader>
              <tbody>
                <tr>
                  <td className='label-column col-md-5'>
                    UID
                  </td>
                  <td>
                    {appointeeInfo.uid ? appointeeInfo.uid : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Employee ID <ToolTip text={descriptions.employeeId} />
                  </td>
                  <td>
                    {appointeeInfo.emplId ? appointeeInfo.emplId : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Opus ID
                  </td>
                  <td>
                    {appointeeInfo.opusPersonId ? appointeeInfo.opusPersonId : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    RPT User ID <ToolTip text={descriptions.rptUserId} />
                  </td>
                  <td>
                    {appointeeInfo.bycUserId ? appointeeInfo.bycUserId : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Email
                  </td>
                  <td>
                    {appointeeInfo.officialEmail ? appointeeInfo.officialEmail : null}
                  </td>
                </tr>
                <ShowIf show={isOAOrAPO}>
                  <tr>
                    <td className='label-column'>
                      EPPN <ToolTip text={descriptions.eppn} />
                    </td>
                    <td>
                      {appointeeInfo.eppn ? appointeeInfo.eppn : null}
                    </td>
                  </tr>
                </ShowIf>
                <tr>
                  <td className='label-column'>
                    Opus Status <ToolTip text={descriptions.opus_status} />
                  </td>
                  <td>
                    <span className='left pad-right-5'>
                      {appointeeInfo.opusStatus ? appointeeInfo.opusStatus : null}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                      HR Status <ToolTip text={descriptions.hrStatus} />
                  </td>
                  <td>
                    {appointeeInfo.hrStatus ? appointeeInfo.hrStatus : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Hire Date <ToolTip text={descriptions.hireDt} />
                  </td>
                  <td>
                    {appointeeInfo.hireDt ? appointeeInfo.hireDt : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Primary Department
                   </td>
                  <td>
                    {profileSummaryAPIData.primaryDepartment ? profileSummaryAPIData.primaryDepartment : null}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                     Active Appointments
                  </td>
                  <td>
                    {profileSummaryAPIData.noOfActiveAppts}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Active Cases <ToolTip text={descriptions.activeCases} />
                  </td>
                  <td>
                    {profileSummaryAPIData.activeCases}
                  </td>
                </tr>
                <tr>
                  <td className='label-column'>
                    Latest Completed Case <ToolTip text={descriptions.latestCompletedCase} />
                  </td>
                  <td>
                    {profileSummaryAPIData.latestCompletedCase ? profileSummaryAPIData.latestCompletedCase : null}
                    {profileSummaryAPIData.latestCompletedDt ? ', '+profileSummaryAPIData.latestCompletedDt : null}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ShowIf>
        {this.getOpusStatusModal()}
        <APIResponseModal promise={apiPromise} onDismissClick={this.dismissModal}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
