import {assert} from 'chai';

import * as testHelpers from '../../../../test-utility/helpers';
import ActionType from '../../../../../opus-logic/cases/classes/caseflow/ActionType';
import {notInAHPathActions} from
  '../../../../../opus-logic/cases/constants/caseflow/ActionTypeConstants';

describe('ActionType Logic Class in CaseFlow', () => {
  //let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;

  let actionType = '3-1';

  // replicateSingleAppointment: { '3-2': 'Joint Appointment', '3-3': 'Split Appointment'},
  // bypassForNewApptActionTypes: {'3-1': 'Appointment', '3-32': 'Recall Appointment'},
  // proposedFieldsPreviousSectionByActionType: {
  //   '3-1': caseFlowSectionNames.newAppointment,
  //   '3-32': caseFlowSectionNames.actionType
  // }

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
    Logic = new ActionType({globalData, adminData, access_token});

    done();
  });

  it('ensures access_token & adminData are in Logic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(Logic, keys);
  });

  //Tested in super class
  it('setClassData()', () => {});

  //Tested in super class
  it('getClassData()', () => {});

  it('ActionType.code_text static variable = "code"', () => {
    assert.equal(ActionType.code_text, 'code');
  });

  it('ActionType.action_type_display_key = "actionTypeDisplayText"', () => {
    assert.equal(ActionType.action_type_display_key, 'actionTypeDisplayText');
  });

  it('getAppointmentTypeFromActionType() get directions for Appointment and Recall '
   + ' for "bypassForNewApptActionTypes" actionTypes', () => {
    let bypassForNewApptActionTypes = {'3-1': 'Appointment',
      '3-32': 'Recall Appointment'};

    //Assert the directions are correct
    for(let selectedAction in bypassForNewApptActionTypes) {
      let directions = Logic.getAppointmentTypeFromActionType(selectedAction);

      assert.isTrue(directions.pseudoNewAppointment);
      assert.isFalse(directions.replicateSingleAppointment);
      assert.notExists(directions.getAppointmentAHPaths);
    }
  });

  it('getCaseFlowPath() test actionType in "bypassForNewApptActionTypes"',
  () => {
    let actionTypes = {'3-1': 'Joint Appointment', '3-32': 'Recall'};
    for(let selectedAction in actionTypes) {
      let {pseudoNewAppointment, replicateSingleAppointment} =
        Logic.getCaseFlowPath(selectedAction);
      assert.isTrue(pseudoNewAppointment);
      assert.isFalse(replicateSingleAppointment);
    }
  });

  it('getCaseFlowPath() test actionType in "replicateSingleAppointment"',
  () => {
    let actionTypes = {'3-2': 'Joint Appointment', '3-3': 'Split Appointment'};
    for(let selectedAction in actionTypes) {
      let {pseudoNewAppointment, replicateSingleAppointment, getAppointmentAHPaths} =
        Logic.getCaseFlowPath(selectedAction);
      assert.isFalse(pseudoNewAppointment);
      assert.isTrue(replicateSingleAppointment);
      assert.isTrue(getAppointmentAHPaths);
    }
  });

  it('getCaseFlowPath() actionType in "proposedFieldsPreviousSectionByActionType"',
  () => {
    let actionTypes = {'3-1': 'Appointment', '3-32': 'Recall Appointment'};
    let directions = Logic.getCaseFlowPath('3-1');

    assert.deepEqual(directions.previousSectionNameOfSection, {
      proposedFields: 'NEW_APPOINTMENT'});

    directions = Logic.getCaseFlowPath('3-32');
    assert.deepEqual(directions.previousSectionNameOfSection, {
      proposedFields: 'ACTION_TYPE'});
  });


  it('getAppointmentTypeFromActionType() gets previous modal of proposedFields'
  + ' for actionTypes of "Appointment" and "Recall Appointment"', () => {
    let replicateSingleApptActionTypes = {'3-3': 'Split Appointment'};

    //Assert the directions are correct
    for(let selectedAction in replicateSingleApptActionTypes) {
      let directions = Logic.getAppointmentTypeFromActionType(selectedAction);

      assert.isFalse(directions.pseudoNewAppointment);
      assert.isTrue(directions.replicateSingleAppointment);
      assert.isTrue(directions.getAppointmentAHPaths);
    }
  });


  it('getAppointmentTypeFromActionType() gets previous modal of proposedFields'
  + ' for actionTypes of "Recall Appointment"', () => {
    let proposedFieldsPreviousSectionByActionType = {'3-2': 'Joint Appointment'};

    //Assert the directions are correct
    for(let selectedAction in proposedFieldsPreviousSectionByActionType) {
      let directions = Logic.getAppointmentTypeFromActionType(selectedAction);

      assert.isFalse(directions.pseudoNewAppointment);
      assert.isTrue(directions.replicateSingleAppointment);
      assert.isTrue(directions.getAppointmentAHPaths);
    }
  });

  it('getIsValidForCaseActionTypesByTitleCodeInAppointment()', () => {
    let appointment = {sameAHPathAsUser: true, titleInformation: {titleCode: '001100'}};
    let actionTypes = {'001100': [{code: '3-1', isValidForCase: 'Y'},
      {code: '3-32', isValidForCase: 'Y'}, {code: '3-10', isValidForCase: 'N'}]};

    let filteredActionTypes = Logic.getIsValidForCaseActionTypesByTitleCodeInAppointment(
      appointment, actionTypes);

    assert.deepEqual(filteredActionTypes, [{code: '3-1', isValidForCase: 'Y'},
      {code: '3-32', isValidForCase: 'Y'}]);
  });

  it('getIsValidForCaseActionTypesByTitleCodeInAppointment()', () => {
    let appointment = {sameAHPathAsUser: false, titleInformation: {titleCode: '001100'}};
    let actionTypes = {'001100': [{code: '3-1', isValidForCase: 'Y'},
      {code: '3-32', isValidForCase: 'Y'}, {code: '3-10', isValidForCase: 'N'}]};

    let filteredActionTypes = Logic.getIsValidForCaseActionTypesByTitleCodeInAppointment(
      appointment, actionTypes);

    assert.deepEqual(filteredActionTypes, notInAHPathActions);
  });

  it('determineActionTypes() returns all action types once(no duplicates)', () => {
    let appointment = [
      {sameAHPathAsUser: true, titleInformation: {titleCode: '001100'}},
      {sameAHPathAsUser: true, titleInformation: {titleCode: '001200'}}
    ];
    let actionTypes = {'001100': [{code: '3-1', isValidForCase: 'Y'},
      {code: '3-32', isValidForCase: 'Y'}], '001200': [{code: '3-1',
      isValidForCase: 'Y'}, {code: '3-10', isValidForCase: 'Y'}]};

    let filteredActionTypes = Logic.determineActionTypes(appointment, actionTypes);

    assert.deepEqual(filteredActionTypes, [{code: '3-1', isValidForCase: 'Y'},
      {code: '3-32', isValidForCase: 'Y'}, {code: '3-10',
      isValidForCase: 'Y'}]);
  });

  it('determineSortedActionTypes() returns all action types once(no duplicates) '
  + 'and sorts them by actionTypeDisplayText', () => {
    let appointment = [
      {sameAHPathAsUser: true, titleInformation: {titleCode: '001100'}},
      {sameAHPathAsUser: true, titleInformation: {titleCode: '001200'}}
    ];
    let actionTypes = {'001100': [{code: '3-1', isValidForCase: 'Y',
      actionTypeDisplayText: 'CCC'}, {code: '3-32', isValidForCase: 'Y',
      actionTypeDisplayText: 'AAA'}], '001200': [{code: '3-1', actionTypeDisplayText:
      'CCC', isValidForCase: 'Y'}, {code: '3-10', isValidForCase: 'Y',
      actionTypeDisplayText: 'BBB'}]};

    let filteredActionTypes = Logic.determineSortedActionTypes(appointment,
      actionTypes);

    assert.deepEqual(filteredActionTypes, [{code: '3-32', isValidForCase: 'Y',
    actionTypeDisplayText: 'AAA'}, {code: '3-10', actionTypeDisplayText: 'BBB',
    isValidForCase: 'Y'}, {code: '3-1', isValidForCase: 'Y',
      actionTypeDisplayText: 'CCC'}]);
  });
});
