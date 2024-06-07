/*** General ***/
	var access_token = '';
	var rosterURL = '';
	var adminData = '';
	var globalData = '';
//Make AJAX call with get() to the server to populate the case information
$(document).ready(function() {
	getSessionObjects();
	
	
	/*$.when(
			getRoasterURL(),
			initializeTables()
		).then(function(){
			getSessionObjects()
		});*/
	
	//tooltip
	//$('[data-toggle="popover"]').popover({trigger: 'hover','placement': 'top'});
	$('[data-toggle="popover"]').popover({'placement': 'top'});
	$('[data-toggle="tooltip"]').tooltip({trigger: 'hover','placement': 'top'});
	
});

function getSessionObjects() {
	var startDate = new Date();
	
	console.log("START -> getSessionObjects: "+startDate);
	
	$.ajax({
	    'cache':false,
		'url': '/opusWeb/rest/common/call',
			'type': 'GET',
              'content-Type': 'x-www-form-urlencoded',
              'dataType': 'json',
              'success': function (result) {
            	  var endDate = new Date();
            	  console.log("FINISH -> getSessionObjects: "+endDate);
                //Process success actions
            	  access_token = result[0].access_token;
                  adminData = result[1].adminData; 
                  globalData = result[2].globalData;
                  //getRosterURL();
                  navTab(adminData);
                  var diff = Math.abs(startDate - endDate);
                  console.log("TIME DIFFERENCE -> getSessionObjects: "+ diff/1000+" seconds");
                  //Only call this function if a DataTable exists on the page
  		    	  if (typeof initializeTables == 'function') {
  		    		  initializeTables();
  		    	  }          
              },
              'error': function (XMLHttpRequest, textStatus, errorThrown) {
                //Process error actions
                //alert('Error: ' + errorThrown);
            	  var endDate = new Date();
            	  console.log("ERROR -> getSessionObjects: "+endDate);
            	  var diff = Math.abs(startDate - endDate);
            	  console.log("ERROR TIME DIFFERENCE -> getSessionObjects:"+ diff/1000+' '+XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText);
              }
    });
}

