
export const CHOOSE_PREVIOUS_MODAL = 'CHOOSE_PREVIOUS_MODAL';
export function onSetPreviousModalofOtherModalInGlobalState(modalToPreviousModal = {}) {
  return {
    type: CHOOSE_PREVIOUS_MODAL,
    modalToPreviousModal
  };
}

export const GET_APPOINTMENT_DIRECTIONS = 'GET_APPOINTMENT_DIRECTIONS';
export function onSetAppointmentDirectionsInGlobalState(directions = {}) {
  return {
    type: GET_APPOINTMENT_DIRECTIONS,
    directions
  };
}


export const GLOBAL_OBJECTS = 'GLOBAL_OBJECTS';
export function onSetDataInGlobalState(data) {
  return {
    type: GLOBAL_OBJECTS,
    data
  };
}

export const CHANGE_ACTION_DROPDOWN = 'CHANGE_ACTION_DROPDOWN';
export function onChangeActionTypeInGlobalState(value) {
  return {
    type: CHANGE_ACTION_DROPDOWN,
    value
  };
}

export const CURRENT_MODAL = 'CURRENT_MODAL';
export function onChangeCurrentModalInGlobalState(currentModal) {
  return {
    type: CURRENT_MODAL,
    currentModal
  };
}

export const RECRUIT_MERGE = 'RECRUIT_MERGE';
export function onMergeRecruitTypeInGlobalState(mergeOpusIdFlag) {
  return {
    type: RECRUIT_MERGE,
    mergeOpusIdFlag
  };
}

export const NAME_SEARCH_TEXT = 'NAME_SEARCH_TEXT';
export function onChangeNameSearchTextInGlobalState(name) {
  return {
    type: NAME_SEARCH_TEXT,
    name
  };
}

export const SELECTED_PERSON = 'SELECTED_PERSON';
export function onSetSelectedPersonInGlobalState(person) {
  return {
    type: SELECTED_PERSON,
    person
  };
}

export const SELECTED_UID_PERSON = 'SELECTED_UID_PERSON';
export function onSetSelectedUIDPersonInGlobalState(person) {
  return {
    type: SELECTED_UID_PERSON,
    person
  };
}

export const ACTION_LIST = 'ACTION_LIST';
export function onChangeActionListInGlobalState(actionList) {
  return {
    type: ACTION_LIST,
    actionList
  };
}

export const SELECTED_ACTION = 'SELECTED_ACTION';
export function onSetSelectedActionTypeInGlobalState(selectedActionType) {
  return {
    type: SELECTED_ACTION,
    selectedActionType
  };
}

export const SELECTED_APPOINTMENT = 'SELECTED_APPOINTMENT';
export function onSetSelectedAppointmentInGlobalState(selectedAppointment) {
  return {
    type: SELECTED_APPOINTMENT,
    selectedAppointment
  };
}

export const CHANGE_TO_NEXT_MODAL = 'CHANGE_TO_NEXT_MODAL';
export function onChangeToNextModalInGlobalState(modal_name) {
  return {
    type: CHANGE_TO_NEXT_MODAL,
    modal_name
  };
}

export const CHOOSE_SAVE_TYPE = 'CHOOSE_SAVE_TYPE';
export function onChooseSaveTypeInGlobalState(saveType) {
  return {
    type: CHOOSE_SAVE_TYPE,
    saveType
  };
}

export const SELECTED_ROW_LIST = 'SELECTED_ROW_LIST';
export function onSetSelectedRowListInGlobalState(selectedRowList) {
  return {
    type: SELECTED_ROW_LIST,
    selectedRowList
  };
}
