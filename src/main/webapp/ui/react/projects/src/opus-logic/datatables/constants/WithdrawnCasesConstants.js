import {image_folder, dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/*******************************************************************************
 * @desc - Configuration constant for WithdrawnCases Page
 *
 *
*******************************************************************************/
export const withdrawnCasesConfig = {
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCSV",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCases?timePeriod=null&apptStatus=all",
    apptStatus: "all",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesDataRows",
    excelFileName: "WithdrawnCases.csv",
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    caseType: "withdrawnCase",
    pageName: "Withdrawn",
    csvPageName: "Withdrawn",
    exportData: descriptions.exportDataDefaultMessage,
    visibleColumnKey: "visible",
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    defaultFilterView: {
        savedPreferenceName: "Opus Standard View",
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
        {visible: true, name: "appointmentStatus", displayName: "Appt. Status"},
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: false, name: "appointmentPctTime", displayName: "Current Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: false, name: "proposedYearsAccelerated", displayName: "Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Years Deferred"},
        {visible: false, name: "titleCode", displayName: "Current Title Code"},
        {visible: false, name: "titleName", displayName: "Current Title"},
        {visible: true, name: "currentSeries", displayName: "Current Series"},
        {visible: true, name: "currentRank", displayName: "Current Rank"},
        {visible: true, name: "currentStep", displayName: "Current Step"},
        {visible: false, name: "proposedTitleCode", displayName: "Proposed Title Code"},
        {visible: false, name: "proposedTitleName", displayName: "Proposed Title"},
        {visible: false, name: "proposedSeries", displayName: "Proposed Series"},
        {visible: true, name: "proposedRank", displayName: "Proposed Rank"},
        {visible: true, name: "proposedStep", displayName: "Proposed Step"},
        {visible: false, name: "proposedAppointmentPctTime", displayName: "Proposed Percent Time"},
        {visible: true, name: "proposedEffectiveDate", displayName: "Proposed Effective Date"},
        {visible: true, name: "caseLocation", displayName: "Case Location"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "apoAnalyst", displayName: "APO Analyst"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "delete", displayName: "Delete"},
        {visible: true, name: "reopen", displayName: "Reopen the Case"}
            ]
        }
    },
    columnConfigurationDefaults: {},
    columnViewConfigurationDefaults: {}, //Leave here. Dont delete
  //Columns will appear in array order shown here
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location", "actionType",
    "proposedYearsAccelerated", "proposedYearsDeferred", "titleCode", "titleName", "currentSeries", "currentRank",
    "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep", "proposedAppointmentPctTime",
    "proposedEffectiveDate", "caseLocation", "opusCreateDt", "interfolioCreateDt",
    "apoAnalyst", "interfolioLink", "bycUserId", "appointmentId", "caseId", "bycPacketId", "delete", "reopen"],
    omitUIColumns: ["interfolioLink"],
    invalidChangeColumnsOptions: ["edit"],
    columnConfiguration: {
        edit: {
            viewType: dataViewTypes.imageLink,
            imagePath: image_folder + "/edit-pencil.png",
            uiLayer: {},
            descriptionText: "View/Edit"
        },
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
        fullName: {
            name: "fullName",
            displayName: "Name",
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
            viewType: dataViewTypes.sortingText,
            displayKey: "displayValue_fullName",
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true
        },
        appointmentStatus: {
            name: "appointmentStatus",
            displayName: "Appt. Status",
            dataType: "options",
            optionsListName: "appointmentStatusType",
            pathsInAPI: {
                appointment: {
                    value: "appointmentStatus",
                    displayText: "appointmentStatus"
                }
            },
            visible: true
        },
        schoolName: {
            name: "schoolName",
            displayName: "School",
            pathsInAPI: {
                appointment: {
                    value: "schoolName",
                    displayText: "schoolName"
                }
            },
            optionsListName: "schoolList",
            width: 300,
            visible: false
        },
        divisionName: {
            name: "divisionName",
            displayName: "Division",
            pathsInAPI: {
                appointment: {
                    value: "divisionName",
                    displayText: "divisionName"
                }
            },
            optionsListName: "divisionList",
            visible: false
        },
        departmentName: {
            name: "departmentName",
            displayName: "Department",
            pathsInAPI: {
                appointment: {
                    value: "departmentName",
                    displayText: "departmentName"
                }
            },
            optionsListName: "departmentList",
            width: 250,
            visible: true
        },
        areaName: {
            name: "areaName",
            displayName: "Area",
            pathsInAPI: {
                appointment: {
                    value: "areaName",
                    displayText: "areaName"
                }
            },
            descriptionText: descriptions.area,
            optionsListName: "areaList"
        },
        specialtyName: {
            name: "specialtyName",
            displayName: "Specialty",
            pathsInAPI: {
                appointment: {
                    value: "specialtyName",
                    displayText: "specialtyName"
                }
            },
            descriptionText: descriptions.specialty,
            optionsListName: "specialtyList"
        },
        location: {
            name: "location",
            displayName: "Location",
            pathsInAPI: {
                appointment: {
                    value: "location",
                    displayText: "location"
                }
            },
            optionsListName: "orgLocationList",
            descriptionText: descriptions.location
        },
        affiliation: {
            name: "affiliation",
            displayName: "Affiliation",
            pathsInAPI: {
                appointment: {
                    value: "affiliation",
                    displayText: "affiliation"
                }
            },
            visible: true,
            width: 175,
            optionsListName: "affiliationTypeList",
            descriptionText: descriptions.affiliation
        },
        actionType: {
            name: "actionType",
            displayName: "Action Type",
            pathsInAPI: {
                appointment: {
                    value: "actionType",
                    displayText: "actionType"
                }
            },
            visible: true,
            optionsListName: "eligibilityActionTypeList"
        },
        proposedYearsAccelerated: {
            descriptionText: descriptions.years_accelerated,
            name: "proposedYearsAccelerated",
            displayName: "Years Accelerated",
            pathsInAPI: {
                appointment: {
                    value: "proposedYearsAccelerated",
                    displayText: "proposedYearsAccelerated"
                }
            }
        },
        proposedYearsDeferred: {
            descriptionText: descriptions.years_deferred,
            name: "proposedYearsDeferred",
            displayName: "Years Deferred",
            pathsInAPI: {
                appointment: {
                    value: "proposedYearsDeferred",
                    displayText: "proposedYearsDeferred"
                }
            }
        },
        titleCode: {
            name: "titleCode",
            displayName: "Current Title Code",
            pathsInAPI: {
                appointment: {
                    value: "titleCodeId",
                    displayText: "titleCode"
                }
            },
            dynamicFilterSearch: true
        //textSearch: true
        },
        titleName: {
            name: "titleName",
            displayName: "Current Title",
            pathsInAPI: {
                appointment: {
                    value: "titleName",
                    displayText: "titleName"
                }
            },
            textSearch: true
        },
        currentSeries: {
            name: "currentSeries",
            displayName: "Current Series",
            pathsInAPI: {
                appointment: {
                    value: "currentSeries",
                    displayText: "currentSeries"
                }
            },
            optionsListName: "seriesList",
            visible: true
        },
        currentRank: {
            name: "currentRank",
            displayName: "Current Rank",
            pathsInAPI: {
                appointment: {
                    value: "currentRank",
                    displayText: "currentRank"
                }
            },
            optionsListName: "rankList",
            width: 175,
            visible: true
        },
        currentStep: {
            name: "currentStep",
            displayName: "Current Step",
            pathsInAPI: {
                appointment: {
                    value: "currentStep",
                    displayText: "currentStep"
                }
            },
            optionsListName: "stepList",
            visible: true,
            width: 150
        },
        appointmentPctTime: {
            name: "appointmentPctTime",
            displayName: "Current Percent Time",
            pathsInAPI: {
                appointment: {
                    value: "appointmentPctTime",
                    displayText: "appointmentPctTime"
                }
            },
            viewType: dataViewTypes.percent,
            displayKey: "displayValue_appointmentPctTime",
            width: 150,
            visible: true,
            descriptionText: descriptions.percent_time
        },
        proposedTitleCode: {
            name: "proposedTitleCode",
            displayName: "Proposed Title Code",
            pathsInAPI: {
                appointment: {
                    value: "proposedTitleCodeId",
                    displayText: "proposedTitleCode"
                }
            },
            dynamicFilterSearch: true
        //textSearch: true
        },
        proposedTitleName: {
            name: "proposedTitleName",
            displayName: "Proposed Title",
            pathsInAPI: {
                appointment: {
                    value: "proposedTitleName",
                    displayText: "proposedTitleName"
                }
            },
            textSearch: true
        },
        proposedSeries: {
            name: "proposedSeries",
            displayName: "Proposed Series",
            pathsInAPI: {
                appointment: {
                    value: "proposedSeries",
                    displayText: "proposedSeries"
                }
            },
            optionsListName: "seriesList",
            width: 200,
            visible: false
        },
        proposedRank: {
            name: "proposedRank",
            displayName: "Proposed Rank",
            pathsInAPI: {
                appointment: {
                    value: "proposedRank",
                    displayText: "proposedRank"
                }
            },
            optionsListName: "rankList",
            width: 175,
            visible: true
        },
        proposedStep: {
            name: "proposedStep",
            displayName: "Proposed Step",
            pathsInAPI: {
                appointment: {
                    value: "proposedStep",
                    displayText: "proposedStep"
                }
            },
            optionsListName: "stepList",
            width: 175,
            visible: true
        },
        proposedAppointmentPctTime: {
            name: "proposedAppointmentPctTime",
            displayName: "Proposed Percent Time",
            pathsInAPI: {
                appointment: {
                    value: "proposedAppointmentPctTime",
                    displayText: "proposedAppointmentPctTime"
                }
            },
            viewType: dataViewTypes.percent,
            displayKey: "displayValue_proposedAppointmentPctTime",
            width: 150,
            visible: true,
            descriptionText: descriptions.percent_time
        },
        proposedEffectiveDate: {
            name: "proposedEffectiveDate",
            displayName: "Proposed Effective Date",
            descriptionText: descriptions.proposed_effective_date,
            pathsInAPI: {
                appointment: {
                    value: "proposedEffectiveDate",
                    displayText: "proposedEffectiveDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "proposedEffectiveDate",
                pathToSetValue: "proposedEffectiveDate"
            },
            saveOriginalValueByKey: "displayValue_proposedEffectiveDate",
            displayKey: "displayValue_proposedEffectiveDate",
            viewType: dataViewTypes.displayByKey,
            visible: true,
            dynamicFilterSearch: true,
            width: 225
        },
        caseLocation: {
            name: "caseLocation",
            displayName: "Case Location",
            pathsInAPI: {
                appointment: {
                    value: "caseLocation",
                    displayText: "caseLocation"
                }
            },
            visible: true,
            optionsListName: null,
            descriptionText: descriptions.case_location,
            dynamicFilterSearch: true
        },
        opusCreateDt: {
            name: "opusCreateDt",
            displayName: "Opus Creation Date",
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "opusCreateDt",
                    displayText: "opusCreateDt"
                }
            },
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "opusCreateDt",
                pathToSetValue: "opusCreateDt"
            },
            saveOriginalValueByKey: "displayValue_opusCreateDt",
            displayKey: "displayValue_opusCreateDt"
        },
        interfolioCreateDt: {
            name: "interfolioCreateDt",
            displayName: "Interfolio Creation Date",
            pathsInAPI: {
                appointment: {
                    value: "interfolioCreateDt",
                    displayText: "interfolioCreateDt"
                }
            },
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "interfolioCreateDt",
                pathToSetValue: "interfolioCreateDt"
            },
            saveOriginalValueByKey: "displayValue_interfolioCreateDt",
            displayKey: "displayValue_interfolioCreateDt",
            visible: true
        },
        apoAnalyst: {
            name: "apoAnalyst",
            displayName: "APO Analyst",
            // optionsListName: "apoAnalystList",
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "apoAnalyst",
                    displayText: "apoAnalyst"
                }
            }
        },
        interfolioLink: {
            name: "interfolioLink",
            sortable: false,
            viewType: dataViewTypes.interfolioLink,
            visible: true,
            displayName: "Go To Interfolio",
            descriptionText: descriptions.interfolioLink,
            pathsInAPI: {
                appointment: {
                    value: "bycCaseUrl",
                    displayText: "bycCaseUrl"
                }
            }
        },
        bycUserId: {
            name: "bycUserId",
            displayName: "RPT User ID",
            pathsInAPI: {
                value: "bycUserId",
                displayText: "bycUserId"
            }
        },
        appointmentId: {
            name: "appointmentId",
            displayName: "Appt. ID",
            pathsInAPI: {
                appointment: {
                    value: "appointmentId",
                    displayText: "appointmentId"
                }
            },
            width: 100
        },
        caseId: {
            name: "caseId",
            displayName: "Opus Case ID",
            pathsInAPI: {
                appointment: {
                    value: "caseId",
                    displayText: "caseId"
                }
            },
            width: 100
        },
        bycPacketId: {
            name: "bycPacketId",
            displayName: "Interfolio Packet ID",
            pathsInAPI: {
                appointment: {
                    value: "bycPacketId",
                    displayText: "bycPacketId"
                }
            },
            width: 100
        },
        delete: {
            name: "delete",
            sortable: false,
            viewType: dataViewTypes.button,
            visible: true,
            width: 175,
            action: "delete",
            buttonText: "Delete",
            displayName: "Delete",
            descriptionText: descriptions.delete
        },
        reopen: {
            name: "reopen",
            sortable: false,
            viewType: dataViewTypes.button,
            visible: true,
            width: 150,
            buttonText: "Reopen",
            displayName: "Reopen the Case"
        }
    }
};


export const config = createConfigFromTemplate(withdrawnCasesConfig);
