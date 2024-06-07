

export const ENDOWED_CHAIR_SUMMARY_API_DATA = 'ENDOWED_CHAIR_SUMMARY_API_DATA';
export function onSetEndowedChairSummaryDataInGlobalState(data) {
  return {
    type: ENDOWED_CHAIR_SUMMARY_API_DATA,
    data
  };
}

