import {image_folder, dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/**
 * @desc - Default Queue Configuration constant for when Cases at my Office loads
 *
**/
export const defaultConfig = {
    queueName: "Default",
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCaseAtMyOffice",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCasesAtMyOffice?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesAtMyOfficeList",
    excelFileName: "Queue.csv",
    caseType: "defaultQueue",
    pageName: "defaultQueue",
    csvPageName: "Default",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    visibleColumnKey: "visible",
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
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: false, name: "proposedYearsAccelerated", displayName: "Proposed Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Proposed Years Deferred"},
        {visible: true, name: "currentSeries", displayName: "Current Series"},
        {visible: true, name: "currentRank", displayName: "Current Rank"},
        {visible: true, name: "currentStep", displayName: "Current Step"},
        {visible: false, name: "proposedSeries", displayName: "Proposed Series"},
        {visible: true, name: "proposedRank", displayName: "Proposed Rank"},
        {visible: true, name: "proposedStep", displayName: "Proposed Step"},
        {visible: true, name: "proposedEffectiveDate", displayName: "Proposed Effective Date"},
        {visible: false, name: "caseLocation", displayName: "Case Location"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "location",
    "actionType", "proposedYearsAccelerated", "proposedYearsDeferred", "currentSeries",
    "currentRank", "currentStep", "proposedSeries", "proposedRank", "proposedStep",
    "proposedEffectiveDate", "caseLocation"],
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
            displayName: "Proposed Years Accelerated",
            visible: false,
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
            displayName: "Proposed Years Deferred",
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "proposedYearsDeferred",
                    displayText: "proposedYearsDeferred"
                }
            }
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
        proposedEffectiveDate: {
            name: "proposedEffectiveDate",
            displayName: "Proposed Effective Date",
            viewType: dataViewTypes.displayByKey,
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
            visible: true
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
            visible: false,
            dynamicFilterSearch: true
        }
    }
};

export const config = createConfigFromTemplate(defaultConfig);

