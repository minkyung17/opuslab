// this is primarily for XLS/export tests since these are page-based instead of role-based
const ApptsActivePage = require('../pages/ACTIVE_APPOINTMENTS_PAGE');
const ActiveCasesPage = require('../pages/ACTIVE_CASES_PAGE');
const AdminCompAllocationsPage = require('../pages/ADMIN_COMP_ALLOCATIONS_PAGE');
const AdminCompProposalsPage = require('../pages/ADMIN_COMP_PROPOSALS_PAGE');
const AdminCompProposalSummaryPage = require('../pages/ADMIN_COMP_PROPOSAL_SUMMARY_PAGE');
const AdminCompReportPage = require('../pages/ADMIN_COMP_REPORT_PAGE');
const CamoPage = require('../pages/CAMO_PAGE');
const CaseSummaryPage = require('../pages/CASE_SUMMARY_PAGE');
const CompletedCasesPage = require('../pages/COMPLETED_CASES_PAGE');
const DashboardPage = require('../pages/DASHBOARD_PAGE');
const EightYearClockPage = require('../pages/EIGHT_YEAR_CLOCK_PAGE');
const EligibilityPage = require('../pages/ELIGIBILITY_PAGE');
const EndowedChairsActivePage = require('../pages/ENDOWED_CHAIRS_ACTIVE_PAGE');
const EndowedChairsDisestablishedPage = require('../pages/ENDOWED_CHAIRS_DISESTABLISHED_PAGE');
const EndowedChairsInactivePage = require('../pages/ENDOWED_CHAIRS_INACTIVE_PAGE');
const EndowedChairsIncompletePage = require('../pages/ENDOWED_CHAIRS_INCOMPLETE_PAGE');
const EndowedChairsModificationRequestPage = require('../pages/ENDOWED_CHAIRS_MODIFICATION_REQUEST_PAGE');
const EndowedChairsPendingPage = require('../pages/ENDOWED_CHAIRS_PENDING_PAGE');
const ExcellenceReviewClockPage = require('../pages/EXCELLENCE_CLOCK_PAGE');
const ApptsInactivePage = require('../pages/INACTIVE_APPOINTMENTS_PAGE');
const LinkUCPathPositionPage = require('../pages/LINK_UCPATH_POSITION_PAGE');
const ManagePermissionsUnitsPage = require('../pages/MANAGE_PERMISSIONS_UNITS_PAGE');
const ManagePermissionsUsersPage = require('../pages/MANAGE_PERMISSIONS_USERS_PAGE');
const PathCompReportPage = require('../pages/PATH_COMP_REPORT_PAGE');
const PrimaryAdditionalComparisonHiddenMismatchesPage = require('../pages/PRIMARY_ADDITIONAL_COMPARISON_HIDDEN_MISMATCHES_PAGE');
const PrimaryAdditionalComparisonMismatchesPage = require('../pages/PRIMARY_ADDITIONAL_COMPARISON_MISMATCHES_PAGE');
const ProfilePage = require('../pages/PROFILE_PAGE');
const RequestAUIDPage = require('../pages/REQUEST_A_UID_PAGE');
const SalaryReportPage = require('../pages/SALARY_REPORT_PAGE');
const UIDAdminPage = require('../pages/UIDADMIN_PAGE');
const UCPathOpusComparisonHiddenMismatchesPage = require('../pages/UCPATH_OPUS_COMPARISON_HIDDEN_MISMATCHES_PAGE');
const UCPathOpusComparisonMismatchesPage = require('../pages/UCPATH_OPUS_COMPARISON_MISMATCHES_PAGE');
const VerifyCompliancePage = require('../pages/VERIFY_COMPLIANCE_PAGE');
const WithdrawnCasesPage = require('../pages/WITHDRAWN_CASES_PAGE');

