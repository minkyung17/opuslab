import {every, some} from 'lodash';

import CaseFlow from './CaseFlow';
import * as util from '../../../common/helpers/';
import {text, constants, appointmentSectionConstants} from
  '../../constants/caseflow/CaseFlowConstants';

/**
*
* @classdesc Logic dealing with creating Appointment
* @author - Leon Aburime
* @class Appointment
* @extends CaseFlow
*
**/
export default class Appointment extends CaseFlow {
  /**
  *
  * @desc - Send selected person over to get the filtered appointments
  *
  **/
  person = null;
  apptData = {};
  actionTypes = {};
  appointmentInfo = [];
  appointmentSetList = [];
  selectedActionType = '';
  apptIds = {apptSet: 'apptSet'};

  /**
  *
  * @desc - On start set selectedPerson, actionTypes, selectedActionType
  *   & this class can take care of filtering and formatting the appointments
  *   OPUSDEV-3244 Since all archived appointments are coming in, need to make condition for BRule-118
  *   Other related Jiras: OPUSDEV-3405, OPUSDEV-3144, OPUSDEV-3194, OPUSDEV-3208, OPUSDEV-3287, OPUSDEV-3339, OPUSDEV-3450
  * @param {Object}  - selectedPerson from NameSearch, actionTypes and
  *   selection Action from previous Case Flow sections
  * @return {void}
  *
  **/
  setAppointmentData({selectedPerson, person = selectedPerson, actionTypes,
    selectedActionType}) {
    let {appointmentInfo, appointmentSetList} = person;
    let appointmentInfoArray = appointmentInfo;

    // If user does not select renewal, reappointment, or unit 18 continuing appointment,
    if(selectedActionType!=='1-13' && selectedActionType!=='1-14' && selectedActionType!=='1-10'){
      // OPUSDEV-3450 Start with a new array
      appointmentInfoArray = [];
      // Is there is only archived appointments, send empty arrays
      console.log("User has not selected renewal, reappointment, or unit 18 continuing appointment")
      console.log("Has only archived appts? "+appointmentInfo[0].userApptArchivedFlag)
      if(appointmentInfo && appointmentInfo.length>0 && appointmentInfo[0].userApptArchivedFlag){
        appointmentSetList = [];
      }else{
        // else loop through and remove archived appointments
        for(let index in appointmentInfo){
          if(appointmentInfo[index].appointmentStatusType!=="Archived"){
            appointmentInfoArray.push(appointmentInfo[index])
          }
        }
      }
    }else{
      console.log("User has selected renewal, reappointment, or unit 18 continuing appointment")
    }

    this.setClassData({person, actionTypes, appointmentInfo: appointmentInfoArray, appointmentSetList,
      selectedActionType});
  }

  /**
  *
  * @desc - gets appointment by id passed in
  * @param {Object}  appt_id - id of appt to retrieve
  * @return {Object} -
  *
  **/
  getAppointmentById(appt_id) {
    return this.apptData[appt_id];
  }

  /**
  *
  * @desc - Some appointments are not to be seen on the screen
  * @param {Object} appointmentInfo - person's appointmentInfo
  * @return {Array} -
  *
  **/
  checkExcludeAddlAppts(appointmentInfo = []) {
    let singleAppointments = appointmentInfo.filter(appt => {
      return appt.affiliationType.affiliation === 'Primary';
    });

    return singleAppointments;
  }

  /**
  *
  * @desc - Gets valid status for appointmentSet
  * @param {Array} actionTypesByTitleCode - actionTypes keyed by titleCode
  * @param {String} titleCode - chosen titleCode
  * @param {Object} actionType - chosen actionType
  * @return {String} isValidForAppointmentSet - tells if data is valid for
  *   appointmentSet
  *
  **/
  getValidStatusForApptSetFromTitleCode(actionTypesByTitleCode, titleCode, actionType) {
    //Make actionTypes into object keyed by 'code'
    let actionTypesDataByCode = util.arrayOfObjectsToObjectByKey(
      actionTypesByTitleCode[titleCode], 'code');
    let {isValidForAppointmentSet} = actionTypesDataByCode[actionType] || {};

    return isValidForAppointmentSet;
  }

