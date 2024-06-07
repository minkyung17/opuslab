// this file has to do with the FILE SYSTEM
const fs = require('fs');
const readline = require('readline');
const { once } = require('events');

// use stored data to know where to download files and rename bulk files
const downloadDirectories = require('../data/DOWNLOAD_DIRECTORIES');

isFileExported = async (loggingPrefix, fileName) =>
{
    /*
    * this method keeps checking until a certain maximum time is met
    * if the file is found, it breaks out and continues instead of running until the max time 
    */
    
    // set maximum number of checks
    var maxChecks = 30;
    var checkNumber = 0; // which check number it's on
    
    do
    {
    	// wait between checks
		await wait(1000);
		
        // increase check number
        checkNumber += 1;
	
		if(fs.existsSync(getDownloadDirectory("XLS") + "/" + fileName))
		{
			logThis(loggingPrefix + "csv file downloaded? : yes (in " + checkNumber + "s)");
		
			return true;
		}
		else // no file found
		{
		    if(checkNumber == maxChecks) // final check without finding
		    {
		        logThis(loggingPrefix + "csv file downloaded? : no -- waving white flag after " + maxChecks + "s");
		        return false;
		    }
		    else // not the final check
		    {
		        process.stdout.write(loggingPrefix + "csv file downloaded? : no (" + checkNumber + "s)");
		        process.stdout.cursorTo(0);
		    }
		}
    } while(checkNumber < maxChecks)
}

getFileRecordTotal = async (loggingPrefix, fileName) =>
{
	const readStream = readline.createInterface({
		input: fs.createReadStream(getDownloadDirectory("XLS") + "/" + fileName),
		output: process.stdout,
		terminal: false
	});
	
	let numberOfRecords = 0;
	let untiedLooseEnd = false; // starts off as false since no records left to complete at first
	let lineNumber = 0;
	
	// FOR DEVELOPER TESTING ONLY
	var developerLogData = "";
	
	var runningTotalQuotationMarks = 0;
	
	readStream
	    .on('line', async(line) =>
	    {
	        
	        // first line was read so increase line count to 1
	        lineNumber += 1;
	        
	        // FOR DEVELOPER TESTING ONLY
	        //"csv line #" + lineNumber;
		    
		    // process any line that isn't the header line (first line) or a "total" line
	        if((line != null) && (lineNumber != 1) && (!line.toLowerCase().startsWith("total")))
	        {
				// get all quotation marks in  the line
				const quotationMarkRegex = /\"/g;
				let quotationMarksArray = line.match(quotationMarkRegex) || []; // match() returns array or null if none
				
				// get total number of q marks in this line and add it to the running total
				runningTotalQuotationMarks += quotationMarksArray.length;
				
				// if the running total of q marks is even, this line completes the record and reset running total
				// otherwise record is continuing and don't increase record count and continue running total
				if((runningTotalQuotationMarks % 2) === 0)
				{
				    // increase record count
				    numberOfRecords += 1;
				    runningTotalQuotationMarks = 0;
				}
			}
		    
		    // ignore first pass (header line) only
		    headerLine = false;
		    
		    // FOR DEVELOPER TESTING ONLY
		    //developerLogData += "running total: " + runningTotalQuotationMarks + " records total: " + numberOfRecords + "\n";
		    
	    }); // end of line in csv file
	    
	await once(readStream, 'close');
	
	// FOR DEVELOPER TESTING ONLY
	// after all data is compiled, log to developer log
	//await logToDeveloperLog(developerLogData);
	    
	return numberOfRecords.toString();
}

renameFile = async (loggingPrefix, oldFileName, newFileName) =>
{
    /*
    * This method is needed since the BulkActions tests all download a file with the same name,
    * which causes incorrect results.  Satish says the bulk test file names, which are set on the
    * backend, can't be individualized.  So the files are being renamed after the being
    * downloaded so each test can check its own file like the rest of the tests.
    */
    
    fs.rename(oldFileName, newFileName, (error) =>
    {
        // handle any potential errors        
        if(error)
        {
            logThis(loggingPrefix + "couldn't rename file" + oldFileName);
        }
        else
        {
            logThis(loggingPrefix + "renamed file " + oldFileName + " to " + newFileName);
        }
    });
}

