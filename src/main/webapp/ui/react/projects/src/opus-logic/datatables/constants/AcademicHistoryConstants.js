import {dataViewTypes} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

/**
 * @desc - Configuration constant for ActiveCases Page
 *
 *
**/
const academicHistoryConfig = {
    type: "dataTable",
    exportToExcelBaseUrl: "/restServices/rest/profile/downloadAcademicHistoryData",
    exportToPDFBaseUrl: "/restServices/rest/profile/downloadAcademicHistoryInPDF",
    grouperPathText: "eligibility",
    editCasesUrl: "/opusWeb/ui/admin/case-summary.shtml?caseId=",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "activeCaseDataRows",
    pageName: "academicHistory",
    visibleColumnKey: "visible",
    bypassViewCheck: true,
    columnKeys: ["checkbox", "academicYear", "effectiveDate", "actionType", "actionCompletedDt", "outcomeType",
    "yearsAccelerated", "yearsDeferred", "appointmentId", "schoolName", "divisionName", "departmentName",
    "areaName", "specialtyName", "affiliation", "appointmentPctTime", "location", "titleCode", "payrollTitle",
    "series", "rank", "step", "appointmentEndDt", "salary", "apu",
    "seriesStartDt", "rankStartDt", "stepStartDt", "waiverEndDt", "actionStatus",
    "comments"],
    invalidChangeColumnsOptions: ["checkbox"],
    omitUIColumns: ["checkbox"],
  //Columns will appear in array order shown here
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
        titleCode: {
      //dynamicFilterSearch: false
      //optionsListName: null
        },
        academicYear: {
            fixed: true,
            width: 150,
            dynamicFilterSearch: true
        },
        actionStatus: {
            name: "actionStatus",
            displayName: "Action Status",
            dynamicFilterSearch: true,
            descriptionText: descriptions.actionStatus,
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "actionStatusInfo.commonTypeValue",
                    displayText: "actionStatusInfo.commonTypeValue"
                }
            }
        },
        effectiveDate: {
            fixed: true,
            width: 110,
            name: "effectiveDate",
            displayName: "Effective Date",
            dataType: "date",
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "effectiveDt",
                pathToSetValue: "effectiveDate"
            },
            saveOriginalValueByKey: "displayValue_effectiveDate",
            displayKey: "displayValue_effectiveDate"
        },
        actionType: {
            name: "actionType",
            fixed: true,
            visible: true,
            displayName: "Action",
            dynamicFilterSearch: true,
            optionsListName:"",
            viewType: dataViewTypes.link,
            displayKey: "displayValue_actionType",
            pathsInAPI: {
                appointment: {
                    value: "actionTypeInfo.actionTypeDisplayText",
                    displayText: "actionTypeInfo.actionTypeDisplayText"
                }
            }
        },
        actionCompletedDt: {
            pathsInAPI: {
                appointment: {
                    value: "actionCompletedDate",
                    displayText: "actionCompletedDate"
                }
            }
        },
        outcomeType: {
            name: "outcomeType",
            displayName: "Outcome",
            optionsListName: "actionOutcomes",
            pathsInAPI: {
                appointment: {
                    value: "approvedActionOutcome.name",
                    displayText: "approvedActionOutcome.name"
                }
            },
            visible: true,
        },
        areaName: {
      //optionsListName: null
        },
        divisionName: {
      //optionsListName: null
        },
        specialtyName: {
      //optionsListName: null
        },
        yearsAccelerated: {
            descriptionText: descriptions.years_accelerated,
            pathsInAPI: {
                appointment: {
                    value: "approvedYearsAcceleratedCnt",
                    displayText: "approvedYearsAcceleratedCnt"
                }
            },
            name: "yearsAccelerated",
            displayName: "Years Accelerated",
            visible: true,
            width: 110
        },
        yearsDeferred: {
            descriptionText: descriptions.years_deferred,
            pathsInAPI: {
                appointment: {
                    value: "approvedYearsDeferredCnt",
                    displayText: "approvedYearsDeferredCnt"
                }
            },
            name: "yearsDeferred",
            displayName: "Years Deferred",
            visible: true,
            width: 110
        },
        appointmentId: {
            name: "appointmentId",
            displayName: "Appt. ID",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.appointmentId",
                    displayText: "appointmentInfo.appointmentId"
                }
            },
            dynamicFilterSearch: true,
            visible: false
        },
        waiverEndDt: {
            name: "waiverEndDt",
            displayName: "Waiver End Date",
            descriptionText: descriptions.waiver_expiration_date,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.waiverEndDt",
                    displayText: "appointmentInfo.waiverEndDt"
                }
            },
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "waiverEndDt",
                pathToSetValue: "waiverEndDt"
            },
            saveOriginalValueByKey: "displayValue_waiverEndDt",
            displayKey: "displayValue_waiverEndDt"
        },
        schoolName: {
      //optionsListName: null
        },
        location: {
            name: "location",
            displayName: "Location",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.location",
                    displayText: "appointmentInfo.academicHierarchyInfo.location"
                }
            },
            optionsListName: "orgLocationList",
            descriptionText: descriptions.location,
            viewType: dataViewTypes.tooltip
        },
        departmentName: {
            visible: true
      //optionsListName: null
        },
        appointmentPctTime: {
            name: "appointmentPctTime",
            displayName: "Percent Time",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.appointmentPctTime",
                    displayText: "appointmentInfo.appointmentPctTime"
                }
            },
            viewType: dataViewTypes.percent,
            displayKey: "displayValue_appointmentPctTime",
            width: 150,
            visible: false
        },
        affiliation: {
            visible: true
        },
        rank: {
            displayName: "Rank"
        },
        step: {
            displayName: "Step"
        },
        series: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.seriesInfo.seriesDisplayText",
                    displayText: "appointmentInfo.titleInformation.seriesInfo.seriesDisplayText"
                }
            }
        },
        seriesStartDt: {
            name: "seriesStartDt",
            displayName: "Start Date at Series",
            dataType: "date",
            descriptionText: descriptions.start_date_at_series,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.seriesInfo.seriesStartDt",
                    displayText: "appointmentInfo.titleInformation.seriesInfo.seriesStartDt"
                },
                actionData: {
                    value: "seriesStartDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "seriesStartDt",
                pathToSetValue: "seriesStartDt"
            },
            saveOriginalValueByKey: "displayValue_seriesStartDt",
            displayKey: "displayValue_seriesStartDt",
            viewType: dataViewTypes.displayByKey,
            onChangePermanentMessage: "Please update any impacted appointments!"
        },
        rankStartDt: {
            name: "rankStartDt",
            displayName: "Start Date at Rank",
            dataType: "date",
            descriptionText: descriptions.start_date_at_rank,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.rank.rankStartDt",
                    displayText: "appointmentInfo.titleInformation.rank.rankStartDt"
                },
                actionData: {
                    value: "rankStartDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "rankStartDt",
                pathToSetValue: "rankStartDt"
            },
            saveOriginalValueByKey: "displayValue_rankStartDt",
            displayKey: "displayValue_rankStartDt",
            viewType: dataViewTypes.displayByKey
        },
        stepStartDt: {
            name: "stepStartDt",
            displayName: "Start Date at Step",
            dataType: "date",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.step.stepStartDt",
                    displayText: "appointmentInfo.titleInformation.step.stepStartDt"
                },
                actionData: {
                    value: "stepStartDt"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "stepStartDt",
                pathToSetValue: "stepStartDt"
            },
            saveOriginalValueByKey: "displayValue_stepStartDt",
            displayKey: "displayValue_stepStartDt",
            viewType: dataViewTypes.displayByKey,
            descriptionText: descriptions.start_date_at_step,
            onChangePermanentMessage: "Please update any impacted appointments!"
        },
        salary: {
            name: "salary",
            visible: true,
            displayName: "Salary",
            viewType: dataViewTypes.money,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.salaryInfo.payrollSalary",
                    displayText: "appointmentInfo.salaryInfo.payrollSalary"
                }
            },
            descriptionText: descriptions.salary,
            displayKey: "displayValue_salary"
        },
        payrollTitle: {
            name: "payrollTitle",
            displayName: "Payroll Title",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.payrollTitle",
                    displayText: "appointmentInfo.titleInformation.payrollTitle"
                }
            },
        },
        apu: {
            name: "apu",
            displayName: "APU ID",
            visible: false,
            descriptionText: descriptions.apu_id,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.salaryInfo.academicProgramUnit.apuId",
                    displayText: "appointmentInfo.salaryInfo.academicProgramUnit.apuDesc"
                }
            }
        },
        appointmentEndDt: {
            name: "appointmentEndDt",
            displayName: "Appt. End Date",
            descriptionText: descriptions.end_date,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.appointmentEndDt",
                    displayText: "appointmentInfo.appointmentEndDt"
                }
            },
            viewType: dataViewTypes.displayByKey,
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "appointmentEndDt",
                pathToSetValue: "appointmentEndDt"
            },
            saveOriginalValueByKey: "displayValue_appointmentEndDt",
            displayKey: "displayValue_appointmentEndDt"
        },
        comments: {
            name: "comments",
            displayName: "Comments",
            pathsInAPI: {
                appointment: {
                    value: "userComments",
                    displayText: "userComments"
                }
            },
            width: 310,
            viewType: dataViewTypes.tooltip
        }
    }
};


export const config = createConfigFromTemplate(academicHistoryConfig);
