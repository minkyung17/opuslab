import {image_folder, dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";


/**
 * @desc - Configuration constant for ActiveCases Page
 *
**/
export const completedCasesConfig = {
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCSV",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCases?timePeriod=all&apptStatus=all",
    timePeriod: "year",
    apptStatus: "active",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesDataRows",
    excelFileName: "CompletedCases.csv",
    caseType: "completedCases",
    pageName: "Completed",
    csvPageName: "Completed",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    reopenCasesUrl: "/restServices/rest/activecase/reopenACase?",
    visibleColumnKey: "visible",
    defaultFilterView: {
        savedPreferenceName: "Opus Standard View",
        opusDefault: true,
        defaultPref: false,
        filters: {
            timePeriod: "year",
            dataColumnFilters:{
                columnSortOrder: {fullName: "asc"},
                columnStringMatch: {},
                columnValueOptions: {},
                outsideFilters: {5: true},
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
        {visible: false, name: "actionStatus", displayName: "Action Status"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: false, name: "approvedYearsAccelerated", displayName: "Years Accelerated"},
        {visible: false, name: "approvedYearsDeferred", displayName: "Years Deferred"},
        {visible: false, name: "titleCode", displayName: "Current Title Code"},
        {visible: false, name: "titleName", displayName: "Current Title"},
        {visible: false, name: "currentSeries", displayName: "Current Series"},
        {visible: false, name: "currentRank", displayName: "Current Rank"},
        {visible: false, name: "currentStep", displayName: "Current Step"},
        {visible: false, name: "proposedTitleCode", displayName: "Proposed Title Code"},
        {visible: false, name: "proposedTitleName", displayName: "Proposed Title"},
        {visible: false, name: "proposedSeries", displayName: "Proposed Series"},
        {visible: false, name: "proposedRank", displayName: "Proposed Rank"},
        {visible: false, name: "proposedStep", displayName: "Proposed Step"},
        {visible: false, name: "proposedAppointmentPctTime", displayName: "Proposed Percent Time"},
        {visible: true, name: "outcomeType", displayName: "Outcome"},
        {visible: false, name: "actionCompletedAcademicYear", displayName: "AY Completed"},
        {visible: false, name: "approvedEffectiveAcademicYear", displayName: "AY Effective"},
        {visible: true, name: "approvedEffectiveDate", displayName: "Effective Date"},
        {visible: false, name: "actionCompletedDt", displayName: "Completed Date"},
        {visible: false, name: "approvedTitleCode", displayName: "Approved Title Code"},
        {visible: false, name: "approvedTitleName", displayName: "Approved Title"},
        {visible: true, name: "approvedSeries", displayName: "Approved Series"},
        {visible: true, name: "approvedRank", displayName: "Approved Rank"},
        {visible: true, name: "approvedStep", displayName: "Approved Step"},
        {visible: false, name: "approvedAppointmentPctTime", displayName: "Approved Percent Time"},
        {visible: true, name: "approvedSalary", displayName: "Approved Salary"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "apoAnalyst", displayName: "APO Analyst"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "reopen", displayName: "Reopen the Case"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus",  "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location", "actionStatus",
    "actionType", "approvedYearsAccelerated", "approvedYearsDeferred", "titleCode", "titleName", "currentSeries",
    "currentRank", "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep", "proposedAppointmentPctTime",
    "outcomeType","actionCompletedAcademicYear", "approvedEffectiveAcademicYear", "approvedEffectiveDate", "actionCompletedDt", "approvedTitleCode", "approvedTitleName", "approvedSeries",
    "approvedRank", "approvedStep", "approvedAppointmentPctTime", "approvedSalary", "opusCreateDt",
    "interfolioCreateDt", "apoAnalyst", "interfolioLink", "bycUserId", "appointmentId", "caseId",
    "bycPacketId", "reopen"],
    omitUIColumns: ["interfolioLink"],
    invalidChangeColumnsOptions: ["edit"],
  //Columns will appear in array order shown here
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
            viewType: dataViewTypes.sortingText,
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
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
        actionCompletedAcademicYear: {
            name: "actionCompletedAcademicYear",
            displayName: "AY Completed",
            pathsInAPI: {
                actionInfo: {
                    value: "actionInfo.actionCompletedAcademicYear",
                    displayText: "actionInfo.actionCompletedAcademicYear"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 175,
            dataType: "input",
            editable: false,
            descriptionText: descriptions.AYcompleted
        },
        approvedEffectiveAcademicYear: {
            name: "approvedEffectiveAcademicYear",
            displayName: "AY Effective",
            pathsInAPI: {
                actionInfo: {
                    value: "actionInfo.approvedEffectiveAcademicYear",
                    displayText: "actionInfo.approvedEffectiveAcademicYear"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 175,
            dataType: "input",
            editable: false,
            descriptionText: descriptions.AYeffective
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
        actionStatus: {
            name: "actionStatus",
            displayName: "Action Status",
            dynamicFilterSearch: true,
            descriptionText: null,
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "actionStatus",
                    displayText: "actionStatus"
                }
            }
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
        approvedYearsAccelerated: {
            descriptionText: descriptions.years_accelerated,
            name: "approvedYearsAccelerated",
            displayName: "Years Accelerated",
            pathsInAPI: {
                appointment: {
                    value: "approvedYearsAccelerated",
                    displayText: "approvedYearsAccelerated"
                }
            }
        },
        approvedYearsDeferred: {
            descriptionText: descriptions.years_deferred,
            name: "approvedYearsDeferred",
            displayName: "Years Deferred",
            pathsInAPI: {
                appointment: {
                    value: "approvedYearsDeferred",
                    displayText: "approvedYearsDeferred"
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
            visible: false
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
            visible: false
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
            visible: false,
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
            visible: false
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
            visible: false
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
        outcomeType: {
            name: "outcomeType",
            displayName: "Outcome",
            optionsListName: "actionOutcomes",
            pathsInAPI: {
                appointment: {
                    value: "outcomeType",
                    displayText: "outcomeType"
                }
            },
            visible: true
        },
        actionCompletedAcademicYear: {
            name: "actionCompletedAcademicYear",
            displayName: "AY Completed",
            pathsInAPI: {
                actionInfo: {
                    value: "actionInfo.actionCompletedAcademicYear",
                    displayText: "actionInfo.actionCompletedAcademicYear"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 175,
            dataType: "input",
            editable: false,
            descriptionText: descriptions.AYcompleted
        },
        approvedEffectiveAcademicYear: {
            name: "approvedEffectiveAcademicYear",
            displayName: "AY Effective",
            pathsInAPI: {
                actionInfo: {
                    value: "actionInfo.approvedEffectiveAcademicYear",
                    displayText: "actionInfo.approvedEffectiveAcademicYear"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 175,
            dataType: "input",
            editable: false,
            descriptionText: descriptions.AYeffective
        },
        approvedEffectiveDate: {
            name: "approvedEffectiveDate",
            displayName: "Effective Date",
            pathsInAPI: {
                appointment: {
                    value: "approvedEffectiveDate",
                    displayText: "approvedEffectiveDate"
                }
            },
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "approvedEffectiveDate",
                pathToSetValue: "approvedEffectiveDate"
            },
            saveOriginalValueByKey: "displayValue_approvedEffectiveDate",
            displayKey: "displayValue_approvedEffectiveDate",
            visible: true,
            dynamicFilterSearch: true,
            width: 225
        },
        actionCompletedDt: {
            name: "actionCompletedDt",
            displayName: "Completed Date",
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "actionCompletedDt",
                    displayText: "actionCompletedDt"
                }
            },
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "actionCompletedDt",
                pathToSetValue: "actionCompletedDt"
            },
            saveOriginalValueByKey: "displayValue_actionCompletedDt",
            displayKey: "displayValue_actionCompletedDt"
        },
        approvedTitleCode: {
            name: "approvedTitleCode",
            displayName: "Approved Title Code",
            pathsInAPI: {
                appointment: {
                    value: "approvedTitleCodeId",
                    displayText: "approvedTitleCode"
                }
            },
            dynamicFilterSearch: true
        //textSearch: true
        },
        approvedTitleName: {
            name: "approvedTitleName",
            displayName: "Approved Title",
            pathsInAPI: {
                appointment: {
                    value: "approvedTitleName",
                    displayText: "approvedTitleName"
                }
            },
            textSearch: true
        },
        approvedSeries: {
            name: "approvedSeries",
            displayName: "Approved Series",
            pathsInAPI: {
                appointment: {
                    value: "approvedSeries",
                    displayText: "approvedSeries"
                }
            },
            optionsListName: "seriesList",
            visible: true
        },
        approvedRank: {
            name: "approvedRank",
            displayName: "Approved Rank",
            pathsInAPI: {
                appointment: {
                    value: "approvedRank",
                    displayText: "approvedRank"
                }
            },
            optionsListName: "rankList",
            visible: true
        },
        approvedStep: {
            name: "approvedStep",
            displayName: "Approved Step",
            pathsInAPI: {
                appointment: {
                    value: "approvedStep",
                    displayText: "approvedStep"
                }
            },
            optionsListName: "stepList",
            visible: true
        },
        approvedAppointmentPctTime: {
            name: "approvedAppointmentPctTime",
            displayName: "Approved Percent Time",
            pathsInAPI: {
                appointment: {
                    value: "approvedAppointmentPctTime",
                    displayText: "approvedAppointmentPctTime"
                }
            },
            viewType: dataViewTypes.percent,
            displayKey: "displayValue_approvedAppointmentPctTime",
            width: 150,
            visible: true,
            descriptionText: descriptions.percent_time
        },
        approvedSalary: {
            name: "approvedSalary",
            displayName: "Approved Salary",
            pathsInAPI: {
                appointment: {
                    value: "approvedSalary",
                    displayText: "approvedSalary"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_approvedSalary",
            visible: true
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
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "interfolioCreateDt",
                    displayText: "interfolioCreateDt"
                }
            },
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

export const config = createConfigFromTemplate(completedCasesConfig);

export const timePeriods = [
    {
        name: "month",
        value: "month"
    },
    {
        name: "year",
        value: "year"
    },
    {
        name: "two years",
        value: "twoyears"
    },
    {
        name: "five years",
        value: "fiveyears"
    },
    {
        name: "show all",
        value: "all"
    }
];
