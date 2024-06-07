import moment from "moment";

const urls = {
    getAdminCompSummary: "/restServices/rest/admincomp/acProposalSummary?access_token=",
    saveProposedUrl: "/restServices/rest/admincomp/saveACProposalProposed",
    saveFinalDecisionUrl: "/restServices/rest/admincomp/saveACProposalApproved",
    getICLThresholdUrl: "/restServices/rest/admincomp/getICLThreshold",
    trackingUrl: "/restServices/rest/admincomp/saveACProposalTracking",
    getStipendHeadersUrl: "/restServices/rest/admincomp/getAllocatedStipend",
    getNinthsHeadersUrl: "/restServices/rest/admincomp/getAllocatedNinths",
    saveACProposalRevisionUrl: '/restServices/rest/admincomp/saveACProposalRevision',
    getAdminCompProposalCommentsURL: ({primaryKeyValue, secondaryKeyValue, access_token}) =>
   `/restServices/rest/admincomp/comments/${primaryKeyValue}/${secondaryKeyValue}/?access_token=${access_token}`,
    addAdminCompProposalCommentsURL: ({access_token}) =>
   `/restServices/rest/admincomp/comments/?access_token=${access_token}`
};

// Proposed Fields
const proposedValidationFields = ["academicYear", "typeOfApptId", "proposedEffectiveDT", "proposedEndDT", "unit", "proposedCourseReleases", "proposedCourseReleasesEstCost",
  "organizationName", "titleCodeId", "workingTitle", "multipleAdminApptsId", "proposedBaseSalary", "proposedStipendEVCP", "proposedStipendDean", "proposedStipendDept",
  "proposedNinthsEVCPAmount", "proposedNinthsDeanAmount", "proposedNinthsDeptAmount", "proposedFteEVCP", "proposedFteOther",];

const proposedEditFields = ["academicHierarchyPathId", "academicYear", "typeOfApptId", "proposedEffectiveDT", "proposedEndDT",
  "organizationName", "titleCodeId", "workingTitle", "justification", "multipleAdminApptsId", "proposedBaseSalary", "proposedNSTP", "proposedNinthsRate",
  "proposedCourseReleases", "proposedCourseReleasesEstCost", "comments"];

const proposedFteFields = ["proposedFteEVCP", "proposedFteOther"];

const proposedStipendFields = ["proposedStipendEVCP", "proposedStipendDean", "proposedStipendDept"];

const proposedNinthsFields = ["proposedNinthsEVCPAmount", "proposedNinthsDeanAmount", "proposedNinthsDeptAmount"];

// Final Decision Fields
const approvedValidationFields = ["outcomeId", "approvedEffectiveDT", "approvedEndDT", "approvedBaseSalary", "approvedCourseReleases", "approvedCourseReleasesEstCost", "approvedNinthsRate",
 "approvedStipendEVCP", "approvedStipendDean", "approvedStipendDept", "approvedNinthsEVCPAmount", "approvedNinthsDeanAmount", "approvedNinthsDeptAmount", "approvedFteEVCP", "approvedFteOther"];

const approvedEditFields = ["outcomeId", "approvedEffectiveDT", "approvedEndDT", "approvedBaseSalary", "approvedNSTP",
  "approvedNinthsRate", "approvedCourseReleases", "approvedCourseReleasesEstCost", "comments"];

const approvedFteFields = ["approvedFteEVCP", "approvedFteOther"];

const approvedStipendFields = ["approvedStipendEVCP", "approvedStipendDean", "approvedStipendDept"];

const approvedNinthsFields = ["approvedNinthsEVCP", "approvedNinthsEVCPAmount", "approvedNinthsDean", "approvedNinthsDeanAmount", "approvedNinthsDept", "approvedNinthsDeptAmount"];

// Tracking Date Fields
const trackingFields = ["adminCompProposalId", "completedById", "completedDT", "deanSubmissionById", "deanSubmissionDT", "evcpapprovedDT", "evcpapprovedById", "ucopapprovedDT", "ucopapprovedById"];

export let constants = {
    urls,
    proposedValidationFields,
    proposedEditFields,
    proposedFteFields,
    proposedStipendFields,
    proposedNinthsFields,
    approvedValidationFields,
    approvedEditFields,
    approvedFteFields,
    approvedStipendFields,
    approvedNinthsFields,
    trackingFields,
    errorMessage: "This cannot be blank on save.",
    modalErrorMessage: "Sorry, there was a problem. Please check the form for errors.",
    ninthsOtherFieldErrorMessage: "Both the name and 9ths amount fields must be completed on save.",
    stipendOtherFieldErrorMessage: "Both the name and amount fields must be completed on save.",
    trackingSearchErrorMessage: "No matching records found."
};

export const saveOptions = {
    urlEncodedHeaders: {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
};

export const viewAdminCompProposalConstants = {
    name: "admin_comp_proposals_view",
    action: "view"
};

export const editAdminCompProposalConstants = {
    name: "admin_comp_proposals_edit_proposal",
    action: "edit"
};

export const editAdminCompFinalDecisionConstants = {
    name: "admin_comp_proposals_edit_finaldecision",
    action: "edit"
};
