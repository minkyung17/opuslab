import {caseFlowStore as store} from '../stores';
import * as actions from '../actions/CaseFlowActions';

/**
 *
 * @desc - Dispatch Methods specifically for CaseFlow
 * @param {Object} dispatch - the dispatch for actions
 * @return {Object} - an object of dispatch functions
 *
 **/
export const caseFlowDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setSelectedPersonInGlobalState: (person)=>{
      dispatch(actions.onSetSelectedPersonInGlobalState(person));
    },
    setSelectedUIDPersonInGlobalState: (person)=>{
      dispatch(actions.onSetSelectedUIDPersonInGlobalState(person));
    },
    chooseSaveTypeInGlobalState: (saveType) =>{
      dispatch(actions.onChooseSaveTypeInGlobalState(saveType));
    },
    setPreviousModalofOtherModalInGlobalState: (modalToPreviousModal = {})=>{
      dispatch(actions.onSetPreviousModalofOtherModalInGlobalState(modalToPreviousModal));
    },
    setAppointmentDirectionsInGlobalState(apptDirections = {}) {
      dispatch(actions.onSetAppointmentDirectionsInGlobalState(apptDirections));
    },
    changeCurrentModalInGlobalState: (currentModal)=>{
      dispatch(actions.onChangeCurrentModalInGlobalState(currentModal));
    },
    setSelectedAppointmentInGlobalState: (selectedAppointment)=>{
      dispatch(actions.onSetSelectedAppointmentInGlobalState(selectedAppointment));
    },
    changeCurrentModalWithSelectedActionTypeInGlobalState: (currentModal, selectedAction)=>{
      //special action dispatched only for this modal
      dispatch(actions.onSetSelectedActionTypeInGlobalState(selectedAction));
      dispatch(actions.onChangeCurrentModalInGlobalState(currentModal));
    },
    changeCurrentModalWithSelectedApptInGlobalState: (currentModal, selectedAppointment)=>{
      dispatch(actions.onChangeCurrentModalInGlobalState(currentModal));
      dispatch(actions.onSetSelectedAppointmentInGlobalState(selectedAppointment));
    },
    setNextModalInGlobalState: (nextModal)=>{
      dispatch(actions.onChangeToNextModalInGlobalState(nextModal));
    },
    setDataInGlobalState: (data)=>{
      dispatch(actions.onSetDataInGlobalState(data));
    },
    mergeRecruitTypeInGlobalState: (mergeOpusIdFlag)=>{
      dispatch(actions.onMergeRecruitTypeInGlobalState(mergeOpusIdFlag));
    },
    setSelectedRowListInGlobalState: (selectedRowList)=>{
      dispatch(actions.onSetSelectedRowListInGlobalState(selectedRowList));
    }
  };
};

/**
 *
 * @desc - All Redux State Variables for CaseFlow
 * @param {Object} state - slices of state. Here its caseFlow
 * @return {Object} - state variables to be mapped to props
 *
 **/
export let caseFlowMapStateToProps = function (state) {
  let {onSetCaseFlowDataInGlobalState, onCaseFlowModalOperationsInGlobalState} = state;
  let {selectedPerson, selectedUIDPerson, selectedActionType, selectedAppointment = [],
    currentModal, nameSearchText, previousModals, appointmentDirections, saveType,
    caseCreatedPromise, mergeOpusIdFlag, mergeOpusId, selectedRowList} =
    onCaseFlowModalOperationsInGlobalState;
  let {titleCodesMapList, actionTypes, actionList, formattedLists}
      = onSetCaseFlowDataInGlobalState;

  return { //actionTypes, actionList, titleCodesMapList,
    selectedUIDPerson, selectedActionType, appointmentDirections, selectedPerson,
    selectedAppointment, currentModal, nameSearchText, formattedLists,
    previousModals, saveType, caseCreatedPromise, mergeOpusIdFlag, mergeOpusId,
    selectedRowList, ...onSetCaseFlowDataInGlobalState, ...onCaseFlowModalOperationsInGlobalState};
};
