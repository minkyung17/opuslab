import {createConfigFromTemplate} from "./DatatableConfigTemplate";
import {fieldsInAPI as columnOptions} from "./SummaryClockFieldDataConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {dataViewTypes} from "./DatatableConstants";

/**
 * @desc - Configuration constant for Eight Year Clock Summary
 *
 *
**/
export const excellenceReviewClockSummaryConfig = {
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/roster/downloadUnit18AggregateData",
    excelFileName: "ExcellenceReviewClocks.csv",
    bypassViewCheck: true,
    url: "/restServices/rest/roster/unit18AggregateData",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    pageName: "ExcellenceReviewClockSummary",
    exportData: descriptions.exportDataDefaultMessage,
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
        {visible: true, name: "serviceUnitType", displayName: "Service Unit Type"},
        {visible: true, name: "unitAYTotalCount", displayName: "Credited Service Units: Total"},
        {visible: true, name: "continuingUnit18ElgEffDt", displayName: "Estimated Date of Excellence Review"},
        {visible: false, name: "continuingUnit18ReviewEffDt", displayName: "Effective Date of Excellence Review"},
        {visible: false, name: "continuingUnit18Outcome", displayName: "Outcome of Excellence Review"}
            ]
        }
    },
    columnKeys: ["emplId", "uid", "fullName", "schoolName", "divisionName", "departmentName", "areaName",
    "specialtyName", "affiliation", "location", "startDateAtRank", "serviceUnitType", "unitAYTotalCount",
    "continuingUnit18ElgEffDt", "continuingUnit18ReviewEffDt", "continuingUnit18Outcome"],
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
        startDateAtRank: {
            visible: true
        },
        unitYearsTotalCount: {
            descriptionText: descriptions.credited_service_years_total_exc
        },
        serviceUnitType: {
            descriptionText: descriptions.service_unit_type_excellence_review
        },
        continuingUnit18ReviewEffDt: {
            visible: false
        }
    }
};

export const config = createConfigFromTemplate(excellenceReviewClockSummaryConfig, columnOptions);
