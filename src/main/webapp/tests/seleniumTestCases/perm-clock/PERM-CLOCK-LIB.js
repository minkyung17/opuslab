/*
 * this library applies to both 8YC and ERC tests
 */
const EightYearClockPage = require('../pages/EIGHT_YEAR_CLOCK_PAGE');
const ProfilePage = require('../pages/PROFILE_PAGE');
const SignonPage = require('../pages/SIGNON_PAGE');

// all PERM-CLOCK tests access this central library only; this central library calls functions from sub-libraries
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
    asyncForEach, // from ASYNCFOREACH
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
    showElapsedTime, // from CLOCK
    wait, // from WAIT
    writeResultsToFile, // from LOG
    EightYearClockPage, // class
    ProfilePage, // class
    SignonPage // class
};
