// these are the URLs that correspond to the different pages

const pagePathMap = new Map();
// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, xls/XLS)
pagePathMap.set("ActiveCases", "/opusWeb/ui/admin/active-cases.shtml");
pagePathMap.set("AdminCompAllocations", "/opusWeb/ui/admin/admin-comp-allocations.shtml");
pagePathMap.set("AdminCompProposals", "/opusWeb/ui/admin/admin-comp-proposals.shtml");
pagePathMap.set("AdminCompProposalSummary", "/opusWeb/ui/admin/admin-comp-proposals-summary.shtml?adminCompId=2249");
pagePathMap.set("AdminCompReport", "/opusWeb/ui/admin/admin-comp-reports.shtml");
pagePathMap.set("ApptsActive", "/opusWeb/ui/admin/roster.shtml");
pagePathMap.set("ApptsInactive", "/opusWeb/ui/admin/inactiveRoster.shtml");
pagePathMap.set("BulkChangeAPU", "/opusWeb/ui/admin/active-cases.shtml");
pagePathMap.set("BulkEndAppt", "/opusWeb/ui/admin/active-cases.shtml");
pagePathMap.set("BulkReappt", "/opusWeb/ui/admin/active-cases.shtml");
pagePathMap.set("BulkRenewal", "/opusWeb/ui/admin/active-cases.shtml");
pagePathMap.set("CamoAPO", "/opusWeb/ui/admin/cases-at-my-office.shtml");
pagePathMap.set("CamoCAP", "/opusWeb/ui/admin/cases-at-my-office.shtml");
pagePathMap.set("CamoDeansOffice", "/opusWeb/ui/admin/cases-at-my-office.shtml");
pagePathMap.set("CamoDepartment", "/opusWeb/ui/admin/cases-at-my-office.shtml");
pagePathMap.set("CamoLibrary", "/opusWeb/ui/admin/cases-at-my-office.shtml");
pagePathMap.set("CaseSummary",
    {
		"aa": "/opusWeb/ui/admin/case-summary.shtml?caseId=77139",
		"apb": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"apo": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"apoStaff": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"areaChair": "/opusWeb/ui/admin/case-summary.shtml?caseId=77139",
		"cap": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"da": "/opusWeb/ui/admin/case-summary.shtml?caseId=88975",
		"dean": "/opusWeb/ui/admin/case-summary.shtml?caseId=63657",
		"deptChair": "/opusWeb/ui/admin/case-summary.shtml?caseId=65012",
		"div": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"divdean": "/opusWeb/ui/admin/case-summary.shtml?caseId=60077",
		"librarySa": "/opusWeb/ui/admin/case-summary.shtml?caseId=77530",
		"oa": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"sa1": "/opusWeb/ui/admin/case-summary.shtml?caseId=78631",
		"senate": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"specChair": "/opusWeb/ui/admin/case-summary.shtml?caseId=77579",
		"specialty": "/opusWeb/ui/admin/case-summary.shtml?caseId=77579",
		"vcap": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474",
		"vcedi": "/opusWeb/ui/admin/case-summary.shtml?caseId=81474"
	}
);
pagePathMap.set("CasesAtMyOffice", "/opusWeb/ui/admin/cases-at-my-office.shtml");
pagePathMap.set("CompletedCases", "/opusWeb/ui/admin/completed-cases.shtml");
pagePathMap.set("Dashboard",
    {
		"aa": "/opusWeb/ui/dashboard/DA-dash.shtml",
		"apb": "/opusWeb/ui/dashboard/CAP-dash.shtml",
		"apo": "/opusWeb/ui/dashboard/apo-dash.shtml",
		"apoStaff": "/opusWeb/ui/dashboard/apo-dash.shtml",
		"areaChair": "/opusWeb/ui/dashboard/Chair-dash.shtml",
		"cap": "/opusWeb/ui/dashboard/CAP-dash.shtml",
		"da": "/opusWeb/ui/dashboard/DA-dash.shtml",
		"dean": "/opusWeb/ui/dashboard/VCAP-deans-dash.shtml",
		"deptChair": "/opusWeb/ui/dashboard/Chair-dash.shtml",
		"div": "/opusWeb/ui/dashboard/SA-dash.shtml",
		"divdean": "/opusWeb/ui/dashboard/VCAP-deans-dash.shtml",
		"librarySa": "/opusWeb/ui/dashboard/SA-dash.shtml",
		"oa": "/opusWeb/ui/dashboard/OA-dash.shtml",
		"sa1": "/opusWeb/ui/dashboard/SA-dash.shtml",
		"senate": "/opusWeb/ui/dashboard/CAP-dash.shtml",
		"specChair": "/opusWeb/ui/dashboard/Chair-dash.shtml",
		"specialty": "/opusWeb/ui/dashboard/DA-dash.shtml",
		"vcap": "/opusWeb/ui/dashboard/VCAP-deans-dash.shtml",
		"vcedi": "/opusWeb/ui/dashboard/CAP-dash.shtml"
	});
// these are for profile page 8YCs, not 8YC summary datatable
pagePathMap.set("EightYearClock", // these are profile page 8YCs, not summary datatable 8YCs
    {
        "aa": "/opusWeb/ui/admin/profile.shtml?id=353",
        "apo": "/opusWeb/ui/admin/profile.shtml?id=240321",
        "apoStaff": "/opusWeb/ui/admin/profile.shtml?id=240321",
        "areaChair": "/opusWeb/ui/admin/profile.shtml?id=353",
        "cap": "/opusWeb/ui/admin/profile.shtml?id=240321",
        "da": "/opusWeb/ui/admin/profile.shtml?id=188853",
        "dean": "/opusWeb/ui/admin/profile.shtml?id=240321",
        "deptChair": "/opusWeb/ui/admin/profile.shtml?id=1799",
        "div": "/opusWeb/ui/admin/profile.shtml?id=38247",
        "divdean": "/opusWeb/ui/admin/profile.shtml?id=34644",
        "librarySa": "/opusWeb/ui/admin/profile.shtml?id=",
        "oa": "/opusWeb/ui/admin/profile.shtml?id=240321",
        "sa1": "/opusWeb/ui/admin/profile.shtml?id=172351",
        "specialty": "/opusWeb/ui/admin/profile.shtml?id=2197",
        "specChair": "/opusWeb/ui/admin/profile.shtml?id=2197",
        "vcap": "/opusWeb/ui/admin/profile.shtml?id=240321",
    });
