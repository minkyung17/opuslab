import {dataViewTypes} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";


/*******************************************************************************
 * @desc - Configuration constant for Eligibility
 *
 *
 *****************************************************************************/
export const eligibilityConfig = {
    excelFileName: "Eligibility.csv",
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/eligibles/downloadEligibilityCSV",
    url: "/restServices/rest/eligibles",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "eligibilityData",
    pageName: "Eligibility",
    exportData: descriptions.exportDataDefaultMessage,
    visibleColumnKey: "visible",
    permissionNames: {
        view_page: "8_year_clock",
        edit_page: "8_year_clock_edit_modal"
    },
    pagePermissions: {
        name: "eligrules",
        action: "view"
    },
    flags: {
        waiverFlag: "waiverFlag",
        mandatoryActionFlag: "mandatoryActionFlag"
    },
  // invertBooleanFilters: {//Used as a 'Set' just to check for keys
  //   //waiverFlag: 'present'
  // },
    wipeIfFilterEquals: {
        waiverFlag: false,
        mandatoryActionFlag: false
    },
    descriptions: {
        waiver: descriptions.waiver,
        affiliation: descriptions.affiliation
    },
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
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "academicYear", displayName: "Academic Year"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: true, name: "currentSeries", displayName: "Current Series"},
        {visible: true, name: "currentRankStep", displayName: "Current Rank/Step"},
        {visible: false, name: "yearsAtCurrentRank", displayName: "Years at Current Rank"},
        {visible: false, name: "yearsAtCurrentStep", displayName: "Years at Current Step"},
        {visible: true, name: "eligibleRankStep", displayName: "Eligible Rank/Step"},
        {visible: true, name: "effectiveDate", displayName: "Effective Date"}
            ]
        }
    },
    columnKeys: ["emplId", "uid", "name", "schoolName", "divisionName", "departmentName",
    "areaName", "specialtyName", "affiliation", "location", "academicYear", "actionType",
    "currentSeries", "currentRankStep", "yearsAtCurrentRank", "yearsAtCurrentStep",
    "eligibleRankStep", "effectiveDate"],
  //Columns will appear in array order shown here
    columnConfiguration: {
    //TODO take this out after refactor. Satish should be checking for "fullName"
    // and not "name" for exportToExcel
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
            fixed: true
        },
        name: {
            name: "name",
            displayName: "Name",
            viewType: dataViewTypes.sortingText,
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
            displayKey: "displayValue_name",
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true
        },
        schoolName: {
            pathsInAPI: {
                appointment: {
                    value: "schoolName",
                    displayText: "schoolName"
                }
            }
        },
        divisionName: {
            pathsInAPI: {
                appointment: {
                    value: "divisionName",
                    displayText: "divisionName"
                }
            }
        },
        departmentName: {
            pathsInAPI: {
                appointment: {
                    value: "departmentName",
                    displayText: "departmentName"
                }
            }
        },
        areaName: {
            pathsInAPI: {
                appointment: {
                    value: "areaName",
                    displayText: "areaName"
                }
            }
        },
        specialtyName: {
            pathsInAPI: {
                appointment: {
                    value: "specialtyName",
                    displayText: "specialtyName"
                }
            }
        },
        location: {
            pathsInAPI: {
                appointment: {
                    value: "location",
                    displayText: "location"
                }
            }
        },
        affiliation: {
            pathsInAPI: {
                appointment: {
                    value: "affiliation",
                    displayText: "affiliation"
                }
            }
        },
        academicYear: {
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "academicYear",
                    displayText: "academicYear"
                }
            }
        },
        actionType: {
            pathsInAPI: {
                appointment: {
                    value: "actionType",
                    displayText: "actionType"
                }
            },
            optionsListName: "eligibilityActionTypeList"
        },
        currentSeries: {
            pathsInAPI: {
                appointment: {
                    value: "currentSeries",
                    displayText: "currentSeries"
                }
            },
            optionsListName: "eligibilitySeriesString"
        },
        currentRankStep: {
            name: "currentRankStep",
            pathsInAPI: {
                appointment: {
                    value: "currentRankStep",
                    displayText: "currentRankStep"
                }
            },
            displayName: "Current Rank/Step",
            visible: true
        },
        yearsAtCurrentRank: {
            pathsInAPI: {
                appointment: {
                    value: "yearsAtCurrentRank",
                    displayText: "yearsAtCurrentRank"
                }
            }
        },
        yearsAtCurrentStep: {
            pathsInAPI: {
                appointment: {
                    value: "yearsAtCurrentStep",
                    displayText: "yearsAtCurrentStep"
                }
            }
        },
        eligibleRankStep: {
            name: "eligibleRankStep",
            pathsInAPI: {
                appointment: {
                    value: "eligibleRankStep",
                    displayText: "eligibleRankStep"
                }
            },
            displayName: "Eligible Rank/Step",
            visible: true
        },
        effectiveDate: {
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "YYYY-MM-DD",
                to: "MM/DD/YYYY",
                pathToGetValue: "effectiveDate",
                pathToSetValue: "displayValue"
            },
            displayKey: "displayValue",
            pathsInAPI: {
                appointment: {
                    value: "effectiveDate",
                    displayText: "effectiveDate"
                }
            }
        }
    }
};

export const config = createConfigFromTemplate(eligibilityConfig);
