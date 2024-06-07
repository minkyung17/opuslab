import moment from "moment";
import {get, pick, keyBy, omit, difference} from "lodash";

//My imports
import DataTable from "./DataTable";
import * as util from "../../common/helpers";
import {postJson, jsonToUrlArgs} from "../../common/helpers/";
import { DeleteButtonCell } from "../../../react-views/datatables/components/DataTableCells";

/**
*
* @classdesc Base class for 8 Year Clock and Excellence Clock Logic Class
* @author Leon Aburime
* @class Clock
* @extends DataTable
*
**/
export class Clock extends DataTable {
  /**
   *
   * @description -  Really just sets opusPersonId so this class can call on it
   * @param {Object} - opusPersonId
   * @return {void}
   *
   **/
    setLogicClassVariables({opusPersonId, ...args} = {}) {
        this.setClassData({opusPersonId, ...args});
    }

  /**
   *
   * @description - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
    getDataUrlParameters() {
        let {opusPersonId, access_token} = this;
        return {opusPersonId, access_token};
    }

  /**
  *
  * @description - Get edit permission from profileAPIData and from grouper permission
  *   in adminData
  * @param {Object} adminData -
  * @return {Object} - can view eightYearClock
  *
  **/
    canEditClockTable({resourceMap} = this.adminData) {
        let resource = resourceMap["8_year_clock_edit_modal"] || {};
        let canEdit = resource.action in {edit: true};

        return canEdit;
    }

  /**
   *
   * @description - Check if this person can edit the popup(modal)
   * @param {Object} dataTableConfiguration -
   * @param {Object} adminData -
   * @return {void}
   *
   **/
    configureEditabilityViaDataTableConfiguration(dataTableConfiguration, adminData) {
        let canEditTable = this.canEditClockTable(adminData);

        if(!canEditTable) {
            this.removeEditColumnFromDataTableConfig(dataTableConfiguration);
            this.removeDeleteColumnFromDataTableConfig(dataTableConfiguration);
        }

        return dataTableConfiguration;
    }

  /**
   *
   * @description - Based on role some people cannot edit table. If so remove 'edit'
   *  columnKey
   * @param {Object} dataTableConfiguration -
   * @return {Object} dataTableConfiguration
   *
   **/
    removeEditColumnFromDataTableConfig(dataTableConfiguration) {
        let {columnKeys} = dataTableConfiguration;
        columnKeys = difference(columnKeys, ["edit"]);
        dataTableConfiguration.columnKeys = columnKeys;

        return dataTableConfiguration;
    }

    /**
   *
   * @description - Based on role some people cannot edit table. If so remove 'edit'
   *  columnKey
   * @param {Object} dataTableConfiguration -
   * @return {Object} dataTableConfiguration
   *
   **/
    removeDeleteColumnFromDataTableConfig(dataTableConfiguration) {
        let {columnKeys} = dataTableConfiguration;
        columnKeys = difference(columnKeys, ["delete"]);
        dataTableConfiguration.columnKeys = columnKeys;

        return dataTableConfiguration;
    }


  /**
   *
   * @description - Creates field data that doubles as form fields for modals
   * @param {Object} dataTableConfiguration - dtConfig
   * @return {Object} fieldData - field data for changing row values
   *
   **/
    createFieldData(dataTableConfiguration = this.dataTableConfiguration) {
        let {fieldDataNames, columnConfiguration} = dataTableConfiguration;
        let fieldData = util.cloneObject(pick(columnConfiguration, fieldDataNames));
        return fieldData;
    }

  /**
   *
   * @description - Extracts value by given path
   * @param {Object} fieldData - singleFieldData
   * @param {Object} rowData - single rowData
   * @return {String} value -
   *
   **/
    extractValueFromRowDataByPath(fieldData, rowData) {
        let {pathsInAPI: {appointment: {value: path}}} = fieldData;

        let value = get(rowData.originalData, path);

        return value;
    }

  /**
   *
   * @description - Attaches formatted date to field.value ONLY if applicable
   * @param {Object} field - fieldData that will have values added to it
   * @param {Object} extractedValue - value that may or may not be transformed
   *  into formatted date
   * @return {Object} field
   *
   **/
    getFormattedDateValueInField(field, extractedValue) {
        let {editConfiguration} = field;
        let value = extractedValue;

        if(editConfiguration && editConfiguration.date) {
            let {fromDateFormat, toDateFormat} = editConfiguration.date;
            value = moment(value, fromDateFormat).format(toDateFormat);
        }

        return value;
    }

  /**
   *
   * @description - Attaches values from rows to field data
   * @param {Object} fieldData - fieldData that will have values added to it
   * @param {Object} rowData - one row to get values from
   * @return {Object} fieldData - fieldData
   *
   **/
    attachRowValuesToFieldData(fieldData, rowData) {
    //Attach values to fieldData
        for(let field in fieldData) {
            let value = this.extractValueFromRowDataByPath(fieldData[field], rowData);

      //Will return either formatted date or extracted value
            value = this.getFormattedDateValueInField(fieldData[field], value);

            fieldData[field].value = value;
        }
        return fieldData;
    }

  /**
   *
   * @description - (RE-313 and RE336) Show this message for user viewing purposes
   * @return {String} - default message
   *
   **/
    getArchivedMessage() {
        return `This table is displayed for historical/audit purposes only - the
    appointee is not currently accruing time on the clock.`;
    }

