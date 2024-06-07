var globalTitleCodesHashmap;	//Ok to be global because it never changes
var globalActionTypesList;      //Ok to be global because it never changes
var globalActionOutcomesList;	//Ok to be global because it never changes
var globalDepartmentsList;		//Ok to be global because it never changes
var isSuperUserRole;			//Ok to be global because it never changes
var pageName;

function initializeCaseFields(selectedName, selectedActionType, selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase, inProgressActionRowId, pgName) {
		
	var appointmentData = getAppointmentFieldString(selectedAppointmentObject);
	pageName = pgName;
			
	//Only show the Submit button and Approved section (since it shows the header by default) if role is OA or APO	
	if (!isSuperUserRole) {
		$('#case-fields #approved-section').hide();
		$('#case-fields .submit').hide();		
	}
	else {
		$('#case-fields #approved-section').show();
		$('#case-fields .submit').show();	
	}
	
	$('#case-fields .modal-heading-text').text('');
	
	//Show and hide elements based on whether or not it's a new case
	if (isNewCase) {
		$('#choose-action').modal('hide');
		$('#case-fields .back').show();

		$('#case-fields .modal-heading-text').text('Start a New Case');
	}
	else {
		$('#case-fields .back').hide();
		if (pageName === 'active') {
			$('#case-fields .modal-heading-text').text('Active Case');
		}
		else if (pageName === 'completed') {
			$('#case-fields .modal-heading-text').text('Completed Case');
		}
	}
	
	//Show the modal
	$('#case-fields .closeButton').hide();
	$('#case-fields').modal('show');
	$('#proposed-section').show();
	
	//Print case info
	$('#case-fields .appointee-name').html(unescape(selectedName));
	$('#case-fields .appointee-name').addClass('displayName');
	$('#case-fields .action-type').html(selectedActionType);
	$('#case-fields .appointment').html('<p>' + appointmentData + '</p>');
	  
	$('#case-fields #default-fields').html("");
	
	//Certain action types do not have the default date fields
	if (selectedActionTypeCode !== CHANGE_PRIMARY_DEPT && selectedActionTypeCode !== INITIAL_WAIVER_REQUEST && selectedActionTypeCode !== WAIVER_RENEWAL && selectedActionTypeCode !== RANGE_ADJUSTMENT) {
		//Populate default fields
		var defaultFields =  htmlCandidateToDepartmentSubmittedDate()
							+ htmlDepartmentToDeanSubmittedDate()
							+ htmlDeanToAPOSubmittedDate();
		
		$('#case-fields #default-fields').html(defaultFields);
		
		//Populate the default fields if there are values from the DB
		$('#case-fields #candidateToDepartmentSubmittedDate').val(casesData.candidateToDepartmentSubmittedDt);
		$('#case-fields #departmentToDeanSubmittedDate').val(casesData.departmentToDeanSubmittedDt);
		$('#case-fields #deanToAPOSubmittedDate').val(casesData.deanToAPOSubmittedDt);
		
		$('#default-section').show();
	}
	else {
		$('#default-section').hide();
	}
		
	//Populate proposed (and approved) fields
	setProposedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
	
	//Set onchange events for proposed fields (onchange events for approved fields must be set after the HTML has been generated)
	onChangeApprovedOutcome(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
	onChangeTitleCode('#case-fields #proposedTitleCode', '#case-fields #proposedStepType', '#case-fields #proposedAppointmentEndDate', selectedActionTypeCode);
	onChangeStep('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
	 
	//Initialize popovers
	$('[data-toggle="popover"]').popover({trigger: 'hover','placement': 'top'},  {container: 'body'});
	
	//Save and Submit
	$('#case-fields .save').off('click').on('click', function() {
		var validInputs = true;
		
		$('#case-fields .help-block').each(function(index, helpField) {
			//Allow Save if user doesn't fill in a required field
			if ($(helpField).text() !== '' && $(helpField).text() !== 'Please fill out this required field.') {
				validInputs = false;
			}
		});
		
		//Very special case for salary field in completed cases being required for super user roles
		if (pageName === 'completed') {
			if (isSuperUserRole && $('#case-fields #approvedBaseSalary:visible').length && $('#case-fields #approvedBaseSalary').prop('disabled') === false) {
				if ($('#case-fields #approvedBaseSalary').val() === "" || $('#case-fields #approvedBaseSalary').val() === null || $('#case-fields #approvedBaseSalary').val() === undefined) {
					setValidationStatus(false, '#case-fields #approvedBaseSalaryContainer', '#case-fields #approvedBaseSalaryContainer .help-block', 'Please fill out this required field.');
					validInputs = false;
				}
			}
		}
		
		if (validInputs) {
			saveSubmitCase(selectedActionTypeCode, selectedAppointmentObject, 'save', inProgressActionRowId, isNewCase);
		}
		else {
			//Do nothing
		}	
	});
		
	$('#case-fields .submit').off('click').on('click', function() {
		var validRequiredFields = onSubmitValidation(selectedActionTypeCode);
		var validInputs = true;
		
		$('#case-fields .help-block').each(function(index, helpField) {
			if ($(helpField).text() !== '') {
				validInputs = false;
			}
		});
		
		if (validRequiredFields && validInputs) {
			saveSubmitCase(selectedActionTypeCode, selectedAppointmentObject, 'submit', inProgressActionRowId, isNewCase);
		}
		else {
			//Do nothing
		}	
	});
	
	//Back
	$('#case-fields .back').off('click').on('click', function() {
		$('#case-fields').modal('hide');
		clearCaseFields();
		clearCaseFieldsValidationErrors();
		
		$('#choose-action').modal('show');
	});
		
	//Clear fields when modal is Cancelled or Closed
	$('#case-fields .cancel').off('click').on('click', function() {    				
		clearCaseFields();
		clearChooseActionFields();
		clearChooseNameFields();
		clearCaseFieldsValidationErrors();
	});
	
	$('#case-fields .close').off('click').on('click', function() {
		clearCaseFields();
		clearChooseActionFields();
		clearChooseNameFields();
		clearCaseFieldsValidationErrors();
	});
	
	setDateMasks();
	validateDateFields();
}

function setProposedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase) {
	
	var proposedFields;
		   				
	//Populate proposed fields based on action type, as well as approved fields based on role
	if (selectedActionTypeCode === FIVE_YEAR_REVIEW || selectedActionTypeCode === FOURTH_YEAR_APPRAISAL
		|| selectedActionTypeCode === EIGHT_YEAR_LIMIT || selectedActionTypeCode === EIGHT_YEAR_LIMIT_PRELIMINARY_ASSESSMENT 
		|| selectedActionTypeCode === EIGHT_YEAR_LIMIT_RECONSIDERATION || selectedActionTypeCode === ENDOWED_CHAIR_APPT) {

		proposedFields = htmlProposedOutcome() + htmlProposedEffectiveDate();
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
				
		//Outcome dropdown
		if (casesData.proposedActionOutcome !== undefined) {
			generateOutcomeDropdown(selectedActionTypeCode, '#case-fields #proposedOutcome', casesData.proposedActionOutcome.code);
		}
		else {
			generateOutcomeDropdown(selectedActionTypeCode, '#case-fields #proposedOutcome', '');
		}
		
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if(selectedActionTypeCode === RANGE_ADJUSTMENT){
	
		$('#case-fields #proposed-fields').html("");
		$( '#proposed-section' ).hide();//Proposed section is not required for this action type 
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
		
	}
	else if (selectedActionTypeCode === FOUR_YEAR_REVIEW || selectedActionTypeCode === MANDATORY_REVIEW
		|| selectedActionTypeCode === UNIT_18_NEED_ASSESSMENT || selectedActionTypeCode === CHANGE_PRIMARY_DEPT) {
		
		proposedFields = htmlProposedEffectiveDate();
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
			
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
			
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === ACADEMIC_ADMINISTRATIVE_APPOINTMENT) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedDepartment() + htmlProposedAffiliation() + htmlProposedPercentTime() 
						+ htmlProposedTitleCode() + htmlProposedBaseSalary()
						+ htmlProposedAppointmentEndDate();
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
				
		//Department dropdown 				
		generateDepartmentDropdown('#case-fields #proposedDepartment', selectedAppointmentObject.academicHierarchyPathId);	
	
		//Title code dropdown - restricted
		generateRestrictedTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);
	
		//Affiliation dropdown
		generateAffiliationDropdown('#case-fields #proposedAffiliation', selectedAppointmentObject);
		
		//Set Appointment End Date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
				
		//Disable fields
		disableField('#case-fields #proposedDepartment');
		disableField('#case-fields #proposedAffiliation');
		
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === APPOINTMENT) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedDepartment() + htmlProposedAffiliation() + htmlProposedPercentTime() 
						+ htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary()
						+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
											   	   				
		//Department dropdown
		generateDepartmentDropdown('#case-fields #proposedDepartment', selectedAppointmentObject.academicHierarchyPathId);
	  	   				
		//Affiliation dropdown
		generateAffiliationDropdown('#case-fields #proposedAffiliation', selectedAppointmentObject);

		//Unrestricted title code dropdown
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId);	
		
		//Set Appointment End Date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
		
		//Step dropdown - special case if the title code was saved in DB.  Also set appointment end date and N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', APPOINTMENT);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}
		
		//Set onscale if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		  			
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		disableField('#case-fields #proposedDepartment');
		disableField('#case-fields #proposedAffiliation');
		
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
	
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === JOINT_APPOINTMENT) {
			
		proposedFields = htmlProposedEffectiveDate() + htmlProposedDepartment() + htmlProposedAffiliation() + htmlProposedPercentTime() 
						+ htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedOnScaleSalary()
						+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
						   	   				
		//Department dropdown
		generateDepartmentDropdown('#case-fields #proposedDepartment', selectedAppointmentObject.academicHierarchyPathId);
	  	   				
		//Affiliation dropdown
		generateAffiliationDropdown('#case-fields #proposedAffiliation', selectedAppointmentObject);

		//Unrestricted title code dropdown
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId);	
		
		//Set Appointment End Date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);			
		
		//Step dropdown - special case if the title code was saved in DB.  Also set appointment end date and N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', JOINT_APPOINTMENT);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}
		
		//Set onscale if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		  	
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		disableField('#case-fields #proposedDepartment');
		disableField('#case-fields #proposedAffiliation');
		disableField('#case-fields #proposedPercentTime');
		
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Special case for Joint Appointment
		$('#case-fields #proposedPercentTime').val("0");
	
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === SPLIT_APPOINTMENT) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedDepartment() + htmlProposedAffiliation() + htmlProposedPercentTime() 
						+ htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedOnScaleSalary()
						+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
						   	   				
		//Department dropdown
		generateDepartmentDropdown('#case-fields #proposedDepartment', selectedAppointmentObject.academicHierarchyPathId);
	  	   				
		//Affiliation dropdown
		generateAffiliationDropdown('#case-fields #proposedAffiliation', selectedAppointmentObject);

		//Unrestricted title code dropdown
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId);	
		
		//Set Appointment End Date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);		
		
		//Step dropdown - special case if the title code was saved in DB.  Also set appointment end date and N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', SPLIT_APPOINTMENT);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}
		
		//Set onscale if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		  	
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		disableField('#case-fields #proposedDepartment');
		disableField('#case-fields #proposedAffiliation');
	
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === CHANGE_PERCENT_TIME) {
		proposedFields = htmlProposedEffectiveDate() + htmlProposedPercentTime();
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
					   							
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === CHANGE_IN_SERIES) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary() 
						+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Title code dropdown
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId);
		
		//Set Appointment End Date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);					
		
		//Step dropdown - special case.  Also set appointment end date and N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', CHANGE_IN_SERIES);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}
			
		//Set onscale salary if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
	
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === MERIT_EQUITY_REVIEW) {
			
		proposedFields = htmlProposedEffectiveDate() + htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary() 
						+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Title code dropdown
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId);
		
		//Set Appointment End Date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);					
		
		//Step dropdown - special case.  Also set appointment end date and N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', MERIT_EQUITY_REVIEW);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}  
			
		//Set onscale salary if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
	
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === CONVERT_HSCP) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary() 
						+ setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Restricted title code dropdown
		generateRestrictedTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
		
		//Step dropdown - special case. Set N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', CONVERT_HSCP);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}  
			
		//Set onscale salary if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
	
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === CHANGE_OF_DEPARTMENT) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedDepartment() + htmlProposedAffiliation() + htmlProposedPercentTime() 
					+ htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary()
					+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
					
		//Department dropdown - not prepopulated 
		generateDepartmentDropdown('#case-fields #proposedDepartment', casesData.proposedAcademicHierarchyPathId);					
		
		//Affiliation dropdown
		var specialAffiliationObject = {};
		specialAffiliationObject.affiliation = 'Primary';
		generateAffiliationDropdown('#case-fields #proposedAffiliation', specialAffiliationObject);

		//Set Appointment End Date
		setAppointmentEndDate(selectedAppointmentObject.titleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
		
		//Unrestricted title code dropdown - prepopulated.  Also set step, appointment end date and N/A if needed
		if (isNewCase) {
			generateTitleCodeDropdown('#case-fields #proposedTitleCode', selectedAppointmentObject.titleCodeId);
			setNaFields(selectedAppointmentObject.titleCodeId, 'proposed', CHANGE_OF_DEPARTMENT);
			generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}
		else {
			generateTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId);	
			if (casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
				setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
				setNaFields(casesData.proposedTitleCodeId, 'proposed', CHANGE_OF_DEPARTMENT);
			}
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}

		//Set onscale if step has been prepopulated
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
			
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		disableField('#case-fields #proposedAffiliation');
		  
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === OFF_SCALE_SALARY) {
		proposedFields = htmlProposedEffectiveDate() + htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary()
						+ setHiddenStepValue("proposedHiddenStepId");									
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
			
		//Unrestricted title code dropdown - prepopulated. Also set step and N/A if needed.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', selectedAppointmentObject.titleCodeId);
		if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
			setNaFields(selectedAppointmentObject.titleCodeId, 'proposed', OFF_SCALE_SALARY);
		}
		generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #proposedStepType', selectedAppointmentObject.stepOnScaleSalary);	
		
		//If the onscale salary hasn't been set yet, set it here if step has a value
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			//Set onscale salary since step is prepopulated
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		disableField('#case-fields #proposedTitleCode');
		disableField('#case-fields #proposedStepType');
			
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === MERIT) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlYearsAccelerated() + htmlYearsDeferred() + htmlProposedTitleCode() + htmlProposedStepType() 
						+ htmlProposedBaseSalary() + htmlProposedOnScaleSalary() + setHiddenStepValue("proposedHiddenStepId");
		
		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Unrestricted title code dropdown - prepopulated.  Also set step and N/A if needed.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', selectedAppointmentObject.titleCodeId);	
		if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
			setNaFields(selectedAppointmentObject.titleCodeId, 'proposed', MERIT);	
		}
		generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		
		//If the onscale salary hasn't been set yet, set it here if step has a value
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			//Set onscale salary since step is prepopulated
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		$('#case-fields #yearsDeferred').val(casesData.yearsDeferredCnt);
		$('#case-fields #yearsAccelerated').val(casesData.yearsAcceleratedCnt);
	
		//Years Acceleated/Years Deferred logic for on blur
		onChangeYearsDeferredAccelerated();
		
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
		disableField('#case-fields #proposedTitleCode');
				
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if(selectedActionTypeCode === PROMOTION) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlYearsAccelerated() + htmlYearsDeferred() + htmlProposedTitleCode() + htmlProposedStepType() 
						+ htmlProposedBaseSalary() + htmlProposedOnScaleSalary()
						+ htmlProposedAppointmentEndDate() + setHiddenStepValue("proposedHiddenStepId");

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);

		//Restricted title code dropdown
		generateRestrictedTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
		
		//Set Appointment End Date		
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
								
		//Step dropdown.  Also set appointment end date and N/A if needed
		if (!isNewCase && casesData.proposedTitleCodeId !== null && casesData.proposedTitleCodeId !== undefined && casesData.proposedTitleCodeId !== '') {
			setNaFields(casesData.proposedTitleCodeId, 'proposed', PROMOTION);
			generateStepDropdown(casesData.proposedTitleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		}

		//If the onscale salary hasn't been set yet, set it here if step has a value
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			//Set onscale salary since step is prepopulated
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		$('#case-fields #yearsDeferred').val(casesData.yearsDeferredCnt);
		$('#case-fields #yearsAccelerated').val(casesData.yearsAcceleratedCnt);
				
		//Years Acceleated/Years Deferred logic for on blur
		onChangeYearsDeferredAccelerated();
		
		//Disable fields
		disableField('#case-fields #proposedOnScaleSalary');
				
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === REAPPOINTMENT || selectedActionTypeCode === RENEWAL || selectedActionTypeCode === NON_RENEWAL) {
		
		proposedFields = htmlProposedAppointmentEndDate();

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedAppointmentEndDate').val(casesData.proposedAppointmentEndDt);

		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === STEP_UNSTEP) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedTitleCode() + htmlProposedStepType() + htmlProposedBaseSalary() + htmlProposedOnScaleSalary() + setHiddenStepValue("proposedHiddenStepId");

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
				
		//Unrestricted title code dropdown - prepopulated.  Also set step and N/A if needed.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', selectedAppointmentObject.titleCodeId);	
		if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
			setNaFields(selectedAppointmentObject.titleCodeId, 'proposed', STEP_UNSTEP);	
		}
		generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #proposedStepType', casesData.proposedStepOnScaleSalary);
		
		//If the onscale salary hasn't been set yet, set it here if step has a value
		if ($('#case-fields #proposedStepType').val() !== null && $('#case-fields #proposedStepType').val() !== '' && $('#case-fields #proposedStepType').val() !== undefined && $('#case-fields #proposedOnScaleSalary:visible').length) {
			//Set onscale salary since step is prepopulated
			setOnscaleSalary('#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary');
		}
		
		//Disable fields
		disableField('#case-fields #proposedTitleCode'); 
		disableField('#case-fields #proposedOnScaleSalary'); 
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === UNIT18_FOURTH_YEAR_INCREASE) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedTitleCode() + htmlProposedBaseSalary();									

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Unrestricted title code dropdown - prepopulated
		generateTitleCodeDropdown('#case-fields #proposedTitleCode', selectedAppointmentObject.titleCodeId);	

		//Disable fields
		disableField('#case-fields #proposedTitleCode');
					
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === CONTINUING_APPT) {
			
		proposedFields = htmlProposedEffectiveDate() + htmlProposedPercentTime() + htmlProposedTitleCode() + htmlProposedBaseSalary();  									

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
			
		//Restricted title code dropdown
		generateRestrictedTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
			
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === UNIT18_TEMP_AUGMENTATION) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedPercentTime() + htmlProposedTitleCode() + htmlProposedBaseSalary()
						+ htmlProposedAppointmentEndDate();  									

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
			
		//Restricted title code dropdown
		generateRestrictedTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
			
		//Set appointment end date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
		
		//Populate simple fields if values exist in DB
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === INITIAL_WAIVER_REQUEST || selectedActionTypeCode === WAIVER_RENEWAL) {
		
		proposedFields = htmlProposedEffectiveDate() + htmlProposedWaiverEndDate() + htmlProposedWaiverTermLength();  									

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Populate simple fields if values exist in DB - need to be set before waiver logic happens
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		$('#case-fields #proposedWaiverEndDate').val(casesData.proposedWaiverEndDt);
		
		//Set on change for waiver term length
		onChangeWaiverDates('#case-fields #proposedEffectiveDate', '#case-fields #proposedWaiverEndDate', '#case-fields #proposedWaiverTermLength');
		
		//Set the waiver term length if both dates are populated
		waiverDateLogic('#case-fields #proposedEffectiveDate', '#case-fields #proposedWaiverEndDate', '#case-fields #proposedWaiverTermLength');
				
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else if (selectedActionTypeCode === RECALL) {
			
		proposedFields = htmlProposedEffectiveDate() + htmlProposedDepartment() + htmlProposedAffiliation() + htmlProposedPercentTime() 
						+ htmlProposedTitleCode() + htmlProposedBaseSalary()
						+ htmlProposedAppointmentEndDate();  									

		$('#case-fields #proposed-fields').html("");
		$('#case-fields #proposed-fields').html(proposedFields);
		
		//Department dropdown 		
		generateDepartmentDropdown('#case-fields #proposedDepartment', selectedAppointmentObject.academicHierarchyPathId);	
			 	   				
		//Affiliation dropdown
		generateAffiliationDropdown('#case-fields #proposedAffiliation', selectedAppointmentObject);
							
		//Restricted title code dropdown
		generateRestrictedTitleCodeDropdown('#case-fields #proposedTitleCode', casesData.proposedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
			
		//Set apointment end date
		setAppointmentEndDate(casesData.proposedTitleCodeId, '#case-fields #proposedAppointmentEndDate', casesData.proposedAppointmentEndDt);
		
		//Disable fields
		disableField('#case-fields #proposedAffiliation');
		disableField('#case-fields #proposedDepartment');
		
		//Populate simple fields if values exist in DB
		$('#case-fields #proposedPercentTime').val(casesData.proposedTimePct);
		if(casesData.proposedSalaryAmt != null && casesData.proposedSalaryAmt !== '' && casesData.proposedSalaryAmt != undefined) 
		    $('#case-fields #proposedBaseSalary').val(casesData.proposedSalaryAmt).formatCurrency();
		$('#case-fields #proposedEffectiveDate').val(casesData.proposedEffectiveDt);
		
		//Set approved fields if needed
		if (isSuperUserRole || pageName == 'completed') {
			setDefaultApprovedFields(selectedActionTypeCode, casesData);
			setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
		}
	}
	else {
		//Do Nothing
	}
			
	//Set 'optional' label
	if (pageName === 'active') {
		var optionalFields = ['#case-fields #candidateToDepartmentSubmittedDate', '#case-fields #departmentToDeanSubmittedDate', '#case-fields #deanToAPOSubmittedDate', '#case-fields #proposedOutcome', '#case-fields #proposedEffectiveDate', '#case-fields #proposedTitleCode', '#case-fields #proposedBaseSalary', '#case-fields #proposedPercentTime', '#case-fields #proposedStepType', '#case-fields #proposedAppointmentEndDate', '#case-fields #proposedWaiverEndDate', '#case-fields #yearsDeferred', '#case-fields #yearsAccelerated', '#case-fields #lastSalary'];	
		setOptionalLabels(optionalFields);
	}
	setDateMasks();
	setCurrencyFormatting();
	validateDateFields();
	validateSalaryFields();
	validatePercentFields();
}

function setDefaultApprovedFields(selectedActionTypeCode, casesData) {				
	//Check if approved fields should be displayed based upon role
	var approvedFields;
	
	approvedFields = htmlApprovedOutcome() + htmlApprovedEffectiveDate();
	
	$('#case-fields #default-approved-fields').html("");
	$('#case-fields #default-approved-fields').html(approvedFields);
					
	//Generate outcome dropdown
	if (casesData.approvedActionOutcome === undefined) {
		generateOutcomeDropdown(selectedActionTypeCode, '#case-fields #approvedOutcome', null);
	}
	else {
		generateOutcomeDropdown(selectedActionTypeCode, '#case-fields #approvedOutcome', casesData.approvedActionOutcome.code);
	}
		
	//Special instructions only for Change of Primary Department
	if (selectedActionTypeCode === CHANGE_PRIMARY_DEPT) {
		$('#case-fields #approved-help-text').text('Once this action has been approved, update the "Primary or Additional" column on the Academic History Data Clean Up screen.');
	}
	else {
		$('#case-fields #approved-help-text').text('');
	}
	
	//Populate simple fields if values exist in DB
	$('#case-fields #approvedEffectiveDate').val(casesData.effectiveDt);
	
	setDateMasks();
	setCurrencyFormatting();
	validateDateFields();
}

function setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase) {
	var approvedFields;
	
	if (selectedActionTypeCode === EIGHT_YEAR_LIMIT_PRELIMINARY_ASSESSMENT 
		|| selectedActionTypeCode === EIGHT_YEAR_LIMIT_RECONSIDERATION) {
		if ($("#case-fields #approvedOutcome").val() === DISAPPROVED) {
			approvedFields = htmlApprovedAppointmentEndDate();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedAppointmentEndDate').val(casesData.approvedAppointmentEndDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === RANGE_ADJUSTMENT) {
		
		approvedFields = htmlApprovedBaseSalary();
		$('#case-fields #approved-fields').html("");
		$('#case-fields #approved-fields').html(approvedFields);
		if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
		    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
		
	}
	else if (selectedActionTypeCode === ACADEMIC_ADMINISTRATIVE_APPOINTMENT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedDepartment() + htmlApprovedAffiliation() + htmlApprovedPercentTime()
							+ htmlApprovedTitleCode() + htmlApprovedBaseSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate()
							+ htmlApprovedRankStartDate();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
							   				 						
			//Department dropdown
			generateDepartmentDropdown('#case-fields #approvedDepartment', selectedAppointmentObject.academicHierarchyPathId);			
			
			//Title code dropdown - restricted
			generateRestrictedTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
			
			//Affiliation dropdown
			generateAffiliationDropdown('#case-fields #approvedAffiliation', selectedAppointmentObject);
			
			//Set Appointment End Date
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Disable fields
			disableField('#case-fields #approvedDepartment');
			disableField('#case-fields #approvedAffiliation');
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode); 						
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === CHANGE_OF_DEPARTMENT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedDepartment() + htmlApprovedAffiliation() + htmlApprovedPercentTime()
							+ htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
							+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate() + htmlApprovedRankStartDate()
							+ htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
									
			//Department dropdown 		
			generateDepartmentDropdown('#case-fields #approvedDepartment', casesData.approvedAcademicHierarchyPathId);					
						
			//Affiliation dropdown
			var specialAffiliationObject = {};
			specialAffiliationObject.affiliation = 'Primary';
			generateAffiliationDropdown('#case-fields #approvedAffiliation', specialAffiliationObject);

			//Unrestricted title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId);	

			//Set Series/Rank/Step date fields and Appointment End Date
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);			
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown - special case if title code was saved in DB
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', CHANGE_OF_DEPARTMENT);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);
			}
			
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			disableField('#case-fields #approvedAffiliation');
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === APPOINTMENT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedDepartment() + htmlApprovedAffiliation() + htmlApprovedPercentTime()
							+ htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
							+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate() + htmlApprovedRankStartDate()
							+ htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
									
			//Department dropdown 		
			generateDepartmentDropdown('#case-fields #approvedDepartment', selectedAppointmentObject.academicHierarchyPathId);	
						
			//Affiliation dropdown
			generateAffiliationDropdown('#case-fields #approvedAffiliation', selectedAppointmentObject);

			//Unrestricted title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId);	
			
			//Set Series/Rank/Step date fields and Appointment End Date
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown - special case if title code was saved in DB.  Also set appointment end date and N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', APPOINTMENT);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);
			}
				
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			disableField('#case-fields #approvedDepartment');
			disableField('#case-fields #approvedAffiliation');
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === JOINT_APPOINTMENT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedDepartment() + htmlApprovedAffiliation() + htmlApprovedPercentTime()
							+ htmlApprovedTitleCode() + htmlApprovedStepType()
							+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate() + htmlApprovedRankStartDate()
							+ htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
							
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
									
			//Department dropdown 		
			generateDepartmentDropdown('#case-fields #approvedDepartment', selectedAppointmentObject.academicHierarchyPathId);					
						
			//Affiliation dropdown
			generateAffiliationDropdown('#case-fields #approvedAffiliation', selectedAppointmentObject);

			//Unrestricted title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId);	
			
			//Set Series/Rank/Step date fields and Appointment End Date
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown - special case if title code was saved in DB.  Also set appointment end date and N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', JOINT_APPOINTMENT);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);
			}
				
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			disableField('#case-fields #approvedAffiliation');
			disableField('#case-fields #approvedDepartment');
			disableField('#case-fields #approvedPercentTime');
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
			
			//Special case for Joint Appointments
   			$('#case-fields #approvedPercentTime').val("0");
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === SPLIT_APPOINTMENT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedDepartment() + htmlApprovedAffiliation() + htmlApprovedPercentTime()
							+ htmlApprovedTitleCode() + htmlApprovedStepType()
							+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate() + htmlApprovedRankStartDate()
							+ htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
									
			//Department dropdown 		
			generateDepartmentDropdown('#case-fields #approvedDepartment', selectedAppointmentObject.academicHierarchyPathId);					
						
			//Affiliation dropdown
			generateAffiliationDropdown('#case-fields #approvedAffiliation', selectedAppointmentObject);

			//Unrestricted title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId);	
			
			//Set Series/Rank/Step date fields and Appointment End Date
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown - special case if title code was saved in DB.  Also set appointment end date and N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', SPLIT_APPOINTMENT);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);
			}
				
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			disableField('#case-fields #approvedAffiliation');
			disableField('#case-fields #approvedDepartment');
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === CHANGE_PERCENT_TIME) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedPercentTime() + htmlApprovedTitleCode() + htmlApprovedStepType() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
						
			//Title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', selectedAppointmentObject.titleCodeId);
			
			//Step dropdown.  Also set N/A if needed.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
			if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
				setNaFields(selectedAppointmentObject.titleCodeId, 'approved', CHANGE_PERCENT_TIME);
			}
			generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #approvedStepType', selectedAppointmentObject.stepOnScaleSalary);
		
			//Disable fields
			disableField('#case-fields #approvedTitleCode');
			disableField('#case-fields #approvedStepType');
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === CHANGE_IN_SERIES) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
						+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate() + htmlApprovedRankStartDate() 
						+ htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
			
			//Unrestricted title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId);	
			
			//Set Series/Rank/Step date fields and Appointment End Date
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown - special case if title code was saved in DB.  Also set appointment end date and N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', CHANGE_IN_SERIES);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);
			}
			
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
		
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === MERIT_EQUITY_REVIEW) {
		if ($("#case-fields #approvedOutcome").val() === ADVANCEMENT) {
			
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
						+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedRankStartDate() + htmlApprovedStepStartDate() 
						+ setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
							
			//Unrestricted title code dropdown
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId);	
			
			//Set Series/Rank/Step date fields and Appointment End Date
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown - special case.  Also set appointment end date and N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', MERIT_EQUITY_REVIEW);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);
			}  
						
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary'); 		   				
		
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === PROMOTION) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
							+ htmlApprovedOnScaleSalary() + htmlApprovedAppointmentEndDate() + htmlApprovedRankStartDate() + htmlApprovedStepStartDate() 
							+ setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
								   				
			//Restricted title code dropdown
			generateRestrictedTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);	
			
			//Set Series/Rank/Step date fields and Appointment End Date	
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Step dropdown.  Also set appointment end date and N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', PROMOTION);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary); 		
			}
		
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
		
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if(selectedActionTypeCode === CONVERT_HSCP) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
						+ htmlApprovedOnScaleSalary() + htmlApprovedRankStartDate() + htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
								   				
			//Restricted title code dropdown
			generateRestrictedTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);	
			
			//Set Series/Rank/Step date fields
			setSeriesRankStepFields(casesData.approvedTitleCodeId, ['#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate']);
			
			//Step dropdown - special case.  Also set N/A if needed
			if (!isNewCase && casesData.approvedTitleCodeId !== null && casesData.approvedTitleCodeId !== undefined && casesData.approvedTitleCodeId !== '') {
				setNaFields(casesData.approvedTitleCodeId, 'approved', CONVERT_HSCP);
				generateStepDropdown(casesData.approvedTitleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary); 	
			}
				
			//Set onscale if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedOnScaleSalary');
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
		
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === MERIT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
						+ htmlApprovedOnScaleSalary() + htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
						 						
			//Unrestricted title code dropdown.  Also set step and N/A if needed.  No need to set Series/Rank/Step dates because the NA function will handle it in this special case.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', selectedAppointmentObject.titleCodeId);
			if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
				setNaFields(selectedAppointmentObject.titleCodeId, 'approved', MERIT);
			}
			generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);	

			//Set onscale salary if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedTitleCode');
			disableField('#case-fields #approvedOnScaleSalary');
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary'); 						
		
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === STEP_UNSTEP) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() 
						+ htmlApprovedOnScaleSalary() + htmlApprovedStepStartDate() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
			 						
			//Unrestricted title code dropdown.  Also set step and N/A if needed.  No need to set Series/Rank/Step dates because the NA function will handle it in this special case.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', selectedAppointmentObject.titleCodeId);
			if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
				setNaFields(selectedAppointmentObject.titleCodeId, 'approved', STEP_UNSTEP);
			}
			generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #approvedStepType', casesData.approvedStepOnScaleSalary);	

			//Set onscale salary if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedTitleCode');
			disableField('#case-fields #approvedOnScaleSalary');
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);
			onChangeStep('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary'); 						
		
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedStepStartDate').val(casesData.approvedStepStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === OFF_SCALE_SALARY) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedTitleCode() + htmlApprovedStepType() + htmlApprovedBaseSalary() + htmlApprovedOnScaleSalary() + setHiddenStepValue("approvedHiddenStepId");
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
						
			//Unrestricted title code dropdown - prepopulated.  Also set step and N/A if needed.  This is a special case because title code is prepopulated and disabled, so we must check to make sure titleCodeId is not invalid before calling NA function
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', selectedAppointmentObject.titleCodeId);
			if (selectedAppointmentObject.titleCodeId !== null && selectedAppointmentObject.titleCodeId !== undefined && selectedAppointmentObject.titleCodeId !== '') {
				setNaFields(selectedAppointmentObject.titleCodeId, 'approved', OFF_SCALE_SALARY);
			}
			generateStepDropdown(selectedAppointmentObject.titleCodeId, '#case-fields #approvedStepType', selectedAppointmentObject.stepOnScaleSalary);
				
			//Set onscale salary if step has been prepopulated
			if ($('#case-fields #approvedStepType').val() !== null && $('#case-fields #approvedStepType').val() !== '' && $('#case-fields #approvedStepType').val() !== undefined && $('#case-fields #approvedOnScaleSalary:visible').length) {
   				setOnscaleSalary('#case-fields #approvedStepType', '#case-fields #approvedOnScaleSalary');
			}
			
			//Disable fields
			disableField('#case-fields #approvedTitleCode');
			disableField('#case-fields #approvedStepType');
			disableField('#case-fields #approvedOnScaleSalary');
			
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === UNIT18_FOURTH_YEAR_INCREASE) {
		if ($("#case-fields #approvedOutcome").val() === COMPLETED) {
			approvedFields = htmlApprovedTitleCode() + htmlApprovedBaseSalary();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
			
			//Unrestricted title code dropdown - prepopulated
			generateTitleCodeDropdown('#case-fields #approvedTitleCode', selectedAppointmentObject.titleCodeId);	

			//Disable fields
			disableField('#case-fields #approvedTitleCode');
			
			//Populate simple fields if values exist in DB
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === REAPPOINTMENT || selectedActionTypeCode === RENEWAL || selectedActionTypeCode === NON_RENEWAL) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedAppointmentEndDate();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedAppointmentEndDate').val(casesData.approvedAppointmentEndDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === CONTINUING_APPT) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedPercentTime() + htmlApprovedTitleCode() + htmlApprovedBaseSalary() 
							+ htmlApprovedRankStartDate();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
						
			//Restricted title code dropdown
			generateRestrictedTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);  						
		
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === UNIT18_TEMP_AUGMENTATION) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedPercentTime() + htmlApprovedTitleCode() + htmlApprovedBaseSalary()
							+ htmlApprovedAppointmentEndDate() + htmlApprovedRankStartDate();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
						 						
			//Restricted title code dropdown
			generateRestrictedTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode);  						
		
			//Set Appointment End Date
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			if(casesData.approvedSalaryAmt != null && casesData.approvedSalaryAmt !== '' && casesData.approvedSalaryAmt != undefined) 
			    $('#case-fields #approvedBaseSalary').val(casesData.approvedSalaryAmt).formatCurrency();
			$('#case-fields #approvedRankStartDate').val(casesData.approvedRankStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === INITIAL_WAIVER_REQUEST || selectedActionTypeCode === WAIVER_RENEWAL) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedWaiverEndDate() + htmlApprovedWaiverTermLength();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
			
			//Populate simple fields if values exist in DB - need to be set before waiver logic happens
			$('#case-fields #approvedWaiverEndDate').val(casesData.approvedWaiverEndDt);
			
			//Set on change for waiver term length
			onChangeWaiverDates('#case-fields #approvedEffectiveDate', '#case-fields #approvedWaiverEndDate', '#case-fields #approvedWaiverTermLength');
			
			//Set the waiver term length if both dates are populated
			waiverDateLogic('#case-fields #approvedEffectiveDate', '#case-fields #approvedWaiverEndDate', '#case-fields #approvedWaiverTermLength');
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else if (selectedActionTypeCode === RECALL) {
		if ($("#case-fields #approvedOutcome").val() === APPROVED) {
			approvedFields = htmlApprovedDepartment() + htmlApprovedAffiliation() + htmlApprovedPercentTime()
							+ htmlApprovedTitleCode() + htmlApprovedAppointmentEndDate() + htmlApprovedSeriesStartDate();
			
			$('#case-fields #approved-fields').html("");
			$('#case-fields #approved-fields').html(approvedFields);
				  			  						
			//Department dropdown
			generateDepartmentDropdown('#case-fields #approvedDepartment', selectedAppointmentObject.academicHierarchyPathId);			
			generateRestrictedTitleCodeDropdown('#case-fields #approvedTitleCode', casesData.approvedTitleCodeId, selectedActionTypeCode, selectedAppointmentObject.series);						
					
			//Affiliation dropdown
			generateAffiliationDropdown('#case-fields #approvedAffiliation', selectedAppointmentObject);
			
			//Set appointment end date
			setAppointmentEndDate(casesData.approvedTitleCodeId, '#case-fields #approvedAppointmentEndDate', casesData.approvedAppointmentEndDt);
			
			//Disable fields
			disableField('#case-fields #approvedAffiliation');
			disableField('#case-fields #approvedDepartment');
			
			//Set onchange events for elements added dynamically
			onChangeTitleCode('#case-fields #approvedTitleCode', '#case-fields #approvedStepType', '#case-fields #approvedAppointmentEndDate', selectedActionTypeCode); 						
		
			//Populate simple fields if values exist in DB
			$('#case-fields #approvedPercentTime').val(casesData.approvedTimePct);
			$('#case-fields #approvedSeriesStartDate').val(casesData.approvedSeriesStartDt);
		}
		else {
			$('#case-fields #approved-fields').html("");
		}
	}
	else {
		
	}
	
	//Set popovers for the dynamically added additional fields
	$('[data-toggle="popover"]').popover({trigger: 'hover','placement': 'top'},  {container: 'body'});
	
	setDateMasks();
	setCurrencyFormatting();
	validateDateFields();
	validateSalaryFields();
	validatePercentFields();
}

