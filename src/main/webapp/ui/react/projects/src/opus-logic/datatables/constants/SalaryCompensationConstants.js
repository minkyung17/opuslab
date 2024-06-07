import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

export const searchCriteria = {
    categories: {
        senate: {
            displayName: "Senate",
            name: "pathAcademicSenate"
        },
        non_senate: {
            displayName: "Non-Senate",
            alternateFlag: "senate"
        },
        tenure: {
            displayName: "Tenured",
            name: "pathTenure"
        },
        non_tenured: {
            displayName: "Non-Tenured",
            alternateFlag: "tenure"
        },
        unit_18: {
            displayName: "Unit 18",
            name: "pathUnit18"
        },
        non_unit_18: {
            displayName: "Non-Unit 18",
            alternateFlag: "unit_18"
        },
        hscp: {
            displayName: "HSCP",
            name: "pathHSCP"
        },
        non_hscp: {
            displayName: "Non-HSCP",
            alternateFlag: "hscp"
        }
    },
    affirmativeSearch: ["senate", "tenure", "unit_18", "hscp"],
    exclusionarySearch: ["non_senate", "non_tenured", "non_unit_18",
    "non_hscp"]
};

export const totals = [
    {
        name: "annualRateAmt",
        total: null
    },
    {
        name: "scaleOffscale",
        total: null
    },
    {
        name: "onScaleAmt",
        total: null
    },
    {
        name: "offscaleAmt",
        total: null
    },
    {
        name: "aboveScaleAmt",
        total: null
    },
    {
        name: "nstpAmt",
        total: null
    },
    {
        name: "nstpNotFirm",
        total: null
    },
    {
        name: "hscpXXAmt",
        total: null
    },
    {
        name: "hscpXAmt",
        total: null
    },
    {
        name: "hscpXPrimeAmt",
        total: null
    },
    {
        name: "hscpAboveScaleX",
        total: null
    },
    {
        name: "hscpAboveScaleXPrime",
        total: null
    },
    {
        name: "hscpYAmt",
        total: null
    },
    {
        name: "hscpYNotFirm",
        total: null
    },
    {
        name: "hscpYNotFirm",
        total: null
    },
];

