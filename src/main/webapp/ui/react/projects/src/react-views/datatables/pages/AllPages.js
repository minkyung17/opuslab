//import DataTableComponent from './DataTableComponent';
import RosterTable from "./RosterTable.jsx";
import InactiveRosterTable from "./InactiveRosterTable.jsx";
import SalaryTable from "./SalaryTable.jsx";
import SalaryCompensationTable from "./SalaryCompensationTable.jsx";
// import CasesTableComponent from './CasesTable.jsx';
import ActiveCasesTableComponent from "./ActiveCasesTable.jsx";
import CompletedCasesTableComponent from "./CompletedCasesTable.jsx";
import WithdrawnCasesTableComponent from "./WithdrawnCasesTable.jsx";
import CasesAtMyOfficeComponent from "./CasesAtMyOfficeTable.jsx";
import ExcellenceClock from "./ExcellenceClockPage.jsx";
import EightYearClockTable from "./EightYearClockTable.jsx";
import EligibilityTableComponent from "./EligibilityTable.jsx";
import DuplicateRecordsTable from "./DuplicateRecordsTable.jsx";
import EightYearClockSummaryPage from "./EightYearClockSummaryPage.jsx";
import ExcellenceReviewClockSummaryPage from "./ExcellenceReviewClockSummaryPage.jsx";
import LinkPathPositionTableComponent from "./LinkPathPosition.jsx";
import AdminCompAllocationsTableComponent from "./AdminCompAllocationsTable.jsx";
import AdminCompProposalsTableComponent from "./AdminCompProposalsTable.jsx";
import AdminCompReportsTableComponent from "./AdminCompReportsTable.jsx";
import MismatchesTableComponent from "./MismatchesTable.jsx";
import HiddenMismatchesTableComponent from "./HiddenMismatchesTable.jsx";
import OpusOnlyTableComponent from "./OpusOnlyTable.jsx";
import PathOnlyTableComponent from "./PathOnlyTable.jsx";
import OpusMismatchesTableComponent from "./OpusMismatchesTable.jsx";
import OpusHiddenMismatchesTableComponent from "./OpusHiddenMismatchesTable.jsx";
import ActiveEndowedChairsTableComponent from "./endowed-chairs/ActiveEndowedChairsTable.jsx";
import PendingEndowedChairsTableComponent from "./endowed-chairs/PendingEndowedChairsTable.jsx";
import ModificationRequestTableComponent from "./endowed-chairs/ModificationRequestTable.jsx";
import DisestablishedEndowedChairsTableComponent from "./endowed-chairs/DisestablishedEndowedChairsTable.jsx";
import InactiveEndowedChairsTableComponent from "./endowed-chairs/InactiveEndowedChairsTable.jsx";
import IncompleteEndowedChairsTableComponent from "./endowed-chairs/IncompleteEndowedChairsTable.jsx";
import EndowedChairHoldersTableComponent from "./endowed-chairs/EndowedChairHoldersTable.jsx";
import ComplianceTableComponent from "./ComplianceTable.jsx";

export const datatables = {
  // cases: CasesTableComponent,
    activeCases: ActiveCasesTableComponent,
    completedCases: CompletedCasesTableComponent,
    withdrawnCases: WithdrawnCasesTableComponent,
    casesAtMyOffice: CasesAtMyOfficeComponent,
    salary: SalaryTable,
    salaryCompensation: SalaryCompensationTable,
    roster: RosterTable,
    inactiveRoster: InactiveRosterTable,
    eligibility: EligibilityTableComponent,
    excellenceClock: ExcellenceClock,
    eightYearClock: EightYearClockTable,
    duplicateRecords: DuplicateRecordsTable,
    eightYearClockSummary: EightYearClockSummaryPage,
    excellenceReviewClockSummary: ExcellenceReviewClockSummaryPage,
    linkPathPosition: LinkPathPositionTableComponent,
    adminCompAllocations: AdminCompAllocationsTableComponent,
    adminCompProposals: AdminCompProposalsTableComponent,
    adminCompReports: AdminCompReportsTableComponent,
    mismatchesReport: MismatchesTableComponent,
    hiddenMismatchesReport: HiddenMismatchesTableComponent,
    noUCPathAppointmentReport: OpusOnlyTableComponent,
    noOpusAppointmentReport: PathOnlyTableComponent,
    opusMismatchesReport: OpusMismatchesTableComponent,
    opusHiddenMismatchesReport: OpusHiddenMismatchesTableComponent,
    activeEndowedChairs: ActiveEndowedChairsTableComponent,
    pendingEndowedChairs: PendingEndowedChairsTableComponent,
    modificationRequest: ModificationRequestTableComponent,
    disestablishedEndowedChairs: DisestablishedEndowedChairsTableComponent,
    inactiveEndowedChairs: InactiveEndowedChairsTableComponent,
    incompleteEndowedChairs: IncompleteEndowedChairsTableComponent,
    endowedChairHolders: EndowedChairHoldersTableComponent,
    complianceReport: ComplianceTableComponent
};
