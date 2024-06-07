import {dataViewTypes} from "./DatatableConstants";
import {descriptions} from "../../common/constants/Descriptions";
import {createConfigFromTemplate} from "./DatatableConfigTemplate";

export const totals = [
    {
        name: "proposedStipends",
        totals: [
            {
                name: "proposedStipendsEvcp",
                label: "Total: EVCP: ",
                amount: 0
            },
            {
                name: "proposedStipendsDean",
                label: "Total: Dean:  ",
                amount: 0
            },
            {
                name: "proposedStipendsDept",
                label: "Total: Dept:   ",
                amount: 0
            },
            {
                name: "proposedStipendsOther",
                label: "Total: Other:  ",
                amount: 0
            },
            {
                name: "grandTotal",
                label: "GRAND Total: ",
                amount: 0
            }
        ]
    },
    {
        name: "approvedStipends",
        totals: [
            {
                name: "approvedStipendsEvcp",
                label: "Total: EVCP: ",
                amount: 0
            },
            {
                name: "approvedStipendsDean",
                label: "Total: Dean:  ",
                amount: 0
            },
            {
                name: "approvedStipendsDept",
                label: "Total: Dept:   ",
                amount: 0
            },
            {
                name: "approvedStipendsOther",
                label: "Total: Other:  ",
                amount: 0
            },
            {
                name: "grandTotal",
                label: "GRAND Total: ",
                amount: 0
            }
        ]
    },
    {
        name: "proposedAdministrativeNinths",
        totals: [
            {
                name: "proposedAdministrativeNinthsAmtEvcp",
                label: "Total: EVCP: ",
                amount: 0,
                ninthsName: "proposedAdministrativeNinthsEvcp",
                ninthsAmount: 0
            },
            {
                name: "proposedAdministrativeNinthsAmtDean",
                label: "Total: Dean:  ",
                amount: 0,
                ninthsName: "proposedAdministrativeNinthsDean",
                ninthsAmount: 0
            },
            {
                name: "proposedAdministrativeNinthsAmtDept",
                label: "Total: Dept:   ",
                amount: 0,
                ninthsName: "proposedAdministrativeNinthsDept",
                ninthsAmount: 0
            },
            {
                name: "proposedAdministrativeNinthsAmtOther",
                label: "Total: Other:  ",
                amount: 0,
                ninthsName: "proposedAdministrativeNinthsOther",
                ninthsAmount: 0
            },
            {
                name: "grandTotal",
                label: "GRAND Total: ",
                amount: 0,
                ninthsName: "grandTotal",
                ninthsAmount: 0
            },
        ]
    },
    {
        name: "approvedAdministrativeNinths",
        totals: [
            {
                name: "approvedAdministrativeNinthsAmtEvcp",
                label: "Total: EVCP: ",
                amount: 0,
                ninthsName: "approvedAdministrativeNinthsEvcp",
                ninthsAmount: 0
            },
            {
                name: "approvedAdministrativeNinthsAmtDean",
                label: "Total: Dean:  ",
                amount: 0,
                ninthsName: "approvedAdministrativeNinthsDean",
                ninthsAmount: 0
            },
            {
                name: "approvedAdministrativeNinthsAmtDept",
                label: "Total: Dept:   ",
                amount: 0,
                ninthsName: "approvedAdministrativeNinthsDept",
                ninthsAmount: 0
            },
            {
                name: "approvedAdministrativeNinthsAmtOther",
                label: "Total: Other:  ",
                amount: 0,
                ninthsName: "approvedAdministrativeNinthsOther",
                ninthsAmount: 0
            },
            {
                name: "grandTotal",
                label: "GRAND Total: ",
                amount: 0,
                ninthsName: "grandTotal",
                ninthsAmount: 0
            },
        ]
    },
    {
        name: "baseSalary",
        totals: [
            {
                name: null,
                amount: 0
            }
        ]
    },
    {
        name: "totalProposedAdminComp",
        totals: [
            {
                name: null,
                amount: 0
            }
        ]
    },
    {
        name: "totalApprovedAdminComp",
        totals: [
            {
                name: null,
                amount: 0
            }
        ]
    },
    {
        name: "totalProposedComp",
        totals: [
            {
                name: null,
                amount: 0
            }
        ]
    },
    {
        name: "totalApprovedComp",
        totals: [
            {
                name: null,
                amount: 0
            }
        ]
    },
];

