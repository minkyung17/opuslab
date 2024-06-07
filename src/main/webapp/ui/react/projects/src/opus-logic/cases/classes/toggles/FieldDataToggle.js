import {get, intersection, keys, isEqual} from "lodash";


//My imports
import {constants} from "../../constants/CasesConstants";
import FieldData from "../../../common/modules/FieldData";

/**
*
* @desc Handles calls for updating field data
* @example 1.5 Use Cases/Examples for Toggled Fields
* @example https://docs.google.com/document/d/16aXm-Wept-qCnrXBEBE4WRPRvYl5q4IXSLNrYM7gD9M/edit
* @author Leon Aburime
* @module FieldDataToggle
*
**/
export default class FieldDataToggle {
    FieldData = new FieldData();
    invalidValues = {null: true, undefined: true};

  /**
  *
  * @desc - Used to update dependent fields values only
  * @param {Object} fieldData - all fields
  * @param {Object} template - place to get data from
  * @param {Array} pathsToDisplayValue - array of dependent fields
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateValuesOfDependentFields(fieldData, template, pathsToDisplayValue) {
    //Get the fields that are common to dependent fields and fieldData
        let commonFields = intersection(keys(fieldData), keys(pathsToDisplayValue));

    //Iterate and update the value by extracting from the template path
        for(let name of commonFields) {
            fieldData[name].value = get(template, pathsToDisplayValue[name]);
        }

        return fieldData;
    }

  /**
  *
  * @desc - Used to update dependent fields generally when field data changes
  * @param {Object} fieldData - all field data
  * @param {Object} nameOfChangedField - name of field that was changed
  * @param {Object} formattedCommonCallLists - common call lists
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldData(fieldData = {}, nameOfChangedField, formattedCommonCallLists, typeOfReq) {
        if(nameOfChangedField === "departmentCode") {
            this.updateFieldDataByDepartmentCode(fieldData, formattedCommonCallLists);
        }

        if(nameOfChangedField === "titleCode") {
            this.updateFieldDataByTitleCode(fieldData, formattedCommonCallLists, typeOfReq);
        }

        if(nameOfChangedField === "step") {
            this.updateFieldDataByStep(fieldData, formattedCommonCallLists);
        }

        this.updateAllStartDateDependentFields(fieldData);
        return fieldData;
    }


  /**
  *
  * @desc - Update dependent fields that are dependent only on departmentCode
  * @param {Object} fieldData - all field data
  * @param {Object} formattedCommonCallLists - formatted lists from globalData &
  *   adminData
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldsDependentOnDeptCode(fieldData, formattedCommonCallLists) {
    //No departmentCode so nothing to do
        if(!fieldData.departmentCode) {
            return fieldData;
        }

        let {departmentCode: {pathToDisplayValue}} = constants.dependentFieldsConfig;
        let {departmentCode: {value}} = fieldData;
        let department = formattedCommonCallLists.ahPathToDepartment[value] || {};

    //Now update fields
        this.updateValuesOfDependentFields(fieldData, department, pathToDisplayValue);

    //Update fieldData by attributes from new department hash
        this.FieldData.updateFieldDataByAttributeProperties(fieldData,
      department.attributeProperties);

    //All done. Return
        return fieldData;
    }

  /**
  *
  * @desc - Update dependent fields by departmentCode value
  * @param {Object} fieldData - all field data
  * @param {Object} formattedCommonCallLists - formatted lists from global &
  *   adminData
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldDataByDepartmentCode(fieldData = {}, formattedCommonCallLists) {
    //If this field is not valid nothing to do so go back
        if(!fieldData.departmentCode) {
            return fieldData;
        }

        this.updateFieldsDependentOnDeptCode(fieldData, formattedCommonCallLists);

    // Data clean up: Location: Removed wiping location value
    //If location is here always wipe value
    // this.wipeLocationValue(fieldData);

    // Jira #3025 #3046 Need to reset validations if there are any
        if(fieldData.location && fieldData.location.visibility && !fieldData.location.editable){
      // Default to UCLA Campus
            fieldData.location.value = 1;

      // Reset validations here
            if(fieldData.location.hasError){
                fieldData.location.hasError = false;
                fieldData.location.error = null;
            }
        }

        this.wipeDentistryBaseSupplementValueIfInvisible(fieldData);

        return fieldData;
    }

  /**
  *
  * @desc - Wipes DSB values if this field is invisible
  * @param {Object} fieldData - all field data
  * @return {void}
  *
  **/
    wipeDentistryBaseSupplementValueIfInvisible(fieldData = {}) {
        let {dentistryBaseSupplement} = fieldData;
        if(dentistryBaseSupplement && dentistryBaseSupplement.visibility === false) {
            dentistryBaseSupplement.value = null;
        }
    }

