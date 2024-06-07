import {set, pick} from 'lodash';

//My imports
import CaseRecommendations from './CaseRecommendations';
import FieldData from '../../../common/modules/FieldData';
import * as util from '../../../common/helpers/';
import {templates, urls} from
  '../../constants/recommendations/RecommendationsConstants';
import {recommendationsFields, defaultAttributeProperties} from
  '../../constants/recommendations/RecommendationsFieldDataConstants';

/**
*
* Base class dealing with Recommendations
* @author - Leon Aburime
* @class Recommendations
* @extends Cases
*
**/
export default class CAP extends CaseRecommendations {

  capSlateIndex = 1;
  capRCIndex = 2;
  capSlateFields = ['proposedRole', 'userComments'];
  capRCFields = ['proposedRole', 'finalRole', 'userComments'];
  addPersonOutsideUCLAFields = ['name', 'organization', 'title']
  FieldData = new FieldData();
  invalid = {null: true, '': true};

  /**
   *
   * @desc - Set class variables adn grouperPathText
   * @param {Object} - class variables
   * @return {void}
   *
   **/
  constructor({adminData, globalData, access_token, ...args}) {
    super({adminData, globalData, access_token, ...args});

    this.initClassVariables({adminData, globalData, access_token, ...args});
  }

  /**
   *
   * @desc Gets list for committee member roles
   * @param {Object} - globalData
   * @return {Object} capMemberRoleOptions - options list
   *
   **/
  getCAPCommitteeOptions({commonTypeReferences: {FinalRoles, ProposedRoles}} =
    this.globalData) {
    let args = ['commonTypeId', 'commonTypeValue'];

    let capMemberRoleOptions = {
      //Take these two out into their own function
      committeeMemberRoles: util.arrayOfObjectsToKVObject(FinalRoles, ...args),
      committeeMemberProposedRoles: util.arrayOfObjectsToKVObject(ProposedRoles,
        ...args)
    };

    return capMemberRoleOptions;
  }

  /**
   *
   * @desc Gets fields data for cap slate
   * @return {Object} fieldData - cap slate field data
   *
   **/
  getCAPSlateFieldData() {
    let fieldData = this.FieldData.createFieldDataBySingleAttributeProperty(
      defaultAttributeProperties, this.capSlateFields, recommendationsFields);

    let options = this.getCAPCommitteeOptions();
    this.addOptionsToFieldData(fieldData, options);

    return fieldData;
  }

  /**
   *
   * @desc Gets fields data for capRC
   * @return {Object} fieldData - cap slate field data
   *
   **/
  getCAPRCFieldData() {
    let fieldData = this.FieldData.createFieldDataBySingleAttributeProperty(
      defaultAttributeProperties, this.capRCFields, recommendationsFields);

    let options = this.getCAPCommitteeOptions();
    this.addOptionsToFieldData(fieldData, options);

    return fieldData;
  }

    /**
   *
   * @desc Gets fields data for capRC
   * @return {Object} fieldData - cap slate field data
   *
   **/
  getAddPersonOutsideUCLAFieldData() {
    let fieldData = this.FieldData.createFieldDataBySingleAttributeProperty(
      defaultAttributeProperties, this.addPersonOutsideUCLAFields, recommendationsFields);

    // let options = this.getCAPCommitteeOptions();
    // this.addOptionsToFieldData(fieldData, options);

    return fieldData;
  }

  /**
   *
   * @desc - If CAP RC is 'Yes' we can add member
   * @param {Object} caseRecommendationsAPIData - appointmentInfo
   * @return {Boolean} canAddCAPMember - if you can add member
   *
   **/
  canAddCAPMember(caseRecommendationsAPIData = {}) {
    let caseRecommendations = this.extractRecommendationsData(caseRecommendationsAPIData);
    let canAddCAPMember = false;

    let capRC = caseRecommendations.filter(e => e.recommender === 'CAP RC');
    if(capRC && capRC[0].required === 'Yes') {
      canAddCAPMember = true;
    }

    return canAddCAPMember;
  }

  /**
   *
   * @desc - Extracts capRC and capSlate rows from API
   * @param {Object} caseRecommendationsAPIData - appointmentInfo
   * @return {Object} - capRC and capSlate data
   *
   **/
  extractCAPDataFromAPI(caseRecommendationsAPIData) {
    let {caseReviewCommittes} = caseRecommendationsAPIData;
    let {capSlateIndex, capRCIndex} = this;
    return {capRC: caseReviewCommittes[capRCIndex],
      capSlate: caseReviewCommittes[capSlateIndex]};
  }

