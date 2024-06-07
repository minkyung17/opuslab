import {dataViewTypes} from './DatatableConstants';
import {columnOptions} from './FieldDataConstants';
import {descriptions } from '../../common/constants/Descriptions';

export let fieldsInAPI = {
  edit: columnOptions.edit,
  opusPersonId: {
    ...columnOptions.opusPersonId,
    pathsInAPI: {
      appointment: {
        value: 'opusPersonId',
        displayText: 'opusPersonId'
      }
    }
  },
  academicYear: columnOptions.academicYear,
  eightYearLimitElgEffDt: {
    name: 'eightYearLimitElgEffDt',
    displayName: 'Estimated Date of Eight-Year Review',
    viewType: dataViewTypes.displayByKey,
    editConfiguration: {
      date: {
        fromDateFormat: 'YYYY-MM-DD',
        toDateFormat: 'MM/DD/YYYY'
      }
    },
    pathsInAPI: {
      appointment: {
        value: 'eightYearLimitElgEffDt',
        displayText: 'eightYearLimitElgEffDt'
      }
    },
    dataType: 'date',
    transformDate: {
      from: 'YYYY-MM-DD',
      to: 'MM/DD/YYYY',
      pathToGetValue: 'eightYearLimitElgEffDt',
      pathToSetValue: 'eightYearLimitElgEffDt'
    },
    saveOriginalValueByKey: 'displayValue_eightYearLimitElgEffDt',
    displayKey: 'eightYearLimitElgEffDt',
    descriptionText: descriptions.eligible_8_year_limit,
  },
  eightYearLimitEffDt: {
    name: 'eightYearLimitEffDt',
    displayName: 'Effective Date of Eight-Year Review',
    viewType: dataViewTypes.displayByKey,
    pathsInAPI: {
      appointment: {
        value: 'eightYearLimitEffDt',
        displayText: 'eightYearLimitEffDt'
      }
    },
    transformDate: {
      from: 'MM/DD/YYYY',
      to: 'YYYY/MM/DD',
      pathToGetValue: 'eightYearLimitEffDt'
    },
    saveOriginalValueByKey: 'displayValue_eightYearLimitEffDt',
    displayKey: 'displayValue_eightYearLimitEffDt',
    descriptionText: descriptions.effective_8_year_limit,
    visible: true,
    dataType: 'date'
  },
  fourthYearAppraisalEffDt: {
    name: 'fourthYearAppraisalEffDt',
    displayName: 'Effective Date of 4th Year Appraisal',
    editConfiguration: {
      date: {
        fromDateFormat: 'MM/DD/YYYY',
        toDateFormat: 'MM/DD/YYYY'
      }
    },
    viewType: dataViewTypes.displayByKey,
    pathsInAPI: {
      appointment: {
        value: 'fourthYearAppraisalEffDt',
        displayText: 'fourthYearAppraisalEffDt'
      }
    },
    transformDate: {
      from: 'MM/DD/YYYY',
      to: 'YYYY/MM/DD',
      pathToGetValue: 'fourthYearAppraisalEffDt'
    },
    saveOriginalValueByKey: 'displayValue_fourthYearAppraisalEffDt',
    displayKey: 'displayValue_fourthYearAppraisalEffDt',
    descriptionText: descriptions.effective_4th_year_appraisal,
    dataType: 'date',
    visible: true
  },
  fourthYearAppraisalElgEffDt: {
    name: 'fourthYearAppraisalElgEffDt',
    displayName: 'Estimated Date of 4th Year Appraisal',
    visible: true,
    width: 175,
    viewType: dataViewTypes.displayByKey,
    editConfiguration: {
      date: {
        fromDateFormat: 'YYYY-MM-DD',
        toDateFormat: 'MM/DD/YYYY'
      }
    },
    pathsInAPI: {
      appointment: {
        value: 'fourthYearAppraisalElgEffDt',
        displayText: 'fourthYearAppraisalElgEffDt'
      }
    },
    dataType: 'date',
    transformDate: {
      from: 'YYYY-MM-DD',
      to: 'MM/DD/YYYY',
      pathToGetValue: 'fourthYearAppraisalElgEffDt',
      pathToSetValue: 'fourthYearAppraisalElgEffDt'
    },
    saveOriginalValueByKey: 'displayValue_fourthYearAppraisalElgEffDt',
    displayKey: 'fourthYearAppraisalElgEffDt',
    descriptionText: descriptions.eligible_4th_year_appraisal
  },
  unitAYCount: {
    name: 'unitAYCount',
    displayName: 'Credited Service Units: AY',
    editable: true,
    pathsInAPI: {
      appointment: {
        value: 'unitAYCount',
        displayText: 'unitAYCount'
      }
    },
    visible: true,
    descriptionText: descriptions.credited_service_units_ay,
    dataType: 'number'
  },
  unitAYTotalCount: {
    name: 'unitAYTotalCount',
    displayName: 'Credited Service Units: Total',
    visible: true,
    editable: true,
    descriptionText: descriptions.credited_service_units_total,
    dataType: 'number',
    pathsInAPI: {
      appointment: {
        value: 'unitAYTotalCount',
        displayText: 'unitAYTotalCount'
      }
    }
  },
  unitTOCTakenCount: {
    name: 'unitTOCTakenCount',
    displayName: 'TOC Taken',
    visible: true,
    editable: true,
    descriptionText: descriptions.toc_taken,
    dataType: 'number',
    checkOnSave: true,
    pathsInAPI: {
      appointment: {
        value: 'unitTOCTakenCount',
        displayText: 'unitTOCTakenCount'
      }
    },
    helpText: 'Please enter a number below TOC Credited.',
    onSaveValidations: ['tocTakenBelowTOCCredited'],
    show: true,
    edit: true
  },
  unitTOCYearCount: {
    name: 'unitTOCYearCount',
    displayName: 'TOC Credited',
    visible: true,
    checkOnSave: true,
    editable: true,
    helpText: 'Please enter a number between 0 and 3.',
    onSaveValidations: ['tocCreditedNumberBounds'],
    pathsInAPI: {
      appointment: {
        value: 'unitTOCYearCount',
        displayText: 'unitTOCYearCount'
      }
    },
    descriptionText: descriptions.toc_credited,
    optionsListName: null,
    dataType: 'number'
  },
  unitYearsTotalCount: {
    name: 'unitYearsTotalCount',
    displayName: 'Credited Service Years: Total',
    visible: true,
    editable: true,
    descriptionText: descriptions.credited_service_years_total,
    pathsInAPI: {
      appointment: {
        value: 'unitYearsTotalCount',
        displayText: 'unitYearsTotalCount'
      }
    },
    optionsListName: null,
    dataType: 'number'
  },
  serviceUnitType: {
    name: 'serviceUnitType',
    displayName: 'Service Unit Type',
    visible: true,
    descriptionText: descriptions.service_unit_type,
    optionsListName: null,
    includeBlankOption: false,
    editable: true,
    pathsInAPI: {
      appointment: {
        value: 'serviceUnitType.serviceUnitTypeId',
        displayText: 'serviceUnitType.serviceUnitDisplayText'
      }
    },
    dataType: 'options',
    options: null
  },
  continuingUnit18ElgEffDt: {
    name: 'continuingUnit18ElgEffDt',
    displayName: 'Estimated Date of Excellence Review',
    visible: true,
    viewType: dataViewTypes.displayByKey,
    editConfiguration: {
      // date: {
      //   fromDateFormat: 'YYYY/MM/DD',
      //   toDateFormat: 'MM/DD/YYYY'
      // }
    },
    dataType: 'date',
    pathsInAPI: {
      appointment: {
        value: 'continuingUnit18ElgEffDt',
        displayText: 'continuingUnit18ElgEffDt'
      }
    },
    transformDate: {
      from: 'MM/DD/YYYY',
      to: 'YYYY/MM/DD',
      pathToGetValue: 'continuingUnit18ElgEffDt',
      pathToSetValue: 'continuingUnit18ElgEffDt'
    },
    saveOriginalValueByKey: 'displayValue_continuingUnit18ElgEffDt',
    displayKey: 'displayValue_continuingUnit18ElgEffDt',
    descriptionText: descriptions.eligible_date_excellence_review
  },
  continuingUnit18ReviewEffDt: {
    name: 'continuingUnit18ReviewEffDt',
    displayName: 'Effective Date of Excellence Review',
    visible: true,
    viewType: dataViewTypes.displayByKey,
    pathsInAPI: {
      appointment: {
        value: 'continuingUnit18ReviewEffDt',
        displayText: 'continuingUnit18ReviewEffDt'
      }
    },
    transformDate: {
      from: 'MM/DD/YYYY',
      to: 'YYYY/MM/DD',
      pathToGetValue: 'continuingUnit18ReviewEffDt',
      pathToSetValue: 'continuingUnit18ReviewEffDt'
    },
    saveOriginalValueByKey: 'displayValue_continuingUnit18ReviewEffDt',
    displayKey: 'displayValue_continuingUnit18ReviewEffDt',
    descriptionText: descriptions.effective_date_excellence_review
  },
  continuingUnit18Outcome: {
    name: 'continuingUnit18Outcome',
    displayName: 'Outcome of Excellence Review',
    pathsInAPI: {
      appointment: {
        value: 'continuingUnit18Outcome',
        displayText: 'continuingUnit18Outcome'
      }
    },
    dataType: 'input'
  },
  fourthYearAppraisalOutcome: {
    name: 'fourthYearAppraisalOutcome',
    displayName: 'Outcome of 4th Year Appraisal',
    dataType: 'input',
    pathsInAPI: {
      appointment: {
        value: 'fourthYearAppraisalOutcome',
        displayText: 'fourthYearAppraisalOutcome'
      }
    }
  },
  eightYearLimitOutcome: {
    name: 'eightYearLimitOutcome',
    displayName: 'Outcome of Eight-Year Review',
    dataType: 'input',
    pathsInAPI: {
      appointment: {
        value: 'eightYearLimitOutcome',
        displayText: 'eightYearLimitOutcome'
      }
    }

  }
};
