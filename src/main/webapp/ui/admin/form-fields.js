	//Default Fields
	function htmlCandidateToDepartmentSubmittedDate() {
		return generateHTMLField('candidateToDepartmentSubmittedDate', 'candidateToDepartmentSubmittedDateContainer', 'Submitted to Dept by Candidate', 'date', '', '');
	}
	
	function htmlDepartmentToDeanSubmittedDate() {
		return generateHTMLField('departmentToDeanSubmittedDate', 'departmentToDeanSubmittedDateContainer', 'Submitted to Dean’s Office by Dept', 'date', '', '');
	}
	
	function htmlDeanToAPOSubmittedDate() {
		return generateHTMLField('deanToAPOSubmittedDate', 'deanToAPOSubmittedDateContainer', 'Submitted to APO by Dean’s Office', 'date', '', '');
	}
	
	//Proposed and Approved Fields
	function htmlProposedOutcome() {
		return generateHTMLField('proposedOutcome', 'proposedOutcomeContainer', 'Proposed Outcome', 'select', '', 'col-sm-3');
	}
	
	function htmlApprovedOutcome() {
		return generateHTMLField('approvedOutcome', 'approvedOutcomeContainer', 'Approved Outcome', 'select', '', 'col-sm-3');			
	}
	
	function htmlProposedEffectiveDate() {
		return generateHTMLField('proposedEffectiveDate', 'proposedEffectiveDateContainer', 'Proposed Effective Date', 'date', effectiveDateTooltip, '');
	}
	
	function htmlApprovedEffectiveDate() {
		return generateHTMLField('approvedEffectiveDate', 'approvedEffectiveDateContainer', 'Approved Effective Date', 'date', effectiveDateTooltip, '');
	}
	
	function htmlProposedTitleCode() {
		return generateHTMLField('proposedTitleCode', 'proposedTitleCodeContainer', 'Proposed Title Code', 'select', '', 'col-sm-5');		
	}
	
	function htmlApprovedTitleCode() {
		return generateHTMLField('approvedTitleCode', 'approvedTitleCodeContainer', 'Approved Title Code', 'select', '', 'col-sm-5');		
	}
	
	function htmlProposedPayrollTitle() {
		return generateHTMLField('proposedPayrollTitle', 'proposedPayrollTitleContainer', 'Proposed Payroll Title', 'span', '', '');		
	}
	
	function htmlApprovedPayrollTitle() {
		return generateHTMLField('approvedPayrollTitle', 'approvedPayrollTitleContainer', 'Approved Payroll Title', 'span', '', '');		
	}
	
	function htmlProposedBaseSalary() {
		return generateHTMLField('proposedBaseSalary', 'proposedBaseSalaryContainer', 'Proposed Base Salary', 'salary', '', '');		
	}
	
	function htmlApprovedBaseSalary() {
		return generateHTMLField('approvedBaseSalary', 'approvedBaseSalaryContainer', 'Approved Base Salary', 'salary', '', '');		
	}
	
	function htmlProposedPercentTime() {
		return generateHTMLField('proposedPercentTime', 'proposedPercentTimeContainer', 'Proposed Percent Time', 'percent', '', '');		
	}
	
	function htmlApprovedPercentTime() {
		return generateHTMLField('approvedPercentTime', 'approvedPercentTimeContainer', 'Approved Percent Time', 'percent', '', '');		
	}
	
	function htmlProposedDepartment() {
		return generateHTMLField('proposedDepartment', 'proposedDepartmentContainer', 'Proposed Department', 'select', '', 'col-sm-6');			
	}
	
	function htmlApprovedDepartment() {
		return generateHTMLField('approvedDepartment', 'approvedDepartmentContainer', 'Approved Department', 'select', '', 'col-sm-6');		
	}
	
	function htmlProposedAffiliation() {
		return generateHTMLField('proposedAffiliation', 'proposedAffiliationContainer', 'Proposed Affiliation', 'select', affiliationGeneralTooltip, 'col-sm-3');			
	}
	
	function htmlApprovedAffiliation() {
		return generateHTMLField('approvedAffiliation', 'approvedAffiliationContainer', 'Approved Affiliation', 'select', affiliationGeneralTooltip, 'col-sm-3');			
	}
	
	function htmlProposedStepType() {
		return generateHTMLField('proposedStepType', 'proposedStepTypeContainer', 'Proposed Step', 'select', '', 'col-sm-3');		
	}
	
	function htmlApprovedStepType() {
		return generateHTMLField('approvedStepType', 'approvedStepTypeContainer', 'Approved Step', 'select', '', 'col-sm-3');		
	}

	function htmlApprovedSeriesStartDate() {
		return generateHTMLField('approvedSeriesStartDate', 'approvedSeriesStartDateContainer', 'Approved Series Start Date', 'date', '', '');
	}
	
	function htmlApprovedRankStartDate() {
		return generateHTMLField('approvedRankStartDate', 'approvedRankStartDateContainer', 'Approved Rank Start Date', 'date', '', '');
	}
	
	
	function htmlApprovedStepStartDate() {
		return generateHTMLField('approvedStepStartDate', 'approvedStepStartDateContainer', 'Approved Step Start Date', 'date', '', '');
	}
		
	function htmlProposedOnScaleSalary() {
		return generateHTMLField('proposedOnScaleSalary', 'proposedOnScaleSalaryContainer', 'Proposed On Scale Salary', 'input', onScaleSalaryTooltip, '');		
	}
	
	function htmlApprovedOnScaleSalary() {
		return generateHTMLField('approvedOnScaleSalary', 'approvedOnScaleSalaryContainer', 'Approved On Scale Salary', 'input', onScaleSalaryTooltip, '');		
	}
	
	function htmlProposedAppointmentEndDate() {
		return generateHTMLField('proposedAppointmentEndDate', 'proposedAppointmentEndDateContainer', 'Proposed Appointment End Date', 'date', appointmentEndDateGeneralTooltip, '');
	}
	
	function htmlApprovedAppointmentEndDate() {
		return generateHTMLField('approvedAppointmentEndDate', 'approvedAppointmentEndDateContainer', 'Approved Appointment End Date', 'date', appointmentEndDateGeneralTooltip, '');
	}
	
	function htmlProposedWaiverEndDate() {
		return generateHTMLField('proposedWaiverEndDate', 'proposedWaiverEndDateContainer', 'Proposed Waiver End Date', 'date', '', '');
	}
	
	function htmlApprovedWaiverEndDate() {
		return generateHTMLField('approvedWaiverEndDate', 'approvedWaiverEndDateContainer', 'Approved Waiver End Date', 'date', '', '');
	}
	
	function htmlProposedWaiverTermLength() {
		return generateHTMLField('proposedWaiverTermLength', 'proposedWaiverTermLengthContainer', 'Proposed Waiver Term Length', 'span', waiverTermLengthTooltip, '');		
	}
	
	function htmlApprovedWaiverTermLength() {
		return generateHTMLField('approvedWaiverTermLength', 'approvedWaiverTermLengthContainer', 'Approved Waiver Term Length', 'span', waiverTermLengthTooltip, '');		
	}
	
	//Other
	function htmlYearsDeferred() {
		return generateHTMLField('yearsDeferred', 'yearsDeferredContainer', 'Years Deferred', 'input', yearsDeferredTooltip, '');
	}
	
	function htmlYearsAccelerated() {
		return generateHTMLField('yearsAccelerated', 'yearsAcceleratedContainer', 'Years Accelerated', 'input', yearsAcceleratedTooltip, '');
	}
		
	function htmlCurrentStep() {
		return generateHTMLField('currentStep', 'currentStepContainer', 'Current Step', 'select', '', 'col-sm-3');		
	}
		
	function htmlArea() {
		return generateHTMLField('area', 'areaContainer', 'Area', 'select', areaTooltip, 'col-sm-5');		
	}
	
	function htmlSpecialty() {
		return generateHTMLField('specialty', 'specialtyContainer', 'Specialty', 'select', specialtyTooltip, 'col-sm-5');		
	}
	
	function setTooltip(tooltipName) {
		return '<a data-toggle="popover" tabindex="0" data-trigger="focus" data-html="true" data-content=' + fillBlanks(tooltipName) + '>'
		+ '<span aria-hidden="true" class="icon-help-circled help"></span>'
		+ '</a>';
	}
			
	function generateHTMLField(id, divId, displayText, elementType, tooltip, length) {
		var htmlString = "";
		var tooltipText = "";
		
		if (tooltip !== '') {
			tooltipText = setTooltip(tooltip);
		}
		
		if (elementType === 'input') {
			htmlString = '<div id="' + divId +'" class="form-group">'
				+ '<div class="col-sm-4">'
					+ '<label for="' + id +'" class="control-label">' + displayText + '</label>'
					+ tooltipText
				+ '</div>'
				+ '<div class="col-sm-3">'
						+ '<input title="' + displayText + '" type="text" class="form-control" id="' + id + '">'					
				+ '</div>'
				+ '<div class="col-sm-5">'
						+ '<span class="help-block"></span>'
				+ '</div>'		
			+ '</div>';
		}
		else if (elementType === 'select') {	
			var feedbackLength;
			if (length === 'col-sm-3') {
				feedbackLength = 'col-sm-5';
			}
			else if (length === 'col-sm-5') {
				feedbackLength = 'col-sm-3';
			}
			else if (length === 'col-sm-6') {
				feedbackLength = 'col-sm-2';
			}
			else {
				feedbackLength = 'col-sm-5';
			}
			
			var tooltipText = "";
			
			if (tooltip !== '') {
				tooltipText = setTooltip(tooltip);
			}
			
			htmlString = '<div id="' + divId +'" class="form-group">'
				+ '<div class="col-sm-4">'
					+ '<label for="' + id +'" class="control-label">' + displayText +'</label>'
					+ tooltipText
				+ '</div>'
				+ '<div class="' + length + '">'
						+ '<select title="' + displayText +'" type="text" class="form-control" id="' + id +'"></select>'					
				+ '</div>'
				+ '<div class="' + feedbackLength + '">'
						+ '<span class="help-block"></span>'
				+ '</div>'
			+ '</div>';
		}
		else if (elementType === 'date') {
			var tooltipText = "";
			
			if (tooltip !== '') {
				tooltipText = setTooltip(tooltip);
			}
			
			htmlString = '<div id="' + divId +'" class="form-group">'
				+ '<div class="col-sm-4">'
					+ '<label for="' + id + '" class="control-label">' + displayText + '</label>'
					+ tooltipText
				+ '</div>'
				+ '<div class="col-sm-3">'
					+ '<input title="' + displayText + '" type="text" class="form-control" id="' + id +'">'
				+ '</div>'
				+ '<div class="col-sm-5">'
					+ '<span class="help-block"></span>'	
				+ '</div>'
				+ '</div>';
		}
		else if (elementType === 'salary') {
			var tooltipText = "";
			
			if (tooltip !== '') {
				tooltipText = setTooltip(tooltip);
			}
			
			htmlString = '<div id="' + divId +'" class="form-group">'
				+ '<div class="col-sm-4">'
					+ '<label for="' + id + '" class="control-label">' + displayText + '</label>'
					+ tooltipText
				+ '</div>'
				+ '<div class="col-sm-3">'
						+ '<input title="' + displayText + '" type="text" maxlength="7" class="form-control" id="' + id + '">'
				+ '</div>'
				+ '<div class="col-sm-5">'
						+ '<span class="help-block"></span>'
				+ '</div>'
			+ '</div>';	
		}
		else if (elementType === 'percent') {
			var tooltipText = "";
			
			if (tooltip !== '') {
				tooltipText = setTooltip(tooltip);
			}
			
			htmlString = '<div id="' + divId +'" class="form-group">'
			+ '<div class="col-sm-4">'
				+ '<label for="' + id + '" class="control-label">' + displayText + '</label>'
				+ tooltipText
			+ '</div>'
			+ '<div class="col-sm-3">'
					+ '<input title="' + displayText + '" type="text" maxlength="3" class="form-control" id="' + id + '">'
			+ '</div>'
			+ '<div class="col-sm-5">'
					+ '<span class="help-block"></span>'
			+ '</div>'
		+ '</div>';
		}
		else if (elementType === 'span') {
			var tooltipText = "";
			
			if (tooltip !== '') {
				tooltipText = setTooltip(tooltip);
			}
			
			htmlString = '<div id="' + divId +'" class="form-group">'
			+ '<div class="col-sm-4">'
				+ '<label for="' + id + '" class="control-label">' + displayText + '</label>'
				+ tooltipText
			+ '</div>'
			+ '<div class="col-sm-3">'
					+ '<span title="' + displayText + '" id="' + id + '">'
			+ '</div>'
			+ '<div class="col-sm-5">'
					+ '<span class="help-block"></span>'
			+ '</div>'
		+ '</div>';
		}
		else {
			//Do Nothing
		}
		
		return htmlString;
	}
	
	//Dropdowns
	function generateDepartmentDropdown(elementId, value) {
		var departmentsDropdown = '';
			departmentsDropdown += '<option></option>';
		
		if (globalDepartmentsList !== undefined && globalDepartmentsList !== null) {
			$.each(globalDepartmentsList, function(index, dept) {
				departmentsDropdown += '<option value='+dept.academicHierarchyPathId+'>' + dept.name + '</option>';
			});
		}	
		
		$(elementId).html("");
		$(elementId).html(departmentsDropdown); 
		if (value !== '' && value !== undefined && value !== null) {
			$(elementId).val(value);
		}
	}
	
	function generateTitleCodeDropdown(elementId, value) {
		var titleCodeDropdown = '';
			titleCodeDropdown += '<option></option>';
		
		if (globalTitleCodesHashmap !== undefined && globalTitleCodesHashmap !== null) {
			$.each(globalTitleCodesHashmap, function(index, tc) {
				titleCodeDropdown += '<option value='+tc.titleCodeId+'>' + tc.titleCode + ' - ' + tc.payrollTitle + '</option>';
			});
		}
				
		$(elementId).html("");
		$(elementId).html(titleCodeDropdown); 
		if (value !== '' && value !== undefined && value !== null) {
			$(elementId).val(value);
		} 
	}
	
	function generateRestrictedTitleCodeDropdown(elementId, value, selectedActionTypeCode, series) {
		var titleCodeDropdown = '';
			titleCodeDropdown += '<option></option>';
						
			if (globalTitleCodesHashmap !== undefined && globalTitleCodesHashmap !== null) {				
				if (selectedActionTypeCode === ACADEMIC_ADMINISTRATIVE_APPOINTMENT) {
					$.each(globalTitleCodesHashmap, function(index, tc) {
						if (tc.academicAdministrative === true) {
							titleCodeDropdown += '<option value='+tc.titleCodeId+'>' + tc.titleCode + ' - ' +tc.payrollTitle + '</option>'; 
						}
					});
				}
				else if ((selectedActionTypeCode === APPOINTMENT || selectedActionTypeCode === CHANGE_OF_DEPARTMENT || selectedActionTypeCode === CONVERT_HSCP
						|| selectedActionTypeCode === JOINT_APPOINTMENT || selectedActionTypeCode === PROMOTION || selectedActionTypeCode === SPLIT_APPOINTMENT
						|| selectedActionTypeCode === MERIT_EQUITY_REVIEW) && series !== null && series !== '' && series !== undefined) {
					$.each(globalTitleCodesHashmap, function(index, tc) {
						if (tc.series === series) {
							titleCodeDropdown += '<option value='+tc.titleCodeId+'>' + tc.titleCode + ' - ' +tc.payrollTitle + '</option>'; 
						}
					});
				}
				else if (selectedActionTypeCode === RECALL) {
					$.each(globalTitleCodesHashmap, function(index, tc) {
						if (tc.series === 'Recall/VERIP') {
							titleCodeDropdown += '<option value='+tc.titleCodeId+'>' + tc.titleCode + ' - ' +tc.payrollTitle + '</option>'; 
						}
					});	
				}
				else if (selectedActionTypeCode === CONTINUING_APPT || selectedActionTypeCode === UNIT18_TEMP_AUGMENTATION) {
					$.each(globalTitleCodesHashmap, function(index, tc) {
						if (tc.unit18Continuing === 'Y') {
							titleCodeDropdown += '<option value='+tc.titleCodeId+'>' + tc.titleCode + ' - ' +tc.payrollTitle + '</option>'; 
						}
					});
				}
			}
			$(elementId).html("");
			$(elementId).html(titleCodeDropdown); 			
			if (value !== '' && value !== undefined && value !== null) {
				$(elementId).val(value);
			}
	}
	
	function generateAffiliationDropdown(elementId, selectedAppointmentObject) {
		var affiliationDropdown = '<option></option><option value="1">Primary</option><option value="2">Additional</option>';
		
		$(elementId).html("");
		$(elementId).html(affiliationDropdown); 
			
		var affil;
		if (selectedAppointmentObject.affiliation === "Primary") {
			affil = '1';
		}
		else {
			affil = '2';
		}
		
		$(elementId).val(affil);
	}
	
	function generateStepDropdown(titleCodeId, elementId, value) {
		var titleInformationObject = globalTitleCodesHashmap[titleCodeId];
		
		var stepDropdown = '';
		stepDropdown += '<option></option>';

		if (titleInformationObject !== undefined && titleInformationObject !== null) {
			$(titleInformationObject.steps).each(function(index, step) {
				stepDropdown += '<option value=' + step.onScaleSalary + '>' + step.name + '</option>'; 
			});
		}
		
		$(elementId).html("");
		$(elementId).html(stepDropdown); 
		
		if (value !== '' && value !== undefined && value !== null) {
			$(elementId).val(value);
			if(elementId === '#case-fields #proposedStepType') {
				$('#case-fields #proposedHiddenStepId').val(value);
			}
			else if(elementId === '#case-fields #approvedStepType') {
				$('#case-fields #approvedHiddenStepId').val(value);
			}
		}
	}
	
	function generateOutcomeDropdown(selectedActionTypeCode, elementId, value) {
		var actionOutcomeList = globalActionOutcomesList[selectedActionTypeCode];
			
		var actionOutcomeDropdown = '';
		actionOutcomeDropdown += '<option></option>';
			
		if (actionOutcomeList !== undefined && actionOutcomeList !== null) {
			$.each(actionOutcomeList, function(index, outcome) {
				actionOutcomeDropdown += '<option value='+outcome.code+'>' + outcome.name + '</option>';
			});
		}
		
		$(elementId).html("");
		$(elementId).html(actionOutcomeDropdown);  
		
		if (value !== '' && value !== undefined && value !== null) {
			$(elementId).val(value);
		}
	}

	var htmlNACurrentStepAndDate = '<input title="Step Type Id Na" type="hidden" maxlength="8" class="form-control" id="stepTypeIdNa" value="0">'
		       +'<input title="Step Type Txt" type="hidden" id="stepTypeTxtNa" value="N/A">'
			   + '<input title="Current Step Start Date Na" type="hidden" class="form-control" id="currentStepStartDateNa" value="">';

		