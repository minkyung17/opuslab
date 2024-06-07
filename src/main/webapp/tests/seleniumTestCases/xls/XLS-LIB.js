// all files access this central library only; this central library picks up functions from sub-libraries

// custom sub-libraries (non-core node.js files)
require('../data/BULK_FILE_NAMES');
require('../data/REPORT_FILE_HEADERS');
require('../data/REPORT_FILE_NAMES');
require('../data/XRAY_TEST_ISSUE_KEY');

const SignonPage = require('../pages/SIGNON_PAGE');

require('../libraries/ACCESS');
require('../libraries/ASYNCFOREACH');
require('../libraries/CLOCK');
require('../libraries/DOWNLOADS');
require('../libraries/DRIVER');
require('../libraries/JUDGEMENT');
require('../libraries/LOG');
require('../libraries/PAGEFACTORY');
require('../libraries/ROLES');
require('../libraries/RUN');
require('../libraries/SCREENSHOT');
require('../libraries/WAIT');

module.exports =
{
    // define what should be accessible by other scripts
    asyncForEach, // from ASYNCFOREACH
    checkForErrorPage, // from ACCESS
    checkIfInLineup, // from ROLES
    compareWithExpectedResult, // from JUDGEMENT
    createKodakMoment, // from SCREENSHOT
    determineRunType, // from RUN
    executeRunOrder, // from RUN
    formatTime, // from CLOCK
    getBulkFileName, // from BULK_FILE_NAMES
    getFileRecordTotal, // from DOWNLOADS
    getReportFileHeaders, // from REPORT_FILE_HEADERS
    getReportFileName, // from REPORT_FILE_NAMES
    getURL, // from DRIVER
    getXRAYTestIssueKey, // from XRAY_TEST_ISSUE_KEY
    isFileExported, // from DOWNLOADS
    logHeadersToReportFile, // from LOG
    logThis, // from LOG
    makePage, // from PAGEFACTORY
    printBulkjobRunTime, // from CLOCK
    printTestRunTime, // from CLOCK
    quit, // from DRIVER
    renameFile, // from DOWNLOADS
    setUpDriver, // from DRIVER
    toObject, // from ROLES
    wait, // from WAIT
    writeResultsToFile, // from LOG
    SignonPage // class
};
