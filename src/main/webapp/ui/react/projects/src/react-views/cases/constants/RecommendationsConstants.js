import {fieldsInAPI} from '../../../opus-logic/cases/constants/FieldDataConstants';
import {cloneObject as clone} from '../../../opus-logic/common/helpers';

/**
 * @desc - Configuration constants for Recommendations
 *
 *
**/
export const Titles = {
  'Dept. Chair': 1,
  Dean: 2,
  'CAP RC': 3,
  'Vice Chancellor': 4,
  CAP: 8,
  ClinCAP: 9,
  'CAP Subcommittee': 10,
  addRCMember: 15,
  editRCMember: 16,
  deleteRCMember: 17,
  addRCSlateMember: 18,
  editRCSlateMember: 19,
  deleteRCSlateMember: 20
};


export const capCommitteeType = {
  3: 'CAP',
  9: 'ClinCAP',
  10: 'CAP Subcommittee'
};

export const selectOptionNames = {
  rank: 'rank',
  step: 'step',
  recommendationOutcomes: 'recommendationOutcomes',
  committeeMemberRoles: 'committeeMemberRoles',
  committeeMemberProposedRoles: 'committeeMemberProposedRoles',
  recommendationTypes: 'recommendationTypes',
  recommendationStrengthIds: 'recommendationStrengthIds',
  locations: 'locations',
  actionOutcomes: 'actionOutcomes',
  actionOutcomeOptions: 'actionOutcomeOptions',
  capCommitteeType: 'capCommitteeType'
};


const modalOptions = {
  yesNo: ['Yes', 'No'],
  recommendations: [],
  options: ['Recommend', 'Do Not Recommend'],
  [selectOptionNames.recommendationStrengthIds]: [],
  [selectOptionNames.recommendationTypes]: [],
  [selectOptionNames.committeeMemberRoles]: [],
  //[selectOptionNames.capCommitteeType]: capCommitteeType,
  finalRoles: []
};

let defaultDateValidation = {
  checkOnSave: true,
  onSaveValidations: ['stringNotBlank', 'isYearBefore1900', 'isYearAfter2100']
};


let defaultSelectOptionsValidation = {
  checkOnSave: true,
  onSaveValidations: ['isNumberPresent'],
  checkOnClick: true,
  onClickValidations: ['isNumberPresent']
};

export const modalFieldsValidations = {
  /*
  required: {
    checkOnClick: true, onClickValidations: ['stringNotBlank'],
    checkOnSave: true, onSaveValidations: ['stringNotBlank']
  },

  recommendation: defaultSelectOptionsValidation,
  decision:defaultSelectOptionsValidation,
  strengthOfRecommendation:defaultSelectOptionsValidation,
  typeOfCAPCommittee: defaultSelectOptionsValidation,
  proposedRole: defaultSelectOptionsValidation,
  finalRole:defaultSelectOptionsValidation,
  */

  /*dateOfRecommendation: yearDateValidation,
  dateOfDecision:yearDateValidation,
  deptVotingCommitteeResultsDt:yearDateValidation,
  dateOfCommitteeMembership: yearDateValidation,
  dateOfMeeting:yearDateValidation,
  dateReportSubmittedToAPO: yearDateValidation,
  dateReportSentToDean:yearDateValidation,*/

  typeOfCAPCommittee: {
    checkOnSave: true,
    onSaveValidations: ['isNumberPresent']
  }
};

