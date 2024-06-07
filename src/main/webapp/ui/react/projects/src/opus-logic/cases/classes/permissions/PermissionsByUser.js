//My imports
import {Cases} from "../Cases";
import * as util from "../../../common/helpers/";
import Permissions from "../../../common/modules/Permissions";
import {urlConfig, userPermissionsConstants} from
  "../../constants/permissions/PermissionConstants";

/**
*
* @classdesc Opus Logic class for Profile. Extends Cases subclass
* @class Profile
* @extends Cases
*
**/
export default class PermissionsByUser extends Cases {
  /**
   *
   * @desc - Class Variables
   *
   **/
    Permissions = null;

  /**
   *
   * @desc - Initializes data for Profile Logic Layer
   * @param {Object} data - startup data
   * @return {void}
   *
   **/
    constructor(data = {}) {
        super(data);
        this.startLogic(data);
    }

  /**
  *
  * @desc - Is it opusAdmin or apoDirector
  * @param {Object} adminData - adminData
  * @return {Boolean} - if its viewable by being and opusAdmin or apo director
  *
  **/
    isOAOrAPO() {
        let {isOA, isAPO} = this.Permissions;
        let isOAOrAPO = isOA || isAPO;
        return isOAOrAPO;
    }

  /**
  *
  * @desc - Is it opusAdmin or apoDirector
  * @param {Object} adminData - adminData
  * @return {Boolean} - if its viewable by being and opusAdmin or apo director
  *
  **/
    isSAOrDA() {
        let {isSA, isDA} = this.Permissions;
        let isSAOrDA = isSA || isDA;
        return isSAOrDA;
    }

  /**
   *
   * @desc - Initializes data for Profile Logic Layer
   * @param {Object} adminData, globalData, access_token -
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    startLogic({adminData, globalData, access_token} = {}) {
        this.Permissions = new Permissions(adminData);

    //Make lists to use to get options
        let formattedCommonCallLists = this.getFormattedListsFromCommonCallData(
      {adminData, globalData});

    //Get grouperPathText to save data
        const grouperPathText = this.getGrouperPathText(adminData);

    //Get slimmed logged in user info
        let loggedInUserInfo = this.getLoggedInUserInfo(adminData);
        console.log(loggedInUserInfo);
        this.setClassData({adminData, grouperPathText, globalData, access_token,
      formattedCommonCallLists, loggedInUserInfo});
    }


  /**
  *
  * @desc - Get grouperPathText from adminData via profile constants
  * @param {Object} adminData -
  * @return {String} grouperPathText -
  *
  **/
    getGrouperPathText(adminData) {
        const permissions_text = userPermissionsConstants.view_permissions;
        const permissions = adminData.resourceMap[permissions_text];
        const grouperPathText = permissions.formattedGrouperPathTexts;

        return grouperPathText;
    }

  /**
  *
  * @desc - Get loggedInUserInfo without heavy adminDepartments
  * @param {Object} adminData -
  * @return {Object} loggedInUserInfo -
  *
  **/
    getLoggedInUserInfo(adminData = this.adminData) {
        let loggedInUserInfo = util.cloneObject(adminData);
        delete loggedInUserInfo.adminDepartments;
        return loggedInUserInfo;
    }

  /****************************************************************************
   *
   * Section that gets and formats Names for NameSearch at the top of Profile
   *
   ****************************************************************************/

  /**
   *
   * @desc - Reformats the data from Profile API to array of objects
   *  with specific data
   * @param {Object} suggestions -
   * @return {Array} - array of objects with names, labels, and opusPersonIds
   *
   **/
    formatNameSearchSuggestions(suggestions = [], {additionalNameKey = "label"} = {}) {
        return suggestions.map(({fullName: name, opusPersonId: id, uid, contactValue, opusStatus}) => {
            let uid_str = uid ? ", "+uid : "";
            let contactValue_str = contactValue ? ", "+contactValue : "";
            let opusStatus_str = opusStatus ? " - "+opusStatus : "";
            return {name, [additionalNameKey]: name+uid_str+contactValue_str+opusStatus_str, value: name, uid};
        });
    }

  /**
  *
  * @desc - gets formatted url with proper args for name search
  * @param {String} name -
  * @param {String} - access_token, grouperPathText
  * @return {String} - url string
  *
  **/
    getNameOptionsUrl = (name, {access_token, grouperPathText} = this) => {
        let pageName = "permissions";
        let nameUrl = urlConfig.searchProfileNamesUrl({name, access_token,
      grouperPathText, pageName});
        nameUrl = encodeURI(nameUrl);
        return nameUrl;
    }

  /**
  *
  * @desc - gets raw API results from nameSearch
  * @param {String} name - string to search for
  * @return {Array} - API results
  *
  **/
    getNameOptionsFromSearch = async (name) => {
        let nameUrl = this.getNameOptionsUrl(name);
        return await util.fetchJson(nameUrl);
    }