/**
 *
 * @desc - Configuration constant for Administrative Allocations Page
 *
**/
export const proposalsConfiguration = {
    grouperPathText: "eligibility",
    exportToExcelBaseUrl: "/restServices/rest/admincomp/downloadACProposalCSV",
    url: "/restServices/rest/admincomp/acProposalScreenData",
    unitSearchUrl: "/restServices/rest/admincomp/unitSearch/",
    dropdownUrl: "/restServices/rest/admincomp/newAdminComp",
    filtersUrl: "/restServices/rest/common/getDisplayPreferences",
    newACProposalUrl: "/restServices/rest/admincomp/newAcProposal",
    getICLThresholdUrl: "/restServices/rest/admincomp/getICLThreshold",
    getStipendHeadersUrl: "/restServices/rest/admincomp/getAllocatedStipend",
    getNinthsHeadersUrl: "/restServices/rest/admincomp/getAllocatedNinths",
    createUrl: "/restServices/rest/admincomp/createAcProposal",
    editUrl: "/restServices/rest/admincomp/saveAdminCompData",
    deleteUrl: "/restServices/rest/admincomp/deleteAdminProposalData",
    columnFilterKey: "eligibleFilterMap",
    dataRowName: "acProposalRows",
    excelFileName: "Administrative Proposals",
    pageName: "ACProposals",
    csvPageName: "AdminComp",
    visibleColumnKey: "visible",
    totalKeys: ["proposedStipends", "approvedStipends", "proposedAdministrativeNinths", "approvedAdministrativeNinths",
    "baseSalary", "totalProposedAdminComp", "totalApprovedAdminComp", "totalProposedComp", "totalApprovedComp"],
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
        {visible: false, name: "empId", displayName: "Empl. ID"},
        {visible: false, name: "uid", displayName: "UID"},
        {visible: false, name: "opusId", displayName: "Opus ID"},
        {visible: true, name: "emplName", displayName: "Name"},
        {visible: true, name: "academicYear", displayName: "Academic Year"},
        {visible: true, name: "status", displayName: "Status"},
        {visible: true, name: "actionDetails", displayName: "Personnel Actions"},
        {visible: true, name: "school", displayName: "School"},
        {visible: true, name: "division", displayName: "Division"},
        {visible: true, name: "department", displayName: "Department"},
        {visible: false, name: "area", displayName: "Area"},
        {visible: false, name: "specialty", displayName: "Specialty"},
        {visible: true, name: "organizationName", displayName: "Organization Name"},
        {visible: true, name: "typeOfAppt", displayName: "Type of Appt."},
        {visible: true, name: "titleCodeDescription", displayName: "Title Code: Title"},
        {visible: true, name: "workingTitle", displayName: "Working Title / Role"},
        {visible: true, name: "justification", displayName: "Justification"},
        {visible: true, name: "multipleAdminAppts", displayName: "Multiple Admin. Appts."},
        {visible: true, name: "effectiveDT", displayName: "Effective Date"},
        {visible: true, name: "endDT", displayName: "End Date"},
        {visible: true, name: "proposedFte", displayName: "Proposed FTE"},
        {visible: true, name: "approvedFte", displayName: "Approved FTE"},
        {visible: true, name: "proposedStipends", displayName: "Proposed Stipends"},
        {visible: true, name: "approvedStipends", displayName: "Approved Stipends"},
        {visible: true, name: "proposedAdministrativeNinths", displayName: "Proposed Administrative 9ths"},
        {visible: true, name: "approvedAdministrativeNinths", displayName: "Approved Administrative 9ths"},
        {visible: true, name: "proposedCourseReleases", displayName: "Proposed Course Releases"},
        {visible: true, name: "approvedCourseReleases", displayName: "Approved Course Releases"},
	    {visible: true, name: "nstp", displayName: "NSTP"},
        {visible: true, name: "baseSalary", displayName: "Base Salary"},
        {visible: true, name: "totalProposedAdminComp", displayName: "Total Proposed Admin. Comp."},
        {visible: true, name: "totalApprovedAdminComp", displayName: "Total Approved Admin. Comp."},
        {visible: true, name: "totalProposedComp", displayName: "Total Proposed Comp."},
        {visible: true, name: "totalApprovedComp", displayName: "Total Approved Comp."},
        {visible: true, name: "overICL", displayName: "Over ICL"},
        {visible: true, name: "deanSubmissionDT", displayName: "Dean's Submission Date"},
        {visible: true, name: "revisionRequestedDT", displayName: "Revision Request Date"},
        {visible: true, name: "eVCPApprovedDT", displayName: "EVCP Approval Date"},
        {visible: true, name: "uCOPApprovedDT", displayName: "UCOP Approval Date"},
        {visible: true, name: "completedDT", displayName: "Completed Date"},
        {visible: true, name: "outcome", displayName: "Outcome"},
        {visible: false, name: "comments", displayName: "Comments"},
        {visible: true, name: "delete", displayName: "Delete"}
            ]
        }
    },
    pagePermissions: {
        name: "admin_comp_proposals_view",
        action: "view"
    },
    columnKeys: ["edit", "empId", "uid", "opusId", "emplName", "academicYear", "status", "actionDetails", "school", "division", "department", "area", "specialty", "organizationName",
    "typeOfAppt", "titleCodeDescription", "workingTitle", "justification", "multipleAdminAppts",
    "effectiveDT", "endDT", "proposedFte", "approvedFte", "proposedStipends", "approvedStipends", "proposedAdministrativeNinths",
    "approvedAdministrativeNinths", "proposedCourseReleases", "approvedCourseReleases", "nstp", "baseSalary", "totalProposedAdminComp",
    "totalApprovedAdminComp", "totalProposedComp", "totalApprovedComp", "overICL", "deanSubmissionDT", "revisionRequestedDT", "eVCPApprovedDT",
    "uCOPApprovedDT", "completedDT", "outcome", "comments", "delete"],
    notSortable: ["actionDetails", "justification", "proposedFte", "approvedFte", "proposedStipends", "approvedStipends", "proposedAdministrativeNinths",
    "approvedAdministrativeNinths", "proposedCourseReleases", "approvedCourseReleases", "comments"],
    // omitUIColumns: ["comments"],
    invalidChangeColumnsOptions: ["edit"],
  // These are the editable fields in the edit modal
    editableKeys: ["organizationName", "stipend", "ninths", "ninthsAmount", "fullTimeEquivalent"],
  //Columns will appear in array order shown here
    columnConfiguration: {
        edit: {
            uiLayer: {},
            descriptionText: "View/Edit"
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
            visible: false,
            fixed: true
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
            visible: false,
            fixed: true
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
            visible: false,
            fixed: true
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
            textSearch: true,
            fixed: true
        },
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
            width: 125,
            dataType: "input",
            editable: false
        },
        status: {
            name: "status",
            displayName: "Status",
            pathsInAPI: {
                appointment: {
                    value: "status",
                    displayText: "status"
                }
            },
            dynamicFilterSearch: true,
            visible: true,
            width: 125,
            dataType: "input",
            editable: false
        },
        actionDetails: {
            name: "actionDetails",
            displayName: "Personnel Actions",
            pathsInAPI: {
                appointment: {
                    value: "actionDetails",
                    displayText: "actionDetails"
                }
            },
            dynamicFilterSearch: true,
            viewType: dataViewTypes.multilineAction,
            visible: true,
            width: 250,
            sortable: false,
            descriptionText: descriptions.personnelActions
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
            width: 250,
            descriptionText: descriptions.organizationNameForProposalsDatatable,
            viewType: dataViewTypes.tooltip
        },
        typeOfAppt: {
            name: "typeOfAppt",
            displayName: "Type of Appt.",
            pathsInAPI: {
                appointment: {
                    value: "typeOfAppt",
                    displayText: "typeOfAppt"
                }
            },
            visible: true
        },
        titleCodeDescription: {
            name: "titleCodeDescription",
            displayName: "Title Code: Title",
            pathsInAPI: {
                appointment: {
                    value: "titleCodeDescription",
                    displayText: "titleCodeDescription"
                }
            },
            visible: true,
            dynamicFilterSearch: true,
            descriptionText: descriptions.titleCodeForProposals
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
            descriptionText: descriptions.workingTitleForProposalsTable
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
            descriptionText: descriptions.justificationForProposals
        },
        multipleAdminAppts: {
            name: "multipleAdminAppts",
            displayName: "Multiple Admin. Appts.",
            pathsInAPI: {
                appointment: {
                    value: "multipleAdminAppts",
                    displayText: "multipleAdminAppts"
                }
            },
            visible: true,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.multipleAdminApptsForProposals
        },
        effectiveDT: {
            name: "effectiveDT",
            displayName: "Effective Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "effectiveDT",
                    displayText: "effectiveDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "effectiveDT",
                pathToSetValue: "effectiveDT"
            },
            saveOriginalValueByKey: "displayValue_effectiveDT",
            displayKey: "displayValue_effectiveDT",
            visible: true,
            width: 100
      // dynamicFilterSearch: true,
      // descriptionText: descriptions.title
        },
        endDT: {
            name: "endDT",
            displayName: "End Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "endDT",
                    displayText: "endDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "endDT",
                pathToSetValue: "endDT"
            },
            saveOriginalValueByKey: "displayValue_endDT",
            displayKey: "displayValue_endDT",
            visible: true,
            width: 100
      // dynamicFilterSearch: true,
      // descriptionText: descriptions.title
        },
        proposedFte: {
            name: "proposedFte",
            displayName: "Proposed FTE",
      //width: 305,
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "proposedFte",
                    displayText: "proposedFte"
                }
            },
            visible: true,
            sortable: false,
            width: 100,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.proposedFTE
        },
        approvedFte: {
            name: "approvedFte",
            displayName: "Approved FTE",
      //width: 305,
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "approvedFte",
                    displayText: "approvedFte"
                }
            },
            visible: true,
            sortable: false,
            width: 100,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.approvedFTE
        },
        proposedStipends: {
            name: "proposedStipends",
            displayName: "Proposed Stipends",
            width: 250,
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "proposedStipends",
                    displayText: "proposedStipends"
                }
            },
            visible: true,
            sortable: false,
            descriptionText: descriptions.proposedStipends
        },
        approvedStipends: {
            name: "approvedStipends",
            displayName: "Approved Stipends",
            width: 250,
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "approvedStipends",
                    displayText: "approvedStipends"
                }
            },
            visible: true,
            sortable: false,
            descriptionText: descriptions.approvedStipends
        },
        proposedAdministrativeNinths: {
            name: "proposedAdministrativeNinths",
            displayName: "Proposed Administrative 9ths",
            width: 280,
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "proposedAdministrativeNinths",
                    displayText: "proposedAdministrativeNinths"
                }
            },
            visible: true,
            sortable: false,
            descriptionText: descriptions.proposedAdministrativeNinths
        },
        approvedAdministrativeNinths: {
            name: "approvedAdministrativeNinths",
            displayName: "Approved Administrative 9ths",
            width: 280,
            viewType: dataViewTypes.multiline,
            pathsInAPI: {
                appointment: {
                    value: "approvedAdministrativeNinths",
                    displayText: "approvedAdministrativeNinths"
                }
            },
            visible: true,
            sortable: false,
            descriptionText: descriptions.approvedAdministrativeNinths
        },
        proposedCourseReleases: {
            name: "proposedCourseReleases",
            displayName: "Proposed Course Releases",
            pathsInAPI: {
                appointment: {
                    value: "proposedCourseReleases",
                    displayText: "proposedCourseReleases"
                }
            },
            visible: true,
            sortable: false,
            width: 100
        },
        approvedCourseReleases: {
            name: "approvedCourseReleases",
            displayName: "Approved Course Releases",
            pathsInAPI: {
                appointment: {
                    value: "approvedCourseReleases",
                    displayText: "approvedCourseReleases"
                }
            },
            visible: true,
            sortable: false,
            width: 100
        },
        nstp: {
            name: "nstp",
            displayName: "NSTP",
            pathsInAPI: {
                appointment: {
                    value: "nstp",
                    displayText: "nstp"
                }
            },
            visible: true,
            width: 125,
			descriptionText: descriptions.nstp
        },
        baseSalary: {
            name: "baseSalary",
            displayName: "Base Salary",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_baseSalary",
            pathsInAPI: {
                appointment: {
                    value: "baseSalary",
                    displayText: "baseSalary"
                }
            },
            visible: true,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.baseSalary,
            width: 150
        },
        totalProposedAdminComp: {
            name: "totalProposedAdminComp",
            displayName: "Total Proposed Admin. Comp.",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_totalProposedAdminComp",
            pathsInAPI: {
                appointment: {
                    value: "totalProposedAdminComp",
                    displayText: "totalProposedAdminComp"
                }
            },
            visible: true,
            width: 150,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.totalProposedAdminCompForProposal
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
            width: 150,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.totalApprovedAdminComp
        },
        totalProposedComp: {
            name: "totalProposedComp",
            displayName: "Total Proposed Comp.",
            viewType: dataViewTypes.money,
            displayKey: "displayValue_totalProposedComp",
            pathsInAPI: {
                appointment: {
                    value: "totalProposedComp",
                    displayText: "totalProposedComp"
                }
            },
            visible: true,
            width: 150,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.totalProposedComp
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
            width: 150,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.totalApprovedComp
        },
        overICL: {
            name: "overICL",
            displayName: "Over ICL",
            pathsInAPI: {
                appointment: {
                    value: "overICL",
                    displayText: "overICL"
                }
            },
            visible: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.overICL
        },
        deanSubmissionDT: {
            name: "deanSubmissionDT",
            displayName: "Dean’s Submission Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "deanSubmissionDT",
                    displayText: "deanSubmissionDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "deanSubmissionDT",
                pathToSetValue: "deanSubmissionDT"
            },
            saveOriginalValueByKey: "displayValue_deanSubmissionDT",
            displayKey: "displayValue_deanSubmissionDT",
            visible: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.deanSubmissionDate
        },
        revisionRequestedDT: {
            name: "revisionRequestedDT",
            displayName: "Revision Request Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "revisionRequestedDT",
                    displayText: "revisionRequestedDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "revisionRequestedDT",
                pathToSetValue: "revisionRequestedDT"
            },
            saveOriginalValueByKey: "displayValue_revisionRequestedDT",
            displayKey: "displayValue_revisionRequestedDT",
            visible: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.revisionRequestedDate
        },
        eVCPApprovedDT: {
            name: "eVCPApprovedDT",
            displayName: "EVCP Approval Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "evcpapprovedDT",
                    displayText: "evcpapprovedDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "eVCPApprovedDT",
                pathToSetValue: "eVCPApprovedDT"
            },
            saveOriginalValueByKey: "displayValue_eVCPApprovedDT",
            displayKey: "displayValue_eVCPApprovedDT",
            visible: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.eVCPApprovalDate
        },
        uCOPApprovedDT: {
            name: "uCOPApprovedDT",
            displayName: "UCOP Approval Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "ucopapprovedDT",
                    displayText: "ucopapprovedDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "uCOPApprovedDT",
                pathToSetValue: "uCOPApprovedDT"
            },
            saveOriginalValueByKey: "displayValue_uCOPApprovedDT",
            displayKey: "displayValue_uCOPApprovedDT",
            visible: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.uCOPApprovalDate
        },
        completedDT: {
            name: "completedDT",
            displayName: "Completed Date",
            viewType: dataViewTypes.displayByKey,
            pathsInAPI: {
                appointment: {
                    value: "completedDT",
                    displayText: "completedDT"
                }
            },
            transformDate: {
                from: "MM/DD/YYYY",
                to: "YYYY/MM/DD",
                pathToGetValue: "completedDT",
                pathToSetValue: "completedDT"
            },
            saveOriginalValueByKey: "displayValue_completedDT",
            displayKey: "displayValue_completedDT",
            visible: true,
            width: 125,
      // dynamicFilterSearch: true,
            descriptionText: descriptions.completedDate
        },
        outcome: {
            name: "outcome",
            displayName: "Outcome",
      // optionsListName: 'actionOutcomes',
            pathsInAPI: {
                appointment: {
                    value: "outcome",
                    displayText: "outcome"
                }
            },
            visible: true
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
            visible: false,
            sortable: false,
            width: 225,
            descriptionText: descriptions.commentsForProposals
        },
        delete: {
            name: "delete",
            sortable: false,
            viewType: dataViewTypes.deleteButton,
            visible: true,
            width: 95,
            action: "delete",
            buttonText: "Delete",
            displayName: "Delete",
        }
    }
};

export const config = createConfigFromTemplate(proposalsConfiguration);
