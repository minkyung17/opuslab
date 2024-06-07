import {get, pick} from "lodash";

//My imports
import {Clock} from "./Clock";
import * as validations from "../validations";
import Validator from "../../common/modules/Validate";
import Permissions from "../../common/modules/Permissions";
import * as util from "../../../opus-logic/common/helpers/";
import {eightYearClockValidations} from "../constants/EightYearClockConstants";
import {config} from "../constants/ExcellenceClockConstants";


export default class EightYearClock extends Clock {
    defaultConfigName = "eightYearClock";
    defaultDataTableConfiguration = util.cloneObject(config);
    Validator = new Validator();
    validationFunctions = null;
    Permissions = null;

  /**
   *
   * @desc  - Start it off
   * @param {Object} args - adminData, globalData, config_name
   * @return {void}
   *
   **/
    constructor(args = {}) {
        super(args);

        this.startLogic(args);
    }

  /**
   *
   * @desc  - Automatic start, create Permissions and set specific data such
   *  as validations
   * @param {Object} args -
   * @return {void}
   *
   **/
    startLogic(args) {
        super.startLogic(args);
        this.Permissions = new Permissions(args.adminData);
        this.setLogicClassVariables(args);
        this.setValidationFunctions();
    }

  /**
   *
   * @desc  - Format dataTableConfiguration before its cloned, set in Logic,
   *  or otherwise configured
   * @param {Object} - dataTableConfiguration, globalData, adminData
   * @return {Object} dataTableConfiguration
   * MOSES AND CELIA. This function is the same in ExcellenceClock. You can
   * delete here and move it to Clock.js
   **/
    initiallyFormatDataTableConfiguration({dataTableConfiguration =
    this.defaultDataTableConfiguration, globalData, adminData}) {
        super.initiallyFormatDataTableConfiguration({dataTableConfiguration, globalData,
      adminData});

        this.configureEditabilityViaDataTableConfiguration(dataTableConfiguration,
      adminData);

        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Adds "tocTakenBelowTOCCredited" save validation to
   *  "unitTOCTakenCount"
   * @return {void}
   *
   **/
    setValidationFunctions() {
        let {tocTakenBelowTOCCredited} = this;
        eightYearClockValidations.unitTOCTakenCount.onSaveValidations =
      [tocTakenBelowTOCCredited];
        this.validationFunctions = eightYearClockValidations;
    }

  /**
   *
   * @desc  - Add values in super class then add serviceUnitTypeId because it
   *  needs a value for the dropdown selection
   * @param {Object} fieldData - single field
   * @param {Object} rowData - single result
   * @return {Object} fieldData
   *
   **/
    setServiceUnitTypeValue(fieldData, rowData) {
        if(fieldData.serviceUnitType) {
            fieldData.serviceUnitType.value = rowData.originalData.serviceUnitType.serviceUnitTypeId;
        }

        return fieldData;
    }

  /**
   *
   * @desc  - Add values in super class then add serviceUnitTypeId because it
   *  needs a value for the dropdown selection
   * @param {String} fieldData - fieldValue
   * @param {Boolean} rowData -
   * @return {Object} fieldData
   *
   **/
    attachRowValuesToFieldData(fieldData, rowData) {
        super.attachRowValuesToFieldData(fieldData, rowData);

        this.setServiceUnitTypeValue(fieldData, rowData);
        return fieldData;
    }

  /**
   *
   * @desc - TOC Taken must be integer 0,1,2
   * @param {String} fieldValue - fieldValue
   * @param {Boolean} returnMessage -
   * @param {Boolean} tocCredited -
   * @return {Boolean} tocCredited
   *
   **/
    tocTakenBelowTOCCredited = (fieldValue, returnMessage = false) => {
        return validations.tocTakenBelowTOCCredited(fieldValue, returnMessage,
      this.fieldData.unitTOCYearCount.value);
    }

  /**
   *
   * @desc - Show this message for user viewing purposes
   * @param {Bool} opusPersonTenureArchived - whether to show message or not
   * @return {String} - message to be displayed
   *
   **/
    getArchivedMessage(opusPersonTenureArchived) {
        return opusPersonTenureArchived ? super.getArchivedMessage() : null;
    }

  /**
   *
   * @desc - Will validate all fields according to "eightYearClockValidations"
   * @param {Object} fieldData - fieldValue
   * @return {void}
   *
   **/
    validateFieldData(fieldData = {}) {
        this.Validator.validateAllFieldDataOnSave(fieldData, this.validationFunctions,
      {wipeDisabledFieldErrors: false, wipeInvisibleFieldErrors: false});
    }

  /**
   *
   * @desc - If user is DA they cannot edit TOC
   * @param {Object} fieldData - fieldValue
   * @return {void}
   *
   **/
    canEditTOC() {
        let {isOA, isAPO, isAPOAdmin} = this.Permissions;
        return isOA || isAPO || isAPOAdmin;
    }

    getDataForAddNewModal = async () => {
        let {access_token, adminData} = this;
        let urlParameters = {access_token, loggedInOpusId: adminData.adminOpusId};
        let result = await util.fetchJson(config.addNewUrl, urlParameters);
        return result;
    }

}