fileHeaderExists = async (loggingPrefix, fileName, header, downloadDirectory) =>
{
    // set initial return value
    var containsHeader = false;
    
	const readStream = readline.createInterface({
		input: fs.createReadStream(downloadDirectory + "/" + fileName),
		output: process.stdout,
		terminal: false
	});
	
	let untiedLooseEnd = false; // starts off as false since no records left to complete at first
	let lineNumber = 0;
	
	var runningTotalQuotationMarks = 0;
	
	readStream
	    .on('line', async(line) =>
	    {
	        
	        // first line was read so increase line count to 1
	        lineNumber += 1;
		    
		    // process any line that isn't the header line (first line) or a "total" line
	        if((line != null) && (lineNumber != 1) && (!line.toLowerCase().startsWith("total")))
	        {
				// get all quotation marks in  the line
				const quotationMarkRegex = /\"/g;
				let quotationMarksArray = line.match(quotationMarkRegex) || []; // match() returns array or null if none
				
				// get total number of q marks in this line and add it to the running total
				runningTotalQuotationMarks += quotationMarksArray.length;
				
				// if the running total of q marks is even, this line completes the record and reset running total
				// otherwise record is continuing and don't increase record count and continue running total
				if((runningTotalQuotationMarks % 2) === 0)
				{
				    runningTotalQuotationMarks = 0;
				}
			}
			
		   // if candidate header exists (only need to check line 1) set return value
			if(lineNumber === 1)
			{
			    logThis(loggingPrefix + "HEADER LINE: " + line);
			    
			    if(line.includes(header))
			    {
					containsHeader = true;
			    }
			}
	    
	    }); // end of line in csv file	    
	await once(readStream, 'close');
	
	return containsHeader;
}

getCSVAsArrayOfLines = async (fileName, downloadDirectory) =>
{
    // set initial return value
    var arrayOfLines = [];
    
	const readStream = readline.createInterface({
		input: fs.createReadStream(downloadDirectory + "/" + fileName),
		output: process.stdout,
		terminal: false
	});
	
	let untiedLooseEnd = false; // starts off as false since no records left to complete at first
	let lineNumber = 0;
	
	var runningTotalQuotationMarks = 0;
	var runningLine = "";
	
	readStream
	    .on('line', async(line) =>
	    {
	        
	        // first line was read so increase line count to 1
	        lineNumber += 1;
		    
		    // the first csv line is the header line and complete so just push onto array
		    if(lineNumber === 1)
		    {
		        arrayOfLines.push(line);
		    }
		    
		    // process any line that isn't the header line (first line) or a "total" line
	        if((line != null) && (lineNumber != 1) && (!line.toLowerCase().startsWith("total")))
	        {
				// get all quotation marks in  the line
				const quotationMarkRegex = /\"/g;
				let quotationMarksArray = line.match(quotationMarkRegex) || []; // match() returns array or null if none
				
				// get total number of q marks in this line and add it to the running total
				runningTotalQuotationMarks += quotationMarksArray.length;
				
				// if the running total of q marks is even, this line completes the record and reset running total
				// otherwise record is continuing and don't increase record count and continue running total
				if((runningTotalQuotationMarks % 2) === 0)
				{
				    runningTotalQuotationMarks = 0;
				    runningLine += line; // add this line (in the csv file) to create the actual line (full record)
				    arrayOfLines.push(runningLine);
				    
				    // reset running line after adding to array
				    runningLine = "";
				}
				else // the running total is not even, so the line hasn't completed
				{
				    runningLine += line;
				}
			}
	    
	    }); // end of line in csv file	    
	await once(readStream, 'close');
	
	return arrayOfLines;
}

