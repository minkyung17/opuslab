import {dataViewTypes, image_folder} from '../DatatableConstants';
import {descriptions} from '../../../common/constants/Descriptions';
import {createConfigFromTemplate} from '../DatatableConfigTemplate';

/**
 *
 * @desc - Configuration constant for Active Endowed Chairs Page
 *
**/
export const incompleteEndowedChairsConfig = {
  grouperPathText: 'endowed_chair_view',
  exportToExcelBaseUrl: '/restServices/rest/ec/downloadEndowedChairsCSV',
  endowedChairStatusId: 6,
  url: '/restServices/rest/ec/getEndowedChairTable',
  newEndowedChairObjectUrl: '/restServices/rest/ec/newEndowedChair',
  saveNewEndowedChairUrl: '/restServices/rest/ec/saveEndowedChairDetail',
  unitSearchUrl: '/restServices/rest/admincomp/unitSearch/',
  dropdownUrl: '/restServices/rest/admincomp/newAdminComp',
  filtersUrl: '/restServices/rest/common/getDisplayPreferences',
  createUrl: '/restServices/rest/admincomp/createAdminCompData',
  editUrl: '/restServices/rest/admincomp/saveAdminCompData',
  deleteUrl: '/restServices/rest/admincomp/deleteAdminCompData',  
  getCommentsUrl: '/restServices/rest/ec/getEndowedChairComments',
  columnFilterKey: 'eligibleFilterMap',
  dataRowName: 'endowedChairDetailList',
  excelFileName: 'IncompleteEndowedChairs.csv',
  pageName: 'IncompletedEndowedChairs',
  csvPageName: 'endowedChairReport',
  exportData: descriptions.exportDataDefaultMessage,
  visibleColumnKey: 'visible',
  nameUrlLinkKey: 'name',
  rowImagePathKey: 'imageSrc',
  chairLink: '/opusWeb/ui/admin/endowed-chair-summary.shtml?endowedChairId=',
  nameImagePath: '../images/case-tiny.png',
  nameImageVarName: 'caseExist', 
  defaultFilterView: {
    savedPreferenceName: 'Opus Standard View',
    opusDefault: true,
    defaultPref: false,
    filters: {
      dataColumnFilters:{
        columnSortOrder: {endowedChairName: "asc"},
        columnStringMatch: {},
        columnValueOptions: {},
        outsideFilters: {},
        simpleFilters: {}
        },
        formattedColumnOptions: [
          {visible: false, name: "endowedChairId", displayName: "Endowed Chair ID"},
          {visible: true, name: "school", displayName: "School"},
          {visible: false, name: "division", displayName: "Division"},
          {visible: false, name: "department", displayName: "Department"},
          {visible: false, name: "area", displayName: "Area"},
          {visible: true, name: "organizationName", displayName: "Organization Name"},
          {visible: false, name: "dateEstablished", displayName: "Date Established"},
          {visible: true, name: "endowedChairType", displayName: "Chair Type"},
          {visible: false, name: "endowedChairTerm", displayName: "Chair Term"},
          {visible: false, name: "endowedChairTermRenewable", displayName: "Term Renewable"},
          {visible: false, name: "endowedChairFundingType", displayName: "Funding Type"},
          {visible: false, name: "designation", displayName: "Designation"},
          {visible: false, name: "lastOccupiedDate", displayName: "Date Chair Last Vacated"},
          {visible: false, name: "yearsUnoccupied", displayName: "# Years Unoccupied"},
          {visible: false, name: "opusId", displayName: "Opus ID"},
          {visible: true, name: "chairHolder", displayName: "Chair Holder"},
          {visible: true, name: "employeeStatus", displayName: "Employee Status"},
          {visible: false, name: "effectiveDate", displayName: "Chair Appt. Effective Date"},
          {visible: true, name: "endDate", displayName: "Chair Appt. End Date"},
          {visible: false, name: "seriesType", displayName: "Series at Time of Appt."},
          {visible: false, name: "rankType", displayName: "Rank at Time of Appt."},
          {visible: false, name: "comments", displayName: "Comments"}
              ]
    }
  },
  pagePermissions: {
    name: 'endowed_chair_view',
    action: 'view'
  },
  editAllocationsPermissions: {
    name: 'endowed_chair_edit',
    action: 'edit'
  },
  columnKeys: ["endowedChairId", "endowedChairName", "school", "division", "department",
  "area", "organizationName", "dateEstablished", "endowedChairType","endowedChairTerm",
  "endowedChairTermRenewable", "endowedChairFundingType", "designation", "lastOccupiedDate", "yearsUnoccupied", "opusId",
  "chairHolder", "employeeStatus", "effectiveDate", "endDate","seriesType","rankType","comments"],
  notSortable: ["endowedChairId", "designation", "opusId", "comments"],
//   omitUIColumns: ["comments"],
  invalidChangeColumnsOptions: ['edit', 'endowedChairName'],
  // These are the editable fields in the edit modal
  editableKeys: ['organizationName', 'stipend', 'ninths', 'ninthsAmount', 'fullTimeEquivalent'],
  //Columns will appear in array order shown here
  columnConfiguration: {
    endowedChairId: {
        name: "endowedChairId",
        displayName: "Endowed Chair ID",
        pathsInAPI: {
            appointment: {
                value: "endowedChairId",
                displayText: "endowedChairId"
            }
        },
        width: 125,
        visible: false,
        sortable: false,
        fixed: true
    },
    endowedChairName: {
        name: "endowedChairName",
        displayName: "Endowed Chair Name",
        viewType: dataViewTypes.nameLink,
        pathsInAPI: {
            appointment: {
                value: "endowedChairName",
                displayText: "endowedChairName"
            }
        },
        textSearch: true,
        displayKey: "displayValue_endowedChairName",
        width: 300,
        visible: true,
        sortable: true,
        sortDirection: "asc",
        fixed: true
    },
    school: {
        name: "school",
        displayName: "School",
        pathsInAPI: {
            appointment: {
                value: "school",
                displayText: "school"
            }
        },
        width: 250,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    division: {
        name: "division",
        displayName: "Division",
        pathsInAPI: {
            appointment: {
                value: "division",
                displayText: "division"
            }
        },
        width: 200,
        visible: false,        
        sortable: true,
        dynamicFilterSearch: true
    },
    department: {
        name: "department",
        displayName: "Department",
        pathsInAPI: {
            appointment: {
                value: "department",
                displayText: "department"
            }
        },
        width: 250,
        visible: false,
        sortable: true,
        dynamicFilterSearch: true
    },
    area: {
        name: "area",
        displayName: "Area",
        pathsInAPI: {
            appointment: {
                value: "area",
                displayText: "area"
            }
        },
        width: 200,
        visible: false,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.area
    },
    organizationName: {
        name: "organizationName",
        displayName: "Organization Name",
        pathsInAPI: {
            appointment: {
                value: "organizationName",
                displayText: "organizationName"
            }
        },
        width: 250,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.orgName
    },
    dateEstablished: {
        name: "dateEstablished",
        displayName: "Date Established",
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "dateEstablished",
                displayText: "dateEstablished"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "dateEstablished",
            pathToSetValue: "dateEstablished"
        },
        saveOriginalValueByKey: "displayValue_dateEstablished",
        displayKey: "displayValue_dateEstablished",
        width: 200,
        visible: false,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.dateEstablished
    },
    endowedChairType: {
        name: "endowedChairType",
        displayName: "Chair Type",
        pathsInAPI: {
            appointment: {
                value: "endowedChairType",
                displayText: "endowedChairType"
            }
        },
        width: 250,
        visible: true,
        sortable: true,
        descriptionText: descriptions.chairTypeForTables,
        placement: "right"          
    },
    endowedChairTerm: {
        name: "endowedChairTerm",
        displayName: "Chair Term",
        pathsInAPI: {
            appointment: {
                value: "endowedChairTerm",
                displayText: "endowedChairTerm"
            }
        },
        width: 150,
        visible: false,
        sortable: true,
        descriptionText: descriptions.chairTerm
    },
    endowedChairTermRenewable: {
        name: "endowedChairTermRenewable",
        displayName: "Term Renewable",
        pathsInAPI: {
            appointment: {
                value: "endowedChairTermRenewable",
                displayText: "endowedChairTermRenewable"
            }
        },
        width: 250,
        visible: false,
        sortable: true,
        descriptionText: descriptions.termRenewableForTables,
        placement: "right"
    },      
    endowedChairFundingType: {
        name: "endowedChairFundingType",
        displayName: "Funding Type",
        pathsInAPI: {
            appointment: {
                value: "endowedChairFundingType",
                displayText: "endowedChairFundingType"
            }
        },
        width: 250,
        visible: false,
        sortable: true,
        descriptionText: descriptions.fundingTypeForTables,
        placement: "right"
    },      
    designation: {
        name: "designation",
        displayName: "Designation",
        pathsInAPI: {
            appointment: {
                value: "designation",
                displayText: "designation"
            }
        },
        viewType: dataViewTypes.tooltip,
        width: 300,
        visible: false,
        sortable: false,
        descriptionText: descriptions.designation
    },  
    lastOccupiedDate: {
        name: "lastOccupiedDate",
        displayName: "Date Chair Last Vacated",
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "lastOccupiedDate",
                displayText: "lastOccupiedDate"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "lastOccupiedDate",
            pathToSetValue: "lastOccupiedDate"
        },
        saveOriginalValueByKey: "displayValue_lastOccupiedDate",
        displayKey: "displayValue_lastOccupiedDate",
        width: 150,
        visible: false,
        sortable: true,
        descriptionText: descriptions.lastOccupied
    },
    yearsUnoccupied: {
        name: "yearsUnoccupied",
        displayName: "# Years Unoccupied",
        pathsInAPI: {
            appointment: {
                value: "yearsUnoccupied",
                displayText: "yearsUnoccupied"
            }
        },
        width: 150,
        visible: false,
        sortable: true,
        descriptionText: descriptions.yearsUnoccupied
    },  
    opusId: {
        name: "opusId",
        displayName: "Opus ID",
        pathsInAPI: {
            appointment: {
                value: "opusId",
                displayText: "opusId"
            }
        },
        width: 125,
        visible: false,
        sortable: false
    },  
    chairHolder: {
        name: "chairHolder",
        displayName: "Chair Holder",
        pathsInAPI: {
            appointment: {
                value: "chairHolder",
                displayText: "chairHolder"
            }
        },
        dynamicFilterSearch: true,
        width: 250,
        visible: true,
        sortable: true,
        descriptionText: descriptions.chairHolder
    },
    employeeStatus: {
        name: "employeeStatus",
        displayName: "Employee Status",
        pathsInAPI: {
            appointment: {
                value: "employeeStatus",
                displayText: "employeeStatus"
            }
        },
        width: 250,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.empStatus
    },
    effectiveDate: {
        name: "effectiveDate",
        displayName: "Chair Appt. Effective Date",
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "effectiveDate",
                displayText: "effectiveDate"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "effectiveDate",
            pathToSetValue: "effectiveDate"
        },
        saveOriginalValueByKey: "displayValue_effectiveDate",
        displayKey: "displayValue_effectiveDate",
        width: 225,
        visible: false,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.chairApptEffDate
    },      
    endDate: {
        name: "endDate",
        displayName: "Chair Appt. End Date",
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "endDate",
                displayText: "endDate"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "endDate",
            pathToSetValue: "endDate"
        },
        saveOriginalValueByKey: "displayValue_endDate",
        displayKey: "displayValue_endDate",
        width: 225,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.chairApptEndDate
    },
    seriesType: {
        name: "seriesType",
        displayName: "Series at Time of Appt.",
        pathsInAPI: {
            appointment: {
                value: "seriesType",
                displayText: "seriesType"
            }
        },
        width: 225,
        visible: false,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.ecSeries
    }, 
    rankType: {
        name: "rankType",
        displayName: "Rank at Time of Appt.",
        pathsInAPI: {
            appointment: {
                value: "rankType",
                displayText: "rankType"
            }
        },
        width: 225,
        visible: false,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.ecRank
    }, 
    comments: {
        name: "comments",
        displayName: "Comments",
        viewType: dataViewTypes.commentClick,
        width: 100, 
        visible: false,
        sortable: false
    } 
}
};

export const config = createConfigFromTemplate(incompleteEndowedChairsConfig);
