//highlight row blue on select, gray upon hover.  keep here until IUI is depricated.  then put in opus.js

$(document).on({
	 click: function () {
	        trIndex = $(this).index()+2;         	                     	    
	        var currentRow =  $(this).find("tr:eq("+trIndex+")");
	        if (!$(this).hasClass("select-background")) {
				$("table.dataTable").each(function(index, row) {
					 $(this).find("tr").removeClass("select-background");        					
				});
				$("table.dataTable").each(function(index) {
    	            $(this).find("tr:eq("+trIndex+")").addClass("select-background");
    	        });
	        }
	        else	{
	        	$("table.dataTable").each(function(index, row) {
					 $(this).find("tr:eq("+trIndex+")").removeClass("select-background"); 					
					});
	        	}
	    },
	mouseenter: function () {
    	trIndex2 = $(this).index()+2;
    	$("table.dataTable").each(function(index) {
        	$(this).find("tr:eq("+trIndex2+")").addClass("hover2");
    	});
		},
	mouseleave: function () {
    	trIndex = $(this).index()+2;
    	$("table.dataTable").each(function(index) {
        	$(this).find("tr:eq("+trIndex2+")").removeClass("hover2");
    	});
		}
	}, ".dataTables_wrapper tr");