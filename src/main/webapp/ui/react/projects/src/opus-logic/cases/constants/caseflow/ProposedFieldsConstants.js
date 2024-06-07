import moment from 'moment';

//My imports
import * as ActionCategoryType from '../ActionCategoryType';

/** Affiliations **/
export let Affiliations = {
  primary: 'Primary',
  additional: 'Additional'
};


export const text = {
  N: 'N'
};

export const mergeOpusIdPaths = {
  paths: {
    firstName: 'appointeeInfo.firstName',
    lastName: 'appointeeInfo.lastName',
    contactValue: 'appointeeInfo.contactValue',
    opusStatus: 'appointeeInfo.opusStatus',
    eppn: 'appointeeInfo.eppn'
  }
};


export let constants = {
  dummyIdahPathIdConcatException: {
    //added 4/26/2017 to dummy -1 for the ahPath to ApptId in
    //opusCase for newTemplate on CaseFlow save
    '3-2': 'Joint Appointment',
    '3-3': 'Split Appointment'
  },
  ahPathIdConcatException: {
    '3-1': 'Appointment',
    '3-4': 'Change of Department',
    //'3-11': 'Change in Series' ,
    '3-32': 'Recall Appointment',
    '3-35': 'Change of Area or Specialty',
    '3-36': 'Change of Location'
  },
  caseFlowAppointmentStatusData: {
    rowStatusId: 1,
    actionStatusId: 1,
    pageName: 'active'
  },
  saveExceptionActionTypes: {
    '3-32': 'Recall Appointment', '3-1': 'Appointment', '3-2': 'Joint Appointment',
    '3-3': 'Split Appointment'
  },
  saveExceptionApptIdFromSelectedAppt: {
    '3-4': 'Change of Department',
    //'3-11': 'Change in Series' ,
    '3-35': 'Change of Area or Specialty',
    '3-36': 'Change of Location'
  },
  excludeAddlAppts: {
    [ActionCategoryType.JOINT_APPOINTMENT]: true,
    [ActionCategoryType.SPLIT_APPOINTMENT]: true
  },
  caseFlowOpusCaseDefaults: {
    isNewCase: 'Y',
    isTrackingDatesChanged: 'Y',
    isDeptDatesChanged: 'Y',
    caseInitiatedDt: moment().format('MM/DD/YYYY')
  },
  defaultOpusIDMergeConstants: {
    mergeOpusIdFlag: 'N',
    mergeOpusId: null
  }
};
