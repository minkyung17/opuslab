
const urls = {
    getEndowedChairSummary: "/restServices/rest/ec/getEndowedChair?access_token=",
    newEndowedChairObjectUrl: '/restServices/rest/ec/newEndowedChair',
    saveUrl: "/restServices/rest/ec/saveEndowedChairDetail",
    addEndowedChairCommentsURL: "/restServices/rest/ec/saveEndowedChairComments",
    getEndowedChairCommentsURL: ({primaryKeyValue, access_token}) =>
   `/restServices/rest/ec/getEndowedChairComments?endowedChairId=${primaryKeyValue}&access_token=${access_token}`
};

export const editEndowedChairConstants = {
    name: "endowed_chair_edit",
    action: "edit"
};

export let constants = {
    urls
};

export const endowedChairConstants = {
    view_permissions: 'profile'
  };
export const endowedChairValidationFields = ["endowedChairName", "completeUnitName", "organizationName", "endowedChairStatus", "endowedChairType"];

export const endowedChairHoldersValidationFields = ["endowedChairAppointmentStatusId", "effectiveDate"];

export const modalErrorMessage = "Sorry, there was a problem. Please check the form for errors.";
