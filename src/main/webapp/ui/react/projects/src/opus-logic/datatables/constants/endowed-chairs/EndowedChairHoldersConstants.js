import {dataViewTypes, image_folder} from '../DatatableConstants';
import {descriptions} from '../../../common/constants/Descriptions';
import {createConfigFromTemplate} from '../DatatableConfigTemplate';
/**
 *
 * @desc - Configuration constant for Endowed Chair Holders Page
 *
**/
export const endowedChairHoldersConfig = {
  grouperPathText: 'endowed_chair_view',
  exportToExcelBaseUrl: '/restServices/rest/ec/downloadEndowedChairDetailsCSV',
  endowedChairStatusId: 1,
  url: '/restServices/rest/ec/getEndowedChair',
  saveEndowedChairHolderUrl: '/restServices/rest/ec/saveECHA',
  newEndowedChairHolderUrl: '/restServices/rest/ec/newECHA',  
  rankOptionsUrl: '/restServices/rest/ec/getRank',
  newCommentsUrl: '/restServices/rest/ec/newEndowedChairComments',
  saveCommentsUrl: '/restServices/rest/ec/saveEndowedChairComments',
  getCommentsUrl: '/restServices/rest/ec/getECHAComments',
  filtersUrl: '/restServices/rest/common/getDisplayPreferences',
  columnFilterKey: 'eligibleFilterMap',
  dataRowName: 'endowedChairHolderAppointments',
  excelFileName: 'EndowedChairHolders.csv',
  pageName: 'endowedChairHolders',
  csvPageName: 'endowedChairHoldersReport',
  exportData: descriptions.exportDataDefaultMessage,
  visibleColumnKey: 'visible',
  nameUrlLinkKey: 'name',
  rowImagePathKey: 'imageSrc',
  linkToOpus: '/opusWeb/ui/admin/case-summary.shtml?',
  nameImagePath: '../images/case-tiny.png',
  nameImageVarName: 'activeCase', 
  pagePermissions: {
    name: 'endowed_chair_view',
    action: 'view'
  },
  editAllocationsPermissions: {
    name: 'endowed_chair_edit',
    action: 'edit'
  },
  columnKeys: ["edit", "activeCase","emplId","uid","chairHolder","opusId","employeeStatus","endowedChairAppointmentStatus","effectiveDate", "endDate","seriesType","rankType","linkedToOpusCase","comments"],
  dataColumnFilters: {
    columnSortOrder: {effectiveDate: "desc"}
  },
  invalidChangeColumnsOptions: ["activeCase", "edit"],
  omitUIColumns: ["activeCase", "edit"],
  //Columns will appear in array order shown here
  columnConfiguration: {
    edit: {
        name:"edit",
        viewType: dataViewTypes.disableImageClick,
        displayName: "",
        imagePath: image_folder + "/edit-pencil.png",
        uiLayer: {},
        fixed: false,
        descriptionText: "View/Edit"
    },
    activeCase: {
        name: "activeCase",
        showImageAsColumnTitle: true,
        headerImageSrc: image_folder + "case-tiny.png",
        imageTitleHoverText: descriptions.activeAppointmentForECHoldersTable,
        image: image_folder + "case-tiny.png",
        viewType: dataViewTypes.image,
        visible: true,
        sortable: false,
        fixed: false,
        width: 50
    },    
    emplId: {
        name: "emplId",
        displayName: "Empl ID",
        pathsInAPI: {
            appointment: {
                value: "emplId",
                displayText: "emplId"
            }
        },
        fixed: false,
        visible: false,
        sortable: true
    },  
    uid: {
        name: "uid",
        displayName: "UID",
        pathsInAPI: {
            appointment: {
                value: "uid",
                displayText: "uid"
            }
        },
        fixed: false,
        visible: false,
        sortable: true
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
        textSearch: true,
        visible: true,
        sortable: true,
        descriptionText: descriptions.chChairHolderForTables
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
        width: 100,
        visible: false,
        sortable: true
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
        visible: true,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.chEmpStatusForTables
    },
    endowedChairAppointmentStatus: {
        name: "endowedChairAppointmentStatus",
        displayName: "Chair Appt. Status",
        pathsInAPI: {
            appointment: {
                value: "endowedChairAppointmentStatus",
                displayText: "endowedChairAppointmentStatus"
            }
        },
        visible: true,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.chairApptStatusForTables
    },
    effectiveDate: {
        name: "effectiveDate",
        displayName: "Chair Appt. Effective Date",
        dataType: "date",
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
        visible: true,
        sortable: true,
        width: 150,
        sortDirection: "desc",
        descriptionText: descriptions.chChairApptEffDateForTables
    },     
    endDate: {
        name: "endDate",
        displayName: "Chair Appt. End Date",
        dataType: "date",
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
        visible: true,
        sortable: true,
        descriptionText: descriptions.chchairApptEndDateForTables
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
        visible: true,
        sortable: true,
        width: 220,
        dynamicFilterSearch: true,
        descriptionText: descriptions.chSeriesForTables
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
        visible: true,
        sortable: true,
        dynamicFilterSearch: true,
        descriptionText: descriptions.chRankForTables
    }, 
    linkedToOpusCase: {
        name: "linkedToOpusCase",
        displayName: "Link to Opus Case",
        viewType: dataViewTypes.linkToOpusCase,
        visible: true,
        sortable: false,
        descriptionText: descriptions.linkToOpusCase
    }, 
    comments: {
        name: "comments",
        displayName: "Comments",
        viewType: dataViewTypes.commentClick,
        visible: true,
        sortable: false,
        descriptionText: descriptions.chCommentsForTables
    }
}
};

export const config = createConfigFromTemplate(endowedChairHoldersConfig);
