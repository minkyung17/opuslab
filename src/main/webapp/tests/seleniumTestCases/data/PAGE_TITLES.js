const pageTitleMap = new Map();

// keys should match entered values; values are case-sensitive actual titles of webpages
pageTitleMap.set("SignOn", "Sign-On");
// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, xls/XLS)
pageTitleMap.set("ActiveCases", "Active Cases");
pageTitleMap.set("AdminCompAllocations", "Admin Comp Allocations");
pageTitleMap.set("AdminCompProposals", "Admin Comp Proposals");
pageTitleMap.set("AdminCompProposalSummary", "Admin Comp Proposal Summary");
pageTitleMap.set("AdminCompReport", "Admin Comp Reports");
pageTitleMap.set("ApptsActive", "Appointments");
pageTitleMap.set("ApptsInactive", "Appointments");
pageTitleMap.set("BulkChangeAPU", "Active Cases");
pageTitleMap.set("BulkEndAppt", "Active Cases");
pageTitleMap.set("BulkReappt", "Active Cases");
pageTitleMap.set("BulkRenewal", "Active Cases");
pageTitleMap.set("CamoAPO", "Cases at My Office");
pageTitleMap.set("CamoCAP", "Cases at My Office");
pageTitleMap.set("CamoDeansOffice", "Cases at My Office");
pageTitleMap.set("CamoDepartment", "Cases at My Office");
pageTitleMap.set("CamoLibrary", "Cases at My Office");
pageTitleMap.set("CaseSummary", "Case Summary");
pageTitleMap.set("CasesAtMyOffice", "Cases at My Office");
pageTitleMap.set("CompletedCases", "Completed Cases");
pageTitleMap.set("Dashboard", "Dashboard"); // covers all Dashboards since all Dashboard titles contain the word "Dashboard"
pageTitleMap.set("Eligibility", "Eligibility");
pageTitleMap.set("EightYearClock", "Profile"); // these are profile page 8YCs, not summary datatable 8YCs
pageTitleMap.set("EndowedChairsActive", "Endowed Chairs");
pageTitleMap.set("EndowedChairsPending", "Endowed Chairs");
pageTitleMap.set("EndowedChairsModificationRequest", "Request");
pageTitleMap.set("EndowedChairsDisestablished", "Endowed Chairs");
pageTitleMap.set("EndowedChairsInactive", "Endowed Chairs");
pageTitleMap.set("EndowedChairsIncomplete", "Endowed Chairs");
pageTitleMap.set("ExcellenceReviewClock", "Profile"); // these are profile page ERCs, not summary datatable ERCs
pageTitleMap.set("LinkUCPathPosition", "Link UCPath Position");
pageTitleMap.set("ManagePermissionsUnits", "Permissions");
pageTitleMap.set("ManagePermissionsUsers", "Permissions");
pageTitleMap.set("PathCompReport", "UCPath Compensation Report");
pageTitleMap.set("PrimaryAdditionalComparisonHiddenMismatches", "Hidden Mismatches");
pageTitleMap.set("PrimaryAdditionalComparisonMismatches", "Mismatches");
pageTitleMap.set("ProfileSearch", "Profile");
pageTitleMap.set("ProfileAppointmentSet", "Profile");
pageTitleMap.set("RequestAUID", "UID Request");
pageTitleMap.set("SalaryReport", "Salary Report");
pageTitleMap.set("UCPathOpusComparisonHiddenMismatches", "Hidden Mismatches");
pageTitleMap.set("UCPathOpusComparisonMismatches", "Mismatches");
pageTitleMap.set("UIDAdmin", "UID Administration");
pageTitleMap.set("UIDAdmin", "");
pageTitleMap.set("VerifyCompliance", "Verify Compliance");
pageTitleMap.set("WithdrawnCases", "Withdrawn Cases");

getPageTitle = (pageToGetTitleFor) =>
{
	const pageTitle = pageTitleMap.get(pageToGetTitleFor);
	
	return pageTitle;
}

module.exports =
{
    // define what should be accessible by other scripts
    getPageTitle
};