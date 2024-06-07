//Sets the validation colors and text
function setValidationStatus(valid, containerId, messageId, messageText) {
	if (valid) {
		$(containerId).removeClass('has-error');
		$(containerId).removeClass('has-feedback');
		$(messageId).text('');
	}
	else {
		$(containerId).addClass('has-error');
		$(containerId).addClass('has-feedback');
		$(messageId).text(messageText);
	}
}

//Validate general modal fields like name search, choosing action type
function validateModalField(elementId, containerId, messageId) {
	var valid;	
	
	if ($(elementId).val() === "" || $(elementId).val() === null || $(elementId).val() === undefined) {
		setValidationStatus(false, containerId, messageId, 'Please fill out this required field.');
		valid = false;
	}
	else {
		setValidationStatus(true, containerId, messageId, '');
		valid = true;
	}	
	return valid;
}

//Validate lists
function validateList(elementId, containerId, messageId) {
	var valid;
	
	if ($(elementId).val() === undefined) {
		setValidationStatus(false, containerId, messageId, 'Please fill out this required field.');
		valid = false;
	}
	else {
		setValidationStatus(true, containerId, messageId, '');
		valid = true;
	}
	return valid;
}

//Validate dates
function validateDateFields() {
	var dateFields = ['#case-fields #candidateToDepartmentSubmittedDate', '#case-fields #departmentToDeanSubmittedDate', '#case-fields #deanToAPOSubmittedDate', '#case-fields #proposedEffectiveDate', '#case-fields #approvedEffectiveDate', '#case-fields #approvedSeriesStartDate', '#case-fields #approvedRankStartDate', '#case-fields #approvedStepStartDate', '#case-fields #proposedAppointmentEndDate', '#case-fields #approvedAppointmentEndDate', '#case-fields #proposedWaiverEndDate', '#case-fields #approvedWaiverEndDate'];
	var valid = true;
	
	$.each(dateFields, function(index, field) {
		$(field).blur(function() {
			if (!validateDate($(field).val())) {
				setValidationStatus(false, field + 'Container', field + 'Container .help-block', 'Please enter a valid date.');
				valid = false;
			}
			else {
				setValidationStatus(true, field + 'Container', field + 'Container .help-block', '');
			}
		});	
	});
	
	return valid;
}

//Validate salary
function validateSalaryFields() {
	var salaryRegx = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/;	
	var salaryFields = ['#case-fields #proposedBaseSalary', '#case-fields #approvedBaseSalary'];
	var valid = true;
	
	$.each(salaryFields, function(index, field) {
		$(field).blur(function() {
			if(salaryRegx.test($(field).val()) || $(field).val() === '') {
				setValidationStatus(true, field + 'Container', field + 'Container .help-block', '');
			}
			else {
				setValidationStatus(false, field + 'Container', field + 'Container .help-block', 'Please enter a valid salary.');
				valid = false;
			}
		});	
	});	
	
	return valid;
}

//Validate percent
function validatePercentFields() {
	var regx = /^\d+$/;
	var valid = true;
	
	var percentFields = ['#case-fields #proposedPercentTime', '#case-fields #approvedPercentTime'];
	$.each(percentFields, function(index, field) {
		$(field).blur(function() {
			if((regx.test($(field).val()) && $(field).asNumber() >= 0 && $(field).asNumber() <= 100) || $(field).val() === '') {
				setValidationStatus(true, field + 'Container', field + 'Container .help-block', '');
			}
			else {
				setValidationStatus(false, field + 'Container', field + 'Container .help-block', 'Please enter a valid percent time value.');
				valid = false;
			}
		});	
	});
	
	return valid;
}

//Validate waiver
function validateWaiverFields(waiverTermLength, elementId) {
	var valid;
	
	if (waiverTermLength < 1 || waiverTermLength > 3) {
		setValidationStatus(false, elementId + 'Container', elementId + 'Container .help-block', 'The waiver term length must be between 1 and 3.  Please re-enter the Effective Date and/or Waiver End Date.');
		valid = false;
	}
	else {
		setValidationStatus(true, elementId + 'Container', elementId + 'Container .help-block', '');
		valid = true;
	}
	
	return valid;
}