  /**
  *
  * @desc - Simply wipes apuCode values
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - update fieldData
  *
  **/
    wipeAPUOnUpdate(fieldData) {
    //Wipe APU on changing title code
        if(fieldData.apuCode) {
            fieldData.apuCode.value = null;
        }
    }


  /**
  *
  * @desc - Simply wipes location value
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - update fieldData
  *
  **/
    wipeLocationValue(fieldData) {
    //If location is here always wipe value
        if(fieldData.location) {
            fieldData.location.value = null;
        }
    }

  /**
  *
  * @desc - Updates fields dependent on titleCode
  * @param {Object} fieldData - all field data
  * @param {Object} formattedCommonCallLists - formatted lists from global &
  *   adminData
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldsDependentOnTitleCode(fieldData = {}, formattedCommonCallLists) {
        let {titleCode: {pathToDisplayValue}} = constants.dependentFieldsConfig;
        let {titleCode: {value}} = fieldData;
        let titleCodeData = formattedCommonCallLists.titleCodesById[value] || {};

    //Update the values of dependentFields
        this.updateValuesOfDependentFields(fieldData, titleCodeData, pathToDisplayValue);

    //Update visibility and editability of dependent fields
        this.FieldData.updateFieldDataByAttributeProperties(fieldData,
      titleCodeData.attributeProperties);

        return fieldData;
    }

  /**
  *
  * @desc - Update certain fields when titleCode changes
  * @param {Object} fieldData - all field data
  * @param {Object} formattedCommonCallLists - formatted lists from global &
  *   adminData
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldDataByTitleCode(fieldData = {}, formattedCommonCallLists, typeOfReq) {
    //If this field is not valid nothing to do so go back
        if(!fieldData.titleCode) {
            return fieldData;
        }
        
        this.updateFieldsDependentOnTitleCode(fieldData, formattedCommonCallLists);

    //Updates step options, attributes and value
        this.updateStep(fieldData, formattedCommonCallLists, typeOfReq);

        this.wipeAPUOnUpdate(fieldData);

    //Hide salary fields
        this.hideSalaryDependentFieldsOnHiddenStep(fieldData);

    //Check appointmentEndDt
        this.appointmentEndDateLogic(fieldData, formattedCommonCallLists);

    //Update years at current rank and step
        this.updateYearsAtCurrent(fieldData);

        return fieldData;
    }

  /**
  *
  * @desc - Update dependent fields when step changes
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - updated fieldData
  *
  **/
    updateFieldDataByStep(fieldData = {}) {
        if(!fieldData.step) {
            return fieldData;
        }

        this.updateOnScaleSalaryByStep(fieldData);
        this.updateOffScalePercentByStep(fieldData);

        return fieldData;
    }

  /**
  *
  * @desc - Update dependent yearsAtCurrent Rank/Step
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - updated fieldData
  *
  **/
    updateYearsAtCurrent(fieldData) {
        this.updateYearsAtCurrentRank(fieldData);
        this.updateYearsAtCurrentStep(fieldData);

        return fieldData;
    }

  /**
  *
  * @desc - Update dependent yearsAtCurrentRank
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - updated fieldData
  *
  **/
    updateYearsAtCurrentRank(fieldData) {
        if(!fieldData.yearsAtCurrentRank || !fieldData.rank) {
            return fieldData;
        }

        fieldData.yearsAtCurrentRank.visibility = fieldData.rank.visibility;

        return fieldData;
    }

  /**
  *
  * @desc - Update dependent yearsAtCurrentStep
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - updated fieldData
  *
  **/
    updateYearsAtCurrentStep(fieldData) {
        if(!fieldData.yearsAtCurrentStep || !fieldData.step) {
            return fieldData;
        }

        fieldData.yearsAtCurrentStep.visibility = fieldData.step.visibility;

        return fieldData;
    }

