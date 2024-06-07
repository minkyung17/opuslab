import deepmerge from 'deepmerge';

import * as ActionCategoryType from './ActionCategoryType';
//import * as util from '../../common/helpers/';

/** Affiliations **/
export let Affiliations = {
  primary: 'Primary',
  additional: 'Additional'
};


/** Action Types **/
export let ActionTypes = {
  merit: ActionCategoryType.MERIT,
  promotion: ActionCategoryType.PROMOTION,
  appointment: ActionCategoryType.APPOINTMENT,
  fiveYearReview: ActionCategoryType.FIVE_YEAR_REVIEW,
  academicAdministrativeAppointment: ActionCategoryType.ACADEMIC_ADMINISTRATIVE_APPOINTMENT,
  changePercentTime: ActionCategoryType.CHANGE_PERCENT_TIME,
  changeInSeries: ActionCategoryType.CHANGE_IN_SERIES,
  meritEquityReview: ActionCategoryType.MERIT_EQUITY_REVIEW
};

export let actionTypesCloseableBySA = {
  [ActionCategoryType.CHANGE_APU]: true,
  [ActionCategoryType.CHANGE_PERCENT_TIME]: true,
  [ActionCategoryType.CHANGE_AREA_OR_SPECIALTY]: true,
  [ActionCategoryType.CHANGE_TITLE_CODE]: true,
  [ActionCategoryType.CHANGE_LOCATION]: true,
  [ActionCategoryType.CONVERT_HSCP]: true,
  [ActionCategoryType.END_APPOINTMENT]: true,
  [ActionCategoryType.FOUR_YEAR_REVIEW]: true,
  [ActionCategoryType.INITIAL_WAIVER_REQUEST]: true,
  [ActionCategoryType.REAPPOINTMENT]: true,
  [ActionCategoryType.STEP_UNSTEP]: true,
  [ActionCategoryType.WAIVER_RENEWAL]: true
};

export let actionTypesCloseableByDA = {
  [ActionCategoryType.END_APPOINTMENT]: true
};

export let actionTypesCloseableByDASA = {
  [ActionCategoryType.APPOINTMENT]: true
}

//Based upon SA role AND series/rank (BRule-119)
export let actionTypesConditionallyCloseableBySABySeriesAndRank = {
  [ActionCategoryType.APPOINTMENT]: true,
  [ActionCategoryType.JOINT_APPOINTMENT]: true
};

export let actionTypesConditionallyCloseableBySAByActionType = {
  [ActionCategoryType.PROMOTION]: true
}

export let seriesCloseableBySA = {
  ['Clinical Volunteer']: true
}

export let seriesAndRanks = {
  assistantRank: {
    ['Assistant']: true
  },
  instructorRank: {
    ['Instructor']: true
  },
  visitingSeries: {
    ['Visiting Professor']: true,
    ['Visiting Research']: true,
    ['Visiting Project Scientist']: true,
    ['Visiting Scholar']: true,
    ['Clinical Volunteer']: true
  },
  special: {
    ['Project Scientist']: true,
    ['Specialist']: true
  }
};

export const urls = {
  getNameSearch: '/restServices/rest/activecase/nameSearch/?access_token=',
  getAppointmentInfoFromNameSelection: '/restServices/rest/activecase/getApptDetails/?access_token=',
  getJobSearch: '/restServices/rest/activecase/getJobNumberSearchResultset?access_token=',
  getGlobalObjects: '/restServices/rest/activecase/getGlobalLists/?access_token=',
  saveCase: '/restServices/rest/activecase/saveCase?access_token=',
  getRecruitNames: '/restServices/rest/activecase/getJobNumberSearchResultset?access_token=',
  getSalaryInfo: '/restServices/rest/activecase/getSalaryInfo/?access_token=',
  getCaseAttrData: ({actionType, access_token})=> '/restServices/rest/' +
    `activecase/getProposedCaseAttr?actionTypeString=${actionType}` +
    `&access_token=${access_token}`,
  getApu: ({opusPersonId, appointmentId, titleCodeId, access_token})=>
    `restServices/rest/profile/${opusPersonId}/appointment/${appointmentId}/`
    + `salary/${titleCodeId}/{stepTypeId}/?access_token=${access_token}`,
  getUIDInfo: ({uid, access_token}) =>
    `/restServices/rest/activecase/SearchForUID/${uid}?access_token=${access_token}`,
  bycReapptRenewalException: '/restServices/rest/wfm/addSingleUser?access_token=',
  displayComments: ({primaryKeyValue, screenName, access_token}) => '/restServices/' +
    `rest/common/comments/${screenName}/${primaryKeyValue}/?&access_token=${access_token}`,
  addComment: (access_token) =>
    `/restServices/rest/common/comments/?access_token=${access_token}`,
  reopenCaseUrl: '/restServices/rest/activecase/reopenACase?',
  deleteOrWithdrawCaseUrl: '/restServices/rest/activecase/deleteOrWithdrawACase?',
  checkIfEmailIsUniqueAndValid: '/restServices/rest/activecase/checkForDuplicateEmail?',
  endowedChairSearchUrl: '/restServices/rest/ec/endowedChairSearch/',
  endowedChairDataFromNameUrl: '/restServices/rest/activecase/getEndowedChair?access_token='
};


export const saveOptions = {
  urlEncodedHeaders: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
};


