import {set, get} from 'lodash';

//My imports
import CaseRecommendations from './CaseRecommendations';
import * as util from '../../../common/helpers/';
import {urls} from '../../constants/recommendations/RecommendationsConstants';
import {recommendationValidations} from
  '../../constants/recommendations/RecommendationValidations';
import {fieldsInAPI, defaultAttributeProperties} from
  '../../constants/recommendations/RecommendationsFieldDataConstants';
/**
*
* Base class dealing with Recommendations
* @author - Leon Aburime
* @class Recommendations
* @extends Cases
*
**/
export default class Recommendations extends CaseRecommendations {

  recommendationTypeIdToFieldInfo = {
    1: {
      title: 'Department Chair Recommendation', fieldData: {}, fields: ['recommendation',
        'deptVotingCommitteeResultsDt', 'rank', 'step', 'salary', 'userComments']
    },
    2: {
      title: 'Dean Recommendation', fieldData: {}, fields: ['recommendation',
        'dateOfRecommendation', 'rank', 'step', 'salary', 'userComments']
    },
    3: {
      title: 'CAP Recommendation', fieldData: {}, fields: ['required',
      'typeOfCAPCommittee', 'recommendation', 'strengthOfRecommendation',
      'dateOfRecommendation', 'rank', 'step', 'salary', 'userComments']
    },
    4: {
      title: 'Vice Chancellor Decision', fieldData: {}, fields: ['required',
        'recommendationDecision', 'dateOfDecision', 'rank', 'step', 'salary',
        'userComments']
    },
    8: {
      title: 'CAP RC Recommendation', fieldData: {},
      fields: ['required', 'dateOfCommitteeMembership', 'dateOfMeeting',
        'dateReportSubmittedToAPO', 'dateReportSentToDean', 'recommendation',
        'rank', 'step', 'salary', 'userComments']
    },
    9: {
      title: 'ClinCap', fieldData: {}, fields: ['required', 'typeOfCAPCommittee',
        'recommendation', 'strengthOfRecommendation', 'dateOfRecommendation',
        'rank', 'step', 'salary', 'userComments']
    },
    10: {
      title: 'CAP Subcommittee', fieldData: {}, fields: ['required', 'typeOfCAPCommittee',
        'recommendation', 'strengthOfRecommendation', 'dateOfRecommendation',
        'rank', 'step', 'salary', 'userComments']
    }

  };

  invalid = {undefined: true, null: true};

  /**
   *
   * @desc - Set class variables
   * @param {Object} - adminData, globalData, access_token
   * @return {void}
   *
   **/
  constructor({adminData, globalData, access_token, ...args}) {
    super({adminData, globalData, access_token, ...args});

    this.setClassData({adminData, globalData, access_token});
  }

  /**
   *
   * @desc - Format the actionIds and their options
   * @param {Object} actionOutcomes - actionOutcomes
   * @return {Object} actionOutcomeOptions
   *
   **/
  formatActionOutcomes(actionOutcomes) {
    let options = {};

    for(let actionNumber in actionOutcomes) {
      //Null options
      if(!actionOutcomes[actionNumber]) continue;

      //options[actionNumber] = []; Needed?

      //Create Select options dropdown
      options[actionNumber] = util.arrayOfObjectsToKVObject(
        actionOutcomes[actionNumber], 'code', 'name');
    }

    return options;
  }

  /**
   *
   * @desc - Can the user edit the recommendations based on role. Must be no
   *  waiver
   * @param {Object} recommendation - specific recommendation
   * @return {Bool} - whether the user can update the recommendations
   *
   **/
  canEditRecommendation(recommendation = {}) {
    let isNoWaiver = recommendation.required === 'No-Waiver';
    return !isNoWaiver;
  }

