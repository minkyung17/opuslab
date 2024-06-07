import {dataViewTypes, image_folder} from "./DatatableConstants";
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
        },
        appointed: {
            displayName: "Appointed",
            name: "appointmentRowStatusId",
            databaseValue: "Appointed"
        },
        prospective: {
            displayName: "Prospective",
            name: "appointmentRowStatusId",
            databaseValue: "Prospective"
        },
        appointmentSetFlag: {
            displayName: "Appointment Sets",
            name: "appointmentSetFlag"
        },
        multiPrimaryApptFlag: {
            displayName: "Multiple Primary Appts.",
            name: "multiPrimaryApptFlag"
        },
        noPrimaryApptFlag: {
            displayName: "No Primary Appt.",
            name: "noPrimaryApptFlag"
        }
    },
    affirmativeSearch: ["senate", "tenured", "emeriti", "unit_18", "hscp",
    "appointmentSetFlag", "multiPrimaryApptFlag", "noPrimaryApptFlag"],
    exclusionarySearch: ["non_senate", "non_tenured", "non_emeriti", "non_unit_18",
    "non_hscp"],
    stringSearch: ["appointed", "prospective"],
    stringSearchOptions: {
        appointed: ["Prospective", "Appointed"]
    }
};

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
const rosterConfig = {
    exportToExcelBaseUrl: "/restServices/rest/roster/downloadRosterCSV",
    grouperPathText: "eligibility",
    url: "/restServices/rest/roster/rosterData",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "rosterDataList",
    excelFileName: "ActiveAppointments.csv",
    visibleColumnKey: "visible",
    nameUrlLinkKey: "fullName",
    rowImagePathKey: "imageSrc",
    profileLink: "/opusWeb/ui/admin/profile.shtml?id=",
    nameImagePath: "../images/case-tiny.png",
    nameImageVarName: "pendingCases",
    searchCategories: searchCriteria,
    pageName: "Roster",
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
        {visible: true, name: "pendingCases", displayName: "Active Cases"},
        {visible: false, name: "emplId", displayName: "Empl. ID"},
        {visible: false, name: "uid", displayName: "UID"},
        {visible: true, name: "fullName", displayName: "Name"},
        {visible: false, name: "opusPersonId", displayName: "Opus ID"},
        {visible: false, name: "email", displayName: "Email"},
        {visible: true, name: "employeeStatusId", displayName: "Employee Status"},
        {visible: true, name: "appointmentStatusId", displayName: "Appt. Status"},
        {visible: false, name: "schoolName", displayName: "School"},
        {visible: false, name: "divisionName", displayName: "Division"},
        {visible: true, name: "departmentName", displayName: "Department"},
        {visible: false, name: "areaName", displayName: "Area"},
        {visible: false, name: "specialtyName", displayName: "Specialty"},
        {visible: true, name: "affiliation", displayName: "Affiliation"},
        {visible: true, name: "appointmentPctTime", displayName: "Percent Time"},
        {visible: false, name: "location", displayName: "Location"},
        {visible: true, name: "otherAffiliations", displayName: "Other Affiliations"},
        {visible: false, name: "titleCode", displayName: "Title Code"},
        {visible: false, name: "titleName", displayName: "Title"},
        {visible: false, name: "appointmentBasis", displayName: "Appt. Basis"},
        {visible: true, name: "series", displayName: "Series"},
        {visible: true, name: "rank", displayName: "Rank"},
        {visible: true, name: "stepTypeId", displayName: "Step"},
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
    columnKeys: ["pendingCases", "emplId", "uid", "fullName", "opusPersonId", "email", "employeeStatusId",
    "appointmentStatusId", "schoolName", "divisionName", "departmentName", "areaName", "specialtyName",
    "affiliation", "appointmentPctTime", "location", "otherAffiliations",  "titleCode", "titleName", "appointmentBasis",
    "series", "rank", "stepTypeId", "payrollSalary", "apu", "strHscp",  "hireDt", "startDateAtSeries", "startDateAtRank",
    "startDateAtStep", "waiverEndDt", "appointmentEndDt", "appointmentId", "positionNbr"],
  //These will be populated by 'createConfigFromTemplate'
    columnConfiguration: {
        pendingCases: {
            showImageAsColumnTitle: true,
            imageTitleHoverText: "This person has an active case.",
            viewType: dataViewTypes.image,
            headerDescriptionText: null,
            headerImageSrc: image_folder + "case-tiny.png",
            image: image_folder + "case-tiny.png",
            sortable: true
        },
        fullName: {
            name: "fullName",
            viewType: dataViewTypes.nameLink,
            displayKey: "displayValue_fullName"
        },
        employeeStatusId: {
            name: "employeeStatusId",
            displayName: "Employee Status",
            pathsInAPI: {
                appointment: {
                    value: "appointeeInfo.employeeStatus",
                    displayText: "appointeeInfo.employeeStatus"
                }
            },
            descriptionText: descriptions.employeeStatus,
            width: 200,
            dynamicFilterSearch: true,
            visible: true
        },
        appointmentStatusId: {
            name: "appointmentStatusId",
            displayName: "Appt. Status",
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
        stepTypeId: {
            name: "stepTypeId",
            displayName: "Step",
            pathsInAPI: {
                appointment: {
                    value: "appointmentInfo.titleInformation.step.stepTypeId",
                    displayText: "appointmentInfo.titleInformation.step.stepTypeDescription"
                }
            },
            optionsListName: "stepList",
            visible: true
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
            name: "appointmentEndDt",
            displayName: "Appt. End Date",
            descriptionText: descriptions.end_date,
            visible: true,
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
            displayKey: "displayValue_appointmentEndDt",
            dynamicFilterSearch: true
        }
    },
    displayNames: []
};

export const config = createConfigFromTemplate(rosterConfig);