  /**
  *
  * @desc - Some appointments are not to be seen on the screen
  * @param {Array} appointmentSetList -
  * @param {String} selectedActionType -
  * @param {Object} actionTypes -
  * @return {void} -
  *
  **/
  // filterAppointmentSet_(appointmentSetList, selectedActionType, actionTypes) {
  //   //Filter single appointments if sameAHPath and title code of the appt
  //   //is in list of choices
  //   let apptSetFlag = false;
  //   let isValidArray = appointmentSetList.map(apptSet => {
  //     let {sameAHPathAsUser, titleInformation: {titleCode}, affiliationType:
  //       {affiliation}} = apptSet;
  //
  //     //Make actionTypes into object keyed by 'code'
  //     let actionTypesDataByCode = util.arrayOfObjectsToObjectByKey(
  //       actionTypes[titleCode], 'code');
  //     // let {isValidForAppointmentSet} = actionTypesDataByCode[selectedActionType] || {};
  //     let isValidForAppointmentSet = this.getValidStatusForApptSetFromTitleCode(
  //       actionTypes, titleCode, selectedActionType);
  //
  //     //Conditionals to determine of valid set
  //     let validSet = isValidForAppointmentSet === 'Y' &&
  //       selectedActionType in actionTypesDataByCode;
  //     if(affiliation === 'Primary' && sameAHPathAsUser) {
  //       apptSetFlag = true;
  //     }
  //
  //     return (apptSetFlag && validSet);
  //   });
  //
  //   //If all of the appt sets are true show them all
  //   let apptSets = every(isValidArray) ? appointmentSetList : [];
  //   return apptSets;
  // }

  // isApptSetValid(isValidForAppointmentSet, actionTypesDataByCode, selectedActionType,
  //   ) {
  //
  // }


  filterAppointmentSet_(appointmentSetList, selectedActionType, actionTypes) {
    //Filter single appointments if sameAHPath & title code of the appt
    //is in list of choices
    let apptSetFlag = false;
    let isValidArray = appointmentSetList.map(apptSet => {
      let {sameAHPathAsUser, titleInformation, affiliationType} = apptSet;
      let {titleCode} = titleInformation;
      let {affiliation} = affiliationType;

      //Make actionTypes into object keyed by 'code'
      let actionTypesDataByCode = util.arrayOfObjectsToObjectByKey(
        actionTypes[titleCode], 'code');
      let {isValidForAppointmentSet} = actionTypesDataByCode[selectedActionType] || {};

      //Conditionals to determine of valid set
      let validSet = isValidForAppointmentSet === 'Y' &&
            selectedActionType in actionTypesDataByCode;
      if(affiliation === 'Primary' && sameAHPathAsUser) {
        apptSetFlag = true;
      }

      return (apptSetFlag && validSet);
    });

    //If all of the appt sets are true return it. If not return empty array
    let apptSets = every(isValidArray) ? appointmentSetList : [];
    return apptSets;
  }

  /**
  *
  * @desc - Some appointments are not to be seen on the screen
  * @param {Object} appointmentSetList - incoming apptInfo
  * @param {String} selectedActionType - i.e. '1-17', '2-3' etc
  * @param {Object} actionTypes - action type object by keycode
  * @return {Array} apptSets - if apptset is valid return it. If not return
  *   empty array
  *
  **/
  filterAppointmentSet(appointmentSetList, selectedActionType, actionTypes) {
    //Filter single appointments if sameAHPath & title code of the appt
    //is in list of choices
    let isValidArray = appointmentSetList.map(appointment => {
      let {sameAHPathAsUser, titleInformation, affiliationType} = appointment;
      let {titleCode} = titleInformation;
      let {affiliation} = affiliationType;

      //Make actionTypes into object keyed by 'code'
      let actionTypesDataByCode = util.arrayOfObjectsToObjectByKey(
        actionTypes[titleCode], 'code');
      let {isValidForAppointmentSet} = actionTypesDataByCode[selectedActionType] || {};

      //Conditionals to determine of valid set
      let validSet = isValidForAppointmentSet === 'Y' && sameAHPathAsUser &&
        selectedActionType in actionTypesDataByCode && affiliation === 'Primary';

      return validSet;
    });

    //If any appt in appt set is valid show them all
    let apptSets = some(isValidArray) ? appointmentSetList : [];
    return apptSets;
  }


