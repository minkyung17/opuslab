<!DOCTYPE HTML>
<html>
<head>
<title>DashBoard</title>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script>
var adminData = '';
$(document).ready(function() {
	var startDate = new Date();
	console.log("Calling api to get userData:"+startDate);	
	$.ajax({
	    'cache':false,
		'url': '/opusWeb/rest/common/role',
			'type': 'GET',
              'content-Type': 'x-www-form-urlencoded',
              'dataType': 'json',
              'success': function (result) {
            	  var endDate = new Date();
            	  console.log("Got the results:"+endDate);
                  adminData = result.adminData; 
                  var diff = Math.abs(startDate - endDate);
                  console.log("TimeTaken to get the data:"+ diff/1000);
                  loadDashboard();          
              },
              'error': function (XMLHttpRequest, textStatus, errorThrown) {
                //Process error actions
                //alert('Error: ' + errorThrown);
            	  var endDate = new Date();
            	  console.log("Got the results:"+endDate);
            	  console.log("TimeTaken to get the data:"+ diff/1000);
                console.log(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText);
              }
    });
	
});
</script>
<script src="/opusWeb/ui/plugins/jquery-1.11.1.min.js"></script>
</head>
<body>
		<script type="text/javascript">
		
// 		function initializeTables() {    
// 			loadDashboard();
// 	    }  

		function loadDashboard() {
			var data = adminData.dashboardRole;
			if(data == "") {
	    		 window.location.href = "ui/error/access-error.shtml";
	    	}
	    	else if (data == "SA") {
	    		window.location.href = "ui/dashboard/SA-dash.shtml";
	    	}
	    	else if (data == "DA") {
	    		window.location.href = "ui/dashboard/DA-dash.shtml";
	    	}
	    	else if(data == "OA") {
	    		window.location.href = "ui/dashboard/OA-dash.shtml";
	    	}
	    	else if (data == "CAP") {
	    		window.location.href = "ui/dashboard/CAP-dash.shtml";
	    	}
	    	else if (data == "VCAP") {
	    		window.location.href = "ui/dashboard/VCAP-deans-dash.shtml";
	    	}
	    	else if (data == "Chair") {
	    		window.location.href = "ui/dashboard/Chair-dash.shtml";
	    	}
	    	else if(data == "APO") {
	    		window.location.href = "ui/dashboard/AAPO-dash.shtml";
	    	}
	    	else {
	    		 window.location.href = "ui/error/access-error.shtml"; 
	    	}
		} // loadDashboard
		
    </script>
</body>
</html>