getCSVLineAsArray = async (line) =>
{
    // initialize the final array that will contain values in the CSV line that is passed in as a parameter
    var arrayOfValues = [];
    /*
	// for values that contain delimiter (comma in this case) but are not full values (e.g. ones that contain "")
	var runningValue = "";
	
	// to know whether the simple chunk, after being added to the running value, completes the full element
	var quotationIsOpen = false;
	
    // first separate the line by the delimiter into an array, disregarding edge cases
    let crudeArray = line.split(",");
    
    // process each crude piece
    crudeArray.forEach(CSVChunk =>
        {
			// an array storing the quotation marks in a CSV chunk
			let quotationMarksArray = [];
			
            // get all quotation marks in  the chunk and store them in an array
			const quotationMarkRegex = /\"/g;
			quotationMarksArray = CSVChunk.match(quotationMarkRegex) || []; // match() returns array or null if none
			
			// if there are an even number of quotation marks in the chunk it's a completed value, so add
			// the chunk to the running value, push the running value to the final array, and reset runningValue
			// else it's only part of a value, so add the chunk to the running value
            if(quotationMarksArray.length % 2 === 0)
            {
                // if it has a quotation mark, don't add it immediately, 
                runningValue += CSVChunk;
                arrayOfValues.push(runningValue);
                runningValue = "";
            }
            else // chunk contains odd number of q marks
            {
                // also add the delimiter (comma) back after the chunk since it was assumed to be a
                // delimiter and removed
                //runningValue += CSVChunk + ",";
                
                // flip quotationIsOpen flag from whatever it is               
                if(quotationIsOpen)
                {
                    // since quotation is open, this chunk closes it => toggle to closed
                    quotationIsOpen = false;
                    
                    // since chunk closes, add running value to array of values (also empty running value)
                    arrayOfValues.push(runningValue);
                    runningValue = "";
                }
                else
                {
                    // since quotation is closed before this chunk, this chunk opens it => toggle to open
                    quotationIsOpen = true;
                }
            }
        }
    );
    */
    
    // replace comma delimiter with temp delimiter -- to remove comma confusion
    const regEx = /","/g;
    line = line.replaceAll(regEx, ";");
    
    // remove all q marks -- since extraneous from csv
    line = line.replaceAll("\"", "");
    
    // split into array of elements based on temp delimiter
    arrayOfValues = line.split(";");
    
    return arrayOfValues;
}

// check if export file only has desired name for each record
exportFileContainsOnlyDesiredValue = async (loggingPrefix, driver, desiredFileHeader, desiredValue, fileName) =>
{
	// default result
	var result = false;
	
	// get records from CSV
	const csvAsArrayOfLines = await getCSVAsArrayOfLines(fileName, getDownloadDirectory("DTBL"));
	logThis(loggingPrefix + "CSV has: " + csvAsArrayOfLines.length + " lines");
	
	// get index of desired header so each record's value in that column can be checked
	let headerLine = csvAsArrayOfLines[0]; // first line of csv should be headers
	headerLine = headerLine.trim(); // WITHOUT THIS, THERE WILL BE AN EMPTY STRING AT THE START!!!
	
	// since CSV contains quotation marks, strip so comparison can be made with desired header
	const regex = /\"/g;
	headerLine = headerLine.replaceAll(regex, "");
	logThis(loggingPrefix + "headerline after stripping q marks: " + headerLine);
	logThis(loggingPrefix + "header line includes desired file header [" + desiredFileHeader + "]: " + headerLine.includes(desiredFileHeader));
	
	// convert string line to array to get headers individually
	const headersArray = headerLine.split(",");
	logThis(loggingPrefix + "# of headers: " + headersArray.length);
	
	const desiredHeaderIndex = headersArray.indexOf(desiredFileHeader);
	headersArray[0] = headersArray[0].trim();
	logThis(loggingPrefix + "index of the desired header [" + desiredFileHeader + "] is " + desiredHeaderIndex);
	
	// gateway: if header doesn't exist in the first place, get out
	if(desiredHeaderIndex < 0)
	{
		return false;
	}
	
	// check if each record's [value] field contains desired value (exclude 0 index, which is the header line) 
	for(let index = 1; index < csvAsArrayOfLines.length; index += 1)
	{
	    // get the CSV record 
		const lineOfCSV = await getCSVLineAsArray(csvAsArrayOfLines[index]);
		
		// check first column's value for confirmation correct line is being processed
		logThis(loggingPrefix + "line " + (index + 1) + "/record "+ index + "'s first value: [" + lineOfCSV[0] + "]");
		
		if(!lineOfCSV[desiredHeaderIndex].includes(desiredValue))
		{
			logThis(loggingPrefix + "line " + (index + 1) + "/record "+ index + "'s " + desiredFileHeader + " value: [" + lineOfCSV[desiredHeaderIndex] + "]");
			result = false; // all it takes is 1 mismatch to fail
			logThis(loggingPrefix + "Burned to a crisp by Bowser :(");
			
			return result;
		}
		else
		{
			logThis(loggingPrefix + "line " + (index + 1) + "/record "+ index + "'s " + desiredFileHeader + " field: [" + lineOfCSV[desiredHeaderIndex] + "]");
		}
	}
	
	// if it hasn't returned as false up to this point, return true
	result = true;
	logThis(loggingPrefix + "all records in CSV contain desired value: [" + desiredValue + "]! Princess Toadstool has been saved!!");
	
	return result;
}

module.exports =
{
    // define what should be accessible by other scripts
    exportFileContainsOnlyDesiredValue,
    fileHeaderExists,
    getCSVAsArrayOfLines,
    getCSVLineAsArray,
    getFileRecordTotal,
    isFileExported,
    renameFile
};