/**
 * @desc - APO Queue Configuration constant for Cases at my Office Page
 *
**/
export const apoQueueConfiguration = {
    queueName: "APO",
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCaseAtMyOffice",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCasesAtMyOffice?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesAtMyOfficeList",
    excelFileName: "APO Queue.csv",
    caseType: "apoQueue",
    pageName: "apoQueue",
    csvPageName: "APO",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    visibleColumnKey: "visible",
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
        {visible: false, name: "proposedYearsAccelerated", displayName: "Proposed Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Proposed Years Deferred"},
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
        {visible: false, name: "caseLocation", displayName: "Case Location"},
        {visible: true, name: "currentWorkFlowStep", displayName: "Current Workflow Step"},
        {visible: true, name: "currentAssignedCommittee", displayName: "Current Assigned Committee"},
        {visible: true, name: "daysAtCurrentStep", displayName: "Days at Current Step"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "templateName", displayName: "Interfolio Template"},
        {visible: true, name: "status", displayName: "Interfolio Case Status"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: true, name: "apoPostAudit", displayName: "APO: Post Audit"},
        {visible: true, name: "apoAuditSubmitToCAP", displayName: "APO: Audit"},
        {visible: true, name: "viceChancellorDecisionOnRC", displayName: "Vice Chancellor: Decision on RC"},
        {visible: false, name: "apoAssignCaseToRC", displayName: "APO: Assign Case to RC"},
        {visible: false, name: "rcReview", displayName: "RC Review"},
        {visible: false, name: "apoReviewResubmitToCAP", displayName: "APO: Review & Resubmit to CAP"},
        {visible: true, name: "apoReviewSubmitToVCAP", displayName: "APO: Review & Submit to VC-AP"},
        {visible: true, name: "viceChancellorsReview", displayName: "Vice Chancellor\'s Review"},
        {visible: true, name: "apoSendDocumentsToDeansOffice", displayName: "APO: Send Documents to Dean\'s Office"},
        {visible: true, name: "apoCompleteTheCaseInOpus", displayName: "APO: Complete the Case in Opus"},
        {visible: false, name: "departmentAnalyst", displayName: "Department Analyst"},
        {visible: false, name: "deansOfficeAnalyst", displayName: "Dean's Office Analyst"},
        {visible: true, name: "apoAnalyst", displayName: "APO Analyst"},
        {visible: true, name: "apoAnalystCaseAssignDate", displayName: "APO Analyst Assign Date"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "delete", displayName: "Delete/Withdraw"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location",
    "actionType", "proposedYearsAccelerated", "proposedYearsDeferred", "titleCode", "titleName", "currentSeries",
    "currentRank", "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep",
    "proposedAppointmentPctTime", "proposedEffectiveDate", "caseLocation", "currentWorkFlowStep", "currentAssignedCommittee",
    "daysAtCurrentStep", "opusCreateDt", "interfolioCreateDt", "templateName", "status",
    "interfolioLink", "apoPostAudit", "apoAuditSubmitToCAP", "viceChancellorDecisionOnRC", "apoAssignCaseToRC", "rcReview",
    "apoReviewResubmitToCAP", "apoReviewSubmitToVCAP", "viceChancellorsReview", "apoSendDocumentsToDeansOffice",
    "apoCompleteTheCaseInOpus", "departmentAnalyst", "deansOfficeAnalyst", "apoAnalyst","apoAnalystCaseAssignDate", "bycUserId", "appointmentId", "caseId", "bycPacketId", "delete"],
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
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true,
            sortDirection: "asc"
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
            visible: false,
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
            displayName: "Proposed Years Accelerated",
            visible: false,
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
            displayName: "Proposed Years Deferred",
            visible: false,
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
            viewType: dataViewTypes.displayByKey,
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
            visible: true
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
            visible: false,
            dynamicFilterSearch: true
        },
        currentWorkFlowStep: {
            name: "currentWorkFlowStep",
            displayName: "Current Workflow Step",
            pathsInAPI: {
                appointment: {
                    value: "currentWorkFlowStep",
                    displayText: "currentWorkFlowStep"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        currentAssignedCommittee: {
            name: "currentAssignedCommittee",
            displayName: "Current Assigned Committee",
            pathsInAPI: {
                appointment: {
                    value: "currentAssignedCommittee",
                    displayText: "currentAssignedCommittee"
                }
            },
            visible: true,
            width: 300,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.tooltip
        },
        daysAtCurrentStep: {
            name: "daysAtCurrentStep",
            displayName: "Days at Current Step",
            pathsInAPI: {
                appointment: {
                    value: "daysAtCurrentStep",
                    displayText: "daysAtCurrentStep"
                }
            },
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
        templateName: {
            name: "templateName",
            displayName: "Interfolio Template",
            pathsInAPI: {
                appointment: {
                    value: "templateName",
                    displayText: "templateName"
                }
            },
            visible: false,
            dynamicFilterSearch: true
        },
        status: {
            name: "status",
            displayName: "Interfolio Case Status",
            visible: true,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "actionStatus",
                    displayText: "status"
                }
            },
        },
        interfolioLink: {
            name: "interfolioLink",
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
        apoPostAudit: {
            name: "apoPostAudit",
            displayName: "APO: Post-Audit",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "APO: Post-Audit",
                    displayText: "apoPostAudit"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoPostAudit",
                    pathToSetValue: "apoPostAudit"
                },
            saveOriginalValueByKey: "displayValue_apoPostAudit",
            displayKey: "displayValue_apoPostAudit",
            opusKey: 0
        },
        apoAuditSubmitToCAP: {
            name: "apoAuditSubmitToCAP",
            displayName: "APO: Audit",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoAuditSubmitToCAP",
                    displayText: "apoAuditSubmitToCAP"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoAuditSubmitToCAP",
                    pathToSetValue: "apoAuditSubmitToCAP"
                },
            saveOriginalValueByKey: "displayValue_apoAuditSubmitToCAP",
            displayKey: "displayValue_apoAuditSubmitToCAP",
            opusKey: 1
        },
        viceChancellorDecisionOnRC: {
            name: "viceChancellorDecisionOnRC",
            displayName: "Vice Chancellor: Decision on RC",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "viceChancellorDecisionOnRC",
                    displayText: "viceChancellorDecisionOnRC"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "viceChancellorDecisionOnRC",
                    pathToSetValue: "viceChancellorDecisionOnRC"
                },
            saveOriginalValueByKey: "displayValue_viceChancellorDecisionOnRC",
            displayKey: "displayValue_viceChancellorDecisionOnRC",
            opusKey: 2
        },
        apoAssignCaseToRC: {
            name: "apoAssignCaseToRC",
            displayName: "APO: Assign Case to RC",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoAssignCaseToRC",
                    displayText: "apoAssignCaseToRC"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoAssignCaseToRC",
                    pathToSetValue: "apoAssignCaseToRC"
                },
            saveOriginalValueByKey: "displayValue_apoAssignCaseToRC",
            displayKey: "displayValue_apoAssignCaseToRC",
            opusKey: 3
        },
        rcReview: {
            name: "rcReview",
            displayName: "RC Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "rcReview",
                    displayText: "rcReview"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "rcReview",
                    pathToSetValue: "rcReview"
                },
            saveOriginalValueByKey: "displayValue_rcReview",
            displayKey: "displayValue_rcReview",
            opusKey: 4
        },
        apoReviewResubmitToCAP: {
            name: "apoReviewResubmitToCAP",
            displayName: "APO: Review & Resubmit to CAP",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoReviewResubmitToCAP",
                    displayText: "apoReviewResubmitToCAP"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoReviewResubmitToCAP",
                    pathToSetValue: "apoReviewResubmitToCAP"
                },
            saveOriginalValueByKey: "displayValue_apoReviewResubmitToCAP",
            displayKey: "displayValue_apoReviewResubmitToCAP",
            opusKey: 5
        },
        apoReviewSubmitToVCAP: {
            name: "apoReviewSubmitToVCAP",
            displayName: "APO: Review & Submit to VC-AP",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoReviewSubmitToVC",
                    displayText: "apoReviewSubmitToVC"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoReviewSubmitToVC",
                    pathToSetValue: "apoReviewSubmitToVC"
                },
            saveOriginalValueByKey: "displayValue_apoReviewSubmitToVC",
            displayKey: "displayValue_apoReviewSubmitToVC",
            opusKey: 6
        },
        viceChancellorsReview: {
            name: "viceChancellorsReview",
            displayName: "Vice Chancellor's Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "viceChancellorsReview",
                    displayText: "viceChancellorsReview"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "viceChancellorsReview",
                    pathToSetValue: "viceChancellorsReview"
                },
            saveOriginalValueByKey: "displayValue_viceChancellorsReview",
            displayKey: "displayValue_viceChancellorsReview",
            opusKey: 7
        },
        apoSendDocumentsToDeansOffice: {
            name: "apoSendDocumentsToDeansOffice",
            displayName: "APO: Send Documents to Dean's Office",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoSendDocumentsToDeansOffice",
                    displayText: "apoSendDocumentsToDeansOffice"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoSendDocumentsToDeansOffice",
                    pathToSetValue: "apoSendDocumentsToDeansOffice"
                },
            saveOriginalValueByKey: "displayValue_apoSendDocumentsToDeansOffice",
            displayKey: "displayValue_apoSendDocumentsToDeansOffice",
            opusKey: 8
        },
        apoCompleteTheCaseInOpus: {
            name: "apoCompleteTheCaseInOpus",
            displayName: "APO: Complete the Case in Opus",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoCompleteTheCaseInOpus",
                    displayText: "apoCompleteTheCaseInOpus"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "apoCompleteTheCaseInOpus",
                    pathToSetValue: "apoCompleteTheCaseInOpus"
                },
            saveOriginalValueByKey: "displayValue_apoCompleteTheCaseInOpus",
            displayKey: "displayValue_apoCompleteTheCaseInOpus",
            opusKey: 9
        },
        departmentAnalyst: {
            name: "departmentAnalyst",
            displayName: "Department Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "departmentAnalyst",
                    displayText: "departmentAnalyst"
                }
            }
        },
        deansOfficeAnalyst: {
            name: "deansOfficeAnalyst",
            displayName: "Dean's Office Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeAnalyst",
                    displayText: "deansOfficeAnalyst"
                }
            }
        },
        apoAnalyst: {
            name: "apoAnalyst",
            displayName: "APO Analyst",
            visible: true,
            // optionsListName: "apoAnalystList",
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "apoAnalyst",
                    displayText: "apoAnalyst"
                }
            }
        },
        apoAnalystCaseAssignDate: {
            name: "apoAnalystCaseAssignDate",
            displayName: "APO Analyst Assign Date",
            visible: true,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "apoAnalystCaseAssignDate",
                    displayText: "apoAnalystCaseAssignDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "apoAnalystCaseAssignDate",
                pathToSetValue: "apoAnalystCaseAssignDate"
            },
            saveOriginalValueByKey: "displayValue_apoAnalystCaseAssignDate",
            displayKey: "displayValue_apoAnalystCaseAssignDate",
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
            visible: false,
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
            visible: false,
            width: 100
        },
        bycPacketId: {
            name: "bycPacketId",
            displayName: "Interfolio Packet ID",
            visible: false,
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
            buttonText: "Delete/Withdraw",
            displayName: "Delete/Withdraw",
            descriptionText: descriptions.deleteAndWithdraw
        }
    }
};

export const apoQueueConfig = createConfigFromTemplate(apoQueueConfiguration);

