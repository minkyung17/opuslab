import CaseFlow from './CaseFlow';

import {text} from '../../constants/caseflow/NameSearchConstants';
import {urls} from '../../constants/CasesConstants';
import * as util from '../../../common/helpers/';

/**
*
* @classdesc Opus Logic class for NameSearch in CaseFlow. Takes care of everything
*   non UI related
* @author - Leon Aburime
* @class NameSearch
* @extends CaseFlow
*
**/
export default class NameSearch extends CaseFlow {

  /**
  *
  * @desc - Static Variables
  *
  **/
  static noResults = text.noResults;

  /**
  *
  * @desc - Instance Variables
  *
  **/
  person = {};
  label_key = text.label_key;
  person_key = text.person_key;
  appointmentInfo = [];
  appointmentSetList = [];
  currentNameSearchResults = {};
  formattedNamesSet = new Set();
  formattedNamesToDataHash = {};

  /**
  *
  * @desc - Takes in an object of arguments and sets the class variable to it i.e.
  *  Object.assign(this, {key: value}) -> this.key = value
  *  NOTE: Only shown here for other devs so if you look in this file you will
  *   see the purpose of it.  The method implementation exists in Opus Superclass
  * @param {Object} args - key-value pair of arguments
  * @return {void}
  *
  **/
  setClassData(args = {}) {
    return super.setClassData(args);
  }

  /**
  *
  * @desc - Takes in an array of keys that act as names to get from this class
  *   i.e. getClassData(['access_token']) returns {access_token:'ac43...'}
  *  NOTE: Commented out here so if you look in this file you will see the purpose
  *   of it.  This method exists in Opus Superclass
  * @param {Object} names - array of key names to get
  * @return {Object} data - data that I wanted to be returned
  *
  **/
  getClassData(names = []) {
    return super.getClassData(names);
  }

  /**
  *
  * @desc - sets the list of names given to it
  * @param {Set} nameSet - set of names to check for
  * @return {void} -
  *
  **/
  set setNameResultsSet(nameSet) {
    this.formattedNamesSet = nameSet;
  }

  /**
  *
  * @desc - sets the key value pair of labels to names
  * @param {Set} person -
  * @return {void}
  *
  **/
  set setSelectedPerson(person = {}) {
    this.person = person;
  }

  /**
  *
  * @desc - sets the key value pair of labels to names
  * @param {Set} nameHash -
  * @return {void} -
  *
  **/
  set setFormattedNameToDataHash(nameHash) {
    this.formattedNamesToDataHash = nameHash;
  }

  /**
  *
  * @desc - Get list of names and the appointeeInfo, appointmentInfo etc
  * @param {String} searchString - name to search for
  * @param {Object} this - grouperPathText and access token for request
  * @return {Promise} - promise to be resolved
  *
  **/
  getPossibleNamesUrlAndArgs(searchString, {access_token, grouperPathText} =
    this) {
    let url = `${urls.getNameSearch}${access_token}`;
    let args = {searchString, grouperPathText};
    return {url, args};
  }

  /**
  *
  * NOTE: No test for this as the url wouldnt work in testing framework
  * @desc - Get list of names and the appointeeInfo, appointmentInfo etc
  * @param {String} searchString - name to search for
  * @param {Object} this - grouperPathText and access token for request
  * @return {Promise} - promise to be resolved
  *
  **/
  async fetchPossibleNames(searchString, {access_token, grouperPathText} =
    this) {
    let {url, args} = this.getPossibleNamesUrlAndArgs(searchString, {access_token,
      grouperPathText});
    let names = await util.fetchJson(url, args);

    return names;
  }

  /**
  *
  * @desc - Get names from name search API and reformat
  * @param {Array} data - api results
  * @return {Array} results -reformatted results
  *
  **/
  reformatNameSearchResults(data = []) {
    let results = [];

    for(let person of data) {
      if(!person.fullName) {
        continue;
      }

      let {opusPersonId: opusId, officialEmail: email, fullName, uid} = person;
      //Change name to proper case and add email
      let exploded = fullName.split(',').join(', ').trim();
      let email_str = email ? `, ${email.toLowerCase()}` : '';
      let uid_str = uid ? `, ${uid}` : '';
      let label = `${exploded}${uid_str}${email_str}`;

      results.push({label, email, opusId, value: label, person});//Save each
    }

    return results;
  }