function validateRequiredCaseFields(requiredFields, errorMessage) {
	var valid = true;
	$.each(requiredFields, function(index, requiredField) {
		if ($(requiredField).val() === "" || $(requiredField).val() === null || $(requiredField).val() === undefined) {
			setValidationStatus(false, requiredField + 'Container', requiredField + 'Container .help-block', errorMessage);
			valid = false;
		}	
		//If there were previous validation errors for invalid data entered, leave the error there.  Only required field errors need to be removed
		else if($(requiredField + 'Container .help-block').text() !== '' && $(requiredField + 'Container .help-block').text() !== 'Please fill out this required field.') {
			//Do nothing so the data validation error remains
		}
		else {
			setValidationStatus(true, requiredField + 'Container', requiredField + 'Container .help-block', '');
		}
	});
	return valid;
}

function validateYearsAcceleratedOrDeferred(elementId) {	
	var valid = true;
	
	if ($(elementId).val().length > 0 ) {
		if (isNaN($(elementId).val())) { 	
			setValidationStatus(false, elementId + 'Container', elementId + 'Container .help-block', 'Please enter a valid number.');
			valid = false;
		} 
		else if ($(elementId).val() % 1 != 0) {
			setValidationStatus(false, elementId + 'Container', elementId + 'Container .help-block', 'Please enter a whole number.');			
			valid = false;
		}
		else {
			setValidationStatus(true, elementId + 'Container', elementId + 'Container .help-block', '');
		}
	} 
	else { //Clear validation errors if field value is empty
		setValidationStatus(true, elementId + 'Container', elementId + 'Container .help-block', '');
	}
	
	return valid;
}

