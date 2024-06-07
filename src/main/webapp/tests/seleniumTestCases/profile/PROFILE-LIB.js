const ProfilePage = require('../pages/PROFILE_PAGE');
const SignonPage = require('../pages/SIGNON_PAGE');

require('../data/REPORT_FILE_HEADERS');
require('../data/REPORT_FILE_NAMES');
require('../data/XRAY_TEST_ISSUE_KEY');

require('../libraries/ASYNCFOREACH');
require('../libraries/CLOCK');
require('../libraries/DRIVER');
require('../libraries/LOG');
require('../libraries/PAGEFACTORY');
require('../libraries/RUN');
require('../libraries/ROLES');
require('../libraries/SCREENSHOT');
require('../libraries/WAIT');

module.exports =
{
    // define what should be accessible by other scripts
    asyncForEach, // from ASYNCFOREACH
    checkIfInLineup, // from ROLES
    countUp, // from CLOCK
    createKodakMoment, // from SCREENSHOT
    executeRunOrder, // from RUN
    formatTime, // from CLOCK
    getReportFileHeaders, // from REPORT_FILE_HEADERS
    getReportFileName, // from REPORT_FILE_NAMES
    getURL, // from DRIVER
    getXRAYTestIssueKey, // from XRAY_TEST_ISSUE_KEY
    logHeadersToReportFile, // from LOG
    logThis, // from LOG
    makePage, // from PAGEFACTORY
    printBulkjobRunTime, // from CLOCK
    printTestRunTime, // from CLOCK
    quit, // from DRIVER
    setUpDriver, // from DRIVER
    toObject, // from ROLES
    wait, // from WAIT
    writeResultsToFile, // from LOG
    ProfilePage, // class
    SignonPage // class
};
