import {dataViewTypes, image_folder} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

export const searchCriteria = {
    categories: {
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
        appointmentNotInSet: {
            displayName: "Appointments Not in Sets",
            name: "appointmentNotInSet"
        }
    },
    affirmativeSearch: ["seriesMismatch", "rankMismatch", "stepMismatch", "endDateMismatch", "appointmentNotInSet"]
};

/**
 * @desc - Configuration constant for Opus Mismatches
 *
 *
**/
const opusHiddenMismatchesConfig = {
    exportToExcelBaseUrl: "/restServices/rest/reports/downloadOpusComparisonCSV",
    grouperPathText: "opus_primary_addl_appt_comparison_view",
    url: "/restServices/rest/reports/getOpusComparisonReport",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    unhideUrl: "/restServices/rest/reports/updateOpusComparisonVisibility",
    // columnFilterKey: "eligibleFilterMap",
    dataRowName: "opusComparisonList",
    excelFileName: "OpusHiddenMismatches.csv",
    visibleColumnKey: "visible",
    nameUrlLinkKey: "name",
    rowImagePathKey: "imageSrc",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    nameImagePath: "../images/case-tiny.png",
    nameImageVarName: "caseExist",
    searchCategories: searchCriteria,
    pageName: "opusHidden",
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
        {visible: true, name: "caseExist", displayName: "Active Cases"},
        {visible: true, name: "unhideRow", displayName: "Unhide Row"},
        {visible: false, name: "emplId", displayName: "Empl. ID"},
        {visible: false, name: "opusId", displayName: "Opus ID"},
        {visible: true, name: "name", displayName: "Name"},
        {visible: false, name: "primaryApptId", displayName: "Primary Appt. ID"},
        {visible: false, name: "additionalApptId", displayName: "Additional Appt. ID"},
        {visible: true, name: "primaryDepartment", displayName: "Primary Department"},
        {visible: true, name: "additionalDepartment", displayName: "Additional Department"},
        {visible: true, name: "additionalAffiliation", displayName: "Additional Affiliation"},
        {visible: true, name: "primaryTitle", displayName: "Primary Title"},
        {visible: true, name: "additionalTitle", displayName: "Additional Title"},
        {visible: true, name: "primarySeries", displayName: "Primary Series"},
        {visible: true, name: "additionalSeries", displayName: "Additional Series"},
        {visible: true, name: "primaryRank", displayName: "Primary Rank"},
        {visible: true, name: "additionalRank", displayName: "Additional Rank"},
        {visible: true, name: "primaryStep", displayName: "Primary Step"},
        {visible: true, name: "additionalStep", displayName: "Additional Step"},
        {visible: true, name: "primaryEndDate", displayName: "Primary End Date"},
        {visible: true, name: "additionalEndDate", displayName: "Additional End Date"}
            ]
        }
    },
    pagePermissions: {
        name: "opus_primary_addl_appt_comparison_view",
        action: "view"
    },
  //Columns will appear in array order shown here
    columnKeys: ["caseExist", "unhideRow", "emplId", "opusId", "name", "primaryApptId",
    "additionalApptId", "primaryDepartment", "additionalDepartment", "additionalAffiliation",
    "primaryTitle", "additionalTitle", "primarySeries", "additionalSeries", "primaryRank", "additionalRank",
    "primaryStep", "additionalStep", "primaryEndDate", "additionalEndDate"],
    omitUIColumns: ["caseExist", "unhideRow"],
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
        unhideRow: {
            name: "unhideRow",
            sortable: false,
            viewType: dataViewTypes.button,
            visible: true,
            width: 100,
            action: "unhideRow",
            buttonText: "Unhide",
            displayName: "Unhide Row",
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
        primaryApptId: {
            name: "primaryApptId",
            displayName: "Primary Appt. ID",
            pathsInAPI: {
                appointment: {
                    value: "primaryApptId",
                    displayText: "primaryApptId"
                }
            },
            width: 125,
            fixed: false,
            visible: false,
            sortable: true
        },
        additionalApptId: {
            name: "additionalApptId",
            displayName: "Additional Appt. ID",
            pathsInAPI: {
                appointment: {
                    value: "additionalApptId",
                    displayText: "additionalApptId"
                }
            },
            width: 125,
            fixed: false,
            visible: false,
            sortable: true
        },
        primaryDepartment: {
            name: "primaryDepartment",
            displayName: "Primary Department",
            pathsInAPI: {
                appointment: {
                    value: "primaryDepartment",
                    displayText: "primaryDepartment"
                }
            },
            width: 275,
            fixed: false,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        },
        additionalDepartment: {
            name: "additionalDepartment",
            displayName: "Additional Department",
            pathsInAPI: {
                appointment: {
                    value: "additionalDepartment",
                    displayText: "additionalDepartment"
                }
            },
            width: 275,
            fixed: false,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        },
        additionalAffiliation: {
            name: "additionalAffiliation",
            displayName: "Additional Affiliation",
            pathsInAPI: {
                appointment: {
                    value: "additionalAffiliation",
                    displayText: "additionalAffiliation"
                }
            },
            width: 150,
            fixed: false,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        },
        primaryTitle: {
            name: "primaryTitle",
            displayName: "Primary Title",
            viewType: dataViewTypes.mixedString,
            pathsInAPI: {
                appointment: {
                    value: "primaryTitle",
                    displayText: "primaryTitle"
                }
            },
            width: 275,
            fixed: false,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        },
        additionalTitle: {
            name: "additionalTitle",
            displayName: "Additional Title",
            viewType: dataViewTypes.mixedString,
            pathsInAPI: {
                appointment: {
                    value: "additionalTitle",
                    displayText: "additionalTitle"
                }
            },
            width: 275,
            fixed: false,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
        }
    }
};

export const config = createConfigFromTemplate(opusHiddenMismatchesConfig);
