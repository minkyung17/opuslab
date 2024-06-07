import {assert} from 'chai';

import {initialStateProfile as initialState, onSetProfileDataInGlobalState}
  from '../../../../redux-state/cases/reducers/ProfileReducers';




describe('ProfileReducers', () => {

  describe('"onSetProfileDataInGlobalState"', () => {

    it('"SET_DELETE_APPOINTMENT_PROMISE reducer"', () => {
      let deleteAppointmentPromise = {some: 'data'};
      let action = {type: 'SET_DELETE_APPOINTMENT_PROMISE', deleteAppointmentPromise};
      let reducer = onSetProfileDataInGlobalState(initialState, action);

      assert.deepEqual(reducer, {...initialState, deleteAppointmentPromise});
    });

    it('"RELOAD_API_DATA reducer"', () => {
      let reloadProfileDataFromAPI = {some: 'data'};
      let action = {type: 'RELOAD_API_DATA', reloadProfileDataFromAPI};
      let reducer = onSetProfileDataInGlobalState(initialState, action);

      assert.deepEqual(reducer, {...initialState, reloadProfileDataFromAPI});
    });

    it('"SET_PROFILE_API_DATA reducer"', () => {
      let profileAPIData = {some: 'data'};
      let action = {type: 'SET_PROFILE_API_DATA', profileAPIData};
      let reducer = onSetProfileDataInGlobalState(initialState, action);

      assert.deepEqual(reducer, {...initialState, profileAPIData});
    });

    it('"default"', () => {
      let action = {type: ''};
      let reducer = onSetProfileDataInGlobalState(initialState, action);

      let newState = initialState;

      assert.deepEqual(reducer, newState);
    });
  });
});
