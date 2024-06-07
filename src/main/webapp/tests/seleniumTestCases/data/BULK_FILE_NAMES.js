// these file names are for the XLS/export Bulk tests on the Active Cases -- Start Multiple Cases modal
// since the downloaded files for bulk tests all have the same name, they need to be renamed after being checked so the following bulk test won't check the file downloaded by the previous bulk test

const bulkFileNameMap = new Map();

bulkFileNameMap.set("BULK_CHANGE_APU", "BulkActions - ChangeApu.csv");
bulkFileNameMap.set("BULK_END_APPT", "BulkActions - EndAppt.csv");
bulkFileNameMap.set("BULK_REAPPT", "BulkActions - Reappt.csv");
bulkFileNameMap.set("BULK_RENEWAL", "BulkActions - Renewal.csv");

getBulkFileName = (bulkFileNameToGetFor) =>
{
	const bulkFileName = bulkFileNameMap.get(bulkFileNameToGetFor);
	
	return bulkFileName;
}

module.exports =
{
    // define what should be accessible by other scripts
    getBulkFileName
};