  /**
  *
  * @desc - checks to see if name is in the set
  * @param {Set} name -
  * @return {Bool} -
  *
  **/
  isNameInSet(name) {
    return this.formattedNamesSet.has(name);
  }

  /**
  *
  * @desc - Checks to see if appointmentInfo or appointmentSetList has any data
  * @param {Object} appointmentInfo - Single appointments
  * @param {Object} appointmentSetList - Appointment Set
  * @return {Boolean} - boolean that checks if this person has valid appointments
  *
  **/
  personHasValidAppts({appointmentInfo = this.person.appointmentInfo,
    appointmentSetList = this.person.appointmentSetList} = {}) {
    return !!(appointmentInfo.length || appointmentSetList.length);
  }

  /**
  *
  * @desc - Get list of names and the appointeeInfo, appointmentInfo etc
  * @param {Array} refinedNameResults - array of objects to be transformed
  * @param {String} label - label to be used for the hash
  * @return {Set} - set of unique names from the labels from the hash
  *
  **/
  getNameResultsSet(refinedNameResults, label = this.label_key) {
    let {nameSet} = this.getCompleteNameResultsData(refinedNameResults, {label});
    return nameSet;
  }

  /**
  *
  * @desc - Get list of names and the appointeeInfo, appointmentInfo etc
  * @param {Array} refinedNameResults - array of objects to be transformed
  * @param {String} label - label to be used for the hash
  * @return {Set} - set of unique names from the labels from the hash
  *
  **/
  getFormattedNamesToDataHash(refinedNameResults, label = this.label_key) {
    let {formattedNamesToDataHash} = this.getCompleteNameResultsData(refinedNameResults,
      {label});
    return formattedNamesToDataHash;
  }

  /**
  *
  * @desc - Returns the Set of unique names & array of nameOptions, and hash
  *   of name labels to object data
  * @param {Array} reformattedNameResults - array of objects with to be transformed
  * @param {String} label - label to be used for the hash
  * @return {Set} - set of unique names from the labels from the hash
  *
  **/
  getCompleteNameResultsData(reformattedNameResults, {label = this.label_key} = {}) {
    let formattedNamesToDataHash = util.arrayOfObjectsToObjectByKey(reformattedNameResults,
      label);
    let nameOptions = Object.keys(formattedNamesToDataHash);

    //Create set to prevent name search on user selecting person in autocomplete
    let nameSet = new Set(nameOptions);
    return {formattedNamesToDataHash, nameSet, nameOptions};
  }

  /**
  *
  * @desc - Reformats name & saving various forms of data to this instance
  * @param {Array} rawNameResults - results straight from API
  * @param {Object} - label
  * @return {void} -
  *
  **/
  setAndSaveReformattedNameDataFromAPI(rawNameResults, {label = this.label_key} = {}) {
    let reformattedNameSearchResults = this.reformatNameSearchResults(rawNameResults);
    let {formattedNamesToDataHash, nameSet, nameOptions} =
      this.getCompleteNameResultsData(reformattedNameSearchResults, {label});

    this.setNameResultsSet = nameSet;
    this.setFormattedNameToDataHash = formattedNamesToDataHash;

    return {formattedNamesToDataHash, nameSet, nameOptions, reformattedNameSearchResults};
  }

  /**
  *
  * @desc - Gets the appt data from name given to it
  * @param {String} name - name of person to retrieve
  * @param {Object} - various arguments
  * @return {Object} person - person object to be returned
  *
  **/
  async getPersonApptDataFromName(name, {access_token, grouperPathText} =
    this, {person_key = this.person_key} = {}) {
    let {[name]: selectedPerson = {}} = this.formattedNamesToDataHash;
    let opusPersonId = selectedPerson[person_key].opusPersonId || {};

    let url = `${urls.getAppointmentInfoFromNameSelection}${access_token}`;
    let args = {opusPersonId, grouperPathText};
    let personUrl = await util.fetchJson(url, args);

    return personUrl;
  }

  formatPersonObject(name, results, {person_key = this.person_key} = {}) {

    let {[name]: selectedPerson = {}} = this.formattedNamesToDataHash;
    let person = selectedPerson[person_key] || {};
    let formattedObject = {appointeeInfo: person}
    //Takes care of 'null' operator w/ these default values
    formattedObject.appointmentSetList = results.appointmentSetList || [];
    formattedObject.appointmentInfo = results.appointmentInfo || [];

    return formattedObject;
  }
}
