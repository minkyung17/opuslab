// these are the names of each module's report files

const downloadDirectories = require("./DOWNLOAD_DIRECTORIES");

///////////////////////////////////////////////////
// MAP FOR ACCESSING REPORT FILE NAMES
///////////////////////////////////////////////////

// get base directory for report files
const baseDir = downloadDirectories.getDownloadDirectory("REPORT_BASE");

const reportFileNameMap = new Map();

// the values should include file extensions
// for reports generated from CLI commands
reportFileNameMap.set("DTBL_CLI", baseDir + "DTBL_report.csv");
reportFileNameMap.set("PERM_CLI", baseDir + "PERM_report.csv");
reportFileNameMap.set("PERM-AC_CLI", baseDir + "PERM-AC_report.csv");
reportFileNameMap.set("PERM-CLOCK_CLI", baseDir + "PERM-CLOCK_report.csv");
reportFileNameMap.set("PERM-CS_CLI", baseDir + "PERM-CS_report.csv");
reportFileNameMap.set("PROFILE_CLI", baseDir + "PROFILE_report.csv");
reportFileNameMap.set("XLS_CLI", baseDir + "XLS_report.csv");

// for reports generated from scheduler
reportFileNameMap.set("DTBL_OTTO", baseDir + "DTBL_report.json");
reportFileNameMap.set("PERM_OTTO", baseDir + "PERM_report.json");
reportFileNameMap.set("PERM-AC_OTTO", baseDir + "PERM-AC_report.json");
reportFileNameMap.set("PERM-CLOCK_OTTO", baseDir + "PERM-CLOCK_report.json");
reportFileNameMap.set("PERM-CS_OTTO", baseDir + "PERM-CS_report.json");
reportFileNameMap.set("PROFILE_OTTO", baseDir + "PROFILE_report.json");
reportFileNameMap.set("XLS_OTTO", baseDir + "XLS_report.json");

getReportFileName = (moduleToGetFor) =>
{
	const reportFileName = reportFileNameMap.get(moduleToGetFor);
	
	return reportFileName;
}

module.exports =
{
    // define what should be accessible by other scripts
    getReportFileName
};