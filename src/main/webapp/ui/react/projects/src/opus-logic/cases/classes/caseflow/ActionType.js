import {flattenDeep, uniqBy, isEqual} from 'lodash';

/**
*
* @desc - My imports
*
**/
import CaseFlow from './CaseFlow';
import * as util from '../../../common/helpers/';
import {notInAHPathActions, text, constants} from
  '../../constants/caseflow/ActionTypeConstants';

/**
*
* @classdesc Handles all the non-view layer Opus Logic for ActionType in CaseFlow
* @author - Leon Aburime
* @class ActionType
* @extends CaseFlow
*
**/
export default class ActionType extends CaseFlow {
  /**
  *
  * @desc - Static variables
  *
  **/
  static code_text = text.code_text;
  static action_type_display_key = text.action_type_display_key;


  /**
  *
  * @desc - Instance variables
  *
  **/
  actionTypes = {};
  actionType = null;
  appointmentInfo = [];
  singleAppointments = [];
  action_type_display_key = text.action_type_display_key;

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
  * @desc - Uses actionType to determine if we should use a blank new appointment
  *   with an appointmentId of -1(bypassForNewApptActionTypes) or actual
  *   appointmentId(replicateSingleAppointment)
  *  NOTE: Commented out here so if you look in this file you will see the purpose
  *   of it.  This method exists in Opus Superclass
  * @param {Object} actionType - array of key names to get
  * @return {Object} data - data that I wanted to be returned
  *
  **/
  getAppointmentTypeFromActionType(actionType = this.actionType, {
    replicateSingleAppointment, bypassForNewApptActionTypes} = constants) {
    //Create object to hold directions
    let directions = {};

    //If its an exception type only have one set of fields
    if(actionType in bypassForNewApptActionTypes) {
      directions.pseudoNewAppointment = true;
      directions.replicateSingleAppointment = false;
    }

    if(actionType in replicateSingleAppointment) {
      directions.pseudoNewAppointment = false;
      directions.replicateSingleAppointment = true;
      directions.getAppointmentAHPaths = true;
    }

    return directions;
  }

  /**
  *
  * @desc - Some actionTypes double as a way to init a new appointment. checking
  *   for that here
  * @param {String} actionType -
  * @param {Object} - replicateSingleAppointment, bypassForNewApptActionTypes,
  *   proposedFieldsPreviousSectionByActionType
  * @return {Object} - field values that are now populated
  *
  **/
  getCaseFlowPath(actionType = this.actionType, {replicateSingleAppointment,
    bypassForNewApptActionTypes, proposedFieldsPreviousSectionByActionType} =
    constants) {
    let directions = {};

    //If its an exceptiongetDirectionsForCaseFlowPath type only have one set of fields
    if(actionType in bypassForNewApptActionTypes) {
      directions.pseudoNewAppointment = true;
      directions.replicateSingleAppointment = false;
    }

    if(actionType in replicateSingleAppointment) {
      directions.pseudoNewAppointment = false;
      directions.replicateSingleAppointment = true;
      directions.getAppointmentAHPaths = true;
    }

    //Give view layer info about if ProposedFields comes from ActionType
    if(actionType in proposedFieldsPreviousSectionByActionType) {
      let beforeProposedFields = proposedFieldsPreviousSectionByActionType[actionType];
      directions.previousSectionNameOfSection = {proposedFields: beforeProposedFields};
    }

    return directions;
  }

  /**
  *
  * @desc - Gets action types that are valid for appointments where user is not
  *   in same AHPath as the appointments they are working with.  Broken into
  *   separate function here because its easier to test
  * @return {Array} - actionTypes that are to be shown
  * ISNT BEING USED - DELETE
  **/
  // getNotInAHPathActions() {
  //   return notInAHPathActions;
  // }

