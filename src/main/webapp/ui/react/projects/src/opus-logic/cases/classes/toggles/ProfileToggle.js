import Opus from '../../../common/classes/Opus';
import * as util from '../../../common/helpers/';
import {urlConfig} from '../../constants/profile/ProfileConstants';

/**
*
* @classdesc Handles calls for updating field data specific to Profile
* @author Leon Aburime
* @module ProfileToggle
*
**/
export default class ProfileToggle {
  /**
   *
   * @desc - Get url request for affiliation change
   * @param {Object} - args
   * @return {void}
   *
   **/
  constructor({adminData, access_token, globalData} = {}) {
    Object.assign(this, {adminData, access_token, globalData});
  }

  /**
   *
   * @desc - wipe waiverEndDt when affiliation is Additional-Split
   * @param {Object} fieldData - all fields
   * @param {String} fieldName - name of field that was changed
   * @param {Object} wipeValues - should wipe fields if affilation is Primary
   *  or Additional Split
   * @return {Object} fieldData - fieldData after having been formatted
   *
   **/
  updateWaiverEndDt(fieldData = {}, fieldName, wipeValues = {'1:1': 'Primary',
    '2:3': 'Additional - Split'}) {
    if(!fieldData.waiverEndDt || !fieldData.affiliation) {
      return fieldData;
    }

    let shouldNullify = fieldData.affiliation.value in wipeValues;
    if(fieldName === 'affiliation' && shouldNullify) {
      fieldData.waiverEndDt.value = null;
    }

    return fieldData;
  }

  /**
   *
   * @desc - Get url request for affiliation change
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @param {Object} formattedCommonCallLists -
   * @return {Object} - various affiliation data
   *
   **/
  getAffiliationDataArgsForAPI(fieldData, appointment, formattedCommonCallLists) {
    let {affiliation: {value}} = fieldData;
    let affiliationText = formattedCommonCallLists.affiliationIdToText[value];
    let [affiliationTypeId, appointmentCategoryId] = value.split(':');
    return {affiliation: affiliationText, affiliationTypeId, appointmentCategoryId};
  }

  /**
   *
   * @desc - Get url request for affiliation change
   * @param {Object} - affilation args
   * @param {Object} - access_token
   * @return {String} url
   *
   **/
  getAffiliationDataUrl({affiliation, affiliationTypeId, appointmentCategoryId} =
    {}, {access_token} = this) {
    let url = urlConfig.getAffiliationUrl({access_token, affiliation,
      affiliationTypeId, appointmentCategoryId});
    return url;
  }

  /**
   *
   * @desc - Guess what this does :-)
   * @param {Object} fieldData -
   * @return {Object} fieldData - after having formatted fieldData
   *
   **/
  hideWaiverExpirationDateIfNull(fieldData) {
    if(fieldData.waiverEndDt && !fieldData.waiverEndDt.value) {
      fieldData.waiverEndDt.visibility = false;
    }

    return fieldData;
  }

  /**
   *
   * @desc - Get url request for affiliation change
   * @param {Object} url -
   * @return {Promise} - affiliation request
   *
   **/
  getAffiliationDataFromAPI(url) {
    return util.fetchJson(url);
  }

  /**
   *
   * @desc - Get url request for affiliation change
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @param {Object} formattedCommonCallLists -
   * @return {Promise} - affiliation request
   *
   **/
  async getApptFromAffiliationChange(fieldData, appointment, formattedCommonCallLists) {
    let {affiliation, affiliationTypeId, appointmentCategoryId} =
      this.getAffiliationDataArgsForAPI(fieldData, appointment, formattedCommonCallLists);
    let url = this.getAffiliationDataUrl({affiliation, affiliationTypeId,
      appointmentCategoryId});


    return this.getAffiliationDataFromAPI(url);
  }

  /**
  *
  * @desc - Updates the APU dropdown options to only show those relevant for the
  * selected AH Path (i.e. Dept Code)
  * @param {Object} fieldData - all field data
  * @param {String} departmentCode - the departmentCode that is being toggled
  * @param {Object} formattedCommonCallLists - global data
  * @return {Object} - the modified fieldData
  *
  **/
  updateProfileAPUOptionsFromGlobalData(fieldData, departmentCode, formattedCommonCallLists) {
    let {profileDeptCodeToAPU} = formattedCommonCallLists;

    if (fieldData.apuCode) {
      if (profileDeptCodeToAPU[departmentCode]) {
        //If there is a selected value, and it is no longer relevant (i.e. we've toggled to another
        //deptCode with an APU list which does not contain the original selected value), then we
        //should clear it so that apuId doesn't get invisibly sent to the Save API
        let keys = Object.keys(profileDeptCodeToAPU[departmentCode]);
        if (!(keys.includes(String(fieldData.apuCode.value)))) {
          fieldData.apuCode.value = null;
        }

        fieldData.apuCode.options = profileDeptCodeToAPU[departmentCode];
      }
      else {
        ///Clear value and options list
        fieldData.apuCode.value = null;
        fieldData.apuCode.options = null;
      }
    }
    return fieldData;
  }
}