/**
 * @desc - Dean's Office Queue Configuration constant for Cases at my Office Page
 *
**/
export const deansOfficeQueueConfiguration = {
    queueName: "Dean's Office",
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCaseAtMyOffice",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCasesAtMyOffice?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesAtMyOfficeList",
    excelFileName: "Dean's Office Queue.csv",
    caseType: "deansOfficeQueue",
    pageName: "deansOfficeQueue",
    csvPageName: "Dean's Office",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    visibleColumnKey: "visible",
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
        {visible: false, name: "proposedYearsAccelerated", displayName: "Proposed Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Proposed Years Deferred"},
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
        {visible: false, name: "caseLocation", displayName: "Case Location"},
        {visible: true, name: "currentWorkFlowStep", displayName: "Current Workflow Step"},
        {visible: true, name: "currentAssignedCommittee", displayName: "Current Assigned Committee"},
        {visible: true, name: "daysAtCurrentStep", displayName: "Days at Current Step"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "templateName", displayName: "Interfolio Template"},
        {visible: false, name: "status", displayName: "Interfolio Case Status"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: true, name: "deansOfficeAudit", displayName: "Dean's Office: Audit"},
        {visible: true, name: "deansReview", displayName: "Dean's Review"},
        {visible: true, name: "deansOfficeEnterApprovalInOpus", displayName: "Dean's Office: Enter Approval in Opus"},
        {visible: true, name: "deansOfficeFinalizeAndSubmitToAPO", displayName: "Dean's Office: Finalize & Submit to APO"},
        {visible: false, name: "departmentAnalyst", displayName: "Department Analyst"},
        {visible: false, name: "deansOfficeAnalyst", displayName: "Dean's Office Analyst"},
        {visible: false, name: "deanAnalystCaseAssignDate", displayName: "Dean's Office Analyst Assign Date"},
        {visible: false, name: "apoAnalyst", displayName: "APO Analyst"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "delete", displayName: "Delete/Withdraw"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location",
    "actionType", "proposedYearsAccelerated", "proposedYearsDeferred", "titleCode", "titleName", "currentSeries",
    "currentRank", "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep",
    "proposedAppointmentPctTime", "proposedEffectiveDate", "caseLocation", "currentWorkFlowStep", "currentAssignedCommittee",
    "daysAtCurrentStep", "opusCreateDt", "interfolioCreateDt", "templateName", "status",
    "interfolioLink", "deansOfficeAudit", "deansReview", "deansOfficeEnterApprovalInOpus",
    "deansOfficeFinalizeAndSubmitToAPO", "departmentAnalyst", "deansOfficeAnalyst", "deanAnalystCaseAssignDate",
    "apoAnalyst", "bycUserId", "appointmentId", "caseId", "bycPacketId", "delete"],
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
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true,
            sortDirection: "asc"
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            displayName: "Proposed Years Accelerated",
            visible: false,
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
            displayName: "Proposed Years Deferred",
            visible: false,
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
            viewType: dataViewTypes.displayByKey,
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
            visible: true
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
            visible: false,
            dynamicFilterSearch: true
        },
        currentWorkFlowStep: {
            name: "currentWorkFlowStep",
            displayName: "Current Workflow Step",
            pathsInAPI: {
                appointment: {
                    value: "currentWorkFlowStep",
                    displayText: "currentWorkFlowStep"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        currentAssignedCommittee: {
            name: "currentAssignedCommittee",
            displayName: "Current Assigned Committee",
            pathsInAPI: {
                appointment: {
                    value: "currentAssignedCommittee",
                    displayText: "currentAssignedCommittee"
                }
            },
            visible: true,
            width: 300,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.tooltip
        },
        daysAtCurrentStep: {
            name: "daysAtCurrentStep",
            displayName: "Days at Current Step",
            pathsInAPI: {
                appointment: {
                    value: "daysAtCurrentStep",
                    displayText: "daysAtCurrentStep"
                }
            },
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
        templateName: {
            name: "templateName",
            displayName: "Interfolio Template",
            pathsInAPI: {
                appointment: {
                    value: "templateName",
                    displayText: "templateName"
                }
            },
            visible: false,
            dynamicFilterSearch: true
        },
        status: {
            name: "status",
            displayName: "Interfolio Case Status",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "actionStatus",
                    displayText: "status"
                }
            },
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
        deansOfficeAudit: {
            name: "deansOfficeAudit",
            displayName: "Dean's Office: Audit",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeAudit",
                    displayText: "deansOfficeAudit"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deansOfficeAudit",
                pathToSetValue: "deansOfficeAudit"
            },
            saveOriginalValueByKey: "displayValue_deansOfficeAudit",
            displayKey: "displayValue_deansOfficeAudit",
            opusKey: 0
        },
        deansReview: {
            name: "deansReview",
            displayName: "Dean's Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeReview",
                    displayText: "deansOfficeReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deansOfficeReview",
                pathToSetValue: "deansOfficeReview"
            },
            saveOriginalValueByKey: "displayValue_deansOfficeReview",
            displayKey: "displayValue_deansOfficeReview",
            opusKey: 1
        },
        deansOfficeEnterApprovalInOpus: {
            name: "deansOfficeEnterApprovalInOpus",
            displayName: "Dean's Office: Enter Approval in Opus",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeEnterApprovalInOpus",
                    displayText: "deansOfficeEnterApprovalInOpus"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deansOfficeEnterApprovalInOpus",
                pathToSetValue: "deansOfficeEnterApprovalInOpus"
            },
            saveOriginalValueByKey: "displayValue_deansOfficeEnterApprovalInOpus",
            displayKey: "displayValue_deansOfficeEnterApprovalInOpus",
            opusKey: 2
        },
        deansOfficeFinalizeAndSubmitToAPO: {
            name: "deansOfficeFinalizeAndSubmitToAPO",
            displayName: "Dean's Office: Finalize & Submit to APO",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeFinalizeAndSubmitToAPO",
                    displayText: "deansOfficeFinalizeAndSubmitToAPO"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deansOfficeFinalizeAndSubmitToAPO",
                pathToSetValue: "deansOfficeFinalizeAndSubmitToAPO"
            },
            saveOriginalValueByKey: "displayValue_deansOfficeFinalizeAndSubmitToAPO",
            displayKey: "displayValue_deansOfficeFinalizeAndSubmitToAPO",
            opusKey: 3
        },
        departmentAnalyst: {
            name: "departmentAnalyst",
            displayName: "Department Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "departmentAnalyst",
                    displayText: "departmentAnalyst"
                }
            }
        },
        deansOfficeAnalyst: {
            name: "deansOfficeAnalyst",
            displayName: "Dean's Office Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeAnalyst",
                    displayText: "deansOfficeAnalyst"
                }
            }
        },
        deanAnalystCaseAssignDate: {
            name: "deanAnalystCaseAssignDate",
            displayName: "Dean's Office Analyst Assign Date",
            visible: false,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deanAnalystCaseAssignDate",
                    displayText: "deanAnalystCaseAssignDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deanAnalystCaseAssignDate",
                pathToSetValue: "deanAnalystCaseAssignDate"
            },
            saveOriginalValueByKey: "displayValue_deanAnalystCaseAssignDate",
            displayKey: "displayValue_deanAnalystCaseAssignDate",
        },
        apoAnalyst: {
            name: "apoAnalyst",
            displayName: "APO Analyst",
            visible: false,
            // optionsListName: "apoAnalystList",
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "apoAnalyst",
                    displayText: "apoAnalyst"
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            buttonText: "Delete/Withdraw",
            displayName: "Delete/Withdraw",
            descriptionText: descriptions.deleteAndWithdraw
        }
    }
};

export const deansOfficeQueueConfig = createConfigFromTemplate(deansOfficeQueueConfiguration);