function setOnscaleSalary(changeElementId, affectedElementId) {
	var stepValue = $(changeElementId).val();

	//Change the onscale salary amount to reflect the new step unless they've selected AS or FAS-xxx
	if ($(changeElementId + ' option:selected').text() === 'AS' || $(changeElementId + ' option:selected').text().indexOf('FAS') >= 0 ) {
		$(affectedElementId + 'Container').hide();
		$(affectedElementId).val('');
	}
	//This case shouldn't be possible anymore since we are removing the blank option in the step dropdown
	else if (stepValue === "") {
		$(affectedElementId + 'Container').show();
		$(affectedElementId).val('');
	}
	else {
		/*NOTE: in the future we may need a check to see if onscale is originally a field for a particular action type, otherwise it may throw an error if it tries to show
		a non-existing element.  This is because setOnscaleSalary gets called indirectly through onChangeStep.  
		Right now however, Change in Percent is the only action type which has step but not onscale, and the fields are disabled so it will work fine.
		Not going to add the check now because it would require checking against the action types.*/
		$(affectedElementId + 'Container').show();
			
		if (stepValue.indexOf('-1-') >= 0) {
			$(affectedElementId).val('');
		}
		else {
			var parsedStepValues = stepValue.split('-');
			var onscaleSalary = parsedStepValues[1];
	
			//Display the new on scale salary field
			$(affectedElementId).val('$' + onscaleSalary).formatCurrency();
		}
	}
}

