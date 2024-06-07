import {assert} from 'chai';

import {initialState, onSetCaseFlowDataInGlobalState, onCaseFlowModalOperationsInGlobalState}
  from '../../../../redux-state/cases/reducers/CaseFlowReducers';




describe('CaseFlowReducers', () => {

  describe('"onSetCaseFlowDataInGlobalState"', () => {

    it('"GLOBAL_OBJECTS reducer"', () => {
      let data = {some: 'data'};
      let action = {type: 'GLOBAL_OBJECTS', data};
      let reducer = onSetCaseFlowDataInGlobalState(initialState, action);

      assert.deepEqual(reducer, {...initialState, ...data});
    });

    it('"default"', () => {
      let action = {type: ''};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = initialState;

      assert.deepEqual(reducer, newState);
    });
  });

  describe('"onCaseFlowModalOperationsInGlobalState"', () => {
    it('"CHOOSE_PREVIOUS_MODAL"', () => {
      let modalToPreviousModal = {some: 'data'};
      let action = {type: 'CHOOSE_PREVIOUS_MODAL', modalToPreviousModal};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        ...{
          previousModals: {
            ...initialState.previousModals,
            ...modalToPreviousModal
          }
        }
      };

      assert.deepEqual(reducer, newState);
    });

    it('"CHOOSE_SAVE_TYPE"', () => {
      let saveType = {some: 'data'};
      let action = {type: 'CHOOSE_SAVE_TYPE', saveType};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        saveType
      };

      assert.deepEqual(reducer, newState);
    });

    it('"RECRUIT_MERGE"', () => {
      let mergeOpusIdFlag = {some: 'data'};
      let action = {type: 'RECRUIT_MERGE', mergeOpusIdFlag};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        ...{
          mergeOpusIdFlag: action.mergeOpusIdFlag
        }
      };

      assert.deepEqual(reducer, newState);
    });

    it('"GET_APPOINTMENT_DIRECTIONS"', () => {
      let directions = {some: 'data'};
      let action = {type: 'GET_APPOINTMENT_DIRECTIONS', directions};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        ...{
          appointmentDirections: action.directions
        }
      };

      assert.deepEqual(reducer, newState);
    });

    it('"SELECTED_ACTION"', () => {
      let selectedActionType = {some: 'data'};
      let action = {type: 'SELECTED_ACTION', selectedActionType};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        selectedActionType: action.selectedActionType
      };

      assert.deepEqual(reducer, newState);
    });

    it('"SELECTED_APPOINTMENT"', () => {
      let selectedAppointment = {some: 'data'};
      let action = {type: 'SELECTED_APPOINTMENT', selectedAppointment};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        ...{
          selectedAppointment: action.selectedAppointment
        }
      };

      assert.deepEqual(reducer, newState);
    });

    it('"CURRENT_MODAL"', () => {
      let currentModal = {some: 'data'};
      let action = {type: 'CURRENT_MODAL', currentModal};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        currentModal: action.currentModal
      };

      assert.deepEqual(reducer, newState);
    });


    it('"ACTION_LIST"', () => {
      let actionList = {some: 'data'};
      let action = {type: 'ACTION_LIST', actionList};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        actionList: action.actionList
      };

      assert.deepEqual(reducer, newState);
    });

    it('"SELECTED_PERSON"', () => {
      let person = {some: 'data'};
      let action = {type: 'SELECTED_PERSON', person};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        selectedPerson: action.person
      };

      assert.deepEqual(reducer, newState);
    });

    it('"SELECTED_UID_PERSON"', () => {
      let person = {some: 'data'};
      let action = {type: 'SELECTED_UID_PERSON', person};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        selectedUIDPerson: action.person
      };

      assert.deepEqual(reducer, newState);
    });

    it('"SELECTED_ROW_LIST"', () => {
      let selectedRowList = {some: 'data'};
      let action = {type: 'SELECTED_ROW_LIST', selectedRowList};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = {
        ...initialState,
        ...{
          selectedRowList: action.selectedRowList
        }
      };

      assert.deepEqual(reducer, newState);
    });

    it('"default"', () => {
      let action = {type: ''};
      let reducer = onCaseFlowModalOperationsInGlobalState(initialState, action);

      let newState = initialState;

      assert.deepEqual(reducer, newState);
    });
  });
});
