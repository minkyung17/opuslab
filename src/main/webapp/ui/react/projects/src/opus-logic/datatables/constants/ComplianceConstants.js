import {dataViewTypes} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";


/*******************************************************************************
 * @desc - Configuration constant for Compliance
 *
 *
 *****************************************************************************/

export const searchCriteria = {
    categories: {
        senate: {
            displayName: "Senate",
            name: "senate"
        },
        nonsenate: {
            displayName: "Non-Senate",
            alternateFlag: "senate"
        },
        unit18: {
            displayName: "Unit 18",
            name: "isUnit18"
        },
        nonUnit18: {
            displayName: "Non-Unit 18",
            alternateFlag: "unit18"
        },
        hscp: {
            displayName: "HSCP",
            name: "isHscp"
        },
        nonhscp: {
            displayName: "Non-HSCP",
            alternateFlag: "hscp"
        }
    },
    affirmativeSearch: ["senate", "unit18", "hscp"],
    exclusionarySearch: ["nonsenate", "nonUnit18", "nonhscp"],
};

export const complianceReportConfig = {
    excelFileName: "VerifyCompliance.csv",
    grouperPathText: "compliance_view",
    exportToExcelBaseUrl: "/restServices/rest/",
    url: "/restServices/rest/compliance/getComplianceReport",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    //columnFilterKey: "eligibleFilterMap",
    dataRowName: "complianceReport",
    pageName: "ComplianceReport",
    visibleColumnKey: "visible",
    pagePermissions: {
        name: "compliance_view",
        action: "view"
    },
    activityStatusData: {
        satisfiedPercent : "0% (0)",
        assignedPercent : "0% (0)",
        overduePercent : "0% (0)"
    },
    defaultActivityStatusValue: "0% (0)",
    defaultFilterView: {
        savedPreferenceName: "Opus Standard View",
        opusDefault: true,
        defaultPref: false,
        filters: {
            dataColumnFilters:{
                columnSortOrder: {name: "asc"},
                columnStringMatch: {},
                columnValueOptions: {},
                outsideFilters: {},
                simpleFilters: {}
            },
            formattedColumnOptions: [
                {visible: false, name: "emplId", displayName: "Empl. ID"},
                {visible: false, name: "uid", displayName: "UID"},
                {visible: true, name: "name", displayName: "Name"},
                {visible: false, name: "opusId", displayName: "Opus ID"},
                {visible: false, name: "officialEmail", displayName: "Email"},
                {visible: true, name: "employeeStatus", displayName: "Employee Status"},
                {visible: false, name: "school", displayName: "School"},
                {visible: false, name: "division", displayName: "Division"},
                {visible: true, name: "department", displayName: "Department"},
                {visible: false, name: "area", displayName: "Area"},
                {visible: false, name: "specialty", displayName: "Specialty"},
                {visible: false, name: "ucPathDept", displayName: "UCPath Department"},
                {visible: false, name: "titleCode", displayName: "Title Code"},
                {visible: false, name: "title", displayName: "Title"},
                {visible: true, name: "series", displayName: "Series"},
                {visible: true, name: "rank", displayName: "Rank"},
                {visible: true, name: "activity", displayName: "Activity"},
                {visible: true, name: "activityStatus", displayName: "Activity Status"},
                {visible: true, name: "activityDueDate", displayName: "Activity Due Date"},
                {visible: true, name: "activityLastCompletedDate", displayName: "Activity Last Completed Date"}
                    ]
                }
            },
            columnKeys: ["emplId", "uid", "name", "opusId", "officialEmail", "employeeStatus",
            "school", "division","department","area","specialty", "ucPathDept", "titleCode", "title",
            "series", "rank", "activity", "activityStatus","activityDueDate","activityLastCompletedDate"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        emplId: {
            name: "emplId",
            displayName: "Empl. ID",
            pathsInAPI: {
                appointment: {
                    value: "emplId",
                    displayText: "emplId"
                }
            },
            width: 125,
            visible: false,
            sortable: true,
            fixed: true
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
            width: 125,
            visible: false,
            sortable: true,
            fixed: true
        },
        name: {
            name: "name",
            displayName: "Name",
            viewType: dataViewTypes.sortingText,
            pathsInAPI: {
                appointment: {
                    value: "name",
                    displayText: "name"
                }
            },
            displayKey: "displayValue_name",
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true
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
            sortable: true,
        },
        officialEmail: {
            name: "officialEmail",
            displayName: "Email",
            pathsInAPI: {
                appointment: {
                    value: "officialEmail",
                    displayText: "officialEmail"
                }
            },
            width: 200,
            visible: false,
            sortable: true,
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
            width: 200,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.employeeStatus
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
            width: 225,
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
            width: 200,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.department
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
            dynamicFilterSearch: true
        },
        specialty: {
            name: "specialty",
            displayName: "Specialty",
            pathsInAPI: {
                appointment: {
                    value: "specialty",
                    displayText: "specialty"
                }
            },
            width: 200,
            visible: false,
            sortable: true,
            dynamicFilterSearch: true
        },
        ucPathDept: {
            name: "ucPathDept",
            displayName: "UCPath Department",
            pathsInAPI: {
                appointment: {
                    value: "ucPathDept",
                    displayText: "ucPathDept"
                }
            },
            width: 200,
            visible: false,
            dynamicFilterSearch: true,
            sortable: true,
            descriptionText: descriptions.ucPathDept
        },
        titleCode: {
            name: "titleCode",
            displayName: "Title Code",
            pathsInAPI: {
                appointment: {
                    value: "titleCode",
                    displayText: "titleCode"
                }
            },
            width: 200,
            visible: false,
            dynamicFilterSearch: true,
            sortable: true
        },
        title: {
            name: "title",
            displayName: "Title",
            pathsInAPI: {
                appointment: {
                    value: "title",
                    displayText: "title"
                }
            },
            width: 200,
            visible: false,
            textSearch: true,
            sortable: true
        },
        series: {
            name: "series",
            displayName: "Series",
            pathsInAPI: {
                appointment: {
                    value: "series",
                    displayText: "series"
                }
            },
            width: 200,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        },
        rank: {
            name: "rank",
            displayName: "Rank",
            pathsInAPI: {
                appointment: {
                    value: "rank",
                    displayText: "rank"
                }
            },
            width: 200,
            visible: true,
            sortable: true
        },
        activity: {
            name: "activity",
            displayName: "Activity",
            pathsInAPI: {
                appointment: {
                    value: "activity",
                    displayText: "activity"
                }
            },
            width: 275,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.activity
        },
        activityStatus: {
            name: "activityStatus",
            displayName: "Activity Status",
            pathsInAPI: {
                appointment: {
                    value: "activityStatus",
                    displayText: "activityStatus"
                }
            },
            width: 200,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.activityStatus
        },
        activityDueDate: {
            name: "activityDueDate",
            displayName: "Activity Due Date",
            dataType: "date",
            pathsInAPI: {
                appointment: {
                    value: "activityDueDate",
                    displayText: "activityDueDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "activityDueDate",
                pathToSetValue: "activityDueDate"
            },
            saveOriginalValueByKey: "displayValue_activityDueDate",
            displayKey: "displayValue_activityDueDate",
            viewType: dataViewTypes.displayByKey,
            width: 200,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        },
        activityLastCompletedDate: {
            name: "activityLastCompletedDate",
            displayName: "Activity Last Completed Date",
            dataType: "date",
            pathsInAPI: {
                appointment: {
                    value: "activityLastCompletedDate",
                    displayText: "activityLastCompletedDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "activityLastCompletedDate",
                pathToSetValue: "activityLastCompletedDate"
            },
            saveOriginalValueByKey: "displayValue_activityLastCompletedDate",
            displayKey: "displayValue_activityLastCompletedDate",
            viewType: dataViewTypes.displayByKey,
            width: 250,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.activityLastCompletedDt
        }
    }
};

export const config = createConfigFromTemplate(complianceReportConfig);
