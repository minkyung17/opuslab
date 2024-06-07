import {combineReducers} from 'redux';

export let initialState = {
  selectedPerson: {},
  selectedUIDPerson: {}, //used only for opusId merge
  nameResults: [],
  personResults: [],
  currentModal: null,
  previousModals: {},
  appointmentDirections: {},
  mergeOpusIdFlag: 'N', //used only for opusId merge
  caseId: '',
  caseCreated: false,
  nextModals: {},
  actionList: [],
  selectedAction: '',
  selectedAppointment: [],
  caseData: {},
  titleCodesMapList: {},
  actionTypes: {},
  pubOnScaleSalaries: {},
  actionOutcomes: {},
  commonTypeReferences: {},
  selectedRowList: {}
};


export function onSetCaseFlowDataInGlobalState(state = initialState, action) {
  switch (action.type) {
  case 'GLOBAL_OBJECTS':
    return {
      ...state,
      ...action.data
    };
  default:
    return state;
  }
}


export function onCaseFlowModalOperationsInGlobalState(state = initialState, action) {
  switch (action.type) {
  case 'CHOOSE_PREVIOUS_MODAL':
    return {
      ...state,
      ...{
        previousModals: {
          ...state.previousModals,
          ...action.modalToPreviousModal
        }
      }
    };
  case 'CHOOSE_SAVE_TYPE':
    return {
      ...state,
      saveType: action.saveType
    };
  case 'RECRUIT_MERGE':
    return {
      ...state,
      mergeOpusIdFlag: action.mergeOpusIdFlag
    };
  case 'GET_APPOINTMENT_DIRECTIONS':
    return {
      ...state,
      appointmentDirections: action.directions
    };
  case 'SELECTED_ACTION':
    return {
      ...state,
      selectedActionType: action.selectedActionType
    };
  case 'SELECTED_APPOINTMENT':
    return {
      ...state,
      selectedAppointment: action.selectedAppointment
    };
  case 'CHANGE_ACTION_DROPDOWN':
    return {
      ...state,
      ...{
        actionTypeSelected: action.value
      }
    };
  case 'CURRENT_MODAL':
    return {
      ...state,
      currentModal: action.currentModal
    };
  case 'ACTION_LIST':
    return {
      ...state,
      actionList: action.actionList
    };
  case 'SELECTED_PERSON':
    return {
      ...state,
      selectedPerson: action.person
    };
  case 'SELECTED_UID_PERSON':
    return {
      ...state,
      selectedUIDPerson: action.person
    };
  case 'SELECTED_ROW_LIST':
    return {
      ...state,
      ...{
        selectedRowList: action.selectedRowList
      }
    };
  default:
    return state;
  }
}

export const caseFlowReducer = combineReducers({
  onSetCaseFlowDataInGlobalState,
  onCaseFlowModalOperationsInGlobalState
});
