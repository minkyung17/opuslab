import Profile from './Profile';
import * as util from '../../../common/helpers/';
import {urlConfig} from '../../constants/profile/ProfileConstants';

/**
*
* @classdesc Opus Logic class for NewProfile. Takes care of operations specific to adding
*   new appointment to person's profile
* @class NewProfile
* @extends Profile
*
**/
export default class NewProfile extends Profile {
  //Class Variables
  affiliationValues = {Primary: true, Additional: true};

  /**
  *
  * @desc - In 'NewProfile' we need 'Primary', 'Additional'
  * @param {Object} affiliationTypeList -
  * @return {Array} filtered - array of key value pair
  *
  **/
  getAffiliationList(affiliationTypeList = []) {
    //this.affiliationValues doesnt work...why?!?
    let affiliationValues = {Primary: true, Additional: true};

    //Filter only 'Primary', 'Additional' objects
    let filtered = affiliationTypeList.filter(e => e.affiliation in affiliationValues);
    return super.getAffiliationList(filtered);
  }

  /**
  *
  * @desc - Shows profile warning if there is appointmentInfoList
  * @param {Object} profileAPIData - profileAPIData.appointmentInfoList should
  *   be blank to be able to add new appointment
  * @return {Boolean} - if you can view the warning popup
  *
  **/
  showViewAddNewProfileWarning(profileAPIData = {}) {
    return !profileAPIData.appointmentInfoList;
  }


  /*****************************************************************************
  *
  * Section that handles are functions for ADDING NEW Appointment
  *
  *****************************************************************************/

  /**
  *
  * @desc - Url for adding new appointment to the backend
  * @param {Object} opusPersonId - appointment to send to API
  * @param {Object} - access_token
  * @return {String} url - url
  *
  **/
  getAddNewUrl(opusPersonId, {access_token} = this) {
    let url = urlConfig.getNewAppointmentUrl({opusPersonId, access_token});
    return url;
  }

  /**
  *
  * @desc - Url for adding new appointment to the backend
  * @param {Object} opusPersonId - appointment to send to API
  * @param {Object} - access_token
  * @return {Promise} - json request
  *
  **/
  getSaveNewAppointmentUrl(opusPersonId, {access_token} = this) {
    let url = urlConfig.saveNewAppointmentUrl({opusPersonId, access_token});
    return url;
  }

  /**
  *
  * @desc - Gets new appointment data from opusPersonId
  * @param {Object} opusPersonId - appointment to send to API
  * @return {Promise} - json request
  *
  **/
  getNewAppointmentProfileData(opusPersonId) {
    let url = this.getAddNewUrl(opusPersonId);
    return util.getJson(url);
  }

  /**
  *
  * @desc - get formatted template data and save it.  This function is needed
  * as it gets the URL and then calls saveProfileDataToAPI (this is for new
  * profile appointments)
  * @param {Object} allFieldData - appointment from API
  * @param {Object} appointment - appointment from API
  * @param {Object} appointeeInfo -
  * @param {Object} - comment
  * @return {Promise} - json request
  *
  **/
  saveNewProfileData(allFieldData, appointment, appointeeInfo, {comment} = {}) {
    //Get formatted url to save edited appointment
    let url = this.getSaveNewAppointmentUrl(appointeeInfo.opusPersonId);

    return this.saveProfileDataToAPI(allFieldData, appointment, appointeeInfo,
      url, {comment});
  }
}
