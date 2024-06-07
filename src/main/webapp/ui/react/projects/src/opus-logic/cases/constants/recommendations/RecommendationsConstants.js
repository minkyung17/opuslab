
export const recommendationFields = {

};

let committeeMemberTemplate = {
  appointmentInfo: null,
  caseId: null,
  commentsText: null,
  committeeMemberFinalRoleId: null,
  committeeMemberProposedRoleId: null,
  committeeTypeId: null,
  delete: 'N',
  loggedInUserInfo: {
    adminName: null
  },
  name: null
};

export let templates = {
  committeeMemberTemplate
};

export const urls = {
  addMemberUrl: ({access_token}) =>
    `/restServices/rest/activecase/updateReviewCommittee?access_token=${access_token}`,
  updateCaseUrl: ({access_token}) =>
    `/restServices/rest/activecase/saveCaseRecommendation?access_token=${access_token}`,
  getCaseRecommendationSummary: ({access_token}) =>
    `/restServices/rest/activecase/getRecommendationSummary?access_token=${access_token}`,
  nameSearch: ({access_token}) =>
    `/restServices/rest/activecase/getCommitteeMembersResultset?access_token=${access_token}`
};
