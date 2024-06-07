import {assert} from 'chai';

import * as actions from '../../../../redux-state/cases/actions/CaseSummaryActions';


describe('CaseSummaryActions actions', () => {
  let testOpusPersonId = 50294;
  let testAppointment = {dummyKey: 'dummyValue'};

  /**
   *
   * @desc - Getting data appointment data from server
   * @param {Function} done -
   *
   **/
  beforeAll(async (done) => {
    done();
  });

  it(`"onSetCaseSummaryDataInGlobalState" returns an action(i.e. object)
    w/ 'type' & 'data'`, () => {
    let {type, data} = actions.onSetCaseSummaryDataInGlobalState(testAppointment);
    assert.equal(type, actions.CASE_SUMMARY_API_DATA);
    assert.equal(data, testAppointment);
  });


  it(`"onSetRecommendationsDataInGlobalState" returns an action(i.e. object)
    with 'type' and 'data'`, () => {
    let {type, data} = actions.onSetCaseRecommendationsDataInGlobalState(testOpusPersonId);
    assert.equal(type, actions.CASE_RECOMMENDATIONS_API_DATA);
    assert.equal(data, testOpusPersonId);
  });

  it(`"onSetReviewProcessDataInGlobalState" returns an action(i.e. object) with
    'type' and 'data'`, () => {
    let {type, data} = actions.onSetReviewProcessDataInGlobalState(testAppointment);
    assert.equal(type, actions.REVIEW_PROCESS_API_DATA);
    assert.equal(data, testAppointment);
  });
});
