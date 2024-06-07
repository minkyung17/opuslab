

export const CASE_SUMMARY_API_DATA = 'CASE_SUMMARY_API_DATA';
export function onSetCaseSummaryDataInGlobalState(data) {
  return {
    type: CASE_SUMMARY_API_DATA,
    data
  };
}

export const CASE_RECOMMENDATIONS_API_DATA = 'CASE_RECOMMENDATIONS_API_DATA';
export function onSetCaseRecommendationsDataInGlobalState(data) {
  return {
    type: CASE_RECOMMENDATIONS_API_DATA,
    data
  };
}

export const REVIEW_PROCESS_API_DATA = 'REVIEW_PROCESS_API_DATA';
export function onSetReviewProcessDataInGlobalState(data) {
  return {
    type: REVIEW_PROCESS_API_DATA,
    data
  };
}