  /**
   *
   * @desc - Format the actionIds and their options
   * @param {Object} - actionTypeId, actionCategoryId
   * @param {Object} - adminData, globalData
   * @return {Object} actionOutcomeOptions
   *
   **/
  formatOptions({actionTypeId, actionCategoryId}, {adminData, globalData} = this) {
    //Get Lists from commonType references in globalData
    let commonTypeRefLists = this.getCommonTypeReferencesOptionsFromGlobalData(globalData);

    //Get rank and step list
    let adminDataLists = this.getFormattedListsFromAdminData(adminData);

    //Get lists specifically for actionOutcome
    let actionOutcomeLists = this.getActionOutcomeOptions(globalData, {actionTypeId,
      actionCategoryId});

    //Now combine them all
    return {...commonTypeRefLists, ...adminDataLists, ...actionOutcomeLists};
  }

  /**
   *
   * @desc - Get rank and step array list
   * @param {Object} adminData - adminData
   * @return {Object} actionOutcomeOptions
   *
   **/
  getFormattedListsFromAdminData(adminData) {
    let {filterMap: {rankList: rank = [], stepList: step = []} = {}} = adminData;
    this.addBlankOptionToStepList(step);

    return {rank, step};
  }

  /**
   *
   * @desc - Adds blank strink to step array
   * @param {Array} stepOptions - array of stepoptions
   * @return {Array} stepOptions - options
   *
   **/
  addBlankOptionToStepList(stepOptions = []) {
    stepOptions.unshift('');
    return stepOptions;
  }

  /**
   *
   * @desc - Gets formatted actionOutcomes from actionType and actionCategory
   * @param {Object} globalData - globalData
   * @param {Array} - actionTypeId, actionCategoryId
   * @return {Object} - actionOutcomesOptions
   *
   **/
  getActionOutcomeOptions(globalData, {actionTypeId, actionCategoryId}) {
    let actionOutcome = `${actionCategoryId}-${actionTypeId}`;

    let {actionOutcomes} = globalData;

    let options = this.formatActionOutcomes(actionOutcomes);

    let actionOutcomesOptions = options[actionOutcome];

    return {actionOutcomesOptions};
  }

  /**
   *
   * @desc - Gets dropdown options for ui menu
   * @param {Object} globalData - Common call globaldata from the backend
   * @return {Object} globalDataOptions - dropdown options
   *
   **/
  getCommonTypeReferencesOptionsFromGlobalData(globalData) {
    let {RecommendationStrengthId, RecommendationTypeId, RecommendationOutcomes}
      = globalData.commonTypeReferences;

    let args = ['commonTypeId', 'commonTypeValue'];

    let globalDataOptions = {
      requiredOptions: ['Yes', 'No'],
      capCommitteeType: {3: 'CAP', 9: 'ClinCAP', 10: 'CAP Subcommittee'},
      recommendationOptions: ['Recommend', 'Do Not Recommend'],
      recommendationOutcomes: util.arrayOfObjectsToKVObject(RecommendationOutcomes,
        ...args),
      recommendationTypes: util.arrayOfObjectsToKVObject(RecommendationTypeId,
        ...args),
      recommendationStrengthIds: util.arrayOfObjectsToKVObject(RecommendationStrengthId,
        ...args)
    };

    return globalDataOptions;
  }

  /**
   *
   * @desc - Put values from template to data
   * @param {Array} fieldNames - name of fields
   * @param {Object} fieldPool - pool of fields to grab data from
   * @return {Object} fieldData - all fields
   *
   **/
  //createFieldData(caseRecommendations, fields = [], fieldPool = fieldsInAPI) {
  createFieldData(fieldNames = [], fieldPool = fieldsInAPI) {

    let fieldData = this.FieldData.createFieldDataBySingleAttributeProperty(
      defaultAttributeProperties, fieldNames, fieldPool);


    //this.addValuesToFieldData_preServer(fieldData, caseRecommendations);

    //this.addOptionsToFieldData(fieldData);

    return fieldData;
  }

  /**
   *
   * @desc - Put values from template to data
   * @param {Object} fieldData - all fieldData
   * @param {Object} template -
   * @return {Object} fieldData - all fieldData
   *
   **/
  addValuesToFieldData(fieldData = {}, template = {}) {
    for(let name in fieldData) {
      let field = fieldData[name];

      let {pathsInAPI: {recommendations: {value} = {}} = {}} = field;
      field.value = get(template, value);
    }
  }

