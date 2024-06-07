export const urlConfig = {

    getUserPermissionsByOpusIdUrl: ({opusPersonId, access_token}) => {
        return `/restServices/rest/permissions/user/${opusPersonId}/?access_token=${access_token}`;
    },

    searchProfileNamesUrl: ({name, grouperPathText, pageName, access_token}) =>
    `/restServices/rest/profile/search/${name}/${grouperPathText}/${pageName}/?` +
    `access_token=${access_token}`,

    searchRoleNameUrl: ({grouperPathText, searchString, typeOfReq, access_token}) =>
      `/restServices/rest/permissions/search/${grouperPathText}/${searchString}/${typeOfReq}/?` +
      `access_token=${access_token}`,

    searchCommitteesByBycUnitUrl: ({bycUnitId, access_token}) =>
      `/restServices/rest/permissions/search/committees/${bycUnitId}/?access_token=${access_token}`,

    addRoleToDbUrl: ({opusPersonId, typeOfReq, roleId, roleName, committeeId, isCommitteeManager, access_token}) =>
      `/restServices/rest/permissions/user/addRole/${opusPersonId}/${typeOfReq}/${roleId}/${roleName}/${committeeId}/${isCommitteeManager}/?access_token=${access_token}`,

    removeRoleToDbUrl: ({opusPersonId, typeOfReq, roleName, roleId,
    committeeId, committeeMembershipId, bycUserId, access_token}) =>
      `/restServices/rest/permissions/user/removeRole/${opusPersonId}/${typeOfReq}/${roleName}/${roleId}/${committeeId}/${committeeMembershipId}/${bycUserId}/?access_token=${access_token}`,

    getLoggedInUserInfoUrl: (access_token) =>
    `/restServices/rest/access/getAdminData?access_token=${access_token}`,

    getUnitHierarchyUrl: ({unitId, grouperPathText, access_token}) =>
      `/restServices/rest/permissions/unit/${grouperPathText}/${unitId}/?access_token=${access_token}`,

    getLoggedInUserUnitHierarchyUrl: ({grouperPathText, role, access_token}) =>
      `/restServices/rest/permissions/loggedInUserUnits/${grouperPathText}/${role}/?access_token=${access_token}`,


    getUserRolesForUnitUrl: ({unitId, access_token}) =>
      `/restServices/rest/permissions/userUnit/${unitId}/?access_token=${access_token}`
};

export const userPermissionsConstants = {
    view_permissions: "profile"
};
