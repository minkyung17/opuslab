import {dataViewTypes} from "./DatatableConstants";
import {descriptions } from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

export const searchCriteria = {
    categories: {
        senate: {
            displayName: "Senate",
            name: "academicSenate"
        },
        non_senate: {
            displayName: "Non-Senate",
            alternateFlag: "senate"
        },
        tenured: {
            displayName: "Tenured",
            name: "tenure"
        },
        non_tenured: {
            displayName: "Non-Tenured",
            alternateFlag: "tenured"
        },
        emeriti: {
            displayName: "Emeriti",
            name: "emeritusFlag"
        },
        non_emeriti: {
            displayName: "Non-Emeriti",
            alternateFlag: "emeriti"
        },
        unit_18: {
            displayName: "Unit 18",
            name: "unit18"
        },
        non_unit_18: {
            displayName: "Non-Unit 18",
            alternateFlag: "unit_18"
        },
        hscp: {
            displayName: "HSCP",
            name: "hSCP"
        },
        non_hscp: {
            displayName: "Non-HSCP",
            alternateFlag: "hscp"
        }
    },
    affirmativeSearch: ["senate", "tenured", "emeriti", "unit_18", "hscp"],
    exclusionarySearch: ["non_senate", "non_tenured", "non_emeriti", "non_unit_18",
    "non_hscp"]
};

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
const inactiveRosterConfig = {
    exportToExcelBaseUrl: "/restServices/rest/roster/downloadRosterCSV",
    grouperPathText: "eligibility",
    url: "/restServices/rest/roster/rosterData",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "rosterDataList",
    excelFileName: "InactiveAppointments.csv",
    visibleColumnKey: "visible",
    nameUrlLinkKey: "fullName",
    rowImagePathKey: "imageSrc",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    searchCategories: searchCriteria,
    pageName: "InactiveRoster",
    exportData: descriptions.exportDataDefaultMessage,
    pagePermissions: {
        name: "roster",
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
        {visible: false, name: "emplId", displayName: "Empl. ID"},
        {visible: false, name: "uid", displayName: "UID"},
        {visible: true, name: "fullName", displayName: "Name"},
        {visible: false, name: "opusPersonId", displayName: "Opus ID"},
        {visible: false, name: "email", displayName: "Email"},
        {visible: true, name: "employeeStatus", displayName: "Employee Status"},
        {visible: true, name: "appointmentStatus", displayName: "Appointment Status"},
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: true, name: "appointmentPctTime", displayName: "Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: false, name: "titleCode", displayName: "Title Code"},
        {visible: false, name: "titleName", displayName: "Title"},
        {visible: false, name: "appointmentBasis", displayName: "Appt. Basis"},
        {visible: true, name: "series", displayName: "Series"},
        {visible: true, name: "rank", displayName: "Rank"},
        {visible: true, name: "step", displayName: "Step"},
        {visible: false, name: "payrollSalary", displayName: "Payroll Salary"},
        {visible: false, name: "apu", displayName: "APU ID"},
        {visible: false, name: "strHscp", displayName: "HSCP"},
        {visible: false, name: "hireDt", displayName: "Hire Date"},
        {visible: false, name: "startDateAtSeries", displayName: "Start Date at Series"},
        {visible: true, name: "startDateAtRank", displayName: "Start Date at Rank"},
        {visible: true, name: "startDateAtStep", displayName: "Start Date at Step"},
        {visible: false, name: "waiverEndDt", displayName: "Waiver End Date"},
        {visible: true, name: "appointmentEndDt", displayName: "Appt. End Date"},
        {visible: false, name: "appointmentId", displayName: "Appt. ID"},
        {visible: false, name: "positionNbr", displayName: "UCPath Position #"}
            ]
        }
    },
  //Columns will appear in array order shown here
    columnKeys: ["emplId", "uid", "fullName", "opusPersonId", "email", "employeeStatus",
    "appointmentStatus", "schoolName", "divisionName", "departmentName", "areaName", "specialtyName",
    "affiliation", "appointmentPctTime", "location", "titleCode", "titleName", "appointmentBasis",
    "series", "rank", "step", "payrollSalary", "apu", "strHscp",  "hireDt", "startDateAtSeries", "startDateAtRank",
    "startDateAtStep", "waiverEndDt", "appointmentEndDt", "appointmentId", "positionNbr"],
  //These will be populated by 'createConfigFromTemplate'
    columnConfiguration: {
        fullName: {
            name: "fullName",
            viewType: dataViewTypes.nameLink,
            displayKey: "displayValue_fullName"
        },
        appointmentStatus: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.appointmentRowStatusId",
                    displayText: "appointmentInfo.appointmentRowStatusId"
                }
            },
            descriptionText: descriptions.appointmentStatus,
            dynamicFilterSearch: true,
            visible: true
        },
        departmentName: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.departmentName",
                    displayText: "appointmentInfo.academicHierarchyInfo.departmentName"
                }
            }
        },
        divisionName: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.divisionName",
                    displayText: "appointmentInfo.academicHierarchyInfo.divisionName"
                }
            }
        },
        schoolName: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.schoolName",
                    displayText: "appointmentInfo.academicHierarchyInfo.schoolName"
                }
            }
        },
        areaName: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.areaName",
                    displayText: "appointmentInfo.academicHierarchyInfo.areaName"
                }
            }
        },
        specialtyName: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.specialtyName",
                    displayText: "appointmentInfo.academicHierarchyInfo.specialtyName"
                }
            }
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
        startDateAtSeries: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.seriesInfo.seriesStartDt",
                    displayText: "appointmentInfo.titleInformation.seriesInfo.seriesStartDt"
                },
                actionData: {
                    value: "appointmentInfo.approvedSeriesStartDt"
                }
            }
        },
        startDateAtRank: {
            visible: true,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.rank.rankStartDt",
                    displayText: "appointmentInfo.titleInformation.rank.rankStartDt"
                }
            }
        },
        startDateAtStep: {
            visible: true,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.step.stepStartDt",
                    displayText: "appointmentInfo.titleInformation.step.stepStartDt"
                }
            }
        },
        payrollSalary: {
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.salaryInfo.payrollSalary",
                    displayText: "appointmentInfo.salaryInfo.payrollSalary"
                }
            }
        },
        apu: {
            displayName: "APU ID",
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.salaryInfo.academicProgramUnit.apuDesc",
                    displayText: "appointmentInfo.salaryInfo.academicProgramUnit.apuDesc"
                }
            }
        },
        strHscp : {
            name: "strHscp",
            displayName: "HSCP",
            visible: false,
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.strHscp",
                    displayText: "appointmentInfo.titleInformation.strHscp"
                }
            },
            dynamicFilterSearch: true
        },
        currentSalaryAmt: {
            displayName: "Salary"
        },
        location: {
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.academicHierarchyInfo.location",
                    displayText: "appointmentInfo.academicHierarchyInfo.location"
                }
            }
        },
        appointmentEndDt: {
            visible: true,
            viewType: dataViewTypes.datetime,
            // pathsInAPI: {
            //     appointment: {
            //         value: "appointmentEndDt",
            //         displayText: "appointmentEndDt"
            //     }
            // },
            // transformDate: {
            //     from: "MM/DD/YYYY",
            //     to: "YYYY/MM/DD",
            //     pathToGetValue: "appointmentEndDt",
            //     pathToSetValue: "appointmentEndDt"
            // },
            // saveOriginalValueByKey: "displayValue_appointmentEndDt",
            // displayKey: "displayValue_appointmentEndDt",
            dynamicFilterSearch: true
        }
    },
    displayNames: []
};

export const config = createConfigFromTemplate(inactiveRosterConfig);
