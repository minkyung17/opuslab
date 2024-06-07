import {dataViewTypes} from './DatatableConstants';
import {descriptions} from '../../common/constants/Descriptions';
import {createConfigFromTemplate} from './DatatableConfigTemplate';

/**
 *
 * @desc - Configuration constant for Administrative Allocations Page
 *
**/
export const allocationsConfiguration = {
  grouperPathText: 'eligibility',
  exportToExcelBaseUrl: '/restServices/rest/admincomp/downloadAdminCompCSV',
  url: '/restServices/rest/admincomp/adminCompScreenData',
  unitSearchUrl: '/restServices/rest/admincomp/unitSearch/',
  dropdownUrl: '/restServices/rest/admincomp/newAdminComp',
  filtersUrl: '/restServices/rest/common/getDisplayPreferences',
  createUrl: '/restServices/rest/admincomp/createAdminCompData',
  editUrl: '/restServices/rest/admincomp/saveAdminCompData',
  deleteUrl: '/restServices/rest/admincomp/deleteAdminCompData',
  columnFilterKey: 'eligibleFilterMap',
  dataRowName: 'adminCompRows',
  excelFileName: 'Administrative Allocations',
  pageName: 'AdminComp',
  csvPageName: 'AdminComp',
  visibleColumnKey: 'visible',
  defaultFilterView: {
    savedPreferenceName: 'Opus Standard View',
    opusDefault: true,
    defaultPref: false,
    filters: {
      dataColumnFilters:{
        columnSortOrder: {academicYear: "desc", schoolName: "asc",
          divisionName: "asc", departmentName: "asc", titleDescription: "asc"},
        columnStringMatch: {},
        columnValueOptions: {},
        outsideFilters: {},
        simpleFilters: {}
        },
      formattedColumnOptions: [
        {visible: true, name: "academicYear", displayName: "Academic Year"},
        {visible: true, name: "schoolName", displayName: "School"},
        {visible: true, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: true, name: "organizationName", displayName: "Organization Name"},
        {visible: true, name: "titleDescription", displayName: "Title"},
        {visible: true, name: "stipend", displayName: "Stipends"},
        {visible: true, name: "ninths", displayName: "9ths"},
        {visible: true, name: "ninthsAmount", displayName: "9ths Amount"},
        {visible: true, name: "fullTimeEquivalent", displayName: "FTE"},
        {visible: true, name: "delete", displayName: "Delete"}
      ]
    }
  },
  pagePermissions: {
    name: 'admin_comp_allocations_view',
    action: 'view'
  },
  editAllocationsPermissions: {
    name: 'admin_comp_allocations_edit',
    action: 'edit'
  },
  columnKeys: ['edit', 'academicYear', 'schoolName', 'divisionName', 'departmentName', 'organizationName', 'titleDescription',
    'stipend', 'ninths', 'ninthsAmount', 'fullTimeEquivalent', 'delete'],
  invalidChangeColumnsOptions: ['edit'],
  // These are the editable fields in the edit modal
  editableKeys: ['organizationName', 'stipend', 'ninths', 'ninthsAmount', 'fullTimeEquivalent'],
  //Columns will appear in array order shown here
  columnConfiguration: {
    edit: {
      uiLayer: {},
      viewType: dataViewTypes.disableImageClick,
      descriptionText: 'Edit',
      imageText: 'Edit'
    },
    academicYear: {
      name: 'academicYear',
      displayName: 'Academic Year',
      pathsInAPI: {
          appointment: {
          value: 'academicYear',
          displayText: 'academicYear'
          }
      },
      dynamicFilterSearch: true,
      visible: true,
      width: 175,
      dataType: 'input',
      editable: false
    },
    schoolName: {
      name: 'schoolName',
      displayName: 'School',
      pathsInAPI: {
        appointment: {
          value: 'school',
          displayText: 'school'
        }
      },
      visible: true,
      optionsListName: 'schoolList',
      width: 300
    },
    divisionName: {
      name: 'divisionName',
      displayName: 'Division',
      pathsInAPI: {
        appointment: {
          value: 'division',
          displayText: 'division'
        }
      },
      visible: true,
      optionsListName: 'divisionList'
    },
    departmentName: {
      name: 'departmentName',
      displayName: 'Department',
      pathsInAPI: {
        appointment: {
          value: 'department',
          displayText: 'department'
        }
      },
      optionsListName: 'departmentList',
      width: 250,
      visible: true
    },
    organizationName: {
      name: 'organizationName',
      displayName: 'Organization Name',
      pathsInAPI: {
        appointment: {
          value: 'organizationName',
          displayText: 'organizationName'
        }
      },
      visible: true,
      dynamicFilterSearch: true,
      // optionsListName: 'schoolList',
      width: 300,
      descriptionText: descriptions.organizationNameForAllocations,
      viewType: dataViewTypes.tooltip
    },
    titleDescription: {
      name: 'titleDescription',
      displayName: 'Title',
      pathsInAPI: {
        appointment: {
          value: 'titleDescription',
          displayText: 'titleDescription'
        }
      },
      visible: true,
      dynamicFilterSearch: true,
      descriptionText: descriptions.titleForAllocations
        //textSearch: true
    },
    // 'stipend', 'ninth', 'fte'
    stipend: {
      name: 'stipend',
      displayName: 'Stipend',
      width: 125,
      pathsInAPI: {
          appointment: {
            value: 'stipend',
            displayText: 'stipend'
          }
      },
      visible: true,
      viewType: dataViewTypes.money,
      displayKey: 'displayValue_stipend',
      descriptionText: descriptions.stipendForAllocations
    },
    ninths: {
      name: 'ninths',
      displayName: '9ths',
      width: 125,
      pathsInAPI: {
          appointment: {
            value: 'ninths',
            displayText: 'ninths'
          }
      },
      visible: true,
      descriptionText: descriptions.ninthsForAllocations
    },
    ninthsAmount: {
      name: 'ninthsAmount',
      displayName: '9ths Amount',
      viewType: dataViewTypes.money,
      width: 125,
      displayKey: 'displayValue_ninthsAmount',
      pathsInAPI: {
          appointment: {
            value: 'ninthsAmount',
            displayText: 'ninthsAmount'
          }
      },
      visible: true,
      descriptionText: descriptions.ninthsAmountForAllocations
    },
    fullTimeEquivalent: {
      name: 'fullTimeEquivalent',
      displayName: 'FTE',
      width: 125,
      pathsInAPI: {
          appointment: {
            value: 'fullTimeEquivalent',
            displayText: 'fullTimeEquivalent'
          }
      },
      visible: true,
      descriptionText: descriptions.fullTimeEquivalentForAllocations
    },
    delete: {
        name: "delete",
        sortable: false,
        viewType: dataViewTypes.deleteButton,
        visible: true,
        width: 95,
        buttonText: "Delete",
        displayName: "Delete",
    }
  }
};

export const config = createConfigFromTemplate(allocationsConfiguration);
