import {intersection} from 'lodash';

//My imports
import Roster from './Roster';
import {searchCriteria} from '../constants/InactiveRosterConstants';

export default class InactiveRoster extends Roster {
  //Class variables
  rowData = [];

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} args -
   * @return {void}
   *
   **/
  constructor(args = {}) {
    super(args);
    this.startLogic(args);
  }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @param {String} fewRows - arg for API
   * @return {Object}
   *
   **/
  getDataUrlParameters({fewRows = 'N'} = {}) {
    let {grouperPathText, access_token, adminData, dataTableConfiguration} = this;
    return {grouperPathText, access_token, fewRows, typeOfReq: 'inactive',
      loggedInOpusId: adminData.adminOpusId, opusScreenName: dataTableConfiguration.pageName};
  }

  /**
   *
   * @desc - Come here to do special stuff to Roster table data
   * @param {Array} rowData - array of row table data
   * @return {Array} rowData - reformatted rowData
   *
   **/
  configureAPITableData(rowData = []) {
    let formattedRowData = super.configureAPITableData(rowData);
    formattedRowData = this.updateRowDataForRoster(formattedRowData)
    return formattedRowData;
  }

  /**
   *
   * @desc -Combined 3 loop functions into 1:
   * 1. Set image for pending cases if it pendingCases = 1
   * 2. Adds profile link to rowData
   * 3. Changes 'null' emails to blank
   * @param {Array} formattedRowData - array of row table data
   * @param {Object} dataTableConfiguration - dtConfig for page
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
  updateRowDataForRoster(formattedRowData, dataTableConfiguration =
    this.dataTableConfiguration, {link_key = 'link'} = {}) {
    let {profileLink, columnConfiguration} = dataTableConfiguration;
    for(let row of formattedRowData) {
      row[link_key] = profileLink + row.appointeeInfo.opusPersonId;
      if(row.email==='null'){
        row.email = '';
      }
    }
    return formattedRowData;
  }

}
