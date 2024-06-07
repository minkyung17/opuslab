// these are the headers for each module's report files

///////////////////////////////////////////////////
// REPORT FILE HEADERS FOR EACH MODULE
///////////////////////////////////////////////////

const reportFileHeadersDTBL =
[
    "Date",
    "Time",
    "Environment",
    "Feature",
    "Role",
    "Pass/Fail",
    "Columns Needing Review"
];

const reportFileHeadersPERM =
[
    "Date",
	"Time",
	"Environment",
	"Page/Feature",
	"Role",
	"Result",
	"Pass/Fail"
];

// this is shared by ACA, ACP, and ACP_EDIT
const reportFileHeadersPERM_AC =
[
	"Date",
	"Time",
	"Environment",
	"Page",
	"Feature",
	"Role",
	"Result",
	"Pass/Fail"
];

// this is shared by 8YC and ERC
const reportFileHeadersPERM_CLOCK =
[
	"Date",
	"Time",
	"Environment",
	"Page",
	"Role",
	"Result",
	"Pass/Fail"
]

const reportFileHeadersPERM_CS =
[
	"Date",
	"Time",
	"Environment",
	"Page",
	"Role",
	"Result",
	"Pass/Fail"
]

const reportFileHeadersPROFILE =
[
	"Date",
	"Time",
	"Environment",
	"Page",
	"Result",
	"Role",
	"Opus ID",
	"Appt. ID",
	"Appointment Status",
	"Department Code",
	"Department",
	"School",
	"Area",
	"Location1",
	"Location2",
	"Appointment Affiliation",
	"Title Code",
	"Series",
	"Rank",
	"Years at Current Rank",
	"Step",
	"Years at Current Step",
	"Percent Time",
	"Payroll Salary",
	"Salary at Last Advancement",
	"Salary Scale Effective Date",
	"APU ID",
	"HSCP Scale (0-9)",
	"HSCP Scale 0(X)",
	"HSCP Base Salary (X + X')",
	"HSCP Add'l Base Increment (X')",
	"Date of Last Advancement",
	"Start Date at Series",
	"Start Date at Rank",
	"Start Date at Step",
	"Appt. End Date",
	"Path Position #",
	"Comments Icon Number",
	"Comments Text",
	"Save Modal"
]

const reportFileHeadersXLS =
[
	"Date",
	"Time",
	"Environment",
	"Page",
	"Role",
	"Row Count - Webpage",
	"Row Count - File",
	"File Did Download",
	"Pass/Fail"
];


///////////////////////////////////////////////////
// MAP FOR ACCESSING REPORT FILE HEADERS
///////////////////////////////////////////////////

const reportFileHeadersMap = new Map();

reportFileHeadersMap.set("DTBL", reportFileHeadersDTBL);
reportFileHeadersMap.set("PERM", reportFileHeadersPERM);
reportFileHeadersMap.set("PERM-AC", reportFileHeadersPERM_AC);
reportFileHeadersMap.set("PERM-CLOCK", reportFileHeadersPERM_CLOCK);
reportFileHeadersMap.set("PERM-CS", reportFileHeadersPERM_CS);
reportFileHeadersMap.set("PROFILE", reportFileHeadersPROFILE);
reportFileHeadersMap.set("XLS", reportFileHeadersXLS);


getReportFileHeaders = (moduleToGetFor) =>
{
	const reportFileHeaders = reportFileHeadersMap.get(moduleToGetFor);
	
	return reportFileHeaders;
}

module.exports =
{
    // define what should be accessible by other scripts
    getReportFileHeaders
};