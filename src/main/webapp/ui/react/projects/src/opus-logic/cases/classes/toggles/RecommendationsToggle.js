

/**
*
* @classdesc Various toggles associated with Recommendations Page
* @author - Leon Aburime
* @module RecommendationsToggle
*
**/
export default class RecommendationsToggle {

  recommendationEnabledOptions = {4: 'Alternate Recommendation/Approval'};

  /**
   *
   * @desc - Change values of fields to null
   * @param {Object} fields - all fields
   * @return {Array} fields - fieldData
   *
   **/
  nullifyValues(...fields) {
    for(let field of fields) {
      field.value = null;
    }

    return fields;
  }

  /**
   *
   * @desc - Change editability of all fields to editStatus
   * @param {Boolean} editStatus - whether fields are disabled or not
   * @return {Array} fields - fieldData
   *
   **/
  changeEditabilityOfFields(editStatus, ...fields) {
    for(let field of fields) {
      field.editable = editStatus;
    }

    return fields;
  }

  /**
   *
   * @desc - Updates all fields from toggles
   * @param {Object} fieldData - all fields
   * @return {Object} fieldData - the fieldData
   *
   **/
  updateFieldDataByToggles(fieldData) {
    this.updateFieldsByRequiredStatus(fieldData);
    this.updateRankStepSalaryByRecommendationValue(fieldData);
    this.updateRankStepSalaryByRecommendationDecisionValue(fieldData);
    //this.updateCAPRCDatesByRequiredValue(fieldData);


    return fieldData;
  }

  /**
   *
   * @desc - If its not required then disable fields and wipe the values
   * @param {Object} fieldData - all fields
   * @return {Object} fieldData - the fieldData
   *
   **/
  updateFieldsByRequiredStatus(fieldData = {}) {
    if(!fieldData.required) {
      return fieldData;
    }
    let valueIsRequired = this.isValueRequired(fieldData);

    //Change editability of all fields except required field
    let {required, ...rest} = fieldData;

    let fieldDataArray = Object.values(rest);
    this.changeEditabilityOfFields(valueIsRequired, ...fieldDataArray);

    if(!valueIsRequired) {
      this.nullifyValues(...fieldDataArray);
    }

    return fieldData;
  }

  /**
   *
   * @desc - Returns whether 'required' is 'Yes'
   * @param {Object} fieldData - all fields
   * @param {Object} enabledValues - options for enabled values
   * @return {Boolean} valueIsRequired - if required.value === "Yes"
   *
   **/
  isValueRequired(fieldData = {}, enabledValue = 'Yes') {
    let {required: {value}} = fieldData;
    let valueIsRequired = value === enabledValue;

    return valueIsRequired;
  }

  /**
   *
   * @desc - Returns whether "Recommendation" input field is
   *  'Alternate Recommendation/Approval' then these three fields are enabled.
   * @param {Object} fieldData - all fields
   * @param {Object} enabledValues - options for enabled values
   * @return {Boolean} fieldsAreEditable -
   *
   **/
  isRecommendationEnabled(fieldData = {}, recommendation = fieldData.recommendation,
    enabledValues = this.recommendationEnabledOptions) {
    let {value} = recommendation;
    let recommendationIsEnabled = value in enabledValues ||
      value === enabledValues[4];

    return recommendationIsEnabled;
  }

  /**
   *
   * @desc - If "Required" input field is 'Yes'
   *  then the date fields are enabled. If not they are disabled and their
   *  values are null
   * @param {Object} fieldData - all fields
   * @return {Object} fieldData - fieldData
   *
   **/
  updateCAPRCDatesByRequiredValue(fieldData = {}) {
    if(!fieldData.required) {
      return fieldData;
    }

    //Status of recommendation field determines the status of dependent fields
    let fieldsAreEditable = this.isValueRequired(fieldData);

    //Extract the dependent fields
    let {userComments, dateOfCommitteeMembership, dateOfMeeting,
      dateReportSubmittedToAPO, dateReportSentToDean} = fieldData;

    //Now change the fields
    this.changeEditabilityOfFields(fieldsAreEditable, dateOfCommitteeMembership,
      dateOfMeeting, dateReportSubmittedToAPO, dateReportSentToDean, userComments);

    if(!fieldsAreEditable) {
      this.nullifyValues(userComments, dateOfCommitteeMembership, dateOfMeeting,
        dateReportSubmittedToAPO, dateReportSentToDean);
    }

    return fieldData;
  }

  /**
   *
   * @desc - If fieldsAreEditable is false then wipe values and turn off
   *  editability
   * @param {Object} fieldData - all fields
   * @param {Bool} fieldsAreEditable - if fields are editable
   * @return {Object} fieldData - fieldData
   *
   **/
  updateRankStepSalaryByEditability(fieldData = {}, fieldsAreEditable) {
    //Extract the fields in question
    let {step, rank, salary} = fieldData;

    //Now change the fields
    this.changeEditabilityOfFields(fieldsAreEditable, rank, step, salary);

    if(!fieldsAreEditable) {
      this.nullifyValues(step, rank, salary);

      //Nullifying number fields dont work so must be empty string
      salary.value = '';
    }

    return fieldData;
  }

  /**
   *
   * @desc - If "Recommendation" input field is 'Alternate Recommendation/Approval'
   *  then these three fields are enabled. If not they are disabled and their
   *  values are null
   * @param {Object} fieldData - all fields
   * @return {Object} fieldData - fieldData
   *
   **/
  updateRankStepSalaryByRecommendationValue(fieldData = {}) {
    if(!fieldData.recommendation) {
      return fieldData;
    }

    //Status of recommendation field determines the status of dependent fields
    let fieldsAreEditable = this.isRecommendationEnabled(fieldData);

    //Update editability and value based on if fields are editable
    return this.updateRankStepSalaryByEditability(fieldData, fieldsAreEditable);
  }


  /**
   *
   * @desc - If "Recommendation" input field is 'Alternate Recommendation/Approval'
   *  then these three fields are enabled. If not they are disabled and their
   *  values are null
   * @param {Object} fieldData - all fields
   * @return {Object} fieldData - fieldData
   *
   **/
  updateRankStepSalaryByRecommendationDecisionValue(fieldData = {}) {
    if(!fieldData.recommendationDecision) {
      return fieldData;
    }

    //Status of recommendation field determines the status of dependent fields
    let fieldsAreEditable = this.isRecommendationEnabled(fieldData,
      fieldData.recommendationDecision);

    //Update editability and value based on if fields are editable
    return this.updateRankStepSalaryByEditability(fieldData, fieldsAreEditable);
  }
}
