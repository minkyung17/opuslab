//on change of titleCode call populateActions to populate ActionTypes

function onChangeDropdownCode(id) {
	$('#edit-modal ' + id).off('change').on('change', function() {

		var codeText = $(id + ' option:selected').text();
		var codeValue = $(id + ' option:selected').val();
		var codeArray = codeText.split("-");
		if (id === '#titleCode')
			populateActions(codeArray[0].trim());
		else if (id === '#actionType')
			populateOutcomes(codeValue);
		else if (id === '#seriesRank')
			populateRanks(codeValue);
		else
			populateSteps(codeValue);
	});
}
// triggers when i click on edit button
function setEditValues(codeid, code, id) {
	var dropdownCodeContainerFields = '';
	var box1ContainerFileds = '';
	var box2ContainerFileds = '';
	if (pageName === 'actiontitle') {

		// added Title Code Dropdown
		dropdownCodeContainerFields = htmlTitleCodeDropDown();

		$('#edit-modal #dropdownCodeContainer').html("");
		$('#edit-modal #dropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var titleCodeDropdown = '';
		titleCodeDropdown += '<option></option>';

		if (globalTitleCodesHashmap !== undefined
				&& globalTitleCodesHashmap !== null) {
			$.each(globalTitleCodesHashmap, function(index, tc) {
				titleCodeDropdown += '<option value=' + tc.titleCodeId + '>'
						+ tc.titleCode + ' - ' + tc.payrollTitle + '</option>';
			});
		}
		$('#edit-modal ' + id).html("");
		$('#edit-modal ' + id).html(titleCodeDropdown);

		// added ACtion Revelance multiple dropdowns
		box1ContainerFileds = htmlAllActionsDropDown();
		$('#edit-modal #box1Container').html("");
		$('#edit-modal #box1Container').html(box1ContainerFileds);

		box2ContainerFileds = htmlActionsRelevDropDown();
		$('#edit-modal #box2Container').html("");
		$('#edit-modal #box2Container').html(box2ContainerFileds);
		// set onchage event
		onChangeDropdownCode(id);
		if (code !== '' && code !== undefined && code !== null)
			populateActions(code);

	} else if (pageName === 'actionoutcome') {
		// added Action Type Dropdown
		dropdownCodeContainerFields = htmlActionDropDown();

		$('#edit-modal #dropdownCodeContainer').html("");
		$('#edit-modal #dropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var actionDropdown = '';
		actionDropdown += '<option></option>';

		if (globalActionTypesList !== undefined
				&& globalActionTypesList !== null) {
			$.each(globalActionTypesList, function(index, actionList) {
				$.each(actionList, function(index, ac) {
					var actionOption = '<option value=' + ac.code + '>'
							+ ac.actionTypeDisplayText + '</option>'
					if (actionDropdown.indexOf(actionOption) === -1)
						actionDropdown += actionOption;

				});
			});
		}
		$('#edit-modal ' + id).html("");
		$('#edit-modal ' + id).html(actionDropdown);

		// added outcome Revelance multiple dropdowns
		box1ContainerFileds = htmlAllOutcomesDropDown();
		$('#edit-modal #box1Container').html("");
		$('#edit-modal #box1Container').html(box1ContainerFileds);

		box2ContainerFileds = htmlOutcomeRelevDropDown();
		$('#edit-modal #box2Container').html("");
		$('#edit-modal #box2Container').html(box2ContainerFileds);
		// set onchage event
		onChangeDropdownCode(id);
		if (codeid !== '' && codeid !== undefined && codeid !== null)
			populateOutcomes(codeid);

	} else if (pageName === 'seriesrank') {
		// added series Type Dropdown
		dropdownCodeContainerFields = htmlSeriesDropDown();

		$('#edit-modal #dropdownCodeContainer').html("");
		$('#edit-modal #dropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var seriesDropdown = '';
		seriesDropdown += '<option></option>';

		if (seriesRankRelevanceDataRows !== undefined
				&& seriesRankRelevanceDataRows !== null) {
			$.each(seriesRankRelevanceDataRows, function(index, series) {
				var seriesOption = '<option value=' + series.seriesTypeId + '>'
						+ series.seriesTypeDisplayText + '</option>'
				if (seriesDropdown.indexOf(seriesOption) === -1)
					seriesDropdown += seriesOption;

			});
		}
		$('#edit-modal ' + id).html("");
		$('#edit-modal ' + id).html(seriesDropdown);

		// added Rank Revelance multiple dropdowns
		box1ContainerFileds = htmlAllRankDropDown();
		$('#edit-modal #box1Container').html("");
		$('#edit-modal #box1Container').html(box1ContainerFileds);

		box2ContainerFileds = htmlRankRelevDropDown();
		$('#edit-modal #box2Container').html("");
		$('#edit-modal #box2Container').html(box2ContainerFileds);
		// set onchage event
		onChangeDropdownCode(id);
		if (codeid !== '' && codeid !== undefined && codeid !== null)
			populateRanks(codeid);

	} else if (pageName === 'seriesrankstep') {
		// added series Rank Type Dropdown
		dropdownCodeContainerFields = htmlSeriesRankDropDown();

		$('#edit-modal #dropdownCodeContainer').html("");
		$('#edit-modal #dropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var seriesRankDropdown = '';
		seriesRankDropdown += '<option></option>';

		if (seriesRankStepRelevanceDataRows !== undefined
				&& seriesRankStepRelevanceDataRows !== null) {
			$
					.each(seriesRankStepRelevanceDataRows,
							function(index, seriesRank) {
								var seriesRankOption = '<option value='
										+ seriesRank.seriesTypeId + '-'
										+ seriesRank.rankTypeId + '>'
										+ seriesRank.seriesTypeDisplayText
										+ '-' + seriesRank.rankTypeDisplayText
										+ '</option>'
								if (seriesRankDropdown
										.indexOf(seriesRankOption) === -1)
									seriesRankDropdown += seriesRankOption;

							});
		}
		$('#edit-modal ' + id).html("");
		$('#edit-modal ' + id).html(seriesRankDropdown);

		// added Step Revelance multiple dropdowns
		box1ContainerFileds = htmlAllStepDropDown();
		$('#edit-modal #box1Container').html("");
		$('#edit-modal #box1Container').html(box1ContainerFileds);

		box2ContainerFileds = htmlStepRelevDropDown();
		$('#edit-modal #box2Container').html("");
		$('#edit-modal #box2Container').html(box2ContainerFileds);
		// set onchage event
		onChangeDropdownCode(id);
		if (codeid !== '' && codeid !== undefined && codeid !== null)
			populateSteps(codeid);
	}
	if (codeid !== '' && codeid !== undefined && codeid !== null) {
		$(id).val(codeid);
	}

}

function setEditRefValues(code, categoryId, typeCode, typeDescription, name,
		isActive, modalType, isValidForAppointmentSet,isValidForCase) {
	var dropdownCodeContainerFields = '';
	if (pageName === 'actiontype') {

		// added Title Code Dropdown
		if (modalType === 'edit')
			dropdownCodeContainerFields += htmlActionTypeDropDown();

		dropdownCodeContainerFields += htmlActionCategoryDropDown()
				+ htmlActiveDropDown() + htmlActionTypeDescription()
				+ htmlActionTypeDisplayText() + htmlActionTypeCode()
				+ htmlIsValidForApptSetDropDown() + htmlIsValidForCaseDropDown();

		$('#edit-ref-modal #refDropdownCodeContainer').html("");
		$('#edit-ref-modal #refDropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var actionCategoryDropdown = '';
		actionCategoryDropdown += '<option></option>';

		if (globalActionCategories !== undefined
				&& globalActionCategories !== null) {
			$.each(globalActionCategories, function(index, actCat) {
				actionCategoryDropdown += '<option value=' + actCat.code + '>'
						+ actCat.name + '</option>';
			});
		}

		var activeDropdown = '';
		activeDropdown += '<option></option>';
		activeDropdown += '<option value=' + 'Y' + '>YES</option>';
		activeDropdown += '<option value=' + 'N' + '>NO</option>';

		$('#edit-ref-modal #actionCategory').html("");
		$('#edit-ref-modal #actionCategory').html(actionCategoryDropdown);

		$('#edit-ref-modal #active').html("");
		$('#edit-ref-modal #active').html(activeDropdown);
		
		$('#edit-ref-modal #isValidForApptSet').html("");
		$('#edit-ref-modal #isValidForApptSet').html(activeDropdown);
		
		$('#edit-ref-modal #isValidForCase').html("");
		$('#edit-ref-modal #isValidForCase').html(activeDropdown);

		if (modalType === 'edit') {
			var actionTypeDropdown = '';
			actionTypeDropdown += '<option></option>';
			if (actionTypeDataRows !== undefined && actionTypeDataRows !== null) {
				$.each(actionTypeDataRows, function(index, at) {
					actionTypeDropdown += '<option value=' + at.actionTypeId + '>'
							+ at.actionTypeDisplayText + '</option>';
				});
			}
			$('#edit-ref-modal #actionType').html("");
			$('#edit-ref-modal #actionType').html(actionTypeDropdown);
			$('#actionType').val(code);
			$('#actionCategory').val(categoryId);
			$('#active').val(isActive);
			$('#isValidForApptSet').val(isValidForAppointmentSet);
			$('#isValidForCase').val(isValidForCase);
			$('#actionTypeDescription').val(typeDescription);
			$('#actionTypeDisplayText').val(name);
			$('#actionTypeCode').val(typeCode);
			$("#actionType").prop('disabled', true);
		}

	} 	if (pageName === 'titleCode') {


		dropdownCodeContainerFields += htmlTitleCodeId() + htmlTitleCode() + htmlTitleCodeDescription()
				+ htmlTitleCodeDisplayText() + htmlActiveDropDown() + htmlIsHSCPDropDown();

		$('#edit-ref-modal #refDropdownCodeContainer').html("");
		$('#edit-ref-modal #refDropdownCodeContainer').html(
				dropdownCodeContainerFields);


		var activeDropdown = '';
		activeDropdown += '<option></option>';
		activeDropdown += '<option value=' + 'Y' + '>YES</option>';
		activeDropdown += '<option value=' + 'N' + '>NO</option>';

		$('#edit-ref-modal #active').html("");
		$('#edit-ref-modal #active').html(activeDropdown);
		
		$('#edit-ref-modal #isHscp').html("");
		$('#edit-ref-modal #isHscp').html(activeDropdown);

		if (modalType === 'edit') {
			$('#active').val(isActive);
			$('#isHscp').val(isValidForAppointmentSet);
			$('#titleCodeDescription').val(typeDescription);
			$('#titleCodeDisplayText').val(name);
			$('#titleCode').val(typeCode);
			$('#titleCodeId').val(code);
			$("#titleCodeDescription").prop('disabled', true);
			$("#titleCodeDisplayText").prop('disabled', true);
			$("#titleCode").prop('disabled', true);
			$("#titleCodeId").prop('disabled', true);
		}

	} else if (pageName === 'seriestype') {

		// added Series type Dropdown
		if (modalType === 'edit')
			dropdownCodeContainerFields += htmlSeriesTypeDropDown();

		dropdownCodeContainerFields += htmlActiveDropDown()
				+ htmlSeriesTypeDescription() + htmlSeriesTypeDisplayText()
				+ htmlSeriesTypeCode();

		$('#edit-ref-modal #refDropdownCodeContainer').html("");
		$('#edit-ref-modal #refDropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var activeDropdown = '';
		activeDropdown += '<option></option>';
		activeDropdown += '<option value=' + 'Y' + '>YES</option>';
		activeDropdown += '<option value=' + 'N' + '>NO</option>';

		$('#edit-ref-modal #active').html("");
		$('#edit-ref-modal #active').html(activeDropdown);

		if (modalType === 'edit') {
			var seriesTypeDropdown = '';
			seriesTypeDropdown += '<option></option>';
			if (seriesTypeDataRows !== undefined && seriesTypeDataRows !== null) {
				$.each(seriesTypeDataRows, function(index, at) {
					seriesTypeDropdown += '<option value=' + at.seriesTypeId
							+ '>' + at.seriesTypeDisplayText + '</option>';
				});
			}
			$('#edit-ref-modal #seriesType').html("");
			$('#edit-ref-modal #seriesType').html(seriesTypeDropdown);
			$('#seriesType').val(code);
			$('#active').val(isActive);
			$('#seriesTypeDescription').val(typeDescription);
			$('#seriesTypeDisplayText').val(name);
			$('#seriesTypeCode').val(typeCode);
			$("#seriesType").prop('disabled', true);
		}

	} else if (pageName === 'ranktype') {

		// added rank type Dropdown
		if (modalType === 'edit')
			dropdownCodeContainerFields += htmlRankTypeDropDown();

		dropdownCodeContainerFields += htmlActiveDropDown()
				+ htmlRankTypeDescription() + htmlRankTypeDisplayText()
				+ htmlRankTypeCode();

		$('#edit-ref-modal #refDropdownCodeContainer').html("");
		$('#edit-ref-modal #refDropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var activeDropdown = '';
		activeDropdown += '<option></option>';
		activeDropdown += '<option value=' + 'Y' + '>YES</option>';
		activeDropdown += '<option value=' + 'N' + '>NO</option>';

		$('#edit-ref-modal #active').html("");
		$('#edit-ref-modal #active').html(activeDropdown);

		if (modalType === 'edit') {
			var rankTypeDropdown = '';
			rankTypeDropdown += '<option></option>';
			if (rankTypeDataRows !== undefined && rankTypeDataRows !== null) {
				$.each(rankTypeDataRows, function(index, rt) {
					rankTypeDropdown += '<option value=' + rt.rankTypeId
							+ '>' + rt.rankTypeDisplayText + '</option>';
				});
			}
			$('#edit-ref-modal #rankType').html("");
			$('#edit-ref-modal #rankType').html(rankTypeDropdown);
			$('#rankType').val(code);
			$('#active').val(isActive);
			$('#rankTypeDescription').val(typeDescription);
			$('#rankTypeDisplayText').val(name);
			$('#rankTypeCode').val(typeCode);
			$("#rankType").prop('disabled', true);
		}

	} else if (pageName === 'steptype') {

		// added rank type Dropdown
		if (modalType === 'edit')
			dropdownCodeContainerFields += htmlStepTypeDropDown();

		dropdownCodeContainerFields += htmlActiveDropDown()
				+ htmlStepTypeDescription() + htmlStepTypeDisplayText()
				+ htmlStepTypeCode();

		$('#edit-ref-modal #refDropdownCodeContainer').html("");
		$('#edit-ref-modal #refDropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var activeDropdown = '';
		activeDropdown += '<option></option>';
		activeDropdown += '<option value=' + 'Y' + '>YES</option>';
		activeDropdown += '<option value=' + 'N' + '>NO</option>';

		$('#edit-ref-modal #active').html("");
		$('#edit-ref-modal #active').html(activeDropdown);

		if (modalType === 'edit') {
			var stepTypeDropdown = '';
			stepTypeDropdown += '<option></option>';
			if (stepTypeDataRows !== undefined && stepTypeDataRows !== null) {
				$.each(stepTypeDataRows, function(index, st) {
					stepTypeDropdown += '<option value=' + st.stepTypeId
							+ '>' + st.stepName + '</option>';
				});
			}
			$('#edit-ref-modal #stepType').html("");
			$('#edit-ref-modal #stepType').html(stepTypeDropdown);
			$('#stepType').val(code);
			$('#active').val(isActive);
			$('#stepTypeDescription').val(typeDescription);
			$('#stepTypeDisplayText').val(name);
			$('#stepTypeCode').val(typeCode);
			$("#stepType").prop('disabled', true);
		}

	} else if (pageName === 'apptSetData') {
		

		dropdownCodeContainerFields += htmlAppointeeName()
				+ htmlAppointmentCategoryTypeDropDown() + htmlApptSetStartDt()
				+ htmlApptSetEndDt() + htmlApptSetId() + htmlhiddentAppointmentId();

		$('#edit-ref-modal #refDropdownCodeContainer').html("");
		$('#edit-ref-modal #refDropdownCodeContainer').html(
				dropdownCodeContainerFields);

		var categoryDropdown = '';
		categoryDropdown += '<option></option>';
		categoryDropdown += '<option value=1>Primary</option>';
		categoryDropdown += '<option value=2>Joint</option>';
		categoryDropdown += '<option value=3>Split</option>';

		$('#edit-ref-modal #apptCategoryType').html("");
		$('#edit-ref-modal #apptCategoryType').html(categoryDropdown);

		if (modalType === 'edit') {
		
			$('#apptCategoryType').val(typeCode);
			$('#apptSetId').val(code);
			$('#apptId').val(categoryId);
			$('#appointeeName').val(name);
			$('#apptSetStartDt').val(typeDescription);
			if(isActive != "null" && isActive != null) {
				$('#apptSetEndDt').val(isActive);
			} else {
				$('#apptSetEndDt').val('');
			}
			
			$("#appointeeName").prop('disabled', true);
			$('#apptSetId').prop('disabled', true);
		}
		
	}	
	
}

function populateActions(titleCode) {
	var actionTypeList = globalActionTypesList[titleCode];
	var relevantActionTypesList = '';

	if (actionTypeList !== '' && actionTypeList !== undefined
			&& actionTypeList !== null) {
		$.each(actionTypeList, function(index, action) {
			relevantActionTypesList += '<option value=' + action.code + '>'
					+ action.actionTypeDisplayText + '</option>';
		});
	}
	$('#edit-modal #lstBox2').html("");
	$('#edit-modal #lstBox2').html(relevantActionTypesList);

	var allActionTypesList = '';

	if (globalActionTypesList !== undefined && globalActionTypesList !== null) {
		$.each(globalActionTypesList, function(index, actionList) {
			$.each(actionList,
					function(index, ac) {
						var actionTypeOption = '<option value=' + ac.code + '>'
								+ ac.actionTypeDisplayText + '</option>';
						if (allActionTypesList.indexOf(actionTypeOption) === -1
								&& relevantActionTypesList
										.indexOf(actionTypeOption) === -1)
							allActionTypesList += actionTypeOption;
					});
		});
	}
	$('#edit-modal #lstBox1').html("");
	$('#edit-modal #lstBox1').html(allActionTypesList);
}

function populateOutcomes(actionTypeCategoryId) {
	var outcomeList = globalActionOutcomesList[actionTypeCategoryId];
	var relevantOutcomesList = '';

	if (outcomeList !== '' && outcomeList !== undefined && outcomeList !== null) {
		$.each(outcomeList, function(index, outcome) {
			relevantOutcomesList += '<option value=' + outcome.code + '>'
					+ outcome.name + '</option>';
		});
	}
	$('#edit-modal #lstBox2').html("");
	$('#edit-modal #lstBox2').html(relevantOutcomesList);

	var allOutcomesList = '';

	if (globalActionOutcomesList !== undefined
			&& globalActionOutcomesList !== null) {
		$.each(globalActionOutcomesList, function(index, outcomeList) {
			$.each(outcomeList, function(index, ou) {
				var outcomeOption = '<option value=' + ou.code + '>' + ou.name
						+ '</option>';
				if (allOutcomesList.indexOf(outcomeOption) === -1
						&& relevantOutcomesList.indexOf(outcomeOption) === -1)
					allOutcomesList += outcomeOption;
			});
		});
	}
	$('#edit-modal #lstBox1').html("");
	$('#edit-modal #lstBox1').html(allOutcomesList);
}
function populateRanks(seriesTypeId) {
	var rankList = globalSeriesRankList[seriesTypeId];
	var relevantRanksList = '';

	if (rankList !== '' && rankList !== undefined && rankList !== null) {
		$.each(rankList, function(index, rank) {
			relevantRanksList += '<option value=' + rank.rankTypeId + '>' + rank.rankTypeDisplayText
					+ '</option>';
		});
	}
	$('#edit-modal #lstBox2').html("");
	$('#edit-modal #lstBox2').html(relevantRanksList);

	var allRanksList = '';

	if (globalRankList !== undefined && globalRankList !== null) {
		$.each(globalRankList, function(index, rank) {
			var rankOption = '<option value=' + rank.rankTypeId + '>' + rank.rankTypeDisplayText
					+ '</option>';
			if (allRanksList.indexOf(rankOption) === -1
					&& relevantRanksList.indexOf(rankOption) === -1)
				allRanksList += rankOption;
		});
	}
	$('#edit-modal #lstBox1').html("");
	$('#edit-modal #lstBox1').html(allRanksList);
}
function populateSteps(seriesRankTypeId) {
	var stepList = globalSeriesRankStepList[seriesRankTypeId];
	var relevantStepsList = '';

	if (stepList !== '' && stepList !== undefined && stepList !== null) {
		$.each(stepList, function(index, step) {
			relevantStepsList += '<option value=' + step.stepTypeId + '>' + step.stepName
					+ '</option>';
		});
	}
	$('#edit-modal #lstBox2').html("");
	$('#edit-modal #lstBox2').html(relevantStepsList);

	var allStepsList = '';

	if (globalStepList !== undefined && globalStepList !== null) {
		$.each(globalStepList, function(index, step) {
			var stepOption = '<option value=' + step.stepTypeId + '>' + step.stepName
					+ '</option>';
			if (allStepsList.indexOf(stepOption) === -1
					&& relevantStepsList.indexOf(stepOption) === -1)
				allStepsList += stepOption;
		});
	}
	$('#edit-modal #lstBox1').html("");
	$('#edit-modal #lstBox1').html(allStepsList);
}
$('#btnRight').click(function(e) {
	$('select').moveToListAndDelete('#lstBox1', '#lstBox2');
	e.preventDefault();
});

$('#btnAllRight').click(function(e) {
	$('select').moveAllToListAndDelete('#lstBox1', '#lstBox2');
	e.preventDefault();
});

$('#btnLeft').click(function(e) {
	$('select').moveToListAndDelete('#lstBox2', '#lstBox1');
	e.preventDefault();
});

$('#btnAllLeft').click(function(e) {
	$('select').moveAllToListAndDelete('#lstBox2', '#lstBox1');
	e.preventDefault();
});

// Clear fields when modal is Cancelled or Closed
$('#edit-modal .cancel').off('click').on('click', function() {
	clearFields();
});

$('#edit-modal .close').off('click').on('click', function() {
	clearFields();
});
$('#edit-modal .closeButton').off('click').on('click', function() {
	clearFields();
});
function clearFields() {
	$('#edit-modal #titleCode').val('');
	$('#edit-modal #lstBox1').html("");
	$('#edit-modal #lstBox2').html("");
}
$('#edit-modal .save')
		.off('click')
		.on(
				'click',
				function() {
					var URL = '';
					var dropdownId = '';
					var addedList = '';
					// URL and selected dropdown value based on pageName
					if (pageName === 'actionoutcome') {
						URL = "/restServices/rest/admin/saveActionOutcome?access_token="
								+ access_token
						dropdownId = $('#actionType').val();
					} else if (pageName === 'actiontitle') {
						URL = "/restServices/rest/admin/saveActionTypeTitleCode?access_token="
								+ access_token
						dropdownId = $('#titleCode').val();
					} else if (pageName === 'seriesrank') {
						URL = "/restServices/rest/admin/saveSeriesRankRele?access_token="
								+ access_token
						dropdownId = $('#seriesType').val();
					} else if (pageName === 'seriesrankstep') {
						URL = "/restServices/rest/admin/saveSeriesRankStepRele?access_token="
								+ access_token
						dropdownId = $('#seriesRankType').val();
					}
					// grabbing all the values of left side multiple select
					// window
					var opts = $('#lstBox2')[0].options;

					var array = $.map(opts, function(elem) {
						return (elem.value);
					});
					$.ajax({
						url : URL,
						type : 'POST',
						data : {
							dropdownId : dropdownId,
							addedList : array.toString(),
							adminName : adminData.adminName
						},
						success : function(data) {
							if (data == 0)
								$('#edit-modal').modal('hide');
							location.reload();
						},
						error : function(jqXHR, textStatus, errorThrown) {
							// alert(jqXHR.responseText);
							console.log("Error:", errorThrown);
							console.log(jqXHR.status);
							console.log("Text Status:", textStatus);
						}
					});
				});

$('#edit-ref-modal .save')
		.off('click')
		.on(
				'click',
				function() {
					var URL = '';

					var sendInfo='';
					var reqType = '';
					// URL and selected dropdown value based on pageName
					if (pageName === 'actiontype') {
						var actionTypeId = null;
						if ($('#actionType').val() !== undefined) {
							actionTypeId = $('#actionType').val();
						}
						URL = "/restServices/rest/admin/saveActionTypeRef?access_token="
							+ access_token;
//						URL = "/restServices/rest/admin/saveActionTypeRef?access_token="
//							+ access_token + "&actionTypeId=" + actionTypeId + "&actionCategory=" + $('#actionCategory').val() +
//									"&active=" + $('#active').val() +
//									"&actionTypeDescription=" + $('#actionTypeDescription').val() +
//									"&isValidForApptSet=" + $('#isValidForApptSet').val() +
//									"&isValidForCase=" + $('#isValidForCase').val() +
//									"&actionTypeDisplayText=" + $('#actionTypeDisplayText').val() +
//									"&actionTypeCode=" + $('#actionTypeCode').val();
						reqType = 'POST';
						
						var sendInfo = {	

							actionTypeId : actionTypeId,
							actionCategory : $('#actionCategory').val(),
							active : $('#active').val(),
							actionTypeDescription : $('#actionTypeDescription')
									.val(),
							isValidForApptSet : $('#isValidForApptSet')
									.val(),
							isValidForCase : $('#isValidForCase')
									.val(),
							actionTypeDisplayText : $('#actionTypeDisplayText')
									.val(),
							actionTypeCode : $('#actionTypeCode').val(),
							adminName : adminData.adminName

						};
					} if (pageName === 'titleCode') {
						URL = "/restServices/rest/admin/saveTitleCodeRef?access_token="
							+ access_token;
						reqType = 'POST';
						
						var sendInfo = {	

							titleCodeId : $('#titleCodeId').val(),
							active : $('#active').val(),
							isHscp : $('#isHscp').val(),
							adminName : adminData.adminName

						};
					} else if (pageName === 'seriestype') {
						URL = "/restServices/rest/admin/saveSeriesTypeRef?access_token="
								+ access_token;
						reqType = 'POST';
						var seriesTypeId = null;
						if ($('#seriesType').val() !== undefined) {
							seriesTypeId = $('#seriesType').val();
						}
						sendInfo = {

							seriesTypeId : seriesTypeId,
							active : $('#active').val(),
							seriesTypeDescription : $('#seriesTypeDescription')
									.val(),
							seriesTypeDisplayText : $('#seriesTypeDisplayText')
									.val(),
							seriesTypeCode : $('#seriesTypeCode').val(),
							adminName : adminData.adminName

						};
					} else if (pageName === 'ranktype') {
						URL = "/restServices/rest/admin/saveRankTypeRef?access_token="
								+ access_token;
						var rankTypeId = null;
						reqType = 'POST';
						if ($('#rankType').val() !== undefined) {
							rankTypeId = $('#rankType').val();
						}
						sendInfo = {
	
							rankTypeId : rankTypeId,
							active : $('#active').val(),
							rankTypeDescription : $('#rankTypeDescription')
									.val(),
							rankTypeDisplayText : $('#rankTypeDisplayText')
									.val(),
							rankTypeCode : $('#rankTypeCode').val(),
							adminName : adminData.adminName
	
						};
				    } else if (pageName === 'steptype') {
							URL = "/restServices/rest/admin/saveStepTypeRef?access_token="
								+ access_token;
						var stepTypeId = null;
						reqType = 'POST';
						if ($('#stepType').val() !== undefined) {
							stepTypeId = $('#stepType').val();
						}
						sendInfo = {
	
							stepTypeId : stepTypeId,
							active : $('#active').val(),
							stepTypeDescription : $('#stepTypeDescription')
									.val(),
							stepTypeDisplayText : $('#stepTypeDisplayText')
									.val(),
							stepTypeCode : $('#stepTypeCode').val(),
							adminName : adminData.adminName
	
						};
				    } else if (pageName === 'apptSetData') {
						URL = "/restServices/rest/admin/saveApptSetInfo?access_token="
							+ access_token;
						var stepTypeId = null;
						reqType = 'POST';
						sendInfo = {
	
							appointmentSetId : $('#apptSetId').val(),
							appointmentId : $('#apptId').val(),
							appointmentCategoryId : $('#apptCategoryType').val(),
							appointmentSetStartDt : $('#apptSetStartDt').val(),
							appointmentSetEndDt : $('#apptSetEndDt').val(),
							adminName : adminData.adminName
	
						};
				    }
					$.ajax({
						url : URL,
						type : reqType,
						data : sendInfo,
						success : function(data) {
							if (data == 0)
								$('#edit-ref-modal').modal('hide');
							location.reload();
						},
						error : function(jqXHR, textStatus, errorThrown) {
							// alert(jqXHR.responseText);
							console.log("Error:", errorThrown);
							console.log(jqXHR.status);
							if (data == 0)
								$('#edit-modal').modal('hide');
							console.log("Text Status:", textStatus);
						}
					});
				});

function htmlTitleCodeDropDown() {
	return generateHTMLField('titleCode', 'titleCodeContainer', 'Title Code',
			'select', '', 'col-md-9');
}

function htmlAllActionsDropDown() {
	return generateHTMLField('lstBox1', 'subject-info-box-1',
			'Available Action Types', 'selectMultiple', '', 'col-sm-5');
}

function htmlActionsRelevDropDown() {
	return generateHTMLField('lstBox2', 'subject-info-box-2',
			'Relevance Action Types', 'selectMultiple', '', 'col-sm-5');
}
function htmlActionDropDown() {
	return generateHTMLField('actionType', 'actionTypeContainer',
			'Action Type', 'select', '', 'col-sm-5');
}

function htmlAllOutcomesDropDown() {
	return generateHTMLField('lstBox1', 'subject-info-box-1',
			'Available Outcome Types', 'selectMultiple', '', 'col-sm-5');
}

function htmlOutcomeRelevDropDown() {
	return generateHTMLField('lstBox2', 'subject-info-box-2',
			'Relevance Outcome Types', 'selectMultiple', '', 'col-sm-5');
}
function htmlSeriesDropDown() {
	return generateHTMLField('seriesType', 'seriesTypeContainer',
			'Series Type', 'select', '', 'col-sm-5');
}

function htmlAllRankDropDown() {
	return generateHTMLField('lstBox1', 'subject-info-box-1',
			'Available Rank Types', 'selectMultiple', '', 'col-sm-5');
}

function htmlRankRelevDropDown() {
	return generateHTMLField('lstBox2', 'subject-info-box-2',
			'Relevance Rank Types', 'selectMultiple', '', 'col-sm-5');
}
function htmlSeriesRankDropDown() {
	return generateHTMLField('seriesRankType', 'seriesRankTypeContainer',
			'Series Rank Type', 'select', '', 'col-sm-5');
}

function htmlAllStepDropDown() {
	return generateHTMLField('lstBox1', 'subject-info-box-1',
			'Available Step Types', 'selectMultiple', '', 'col-sm-5');
}

function htmlStepRelevDropDown() {
	return generateHTMLField('lstBox2', 'subject-info-box-2',
			'Relevance Step Types', 'selectMultiple', '', 'col-sm-5');
}
function setTooltip(tooltipName) {
	return '<a data-toggle="popover" tabindex="0" data-trigger="focus" data-html="true" data-content='
			+ fillBlanks(tooltipName)
			+ '>'
			+ '<span aria-hidden="true" class="icon-help-circled help"></span>'
			+ '</a>';
}
function htmlActionTypeDescription() {
	return generateHTMLField('actionTypeDescription',
			'actionTypeDescriptionContainer', 'Action Type Description',
			'input', '', 'col-sm-5');
}
function htmlActionTypeDisplayText() {
	return generateHTMLField('actionTypeDisplayText',
			'actionTypeDisplayTextContainer', 'Action Type Display Text',
			'input', '', 'col-sm-5');
}
function htmlTitleCodeDescription() {
	return generateHTMLField('titleCodeDescription',
			'titleCodeDescriptionContainer', 'Title Code Description',
			'input', '', 'col-sm-7');
}
function htmlTitleCodeDisplayText() {
	return generateHTMLField('titleCodeDisplayText',
			'titleCodeDisplayTextContainer', 'Title Code Display Text',
			'input', '', 'col-md-7');
}
function htmlTitleCode() {
	return generateHTMLField('titleCode',
			'titleCodeContainer', 'Title Code',
			'input', '', 'col-sm-2');
}
function htmlTitleCodeId() {
	return generateHTMLField('titleCodeId',
			'titleCodeIdContainer', 'Title Code Id',
			'input', '', 'col-sm-2');
}
function htmlActionTypeCode() {
	return generateHTMLField('actionTypeCode', 'actionTypeCodeContainer',
			'Action Type Code', 'input', '', 'col-sm-5');
}

function htmlActionTypeDropDown() {
	return generateHTMLField('actionType', 'actionTypeContainer',
			'Action Type', 'select', '', 'col-sm-5');
}
function htmlSeriesTypeDropDown() {
	return generateHTMLField('seriesType', 'seriesTypeContainer',
			'Series Type', 'select', '', 'col-sm-5');
}

function htmlRankTypeDropDown() {
	return generateHTMLField('rankType', 'rankTypeContainer',
			'Rank Type', 'select', '', 'col-sm-5');
}

function htmlRankTypeDescription() {
	return generateHTMLField('rankTypeDescription',
			'rankTypeDescriptionContainer', 'Rank Type Description',
			'input', '', 'col-sm-5');
}
function htmlRankTypeDisplayText() {
	return generateHTMLField('rankTypeDisplayText',
			'rankTypeDisplayTextContainer', 'Rank Type Display Text',
			'input', '', 'col-sm-5');
}
function htmlRankTypeCode() {
	return generateHTMLField('rankTypeCode', 'rankTypeCodeContainer',
			'Rank Type Code', 'input', '', 'col-sm-5');
}

function htmlStepTypeDropDown() {
	return generateHTMLField('stepType', 'stepTypeContainer',
			'Step Type', 'select', '', 'col-sm-5');
}

function htmlStepTypeDescription() {
	return generateHTMLField('stepTypeDescription',
			'stepTypeDescriptionContainer', 'Step Type Description',
			'input', '', 'col-sm-5');
}
function htmlStepTypeDisplayText() {
	return generateHTMLField('stepTypeDisplayText',
			'stepTypeDisplayTextContainer', 'Step Type Display Text',
			'input', '', 'col-sm-5');
}
function htmlStepTypeCode() {
	return generateHTMLField('stepTypeCode', 'stepTypeCodeContainer',
			'Step Type Code', 'input', '', 'col-sm-5');
}

function htmlSeriesTypeDescription() {
	return generateHTMLField('seriesTypeDescription',
			'seriesTypeDescriptionContainer', 'Series Type Description',
			'input', '', 'col-sm-5');
}
function htmlSeriesTypeDisplayText() {
	return generateHTMLField('seriesTypeDisplayText',
			'seriesTypeDisplayTextContainer', 'Series Type Display Text',
			'input', '', 'col-sm-5');
}
function htmlSeriesTypeCode() {
	return generateHTMLField('seriesTypeCode', 'seriesTypeCodeContainer',
			'Series Type Code', 'input', '', 'col-sm-5');
}

function htmlActionCategoryDropDown() {
	return generateHTMLField('actionCategory', 'actionCategoryContainer',
			'Action Category', 'select', '', 'col-sm-5');
}
function htmlActiveDropDown() {
	return generateHTMLField('active', 'activeContainer', 'Active', 'select',
			'', 'col-sm-2');
}
function htmlIsHSCPDropDown() {
	return generateHTMLField('isHscp', 'isHscpContainer', 'HSCP Flag', 'select',
			'', 'col-sm-2');
}
function htmlIsValidForApptSetDropDown() {
	return generateHTMLField('isValidForApptSet', 'activeContainer', 'Is Valid for Appointment Set', 'select',
			'', 'col-sm-5');
}
function htmlIsValidForCaseDropDown() {
	return generateHTMLField('isValidForCase', 'activeContainer', 'Is Valid for Case', 'select',
			'', 'col-sm-5');
}
function htmlAppointeeName() {
	return generateHTMLField('appointeeName', 'apptSetContainer', 'Appointee Name', 'input',
			'', 'col-sm-5');
}
function htmlApptSetStartDt() {
	return generateHTMLField('apptSetStartDt', 'apptSetContainer', 'Appointment Set Start Date', 'input',
			'', 'col-sm-5');
}
function htmlApptSetEndDt() {
	return generateHTMLField('apptSetEndDt', 'apptSetContainer', 'Appointment Set End Date', 'input',
			'', 'col-sm-5');
}
function htmlApptSetId() {
	return generateHTMLField('apptSetId', 'apptSetContainer', 'Appointment Set ID', 'input',
			'', 'col-sm-5');
}
function htmlhiddentAppointmentId() {
	return generateHTMLField('apptId', 'apptSetContainer', '', 'hidden',
			'', 'col-sm-5');
}
function htmlAppointmentCategoryTypeDropDown() {
	return generateHTMLField('apptCategoryType', 'apptSetContainer', 'Appointment Set Category Type', 'select',
			'', 'col-sm-5');
}
function generateHTMLField(id, divId, displayText, elementType, tooltip, length) {
	var htmlString = "";
	var tooltipText = "";

	if (tooltip !== '') {
		tooltipText = setTooltip(tooltip);
	}
	if (elementType === 'input') {
		htmlString = '<div id="' + divId + '" class="form-group">'
				+ '<div class="col-sm-4">' + '<label for="' + id
				+ '" class="control-label">' + displayText + '</label>'
				+ tooltipText + '</div>' + '<div class="' + length + '">'
				+ '<input title="' + displayText
				+ '" type="text" class="form-control" id="' + id + '">'
				+ '</div>' + '<div class="col-sm-5">'
				+ '<span class="help-block"></span>' + '</div>' + '</div>';
	} else if (elementType === 'hidden') {
		htmlString = '<div id="' + divId + '" class="form-group">'
		+ '<div class="col-sm-4">' + '<label for="' + id
		+ '" class="control-label">' + displayText + '</label>'
		+ tooltipText + '</div>' + '<div class="' + length + '">'
		+ '<input title="' + displayText
		+ '" type="hidden" class="form-control" id="' + id + '">'
		+ '</div>' + '<div class="col-sm-5">'
		+ '<span class="help-block"></span>' + '</div>' + '</div>';
	} else if (elementType === 'select') {
		var feedbackLength;
		if (length === 'col-sm-3') {
			feedbackLength = 'col-sm-5';
		} else if (length === 'col-sm-5') {
			feedbackLength = 'col-sm-3';
		} else if (length === 'col-sm-6') {
			feedbackLength = 'col-sm-2';
		} else {
			feedbackLength = 'col-sm-5';
		}

		var tooltipText = "";
		htmlString = '<div id="' + divId + '" class="form-group">'
				+ '<div class="col-sm-4">' + '<label for="' + id
				+ '" class="control-label">' + displayText + '</label>'
				+ tooltipText + '</div>' + '<div class="' + length + '">'
				+ '<select title="' + displayText
				+ '" class="form-control" id="' + id + '"></select>' + '</div>'
				+ '<div class="' + feedbackLength + '">'
				+ '<span class="help-block"></span>' + '</div>' + '</div>';
	} else if (elementType === 'selectMultiple') {
		htmlString = '<label for="' + id + '" class="control-label">'
				+ displayText + '</label>' + '<select multiple title="'
				+ displayText + '" class="form-control" id="' + id
				+ '"></select>';
	}

	return htmlString;
}