/**
 * @desc - Department Queue Configuration constant for Cases at my Office Page
 *
**/
export const deptQueueConfiguration = {
    queueName: "Department",
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCaseAtMyOffice",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCasesAtMyOffice?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesAtMyOfficeList",
    excelFileName: "Department Queue.csv",
    caseType: "deptQueue",
    pageName: "deptQueue",
    csvPageName: "Department",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    visibleColumnKey: "visible",
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
        {visible: false, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: false, name: "affiliation", displayName: "Affiliation"},
        {visible: false, name: "appointmentPctTime", displayName: "Current Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: false, name: "proposedYearsAccelerated", displayName: "Proposed Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Proposed Years Deferred"},
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
        {visible: false, name: "caseLocation", displayName: "Case Location"},
        {visible: true, name: "currentWorkFlowStep", displayName: "Current Workflow Step"},
        {visible: true, name: "currentAssignedCommittee", displayName: "Current Assigned Committee"},
        {visible: true, name: "daysAtCurrentStep", displayName: "Days at Current Step"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "templateName", displayName: "Interfolio Template"},
        {visible: false, name: "status", displayName: "Interfolio Case Status"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: false, name: "candidateNotified", displayName: "Candidate: Notified"},
        {visible: true, name: "departmentPrepareDossier", displayName: "Department: Prepare Dossier"},
        {visible: false, name: "sectionDivisionPrepareDossier", displayName: "Section/Division: Prepare Dossier"},
        {visible: false, name: "sectionDivisionChairsReview", displayName: "Section/Division: Chair's Review"},
        {visible: true, name: "candidatePriorCert1", displayName: "Candidate: Prior Cert. 1"},
        {visible: false, name: "affiliateReview", displayName: "Affiliate Review"},
        {visible: false, name: "divisionReview", displayName: "Division Review"},
        {visible: false, name: "sectionDivisionfinalizeAndSubmitToDeansOffice", displayName: "Section/Division: Finalize & Submit to Dean's Office"},
        {visible: false, name: "departmentAssignCaseToReviewCommittee", displayName: "Department: Assign Case to Review Committee"},
        {visible: true, name: "departmentCommitteeReview", displayName: "Department: Committee Review"},
        {visible: true, name: "candidatePriorCert2", displayName: "Candidate: Prior Cert. 2"},
        {visible: false, name: "departmentAssignCaseToVotingBody", displayName: "Department: Assign Case to Voting Body"},
        {visible: true, name: "departmentReview", displayName: "Department Review (Vote)"},
        {visible: true, name: "departmentChairsReview", displayName: "Department: Chair's Review"},
        {visible: true, name: "candidateAfterCert", displayName: "Candidate: After Cert."},
        {visible: true, name: "departmentFinalizeAndSubmitToDeansOffice", displayName: "Department: Finalize & Submit to Dean's Office"},
        {visible: false, name: "departmentAnalyst", displayName: "Department Analyst"},
        {visible: false, name: "deptAnalystCaseAssignDate", displayName: "Dept. Analyst Assign Date"},
        {visible: false, name: "deansOfficeAnalyst", displayName: "Dean's Office Analyst"},
        {visible: false, name: "apoAnalyst", displayName: "APO Analyst"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "delete", displayName: "Delete/Withdraw"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location",
    "actionType", "proposedYearsAccelerated", "proposedYearsDeferred", "titleCode", "titleName", "currentSeries",
    "currentRank", "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep",
    "proposedAppointmentPctTime", "proposedEffectiveDate", "caseLocation", "currentWorkFlowStep", "currentAssignedCommittee",
    "daysAtCurrentStep", "opusCreateDt", "interfolioCreateDt", "templateName", "status",
    "interfolioLink", "candidateNotified", "departmentPrepareDossier", "sectionDivisionPrepareDossier", "sectionDivisionChairsReview",
    "candidatePriorCert1", "affiliateReview", "divisionReview", "sectionDivisionfinalizeAndSubmitToDeansOffice", "departmentAssignCaseToReviewCommittee",
    "departmentCommitteeReview", "candidatePriorCert2", "departmentAssignCaseToVotingBody", "departmentReview",
    "departmentChairsReview", "candidateAfterCert", "departmentFinalizeAndSubmitToDeansOffice",
    "departmentAnalyst","deptAnalystCaseAssignDate","deansOfficeAnalyst", "apoAnalyst", "bycUserId", "appointmentId", "caseId", "bycPacketId", "delete"],
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
            visible: false,
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
            visible: false,
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
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true,
            sortDirection: "asc"
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
            visible: false
        },
        areaName: {
            name: "areaName",
            displayName: "Area",
            visible: false,
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            displayName: "Proposed Years Accelerated",
            visible: false,
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
            displayName: "Proposed Years Deferred",
            visible: false,
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
            visible: true,
            pathsInAPI: {
                appointment: {
                    value: "currentSeries",
                    displayText: "currentSeries"
                }
            },
            optionsListName: "seriesList"
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
            viewType: dataViewTypes.displayByKey,
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
            visible: true
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
            visible: false,
            dynamicFilterSearch: true
        },
        currentWorkFlowStep: {
            name: "currentWorkFlowStep",
            displayName: "Current Workflow Step",
            pathsInAPI: {
                appointment: {
                    value: "currentWorkFlowStep",
                    displayText: "currentWorkFlowStep"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        currentAssignedCommittee: {
            name: "currentAssignedCommittee",
            displayName: "Current Assigned Committee",
            pathsInAPI: {
                appointment: {
                    value: "currentAssignedCommittee",
                    displayText: "currentAssignedCommittee"
                }
            },
            visible: true,
            width: 300,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.tooltip
        },
        daysAtCurrentStep: {
            name: "daysAtCurrentStep",
            displayName: "Days at Current Step",
            pathsInAPI: {
                appointment: {
                    value: "daysAtCurrentStep",
                    displayText: "daysAtCurrentStep"
                }
            },
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
        templateName: {
            name: "templateName",
            displayName: "Interfolio Template",
            pathsInAPI: {
                appointment: {
                    value: "templateName",
                    displayText: "templateName"
                }
            },
            visible: false,
            dynamicFilterSearch: true
        },
        status: {
            name: "status",
            displayName: "Interfolio Case Status",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "actionStatus",
                    displayText: "status"
                }
            },
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
        candidateNotified: {
            name: "candidateNotified",
            displayName: "Candidate: Notified",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "candidateNotified",
                    displayText: "candidateNotified"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "candidateNotified",
                pathToSetValue: "candidateNotified"
            },
            saveOriginalValueByKey: "displayValue_candidateNotified",
            displayKey: "displayValue_candidateNotified",
            opusKey: 0
        },
        departmentPrepareDossier: {
            name: "departmentPrepareDossier",
            displayName: "Department: Prepare Dossier",
            visible: true,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentPrepareDossier",
                    displayText: "departmentPrepareDossier"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentPrepareDossier",
                pathToSetValue: "departmentPrepareDossier"
            },
            saveOriginalValueByKey: "displayValue_departmentPrepareDossier",
            displayKey: "displayValue_departmentPrepareDossier",
            opusKey: 1
        },
        sectionDivisionPrepareDossier: {
            name: "sectionDivisionPrepareDossier",
            displayName: "Section/Division: Prepare Dossier",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "sectionDivisionPrepareDossier",
                    displayText: "sectionDivisionPrepareDossier"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "sectionDivisionPrepareDossier",
                pathToSetValue: "sectionDivisionPrepareDossier"
            },
            saveOriginalValueByKey: "displayValue_sectionDivisionPrepareDossier",
            displayKey: "displayValue_sectionDivisionPrepareDossier",
            opusKey: 2
        },
        sectionDivisionChairsReview: {
            name: "sectionDivisionChairsReview",
            displayName: "Section/Division: Chair's Review",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "sectionDivisionChairsReview",
                    displayText: "sectionDivisionChairsReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "sectionDivisionChairsReview",
                pathToSetValue: "sectionDivisionChairsReview"
            },
            saveOriginalValueByKey: "displayValue_sectionDivisionChairsReview",
            displayKey: "displayValue_sectionDivisionChairsReview",
            opusKey: 3
        },
        candidatePriorCert1: {
            name: "candidatePriorCert1",
            displayName: "Candidate: Prior Cert. 1",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "candidatePriorCert1",
                    displayText: "candidatePriorCert1"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "candidatePriorCert1",
                pathToSetValue: "candidatePriorCert1"
            },
            saveOriginalValueByKey: "displayValue_candidatePriorCert1",
            displayKey: "displayValue_candidatePriorCert1",
            opusKey: 4
        },
        affiliateReview: {
            name: "affiliateReview",
            displayName: "Affiliate Review",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "affiliateReview",
                    displayText: "affiliateReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "affiliateReview",
                pathToSetValue: "affiliateReview"
            },
            saveOriginalValueByKey: "displayValue_affiliateReview",
            displayKey: "displayValue_affiliateReview",
            opusKey: 5
        },
        divisionReview: {
            name: "divisionReview",
            displayName: "Division Review",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "divisionReview",
                    displayText: "divisionReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "divisionReview",
                pathToSetValue: "divisionReview"
            },
            saveOriginalValueByKey: "displayValue_divisionReview",
            displayKey: "displayValue_divisionReview",
            opusKey: 6
        },
        sectionDivisionfinalizeAndSubmitToDeansOffice: {
            name: "sectionDivisionfinalizeAndSubmitToDeansOffice",
            displayName: "Section/Division: Finalize & Submit to Dean's Office",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "sectionDivisionfinalizeAndSubmitToDeansOffice",
                    displayText: "sectionDivisionfinalizeAndSubmitToDeansOffice"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "sectionDivisionfinalizeAndSubmitToDeansOffice",
                pathToSetValue: "sectionDivisionfinalizeAndSubmitToDeansOffice"
            },
            saveOriginalValueByKey: "displayValue_sectionDivisionfinalizeAndSubmitToDeansOffice",
            displayKey: "displayValue_sectionDivisionfinalizeAndSubmitToDeansOffice",
            opusKey: 7
        },
        departmentAssignCaseToReviewCommittee: {
            name: "departmentAssignCaseToReviewCommittee",
            displayName: "Department: Assign Case to Review Committee",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentAssignCaseToReviewCommittee",
                    displayText: "departmentAssignCaseToReviewCommittee"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentAssignCaseToReviewCommittee",
                pathToSetValue: "departmentAssignCaseToReviewCommittee"
            },
            saveOriginalValueByKey: "displayValue_departmentAssignCaseToReviewCommittee",
            displayKey: "displayValue_departmentAssignCaseToReviewCommittee",
            opusKey: 8
        },
        departmentCommitteeReview: {
            name: "departmentCommitteeReview",
            displayName: "Department: Committee Review",
            visible: true,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentCommitteeReview",
                    displayText: "departmentCommitteeReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentCommitteeReview",
                pathToSetValue: "departmentCommitteeReview"
            },
            saveOriginalValueByKey: "displayValue_departmentCommitteeReview",
            displayKey: "displayValue_departmentCommitteeReview",
            opusKey: 9
        },
        candidatePriorCert2: {
            name: "candidatePriorCert2",
            displayName: "Candidate: Prior Cert. 2",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "candidatePriorCert2",
                    displayText: "candidatePriorCert2"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "candidatePriorCert2",
                pathToSetValue: "candidatePriorCert2"
            },
            saveOriginalValueByKey: "displayValue_candidatePriorCert2",
            displayKey: "displayValue_candidatePriorCert2",
            opusKey: 9
        },
        departmentAssignCaseToVotingBody: {
            name: "departmentAssignCaseToVotingBody",
            displayName: "Department: Assign Case to Voting Body",
            visible: false,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentAssignCaseToVotingBody",
                    displayText: "departmentAssignCaseToVotingBody"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentAssignCaseToVotingBody",
                pathToSetValue: "departmentAssignCaseToVotingBody"
            },
            saveOriginalValueByKey: "displayValue_departmentAssignCaseToVotingBody",
            displayKey: "displayValue_departmentAssignCaseToVotingBody",
            opusKey: 10
        },
        departmentReview: {
            name: "departmentReview",
            displayName: "Department Review (Vote)",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentReview",
                    displayText: "departmentReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentReview",
                pathToSetValue: "departmentReview"
            },
            saveOriginalValueByKey: "displayValue_departmentReview",
            displayKey: "displayValue_departmentReview",
            opusKey: 11
        },
        candidateAfterCert: {
            name: "candidateAfterCert",
            displayName: "Candidate: After Cert.",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "candidateAfterCert",
                    displayText: "candidateAfterCert"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "candidateAfterCert",
                pathToSetValue: "candidateAfterCert"
            },
            saveOriginalValueByKey: "displayValue_candidateAfterCert",
            displayKey: "displayValue_candidateAfterCert",
            opusKey: 12
        },
        departmentChairsReview: {
            name: "departmentChairsReview",
            displayName: "Department: Chair's Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentChairsReview",
                    displayText: "departmentChairsReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentChairsReview",
                pathToSetValue: "departmentChairsReview"
            },
            saveOriginalValueByKey: "displayValue_departmentChairsReview",
            displayKey: "displayValue_departmentChairsReview",
            opusKey: 13
        },
        departmentFinalizeAndSubmitToDeansOffice: {
            name: "departmentFinalizeAndSubmitToDeansOffice",
            displayName: "Department: Finalize & Submit to Dean's Office",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "departmentFinalizeAndSubmitToDeansOffice",
                    displayText: "departmentFinalizeAndSubmitToDeansOffice"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "departmentFinalizeAndSubmitToDeansOffice",
                pathToSetValue: "departmentFinalizeAndSubmitToDeansOffice"
            },
            saveOriginalValueByKey: "displayValue_departmentFinalizeAndSubmitToDeansOffice",
            displayKey: "displayValue_departmentFinalizeAndSubmitToDeansOffice",
            opusKey: 14
        },
        departmentAnalyst: {
            name: "departmentAnalyst",
            displayName: "Department Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "departmentAnalyst",
                    displayText: "departmentAnalyst"
                }
            }
        },
        deptAnalystCaseAssignDate: {
            name: "deptAnalystCaseAssignDate",
            displayName: "Dept. Analyst Assign Date",
            visible: false,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deptAnalystCaseAssignDate",
                    displayText: "deptAnalystCaseAssignDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deptAnalystCaseAssignDate",
                pathToSetValue: "deptAnalystCaseAssignDate"
            },
            saveOriginalValueByKey: "displayValue_deptAnalystCaseAssignDate",
            displayKey: "displayValue_deptAnalystCaseAssignDate",
        },
        deansOfficeAnalyst: {
            name: "deansOfficeAnalyst",
            displayName: "Dean's Office Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeAnalyst",
                    displayText: "deansOfficeAnalyst"
                }
            }
        },
        apoAnalyst: {
            name: "apoAnalyst",
            displayName: "APO Analyst",
            visible: false,
            // optionsListName: "apoAnalystList",
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "apoAnalyst",
                    displayText: "apoAnalyst"
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            buttonText: "Delete/Withdraw",
            displayName: "Delete/Withdraw",
            descriptionText: descriptions.deleteAndWithdraw
        }
    }
};

