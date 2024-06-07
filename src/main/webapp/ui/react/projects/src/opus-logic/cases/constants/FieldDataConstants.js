// import * as validate from '../../../opus-logic/common/helpers/validations';
import {descriptions} from "../../common/constants/Descriptions";

export let fieldsInAPI = {//Change this to an object
    appointmentStatusType: {
        name: "appointmentStatusType",
        displayName: "Appointment Status",
        descriptionText: descriptions.appointment_status,
        dataType: "options",
        optionsInfo: {
            formattedListName: "appointmentStatusType"
        },
        pathsInAPI: {
            appointment: {
                value: "appointmentStatusType",
                displayText: "appointmentStatusType"
            }
        }
    },
    appointmentCategory: {
        name: "appointmentCategory",
        displayName: "Affiliation Status",
        descriptionText: descriptions.affiliation_status,
        pathsInAPI: {
            appointment: {
                value: "affiliationType.appointmentCategory",
                displayText: "affiliationType.appointmentCategory"
            }
        }
    },
    appointmentCategoryId: {
        name: "appointmentCategoryId",
        displayName: "Appointment CategoryId",
        pathsInAPI: {
            appointment: {
                value: "affiliationType.appointmentCategoryId",
                displayText: "affiliationType.appointmentCategoryId"
            }
        }
    },
    uid: {
        name: "uid",
        displayName: "UID"
    },
    fullName: {
        name: "name",
        displayName: "Name"
    },
    opusPersonId: {
        name: "opusPersonId",
        displayName: "Opus ID"
    },
    schoolName: {
        name: "school",
        displayName: "School",
        optionsListName: "schoolList",
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.schoolName",
                displayText: "academicHierarchyInfo.schoolName"
            }
        }
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
    divisionName: {
        name: "division",
        displayName: "Division",
        optionsListName: "divisionList",
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.divisionName",
                displayText: "academicHierarchyInfo.divisionName"
            }
        }
    },
    departmentName: {
        name: "department",
        displayName: "Department",
        optionsListName: "departmentList",
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.departmentName",
                displayText: "academicHierarchyInfo.departmentName"
            }
        }
    },
    departmentCode: {
        name: "departmentCode",
        displayName: "Department Code",
        dataType: "options",
        // dataType: "searchoptions",
        optionsInfo: {
            formattedListName: "departmentOptions",
            valueKey: ""
        },
        descriptionText: descriptions.department_code,
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.academicHierarchyPathId",
                displayText: "academicHierarchyInfo.deptCodeAndName"
            }
        }
    },
    ahDepartmentCode: {
        name: "ahDepartmentCode",
        displayName: "Department Code",
        options_value_key: "value",
        options_text_key: "text",
        pathToValueInAPI: "",
        descriptionText: descriptions.department_code
    },
    areaName: {
        name: "area",
        displayName: "Area",
        optionsListName: "areaList",
        descriptionText: descriptions.area,
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.areaName",
                displayText: "academicHierarchyInfo.areaName"
            }
        }
    },
    specialtyName: {
        name: "specialty",
        displayName: "Specialty",
        optionsListName: "specialtyList",
        descriptionText: descriptions.specialty,
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.specialtyName",
                displayText: "academicHierarchyInfo.specialtyName"
            }
        }
    },
    affiliation: {
        name: "affiliation",
        displayName: "Affiliation",
        isNumberInAPI: true,
        dataType: "options",
        optionsInfo: {
            formattedListName: "affiliationList"
        },
        descriptionText: descriptions.affiliation,
        pathsInAPI: {
            appointment: {
                value: "affiliationType.affiliationTypeId",
                displayText: "affiliationType.affiliation"
            }
        }
    },
    appointmentAffiliation: {
        name: "appointmentAffiliation",
        displayName: "Appointment Affiliation",
        isNumberInAPI: true,
        dataType: "options",
        optionsInfo: {
            formattedListName: "affiliationList"
        },
        descriptionText: descriptions.affiliation,
        pathsInAPI: {
            appointment: {
                value: "affiliationType.affiliationTypeId",
                displayText: "affiliationType.appointmentAffiliation"
            }
        }
    },
    series: {
        name: "series",
        displayName: "Series",
        optionsListName: "seriesList",
        pathsInAPI: {
            appointment: {
                value: "titleInformation.series",
                displayText: "titleInformation.series"
            }
        }
    },
    appointmentId: {
        name: "appointmentId",
        displayName: "Appt. ID",
        pathsInAPI: {
            appointment: {
                value: "appointmentId",
                displayText: "appointmentId"
            }
        }
    },
    appointmentSetId: {
        name: "appointmentSetId",
        displayName: "Appt. Set ID",
        pathsInAPI: {
            appointment: {
                value: "appointmentSetId",
                displayText: "appointmentSetId"
            }
        }
    },
    locationPercentage1: {
        name: "locationPercentage1",
        displayName: "Location 1",
        pathsInAPI: {
            appointment: {
                value: "locationPercentage1",
                displayText: "locationPercentage1"
            }
        }
    },
    locationPercentage2: {
        name: "locationPercentage2",
        displayName: "Location 2",
        pathsInAPI: {
            appointment: {
                value: "locationPercentage2",
                displayText: "locationPercentage2"
            }
        }
    },
    locationPercentage3: {
        name: "locationPercentage3",
        displayName: "Location 3",
        pathsInAPI: {
            appointment: {
                value: "locationPercentage3",
                displayText: "locationPercentage3"
            }
        }
    },
    locationPercentage4: {
        name: "locationPercentage4",
        displayName: "Location 4",
        pathsInAPI: {
            appointment: {
                value: "locationPercentage4",
                displayText: "locationPercentage4"
            }
        }
    },
    locationPercentage5: {
        name: "locationPercentage5",
        displayName: "Location 5",
        pathsInAPI: {
            appointment: {
                value: "locationPercentage5",
                displayText: "locationPercentage5"
            }
        }
    },
    positionNbr: {
        name: "positionNbr",
        displayName: "UCPath Position #",
        descriptionText: descriptions.positionNbr,
        pathsInAPI: {
            appointment: {
                value: "positionNbr",
                displayText: "positionNbr"
            }
        }
    },
    rank: {
        name: "rank",
        displayName: "Rank",
        optionsListName: "rankList",
        pathsInAPI: {
            appointment: {
                value: "titleInformation.rank.rankTypeId",
                displayText: "titleInformation.rank.rankTypeDisplayText"
            }
        }
    },
    step: {
        name: "step",
        displayName: "Step",
        allowNull: true,
        dataType: "options",
        optionsInfo: {
            includeBlankOption: false,
            optionsListName: "stepList"
        },
        isNumberInAPI: true,
    //includeBlankOption: false,
        descriptionText: descriptions.step,
        pathsInAPI: {
            appointment: {
                value: "titleInformation.step.stepTypeId",
        //displayText: 'titleInformation.step.stepTypeDescription'
                displayText: "titleInformation.step.stepName"
            }
        }
    },
    inactiveTitle: {
        name: "inactiveTitle",
        displayName: "Inactive Title Code",
        descriptionText: descriptions.inactiveTitleCode,
        pathsInAPI: {
            appointment: {
                value: "titleInformation.inactiveTitle",
                displayText: "titleInformation.inactiveTitle"
            }
        }
    },
    titleCode: {
        name: "titleCode",
        displayName: "Title Code",
        isNumberInAPI: true,
        dataType: "options",
        optionsInfo: {
            formattedListName: "titleCodeOptions"
        },
        descriptionText: descriptions.title_code,
        pathsInAPI: {
            appointment: {
                value: "titleInformation.titleCodeId",
                displayText: "titleInformation.titleCode"
            }
        }
    },
    currentBaseSalary: {
        name: "currentBaseSalary",
        displayName: "Current Salary",
        isMoney: true
    },
    offScaleAmount: {
        name: "offScaleAmount",
        displayName: "Current Off-Scale Salary"
    },
    changeInOffScaleAmount: {
        name: "changeInOffScaleAmount",
        displayName: "Increase in Salary (Current/Proposed)"
    },
    changeInOffScalePercent: {
        name: "changeInOffScalePercent",
        displayName: "% Increase in Salary (Current/Proposed)"
    },
    approvedYearsAcceleratedCnt: {
        name: "approvedYearsAcceleratedCnt",
        displayName: "Approved Years Accelerated",
        dataType: "number",
        pathsInAPI: {
            actionData: {
                value: "approvedYearsAcceleratedCnt"
            }
        },
        descriptionText: descriptions.years_accelerated
    },
    approvedYearsDeferredCnt: {
        name: "approvedYearsDeferredCnt",
        displayName: "Approved Years Deferred",
        dataType: "number",
        pathsInAPI: {
            actionData: {
                value: "approvedYearsDeferredCnt"
            }
        },
        descriptionText: descriptions.years_deferred
    },
    approvedYearsAcceleratedCntName: {
        name: "approvedYearsAcceleratedCntName",
        displayName: "Approved Years Accelerated",
        descriptionText: descriptions.years_accelerated
    },
    approvedYearsDeferredCntName: {
        name: "approvedYearsDeferredCntName",
        displayName: "Approved Years Deferred",
        descriptionText: descriptions.years_deferred
    },
    proposedYearsAcceleratedCnt: {
        name: "proposedYearsAcceleratedCnt",
        displayName: "Proposed Years Accelerated",
        dataType: "number",
        pathsInAPI: {
            actionData: {
                value: "proposedYearsAcceleratedCnt"
            }
        },
        descriptionText: descriptions.years_accelerated
    },
    proposedYearsDeferredCnt: {
        name: "proposedYearsDeferredCnt",
        displayName: "Proposed Years Deferred",
        dataType: "number",
        pathsInAPI: {
            actionData: {
                value: "proposedYearsDeferredCnt"
            }
        },
        descriptionText: descriptions.years_deferred
    },
    academicYear: {
        name: "academicYear",
        displayName: "Academic Year",
        optionsListName: "academicYearList"
    },
   // 8-11-2021 actionCompletedAcademicYear
    actionCompletedAcademicYear: {
        name: "actionCompletedAcademicYear",
        displayName: "Academic Year",
        pathsInAPI: {
            actionData: {
                value: "actionCompletedAcademicYear",
                displayText: "actionCompletedAcademicYear"
            }
        },
        visible: true,
        width: 175,
        dataType: "input",
        editable: false,
        descriptionText: descriptions.AYcompleted
    },
    approvedEffectiveAcademicYear: {
        name: "approvedEffectiveAcademicYear",
        displayName: "Effective Academic Year",
        pathsInAPI: {
            actionData: {
                value: "approvedEffectiveAcademicYear",
                displayText: "approvedEffectiveAcademicYear"
            }
        },
        visible: true,
        width: 175,
        dataType: "input",
        editable: false,
        descriptionText: descriptions.AYeffective
    },
    actionType: {
        name: "actionType",
        displayName: "Action Type",
        optionsListName: "actionTypeList",
        pathsInAPI: {
            appointment: {
                value: "actionType",
                displayText: "actionType"
            },
            actionData: {
                value: "actionTypeId",
                displayText: "actionTypeDisplayText"
            }
        }
    },
    yearsAcceleratedCnt: {
        name: "yearsAcceleratedCnt",
        displayName: "Years Accelerated",
        descriptionText: descriptions.years_accelerated
    },
    yearsDeferredCnt: {
        name: "yearsDeferredCnt",
        displayName: "Years Deferred",
        descriptionText: descriptions.years_deferred
    },
    proposedEffectiveDt: {
        name: "proposedEffectiveDt",
        displayName: "Proposed Effective Date",
        dataType: "date",
        pathsInAPI: {
            actionData: {
                value: "proposedEffectiveDt"
            }
        },
        descriptionText: descriptions.proposed_effective_date
    },
    proposedEffectiveDate: {
        name: "proposedEffectiveDate",
        displayName: "Proposed Effective Date",
        descriptionText: descriptions.proposed_effective_date
    },
    effectiveDate: {
        name: "effectiveDate",
        displayName: "Effective Date"
    },
    location: {
        name: "location",
        displayName: "Location",
        isNumberInAPI: true,
        descriptionText: descriptions.location,
        dataType: "options",
        optionsInfo: {
            formattedListName: "locationList"
        },
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.locationId",
                displayText: "academicHierarchyInfo.location"
            }
        }
    },
    locationDisplayText1: {
        name: "locationDisplayText1",
        displayName: "Location 1",
        isNumberInAPI: true,
        editable: false,
        //descriptionText: descriptions.additionalLocations,
        dataType: "locationOptions",
        optionsInfo: {
            formattedListName: "locationList"
        },
        pathsInAPI: {
            appointment: {
                value: "locationId1",
                displayText: "locationDisplayText1"
            }
        },
        nameOfNumberValue: "locPercentTime1",
        isNumberDisabled: false,
        showAdd: true,
        showDelete: false
    },
    locationDisplayText2: {
        name: "locationDisplayText2",
        displayName: "Location 2",
        isNumberInAPI: true,
        editable: true,
        //descriptionText: descriptions.additionalLocations,
        dataType: "locationOptions",
        optionsInfo: {
            formattedListName: "locationList"
        },
        pathsInAPI: {
            appointment: {
                value: "locationId2",
                displayText: "locationDisplayText2"
            }
        },
        nameOfNumberValue: "locPercentTime2",
        isNumberDisabled: false,
        showAdd: true,
        showDelete: true
    },
    locationDisplayText3: {
        name: "locationDisplayText3",
        displayName: "Location 3",
        isNumberInAPI: true,
        editable: true,
        //descriptionText: descriptions.additionalLocations,
        dataType: "locationOptions",
        optionsInfo: {
            formattedListName: "locationList"
        },
        pathsInAPI: {
            appointment: {
                value: "locationId3",
                displayText: "locationDisplayText3"
            }
        },
        nameOfNumberValue: "locPercentTime3",
        isNumberDisabled: false,
        showAdd: true,
        showDelete: true
    },
    locationDisplayText4: {
        name: "locationDisplayText4",
        displayName: "Location 4",
        isNumberInAPI: true,
        editable: true,
        //descriptionText: descriptions.additionalLocations,
        dataType: "locationOptions",
        optionsInfo: {
            formattedListName: "locationList"
        },
        pathsInAPI: {
            appointment: {
                value: "locationId4",
                displayText: "locationDisplayText4"
            }
        },
        nameOfNumberValue: "locPercentTime4",
        isNumberDisabled: false,
        showAdd: true,
        showDelete: true
    },
    locationDisplayText5: {
        name: "locationDisplayText5",
        displayName: "Location 5",
        isNumberInAPI: true,
        editable: true,
        //descriptionText: descriptions.additionalLocations,
        dataType: "locationOptions",
        optionsInfo: {
            formattedListName: "locationList"
        },
        pathsInAPI: {
            appointment: {
                value: "locationId5",
                displayText: "locationDisplayText5"
            }
        },
        nameOfNumberValue: "locPercentTime5",
        isNumberDisabled: false,
        showAdd: false,
        showDelete: true
    },
    apoAnalyst: {
        name: "apoAnalyst",
        displayName: "APO Analyst",
        dataType: "options",
        fieldIsVisible: true
    },
    outcomeType: {
        name: "outcomeType",
        displayName: "Outcome"
    },
    waiverExpirationDate: {
        name: "waiverExpirationDate",
        displayName: "Waiver Expiration Date",
        dataType: "date",
        pathsInAPI: {
            appointment: {
                value: "",
                displayText: ""
            }
        }
    },
    appointmentPctTime: {
        name: "appointmentPctTime",
        dataType: "number",
        displayName: "Percent Time",
        displayType: "percent",
        pathsInAPI: {
            appointment: {
                value: "appointmentPctTime",
                displayText: "appointmentPctTime"
            }
        },
        descriptionText: descriptions.percent_time
    },
    waiverEndDt: {
        name: "waiverEndDt",
        displayName: "Waiver End Date",
        dataType: "date",
        pathsInAPI: {
            appointment: {
                value: "waiverEndDt",
                displayText: "waiverEndDt"
            }
        },
        descriptionText: descriptions.waiver_expiration_date
    },
    waiverTermLength: {
        name: "waiverTermLength",
        displayName: "Waiver Term Length",
        pathsInAPI: {
            appointment: {
                value: "",
                displayText: ""
            }
        },
        pathToValueInAPI: "",
        pathToDisplayTextValueInAPI: ""
    },
    appointmentStartDt: {
        name: "appointmentStartDt",
        displayName: "Start Date",
        pathsInAPI: {
            appointment: {
                value: "appointmentStartDt",
                displayText: "appointmentStartDt"
            }
        }
    },
    appointmentEndDt: {
        name: "appointmentEndDt",
        displayName: "Appt. End Date",
        dataType: "date",
        descriptionText: descriptions.end_date,
        pathsInAPI: {
            appointment: {
                value: "appointmentEndDt",
                displayText: "appointmentEndDt"
            },
            actionData: {
                value: "appointmentEndDt"
            }
        }
    },
    lastAdvancementActionEffectiveDt: {
        name: "lastAdvancementActionEffectiveDt",
        displayName: "Date of Last Advancement",
        dataType: "date",
        descriptionText: descriptions.last_adv_action,
        pathsInAPI: {
            appointment: {
                value: "lastAdvancementActionEffectiveDt",
                displayText: "lastAdvancementActionEffectiveDt"
            },
            actionData: {
                value: "lastAdvancementActionEffectiveDt"
            }
        }
    },
    hireDt: {
        name: "hireDt",
        displayName: "Hire Date",
        dataType: "date",
        pathsInAPI: {
      // appointment: {
      //   value: 'appointeeInfo.hireDate',
      //   displayText: 'hireDate'
      // },
            actionData: {
                value: "appointeeInfo.hireDt"
            }
        }
    },
    seriesStartDt: {
        name: "seriesStartDt",
        displayName: "Start Date at Series",
        descriptionText: descriptions.start_date_at_series,
        pathsInAPI: {
            appointment: {
                value: "seriesStartDt",
                displayText: "seriesStartDt"
            },
            actionData: {
                value: "seriesStartDt"
            }
        },
        onChangePermanentMessage: "Please update any impacted appointments!"
    },
    rankStartDt: {
        name: "rankStartDt",
        displayName: "Start Date at Rank",
        descriptionText: descriptions.start_date_at_rank,
        pathsInAPI: {
            appointment: {
                value: "rankStartDt",
                displayText: "rankStartDt"
            },
            actionData: {
                value: "rankStartDt"
            }
        }
    },
    stepStartDt: {
        name: "stepStartDt",
        displayName: "Start Date at Step",
        pathsInAPI: {
            appointment: {
                value: "stepStartDt",
                displayText: "stepStartDt"
            },
            actionData: {
                value: "stepStartDt"
            }
        },
        descriptionText: descriptions.start_date_at_step,
        onChangePermanentMessage: "Please update any impacted appointments!"
    },
    yearsAtCurrentRank: {
        name: "yearsAtCurrentRank",
        displayName: "Years at Current Rank",
        descriptionText: descriptions.years_at_current_rank,
        pathsInAPI: {
            appointment: {
                value: "yearsAtCurrentRank",
                displayText: "yearsAtCurrentRank"
            }
        }
    },
    yearsAtCurrentStep: {
        name: "yearsAtCurrentStep",
        displayName: "Years at Current Step",
        descriptionText: descriptions.years_at_current_step,
        pathToValueInAPI: "yearsAtCurrentStep",
        pathsInAPI: {
            appointment: {
                value: "yearsAtCurrentStep",
                displayText: "yearsAtCurrentStep"
            }
        }
    },
    endowedChairType: {
        name: "endowedChairType",
        displayName: "Endowed Chair Type",
        dataType: "options",
        optionsInfo: {
            formattedListName: "endowedChairType"
        },
        pathsInAPI: {
            appointment: {
                value: "proposedEndowedChairTypeId",
                displayText: "proposedEndowedChairtypeName"
            },
            actionData: {
                value: "proposedEndowedChairTypeId",
                displayText: "proposedEndowedChairtypeName"
            }
        }
    },
    termEndDate: {
        name: "termEndDate",
        displayName: "Term End Date",
        dataType: "date",
        pathsInAPI: {
            appointment: {
                value: "termEndDate",
                displayText: "termEndDate"
            },
            actionData: {
                value: "termEndDate",
                displayText: "termEndDate"
            }
        }
    },
    endowedChairName: {
        name: "endowedChairName",
        displayName: "Endowed Chair Name",
        dataType: "searchoptions",
        optionsInfo: {
            formattedListName: "endowedChairOptions",
            valueKey: ""
        },
        descriptionText: descriptions.department_code,
        pathsInAPI: {
            appointment: {
                value: "proposedEndowedChairId",
                displayText: "proposedEndowedChairName"
            },
            actionData: {
                value: "proposedEndowedChairId",
                displayText: "proposedEndowedChairName"
            }
        }
    },
    selectedEndowedChair: {
        name: "selectedEndowedChair",
        displayName: "Selected Endowed Chair",
        pathsInAPI: {
            appointment: {
                value: "proposedEndowedChairName",
                displayText: "proposedEndowedChairName"
            }
        }
    },
    endowedChair: {
        name: "endowedChairNameSearch",
        displayName: "Endowed Chair Name",
        dataType: "searchoptions",
        optionsInfo: {
            formattedListName: "endowedChairOptions",
            valueKey: ""
        },
        pathsInAPI: {
            appointment: {
                value: "proposedEndowedChairId",
                displayText: "proposedEndowedChairName"
            },
            actionData: {
                value: "proposedEndowedChairId",
                displayText: "proposedEndowedChairName"
            }
        }
    },
    chairApptEndDate: {
        name: "chairApptEndDate",
        displayName: "Chair Appt. End Date (optional)",
        dataType: "date",
        pathsInAPI: {
            appointment: {
                value: "termEndDate",
                displayText: "termEndDate"
            },
            actionData: {
                value: "termEndDate",
                displayText: "termEndDate"
            }
        }
    },
    payrollTitle: {
        name: "payrollTitle",
        displayName: "Payroll Title",
        pathsInAPI: {
            appointment: {
                value: "titleInformation.payrollTitle",
                displayText: "titleInformation.payrollTitle"
            }
        }
    },
    onScaleSalary: {
        name: "onScaleSalary",
        displayName: "On-Scale Amount",
        displayType: "money",
        descriptionText: descriptions.on_scale_salary,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.onScaleSalary",
                displayText: "salaryInfo.onScaleSalary"
            }
        }
    },
    payrollSalary: {
        name: "payrollSalary",
        displayName: "Payroll Salary",
        descriptionText: descriptions.payroll_salary,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.payrollSalary",
                displayText: "salaryInfo.payrollSalary"
            }
        },
        displayType: "money"
    },
    currentSalaryAmt: {
        name: "currentSalaryAmt",
        displayName: "Salary at Last Advancement",
        isNumberInAPI: true,
        displayType: "money",
        dataType: "debounce-number",
        informationTags: [
            "These messages will not be printed in the application",
            "This field is used only for Profile right now"
        ],
        descriptionText: descriptions.salary,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.currentSalaryAmt",
                displayText: "salaryInfo.currentSalaryAmt"
            }
        }
    },
    salary: {
        name: "salary",
        displayName: "Salary",
        isNumberInAPI: true,
        displayType: "money",
        dataType: "debounce-number",
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.currentSalaryAmt",
                displayText: "salaryInfo.currentSalaryAmt"
            }
        }
    },
    offScalePercent: {
        name: "offScalePercent",
        displayName: "Off-Scale Percent",
        displayType: "round2DecimalPercent",
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.offScalePercent",
                displayText: "salaryInfo.offScalePercent"
            }
        },
        descriptionText: descriptions.current_off_scale_percentage
    },
    salaryEffectiveDt: {
        name: "salaryEffectiveDt",
        displayName: "Salary Scale Effective Date",
        descriptionText: descriptions.salary_scale_effective_date,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.salaryEffectiveDt",
                displayText: "salaryInfo.salaryEffectiveDt"
            }
        }
    },
    oldApuDesc: {
        name: "oldApuDesc",
        displayName: "Old APU ID",
        descriptionText: descriptions.oldApuDesc,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.academicProgramUnit.oldApuDesc",
                displayText: "salaryInfo.academicProgramUnit.oldApuDesc"
            }
        }
    },
    apuId: {
        name: "apuId",
        displayName: "APU ID",
        isNumberInAPI: true,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.academicProgramUnit.apuId",
                displayText: "salaryInfo.academicProgramUnit.apuDesc"
            }
        },
        descriptionText: descriptions.apu_id
    },
    apuCode: {
        name: "apuCode",
        displayName: "APU ID",
        isNumberInAPI: true,
        dataType: "options",
        optionsInfo: {
            formattedListName: "",
            valueKey: ""
        },
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.academicProgramUnit.apuId",
                displayText: "salaryInfo.academicProgramUnit.apuDesc"
            }
        },
        descriptionText: descriptions.apu_id
    },
    hscpScale1to9: {
        name: "hscpScale1to9",
        displayName: "HSCP Scale (0-9)",
        descriptionText: descriptions.hscp_scale0_9,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.hscpScale1to9",
                displayText: "salaryInfo.hscpScale1to9"
            }
        }
    },
    hscpScale0: {
        name: "hscpScale0",
        displayName: "HSCP Scale 0(X)",
        displayType: "money",
        descriptionText: descriptions.hscp_scale0_X,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.hscpScale0",
                displayText: "salaryInfo.hscpScale0"
            }
        }
    },
    hscpBaseScale: {
        name: "hscpBaseScale",
        displayName: "HSCP Base Salary (X + X')",
        displayType: "money",
        descriptionText: descriptions.hscp_base_salaryX_X,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.hscpBaseScale",
                displayText: "salaryInfo.hscpBaseScale"
            }
        }
    },
    hscpAddBaseIncrement: {
        name: "hscpAddBaseIncrement",
        displayName: "HSCP Add'l Base Increment (X')",
        displayType: "money",
        descriptionText: descriptions.hscp_addl_base_incr,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.hscpAddBaseIncrement",
                displayText: "salaryInfo.hscpAddBaseIncrement"
            }
        }
    },
    dentistryBaseSupplement: {
        name: "dentistryBaseSupplement",
        displayName: "Dentistry Base Supplement",
        dataType: "number",
        isNumberInAPI: true,
        displayType: "money",
        descriptionText: descriptions.dentistry_base_supplement,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.dentistryBaseSupplement",
                displayText: "salaryInfo.dentistryBaseSupplement"
            }
        }
    },
    scaleType: {
        name: "scaleType",
        displayName: "FSPH Salary Scale",
        descriptionText: descriptions.fsph_salary_scale,
        dataType: "options",
        optionsInfo: {
            formattedListName: "scaleTypeOptions",
            valueKey: "",
            includeBlankOption: true
        },
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.academicProgramUnit.scaleTypeId",
                displayText: "salaryInfo.academicProgramUnit.scaleType"
            }
        }
    },
    candidateToDepartmentSubmittedDt: {
        name: "candidateToDepartmentSubmittedDt",
        displayName: "Submitted by Candidate to Dept",
        dataType: "date"
    },
    departmentToDeanSubmittedDt: {
        name: "departmentToDeanSubmittedDt",
        displayName: "Submitted by Dept to Dean's Office",
        dataType: "date"
    },
    deanToAPOSubmittedDt: {
        name: "deanToAPOSubmittedDt",
        displayName: "Submitted by Dean's Office to APO",
        dataType: "date"
    },
    aPOToCAPSubmittedDt: {
        name: "aPOToCAPSubmittedDt",
        displayName: "Submitted by APO to CAP",
        dataType: "date"
    },
    cAPToAPOSubmittedDt: {
        name: "cAPToAPOSubmittedDt",
        displayName: "Submitted by CAP to APO",
        dataType: "date"
    },
    aPOToVCAPSubmittedDt: {
        name: "aPOToVCAPSubmittedDt",
        displayName: "Submitted by APO to Vice Chancellor",
        dataType: "date"
    },
    caseCompletedDt: {
        name: "caseCompletedDt",
        displayName: "Case Completed",
        dataType: "date",
        pathsInAPI: {
            actionData: {
                value: "caseCompletedDt"
            }
        },
        helpMessage: `This field is populated when you edit the final decision
      and click the "Complete the Case" button.`
    },
    approvedOutcome: {
        name: "approvedOutcome",
        displayName: "Outcome",
        dataType: "options",
        pathsInAPI: {
            actionData: {
                value: "approvedActionOutcome.code"
            }
        },
        optionsInfo: {
            formattedListName: "",
            valueKey: ""
        }
    },
    approvedEffectiveDate: {
        name: "approvedEffectiveDate",
        displayName: "Effective Date",
        pathsInAPI: {
            actionData: {
                value: "effectiveDt"
            }
        },
        dataType: "date"
    },
    approvedEffectiveDateName: {
        name: "approvedEffectiveDateName",
        displayName: "Effective Date",
        dataType: "date"
    },
    approvedOutcomeName: {
        name: "approvedOutcomeName",
        displayName: "Outcome"
    },
    startDateAtSeries: {
        name: "startDateAtSeries",
        displayName: "Start Date at Series",
        dataType: "date",
        descriptionText: descriptions.start_date_at_series,
        pathsInAPI: {
            appointment: {
                value: "startDateAtSeries",
                displayText: "startDateAtSeries"
            },
            actionData: {
                value: "approvedSeriesStartDt"
            }
        }
    },
    startDateAtRank: {
        name: "startDateAtRank",
        displayName: "Start Date at Rank",
        dataType: "date",
        descriptionText: descriptions.start_date_at_rank,
        pathsInAPI: {
            appointment: {
                value: "startDateAtRank",
                displayText: "startDateAtRank"
            }
        }
    },
    startDateAtStep: {
        name: "startDateAtStep",
        displayName: "Start Date at Step",
        dataType: "date",
        descriptionText: descriptions.start_date_at_step,
        pathsInAPI: {
            appointment: {
                value: "startDateAtStep",
                displayText: "startDateAtStep"
            }
        }
    },
    userComments: {
        name: "userComments",
        displayName: "Comments",
        dataType: "textarea",
        pathsInAPI: {
            actionData: {
                value: "userComments",
                displayText: "userComments"
            }
        }
    },
    appointmentCommentCount: {
        name: "appointmentCommentCount",
        dataType: "number",
        displayName: "",
        displayType: "appointmentCommentCount",
        pathsInAPI: {
            appointment: {
                value: "appointmentCommentCount",
                displayText: "appointmentCommentCount"
            }
        },
        descriptionText: descriptions.percent_time
    },
    school: {
        name: "school",
        displayName: "School",
        pathsInAPI: {
            endowedChair: {
                value: "school",
                displayText: "school"
            }
        }
    },
    division: {
        name: "division",
        displayName: "Division",
        pathsInAPI: {
            endowedChair: {
                value: "division",
                displayText: "division"
            }
        }
    },
    department: {
        name: "department",
        displayName: "Department",
        pathsInAPI: {
            endowedChair: {
                value: "department",
                displayText: "department"
            }
        }
    },
    area: {
        name: "area",
        displayName: "Area",
        pathsInAPI: {
            endowedChair: {
                value: "area",
                displayText: "area"
            }
        }
    },
    specialty: {
        name: "specialty",
        displayName: "Specialty",
        pathsInAPI: {
            endowedChair: {
                value: "specialty",
                displayText: "specialty"
            }
        }
    },
    organizationName: {
        name: "organizationName",
        displayName: "Organization Name",
        pathsInAPI: {
            endowedChair: {
                value: "organizationName",
                displayText: "organizationName"
            }
        }
    },
    chairType: {
        name: "chairType",
        displayName: "Chair Type",
        pathsInAPI: {
            endowedChair: {
                value: "chairType",
                displayText: "chairType"
            }
        }
    },
    endowedChairTerm: {
        name: "endowedChairTerm",
        displayName: "Chair Term",
        pathsInAPI: {
            endowedChair: {
                value: "endowedChairTerm",
                displayText: "endowedChairTerm"
            }
        }
    },
    endowedChairTermRenewable: {
        name: "endowedChairTermRenewable",
        displayName: "Term Renewable",
        pathsInAPI: {
            endowedChair: {
                value: "endowedChairTermRenewable",
                displayText: "endowedChairTermRenewable"
            }
        }
    },
    endowedChairFundingType: {
        name: "endowedChairFundingType",
        displayName: "Funding Type",
        pathsInAPI: {
            endowedChair: {
                value: "endowedChairFundingType",
                displayText: "endowedChairFundingType"
            }
        }
    },
    designation: {
        name: "designation",
        displayName: "Designation",
        pathsInAPI: {
            endowedChair: {
                value: "designation",
                displayText: "designation"
            }
        }
    },
    seriesType: {
        name: "seriesType",
        displayName: "Series",
        pathsInAPI: {
            endowedChair: {
                value: "seriesType",
                displayText: "seriesType"
            }
        }
    },
    rankType: {
        name: "rankType",
        displayName: "Rank",
        pathsInAPI: {
            endowedChair: {
                value: "rankType",
                displayText: "rankType"
            }
        }
    }
};
