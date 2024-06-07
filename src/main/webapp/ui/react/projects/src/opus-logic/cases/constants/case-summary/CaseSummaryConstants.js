import moment from 'moment';
import {actionsData} from '../CasesTemplates';
// import * as ActionCategoryType from '../ActionCategoryType';
import {actionTypesCloseableBySA} from '../CasesConstants';

export const caseSummaryProposedStatusTemplate = {
  actionData: {},
  appointeeInfo: {},
  loggedInUserInfo: {}
};


export let actionDataTemplate = actionsData;

const urls = {
  updateAction: '/restServices/rest/activecase/updateAction?access_token=',
  updateAnalyst: '/restServices/rest/activecase/updateAnalyst?access_token=',
  saveProposedStatus: '/restServices/rest/activecase/saveAction?access_token=',
  saveCaseLocation: '/restServices/rest/activecase/saveCaseLocation?access_token=',
  getCaseSummary: '/restServices/rest/activecase/getCaseSummary?access_token=',
  completeCaseCloseByCPacket: '/restServices/rest/activecase/completeCloseAPacket?access_token=',
  // getApoAnalystList: '/restServices/rest/activecase/getApoAnalystLists?access_token=',
  getDeanAnalystList: '/restServices/rest/activecase/getDeanAnalystList?access_token=',
  getDepartmentAnalystList: '/restServices/rest/activecase/getDeptAnalystList?access_token='
};


export let proposedActionTemplate = {
  caseId: null,
  proposedYearsAcceleratedCnt: null,
  proposedYearsDeferredCnt: null,
  proposedEffectiveDt: null,
  user: null
};

export let analystTemplate = {
  caseId: null,
  user: null,
  apoAnalystOpusId: null,
  apoAnalystCaseAssignDate: null,
  deanAnalystOpusId: null,
  deanAnalystCaseAssignDate: null,
  deptAnalystOpusId: null,
  deptAnalystCaseAssignDate: null
};

export const finalDecisionSaveConstants = {
  opusCase: {
    saveActive: {
      isNewCase: 'N',
      isTrackingDatesChanged: 'N',
      isDeptDatesChanged: 'N'
    },
    saveCompleted: {
      isNewCase: 'N',
      isTrackingDatesChanged: 'N',
      isDeptDatesChanged: 'N'
    },
    completeCase: {
      isNewCase: 'N',
      isTrackingDatesChanged: 'Y',
      isDeptDatesChanged: 'Y',
      caseCompletedDt: (()=> moment().format('MM/DD/YYYY'))()
    }
  },
  actionDataFunc: {
    saveActive: () => {
      return {
        pageName: 'active',
        sectionName: 'approved',
        rowStatusId: 1,
        actionStatusId: 1
      };
    },
    saveCompleted: ({rowStatusId, actionStatusId} = {}) => {
      return {
        rowStatusId,
        actionStatusId,
        pageName: 'completed',
        sectionName: 'approved'
      };
    },
    completeCase: () => {
      return {
        rowStatusId: 2,
        actionStatusId: 2,
        pageName: 'active',
        sectionName: 'approved',
        actionCompletedDt: (()=> moment().format('MM/DD/YYYY'))()
      };
    }
  }
};

// export let actionTypesCloseableBySA = {
//   [ActionCategoryType.CHANGE_APU]: true,
//   [ActionCategoryType.CHANGE_PERCENT_TIME]: true,
//   [ActionCategoryType.CHANGE_AREA_OR_SPECIALTY]: true,
//   [ActionCategoryType.CHANGE_LOCATION]: true,
//   [ActionCategoryType.CONVERT_HSCP]: true,
//   [ActionCategoryType.END_APPOINTMENT]: true,
//   [ActionCategoryType.FOUR_YEAR_REVIEW]: true,
//   [ActionCategoryType.INITIAL_WAIVER_REQUEST]: true,
//   [ActionCategoryType.REAPPOINTMENT]: true,
//   [ActionCategoryType.STEP_UNSTEP]: true,
//   [ActionCategoryType.WAIVER_RENEWAL]: true
// };

export let apoAnalystField = {
  name: 'apoAnalyst'
};

export let constants = {
  urls,
  apoAnalystField,
  proposedActionTemplate,
  finalDecisionSaveConstants,
  disapprovedOutcomeOptions: [
    {value: 5, text: 'Disapproved'},
    {value: 18, text: 'Disapproved Salary Modified'}
  ],
  actionTypesCloseableBySA
};