  /**
  *
  * @desc - gets raw API results from nameSearch
  * @param {String} name - string to search for
  * @return {Array} - API results
  *
  **/
    getFormattedNameSearchOptions = async (name) => {
        let results = await this.getNameOptionsFromSearch(name);
        return this.formatNameSearchSuggestions(results);
    }

  /****************************************************************************
   *
   * Section that gets and formats Names for NameSearch at the top of Profile
   *
   ****************************************************************************/

  /**
   *
   * @desc - Reformats the data from Roles API to array of objects
   *  with specific data
   * @param {Object} suggestions -
   * @return {Array} - array of objects with names, labels, and opusPersonIds
   *
   **/
    formatRoleSearchSuggestions(suggestions = [], {additionalNameKey = "label"} = {}) {
        return suggestions.map(({roleName: id, roleDisplayName: displayName}) => {
            return {displayName, [additionalNameKey]: displayName, value: displayName, id};
        });
    }


  /**
  *
  * @desc - gets formatted url with proper args for name search
  * @param {String} searchString - string to search for
  * @param {String} typeOfReq - string to type of request
  * @param {String} - access_token, grouperPathText
  * @return {String} - url string
  *
  **/
    getRoleOptionsUrl = (searchString, typeOfReq, {access_token, grouperPathText} = this) => {
        let roleSearchUrl = urlConfig.searchRoleNameUrl({grouperPathText, searchString, typeOfReq, access_token});
        roleSearchUrl = encodeURI(roleSearchUrl);
        return roleSearchUrl;
    }

  /**
  *
  * @desc - gets raw API results from roleSearch
  * @param {String} searchString - string to search for
  * @param {String} typeOfReq - string to type of request
  * @return {Array} - API results
  *
  **/
    getRoleOptionsFromSearch = async (searchString, typeOfReq) => {
        let roleSearchUrl = this.getRoleOptionsUrl(searchString, typeOfReq);
        return await util.fetchJson(roleSearchUrl);
    }

