 import {groupBy} from "lodash";

//My imports
 import {Clock} from "./Clock";
 import * as util from "../../common/helpers";
 import {config} from "../constants/ExcellenceClockConstants";

/**
 *
 * @classdesc Logic for Excellence Clock dealing with specifics of this class such as
 *   multiple tables
 * @author Leon Aburime
 * @class ExcellenceClock
 * @extends Clock
 *
 **/
 export default class ExcellenceClock extends Clock {
     defaultConfigName = "excellenceClock";
     defaultDataTableConfiguration = util.cloneObject(config);
     defaultTableData = {
         "-1": {
             departmentName: "",
             rowData: [],
             maxRowCount: 0
         }
     };

  /**
   *
   * @desc  - Start it off
   * @param {Object} args - adminData, globalData, config_name
   * @return {void}
   *
   **/
     constructor(args = {}) {
         super(args);

         this.startLogic({...args, config_name: this.defaultConfigName});
         this.setLogicClassVariables(args);
     }

  /**
   *
   * @desc - Show this message for user viewing purposes
   * @param {Bool} opusPersonContAppArchived - whether to show message or not
   * @return {String}
   *
   **/
     getArchivedMessage(opusPersonContAppArchived) {
         return opusPersonContAppArchived ? super.getArchivedMessage() : null;
     }

  /**
   *
   * @desc - Get initial fieldData for the page. Use api data to format this class
   *  by setting opusPersonId data
   * @param {Object} profileAPIData -
   * @param {Object} - opusPersonId, rowData
   * @return {Object} - fullName, fieldData
   *
   **/
     initExcellenceClockPage(profileAPIData, {opusPersonId, rowData}) {
         this.setClassData({opusPersonId, rowData});

         let {serviceUnitTypeMap} = rowData[0].originalData;
         let fieldData = this.createFieldData();
         this.attachServiceUnitTypeOptions(fieldData, serviceUnitTypeMap);

         let {appointeeInfo: {fullName}} = profileAPIData;

         return {fullName, fieldData};
     }

  /**
   *
   * @desc  - Format dataTableConfiguration before its cloned, set in Logic,
   *  or otherwise configured. In this case remove edit column if not applicable
   * @param {Object} - dataTableConfiguration, globalData, adminData
   * @return {void}
   *
   **/
     initiallyFormatDataTableConfiguration({dataTableConfiguration =
    this.defaultDataTableConfiguration, globalData, adminData}) {
         super.initiallyFormatDataTableConfiguration({dataTableConfiguration, globalData,
      adminData});

         this.configureEditabilityViaDataTableConfiguration(dataTableConfiguration,
      adminData);

         return dataTableConfiguration;
     }

  /**
   *
   * @desc - Get departmentName from the originalData if row exists
   * @param {Array} row - row with user data
   * @return {String} deptName - name of department
   *
   **/
     getDepartmentNameFromRowData(row) {
         let deptName = "";
         if(row) {
             deptName = row.originalData.appointmentInfo.academicHierarchyInfo.departmentName;
         }

         return deptName;
     }

  /**
   *
   * @desc -
   * @param {Array} rowData -
   * @param {Bool} ahPath -
   * @return {void}
   *
   **/
     getTableDataByAHPathId(rowData = [], ahPath =
    "originalData.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId") {
         let oldRowDataByAHPathID = this.getRowDataByAHPathID(rowData, ahPath);
         let oldAhPathIDs = Object.keys(oldRowDataByAHPathID);

    // Sort rowData by affiliation and alphabetical order
         let rowDataByAHPathID = this.sortRowDataByAffiliation(oldRowDataByAHPathID);

         let ahPathIDs = Object.keys(rowDataByAHPathID);
         let dataByAHPathID = {};

         for(let ahPathId of ahPathIDs) {
             let ahRowData = rowDataByAHPathID[ahPathId];
             let departmentName = this.getDepartmentNameFromRowData(ahRowData[0]);
             let affiliation = ahRowData[0].originalData.appointmentInfo.affiliationType.affiliation;

             dataByAHPathID[ahPathId] = {
                 departmentName,
                 affiliation,
                 rowData: ahRowData,
                 maxRowCount: ahRowData.length
             };
         }

         return {ahPathIDs, oldRowDataByAHPathID, dataByAHPathID};
     }

  /**
   *
   * @desc - sort incoming rowData array by affiliation and alphabetical order
   * @param {Array} rowData -
   * @return {Array} sortedRowData -
   *
   **/
     sortRowDataByAffiliation(rowDataByAHPathID = {}) {
         let primary = [];
         let additional = [];
         let other = [];
         let sortedRowData = [];
         for(let ahPathId in rowDataByAHPathID){
             if(rowDataByAHPathID[ahPathId][0].originalData.appointmentInfo.affiliationType.affiliation==="Primary"){
                 primary.push(rowDataByAHPathID[ahPathId]);
             }else if(rowDataByAHPathID[ahPathId][0].originalData.appointmentInfo.affiliationType.affiliation==="Additional"){
                 additional.push(rowDataByAHPathID[ahPathId]);
             }else{
                 other.push(rowDataByAHPathID[ahPathId]);
             }
         }
         sortedRowData = this.sortByAlphabeticalOrder(primary);
         sortedRowData = sortedRowData.concat(this.sortByAlphabeticalOrder(additional));
         sortedRowData = sortedRowData.concat(this.sortByAlphabeticalOrder(other));

         return sortedRowData;
     }

  /**
   *
   * @desc - sort incoming tableArray by alphabetical order
   * @param {Array} tableArray -
   * @return {Array} sortedTableArray -
   *
   **/
     sortByAlphabeticalOrder(tableArray = []) {
         let sortedTableArray = [];
         sortedTableArray = tableArray.sort(function(a, b){
             if(a[0].originalData.appointmentInfo.academicHierarchyInfo.departmentName
        < b[0].originalData.appointmentInfo.academicHierarchyInfo.departmentName) { return -1; }
             if(a[0].originalData.appointmentInfo.academicHierarchyInfo.departmentName
        > b[0].originalData.appointmentInfo.academicHierarchyInfo.departmentName) { return 1; }
             return 0;
         });
         return sortedTableArray;
     }

  /**
   *
   * @desc - Attaches values from rows to field data
   * @param {Object} fieldData - fieldData that will have values added to it
   * @param {Object} rowData - one row to get values from
   * @return {Object} fieldData - fieldData
   *
   **/
     attachRowValuesToFieldData(fieldData, rowData) {
         super.attachRowValuesToFieldData(fieldData, rowData);

         fieldData.serviceUnitType.value = rowData.originalData.serviceUnitType.serviceUnitTypeId;
     }

  /**
   *
   * @desc - Attaches values from rows to field data
   * @param {Object} fieldData - fieldData that will have values added to it
   * @param {Object} rowData - one row to get values from
   * @return {Object} fieldData - fieldData
   *
   **/
     getRowDataByAHPathID(rowData = {}, path) {
         let formattedRowData = groupBy(rowData, path);
         return formattedRowData;
     }

     getDataForAddNewModal = async () => {
         let {access_token, adminData} = this;
         let urlParameters = {access_token, loggedInOpusId: adminData.adminOpusId};
         let result = await util.fetchJson(config.addNewUrl, urlParameters);
         return result;
     }

     cloneFieldDataForAddModal = (fieldDataForAddModal) => {
         return util.cloneObject(fieldDataForAddModal);
     }

}
