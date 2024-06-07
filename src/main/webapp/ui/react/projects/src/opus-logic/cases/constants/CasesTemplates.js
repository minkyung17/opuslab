import moment from "moment";
//import {cloneObject} from '../../common/helpers/';

export let loggedInUserInfo = {
    adminName: "",
    adminFirstName: "",
    adminOpusId: null,
    adminRoles: [],
    adminEmail: "",
    adminUclaLogon: ""
};


export let opusCase = {
    isNewCase: "",
    isTrackingDatesChanged: "",
    isDeptDatesChanged: "",
    caseInitiatedDt: "",
    candidateToDepartmentSubmittedDt: "",
    deptChairAssignedDt: "",
    departmentToDeanSubmittedDt: "",
    deptChairApprovalDt: "",
    deanToAPOSubmittedDt: "",
    deanApprovalDt: "",
    aPOToCAPSubmittedDt: "",
    cAPApprovalDt: "",
    cAPToAPOSubmittedDt: "",
    aPOToVCAPSubmittedDt: "",
    vCAPApprovalDt: "",
    caseCompletedDt: "",
    caseId: null,
    academicHierarchyPathIds: "" //String which may be appended to another pathId,
  //comma delimited
};
export const caseFlowOpusCaseDefaults = {
    isNewCase: "Y",
    isTrackingDatesChanged: "Y",
    isDeptDatesChanged: "Y",
    caseInitiatedDt: moment().format("MM/DD/YYYY")
};
export const caseFlowAppointmentStatusData = {
    rowStatusId: 1,
    actionStatusId: 1,
    pageName: "active"
};

export const save = {
    "3-1": true, "3-2": true, "3-3": true, "3-4": true, "3-11": true, "3-32": true,
    "3-35": true
};

export let appointeeInfo = {
    opusPersonId: null,
    jobNumber: "",
    applicantId: null,
    mergeOpusIdFlag: "N",
    mergeOpusId: null
};

export let appointmentInfoTemplate = { //current appointment info
    opusPersonId: null,
    appointmentId: null,
    appointmentRowStatusId: null,
    appointmentPctTime: null,
    waiverEndDt: null,
    appointmentEndDt: "",
    comment: "",
    locationDisplayText1: null,
    locationDisplayText2: null,
    locationDisplayText3: null,
    locationDisplayText4: null,
    locationDisplayText5: null,
    locPercentTime1: null,
    locPercentTime2: null,
    locPercentTime3: null,
    locPercentTime4: null,
    locPercentTime5: null,
    locationId1: null,
    locationId2: null,
    locationId3: null,
    locationId4: null,
    locationId5: null,
    attributeProperties: {
        locationDisplayText1: {
            visibility: true,
            editable: false
        }
    },
    affiliationType: {
        affiliationTypeId: null
    },
    currentSalaryAmt: null,
    salaryInfo: {
        academicProgramUnit: {
            apuId: null,
            scaleTypeId: null
        }
    },
    academicHierarchyInfo: {
        academicHierarchyPathId: null,
        schoolName: null,
        departmentCode: "",
        locationId: null
    },
    titleInformation: {
        titleCodeId: null,
        rank: {},
        step: {
            stepTypeId: null
        }
    }
};

export let actionsData = {
    caseId: null,
    rowStatusId: null,
    actionStatusId: null,
    actionId: null,
    proposedEffectiveDt: "",
    proposedEndowedChairId: null,
    proposedTermEndDate: null,
    effectiveDt: "",
    approvedSeriesStartDt: "",
    pageName: "",
    userComments: "",
    approvedActionOutcome: {
        code: "",
        name: null
    },
    actionCompletedDt: "",
    actionCompletedAcademicYear: "",
    approvedEffectiveAcademicYear: "",
    proposedAppointmentInfo: {
        currentSalaryAmt: null,
        waiverEndDt: null,
        appointmentEndDt: "",
        locationDisplayText1: null,
        locationDisplayText2: null,
        locationDisplayText3: null,
        locationDisplayText4: null,
        locationDisplayText5: null,
        locPercentTime1: null,
        locPercentTime2: null,
        locPercentTime3: null,
        locPercentTime4: null,
        locPercentTime5: null,
        locationId1: null,
        locationId2: null,
        locationId3: null,
        locationId4: null,
        locationId5: null,
        academicHierarchyInfo: {
            academicHierarchyPathId: null,
            departmentCode: "",
            locationId: null
        },
        salaryInfo: {
            academicProgramUnit: {
                apuId: null,
                scaleTypeId: null
            }
        },
        titleInformation: {
            titleCodeId: null,
            step: {
                stepTypeId: null
            },
            rank: {}
        },
        affiliationType: {
            affiliationTypeId: null
        }
    },
    approvedAppointmentInfo: {
        currentSalaryAmt: null,
        waiverEndDt: null,
        appointmentEndDt: "",
        academicHierarchyInfo: {
            academicHierarchyPathId: null,
            departmentCode: "",
            locationId: null
        },
        salaryInfo: {
            academicProgramUnit: {
                apuId: null,
                scaleTypeId: null
            }
        },
        titleInformation: {
            titleCodeId: null,
            step: {
                stepTypeId: null,
                stepStartDt: ""
            },
            rank: {
                rankStartDt: ""
            }
        },
        affiliationType: {
            affiliationTypeId: null
        }
    },
    actionTypeInfo: {
        actionTypeId: null,
        actionCategoryId: null,
        actionTypeDisplayText: null
    },
    appointmentInfo: { //current appointment info
        opusPersonId: null,
        appointmentId: null,
        appointmentRowStatusId: null,
        appointmentPctTime: null,
        waiverEndDt: null,
        appointmentEndDt: "",
        comment: "",
        locationDisplayText1: null,
        locationDisplayText2: null,
        locationDisplayText3: null,
        locationDisplayText4: null,
        locationDisplayText5: null,
        locPercentTime1: null,
        locPercentTime2: null,
        locPercentTime3: null,
        locPercentTime4: null,
        locPercentTime5: null,
        locationId1: null,
        locationId2: null,
        locationId3: null,
        locationId4: null,
        locationId5: null,
        affiliationType: {
            affiliationTypeId: null
        },
        currentSalaryAmt: null,
        salaryInfo: {
            academicProgramUnit: {
                apuId: null,
                scaleTypeId: null
            }
        },
        academicHierarchyInfo: {
            academicHierarchyPathId: null,
            departmentCode: "",
            locationId: null
        },
        titleInformation: {
            titleCodeId: null,
            rank: {},
            step: {
                stepTypeId: null
            }
        }
    }
};

export let actionData = actionsData;

export const actionDataFromOpusCaseTemplatePaths = {
    caseId: "caseId"
};

export const proposedStatusTemplate = {
    appointeeInfo,
    loggedInUserInfo,
    actionsData
};

export const caseFlowTemplate = {
    appointeeInfo,
    loggedInUserInfo,
    opusCase,
    actionsData: []
};

export const caseSummaryProposedStatusTemplate = {
    appointeeInfo,
    loggedInUserInfo,
    actionData: {}
};

export const approvedSectionTemplate = {
    appointeeInfo,
    loggedInUserInfo,
    opusCase: {},
    actionsData: []
};

export const bulkActionsTemplate = {
    apptIds: "",
    actionType: "",
    effectiveDt: "",
    appointmentEndDt: "",
    apuCode: "",
    user: ""
};

export const constants = {};

export let templateConstants = {};