function onChangeTitleCode(changeElementId, affectedElementId1, affectedElementId2, selectedActionTypeCode) {
	$(changeElementId).off('change').on('change', function () {		
		var titleCodeId = $(changeElementId + ' option:selected').val();
		
		//Reset step dropdown
		generateStepDropdown(titleCodeId, affectedElementId1, '');
		$(affectedElementId1).val('');
		if (affectedElementId1 === '#case-fields #proposedStepType') {
			$('#case-fields #proposedHiddenStepId').val('null-0.00');
		}
		else if (affectedElementId1 === '#case-fields #approvedStepType') {
			$('#case-fields #approvedHiddenStepId').val('null-0.00');
		}
		
		//Check if title code is empty
		if (titleCodeId !== null && titleCodeId !== undefined && titleCodeId !== '') {		
			//Clear on scale salary field
			if (changeElementId === "#case-fields #proposedTitleCode") {			
				//Reset onscale
				$('#case-fields #proposedOnScaleSalary').val('');
				
				//Set N/A fields if needed
				setNaFields(titleCodeId, 'proposed', selectedActionTypeCode);
			}
			else {	
				//Reset onscale
				$('#case-fields #approvedOnScaleSalary').val('');
				
				//Set N/A fields if needed
				setNaFields(titleCodeId, 'approved', selectedActionTypeCode);
			}
					
			
			
			//Set appointment end date (field only, not value since it should not reset upon title code toggle)
			if (selectedActionTypeCode !== CHANGE_PERCENT_TIME) {
				var titleInformationObject = globalTitleCodesHashmap[titleCodeId];

				if (!titleInformationObject.indefiniteAppointment) {
					$(affectedElementId2 + 'Container').show();
				}
				else {		
					$(affectedElementId2 + 'Container').hide();
					$(affectedElementId2).val('');
					setValidationStatus(true, affectedElementId2 + 'Container', affectedElementId2 + 'Container .help-block', '');
				}	
			}
		}
		else {
			//Clear and remove step and appointment end date fields
			$(affectedElementId1).val('');
			$(affectedElementId1 + 'Container').hide();
			setValidationStatus(true, affectedElementId1 + 'Container', affectedElementId1 + 'Container .help-block', '');			
			
			$(affectedElementId2).val('');
			$(affectedElementId2 + 'Container').hide();
			setValidationStatus(true, affectedElementId2 + 'Container', affectedElementId2 + 'Container .help-block', '');
			
			//Remove onscale, approved series/rank/step start date if they exist
			if (changeElementId === "#case-fields #proposedTitleCode") {
				if ($('#case-fields #proposedOnScaleSalary:visible').length) {
					$('#case-fields #proposedOnScaleSalary').val('');
					$('#case-fields #proposedOnScaleSalaryContainer').hide();
				}
			}
			else {
				if ($('#case-fields #approvedOnScaleSalary:visible').length) {
					$('#case-fields #approvedOnScaleSalary').val('');
					$('#case-fields #approvedOnScaleSalaryContainer').hide();
				}
				if ($('#case-fields #approvedSeriesStartDate:visible').length) {
					$('#case-fields #approvedSeriesStartDate').val('');
					$('#case-fields #approvedSeriesStartDateContainer').hide();
					setValidationStatus(true, '#approvedSeriesStartDateContainer', '#approvedSeriesStartDateContainer .help-block', '');
				}
				if ($('#case-fields #approvedRankStartDate:visible').length) {
					$('#case-fields #approvedRankStartDate').val('');
					$('#case-fields #approvedRankStartDateContainer').hide();
					setValidationStatus(true, '#approvedRankStartDateContainer', '#approvedRankStartDateContainer .help-block', '');
				}
				if ($('#case-fields #approvedStepStartDate:visible').length) {
					$('#case-fields #approvedStepStartDate').val('');
					$('#case-fields #approvedStepStartDateContainer').hide();
					setValidationStatus(true, '#approvedStepStartDateContainer', '#approvedStepStartDateContainer .help-block', '');
				}
			}
		}
		
		//Clear any required field validation errors, if any.  TODO: don't make this hardcoded based on the element hierarchy
		$('#case-fields .help-block').each(function(index, helpField) {
			if ($(helpField).text() === 'Please fill out this required field.') {
				setValidationStatus(true, '#' + $(helpField).parent().parent().attr('id'), '#' + $(helpField).parent().parent().attr('id') + ' .help-block', '');
			}
		});
	});	
}

