import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/**
 *
 * @desc - Configuration constant for Administrative Reports Page
 *
**/
export const reportsConfiguration = {
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/admincomp/downloadACReportsCSV",
    url: "/restServices/rest/admincomp/acReportsScreenData",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "acReportRows",
    excelFileName: "Admin Comp Path Actuals",
    pageName: "AdminCompReport",
    csvPageName: "AdminCompReports",
    visibleColumnKey: "visible",
    defaultFilterView: {
        savedPreferenceName: "Opus Standard View",
        opusDefault: true,
        defaultPref: false,
        filters: {
            dataColumnFilters:{
                columnSortOrder: {academicYear: "desc", school: "asc",
        division: "asc", department: "asc", emplName: "asc"},
                columnStringMatch: {},
                columnValueOptions: {},
                outsideFilters: {},
                simpleFilters: {}
            },
            formattedColumnOptions: [
        {visible: true, name: "academicYear", displayName: "Academic Year"},
        {visible: false, name: "fiscalYear", displayName: "Fiscal Year (UCPath)"},
        {visible: true, name: "school", displayName: "School"},
        {visible: true, name: "division", displayName: "Division"},
        {visible: true, name: "department", displayName: "Department"},
        {visible: false, name: "area", displayName: "Area"},
        {visible: false, name: "specialty", displayName: "Specialty"},
        {visible: true, name: "organizationName", displayName: "Organization Name"},
        {visible: true, name: "ucPathDepartment", displayName: "Department (UCPath)"},
        {visible: false, name: "empId", displayName: "Empl. ID"},
        {visible: false, name: "uid", displayName: "UID"},
        {visible: false, name: "opusId", displayName: "Opus ID"},
        {visible: true, name: "emplName", displayName: "Name"},
        {visible: true, name: "approvedTitleCode", displayName: "Approved Title Code"},
        {visible: false, name: "jobCode", displayName: "Job Code (UCPath)"},
        {visible: true, name: "workingTitle", displayName: "Working Title / Role"},
        {visible: false, name: "justification", displayName: "Justification"},
        {visible: true, name: "approvedEffectiveDt", displayName: "Approved Effective Date"},
        {visible: true, name: "ucPathEffectiveDt", displayName: "Effective Date (UCPath)"},
        {visible: true, name: "approvedEndDt", displayName: "Approved End Date"},
        {visible: true, name: "ucPathExpectedEndDt", displayName: "Expected End Date (UCPath)"},
        {visible: true, name: "totalApprovedStipendAmt", displayName: "Total Approved Stipend Amt."},
        {visible: true, name: "ucPathTotalYTDStipendAmt", displayName: "Total YTD Stipend Amt. (UCPath)"},
        {visible: true, name: "totalApproved9thsAmt", displayName: "Total Approved 9ths Amt."},
        {visible: true, name: "ucPathTotalYTD9thsAmt", displayName: "Total YTD 9ths Amt. (UCPath)"},
        {visible: true, name: "totalApprovedAdminComp", displayName: "Total Approved Admin. Comp."},
        {visible: true, name: "ucPathTotalYTDAdminComp", displayName: "Total YTD Admin. Comp. (UCPath)"},
        {visible: true, name: "approvedBaseSalary", displayName: "Approved Base Salary"},
        {visible: true, name: "totalApprovedComp", displayName: "Total Approved Comp."}
            ]
        }
    },
    pagePermissions: {
        name: "admin_comp_pathcomparison_view",
        action: "view"
    },
    columnKeys: ["academicYear", "fiscalYear", "school", "division", "department", "area", "specialty", "organizationName", "ucPathDepartment",
    "empId", "uid", "opusId", "emplName", "approvedTitleCode", "jobCode", "workingTitle", "justification", "approvedEffectiveDt",
    "ucPathEffectiveDt", "approvedEndDt", "ucPathExpectedEndDt", "totalApprovedStipendAmt", "ucPathTotalYTDStipendAmt", "totalApproved9thsAmt",
    "ucPathTotalYTD9thsAmt", "totalApprovedAdminComp", "ucPathTotalYTDAdminComp", "approvedBaseSalary", "totalApprovedComp"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        academicYear: {
            name: "academicYear",
            displayName: "Academic Year",
            pathsInAPI: {
                appointment: {
                    value: "academicYear",
                    displayText: "academicYear"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 125
        },
        fiscalYear: {
            name: "fiscalYear",
            displayName: "Fiscal Year (UCPath)",
            pathsInAPI: {
                appointment: {
                    value: "fiscalYear",
                    displayText: "fiscalYear"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 125
        },
        school: {
            name: "school",
            displayName: "School",
            pathsInAPI: {
                appointment: {
                    value: "school",
                    displayText: "school"
                }
            },
            visible: true,
            optionsListName: "schoolList",
            width: 250
        },
        division: {
            name: "division",
            displayName: "Division",
            pathsInAPI: {
                appointment: {
                    value: "division",
                    displayText: "division"
                }
            },
            visible: true,
            optionsListName: "divisionList"
        },
        department: {
            name: "department",
            displayName: "Department",
            pathsInAPI: {
                appointment: {
                    value: "department",
                    displayText: "department"
                }
            },
            optionsListName: "departmentList",
            width: 250,
            visible: true
        },
        area: {
            name: "area",
            displayName: "Area",
            optionsListName: "areaList",
            descriptionText: descriptions.area,
            pathsInAPI: {
                appointment: {
                    value: "area",
                    displayText: "area"
                }
            },
            visible: false
        },
        specialty: {
            name: "specialty",
            displayName: "Specialty",
            optionsListName: "specialtyList",
            descriptionText: descriptions.specialty,
            pathsInAPI: {
                appointment: {
                    value: "specialty",
                    displayText: "specialty"
                }
            },
            visible: false
        },
        organizationName: {
            name: "organizationName",
            displayName: "Organization Name",
            pathsInAPI: {
                appointment: {
                    value: "organizationName",
                    displayText: "organizationName"
                }
            },
            visible: true,
            dynamicFilterSearch: true,
            optionsListName: "schoolList",
            width: 250,
            dynamicFilterSearch: true,
            descriptionText: descriptions.organizationNameForProposalsDatatable,
            viewType: dataViewTypes.tooltip
        },
        ucPathDepartment: {
            name: "ucPathDepartment",
            displayName: "Department (UCPath)",
            pathsInAPI: {
                appointment: {
                    value: "ucPathDepartment",
                    displayText: "ucPathDepartment"
                }
            },
            visible: true,
            width: 250,
            dynamicFilterSearch: true,
            descriptionText: descriptions.ucPathdepartment,
            viewType: dataViewTypes.tooltip
        },
        empId: {
            name: "empId",
            displayName: "Empl. ID",
            pathsInAPI: {
                appointment: {
                    value: "empId",
                    displayText: "empId"
                }
            },
            width: 100,
            fixed: false,
            visible: false
        },
        uid: {
            name: "uid",
            displayName: "UID",
            pathsInAPI: {
                appointment: {
                    value: "uid",
                    displayText: "uid"
                }
            },
            width: 100,
            fixed: false,
            visible: false
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
            width: 100,
            visible: false
        },
        emplName: {
            name: "emplName",
            displayName: "Name",
            viewType: dataViewTypes.sortingText,
            pathsInAPI: {
                appointment: {
                    value: "emplName",
                    displayText: "emplName"
                }
            },
            displayKey: "displayValue_emplName",
            width: 225,
            visible: true,
            textSearch: true
        },
        approvedTitleCode: {
            name: "approvedTitleCode",
            displayName: "Approved Title Code",
            pathsInAPI: {
                appointment: {
                    value: "approvedTitleCode",
                    displayText: "approvedTitleCode"
                }
            },
            visible: true,
            dynamicFilterSearch: true,
            sortable: true,
            descriptionText: descriptions.approvedTitleCode
        },
        jobCode: {
            name: "jobCode",
            displayName: "Job Code (UCPath)",
            pathsInAPI: {
                appointment: {
                    value: "jobCode",
                    displayText: "jobCode"
                }
            },
            visible: true,
            dynamicFilterSearch: true
            // descriptionText: descriptions.jobCode
        },
        workingTitle: {
            name: "workingTitle",
            displayName: "Working Title / Role",
            pathsInAPI: {
                appointment: {
                    value: "workingTitle",
                    displayText: "workingTitle"
                }
            },
            visible: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.workingTitleForProposalsTable,
            viewType: dataViewTypes.tooltip
        },
        justification: {
            name: "justification",
            displayName: "Justification",
            pathsInAPI: {
                appointment: {
                    value: "justification",
                    displayText: "justification"
                }
            },
            visible: true,
            sortable: false,
            descriptionText: descriptions.justificationForProposals,
            viewType: dataViewTypes.tooltip
        },
        approvedEffectiveDt: {
            name: "approvedEffectiveDt",
            displayName: "Approved Effective Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "approvedEffectiveDt",
                    displayText: "approvedEffectiveDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "approvedEffectiveDt",
                pathToSetValue: "approvedEffectiveDt"
            },
            saveOriginalValueByKey: "displayValue_approvedEffectiveDt",
            displayKey: "displayValue_approvedEffectiveDt",
            visible: true,
            sortable: true,
            width: 100
      // dynamicFilterSearch: true,
      // descriptionText: descriptions.title
        },
        ucPathEffectiveDt: {
            name: "ucPathEffectiveDt",
            displayName: "Effective Date (UCPath)",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "ucPathEffectiveDt",
                    displayText: "ucPathEffectiveDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "ucPathEffectiveDt",
                pathToSetValue: "ucPathEffectiveDt"
            },
            saveOriginalValueByKey: "displayValue_ucPathEffectiveDt",
            displayKey: "displayValue_ucPathEffectiveDt",
            visible: true,
            sortable: true,
            width: 120,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.ucPathEffectiveDt
        },
        approvedEndDt: {
            name: "approvedEndDt",
            displayName: "Approved End Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "approvedEndDt",
                    displayText: "approvedEndDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "approvedEndDt",
                pathToSetValue: "approvedEndDt"
            },
            saveOriginalValueByKey: "displayValue_approvedEndDt",
            displayKey: "displayValue_approvedEndDt",
            visible: true,
            sortable: true,
            width: 100
      // dynamicFilterSearch: true,
      // descriptionText: descriptions.title
        },
        ucPathExpectedEndDt: {
            name: "ucPathExpectedEndDt",
            displayName: "Expected End Date (UCPath)",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "ucPathExpectedEndDt",
                    displayText: "ucPathExpectedEndDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "ucPathExpectedEndDt",
                pathToSetValue: "ucPathExpectedEndDt"
            },
            saveOriginalValueByKey: "displayValue_ucPathExpectedEndDt",
            displayKey: "displayValue_ucPathExpectedEndDt",
            visible: true,
            sortable: true,
            width: 100
      // dynamicFilterSearch: true,
      // descriptionText: descriptions.title
        },
        totalApprovedStipendAmt: {
            name: "totalApprovedStipendAmt",
            displayName: "Total Approved Stipend Amt.",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_totalApprovedStipendAmt",
            pathsInAPI: {
                appointment: {
                    value: "totalApprovedStipendAmt",
                    displayText: "totalApprovedStipendAmt"
                }
            },
            visible: true,
            sortable: true,
            width: 120,
            descriptionText: descriptions.totalApprovedStipendAmt
        },
        ucPathTotalYTDStipendAmt: {
            name: "ucPathTotalYTDStipendAmt",
            displayName: "Total YTD Stipend Amt. (UCPath)",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_ucPathTotalYTDStipendAmt",
            pathsInAPI: {
                appointment: {
                    value: "ucPathTotalYTDStipendAmt",
                    displayText: "ucPathTotalYTDStipendAmt"
                }
            },
            visible: true,
            sortable: true,
            width: 125,
            descriptionText: descriptions.ucPathTotalYTDStipendAmt
        },
        totalApproved9thsAmt: {
            name: "totalApproved9thsAmt",
            displayName: "Total Approved 9ths Amt.",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_totalApproved9thsAmt",
            pathsInAPI: {
                appointment: {
                    value: "totalApproved9thsAmt",
                    displayText: "totalApproved9thsAmt"
                }
            },
            visible: true,
            sortable: true,
            width: 120,
            descriptionText: descriptions.totalApproved9thsAmt
        },
        ucPathTotalYTD9thsAmt: {
            name: "ucPathTotalYTD9thsAmt",
            displayName: "Total YTD 9ths Amt. (UCPath)",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_ucPathTotalYTD9thsAmt",
            pathsInAPI: {
                appointment: {
                    value: "ucPathTotalYTD9thsAmt",
                    displayText: "ucPathTotalYTD9thsAmt"
                }
            },
            visible: true,
            sortable: true,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.ucPathTotalYTD9thsAmt,
            width: 125
        },
        totalApprovedAdminComp: {
            name: "totalApprovedAdminComp",
            displayName: "Total Approved Admin. Comp.",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_totalApprovedAdminComp",
            pathsInAPI: {
                appointment: {
                    value: "totalApprovedAdminComp",
                    displayText: "totalApprovedAdminComp"
                }
            },
            visible: true,
            sortable: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.totalApprovedAdminComp
        },
        ucPathTotalYTDAdminComp: {
            name: "ucPathTotalYTDAdminComp",
            displayName: "Total YTD Admin. Comp. (UCPath)",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_ucPathTotalYTDAdminComp",
            pathsInAPI: {
                appointment: {
                    value: "ucPathTotalYTDAdminComp",
                    displayText: "ucPathTotalYTDAdminComp"
                }
            },
            visible: true,
            sortable: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.ucPathTotalYTDAdminComp
        },
        approvedBaseSalary: {
            name: "approvedBaseSalary",
            displayName: "Approved Base Salary",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_approvedBaseSalary",
            pathsInAPI: {
                appointment: {
                    value: "approvedBaseSalary",
                    displayText: "approvedBaseSalary"
                }
            },
            visible: true,
            sortable: true,
            width: 125
      // dynamicFilterSearch: true,
            // descriptionText: descriptions.approvedBaseSalary
        },
        totalApprovedComp: {
            name: "totalApprovedComp",
            displayName: "Total Approved Comp.",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_totalApprovedComp",
            pathsInAPI: {
                appointment: {
                    value: "totalApprovedComp",
                    displayText: "totalApprovedComp"
                }
            },
            visible: true,
            sortable: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.totalApprovedComp
        }
    }
};

export const config = createConfigFromTemplate(reportsConfiguration);