//These inactive dependent fields are ones the user cant enter or type.
//They are generally updated automatically
const inactiveDependentFieldsConfig = {
  departmentCode: {
    pathToDisplayValue: {
      areaName: 'areaName',
      departmentName: 'departmentName',
      divisionName: 'divisionName',
      schoolName: 'schoolName',
      specialtyName: 'specialtyName'
    }
  },
  titleCode: {
    pathToDisplayValue: {
      series: 'series',
      rank: 'rank.rankTypeDisplayText'
    }
  }
};

//These dependent fields are ones the user can enter or type
const activeDependentFieldsConfig = {
  departmentCode: {
    displayValuePath: {
      location: 'location'
    }
  },
  titleCode: {
    pathToDisplayValue: {
      step: 'step',
      scaleTypeId: 'scaleTypeId',
      dentistryBaseSupplement: 'dentistryBaseSupplement'
    }
  }
};

const dependentFieldsConfig = deepmerge(inactiveDependentFieldsConfig,
  activeDependentFieldsConfig);

const modalNames = {
  actionContainer: 'ACTION_CONTAINER',
  appointment: 'APPOINTMENT',
  nameSearch: 'NAME_SEARCH',
  proposedFields: 'PROPOSED_FIELDS',
  successFields: 'SUCCESS_FIELDS',
  recruit: 'RECRUIT',
  recruitUID: 'RECRUIT_UID',
  recruitMerge: 'RECRUIT_MERGE',
  newAppointment: 'NEW_APPOINTMENT'
};

export const constants = {
  caseSummaryUrlLink: '/opusWeb/ui/admin/case-summary.shtml?caseId=',
  recommendationsUrlSuffix: '/opusWeb/ui/admin/recommendations.shtml',
  caseSummaryUrl: '/opusWeb/ui/admin/case-summary.shtml?',
  endApptTitleCodeText: 'Would you like to make this person Emeritus? If not, leave blank.',
  apptSetToolTipHeaderText: `When an appointee has Joint or Split
    appointments, these multiple appointments may be selected here as a Set so
    that the proposed action affects all appointments in the Set.`,
  singleApptTooltipHeaderText: `When a proposed action is only
    relevant to one appointment, please select that single appointment rather
    than propose the action for the Set of appointments.`,
  apptInstructions: `Please choose an appointment.  If the
    appointment(s) listed are not correct, please contact contact UCLA Opus Support
    at opushelp@ucla.edu.`,
  archivedApptInstructions: `We can't start this case because all of
    the appointments for this person have ended. If you feel this is
    an error, contact contact UCLA Opus Support at opushelp@ucla.edu.`,
  modalNames,
  urls,
  saveOptions,
  wipeInvisibleFieldDataValues: ['location', 'startDateAtSeries',
    'startDateAtRank', 'startDateAtStep', 'apuId', 'hscpScale1to9', 'scaleType'],
  fieldNamesToTriggerSalaryAPICall: {
    salary: true, //Cases
    currentSalaryAmt: true, //Profile
    step: true,
    scaleType: true,
    apuCode: true,
    titleCode: true, //because step is set to zero on titleCode Change
    departmentCode: true,
    deptCode: true,
    salaryEffectiveDt: true
  },
  saveExceptionApptIdFromSelectedAppt: {
    '3-4': 'Change of Department',
    //'3-11': 'Change in Series' ,
    '3-35': 'Change of Area or Specialty',
    '3-36': 'Change of Location'
  },
  filteredTitleCodeByActionType: {
    '1-10': {
      actionTypeName: 'Uni18TempAugContAPt',
      fieldName: 'unit18Continuing',
      value: true
    },
    '3-27': {
      actionTypeName: 'Uni18TempAugContAPt',
      fieldName: 'unit18Continuing',
      value: true
    },
    '3-32': {
      actionTypeName: 'Recall',
      fieldName: 'series',
      value: 'Recall/VERIP'
    }
  },
  jointSplitAffiliationExceptionActionTypes: {
    '3-2': {
      actionName: 'Joint Appointment',
      displayText: 'Additional',
      value: 2
    },
    '3-3': {
      actionName: 'Split Appointment',
      name: 'Additional',
      displayText: 'Additional',
      value: 2
    }
  },
  saveExceptionActionTypes: {
    '3-32': 'Recall Appointment', '3-1': 'Appointment', '3-2': 'Joint Appointment',
    '3-3': 'Split Appointment'
  },
  //Take values from paths inside object of list given
  dependentFieldsConfig,
  salaryAPIFields: {
    listOfFieldsDependentOnStep: ['hscpBaseScale', 'hscpScale1to9', 'hscpAddBaseIncrement',
      'hscpScale0', 'scaleType', 'apuCode', 'onScaleSalary', 'offScalePercent',
      'salaryEffectiveDt', 'dentistryBaseSupplement']
  }
};

//
export const proposedActionFlags = [{
    name: "retentionFlag",
    displayName: "Retention",
    typeOfAction: "retention",
    actionTypeInfoField: true,
    shouldDisplay: false,
    checked: false
  }, {
    name: "retroactiveFlag",
    displayName: "Retroactive",
    typeOfAction: "",
    actionTypeInfoField: true,
    shouldDisplay: true,
    checked: false
  }, {
    name: "chairsMeritFlag",
    displayName: "Chair's Merit",
    typeOfAction: "merit",
    actionTypeInfoField: false,
    shouldDisplay: false,
    checked: false
  }, {
    name: "deansMeritFlag",
    displayName: "Dean's Merit",
    typeOfAction: "merit",
    actionTypeInfoField: false,
    shouldDisplay: false,
    checked: false
}];
