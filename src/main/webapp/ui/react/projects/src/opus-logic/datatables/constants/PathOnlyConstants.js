import {dataViewTypes, image_folder} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/**
 * @desc - Configuration constant for Mismatches
 *
 *
**/
const pathOnlyConfig = {
    exportToExcelBaseUrl: "/restServices/rest/ucpath/downloadUcPathComparisonCSV",
    grouperPathText: "opus_path_appt_comparison_view",
    url: "/restServices/rest/ucpath/getUcPathComparisonReport",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    // columnFilterKey: "eligibleFilterMap",
    dataRowName: "ucPathComparisonList",
    excelFileName: "NoOpusAppointment.csv",
    visibleColumnKey: "visible",
    nameUrlLinkKey: "name",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    pageName: "PathOnly",
    exportData: descriptions.exportDataDefaultMessage,
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
        {visible: false, name: "opusId", displayName: "Opus ID"},
        {visible: true, name: "name", displayName: "Name"},
        {visible: true, name: "ucPathDeptCode", displayName: "UCPath Unit"},
        {visible: true, name: "ucPathJobIndicator", displayName: "UCPath Job Indicator"},
        {visible: true, name: "ucPathTitle", displayName: "UCPath Title"},
        {visible: true, name: "ucPathSeries", displayName: "UCPath Series"},
        {visible: true, name: "ucPathRank", displayName: "UCPath Rank"},
        {visible: true, name: "ucPathStep", displayName: "UCPath Step"},
        {visible: true, name: "ucPathEndDate", displayName: "UCPath End Date"},
        {visible: true, name: "ucPathJobStatus", displayName: "UCPath Job Status"},
        {visible: false, name: "ucPathPositionNo", displayName: "UCPath Position #"}
            ]
        }
    },
    pagePermissions: {
        name: "opus_path_appt_comparison_view",
        action: "view"
    },
  //Columns will appear in array order shown here
    columnKeys: ["emplId", "opusId", "name", "ucPathDeptCode", "ucPathJobIndicator",
    "ucPathTitle", "ucPathSeries", "ucPathRank", "ucPathStep",
    "ucPathEndDate", "ucPathJobStatus", "ucPathPositionNo"],
  //These will be populated by 'createConfigFromTemplate'
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
            fixed: true,
            visible: false,
            sortable: true
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
            fixed: true,
            visible: false,
            sortable: true
        },
        name: {
            name: "name",
            displayName: "Name",
            viewType: dataViewTypes.nameLink,
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
            fixed: true,
            sortDirection: "asc"
        },
        ucPathPositionNo: {
            name: "ucPathPositionNo",
            displayName: "UCPath Position #",
            pathsInAPI: {
                appointment: {
                    value: "ucPathPositionNo",
                    displayText: "ucPathPositionNo"
                }
            },
            width: 125,
            fixed: false,
            visible: false,
            sortable: true
        }
    }
};

export const config = createConfigFromTemplate(pathOnlyConfig);
