import {descriptions } from '../../common/constants/Descriptions';
import {createConfigFromTemplate} from './DatatableConfigTemplate';

/**
 *
 * @desc - Configuration constant for ActiveCases Page
 *
**/
export const salaryConfig = {
  grouperPathText: 'eligibility',
  exportToExcelBaseUrl: '/restServices/rest/offScaleReport/downloadReportCSV',
  url: '/restServices/rest/offScaleReport/getOffScaleSalary',
  filtersUrl: '/restServices/rest/common/getDisplayPreferences',
  columnFilterKey: 'eligibleFilterMap',
  dataRowName: 'offScales',
  excelFileName: 'SalaryReport.csv',
  pageName: 'Salary',
  exportData: descriptions.exportDataDefaultMessage,
  visibleColumnKey: 'visible',
  pagePermissions: {
    name: 'salary',
    action: 'view'
  },
  defaultFilterView: {
    savedPreferenceName: 'Opus Standard View',
    opusDefault: true,
    defaultPref: false,
    filters: {
      dataColumnFilters:{
        columnSortOrder: {fullName: "asc"},
        columnStringMatch: {},
        columnValueOptions: {},
        outsideFilters: {},
        simpleFilters: {}
        },
      formattedColumnOptions: [
        {visible: false, name: "emplId", displayName: "Empl. ID"},
        {visible: false, name: "uid", displayName: "UID"},
        {visible: true, name: "fullName", displayName: "Name"},
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: true, name: "appointmentPctTime", displayName: "Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "currentSeries", displayName: "Current Series"},
        {visible: true, name: "currentRank", displayName: "Current Rank"},
        {visible: true, name: "currentStep", displayName: "Current Step"},
        {visible: true, name: "payrollSalary", displayName: "Payroll Salary"},
        {visible: false, name: "nstpComp", displayName: "NSTP Component"},        
        {visible: false, name: "onScaleSalary", displayName: "Current On-Scale Amount"},        
        {visible: false, name: "offScaleAmount", displayName: "Current Off-Scale Amount"},
        {visible: true, name: "offScalePercent", displayName: "Current Off-Scale %"},
        {visible: true, name: "currentBaseSalary", displayName: "Salary at Last Advancement"},
        {visible: true, name: "lastAdvancementActionEffectiveDt", displayName: "Date of Last Advancement"},
        {visible: true, name: "actionInProgress", displayName: "Action in Progress"},
        {visible: true, name: "effectiveDate", displayName: "Effective Date"},
        {visible: false, name: "proposedSeries", displayName: "Proposed Series"},
        {visible: false, name: "proposedRank", displayName: "Proposed Rank"},
        {visible: false, name: "proposedStep", displayName: "Proposed Step"},
        {visible: true, name: "proposedBaseSalary", displayName: "Proposed Salary"},
        {visible: false, name: "proposedOnScaleSalary", displayName: "Proposed On-Scale Amount"},
        {visible: false, name: "proposedOffScaleAmount", displayName: "Proposed Off-Scale Amount"},
        {visible: true, name: "proposedOffScalePercent", displayName: "Proposed Off-Scale %"},
        {visible: false, name: "changeInOffScaleAmount", displayName: "Increase in Salary (Current/Proposed)"},
        {visible: true, name: "changeInOffScalePercent", displayName: "% Increase in Salary (Current/Proposed)"},
        {visible: false, name: "approvedSeries", displayName: "Approved Series"},
        {visible: false, name: "approvedRank", displayName: "Approved Rank"},
        {visible: false, name: "approvedStep", displayName: "Approved Step"},
        {visible: true, name: "approvedSalaryAmt", displayName: "Approved Salary"},
        {visible: false, name: "approvedOnScaleSalary", displayName: "Approved On-Scale Amount"},
        {visible: false, name: "approvedOffScaleAmount", displayName: "Approved Off-Scale Amount"},
        {visible: true, name: "approvedOffScalePercent", displayName: "Approved Off-Scale %"},
        {visible: false, name: "approvedChangeInOffScaleAmount", displayName: "Increase in Salary (Current/Approved)"},
        {visible: true, name: "approvedChangeInOffScalePercent", displayName: "% Increase in Salary (Current/Approved)"}
      ]
    }
  },
  columnKeys: ['emplId', 'uid', 'fullName', 'schoolName', 'divisionName', 'departmentName',
    'areaName', 'specialtyName', 'affiliation', 'appointmentPctTime', 'location', 'currentSeries', 'currentRank',
    'currentStep', 'payrollSalary', 'nstpComp', 'onScaleSalary',
     'offScaleAmount','offScalePercent', 'currentBaseSalary','lastAdvancementActionEffectiveDt',
     'actionInProgress', 'effectiveDate', 'proposedSeries', 'proposedRank', 'proposedStep',
    'proposedBaseSalary', 'proposedOnScaleSalary', 'proposedOffScaleAmount',
    'proposedOffScalePercent', 'changeInOffScaleAmount', 'changeInOffScalePercent',
    'approvedSeries', 'approvedRank', 'approvedStep', 'approvedSalaryAmt',
    'approvedOnScaleSalary', 'approvedOffScaleAmount',
    'approvedOffScalePercent', 'approvedChangeInOffScaleAmount',
    'approvedChangeInOffScalePercent'],
  //Columns will appear in array order shown here
  columnConfiguration: {
    schoolName: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.academicHierarchyInfo.schoolName',
          displayText: 'appointmentInfo.academicHierarchyInfo.schoolName'
        }
      }
    },
    divisionName: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.academicHierarchyInfo.divisionName',
          displayText: 'appointmentInfo.academicHierarchyInfo.divisionName'
        }
      }
    },
    departmentName: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.academicHierarchyInfo.departmentName',
          displayText: 'appointmentInfo.academicHierarchyInfo.departmentName'
        }
      }
    },
    areaName: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.academicHierarchyInfo.areaName',
          displayText: 'appointmentInfo.academicHierarchyInfo.areaName'
        }
      }
    },
    specialtyName: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.academicHierarchyInfo.specialtyName',
          displayText: 'appointmentInfo.academicHierarchyInfo.specialtyName'
        }
      }
    },
    // location: {
    //   pathsInAPI: {
    //     appointment: {
    //       value: 'appointmentInfo.academicHierarchyInfo.location',
    //       displayText: 'appointmentInfo.academicHierarchyInfo.location'
    //     }
    //   }
    // },
    affiliation: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.affiliationType.affiliation',
          displayText: 'appointmentInfo.affiliationType.affiliation'
        }
      }
    },
    appointmentPctTime: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.appointmentPctTime',
          displayText: 'appointmentInfo.appointmentPctTime'
        }
      }
    },
    currentSeries: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.titleInformation.seriesInfo.seriesDisplayText',
          displayText: 'appointmentInfo.titleInformation.seriesInfo.seriesDisplayText'
        }
      }
    },
    currentRank: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.titleInformation.rank.rankTypeDisplayText',
          displayText: 'appointmentInfo.titleInformation.rank.rankTypeDisplayText'
        }
      }
    },
    currentStep: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.titleInformation.step.stepTypeDescription',
          displayText: 'appointmentInfo.titleInformation.step.stepTypeDescription'
        }
      }
    },
    payrollSalary: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.payrollSalary',
          displayText: 'appointmentInfo.salaryInfo.payrollSalary'
        }
      }
    },
    nstpComp: {
      name: 'nstpComp',
      displayName: 'NSTP Component',
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.nstpComp',
          displayText: 'appointmentInfo.salaryInfo.nstpComp'
        }
      },
      visible: false
    },
    onScaleSalary: {
      displayName: 'Current On-Scale Amount',
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.onScaleSalary',
          displayText: 'appointmentInfo.salaryInfo.onScaleSalary'
        }
      }
    },
    offScaleAmount: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.offScaleAmount',
          displayText: 'appointmentInfo.salaryInfo.offScaleAmount'
        }
      }
    },
    offScalePercent: {
      visible: true,
      descriptionText: descriptions.current_off_scale_percentage,
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.offScalePercent',
          displayText: 'appointmentInfo.salaryInfo.offScalePercent'
        }
      }
    },
    currentBaseSalary: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.currentSalaryAmt',
          displayText: 'appointmentInfo.salaryInfo.currentSalaryAmt'
        }
      }
    },
    lastAdvancementActionEffectiveDt: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.lastAdvancementActionEffectiveDt',
          displayText: 'appointmentInfo.lastAdvancementActionEffectiveDt'
        }
      }
    },
    actionInProgress: {
      name: 'actionInProgress',
      displayName: 'Action in Progress',
      pathsInAPI: {
        appointment: {
          value: 'actionTypeInfo.actionTypeDisplayText',
          displayText: 'actionTypeInfo.actionTypeDisplayText'
        }
      },
      visible: true,
      dynamicFilterSearch: true
    },
    effectiveDate: {
      name: 'effectiveDate',
      displayName: 'Effective Date',
      pathsInAPI: {
        appointment: {
          value: 'effectiveDt',
          displayText: 'effectiveDt'
        }
      },
      transformDate: {
        from: 'MM/DD/YYYY',
        to: 'YYYY/MM/DD',
        pathToGetValue: 'effectiveDt',
        pathToSetValue: 'effectiveDate'
      },
      saveOriginalValueByKey: 'displayValue_effectiveDate',
      displayKey: 'displayValue_effectiveDate',
      visible: true
    },
    proposedSeries: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText',
          displayText: 'proposedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText'
        }
      }
    },
    proposedRank: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.titleInformation.rank.rankTypeDisplayText',
          displayText: 'proposedAppointmentInfo.titleInformation.rank.rankTypeDisplayText'
        }
      }
    },
    proposedStep: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.titleInformation.step.stepTypeDescription',
          displayText: 'proposedAppointmentInfo.titleInformation.step.stepTypeDescription'
        }
      }
    },
    proposedBaseSalary: {
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.salaryInfo.currentSalaryAmt',
          displayText: 'proposedAppointmentInfo.salaryInfo.currentSalaryAmt'
        }
      }
    },
    proposedOnScaleSalary: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.salaryInfo.onScaleSalary',
          displayText: 'proposedAppointmentInfo.salaryInfo.onScaleSalary'
        }
      }
    },
    proposedOffScaleAmount: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.salaryInfo.offScaleAmount',
          displayText: 'proposedAppointmentInfo.salaryInfo.offScaleAmount'
        }
      }
    },
    proposedOffScalePercent: {
      pathsInAPI: {
        appointment: {
          value: 'proposedAppointmentInfo.salaryInfo.offScalePercent',
          displayText: 'proposedAppointmentInfo.salaryInfo.offScalePercent'
        }
      }
    },
    changeInOffScaleAmount: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.changeInOffScaleAmount',
          displayText: 'appointmentInfo.salaryInfo.changeInOffScaleAmount'
        }
      },
      descriptionText: descriptions.changeInSalaryProposed
    },
    changeInOffScalePercent: {
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.salaryInfo.changeInOffScalePercent',
          displayText: 'appointmentInfo.salaryInfo.changeInOffScalePercent'
        }
      },
      descriptionText: descriptions.percentChangeInSalaryProposed
    },
    approvedSeries: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText',
          displayText: 'approvedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText'
        }
      }
    },
    approvedRank: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.titleInformation.rank.rankTypeDisplayText',
          displayText: 'approvedAppointmentInfo.titleInformation.rank.rankTypeDisplayText'
        }
      }
    },
    approvedStep: {
      visible: false,
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.titleInformation.step.stepTypeDescription',
          displayText: 'approvedAppointmentInfo.titleInformation.step.stepTypeDescription'
        }
      }
    },
    approvedSalaryAmt: {
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.salaryInfo.currentSalaryAmt',
          displayText: 'approvedAppointmentInfo.salaryInfo.currentSalaryAmt'
        }
      }
    },
    approvedOnScaleSalary: {
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.salaryInfo.onScaleSalary',
          displayText: 'approvedAppointmentInfo.salaryInfo.onScaleSalary'
        }
      }
    },
    approvedOffScaleAmount: {
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.salaryInfo.offScaleAmount',
          displayText: 'approvedAppointmentInfo.salaryInfo.offScaleAmount'
        }
      }
    },
    approvedOffScalePercent: {
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.salaryInfo.offScalePercent',
          displayText: 'approvedAppointmentInfo.salaryInfo.offScalePercent'
        }
      }
    },
    approvedChangeInOffScaleAmount: {
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.salaryInfo.changeInOffScaleAmount',
          displayText: 'approvedAppointmentInfo.salaryInfo.changeInOffScaleAmount'
        }
      },
      descriptionText: descriptions.changeInSalaryApproved
    },
    approvedChangeInOffScalePercent: {
      pathsInAPI: {
        appointment: {
          value: 'approvedAppointmentInfo.salaryInfo.changeInOffScalePercent',
          displayText: 'approvedAppointmentInfo.salaryInfo.changeInOffScalePercent'
        }
      },
      descriptionText: descriptions.percentChangeInSalaryApproved
    }
  }
};

export const config = createConfigFromTemplate(salaryConfig);