  /**
  *
  * @desc - Some appointments are not to be seen on the screen
  * @param {Object} appointmentInfo - incoming apptInfo
  * @param {String} selectedActionType - i.e. '1-17', '2-3' etc
  * @param {Object} actionTypes - action type object by keycode
  * @param {Object} - checkForSameAHPathAsUser
  * @return {Array} singleAppointments - array of filtered single appts
  *
  **/
  filterSingleAppointments(appointmentInfo = [], selectedActionType = '',
    actionTypes = {}, {checkForSameAHPathAsUser = true} = {}) {
    //Filter single appointments by it having the sameAHPath and title code of the appt
    //being in out list of choices
    let singleAppointments = appointmentInfo.filter(appt => {
      let {sameAHPathAsUser, titleInformation, appointmentStatusType = ''} = appt;

      //For some appointments we dont need to take 'sameAHPathAsUser' into account
      //In that case lets default it to true
      sameAHPathAsUser = checkForSameAHPathAsUser ? sameAHPathAsUser : true;

      //Turn array of titlecodes to an object keyed by 'code' i.e. '1603'
      let {titleCode} = titleInformation;
      let actionTypesDataByCode = util.arrayOfObjectsToObjectByKey(
        actionTypes[titleCode], 'code');
      let selectedActionTypesDataByCode = actionTypesDataByCode[selectedActionType];

      //If not a valid action type for this titleCodeObject
      if(!selectedActionTypesDataByCode) {
        return false;
      }

      let {isValidForArchivedAppts} = actionTypesDataByCode[selectedActionType];
      let isArchiveViewable = isValidForArchivedAppts === 'Y' ||
        (isValidForArchivedAppts === 'N' && appointmentStatusType.toLowerCase()
          !== 'archived');

      return (selectedActionType in actionTypesDataByCode && sameAHPathAsUser
        && isArchiveViewable);
    });

    return singleAppointments;
  }


  /**
  *
  * @desc - Some appointments are not to be seen on the screen
  * @param {Array} appointmentInfo -
  * @param {Array} appointmentSetList -
  * @param {Object} selectedActionType -
  * @param {Object} actionTypes -
  * @return {Object} - filtered appointments
  *
  **/
  filterViewableAppointments_(appointmentInfo = [], appointmentSetList = [],
    selectedActionType = '', actionTypes = []) {
    //Checking if they are excluded via exception logic
    let {excludeAddlAppts, nonFilteredAppointmentActions} = appointmentSectionConstants;
    let actionTypeIsNonFiltered = selectedActionType in nonFilteredAppointmentActions;
    let excludeJointSplitAddlAppts = selectedActionType in excludeAddlAppts;
    let filteredAppts = [];
    let filteredApptSetList = [];
    //let actionTypeNotValidForApptSets = selectedActionType in notValidForAppointmentSets_;

    if(excludeJointSplitAddlAppts) {
      filteredAppts = this.checkExcludeAddlAppts(appointmentInfo);

      //Filter appointmentSetList if actionType not sposta be filtered
      filteredAppts = actionTypeIsNonFiltered ? filteredAppts
        : this.filterSingleAppointments(appointmentInfo, selectedActionType,
          actionTypes, {checkForSameAHPathAsUser: false});
    } else {
      //Filter appointmentInfo if actionType not sposta be filtered
      filteredAppts = actionTypeIsNonFiltered ? appointmentInfo
        : this.filterSingleAppointments(appointmentInfo, selectedActionType, actionTypes);
    }

    //Filter appointmentSetList if conditions not met
    filteredApptSetList = (actionTypeIsNonFiltered || excludeJointSplitAddlAppts)
      ? appointmentSetList : this.filterAppointmentSet(appointmentSetList,
                              selectedActionType, actionTypes);

    return {appointmentInfo: filteredAppts, appointmentSetList: filteredApptSetList};
  }