  /**
  *
  * @desc - If no step or step is invisible hide onScaleSalary
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateOnScaleSalaryByStep(fieldData = {}) {
        let stepNotValid = !fieldData.step || !fieldData.step.visibility;
        if(stepNotValid && fieldData.onScaleSalary) {
            fieldData.onScaleSalary.visibility = false;
        }

        return fieldData;
    }

  /**
  *
  * @desc - If no step or step is invisible hide offScalePercent
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateOffScalePercentByStep(fieldData = {}) {
        let stepNotValid = !fieldData.step || !fieldData.step.visibility;
        if(stepNotValid && fieldData.offScalePercent) {
            fieldData.offScalePercent.visibility = false;
        }

        return fieldData;
    }

  /**
  *
  * @desc - Handles updating appointmentEndDate attributes and values
  * @param {Object} fieldData -
  * @param {String} formattedLists -
  * @return {Object} fieldData
  *
  **/
    appointmentEndDateLogic(fieldData = {}, formattedLists = {}) {
    //Sometimes we dont want to run this function as part of the title code update
        if(!fieldData.appointmentEndDt || !fieldData.titleCode) {
            return fieldData;
        }

        let {appointmentEndDt, titleCode: {value}} = fieldData;
        let titleCodeObject = formattedLists.titleCodesById[value];

    //If appointmentEndDt exists in attrProps & its conditional
        if(titleCodeObject && (appointmentEndDt.conditionalVisibility ||
      appointmentEndDt.attributeProperties.conditional === "Conditional")) {

      // //If titleCodeObject is visible, appointmentEndDate should be too
      // appointmentEndDt.visibility = titleCodeObject.attributeProperties.appointmentEndDt.visibility;

            appointmentEndDt.visibility = true;


      //Hide for the table
            let {visibility} = appointmentEndDt;
            appointmentEndDt.value = visibility ? appointmentEndDt.value : null;

      // OPUS-6441 Added indefiniteAppointment field for custom save
            appointmentEndDt.indefiniteAppointment = titleCodeObject.indefiniteAppointment;
            console.log("indefiniteAppointment: "+titleCodeObject.indefiniteAppointment.toString());
        }
 
        return fieldData;
    }

  /**
  *
  * @desc - If step is hidden then hide the salary fields
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - updated fieldData
  *
  **/
    updateTitleCodeVisibilityByApptEndDtValue(fieldData = {}) {
        if(!fieldData.titleCode || !fieldData.appointmentEndDt) {
            return fieldData;
        }

        let {titleCode, appointmentEndDt} = fieldData;

        titleCode.visibility = !!appointmentEndDt.value;

        return fieldData;
    }

  /**
  *
  * @desc - If field is hidden then hide the dependent fields
  * @param {Object} fieldData - all field data
  * @param {Object} field - field with which to check
  * @param {Object} fieldNames - specific salary field names
  * @return {Object} fieldData - update fieldData
  *
  **/
    hideSalaryDependentFieldsOnInvalidField(fieldData = {}, field, fieldNames) {
    //Get dependent fields in fieldData
        let validSalaryFields = intersection(keys(fieldData), fieldNames);

    //If field is not visible or field value is not valid, hide dependent fields
        if(field && (field.visibility === false || field.value in this.invalidValues)) {
            for(let name of validSalaryFields) {
                fieldData[name].visibility = false;
            }
        }

        return fieldData;
    }

  /**
  *
  * @desc - If step is hidden hide the salary fields
  * @param {Object} fieldData - all field data
  * @param {Object} fieldNames - names of salary fields to change
  * @return {Object} fieldData - update fieldData
  *
  **/
    hideSalaryDependentFieldsOnHiddenStep(fieldData = {}, fieldNames =
    constants.salaryAPIFields.listOfFieldsDependentOnStep) {
        let {step} = fieldData;

        this.hideSalaryDependentFieldsOnInvalidField(fieldData, step, fieldNames);
    }

  /*****************************************************************************
  *
  * @desc - Having to do with Start Date Dependent Fields
  *
  ******************************************************************************/

  /**
  *
  * @desc - Updates the three start date fields
  * @param {Object} fieldData - all fields in a section
  * @return {Object} fieldData
  *
  **/
    updateAllStartDateDependentFields(fieldData = {}) {
        this.updateStartDateAtStep(fieldData);
        this.updateStartDateAtSeries(fieldData);
        this.updateStartDateAtRank(fieldData);

        return fieldData;
    }

  /**
  *
  * @desc - Hide start date at series if necessary
  * @param {Object} fieldData - all fields in a section
  * @return {Object} startDateAtSeries
  *
  **/
    updateStartDateAtSeries(fieldData = {}) {
        let {series, startDateAtSeries} = fieldData;
        return this.updateStartDateDependentFieldVisibility(startDateAtSeries, series);
    }