//Call waiver date logic and validate, since the dates are changing
function onChangeWaiverDates(elementId1, elementId2, affectedElementId) {
	$(elementId1).off('change').on('change', function () {
		waiverDateLogic(elementId1, elementId2, affectedElementId);
	});
	
	$(elementId2).off('change').on('change', function () {
		waiverDateLogic(elementId1, elementId2, affectedElementId);
	});
}

//Waiver logic helper function to simply calculate the waiver term length
function waiverDateLogic(elementId1, elementId2, affectedElementId) {
	var waiverTermLength = '';
	
	if ($(elementId1).val() !== null && $(elementId1).val() !== '' && $(elementId1).val() !== undefined
		&& $(elementId2).val() !== null && $(elementId2).val() !== '' && $(elementId2).val() !== undefined) {
		
		waiverTermLength = Math.round(((new Date($(elementId2).val())) - (new Date($(elementId1).val())))/31536000000);
		$(affectedElementId).text(waiverTermLength);
		$(affectedElementId + 'Container').show();
		validateWaiverFields(waiverTermLength, affectedElementId);
	}
	else {
		$(affectedElementId).text('');
		$(affectedElementId + 'Container').hide();
	}
	return waiverTermLength;
}

function onChangeStep(changeElementId, affectedElementId) {
	$(changeElementId).off('change').on('change', function () {
				
		setOnscaleSalary(changeElementId, affectedElementId);
		
		if(changeElementId === '#case-fields #proposedStepType') {
			$('#case-fields #proposedHiddenStepId').val($(changeElementId).val());
		}
		else if(changeElementId === '#case-fields #approvedStepType') {
			$('#case-fields #approvedHiddenStepId').val($(changeElementId).val());
		}
	});
	
}

