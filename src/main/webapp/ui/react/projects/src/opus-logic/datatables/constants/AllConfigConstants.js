/**
 * Created by leonaburime on 7/14/16.
 */
import {config as salary} from "./SalaryConstants";
import {config as salaryCompensation} from "./SalaryCompensationConstants";
import {config as roster} from "./RosterConstants";
import {config as inactiveRoster} from "./InactiveRosterConstants";
import {config as eligibility} from "./EligibilityConstants";
import {config as activeCases} from "./ActiveCasesConstants";
import {config as completedCases} from "./CompletedCasesConstants";
import {config as withdrawnCases} from "./WithdrawnCasesConstants";
import {config as casesAtMyOffice} from "./CasesAtMyOfficeConstants";
import {config as academicHistory} from "./AcademicHistoryConstants";
import {config as eightYearClock} from "./EightYearClockConstants";
import {config as excellenceClock} from "./ExcellenceClockConstants";
import {config as bulkActions} from "./BulkActionsConstants";
import {config as duplicateRecords} from "./DuplicateRecordsConstants";
import {config as eightYearClockSummary} from "./EightYearClockSummaryConstants";
import {config as excellenceReviewClockSummary} from "./ExcellenceReviewClockSummaryConstants";
import {config as linkPathPosition} from "./LinkPathPositionConstants";
import {config as dashboardAlert} from "./DashboardAlertConstants";
import {config as adminCompAllocations} from "./AdminCompAllocationsConstants";
import {config as adminCompProposals} from "./AdminCompProposalsConstants";
import {config as adminCompReports} from "./AdminCompReportsConstants";
import {config as mismatchesReport} from "./MismatchesConstants";
import {config as hiddenMismatchesReport} from "./HiddenMismatchesConstants";
import {config as noUCPathAppointmentReport} from "./OpusOnlyConstants";
import {config as noOpusAppointmentReport} from "./PathOnlyConstants";
import {config as opusMismatchesReport} from "./OpusMismatchesConstants";
import {config as opusHiddenMismatchesReport} from "./OpusHiddenMismatchesConstants";
import {config as activeEndowedChairs} from "./endowed-chairs/ActiveEndowedChairsConstants";
import {config as pendingEndowedChairs} from "./endowed-chairs/PendingEndowedChairsConstants";
import {config as modificationRequest} from "./endowed-chairs/ModificationRequestConstants";
import {config as disestablishedEndowedChairs} from "./endowed-chairs/DisestablishedEndowedChairsConstants";
import {config as inactiveEndowedChairs} from "./endowed-chairs/InactiveEndowedChairsConstants";
import {config as incompleteEndowedChairs} from "./endowed-chairs/IncompleteEndowedChairsConstants";
import {config as endowedChairHolders} from "./endowed-chairs/EndowedChairHoldersConstants";
import {config as complianceReport} from "./ComplianceConstants";

/**
  *  @desc - Configuration Options for the DataTable we want to choose
 **/
export default {
    eligibility,
    activeCases,
    completedCases,
    withdrawnCases,
    casesAtMyOffice,
    salary,
    salaryCompensation,
    roster,
    inactiveRoster,
    academicHistory,
    eightYearClock,
    excellenceClock,
    bulkActions,
    duplicateRecords,
    eightYearClockSummary,
    excellenceReviewClockSummary,
    linkPathPosition,
    dashboardAlert,
    adminCompAllocations,
    adminCompProposals,
    adminCompReports,
    mismatchesReport,
    hiddenMismatchesReport,
    noUCPathAppointmentReport,
    noOpusAppointmentReport,
    opusMismatchesReport,
    opusHiddenMismatchesReport,
    activeEndowedChairs,
    pendingEndowedChairs,
    modificationRequest,
    disestablishedEndowedChairs,
    inactiveEndowedChairs,
    incompleteEndowedChairs,
    endowedChairHolders,
    complianceReport
};
