import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";

export let fieldsInAPI = {
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
    fullName: {
        name: "fullName",
        displayName: "Name",
        pathsInAPI: {
            appointment: {
                value: "appointeeInfo.fullName",
                displayText: "appointeeInfo.fullName"
            }
        },
        viewType: dataViewTypes.sortingText,
        displayKey: "displayValue_fullName",
        width: 250,
        visible: true,
        textSearch: true,
        fixed: true
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
    departmentName: {
        name: "departmentName",
        displayName: "Department",
        pathsInAPI: {
            appointment: {
                value: "academicHierarchyInfo.departmentName",
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
    startDateAtRank: {
        name: "startDateAtRank",
        displayName: "Start Date at Rank",
        dataType: "date",
        width: 140,
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
    eightYearLimitElgEffDt: {
        name: "eightYearLimitElgEffDt",
        displayName: "Estimated Date of Eight-Year Review",
        viewType: dataViewTypes.displayByKey,
        width: 170,
        editConfiguration: {
            date: {
                fromDateFormat: "MM/DD/YYYY",
                toDateFormat: "MM/DD/YYYY"
            }
        },
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.eightYearLimitElgEffDt",
                displayText: "tenureClockInfo.eightYearLimitElgEffDt"
            }
        },
        dataType: "date",
        transformDate: {
            from: "MM/DD/YYYY",
            to: "MM/DD/YYYY",
            pathToGetValue: "eightYearLimitElgEffDt",
            pathToSetValue: "eightYearLimitElgEffDt"
        },
        saveOriginalValueByKey: "displayValue_eightYearLimitElgEffDt",
        displayKey: "eightYearLimitElgEffDt"
    },
    eightYearLimitEffDt: {
        name: "eightYearLimitEffDt",
        displayName: "Effective Date of Eight-Year Review",
        width: 150,
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.eightYearLimitEffDt",
                displayText: "tenureClockInfo.eightYearLimitEffDt"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "MM/DD/YYYY",
            pathToGetValue: "eightYearLimitEffDt"
        },
        saveOriginalValueByKey: "displayValue_eightYearLimitEffDt",
        displayKey: "displayValue_eightYearLimitEffDt",
        descriptionText: descriptions.effective_8_year_limit,
        visible: true,
        dataType: "date"
    },
    fourthYearAppraisalEffDt: {
        name: "fourthYearAppraisalEffDt",
        displayName: "Effective Date of 4th Year Appraisal",
        width: 150,
        editConfiguration: {
            date: {
                fromDateFormat: "MM/DD/YYYY",
                toDateFormat: "MM/DD/YYYY"
            }
        },
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.fourthYearAppraisalEffDt",
                displayText: "tenureClockInfo.fourthYearAppraisalEffDt"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: "YYYY/MM/DD",
            pathToGetValue: "fourthYearAppraisalEffDt"
        },
        saveOriginalValueByKey: "displayValue_fourthYearAppraisalEffDt",
        displayKey: "displayValue_fourthYearAppraisalEffDt",
        descriptionText: descriptions.effective_4th_year_appraisal,
        dataType: "date",
        visible: true
    },
    fourthYearAppraisalElgEffDt: {
        name: "fourthYearAppraisalElgEffDt",
        displayName: "Estimated Date of 4th Year Appraisal",
        visible: true,
        width: 175,
        viewType: dataViewTypes.displayByKey,
        editConfiguration: {
            date: {
                fromDateFormat: "MM/DD/YYYY",
                toDateFormat: "MM/DD/YYYY"
            }
        },
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.fourthYearAppraisalElgEffDt",
                displayText: "tenureClockInfo.fourthYearAppraisalElgEffDt"
            }
        },
        dataType: "date",
        transformDate: {
            from: "MM/DD/YYYY",
            to: "MM/DD/YYYY",
            pathToGetValue: "fourthYearAppraisalElgEffDt",
            pathToSetValue: "fourthYearAppraisalElgEffDt"
        },
        saveOriginalValueByKey: "displayValue_fourthYearAppraisalElgEffDt",
        displayKey: "fourthYearAppraisalElgEffDt",
        descriptionText: descriptions.eligible_4th_year_appraisal
    },
    unitAYTotalCount: {
        name: "unitAYTotalCount",
        displayName: "Credited Service Units: Total",
        width: 150,
        visible: true,
        editable: true,
        descriptionText: descriptions.credited_service_units_total,
        dataType: "number",
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.unitAYTotalCount",
                displayText: "tenureClockInfo.unitAYTotalCount"
            }
        }
    },
    unitTOCTakenCount: {
        name: "unitTOCTakenCount",
        displayName: "TOC Taken",
        visible: true,
        width: 150,
        editable: true,
        descriptionText: descriptions.toc_taken,
        dataType: "number",
        checkOnSave: true,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.unitTOCTakenCount",
                displayText: "tenureClockInfo.unitTOCTakenCount"
            }
        },
        helpText: "Please enter a number below TOC Credited.",
        onSaveValidations: ["tocTakenBelowTOCCredited"],
        show: true,
        edit: true,
        placement: "left"
    },
    unitTOCYearCount: {
        name: "unitTOCYearCount",
        displayName: "TOC Credited",
        visible: true,
        checkOnSave: true,
        editable: true,
        helpText: "Please enter a number between 0 and 2.",
        onSaveValidations: ["tocCreditedNumberBounds"],
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.unitTOCYearCount",
                displayText: "tenureClockInfo.unitTOCYearCount"
            }
        },
        descriptionText: descriptions.toc_credited,
        optionsListName: null,
        dataType: "number"
    },
    unitYearsTotalCount: {
        name: "unitYearsTotalCount",
        displayName: "Credited Service Years: Total",
        width: 150,
        visible: true,
        editable: true,
        descriptionText: descriptions.credited_service_years_total,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.unitYearsTotalCount",
                displayText: "tenureClockInfo.unitYearsTotalCount"
            }
        },
        optionsListName: null,
        dataType: "number"
    },
    serviceUnitType: {
        name: "serviceUnitType",
        displayName: "Service Unit Type",
        visible: true,
        width: 140,
        descriptionText: descriptions.service_unit_type,
        optionsListName: null,
        includeBlankOption: false,
        editable: true,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.serviceUnitType.serviceUnitTypeId",
                displayText: "tenureClockInfo.serviceUnitType.serviceUnitDisplayText"
            }
        },
        dataType: "options",
        options: null
    },
    continuingUnit18ElgEffDt: {
        name: "continuingUnit18ElgEffDt",
        displayName: "Estimated Date of Excellence Review",
        width: 180,
        visible: true,
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.continuingUnit18ElgEffDt",
                displayText: "tenureClockInfo.continuingUnit18ElgEffDt"
            }
        },
        transformDate: {
            from: "MM/DD/YYYY",
            to: 'YYYY/MM/DD',
            pathToGetValue: "continuingUnit18ElgEffDt",
            pathToSetValue: "continuingUnit18ElgEffDt"
        },
        saveOriginalValueByKey: "displayValue_continuingUnit18ElgEffDt",
        displayKey: "displayValue_continuingUnit18ElgEffDt",
        descriptionText: descriptions.eligible_date_excellence_review
    },
    continuingUnit18ReviewEffDt: {
        name: 'continuingUnit18ReviewEffDt',
        displayName: 'Effective Date of Excellence Review',
        visible: true,
        viewType: dataViewTypes.displayByKey,
        pathsInAPI: {
            appointment: {
                value: 'tenureClockInfo.continuingUnit18ReviewEffDt',
                displayText: 'tenureClockInfo.continuingUnit18ReviewEffDt'
            }
        },
        transformDate: {
            from: 'MM/DD/YYYY',         
            to: 'YYYY/MM/DD',
            pathToGetValue: 'continuingUnit18ReviewEffDt',
            pathToSetValue: 'continuingUnit18ReviewEffDt'
        },
        saveOriginalValueByKey: 'displayValue_continuingUnit18ReviewEffDt',
        displayKey: 'displayValue_continuingUnit18ReviewEffDt',
        descriptionText: descriptions.effective_date_excellence_review
    },
    continuingUnit18Outcome: {
        name: "continuingUnit18Outcome",
        displayName: "Outcome of Excellence Review",
        width: 175,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.continuingUnit18Outcome",
                displayText: "tenureClockInfo.continuingUnit18Outcome"
            }
        },
        dataType: "input"
    },
    fourthYearAppraisalOutcome: {
        name: "fourthYearAppraisalOutcome",
        displayName: "Outcome of 4th Year Appraisal",
        dataType: "input",
        width: 150,
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.fourthYearAppraisalOutcome",
                displayText: "tenureClockInfo.fourthYearAppraisalOutcome"
            }
        }
    },
    eightYearLimitOutcome: {
        name: "eightYearLimitOutcome",
        displayName: "Outcome of Eight-Year Review",
        width: 175,
        dataType: "input",
        pathsInAPI: {
            appointment: {
                value: "tenureClockInfo.eightYearLimitOutcome",
                displayText: "tenureClockInfo.eightYearLimitOutcome"
            }
        }
    }
};
