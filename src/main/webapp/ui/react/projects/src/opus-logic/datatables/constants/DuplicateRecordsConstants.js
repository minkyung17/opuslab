import {createConfigFromTemplate} from './DatatableConfigTemplate';
import {dataViewTypes} from './DatatableConstants';

/**
 * @desc - Configuration constant for Duplicate Records
 *
 *
**/
export const duplicateRecordsConfig = {
  grouperPathText: 'eligibility',
  exportToExcelBaseUrl: '/restServices/rest/duplicate/downloadDuplicateRecordsCSV',
  excelFileName: 'DuplicateRecords.csv',
  bypassViewCheck: true,
  url: '/restServices/rest/duplicate/duplicateOpusPerson',
  mergeRecordsUrl: '/restServices/rest/duplicate/mergeOpusRecords/?',
  getFuzzyMatches: '/restServices/rest/duplicate/duplicateOpusPerson/',
  columnFilterKey: 'eligibleFilterMap',
  columnKeys: ['uid', 'fullName', 'departmentCode', 'hireDt', 'titleCode',
    'payrollTitle', 'employeeType', 'merge'],
  dataColumnFilters: {
    columnSortOrder: {fullName: 'asc'}
  },
  //Columns will appear in array order shown here
  columnConfiguration: {
    uid: {
      visible: true
    },
    departmentCode: {
      visible: true,
      name: 'departmentCode',
      displayName: 'Department Code',
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.academicHierarchyInfo.departmentCode',
          displayText: 'appointmentInfo.academicHierarchyInfo.departmentCode'
        }
      },
      dynamicFilterSearch: true
    },
    hireDt: {
      visible: true,
      width: 125
    },
    titleCode: {
      visible: true,
      dynamicFilterSearch: true
    },
    //This is an inconsistency - normally we populate titleName instead of payrollTitle
    payrollTitle: {
      visible: true,
      name: 'payrollTitle',
      displayName: 'Payroll Title',
      pathsInAPI: {
        appointment: {
          value: 'appointmentInfo.titleInformation.payrollTitle',
          displayText: 'appointmentInfo.titleInformation.payrollTitle'
        }
      },
      textSearch: true
    },
    employeeType: {
      visible: true,
      name: 'employeeType',
      displayName: 'Employee Type',
      pathsInAPI: {
        appointment: {
          value: 'appointeeInfo.employeeType',
          displayText: 'appointeeInfo.employeeType'
        }
      },
      dynamicFilterSearch: true
    },
    merge: {
      name: 'merge',
      sortable: false,
      viewType: dataViewTypes.button,
      visible: true,
      width: 175,
      buttonText: 'Resolve Record',
      displayName: 'Resolve Record'
    }
  }
};

export const config = createConfigFromTemplate(duplicateRecordsConfig);
