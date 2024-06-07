// all files access this central library only; this central library picks up functions from sub-libraries
const CaseSummaryPage = require('../pages/CASE_SUMMARY_PAGE');
const SignonPage = require('../pages/SIGNON_PAGE');

require('../data/REPORT_FILE_HEADERS');
require('../data/REPORT_FILE_NAMES');
require('../data/XRAY_TEST_ISSUE_KEY');

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
    asyncForEach, // fro ASYNCFOREACH
    checkIfInLineup, // from ROLES
    compareWithExpectedResult, // from JUDGEMENT
    countUp, // from CLOCK
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
    runAllTests, // from RUN
    setUpDriver, // from DRIVER
    toLiteralRole, // from CREDENTIALS
    toObject, // from CREDENTIALS
    wait, // from WAIT
    writeResultsToFile, // from LOG
    CaseSummaryPage, // class
    SignonPage // class
};