  /**
   *
   * @desc - Gets deptName, rank and step
   * @param {Object} appointmentInfo - appointmentInfo
   * @return {Object} data - three fields
   *
   **/
  extractAcademicDataFromApptInfo(appointmentInfo, data) {
    let {academicHierarchyInfo: {departmentName}, titleInformation: {series, rank:
      {rankTypeDisplayText}, step: {stepTypeDescription}}} = appointmentInfo;

    // OPUSDEV-3390 Display 'N/A' for rank and step if external member
    if(data.extMmbrName && data.extMmbrName!==null){
      rankTypeDisplayText = 'N/A';
      stepTypeDescription = 'N/A';
      if(data.extMmbrTitle===null || data.extMmbrTitle===""){
        series = '';
      }
    }

    return {
      series,
      step: stepTypeDescription,
      rank: rankTypeDisplayText,
      departmentName
    };
  }

  /**
   *
   * @desc - Gets display text that will be shown on page
   * @param {Object} caseRecommendationsAPIData - API data
   * @return {Object} data - three fields
   *
   **/
  extractCAPDisplayFields(capResults) {

    let results = capResults.map(({name, committeeMemberFinalRole, committeeMemberProposedRole,
      appointmentInfo, ...data}) => {
      //deptName, rank, step
      let academicData = this.extractAcademicDataFromApptInfo(appointmentInfo, data);

      //Return all fields
      return {name, committeeMemberFinalRole, committeeMemberProposedRole,
        appointmentInfo, ...academicData, ...data
      };
    });

    return results;
  }

  /**
   *
   * @desc - Extracts cap RC data
   * @param {Object} caseRecommendationsAPIData - api data
   * @return {Object} - capRC display results
   *
   **/
  extractCAPRCDisplayFields(caseRecommendationsAPIData) {
    let {capRC} = this.extractCAPDataFromAPI(caseRecommendationsAPIData);

    return this.extractCAPDisplayFields(capRC);
  }

  /**
   *
   * @desc - Extracts cap slate data
   * @param {Object} caseRecommendationsAPIData - api data
   * @return {Object} - cap slate display results
   *
   **/
  extractCAPSlateDisplayFields(caseRecommendationsAPIData) {
    let {capSlate} = this.extractCAPDataFromAPI(caseRecommendationsAPIData);

    return this.extractCAPDisplayFields(capSlate);
  }

  /**
   *
   * @desc - Gets grouperPathText and string for nameSearch
   * @param {String} searchString - API data
   * @return {Object} - args for getting namesearch
   *
   **/
  getNameSearchAPIArgs(searchString) {
    let {grouperPathText} = this;
    return {grouperPathText, searchString};
  }

  /**
   *
   * @desc - Gets grouperPathText and string for nameSearch
   * @param {String} nameSearchResults -
   * @param {String} labelKey -
   * @return {Object} - args for getting namesearch
   *
   **/
  formatNameSearchResults(nameSearchResults, labelKey = 'label') {
    let nameMapper = {};

    for(let result of nameSearchResults) {
      let {fullName} = result.appointeeInfo;

      for(let appointment of result.appointmentInfo) {
        let {departmentName: deptText} = appointment.academicHierarchyInfo;
        let {affiliation} = appointment.affiliationType;
        let {series} = appointment.titleInformation;
        let {rankTypeDisplayText: rank} = appointment.titleInformation.rank;
        let {stepTypeDescription: step} = appointment.titleInformation.step;

        let department = deptText;
        let seriesText = series in this.invalid ? '' : `${series}/`;
        let rankText = rank in this.invalid ? '' : `${rank}/`;
        let stepText = step in this.invalid ? '' : `${step}`;
        let rank_step = `${rank}/${step}`;
        let name = `${fullName} - ${department} - ${affiliation} - ${seriesText}${rankText}${stepText}`;

        nameMapper[name] = {...result, appointmentInfo: appointment, series, rank, step,
          rank_step, department, affiliation, name: fullName, fullName, [labelKey]: name};
      }
    }

    return nameMapper;
  }

