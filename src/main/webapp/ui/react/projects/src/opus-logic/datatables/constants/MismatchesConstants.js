import {dataViewTypes, image_folder} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

export const searchCriteria = {
    categories: {
        unitMismatch: {
            displayName: "Mismatched Units",
            name: "unitMismatch"
        },
        affiliationMismatch: {
            displayName: "Mismatched Affiliation",
            name: "affiliationMismatch"
        },
        titleMismatch: {
            displayName: "Mismatched Title Codes",
            name: "titleMismatch"
        },
        seriesMismatch: {
            displayName: "Mismatched Series",
            name: "seriesMismatch"
        },
        rankMismatch: {
            displayName: "Mismatched Rank",
            name: "rankMismatch"
        },
        stepMismatch: {
            displayName: "Mismatched Steps",
            name: "stepMismatch"
        },
        endDateMismatch: {
            displayName: "Mismatched End Date",
            name: "endDateMismatch"
        },
        apptStatusMismatch: {
            displayName: "Mismatched Status",
            name: "apptStatusMismatch"
        }
    },
    affirmativeSearch: ["unitMismatch", "affiliationMismatch", "titleMismatch", "seriesMismatch",
    "rankMismatch", "stepMismatch", "endDateMismatch", "apptStatusMismatch"]
};

/**
 * @desc - Configuration constant for Mismatches
 *
 *
**/
const mismatchesConfig = {
    exportToExcelBaseUrl: "/restServices/rest/ucpath/downloadUcPathComparisonCSV",
    grouperPathText: "opus_path_appt_comparison_view",
    url: "/restServices/rest/ucpath/getUcPathComparisonReport",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    hideUrl: "/restServices/rest/ucpath/updateUcPathComparisonVisibility",
    // columnFilterKey: "eligibleFilterMap",
    dataRowName: "ucPathComparisonList",
    excelFileName: "Mismatches.csv",
    visibleColumnKey: "visible",
    nameUrlLinkKey: "name",
    rowImagePathKey: "imageSrc",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    nameImagePath: "../images/case-tiny.png",
    nameImageVarName: "caseExist",
    searchCategories: searchCriteria,
    pageName: "Mismatch",
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
        {visible: true, name: "caseExist", displayName: "Active Cases"},
        {visible: true, name: "hideRow", displayName: "Hide Row"},
        {visible: false, name: "emplId", displayName: "Empl. ID"},
        {visible: false, name: "opusId", displayName: "Opus ID"},
        {visible: true, name: "name", displayName: "Name"},
        {visible: false, name: "opusApptId", displayName: "Opus Appt. ID"},
        {visible: false, name: "ucPathPositionNo", displayName: "UCPath Position #"},
        {visible: true, name: "opusUnit", displayName: "Opus Unit"},
        {visible: true, name: "ucPathDeptCode", displayName: "UCPath Unit"},
        {visible: true, name: "opusAffiliation", displayName: "Opus Affiliation"},
        {visible: true, name: "ucPathJobIndicator", displayName: "UCPath Job Indicator"},
        {visible: true, name: "opusTitle", displayName: "Opus Title"},
        {visible: true, name: "ucPathTitle", displayName: "UCPath Title"},
        {visible: true, name: "opusSeries", displayName: "Opus Series"},
        {visible: true, name: "ucPathSeries", displayName: "UCPath Series"},
        {visible: true, name: "opusRank", displayName: "Opus Rank"},
        {visible: true, name: "ucPathRank", displayName: "UCPath Rank"},
        {visible: true, name: "opusStep", displayName: "Opus Step"},
        {visible: true, name: "ucPathStep", displayName: "UCPath Step"},
        {visible: true, name: "opusEndDate", displayName: "Opus Appt. End Date"},
        {visible: true, name: "ucPathEndDate", displayName: "UCPath End Date"},
        {visible: true, name: "opusApptStatus", displayName: "Opus Appt. Status"},
        {visible: true, name: "ucPathJobStatus", displayName: "UCPath Job Status"},
            ]
        }
    },
    pagePermissions: {
        name: "opus_path_appt_comparison_view",
        action: "view"
    },
  //Columns will appear in array order shown here
    columnKeys: ["caseExist", "hideRow", "emplId", "opusId", "name", "opusApptId",
    "ucPathPositionNo", "opusUnit", "ucPathDeptCode", "opusAffiliation", "ucPathJobIndicator", "opusTitle",
    "ucPathTitle", "opusSeries", "ucPathSeries", "opusRank", "ucPathRank", "opusStep", "ucPathStep",
    "opusEndDate", "ucPathEndDate", "opusApptStatus", "ucPathJobStatus"],
    omitUIColumns: ["caseExist", "hideRow"],
  //These will be populated by 'createConfigFromTemplate'
    columnConfiguration: {
        caseExist: {
            name: "caseExist",
            displayName: "Active Cases",
            showImageAsColumnTitle: true,
            imageTitleHoverText: "This person has an active case.",
            viewType: dataViewTypes.image,
            headerDescriptionText: null,
            headerImageSrc: image_folder + "case-tiny.png",
            image: image_folder + "case-tiny.png",
            visible: true,
            sortable: false,
            fixed: true,
            width: 50,
            descriptionText: descriptions.pendingCases
        },
        hideRow: {
            name: "hideRow",
            sortable: false,
            viewType: dataViewTypes.button,
            visible: true,
            width: 75,
            action: "hideRow",
            buttonText: "Hide",
            displayName: "Hide Row",
            fixed: true
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
        opusApptId: {
            name: "opusApptId",
            displayName: "Opus Appt. ID",
            pathsInAPI: {
                appointment: {
                    value: "opusApptId",
                    displayText: "opusApptId"
                }
            },
            width: 125,
            fixed: false,
            visible: false,
            sortable: true
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
        },
    }
};

export const config = createConfigFromTemplate(mismatchesConfig);
