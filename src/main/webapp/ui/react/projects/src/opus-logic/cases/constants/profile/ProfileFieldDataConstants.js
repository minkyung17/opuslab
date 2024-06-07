import {fieldsInAPI as baseFields} from '../FieldDataConstants';
import deepmerge from 'deepmerge';


export const profileFields = {
  currentSalaryAmt: {
    dataType: 'debounce-number'
  },
  step: {
    conditionalRestriction: true,
    pathsInAPI: {
      appointment: {
        displayText: 'titleInformation.step.stepTypeDescription'
      }
    }
  },
  waiverEndDt: {
    displayName: 'Waiver End Date'
  },
  appointmentEndDt: {
    conditionalVisibility: true
  },
  rank: {
    conditionalVisibility: true
  },
  startDateAtSeries: {
    conditionalVisibility: true
  },
  startDateAtRank: {
    conditionalVisibility: true
  },
  startDateAtStep: {
    conditionalVisibility: true
  }
};

export let fieldsInAPI = deepmerge(baseFields, profileFields);
