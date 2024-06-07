// in jira xray, these correlate with the names of "keys" of type "test"

const xrayTestIssueKeyMap = new Map();
// ALL KEYS SHOULD BE CONSISTENT WITH PAGE OR FEATURE NAMES (refer to the data folder)
xrayTestIssueKeyMap.set("PathCompReport", "OXT-1");
xrayTestIssueKeyMap.set("AdminCompAllocations", "OXT-2");
xrayTestIssueKeyMap.set("AdminCompProposals", "OXT-3");
xrayTestIssueKeyMap.set("AdminCompReport", "OXT-4");
// OXT-5 through OXT-7 have been deleted
xrayTestIssueKeyMap.set("ActiveCases", "OXT-8");
// OXT-9 through OXT-11 are experimental issues and NA
// OXT-12 through OXT-13 have been deleted
xrayTestIssueKeyMap.set("ApptsActive", "OXT-14");
xrayTestIssueKeyMap.set("ApptsInactive", "OXT-15");
xrayTestIssueKeyMap.set("Eligibility", "OXT-16");
xrayTestIssueKeyMap.set("SalaryReport", "OXT-17");
// OXT-18 through OXT-22 are experimental issues and NA
// OXT-23 is a precondition
xrayTestIssueKeyMap.set("CompletedCases", "OXT-24");
xrayTestIssueKeyMap.set("WithdrawnCases", "OXT-25");
xrayTestIssueKeyMap.set("CasesAtMyOffice", "OXT-26");
xrayTestIssueKeyMap.set("EightYearClock", "OXT-27");
xrayTestIssueKeyMap.set("ExcellenceReviewClock", "OXT-28");
xrayTestIssueKeyMap.set("RequestAUID", "OXT-29");
xrayTestIssueKeyMap.set("UIDAdmin", "OXT-30");
xrayTestIssueKeyMap.set("LinkUCPathPosition", "OXT-31");
xrayTestIssueKeyMap.set("ManagePermissionsUsers", "OXT-32");
xrayTestIssueKeyMap.set("ManagePermissionsUnits", "OXT-33");
xrayTestIssueKeyMap.set("ManagePermissionsUnitsSADA", "OXT-34");
xrayTestIssueKeyMap.set("UCPathOpusComparisonMismatches", "OXT-35");
xrayTestIssueKeyMap.set("UCPathOpusComparisonHiddenMismatches", "OXT-36");
xrayTestIssueKeyMap.set("UCPathOpusComparisonNoUCPathAppointment", "OXT-37");
xrayTestIssueKeyMap.set("UCPathOpusComparisonNoOpusAppointment", "OXT-38");
xrayTestIssueKeyMap.set("PrimaryAdditionalComparisonMismatches", "OXT-39");
xrayTestIssueKeyMap.set("PrimaryAdditionalComparisonHiddenMismatches", "OXT-40");
xrayTestIssueKeyMap.set("OpusAdminDashboard", "OXT-41");
xrayTestIssueKeyMap.set("AAPODashboard", "OXT-42");
xrayTestIssueKeyMap.set("SADashboard", "OXT-43");
xrayTestIssueKeyMap.set("DADashboard", "OXT-44");
xrayTestIssueKeyMap.set("CAPDashboard", "OXT-45");
xrayTestIssueKeyMap.set("VCAPDeansDashboard", "OXT-46");
xrayTestIssueKeyMap.set("ChairsDashboard", "OXT-47");
// OXT-48 is a TEST SET
xrayTestIssueKeyMap.set("EndowedChairsActive", "OXT-49");
xrayTestIssueKeyMap.set("EndowedChairsPending", "OXT-50");
xrayTestIssueKeyMap.set("EndowedChairsModificationRequest", "OXT-51");
xrayTestIssueKeyMap.set("EndowedChairsDisestablished", "OXT-52");
xrayTestIssueKeyMap.set("EndowedChairsInactive", "OXT-53");
xrayTestIssueKeyMap.set("EndowedChairsIncomplete", "OXT-54");
xrayTestIssueKeyMap.set("VerifyCompliance", "OXT-55");

getXRAYTestIssueKey = (xrayTestIssueKeyToGet) =>
{
	const xrayTestIssueKey = xrayTestIssueKeyMap.get(xrayTestIssueKeyToGet);
	
	return xrayTestIssueKey;
}

module.exports =
{
    // define what should be accessible by other scripts
    getXRAYTestIssueKey
};