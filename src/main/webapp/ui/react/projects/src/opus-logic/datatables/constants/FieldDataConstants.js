import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";


let baseColumnOptions = {//Change this to an object
    edit: {
        name: "edit",
        displayName: "",
        visible: true,
        imagePath: "../images/edit-pencil.png",
        sortable: false,
        width: 50,
        fixed: true,
        viewType: dataViewTypes.imageClick
    },
    pendingCases: {
        name: "pendingCases",
        displayName: "Active Cases",
        viewType: dataViewTypes.image,
        sortable: true,
        width: 60,
        visible: true,
        fixed: true,
        descriptionText: descriptions.pendingCases
    },
    emplId: {
        name: "emplId",
        displayName: "Empl. ID",
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.emplId",
                displayText: "appointeeInfo.emplId"
            }
        },
        width: 125,
        fixed: true
    },
    uid: {
        name: "uid",
        displayName: "UID",
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.uid",
                displayText: "appointeeInfo.uid"
            }
        },
        width: 125,
        fixed: true
    },
    name: {
        name: "name",
        displayName: "Name",
        viewType: dataViewTypes.sortingText,
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.fullName",
                displayText: "appointeeInfo.fullName"
            }
        },
        displayKey: "displayValue_name",
        width: 250,
        visible: true,
        textSearch: true,
        fixed: true
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
        width: 125
    },
    positionNbr: {
        name: "positionNbr",
        displayName: "UCPath Position #",
        descriptionText: descriptions.positionNbr,
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.positionNbr",
                displayText: "appointmentInfo.positionNbr"
            }
        }
    },
    appointmentStatus: {
        name: "appointmentStatus",
        displayName: "Appt. Status",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.appointmentStatusType",
                displayText: "appointmentInfo.appointmentStatusType"
            }
        },
    // dynamicFilterSearch: true,
        visible: true
    },
    opusPersonId: {
        name: "opusPersonId",
        displayName: "Opus ID",
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.opusPersonId",
                displayText: "appointeeInfo.opusPersonId"
            }
        },
        width: 150
    },
    email: {
        name: "email",
        displayName: "Email",
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.officialEmail",
                displayText: "appointeeInfo.officialEmail"
            }
        },
        width: 250
    },
    employeeStatus: {
        name: "employeeStatus",
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
    schoolName: {
        name: "schoolName",
        displayName: "School",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.academicHierarchyInfo.schoolName",
                displayText: "appointmentInfo.academicHierarchyInfo.schoolName"
            }
        },
        optionsListName: "schoolList",
        width: 300
    },
    approvedSalaryAmt: {
        name: "approvedSalaryAmt",
        displayName: "Approved Salary",
        viewType: dataViewTypes.money,
        displayKey: "displayValue_approvedSalaryAmt",
        pathsInAPI: {
            appointment: {
                value: "approvedSalaryInfo.currentSalaryAmt",
                displayText: "approvedSalaryInfo.currentSalaryAmt"
            }
        },
        visible: true
    },
    divisionName: {
        name: "divisionName",
        displayName: "Division",
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.schoolName",
                displayText: "appointmentInfo.academicHierarchyInfo.divisionName"
            }
        },
        optionsListName: "divisionList"
    },
    departmentCode: {
        visible: true,
        name: "departmentCode",
        displayName: "Department Code",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.academicHierarchyInfo.departmentCode",
                displayText: "appointmentInfo.academicHierarchyInfo.departmentCode"
            }
        },
        dynamicFilterSearch: true
    },
    departmentName: {
        name: "departmentName",
        displayName: "Department",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.academicHierarchyInfo.departmentName",
                displayText: "appointmentInfo.academicHierarchyInfo.departmentName"
            }
        },
        optionsListName: "departmentList",
        width: 250,
        visible: true
    },
    areaName: {
        name: "areaName",
        displayName: "Area",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.academicHierarchyInfo.areaName",
                displayText: "appointmentInfo.academicHierarchyInfo.areaName"
            }
        },
        descriptionText: descriptions.area,
        optionsListName: "areaList"
    },
    specialtyName: {
        name: "specialtyName",
        displayName: "Specialty",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.academicHierarchyInfo.specialtyName",
                displayText: "appointmentInfo.academicHierarchyInfo.specialtyName"
            }
        },
        descriptionText: descriptions.specialty,
        optionsListName: "specialtyList"
    },
    affiliation: {
        name: "affiliation",
        displayName: "Affiliation",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.affiliationType.affiliation",
                displayText: "appointmentInfo.affiliationType.affiliation"
            }
        },
        visible: true,
        width: 175,
        optionsListName: "affiliationTypeList",
        descriptionText: descriptions.affiliation
    },
    otherAffiliations: {
        name: "otherAffiliations",
        displayName: "Other Affiliations",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.affiliationType.otherAffiliations",
                displayText: "appointmentInfo.affiliationType.otherAffiliations"
            }
        },
        visible: true,
        width: 300,
        sortable: false,
    // optionsListName: 'affiliationTypeList',
        descriptionText: descriptions.otherAffiliations,
        viewType: dataViewTypes.tooltip
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
        visible: true,
        descriptionText: descriptions.percent_time
    },
    appointmentBasis: {
        name: "appointmentBasis",
        displayName: "Appt. Basis",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.appointmentBasis",
                displayText: "appointmentInfo.titleInformation.appointmentBasis"
            }
        },
        dynamicFilterSearch: true,
        visible: false
    },
    series: {
        name: "series",
        displayName: "Series",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.appointmentPctTime.series",
                displayText: "appointmentInfo.appointmentPctTime.series"
            }
        },
        optionsListName: "seriesList",
        visible: true
    },
    rank: {
        name: "rank",
        displayName: "Current Rank",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.rank.rankTypeDisplayText",
                displayText: "appointmentInfo.titleInformation.rank.rankTypeDisplayText"
            }
        },
        optionsListName: "rankList",
        visible: true
    },
    step: {
        name: "step",
        displayName: "Current Step",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.step.stepTypeId",
                displayText: "appointmentInfo.titleInformation.step.stepTypeDescription"
            }
        },
        optionsListName: "stepList",
        visible: true
    },
    titleName: {
        name: "titleName",
        displayName: "Title",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.titleName",
                displayText: "appointmentInfo.titleInformation.titleName"
            }
        },
        textSearch: true
    },
    titleCode: {
        name: "titleCode",
        displayName: "Title Code",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.titleCodeId",
                displayText: "appointmentInfo.titleInformation.titleCode"
            }
        },
        dynamicFilterSearch: true
      //textSearch: true
    },
    currentSalaryAmt: {
        name: "currentSalaryAmt",
        displayName: "Approved Salary",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.currentSalaryAmt",
                displayText: "appointmentInfo.currentSalaryAmt"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_currentSalaryAmt"
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
            to: "MM/DD/YYYY",
            pathToGetValue: "appointmentEndDt",
            pathToSetValue: "appointmentEndDt"
        },
        saveOriginalValueByKey: "displayValue_appointmentEndDt",
        displayKey: "displayValue_appointmentEndDt"
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
    hireDt: {
        name: "hireDt",
        displayName: "Hire Date",
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.hireDt",
                displayText: "appointeeInfo.hireDt"
            }
        },
        descriptionText: descriptions.hireDt,
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "hireDt",
            pathToSetValue: "hireDt"
        },
        saveOriginalValueByKey: "displayValue_hireDt",
        displayKey: "displayValue_hireDt"
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
        width: 250,
        visible: true,
        textSearch: true,
        fixed: true
    },
    currentSeries: {
        name: "currentSeries",
        displayName: "Current Series",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.seriesInfo.seriesDisplayText",
                displayText: "appointmentInfo.titleInformation.seriesInfo.seriesDisplayText"
            }
        },
        optionsListName: "seriesList",
        visible: true
    },
    currentRank: {
        name: "currentRank",
        displayName: "Current Rank",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.rank.rankTypeDisplayText",
                displayText: "appointmentInfo.titleInformation.rank.rankTypeDisplayText"
            }
        },
        optionsListName: "rankList",
        width: 175,
        visible: true
    },
    currentStep: {
        name: "currentStep",
        displayName: "Current Step",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.titleInformation.step.stepTypeDescription",
                displayText: "appointmentInfo.titleInformation.step.stepTypeDescription"
            }
        },
        optionsListName: "stepList",
        visible: true,
        width: 150
    },
    onScaleAmount: {
        name: "onScaleAmount",
        displayName: "Current On-Scale Amount",
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.offScaleAmount",
                displayText: "salaryInfo.offScaleAmount"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_onScaleAmount",
        descriptionText: descriptions.on_scale_amount
    },
    payrollSalary: {
        name: "payrollSalary",
        displayName: "Payroll Salary",
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.payrollSalary",
                displayText: "salaryInfo.payrollSalary"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_payrollSalary",
        isMoney: true,
        visible: true,
        descriptionText: descriptions.payroll_salary
    },
    apu: {
        name: "apu",
        displayName: "APU",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.salaryInfo.academicProgramicUnit.apuDesc",
                displayText: "appointmentInfo.salaryInfo.academicProgramicUnit.apuDesc"
            }
        },
        dynamicFilterSearch: true,
        descriptionText: descriptions.apu,
        visible: true
    },
    nstpComp: {
        name: "nstpComp",
        displayName: "NSTP Component",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.salaryInfo.nstpComp",
                displayText: "appointmentInfo.salaryInfo.nstpComp"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_nstpComp",
        isMoney: true,
        visible: false
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
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "startDateAtSeries",
            pathToSetValue: "startDateAtSeries"
        },
        saveOriginalValueByKey: "displayValue_startDateAtSeries",
        displayKey: "displayValue_startDateAtSeries",
        viewType: dataViewTypes.displayByKey
    },
    startDateAtRank: {
        name: "startDateAtRank",
        displayName: "Start Date at Rank",
        dataType: "date",
        descriptionText: descriptions.start_date_at_rank,
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.startDateAtRank",
                displayText: "appointmentInfo.startDateAtRank"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "startDateAtRank",
            pathToSetValue: "startDateAtRank"
        },
        saveOriginalValueByKey: "displayValue_startDateAtRank",
        displayKey: "displayValue_startDateAtRank",
        viewType: dataViewTypes.displayByKey
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
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "startDateAtStep",
            pathToSetValue: "startDateAtStep"
        },
        saveOriginalValueByKey: "displayValue_startDateAtStep",
        displayKey: "displayValue_startDateAtStep",
        viewType: dataViewTypes.displayByKey
    },
    currentBaseSalary: {
        name: "currentBaseSalary",
        displayName: "Salary at Last Advancement",
        descriptionText: descriptions.salary,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.currentSalaryAmt",
                displayText: "salaryInfo.currentSalaryAmt"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_currentBaseSalary",
        isMoney: true,
        width: 175,
        visible: true
    },
    lastAdvancementActionEffectiveDt: {
        name: "lastAdvancementActionEffectiveDt",
        displayName: "Date of Last Advancement",
        pathsInAPI: {
            appointment: {
                value: "lastAdvancementActionEffectiveDt",
                displayText: "lastAdvancementActionEffectiveDt"
            }
        },
        descriptionText: descriptions.last_adv_action,
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "lastAdvancementActionEffectiveDt",
            pathToSetValue: "lastAdvancementActionEffectiveDt"
        },
        saveOriginalValueByKey: "displayValue_lastAdvancementActionEffectiveDt",
        displayKey: "displayValue_lastAdvancementActionEffectiveDt",
        width: 200,
        visible: true
    },
    offScaleAmount: {
        name: "offScaleAmount",
        displayName: "Current Off-Scale Amount",
        pathsInAPI: {
            appointment: {
                value: "offScaleAmount",
                displayText: "offScaleAmount"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_offScaleAmount",
        descriptionText: descriptions.current_off_scale_amount
    },
    offScalePercent: {
        name: "offScalePercent",
        viewType: dataViewTypes.round2DecimalPercent,
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.offScalePercent",
                displayText: "salaryInfo.offScalePercent"
            }
        },
        displayKey: "displayValue_offScalePercent",
        displayName: "Current Off-Scale %"
    },
    changeInOffScaleAmount: {
        name: "changeInOffScaleAmount",
        displayName: "Increase in Salary (Current/Proposed)",
        pathsInAPI: {
            appointment: {
                value: "changeInOffScaleAmount",
                displayText: "changeInOffScaleAmount"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_changeInOffScaleAmount",
        width: 200
    },
    changeInOffScalePercent: {
        name: "changeInOffScalePercent",
        displayName: "% Increase in Salary (Current/Proposed)",
        pathsInAPI: {
            appointment: {
                value: "changeInOffScalePercent",
                displayText: "changeInOffScalePercent"
            }
        },
        viewType: dataViewTypes.round2DecimalPercent,
        displayKey: "displayValue_changeInOffScalePercent",
        visible: true
    },
    proposedSeries: {
        name: "proposedSeries",
        displayName: "Proposed Series",
        pathsInAPI: {
            appointment: {
                value: "proposedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText",
                displayText: "proposedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText"
            }
        },
        optionsListName: "seriesList",
        width: 200,
        visible: true
    },
    proposedRank: {
        name: "proposedRank",
        displayName: "Proposed Rank",
        pathsInAPI: {
            appointment: {
                value: "proposedAppointmentInfo.titleInformation.rank.rankTypeDisplayText",
                displayText: "proposedAppointmentInfo.titleInformation.rank.rankTypeDisplayText"
            }
        },
        optionsListName: "rankList",
        width: 175,
        visible: true
    },
    proposedStep: {
        name: "proposedStep",
        displayName: "Proposed Step",
        pathsInAPI: {
            appointment: {
                value: "proposedAppointmentInfo.titleInformation.step.stepTypeDescription",
                displayText: "proposedAppointmentInfo.titleInformation.step.stepTypeDescription"
            }
        },
        optionsListName: "stepList",
        width: 175,
        visible: true
    },
    proposedOnScaleSalary: {
        name: "proposedOnScaleSalary",
        displayName: "Proposed On-Scale Amount",
        pathsInAPI: {
            appointment: {
                value: "proposedSalaryInfo.onScaleSalary",
                displayText: "proposedSalaryInfo.onScaleSalary"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_proposedOnScaleSalary",
        width: 175,
        visible: true
    },
    proposedBaseSalary: {
        name: "proposedBaseSalary",
        displayName: "Proposed Salary",
        pathsInAPI: {
            appointment: {
                value: "proposedSalaryInfo.currentSalaryAmt",
                displayText: "proposedSalaryInfo.currentSalaryAmt"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_proposedBaseSalary",
        width: 175,
        visible: true
    },
    proposedOffScaleAmount: {
        name: "proposedOffScaleAmount",
        displayName: "Proposed Off-Scale Amount",
        pathsInAPI: {
            appointment: {
                value: "proposedSalaryInfo.offScaleAmount",
                displayText: "proposedSalaryInfo.offScaleAmount"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_proposedOffScaleAmount",
        descriptionText: descriptions.proposed_off_scale_amount,
        visible: true
    },
    proposedOffScalePercent: {
        name: "proposedOffScalePercent",
        displayName: "Proposed Off-Scale %",
        pathsInAPI: {
            appointment: {
                value: "proposedSalaryInfo.offScalePercent",
                displayText: "proposedSalaryInfo.offScalePercent"
            }
        },
        viewType: dataViewTypes.round2DecimalPercent,
        displayKey: "displayValue_proposedOffScalePercent",
        descriptionText: descriptions.proposed_off_scale_percentage,
        visible: true
    },
    proposedYearsAccelerated: {
        descriptionText: descriptions.years_accelerated,
        name: "proposedYearsAccelerated",
        displayName: "Proposed Years Accelerated",
        pathsInAPI: {
            appointment: {
                value: "actionInfo.proposedYearsAcceleratedCnt",
                displayText: "actionInfo.proposedYearsAcceleratedCnt"
            }
        }
    },
    proposedYearsDeferred: {
        descriptionText: descriptions.years_deferred,
        name: "proposedYearsDeferred",
        displayName: "Proposed Years Deferred",
        pathsInAPI: {
            appointment: {
                value: "actionInfo.proposedYearsDeferredCnt",
                displayText: "actionInfo.proposedYearsDeferredCnt"
            }
        }
    },
    approvedYearsAccelerated: {
        descriptionText: descriptions.years_accelerated,
        name: "approvedYearsAccelerated",
        displayName: "Approved Years Accelerated",
        pathsInAPI: {
            appointment: {
                value: "actionInfo.approvedYearsAcceleratedCnt",
                displayText: "actionInfo.approvedYearsAcceleratedCnt"
            }
        }
    },
    approvedYearsDeferred: {
        descriptionText: descriptions.years_deferred,
        name: "approvedYearsDeferred",
        displayName: "Approved Years Deferred",
        pathsInAPI: {
            appointment: {
                value: "actionInfo.approvedYearsDeferredCnt",
                displayText: "actionInfo.approvedYearsDeferredCnt"
            }
        }
    },
    approvedSeries: {
        name: "approvedSeries",
        displayName: "Approved Series",
        pathsInAPI: {
            appointment: {
                value: "approvedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText",
                displayText: "approvedAppointmentInfo.titleInformation.seriesInfo.seriesDisplayText"
            }
        },
        optionsListName: "seriesList",
        visible: true
    },
    approvedOnScaleSalary: {
        name: "approvedOnScaleSalary",
        displayName: "Approved On-Scale Amount",
        viewType: dataViewTypes.money,
        pathsInAPI: {
            appointment: {
                value: "approvedOnScaleSalary",
                displayText: "approvedOnScaleSalary"
            }
        },
        displayKey: "displayValue_approvedOnScaleSalary"
    },
    approvedRank: {
        name: "approvedRank",
        displayName: "Approved Rank",
        pathsInAPI: {
            appointment: {
                value: "approvedAppointmentInfo.titleInformation.rank.rankTypeDisplayText",
                displayText: "approvedAppointmentInfo.titleInformation.rank.rankTypeDisplayText"
            }
        },
        optionsListName: "rankList",
        visible: true
    },
    approvedStep: {
        name: "approvedStep",
        displayName: "Approved Step",
        pathsInAPI: {
            appointment: {
                value: "approvedAppointmentInfo.titleInformation.step.stepTypeDescription",
                displayText: "approvedAppointmentInfo.titleInformation.step.stepTypeDescription"
            }
        },
        optionsListName: "stepList",
        visible: true
    },
    approvedSalary: {
        name: "approvedSalary",
        displayName: "Approved Salary",
        pathsInAPI: {
            appointment: {
                value: "approvedAppointmentInfo.salaryInfo.payrollSalary",
                displayText: "approvedAppointmentInfo.salaryInfo.payrollSalary"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_approvedSalary",
        visible: true
    },
    approvedSalaryEffectiveDt: {
        name: "approvedSalaryEffectiveDt",
        displayName: "Effective Date of Approved Salary",
        pathsInAPI: {
            appointment: {
                value: "approvedSalaryInfo.salaryEffectiveDt",
                displayText: "approvedSalaryInfo.salaryEffectiveDt"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "approvedSalaryEffectiveDt"
        },
        saveOriginalValueByKey: "displayValue_approvedSalaryEffectiveDt",
        displayKey: "displayValue_approvedSalaryEffectiveDt",
        viewType: dataViewTypes.displayByKey,
        width: 275,
        visible: true
    },
    onScaleSalary: {
        name: "onScaleSalary",
        displayName: "Approved On-Scale Amount",
        pathsInAPI: {
            appointment: {
                value: "salaryInfo.onScaleSalary",
                displayText: "salaryInfo.onScaleSalary"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_onScaleSalary",
        descriptionText: descriptions.on_scale_salary,
        isMoney: true,
        visible: true
    },
    approvedOffScaleAmount: {
        name: "approvedOffScaleAmount",
        displayName: "Approved Off-Scale Amount",
        pathsInAPI: {
            appointment: {
                value: "approvedSalaryInfo.offScaleAmount",
                displayText: "approvedSalaryInfo.offScaleAmount"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_approvedOffScaleAmount",
        descriptionText: descriptions.approved_off_scale_amount
    },
    approvedOffScalePercent: {
        name: "approvedOffScalePercent",
        displayName: "Approved Off-Scale %",
        pathsInAPI: {
            appointment: {
                value: "approvedSalaryInfo.offScalePercent",
                displayText: "approvedSalaryInfo.offScalePercent"
            }
        },
        viewType: dataViewTypes.round2DecimalPercent,
        displayKey: "displayValue_approvedOffScalePercent",
        descriptionText: descriptions.approved_off_scale_percent,
        visible: true
    },
    approvedChangeInOffScaleAmount: {
        name: "approvedChangeInOffScaleAmount",
        pathsInAPI: {
            appointment: {
                value: "approvedChangeInOffScaleAmount",
                displayText: "approvedChangeInOffScaleAmount"
            }
        },
        viewType: dataViewTypes.money,
        displayKey: "displayValue_approvedChangeInOffScaleAmount",
        displayName: "Increase in Salary (Current/Approved)"
    },
    approvedChangeInOffScalePercent: {
        name: "approvedChangeInOffScalePercent",
        pathsInAPI: {
            appointment: {
                value: "approvedChangeInOffScalePercent",
                displayText: "approvedChangeInOffScalePercent"
            }
        },
        viewType: dataViewTypes.round2DecimalPercent,
        displayKey: "displayValue_approvedChangeInOffScalePercent",
        displayName: "% Increase in Salary (Current/Approved)",
        visible: true
    },
    academicYear: {
        name: "academicYear",
        displayName: "Academic Year",
        pathsInAPI: {
            appointment: {
                value: "appointmentInfo.academicYear",
                displayText: "appointmentInfo.academicYear"
            }
        },
        visible: true,
        width: 175,
        dataType: "input",
        editable: false
    },
 // 8-9-2021 actionCompletedAcademicYear
    actionCompletedAcademicYear: {
        name: "actionCompletedAcademicYear",
        displayName: "Academic Year",
        pathsInAPI: {
            actionData: {
                value: "actionInfo.actionCompletedAcademicYear",
                displayText: "actionInfo.actionCompletedAcademicYear"
            }
        },
        visible: true,
        width: 175,
        dataType: "input",
        editable: false
    },
    approvedEffectiveAcademicYear: {
        name: "approvedEffectiveAcademicYear",
        displayName: "Effective Academic Year",
        pathsInAPI: {
            actionData: {
                value: "actionInfo.approvedEffectiveAcademicYear",
                displayText: "actionInfo.approvedEffectiveAcademicYear"
            }
        },
        visible: true,
        width: 175,
        dataType: "input",
        editable: false
    },
    actionType: {
        name: "actionType",
        displayName: "Action Type",
        pathsInAPI: {
            appointment: {
                value: "actionInfo.actionTypeInfo.actionTypeDisplayText",
                displayText: "actionInfo.actionTypeInfo.actionTypeDisplayText"
            }
        },
        visible: true,
        optionsListName: "eligibilityActionTypeList"
    },
    yearsAccelerated: {
        descriptionText: descriptions.years_accelerated,
        pathsInAPI: {
            appointment: {
                value: "yearsAccelerated",
                displayText: "yearsAccelerated"
            }
        },
        name: "yearsAccelerated",
        displayName: "Years Accelerated"
    },
    yearsDeferred: {
        descriptionText: descriptions.years_deferred,
        pathsInAPI: {
            appointment: {
                value: "yearsDeferred",
                displayText: "yearsDeferred"
            }
        },
        name: "yearsDeferred",
        displayName: "Years Deferred"
    },
    currentRankStep: {
        name: "currentRankStep",
        pathsInAPI: {
            appointment: {
                value: "currentRankStep",
                displayText: "currentRankStep"
            }
        },
        displayName: "Current Rank/Step",
        visible: true
    },
    eligibleRankStep: {
        name: "eligibleRankStep",
        pathsInAPI: {
            appointment: {
                value: "eligibleRankStep",
                displayText: "eligibleRankStep"
            }
        },
        displayName: "Eligible Rank/Step",
        visible: true
    },
    eligibleRank: {
        name: "eligibleRank",
        pathsInAPI: {
            appointment: {
                value: "eligibleRank",
                displayText: "eligibleRank"
            }
        },
        displayName: "Eligible Rank",
        visible: true
    },
    eligibleStep: {
        name: "eligibleStep",
        pathsInAPI: {
            appointment: {
                value: "eligibleStep",
                displayText: "eligibleStep"
            }
        },
        displayName: "Eligible Step",
        visible: true
    },
    proposedEffectiveLaunchDate: {
        name: "proposedEffectiveLaunchDate",
        pathsInAPI: {
            appointment: {
                value: "proposedEffectiveLaunchDate",
                displayText: "proposedEffectiveLaunchDate"
            }
        },
        displayName: "Prop. Effective Launch Date"
    },
    proposedEffectiveDate: {
        name: "proposedEffectiveDate",
        displayName: "Prop. Effective Date",
        descriptionText: descriptions.proposed_effective_date,
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "proposedEffectiveDt",
                displayText: "proposedEffectiveDt"
            }
        },
        transformDate: {
            to: "MM/DD/YYYY",
            pathToGetValue: "proposedEffectiveDate",
            pathToSetValue: "proposedEffectiveDate"
        },
        saveOriginalValueByKey: "displayValue_proposedEffectiveDate",
        displayKey: "displayValue_proposedEffectiveDate",
        dynamicFilterSearch: true,
        width: 225
    },
    eligibleEffectiveDate: {
        name: "eligibleEffectiveDate",
        displayName: "Effective Date",
        pathsInAPI: {
            appointment: {
                value: "eligibleEffectiveDate",
                displayText: "eligibleEffectiveDate"
            }
        },
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            from: "YYYY-MM-DD",
            to: "MM/DD/YYYY",
            pathToGetValue: "eligibleEffectiveDate",
            pathToSetValue: "eligibleEffectiveDate"
        },
        saveOriginalValueByKey: "displayValue_eligibleEffectiveDate",
        displayKey: "displayValue_eligibleEffectiveDate",
        visible: true
    },
    effectiveDate: {
        name: "effectiveDate",
        displayName: "Effective Date",
        pathsInAPI: {
            appointment: {
                value: "effectiveDate",
                displayText: "effectiveDate"
            }
        },
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            to: "MM/DD/YYYY",
            pathToGetValue: "effectiveDate",
            pathToSetValue: "effectiveDate"
        },
        saveOriginalValueByKey: "displayValue_effectiveDate",
        displayKey: "displayValue_effectiveDate",
        visible: true
    },
    endDate: {
        name: "endDate",
        displayName: "End Date",
        pathsInAPI: {
            appointment: {
                value: "endDate",
                displayText: "endDate"
            }
        },
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            to: "MM/DD/YYYY",
            pathToGetValue: "endDate",
            pathToSetValue: "endDate"
        },
        saveOriginalValueByKey: "displayValue_endDate",
        displayKey: "displayValue_endDate",
        visible: true
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
    approvedEffectiveDate: {
        name: "approvedEffectiveDate",
        displayName: "Effective Date",
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "actionInfo.effectiveDt",
                displayText: "actionInfo.effectiveDt"
            }
        },
        transformDate: {
            to: "MM/DD/YYYY",
            pathToGetValue: "approvedEffectiveDate",
            pathToSetValue: "approvedEffectiveDate"
        },
        saveOriginalValueByKey: "displayValue_effectiveDt",
        displayKey: "displayValue_effectiveDt",
        visible: true
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
        width: 250,
        sortable: false,
        viewType: dataViewTypes.tooltip
    },
    caseLocation: {
        name: "location",
        displayName: "Case Location",
        pathsInAPI: {
            appointment: {
                value: "location",
                displayText: "location"
            }
        },
        descriptionText: descriptions.case_location
    },
    eligibleTitleCode: {
        name: "eligibleTitleCode",
        displayName: "Eligible Title Code",
        pathsInAPI: {
            appointment: {
                value: "eligibleTitleCode",
                displayText: "eligibleTitleCode"
            }
        }
    },
    mandatoryActionFlag: {
        name: "mandatoryActionFlag",
        displayName: "Mandatory Action Flag",
        pathsInAPI: {
            appointment: {
                value: "mandatoryActionFlag",
                displayText: "mandatoryActionFlag"
            }
        }
    },
    deferrableActionFlag: {
        name: "deferrableActionFlag",
        displayName: "Deferrable Action Flag",
        pathsInAPI: {
            appointment: {
                value: "deferrableActionFlag",
                displayText: "deferrableActionFlag"
            }
        }
    },
    waiverFlag: {
        name: "waiverFlag",
        displayName: "Waiver Flag",
        pathsInAPI: {
            appointment: {
                value: "waiverFlag",
                displayText: "waiverFlag"
            }
        }
    },
    yearsAtCurrentRank: {
        name: "yearsAtCurrentRank",
        displayName: "Years at Current Rank",
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
        pathsInAPI: {
            appointment: {
                value: "yearsAtCurrentStep",
                displayText: "yearsAtCurrentStep"
            }
        }
    },
    apoAnalyst: {
        name: "apoAnalyst",
        displayName: "APO Analyst",
        //optionsListName: "apoAnalystList",
        dynamicFilterSearch: true,
        pathsInAPI: {
            appointment: {
                value: "apoAnalyst",
                displayText: "apoAnalyst"
            }
        }
    },
    outcomeType: {
        name: "outcomeType",
        displayName: "Outcome",
        optionsListName: "actionOutcomes",
        pathsInAPI: {
            appointment: {
                value: "actionInfo.approvedActionOutcome.name",
                displayText: "actionInfo.approvedActionOutcome.name"
            }
        }
    },
    waiverExpirationDate: {
        name: "waiverExpirationDate",
        displayName: "Waiver End Date",
        pathsInAPI: {
            appointment: {
                value: "waiverExpirationDate",
                displayText: "waiverExpirationDate"
            }
        }
    },
    actionCompletedDt: {
        name: "actionCompletedDt",
        displayName: "Completed Date",
        visible: false,
        pathsInAPI: {
            appointment: {
                value: "actionInfo.actionCompletedDt",
                displayText: "actionInfo.actionCompletedDt"
            }
        },
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "actionCompletedDt",
            pathToSetValue: "actionCompletedDt"
        },
        saveOriginalValueByKey: "displayValue_actionCompletedDt",
        displayKey: "displayValue_actionCompletedDt"
    },
    actionStatus: {
        name: "actionStatus",
        displayName: "Action Status",
        dynamicFilterSearch: true,
        descriptionText: descriptions.actionStatus,
        visible: false,
        pathsInAPI: {
            appointment: {
                value: "actionInfo.actionStatusInfo.commonTypeValue",
                displayText: "actionInfo.actionStatusInfo.commonTypeValue"
            }
        }
    },
    opusCreateDt: {
        name: "opusCreateDt",
        displayName: "Opus Creation Date",
        visible: false,
        pathsInAPI: {
            appointment: {
                value: "opusCreateDt",
                displayText: "opusCreateDt"
            }
        },
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "opusCreateDt",
            pathToSetValue: "opusCreateDt"
        },
        saveOriginalValueByKey: "displayValue_opusCreateDt",
        displayKey: "displayValue_opusCreateDt"
    },
    interfolioCreateDt: {
        name: "interfolioCreateDt",
        displayName: "Interfolio Creation Date",
        visible: false,
        pathsInAPI: {
            appointment: {
                value: "bycUserCases.interfolioCreateDt",
                displayText: "bycUserCases.interfolioCreateDt"
            }
        },
        viewType: dataViewTypes.displayByKey,
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "interfolioCreateDt",
            pathToSetValue: "interfolioCreateDt"
        },
        saveOriginalValueByKey: "displayValue_interfolioCreateDt",
        displayKey: "displayValue_interfolioCreateDt"
    },
    comments: {
        name: "comments",
        displayName: "Comments",
        pathsInAPI: {
            appointment: {
                value: "comments",
                displayText: "comments"
            }
        }
    },
    interfolioLink: {
        name: "interfolioLink",
        sortable: false,
        viewType: dataViewTypes.interfolioLink,
        visible: true,
        displayName: "Go To Interfolio",
        descriptionText: descriptions.interfolioLink,
        pathsInAPI: {
            appointment: {
                value: "bycUserCases.bycCaseUrl",
                displayText: "bycUserCases.bycCaseUrl"
            }
        }
    },
    opusUnit: {
        name: "opusUnit",
        displayName: "Opus Unit",
        viewType: dataViewTypes.mixedString,
        pathsInAPI: {
            appointment: {
                value: "opusUnit",
                displayText: "opusUnit"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    ucPathDeptCode: {
        name: "ucPathDeptCode",
        displayName: "UCPath Unit",
        viewType: dataViewTypes.mixedString,
        pathsInAPI: {
            appointment: {
                value: "ucPathUnit",
                displayText: "ucPathUnit"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    opusAffiliation: {
        name: "opusAffiliation",
        displayName: "Opus Affiliation",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "opusAffiliation",
                displayText: "opusAffiliation"
            }
        },
        width: 150,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    ucPathJobIndicator: {
        name: "ucPathJobIndicator",
        displayName: "UCPath Job Indicator",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "ucPathJobIndicator",
                displayText: "ucPathJobIndicator"
            }
        },
        width: 175,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    opusTitle: {
        name: "opusTitle",
        displayName: "Opus Title",
        viewType: dataViewTypes.mixedString,
        pathsInAPI: {
            appointment: {
                value: "opusTitle",
                displayText: "opusTitle"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    ucPathTitle: {
        name: "ucPathTitle",
        displayName: "UCPath Title",
        viewType: dataViewTypes.mixedString,
        pathsInAPI: {
            appointment: {
                value: "ucPathTitle",
                displayText: "ucPathTitle"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    opusSeries: {
        name: "opusSeries",
        displayName: "Opus Series",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "opusSeries",
                displayText: "opusSeries"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        optionsListName: "seriesList"
    },
    ucPathSeries: {
        name: "ucPathSeries",
        displayName: "UCPath Series",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "ucPathSeries",
                displayText: "ucPathSeries"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    opusRank: {
        name: "opusRank",
        displayName: "Opus Rank",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "opusRank",
                displayText: "opusRank"
            }
        },
        width: 150,
        fixed: false,
        visible: true,
        sortable: true,
        optionsListName: "rankList"
    },
    ucPathRank: {
        name: "ucPathRank",
        displayName: "UCPath Rank",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "ucPathRank",
                displayText: "ucPathRank"
            }
        },
        width: 150,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    opusStep: {
        name: "opusStep",
        displayName: "Opus Step",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "opusStep",
                displayText: "opusStep"
            }
        },
        width: 130,
        fixed: false,
        visible: true,
        sortable: true,
        optionsListName: "stepList"
    },
    ucPathStep: {
        name: "ucPathStep",
        displayName: "UCPath Step",
        viewType: dataViewTypes.number,
        pathsInAPI: {
            appointment: {
                value: "ucPathStep",
                displayText: "ucPathStep"
            }
        },
        width: 130,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    opusEndDate: {
        name: "opusEndDate",
        displayName: "Opus Appt. End Date",
        visible: true,
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "opusEndDate",
                displayText: "opusEndDate"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "opusEndDate",
            pathToSetValue: "opusEndDate"
        },
        saveOriginalValueByKey: "displayValue_opusEndDate",
        displayKey: "displayValue_opusEndDate",
        dynamicFilterSearch: true
    },
    ucPathEndDate: {
        name: "ucPathEndDate",
        displayName: "UCPath End Date",
        visible: true,
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "ucPathEndDate",
                displayText: "ucPathEndDate"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "ucPathEndDate",
            pathToSetValue: "ucPathEndDate"
        },
        saveOriginalValueByKey: "displayValue_ucPathEndDate",
        displayKey: "displayValue_ucPathEndDate",
        dynamicFilterSearch: true
    },
    opusApptStatus: {
        name: "opusApptStatus",
        displayName: "Opus Appt. Status",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "opusApptStatus",
                displayText: "opusApptStatus"
            }
        },
        width: 150,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    ucPathJobStatus: {
        name: "ucPathJobStatus",
        displayName: "UCPath Job Status",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "ucPathJobStatus",
                displayText: "ucPathJobStatus"
            }
        },
        width: 175,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    primarySeries: {
        name: "primarySeries",
        displayName: "Primary Series",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "primarySeries",
                displayText: "primarySeries"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        optionsListName: "seriesList"
    },
    additionalSeries: {
        name: "additionalSeries",
        displayName: "Additional Series",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "additionalSeries",
                displayText: "additionalSeries"
            }
        },
        width: 275,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    primaryRank: {
        name: "primaryRank",
        displayName: "Primary Rank",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "primaryRank",
                displayText: "primaryRank"
            }
        },
        width: 150,
        fixed: false,
        visible: true,
        sortable: true,
        optionsListName: "rankList"
    },
    additionalRank: {
        name: "additionalRank",
        displayName: "Additional Rank",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "additionalRank",
                displayText: "additionalRank"
            }
        },
        width: 150,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    primaryStep: {
        name: "primaryStep",
        displayName: "Primary Step",
        // viewType: dataViewTypes.tableCellHighlight,
        pathsInAPI: {
            appointment: {
                value: "primaryStep",
                displayText: "primaryStep"
            }
        },
        width: 130,
        fixed: false,
        visible: true,
        sortable: true,
        optionsListName: "stepList"
    },
    additionalStep: {
        name: "additionalStep",
        displayName: "Additional Step",
        viewType: dataViewTypes.number,
        pathsInAPI: {
            appointment: {
                value: "additionalStep",
                displayText: "additionalStep"
            }
        },
        width: 130,
        fixed: false,
        visible: true,
        sortable: true,
        dynamicFilterSearch: true
    },
    primaryEndDate: {
        name: "primaryEndDate",
        displayName: "Primary End Date",
        visible: true,
        viewType: dataViewTypes.datetime,
        pathsInAPI: {
            appointment: {
                value: "primaryEndDate",
                displayText: "primaryEndDate"
            }
        },
        // viewType: dataViewTypes.displayByKey,
        // transformDate: {
        //     from: "MM/DD/YYYY",
        //     to: "YYYY/MM/DD",
        //     pathToGetValue: "primaryEndDate",
        //     pathToSetValue: "primaryEndDate"
        // },
        // saveOriginalValueByKey: "displayValue_primaryEndDate",
        // displayKey: "displayValue_primaryEndDate",
        dynamicFilterSearch: true
    },
    additionalEndDate: {
        name: "additionalEndDate",
        displayName: "Additional End Date",
        visible: true,
        viewType: dataViewTypes.datetime,
        pathsInAPI: {
            appointment: {
                value: "additionalEndDate",
                displayText: "additionalEndDate"
            }
        },
        // viewType: dataViewTypes.displayByKey,
        // transformDate: {
        //     from: "MM/DD/YYYY",
        //     to: "YYYY/MM/DD",
        //     pathToGetValue: "additionalEndDate",
        //     pathToSetValue: "additionalEndDate"
        // },
        // saveOriginalValueByKey: "displayValue_additionalEndDate",
        // displayKey: "displayValue_additionalEndDate",
        dynamicFilterSearch: true
    }
};

export let columnOptions = baseColumnOptions;