function onChangeDepartment() {
	
}

function onChangeApprovedOutcome(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase) {	
	
	//If approved outcome dropdown is toggled
	$("#case-fields #approvedOutcome").off('change').on('change', function () { 
		setAdditionalApprovedFields(selectedActionTypeCode, selectedAppointmentObject, casesData, isNewCase);
	});
}

//Save or submit the case
function saveSubmitCase(selectedActionTypeCode, selectedAppointmentObject, screenAction, inProgressActionRowId, isNewCase) {
	var casesData = getModalData(selectedActionTypeCode, selectedAppointmentObject, screenAction, inProgressActionRowId);
	
	//Temporarily disable Save and Submit buttons until the call returns successfully
	$('#case-fields .save').attr('disabled', true);
	$('#case-fields .submit').attr('disabled', true);
	
	$.ajax({ 
		cache: false,
		url: '/restServices/rest/activecase/saveAction/?access_token='+access_token,
		type: 'POST',
		dataType: 'json', 
		data: JSON.stringify(casesData),
		contentType: 'application/json',
		mimeType: 'application/json',
		success: function(activeCasesInfo) { 
			var fullName = $('#case-fields .appointee-name').text();
			
			$('#case-fields').modal('hide');
			clearCaseFields();
			clearChooseActionFields();
			clearChooseNameFields();
			
			//Reload the page	
			//table.draw();
			if(window._loadReactDataTable){
				window._loadReactDataTable();
			}
			
			if (screenAction === 'save') {
				//If the row is validated, don't show the warning message on the Active Cases page
				if (pageName === 'active') {
					if (selectedAppointmentObject.eligibilityInterimSolutionRowStatusId === '2') {
						$('#save-new-case .alert-warning').hide();
					}
					else {
						$('#save-new-case .alert-warning').show();
					}
				}
				else {
					$('#save-new-case .alert-warning').hide();
				}
				
				//Determine modal text before opening modal
				if (isNewCase) {
					$('#save-new-case #save-text').text('You have started a case for ' + fullName);
				}
				else {
					$('#save-new-case #save-text').text('You have saved the case for ' + fullName);
				}
				$('#save-new-case').modal('show');
			}
			else if (screenAction === 'submit') {
				$('#submit-new-case').modal('show');
			}
			
			//Enable buttons
			$('#case-fields .save').attr('disabled', false);
			$('#case-fields .submit').attr('disabled', false);
		},
		error: function(jqXHR, textStatus, errorThrown) { 
			//Enable buttons
			$('#case-fields .save').attr('disabled', false);
			$('#case-fields .submit').attr('disabled', false);
			
			console.log("Error: ", errorThrown);
			console.log(jqXHR); 
			console.log("Text Status: ", textStatus);
		}
	});
}

