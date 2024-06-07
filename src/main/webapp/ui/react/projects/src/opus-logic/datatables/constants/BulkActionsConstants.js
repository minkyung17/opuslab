import {createConfigFromTemplate} from "./DatatableConfigTemplate";
import * as ActionCategoryType from "../../cases/constants/ActionCategoryType";
import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";

/**
 * @desc - Configuration constant for Bulk Actions
 *
 *
**/
export const bulkActionsConfig = {
    exportToExcelBaseUrl: "/restServices/rest/activecase/downloadRelAppointmentsCSV",
    grouperPathText: "eligibility",
    excelFileName: "BulkActions.csv",
    pageName: "BulkActions",
    exportData: descriptions.exportDataDefaultMessage,
    bypassViewCheck: true,
    url: "/restServices/rest/activecase/getRelevantAppointments",
    saveDataUrl: "/restServices/rest/activecase/addBulkActionData",
    columnFilterKey: "eligibleFilterMap",
    columnKeys: ["checkbox", "appointmentId", "uid", "fullName", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "appointmentPctTime",
    "location", "titleCode", "titleName", "currentSeries", "currentRank",
    "currentStep", "appointmentEndDt"],
    apuColumnKeys: ["checkbox", "appointmentId", "uid", "fullName", "schoolName", "divisionName",
    "departmentName", "areaName", "specialtyName", "affiliation", "location", "titleCode",
    "titleName", "currentSeries", "currentRank", "currentStep", "apuCodeDescYear", "hscpBaseScale"],
    dataColumnFilters: {
        columnSortOrder: {fullName: "asc"}
    },
  //Columns will appear in array order shown here
    invalidChangeColumnsOptions: ["checkbox"],
    omitUIColumns: ["checkbox"],
    columnConfiguration: {
        checkbox: {
            name: "checkbox",
            viewType: dataViewTypes.checkbox,
            descriptionText: "Select",
            visible: true,
            fixed: true,
            width: 50,
            uiProps: {
                checked: false
            },
            selectAll: true
        },
        appointmentId: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentId",
                    displayText: "appointmentId"
                }
            },
            fixed: true
        },
        uid: {
            pathsInAPI: {
                appointment: {
                    value: "uid",
                    displayText: "uid"
                }
            },
            fixed: true
        },
        fullName: {
            name: "fullName",
            viewType: dataViewTypes.sortingText,
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
            displayKey: "displayValue_fullName",
            fixed: true
        },
        schoolName: {
            pathsInAPI: {
                appointment: {
                    value: "schoolName",
                    displayText: "schoolName"
                }
            }
      //optionsListName: null
        },
        divisionName: {
            pathsInAPI: {
                appointment: {
                    value: "divisionName",
                    displayText: "divisionName"
                }
            }
      //optionsListName: null
        },
        departmentName: {
            pathsInAPI: {
                appointment: {
                    value: "departmentName",
                    displayText: "departmentName"
                }
            }
      //optionsListName: null
        },
        areaName: {
            pathsInAPI: {
                appointment: {
                    value: "areaName",
                    displayText: "areaName"
                }
            }
      //optionsListName: null
        },
        specialtyName: {
            pathsInAPI: {
                appointment: {
                    value: "specialtyName",
                    displayText: "specialtyName"
                }
            }
      //optionsListName: null
        },
        location: {
            pathsInAPI: {
                appointment: {
                    value: "location",
                    displayText: "location"
                }
            }
      //optionsListName: null
        },
        affiliation: {
            pathsInAPI: {
                appointment: {
                    value: "affiliation",
                    displayText: "affiliation"
                }
            },
            width: 150
        },
        appointmentPctTime: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentPctTime",
                    displayText: "appointmentPctTime"
                }
            },
            visible: false
        },
        titleCode: {
            pathsInAPI: {
                appointment: {
                    value: "titleCode",
                    displayText: "titleCode"
                }
            },
            dynamicFilterSearch: false,
            visible: true,
            width: 150
        },
        titleName: {
            pathsInAPI: {
                appointment: {
                    value: "titleName",
                    displayText: "titleName"
                }
            }
      //textSearch: false
        },
        currentSeries: { //Overriding these params to ensure name and path is correct
      //optionsListName: null,
            displayName: "Series",
            width: 150,
            pathsInAPI: {
                appointment: {
                    value: "series",
                    displayText: "series"
                }
            }
        },
        currentRank: { //Overriding these params to ensure name and path is correct
      //optionsListName: null,
            displayName: "Rank",
            width: 150,
            pathsInAPI: {
                appointment: {
                    value: "rankTypeDisplayText",
                    displayText: "rankTypeDisplayText"
                }
            }
        },
        currentStep: { //Overriding these params to ensure name and path is correct
      //optionsListName: null,
            displayName: "Step",
            width: 150,
            pathsInAPI: {
                appointment: {
                    value: "stepName",
                    displayText: "stepName"
                }
            }
        },
        appointmentEndDt: {
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "appointmentEndDt",
                    displayText: "appointmentEndDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "appointmentEndDt",
                pathToSetValue: "appointmentEndDt"
            },
            saveOriginalValueByKey: "displayValue_appointmentEndDt",
            displayKey: "displayValue_appointmentEndDt",
            visible: true,
            width: 150
        },
        apuCodeDescYear: {
            name: "apuCodeDescYear",
            viewType: dataViewTypes.text,
            pathsInAPI: {
                appointment: {
                    value: "apuCodeDescYear",
                    displayText: "apuCodeDescYear"
                }
            },
            displayName: "APU",
            sortable: true,
            width: 300,
            visible: true
        },
        hscpBaseScale: {
            name: "hscpBaseScale",
            displayName: "HSCP Base Salary (X + X')",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpBaseScale",
            sortable: true,
            width: 150,
            pathsInAPI: {
                appointment: {
                    value: "hscpBaseScale",
                    displayText: "hscpBaseScale"
                }
            },
            visible: true
        }
    }
};

