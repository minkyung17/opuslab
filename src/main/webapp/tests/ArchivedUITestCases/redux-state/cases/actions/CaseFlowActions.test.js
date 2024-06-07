import {assert} from 'chai';

import * as actions from '../../../../redux-state/cases/actions/CaseFlowActions';


describe('CaseFlowActions action creators', () => {
  let testOpusPersonId = 50294;
  let testObject = {dummyKey: 'dummyValue'};
  let testModal = 'ACTION_TYPE';

  it('"onSetPreviousModalofOtherModalInGlobalState"', () => {
    let data = actions.onSetPreviousModalofOtherModalInGlobalState(testModal);
    let {type, modalToPreviousModal} = data;
    assert.equal(type, actions.CHOOSE_PREVIOUS_MODAL);
    assert.equal(testModal, modalToPreviousModal);
  });

  it('"onSetAppointmentDirectionsInGlobalState"', () => {
    let data = actions.onSetAppointmentDirectionsInGlobalState(testObject);
    let {type, directions} = data;
    assert.equal(type, actions.GET_APPOINTMENT_DIRECTIONS);
    assert.equal(testObject, directions);
  });

  it('"onSetDataInGlobalState"', () => {
    let {type, data} = actions.onSetDataInGlobalState(testObject);
    assert.equal(type, actions.GLOBAL_OBJECTS);
    assert.equal(testObject, data);
  });

  it('"onChangeActionTypeInGlobalState"', () => {
    let {type, value} = actions.onChangeActionTypeInGlobalState(testObject);
    assert.equal(type, actions.CHANGE_ACTION_DROPDOWN);
    assert.equal(testObject, value);
  });

  it('"onChangeCurrentModalInGlobalState"', () => {
    let {type, currentModal} = actions.onChangeCurrentModalInGlobalState(testObject);
    assert.equal(type, actions.CURRENT_MODAL);
    assert.equal(testObject, currentModal);
  });

  it('"onMergeRecruitTypeInGlobalState"', () => {
    let {type, mergeOpusIdFlag} = actions.onMergeRecruitTypeInGlobalState(testObject);
    assert.equal(type, actions.RECRUIT_MERGE);
    assert.equal(testObject, mergeOpusIdFlag);
  });

  it('"onChangeNameSearchTextInGlobalState"', () => {
    let {type, name} = actions.onChangeNameSearchTextInGlobalState(testObject);
    assert.equal(type, actions.NAME_SEARCH_TEXT);
    assert.equal(testObject, name);
  });

  it('"onSetSelectedPersonInGlobalState"', () => {
    let {type, person} = actions.onSetSelectedPersonInGlobalState(testObject);
    assert.equal(type, actions.SELECTED_PERSON);
    assert.equal(testObject, person);
  });

  it('"onSetSelectedUIDPersonInGlobalState"', () => {
    let {type, person} = actions.onSetSelectedUIDPersonInGlobalState(testObject);
    assert.equal(type, actions.SELECTED_UID_PERSON);
    assert.equal(testObject, person);
  });

  it('"onChangeActionListInGlobalState"', () => {
    let {type, actionList} = actions.onChangeActionListInGlobalState(testObject);
    assert.equal(type, actions.ACTION_LIST);
    assert.equal(testObject, actionList);
  });

  it('"onSetSelectedActionTypeInGlobalState"', () => {
    let {type, selectedActionType} = actions.onSetSelectedActionTypeInGlobalState(testObject);
    assert.equal(type, actions.SELECTED_ACTION);
    assert.equal(testObject, selectedActionType);
  });

  it('"onSetSelectedAppointmentInGlobalState"', () => {
    let {type, selectedAppointment} = actions.onSetSelectedAppointmentInGlobalState(testObject);
    assert.equal(type, actions.SELECTED_APPOINTMENT);
    assert.equal(testObject, selectedAppointment);
  });

  it('"onChangeToNextModalInGlobalState"', () => {
    let {type, modal_name} = actions.onChangeToNextModalInGlobalState(testObject);
    assert.equal(type, actions.CHANGE_TO_NEXT_MODAL);
    assert.equal(testObject, modal_name);
  });

  it('"onChooseSaveTypeInGlobalState"', () => {
    let {type, saveType} = actions.onChooseSaveTypeInGlobalState(testObject);
    assert.equal(type, actions.CHOOSE_SAVE_TYPE);
    assert.equal(testObject, saveType);
  });

  it('"onSetSelectedRowListInGlobalState"', () => {
    let {type, selectedRowList} = actions.onSetSelectedRowListInGlobalState(testObject);
    assert.equal(type, actions.SELECTED_ROW_LIST);
    assert.equal(testObject, selectedRowList);
  });


});