function deleteCase(eligibilityInterimSolutionRowId, inProgressActionRowId) {
			
	$.ajax({ 
		cache: false,
		url: '/restServices/rest/activecase/deleteAction/?access_token='+access_token,
		type: 'POST',
		dataType: 'json', 
		data: JSON.stringify(inProgressActionRowId),
		contentType: 'application/json',
		mimeType: 'application/json',
		success: function(activeCasesInfo) { 
			$('#delete-warning').modal('hide');
			
			//Reload the page
			//table.draw();
			if(window._loadReactDataTable){
				window._loadReactDataTable();
			}
			
			$('#delete-case').modal('show');
		},
		error: function(jqXHR, textStatus, errorThrown) { 
			console.log("Error:", errorThrown);
			console.log(jqXHR); 
			console.log("Text Status:",textStatus);
		}
	});	
}

//Helper functions
function getModalData(selectedActionTypeCode, selectedAppointmentObject, screenAction, inProgressActionRowId) {
	var casesData = {};
	var apptInfo = {};
	var userData = {};
	var actionTypeInfo = {};
	var proposedOutcomeInfo = {};
	var approvedOutcomeInfo = {};
	
	userData.adminEmail = adminData.adminEmail;
	userData.adminOpusId = adminData.adminOpusId;
	userData.adminRoles = adminData.adminRoles;
	userData.adminFirstName = adminData.adminFirstName;
	userData.adminName = adminData.adminName;
	apptInfo.opusid = selectedAppointmentObject.opusid;
	apptInfo.eligibilityInterimSolutionRowId = selectedAppointmentObject.eligibilityInterimSolutionRowId;
	casesData.fullName = $('#case-fields .appointee-name').text();
	//For Notifications
	casesData.approvedStep = $('#case-fields #approvedStepType option:selected').text();
	
	var actionTypeValues = selectedActionTypeCode.split('-');
	casesData.actionCategoryId = actionTypeValues[0];
	actionTypeInfo.code = actionTypeValues[1];
	actionTypeInfo.name = $('#case-fields .action-type').text();
	
	casesData.renewalLengthTypeId = null;
	proposedOutcomeInfo.code = $('#case-fields #proposedOutcome').val();
	casesData.yearsDeferredCnt = $('#case-fields #yearsDeferred').val();
	casesData.yearsAcceleratedCnt = $('#case-fields #yearsAccelerated').val();
	casesData.candidateToDepartmentSubmittedDt = $('#case-fields #candidateToDepartmentSubmittedDate').val();
	casesData.departmentToDeanSubmittedDt = $('#case-fields #departmentToDeanSubmittedDate').val();
	casesData.deanToAPOSubmittedDt = $('#case-fields #deanToAPOSubmittedDate').val();
	casesData.proposedEffectiveDt = $('#case-fields #proposedEffectiveDate').val();
	
	if (screenAction === 'save') {
		if (pageName === 'active') {
			casesData.rowStatusId = 1; 
			casesData.pageName = pageName;
		}
		else if (pageName === 'completed') {
			casesData.rowStatusId = 9; 
			casesData.pageName = pageName;
		}
	}
	else if (screenAction === 'submit') {
		casesData.rowStatusId = 9;
		casesData.pageName = pageName;
	}
	
	casesData.inProgressActionRowId= inProgressActionRowId;
	apptInfo.eligibilityInterimSolutionRowStatusId = selectedAppointmentObject.eligibilityInterimSolutionRowStatusId;
	casesData.proposedTitleCodeId = $('#case-fields #proposedTitleCode').val();
	
	if ($('#case-fields #proposedHiddenStepId').val() !== '' && $('#case-fields #proposedHiddenStepId').val() !== undefined
		&& $('#case-fields #proposedHiddenStepId').val() !== null) {
		if ($('#case-fields #proposedHiddenStepId').val().indexOf('-1-') >= 0) {
			casesData.proposedStepTypeId = -1;
		}
		else {		
			var parsedProposedStepValues = $('#case-fields #proposedHiddenStepId').val().split('-');
			//Need to check for null string here because the hidden step field is a concatenated string, so when it's split, null remains a string
			if(parsedProposedStepValues[0] != "null" && parsedProposedStepValues[0] != null )
				casesData.proposedStepTypeId = parsedProposedStepValues[0];
			else
				casesData.proposedStepTypeId = null;
		}
	}
	else {
		casesData.proposedStepTypeId = null;
	}
	
	if ($('#case-fields #proposedBaseSalary').val() !== null && $('#case-fields #proposedBaseSalary').val() !== undefined && $('#case-fields #proposedBaseSalary').val() !== '') {
		casesData.proposedSalaryAmt = $('#case-fields #proposedBaseSalary').asNumber(); 
	}
	else {
		casesData.proposedSalaryAmt = null;
	}
	casesData.proposedAcademicHierarchyPathId = $('#case-fields #proposedDepartment').val();
	casesData.proposedAffiliationTypeId = $('#case-fields #proposedAffiliation').val();
	casesData.proposedTimePct = $('#case-fields #proposedPercentTime').val();
	casesData.proposedAppointmentEndDt = $('#case-fields #proposedAppointmentEndDate').val();
	casesData.proposedWaiverEndDt = $('#case-fields #proposedWaiverEndDate').val();
	casesData.approvedAcademicHierarchyPathId = $('#case-fields #approvedDepartment').val();
	casesData.approvedAffiliationTypeId = $('#case-fields #approvedAffiliation').val();
	casesData.approvedTimePct = $('#case-fields #approvedPercentTime').val();
	casesData.approvedTitleCodeId = $('#case-fields #approvedTitleCode').val();
	
	if ($('#case-fields #approvedHiddenStepId').val() !== '' && $('#case-fields #approvedHiddenStepId').val() !== undefined
		&& $('#case-fields #approvedHiddenStepId').val() !== null) {
		
		if ($('#case-fields #approvedHiddenStepId').val().indexOf('-1-') >= 0) {
			casesData.approvedStepTypeId = -1;
		}
		else {
			var parsedApprovedStepValues = $('#case-fields #approvedHiddenStepId').val().split('-');
			//Need to check for null string here because the hidden step field is a concatenated string, so when it's split, null remains a string
			if(parsedApprovedStepValues[0] != "null" && parsedApprovedStepValues[0] != null )
				casesData.approvedStepTypeId = parsedApprovedStepValues[0];
			else
				casesData.approvedStepTypeId = null;
		}
	}
	else {
		casesData.approvedStepTypeId = null;
	}
	approvedOutcomeInfo.code = $('#case-fields #approvedOutcome').val();
	approvedOutcomeInfo.name = $('#case-fields #approvedOutcome option:selected').text();
   
	if ($('#case-fields #approvedBaseSalary').val() !== null && $('#case-fields #approvedBaseSalary').val() !== undefined && $('#case-fields #approvedBaseSalary').val() !== '') {
		casesData.approvedSalaryAmt = $('#case-fields #approvedBaseSalary').asNumber(); 
	}
	else {
		casesData.approvedSalaryAmt = null;
	}
	casesData.effectiveDt = $('#case-fields #approvedEffectiveDate').val();
	casesData.approvedAppointmentEndDt = $('#case-fields #approvedAppointmentEndDate').val();
	casesData.approvedSeriesStartDt = $('#case-fields #approvedSeriesStartDate').val();
	casesData.approvedRankStartDt = $('#case-fields #approvedRankStartDate').val();
	casesData.approvedStepStartDt = $('#case-fields #approvedStepStartDate').val();
	casesData.approvedWaiverEndDt = $('#case-fields #approvedWaiverEndDate').val();
	
	//Add new fields for completed cases
	apptInfo.academicHierarchyPathId = selectedAppointmentObject.academicHierarchyPathId;
	if(selectedAppointmentObject.affiliation === 'Primary')
	    apptInfo.affiliation = '1';
	else
		apptInfo.affiliation = '2';
	apptInfo.appointmentPctTime = selectedAppointmentObject.appointmentPctTime;
	apptInfo.titleCodeId = selectedAppointmentObject.titleCodeId;
	apptInfo.stepTypeId = selectedAppointmentObject.stepTypeId;
	apptInfo.baseSalary = selectedAppointmentObject.baseSalary;
	apptInfo.appointmentEndDt = selectedAppointmentObject.appointmentEndDt;
	
	casesData.appointeeInfo = apptInfo;
	casesData.adminData = userData;
	casesData.actionType = actionTypeInfo;
	casesData.proposedActionOutcome = proposedOutcomeInfo;
	casesData.approvedActionOutcome = approvedOutcomeInfo;
	
	return casesData;
}