  /**
   *
   * @desc - Gets autocomplete results from API and populates the fields
   * @param {Object} name - Event field that has the name
   * @return {Object}
   *
   **/
  getNameSearchResults = async (searchString) => {
    let url = this.getNameSearchURL();
    let urlArgs = this.getNameSearchAPIArgs(searchString);

    //let {value:searchString} = event.target;
    let results = await util.jqueryGetJson(url, urlArgs);

    return results;
  }

  /**
   *
   * @desc - Get nameSearch URL
   * @return {String} - nameSearch URL
   *
   **/
  getNameSearchURL() {
    let nameSearchUrl = urls.nameSearch({access_token: this.access_token});
    return nameSearchUrl;
  }

  /**
   *
   * @desc - Gets update member url with access token
   * @param {Object} access_token - access_token
   * @return {Object} - url to update member
   *
   **/
  getUpdateMemberUrl = (access_token = this.access_token) =>
    urls.addMemberUrl({access_token})

  /**
   *
   * @desc - Set committeeTypeId to 8
   * @param {Object} template - template to be saved
   * @return {Object} template - template to be saved
   *
   **/
  setCommitteeTypeIdInMemberTemplate(template) {
    template.committeeTypeId = 8;
    return template;
  }

  /**
   *
   * @desc - Formats template by adding appointmentInfo and name of user updating
   *   template
   * @param {Object} template - access_token
   * @param {Object} memberAPIData -
   * @param {Object} adminData -
   * @return {Promise} - promise
   *
   **/
  formatTemplateFromMemberAPIData(template, memberAPIData) {
    let {appointmentInfo, appointeeInfo: {fullName} = {}, name = fullName}
      = memberAPIData;

    Object.assign(template, {name, appointmentInfo});

    return template;
  }

  /**
   *
   * @desc - Sets caseData specifically caseId into template
   * @param {Object} template - template to be modified
   * @param {Object} caseData - data to transfer to template
   * @return {Object} template - template
   *
   **/
  formatTemplateFromCaseData(template, caseData = {}) {
    template.caseId = caseData.caseId;

    return template;
  }

  /**
   *
   * @desc - Gets url with access_token appended
   * @param {Object} fieldData - fields in program
   * @param {Object} commonCallOptions - options from adminData & globalData
   * @return {Object} fieldData - fields in program
   *
   **/
  // setFieldDataValuesInTemplate(fieldData = {}, template = {}) {
  //   for(let name in fieldData) {
  //     let field = fieldData[name];
  //     let {value, pathsInAPI: {cap: {value: path}}} = field;
  //     set(template, path, value);
  //   }
  //
  //   return fieldData;
  // }


  /**
   *
   * @desc - Updates member
   * @param {Object} fieldData - access_token
   * @param {Object} memberAPIData -
   * @param {Object} caseData -
   * @return {Object} clonedTemplate - template to be saved
   *
   **/
  formatMemberTemplate(fieldData, memberAPIData, caseData = {}) {
    //Clone and format member template thatll be updated
    let clonedTemplate = util.cloneObject(templates.committeeMemberTemplate);
    let apiProjectPath = 'cap';
    this.setFieldDataValuesInTemplate(fieldData, clonedTemplate, apiProjectPath);
    this.setCommitteeTypeIdInMemberTemplate(clonedTemplate);
    this.formatTemplateFromMemberAPIData(clonedTemplate, memberAPIData);
    this.formatTemplateFromCaseData(clonedTemplate, caseData);
    clonedTemplate.loggedInUserInfo.adminName = this.adminData.adminName;
    clonedTemplate.caseReviewCommitteeId = memberAPIData.caseReviewCommitteeId;

    return clonedTemplate;
  }

   /**
   *
   * @desc - Updates member
   * @param {Object} fieldData - access_token
   * @param {Object} memberAPIData -
   * @param {Object} caseData -
   * @return {Object} clonedTemplate - template to be saved
   *
   **/
  formatExternalMemberTemplate(fieldData, memberAPIData, caseData = {}, committeeAddedByGroupId) {
    let clonedTemplate = util.cloneObject(templates.committeeMemberTemplate);
    this.setCommitteeTypeIdInMemberTemplate(clonedTemplate);
    this.formatTemplateFromCaseData(clonedTemplate, caseData);
  
    clonedTemplate.extMmbrName = fieldData.name.value;
    clonedTemplate.extMmbrOrg = fieldData.organization.value;
    clonedTemplate.extMmbrTitle = fieldData.title.value;
    clonedTemplate.committeeMemberProposedRoleId = fieldData.proposedRole.value;
    if(fieldData.finalRole){
      clonedTemplate.committeeMemberFinalRoleId = fieldData.finalRole.value;
    }
    clonedTemplate.loggedInUserInfo.adminName = this.adminData.adminName;
    clonedTemplate.appointmentInfo = {
      opusPersonId: 0,
      appointmentId: this.appointmentId
    }
    clonedTemplate.committeeAddedByGroupId = committeeAddedByGroupId;

    if(memberAPIData && memberAPIData.caseReviewCommitteeId){
      clonedTemplate.caseReviewCommitteeId = memberAPIData.caseReviewCommitteeId;
    }
    clonedTemplate.commentsText = fieldData.userComments.value;
    return clonedTemplate;
  }

