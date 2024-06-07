import {dataViewTypes} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";
import {fieldsInAPI as columnOptions} from "./ClockFieldDataConstants";
import * as validations from "../validations";
/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
export const eightYearClockConfig = {
    grouperPathText: "8_year_clock_edit_modal",
    permissionNames: {
        view_page: "8_year_clock",
        edit_page: "8_year_clock_edit_modal"
    },
    bypassViewCheck: true,
    url: "/restServices/rest/profile/eightYearClockData",
    addNewUrl: "/restServices/rest/profile/newClockData",
    saveDataUrl: "/restServices/rest/profile/save8YearClock",
    deleteUrl: "/restServices/rest/profile/delete8YearClock?",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "tenureClockDetails",
    pageName: "eightYearClock",
    fieldDataNames: ["academicYear", "serviceUnitType", "unitAYCount",
    "unitAYTotalCount", "unitYearsTotalCount", "unitTOCYearCount",
    "unitTOCTakenCount", "fourthYearAppraisalElgEffDt", "fourthYearAppraisalEffDt",
    "fourthYearAppraisalOutcome", "eightYearLimitElgEffDt", "eightYearLimitEffDt",
    "eightYearLimitOutcome"],
    descriptions: {
        waiver: descriptions.waiver
    },
    columnKeys: ["edit", "opusPersonId", "academicYear", "serviceUnitType", "unitAYCount",
    "unitAYTotalCount", "unitYearsTotalCount", "unitTOCYearCount", "unitTOCTakenCount",
    "fourthYearAppraisalElgEffDt", "fourthYearAppraisalEffDt", "fourthYearAppraisalOutcome",
    "eightYearLimitElgEffDt", "eightYearLimitEffDt", "eightYearLimitOutcome", "comments", "delete"],
    editPermissionsByRole: {
        unitTOCYearCount: {apo_director: true, opus_admin: true},
        toc_permission_name: "unitTOCYearCount"
    },
    invalidChangeColumnsOptions: ["edit", "eightYearLimitElgEffDt", "eightYearLimitEffDt", "fourthYearAppraisalEffDt",
    "fourthYearAppraisalOutcome", "fourthYearAppraisalElgEffDt", "eightYearLimitOutcome"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        eightYearLimitElgEffDt: {
            visible: false,
            editable: false
        },
        eightYearLimitEffDt: {
            visible: false,
            editable: false
        },
        academicYear: {
            optionsListName: null
        },
        unitAYCount: {
            dataType: "number"
        },
        unitAYTotalCount: {
            dataType: "number"
        },
        unitTOCYearCount: {
            displayName: "TOC Credited Balance",
            dataType: "number"
        },
        unitTOCTakenCount: {
            dataType: "number"
        },
        fourthYearAppraisalEffDt: {
            visible: false,
            editable: false
        },
        fourthYearAppraisalOutcome: {
            visible: false,
            editable: false
        },
        fourthYearAppraisalElgEffDt: {
            visible: false,
            editable: false
        },
        eightYearLimitOutcome: {
            visible: false,
            editable: false
        },
        comments: {
            name: "comments",
            displayName: "Comments",
            pathsInAPI: {
                appointment: {
                    value: "comments",
                    displayText: "comments"
                }
            },
            visible: true,
            sortable: false,
            width: 225,
            viewType: dataViewTypes.tooltip
        },
        delete: {
            name: "delete",
            sortable: false,
            viewType: dataViewTypes.button,
            visible: true,
            width: 175,
            action: "delete",
            buttonText: "Delete",
            displayName: "Delete"
        }
    }
};

export const config = createConfigFromTemplate(eightYearClockConfig, columnOptions);

export const eightYearClockValidations = {
    unitTOCYearCount: {
        onSaveValidations: [validations.tocCreditedNumberBounds]
    },
    unitTOCTakenCount: {
        onSaveValidations: [validations.tocTakenBelowTOCCredited]
    }
};
