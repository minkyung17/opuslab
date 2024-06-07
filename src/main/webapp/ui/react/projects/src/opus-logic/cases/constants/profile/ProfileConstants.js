import {jsonToUrlArgs} from "../../../common/helpers/";
import {saveOptions, urls, constants as casesConstants} from "../CasesConstants";

export const text = {
    year_suffix: " Years(s)"
};

export let profileSaveTemplate = {
    opusPersonContApp: false,
    opusPersonTenure: false,
    locationList: [],
    affiliationTypeList: [],
    titleCodeList: [],
    scaleTypeList: [],
    apuList: [],
    appointeeInfo: {},
    loggedInUserInfo: {},
    appointmentInfoList: []
};

export const urlConfig = {
    addComment: urls.addComment,

    getNewAppointmentUrl: ({opusPersonId, access_token}) =>
    `/restServices/rest/profile/${opusPersonId}/appointment?access_token=${access_token}`,

    saveNewAppointmentUrl: ({opusPersonId, access_token}) =>
    `/restServices/rest/profile/${opusPersonId}/appointment?access_token=${access_token}`,

    saveProfileSummaryUrl: ({access_token}) => {
        return `/restServices/rest/profile/opusPerson/updateProfileInfo?access_token=${access_token}`;
    },

    getProfileSummaryDataByOpusIdUrl: ({opusPersonId, access_token}) => {
        return `/restServices/rest/profile/getProfileSummary/${opusPersonId}/?access_token=${access_token}`;
    },

    getProfileDataByOpusIdUrl: ({opusPersonId, access_token, typeOfReq}) => {
        return `/restServices/rest/profile/${opusPersonId}/${typeOfReq}/?access_token=${access_token}`;
    },

    getPathJobDataByOpusIdUrl: ({opusPersonId, access_token}) => {
        return `/restServices/rest/profile/${opusPersonId}/pathJobInfo/?access_token=${access_token}`;
    },

    editAppointmentUrl: ({opusPersonId, access_token, appointmentId}) =>
    `/restServices/rest/profile/${opusPersonId}/appointment/${appointmentId}/?`
    + `access_token=${access_token}`,

    searchProfileNamesUrl: ({name, grouperPathText, pageName, access_token}) =>
    `/restServices/rest/profile/search/${name}/${grouperPathText}/${pageName}/?` +
    `access_token=${access_token}`,

    getLoggedInUserInfoUrl: (access_token) =>
    `/restServices/rest/access/getAdminData?access_token=${access_token}`,

    getSalaryInfoUrl: ({opusPersonId, access_token, appointmentId, titleCodeId,
    stepTypeId}) =>
    `/restServices/rest/profile/${opusPersonId}/appointment/${appointmentId}`
    + `/salary/${titleCodeId}/${stepTypeId}/?access_token=${access_token}`,

    getAffiliationUrl: ({access_token, affiliation, affiliationTypeId,
    appointmentCategoryId}) =>
    `/restServices/rest/profile/affiliation/${affiliation}/${affiliationTypeId}` +
    `/${appointmentCategoryId}?access_token=${access_token}`,

    deleteAppointmentUrl: ({access_token, appointmentId, adminName, adminOpusId,
    adminEmail, fullName: appointeeName}) => {
        let args = jsonToUrlArgs({access_token, adminEmail, adminName, adminOpusId,
      appointeeName, appointmentId});
        return `/restServices/rest/profile/appointment/delete?${args}`;
    },

    getUnlinkPathPositionUrl: ({access_token, grouperPathText, appointmentId, positionNbr, opusPersonId, adminName, typeOfReq}) => {
        let args = jsonToUrlArgs({access_token, grouperPathText, appointmentId, positionNbr, opusPersonId, adminName, typeOfReq});
        return `/restServices/rest/profile/confirmUnconfirmPosition?${args}`;
    },

    getAppointmentSetUrl: ({opusPersonId, access_token}) => {
        return `/restServices/rest/profile/apptSet/${opusPersonId}/?access_token=${access_token}`;
    },

    getAppointmentSetDropdownOptionsUrl: ({opusPersonId, access_token}) => {
        return `/restServices/rest/profile/getApptsToAddApptSet/${opusPersonId}/?access_token=${access_token}`;
    },

    updateAppointmentSetUrl: ({access_token}) => {
        return `/restServices/rest/profile/updateApptSetInfo/?access_token=${access_token}`;
    },

    saveAppointmentSetUrl: ({access_token}) => {
        return `/restServices/rest/profile/saveApptSetInfo/?access_token=${access_token}`;
    }
};

export const profileConstants = {
    saveOptions,
    date_format: "MM/DD/YYYY",
    view_permissions: "profile",
    commentsPage: "profile",
    edit_permissions: "profile_edit_modal",
    millisec_year: 1000 * 60 * 60 * 24 * 365,
    nullifyFieldDataValuesIfInvisibleOnSave: casesConstants.nullifyFieldDataValuesIfInvisibleOnSave,
    sectionKeys: {
        main: ["appointmentStatusType", "departmentCode", "departmentName",
      "schoolName", "divisionName", "areaName", "specialtyName", "appointmentAffiliation", "appointmentCategory", "appointmentPctTime",
      "locationDisplayText1", "locationDisplayText2", "locationDisplayText3", "locationDisplayText4", "locationDisplayText5",
       "inactiveTitle", "titleCode", "series", "rank", "yearsAtCurrentRank", "step",
      "yearsAtCurrentStep", "payrollSalary", "currentSalaryAmt", "appointmentCategoryId", "academicHierarchyPathId"],
        salary: ["scaleType", "onScaleSalary", "offScalePercent", "salaryEffectiveDt", "oldApuDesc",
      "apuCode", "hscpScale1to9", "hscpScale0", "hscpBaseScale", "hscpAddBaseIncrement",
      "dentistryBaseSupplement"],
        appointment: ["lastAdvancementActionEffectiveDt", "hireDt", "startDateAtSeries",
      "startDateAtRank", "startDateAtStep", "waiverEndDt", "appointmentEndDt", "appointmentId",
      "appointmentSetId", "positionNbr"]
    }
};

export const viewAppointmentSetConstants = {
    name: "appointment_set",
    action: "view"
};

export const editAppointmentSetConstants = {
    name: "appointment_set_edit_modal",
    action: "edit"
};
