// this is the master file for setting where files should be downloaded (includes result reports, export files, error screenshots, etc)
// *IMPORTANT: these paths must be changed to be specific to the machine the tests are running on

// map can be expanded if more tests require downloads
const downloadDirectoryMap = new Map();

downloadDirectoryMap.set("DEFAULT", "/Users/minkyung/Desktop/Opus/academic-opus-web/src/main/webapp/tests/seleniumTestCases/reports"); // if not set otherwise
downloadDirectoryMap.set("DTBL", "/Users/minkyung/Desktop/Opus/academic-opus-web/src/main/webapp/tests/seleniumTestCases/reports"); // DTBL tests specifically
downloadDirectoryMap.set("REPORT_BASE", "/Users/minkyung/Desktop/Opus/academic-opus-web/src/main/webapp/tests/seleniumTestCases/reports/"); // test result reports
downloadDirectoryMap.set("SCREEN", "/Users/minkyung/Desktop/Opus/academic-opus-web/src/main/webapp/tests/seleniumTestCases/reports/"); // screenshots
downloadDirectoryMap.set("XLS", "/Users/minkyung/Desktop/Opus/academic-opus-web/src/main/webapp/tests/seleniumTestCases/reports"); // XLS tests specifically

getDownloadDirectory = (downloadDirectoryToGetFor) =>
{
	const downloadDirectory = downloadDirectoryMap.get(downloadDirectoryToGetFor);
	
	return downloadDirectory;
}

module.exports =
{
    // define what should be accessible by other scripts
    getDownloadDirectory
};