function navTab(adminData){
	var dashboardRole = adminData.dashboardRole;
	var adminRole = adminData.adminRoles[0];
	// Common Column classes:
	var columnStart = '<div class="col-md-6">';
	var columnEnd = '</div>';

	// Column 1: Eligibility and Clocks; Cases; Compensation
	var header1 = '<div class="row"><div class="col-md-12"><h2 class=" black ">Cases</h2></div></div>';
	var caseReportUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/active-cases.shtml">Case Reports</a></u></div></li></div><br/>';
	var goToInterfolioUrl = '<div class="row"><li><div class="col-md-12"><u><a href="#" onclick="connectToByC();">Go To Interfolio</a></u></div></li></div><br/>';

	var header2 = '<div class="row"><div class="col-md-12"><h2 class=" black ">Eligibility and Clocks</h2></div></div>';
	var eligibilityUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/eligibility.shtml">Eligibility</a></u></div></li></div><br/>';
	var eightYearClockSummaryUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/eight-year-clock-summary.shtml">Eight Year Clocks</a></u></div></li></div><br/>';
	var excellenceReviewClockSummaryUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/excellence-review-clock-summary.shtml">Excellence Review Clocks</a></u></div></li></div><br/>';

	var header3 = '<div class="row"><div class="col-md-12"><h2 class=" black ">Compensation</h2></div></div>';
	var salaryReportUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/salary-report.shtml">Salary Report</a></u></div></li></div><br/>';
	var salaryCompensationUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/salary-report-UCPath.shtml">UCPath Compensation Report</a></u></div></li></div><br/>';
	var adminComp = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/admin-comp-proposals.shtml">Administrative Compensation</a></u></div></li></div><br/>';
	
	// Column 2: Profiles and Appointments; Administrative Actions
	var header4 = '<div class="row"><div class="col-md-12"><h2 class=" black ">Profiles and Appointments</h2></div></div>';
	var profileUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/profile.shtml">Profiles</a></u></div></li></div><br/>';
	var rosterUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/roster.shtml">Appointments</a></u></div></li></div><br/>';
	var linkPathPositionUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/link-path-position.shtml">Link UCPath Position</a></u></div></li></div><br/>';
	var endowedChairs = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/active-endowed-chairs.shtml">Endowed Chairs</a></u></div></li></div><br/>';
	var requestUIDUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/request-uid.shtml">Request a UID</a></u></div></li></div><br/>';
	var opusPathComparison = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/mismatches.shtml">UCPath/Opus Comparison</a></u></div></li></div><br/>';
	var opusOpusComparison = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/opus-mismatches.shtml">Opus Primary/Additional Comparison</a></u></div></li></div><br/>';

	var header5 = '<div class="row"><div class="col-md-12"><h2 class=" black ">Administrative Actions</h2></div></div>';
	var compliance = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/compliance-report.shtml">Mandatory UC Training Compliance</a></u></div></li></div><br/>';
	var staffPermissionsUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/permissions-users.shtml">Manage Opus and Interfolio Access</a></u></div></li></div><br/>';
	var interfolioGrouperIntegrationUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../opus-admin/loadData2ByC.shtml">Interfolio and Grouper Integration</a></u></div></li></div><br/>';
	var grouperUrl = '<div class="row"><li><div class="col-md-12"><u><a href="#" onclick="getRosterURL();" class="rosterLink">Grouper</a></u></div></li></div><br/>';
	var uidAdminUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../opus-admin/uid-admin.shtml">UID Administration</a></u></div></li></div><br/>';
	var manualOverridesUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../reference-data/manual-overrides.shtml">Manual Overrides</a></u></div></li></div><br/>';
	var manageDataUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../reference-data/manage-data.shtml">Manage Opus Reference Data</a></u></div></li></div><br/>';

	var SADAPermissionsUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/permissions-sada-unit.shtml">Manage Opus and Interfolio Access</a></u></div></li></div><br/>';
	//var staticStaffPermissionsUrl = '<div class="row"><li><div class="col-md-12"><u><a href="../admin/permissions.shtml">Staff Permissions</a></u></div></li></div><br/>';


	var jumpToUrls = '';
	
	if(dashboardRole == "") {
  		jumpToUrls += '';
  	}
  	else if (dashboardRole == "SA") {
  	    jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl 
						+ header2 + eligibilityUrl + eightYearClockSummaryUrl + excellenceReviewClockSummaryUrl 
						+ header3 + salaryReportUrl + salaryCompensationUrl + adminComp + columnEnd
						+ columnStart + header4 + profileUrl + rosterUrl + endowedChairs + linkPathPositionUrl
						+ requestUIDUrl + opusPathComparison + opusOpusComparison
						+ header5 + compliance + SADAPermissionsUrl + columnEnd ;
  	}
  	else if (dashboardRole == "DA") {
  	    jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl 
						+ header2 + eligibilityUrl + eightYearClockSummaryUrl + excellenceReviewClockSummaryUrl
						+ header3 + salaryReportUrl + columnEnd
						+ columnStart + header4 + profileUrl + rosterUrl + endowedChairs + linkPathPositionUrl
						+ requestUIDUrl + opusPathComparison + opusOpusComparison 
						+ header5 + compliance + SADAPermissionsUrl + columnEnd ;
  	}
  	else if(dashboardRole == "OA") {
  		jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl 
						+ header2 + eligibilityUrl + eightYearClockSummaryUrl + excellenceReviewClockSummaryUrl 
						+ header3 + salaryReportUrl + salaryCompensationUrl + adminComp + columnEnd 					
						+ columnStart + header4 + profileUrl + rosterUrl + endowedChairs + linkPathPositionUrl
						+ requestUIDUrl + opusPathComparison + opusOpusComparison 
						+ header5 + compliance + staffPermissionsUrl + interfolioGrouperIntegrationUrl + grouperUrl
						+ uidAdminUrl + manualOverridesUrl + manageDataUrl + columnEnd ;
  	}
  	else if (dashboardRole == "CAP" && adminRole === "cap_staff") {
  		jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl + header2 + eligibilityUrl + columnEnd
						+ columnStart + header4 + profileUrl + rosterUrl + columnEnd ;
  	}
	else if (dashboardRole == "CAP" && (adminRole === "vc_edi" || adminRole === "senate_staff")) {
		jumpToUrls += 	columnStart + header1 + goToInterfolioUrl + columnEnd
					  	+ columnStart + header4 + profileUrl + rosterUrl + columnEnd ;
	}
	else if (dashboardRole == "CAP" && adminRole === "apb") {
		jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl
						+ header3 + salaryReportUrl + salaryCompensationUrl + columnEnd
					  	+ columnStart + header4 + profileUrl + rosterUrl + columnEnd ;
	}
  	else if (dashboardRole == "VCAP") {
  		jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl 
		 				+ header2 + eligibilityUrl + eightYearClockSummaryUrl + excellenceReviewClockSummaryUrl
						+ header3 + salaryReportUrl + salaryCompensationUrl + adminComp + columnEnd						
						+ columnStart + header4 + profileUrl + rosterUrl + endowedChairs 
						+ header5 + compliance + columnEnd ;
  	}
  	else if (dashboardRole == "Chair") {
  		jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl 
						+ header2 + eligibilityUrl + eightYearClockSummaryUrl + excellenceReviewClockSummaryUrl 				
						+ header3 + salaryReportUrl + columnEnd
						+ columnStart + header4 + profileUrl + rosterUrl + endowedChairs 
						+ header5 + compliance + columnEnd ;
  	}
  	else if(dashboardRole == "APO") {
  		jumpToUrls += 	columnStart + header1 + caseReportUrl + goToInterfolioUrl
						+ header2 + eligibilityUrl + eightYearClockSummaryUrl + excellenceReviewClockSummaryUrl 						 
						+ header3 + salaryReportUrl + salaryCompensationUrl + adminComp + columnEnd
						+ columnStart + header4 + profileUrl + rosterUrl + endowedChairs + linkPathPositionUrl
						+ requestUIDUrl + opusPathComparison + opusOpusComparison
						+ header5 + compliance + staffPermissionsUrl + uidAdminUrl + columnEnd ;
  	}
  	
  	$('#jump-to').html(
			jumpToUrls);
}

