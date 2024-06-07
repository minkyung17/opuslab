import {assert} from 'chai';

import Permissions from '../../../../opus-logic/common/modules/Permissions';

describe('Permission Logic Class', () => {
  let PermissionsLogic = new Permissions();
  let roles = ['isAPO', 'isOA', 'isDA', 'isSA', 'isLibrarySA', 'isCAP', 'isVCAP'];

  function resetPermissions(PermissionsInstance) {
    for(let role of roles) {
      PermissionsInstance[role] = null;
    }
  }

  it('"setAdminData" correctly sets adminData', () => {
    let mockAdminData = {adminRoles: ['apo_director']};
    PermissionsLogic.setAdminData(mockAdminData);

    assert.equal(PermissionsLogic.adminData, mockAdminData);
  });

  it('"processAdminData" correctly sets "isAPO"', () => {
    let mockAdminData = {adminRoles: ['apo_director']};
    assert.isFalse(PermissionsLogic.isAPO);

    PermissionsLogic.processAdminData(mockAdminData);

    assert.isTrue(PermissionsLogic.isAPO);
  });

  it('"processAdminData" correctly sets "isAPO" "isOA"', () => {
    let mockAdminData = {adminRoles: ['opus_admin']};
    assert.isFalse(PermissionsLogic.isOA);

    PermissionsLogic.processAdminData(mockAdminData);

    assert.isTrue(PermissionsLogic.isOA);
  });

  it('"processAdminData" correctly sets isSA"', () => {
    let mockAdminData = {adminRoles: ['random_sch_admin']};
    assert.isFalse(PermissionsLogic.isSA);

    PermissionsLogic.processAdminData(mockAdminData);

    assert.isTrue(PermissionsLogic.isSA);
  });

  it('"processAdminData" correctly sets isLibrarySA"', () => {
    let mockAdminData = {adminRoles: ['library_sch_admin']};
    assert.isFalse(PermissionsLogic.isLibrarySA);

    PermissionsLogic.processAdminData(mockAdminData);

    assert.isTrue(PermissionsLogic.isLibrarySA);
  });

  it('"processAdminData" correctly sets "isDA"', () => {
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    assert.isFalse(PermissionsLogic.isDA);

    PermissionsLogic.processAdminData(mockAdminData);

    assert.isTrue(PermissionsLogic.isDA);
  });

  it('"getRolesFromAdminRolesArray" sets isAPO correctly', () => {
    //Reset all permissions
    resetPermissions(PermissionsLogic);

    let mockAdminData = {adminRoles: ['apo_director']};
    assert.notExists(PermissionsLogic.isAPO);
    PermissionsLogic.getRolesFromAdminRolesArray(mockAdminData);
    assert.isTrue(PermissionsLogic.isAPO);
  });

  it('"getRolesFromAdminRolesArray"  sets isOA correctly', () => {
    //Reset all permissions
    resetPermissions(PermissionsLogic);

    let mockAdminData = {adminRoles: ['opus_admin']};
    assert.notExists(PermissionsLogic.isOA);
    PermissionsLogic.getRolesFromAdminRolesArray(mockAdminData);
    assert.isTrue(PermissionsLogic.isOA);
  });

  it('"getIsSchoolAdministrator" returns false for _dept_admin', () => {
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    let isSchAdmin = PermissionsLogic.getIsSchoolAdministrator(mockAdminData);
    assert.isFalse(isSchAdmin);
  });

  it('"getIsSchoolAdministrator" returns true for _sch_admin', () => {
    let mockAdminData = {adminRoles: ['random_sch_admin']};
    let isSchAdmin = PermissionsLogic.getIsSchoolAdministrator(mockAdminData);
    assert.isTrue(isSchAdmin);
  });


  it('"setIsSchoolAdministrator" sets isSA as false', () => {
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    assert.notExists(PermissionsLogic.isSA);

    PermissionsLogic.setIsSchoolAdministrator(mockAdminData);

    assert.isFalse(PermissionsLogic.isSA);
  });

  it('"setIsSchoolAdministrator" sets isSA as true', () => {
    resetPermissions(PermissionsLogic);

    let mockAdminData = {adminRoles: ['random_sch_admin']};
    assert.notExists(PermissionsLogic.isSA);

    PermissionsLogic.setIsSchoolAdministrator(mockAdminData);

    assert.isTrue(PermissionsLogic.isSA);
  });


  it('"getIsDepartmentAdministrator" returns false for _sch_admin', () => {
    let mockAdminData = {adminRoles: ['random_sch_admin']};
    let isDeptAdmin = PermissionsLogic.getIsDepartmentAdministrator(mockAdminData);
    assert.isFalse(isDeptAdmin);
  });

  it('"getIsDepartmentAdministrator" returns true for _dept_admin', () => {
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    let isDeptAdmin = PermissionsLogic.getIsDepartmentAdministrator(mockAdminData);
    assert.isTrue(isDeptAdmin);
  });

  it('"setIsDepartmentAdministrator" sets isDA as false', () => {
    let mockAdminData = {adminRoles: ['random_sch_admin']};
    PermissionsLogic.setIsDepartmentAdministrator(mockAdminData);
    assert.isFalse(PermissionsLogic.isDA);
  });

  it('"setIsDepartmentAdministrator" sets isDA as true', () => {
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    PermissionsLogic.setIsDepartmentAdministrator(mockAdminData);
    assert.isTrue(PermissionsLogic.isDA);
  });

  it('"isOAOrAPO"', () => {
    let identity = PermissionsLogic.isOAOrAPO();

    let {isOA, isAPO} = PermissionsLogic;

    assert.equal(identity, isOA || isAPO);
  });
});