export const deptQueueConfig = createConfigFromTemplate(deptQueueConfiguration);

/**
 * @desc - CAP Queue Configuration constant for Cases at my Office Page
 *
**/
export const capQueueConfiguration = {
    queueName: "CAP",
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCaseAtMyOffice",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCasesAtMyOffice?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesAtMyOfficeList",
    excelFileName: "CAP Queue.csv",
    caseType: "capQueue",
    pageName: "capQueue",
    csvPageName: "CAP",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    visibleColumnKey: "visible",
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
        {visible: false, name: "appointmentStatus", displayName: "Appt. Status"},
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: false, name: "appointmentPctTime", displayName: "Current Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: false, name: "proposedYearsAccelerated", displayName: "Proposed Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Proposed Years Deferred"},
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
        {visible: false, name: "caseLocation", displayName: "Case Location"},
        {visible: true, name: "currentWorkFlowStep", displayName: "Current Workflow Step"},
        {visible: true, name: "currentAssignedCommittee", displayName: "Current Assigned Committee"},
        {visible: true, name: "daysAtCurrentStep", displayName: "Days at Current Step"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "templateName", displayName: "Interfolio Template"},
        {visible: false, name: "status", displayName: "Interfolio Case Status"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: true, name: "capAssignCaseInitialReview", displayName: "CAP: Assign Case: Initial Review"},
        {visible: true, name: "capInitialReview", displayName: "CAP: Initial Review"},
        {visible: true, name: "capRequestOrDeclineRC", displayName: "CAP: Request or Decline RC"},
        {visible: true, name: "capAssignCaseSecondReview", displayName: "CAP: Assign Case"},
        {visible: true, name: "capSecondReview", displayName: "CAP: Review"},
        {visible: true, name: "capFinalizeAndSubmitToAPO", displayName: "CAP: Finalize & Submit to APO"},
        {visible: false, name: "departmentAnalyst", displayName: "Department Analyst"},
        {visible: false, name: "deansOfficeAnalyst", displayName: "Dean's Office Analyst"},
        {visible: false, name: "apoAnalyst", displayName: "APO Analyst"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "delete", displayName: "Delete/Withdraw"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location",
    "actionType", "proposedYearsAccelerated", "proposedYearsDeferred", "titleCode", "titleName", "currentSeries",
    "currentRank", "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep",
    "proposedAppointmentPctTime", "proposedEffectiveDate", "caseLocation", "currentWorkFlowStep", "currentAssignedCommittee",
    "daysAtCurrentStep", "opusCreateDt", "interfolioCreateDt", "templateName", "status",
    "interfolioLink", "capAssignCaseInitialReview", "capInitialReview", "capRequestOrDeclineRC", "capAssignCaseSecondReview",
    "capSecondReview", "capFinalizeAndSubmitToAPO", "departmentAnalyst", "deansOfficeAnalyst", "apoAnalyst", "bycUserId", "appointmentId", "caseId", "bycPacketId", "delete"],
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
            visible: false,
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
            visible: false,
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
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true,
            sortDirection: "asc"
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
            visible: false
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            displayName: "Proposed Years Accelerated",
            visible: false,
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
            displayName: "Proposed Years Deferred",
            visible: false,
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
            viewType: dataViewTypes.displayByKey,
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
            visible: true
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
            visible: false,
            dynamicFilterSearch: true
        },
        currentWorkFlowStep: {
            name: "currentWorkFlowStep",
            displayName: "Current Workflow Step",
            pathsInAPI: {
                appointment: {
                    value: "currentWorkFlowStep",
                    displayText: "currentWorkFlowStep"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        currentAssignedCommittee: {
            name: "currentAssignedCommittee",
            displayName: "Current Assigned Committee",
            pathsInAPI: {
                appointment: {
                    value: "currentAssignedCommittee",
                    displayText: "currentAssignedCommittee"
                }
            },
            visible: true,
            width: 300,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.tooltip
        },
        daysAtCurrentStep: {
            name: "daysAtCurrentStep",
            displayName: "Days at Current Step",
            pathsInAPI: {
                appointment: {
                    value: "daysAtCurrentStep",
                    displayText: "daysAtCurrentStep"
                }
            },
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
        templateName: {
            name: "templateName",
            displayName: "Interfolio Template",
            pathsInAPI: {
                appointment: {
                    value: "templateName",
                    displayText: "templateName"
                }
            },
            visible: false,
            dynamicFilterSearch: true
        },
        status: {
            name: "status",
            displayName: "Interfolio Case Status",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "actionStatus",
                    displayText: "status"
                }
            },
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
        capAssignCaseInitialReview: {
            name: "capAssignCaseInitialReview",
            displayName: "CAP: Assign Case: Initial Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "capAssignCaseInitialReview",
                    displayText: "capAssignCaseInitialReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "capAssignCaseInitialReview",
                pathToSetValue: "capAssignCaseInitialReview"
            },
            saveOriginalValueByKey: "displayValue_capAssignCaseInitialReview",
            displayKey: "displayValue_capAssignCaseInitialReview",
            opusKey: 0
        },
        capInitialReview: {
            name: "capInitialReview",
            displayName: "CAP: Initial Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "capInitialReview",
                    displayText: "capInitialReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "capInitialReview",
                pathToSetValue: "capInitialReview"
            },
            saveOriginalValueByKey: "displayValue_capInitialReview",
            displayKey: "displayValue_capInitialReview",
            opusKey: 1
        },
        capRequestOrDeclineRC: {
            name: "capRequestOrDeclineRC",
            displayName: "CAP: Request or Decline RC",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "capRequestOrDeclineRC",
                    displayText: "capRequestOrDeclineRC"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "capRequestOrDeclineRC",
                pathToSetValue: "capRequestOrDeclineRC"
            },
            saveOriginalValueByKey: "displayValue_capRequestOrDeclineRC",
            displayKey: "displayValue_capRequestOrDeclineRC",
            opusKey: 2
        },
        capAssignCaseSecondReview: {
            name: "capAssignCaseSecondReview",
            displayName: "CAP: Assign Case",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "capAssignCaseSecondReview",
                    displayText: "capAssignCaseSecondReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "capAssignCaseSecondReview",
                pathToSetValue: "capAssignCaseSecondReview"
            },
            saveOriginalValueByKey: "displayValue_capAssignCaseSecondReview",
            displayKey: "displayValue_capAssignCaseSecondReview",
            opusKey: 3
        },
        capSecondReview: {
            name: "capSecondReview",
            displayName: "CAP: Review",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "capSecondReview",
                    displayText: "capSecondReview"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "capSecondReview",
                pathToSetValue: "capSecondReview"
            },
            saveOriginalValueByKey: "displayValue_capSecondReview",
            displayKey: "displayValue_capSecondReview",
            opusKey: 4
        },
        capFinalizeAndSubmitToAPO: {
            name: "capFinalizeAndSubmitToAPO",
            displayName: "CAP: Finalize & Submit to APO",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "capFinalizeAndSubmitToAPO",
                    displayText: "capFinalizeAndSubmitToAPO"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "capFinalizeAndSubmitToAPO",
                pathToSetValue: "capFinalizeAndSubmitToAPO"
            },
            saveOriginalValueByKey: "displayValue_capFinalizeAndSubmitToAPO",
            displayKey: "displayValue_capFinalizeAndSubmitToAPO",
            opusKey: 5
        },
        departmentAnalyst: {
            name: "departmentAnalyst",
            displayName: "Department Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "departmentAnalyst",
                    displayText: "departmentAnalyst"
                }
            }
        },
        deansOfficeAnalyst: {
            name: "deansOfficeAnalyst",
            displayName: "Dean's Office Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeAnalyst",
                    displayText: "deansOfficeAnalyst"
                }
            }
        },
        apoAnalyst: {
            name: "apoAnalyst",
            displayName: "APO Analyst",
            visible: false,
            // optionsListName: "apoAnalystList",
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "apoAnalyst",
                    displayText: "apoAnalyst"
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            buttonText: "Delete/Withdraw",
            displayName: "Delete/Withdraw",
            descriptionText: descriptions.deleteAndWithdraw
        }
    }
};

