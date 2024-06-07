const credentialsMap = new Map();

credentialsMap.set("aa", {logon: "opusda2", pass: "229da979"});
credentialsMap.set("apb", {logon: "opusapb", pass: "38wilshire"});
credentialsMap.set("apo", {logon: "opusapo", pass: "38wilshire"});
credentialsMap.set("apoStaff", {logon: "opusapostaff", pass: "38wilshire"});
credentialsMap.set("areaChair", {logon: "opusdent", pass: "38wilshire"});
credentialsMap.set("cap", {logon: "opusaa", pass: "prof7941"});
credentialsMap.set("chair", {logon: "opusda3", pass: "229da979"});
credentialsMap.set("da", {logon: "opusda1", pass: "229da979"});
credentialsMap.set("dean", {logon: "opusdean", pass: "38wilshire"});
credentialsMap.set("deptChair", {logon: "opusagsm", pass: "38wilshire"});
credentialsMap.set("div", {logon: "opussa2", pass: "38wilshire"});
credentialsMap.set("divdean", {logon: "opusdivdean", pass: "38wilshire"});
credentialsMap.set("librarySa", {logon: "opuslibrarysa", pass: "38wilshire"});
credentialsMap.set("oa", {logon: "opusadmin", pass: "nq9gptst"});
credentialsMap.set("sa1", {logon: "opussa1", pass: "38wilshire"});
credentialsMap.set("senate", {logon: "opussenate", pass: "38wilshire"});
credentialsMap.set("specChair", {logon: "opusaa", pass: "prof7941"});
credentialsMap.set("specialty", {logon: "opusda3", pass: "229da979"});
credentialsMap.set("vcedi", {logon: "opusvcedi", pass: "38wilshire"});
credentialsMap.set("vcap", {logon: "opusvcap", pass: "38wilshire"});


getLogonFor = (role) =>
{
	const logonFor = credentialsMap.get(role)["logon"];
	
	return logonFor;
}

getPasswordFor = (role) =>
{
	const passwordFor = credentialsMap.get(role)["pass"];
	
	return passwordFor;
}

module.exports =
{
    // define what should be accessible by other scripts
    getLogonFor,
    getPasswordFor
};