  /**
   *
   * @description - Generates options from serviceUnitTypeMap
   * @param {Object} serviceUnitTypeMap - api hash for serviceUnitType options
   * @return {Object} options - hash containing serviceUnitType options
   *
   **/
    getServiceUnitTypeOptions(serviceUnitTypeMap) {
    //Extract and create id to name object
        let serviceUnitTypeMapValues = Object.values(serviceUnitTypeMap);

    //Create key value pair object for dropdown
        let options = util.arrayOfObjectsToKVObject(serviceUnitTypeMapValues,
      "serviceUnitTypeId", "serviceUnitDisplayText");

    //Sort them by "serviceUnitDisplayText"
        options = util.reformatObjectIntoCollectionSortedByValue(options);
        return options;
    }

  /**
   *
   * @description - Gets url parameters for main data request
   * @param {Object} fieldData - fieldData that will have values added to it
   * @param {Object} serviceUnitTypeMap - api hash for serviceUnitType options
   * @return {Object} fieldData - formatted fieldData
   *
   **/
    attachServiceUnitTypeOptions(fieldData, serviceUnitTypeMap) {
        let serviceUnitTypeOptions = this.getServiceUnitTypeOptions(serviceUnitTypeMap);
        fieldData.serviceUnitType.options = serviceUnitTypeOptions;
        return fieldData;
    }

  /**
   *
   * @description - Key value pair of names to values of fieldData
   * @param {Object} fieldData - fieldData
   * @return {Object} extractedValues - params needed for rowData call
   *
   **/
    extractFieldDataValues(fieldData = {}) {
        let extractedValues = {};
        for(let name in fieldData) {
      // 12/3/18 Object changes needs to exclude outside academicYear field
      // since its already inside appointmentInfo
            if(name!=="academicYear"){
                extractedValues[name] = fieldData[name].value;
            }
        }
        return extractedValues;
    }

  /**
   *
   * @description - Sets url parameters in template for main data request
   * @param {Object} fieldData - extract values from
   * @param {Object} rowData - original data
   * @return {Object} saveTemplate - tempalet to be sent to API
   *
   **/
    createSaveTemplate(fieldData = {}, rowData = {}) {
        let extractedValues = this.extractFieldDataValues(fieldData);
        let saveTemplate = {
            ...rowData,
            ...extractedValues,
            serviceUnitType: {
                serviceUnitTypeId: extractedValues.serviceUnitType
            }
        };
        return saveTemplate;
    }

  /**
   *
   * @description - Gets formatted url
   * @return {String} formattedUrl - url added with access token
   *
   **/
    getSaveTemplateUrl(dataTableConfiguration = this.dataTableConfiguration,
    access_token = this.access_token) {
        let {saveDataUrl} = dataTableConfiguration;
        let formattedUrl = util.formatDataTablesUrl(saveDataUrl, access_token);
        formattedUrl = formattedUrl+"&loggedInOpusId="+this.adminData.adminOpusId;
        return formattedUrl;
    }
     /**
   *
   * @description - Gets url parameters for main data request
   * @param {Object} fieldData - extract values from
   * @param {Object} rowData - original data
   * @return {Promise} - params needed for rowData call
   *
   **/
    async saveData(fieldData = {}, rowData = {}, typeOfSave) {
    //Get the url data
        let saveDataUrl = this.getSaveTemplateUrl();

    //Create template to save
        let saveTemplate = this.createSaveTemplate(fieldData, rowData);
        if(typeOfSave==="add"){
            // RE-313 Need to set correct academic year on save
            saveTemplate.appointmentInfo.academicYear = fieldData.academicYear.value;
        }
        console.log(saveTemplate);

    //Must stringify before saving
        let stringifiedTemplate = JSON.stringify(saveTemplate);
        
        return util.jqueryPostJson(saveDataUrl, stringifiedTemplate);
    }


    attachAcademicYearOptions = (fieldData = {}) => {
        // let currentYear = moment().format('YYYY');
        // let years = [];
        // let count = 0;
    
        var year = new Date().getFullYear();
        // var lastyear = new Date().getFullYear()-1; 

        // var range = [];
        var lastrange = [];
        var academicYear=[];
        lastrange.push(year);
        // range.push(year);
        for (var i = 1; i < 200; i++){
            lastrange.push(year - i);    
            // range.push(year - i);

            // Set oldest year here:
            if((year - i)===1979){
                break;
            }

            academicYear.push(lastrange[i]+"-"+(lastrange[i-1]).toString());
            // var fullyear = lastrange.concat(range);
        }
        fieldData.academicYear.options = academicYear;
        return fieldData;
    }

        /**
     *
     * @desc
     * @param {Object} rowData - formatted url with all args for deleting
     *
     **/
    getDeletePromise(selectedDeleteData, comingFrom) {
        let deleteParams = {
            opusPersonId: selectedDeleteData.opusPersonId,
            academicYear: selectedDeleteData.academicYear
        };
            // Excellence delete api needs an extra parameter, academicHierarchyPathId
        if(comingFrom==="Excellence"){
            deleteParams.academicHierarchyPathId = selectedDeleteData.originalData.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId;
        }
        let {access_token, dataTableConfiguration, adminData: {adminName: user}} = this;
        let args = jsonToUrlArgs({access_token, user, ...deleteParams});
        let url = `${dataTableConfiguration.deleteUrl}${args}`;
        return postJson(url);
    }

      /**
   *
   * @desc - clears all validation errors
   * @return {fieldData}
   *
   **/
    clearValidationErrors(fieldData) {
        for(let field in fieldData){
            if(fieldData[field].hasError){
                fieldData[field].hasError = false;
                fieldData[field].error = null;
            }
        }
        return fieldData;
    }

    validateAcademicYear = (fieldData) => {
        if(!fieldData.academicYear.value || fieldData.academicYear.value === ""){
            fieldData.academicYear.hasError = true;
            fieldData.academicYear.error = "Please select an academic year above.";
        }else{
            fieldData.academicYear.hasError = false;
            fieldData.academicYear.error = null;
        }
        return fieldData;
    }
}
