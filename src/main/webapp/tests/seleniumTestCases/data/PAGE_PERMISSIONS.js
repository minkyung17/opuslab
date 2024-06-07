// these state which roles should have "access" to which pages and features

const expectedResultsActiveCases =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const expectedResultsAdminCompAllocations =
{
	aa:"denied",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"denied",
	dean:"access",
	deptChair:"denied",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"denied",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsAdminCompProposals =
{
	aa:"denied",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"access",
	dean:"access",
	deptChair:"denied",
	div:"denied",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"denied",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsAdminCompReport =
{
	aa:"denied",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"denied",
	dean:"access",
	deptChair:"denied",
	div:"denied",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"denied",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsApptsActive =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const expectedResultsApptsInactive =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const expectedResultsCasesAtMyOffice =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"denied",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsCompletedCases =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const expectedResultsDashboard =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const expectedResultsEightYearClock =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"denied",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsEligibility =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

// permissions should be the same for EC: Active, Pending, Modification Request, Disestablished, Inactive
const expectedResultsEndowedChairs =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"denied",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsExcellenceReviewClock =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"denied",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsLinkUCPathPosition =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsManagePermissionsUnits =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsManagePermissionsUsers =
{
	aa:"denied",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"denied",
	divdean:"denied",
	librarySa:"denied",
	oa:"access",
	sa1:"denied",
	sa2:"denied",
	senate:"denied",
	specChair:"denied",
	specialty:"denied",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsPathCompReport =
{
	aa:"denied",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"denied",
	chair:"access",
	da:"denied",
	dean:"access",
	deptChair:"access",
	div:"denied",
	divdean:"access",
	librarySa:"denied",
	oa:"access",
	sa1:"denied",
	sa2:"denied",
	senate:"denied",
	specChair:"access",
	specialty:"denied",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsPrimaryAdditionalComparisonHiddenMismatches =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsPrimaryAdditionalComparisonMismatches =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsProfileSearch =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const expectedResultsRequestAUID =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsSalaryReport =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"denied",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsUCPathOpusComparisonHiddenMismatches =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsUCPathOpusComparisonMismatches =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"denied",
	cap:"denied",
	da:"access",
	dean:"denied",
	deptChair:"denied",
	div:"access",
	divdean:"denied",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	senate:"denied",
	specChair:"denied",
	specialty:"access",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsUIDAdmin =
{
	aa:"denied",
	apb:"denied",
	apo:"denied",
	apoStaff:"denied",
	areaChair:"denied",
	cap:"denied",
	chair:"denied",
	da:"denied",
	dean:"denied",
	deptChair:"denied",
	div:"denied",
	divdean:"denied",
	librarySa:"denied",
	oa:"access",
	sa1:"denied",
	sa2:"denied",
	senate:"denied",
	specChair:"denied",
	specialty:"denied",
	vcedi:"denied",
	vcap:"denied"
};

const expectedResultsVerifyCompliance =
{
	aa:"access",
	apb:"denied",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"denied",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	senate:"denied",
	specChair:"access",
	specialty:"access",
	vcedi:"denied",
	vcap:"access"
};

const expectedResultsWithdrawnCases =
{
	aa:"access",
	apb:"access",
	apo:"access",
	apoStaff:"access",
	areaChair:"access",
	cap:"access",
	chair:"access",
	da:"access",
	dean:"access",
	deptChair:"access",
	div:"access",
	divdean:"access",
	librarySa:"access",
	oa:"access",
	sa1:"access",
	sa2:"access",
	senate:"access",
	specChair:"access",
	specialty:"access",
	vcedi:"access",
	vcap:"access"
};

const pagePermissionsMap = new Map();
// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, xls/XLS)
// CASES
pagePermissionsMap.set("ActiveCases", expectedResultsActiveCases);
pagePermissionsMap.set("CompletedCases", expectedResultsCompletedCases);
pagePermissionsMap.set("WithdrawnCases", expectedResultsWithdrawnCases);
pagePermissionsMap.set("CasesAtMyOffice", expectedResultsCasesAtMyOffice);
// ADMIN COMP
pagePermissionsMap.set("AdminCompAllocations", expectedResultsAdminCompAllocations);
pagePermissionsMap.set("AdminCompProposals", expectedResultsAdminCompProposals);
pagePermissionsMap.set("AdminCompReport", expectedResultsAdminCompReport);
// APPOINTMENTS
pagePermissionsMap.set("ApptsActive", expectedResultsApptsActive);
pagePermissionsMap.set("ApptsInactive", expectedResultsApptsInactive);
// DASHBOARD
pagePermissionsMap.set("Dashboard", expectedResultsDashboard);
// CLOCKS
pagePermissionsMap.set("EightYearClock", expectedResultsEightYearClock);
pagePermissionsMap.set("ExcellenceReviewClock", expectedResultsExcellenceReviewClock);
// ELIGIBILITY
pagePermissionsMap.set("Eligibility", expectedResultsEligibility);
// ENDOWED CHAIRS
pagePermissionsMap.set("EndowedChairsActive", expectedResultsEndowedChairs);
pagePermissionsMap.set("EndowedChairsPending", expectedResultsEndowedChairs);
pagePermissionsMap.set("EndowedChairsModificationRequest", expectedResultsEndowedChairs);
pagePermissionsMap.set("EndowedChairsDisestablished", expectedResultsEndowedChairs);
pagePermissionsMap.set("EndowedChairsInactive", expectedResultsEndowedChairs);
pagePermissionsMap.set("EndowedChairsIncomplete", expectedResultsEndowedChairs);
// REQUEST A UID
pagePermissionsMap.set("RequestAUID", expectedResultsRequestAUID);
// SALARY REPORTS
pagePermissionsMap.set("SalaryReport", expectedResultsSalaryReport);
pagePermissionsMap.set("PathCompReport", expectedResultsPathCompReport);
// LINK PATH POSITION
pagePermissionsMap.set("LinkUCPathPosition", expectedResultsLinkUCPathPosition);
// MANAGE PERMISSIONS
pagePermissionsMap.set("ManagePermissionsUsers", expectedResultsManagePermissionsUsers);
pagePermissionsMap.set("ManagePermissionsUnits", expectedResultsManagePermissionsUnits);
// PROFILE SEARCH
pagePermissionsMap.set("ProfileSearch", expectedResultsProfileSearch);
// UC PATH COMPARISON
pagePermissionsMap.set("UCPathOpusComparisonMismatches", expectedResultsUCPathOpusComparisonMismatches);
pagePermissionsMap.set("UCPathOpusComparisonHiddenMismatches", expectedResultsUCPathOpusComparisonHiddenMismatches);
pagePermissionsMap.set("PrimaryAdditionalComparisonMismatches", expectedResultsPrimaryAdditionalComparisonMismatches);
pagePermissionsMap.set("PrimaryAdditionalComparisonHiddenMismatches", expectedResultsPrimaryAdditionalComparisonHiddenMismatches);
// UID ADMIN
pagePermissionsMap.set("UIDAdmin", expectedResultsUIDAdmin);
//VERIFY COMPLIANCE
pagePermissionsMap.set("VerifyCompliance", expectedResultsVerifyCompliance);

getPageOrFeaturePermission = (pageOrFeatureToGetPermissionFor) =>
{
    // get path from map based on entered page
    const pagePermission = pagePermissionsMap.get(pageOrFeatureToGetPermissionFor);
    
    return pagePermission;
}

module.exports =
{
    // define what should be "access"ible by other scripts
    getPageOrFeaturePermission
};