pagePathMap.set("Eligibility", "/opusWeb/ui/admin/eligibility.shtml");
pagePathMap.set("EndowedChairsActive", "/opusWeb/ui/admin/active-endowed-chairs.shtml");
pagePathMap.set("EndowedChairsDisestablished", "/opusWeb/ui/admin/disestablished-endowed-chairs.shtml");
pagePathMap.set("EndowedChairsModificationRequest", "/opusWeb/ui/admin/modification-request.shtml");
pagePathMap.set("EndowedChairsInactive", "/opusWeb/ui/admin/inactive-endowed-chairs.shtml");
pagePathMap.set("EndowedChairsIncomplete", "/opusWeb/ui/admin/incomplete-endowed-chairs.shtml");
pagePathMap.set("EndowedChairsPending", "/opusWeb/ui/admin/pending-endowed-chairs.shtml");
// these are for profile page ERCs, not ERC summary datatable
pagePathMap.set("ExcellenceReviewClock",
    {
        "aa": "/opusWeb/ui/admin/profile.shtml?id=",
        "apo": "/opusWeb/ui/admin/profile.shtml?id=102445",
        "apoStaff": "/opusWeb/ui/admin/profile.shtml?id=102445",
        "areaChair": "/opusWeb/ui/admin/profile.shtml?id=",
        "cap": "/opusWeb/ui/admin/profile.shtml?id=102445",
        "da": "/opusWeb/ui/admin/profile.shtml?id=188853",
        "dean": "/opusWeb/ui/admin/profile.shtml?id=102445",
        "deptChair": "/opusWeb/ui/admin/profile.shtml?id=1799",
        "div": "/opusWeb/ui/admin/profile.shtml?id=174966",
        "divdean": "/opusWeb/ui/admin/profile.shtml?id=16643",
        "librarySa": "/opusWeb/ui/admin/profile.shtml?id=",
        "oa": "/opusWeb/ui/admin/profile.shtml?id=102445",
        "sa1": "/opusWeb/ui/admin/profile.shtml?id=",
        "specialty": "/opusWeb/ui/admin/profile.shtml?id=115102",
        "specChair": "/opusWeb/ui/admin/profile.shtml?id=115102",
        "vcap": "/opusWeb/ui/admin/profile.shtml?id=102445",
    });
pagePathMap.set("LinkUCPathPosition", "/opusWeb/ui/admin/link-path-position.shtml");
pagePathMap.set("ManagePermissionsUnits", "/opusWeb/ui/admin/permissions-sada-unit.shtml");
pagePathMap.set("ManagePermissionsUsers", "/opusWeb/ui/admin/permissions-users.shtml");
pagePathMap.set("PathCompReport", "/opusWeb/ui/admin/salary-report-UCPath.shtml");
pagePathMap.set("PrimaryAdditionalComparisonMismatches", "/opusWeb/ui/admin/opus-mismatches.shtml");
pagePathMap.set("PrimaryAdditionalComparisonHiddenMismatches", "/opusWeb/ui/admin/opus-hidden-mismatches.shtml");
pagePathMap.set("ProfileSearch", "/opusWeb/ui/admin/profile.shtml");
pagePathMap.set("ProfileAppointmentSet", "/opusWeb/ui/admin/profile.shtml?id=7172");
pagePathMap.set("RequestAUID", "/opusWeb/ui/admin/request-uid.shtml");
pagePathMap.set("SalaryReport", "/opusWeb/ui/admin/salary-report.shtml");
pagePathMap.set("UCPathOpusComparisonHiddenMismatches", "/opusWeb/ui/admin/hidden-mismatches.shtml");
pagePathMap.set("UCPathOpusComparisonMismatches", "/opusWeb/ui/admin/mismatches.shtml");
pagePathMap.set("UIDAdmin", "/opusWeb/ui/opus-admin/uid-admin.shtml");
pagePathMap.set("VerifyCompliance", "/opusWeb/ui/admin/compliance-report.shtml");
pagePathMap.set("WithdrawnCases", "/opusWeb/ui/admin/withdrawn-cases.shtml");

getPagePath = (pageToGetPathFor, role) =>
{
    let pagePath = null;
    
    // handle Dashboard multi-paths based on role
    if(pageToGetPathFor === "Dashboard")
    {
        pagePath = pagePathMap.get(pageToGetPathFor)[role];
    }
    else if(pageToGetPathFor === "CaseSummary")
    {
        pagePath = pagePathMap.get(pageToGetPathFor)[role];
    }
    else if(pageToGetPathFor === "EightYearClock")
    {
        pagePath = pagePathMap.get(pageToGetPathFor)[role];
    }
    else if(pageToGetPathFor === "ExcellenceReviewClock")
    {
        pagePath = pagePathMap.get(pageToGetPathFor)[role];
    }
    else
    {
		// get path from map based on entered page
		pagePath = pagePathMap.get(pageToGetPathFor);
    }
    
    return pagePath;
}

module.exports =
{
    // define what should be accessible by other scripts
    getPagePath
};
