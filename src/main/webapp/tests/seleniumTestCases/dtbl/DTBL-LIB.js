const ApptsActivePage = require('../pages/ACTIVE_APPOINTMENTS_PAGE');
const CamoPage = require('../pages/CAMO_PAGE');
const SignonPage = require('../pages/SIGNON_PAGE');

require('../data/REPORT_FILE_HEADERS');
require('../data/REPORT_FILE_NAMES');
require('../data/XRAY_TEST_ISSUE_KEY');

require('../libraries/ASYNCFOREACH');
require('../libraries/CLOCK');
require('../libraries/DOWNLOADS');
require('../libraries/DRIVER');
require('../libraries/LOG');
require('../libraries/PAGEFACTORY');
require('../libraries/RUN');
require('../libraries/ROLES');
require('../libraries/SCREENSHOT');
require('../libraries/TEXT');
require('../libraries/WAIT');

module.exports =
{
    // define what should be accessible by other scripts
    asyncForEach, // from ASYNCFOREACH
    checkIfInLineup, // from ROLES
    countUp, // from CLOCK
    createKodakMoment, // from SCREENSHOT
    executeRunOrder, // from RUN
    exportFileContainsOnlyDesiredValue, // from DOWNLOADS
    fileHeaderExists, // from DOWNLOADS
    formatTime, // from CLOCK
    getCSVAsArrayOfLines, // from DOWNLOADS
    getCSVLineAsArray, // from DOWNLOADS
    getFileRecordTotal, // from DOWNLOADS
    getReportFileHeaders, // from REPORT_FILE_HEADERS
    getReportFileName, // from REPORT_FILE_NAMES
    getXRAYTestIssueKey, // from XRAY_TEST_ISSUE_KEY
    getURL, // from DRIVER
    isAToZ, // from TEXT
    isFileExported, // from DOWNLOADS
    isZToA, // from TEXT
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
    ApptsActivePage, // class
    CamoPage, // class
    SignonPage // class
};
