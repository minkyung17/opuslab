// this is for the XLS/export tests
// these are the names of the files that are downloaded (minus extension)
const exportFileNames = new Map();

// these keys and values are mostly the same, but they may differ at times
// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, xls/XLS)
exportFileNames.set("ActiveCases", "ActiveCases");
exportFileNames.set("CompletedCases", "CompletedCases");
exportFileNames.set("WithdrawnCases", "WithdrawnCases");
exportFileNames.set("CamoAPO", "APO Queue");
exportFileNames.set("CamoCAP", "CAP Queue");
exportFileNames.set("CamoDeansOffice", "Dean's Office Queue");
exportFileNames.set("CamoDepartment", "Department Queue");
exportFileNames.set("CamoLibrary", "Library Queue");
exportFileNames.set("BulkChangeAPU", "BulkActions");
exportFileNames.set("BulkEndAppt", "BulkActions");
exportFileNames.set("BulkReappt", "BulkActions");
exportFileNames.set("BulkRenewal", "BulkActions");
exportFileNames.set("Eligibility", "Eligibility");
exportFileNames.set("EndowedChairsActive", "ActiveEndowedChairs");
exportFileNames.set("EndowedChairsPending", "PendingEndowedChairs");
exportFileNames.set("EndowedChairsModificationRequest", "ModificationRequest");
exportFileNames.set("EndowedChairsDisestablished", "Disestablished");
exportFileNames.set("EndowedChairsInactive", "InactiveEndowedChairs");
exportFileNames.set("EndowedChairsIncomplete", "IncompleteEndowedChairs");
exportFileNames.set("ApptsActive", "ActiveAppointments");
exportFileNames.set("ApptsInactive", "ApptsInactive");
exportFileNames.set("EightYearClock", "EightYearClocks");
exportFileNames.set("ExcellenceReviewClock", "ExcellenceReviewClocks");
exportFileNames.set("SalaryReport", "SalaryReport");
exportFileNames.set("PathCompReport", "PathCompReport");
exportFileNames.set("AdminCompAllocations", "AdminCompAllocations");
exportFileNames.set("AdminCompProposals", "AdminCompProposals");
exportFileNames.set("AdminCompReport", "AdminCompReport");
exportFileNames.set("VerifyCompliance", "VerifyCompliance");

// use this to retrieve this data
getExportFileName = (pageToGetFor) =>
{
	const fileName = exportFileNames.get(pageToGetFor);
	
	return fileName;
}

module.exports =
{
    // define what should be accessible by other scripts
    getExportFileName
};