var processedRole = ""; // set up role variable for later use

processRoleByRunType = (runType, allRolesToBeProcessed, role) =>
{
	if(runType === "single")
	{
	    let roleValid = false;
	    
		for(let i = 0; i < allRolesToBeProcessed.length; i++)
		{
			// check if entered role is valid, disregarding case
			roleValid = new RegExp(allRolesToBeProcessed[i], "i").test(role.toLowerCase());
		
			if(roleValid)
			{
				// convert to correct capitalization and stop checking
				role = allRolesToBeProcessed[i];
			
				break;
			}
		}
	
		if(roleValid)
		{
			logThis("valid role entered");		
		}
		else
		{
			logThis("ROLE not valid -- be more like Tammy and know the correct roles");
			process.exit();
		}
	}
	else if(runType === "mini-batch")
	{    
		// first split the entered file name to check each one
		const enteredRoles = role.split(",");
	
		enteredRoles.forEach(role =>
		{
			if(allRolesToBeProcessed.includes(role))
			{
				logThis(role + ": valid role entered");
			}
			else
			{
				logThis("ROLE not valid -- be more like Tammy and mind your case sensitivity");
				process.exit();   
			}
		});
	}
	else if(runType === "all")
	{
		logThis("All?  I see you're feeling a little greedy today.");
	}
}


// modify role to fit code-friendly format
makeRoleCodeFriendly = (role) =>
{
    // this method changes user-entered role to align with coding standards
    if(role == "apo-staff")
    {
        return "apoStaff";
    }
    else if(role == "library-sa")
    {
        return "librarySa";
    }
    else
    {
        return role;
    }
}

handleRole = (runType, allRolesToBeProcessed, role) =>
{
    // gatekeep entered role
	if(role == null)
	{
		logThis("no role entered, exiting...");
		process.exit();
	}
	else // something was entered for role
	{
	    // do initial gatekeeping of role based on run type
	    processRoleByRunType(runType, allRolesToBeProcessed, role);
	    
	    // make any necessary modifications to the role
		processedRole = makeRoleCodeFriendly(role);
		logThis("role has been processed to: " + processedRole);
	}

	// make sure entered role is valid
	if(!allRolesToBeProcessed.includes(processedRole) && (processedRole !== "all") && (processedRole !== "0") && (!processedRole.includes("\,")))
	{
		logThis("invalid role, have a nice day : )");
		process.exit();
	}
	
	return processedRole;
}

module.exports =
{
    // define what should be accessible by other scripts
    handleRole
};
