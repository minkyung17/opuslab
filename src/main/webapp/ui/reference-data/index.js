$(function(){
    var treeView = $("#treeview").dxTreeView({ 
        items: units,
        width: 400,
        searchEnabled: true,
        onItemClick: function(e) {
            var item = e.itemData;
            if(item.price) {
                $("#unit-roles").removeClass("hidden");
                $("#unit-roles > .customer1").text();
                $("#unit-roles > #gridContainer1").text();
                $("#unit-roles > .customer2").text();
                $("#unit-roles > #gridContainer2").text();
                $("#unit-roles > .customer3").text();
                $("#unit-roles > #gridContainer3").text();
            } else {
                $("#unit-roles").addClass("hidden");
            }
        }
    }).dxTreeView("instance");

  /*  $("#searchMode").dxSelectBox({
        dataSource: ["contains", "startswith"],
        value: "contains",
        onValueChanged: function(data) {
            treeView.option("searchMode", data.value);
        }
    });*/
});

$(function(){
    $("#gridContainer1").dxDataGrid({
        dataSource: unitUsers,
        columns: ["Name", "Role", "Status"],
        showBorders: true
    });
    
    $("#gridContainer2").dxDataGrid({
        dataSource: unitUsers,
        columns: ["Name", "Role", "Status"],
        showBorders: true
    });
    
    $("#gridContainer3").dxDataGrid({
        dataSource: unitUsers,
        columns: ["Name", "Role", "Status"],
        showBorders: true
    });
});
/*
$(function(){
    $("#rolesContainer1").dxDataGrid({
        dataSource: userRoles,
        showBorders: true
    });
    
    $("#rolesContainer1").dxDataGrid({
        dataSource: userRoles,
        showBorders: true
    });
    
    $("#rolesContainer1").dxDataGrid({
        dataSource: userRoles,
        showBorders: true
    });
});

var userRoles = [{
	"1",
    "Biology Department Admin"
}, {
    "2",
    "Biology Department Chair"
}];
*/
var unitUsers = [{
    "ID": 1,
    "Name": "Leia, Princess",
    "Role": "Biology Department Admin",
    "Status": "Active",
    "AcademicHierarchyPathId": 1
}, {
    "ID": 2,
    "Name": "Wookie, Chewbacca",
    "Role": "Biology Department Chair",
    "Status": "Active",
    "AcademicHierarchyPathId": 2
}];

var units = [{
    id: "1",
    text: "University of California - Los Angeles",
    expanded: true,
    items: [{
        id: "1_1",
        text: "Arts and Architecture",
        expanded: true,
        items: [{
            id: "1_1_1",
            text: "N/A",
            items: [{
                id: "1_1_1_1",
                text: "Architecture and Urban Design"
            }, {
                id: "1_1_1_2",
                text: "Art"
            }, {
                id: "1_1_1_3",
                text: "Design | Media Arts"
            }, {
                id: "1_1_1_4",
                text: "World Arts and Cultures/Dance"
            }]
        }]

    }, {
        id: "1_2",
        text: "Dentistry",
        expanded: true,
        items: [{
            id: "1_2_1",
            text: "N/A",
            expanded: true,
            items: [{
                id: "1_2_1_1",
                text: "Dentistry Dept.",
                 items: [{
                    id: "1_2_1_1_1",
                    text: "Advanced Prosthodontics",
                    items: [{
                        id: "1_2_1_1_1_1",
                        text: "Biomaterials Science"
                    }, {
	                    id: "1_2_1_1_1_2",
	                    text: "Special Patient Care"
                    }, {
	                    id: "1_2_1_1_1_3",
	                    text: "Prosthodontics"
                    }]
                }, {
                	id: "1_2_1_1_2",
                    text: "Constitutive Regenerative",
                    items: [{
                        id: "1_2_1_1_2_1",
                        text: "Endodontics",
                    }, {
	                    id: "1_2_1_1_2_2",
	                    text: "Periodontics"
                    }, {
	                    id: "1_2_1_1_2_3",
	                    text: "Restorative Dentistry"
                    }]
                }, {
                	id: "1_2_1_1_3",
                    text: "Diagnostic and Surgical Sciences",
                    items: [{
                        id: "1_2_1_1_3_1",
                        text: "Dental Anesthesiology",
                    }, {
	                    id: "1_2_1_1_3_2",
	                    text: "Oral and Maxillofacial Pathology"
                    }, {
	                    id: "1_2_1_1_3_3",
	                    text: "Oral and Maxillofacial Radiology"
                    }, {
	                    id: "1_2_1_1_3_4",
	                    text: "Oral and Maxillofacial Surgery"
                    }]
                }, {
                	id: "1_2_1_1_4",
                    text: "Growth Development",
                    items: [{
                        id: "1_2_1_1_4_1",
                        text: "Orthodontics",
                    }, {
	                    id: "1_2_1_1_4_2",
	                    text: "Pediatric Dentistry"
                    }]
                }, {
                	id: "1_2_1_1_5",
                    text: "Oral Bilogy and Medicine",
                    items: [{
                        id: "1_2_1_1_5_1",
                        text: "Oral Biology",
                    }, {
	                    id: "1_2_1_1_5_2",
	                    text: "Oral Medicine"
                    }, {
	                    id: "1_2_1_1_5_3",
	                    text: "Orofacial Pain"
                    }]
                }, {
                	id: "1_2_1_1_6",
                    text: "Public Health and Community Dentistry"
                }]
            }]
        }]
    }, {
    	id: "1_3",
        text: "Education and Information Studies",
        expanded: true,
        items: [{
            id: "1_3_1",
            text: "N/A",
            expanded: true,
            items: [{
                id: "1_3_1_1",
                text: "Education"
            }, {
                id: "1_3_1_2",
                text: "Information Studies"
            }, {
                id: "1_3_1_3",
                text: "Moving Image Archive"
            }]
        }]
    }, {
    	id: "1_4",
        text: "Henry Samueli School of Engineering and Applied Science",
        expanded: true,
        items: [{
            id: "1_4_1",
            text: "N/A",
            items: [{
                id: "1_4_1_1",
                text: "Bioengineering"
            }, {
                id: "1_4_1_2",
                text: "Chemical and Biomolecular Engineering"
            }, {
                id: "1_4_1_3",
                text: "Civil and Environmental Engineering"
            }, {
                id: "1_4_1_4",
                text: "Computer Science"
            }, {
                id: "1_4_1_5",
                text: "Electical and Computer Engineering"
            }, {
                id: "1_4_1_6",
                text: "Materials Science and Engineering"
            }, {
                id: "1_4_1_7",
                text: "Mechanical and Aerospace Engineering"
            }, {
                id: "1_4_1_8",
                text: "Smart Grid Research Center"
            }]
        }]
    }]
}];