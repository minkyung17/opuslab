import {dataViewTypes, image_folder} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/**
 * @desc - Configuration constant for Mismatches
 *
 *
**/
const opusOnlyConfig = {
    exportToExcelBaseUrl: "/restServices/rest/ucpath/downloadUcPathComparisonCSV",
    grouperPathText: "opus_path_appt_comparison_view",
    url: "/restServices/rest/ucpath/getUcPathComparisonReport",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    // columnFilterKey: "eligibleFilterMap",
    dataRowName: "ucPathComparisonList",
    excelFileName: "NoUCPathAppointment.csv",
    visibleColumnKey: "visible",
    nameUrlLinkKey: "name",
    rowImagePathKey: "imageSrc",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    nameImagePath: "../images/case-tiny.png",
    nameImageVarName: "caseExist",
    pageName: "OpusOnly",
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
        {visible: false, name: "emplId", displayName: "Empl. ID"},
        {visible: false, name: "opusId", displayName: "Opus ID"},
        {visible: true, name: "name", displayName: "Name"},
        {visible: true, name: "opusApptStatus", displayName: "Opus Appt. Status"},
        {visible: false, name: "opusSchool", displayName: "Opus School"},
        {visible: false, name: "opusDivision", displayName: "Opus Division"},
        {visible: true, name: "opusDepartment", displayName: "Opus Department"},
        {visible: false, name: "opusArea", displayName: "Opus Area"},
        {visible: false, name: "opusSpecialty", displayName: "Opus Specialty"},
        {visible: true, name: "opusAffiliation", displayName: "Opus Affiliation"},
        {visible: true, name: "opusTitle", displayName: "Opus Title"},
        {visible: true, name: "opusSeries", displayName: "Opus Series"},
        {visible: true, name: "opusRank", displayName: "Opus Rank"},
        {visible: true, name: "opusStep", displayName: "Opus Step"},
        {visible: true, name: "opusEndDate", displayName: "Opus Appt. End Date"},
        {visible: false, name: "opusApptId", displayName: "Opus Appt. ID"}
            ]
        }
    },
    pagePermissions: {
        name: "opus_path_appt_comparison_view",
        action: "view"
    },
  //Columns will appear in array order shown here
    columnKeys: ["caseExist", "emplId", "opusId", "name", "opusApptStatus", "opusSchool",
    "opusDivision", "opusDepartment", "opusArea", "opusSpecialty", "opusAffiliation", "opusTitle",
    "opusSeries", "opusRank", "opusStep", "opusEndDate", "opusApptId"],
    omitUIColumns: ["caseExist"],
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
        opusSchool: {
            name: "opusSchool",
            displayName: "Opus School",
            pathsInAPI: {
                appointment: {
                    value: "opusSchool",
                    displayText: "opusSchool"
                }
            },
            optionsListName: "schoolList",
            width: 250,
            fixed: false,
            visible: false,
            sortable: true
        },
        opusDivision: {
            name: "opusDivision",
            displayName: "Opus Division",
            pathsInAPI: {
                appointment: {
                    value: "opusDivision",
                    displayText: "opusDivision"
                }
            },
            optionsListName: "divisionList",
            fixed: false,
            visible: false,
            sortable: true
        },
        opusDepartment: {
            name: "opusDepartment",
            displayName: "Opus Department",
            pathsInAPI: {
                appointment: {
                    value: "opusDepartment",
                    displayText: "opusDepartment"
                }
            },
            optionsListName: "departmentList",
            width: 250,
            fixed: false,
            visible: true,
            sortable: true
        },
        opusArea: {
            name: "opusArea",
            displayName: "Opus Area",
            optionsListName: "areaList",
            pathsInAPI: {
                appointment: {
                    value: "opusArea",
                    displayText: "opusArea"
                }
            },
            visible: false
        },
        opusSpecialty: {
            name: "opusSpecialty",
            displayName: "Opus Specialty",
            optionsListName: "specialtyList",
            pathsInAPI: {
                appointment: {
                    value: "opusSpecialty",
                    displayText: "opusSpecialty"
                }
            },
            visible: false
        },
        opusTitle: {
            name: "opusTitle",
            displayName: "Opus Title",
            pathsInAPI: {
                appointment: {
                    value: "opusTitle",
                    displayText: "opusTitle"
                }
            },
            width: 275,
            fixed: false,
            visible: true,
            sortable: true,
            dynamicFilterSearch: true
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
        }
    }
};

export const config = createConfigFromTemplate(opusOnlyConfig);
