import {assert} from 'chai';

import {initialStateCaseSummary as initialState, onSetCaseSummaryDataInGlobalState}
  from '../../../../redux-state/cases/reducers/CaseSummaryReducers';




describe('CaseSummaryReducers', () => {

  describe('"onSetCaseSummaryDataInGlobalState"', () => {

    it('"CASE_SUMMARY_API_DATA reducer"', () => {
      let data = {some: 'data'};
      let action = {type: 'CASE_SUMMARY_API_DATA', data};
      let reducer = onSetCaseSummaryDataInGlobalState(initialState, action);

      assert.deepEqual(reducer, {...initialState, caseSummaryDataFromAPI: data});
    });

    it('"CASE_RECOMMENDATIONS_API_DATA reducer"', () => {
      let data = {some: 'data'};
      let action = {type: 'CASE_RECOMMENDATIONS_API_DATA', data};
      let reducer = onSetCaseSummaryDataInGlobalState(initialState, action);

      assert.deepEqual(reducer, {...initialState, caseRecommendationsAPIData: data});
    });

    it('"default"', () => {
      let action = {type: ''};
      let reducer = onSetCaseSummaryDataInGlobalState(initialState, action);

      let newState = initialState;

      assert.deepEqual(reducer, newState);
    });
  });
});
