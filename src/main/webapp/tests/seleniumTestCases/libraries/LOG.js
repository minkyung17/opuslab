const fs = require('fs');
const reportFileNames = require("../data/REPORT_FILE_NAMES");

// set up xray json file skeleton
var xrayJSONSkeleton =
    "{" + "\n" +
	"    " + "\"tests\":" + "\n" +
	"    " + "[" + "\n" +
	"    " + "    " + xrayJSONTestResults + "\n" +
	"    " + "]" + "\n" +
	"{";

// array that will be inserted into xrayJSONSkeleton once all the test results in a given run are completed
// each element will reflect the results from a single test
var xrayJSONTestResults = [];

logThis = async (output) =>
{
    console.log(output);
}

logHeadersToReportFile = (fileName, data) =>
{
    // open+create file, but (x flag) fails if file exists
    fs.open(fileName, "wx", (err, fileContent) =>
        {
            // quit if error opening
            if(err)
            {
                logThis("error opening report file to write headers, file and headers may already exist");
                return;
            }
            
            // format headers
            const formattedHeaders = data.join(",") + "\n";
            
			// error reading was probably since no results have been logged yet so try to write to it
			fs.writeFile(fileName, formattedHeaders, (err) =>
			{
				if (err)
				{
					logThis("error writing headers to log file: " + err);
					return;
				}
				else
				{
					logThis("file headers: " + formattedHeaders + " written to: " + fileName);
				}
			});
        }
    );
}

getReportFileName = (caller, module) =>
{
    /* 
    ** this function gets the report file name based on the caller
    */
        
    var reportFileName = null;

    // handle case when caller didn't match any known
    if((caller !== "CLI") && (caller !== "OTTO"))
    {
        // default to CLI
        caller = "CLI";
    }
    
    // get the report file name based on the caller
    if(caller === "CLI")
    {
		switch(module)
		{
		    case "DTBL":
		        reportFileName = reportFileNames.getReportFileName("DTBL_CLI");
		        break;
		    case "PERM":
		        reportFileName = reportFileNames.getReportFileName("PERM_CLI");
		        break;
		    case "PERM-AC":
		        reportFileName = reportFileNames.getReportFileName("PERM-AC_CLI");
		        break;
		    case "PERM-CLOCK":
		        reportFileName = reportFileNames.getReportFileName("PERM-CLOCK_CLI");
		        break;
		    case "PERM-CS":
		        reportFileName = reportFileNames.getReportFileName("PERM-CS_CLI");
		        break;
		    case "PROFILE":
		        reportFileName = reportFileNames.getReportFileName("PROFILE_CLI");
		        break;
		    case "XLS":
		        reportFileName = reportFileNames.getReportFileName("XLS_CLI");
		        break;
		    default:
		        logThis("caller was CLI, but module doesn't match any known modules");
		}
    }
    else if(caller === "OTTO")
    {
		switch(module)
		{
		    case "DTBL":
		        reportFileName = reportFileNames.getReportFileName("DTBL_OTTO");
		        break;
		    case "PERM":
		        reportFileName = reportFileNames.getReportFileName("PERM_OTTO");
		        break;
		    case "PERM-AC":
		        reportFileName = reportFileNames.getReportFileName("PERM-AC_OTTO");
		        break;
		    case "PERM-CLOCK":
		        reportFileName = reportFileNames.getReportFileName("PERM-CLOCK_OTTO");
		        break;
		    case "PERM-CS":
		        reportFileName = reportFileNames.getReportFileName("PERM-CS_OTTO");
		        break;
		    case "PROFILE":
		        reportFileName = reportFileNames.getReportFileName("PROFILE_OTTO");
		        break;
		    case "XLS":
		        reportFileName = reportFileNames.getReportFileName("XLS_OTTO");
		        break;
		    default:
		        logThis("caller was CLI, but module doesn't match any known modules");
		}
    }
    
    return reportFileName === null ? logThis("undefined report file name") : reportFileName;
}

