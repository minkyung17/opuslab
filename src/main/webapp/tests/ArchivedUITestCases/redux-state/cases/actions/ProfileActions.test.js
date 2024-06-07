import {assert} from 'chai';

import * as actions from '../../../../redux-state/cases/actions/ProfileActions';


describe('ProfileActions actions', () => {
  let testOpusPersonId = 50294;
  let testData = {dummyKey: 'dummyValue'};

  it('"onSetReloadSignalInGlobalState" returns correct action', () => {
    let data = actions.onSetReloadSignalInGlobalState(testData);
    let {type, reloadProfileDataFromAPI} = data;
    assert.equal(type, actions.RELOAD_API_DATA);
    assert.equal(testData, reloadProfileDataFromAPI);
  });

  it('"onSetPersonProfileApiDataInGlobalState" returns correct action', () => {
    let data = actions.onSetPersonProfileApiDataInGlobalState(testData);
    let {type, profileAPIData} = data;
    assert.equal(type, actions.SET_PROFILE_API_DATA);
    assert.equal(testData, profileAPIData);
  });

  it('"onSetDeleteAppointmentPromiseInGlobalState" returns correct action', () => {
    let data = actions.onSetDeleteAppointmentPromiseInGlobalState(testData);
    let {type, deleteAppointmentPromise} = data;
    assert.equal(type, actions.SET_DELETE_APPOINTMENT_PROMISE);
    assert.equal(testData, deleteAppointmentPromise);
  });
});
