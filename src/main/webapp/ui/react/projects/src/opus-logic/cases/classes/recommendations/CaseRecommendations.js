import {set, get} from 'lodash';

//My imports
import {Cases} from '../Cases';
import * as util from '../../../common/helpers/';
import {urls} from '../../constants/recommendations/RecommendationsConstants';


export default class CaseRecommendations extends Cases {

  /**
   *
   * @desc - Set class variables
   * @param {Object} - class variables
   * @return {void}
   *
   **/
  constructor({adminData, globalData, access_token, ...args}) {
    super({adminData, globalData, access_token, ...args});

    this.setClassData({adminData, globalData, access_token});
  }

  extractRecommendationsData(caseRecommendationsAPIData = {}) {
    let {caseRecommendations} = caseRecommendationsAPIData;
    return caseRecommendations;
  }

  /**
   *
   * @desc - Gets url with access_token appended
   * @param {Object} fieldData - fields in program
   * @param {Object} commonCallOptions - options from adminData & globalData
   * @return {Object} fieldData - fields in program
   *
   **/
  addOptionsToFieldData(fieldData = {}, commonCallOptions = {}) {
    for(let name in fieldData) {
      let field = fieldData[name];
      let {optionsListName} = field;
      field.options = commonCallOptions[optionsListName];
    }

    return fieldData;
  }

  /**
   *
   * @desc - Formats fieldData with values from data by path
   * @param {Object} fieldData - fields in program
   * @param {Object} data - template data
   * @param {String} project - either cap or recommendations
   * @return {void}
   *
   **/
  setFieldValuesFromDataByRecommendationPath(fieldData = {}, data,
    project = 'recommendations') {
    for(let name in fieldData) {
      let {pathsInAPI: {[project]: {value: path}}} = fieldData[name];

      fieldData[name].value = get(data, path);
    }
  }


  /**
   *
   * @desc - Gets url with access_token appended
   * @param {Object} fieldData - fields in program
   * @param {Object} commonCallOptions - options from adminData & globalData
   * @param {String} project - if its "cap" or "recommendations"
   * @return {Object} fieldData - fields in program
   *
   **/
  setFieldDataValuesInTemplate(fieldData = {}, template = {},
    project = 'recommendations') {
    for(let name in fieldData) {
      let field = fieldData[name];
      let {value, pathsInAPI: {[project]: {value: path}}} = field;
      set(template, path, value);
    }

    return fieldData;
  }

  /**
   *
   * @desc - Gets url with access_token appended
   * @param {Object} - access_token
   * @return {String} - url to be used
   *
   **/
  getUrlForAPIData = ({access_token} = this) =>
    urls.getCaseRecommendationSummary({access_token});

  /**
   *
   * @desc - Gets the overall API data from the backend
   * @param {Object} caseId - Id of case
   * @return {Object} data - all the data that will come back
   *
   **/
  async getAPIData(caseId) {
    let url = this.getUrlForAPIData();

    let data = await util.jqueryGetJson(url, {caseId});
    // RE-320 Add an external member to an RC slate
    data = this.formatAPIDataForExternalMembers(data);
    
    return data;
  }

  formatAPIDataForExternalMembers = (data) => {
    let caseRC = data.caseReviewCommittes;
    // Separate code because this is an object and not an array
    for(let eachCaseRC of caseRC[1]){
        if(eachCaseRC.extMmbrName!==null){
          eachCaseRC.name = eachCaseRC.extMmbrName;
        }
        if(eachCaseRC.extMmbrOrg!==null){
          eachCaseRC.appointmentInfo.academicHierarchyInfo.departmentName = eachCaseRC.extMmbrOrg;
        }
        if(eachCaseRC.extMmbrTitle!==null){
          eachCaseRC.appointmentInfo.titleInformation.series = eachCaseRC.extMmbrTitle;
        }
    }
    for(let eachCaseRC of caseRC[2]){
      if(eachCaseRC.extMmbrName!==null){
        eachCaseRC.name = eachCaseRC.extMmbrName;
      }
      if(eachCaseRC.extMmbrOrg!==null){
        eachCaseRC.appointmentInfo.academicHierarchyInfo.departmentName = eachCaseRC.extMmbrOrg;
      }
      if(eachCaseRC.extMmbrTitle!==null){
        eachCaseRC.appointmentInfo.titleInformation.series = eachCaseRC.extMmbrTitle;
      }
    }

    return data;
  }
}
