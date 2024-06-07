import {createConfigFromTemplate} from "./DatatableConfigTemplate";
import {fieldsInAPI as columnOptions} from "./SummaryClockFieldDataConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {dataViewTypes} from "./DatatableConstants";

/**
 * @desc - Configuration constant for Eight Year Clock Summary
 *
 *
**/
export const eightYearClockSummaryConfig = {
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/roster/download8YearAggregateData",
    excelFileName: "EightYearClocks.csv",
    pageName: "eightYearClockSummary",
    exportData: descriptions.exportDataDefaultMessage,
    bypassViewCheck: true,
    url: "/restServices/rest/roster/eightYearClockAggregateData",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    columnFilterKey: "eligibleFilterMap",
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
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "startDateAtRank", displayName: "Start Date at Rank"},
        {visible: false, name: "serviceUnitType", displayName: "Service Unit Type"},
        {visible: true, name: "unitYearsTotalCount", displayName: "Credited Service Years: Total"},
        {visible: true, name: "fourthYearAppraisalElgEffDt", displayName: "Estimated Date of 4th Year Appraisal"},
        {visible: false, name: "fourthYearAppraisalEffDt", displayName: "Effective Date of 4th Year Appraisal"},
        {visible: false, name: "fourthYearAppraisalOutcome", displayName: "Outcome of 4th Year Appraisal"},
        {visible: true, name: "eightYearLimitElgEffDt", displayName: "Estimated Date of Eight-Year Review"},
        {visible: false, name: "eightYearLimitEffDt", displayName: "Effective Date of Eight-Year Review"},
        {visible: false, name: "eightYearLimitOutcome", displayName: "Outcome of Eight-Year Review"},
        {visible: true, name: "unitTOCYearCount", displayName: "TOC Credited Balance"}
            ]
        }
    },
    columnKeys: ["emplId", "uid", "fullName", "schoolName", "divisionName", "departmentName", "areaName",
    "specialtyName", "affiliation", "location", "startDateAtRank", "serviceUnitType", "unitYearsTotalCount",
    "fourthYearAppraisalElgEffDt", "fourthYearAppraisalEffDt", "fourthYearAppraisalOutcome",
    "eightYearLimitElgEffDt", "eightYearLimitEffDt", "eightYearLimitOutcome", "unitTOCYearCount"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        fullName: {
            name: "fullName",
            viewType: dataViewTypes.nameLink,
            displayKey: "displayValue_fullName"
        },
        location: {
            name: "location",
            displayName: "Location",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.location",
                    displayText: "appointmentInfo.academicHierarchyInfo.location"
                }
            },
            optionsListName: "orgLocationList",
            descriptionText: descriptions.location,
            width: 250,
            sortable: false
        },
        unitTOCYearCount: {
            displayName: "TOC Credited Balance",
            dataType: "number"
        },
        startDateAtRank: {
            visible: true
        },
        serviceUnitType: {
            visible: false
        },
        fourthYearAppraisalEffDt: {
            visible: false
        },
        fourthYearAppraisalOutcome: {
            dynamicFilterSearch: true
        },
        eightYearLimitElgEffDt: {
            visible: true
        },
        eightYearLimitEffDt: {
            visible: false
        },
        eightYearLimitOutcome: {
            dynamicFilterSearch: true
        }
    }
};

export const config = createConfigFromTemplate(eightYearClockSummaryConfig, columnOptions);