export const capQueueConfig = createConfigFromTemplate(capQueueConfiguration);

/**
 * @desc - Library Queue Configuration constant for Cases at my Office Page
 *
**/
export const libraryQueueConfiguration = {
    queueName: "Library",
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadCaseAtMyOffice",
    grouperPathText: "eligibility",
    url: "/restServices/rest/activecase/getCasesAtMyOffice?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "casesAtMyOfficeList",
    excelFileName: "Library Queue.csv",
    caseType: "libraryQueue",
    pageName: "libraryQueue",
    csvPageName: "Library",
    exportData: descriptions.exportDataDefaultMessage,
    caseSummaryLink: "/opusWeb/ui/admin/case-summary.shtml?",
    deleteCasesUrl: "/restServices/rest/activecase/deleteACase?access_token=",
    visibleColumnKey: "visible",
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
        {visible: false, name: "affiliation", displayName: "Affiliation"},
        {visible: false, name: "appointmentPctTime", displayName: "Current Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "actionType", displayName: "Action Type"},
        {visible: false, name: "proposedYearsAccelerated", displayName: "Proposed Years Accelerated"},
        {visible: false, name: "proposedYearsDeferred", displayName: "Proposed Years Deferred"},
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
        {visible: false, name: "caseLocation", displayName: "Case Location"},
        {visible: true, name: "currentWorkFlowStep", displayName: "Current Workflow Step"},
        {visible: true, name: "currentAssignedCommittee", displayName: "Current Assigned Committee"},
        {visible: true, name: "daysAtCurrentStep", displayName: "Days at Current Step"},
        {visible: false, name: "opusCreateDt", displayName: "Opus Creation Date"},
        {visible: true, name: "interfolioCreateDt", displayName: "Interfolio Creation Date"},
        {visible: false, name: "templateName", displayName: "Interfolio Template"},
        {visible: false, name: "status", displayName: "Interfolio Case Status"},
        {visible: true, name: "interfolioLink", displayName: "Go To Interfolio"},
        {visible: true, name: "riReviewAndCertification", displayName: "RI: Review & Certification"},
        {visible: true, name: "lhrAuditAndSendToCAPA", displayName: "LHR: Audit & Send Case to CAPA"},
        {visible: true, name: "capaReviewAndRecommendation", displayName: "CAPA: Review & Recommendation"},
        {visible: true, name: "capaReviewAndRecommendationOrSelectAdHoc", displayName: "CAPA: Review & Recommendation (or Select Ad Hoc)"},
        {visible: true, name: "lhrAuditAndSendCaseToUL", displayName: "LHR: Audit & Send Case to UL (or Assign Ad Hoc)"},
        {visible: true, name: "adHocReviewAndRecommendation", displayName: "Ad Hoc: Review & Recommendation"},
        {visible: true, name: "capaReviewAndRecommendationAfterAdHoc", displayName: "CAPA: Review & Recommendation (After Ad Hoc)"},
        {visible: true, name: "lhrAuditAndSendToUL", displayName: "LHR: Audit & Send Case to UL"},
        {visible: true, name: "ulReviewAndMakeFinalDecision", displayName: "UL: Review & Make Final Decision"},
        {visible: true, name: "lhrCloseCase", displayName: "LHR: Close Case"},
        {visible: false, name: "deansOfficeAnalyst", displayName: "Dean's Office Analyst"},
        {visible: false, name: "deanAnalystCaseAssignDate", displayName: "Dean's Office Analyst Assign Date"},
        {visible: false, name: "bycUserId", displayName: "RPT User ID"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "caseId", displayName: "Opus Case ID"},
        {visible: false, name: "bycPacketId", displayName: "Interfolio Packet ID"},
        {visible: true, name: "delete", displayName: "Delete/Withdraw"}
            ]
        }
    },
    pagePermissions: {
        name: "cases",
        action: "view"
    },
    columnKeys: ["edit", "emplId", "uid", "fullName", "appointmentStatus", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location",
    "actionType", "proposedYearsAccelerated", "proposedYearsDeferred", "titleCode", "titleName", "currentSeries",
    "currentRank", "currentStep", "proposedTitleCode", "proposedTitleName", "proposedSeries", "proposedRank", "proposedStep",
    "proposedAppointmentPctTime", "proposedEffectiveDate", "caseLocation", "currentWorkFlowStep", "currentAssignedCommittee",
    "daysAtCurrentStep", "opusCreateDt", "interfolioCreateDt", "templateName", "status",
    "interfolioLink", "riReviewAndCertification", "lhrAuditAndSendToCAPA", "capaReviewAndRecommendation", "capaReviewAndRecommendationOrSelectAdHoc",
    "lhrAuditAndSendCaseToUL", "adHocReviewAndRecommendation", "capaReviewAndRecommendationAfterAdHoc",
    "lhrAuditAndSendToUL", "ulReviewAndMakeFinalDecision", "lhrCloseCase", "deansOfficeAnalyst","deanAnalystCaseAssignDate",
    "bycUserId", "appointmentId", "caseId", "bycPacketId", "delete"],
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
            visible: false,
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
            visible: false,
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
            width: 250,
            visible: true,
            textSearch: true,
            fixed: true,
            sortDirection: "asc"
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            displayName: "Proposed Years Accelerated",
            visible: false,
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
            displayName: "Proposed Years Deferred",
            visible: false,
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
            viewType: dataViewTypes.displayByKey,
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
            visible: true
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
            visible: false,
            dynamicFilterSearch: true
        },
        currentWorkFlowStep: {
            name: "currentWorkFlowStep",
            displayName: "Current Workflow Step",
            pathsInAPI: {
                appointment: {
                    value: "currentWorkFlowStep",
                    displayText: "currentWorkFlowStep"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        currentAssignedCommittee: {
            name: "currentAssignedCommittee",
            displayName: "Current Assigned Committee",
            pathsInAPI: {
                appointment: {
                    value: "currentAssignedCommittee",
                    displayText: "currentAssignedCommittee"
                }
            },
            visible: true,
            width: 300,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.tooltip
        },
        daysAtCurrentStep: {
            name: "daysAtCurrentStep",
            displayName: "Days at Current Step",
            pathsInAPI: {
                appointment: {
                    value: "daysAtCurrentStep",
                    displayText: "daysAtCurrentStep"
                }
            },
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
        templateName: {
            name: "templateName",
            displayName: "Interfolio Template",
            pathsInAPI: {
                appointment: {
                    value: "templateName",
                    displayText: "templateName"
                }
            },
            visible: false,
            dynamicFilterSearch: true
        },
        status: {
            name: "status",
            displayName: "Interfolio Case Status",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "actionStatus",
                    displayText: "status"
                }
            },
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
        riReviewAndCertification: {
            name: "riReviewAndCertification",
            displayName: "RI: Review & Certification",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "RI: Review & Certification",
                    displayText: "riReviewAndCertification"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "riReviewAndCertification",
                    pathToSetValue: "riReviewAndCertification"
                },
            saveOriginalValueByKey: "displayValue_riReviewAndCertification",
            displayKey: "displayValue_riReviewAndCertification",
            opusKey: 0
        },
        lhrAuditAndSendToCAPA: {
            name: "lhrAuditAndSendToCAPA",
            displayName: "LHR: Audit & Send Case to CAPA",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "Dean's Office: Finalize & Submit to APO",
                    displayText: "lhrAuditAndSendToCAPA"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "lhrAuditAndSendToCAPA",
                    pathToSetValue: "lhrAuditAndSendToCAPA"
                },
            saveOriginalValueByKey: "displayValue_lhrAuditAndSendToCAPA",
            displayKey: "displayValue_lhrAuditAndSendToCAPA",
            opusKey: 1
        },
        capaReviewAndRecommendation: {
            name: "capaReviewAndRecommendation",
            displayName: "CAPA: Review & Recommendation",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "CAPA: Review & Recommendation",
                    displayText: "capaReviewAndRecommendation"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "capaReviewAndRecommendation",
                    pathToSetValue: "capaReviewAndRecommendation"
                },
            saveOriginalValueByKey: "displayValue_capaReviewAndRecommendation",
            displayKey: "displayValue_capaReviewAndRecommendation",
            opusKey: 2
        },
        capaReviewAndRecommendationOrSelectAdHoc: {
            name: "capaReviewAndRecommendationOrSelectAdHoc",
            displayName: "CAPA: Review & Recommendation (or Select Ad Hoc)",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "CAPA: Review & Recommendation (or Select Ad Hoc)",
                    displayText: "capaReviewAndRecommendationOrSelectAdHoc"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "capaReviewAndRecommendationOrSelectAdHoc",
                    pathToSetValue: "capaReviewAndRecommendationOrSelectAdHoc"
                },
            saveOriginalValueByKey: "displayValue_capaReviewAndRecommendationOrSelectAdHoc",
            displayKey: "displayValue_capaReviewAndRecommendationOrSelectAdHoc",
            opusKey: 3
        },
        lhrAuditAndSendCaseToUL: {
            name: "lhrAuditAndSendCaseToUL",
            displayName: "LHR: Audit & Send Case to UL (or Assign Ad Hoc)",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "LHR: Audit & Send Case to UL (or Assign Ad Hoc)",
                    displayText: "lhrAuditAndSendCaseToUL"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "lhrAuditAndSendCaseToUL",
                    pathToSetValue: "lhrAuditAndSendCaseToUL"
                },
            saveOriginalValueByKey: "displayValue_lhrAuditAndSendCaseToUL",
            displayKey: "displayValue_lhrAuditAndSendCaseToUL",
            opusKey: 4
        },
        adHocReviewAndRecommendation: {
            name: "adHocReviewAndRecommendation",
            displayName: "Ad Hoc: Review & Recommendation",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "Ad Hoc: Review & Recommendation",
                    displayText: "adHocReviewAndRecommendation"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "adHocReviewAndRecommendation",
                    pathToSetValue: "adHocReviewAndRecommendation"
                },
            saveOriginalValueByKey: "displayValue_adHocReviewAndRecommendation",
            displayKey: "displayValue_adHocReviewAndRecommendation",
            opusKey: 5
        },
        capaReviewAndRecommendationAfterAdHoc: {
            name: "capaReviewAndRecommendationAfterAdHoc",
            displayName: "CAPA: Review & Recommendation (After Ad Hoc)",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "CAPA: Review & Recommendation (After Ad Hoc)",
                    displayText: "capaReviewAndRecommendationAfterAdHoc"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "capaReviewAndRecommendationAfterAdHoc",
                    pathToSetValue: "capaReviewAndRecommendationAfterAdHoc"
                },
            saveOriginalValueByKey: "displayValue_capaReviewAndRecommendationAfterAdHoc",
            displayKey: "displayValue_capaReviewAndRecommendationAfterAdHoc",
            opusKey: 6
        },
        lhrAuditAndSendToUL: {
            name: "lhrAuditAndSendToUL",
            displayName: "LHR: Audit & Send Case to UL",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "LHR: Audit & Send Case to UL",
                    displayText: "lhrAuditAndSendToUL"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "lhrAuditAndSendToUL",
                    pathToSetValue: "lhrAuditAndSendToUL"
                },
            saveOriginalValueByKey: "displayValue_lhrAuditAndSendToUL",
            displayKey: "displayValue_lhrAuditAndSendToUL",
            opusKey: 7
        },
        ulReviewAndMakeFinalDecision: {
            name: "ulReviewAndMakeFinalDecision",
            displayName: "UL: Review & Make Final Decision",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "UL: Review & Make Final Decision",
                    displayText: "ulReviewAndMakeFinalDecision"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "ulReviewAndMakeFinalDecision",
                    pathToSetValue: "ulReviewAndMakeFinalDecision"
                },
            saveOriginalValueByKey: "displayValue_ulReviewAndMakeFinalDecision",
            displayKey: "displayValue_ulReviewAndMakeFinalDecision",
            opusKey: 8
        },
        lhrCloseCase: {
            name: "lhrCloseCase",
            displayName: "LHR: Close Case",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "LHR: Close Case",
                    displayText: "lhrCloseCase"
                }
            },
                transformDate: {
                    from: "MM/DD/YYYY",
                    to: "YYYY/MM/DD",
                    pathToGetValue: "lhrCloseCase",
                    pathToSetValue: "lhrCloseCase"
                },
            saveOriginalValueByKey: "displayValue_lhrCloseCase",
            displayKey: "displayValue_lhrCloseCase",
            opusKey: 9
        },
        deansOfficeAnalyst: {
            name: "deansOfficeAnalyst",
            displayName: "Dean's Office Analyst",
            visible: false,
            dynamicFilterSearch: true,
            pathsInAPI: {
                appointment: {
                    value: "deansOfficeAnalyst",
                    displayText: "deansOfficeAnalyst"
                }
            }
        },
        deanAnalystCaseAssignDate: {
            name: "deanAnalystCaseAssignDate",
            displayName: "Dean's Office Analyst Assign Date",
            visible: false,
            dynamicFilterSearch: true,
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deanAnalystCaseAssignDate",
                    displayText: "deanAnalystCaseAssignDate"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deanAnalystCaseAssignDate",
                pathToSetValue: "deanAnalystCaseAssignDate"
            },
            saveOriginalValueByKey: "displayValue_deanAnalystCaseAssignDate",
            displayKey: "displayValue_deanAnalystCaseAssignDate",
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
            visible: false,
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
            visible: false,
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
            visible: false,
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
            buttonText: "Delete/Withdraw",
            displayName: "Delete/Withdraw",
            descriptionText: descriptions.deleteAndWithdraw
        }
    }
};

export const libraryQueueConfig = createConfigFromTemplate(libraryQueueConfiguration);