let modalFields_ = {
  rank: clone({...fieldsInAPI.rank, dataType: 'options', editable: true,
    apiOptionsName: selectOptionNames.rank, wipeValueIfNull: true}),
  step: clone({...fieldsInAPI.step, dataType: 'options', isNumberInAPI: false,
    editable: true, apiOptionsName: selectOptionNames.step, optionsInfo: {
      includeBlankOption: true,
      optionsListName: 'stepList'}, wipeValueIfNull: true}),
  salary: clone({...fieldsInAPI.salary, editable: true}),
  userComments: clone({...fieldsInAPI.userComments, label: 'Comments (Maximum 250 characters.)'}),
  recommendation: {dataType: 'options', name: 'recommendation',
    displayName: 'Recommendation', options: modalOptions.recommendations,
    editable: true, apiOptionsName: selectOptionNames.recommendationOutcomes},

  dateOfRecommendation: {dataType: 'date', name: 'dateOfRecommendation',
    editable: true, displayName: 'Date of Recommendation'},

  decision: {dataType: 'options', name: 'decision', displayName: 'Decision',
    editable: true, options: modalOptions.options,
    apiOptionsName: selectOptionNames.actionOutcomes},

  required: {dataType: 'options', name: 'required', displayName: 'Required?',
    editable: true, options: modalOptions.yesNo},

  strengthOfRecommendation: {dataType: 'options', name: 'strengthOfRecommendation',
    displayName: 'Strength of Recommendation', options: [], editable: true,
    apiOptionsName: selectOptionNames.recommendationStrengthIds},

  typeOfCAPCommittee: {dataType: 'options', name: 'typeOfCAPCommittee',
    displayName: 'Type of CAP Committee', options: modalOptions.options,
    editable: true, apiOptionsName: selectOptionNames.capCommitteeType},

  proposedRole: {dataType: 'options', name: 'proposedRole', displayName: 'Proposed Role',
    editable: true, options: [], apiOptionsName: selectOptionNames.committeeMemberProposedRoles},

  finalRole: {dataType: 'options', name: 'finalRole', displayName: 'Final Role',
    editable: true, options: modalOptions.finalRoles,
    apiOptionsName: selectOptionNames.committeeMemberRoles},

  // userComments: {dataType: 'textarea', displayName: 'Comments', name: 'userComments',
  //   css: 'col-md-12'},

  dateOfDecision: {dataType: 'date', name: 'dateOfDecision', editable: true,
    displayName: 'Date of Decision'},

  deptVotingCommitteeResultsDt: {dataType: 'date', name: 'deptVotingCommitteeResultsDt',
    editable: true, displayName: 'Date of Department Vote'},

  dateOfCommitteeMembership: {dataType: 'date', name: 'dateOfCommitteeMembership',
    editable: true, displayName: 'Date of Committee Membership Set'},

  dateOfMeeting: {dataType: 'date', name: 'dateOfMeeting', editable: true,
    displayName: 'Date of Meeting'},

  dateReportSubmittedToAPO: {dataType: 'date', name: 'dateReportSubmittedToAPO',
    editable: true, displayName: 'Date Report Submitted to APO'},

  dateReportSentToDean: {dataType: 'date', name: 'dateReportSentToDean',
    editable: true, displayName: 'Date Report Sent to Dean'},

  autocomplete: {dataType: 'autocomplete', displayName: 'Who would you like to add? ',
    apiOptionsName: '', options: { minLength: 3}, name: 'autocomplete',
    inputProps: {
      placeholder: 'Search for a person',
      className: ' form-control search-round margin-right-fifteen'
    }
  },
  delete: { dataType: 'message', name: 'delete',
	value: 'Are you sure you want to delete this committee member?  If you need to re-add them click the "Add Members" button.'
  }
};


/**
* @param - Lets add modalFieldsValidations to the
*
*
**/
let modalFields = (function(modalFields_, validations = {}) {
  for(let name in modalFields_){
    Object.assign(modalFields_[name], validations[name]);
  }

  return modalFields_;
})(modalFields_, modalFieldsValidations);

export const recommendationModalProps = {
  warning_modal_css: ' warning-recommendation-modal ',
  warning_modal_selector: '.warning-recommendation-modal',
  edit_modal_css: ' edit-recommendation-modal ',
  editModalProps: {
    'data-target': '.edit-recommendation-modal',
    'data-toggle': 'modal',
    src: '../images/edit-pencil.png'
  },
  delete_modal_css: ' delete-recommendation-modal ',
  deleteModalTarget: {
    'data-target': '.delete-recommendation-modal',
    'data-toggle': 'modal',
    src: '../images/trash.png'
  }
};

