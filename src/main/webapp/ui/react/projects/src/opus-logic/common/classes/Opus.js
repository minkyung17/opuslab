import {format} from "util";

import {text} from "../constants/Opus.constants";

/**
*
* @classdesc Base Class for all things Opus.  Will be used for Cases, Datatables and
*   anything else that may come along
* @author Leon Aburime
* @class Opus
*
**/
export default class Opus {

  /**
  *
  * @desc - Class Variables
  *
  **/
    adminData = null;
    globalData = null;
    access_token = null;
    formattedGlobalData = null;

  /**
  *
  * @desc - Takes in an object of arguments and sets the class variable to it i.e.
  *  Object.assign(this, {key: value}) -> this.key = value
  * @param {Object} - args -> key-value pair of arguments
  * @return {void}
  *
  **/
    setClassData({...args} = {}) {
        for(let key in args) {
            this[key] = args[key];
        }
    }

  /**
  *
  * @desc - Takes in an array of keys that act as names to get from this class
  *   i.e. getClassData(['access_token']) returns {access_token:'ac43...'}
  * @param {Object} names - array of key names to get
  * @return {Object} data - data that I wanted to be returned
  *
  **/
    getClassData(names = []) {
        let data = {};
        names.map(name => {
            data[name] = this[name];
        });
        return data;
    }

  /**
   *
   * @desc - returns formatted url for specific data for DataTable
   * @param {String} suffix - base url
   * @param {String} access_token - token
   * @param {String} grouperPathText - obvious
   * @param {Boolean} addGrouper - whether to add grouper or not
   * @param {String} grouper_key - name of grouper arg
   * @returns {String} - formatted url
   *
   **/
    addAccessTokenAndGrouperToUrl = (suffix, access_token, {grouperPathText,
    access_token_key = text.access_token_key, addGrouper = false,
    grouper_key = text.grouper_path_text_key} = {}) => {
        let formatted_grouperPathText = encodeURIComponent(grouperPathText);
        let grouper_arg = addGrouper ? `&${grouper_key}=${formatted_grouperPathText}`
      : "";
        return format(`%s?${access_token_key}=%s%s`, suffix, access_token, grouper_arg);
    }


  /**
  *
  * @desc - returns true if any field values have errors
  * @param {Object} fieldData - appointment to send to API
  * @return {Boolean} - if any of the fields have errors
  *
  **/
    doFieldsHaveErrors(fieldData = {}) {
        let hasError = false;
        for(let name in fieldData) {
            hasError = hasError || fieldData[name].hasError;
        }

        return hasError;
    }

    consoleLog(typeOfReq, functionName){
        console.log(typeOfReq+" -> "+functionName+": " + new Date());
    }

    consoleLogDifference(typeOfReq, message = "TIME DIFFERENCE FOR GETTING AND SETTING DATA FROM API"){
        if(typeOfReq.toLowerCase()==="start"){
            this.startTime = new Date();
        }else{
            let finishTime = new Date();
            let diff = Math.abs(this.startTime - finishTime);
            console.log(message+": "+ diff/1000+" seconds");
        }
    }
}