  /**
  *
  * @desc - Some appointments are not to be seen on the screen
  * @param {Array} appointmentInfo -
  * @param {Array} appointmentSetList -
  * @param {Object} selectedActionType -
  * @param {Object} actionTypes -
  * @return {Object} - filtered appointments
  *
  **/
  filterViewableAppointments(appointmentInfo = [], appointmentSetList = [],
    selectedActionType = '', actionTypes = []) {
    //Checking if they are excluded via exception logic
    let {excludeAddlAppts, nonFilteredAppointmentActions} = appointmentSectionConstants;
    let actionTypeIsNonFiltered = selectedActionType in nonFilteredAppointmentActions;
    let excludeJointSplitAddlAppts = selectedActionType in excludeAddlAppts;
    let filteredAppts = [];
    let filteredApptSetList = [];
    //let actionTypeNotValidForApptSets = selectedActionType in notValidForAppointmentSets_;

    if(actionTypeIsNonFiltered) {
      filteredAppts = this.checkExcludeAddlAppts(appointmentInfo);
    } else if(excludeJointSplitAddlAppts) {
      //Filter appointmentSetList if actionType not sposta be filtered
      filteredAppts = this.filterSingleAppointments(appointmentInfo,
        selectedActionType, actionTypes, {checkForSameAHPathAsUser: false});
    } else {
      //Filter appointmentInfo if actionType not sposta be filtered
      filteredAppts = this.filterSingleAppointments(appointmentInfo,
        selectedActionType, actionTypes);
    }

    //Filter appointmentSetList if conditions not met
    if(actionTypeIsNonFiltered || excludeJointSplitAddlAppts) {
      filteredApptSetList = appointmentSetList;
    } else {
      filteredApptSetList = this.filterAppointmentSet(appointmentSetList,
        selectedActionType, actionTypes);
    }

    // Jira #3194 Remove 'Removed' appointments from showing
    filteredAppts = this.filterAppointmentByStatus(appointmentInfo);
    let newFilteredApptSetList = [];
    for(let each in filteredApptSetList){
      if(filteredApptSetList[each].appointmentStatusType!=='Removed'){
        newFilteredApptSetList.push(filteredApptSetList[each])
      }
    }

    return {appointmentInfo: filteredAppts, appointmentSetList: newFilteredApptSetList};
  }

  filterAppointmentByStatus(appointmentInfo){
    let filteredList = [];
    for(let each in appointmentInfo){
      if(appointmentInfo[each].appointmentStatusType!=='Removed'){
        filteredList.push(appointmentInfo[each]);
      }
    }
    return filteredList;
  }


  /**
  *
  * @desc - Key appointments and appointmentSet by id and special keys
  * @param {Array} appointmentInfo -
  * @param {Array} appointmentSetList -
  * @param {Object} apptSetId - id to key apptSet by
  * @return {Object} apptData - keyed data
  *
  **/
  setApptInfoById(appointmentInfo, appointmentSetList, apptSetId = this.apptIds.apptSet) {
    let apptData = {};
    //Save the appointment sets in 'appData' to look up later
    appointmentInfo.map(appt => {
      apptData[appt.appointmentId] = [appt];
    });
    //Now key the appointment set
    apptData[apptSetId] = appointmentSetList;

    return apptData;
  }

  /**
  *
  * @desc - Save data to class
  * @param {Object} allApptData - whatever is being set to "this.apptData"
  * @return {void}
  *
  **/
  saveApptDataToClass(allApptData = {}) {
    this.apptData = allApptData;
  }

  /**
  *
  * @desc -
  * @return {Object} -
  *
  **/
  formatAndFilterAppointments({appointmentSetList = this.appointmentSetList,
    appointmentInfo = this.appointmentInfo, selectedActionType = this.selectedActionType,
    actionTypes = this.actionTypes} = {}) {

    //Filter appointments by actionType
    let filteredAppts = this.filterViewableAppointments(appointmentInfo,
      appointmentSetList, selectedActionType, actionTypes);
    let {appointmentInfo: filteredAppointmentInfo, appointmentSetList:
      filteredAppointmentSetList} = filteredAppts;

    //Save the appointment sets in 'appData' to look up later
    let allAppointmentDataById = this.setApptInfoById(filteredAppointmentInfo,
      filteredAppointmentSetList);
    this.saveApptDataToClass(allAppointmentDataById);

    //Get specific data fields to display Appointment data
    let singleApptFields = this.getDisplayFieldsFromAppointments(filteredAppointmentInfo,
      constants.appointmentSectionFields);
    let apptSetFields = this.getDisplayFieldsFromAppointments(filteredAppointmentSetList,
      constants.appointmentSectionFields);

    return {filteredAppointmentInfo, filteredAppointmentSetList, apptSetFields,
      singleApptFields};
  }

  /**
  *
  * @desc - Determine the instructional text based on whether or not it could be
  *   all archived appointments
  * @param {Object} appointmentInfo -
  * @param {Object} appointmentSetList -
  * @return {JSX} instructions -
  *
  **/
  getModalInstructionText(appointmentInfo = this.appointmentInfo,
    appointmentSetList = this.appointmentSetList) {
    let {apptInstructions, archivedApptInstructions} = text;
    let instructions = appointmentInfo.length || appointmentSetList.length ?
      apptInstructions : archivedApptInstructions;

    return instructions;
  }
}