export const memberModalProps = {
  edit_modal_css: ' edit-member-modal ',
  editModalProps: {
    'data-target': '.edit-member-modal',
    'data-toggle': 'modal',
    src: '../images/edit-pencil.png',
    alt: 'edit'
  },
  delete_modal_css: ' delete-member-modal ',
  deleteModalTarget: {
    'data-target': '.edit-member-modal',
    'data-toggle': 'modal',
    src: '../images/trash.png',
    alt: 'trash'
  }
};

const addButtons = ['save', 'cancel'];
const defaultFieldValueToSaveAPIPaths = { required: 'required',
  recommendation: 'outComeTypeId', dateOfRecommendation: 'recommendationDt',
  strengthOfRecommendation: 'recommendationStrengthId', rank: 'recommendationRankType',
  step: 'recommendationStepType', salary: 'recommendationSalaryAmt',
  typeOfCAPCommittee: 'committeeTypeId',
  dateReportSubmittedToAPO: 'opusCase.deanToAPOSubmittedDt',
  dateReportSentToDean: 'opusCase.departmentToDeanSubmittedDt',
  decision: 'outComeTypeId', dateOfDecision: 'recommendationDt',
  userComments: 'recommendationCommentsText'
};
const recommendationFieldValueToSaveAPIPaths = {
  ...defaultFieldValueToSaveAPIPaths,
  dateOfCommitteeMembership: 'opusCase.cAPReviewCommitteeSetupDt',
  dateOfMeeting: 'opusCase.cAPReviewCommitteeMeetingDt',
  dateReportSubmittedToAPO: 'opusCase.cAPReviewCommitteeReportToAPODt',
  dateReportSentToDean: 'opusCase.cAPReviewCommitteeReportToDeanDt',
  deptVotingCommitteeResultsDt: 'opusCase.deptVotingCommitteeResultsDt'
};
//
// let {required, recommendation, deptVotingCommitteeResultsDt, dateOfMeeting,
//       dateOfRecommendation, typeOfCAPCommittee, strengthOfRecommendation,
//       dateOfCommitteeMembership, dateReportSubmittedToAPO, dateReportSentToDean,
//       dateOfDecision, decision} = modalFields;
const enableRecFieldsOnOption = {
  recommendation: {
    fieldName: 'recommendation',
    fieldValue: '4',
    fieldsToEnable: ['rank', 'step', 'salary']
  }
};
const recommendationModals = {
  deptRecommendation: {
    title: 'Department Chair Recommendation',
    fields: clone({
      recommendation: modalFields.recommendation,
      deptVotingCommitteeResultsDt: modalFields.deptVotingCommitteeResultsDt,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption,
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  deanRecommendation: {
    title: 'Dean Recommendation',
    fields: clone({
      recommendation: modalFields.recommendation,
      dateOfRecommendation: modalFields.dateOfRecommendation,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption,
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  capRecommendation: {
    title: 'CAP Recommendation',
    fields: clone({
      required: modalFields.required,
      typeOfCAPCommittee: modalFields.typeOfCAPCommittee,
      recommendation: modalFields.recommendation,
      strengthOfRecommendation: modalFields.strengthOfRecommendation,
      dateOfRecommendation: modalFields.dateOfRecommendation,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption,
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  capReview: {
    title: 'CAP Review Committee Recommendation',
    fields: clone({ required: modalFields.required,
      dateOfCommitteeMembership: modalFields.dateOfCommitteeMembership,
      dateOfMeeting: modalFields.dateOfMeeting,
      dateReportSubmittedToAPO: modalFields.dateReportSubmittedToAPO,
      dateReportSentToDean: modalFields.dateReportSentToDean,
      recommendation: modalFields.recommendation,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption,
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  clinCAP: {
    title: 'ClinCap',
    fields: clone({ required: modalFields.required,
      typeOfCAPCommittee: modalFields.typeOfCAPCommittee,
      recommendation: modalFields.recommendation,
      strengthOfRecommendation: modalFields.strengthOfRecommendation,
      dateOfRecommendation: modalFields.dateOfRecommendation,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption,
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  capSubcommittee: {
    title: 'CAP Subcommittee',
    fields: clone({ required: modalFields.required,
      typeOfCAPCommittee: modalFields.typeOfCAPCommittee,
      recommendation: modalFields.recommendation,
      strengthOfRecommendation: modalFields.strengthOfRecommendation,
      dateOfRecommendation: modalFields.dateOfRecommendation,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption,
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  viceChancellor: {
    title: 'Vice Chancellor Decision',
    fields: clone({
      required: modalFields.required,
      decision: {...modalFields.recommendation, displayName: 'Decision',
        name: 'decision'},
      dateOfDecision: modalFields.dateOfDecision,
      rank: modalFields.rank,
      step: modalFields.step,
      salary: modalFields.salary,
      userComments: modalFields.userComments
    }),
    enableRecFieldsOnOption: {
      decision: {
        fieldName: 'decision',
        fieldValue: '4',
        fieldsToEnable: ['rank', 'step', 'salary']
      }
    },
    fieldValueToSaveAPIPaths: recommendationFieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  }
};

export const fieldValueToSaveAPIPaths = {
  proposedRole: 'committeeMemberProposedRoleId',
  finalRole: 'committeeMemberFinalRoleId',
  userComments: 'commentsText'
};

export const updateMemberModals = {
  addRCMember: {
    title: 'Add a Review Committee Member',
    //indexFieldKeys: { proposedRole: 1, finalRole:2, comments:3 },
    fields: clone({ autocomplete: modalFields.autocomplete,
      proposedRole: modalFields.proposedRole, finalRole: modalFields.finalRole,
      userComments: modalFields.userComments}),
    fieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  editRCMember: {
    title: 'Edit a Review Committee Member',
    modalCss: memberModalProps.edit_modal_css,
    fields: clone({proposedRole: modalFields.proposedRole,
      finalRole: modalFields.finalRole, userComments: modalFields.userComments}),
    fieldValueToSaveAPIPaths,
    buttons: addButtons
  },
  deleteRCMember: {
    title: 'Delete a Review Committee Member',
    titleColor: 'white',
    modalCss: memberModalProps.delete_modal_css,
    fields: clone({delete: modalFields.delete}),
    fieldValueToSaveAPIPaths,
    buttons: ['delete', 'cancel']
  },
  addRCSlateMember: {
    title: 'Add Slate Member',
    //indexFieldKeys: { proposedRole: 1, finalRole:2, comments:3 },
    fields: clone({ autocomplete: modalFields.autocomplete,
      proposedRole: modalFields.proposedRole, userComments: modalFields.userComments}),
    fieldValueToSaveAPIPaths,
    buttons: addButtons,
    onClickSave: null
  },
  editRCSlateMember: {
    title: 'Edit Slate Member',
    modalCss: memberModalProps.edit_modal_css,
    fields: clone({proposedRole: modalFields.proposedRole,
      userComments: modalFields.userComments}),
    fieldValueToSaveAPIPaths,
    buttons: addButtons
  },
  deleteRCSlateMember: {
    title: 'Delete a Slate Member',
    titleColor: 'white',
    modalCss: memberModalProps.delete_modal_css,
    fields: clone({delete: modalFields.delete}),
    fieldValueToSaveAPIPaths,
    buttons: ['delete', 'cancel']
  }
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


export let constants = {
  memberModalProps,
  updateMemberModals,
  recommendationModals,
  recommendationModalProps,
  committeeMemberTemplate,
  defaultFieldValueToSaveAPIPaths,
  is_valid_key: 'isValid',
  header_color_default: ' modal-info ',
  header_color_danger: ' modal-danger ',
  api_key_name: 'commonTypeId',
  api_value_name: 'commonTypeValue',
  api_options_name_modal: 'apiOptionsName',
  cr_no_edit_key: 'No - Waiver',
  select_options_value_key: 'commonTypeId',
  select_options_text_key: 'commonTypeValue',
  warningDeleteRCCommittee: `If you have any Review Committee members saved, this
    will delete them. Are you sure you want to do this?`,
  addMemberUrl: '/restServices/rest/activecase/updateReviewCommittee?access_token=',
  updateCaseUrl: '/restServices/rest/activecase/saveCaseRecommendation?access_token=',
  grouperPathText: 'eligibility',
  enableCapRCButton: {
    recommender: 'CAP RC',
    enableState: 'Yes'
  },
  wipeModalValuesOnToggleByFieldName: {
    required: {
      formTitles: {
        'CAP RC': true,
        'Vice Chancellor': true,
        CAP: true,
        ClinCAP: true,
        'CAP Subcommittee': true
      }
    }
  },
  capRCType: {
    capRCSlate: 1,
    capRC: 2
  },
  recommendationColumnKeys: ['editIcon', 'recommender', 'required', 'recommendation'],
  viewCAPRCSection: {
    apo_director: true,
    opus_admin: true,
    cap_staff: true
  },
  addMembersColumnKeys: ['editIcon', 'name', 'committeeMemberProposedRole',
    'committeeMemberFinalRole', 'appointmentInfo.titleInformation.rank.rankTypeDisplayText',
    'appointmentInfo.titleInformation.step.stepTypeDescription',
    'appointmentInfo.academicHierarchyInfo.departmentName', 'deleteIcon'],
  recommendationsColumnTitles: [''/**Edit**/, 'Recommender/Approver', 'Required',
    'Recommendation/Decision'],
  capRCColumnTitles: ['', 'Name', 'Proposed Role', 'Final Role', 'Rank', 'Step',
    'Department', 'Delete'],

  //CAP Slate
  addMembersSlateColumnKeys: ['editIcon', 'name', 'committeeMemberProposedRole',
    'appointmentInfo.titleInformation.rank.rankTypeDisplayText',
    'appointmentInfo.titleInformation.step.stepTypeDescription',
    'appointmentInfo.academicHierarchyInfo.departmentName', 'deleteIcon'],
  recommendationsSlateColumnTitles: ['', 'Recommender/Approver', 'Required',
    'Recommendation/Decision'],
  capRCSlateColumnTitles: ['', 'Name', 'Proposed Role', 'Rank', 'Step',
    'Department', 'Delete'],

  editIconElementProps: {
    type: 'edit',
    'data-toggle': 'modal',
    'data-target': '.edit-modal'
  },
  deleteIconElementProps: {
    'data-target': '.delete-modal',
    'data-toggle': 'modal',
    type: 'delete'
  },
  deleteMemberConstants: {
    committeeTypeId: {
      path: 'committeeTypeId',
      value: '8'
    },
    delete: {
      path: 'delete',
      value: 'Y'
    }
  },
  deleteIcon: 'icon-trash',
  editIcon: 'icon-pencil',
  modalByKey: {
    [Titles['Dept. Chair']]: recommendationModals.deptRecommendation ,
    [Titles['Dean']]: recommendationModals.deanRecommendation,
    [Titles['CAP']]: recommendationModals.capReview,
    [Titles['ClinCAP']]: recommendationModals.clinCAP,
    [Titles['CAP Subcommittee']]: recommendationModals.capSubcommittee,
    [Titles['Vice Chancellor']]: recommendationModals.viceChancellor,
    [Titles['CAP RC']]: recommendationModals.capRecommendation,

    [Titles['addRCMember']]: updateMemberModals.addRCMember,
    [Titles['editRCMember']]: updateMemberModals.editRCMember,
    [Titles['deleteRCMember']]: updateMemberModals.deleteRCMember,

    [Titles['addRCSlateMember']]: updateMemberModals.addRCSlateMember,
    [Titles['editRCSlateMember']]: updateMemberModals.editRCSlateMember,
    [Titles['deleteRCSlateMember']]: updateMemberModals.deleteRCSlateMember


  }
};


export const config = {
  getCaseRecommendationSummary: ({access_token}) =>{
    return `/restServices/rest/activecase/getRecommendationSummary?access_token=${access_token}`;
  },
  globalListsUrl: ({access_token})=>{
    return `/restServices/rest/activecase/getRecommGlobalList?access_token=${access_token}`;
  },
  nameSearch: ({access_token}) => {
    return `/restServices/rest/activecase/getCommitteeMembersResultset?access_token=${access_token}`;
  }
};