function getUserData(adminData){
	
	var userData = {};
	userData.adminEmail = adminData.adminEmail;
	userData.adminOpusId = adminData.adminOpusId;
	userData.adminRoles = adminData.adminRoles;
	userData.adminFirstName = adminData.adminFirstName;
	
}

//Modal display when filling out case fields modal
function getAppointmentFieldString(appointment) {
	var appointmentFields = "";
	
	if (appointment.titleCode !== 'undefined' && appointment.titleCode !== null) {
		appointmentFields += '<span class="appointment-label">Title code: </span>' + appointment.titleCode + '<br>';
	}
	if (appointment.payrollTitle !== 'undefined' && appointment.payrollTitle !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Payroll title: </span>' + appointment.payrollTitle + '<br>';
	}
	if (appointment.series !== 'undefined' && appointment.series !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Series: </span>' + appointment.series + '<br>';
	}
	if (appointment.rank !== 'undefined' && appointment.rank !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Rank: </span>' + appointment.rank + '<br>';
	}
	if (appointment.step !== 'undefined' && appointment.step !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Step: </span>' + appointment.step + '<br>';
	}
	if (appointment.department !== 'undefined' && appointment.department !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Department or Organization: </span>' + appointment.department + '<br>';
	}
	if (appointment.affiliation !== 'undefined' && appointment.affiliation !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Affiliation: </span>' + appointment.affiliation + '<br>';
	}
	if (appointment.appointmentPctTime !== 'undefined' && appointment.appointmentPctTime !== null) {
		appointmentFields += '<span class="appointment-label sublabel">Percent time: </span>' + appointment.appointmentPctTime + '%';
	}
 		
	return appointmentFields;
}

//Clear fields
function clearChooseNameFields() {
	$('#choose-person #search-field').val('');
	$('#appointment-list').empty();
}

function clearChooseActionFields() {
	$('#choose-action #action-type-dropdown').val('');
}

function clearCaseFields() {
	$('#case-fields .appointee-name').text('');
	$('#case-fields .action-type').text('');
	$('#case-fields .appointment').text('');
	$('#case-fields #default-fields').empty();
	$('#case-fields #proposed-fields').empty();
	$('#case-fields #default-approved-fields').empty();
	$('#case-fields #approved-fields').empty();	
}

function clearValidationErrors() {
	
}

//Date masking
function initializeDateMasks() {
	$.mask.definitions['a'] = "[0-1]";
	$.mask.definitions['b'] = "[0-9]";
	$.mask.definitions['c'] = "[0-3]";
	$.mask.definitions['d'] = "[0-9]";
	$.mask.definitions['e'] = "[0-9]";
	$.mask.definitions['f'] = "[0-9]";
	$.mask.definitions['g'] = "[0-9]";
	$.mask.definitions['h'] = "[0-9]";
}

function setDateMasks() {
	var dates = ['#case-fields #candidateToDepartmentSubmittedDate', '#case-fields #departmentToDeanSubmittedDate', '#case-fields #deanToAPOSubmittedDate', 
	            '#case-fields #proposedEffectiveDate', '#case-fields #approvedEffectiveDate',
				'#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', 
				'#case-fields #approvedStepStartDate', '#case-fields #proposedAppointmentEndDate',
				'#case-fields #approvedAppointmentEndDate', '#case-fields #proposedWaiverEndDate', '#case-fields #approvedWaiverEndDate'];
	
	$.each(dates, function(index, date) {
		if ($(date).length > 0) {
			$(date).mask("ab/cd/efgh");
		}
	});
	
	
}

function setCurrencyFormatting() {
	var salaries = ['#case-fields #proposedBaseSalary', '#case-fields #approvedBaseSalary', '#case-fields #proposedOnScaleSalary', '#case-fields #approvedOnScaleSalary'];

	$.each(salaries, function(index, salary) {
		if ($(salary).length > 0) {
			$(salary).blur(function() {
				$(salary).formatCurrency();
	 		});
			
		}
	});
}

function onChangeYearsDeferredAccelerated() {

	$('#case-fields #yearsDeferred').blur(function() {
		validateYearsAcceleratedOrDeferred('#case-fields #yearsDeferred');
	});
	
	$('#case-fields #yearsAccelerated').blur(function() {		
		validateYearsAcceleratedOrDeferred('#case-fields #yearsAccelerated');
	});
}

function findSuperUserRoles(roles) {	
	
	//Check for APO and OA only
	if ($.inArray(APO_ROLE, roles) !== -1 || $.inArray(OA_ROLE, roles) !== -1) {
		isSuperUserRole = true;
	}
	else {
		isSuperUserRole = false;
	}
}

function disableField(elementId) {
	$(elementId).prop('disabled', true);
}

function disableCompletedPageFields(fields) {
	$.each(fields, function(index, field) {
		if ($(field).length) { //check to see if the element exists
			$(field).prop('disabled', true);
		}
	});
}

function setOptionalLabels(fields) {
	$.each(fields, function(index, field) {
		if ($(field).length) { //check to see if the element exists
			$(field).attr('placeholder', 'optional');
		}
	});
}

//Add appointment end date field based upon indefiniteAppointment flag
function setAppointmentEndDate(titleCodeId, elementId, appointmentEndDateValue) {
	var titleInformationObject = globalTitleCodesHashmap[titleCodeId];
	
	if (titleCodeId === null || titleCodeId === undefined || titleCodeId === '') {
		$(elementId + 'Container').hide();
		$(elementId).val('');
		setValidationStatus(true, elementId + 'Container', elementId + 'Container .help-block', '');
	}
	else if (!titleInformationObject.indefiniteAppointment) {
		$(elementId + 'Container').show();
		$(elementId).val(appointmentEndDateValue);
		validateDateFields();
	}
	else {		
		$(elementId + 'Container').hide();
		$(elementId).val('');
		setValidationStatus(true, elementId + 'Container', elementId + 'Container .help-block', '');
	}	
}

function setSeriesRankStepFields(titleCodeId, fields) {
	if (titleCodeId === null || titleCodeId === undefined || titleCodeId === '') {
		$.each(fields, function(index, field) {
			$(field + 'Container').hide();
			$(field).val('');
			setValidationStatus(true, field + 'Container', field + 'Container .help-block', '');
		});		
	}
}

