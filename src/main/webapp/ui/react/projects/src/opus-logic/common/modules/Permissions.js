import Opus from "../classes/Opus";

/**
 *
 * @classdesc Takes care of all the Permissions. Given adminData it will automatically
 *   determine if isDA, APO, etc
 * @module OpusPermissions
 * @extends Opus
 *
 */
export default class OpusPermissions extends Opus {
    isDA = false;
    isSA = false;
    isLibrarySA = false; //Special exceptions for Library SA, BRule-119
    isOA = false;
    isAPO = false;
    isAPOAdmin = false;
    isCAP = false;
    isVCAP = false;
    isAA = false;
    isChair = false;
    isDean = false;
    isDivisionAdmin = false;
    isSpecAdmin = false;
    adminData = null;
    adminRoleNamesToRole = {
        apo_director: {
            isAPO: true
        },
        apo_staff: {
            isAPOAdmin: true
        },
        opus_admin: {
            isOA: true
        },
        library_sch_admin: {
            isLibrarySA: true
        },
        vc_ap: {
            isVCAP: true
        },
        cap_staff: {
            isCAP: true
        }
    }

  /**
  *
  * @desc - Processes permissions and roles
  * @param {Object} adminData - data with which to parse all permissions from
  * @return {void}
  *
  **/
    constructor(adminData) {
        super();
        this.setAdminData(adminData);
        this.processAdminData(adminData);
    }

  /**
  *
  * @desc - Set adminData
  * @param {Object} adminData - data with which to parse all permissions from
  * @return {void}
  *
  **/
    setAdminData(adminData) {
        if(adminData) {
            this.adminData = adminData;
        }
    }

  /**
  *
  * @desc - Set adminData
  * @param {Object} adminData - data with which to parse all permissions from
  * @return {void}
  *
  **/
    processAdminData(adminData) {
        if(!adminData) {
            return;
        }

        let {resourceMap, dashboardRole, adminRoles} = adminData;
        this.setClassData({resourceMap, dashboardRole, adminRoles});
        this.getRolesFromAdminRolesArray(adminData);
        this.setIsSchoolAdministrator(adminData);
        this.setIsDivisionAdministrator(adminData);
        this.setIsDepartmentAdministrator(adminData);
        this.setIsDeanAdministrator(adminData);
        this.setIsAreaAdministrator(adminData);
        this.setIsChair(adminData);
        this.setIsSpecialtyAdministrator(adminData);
    }

  /**
  *
  * @desc - Takes names from adminRoles and gets the correct roles from this
  *   class's adminRoleNamesToRole hash
  * @param {Object} adminData - data with which to parse all permissions from
  * @return {void}
  *
  **/
    getRolesFromAdminRolesArray(adminData = this.adminData) {
        let {adminRoles} = adminData;
        let {adminRoleNamesToRole} = this;

        for(let role of adminRoles) {
            if(role in adminRoleNamesToRole) {
                let roles = adminRoleNamesToRole[role];
                this.setClassData(roles);
            }
        }
    }


  /**
  *
  * @desc - Is it school administrator? Set if True when it ends _sch_admin
  * @param {Object} adminData -
  * @return {Boolean} - if school admin or not
  *
  **/
    getIsSchoolAdministrator(adminData) {
        let {adminRoles: roles} = adminData;
        let isSchAdmin = !!roles.filter(role => role.endsWith("_sch_admin")).length;

        return isSchAdmin;
    }

  /**
  *
  * @desc - Is it school administrator? Set if True when it ends _sch_admin
  * @param {Object} adminData -
  * @return {Boolean} - if school admin or not
  *
  **/
    setIsSchoolAdministrator(adminData) {
        this.isSA = this.getIsSchoolAdministrator(adminData);
    }

    /**
    *
    * @desc - Is it school administrator? Set if True when it ends _sch_admin
    * @param {Object} adminData -
    * @return {Boolean} - if school admin or not
    *
    **/
    getIsDivisionAdministrator(adminData) {
        let {adminRoles: roles} = adminData;
        let isDivAdmin = !!roles.filter(role => role.endsWith("_div_admin")).length;

        return isDivAdmin;
    }