  /**
  *
  * @desc - Hide start date at rank if necessary
  * @param {Object} fieldData - all fields in a section
  * @return {Object} startDateAtRank
  *
  **/
    updateStartDateAtRank(fieldData = {}) {
        let {rank, startDateAtRank} = fieldData;
        return this.updateStartDateDependentFieldVisibility(startDateAtRank, rank);
    }

  /**
  *
  * @desc - Hide start date at step if necessary
  * @param {Object} fieldData - all fields in a section
  * @return {Object} startDateAtStep
  *
  **/
    updateStartDateAtStep(fieldData) {
        let {step, startDateAtStep} = fieldData;
        return this.updateStartDateDependentFieldVisibility(startDateAtStep, step);
    }

  /**
  *
  * @desc - Will show or hide start date fields based on if parent field(step,
  *   series, or rank) is visible
  * @param {Object} startDateField -
  * @param {Object} startDateParent -
  * @return {Object} startDateField
  *
  **/
    updateStartDateDependentFieldVisibility(startDateField, startDateParent) {
        if(startDateField && startDateParent) {
            startDateField.visibility = startDateParent.visibility;

            if(!startDateField.visibility) {
                startDateField.value = null;
            }
        }

        return startDateField;
    }

  /**
  *
  * @desc - Will transform step field on screen
  * @param {Object} fieldData -
  * @param {Object} formattedLists -
  * @return {Object} fieldData
  *
  **/
    updateStep(fieldData = {}, formattedLists = {}, typeOfReq) {
        if(!fieldData.step) {
            return fieldData;
        }

        let {step} = fieldData;

    //Must have titleCode value to get titleCodeObject and get properties
        let hasTitleCodeValue = !!fieldData.titleCode.value;

    //If step exists in attrProps & its conditionally restricted. Works for
    //Profile("conditionalRestriction") & Cases(conditional === 'Restricted')
        let isRestricted = step.conditionalRestriction || step.attributeProperties.conditional
      === "Restricted";

    //If all matches are met lets update step
        if(step && isRestricted && hasTitleCodeValue) {
            this.updateStepAttributesFromTitleCode(fieldData, formattedLists);

            this.updateStepOptionsFromTitleCode(fieldData, formattedLists, typeOfReq);

      //If false
            this.wipeStepValueIfInvisible(fieldData);
        }

    //After update options then decide if step needs to be hidden
        this.updateStepVisibilityIfOptionsAreBlankAndNA(fieldData);
        this.updateStepVisibilityByInvalidStepValue(fieldData);

        return fieldData;
    }

  /**
  *
  * @desc - Wipe step value if step is invisible
  * @param {Object} fieldData -
  * @param {String} formattedLists -
  * @return {Object} fieldData
  *
  **/
    wipeStepValueIfInvisible(fieldData = {}) {
    //If step is invisible wipe step value
        if(fieldData.step && !fieldData.step.visibility) {
            fieldData.step.value = 0;
        }

        return fieldData;
    }

  /**
  *
  * @desc - Updating step editability and visibility from titleCode value
  * @param {Object} fieldData -
  * @param {String} formattedLists -
  * @return {Object} fieldData
  *
  **/
    updateStepAttributesFromTitleCode({titleCode, ...fieldData}, formattedLists = {}) {
        if(!fieldData.step) {
            return fieldData;
        }

    //Extract the titleCodeId
        let {attributeProperties} = formattedLists.titleCodesById[titleCode.value];

    //Now update the visibility of step
        fieldData.step.visibility = attributeProperties.step.visibility;
        fieldData.step.editable = attributeProperties.step.editable;

        return fieldData;
    }

  /**
  *
  * @desc - Updating step options from titleCode
  * @param {Object} fieldData -
  * @param {String} formattedLists -
  * @return {Object} fieldData
  *
  **/
    updateStepOptionsFromTitleCode(fieldData = {}, formattedLists = {}, typeOfReq) {
        if(!fieldData.step) {
            return fieldData;
        }

        //Extract the titleCodeObject that are keyed by ID
        let {titleCodeIdToStepOptions, titleCodeIdToActiveStepOptions} = formattedLists;

        //Extract the titleCodeId
        if(typeOfReq==="active"){
            fieldData.step.options = titleCodeIdToActiveStepOptions[fieldData.titleCode.value];
        }else{
            fieldData.step.options = titleCodeIdToStepOptions[fieldData.titleCode.value];
        }

        return fieldData;
    }

