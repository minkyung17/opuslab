import * as ActionCategoryType from '../ActionCategoryType';
import {constants as casesConstants} from '../CasesConstants';

export const caseFlowSectionNames = {
  actionType: 'ACTION_TYPE',
  appointment: 'APPOINTMENT',
  nameSearch: 'NAME_SEARCH',
  proposedFields: 'PROPOSED_FIELDS',
  successFields: 'SUCCESS_FIELDS',
  recruit: 'RECRUIT',
  recruitUID: 'RECRUIT_UID',
  recruitMerge: 'RECRUIT_MERGE',
  newAppointment: 'NEW_APPOINTMENT',

  bulkActionsSelect: 'BULK_ACTIONS_SELECT',
  bulkActionsTable: 'BULK_ACTIONS_TABLE',
  bulkActionsFields: 'BULK_ACTIONS_FIELDS'
};

export const text = {
  apptInstructions: `Please choose an appointment.  If the
    appointment(s) listed are not correct, please contact UCLA Opus Support at opushelp@ucla.edu.`,
  archivedApptInstructions: `We can't start this case because all of
    the appointments for this person have ended. If you feel this is
    an error, contact UCLA Opus Support at opushelp@ucla.edu.`
};

export const appointmentSectionConstants = {
  excludeAddlAppts: {
    [ActionCategoryType.JOINT_APPOINTMENT]: true,
    [ActionCategoryType.SPLIT_APPOINTMENT]: true
  },
  nonFilteredAppointmentActions: {
    [ActionCategoryType.APPOINTMENT]: true,
    [ActionCategoryType.RECALL]: true
  }
  // ,
  // notValidForAppointmentSets: {
  //   [ActionCategoryType.APPOINTMENT]: true,
  //   [ActionCategoryType.RECALL]: true
  // }
};


export const constants = {
  caseFlowSectionNames,
  appointmentSectionFields: ['departmentCode', 'series', 'rank', 'titleCode', 'payrollTitle',
    'affiliation', 'appointmentPctTime', 'step', 'appointmentId', 'appointmentEndDt',
    'currentSalaryAmt', 'apuId', 'hscpScale0', 'hscpScale1to9',
    'hscpBaseScale', 'hscpAddBaseIncrement', 'startDateAtSeries', 'startDateAtRank',
    'startDateAtStep', 'waiverEndDt', 'appointmentEndDt', 'appointmentStatusType']
};
