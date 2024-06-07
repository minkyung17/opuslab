import {assert} from 'chai';

import * as testHelpers from '../../../../test-utility/helpers';
import Appointment from '../../../../../opus-logic/cases/classes/caseflow/Appointment';
import * as ActionCategoryType from '../../../../../opus-logic/cases/constants/ActionCategoryType';


describe('Appointment Logic Class in CaseFlow', () => {
  //let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;
  let searchString = 'cuff';
  let apiCacheName = 'caseFlowAppointmentResults';
  let selectedActionType = '3-4';//Change of Department
  let selectedAppointment = null;
  let selectedPerson = null;

  /**
   *
   * @desc - Lets get access token and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();

    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    Logic = new Appointment({globalData, adminData, access_token});

    done();
  });

  it('setAppointmentData()', () => {
    let appointmentInfo = [{school: 'UCLA'}];
    let appointmentSetList = [{group: 'Opus'}];
    let actionTypes = {'3-1': 'Appointment', '2-9': 'Promotion'};
    let selectedAction = '2-9';
    let person = {appointmentInfo, appointmentSetList};

    Logic.setAppointmentData({appointmentInfo, appointmentSetList, actionTypes,
      selectedActionType: selectedAction, person});

    assert.equal(Logic.selectedActionType, selectedAction);
    assert.equal(Logic.person, person);
    assert.equal(Logic.actionTypes, actionTypes);
    assert.equal(Logic.appointmentInfo, appointmentInfo);
    assert.equal(Logic.appointmentSetList, appointmentSetList);
  });

  it('getAppointmentById()', () => {
    let appt = {key: 'value'};
    Logic.apptData = {10: appt};

    let retrieved = Logic.getAppointmentById(10);
    assert.equal(appt, retrieved);
  });

  it('checkExcludeAddlAppts() ensures filtered appointments are all "Primary"', () => {
    let appointments = [{affiliationType: {affiliation: 'Primary'}},
    {affiliationType: {affiliation: 'Primary'}},
    {affiliationType: {affiliation: 'Additional'}}];

    let filtered = Logic.checkExcludeAddlAppts(appointments);

    for(let each of filtered) {
      assert.equal(each.affiliationType.affiliation, 'Primary');
    }

    assert.equal(filtered.length, 2);
  });

  it('getValidStatusForApptSetFromTitleCode()', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '1-10', isValidForAppointmentSet: 'Y'},
      {code: '2-9', isValidForAppointmentSet: 'N'},
      {code: '3-2', isValidForAppointmentSet: 'N'}
    ]};
    let valid = Logic.getValidStatusForApptSetFromTitleCode(actionTypesByTitleCode,
      '001100', '1-10');
    assert.equal(valid, 'Y');

    valid = Logic.getValidStatusForApptSetFromTitleCode(actionTypesByTitleCode,
      '001100', '2-9');
    assert.equal(valid, 'N');

    valid = Logic.getValidStatusForApptSetFromTitleCode(actionTypesByTitleCode,
      '001100', '3-2');
    assert.equal(valid, 'N');
  });

  it('setApptInfoById()', () => {
    let apptSetId = 'apptSetId';
    let firstAppt = {appointmentId: 1};
    let secondAppt = {appointmentId: 2};
    let appointmentInfo = [firstAppt, secondAppt];
    let apptSet = [{appointmentId: 3}, {appointmentId: 4}];

    let apptData = Logic.setApptInfoById(appointmentInfo, apptSet, apptSetId);

    assert.equal(firstAppt, apptData[1][0]);
    assert.equal(secondAppt, apptData[2][0]);
    assert.equal(apptSet, apptData[apptSetId]);
  });

  it('setApptInfoById() defaults appointmentSetId', () => {
    let firstAppt = {appointmentId: 1};
    let secondAppt = {appointmentId: 2};
    let appointmentInfo = [firstAppt, secondAppt];
    let apptSet = [{appointmentId: 3}, {appointmentId: 4}];

    let apptData = Logic.setApptInfoById(appointmentInfo, apptSet);

    assert.equal(firstAppt, apptData[1][0]);
    assert.equal(secondAppt, apptData[2][0]);
    assert.equal(apptSet, apptData.apptSet);
  });

  it('filterAppointmentSet() returns true since both appointments in appointmentSet'
  + 'have all the prereqs for passing the test', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '1-10', isValidForAppointmentSet: 'Y'},
      {code: '2-9', isValidForAppointmentSet: 'N'},
      {code: '3-2', isValidForAppointmentSet: 'N'}
    ]};

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}},

      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}}];
    let actionType = '1-10';

    let validApptSets = Logic.filterAppointmentSet(apptSet, actionType,
      actionTypesByTitleCode);

    assert.equal(apptSet, validApptSets);
  });

  it('filterAppointmentSet() returns true even if one appointment in appointmentSet'
  + 'is not in the same ahPath', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '1-10', isValidForAppointmentSet: 'Y'},
      {code: '2-9', isValidForAppointmentSet: 'N'},
      {code: '3-2', isValidForAppointmentSet: 'N'}
    ]};

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}},

      //Second appt
      {appointmentId: 4, sameAHPathAsUser: false, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}}];
    let actionType = '1-10';

    let validApptSets = Logic.filterAppointmentSet(apptSet, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validApptSets, apptSet);
  });

  it('filterAppointmentSet() returns true even if one appointment in appointmentSet'
  + 'is not Primary', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '1-10', isValidForAppointmentSet: 'Y'},
      {code: '2-9', isValidForAppointmentSet: 'N'},
      {code: '3-2', isValidForAppointmentSet: 'N'}
    ]};

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}},

      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001100'}}];
    let actionType = '1-10';

    let validApptSets = Logic.filterAppointmentSet(apptSet, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validApptSets, apptSet);
  });

  it('filterAppointmentSet() returns true even if one appointment in appointmentSet'
  + 'has a titleCode-actionType combo where "isValidForAppointmentSet" !== Y""',
  () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '1-10', isValidForAppointmentSet: 'Y'}],
      '001200': [{code: '1-10', isValidForAppointmentSet: 'N'}]
    };

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}},
      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001200'}}];
    let actionType = '1-10';

    let validApptSets = Logic.filterAppointmentSet(apptSet, actionType,
      actionTypesByTitleCode);

    assert.equal(validApptSets, apptSet);
  });

  it('filterAppointmentSet() returns false since no appointments are valid',
  () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '1-10', isValidForAppointmentSet: 'Y'}],
      '001200': [{code: '1-10', isValidForAppointmentSet: 'N'}]
    };

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001200'}},
      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001200'}}];
    let actionType = '1-10';

    let validApptSets = Logic.filterAppointmentSet(apptSet, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validApptSets, []);
  });

  it('filterSingleAppointments() returns both appointments sinve theyre all valid',
  () => {
    let actionTypesByTitleCode = {
      '001100': [{code: '1-10', isValidForArchivedAppts: 'Y'}],
      '001200': [{code: '1-10', isValidForArchivedAppts: 'Y'}]
    };

    let firstAppt = {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt = {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001200'}};
    let appointmentInfo = [firstAppt, secondAppt];
    let actionType = '1-10';

    let validAppts = Logic.filterSingleAppointments(appointmentInfo, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validAppts, appointmentInfo);
  });


  it('filterSingleAppointments() returns no appointments since there is an invalid'
  + ' actionType', () => {
    let actionTypesByTitleCode = {
      '001100': [{code: '1-10', isValidForArchivedAppts: 'Y'}],
      '001200': [{code: '1-10', isValidForArchivedAppts: 'Y'}]
    };

    let firstAppt = {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt = {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001200'}};
    let appointmentInfo = [firstAppt, secondAppt];
    let actionType = '2-10';

    let validAppts = Logic.filterSingleAppointments(appointmentInfo, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validAppts, []);
  });

  it('filterSingleAppointments() returns first appointment which is valid for '
  + 'archive while the second is not valid and is "archived"', () => {
    let actionTypesByTitleCode = {
      '001100': [{code: '1-10', isValidForArchivedAppts: 'Y'}],
      '001200': [{code: '1-10', isValidForArchivedAppts: 'N'}]
    };

    let firstAppt = {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt = {appointmentId: 4, appointmentStatusType: 'archived',
      sameAHPathAsUser: true, affiliationType: {affiliation: 'Additional'},
      titleInformation: {titleCode: '001200'}};
    let appointmentInfo = [firstAppt, secondAppt];
    let actionType = '1-10';

    let validAppts = Logic.filterSingleAppointments(appointmentInfo, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validAppts, [firstAppt]);
  });


  it('filterSingleAppointments() returns both appointments since first is valid'
  + ' for archived and second is not but its "appointmentStatusType" is not archived',
  () => {
    let actionTypesByTitleCode = {
      '001100': [{code: '1-10', isValidForArchivedAppts: 'Y'}],
      '001200': [{code: '1-10', isValidForArchivedAppts: 'N'}]
    };

    let firstAppt = {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt = {appointmentId: 4, titleInformation: {titleCode: '001200'},
      sameAHPathAsUser: true, affiliationType: {affiliation: 'Additional'}};
    let appointmentInfo = [firstAppt, secondAppt];
    let actionType = '1-10';

    let validAppts = Logic.filterSingleAppointments(appointmentInfo, actionType,
      actionTypesByTitleCode);

    assert.deepEqual(validAppts, appointmentInfo);
  });

  it('filterViewableAppointments() Joint and Split. Returns all single appointments'
  + 'since its an "excludeAddlAppts" which doesnt check for sameAHPathAsUser.  Appointment'
  + 'Sets are automatically returned'
  + '', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '3-2', isValidForAppointmentSet: 'Y', isValidForArchivedAppts: 'Y'}
    ]};

    let firstAppt =
      {appointmentId: 1, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt =
      {appointmentId: 2, sameAHPathAsUser: false, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001100'}};
    let apptInfo = [firstAppt, secondAppt];

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}},

      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}}
    ];
    let actionType = ActionCategoryType.JOINT_APPOINTMENT;

    let {appointmentInfo, appointmentSetList} = Logic.filterViewableAppointments(
      apptInfo, apptSet, actionType, actionTypesByTitleCode);

    assert.deepEqual(appointmentInfo, [firstAppt, secondAppt]);
    assert.deepEqual(appointmentSetList, apptSet);
  });


  it('filterViewableAppointments() Appointment and Recall are "non-filtered". '
  + ' Single Appointments must be primary.  AppointmentSets are automatically '
  + ' returned', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '3-2', isValidForAppointmentSet: 'Y', isValidForArchivedAppts: 'Y'}
    ]};

    let firstAppt =
      {appointmentId: 1, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt =
      {appointmentId: 2, sameAHPathAsUser: false, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001100'}};
    let apptInfo = [firstAppt, secondAppt];

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Primary'}, titleInformation: {titleCode: '001100'}},

      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}}
    ];
    let actionType = ActionCategoryType.RECALL;

    let {appointmentInfo, appointmentSetList} = Logic.filterViewableAppointments(
      apptInfo, apptSet, actionType, actionTypesByTitleCode);

    assert.deepEqual(appointmentInfo, [firstAppt]);
    assert.deepEqual(apptSet, appointmentSetList);
  });

  it('filterViewableAppointments() Appointment and Recall are "non-filtered". '
  + ' Single Appointments must be primary.  AppointmentSets are not returned '
  + ' unless at least once is "Primary"', () => {
    let actionTypesByTitleCode = { '001100': [
      {code: '2-9', isValidForAppointmentSet: 'Y', isValidForArchivedAppts: 'Y'}
    ]};

    let firstAppt =
      {appointmentId: 1, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Primary'}, titleInformation: {titleCode: '001100'}};
    let secondAppt =
      {appointmentId: 2, sameAHPathAsUser: false, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001100'}};
    let apptInfo = [firstAppt, secondAppt];

    let apptSet = [
      //First appointment
      {appointmentId: 3, sameAHPathAsUser: true,
      affiliationType: {affiliation: 'Additional'}, titleInformation: {titleCode: '001100'}},

      //Second appt
      {appointmentId: 4, sameAHPathAsUser: true, affiliationType: {affiliation:
        'Additional'}, titleInformation: {titleCode: '001100'}}
    ];
    let actionType = ActionCategoryType.PROMOTION;

    let {appointmentInfo, appointmentSetList} = Logic.filterViewableAppointments(
      apptInfo, apptSet, actionType, actionTypesByTitleCode);

    assert.deepEqual(appointmentInfo, [firstAppt]);
    assert.deepEqual(appointmentSetList, []);
  });

  it('saveApptDataToClass()', () => {
    let appData = {some: 'object'};
    Logic.saveApptDataToClass(appData);

    assert.equal(appData, Logic.apptData);
  });

  it('formatAndFilterAppointments() executing to ensure theres no error. Functions'
  + ' here tested everywhere else so testing it correctly returns keys', () => {
    let appointmentSetList = [];
    let appointmentInfo = [];
    let actionType = '3-2';
    let actionTypes = {};

    let filtered = Logic.formatAndFilterAppointments({appointmentSetList, actionType,
      appointmentInfo, actionTypes
    });

    assert.containsAllKeys(filtered, ['filteredAppointmentInfo', 'filteredAppointmentSetList',
      'apptSetFields', 'singleApptFields']);
    //tested by filterViewableAppointments
    //tested by setApptInfoById
    //tested by saveApptDataToClass
    //tested by getDisplayFieldsFromAppointments
  });

  it('getModalInstructionText() returns message for new appointment', () => {
    let instructions = Logic.getModalInstructionText([], []);

    assert.equal(instructions, `We can't start this case because all of
    the appointments for this person have ended. If you feel this is
    an error, contact UCLA Opus Support at opushelp@ucla.edu.`);
  });
});
