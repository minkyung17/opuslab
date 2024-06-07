require('../data/CREDENTIALS');

class Role
{
    constructor(logon, pass)
    {
        this.logon = logon;
        this.pass = pass;
    }
}

const aa = new Role(getLogonFor("aa"), getPasswordFor("aa"));
const apb = new Role(getLogonFor("apb"), getPasswordFor("apb"));
const apo = new Role(getLogonFor("apo"), getPasswordFor("apo"));
const apoStaff = new Role(getLogonFor("apoStaff"), getPasswordFor("apoStaff"));
const areaChair = new Role(getLogonFor("areaChair"), getPasswordFor("areaChair"));
const cap = new Role(getLogonFor("cap"), getPasswordFor("cap"));
const chair = new Role(getLogonFor("chair"), getPasswordFor("chair"));
const da = new Role(getLogonFor("da"), getPasswordFor("da"));
const dean = new Role(getLogonFor("dean"), getPasswordFor("dean"));
const deptChair = new Role(getLogonFor("deptChair"), getPasswordFor("deptChair"));
const div = new Role(getLogonFor("div"), getPasswordFor("div"));
const divdean = new Role(getLogonFor("divdean"), getPasswordFor("divdean"));
const librarySa = new Role(getLogonFor("librarySa"), getPasswordFor("librarySa"));
const oa = new Role(getLogonFor("oa"), getPasswordFor("oa"));
const sa1 = new Role(getLogonFor("sa1"), getPasswordFor("sa1"));
const senate = new Role(getLogonFor("senate"), getPasswordFor("senate"));
const specChair = new Role(getLogonFor("specChair"), getPasswordFor("specChair"));
const specialty = new Role(getLogonFor("specialty"), getPasswordFor("specialty"));
const vcedi = new Role(getLogonFor("vcedi"), getPasswordFor("vcedi"));
const vcap = new Role(getLogonFor("vcap"), getPasswordFor("vcap"));

toObject = (role) =>
{
    const stringToObjectMap = new Map();
    
    // create map of roles: string to object
	stringToObjectMap.set("aa", aa);
	stringToObjectMap.set("apb", apb);
	stringToObjectMap.set("apo", apo);
	stringToObjectMap.set("apoStaff", apoStaff);
	stringToObjectMap.set("areaChair", areaChair);
	stringToObjectMap.set("cap", cap);
	stringToObjectMap.set("chair", chair);
	stringToObjectMap.set("da", da);
	stringToObjectMap.set("dean", dean);
	stringToObjectMap.set("deptChair", deptChair);
	stringToObjectMap.set("div", div);
	stringToObjectMap.set("divdean", divdean);
	stringToObjectMap.set("oa", oa);
	stringToObjectMap.set("librarySa", librarySa);
	stringToObjectMap.set("sa1", sa1);
	stringToObjectMap.set("senate", senate);
	stringToObjectMap.set("specChair", specChair);
	stringToObjectMap.set("specialty", specialty);
	stringToObjectMap.set("vcedi", vcedi);
	stringToObjectMap.set("vcap", vcap);    
    
    return stringToObjectMap.get(role);
}

toLiteralRole = (role) =>
{
    // this method changes the role variable to the literal role (how it would be used in text), 
    // essentially reverting it back to the user-entered role
    if(role == "apoStaff")
    {
        return "apo-staff";
    }
    else if(role == "areaChair")
    {
        return "area-chair";
    }
    else if(role == "deptChair")
    {
        return "dept-chair";
    }
    else if(role == "librarySa")
    {
        return "library-sa";
    }
    else if(role == "specChair")
    {
        return "spec-chair";
    }    
    else
    {
        return role;
    }
}

checkIfInLineup = (loggingPrefix, role, lineup) =>
{
    if(lineup.includes(role) || role === "all")
    {
        logThis(loggingPrefix + "role in lineup: valid role for this test");
    }
    else
    {
        logThis(loggingPrefix + "role NOT in lineup: invalid role for this test -- role may need to be added to the lineup...exiting");
	    process.exit();
    }
}

module.exports =
{
    // define what should be accessible by other scripts
    checkIfInLineup,
    toObject,
    toLiteralRole
};