function getRosterURL(){
	var SendInfo = { 
			
	}; 
		
	$.ajax({ 
		cache:false,
	    url: "/restServices/rest/cont/getRosterUrl/?access_token="+access_token,
	    type: 'POST', 
	    dataType: 'json', 
	    data: JSON.stringify(SendInfo),
	    contentType: 'application/json',
	    //cors: true,
	    //headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Request-Method":"POST"},
	    mimeType: 'application/json',
	    success: function(data) { 
	    	rosterURL = data.grouperURL;
	    	window.location.href=rosterURL;
	    	//$('.rosterLink').attr("href", rosterURL);
	    },
	    error: function(jqXHR, textStatus, errorThrown) { 
	    	//alert(jqXHR.responseText);
	    	console.log("Error:", errorThrown);
	    	console.log(jqXHR.status); 
	    	console.log("Text Status:", textStatus);
	    }
	});
}
function logout()
{

$.ajax({
	url: "/opusWeb/rest/dashboardexit", 
    type: 'GET',
    data: {
    	adminOpusId: adminData.adminOpusId,
    	restUrl:"/restServices/rest/access/trackLoggedOutUser?access_token="+access_token
    },
    //crossDomain: true,
    success: function(data) { 
    	window.location.href = data;
    },
    error: function(jqXHR, textStatus, errorThrown) { 
    	//alert(jqXHR.responseText);
    	console.log("Error:", errorThrown);
    	console.log(jqXHR.status); 
    	console.log("Text Status:", textStatus);
    }
});
}
function connectToByC()
{

$.ajax({
	url: "/opusWeb/rest/connectToByC", 
    type: 'GET',
    data: {
    },
    //crossDomain: true,
    success: function(url) { 
    	var win = window.open(url, '_blank');
    	  win.focus();
    },
    error: function(jqXHR, textStatus, errorThrown) { 
    	//alert(jqXHR.responseText);
    	console.log("Error:", errorThrown);
    	console.log(jqXHR.status); 
    	console.log("Text Status:", textStatus);
    }
});
}

//Populate page header with case information
function populatePageHeader(input, headerName) {
	$.each(input, function() {
		$(headerName).append("<h1>"
		+ this.name + "</h1><h2>"
		+ this.type + ": "
		+ this.caseDetails + "</h2>"
		);	
	});
}

/*** DataTables ***/

function changeDTstyles() {
	$('.ColVis button').html('Change Columns');
    $('.dataTables_filter input[type=search]').removeClass('input-sm');
    
    //TableTools
    $('.DTTT_button_collection span').html("Download Data");
    $('.DTTT_button_collection span').addClass("icon-download");
    $('.DTTT_button_collection').attr("title", "Download Data");
}

/*** Case Summary Page ***/

//Submit a note in the case
function submitNote(resultsArea, resultsValue) {
	$(resultsArea).append('<p>' + $(resultsValue).val() + '</p>');
}

/*** Date Formatting ***/

//Format date and time
function formatDateTime(d) {
	if (d == null) {
		return;
	}

	var date = new Date(d);
	
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

	var month = monthNames[date.getMonth()];
	var day = date.getDate();
	var year = date.getFullYear();
	
	// getHours returns the hours in local time zone from 0 to 23
    var hours = date.getHours();
    // getMinutes returns the minutes in local time zone from 0 to 59
    var minutes =  date.getMinutes();
    var meridiem = " AM";

    // convert to 12-hour time format
    if (hours > 12) {
      	hours = hours - 12;
      	meridiem = " PM";
    }
    else if (hours === 12) {
    	meridiem = " PM";
    }
    else if (hours === 0) {
      	hours = 12;
    }

    // minutes should always be two digits long
    if (minutes < 10) {
      	minutes = "0" + minutes.toString();
    }
	
	var formattedDate = month + " " + day + ", " + year + " " + hours + ":" + minutes + meridiem;
	return formattedDate;
}

//Format date
function formatDate(d) {
	if (d == null) {
		return;
	}
		
	var date = new Date(d);
	
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

	var month = monthNames[date.getMonth()];
	var day = date.getDate();
	var year = date.getFullYear();
	
	var formattedDate = month + " " + day + ", " + year;
	return formattedDate;
}
 
//icons on Bootstrap accordian
function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("span.indicator")
        .toggleClass('icon-down-open-big icon-right-open-big');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);

//resizable, draggable modal - only works on non-React pages



$('.modal').on('show.bs.modal', function () {
    $(this).find('.modal-body').css({
        'max-height':'100%'
    });
    $('.modal-content').resizable({
        //alsoResize: ".modal-dialog",
        minHeight: 300,
        minWidth: 300
    });

    $('.modal-dialog').draggable();
});