  /**
   *
   * @desc - creates fieldData for all recommendation fields
   * @param {Object} - actionCategoryId, actionTypeId
   * @return {Object} this.recommendationTypeIdToFieldInfo - all generated
   *  fieldData by recTypeID
   *
   **/
  createAllFieldData({actionCategoryId, actionTypeId}) {
    let options = this.formatOptions({actionCategoryId, actionTypeId});
    //let caseRecommendations = this.extractRecommendationsData(caseRecommendationsAPIData);

    for(let recTypeID in this.recommendationTypeIdToFieldInfo) {
      let {fields} = this.recommendationTypeIdToFieldInfo[recTypeID];
      let fieldData = this.createFieldData(fields);
      this.addOptionsToFieldData(fieldData, options);
      this.recommendationTypeIdToFieldInfo[recTypeID].fieldData = fieldData;
    }

    return this.recommendationTypeIdToFieldInfo;
  }

  /**
   *
   * @desc - Retrieve title and fieldData by recommendationTypeId
   * @param {Number} recommendationTypeId - id of recommendation
   * @return {Object} fieldDataInfo - all info
   *
   **/
  getFieldDataInfoForRecommendationByTypeId(recommendationTypeId) {
    let fieldDataInfo = this.recommendationTypeIdToFieldInfo[recommendationTypeId];

    return fieldDataInfo;
  }

  /**
   *
   * @desc - If typeOfCAPCommittee and recommendation exists then set recommendation
   *  to value of typeOfCAPCommittee
   * @param {Object} fieldData - all fieldData
   * @return {Object} fieldData - all fieldData
   *
   **/
  setRecommendationTypeIdToCapCommitteeTypeId(fieldData = {}) {
    //Make sure these fields exist
    let capCommitteeTypeInvalid = fieldData.typeOfCAPCommittee in this.invalid;
    let recommendationIsInvalid = fieldData.recommendation in this.invalid;

    if(capCommitteeTypeInvalid || recommendationIsInvalid) {
      return fieldData;
    }

    fieldData.recommendation.value = fieldData.typeOfCAPCommittee.value;

    return fieldData;
  }

  /**
  *
  * @desc - Create and format template for Profile Save
  * @param {Object} allFieldData - appointment to send to API
  * @param {Object} validateFieldNames - key value pair of fieldName to validation
  *  type.
  * @return {Object} - fieldData
  *
  **/
  validateAllFieldDataOnSave(allFieldData = {}, validateFieldNames =
    recommendationValidations) {
    this.Validator.validateAllFieldDataOnSave(allFieldData, validateFieldNames);
    return allFieldData;
  }

  /**
   *
   * @desc - Get url w/ access token to save data
   * @param {String} access_token - access token
   * @return {String} - formatted url with access_token
   *
   **/
  getUpdateCaseAPI(access_token = this.access_token) {
    return urls.updateCaseUrl({access_token});
  }

  /**
   *
   * @desc - Save case data to API
   * @param {Object} fieldData - all fieldData to be saved
   * @param {Object} recommendation - recommmendation case
   * @param {Object} caseData - caseData
   * @return {Promise} - promises to save the data
   *
   **/
  updateCaseAPI(fieldData, recommendation, caseData = {}) {
    let template = this.formatUpdateCaseAPITemplate(fieldData, recommendation, caseData);

    console.log('Rec. template saving to API ', template);

    let stringified = this.stringify(template);
    let url = this.getUpdateCaseAPI();
    return util.jqueryPostJson(url, stringified);
  }

  /**
   *
   * @desc - Gets the formatted Case API template
   * @param {Object} fieldData - all fieldData to be saved
   * @param {Object} recommendation - recommmendation case
   * @param {Object} caseData - caseData
   * @return {Object} template - the formatted template
   *
   **/
  formatUpdateCaseAPITemplate(fieldData, recommendation, caseData) {
    let template = util.cloneObject(recommendation);
    this.setFieldDataValuesInTemplate(fieldData, template);
    this.setRecommendationTypeIdToCapCommitteeTypeId(fieldData);

    template.loggedInUserInfo = this.populateLoggedInUserInfoWithAdminData();
    template.opusCase.caseId = caseData.caseId;
    return template;
  }
}