    /**
    *
    * @desc - Is it school administrator? Set if True when it ends _sch_admin
    * @param {Object} adminData -
    * @return {Boolean} - if school admin or not
    *
    **/
    setIsDivisionAdministrator(adminData) {
        this.isDivisionAdmin = this.getIsDivisionAdministrator(adminData);
    }

  /**
  *
  * @desc - Is it department administrator? Set if True when it ends _dept_admin
  * @param {Object} adminData -
  * @return {Boolean} - if department admin or not
  *
  **/
    getIsDepartmentAdministrator(adminData) {
        let {adminRoles: roles} = adminData;
        let isDeptAdmin = !!roles.filter(role => role.endsWith("_dept_admin")).length;

        return isDeptAdmin;
    }

  /**
  *
  * @desc - Is it department administrator? Set if True when it ends
  *   _dept_admin
  * @param {Object} adminData -
  * @return {Boolean} - if department admin or not
  *
  **/
    setIsDepartmentAdministrator(adminData) {
        this.isDA = this.getIsDepartmentAdministrator(adminData);
    }

  /**
  *
  * @desc - Is it dean administrator? Set if True when it ends
  *   _dean
  * @param {Object} adminData -
  * @return {Boolean} - if dean admin or not
  *
  **/
    setIsDeanAdministrator(adminData) {
        this.isDean = this.getIsDeanAdministrator(adminData);
    }

  /**
  *
  * @desc - Is it dean administrator? Set if True when it ends _dean
  * @param {Object} adminData -
  * @return {Boolean} - if dean admin or not
  *
  **/
    getIsDeanAdministrator(adminData) {
        let {adminRoles: roles} = adminData;
        let isDean = !!roles.filter(role => role.endsWith("_dean")).length;

        return isDean;
    }

  /**
  *
  * @desc - Is it area administrator? Set if True when it ends _area_admin
  * @param {Object} adminData -
  * @return {Boolean} - if area admin or not
  *
  **/
    getIsAreaAdministrator(adminData) {
        let {adminRoles: roles} = adminData;
        let isAreaAdmin = !!roles.filter(role => role.endsWith("_area_admin")).length;

        return isAreaAdmin;
    }

  /**
  *
  * @desc - Is it area administrator? Set if True when it ends
  *   _area_admin
  * @param {Object} adminData -
  * @return {Boolean} - if area admin or not
  *
  **/
    setIsAreaAdministrator(adminData) {
        this.isAA = this.getIsAreaAdministrator(adminData);
    }

  /**
  *
  * @desc - Is it chair? Set if True when it ends _chair
  * @param {Object} adminData -
  * @return {Boolean} - if chair or not
  *
  **/
    getIsChair(adminData) {
        let {adminRoles: roles} = adminData;
        let isDeptAdmin = !!roles.filter(role => role.endsWith("_chair")).length;

        return isDeptAdmin;
    }

  /**
  *
  * @desc - Is it chair? Set if True when it ends _chair
  * @param {Object} adminData -
  * @return {Boolean} - if chair or not
  *
  **/
    setIsChair(adminData) {
        this.isChair = this.getIsChair(adminData);
    }
  /**
  *
  * @desc - Is it Specialty administrator? Set if True when it ends _spec_admin
  * @param {Object} adminData -
  * @return {Boolean} - if area admin or not
  *
  **/
    getIsSpecialtyAdministrator(adminData) {
        let {adminRoles: roles} = adminData;
        let isSpecAdmin = !!roles.filter(role => role.endsWith("_spec_admin")).length;

        return isSpecAdmin;
    }

  /**
  *
  * @desc - Is it Specialty administrator? Set if True when it ends
  *   _spec_admin
  * @param {Object} adminData -
  * @return {Boolean} - if area admin or not
  *
  **/
    setIsSpecialtyAdministrator(adminData) {
        this.isSpecAdmin = this.getIsSpecialtyAdministrator(adminData);
    }
  /**
  *
  * @desc - Is user in adminData is OA or APO
  * @return {Boolean} - isOA or APO
  *
  **/
    isOAOrAPO() {
        let {isOA, isAPO, isAPOAdmin} = this;

        return isOA || isAPO || isAPOAdmin;
    }
}
