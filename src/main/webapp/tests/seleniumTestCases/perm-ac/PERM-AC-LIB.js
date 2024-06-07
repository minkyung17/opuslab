// all files access this central library only; this central library picks up functions from sub-libraries
const AdminCompAllocationsPage = require('../pages/ADMIN_COMP_ALLOCATIONS_PAGE');
const AdminCompProposalsPage = require('../pages/ADMIN_COMP_PROPOSALS_PAGE');
const AdminCompProposalSummaryPage = require('../pages/ADMIN_COMP_PROPOSAL_SUMMARY_PAGE');
const SignonPage = require('../pages/SIGNON_PAGE');

// custom sub-libraries (non-core node.js files)
require('../data/REPORT_FILE_HEADERS');
require('../data/REPORT_FILE_NAMES');
require('../data/XRAY_TEST_ISSUE_KEY');

require('../libraries/ACCESS');
require('../libraries/ASYNCFOREACH');
require('../libraries/CLOCK');
require('../libraries/DRIVER');
require('../libraries/JUDGEMENT');
require('../libraries/LOG');
require('../libraries/PAGEFACTORY');
require('../libraries/ROLES');
require('../libraries/ROLEVALIDATION');
require('../libraries/RUN');
require('../libraries/SCREENSHOT');
require('../libraries/WAIT');

module.exports =
{
    // define what should be accessible by other scripts
    asyncForEach, // from ASYNCFOREACH
    checkIfInLineup, // from ROLES
    compareWithExpectedResult, // from JUDGEMENT
    createKodakMoment, // from SCREENSHOT
    determineRunType, // from RUN
    executeRunOrder, // from RUN
    formatTime, // from CLOCK
    getReportFileHeaders, // from REPORT_FILE_HEADERS
    getReportFileName, // from REPORT_FILE_NAMES
    getURL, // from DRIVER
    getXRAYTestIssueKey, // from XRAY_TEST_ISSUE_KEY
    handleRole, // from ROLEVALIDATION
    logHeadersToReportFile, // from LOG
    logThis, // from LOG
    makePage, // from PAGEFACTORY
    printBulkjobRunTime, // from CLOCK
    printTestRunTime, // from CLOCK
    quit, // from DRIVER
    setUpDriver, // from DRIVER
    toObject, // from CREDENTIALS
    wait, // from WAIT
    writeResultsToFile, // from LOG
    AdminCompAllocationsPage, // class
    AdminCompProposalsPage, // class
    AdminCompProposalSummaryPage, // class
    SignonPage // class
};