export const config = createConfigFromTemplate(bulkActionsConfig);

export const text = {
    code_text: "code",
    action_type_display_key: "actionTypeDisplayText"
};

export const actionTypeText = {
    [ActionCategoryType.REAPPOINTMENT]: "Reappointments",
    [ActionCategoryType.RENEWAL]: "Renewals",
    [ActionCategoryType.CHANGE_APU]: "Change APU",
    [ActionCategoryType.END_APPOINTMENT]: "End Appointments"
};

export const tableHelpText = {
    [ActionCategoryType.REAPPOINTMENT]: `Please choose who you would like to reappoint.
  This list only includes people who are eligible for a Reappointment,
  whose appointment ends this year, and who don't
  already have a Reappointment case this year.`,
    [ActionCategoryType.RENEWAL]: `Please choose who you would like to renew.
  This list only includes people who are eligible for a Renewal and who don't
  already have a Renewal case this year.`,
    [ActionCategoryType.CHANGE_APU]: `Please choose who you would like to change the
  APU for.  This list only includes people who are eligible for an APU change, and
  don't have a Change APU case in progress.`,
    [ActionCategoryType.END_APPOINTMENT]: `Please choose who you would like to end an
  appointment for.  This list only includes people who have current appointments.`
};

export const actionTypeList = [
    {
        actionTypeDisplayText: "Change APU",
        code: "3-37"
    },
    {
        actionTypeDisplayText: "End Appointment",
        code: "3-38"
    },
    {
        actionTypeDisplayText: "Reappointment",
        code: "1-14"
    },
    {
        actionTypeDisplayText: "Renewal",
        code: "1-13"
    }
];

export const fieldsPreHelpText = {
    [ActionCategoryType.REAPPOINTMENT]: `These will be the dates for all the people
  you have chosen.  If you have different dates for certain people, please start
  their cases individually.`,
    [ActionCategoryType.RENEWAL]: `These will be the dates for all the people
  you have chosen.  If you have different dates for certain people, please start
  their cases individually.`,
    [ActionCategoryType.CHANGE_APU]: `The Effective Date and APU ID will be the same
  for all the people you have chosen.  If you want to enter different information
  for different people, please start their cases individually.`,
    [ActionCategoryType.END_APPOINTMENT]: `This will be the appointment end date
  for all the people you have chosen. If you have different dates for certain
  people, please start their cases individually.`
};

export const fieldsPostHelpText = {
    [ActionCategoryType.REAPPOINTMENT]: `These cases will not be completed by APO.
  When you hit Complete the Cases, they will be logged as completed and show up
  on the Completed Cases page.  If approval in Opus is needed, start cases
  individually rather than in bulk.`,
    [ActionCategoryType.RENEWAL]: "",
    [ActionCategoryType.CHANGE_APU]: `These cases will not be completed by APO.
  When you hit Complete the Cases, they will be logged as completed and show up
  on the Completed Cases page. If approval in Opus is needed for a specific person,
  start these cases individually rather than in bulk. Changes to APU must be
  approved by the Dean's Office prior to entry in Opus.  Salary will be prepopulated
  with the HSCP Base Salary amount (X+X'). If one of your selected faculty are offscale,
  contact the Dean's Office for the correction.`,
    [ActionCategoryType.END_APPOINTMENT]: `These cases will not be completed by APO.
  When you hit Complete the Cases, they will be logged as completed and show up
  on the Completed Cases page.  If approval in Opus is needed, start cases
  individually rather than in bulk.`,
};

export const buttonText = {
    [ActionCategoryType.REAPPOINTMENT]: "Complete the Cases",
    [ActionCategoryType.RENEWAL]: "Start the Cases",
    [ActionCategoryType.CHANGE_APU]: "Complete the Cases",
    [ActionCategoryType.END_APPOINTMENT]: "Complete the Cases"
};

export const successMessage = {
    [ActionCategoryType.REAPPOINTMENT]: `Your cases have been completed.
  Find them on the Completed Cases page.`,
    [ActionCategoryType.RENEWAL]: "Your cases have been started. Find them on the Active Cases page.",
    [ActionCategoryType.CHANGE_APU]: `Your cases have been completed.
  Find them on the Completed Cases page.`,
    [ActionCategoryType.END_APPOINTMENT]: `Your cases have been completed.
  Find them on the Completed Cases page.`
};
