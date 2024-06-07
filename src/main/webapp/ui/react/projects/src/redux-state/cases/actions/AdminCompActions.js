

export const ADMIN_COMP_SUMMARY_API_DATA = 'ADMIN_COMP_SUMMARY_API_DATA';
export function onSetAdminCompSummaryDataInGlobalState(data) {
  return {
    type: ADMIN_COMP_SUMMARY_API_DATA,
    data
  };
}