  /**
   *
   * @desc - Updates CAPRC table and specifically adds the groupId of capRC
   * @param {Object} fieldData - fieldData
   * @param {Object} memberAPIData - member data for api
   * @param {Object} caseData - caseId
   * @return {void}
   *
   **/
  updateCAPRCMember(fieldData, memberAPIData, caseData, showExternalMemberFields) {
    let template;
    if(showExternalMemberFields){
      template = this.formatExternalMemberTemplate(fieldData, memberAPIData, caseData, 2);
    }else{
      template = this.formatMemberTemplate(fieldData, memberAPIData, caseData);

      //Set which cap section its getting saved to
      template.committeeAddedByGroupId = this.capRCIndex;

    }
    return this.saveCAPMemberToAPI(template);
  }

  /**
   *
   * @desc - Updates CAPSlate table and specifically adds the groupId of cap slate
   * @param {Object} fieldData - fieldData
   * @param {Object} memberAPIData - member data for api
   * @param {Object} caseData - caseId
   * @return {void}
   *
   **/
  updateCAPSlateMember(fieldData, memberAPIData, caseData, showExternalMemberFields) {
    let template;
    if(showExternalMemberFields){
      template = this.formatExternalMemberTemplate(fieldData, memberAPIData, caseData, 1);
    }else{
      template = this.formatMemberTemplate(fieldData, memberAPIData, caseData);

      //Set which cap section its getting saved to
      template.committeeAddedByGroupId = this.capSlateIndex;
    }
    return this.saveCAPMemberToAPI(template);
  }

  /**
   *
   * @desc - Saves member data to api
   * @param {Object} template - template to save
   * @return {Promise} - api promise
   *
   **/
  saveCAPMemberToAPI(template) {
    console.log(template)
    //Get formatted url w/ access token to update member
    let url = this.getUpdateMemberUrl();

    let stringified = this.stringify(template);

    //Send to API and return promise
    return util.jqueryPostJson(url, stringified);
  }

  /**
   *
   * @desc - Deleting member from either CAP table
   * @param {Object} data - data from the modalFields to be changed over
   * @param {Number} caseId - id of case to be saved to
   * @param {Object} adminData - adminData
   * @return {Promise} - deleting member
   *
   **/
  deleteCAPMember(data = {}, caseId, adminData = this.adminData) {
    let template = this.formatDeleteCAPMemberTemplate(data, caseId, adminData);

    let deleteUrl = this.getDeleteUrl();

    let stringified = this.stringify(template);
    return util.jqueryPostJson(deleteUrl, stringified);
  }

  /**
   *
   * @desc - Formatting the delete template
   * @param {Object} data - data from the modalFields to be changed over
   * @param {Number} caseId - id of case to be saved to
   * @param {Object} adminData - adminData
   * @return {Object} - formatted template for delete
   *
   **/
  formatDeleteCAPMemberTemplate(data = {}, caseId, adminData = this.adminData) {
    let template = util.cloneObject(templates.committeeMemberTemplate);
    template.loggedInUserInfo.adminName = adminData.adminName;
    template.committeeTypeId = 8;
    template.delete = 'Y';

    let {name, committeeAddedByGroupId, appointmentInfo, caseReviewCommitteeId}
      = data;

    Object.assign(template, {name, appointmentInfo, committeeAddedByGroupId,
      caseReviewCommitteeId, caseId});

    return template;
  }

  /**
   *
   * @desc - Get delete URL
   * @return {String} - delete URL
   *
   **/
  getDeleteUrl() {
    let {access_token} = this;
    let deleteUrl = urls.addMemberUrl({access_token});
    return deleteUrl;
  }
}
