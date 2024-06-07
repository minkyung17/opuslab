import {dataViewTypes} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";
import {fieldsInAPI as columnOptions} from "./ClockFieldDataConstants";

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
export const excellenceClockConfig = {
    grouperPathText: "eligibility",
    url: "/restServices/rest/profile/contClockData",
    addNewUrl: "/restServices/rest/profile/newClockData",
    saveDataUrl: "/restServices/rest/profile/saveExcellenceClock",
    deleteUrl: "/restServices/rest/profile/deleteExcellenceClock?",
    columnFilterKey: "eligibleFilterMap",
    bypassViewCheck: true,
    permissionNames: {
        view_page: "8_year_clock",
        edit_page: "8_year_clock_edit_modal"
    },
    dataRowName: "tenureClockDetails",
    pageName: "excellenceClock",
    fieldDataNames: ["academicYear", "serviceUnitType", "unitAYCount", "unitAYTotalCount",
    "unitYearsTotalCount", "continuingUnit18ElgEffDt", "continuingUnit18ReviewEffDt",
    "continuingUnit18Outcome"],
    descriptions: {
        waiver: descriptions.waiver
    },
  //Columns will appear in array order shown here
    columnKeys: ["edit", "opusPersonId", "academicYear", "serviceUnitType",
    "unitAYCount", "unitAYTotalCount", "unitYearsTotalCount", "continuingUnit18ElgEffDt",
    "continuingUnit18ReviewEffDt", "continuingUnit18Outcome", "comments", "delete"],
    invalidChangeColumnsOptions: ["edit"],
    columnConfiguration: {
        academicYear: {
            optionsListName: null
        },
        unitAYCount: {
            descriptionText: descriptions.credited_service_units_ay_exc
        },
        unitAYTotalCount: {
            descriptionText: descriptions.credited_service_units_total_exc
        },
        unitYearsTotalCount: {
            descriptionText: descriptions.credited_service_years_total_exc
        },
        continuingUnit18ElgEffDt: {
            editable: false
        },
        continuingUnit18ReviewEffDt: {
            editable: false
        },
        continuingUnit18Outcome: {
            editable: false
        },
        serviceUnitType: {
            descriptionText: descriptions.service_unit_type_excellence_review
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

export const config = createConfigFromTemplate(excellenceClockConfig, columnOptions);