  /**
  *
  * @desc - Takes an appointments (no need for appointmentSet
  *    because it is redundant) and determines what action types are relevant
  *    for those appointments based upon each appointment's title code
  * @param {Array} appointment - appts to filter out
  * @param {Object} actionTypes - actionTypes to be filtered
  * @return {Array} - List of ActionTypeObjects representing all action types
  *   relevant for the person's appointments
  *
  **/
  getIsValidForCaseActionTypesByTitleCodeInAppointment(appointment, actionTypes =
    this.globalData.actionTypes) {
    //Extract titleCode to get "actionTypeResults"
    let {titleInformation: {titleCode}, sameAHPathAsUser} = appointment;

    //Get workable action types for this titleCode value
    let actionTypeResults = actionTypes[titleCode] || [];

    //Same ahPath so lets check if its valid for a case
    if(sameAHPathAsUser) {
      let results = actionTypeResults.filter(e => e.isValidForCase === 'Y');
      return results;
    }

    //Return action types that are valid for not having same AHPath
    return notInAHPathActions;
  }

  /**
  *
  * @desc - Takes in a list of single appointments (no need for appointmentSet
  *    because it is redundant) and determines what action types are relevant
  *    for those appointments based upon each appointment's title code
  * @param {Array} singleAppointments - single appts
  * @param {Object} actionTypes is a hashmap from the global objects
  * @return {Array} - List of ActionTypeObjects representing all action types
  *   relevant for the person's appointments
  *
  **/
  determineActionTypes(singleAppointments = this.singleAppointments,
    actionTypes = this.globalData.actionTypes) {
    //Cycle through appointments to get our relevant actions
    let actions = singleAppointments.map(appointment =>
      this.getIsValidForCaseActionTypesByTitleCodeInAppointment(appointment,
      actionTypes)
    );

    //Flatten array of arrays into single array
    actions = flattenDeep(actions);

    //Gets rid of duplicate objects. Check 'uniqBy' in Lodash docs for use
    let uniqActionTypes = uniqBy(actions, 'code');

    return uniqActionTypes;
  }

  /**
  *
  * @desc - NOT USED RIGHT NOW. Takes in a list of single appointments (no need for appointmentSet
  *    because it is redundant) and determines what action types are relevant
  *    for those appointments based upon each appointment's title code
  * @param {Array} singleAppointments - single appts
  * @param {Object} actionTypes is a hashmap from the global objects
  * @return {Array} - List of ActionTypeObjects representing all action types
  *   relevant for the person's appointments
  *
  **/
  determineActionTypes_(singleAppointments = this.singleAppointments,
    actionTypes = this.globalData.actionTypes) {
    let actions = [];
    let displayNames = {};

    //Cycle through appointments to get our relevant actions
    singleAppointments.map(appointment => {
      let {titleInformation, affiliationType, sameAHPathAsUser} = appointment;
      let {affiliation} = affiliationType;
      let {titleCode} = titleInformation;
      let actionTypeResults = actionTypes[titleCode] || [];

      if(affiliation === 'Primary' && sameAHPathAsUser) {
        actionTypeResults.map(result => {
          let {isValidForCase: isValid, actionTypeDisplayText: action_text} = result;
          if (isValid === 'Y' && !(action_text in displayNames)) {
            actions.push(result);
            displayNames[action_text] = true;
          }
        });
      }
      else if(affiliation.includes('Additional') && sameAHPathAsUser) {
        actionTypeResults.map(result => {
          let {isValidForCase, actionTypeDisplayText} = result;
          if (isValidForCase === 'Y' && !(actionTypeDisplayText in displayNames)) {
            actions.push(result);
            displayNames[actionTypeDisplayText] = true;
          }
        });
      }
      else {
        notInAHPathActions.map(result => {
          let {actionTypeDisplayText} = result;
          if (!(actionTypeDisplayText in displayNames)) {
            actions.push(result);
            displayNames[actionTypeDisplayText] = true;
          }
        });
      }
    });

    return flattenDeep(actions);
  }


  /**
  *
  * @desc - Determine correct action types to let the user choose from and
  *   then sort it by 'sort_key'
  * @param {Array} appointmentInfo -
  * @param {Array} actionTypes -
  * @return {Array} actionList - list of actionTypes
  *
  **/
  determineSortedActionTypes(appointmentInfo = this.appointmentInfo,
    actionTypes = this.globalData.actionTypes) {
    //Get key by which to sort with
    let {action_type_display_key: sort_key} = this;

    //Get action types in any order
    let actionList = this.determineActionTypes(appointmentInfo, actionTypes);

    //Now sort them by sort key
    actionList = util.sortObjectArray(actionList, {sort_key});

    //Return them on start
    return actionList;
  }
}
