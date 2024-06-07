import {assert} from 'chai';

import Permissions from '../../../../opus-logic/common/modules/CasesAdminPermissions';

describe('CasesAdminPermissions Logic Class', () => {
  let PermissionsLogic = new Permissions();
  let roles = ['isAPO', 'isOA', 'isDA', 'isSA', 'isLibrarySA', 'isCAP', 'isVCAP'];

  function resetPermissions(PermissionsInstance) {
    for(let role of roles) {
      PermissionsInstance[role] = null;
    }
  }

  // These tests are already being tested in Permissions.js
  // You can uncomment these and test them but they are using the functions in Permissions.js
  // that are extended to CasesAdminPermissions

  // it('"setAdminData" correctly sets adminData', () => {
  //   let mockAdminData = {adminRoles: ['apo_director']};
  //   PermissionsLogic.setAdminData(mockAdminData);
  //
  //   assert.equal(PermissionsLogic.adminData, mockAdminData);
  // });
  //
  // it('"processAdminData" correctly sets "isAPO"', () => {
  //   let mockAdminData = {adminRoles: ['apo_director']};
  //   assert.isFalse(PermissionsLogic.isAPO);
  //
  //   PermissionsLogic.processAdminData(mockAdminData);
  //
  //   assert.isTrue(PermissionsLogic.isAPO);
  // });
  //
  // it('"processAdminData" correctly sets "isAPO" "isOA"', () => {
  //   let mockAdminData = {adminRoles: ['opus_admin']};
  //   assert.isFalse(PermissionsLogic.isOA);
  //
  //   PermissionsLogic.processAdminData(mockAdminData);
  //
  //   assert.isTrue(PermissionsLogic.isOA);
  // });
  //
  // it('"processAdminData" correctly sets isSA"', () => {
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   assert.isFalse(PermissionsLogic.isSA);
  //
  //   PermissionsLogic.processAdminData(mockAdminData);
  //
  //   assert.isTrue(PermissionsLogic.isSA);
  // });
  //
  // it('"processAdminData" correctly sets "isDA"', () => {
  //   let mockAdminData = {adminRoles: ['random_dept_admin']};
  //   assert.isFalse(PermissionsLogic.isDA);
  //
  //   PermissionsLogic.processAdminData(mockAdminData);
  //
  //   assert.isTrue(PermissionsLogic.isDA);
  // });
  //
  // it('"getRolesFromAdminRolesArray" sets isAPO correctly', () => {
  //   //Reset all permissions
  //   resetPermissions(PermissionsLogic);
  //
  //   let mockAdminData = {adminRoles: ['apo_director']};
  //   assert.notExists(PermissionsLogic.isAPO);
  //   PermissionsLogic.getRolesFromAdminRolesArray(mockAdminData);
  //   assert.isTrue(PermissionsLogic.isAPO);
  // });
  //
  // it('"getRolesFromAdminRolesArray"  sets isOA correctly', () => {
  //   //Reset all permissions
  //   resetPermissions(PermissionsLogic);
  //
  //   let mockAdminData = {adminRoles: ['opus_admin']};
  //   assert.notExists(PermissionsLogic.isOA);
  //   PermissionsLogic.getRolesFromAdminRolesArray(mockAdminData);
  //   assert.isTrue(PermissionsLogic.isOA);
  // });
  //
  // it('"getIsSchoolAdministrator" returns false for _dept_admin', () => {
  //   let mockAdminData = {adminRoles: ['random_dept_admin']};
  //   let isSchAdmin = PermissionsLogic.getIsSchoolAdministrator(mockAdminData);
  //   assert.isFalse(isSchAdmin);
  // });
  //
  // it('"getIsSchoolAdministrator" returns true for _sch_admin', () => {
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   let isSchAdmin = PermissionsLogic.getIsSchoolAdministrator(mockAdminData);
  //   assert.isTrue(isSchAdmin);
  // });
  //
  //
  // it('"setIsSchoolAdministrator" sets isSA as false', () => {
  //   let mockAdminData = {adminRoles: ['random_dept_admin']};
  //   assert.notExists(PermissionsLogic.isSA);
  //
  //   PermissionsLogic.setIsSchoolAdministrator(mockAdminData);
  //
  //   assert.isFalse(PermissionsLogic.isSA);
  // });
  //
  // it('"setIsSchoolAdministrator" sets isSA as true', () => {
  //   resetPermissions(PermissionsLogic);
  //
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   assert.notExists(PermissionsLogic.isSA);
  //
  //   PermissionsLogic.setIsSchoolAdministrator(mockAdminData);
  //
  //   assert.isTrue(PermissionsLogic.isSA);
  // });
  //
  //
  // it('"getIsDepartmentAdministrator" returns false for _sch_admin', () => {
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   let isDeptAdmin = PermissionsLogic.getIsDepartmentAdministrator(mockAdminData);
  //   assert.isFalse(isDeptAdmin);
  // });
  //
  // it('"getIsDepartmentAdministrator" returns true for _dept_admin', () => {
  //   let mockAdminData = {adminRoles: ['random_dept_admin']};
  //   let isDeptAdmin = PermissionsLogic.getIsDepartmentAdministrator(mockAdminData);
  //   assert.isTrue(isDeptAdmin);
  // });
  //
  // it('"setIsDepartmentAdministrator" sets isDA as false', () => {
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   PermissionsLogic.setIsDepartmentAdministrator(mockAdminData);
  //   assert.isFalse(PermissionsLogic.isDA);
  // });
  //
  // it('"setIsDepartmentAdministrator" sets isDA as true', () => {
  //   let mockAdminData = {adminRoles: ['random_dept_admin']};
  //   PermissionsLogic.setIsDepartmentAdministrator(mockAdminData);
  //   assert.isTrue(PermissionsLogic.isDA);
  // });
  //
  // it('"isOAOrAPO"', () => {
  //   let identity = PermissionsLogic.isOAOrAPO();
  //
  //   let {isOA, isAPO} = PermissionsLogic;
  //
  //   assert.equal(identity, isOA || isAPO);
  // });

  // getCaseButtonPermissions tests
  // return True means complete/reopen case button is hidden
  //
  it('"getCaseButtonPermissions" sets DA for Reappointments to return true', () => {
    resetPermissions(PermissionsLogic);
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "1",
        actionTypeId: "14"
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Visiting Scholar',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);

    assert.isTrue(permissions);
  });

  it('"getCaseButtonPermissions" sets DA for random action types to return true', () => {
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "3",
        actionTypeId: Math.floor((Math.random() * (34-1)+1))
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Visiting Scholar',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    // console.log(actionDataInfo.actionTypeInfo.actionTypeId)
    let mockAdminData = {adminRoles: ['random_dept_admin']};
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);
    assert.isTrue(permissions);
  });

  it('"getCaseButtonPermissions" sets SA for Appointment to return true', () => {
    resetPermissions(PermissionsLogic);
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "3",
        actionTypeId: "1"
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Professor',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    // console.log(actionDataInfo.actionTypeInfo.actionTypeId)
    let mockAdminData = {adminRoles: ['random_sch_admin']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);
    assert.isTrue(permissions);
  });

  // it('"getCaseButtonPermissions" sets SA for Promotion to return true', () => {
  //   let actionDataInfo = {
  //     actionTypeInfo: {
  //       actionCategoryId: "2",
  //       actionTypeId: "9"
  //     }
  //   }
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);
  //
  //   assert.isTrue(permissions);
  // });

  it('"getCaseButtonPermissions" sets SA for Change in Percent Time to return false', () => {
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "3",
        actionTypeId: "16"
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Visiting Scholar',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    let mockAdminData = {adminRoles: ['random_sch_admin']};
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);

    assert.isFalse(permissions);
  });

  // it('"getCaseButtonPermissions" sets SA for Reappointment to return false', () => {
  //   let actionDataInfo = {
  //     actionTypeInfo: {
  //       actionCategoryId: "1",
  //       actionTypeId: "14"
  //     }
  //   }
  //   let mockAdminData = {adminRoles: ['random_sch_admin']};
  //   let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);
  //
  //   assert.isFalse(permissions);
  // });

  it('"getCaseButtonPermissions" sets Library SA for Change in Percent Time to return true', () => {
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "2",
        actionTypeId: "7"
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Visiting Scholar',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    let mockAdminData = {adminRoles: ['library_sch_admin']};
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);

    assert.isTrue(permissions);
  });

  it('"getCaseButtonPermissions" sets OA for Reappointments to return false', () => {
    resetPermissions(PermissionsLogic);
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "1",
        actionTypeId: "14"
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Visiting Scholar',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    let mockAdminData = {adminRoles: ['opus_admin']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);

    assert.isFalse(permissions);
  });

  it('"getCaseButtonPermissions" sets APO for Reappointments to return false', () => {
    resetPermissions(PermissionsLogic);
    let actionDataInfo = {
      actionTypeInfo: {
        actionCategoryId: "1",
        actionTypeId: "14"
      },
      proposedAppointmentInfo: {
        titleInformation: {
          series: 'Visiting Scholar',
          rank: {
            rankTypeDisplayText: 'Full'
          }
        }
      }
    }
    let mockAdminData = {adminRoles: ['apo_director']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let permissions = PermissionsLogic.getCaseButtonPermissions(actionDataInfo, mockAdminData);

    assert.isFalse(permissions);
  });

  it(`Ensure closeableConditionallyBySeriesAndRank() correctly checks for SA
    permissions based upon series/rank`, () => {
    let appointmentAction = '3-1'; //Appointment
    let jointAction = '3-2'; //Joint
    let apuAction = '3-37'; //APU

    //Appointment tests
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Visiting Research', 'Full'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Visiting Project Scientist', 'Full'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Visiting Scholar', 'Full'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Clinical Volunteer', 'Full'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Professor', 'Full'), false);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Professor', 'Instructor'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Project Scientist', 'Assistant'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Project Scientist', 'Full'), false);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Specialist', 'Assistant'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Project Scientist', 'Full'), false);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Professor', 'Assistant'), false);

    //Invalid value tests
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      null, null), false);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      '', ''), false);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Visiting Research', null), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      'Visiting Research', ''), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      null, 'Instructor'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(appointmentAction,
      '', 'Instructor'), true);

    //Joint appointment tests
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(jointAction,
      'Professor', 'Assistant'), true);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(jointAction,
      'Professor', 'Full'), false);

    //APU (non series/rank action) tests
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(apuAction,
      'Project Scientist', 'Full'), false);
    assert.equal(PermissionsLogic.closeableConditionallyBySeriesAndRank(apuAction,
      'Visiting Research', 'Assistant'), false);
  });
});
