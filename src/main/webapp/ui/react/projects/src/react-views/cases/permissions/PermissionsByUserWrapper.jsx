import React from "react";
import PropTypes from "prop-types";


/**
*
* Local Imports
*
**/
import { Table, Button } from "react-bootstrap";
import * as util from "../../../opus-logic/common/helpers/";
import Permissions from "../../../opus-logic/common/modules/Permissions";
import PermissionsLogic from "../../../opus-logic/cases/classes/permissions/PermissionsByUser";
import AutoComplete from "../../common/components/jquery-ui/AutoComplete.jsx";
import APIResponseModal from "../../common/components/bootstrap/APIResponseModal.jsx";
import Modal, { Header, Title, Body, Dismiss, Footer } from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import { ToolTip } from "../../common/components/elements/ToolTip.jsx";
import { ShowIf } from "../../common/components/elements/DisplayIf.jsx";
import { descriptions } from "../../../opus-logic/common/constants/Descriptions";
import { DeleteIcon } from "../../common/components/elements/Icon.jsx";
import { FormShell } from "../../common/components/forms/FormRender.jsx";
import { FormSelect } from "../../common/components/forms/FormElements.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

export default class PermissionsByUserWrapper extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
    static propTypes = {

        Page: PropTypes.func,
        permissionsByUserAPIData: PropTypes.object,
        appointeeInfo: PropTypes.object,
        adminData: PropTypes.object.isRequired,
    };
    static defaultProps = {
        permissionsByUserAPIData: {
            appointeeInfo: {},
            userRolesMap: []
        },
        setUserPermissionsApiDataInGlobalState: () => {
            console.error("You have no state management function for this call!");
        }
    };

  /**
   *
   * @desc - Set it all off
   * @return {void}
   *
   **/
    constructor(props = {}) {
        super(props);
        this.onCommitteeSelect = this.onCommitteeSelect.bind(this);
        this.onInterfolioRoleSelect = this.onInterfolioRoleSelect.bind(this);
        this.onRoleSelect = this.onRoleSelect.bind(this);
    }

  /**
   *
   * @desc - Instance variables
   *
   **/
    state = {
        hasUserRoles: false,
        showUserRoles: true,
        showHeader: false,
        hasOpusRoles: false,
        opusRolesDisplays: [],
        hasRPTRoles: false,
        rptRolesDisplays: [],
        hasRPTCommittees: false,
        rptCommitteesDisplays: [],
        showAddRoleModal: false,
        showSuccessModal: false,
        showFailureModal: false,
        showWarningModal: false,
        addRoleAction: null,
        committeeDropdownOptions: [],
        roleName: null,
        roleId: null,
        opusPersonId: null,
        committeeId: null,
        isCommitteeManager: null,
        permissionInfo: null,
        showRolesCheatSheetModal: false,
        permissionsByUserAPIData: {
            appointeeInfo: {},
            userRolesMap: []
        }
    };

  /**
   *
   * @desc - When component will be rendered Get args needed to run the page
   * @return {void}
   *
   **/
    componentWillMount() {
        let { id } = util.getUrlArgs();
        this.setState({ opusPersonId: id });
    // let Page = this.props.Page;
        this.getUserPermissionsAPIDataFromOpusPersonId(id);
    }

  /**
   *
   * @desc - Table has been mounted so lets fill in the rows
   * @return {void}
   *
   **/
    componentDidUpdate() {
        util.initJQueryBootStrapToolTipandPopover();
    }

  //Class variables
    Permissions = new Permissions(this.props.adminData);
    Logic = new PermissionsLogic(this.props);

  /**
   *
   * @desc - Makes api call to get data from user permissions api via url id
   * @param {String} id -
   * @return {void}
   *
   **/
    async getUserPermissionsAPIDataFromOpusPersonId(id) {
      console.log(id)
        if (!id) {
            return;
        }
        let opusRolesDisplays = [];
        let rptRolesDisplays = [];
        let rptCommitteesDisplays = [];
        this.setState({ showUserRoles: false, showHeader: false, opusRolesDisplays, rptRolesDisplays, rptCommitteesDisplays });
        let permissionsByUserAPIData = await this.Logic.getUserPermissionsByOpusId(id);
        this.setState({ showUserRoles: true, showHeader: true, permissionsByUserAPIData });

        if (permissionsByUserAPIData.userRolesMap.opusRoles != null
      && permissionsByUserAPIData.userRolesMap.opusRoles.length > 0) {
            this.setState({ hasOpusRoles: true });
            this.getDisplayData(permissionsByUserAPIData.userRolesMap.opusRoles, "opus");
        }

        if (permissionsByUserAPIData.userRolesMap.rptRoles != null
      && permissionsByUserAPIData.userRolesMap.rptRoles.length > 0) {
            this.setState({ hasRPTRoles: true });
            this.getDisplayData(permissionsByUserAPIData.userRolesMap.rptRoles, "rpt");
        }

        if (permissionsByUserAPIData.userRolesMap.rptCommittees != null
      && permissionsByUserAPIData.userRolesMap.rptCommittees.length > 0) {
            this.setState({ hasRPTCommittees: true });
            this.getDisplayData(permissionsByUserAPIData.userRolesMap.rptCommittees, "rptCommittees");
        }

        //Set it in global state
        this.props.setUserPermissionsApiDataInGlobalState(permissionsByUserAPIData);
    }


  /**
   *
   * @desc - Guess
   * @param {String} opusPersonId - id of person to reload page with
   * @return {void}
   *
   **/
    reloadPageWithOpusPersonId(opusPersonId) {
        window.open(`?id=${opusPersonId}`, "_self");
    }

  /**
  *
  * @desc - Title Text
  * @param {Object} appointeeInfo - uid and hire date
  * @return {JSX} - JSX for title
  *
  **/
    getTitleText({ fullName, uid, officialEmail, opusStatus } = this.state.permissionsByUserAPIData.appointeeInfo || {}) {
        let { showHeader } = this.state;
        return (

      <ShowIf show={showHeader}>
        <div>
          <h2> {fullName}</h2>
          <div>
            <p className="small">
              <span> UID: {uid} </span>
              <br />
              <span> {officialEmail} </span>
              <br />
              <span>
                Opus Status: {opusStatus}
                <ToolTip text={descriptions.opus_status} />
              </span>
            </p>
          </div>
        </div>
      </ShowIf>

    );
    }

  /**
   *
   * @desc - Get user roles display fields from roles data
   * @param {Array} permissions - array of permissions data
   * @param {String} typeOfAction - string that determines what state to save in at the end
   *
   **/
    getDisplayData(permissionsInfo, typeOfAction) {
        let permissionsDisplay = [];
        if (typeOfAction === "opus") {
            for (let each of permissionsInfo) {
                let permissionsInfoObject = {};
                permissionsInfoObject.roleDisplayName = each.roleDisplayName;
                permissionsInfoObject.userRole = each.userRole;
                permissionsInfoObject.roleId = each.roleId;
                permissionsInfoObject.typeOfReq = "opus";
                permissionsInfoObject.committeeId = each.committeeId;
                permissionsInfoObject.committeeMembershipId = each.committeeMembershipId;
                permissionsDisplay.push(permissionsInfoObject);
            }
            this.setState({ opusRolesDisplays: permissionsDisplay });
        } else if (typeOfAction === "rpt") {
            for (let each of permissionsInfo) {
                let permissionsInfoObject = {};
                permissionsInfoObject.roleDisplayName = each.roleDisplayName;
                permissionsInfoObject.roleId = each.roleId;
                permissionsInfoObject.userRole = each.bycUnitId;
                permissionsInfoObject.typeOfReq = "interfolio";
                permissionsInfoObject.committeeId = each.committeeId;
                permissionsInfoObject.committeeMembershipId = each.committeeMembershipId;
                permissionsDisplay.push(permissionsInfoObject);
            }
            this.setState({ rptRolesDisplays: permissionsDisplay });
        } else if (typeOfAction === "rptCommittees") {
            for (let each of permissionsInfo) {
                let permissionsInfoObject = {};
                permissionsInfoObject.roleDisplayName = each.roleDisplayName;
                permissionsInfoObject.userRole = each.userRole;
                permissionsInfoObject.roleId = each.committeeMembershipId;
                permissionsInfoObject.typeOfReq = "interfolioCommittees";
                permissionsInfoObject.committeeId = each.committeeId;
                permissionsInfoObject.committeeMembershipId = each.committeeMembershipId;
                permissionsDisplay.push(permissionsInfoObject);
            }
            this.setState({ rptCommitteesDisplays: permissionsDisplay });
        }
    }

    startDelete = (permissionInfo) => {
        this.deleteRole(permissionInfo);
    }

  /**
  *
  * @desc - actual save function
  * @param {Array} appointmentSetToSave - Array of appointments to save
  * @return {void}
  *
  **/
    deleteRole = async (permissionInfo) => {
        let opusPersonId = this.state.opusPersonId;
        let typeOfReq = permissionInfo.typeOfReq;
        let roleName = permissionInfo.userRole;
        let roleId = permissionInfo.roleId;
        let committeeId = permissionInfo.committeeId;
        let committeeMembershipId = permissionInfo.committeeMembershipId;
        let bycUserId = null;
        let uid = this.state.permissionsByUserAPIData.appointeeInfo.uid;
        console.log("Opus Person ID: "+opusPersonId);
        console.log("Type of Request: "+typeOfReq);
        console.log("Role Name: "+roleName);
        console.log("Role ID: "+roleId);
        console.log("Comittee ID: "+committeeId);
        console.log("Comittee Membership ID: "+committeeMembershipId);
    // Only hit update api if there are something to save
        let apiPromise = this.Logic.removeRoleFromDB(opusPersonId, typeOfReq, roleName, roleId,
      committeeId, committeeMembershipId, bycUserId, this.props.access_token);

    //Catch the promise so execution is not stopped if it has failed
        try {
            await apiPromise;
            this.showSuccessModal("deleted");
        } catch (e) {
            console.log(e);
            this.showFailureModal();
        }
    }

  /*****************************************************************************
   *
   * @name Add Roles Modal
   * @desc - Add Opus and Interfolio Role views and functions
   *
   *****************************************************************************/

  /**
   *
   * @desc - Show api call add role dropdown options
   * @return {void}
   *
   **/
    showAddRoleModal = async (typeOfAction) => {
        this.setState({ showAddRoleModal: true, resultsMessage: null, committeeDropdownOptions: [] });
        let addRoleAction = "opus";
        let addRoleHeaderText = "Opus";
        let {roleName, roleId} = this.state;
    // If the modal action is 'addOpusRole'
        if (typeOfAction === "addOpusRole") {
            addRoleAction = "opus";
            addRoleHeaderText = "Opus";
        }
    // If the modal action is 'addInterfolioRole'
        if (typeOfAction === "addInterfolioRole") {
            addRoleAction = "interfolio";
            addRoleHeaderText = "Interfolio";
            roleName = "Administrative";
            roleId = 1;
        }
    // If the modal action is 'addCommitteeRole'
        if (typeOfAction === "addCommitteeRole") {
            addRoleAction = "committee";
            addRoleHeaderText = "Interfolio Committee";
            roleName = null;
            roleId = null;
        }
        this.setState({ addRoleAction, addRoleHeaderText, roleName, roleId });
    }

  /**
   *
   * @desc - view roles cheat sheet modal
   * @return {void}
   *
   **/
    showRolesCheatSheetModal = async () => {
        this.setState({ showRolesCheatSheetModal: true });
    }

  /**
   *
   * @desc - Erase error message and then conduct on hide
   * Also reverts any changes back to original
   *
   **/
    hideAddRoleModal = () => {
        this.setState({
            showAddRoleModal: false, addRoleAction: null, resultsMessage: null,
            permissionInfo: null, typeOfReq: null, showWarningModal: false
        });
    }

  /**
   *
   * @desc - Erase error message and then conduct on hide
   * Also reverts any changes back to original
   *
   **/
    cancelAddRoleModal = () => {
        this.setState({
            showAddRoleModal: false, addRoleAction: null, resultsMessage: null,
            permissionInfo: null, typeOfReq: null, showWarningModal: false, showRolesCheatSheetModal: false
        });
    }

  /**
  *
  * @desc - When user selects role from autocomplete
  * @return {void}
  *
  **/
    onSelectUnit = async (event, { id: name }) => {
        let committeeDropdownList = this.Logic.getFormattedCommitteeSearchOptions(name);
    //Get from API
        let committeeDropdownOptions = await committeeDropdownList;
    //No name so go back
        if (!name) {
            return;
        }
        console.log(committeeDropdownOptions);
        this.setState({ committeeId: name, committeeDropdownOptions });
    }


  /**
  *
  * @desc - Get Add Role modal
  * @return {JSX} - JSX for add role modal
  *
  **/
    getAddRoleModal() {
        let { resultsMessage, addRoleAction, addRoleHeaderText, committeeDropdownOptions } = this.state;
    //debugger;
        return (
      <Modal className="modal-lg" backdrop="static" show={this.state.showAddRoleModal} onHide={() => this.cancelAddRoleModal()}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title">Add {addRoleHeaderText} Role</h1>
        </Header>
        <Body>
          <div class="modal-body">
            {this.getTitleText()}
            <br></br>


            <div>
              <ShowIf show={addRoleAction === "opus"}>
                <div className="row">
                  <form class="form-horizontal">
                    <div class="form-group">
                      <label className='col-md-2'>
                        Role <ToolTip text={descriptions.opus_roles} />
                      </label>
                      <span className='col-md-4 '>
                        <AutoComplete placeholder={'Search for a department or organization'}
                          ref="autocomplete"
                          options={this.onAutocompleteRoleSearchKeypress} autoCompleteUIOptions={{}}
                          onSearchClick={this.onSelectRole} id={'roleSearchAutocomplete'}
                          input_css={' form-control search-field permissions-search-width '} />

                        <p className="no-results-namesearch">{resultsMessage}</p>
                      </span>
                    </div>
                  </form>

                </div>
              </ShowIf>
              <ShowIf show={addRoleAction === "interfolio"}>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className='col-md-2'>
                      Unit
                    </label>
                    <span className='col-md-4'>
                      <AutoComplete placeholder={'Search for a department or organization'}
                        ref="autocomplete"
                        options={this.onAutocompleteRoleSearchKeypress} autoCompleteUIOptions={{}}
                        onSearchClick={this.onSelectRole} id={'roleSearchAutocomplete'} />
                    </span>
                  </div>
                  <p className="no-results-namesearch">{this.state.noResultsMessage}</p>
                  <div className="form-group">
                    <label className='col-md-2 control-label'>
                      Role <ToolTip text={descriptions.interfolio_roles} />
                    </label>
                    <div className=" col-md-8">
                      <select className='form-control' value={this.state.value} onChange={this.onInterfolioRoleSelect}>
                      <option value="1">Administrator</option>
                      <option value="6">Case Manager</option>
                      <option value="7">Template Administrator</option>
                      </select>
                    </div>
                  </div>
                </form>

              </ShowIf>
              <ShowIf show={addRoleAction === "committee"}>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className='col-md-2'>
                      Unit
                    </label>
                    <span className='col-md-4'>
                      <AutoComplete placeholder={'Search for a department or organization'}
                        ref="autocomplete"
                        options={this.onAutocompleteRoleSearchKeypress} autoCompleteUIOptions={{}}
                        onSearchClick={this.onSelectUnit} id={'roleSearchAutocomplete'} />
                    </span>
                  </div>
                  <p className="no-results-namesearch">{this.state.noResultsMessage}</p>
                  <div className="form-group">
                    <label className='col-md-2 control-label'>
                      Committee
                    </label>
                    <div className=" col-md-8">
                      <select className='form-control' value={this.state.value} onChange={this.onCommitteeSelect}>
                        <option value=""></option>
                        {committeeDropdownOptions.map((option, id) =>
                          (<option value={(option.id) + "-" + (option.displayName)}>{option.displayName}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className='col-md-2 control-label'>
                      Role <ToolTip text={descriptions.interfolio_committee_roles} />
                    </label>
                    <div className=" col-md-8">
                      <select className='form-control' value={this.state.value} onChange={this.onRoleSelect}>
                        <option value=""></option>
                        <option value="True">Manager</option>
                        <option value="False">Member</option>
                      </select>
                    </div>
                  </div>
                </form>

              </ShowIf>
            </div>
          </div>
        </Body>
        <Footer>
          <button className="left btn btn-primary" onClick={() => this.validateAddRoleBeforeSave()}>
            Save
            </button>
          <Dismiss onClick={() => this.cancelAddRoleModal()} className="left btn btn-link">
            Cancel
            </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
  *
  * @desc - validates add role before save
  * @return {void}
  *
  **/
    validateAddRoleBeforeSave = () => {
        this.addRoleToDB();
    }

  /**
  *
  * @desc - Get Roles Cheat Sheet modal
  * @return {JSX} - JSX for roles cheat sheet modal
  *
  **/
    getRolesCheatSheetModal() {

        return (
      <Modal backdrop="static" show={this.state.showRolesCheatSheetModal} onHide={() => this.cancelAddRoleModal()} className="modal-lg">
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title">Roles Cheat Sheet</h1>
        </Header>
        <Body>
          <div>
            <h2 className="flush-top">Opus Roles</h2>
            <p>
              Faculty users are not included in Opus (except for faculty with chair/director/dean duties).

                  <ul type="disc">
                <li><span className="strong"> APO Administrator:</span> Academic Personnel Office staff member.</li>
                <li><span className="strong">Campus Budget Analyst: </span> Academic Planning & Budget staff member.  Can see salary information for budgeting purposes.</li>
                <li><span className="strong">CAP Administrator: </span> Council of Academic Personnel staff member.</li>
                <li><span className="strong">Chair: </span> Faculty chair or director of an academic unit.  Can see all academic employees' data within their department.</li>
                <li><span className="strong">Dean: </span> Faculty dean, vice dean, or associate dean of a school. Can see all academic employees' data within their school.</li>
                <li><span className="strong">Dept. Administrator: </span> Staff person with academic personnel responsibilities at a department level.  Can see all academic employees' data within their department.</li>
                <li><span className="strong">Opus Campus Admin: </span> Opus staff member.</li>
                <li><span className="strong">School Administrator: </span> Staff person with academic personnel duties in a dean's office. Can see all academic employees' data within their school.</li>
              </ul>
            </p>
            <h2>Interfolio Roles </h2>
            <p>
              This only includes the staff roles in Interfolio.  It does not include committees or candidates.

                  <ul type="disc">
                <li><span className="strong">(Unit) Administrator: </span> Administrator assigned to an academic unit.</li>
                <li><span className="strong">Campus Evaluator: </span> Everyone on campus.</li>
              </ul>
            </p>
            <h2>Interfolio Committees</h2>
            <p>
              These are administrative committees assigned to each step of the review process, so they can have access.  This list does not include review committees.
                  <br />
              <ul type="disc">
                <li><span className="strong">(Department) Admin Committee: </span> Allows administrative departmental staff to upload and view documents when the case is at the department level. Staff who aren’t academic personnel analysts could be put on an Admin Committee to perform a specific task on a specific review step.</li>
                <li><span className="strong">(Department) Chair Committee: </span> Allows department chairs to upload and view documents when the case is ready for the Chair’s review.</li>
                <li><span className="strong">(Dean’s Office) School Admin Committee: </span> Allows administrative school staff to upload and view documents when the case is at the Dean’s level. Staff who aren’t academic personnel analysts could be put on an Admin Committee to perform a specific task on a specific review step.</li>
                <li><span className="strong">(Dean’s Office) Dean Committee: </span> Allows deans to upload and view documents when the case is ready for the Dean’s review.</li>
                <li><span className="strong">APO Admin Committee: </span> Allows Academic Personnel Office staff to view the case.</li>
                <li><span className="strong">CAP Admin Committee: </span> Allows the Council of Academic Personnel to view the candidate’s packet.</li>
                <li><span className="strong">APO Approver Committee: </span> Allows the Vice Chancellor of Academic Personnel to review and make a decision on the case.</li>
              </ul>
            </p>
          </div>
        </Body>
        <div className="modal-footer">
          <Dismiss onClick={() => this.cancelAddRoleModal()} className="left btn btn-primary"> Close</Dismiss>
        </div>
      </Modal>
    );
    }

  /**
  *
  * @desc - When user selects role from autocomplete
  * @return {void}
  *
  **/
    onSelectRole = async (event, { id: name }) => {
    //No name so go back
        if (!name) {
            return;
        }
        console.log(name)
        this.setState({ committeeId: name });
    }

    onInterfolioRoleSelect(event) {
        // IOK-1363 Set correct roleName value (default roleId of 1)
        let roleId = event.target.value ? event.target.value : "1";
        let roleName;
        if(roleId==="1"){
          roleName = "Administrator";
        }else if(roleId==="6"){
          roleName = "Case Manager";
        }else if(roleId==="7"){
          roleName = "Template Administrator";
        }
        this.setState({ roleId, roleName });
    }

  /**
  *
  * @desc - When user selects committee
  * @return {void}
  *
  **/
    onCommitteeSelect(event) {
        this.setState({ committeeId: event.target.value });
    }

    onRoleSelect(event) {
        this.setState({ isCommitteeManager: event.target.value });
    }

  /**
  *
  * @desc - validates if each appointment has a category and at least 2 appointments in it
  * @return {void}
  *
  **/
    addRoleToDB = async () => {
        let opusPersonId = this.state.opusPersonId;
        let typeOfReq = this.state.addRoleAction;
        let roleName = this.state.roleName;
        let roleId = this.state.roleId;
        let committeeId = this.state.committeeId;
        // IOK-1363 IOK-1457 For opus requests, send role name as committee Id
        if(typeOfReq==="opus"){
          roleName = committeeId;
        }
        let isCommitteeManager = this.state.isCommitteeManager;
        let uid = this.state.permissionsByUserAPIData.appointeeInfo.uid;
        console.log("Opus Person ID: "+opusPersonId);
        console.log("UID: "+uid);
        console.log("Type of Request: "+typeOfReq);
        console.log("Role Name: "+roleName);
        console.log("Role ID: "+roleId);
        console.log("Comittee ID: "+committeeId);
        console.log("Is this a Comittee Manager?: "+isCommitteeManager);
        let apiPromise = this.Logic.addRoleToDB(uid, typeOfReq, roleId,
      roleName, committeeId, isCommitteeManager, this.props.access_token);

    //Catch the promise so execution is not stopped if it has failed
        try {
            await apiPromise;
            this.showSuccessModal("added");
        } catch (e) {
            console.log(e);
            this.showFailureModal();
        }
    }

  /*****************************************************************************
   *
   * @name opus roles
   * @desc - Section for showing opus roles
   *
   *****************************************************************************/

  /**
  *
  * @desc - opus roles component
  * @return {JSX} - JSX for opus roles
  *
  **/
    getOpusRolesComponent() {
        let { opusRolesDisplays, showHeader } = this.state;
        return (
      <ShowIf show={showHeader}>
        <div>
          <div className="row">
            <div className=" col-md-4 ">
              <h3> Opus Roles <ToolTip text={descriptions.opus_roles} /></h3>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary hidden-print right small table-top"
                onClick={() => this.showAddRoleModal("addOpusRole")}>
                Add Role
               </button>
            </div>
          </div>

          <ShowIf show={opusRolesDisplays.length > 0}>
            <div className="row">
              <div className="col-md-6">
                <Table bordered responsive>
                  {opusRolesDisplays.map((permissionInfo) =>
                    this.getUserRolesDisplayBlock(permissionInfo))}
                </Table>
              </div>
            </div>
          </ShowIf>

          <ShowIf show={opusRolesDisplays.length == 0}>
            <div className="row">
              <div className="col-md-6">
                <Table bordered responsive>
                  <tbody>
                    <tr>
                      <td>
                        <span>None</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </ShowIf>

        </div>

      </ShowIf>


    );
    }

  /**
   *
   * @desc - rpt roles component
   * @return {JSX} - JSX for rpt roles
   *
   **/
    getRPTRolesComponent() {
        let { rptRolesDisplays, showHeader } = this.state;
        return (
      <ShowIf show={showHeader}>
        <div>
          <div className=" row">
            <div className=" col-md-4 ">
              <h3> Interfolio Roles <ToolTip text={descriptions.interfolio_roles} /></h3>
            </div>
            <div className=" col-md-2 ">
              <button className="btn btn-primary hidden-print right small table-top"
                onClick={() => this.showAddRoleModal("addInterfolioRole")}>
                Add Role
              </button>
            </div>
          </div>
          <ShowIf show={this.state.hasRPTRoles}>
            <div className=" row">
              <div className=" col-md-6 ">
                <Table bordered responsive>
                  {rptRolesDisplays.map((permissionInfo) =>
                    this.getUserRolesDisplayBlock(permissionInfo))}
                </Table>
              </div>
            </div>
          </ShowIf>
          <ShowIf show={rptRolesDisplays.length == 0}>
            <div className=" row">
              <div className=" col-md-6 ">
                <Table bordered responsive>
                  <tbody>
                    <tr>
                      <td>
                        <span>None</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </ShowIf>
        </div>

      </ShowIf>
    );
    }

  /**
  *
  * @desc - rpt committee component
  * @return {JSX} - JSX for rpt committee
  *
  **/
    getRPTCommitteesComponent() {
        let { rptCommitteesDisplays, showHeader } = this.state;
        return (
      <ShowIf show={showHeader}>
        <div>
          <div className="row">
            <div className=" col-md-4 ">
              <h3> Interfolio Committees <ToolTip text={descriptions.interfolio_committees} /></h3>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary hidden-print right small table-top"
                onClick={() => this.showAddRoleModal("addCommitteeRole")}>
                Add Role
              </button>
            </div>
          </div>
          <ShowIf show={this.state.hasRPTCommittees}>
            <div className=" row">
              <div className=" col-md-6 ">
                <Table bordered responsive>
                  {rptCommitteesDisplays.map((permissionInfo) =>
                    this.getUserRolesDisplayBlock(permissionInfo))}
                </Table>
              </div>
            </div>
          </ShowIf>
          <ShowIf show={rptCommitteesDisplays.length == 0}>
            <div className=" row">
              <div className=" col-md-6 ">
                <Table bordered responsive>
                  <tbody>
                    <tr>
                      <td>
                        <span>None</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </ShowIf>
        </div>
      </ShowIf >
    );
    }

  /*****************************************************************************
   *
   * @name UserROlesDisplayBlock
   * @desc - Section for displaying Opus, RPT and 180 Roles block
   *
   *****************************************************************************/

  /**
   *
   * @desc - Opus, RPT and 180 Roles display block
   * @return {JSX} - JSX for displaying Opus, RPT and 180 Roles data
   *
   **/
    getUserRolesDisplayBlock(permissionInfo) {
        return (
      <tbody>
        <tr>
          <td>
            <span>
              {permissionInfo.roleDisplayName}
              <DeleteIcon onClick={() => this.showWarningModal("deleteIcon", permissionInfo)} />
            </span>
          </td>
        </tr>
      </tbody>
    );
    }

  /**
   *
   * @desc - When the user selects a name reload this page
   * @param {Object} event - type event
   * @param {Object} - opusPersonId for reloading page
   * @return {void}
   *
   **/
    onChooseAutoCompleteName = (event, { uid: opusPersonId } = {}) => {
        this.reloadPageWithOpusPersonId(opusPersonId);
    }

  /**
   *
   * @desc - When the user selects a role stay on the modal
   * @param {Object} event - type event
   * @param {Object} - opusPersonId for reloading page
   * @return {void}
   *
   **/
    onChooseAutoCompleteRole = (event, { uid: opusPersonId } = {}) => {
    //this.reloadPageWithOpusPersonId(opusPersonId);
    }

  /**
   *
   * @desc - Lets search for the person the user enters
   * @param {Object} event - has name to search for
   * @param {Object} response - populates autocomplete dropdown w/ array
   * @return {Object} formattedResults - results ready made for autocomplete
   *
   **/
    onAutocompleteSearchKeypress = async ({ term: searchText }, response) => {
        let formattedResultsPromise = this.Logic.getFormattedNameSearchOptions(
      searchText);
    //Send to error modal
        this.setState({ apiPromise: formattedResultsPromise });

    //Get from API
        let formattedResults = await formattedResultsPromise;

    //Send back to autocomplete to populate dropdown
        response(formattedResults);

    //Get error message if we did or didnt find people
        let resultsMessage = formattedResults.length ? "" :
      `No results found for "${searchText}".`;

    //Set the message in state
        this.setState({ resultsMessage });
        return formattedResults;
    }

  /**
   *
   * @desc - Lets search for the role the user enters
   * @param {Object} event - has role to search for
   * @param {Object} response - populates autocomplete dropdown w/ array
   * @return {Object} formattedResults - results ready made for autocomplete
   *
   **/
    onAutocompleteRoleSearchKeypress = async ({ term: searchString }, response) => {
        let formattedResultsPromise = this.Logic.getFormattedRoleSearchOptions(
      searchString, this.state.addRoleAction);

    //Send to error modal
        this.setState({ apiPromise: formattedResultsPromise });

    //Get from API
        let formattedResults = await formattedResultsPromise;

    //Send back to autocomplete to populate dropdown
        response(formattedResults);

    //Get error message if we did or didnt find people
        let resultsMessage = formattedResults.length ? "" :
      `No results found for "${searchString}".`;

    //Set the message in state
        this.setState({ resultsMessage });
        return formattedResults;
    }

  /*****************************************************************************
   *
   * @name Warning Modal
   * @desc - Section for displaying warning modal
   *
   *****************************************************************************/

  /**
   *
   * @desc - Show warning modal
   * @return {void}
   *
   **/
    showWarningModal = (clickLocation, permissionInfo) => {
        this.setState({ showWarningModal: true, clickLocation, permissionInfo });
    }

  /**
   *
   * @desc - Hides warning modal
   *
   **/
    hideWarningModal = () => {
        this.setState({ showWarningModal: false });
        this.getUserPermissionsAPIDataFromOpusPersonId(this.state.opusPersonId);
    }

  /**
   *
   * @desc - Warning modal
   * @return {JSX} - jsx
   *
   **/
    getWarningModal() {
        let { clickLocation, permissionInfo } = this.state;
        return (
      <Modal backdrop="static" onHide={this.hideWarningModal}
        show={this.state.showWarningModal}>
        <Header className=" modal-warning " closeButton>
          <Title> <h1 className="modal-title" > Delete a Role </h1> </Title>
        </Header>
        <Body>
          <ShowIf show={clickLocation === "deleteIcon"}>
            <p>Are you sure you want to delete this role?</p>
          </ShowIf>
        </Body>
        <Footer>
          <Button bsStyle="warning" className="left white"
            onClick={() => this.startDelete(permissionInfo)}>
            Delete
          </Button>
          <Dismiss onClick={this.hideWarningModal}
            className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

    /*****************************************************************************
   *
   * @name API Modal
   * @desc - Section for displaying Success or failure modal
   *
   *****************************************************************************/

      /**
       *
       * @desc - Show success modal
       * @return {void}
       *
       **/
      showSuccessModal = (successModalMessage) => {
        this.hideAddRoleModal();
        this.setState({ showSuccessModal: true , successModalMessage});
    }

    /**
    *
    * @desc - Hides success modal
    *
    **/
    hideSuccessModal = () => {
        this.setState({ showSuccessModal: false });
        this.getUserPermissionsAPIDataFromOpusPersonId(this.state.opusPersonId);
    }

    /**
    *
    * @desc - success modal
    * @return {JSX} - jsx
    *
    **/
    getSuccessModal = () => {
      let {showSuccessModal, successModalMessage} = this.state;
      return (
      < Modal show={showSuccessModal} onHide={this.hideSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Success! </h1>
        </Header>
        <Body>
          <p>Role has been {successModalMessage}!</p>
        </Body>
        <Footer>
          <button className={"left btn btn-success"} onClick={this.hideSuccessModal}>
            OK
          </button>
        </Footer>
      </Modal>
    );
  }

    /**
       *
       * @desc - Show success modal
       * @return {void}
       *
       **/
    showFailureModal = () => {
      this.hideAddRoleModal();
      this.setState({ showFailureModal: true });
  }

  /**
  *
  * @desc - Hides success modal
  *
  **/
  hideFailureModal = () => {
      this.setState({ showFailureModal: false });
      this.getUserPermissionsAPIDataFromOpusPersonId(this.state.opusPersonId);
  }

  /**
  *
  * @desc - success modal
  * @return {JSX} - jsx
  *
  **/
  getFailureModal = () => {
    let {showFailureModal} = this.state;
    return (
    < Modal show={showFailureModal} onHide={this.hideFailureModal}>
      <Header className=" modal-danger " closeButton>
        <h1 className="white" id="ModalHeader"> Error </h1>
      </Header>
      <Body>
        <p>Something went wrong. Could not add role. Please email opushelp@ucla.edu for support.</p>
      </Body>
      <Footer>
        <button className={"left btn btn-danger"} onClick={this.hideFailureModal}>
          OK
        </button>
      </Footer>
    </Modal>
  );
}

  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
    render() {
        let { state: { resultsMessage, apiPromise } } = this;
        return (
      <div>
        <div className="container-fluid">
          <br /><br />
          View roles and permissions of all staff that use Opus and Interfolio products. View <a href='#' onClick={this.showRolesCheatSheetModal}>Roles Cheat Sheet</a>.
        </div>
        <div className="container-fluid" >
          <br></br><br></br>
          <APIResponseModal {...{ failurePromised: apiPromise }} />
          <div results={resultsMessage}>
            <AutoComplete placeholder={'Search for a person by name (last, first) or UID'} name={'search-field'}
              options={this.onAutocompleteSearchKeypress} id="profile-search"
              onSearchClick={this.onChooseAutoCompleteName} />

            <p className="no-results-namesearch">{resultsMessage}</p>
          </div>


          {this.getTitleText()}
        </div>
        <div className="container-fluid">
          {this.getOpusRolesComponent()}
          {this.getRPTRolesComponent()}
          {this.getRPTCommitteesComponent()}
          {this.getAddRoleModal()}
          {this.getSuccessModal()}
          {this.getFailureModal()}
          {this.getWarningModal()}
          {this.getRolesCheatSheetModal()}
          <br></br>
        </div>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>);
    }
}
