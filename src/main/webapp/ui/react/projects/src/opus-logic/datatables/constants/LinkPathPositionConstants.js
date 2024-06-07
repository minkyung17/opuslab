import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/**
 *
 * @desc - Configuration constant for UC Path Compensation Page
 *
**/
export const linkPathPositionConfig = {
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/downloadPathCompensationReportCSV",
    url: "/restServices/rest/roster/ucPathPositionsData",
    getPathPositionInfoUrl: "/restServices/rest/roster/getPathPositionInfo",
    linktPathPositionUrl: "/restServices/rest/roster/setPathPositionInfo",
    confirmUrl: "/restServices/rest/profile/confirmUnconfirmPosition?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "offScales",
  // excelFileName: 'SalaryCompensationReport.csv',
    pageName: "LinkPathPosition",
    visibleColumnKey: "visible",
    pagePermissions: {
        name: "salary",
        action: "view"
    },
    dataColumnFilters: {
        columnSortOrder: {fullName: "asc"}
    },
    columnKeys: ["emplId", "fullName", "opusAppointmentDisplay", "ucPathPosition", "ucPathPositionNoMatch", "confirm", "unlink"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        emplId: {
            pathsInAPI: {
                appointment: {
                    value: "appointeeInfo.emplId",
                    displayText: "appointeeInfo.emplId"
                }
            },
            visible: true,
            sortable: false,
        },
        fullName: {
            name: "fullName",
            displayName: "Name",
            viewType: dataViewTypes.sortingText,
            pathsInAPI: {
                appointment: {
                    value: "appointeeInfo.fullName",
                    displayText: "appointeeInfo.fullName"
                }
            },
            displayKey: "displayValue_fullName",
            width: 200,
            visible: true,
            sortable: true,
            textSearch: true,
        },
        opusAppointmentDisplay: {
            name: "opusAppointmentDisplay",
            displayName: "Opus Appointment",
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "opusAppointmentDisplay",
                    displayText: "opusAppointmentDisplay"
                }
            },
            visible: true,
            sortable: false,
            fixed: true
        },
    // TODO: ask backend to fix pathsInAPI field value 'ucPathPostions'
        ucPathPosition: {
            name: "ucPathPosition",
            displayName: "UCPath Position",
            viewType: dataViewTypes.radio,
            pathsInAPI: {
                appointment: {
                    value: "ucPathPostions",
                    displayText: "ucPathPostions"
                }
            },
            visible: false,
            sortable: false,
            fixed: true
        },
        ucPathPositionNoMatch: {
            name: "Link Manually",
            displayName: "UCPath Position",
            viewType: dataViewTypes.linkManualButton,
            width: 150,
            visible: true,
            sortable: false,
            fixed: true
        },  
        confirm: {
            name: "confirm",
            displayName: "Confirm",
            viewType: dataViewTypes.button,
            width: 175,
            action: "confirm",
            buttonText: "Confirm",
            visible: false,
            sortable: false,
            fixed: true
        },
        unlink: {
            name: "Unlink",
            displayName: "Unlink",
            viewType: dataViewTypes.linkButton,
            width: 175,
            visible: false,
            sortable: false,
            fixed: true
        }
    }
};

export const config = createConfigFromTemplate(linkPathPositionConfig);