  /**
  *
  * @desc - If step options are blank and NA set visibility to false
  * @param {Object} fieldData -
  * @return {Object} fieldData
  *
  **/
    updateStepVisibilityIfOptionsAreBlankAndNA(fieldData = {}) {
        if(!fieldData.step) {
            return fieldData;
        }

        let blankOptions = [{"-1": ""}, {0: "N/A"}];
        let stepOptionsAreNA = isEqual(fieldData.step.options, blankOptions);
        fieldData.step.visibility = !stepOptionsAreNA;

        return fieldData;
    }

  /**
  *
  * @desc - If step value is 0 (i.e. N/A) set visibility to false.  If it is -1
  * (i.e. unknown) we'd normally want to hide this as well, but in this case it's
  * an indication that something is wrong so showing it would help alert the user.
  * This case is handled by the above function UNLESS the dropdown happens to have
  * more options than just N/A and Unknown.  So this function will compare against
  * the actual value in the dropdown instead of the values in the option list.
  * @param {Object} fieldData -
  * @param {Object} invalidValues -
  * @return {Object} fieldData
  *
  **/
    updateStepVisibilityByInvalidStepValue(fieldData = {}, invalidValues = {0: true}) {
        if(!fieldData.step) {
            return fieldData;
        }

        let {step} = fieldData;
        if (step.value in invalidValues) {
            step.visibility = false;
        }
        return fieldData;
    }

  /**
  *
  * @desc - Updates series and rank values from chosen titleCode
  * @param {Object} fieldData -
  * @param {String} formattedCommonCallLists -
  * @return {Object} fieldData
  *
  **/
    updateSeriesRankFromTitleCodeLogic(fieldData = {}, formattedCommonCallLists) {
        this.updateSeriesFromTitleCodeLogic(fieldData, formattedCommonCallLists);
        this.updateRankFromTitleCodeLogic(fieldData, formattedCommonCallLists);

        return fieldData;
    }

  /**
  *
  * @desc - Updates series values from chosen titleCode
  * @param {Object} fieldData -
  * @param {String} formattedCommonCallLists -
  * @return {Object} fieldData
  *
  **/
    updateSeriesFromTitleCodeLogic(fieldData = {}, formattedCommonCallLists) {
        if(!fieldData.titleCode || !fieldData.titleCode.value) {
            return fieldData;
        }

    //Extract titleCodeId to titleCodeobject from commonCallLists
        let {titleCodesById} = formattedCommonCallLists;

    //Get the titleCodeObject by the current fieldData.titleCode.value
        let titleCodeObject = titleCodesById[fieldData.titleCode.value];

    //If series exists in attrProps & its conditional
        if(fieldData.series && (fieldData.series.attributeProperties.conditional
      === "Conditional" || fieldData.series.conditionalVisibility)) {
            let {series} = fieldData;

      //Check titleCodeObject for visibility & if exists turn on visibility for series
            series.visibility = titleCodeObject.attributeProperties.series.visibility;
            series.editable = titleCodeObject.attributeProperties.series.editable;
            series.value = titleCodeObject.series;
        }

        return fieldData;
    }

  /**
  *
  * @desc - Updates rank values from chosen titleCode
  * @param {Object} fieldData -
  * @param {String} formattedCommonCallLists -
  * @return {Object} fieldData
  *
  **/
    updateRankFromTitleCodeLogic(fieldData = {}, formattedCommonCallLists) {
        if(!fieldData.titleCode || !fieldData.titleCode.value) {
            return fieldData;
        }

    //Extract titleCodeId to titleCodeobject from commonCallLists
        let {titleCodesById} = formattedCommonCallLists;

    //Get the titleCodeObject by the current fieldData.titleCode.value
        let titleCodeObject = titleCodesById[fieldData.titleCode.value];

    //If rank exists in attrProps & its conditional
        if(fieldData.rank && (fieldData.rank.attributeProperties.conditional
     === "Conditional" || fieldData.rank.conditionalVisibility)) {
            let {rank} = fieldData;

      //Check titleCodeObject for visibility & if exists turn on visibility for rank
            rank.visibility = titleCodeObject.attributeProperties.rank.visibility;
            rank.editable = titleCodeObject.attributeProperties.rank.editable;
            rank.value = titleCodeObject.rank.rankTypeDisplayText;
        }

        return fieldData;
    }
}