function setNaFields(titleCodeId, fieldType, actionType) {
	var titleCodeObject = globalTitleCodesHashmap[titleCodeId];
	
	if (titleCodeObject.series === 'Not Applicable') {
		//Only remove Series related fields
		$('#case-fields #' + fieldType + 'SeriesStartDateContainer').hide();
		$('#case-fields #' + fieldType + 'SeriesStartDate').val('');
		setValidationStatus(true, '#case-fields #' + fieldType + 'SeriesStartDateContainer', '#case-fields #' + fieldType + 'SeriesStartDateContainer .help-block', '');
	}
	//Don't add the series field for action types that do not have it
	else if (fieldType === 'approved' && actionType !== CONVERT_HSCP && actionType !== MERIT && actionType !== MERIT_EQUITY_REVIEW && actionType !== PROMOTION && actionType !== STEP_UNSTEP && actionType !== CHANGE_PERCENT_TIME && actionType !== OFF_SCALE_SALARY) { 
		//Add series field
		$('#case-fields #' + fieldType + 'SeriesStartDateContainer').show();
	}
	
	if (titleCodeObject.rank === 'Not Applicable') {
		//Only remove Rank related fields
		$('#case-fields #' + fieldType + 'RankStartDateContainer').hide();	
		$('#case-fields #' + fieldType + 'RankStartDate').val('');	
		setValidationStatus(true, '#case-fields #' + fieldType + 'RankStartDateContainer', '#case-fields #' + fieldType + 'RankStartDateContainer .help-block', '');
	}
	//Don't add the rank field for action types that do not have it
	else if (fieldType === 'approved' && actionType !== MERIT && actionType !== STEP_UNSTEP && actionType !== CHANGE_PERCENT_TIME && actionType !== OFF_SCALE_SALARY) { 
		//Add rank field
		$('#case-fields #' + fieldType + 'RankStartDateContainer').show();
	}
	
	//Loop through step List to see if the step list has only N/A
	var checkStepNA = false;
	if (titleCodeObject.steps !== undefined && titleCodeObject.steps !== null) {
		$.each(titleCodeObject.steps, function(index, step) {
			if (step.code === STEP_NOT_APPLICABLE) {
				checkStepNA = true;			
			}
		});
	}
	
	//If step is N/A, remove step, step start date and onscale salary fields and set the hidden step ID to 0
	if (checkStepNA) {
		if ($('#case-fields #' + fieldType + 'StepType option:selected').length) {
			$('#case-fields #' + fieldType + 'StepType option:selected').removeAttr('selected');
		}
		$('#case-fields #' + fieldType + 'StepTypeContainer').hide();
		setValidationStatus(true, '#case-fields #' + fieldType + 'StepTypeContainer', '#case-fields #' + fieldType + 'StepTypeContainer .help-block', '');
		
		$('#case-fields #' + fieldType + 'StepStartDateContainer').hide();
		$('#case-fields #' + fieldType + 'StepStartDate').val('');
		setValidationStatus(true, '#case-fields #' + fieldType + 'StepStartDateContainer', '#case-fields #' + fieldType + 'StepStartDateContainer .help-block', '');
		
		$('#case-fields #' + fieldType + 'OnScaleSalaryContainer').hide();
		$('#case-fields #' + fieldType + 'OnScaleSalaryContainer').val('');
		
		if ($('#case-fields #' + fieldType + 'HiddenStepId').length) {
			$('#case-fields #' + fieldType + 'HiddenStepId').val('0-0.00');
		}
	}
	//Otherwise, add step, step start date (for additional only) and onscale salary fields (in case they were removed previously) and set the onchange events
	else {
		//Have to check for proposed vs. approved since different fields are shown for each type
		if (fieldType === 'proposed') {
			$('#case-fields #' + fieldType + 'StepTypeContainer').show();
			
			//Don't add the onscale field for action types that do not have it - technically since we removed the call to setNAFields (it was bundled with the title code and step fields that were removed) in the proposed CHANGE_PERCENT_TIME action we could get rid of this conditional
			if (actionType !== CHANGE_PERCENT_TIME) {
				$('#case-fields #' + fieldType + 'OnScaleSalaryContainer').show();
			}
		}
		else if (fieldType === 'approved') {
			$('#case-fields #' + fieldType + 'StepTypeContainer').show();
			
			//Don't add the onscale field for action types that do not have it
			if (actionType !== CHANGE_PERCENT_TIME) {
				$('#case-fields #' + fieldType + 'OnScaleSalaryContainer').show();
			}
				
			//Don't add the step date field for action types that do not have it	
			if (actionType !== CHANGE_PERCENT_TIME && actionType !== OFF_SCALE_SALARY) {
				$('#case-fields #' + fieldType + 'StepStartDateContainer').show();
			}
		}
	}
	
	setDateMasks();
	validateDateFields();
}

function setHiddenStepValue(elementId) {
	return '<input type="hidden" title="Step Type ID" id="' + elementId + '"></input>';
}

function setEditValues(inProgressActionRowId, name, actionType, pageName) {
					
	$.ajax({ 
		cache: false,
		url: '/restServices/rest/activecase/viewEditAction/?access_token='+access_token,
		type: 'POST',
		dataType: 'json', 
		data: JSON.stringify(inProgressActionRowId),
		contentType: 'application/json',
		mimeType: 'application/json',
		success: function(casesData) {
			
			initializeCaseFields(name, actionType, casesData.actionCategoryId + '-' + casesData.actionType.code, casesData.appointeeInfo, casesData, false, inProgressActionRowId, pageName);
		
			var defaultFields = ['#case-fields #candidateToDepartmentSubmittedDate', '#case-fields #departmentToDeanSubmittedDate', '#case-fields #deanToAPOSubmittedDate'];
			var proposedFields = ['#case-fields #proposedOutcome', '#case-fields #proposedEffectiveDate', '#case-fields #proposedTitleCode', '#case-fields #proposedPayrollTitle', '#case-fields #proposedBaseSalary', '#case-fields #proposedPercentTime', '#case-fields #proposedDepartment', '#case-fields #proposedAffiliation', '#case-fields #proposedStepType', '#case-fields #proposedOnScaleSalary', '#case-fields #proposedAppointmentEndDate', '#case-fields #proposedWaiverEndDate', '#case-fields #proposedWaiverTermLength', '#case-fields #yearsDeferred', '#case-fields #yearsAccelerated', '#case-fields #lastSalary'];
			var approvedFields = ['#case-fields #approvedOutcome', '#case-fields #approvedEffectiveDate', '#case-fields #approvedTitleCode', '#case-fields #approvedPayrollTitle', '#case-fields #approvedBaseSalary', '#case-fields #approvedPercentTime', '#case-fields #approvedDepartment', '#case-fields #approvedAffiliation', '#case-fields #approvedStepType', '#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate', '#case-fields #approvedOnScaleSalary', '#case-fields #approvedAppointmentEndDate', '#case-fields #approvedWaiverEndDate', '#case-fields #approvedWaiverTermLength'];
			
			//Only for completed cases - disable the appropriate fields
			if (pageName === "completed") {
				disableCompletedPageFields(defaultFields);
				disableCompletedPageFields(proposedFields);
				disableCompletedPageFields(approvedFields);
				
				//Special case to edit salary for all action types (except Appointment and Change of Dept) and for Super User role
				if (actionType !== 'Appointment' && actionType !== 'Change of Dept' && isSuperUserRole) {
					$('#case-fields #approvedBaseSalary').prop('disabled', false);
				}
				
				//Show/hide the appropriate buttons
				if (isSuperUserRole) {
					$('#case-fields .save').show();
					$('#case-fields .cancel').show();
					$('#case-fields .closeButton').hide();
				}
				else {
					$('#case-fields .save').hide();
					$('#case-fields .cancel').hide();
					$('#case-fields .closeButton').show();
				}
				$('#case-fields .submit').hide();
			}
		},
		error: function(jqXHR, textStatus, errorThrown) { 
			console.log("Error: ", errorThrown);
			console.log(jqXHR); 
			console.log("Text Status: ", textStatus);
		}
	});
}

function setDeleteValues(eligibilityInterimSolutionRowId, inProgressActionRowId, fullName, actionType) {    
    $('#delete-warning .deleteRowAipId').html(inProgressActionRowId);
    $('#delete-warning .deleteRowEisId').html(eligibilityInterimSolutionRowId);
    
    $('#delete-warning .name').html(unescape(fullName));
    $('#delete-warning .action').html(actionType);
}

function initCasesGlobal(){
	
	$.ajax({ 
	       cache: false,
	       
	url: "/restServices/rest/activecase/getGlobalLists/?access_token="+access_token,
	       type:'GET',
	       dataType: 'json', 
	       contentType: 'application/json',
	       mimeType: 'application/json',
	       success: function(activeCasesInfo) { 
	        
	       
	//Set global maps
	       globalTitleCodesHashmap = activeCasesInfo.titleCodesMapList;
	       globalActionTypesList = activeCasesInfo.actionTypes;
	       globalActionOutcomesList = activeCasesInfo.actionOutcomes;
	       globalDepartmentsList = adminData.adminDepartments;
	        
	       findSuperUserRoles(adminData.adminRoles);
	       },
	       error: function(jqXHR, textStatus, errorThrown) { 
	        console.log("Error:", errorThrown);
	       console.log(jqXHR); 
	       console.log("Text Status:",textStatus);
	       }
	       });
	
	
	
}



(function(){
	
	//Set a listener for deleting row actions
    $('#delete-warning .submit').off('click').on('click', function() {
        deleteCase($('#delete-warning .deleteRowEisId').text(), $('#delete-warning .deleteRowAipId').text());
    });
    
    $('#delete-warning .cancel').off('click').on('click', function() {  
    	$('#delete-warning .name').html('');
        $('#delete-warning .action').html('');
    	$('#delete-warning .deleteRowAipId').html('');
        $('#delete-warning .deleteRowEisId').html('');
    });
    
    $('#delete-warning .close').off('click').on('click', function() {
    	$('#delete-warning .name').html('');
        $('#delete-warning .action').html('');
    	$('#delete-warning .deleteRowAipId').html('');
        $('#delete-warning .deleteRowEisId').html('');
    });   
	
	
})()