writeResultsToFile = (caller, fileName, data) =>
{
    /*
     *  this method is a middleman called by each module's -TEST file(s)
     *  and will decide the appropriate report file to write results
    */
    
    logThis("file to be written: " + fileName);
    
	// initialize results
	var dataForReportFile = "";
	
	if(caller === "CLI") // HUMAN-READABLE FILE (CSV)
	{
		// set options for date/time -- to be prepended to other data
		var options = {
		  year: 'numeric', month: 'numeric', day: 'numeric',
		  hour: 'numeric', minute: 'numeric', second: 'numeric',
		  hour12: false,
		  timeZone: 'America/Los_Angeles'
		};
		
		// format date (for CLI, 0 element of data from test is testEndTime; report file will use testEndTime as time of test)
		const formattedDate = new Intl.DateTimeFormat('en-US', options).format(data[0]);
		
		// after formatting date, replace it in the data array so the formatted date can be entered into the report file
		data[0] = formattedDate;
		
		// set data to be logged
		dataForReportFile = data.join(",") + "\n";
        logThis("data to be written: " + data);
        
        
		///////////////////////////////////////////////////
		// APPEND TO RESULTS FILE
		///////////////////////////////////////////////////
		
		// do the actual writing to the results file, according to whoever the caller was (i.e. whichever type of results file is desired)
		appendToFile(fileName, dataForReportFile);
	}
	else if(caller === "OTTO") // XRAY COMPATIBLE FILE (JSON)
	{
	    // for xray json file, "data" parameter will be passed in by test as [testKey, startTime (type is date), endTime (type is date), comment, status]
	    let testKey = data[0];
	    let startTime = convertToXRAYJSONFormat(data[1]);
	    let endTime = convertToXRAYJSONFormat(data[2]);
	    let comment = data[3];
	    let status = data[4];
	    
	    // put data from test results in xray json format; data will be added to array until test run is complete; array will be written to xray json report file
	    dataForReportFile = prepareDataForJSONFile(testKey, startTime, endTime, comment, status);
	    
	    // add data for individual test to array
	    xrayJSONSkeleton.push(dataForReportFile);
	    
	    
	    /* XRAY JSON DELETE PROCESS -- CURRENTLY ON HOLD
	    
		// open file, but (x flag) fails if file exists
		fs.open(fileName, "wx", (err, fileContent) =>
			{
				// error means report file (path) doesn't exist, so just write results to it
				if(err)
				{
					logThis("error opening report file: assumed not to exist. preparing data for report file...");
		            dataForReportFile = prepareDataForJSONFile(testKey, startTime, endTime, comment, status);
					return;
				}
				
				
				
				
				// since report file can be opened, results are assumed to exist (i.e. part of currently run mini-batch or full batch)
				
				// initialize existing contents of the current report file
				let existingReportFileContents = "";
				
				// first store the contents of the existing report file so the end can be modified and the new test results can be added
				fs.readFile(fileName, (err, data) =>
					{
						if (err)
						{
						    logThis("xray report file exists but couldn't read contents");
						}
						
						// store the contents of the current report file
						existingReportFileContents = data;						
					}
				);
				
				// "delete" end so new test can be added
				existingReportFileContents = existingReportFileContents.replace("", "");
				
				
			}
		);
		*/
	}
}

prepareDataForJSONFile = (testKey, startTime, endTime, comment, status) =>
{
    /*
     * this function returns the results from a single test in xray json format
    **/
    
    let xrayJSON =
	"{" + "\n" +
	"    " + "\"testKey\": \"" + testKey   + "\"," + "\n" +
	"    " + "\"start\"  : \"" + startTime + "\"," + "\n" +
	"    " + "\"finish\" : \"" + endTime   + "\"," + "\n" +
	"    " + "\"comment\"  : \"" + comment   + "\"," + "\n" +
	"    " + "\"status\"   : \"" + status    + "\""  + "\n" + // this is passed/FAILED
	"}" + "\n";
	
	return xrayJSON;
}

appendToFile = (fileName, data) =>
{
    /*
     *  this function interfaces directly with the report file
    **/
    
    // this is the generic append call that interfaces directly with the file
    fs.appendFile(fileName, data, err =>
        {
            if(err)
            {
                logThis("error writing headers to log file: " + err);
                return;
            }
            else
            {
                logThis("file " + fileName + " written with: " + data);
                return;
            }
        }
    );
}

module.exports =
{
    // define what should be accessible by other scripts
    appendToFile,
    logThis,
    logHeadersToReportFile,
    getReportFileName,
    writeResultsToFile,
    xrayJSONTestResults
};