/**
 *
 * @desc - Configuration constant for UC Path Compensation Page
 *
**/
export const salaryCompensationConfig = {
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/downloadPathCompensationReportCSV",
    url: "/restServices/rest/pathCompensation",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "offScales",
    excelFileName: "UCPathCompensationReport.csv",
    pageName: "SalaryCompensation",
    exportData: descriptions.exportDataDefaultMessage,
    visibleColumnKey: "visible",
    pagePermissions: {
        name: "salary",
        action: "view"
    },
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
        {visible: true, name: "emplId", displayName: "Empl. ID"},
        {visible: true, name: "uid", displayName: "UID"},
        {visible: true, name: "fullName", displayName: "Name"},
        {visible: true, name: "schoolName", displayName: "School"},
        {visible: true, name: "departmentCode", displayName: "Dept. Code"},
        {visible: true, name: "departmentName", displayName: "Dept. Name"},
        {visible: true, name: "payrollStatus", displayName: "Payroll Status"},
        {visible: true, name: "titleCode", displayName: "Title Code"},
        {visible: true, name: "payrollTitle", displayName: "Title"},
        {visible: true, name: "series", displayName: "Series"},
        {visible: true, name: "rank", displayName: "Rank"},
        {visible: true, name: "step", displayName: "Step"},
        {visible: true, name: "fte", displayName: "FTE"},
        {visible: true, name: "salaryAdminPlanDesc", displayName: "Salary Admin Plan"},
        {visible: true, name: "annualRateAmt", displayName: "Annual Rate"},
        {visible: true, name: "scaleOffscale", displayName: "Scale + Off-Scale"},
        {visible: true, name: "onScaleAmt", displayName: "On-Scale Amt."},
        {visible: true, name: "offscaleAmt", displayName: "Off-Scale Amt."},
        {visible: true, name: "offscalePct", displayName: "Off-Scale %"},
        {visible: true, name: "aboveScaleAmt", displayName: "Above Scale"},
        {visible: true, name: "nstpAmt", displayName: "NSTP"},
        {visible: true, name: "nstpNotFirm", displayName: "NSTP (not firm)"},
        {visible: true, name: "hscpXXAmt", displayName: "HSCP X+X"},
        {visible: true, name: "hscpXAmt", displayName: "HSCP X"},
        {visible: true, name: "hscpXPrimeAmt", displayName: "HSCP X'"},
        {visible: true, name: "hscpAboveScaleX", displayName: "HSCP Above Scale X"},
        {visible: true, name: "hscpAboveScaleXPrime", displayName: "HSCP Above Scale X'"},
        {visible: true, name: "hscpYAmt", displayName: "HSCP Y"},
        {visible: true, name: "hscpYNotFirm", displayName: "HSCP Y (not firm)"},
        {visible: true, name: "lastAdvancementActionEffectiveDt", displayName: "Effective Date of Last Advancement"}
            ]
        }
    },
    columnKeys: ["emplId", "uid", "fullName", "schoolName", "departmentCode", "departmentName", "payrollStatus",
    "titleCode", "payrollTitle", "series", "rank", "step", "fte", "salaryAdminPlanDesc", "annualRateAmt",
    "scaleOffscale", "onScaleAmt", "offscaleAmt", "offscalePct", "aboveScaleAmt", "nstpAmt", "nstpNotFirm", "hscpXXAmt",
    "hscpXAmt", "hscpXPrimeAmt", "hscpAboveScaleX", "hscpAboveScaleXPrime", "hscpYAmt", "hscpYNotFirm", "lastAdvancementActionEffectiveDt"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        emplId: {
            pathsInAPI: {
                appointment: {
                    value: "emplId",
                    displayText: "emplId"
                }
            },
            visible: true
        },
        uid: {
            pathsInAPI: {
                appointment: {
                    value: "uid",
                    displayText: "uid"
                }
            },
            visible: true
        },
        fullName: {
            name: "fullName",
            pathsInAPI: {
                appointment: {
                    value: "fullName",
                    displayText: "fullName"
                }
            },
            viewType: dataViewTypes.sortingText,
            displayKey: "displayValue_fullName",
            visible: true
        },
        schoolName: {
            pathsInAPI: {
                appointment: {
                    value: "schoolName",
                    displayText: "schoolName"
                }
            },
            visible: true
        },
        departmentCode: {
            name: "departmentCode",
            displayName: "Dept. Code",
            pathsInAPI: {
                appointment: {
                    value: "departmentCode",
                    displayText: "departmentCode"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        departmentName: {
            displayName: "Dept. Name",
            optionsListName: null,
            pathsInAPI: {
                appointment: {
                    value: "departmentName",
                    displayText: "departmentName"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        payrollStatus: {
            name: "payrollStatus",
            displayName: "Payroll Status",
            pathsInAPI: {
                appointment: {
                    value: "payrollStatus",
                    displayText: "payrollStatus"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        titleCode: {
            name: "titleCode",
            displayName: "Title Code",
            pathsInAPI: {
                appointment: {
                    value: "titleCode",
                    displayText: "titleCode"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        payrollTitle: {
            name: "payrollTitle",
            displayName: "Title",
            pathsInAPI: {
                appointment: {
                    value: "payrollTitle",
                    displayText: "payrollTitle"
                }
            },
            visible: true,
            dynamicFilterSearch: true
        },
        series: {
            name: "series",
            displayName: "Series",
            pathsInAPI: {
                appointment: {
                    value: "series",
                    displayText: "series"
                }
            },
            optionsListName: "seriesList",
            visible: true
        },
        rank: {
            name: "rank",
            displayName: "Rank",
            pathsInAPI: {
                appointment: {
                    value: "rank",
                    displayText: "rank"
                }
            },
            optionsListName: "rankList",
            visible: true
        },
        step: {
            name: "step",
            displayName: "Step",
            pathsInAPI: {
                appointment: {
                    value: "step",
                    displayText: "step"
                }
            },
            optionsListName: "stepList",
            visible: true
        },
        fte: {
            name: "fte",
            displayName: "FTE",
            pathsInAPI: {
                appointment: {
                    value: "fte",
                    displayText: "fte"
                }
            },
            visible: true
        },
        salaryAdminPlanDesc: {
            name: "salaryAdminPlanDesc",
            displayName: "Salary Admin Plan",
            pathsInAPI: {
                appointment: {
                    value: "salaryAdminPlanDesc",
                    displayText: "salaryAdminPlanDesc"
                }
            },
            visible: true
        },
        annualRateAmt: {
            name: "annualRateAmt",
            displayName: "Annual Rate",
            pathsInAPI: {
                appointment: {
                    value: "annualRateAmt",
                    displayText: "annualRateAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_annualRateAmt",
            visible: true
        },
        scaleOffscale: {
            name: "scaleOffscale",
            displayName: "Scale + Off-Scale",
            descriptionText: descriptions.scale_plus_off_scale,
            pathsInAPI: {
                appointment: {
                    value: "scaleOffscale",
                    displayText: "scaleOffscale"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_scaleOffscale",
            visible: true
        },
        onScaleAmt: {
            name: "onScaleAmt",
            displayName: "On-Scale Amt.",
            descriptionText: descriptions.on_scale_amt,
            pathsInAPI: {
                appointment: {
                    value: "onScaleAmt",
                    displayText: "onScaleAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_onScaleAmt",
            visible: true
        },
        offscaleAmt: {
            name: "offscaleAmt",
            displayName: "Off-Scale Amt.",
            pathsInAPI: {
                appointment: {
                    value: "offscaleAmt",
                    displayText: "offscaleAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_offscaleAmt",
            visible: true,
            descriptionText: descriptions.off_scale_amt
        },
        offscalePct: {
            name: "offscalePct",
            displayName: "Off-Scale %",
            pathsInAPI: {
                appointment: {
                    value: "offscalePct",
                    displayText: "offscalePct"
                }
            },
            viewType: dataViewTypes.percent,
            displayKey: "displayValue_offscalePct",
            visible: true,
            descriptionText: descriptions.off_scale_percent
        },
        aboveScaleAmt: {
            name: "aboveScaleAmt",
            displayName: "Above Scale",
            descriptionText: descriptions.above_scale,
            pathsInAPI: {
                appointment: {
                    value: "aboveScaleAmt",
                    displayText: "aboveScaleAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_aboveScaleAmt",
            visible: true
        },
        nstpAmt: {
            name: "nstpAmt",
            displayName: "NSTP",
            descriptionText: descriptions.NSTP,
            pathsInAPI: {
                appointment: {
                    value: "nstpAmt",
                    displayText: "nstpAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_nstpAmt",
            visible: true
        },
        nstpNotFirm: {
            name: "nstpNotFirm",
            displayName: "NSTP (not firm)",
            descriptionText: descriptions.NSTP_not_firm,
            pathsInAPI: {
                appointment: {
                    value: "nstpNotFirm",
                    displayText: "nstpNotFirm"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_nstpNotFirm",
            visible: true
        },
        hscpXXAmt: {
            name: "hscpXXAmt",
            displayName: "HSCP X+X",
            pathsInAPI: {
                appointment: {
                    value: "hscpXXAmt",
                    displayText: "hscpXXAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpXXAmt",
            visible: true,
            descriptionText: descriptions.HSCP_X_X
        },
        hscpXAmt: {
            name: "hscpXAmt",
            displayName: "HSCP X",
            pathsInAPI: {
                appointment: {
                    value: "hscpXAmt",
                    displayText: "hscpXAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpXAmt",
            visible: true,
            descriptionText: descriptions.HSCP_X
        },
        hscpXPrimeAmt: {
            name: "hscpXPrimeAmt",
            displayName: "HSCP X'",
            pathsInAPI: {
                appointment: {
                    value: "hscpXPrimeAmt",
                    displayText: "hscpXPrimeAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpXPrimeAmt",
            visible: true,
            descriptionText: descriptions.HSCP_X_prime
        },
        hscpAboveScaleX: {
            name: "hscpAboveScaleX",
            displayName: "HSCP Above Scale X",
            pathsInAPI: {
                appointment: {
                    value: "hscpAboveScaleX",
                    displayText: "hscpAboveScaleX"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpAboveScaleX",
            visible: true,
            descriptionText: descriptions.HSCP_above_scale_X
        },
        hscpAboveScaleXPrime: {
            name: "hscpAboveScaleXPrime",
            displayName: "HSCP Above Scale X'",
            pathsInAPI: {
                appointment: {
                    value: "hscpAboveScaleXPrime",
                    displayText: "hscpAboveScaleXPrime"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpAboveScaleXPrime",
            visible: true,
            descriptionText: descriptions.HSCP_above_scale_X_prime
        },
        hscpYAmt: {
            name: "hscpYAmt",
            displayName: "HSCP Y",
            pathsInAPI: {
                appointment: {
                    value: "hscpYAmt",
                    displayText: "hscpYAmt"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpYAmt",
            visible: true,
            descriptionText: descriptions.HSCP_Y
        },
        hscpYNotFirm: {
            name: "hscpYNotFirm",
            displayName: "HSCP Y (not firm)",
            pathsInAPI: {
                appointment: {
                    value: "hscpYNotFirm",
                    displayText: "hscpYNotFirm"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpYNotFirm",
            visible: true,
            descriptionText: descriptions.HSCP_Y_not_firm
        },
        hscpYNotFirm: {
            name: "hscpYNotFirm",
            displayName: "HSCP Y (not firm)",
            pathsInAPI: {
                appointment: {
                    value: "hscpYNotFirm",
                    displayText: "hscpYNotFirm"
                }
            },
            viewType: dataViewTypes.money,
            displayKey: "displayValue_hscpYNotFirm",
            visible: true,
            descriptionText:descriptions.HSCP_Y_not_firm
        },
        lastAdvancementActionEffectiveDt: {
            name: "lastAdvancementActionEffectiveDt",
            displayName: "Effective Date of Last Advancement",
            visible: true,
            descriptionText:descriptions.effective_date_last_advancement
        }
    }
};

export const config = createConfigFromTemplate(salaryCompensationConfig);
