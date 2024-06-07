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

export default class PermissionsByUnitWrapper extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
    static propTypes = {

        Page: PropTypes.func,
        permissionsByUnitAPIData: PropTypes.object,
        permissionsDataByUnit: PropTypes.object,
        appointeeInfo: PropTypes.object,
        adminData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        permissionsDataByUnit: [],
        permissionsByUnitAPIData: {
            schoolList: []
        },
        setUnitPermissionsApiDataInGlobalState: () => {
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
        this.onRoleSelect = this.onRoleSelect.bind(this);
        this.onInterfolioRoleSelect = this.onInterfolioRoleSelect.bind(this);
        this.onOpusRoleSelect = this.onOpusRoleSelect.bind(this);
    }

  /**
   *
   * @desc - Instance variables
   *
   **/
    state = {
        showHeader: false,
        hasOpusRoles: false,
        hasRPTRoles: false,
        hasLoaded: false,
        hasUnitInfoLoaded: false,
        hasRPTCommittees: false,
        showWarningModal: false,
        opusRolesDisplays: [],
        rptRolesDisplays: [],
        unitHierarchyDisplay: [],
        departmentHierarchyDisplay: [],
        rptCommitteesDisplays: [],
        userRolesByUnit: null,
        showRolesCheatSheetModal: false,
        headerText: null,
        permissionsDataByUnit: [],
        roleName: null,
        roleId: null,
        opusPersonId: null,
        unitId: null,
        committeeId: null,
        isCommitteeManager: null,
        opusRolesDropdown: [],
        rptCommitteesDropdown: [],
        permissionsByUnitAPIData: {
            schoolList: []
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
        this.setState({ unitId: id });
    // let Page = this.props.Page;
        if (!id) {
            this.getUnitHierarchyPermissionsAPIData(id);
        } else {
            this.loadSearchedUnitInfo(id);
        }
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
    async getUnitHierarchyPermissionsAPIData(id) {
        let unitHierarchy = [];
        if (!id) {
            id = -1;
            unitHierarchy = await this.Logic.getLogInUserUnitHierarchy();
        }
        this.getDisplayData(unitHierarchy, "units");
        this.loadSearchedUnitInfo(id);
    }

    async loadSearchedUnitInfo(id) {
        // console.log(id);
        let permissionsByUnitAPIData = await this.Logic.getUserUnitHierarchy(id);
        // console.log(permissionsByUnitAPIData);
        id = permissionsByUnitAPIData.unitId;
        let headerText = permissionsByUnitAPIData.name;
        if (id !== null) {
            this.loadUnitData(id, headerText);
        }
    }

    async loadUnitData(bycUnitId, name) {
        let rptRolesDisplays = [];
        let opusRolesDisplays = [];
        let rptCommitteesDisplays = [];
        let headerText = name;
        let permissionsDataByUnit = await this.Logic.getUserRolesForUnit(bycUnitId);
        let opusRolesDropdown = permissionsDataByUnit.opusRolesOptions;
        let rptCommitteesDropdown = permissionsDataByUnit.rptCommitteesOptions;
        this.setState({headerText, showHeader: true, opusRolesDropdown, rptCommitteesDropdown, rptRolesDisplays, opusRolesDisplays, unitId: bycUnitId, rptCommitteesDisplays });
        if (permissionsDataByUnit.userRolesByUnitMap.opusRoles !== null
      && permissionsDataByUnit.userRolesByUnitMap.opusRoles.length > 0) {
            this.setState({ hasOpusRoles: true });
            this.getDisplayData(permissionsDataByUnit.userRolesByUnitMap.opusRoles, "opus");
        }
        if (permissionsDataByUnit.userRolesByUnitMap.rptRoles !== null
      && permissionsDataByUnit.userRolesByUnitMap.rptRoles.length > 0) {
            this.setState({ hasRPTRoles: true });
            this.getDisplayData(permissionsDataByUnit.userRolesByUnitMap.rptRoles, "rpt");
        }
        if (permissionsDataByUnit.committeeMembersByUnitMap.rptCommittees !== null
      && permissionsDataByUnit.committeeMembersByUnitMap.rptCommittees.length > 0) {
            this.setState({ hasRPTCommittees: true });
            this.getDisplayData(permissionsDataByUnit.committeeMembersByUnitMap.rptCommittees, "rptCommittees");
        }
        this.setState({ hasLoaded: true, hasUnitInfoLoaded: true, rptCommitteesDropdown, });
    //Set it in global state
        this.props.setUnitPermissionsApiDataInGlobalState(permissionsDataByUnit);
    }

  /**
   *
   * @desc - Guess
   * @param {String} opusPersonId - id of unit to reload page with
   * @return {void}
   *
   **/
    reloadPageWithUnitId(unitId) {
        window.open(`?id=${unitId}`, "_self");
    }

  /*****************************************************************************
   *
   * @name Add Roles Modal
   * @desc - Add Opus and Interfolio Role views and functions
   *
   *****************************************************************************/

  /**
   *
   * @desc - Get user roles display fields from roles data
   * @param {Array} permissions - array of permissions data
   * @param {String} typeOfAction - string that determines what state to save in at the end
   *
   **/
    getDisplayData(permissionsInfo, typeOfAction) {
        // console.log(permissionsInfo);
        let permissionsDisplay = [];
        let unitHierarchyDisplay = [];
        let departmentHierarchyDisplay = [];
        if (typeOfAction === "opus") {
            for (let each of permissionsInfo) {
                let permissionsInfoObject = {};
                permissionsInfoObject.name = each.name;
                permissionsInfoObject.roleDisplayName = each.roleDisplayName;
                permissionsInfoObject.roleId = null;
                permissionsInfoObject.userRole = each.userRole;
                permissionsInfoObject.typeOfReq = "opus";
                permissionsInfoObject.committeeId = null;
                permissionsInfoObject.committeeMembershipId = null;
                permissionsInfoObject.opusPersonId = each.opusPersonId;
                permissionsInfoObject.ahPathId = each.ahPathId;
                permissionsInfoObject.bycUserId = each.bycUserId;
                permissionsInfoObject.bycUnitId = each.bycUnitId;
                permissionsInfoObject.userStatus = each.userStatus;
                permissionsInfoObject.uid = each.uid;
                permissionsDisplay.push(permissionsInfoObject);
            }
            this.setState({ opusRolesDisplays: permissionsDisplay });
        }
        if (typeOfAction === "rpt") {
            for (let each of permissionsInfo) {
                let permissionsInfoObject = {};
                permissionsInfoObject.name = each.name;
                permissionsInfoObject.roleDisplayName = each.roleDisplayName;
                permissionsInfoObject.roleId = each.roleId;
                permissionsInfoObject.userRole = each.userRole;
                permissionsInfoObject.typeOfReq = "interfolio";
                permissionsInfoObject.committeeId = null;
                permissionsInfoObject.committeeMembershipId = null;
                permissionsInfoObject.opusPersonId = each.opusPersonId;
                permissionsInfoObject.ahPathId = null;
                permissionsInfoObject.bycUserId = each.bycUserId;
                permissionsInfoObject.bycUnitId = each.bycUnitId;
                permissionsInfoObject.userStatus = null;
                permissionsInfoObject.uid = null;
                permissionsDisplay.push(permissionsInfoObject);
            }
            this.setState({ rptRolesDisplays: permissionsDisplay });
        }
        if (typeOfAction === "rptCommittees") {
            permissionsDisplay = permissionsInfo;
            this.setState({ rptCommitteesDisplays: permissionsDisplay });
        }
        if (typeOfAction === "units") {
            unitHierarchyDisplay = permissionsInfo.schoolList;
            // console.log(unitHierarchyDisplay);
            departmentHierarchyDisplay = permissionsInfo.departmentList;
            this.setState({ unitHierarchyDisplay: unitHierarchyDisplay, departmentHierarchyDisplay: departmentHierarchyDisplay });
        }
    }

    showUnitInfo(unitId, name) {
        let ids = unitId.split("-");
        let bycUnitId = ids[1];
        this.setState({ hasUnitInfoLoaded: false, resultsMessage: null });
        this.loadUnitData(bycUnitId, name);
    }

  /*****************************************************************************
   *
   * @name opus roles
   * @desc - Section for showing multi-level accordion for Academic Hierarchy
   *
   *****************************************************************************/


    getAcademicHierarchy() {
        let { unitHierarchyDisplay, showHeader } = this.state;
        return (
      <ShowIf show={showHeader}>
        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
          {unitHierarchyDisplay.map((school, schoolIndex) =>
            <div className="panel panel-default">
              <div className="panel-heading" role="tab" id={"heading-1" + schoolIndex}>
                <div className="panel-title">
                  <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse-1" + schoolIndex} aria-expanded="false" aria-controls={"collapse-1" + schoolIndex} onClick={() => this.showUnitInfo(school.unitId, school.name)}>
                    {school.name}
                  </a>
                  <ShowIf show={school.divisionList.length > 0}>
                    <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent="#accordion" href={"#collapse-1" + schoolIndex} aria-expanded="false" aria-controls={"collapse-1" + schoolIndex}>
                      <span  className=" icon-down-open-big gray panel-icon "></span>
                      <span  className="icon-right-open-big gray panel-icon "></span>
                    </a>
                  </ShowIf>
                </div>
              </div>

              <ShowIf show={school.divisionList.length === 1 && school.name !== "Dentistry" && school.name !== "Management" && school.name !== "Medicine" && school.name !== "Batman"}>
                <div id={"collapse-1" + schoolIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1" + schoolIndex}>
                    {school.divisionList.map((division, divisionIndex) =>
                      <ul className="list-group " id="accordion-1" role="tablist" aria-multiselectable="true">
                        {division.departmentList.map((department, departmentIndex) =>
                          <li className="list-group-item">
                            <a className="accordian-toggle collapsed" data-toggle="collapse" data-parent="#accordion21" href="#collapseTwoOne" onClick={() => this.showUnitInfo(department.unitId, department.name)}>{department.name}</a>
                          </li>
                        )}
                      </ul>
                    )}
                </div>
              </ShowIf>

              <ShowIf show={school.divisionList.length > 1}>
                <div id={"collapse-1" + schoolIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1" + schoolIndex}>
                  <ul className="list-group" id={"accordion-1" + schoolIndex} role="tablist" aria-multiselectable="true">

                      {school.divisionList.map((division, divisionIndex) =>

                          <li className="list-group-item">
                            <div className="" role="tab" id={"heading-1-1" + schoolIndex + divisionIndex}>
                              <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1" + schoolIndex + divisionIndex} href={"#collapse-1-1" + schoolIndex + divisionIndex} aria-expanded="false" aria-controls={"collapse-1-1" + schoolIndex + divisionIndex} onClick={() => this.showUnitInfo(division.unitId, division.name)}>
                                {division.name}
                              </a>
                              <ShowIf show={division.departmentList.length > 0}>
                                <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent="#accordion-1-1" href={"#collapse-1-1" + schoolIndex + divisionIndex} aria-expanded="false" aria-controls={"collapse-1-1" + schoolIndex + divisionIndex}>
                                  <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                                  <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                                </a>
                              </ShowIf>
                            </div>

                            <div id={"collapse-1-1" + schoolIndex + divisionIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1" + schoolIndex + divisionIndex}>
                              <li className="list-group-item" id={"accordion-1-1-1" + schoolIndex + divisionIndex} role="tablist" aria-multiselectable="true">
                                {division.departmentList.map((department, departmentIndex) =>
                                  <span>
                                    <li className="list-group-item" role="tab" id={"heading-1-1-1-1" + schoolIndex + departmentIndex}>
                                      <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1-1" + schoolIndex + departmentIndex} href={"#collapse-1-1-1-1" + schoolIndex + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1-1-1" + schoolIndex + departmentIndex} onClick={() => this.showUnitInfo(department.unitId, department.name)}>{department.name} </a>
                                    </li>
                                  </span>
                                )}
                              </li>
                            </div>


                          </li>

                      )}
                      </ul>

                </div>
              </ShowIf>

              <ShowIf show={school.name === "Dentistry" || school.name === "Management" || school.name === "Medicine"}>
                <div id={"collapse-1" + schoolIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1" + schoolIndex}>
                  {school.divisionList.map((division, divisionIndex) =>
                    <ul className="list-group" id={"accordion-1" + schoolIndex + divisionIndex} role="tablist" aria-multiselectable="true">
                      {division.departmentList.map((department, departmentIndex) =>
                        <li className="list-group-item">
                          <div className="" role="tab" id={"heading-1-1" + schoolIndex + departmentIndex}>
                              <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1" + schoolIndex + departmentIndex} href={"#collapse-1-1" + schoolIndex + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1" + schoolIndex + departmentIndex} onClick={() => this.showUnitInfo(department.unitId, department.name)}>
                                {department.name}
                              </a>
                              <ShowIf show={department.areaList.length > 0}>
                                <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent="#accordion-1-1" href={"#collapse-1-1" + schoolIndex + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1" + schoolIndex + departmentIndex}>
                                  <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                                  <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                                </a>
                              </ShowIf>
                          </div>

                          <ShowIf show={department.areaList.length > 0}>
                            <div id={"collapse-1-1" + schoolIndex + departmentIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1" + schoolIndex + departmentIndex}>
                                <li className="list-group-item" id={"accordion-1-1" + schoolIndex + departmentIndex} role="tablist" aria-multiselectable="true">
                                  {department.areaList.map((area, areaIndex) =>
                                    <span >
                                      <li className="list-group-item" role="tab" id={"heading-1-1-1" + schoolIndex + areaIndex}>
                                        <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1" + schoolIndex + areaIndex} href={"#collapse-1-1-1" + schoolIndex + areaIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + schoolIndex + areaIndex} onClick={() => this.showUnitInfo(area.unitId, area.name)}>
                                          {area.name}
                                        </a>
                                        <ShowIf show={area.specialtyList.length > 0}>
                                          <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent={"#accordion-1-1-1" + schoolIndex + areaIndex} href={"#collapse-1-1-1" + schoolIndex + areaIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + schoolIndex + areaIndex}>
                                            <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                                            <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                                          </a>
                                        </ShowIf>

                                        <ShowIf show={area.specialtyList.length > 0}>
                                          <div id={"collapse-1-1-1" + schoolIndex + areaIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1-1" + schoolIndex + areaIndex}>
                                            <li className="list-group-item" id={"accordion-1-1-1" + schoolIndex + areaIndex} role="tablist" aria-multiselectable="true">
                                              {area.specialtyList.map((specialty, specialtyIndex) =>
                                                <span>
                                                  <li className="list-group-item" role="tab" id={"heading-1-1-1-1" + schoolIndex + specialtyIndex}>
                                                    <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1-1" + schoolIndex + specialtyIndex} href={"#collapse-1-1-1-1" + schoolIndex + specialtyIndex} aria-expanded="false" aria-controls={"collapse-1-1-1-1" + schoolIndex + specialtyIndex} onClick={() => this.showUnitInfo(specialty.unitId, specialty.name)}>{specialty.name} </a>
                                                  </li>
                                                </span>
                                              )}
                                            </li>
                                          </div>
                                        </ShowIf>

                                      </li>
                                    </span>
                                  )}
                                </li>
                              </div>
                          </ShowIf>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </ShowIf>
              <ShowIf show={ school.name === "Batman"}>
                <div id={"collapse-1" + schoolIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1" + schoolIndex}>
                  {school.divisionList.map((division, divisionIndex) =>
                    <ul className="list-group" id={"accordion-1" + schoolIndex + divisionIndex} role="tablist" aria-multiselectable="true">
                        <li className="list-group-item">
                          <div className="" role="tab" id={"heading-1-1" + schoolIndex + divisionIndex}>
                          <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1" + schoolIndex + divisionIndex} href={"#collapse-1-1-1" + schoolIndex + divisionIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + schoolIndex + divisionIndex} onClick={() => this.showUnitInfo(division.unitId, division.name)}>
                            {division.name}
                          </a>
                          <ShowIf show={division.departmentList.length > 0}>
                            <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent={"#accordion-1-1-1" + schoolIndex + divisionIndex} href={"#collapse-1-1-1" + schoolIndex + divisionIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + schoolIndex + divisionIndex}>
                              <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                              <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                            </a>
                          </ShowIf>

                          {division.departmentList.map((department, departmentIndex) =>
                            <li className="list-group-item">
                              <div className="" role="tab" id={"heading-1-1" + schoolIndex + departmentIndex}>
                                  <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1" + schoolIndex + departmentIndex} href={"#collapse-1-1" + schoolIndex + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1" + schoolIndex + departmentIndex} onClick={() => this.showUnitInfo(department.unitId, department.name)}>
                                    {department.name}
                                  </a>
                                  <ShowIf show={department.areaList.length > 0}>
                                    <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent="#accordion-1-1" href={"#collapse-1-1" + schoolIndex + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1" + schoolIndex + departmentIndex}>
                                      <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                                      <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                                    </a>
                                  </ShowIf>
                              </div>

                              <ShowIf show={department.areaList.length > 0}>
                                <div id={"collapse-1-1" + schoolIndex + departmentIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1" + schoolIndex + departmentIndex}>
                                    <li className="list-group-item" id={"accordion-1-1" + schoolIndex + departmentIndex} role="tablist" aria-multiselectable="true">
                                      {department.areaList.map((area, areaIndex) =>
                                        <span >
                                          <li className="list-group-item" role="tab" id={"heading-1-1-1" + schoolIndex + areaIndex}>
                                            <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1" + schoolIndex + areaIndex} href={"#collapse-1-1-1" + schoolIndex + areaIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + schoolIndex + areaIndex} onClick={() => this.showUnitInfo(area.unitId, area.name)}>
                                              {area.name}
                                            </a>
                                            <ShowIf show={area.specialtyList.length > 0}>
                                              <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent={"#accordion-1-1-1" + schoolIndex + areaIndex} href={"#collapse-1-1-1" + schoolIndex + areaIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + schoolIndex + areaIndex}>
                                                <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                                                <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                                              </a>
                                            </ShowIf>

                                            <ShowIf show={area.specialtyList.length > 0}>
                                              <div id={"collapse-1-1-1" + schoolIndex + areaIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1-1" + schoolIndex + areaIndex}>
                                                <li className="list-group-item" id={"accordion-1-1-1" + schoolIndex + areaIndex} role="tablist" aria-multiselectable="true">
                                                  {area.specialtyList.map((specialty, specialtyIndex) =>
                                                    <span>
                                                      <li className="list-group-item" role="tab" id={"heading-1-1-1-1" + schoolIndex + specialtyIndex}>
                                                        <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1-1" + schoolIndex + specialtyIndex} href={"#collapse-1-1-1-1" + schoolIndex + specialtyIndex} aria-expanded="false" aria-controls={"collapse-1-1-1-1" + schoolIndex + specialtyIndex} onClick={() => this.showUnitInfo(specialty.unitId, specialty.name)}>{specialty.name} </a>
                                                      </li>
                                                    </span>
                                                  )}
                                                </li>
                                              </div>
                                            </ShowIf>

                                          </li>
                                        </span>
                                      )}
                                    </li>
                                  </div>
                              </ShowIf>
                            </li>
                          )}
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </ShowIf>
            </div>
          )}
        </div>
      </ShowIf>
    );
    }

    getMyUnits() {
        let {showHeader, departmentHierarchyDisplay } = this.state;
        return (
      <ShowIf show={showHeader}>
        <div className="panel-title">
          {departmentHierarchyDisplay.map((department, departmentIndex) =>
            <ul className="list-group" id={"accordion-1" + departmentIndex} role="tablist" aria-multiselectable="true">
              <li className="list-group-item">
                <div className="" role="tab" id={"heading-1-1" + departmentIndex}>
                    <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1" + departmentIndex} href={"#collapse-1-1" + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1" + departmentIndex} onClick={() => this.showUnitInfo(department.unitId, department.name)}>
                      {department.name}
                    </a>
                    <ShowIf show={department.areaList.length > 0}>
                      <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent="#accordion-1-1" href={"#collapse-1-1" + departmentIndex} aria-expanded="false" aria-controls={"collapse-1-1" + departmentIndex}>
                        <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                        <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                      </a>
                    </ShowIf>
                </div>

                <ShowIf show={department.areaList.length > 0}>
                  <div id={"collapse-1-1" + departmentIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1" + departmentIndex}>
                      <ul className="list-group" id={"accordion-1-1" + departmentIndex} role="tablist" aria-multiselectable="true">
                        {department.areaList.map((area, areaIndex) =>
                          <span >
                            <li className="list-group-item" role="tab" id={"heading-1-1-1" + departmentIndex + areaIndex}>
                              <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1" + departmentIndex + areaIndex} href={"#collapse-1-1-1" + departmentIndex + areaIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + departmentIndex + areaIndex} onClick={() => this.showUnitInfo(area.unitId, area.name)}>
                                {area.name}
                              </a>
                              <ShowIf show={area.specialtyList.length > 0}>
                                <a className="accordian-toggle collapsed" role="button" data-toggle="collapse"  data-parent={"#accordion-1-1-1" + departmentIndex + areaIndex} href={"#collapse-1-1-1" + departmentIndex + areaIndex} aria-expanded="false" aria-controls={"collapse-1-1-1" + departmentIndex + areaIndex}>
                                  <span  className=" icon-down-open-big gray panel-icon icon-indent "></span>
                                  <span  className="icon-right-open-big gray panel-icon icon-indent "></span>
                                </a>
                              </ShowIf>
                            </li>
                            <ShowIf show={area.specialtyList.length > 0}>
                            <div id={"collapse-1-1-1" + departmentIndex + areaIndex} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading-1-1-1" + departmentIndex + areaIndex}>
                              <ul className="list-group" id={"accordion-1-1-1" + departmentIndex + areaIndex} role="tablist" aria-multiselectable="true">
                                {area.specialtyList.map((specialty, specialtyIndex) =>
                                  <span>
                                    <li className="list-group-item" role="tab" id={"heading-1-1-1-1" + departmentIndex + specialtyIndex}>
                                      <a className="accordian-toggle collapsed" role="button" data-toggle="collapse" data-parent={"#accordion-1-1-1-1" + departmentIndex + specialtyIndex} href={"#collapse-1-1-1-1" + departmentIndex + specialtyIndex} aria-expanded="false" aria-controls={"collapse-1-1-1-1" + departmentIndex + specialtyIndex} onClick={() => this.showUnitInfo(specialty.unitId, specialty.name)}>{specialty.name} </a>
                                    </li>
                                  </span>
                                )}
                              </ul>
                            </div>
                            </ShowIf>
                          </span>
                        )}
                      </ul>
                    </div>
                </ShowIf>
              </li>
            </ul>
          )}
        </div>

      </ShowIf>
    );
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
            <div className=" col-md-10 ">
              <h3> Opus Users <ToolTip text={descriptions.opus_roles} /></h3>
            </div>
            <div className="col-md-2">
              <ShowIf show={this.Logic.isOAOrAPO()}>
                <button className="btn btn-primary hidden-print right small" onClick={() => this.showAddRoleModal("addOpusRole", null)}>
                  Add Person
                </button>
              </ShowIf>
            </div>
          </div>

          <ShowIf show={opusRolesDisplays.length > 0}>
            <div className="row">
              <div className="col-md-12">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Opus Status</th>
                      <ShowIf show={this.Logic.isOAOrAPO()}>
                        <th>Delete</th>
                      </ShowIf>
                    </tr>
                  </thead>
                  {opusRolesDisplays.map((permissionInfo) =>
                    this.getOpusUserRolesDisplayBlock(permissionInfo))}
                </Table>
              </div>
            </div>
          </ShowIf>

          <ShowIf show={opusRolesDisplays.length == 0}>
            <div className="row">
              <div className="col-md-12">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Opus Status</th>
                      <ShowIf show={this.Logic.isOAOrAPO()}>
                        <th>Delete</th>
                      </ShowIf>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <ShowIf show={this.Logic.isOAOrAPO()}>
                        <td colSpan="4">
                          <span>There are no Opus users at this time.</span>
                        </td>
                      </ShowIf>
                      <ShowIf show={!this.Logic.isOAOrAPO()}>
                        <td colSpan="3">
                          <span>There are no Opus users at this time.</span>
                        </td>
                      </ShowIf>
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


  /*****************************************************************************
   *
   * @name rpt roles
   * @desc - Section for showing rpt roles
   *
   *****************************************************************************/

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
          <div className="row">
            <div className="col-md-10">
              <h3> Interfolio Users <ToolTip text={descriptions.interfolio_roles} /></h3>
            </div>
            <div className="col-md-2">
              <ShowIf show={this.Logic.isOAOrAPO()}>
                <button className="btn btn-primary hidden-print right small table-top" onClick={() => this.showAddRoleModal("addInterfolioRole", null)}>
                  Add Person
               </button>
              </ShowIf>
            </div>
          </div>

          <ShowIf show={rptRolesDisplays.length > 0}>
            <div className="row">
              <div className=" col-md-12 ">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <ShowIf show={this.Logic.isOAOrAPO()}>
                        <th>Delete</th>
                      </ShowIf>
                    </tr>
                  </thead>
                  {rptRolesDisplays.map((permissionInfo) =>
                    this.getRPTUserRolesDisplayBlock(permissionInfo))}
                </Table>
              </div>
            </div>
          </ShowIf>

          <ShowIf show={rptRolesDisplays.length == 0}>
            <div className="row">
              <div className=" col-md-12 ">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <ShowIf show={this.Logic.isOAOrAPO()}>
                        <th>Delete</th>
                      </ShowIf>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <ShowIf show={this.Logic.isOAOrAPO()}>
                        <td colSpan="3">
                          <span>There are no Interfolio users at this time.</span>
                        </td>
                      </ShowIf>
                      <ShowIf show={!this.Logic.isOAOrAPO()}>
                        <td colSpan="2">
                          <span>There are no Interfolio users at this time.</span>
                        </td>
                      </ShowIf>
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


  /*****************************************************************************
   *
   * @name rpt committee roles
   * @desc - Section for showing rpt committee roles
   *
   *****************************************************************************/

  /**
  *
  * @desc - rpt committee roles component
  * @return {JSX} - JSX for rpt committee roles
  *
  **/
    getRPTCommitteesComponent() {
        let { rptCommitteesDisplays, showHeader } = this.state;
        return (
      <ShowIf show={showHeader}>
        <div>
          <h3> Interfolio Committee Members <ToolTip text={descriptions.interfolio_committees} /></h3>

          {rptCommitteesDisplays.map((committeeMember) =>
            <div>
              <div className="row">
                <div className="col-md-10">
                  <div className="strong "> {committeeMember.committeeName} </div>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary hidden-print right small table-top" onClick={() => this.showAddRoleModal(committeeMember.committeeName, committeeMember.committeeId)}>
                      Add Person
                    </button>
                </div>
              </div>


              <ShowIf show={committeeMember.permissionList.length > 0}>
                <div className="row">
                  <div className="col-md-12">
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                            <th>Delete</th>
                        </tr>
                      </thead>
                      {committeeMember.permissionList.map((permissionInfo) =>
                        this.getRPTCommitteesDisplayBlock(permissionInfo))}
                    </Table>
                  </div>
                </div>
              </ShowIf>

              <ShowIf show={committeeMember.permissionList.length == 0}>
                <div className="row">
                  <div className=" col-md-12 ">
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                            <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                            <td colSpan="3">
                              <span>There are no Interfolio committee members at this time.</span>
                            </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </ShowIf>
            </div>
          )}

          <ShowIf show={rptCommitteesDisplays.length == 0}>
            <div className="row">
              <div className=" col-md-12 ">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td colSpan="3">
                          <span>There are no Interfolio committees at this time.</span>
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

  /*****************************************************************************
   *
   * @name OpusUserRolesDisplayBlock
   * @desc - Section for displaying Opus, RPT and 180 Roles block
   *
   *****************************************************************************/

  /**
   *
   * @desc - Opus, RPT and 180 Roles display block
   * @return {JSX} - JSX for displaying Opus, RPT and 180 Roles data
   *
   **/
    getOpusUserRolesDisplayBlock(permissionInfo) {
        return (
      <tbody>
        <tr>
          <td>
            <span>
              {permissionInfo.name}
            </span>
          </td>
          <td>
            <span>
              {permissionInfo.roleDisplayName}
            </span>
          </td>
          <td>
            <span>
              {permissionInfo.userStatus}
            </span>
          </td>
          <ShowIf show={this.Logic.isOAOrAPO()}>
            <td>
              <span>
                  <DeleteIcon onClick={() => this.showWarningModal("deleteIcon", permissionInfo)} />
              </span>
            </td>
          </ShowIf>
        </tr>
      </tbody>
    );
    }

  /*****************************************************************************
   *
   * @name UserRolesDisplayBlock
   * @desc - Section for displaying Opus, RPT and 180 Roles block
   *
   *****************************************************************************/

  /**
   *
   * @desc - Opus, RPT and 180 Roles display block
   * @return {JSX} - JSX for displaying Opus, RPT and 180 Roles data
   *
   **/
    getRPTUserRolesDisplayBlock(permissionInfo) {
        return (
      <tbody>
        <tr>
          <td>
            <span>
              {permissionInfo.name}
            </span>
          </td>
          <td>
            <span>
              {permissionInfo.roleDisplayName}
            </span>
          </td>
          <ShowIf show={this.Logic.isOAOrAPO()}>
            <td>
              <span>
                  <DeleteIcon onClick={() => this.showWarningModal("deleteIcon", permissionInfo)} />
              </span>
            </td>
          </ShowIf>
        </tr>
      </tbody>
    );
    }


  /*****************************************************************************
   *
   * @name RPTCommitteesDisplayBlock
   * @desc - Section for displaying Opus, RPT and 180 Roles block
   *
   *****************************************************************************/

  /**
   *
   * @desc - Opus, RPT and 180 Roles display block
   * @return {JSX} - JSX for displaying Opus, RPT and 180 Roles data
   *
   **/
    getRPTCommitteesDisplayBlock(permissionInfo) {
        return (
      <tbody>
        <tr>
          <td>
            <span>
              {permissionInfo.name}
            </span>
          </td>
          <td>
            <span>
              {permissionInfo.roleDisplayName}
            </span>
          </td>
            <td>
              <span>
                  <DeleteIcon onClick={() => this.showWarningModal("deleteIcon", permissionInfo)} />
              </span>
            </td>
        </tr>
      </tbody>
    );
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
    cancelRolesCheatSheetModal = () => {
        this.setState({ showRolesCheatSheetModal: false });
    }

  /**
  *
  * @desc - Get Roles Cheat Sheet modal
  * @return {JSX} - JSX for roles cheat sheet modal
  *
  **/
    getRolesCheatSheetModal() {

        return (
      <Modal backdrop="static" show={this.state.showRolesCheatSheetModal} onHide={() => this.cancelRolesCheatSheetModal()} className="modal-lg">
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
          <Dismiss onClick={() => this.cancelRolesCheatSheetModal()} className="left btn btn-primary"> Close</Dismiss>
        </div>
      </Modal>
    );
    }


  /**
  * used by accordion search
  */
    function() {
        var searchTerm, panelContainerId;
    // Create a new contains that is case insensitive
        $.expr[":"].containsCaseInsensitive = function (n, i, m) {
            return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };

        $("#accordion_search_bar").on("change keyup paste click", function () {
            searchTerm = $(this).val();
            $("#accordion > .panel").each(function () {
                panelContainerId = "#" + $(this).attr("id");
                $(panelContainerId + ":not(:containsCaseInsensitive(" + searchTerm + "))").hide();
                $(panelContainerId + ":containsCaseInsensitive(" + searchTerm + ")").show();
            });
        });
    };

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
   * @desc - Erase error message and then conduct on hide
   * Also reverts any changes back to original
   *
   **/
    hideAddRoleModal = () => {
        this.setState({
            showAddRoleModal: false, addRoleAction: null, resultsMessage: null,
            typeOfReq: null, showWarningModal: false, hasUnitInfoLoaded: false
        });
        this.loadSearchedUnitInfo(this.state.unitId);
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
            typeOfReq: null, showWarningModal: false, showRolesCheatSheetModal: false
        });
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
  * @desc - When user selects committee
  * @return {void}
  *
  **/
    onRoleSelect(event) {
        this.setState({ isCommitteeManager: event.target.value });
    }

    onInterfolioRoleSelect(event) {
        this.setState({ roleId: event.target.value });
    }

    onOpusRoleSelect(event) {
        this.setState({ roleName: event.target.value });
    }

  /**
   *
   * @desc - Show api call add role dropdown options
   * @return {void}
   *
   **/
    showAddRoleModal = async (typeOfAction, committeeId) => {
        this.setState({ showAddRoleModal: true });
        let addRoleAction = "opus";
        let addRoleHeaderText = "Opus";
        let commonTypeValue = typeOfAction;
    // If the modal action is 'addOpusRole'
        if (typeOfAction === "addOpusRole") {
            addRoleAction = "opus";
            addRoleHeaderText = "Add Opus User";
        } else if (typeOfAction === "addInterfolioRole") {
            addRoleAction = "interfolio";
            addRoleHeaderText = "Add Interfolio User";
        } else {
      // If the modal action is 'addCommitteeRole'
      // if(typeOfAction==='addCommitteeRole'){
            addRoleAction = "committee";
            addRoleHeaderText = "Add Member to " + typeOfAction;
        }
        this.setState({ addRoleAction, addRoleHeaderText, committeeId, commonTypeValue });
    }

  /**
  *
  * @desc - validates if each appointment has a category and at least 2 appointments in it
  * @return {void}
  *
  **/
    addRoleToDB = async () => {
        let opusPersonId = this.state.opusPersonId;
        let unitId = this.state.unitId;
        let typeOfReq = this.state.addRoleAction;
        let roleName = this.state.roleName;
        let roleId = this.state.roleId;
        let committeeId = this.state.committeeId;
        // IOK-1454
        if(typeOfReq==="committee"){
          committeeId = this.state.committeeId + "-" + this.state.commonTypeValue;
        }
        let isCommitteeManager = this.state.isCommitteeManager;
        if (typeOfReq === "interfolio") {
            // roleName = unitId;
            committeeId = unitId;
        }
        console.log("Opus Person ID: "+opusPersonId);
        console.log("Unit Id: "+unitId);
        console.log("Type of Request: "+typeOfReq);
        console.log("Role Name: "+roleName);
        console.log("Role ID: "+roleId);
        console.log("Comittee ID: "+committeeId);
        console.log("Is this a Comittee Manager?: "+isCommitteeManager);
        let apiPromise = this.Logic.addRoleToDB(opusPersonId, typeOfReq, roleId,
      roleName, committeeId, isCommitteeManager, this.props.access_token);

    //Catch the promise so execution is not stopped if it has failed
        try {
            await apiPromise;
        } catch (e) {
            console.log(e);
        }

        this.setState({ apiPromise });
        this.hideAddRoleModal();
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
        let opusPersonId = permissionInfo.opusPersonId;
        let uid = permissionInfo.uid;
        let bycUserId = permissionInfo.bycUserId;
        let unitId = permissionInfo.bycUnitId;
        let typeOfReq = permissionInfo.typeOfReq;
        let roleName = permissionInfo.userRole;
        let roleId = permissionInfo.roleId;
        let committeeId = permissionInfo.committeeId;
        let committeeMembershipId = permissionInfo.committeeMembershipId;
        if (typeOfReq === "interfolio") {
            roleName = unitId;
        }
        if (!typeOfReq) {
            typeOfReq = "interfolioCommittees";
        }
        if (bycUserId === "") {
            bycUserId = null;
        }
        console.log("BYC User ID: "+bycUserId);
        console.log("Opus Person ID: "+opusPersonId);
        console.log("UID: "+uid)
        console.log("Type of Request: "+typeOfReq);
        console.log("Role Name: "+roleName);
        console.log("Role ID: "+roleId);
        console.log("Comittee ID: "+committeeId);
        console.log("Comittee Membership ID: "+committeeMembershipId);
    // Only hit update api if there are something to save
        let apiPromise = this.Logic.removeRoleFromDB(uid, typeOfReq, roleName, roleId,
      committeeId, committeeMembershipId, bycUserId, this.props.access_token);

    //Catch the promise so execution is not stopped if it has failed
        try {
            await apiPromise;
        } catch (e) {
            console.log(e);
        }
        this.setState({ apiPromise });
        this.hideAddRoleModal();
    }

  /**
  *
  * @desc - Get Add Role modal
  * @return {JSX} - JSX for add role modal
  *
  **/
    getAddRoleModal() {
        let { resultsMessage, addRoleAction, addRoleHeaderText, committeeId,
      rptCommitteesDropdown, headerText, opusRolesDropdown, unitId, commonTypeValue } = this.state;
        return (
      <Modal className="modal-lg" backdrop="static" show={this.state.showAddRoleModal} onHide={() => this.cancelAddRoleModal()}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title">{addRoleHeaderText}</h1>
        </Header>
        <Body>
          <div class="modal-body">
            <h2> {headerText} </h2>
            <br></br>


            <div>
              <ShowIf show={addRoleAction === "opus"}>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className='col-md-2'>
                      Who do you want to add?
                  </label>
                    <span className='col-md-4'>
                      <AutoComplete placeholder={'Search for a person by name (last, first) or UID'} name={'search-field'}
                        options={this.onAutocompleteSearchKeypress} id="profile-search"
                        onSearchClick={this.onSelectRole} />
                    </span>
                  </div>
                  <p className="no-results-namesearch">{this.state.noResultsMessage}</p>
                  <div className="form-group">
                    <label className='col-md-2 control-label'>
                      Role <ToolTip text={descriptions.opus_roles} />
                    </label>
                    <div className=" col-md-8">
                      <select className='form-control' value={this.state.value} onChange={this.onOpusRoleSelect}>
                        <option value=""></option>
                        {opusRolesDropdown.map((option, commonTypeCode) =>
                          (<option value={(option.commonTypeCode)}>{option.commonTypeValue}</option>))}
                      </select>
                    </div>
                  </div>
                </form>
              </ShowIf>
              <ShowIf show={addRoleAction === "interfolio"}>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className='col-md-2'>
                      Who do you want to add?
                  </label>
                    <span className='col-md-4'>
                      <AutoComplete placeholder={'Search for a person by name (last, first) or UID'} name={'search-field'}
                        options={this.onAutocompleteSearchKeypress} id="profile-search"
                        onSearchClick={this.onSelectRole} />
                    </span>
                  </div>
                  <p className="no-results-namesearch">{this.state.noResultsMessage}</p>
                  <div className="form-group">
                    <label className='col-md-2 control-label'>
                      Role <ToolTip text={descriptions.interfolio_roles} />
                    </label>
                    <div className=" col-md-8">
                      <select className='form-control' value={this.state.value} onChange={this.onInterfolioRoleSelect}>
                        <option value=""></option>
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
                      Who do you want to add?
                  </label>
                    <span className='col-md-4'>
                      <AutoComplete placeholder={'Search for a person by name (last, first) or UID'} name={'search-field'}
                        options={this.onAutocompleteSearchKeypress} id="profile-search"
                        onSearchClick={this.onSelectRole} />
                    </span>
                  </div>
                  <p className="no-results-namesearch">{this.state.noResultsMessage}</p>
                  <div className="form-group">
                    <label className='col-md-2 control-label'>
                      Committee
                  </label>
                    <div className=" col-md-8">
                      <select className='form-control' value={this.state.value} disabled>
                        <option value=""></option>
                        {rptCommitteesDropdown.map((option, committeeId) =>
                          (<option value={(option.commonTypeId) + "-" + (option.commonTypeValue)} selected={(committeeId + "-" + commonTypeValue === option.commonTypeId + "-" + option.commonTypeValue ? true : false)}>{option.commonTypeValue}</option>))}
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
          <Title> <h1 className="modal-title" > Delete a User </h1> </Title>
        </Header>
        <Body>
          <ShowIf show={clickLocation === "deleteIcon"}>
            <p>Are you sure you want to remove permissions for this user?</p>
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


  /**
   *
   * @desc - Hides warning modal
   *
   **/
    hideWarningModal = () => {
        this.setState({ showWarningModal: false });
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
  * @desc - When user selects role from autocomplete
  * @return {void}
  *
  **/
    onSelectRole = async (event, { uid: opusPersonId } = {}) => {
    //No name so go back
        if (!opusPersonId) {
            return;
        }
        this.setState({ opusPersonId, unitId: this.state.unitId });
    }

  /**
   *
   * @desc - When the user selects a name reload this page
   * @param {Object} event - type event
   * @param {Object} - opusPersonId for reloading page
   * @return {void}
   *
   **/
    onChooseAutoCompleteName = (event, { id: unitId } = {}) => {
        this.setState({ hasUnitInfoLoaded: false });
        this.loadSearchedUnitInfo(unitId);
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
    // let replacementString = '&sol;';
        let typeOfReq = this.state.addRoleAction;
    // let replacedString =  searchString.replace(/\//g, replacementString);
        let formattedResultsPromise = this.Logic.getFormattedRoleSearchOptions(
      searchString, typeOfReq);

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


  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
    render() {
        let { state: { resultsMessage, apiPromise, headerText, hasLoaded, hasUnitInfoLoaded } } = this;
        return (
      <div className="row page-content ">
        <APIResponseModal {...{ apiPromise }} />
      {hasLoaded ?
        <div>
        <div className="col-md-4 leftnav left-side-nav">
          <div className="container-fluid">
            <h2> My Units </h2>
          </div>
          <div class="demo-container">
            {this.getAcademicHierarchy()}
            {this.getMyUnits()}
          </div>
        </div>
        {hasUnitInfoLoaded ?
        <div className="col-md-8">
          <div className="container-fluid">
            <br />
            View roles and permissions of all staff that use Opus and Interfolio products. View <a href='#' onClick={this.showRolesCheatSheetModal}>Roles Cheat Sheet</a>.
            <br />
          </div>
          <br></br>
          <div results={resultsMessage}>
            <AutoComplete placeholder={'Search for a department or organization'}
              options={this.onAutocompleteRoleSearchKeypress}
              onSearchClick={this.onChooseAutoCompleteName}
              input_css={' form-control search-field permissions-search-width '} />
            <p className="no-results-namesearch">{resultsMessage}</p>
          </div>

          <div className="container-fluid" >
            <div className="container-fluid">
              <h2> {headerText} </h2>
            </div>
            <div className="container-fluid">
              {this.getOpusRolesComponent()}
              {this.getRPTRolesComponent()}
              {this.getRPTCommitteesComponent()}
              {this.getAddRoleModal()}
              {this.getWarningModal()}
              {this.getRolesCheatSheetModal()}
              <br></br><br></br>
            </div>
          </div>
        </div>

          :

          <div className="container-fluid">
            <div className="col-md-8">
            <br></br><br></br>
            <p>Loading...</p>
          </div>
          </div>
          }

      </div>

      :

        <div className="container-fluid">
          <br></br><br></br>
          <p>Loading...</p>
        </div>
      }
      <FixedRoleDisplay {...this.Logic.adminData}/>
    </div>);
    }
}
