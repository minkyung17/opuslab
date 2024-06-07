import * as ActionCategoryType from '../ActionCategoryType';
import {caseFlowSectionNames} from '../caseflow/CaseFlowConstants';

export const text = {
  code_text: 'code',
  action_type_display_key: 'actionTypeDisplayText'
};

export let notInAHPathActions = [
  {
    code: ActionCategoryType.APPOINTMENT,
    actionTypeDisplayText: 'Appointment',
    isValidForAppointmentSet: 'N'
  },
  {
    code: ActionCategoryType.JOINT_APPOINTMENT,
    actionTypeDisplayText: 'Joint Appt',
    isValidForAppointmentSet: 'Y'
  },
  {
    code: ActionCategoryType.SPLIT_APPOINTMENT,
    actionTypeDisplayText: 'Split Appt',
    isValidForAppointmentSet: 'Y'
  },
  {
    code: ActionCategoryType.RECALL,
    actionTypeDisplayText: 'Recall Appointment',
    isValidForAppointmentSet: 'N'
  }
];

export const constants = {
  replicateSingleAppointment: { '3-2': 'Joint Appointment', '3-3': 'Split Appointment'},
  bypassForNewApptActionTypes: {'3-1': 'Appointment', '3-32': 'Recall Appointment'},
  proposedFieldsPreviousSectionByActionType: {
    '3-1': caseFlowSectionNames.newAppointment,
    '3-32': caseFlowSectionNames.actionType
  }
};