// the desiredPage parameter is the name of the downloaded file (minus extension)
// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, xls/XLS)
makePage = async (loggingPrefix, driver, desiredPage) =>
{
    var shinyNewPage = null;
    
    // make page based on input
    switch(desiredPage)
    {
        case "ActiveCases":
            shinyNewPage = new ActiveCasesPage();
            break;
        case "AdminCompAllocations":
            shinyNewPage = new AdminCompAllocationsPage();
            break;
        case "AdminCompProposals":
            shinyNewPage = new AdminCompProposalsPage();
            break;
        case "AdminCompProposalSummary":
            shinyNewPage = new AdminCompProposalSummaryPage();
            break;
        case "AdminCompReport":
            shinyNewPage = new AdminCompReportPage();
            break;
        case "ApptsActive":
            shinyNewPage = new ApptsActivePage();
            break;
        case "ApptsInactive":
            shinyNewPage = new ApptsInactivePage();
            break;
        case "BulkChangeApu":
            shinyNewPage = new ActiveCasesPage();
            break;
        case "BulkEndAppt":
            shinyNewPage = new ActiveCasesPage();
            break;
        case "BulkReappt":
            shinyNewPage = new ActiveCasesPage();
            break;
        case "BulkRenewal":
            shinyNewPage = new ActiveCasesPage();
        case "CaseSummary":
            shinyNewPage = new CaseSummaryPage();
        case "CasesAtMyOffice":
            shinyNewPage = new CamoPage();
            break;
        case "CamoAPO":
            shinyNewPage = new CamoPage();
            break;
        case "CamoCAP":
            shinyNewPage = new CamoPage();
            break;
        case "CamoDeansOffice":
            shinyNewPage = new CamoPage();
            break;
        case "CamoDepartment":
            shinyNewPage = new CamoPage();
            break;
        case "CamoLibrary":
            shinyNewPage = new CamoPage();
            break;
        case "CompletedCases":
            shinyNewPage = new CompletedCasesPage();
            break;
        case "Dashboard":
            shinyNewPage = new DashboardPage();
            break;
            break;
        case "Eligibility":
            shinyNewPage = new EligibilityPage();
            break;
        case "EightYearClock":
            shinyNewPage = new EightYearClockPage();
            break;
        case "EndowedChairsActive":
            shinyNewPage = new EndowedChairsActivePage();
        case "EndowedChairsPending":
            shinyNewPage = new EndowedChairsPendingPage();
        case "EndowedChairsModificationRequest":
            shinyNewPage = new EndowedChairsModificationRequestPage();
        case "EndowedChairsDisestablished":
            shinyNewPage = new EndowedChairsDisestablishedPage();
        case "EndowedChairsInactive":
            shinyNewPage = new EndowedChairsInactivePage();
        case "EndowedChairsIncomplete":
            shinyNewPage = new EndowedChairsIncompletePage();
            break;
        case "ExcellenceReviewClock":
            shinyNewPage = new ExcellenceReviewClockPage();
            break;
        case "LinkUCPathPosition":
            shinyNewPage = new LinkUCPathPositionPage();
            break;
        case "ManagePermissionsUnits":
            shinyNewPage = new ManagePermissionsUnitsPage();
            break;
        case "ManagePermissionsUsers":
            shinyNewPage = new ManagePermissionsUsersPage();
            break;
        case "PathCompReport":
            shinyNewPage = new PathCompReportPage();
            break;
        case "PrimaryAdditionalComparisonHiddenMismatches":
            shinyNewPage = new PrimaryAdditionalComparisonHiddenMismatchesPage();
            break;
        case "PrimaryAdditionalComparisonMismatches":
            shinyNewPage = new PrimaryAdditionalComparisonMismatchesPage();
            break;
        case "ProfileSearch":
            shinyNewPage = new ProfilePage();
        case "ProfileAppointmentSet":
            shinyNewPage = new ProfilePage();
            break;
        case "RequestAUID":
            shinyNewPage = new RequestAUIDPage();
            break;
        case "SalaryReport":
            shinyNewPage = new SalaryReportPage();
            break;
         case "UCPathOpusComparisonHiddenMismatches":
            shinyNewPage = new UCPathOpusComparisonHiddenMismatchesPage();
            break;
        case "UCPathOpusComparisonMismatches":
            shinyNewPage = new UCPathOpusComparisonMismatchesPage();
            break;
        case "UIDAdmin":
            shinyNewPage = new UIDAdminPage();
            break;
        case "VerifyCompliance":
            shinyNewPage = new VerifyCompliancePage();
            break;
        case "WithdrawnCases":
            shinyNewPage = new WithdrawnCasesPage();
            break;
        default:
            logThis(loggingPrefix + "invalid page name -- couldn't make page");
            process.exit();
    }
    
    logThis(loggingPrefix + "A(n) " + desiredPage + " page has been created");
    
    return shinyNewPage;
}

module.exports =
{
    // define what should be accessible by other scripts
    makePage
};