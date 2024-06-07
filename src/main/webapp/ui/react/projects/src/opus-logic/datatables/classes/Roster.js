import {intersection} from "lodash";

//My imports
import DataTable from "./DataTable";
import {searchCriteria} from "../constants/RosterConstants";

export default class Roster extends DataTable {
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
    getDataUrlParameters({fewRows = "N"} = {}) {
        let {grouperPathText, access_token, adminData, dataTableConfiguration} = this;
        return {grouperPathText, access_token, fewRows, typeOfReq: "active",
      loggedInOpusId: adminData.adminOpusId, opusScreenName: dataTableConfiguration.pageName};
    }

  /**
  *
  * @desc - Filters data using saved filters in dataTableConfiguration
  * @param {Array} rowData - array of row data results from server
  * @param {Object} dataTableConfiguration -
  * @return {Array} filteredRowData -
  *
  **/
    filterAPITableData(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {
        let filteredRowData = super.filterAPITableData(rowData, dataTableConfiguration);
        filteredRowData = this.filterRowDataByFlags(filteredRowData);
        return filteredRowData;
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
        formattedRowData = this.updateRowDataForRoster(formattedRowData);
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
    this.dataTableConfiguration, {link_key = "link"} = {}) {
        let {profileLink, columnConfiguration} = dataTableConfiguration;
        for(let row of formattedRowData) {
            if(row.caseInfo.pendingCases) {
                row.imagePath = columnConfiguration.pendingCases.image;
                row.pendingCases = "a";
            }else{
                row.pendingCases = "b";
            }
            row[link_key] = profileLink + row.appointeeInfo.opusPersonId;
            if(row.email==="null"){
                row.email = "";
            }
        }
        return formattedRowData;
    }

  /**
   *
   * @desc - Update filters outside of the datatable such as Senate, isHSCP, etc.
   * If value is false, it is deleted from the outsideFilters and not taken
   * into consideration.
   * @param {Object} - name of column to change and value
   * @param {Object} dataTableConfiguration - is it visible or not
   * @return {void}
   *
   **/
    updateOutsideFiltersInDatatableConfig({name, value}, dataTableConfiguration
    = this.dataTableConfiguration) {
        let {dataColumnFilters: {outsideFilters}} = this.dataTableConfiguration;
        outsideFilters[name] = value;

        if(outsideFilters[name] === false) {
            delete outsideFilters[name];
        }

        return dataTableConfiguration;
    }

  /**
   *
   * @name filterRowDataByFlags
   * @desc -
   * @param {Object} rowData -
   * @param {Object} dataTableConfiguration -
   * @param {Array} filters -
   * @return {Array} filteredResults -
   *
   **/
    filterRowDataByFlags(rowData = [], dataTableConfiguration =
    this.dataTableConfiguration) {
        let {dataColumnFilters: {outsideFilters}} = dataTableConfiguration;
        let filteredResults = [];
        let {categories, affirmativeSearch, exclusionarySearch, stringSearch}
      = searchCriteria;
        let filterKeys = Object.keys(outsideFilters);
    //Search keys for the 'Tenured', 'Senate', etc
        let affirmativeSearchKeys = intersection(filterKeys, affirmativeSearch);
    //Search keys for the 'Non-Tenured', 'Non-Senate', etc
        let exclusionarySearchKeys = intersection(filterKeys, exclusionarySearch);
    //String search keys for 'Appointed','Prospective'
        let stringSearchKeys = intersection(filterKeys, stringSearch);

    //Loop through each result of the rows in the table
        for(let each of rowData) {
            let isValid = true;//keep track of which results to save to array at the end

      //Loop through each of the simple true/false keys
            for(let key of affirmativeSearchKeys) {
        //If the key for each row results != true dont end up pushing the result
                let key_name = categories[key].name;
                if(!each[key_name]) {
                    isValid = false;
                }
            }

      //Loop through each of the exclusionary keys
            for(let ex_key of exclusionarySearchKeys) {
        //If the key for each row results != true dont end up pushing the result
                let alternate_flagname = categories[ex_key].alternateFlag;
                let alt_keyname = categories[alternate_flagname].name;

                if(each[alt_keyname] !== false) {
                    isValid = false;
                }
            }

      //Determine whether string value is in set
            for(let string_key of stringSearchKeys) {
        //If the key for each row results != true dont end up pushing the result
                let string_search_name = categories[string_key].name;
        // if(!stringSearchOptions.has(each[string_search_name])){
        //   isValid = false;
        // }
                if(each[string_search_name] !== categories[string_key].databaseValue) {
                    isValid = false;
                }
            }

      //If row result's keys all match lets push it to results
            if(isValid) {
                filteredResults.push(each);
            }
        }
        return filteredResults;
    }

        /**
     *
     * @name setCorrectColumnSelectOptions
     * @desc - IOK-957 PROD's 1 minute timeout causing issues with string filter variables so have to look for ids
     * @param {Object} filterVariables -
     * @return {Object} filterVariables -
     *
     **/
    setCorrectColumnSelectOptions = (filterVariables) => {
        if(filterVariables.columnSelectOptions.appointmentStatusId){      
            let appointmentStatusKeyArray = [];
            let appointmentStatusValueOptions = this.globalData.commonTypeReferences.AppointmentStatusType;
            for(let each of filterVariables.columnSelectOptions.appointmentStatusId){
                let key = Object.keys(appointmentStatusValueOptions).find(key => appointmentStatusValueOptions[key].commonTypeValue === each)
                appointmentStatusKeyArray.push(appointmentStatusValueOptions[key].commonTypeId)
            }
            filterVariables.columnSelectOptions.appointmentStatusId = appointmentStatusKeyArray;
        }
        // if(filterVariables.columnSelectOptions.employeeStatusId){
        //     let employeeStatusKeyArray = [];
        //     let employeeStatusValueOptions = this.columnConfiguration.employeeStatusId.valueOptions;
        //     for(let each of filterVariables.columnSelectOptions.employeeStatusId){
        //         let key = Object.keys(employeeStatusValueOptions).find(key => employeeStatusValueOptions[key] === each)
        //         employeeStatusKeyArray.push(parseInt(key))
        //     }
        //     filterVariables.columnSelectOptions.employeeStatusId = employeeStatusKeyArray; 
        // }
        // if(filterVariables.columnSelectOptions.stepTypeId){
        //     let stepKeyArray = [];
        //     let stepValueOptions = this.columnConfiguration.stepTypeId.valueOptions;
        //     for(let each of filterVariables.columnSelectOptions.stepTypeId){
        //         let key = Object.keys(stepValueOptions).find(key => stepValueOptions[key] === each)
        //         stepKeyArray.push(parseInt(key))
        //     }
        //     filterVariables.columnSelectOptions.stepTypeId = stepKeyArray;
        // }
        return filterVariables;
    }

  /**
   * reconcileColumnValuesFromServerData - Main function to be used that will
   *  reconcile how the object is stored or 'flattened' from the server so it
   *  can be shown best in the UI datatable
   *
   * @desc - Fill in the column defaults and select options
   * @param {Object} row -
   * @param {Array} columnConfiguration -
   * @param {Array} columnKeys -
   * @param {Object} - each rows data
   * @return {Object} - data
   **/
    reconcileRowValuesFromServerData(row, {columnConfiguration = {}, columnKeys = []}) {
        let formattedRow = super.reconcileRowValuesFromServerData(row,
      {columnConfiguration, columnKeys});
        let {appointeeInfo, appointmentInfo, caseInfo} = row;
        return {
            ...formattedRow,
            appointeeInfo,
            appointmentInfo,
            caseInfo,
            academicHierarchyPathId: appointmentInfo.academicHierarchyInfo.academicHierarchyPathId,
            apptEditFlag: appointmentInfo.apptEditFlag,
            grouperPathText: appointmentInfo.academicHierarchyInfo.grouperPathText,
            institution: appointmentInfo.academicHierarchyInfo.institutionName,
            firstName: appointeeInfo.firstName,
            middleName: appointeeInfo.middleName,
            lastName: appointeeInfo.lastName,
            opusPersonId: appointeeInfo.opusPersonId,
            appointmentRowStatusId: appointmentInfo.appointmentRowStatusId,
            sameAHPathAsUser: appointmentInfo.sameAHPathAsUser,
            indefiniteFlag: appointmentInfo.indefiniteFlag,
            hSCP: appointmentInfo.titleInformation.hSCP,
            hscp: appointmentInfo.titleInformation.hSCP,
            emeritusFlag: appointmentInfo.titleInformation.emeritusFlag,
            appointmentSetFlag: appointmentInfo.appointmentSetFlag,
            multiPrimaryApptFlag: appointmentInfo.multiPrimaryApptFlag,
            noPrimaryApptFlag: appointmentInfo.noPrimaryApptFlag,
            tenure: appointmentInfo.titleInformation.tenure,
            academicSenate: appointmentInfo.titleInformation.academicSenate,
            unit18: appointmentInfo.titleInformation.unit18,
            indefiniteAppointment: appointmentInfo.titleInformation.indefiniteAppointment,
            unit18Continuing: appointmentInfo.titleInformation.unit18Continuing,
            seriesRankSteps: appointmentInfo.titleInformation.seriesRankSteps
        };
    }
}