//Validate proposed and approved case fields upon Submit.  Only APO/OA can submit, so no need to check for role
function onSubmitValidation(actionType) {
	var requiredFields = [];
		
	if ($("#case-fields #approvedOutcome").val() === APPROVED) {
		if (actionType === MERIT) {	
			requiredFields.push('#case-fields #approvedBaseSalary');
			
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
		}
		else if (actionType === PROMOTION) {
			requiredFields.push('#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
			
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === CONTINUING_APPT) {
			requiredFields.push('#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary', '#case-fields #approvedPercentTime');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
		}
		else if (actionType === RENEWAL) {
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === REAPPOINTMENT) {
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === CHANGE_IN_SERIES) {
			requiredFields.push('#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
						
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === CHANGE_OF_DEPARTMENT) {
			requiredFields.push('#case-fields #approvedDepartment', '#case-fields #approvedPercentTime', '#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === OFF_SCALE_SALARY) {
			requiredFields.push('#case-fields #approvedBaseSalary');
		}
		else if (actionType === CHANGE_PERCENT_TIME) {
			requiredFields.push('#case-fields #approvedPercentTime');
		}
		else if (actionType === FIVE_YEAR_REVIEW) {
			//No required fields
		}
		else if (actionType === FOUR_YEAR_REVIEW) {
			//No required fields
		}
		else if (actionType === FOURTH_YEAR_APPRAISAL) {
			//No required fields
		}
		else if (actionType === EIGHT_YEAR_LIMIT) {
			//No required fields
		}
		else if (actionType === MANDATORY_REVIEW) {
			//No required fields
		}
		else if (actionType === APPOINTMENT) {
			requiredFields.push('#case-fields #approvedPercentTime', '#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === JOINT_APPOINTMENT) {
			requiredFields.push('#case-fields #approvedTitleCode');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
		}
		else if (actionType === SPLIT_APPOINTMENT) {
			requiredFields.push('#case-fields #approvedPercentTime', '#case-fields #approvedTitleCode');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		} 
		else if (actionType === ACADEMIC_ADMINISTRATIVE_APPOINTMENT) {
			requiredFields.push('#case-fields #approvedPercentTime', '#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
	
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === ENDOWED_CHAIR_APPT) {
			//No required fields
		}
		else if (actionType === UNIT_18_NEED_ASSESSMENT) {
			//No required fields
		}
		else if (actionType === WAIVER_RENEWAL) {
			requiredFields.push('#case-fields #approvedWaiverEndDate');
		}
		else if (actionType === CONVERT_HSCP) {
			requiredFields.push('#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
		}
		else if (actionType === STEP_UNSTEP) {
			requiredFields.push('#case-fields #approvedBaseSalary');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
		}
		else if (actionType === NON_RENEWAL) {
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === RECALL) {
			requiredFields.push('#case-fields #approvedPercentTime', '#case-fields #approvedTitleCode');
			
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedSeriesStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedSeriesStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === INITIAL_WAIVER_REQUEST) {
			requiredFields.push('#case-fields #approvedWaiverEndDate');
		} 
		else if (actionType === CHANGE_PRIMARY_DEPT) {
			//No required fields
		}
		else if (actionType === UNIT18_TEMP_AUGMENTATION) {
			requiredFields.push('#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary', '#case-fields #approvedPercentTime');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else {
			//Do nothing
		}
	}
	else if($("#case-fields #approvedOutcome").val() === DISAPPROVED) {
		if (actionType === EIGHT_YEAR_LIMIT_PRELIMINARY_ASSESSMENT) {
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else if (actionType === EIGHT_YEAR_LIMIT_RECONSIDERATION) {
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
		else {
			//Do nothing
		}
	}
	else if($("#case-fields #approvedOutcome").val() === ADVANCEMENT) {
		if (actionType === MERIT_EQUITY_REVIEW) {
			requiredFields.push('#case-fields #approvedTitleCode', '#case-fields #approvedBaseSalary');
		
			//Check to see if special fields that are displayed based upon title code exist in the modal
			if ($('#case-fields #approvedStepType:visible').length) {
				requiredFields.push('#case-fields #approvedStepType');
			}
			
			if ($('#case-fields #approvedStepStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedStepStartDate');
			}
			
			if ($('#case-fields #approvedRankStartDate:visible').length) {
				requiredFields.push('#case-fields #approvedRankStartDate');
			}
			
			if ($('#case-fields #approvedAppointmentEndDate:visible').length) {
				requiredFields.push('#case-fields #approvedAppointmentEndDate');
			}
		}
	}
	else if($("#case-fields #approvedOutcome").val() === COMPLETED) {
		if (actionType === UNIT18_FOURTH_YEAR_INCREASE) {
			requiredFields.push('#case-fields #approvedBaseSalary');
		}
	}
	else {
		//Do nothing
	}

	requiredFields.push('#case-fields #approvedOutcome', '#case-fields #approvedEffectiveDate');

	return validateRequiredCaseFields(requiredFields, 'Please fill out this required field.');
}

//Helper functions
function validateDate(enteredDate) {
    var currDate = enteredDate;
    
   	var rxDatePatt = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dateArray = currDate.match(rxDatePatt); // is format OK?
    
    if (dateArray == null) 
        return true;
    
    //Checks for mm/dd/yyyy format.
    dateMonth = dateArray[1];
    dateDay= dateArray[3];
    dateYear = dateArray[5];        
    
    if (dateMonth < 1 || dateMonth > 12) 
        return false;
    else if (dateDay < 1 || dateDay> 31) 
        return false;
    else if ((dateMonth == 4 || dateMonth == 6 || dateMonth == 9 || dateMonth == 11) && dateDay == 31) 
        return false;
    else if (dateMonth == 2) {
        var isleapYr = (dateYear % 4 == 0 && (dateYear % 100 != 0 || dateYear % 400 == 0));
        if (dateDay> 29 || (dateDay == 29 && !isleapYr)) 
        	return false;
    }
    else if (dateYear < 1900) {
    	return false;
    }
    return true;
}

//Clear validation errors upon Back button click
function clearChoosePersonValidationErrors() {
	$('#choose-person').find('.has-error').removeClass('has-error');
	$('#choose-person').find('.has-feedback').removeClass('has-feedback');
	$('#choose-person').find('.help-block').text('');
}

function clearChooseActionValidationErrors() {
	$('#choose-action').find('.has-error').removeClass('has-error');
	$('#choose-action').find('.has-feedback').removeClass('has-feedback');
	$('#choose-action').find('.help-block').text('');
}

function clearCaseFieldsValidationErrors() {
	$('#case-fields').find('.has-error').removeClass('has-error');
	$('#case-fields').find('.has-feedback').removeClass('has-feedback');
	$('#case-fields').find('.help-block').text('');
}