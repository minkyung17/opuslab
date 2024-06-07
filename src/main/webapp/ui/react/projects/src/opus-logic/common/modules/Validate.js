import {intersection, keys} from "lodash";

/**
 *
 * @classdesc Takes care of validating fields and giving them error
 *  messages if needed
 * @module ValidateFieldData
 *
 */
export default class ValidateFieldData {
  //Class Data
    validateDisabledFields = false;
    validateInvisibleFields = false;
    returnErrorMessage = true;

  /**
   *
   * @desc - If we want to change any variables up top to handle how we validate
   * @param {Object} data -
   * @returns {void}
   *
   **/
    setClassData(data = {}) {
        for(let [key, value] of Object.entries(data)) {
            this[key] = value;
        }
    }

  /**
   *
   * @desc - Iterates through all the fields for save and validates
   * @param {Object} fieldData -
   * @param {Object} validationsForField -
   * @param {Object} -
   * @returns {void}
   *
   **/
    validateAllFieldDataOnSave(fieldData = {}, validationsForField = {},
    {wipeInvisibleFieldErrors = true, wipeDisabledFieldErrors = true} = {}) {
    //Names that are in both 'fieldData' and 'validationsForField'
        let commonNames = intersection(keys(fieldData), keys(validationsForField));

        for(let name of commonNames) {
            let field = fieldData[name];
            let {onSaveValidations} = validationsForField[name];
            if(onSaveValidations) {
                this.validateFieldByFunctionList(field, onSaveValidations);
            }
        }

    //If disabled then no error. Causes problems if not wiped
        this.wipeErrorsFromDisabledFields(fieldData, wipeDisabledFieldErrors);

    //If not visible then no error. Causes problems if not wiped
        this.wipeErrorsFromInvisibleFields(fieldData, wipeInvisibleFieldErrors);
    }

    validateApptEndDate(fields){
        if(fields && fields.appointmentEndDt){
            // Find indefiniteAppointment field
            let indefiniteAppointment = fields.appointmentEndDt.indefiniteAppointment;
            // If indefiniteAppointment is true and appointmentEndDt doesnt have a value, set errors to false
            if(indefiniteAppointment && !fields.appointmentEndDt.value){
                fields.appointmentEndDt.hasError = false;
                fields.appointmentEndDt.error = null;


            }
        }
    }

  /**
   *
   * @desc - Wipe error data from field. Useful if the field is invisible or not
  *   editable and shouldnt be validated
   * @param {Object} field - single field
   * @return {void}
   *
   **/
    wipeErrorsFromField(field = {}) {
        field.hasError = false;
        field.error = null;
    }

  /**
   *
   * @desc - Wipe error data from field if not editable. Useful if the field is
   *   invisible or not editable and shouldnt be validated
   * @param {Object} fieldData - fieldData
   * @param {Object} wipeDisabledFieldsErrors - if field errors should be wiped
   *  if disabled
   * @return {Object} fieldData - all fields
   *
   **/
    wipeErrorsFromDisabledFields(fieldData, wipeDisabledFieldsErrors = true) {
        for(let name in fieldData) {
            let {editable} = fieldData[name];
            if(!editable && wipeDisabledFieldsErrors) {
                this.wipeErrorsFromField(fieldData[name]);
            }
        }
        return fieldData;
    }

  /**
   *
   * @desc - Wipe error data from field if not visible. Useful if the field is
   *   invisible or not editable and shouldnt be validated
   * @param {Object} fieldData - fieldData
   * @param {Object} wipeInvisibleFieldErrors - if field errors should be wiped
   *  if disabled
   * @return {Object} fieldData
   *
   **/
    wipeErrorsFromInvisibleFields(fieldData = {}, wipeInvisibleFieldErrors = true) {
        for(let name in fieldData) {
            let {visibility} = fieldData[name];
            if(!visibility && wipeInvisibleFieldErrors) {
                this.wipeErrorsFromField(fieldData[name]);
            }
        }
        return fieldData;
    }

  /**
   *
   * @desc - Sets error data
   * @param {Object} field - fieldData
   * @param {Boolean} isValid - array of validation functions
   * @param {String} message - array of validation functions
   * @return {Object} fieldData
   *
   **/
    setErrorDataOnField(field, isValid, message) {
        field.hasError = !isValid;
        field.error = !isValid ? message : null;

        return field;
    }

  /**
   *
   * @desc - Wipe error data from field if not visible. Useful if the field is
   *   invisible or not editable and shouldnt be validated
   * @param {Object} field - fieldData
   * @param {Array} functions - array of validation functions
   * @return {Object} fieldData
   *
   **/
    validateFieldByFunctionList(field, functions = []) {
        let {value} = field;
        let {returnErrorMessage} = this;

        for(let validationFunction of functions) {
            if(!validationFunction) {
                continue;
            }
            let {isValid, message} = validationFunction(value, returnErrorMessage);
            this.setErrorDataOnField(field, isValid, message);

            if(field.hasError) {
                break;
            }
        }
    }
}