  /**
  *
  * @desc - gets raw API results from roleSearch
  * @param {String} searchString - string to search for
  * @param {String} typeOfReq - string to search for
  * @return {Array} - API results
  *
  **/
    getFormattedRoleSearchOptions = async (searchString, typeOfReq) => {
        let validNameString = searchString.replace(/[#{?\\]/g, "");
        if(validNameString !== "") {
            let results = await this.getRoleOptionsFromSearch(validNameString, typeOfReq);
            return this.formatRoleSearchSuggestions(results);
        } else {
            console.log("invalid search");
        }
    }

  /**
   *
   * @desc - Reformats the data from Roles API to array of objects
   *  with specific data
   * @param {Object} suggestions -
   * @return {Array} - array of objects with names, labels, and opusPersonIds
   *
   **/
    formatCommitteeSearchSuggestions(suggestions = [], {additionalNameKey = "label"} = {}) {
        return suggestions.map(({committeeId: id, committeeName: displayName}) => {
            return {displayName, [additionalNameKey]: displayName, value: displayName, id};
        });
    }


  /**
  *
  * @desc - gets formatted url with proper args for name search
  * @param {String} searchString - string to search for
  * @param {String} typeOfReq - string to type of request
  * @param {String} - access_token, grouperPathText
  * @return {String} - url string
  *
  **/
    getCommitteeOptionsUrl = (bycUnitId, {access_token, grouperPathText} = this) => {
        let committeeSearchUrl = urlConfig.searchCommitteesByBycUnitUrl({bycUnitId, access_token});
        committeeSearchUrl = encodeURI(committeeSearchUrl);
        return committeeSearchUrl;
    }

  /**
  *
  * @desc - gets raw API results from roleSearch
  * @param {String} searchString - string to search for
  * @param {String} typeOfReq - string to type of request
  * @return {Array} - API results
  *
  **/
    getCommitteeOptionsFromSearch = async (bycUnitId) => {
        let committeeSearchUrl = this.getCommitteeOptionsUrl(bycUnitId);
        return await util.fetchJson(committeeSearchUrl);
    }

  /**
  *
  * @desc - gets raw API results from roleSearch
  * @param {String} searchString - string to search for
  * @param {String} typeOfReq - string to search for
  * @return {Array} - API results
  *
  **/
    getFormattedCommitteeSearchOptions = async (bycUnitId) => {
        let results = await this.getCommitteeOptionsFromSearch(bycUnitId);
        return this.formatCommitteeSearchSuggestions(results);
    }


  /**
  *
  * @desc - gets profile data
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    getUserPermissionsByOpusIdUrl(opusPersonId, {access_token} = this) {
        return urlConfig.getUserPermissionsByOpusIdUrl({opusPersonId, access_token});
    }

  /**
  *
  * @desc - save role to db
  * @param {Object} - opusPersonId
  * @param {Object} - typeOfReq
  * @param {Object} - roleId
  * @param {Object} - roleName
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    addRoleToDB = async (opusPersonId, typeOfReq, roleId, roleName, committeeId, isCommitteeManager, access_token) => {
        let url = urlConfig.addRoleToDbUrl({opusPersonId, typeOfReq, roleId, roleName, committeeId, isCommitteeManager, access_token});
        console.log(url);
        return util.postJson(url);
    }

  /**
  *
  * @desc - remove role to db
  * @param {Object} - opusPersonId
  * @param {Object} - typeOfReq
  * @param {Object} - roleName
  * @param {Object} - committeeId
  * @param {Object} - committeeMembershipId
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    removeRoleFromDB = async (opusPersonId, typeOfReq, roleName, roleId, committeeId, committeeMembershipId, bycUserId, access_token) => {
        let url = urlConfig.removeRoleToDbUrl({opusPersonId, typeOfReq, roleName, roleId, committeeId, committeeMembershipId, bycUserId, access_token});
        return util.postJson(url);
    }

  /**
  * @desc - gets profile data
  * @param {Object} opusPersonId -
  * @return {Promise} -
  *
  **/
    getUserPermissionsByOpusId(opusPersonId) {
        let url = this.getUserPermissionsByOpusIdUrl(opusPersonId);
        return util.fetchJson(url);
    }


  /**
  *
  * @desc - Tells if profileAPIData has at least one appointment
  * @param {Object} permissionsByUserAPIData - api data from backend
  * @return {Bool} hasAppointments - tells if it has appointments or not
  *
  **/
    hasUserRoles(permissionsByUserAPIData) {
        let userRolesMap = permissionsByUserAPIData.userRolesMap || [];
        let hasUserRoles = !!userRolesMap.length;
        return hasUserRoles;
    }

  /**
  *
  * @desc - If action in resourceMap has view profile equaling "view"
  * @param {Object} adminData -
  * @return {Object} -
  *
  **/
    getCanViewUserPermissions(adminData = this.adminData) {
        let {resourceMap: {profile = {}}} = adminData;
        return profile.action === "view";
    }


  /**
  *
  * @desc - Tells if permissionsByUserAPIData has a valid opusPersonId
  * @param {Object} permissionsByUserAPIData - api data from backend
  * @return {Bool} hasOpusPersonId - tells if there is a valid number for opusPersonId
  *
  **/
    hasOpusPersonId(permissionsByUserAPIData) {
        let appointeeInfo = permissionsByUserAPIData.appointeeInfo || {};
        let hasOpusPersonId = !!appointeeInfo.opusPersonId;
        return hasOpusPersonId;
    }

  /** Permissison By Unit Logic Area **/

  /**
  * @desc - gets unit hierarchy data
  * @return {Promise} -
  *
  **/
    getUserUnitHierarchy(unitId) {
        let url = this.getUserUnitHierarchyUrl(unitId);
        // console.log(url);
        return util.fetchJson(url);
    }

  /**
  *
  * @desc - gets unit hierarchy data
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    getUserUnitHierarchyUrl(unitId, {access_token, grouperPathText} = this) {
        let userHierarchyUrl = urlConfig.getUnitHierarchyUrl({unitId, grouperPathText, access_token});
        userHierarchyUrl = encodeURI(userHierarchyUrl);
        return userHierarchyUrl;
    }

  /**
  * @desc - gets unit hierarchy data
  * @return {Promise} -
  *
  **/
    getLogInUserUnitHierarchy() {
        let url = this.getLogInUserUnitHierarchyUrl();
        // console.log(url);
        return util.fetchJson(url);
    }

  /**
  *
  * @desc - gets logged in user unit hierarchy data
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    getLogInUserUnitHierarchyUrl({access_token, grouperPathText, loggedInUserInfo} = this) {
    // let roles = loggedInUserInfo.adminRoles;
        let completePathRoles = loggedInUserInfo.adminRolesFullPath;
    // let role = roles.toString();
        let role = completePathRoles.toString();
        // console.log(role);
    // console.log(completePathRole);
        let loggedInUserHierarchyUrl = urlConfig.getLoggedInUserUnitHierarchyUrl({grouperPathText, role, access_token});
        loggedInUserHierarchyUrl = encodeURI(loggedInUserHierarchyUrl);
        return loggedInUserHierarchyUrl;
    }

  /**
  * @desc - gets unit hierarchy data
  * @return {Promise} -
  *
  **/
    getUserRolesForUnit(unitId) {
        let url = this.getUserRolesForUnitUrl(unitId);
        return util.fetchJson(url);
    }

  /**
  *
  * @desc - gets unit hierarchy data
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    getUserRolesForUnitUrl(unitId, {access_token} = this) {
        let userRolesUrl = urlConfig.getUserRolesForUnitUrl({unitId, access_token});
        userRolesUrl = encodeURI(userRolesUrl);
        return userRolesUrl;
    }
 }
