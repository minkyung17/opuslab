import DataTable from "./DataTable";
import * as util from "../../common/helpers";
import moment from "moment";
import {searchCriteria} from "../constants/ComplianceConstants";
import {intersection} from "lodash";

/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Active and Completed cases section
 *
 ******************************************************************************/
export default class Compliance extends DataTable {


    startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
    defaultConfigName = "complianceReport";

  /**
   *
   * @desc - init class with datatable params
   * @param {Object} args - config for class
   * @return {void}
   *
   **/
    constructor(args = {}) {
        super(args);
        this.startLogic(args);
        this.args = args;
    }
   /**
   *
   * @desc - gets data from server and then parses it out from the unique key i.e.
   *  {activeCaseDataRows: Array[9000 results]} via dtConfig
   * @param {Object} dataTableConfiguration - d.t. config
   * @return {Array} - configured column information
   *
   **/

   getFormattedRowDataFromServer = async () => {
    let originalRowData = await super.getFormattedRowDataFromServer();
    return originalRowData;
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
        filteredRowData = this.filterRowDataByFlags(filteredRowData, dataTableConfiguration);
        this.updateSummaryData(filteredRowData);
        return filteredRowData;
    }

   updateSummaryData(filteredRowData){
        let satisfiedCount = 0, assignedCount = 0, overdueCount = 0;
        for(let row in filteredRowData) {
            let rowData = filteredRowData[row];
            if(rowData.activityStatus === 'Satisfied'){
                satisfiedCount = satisfiedCount + 1;
            }else if(rowData.activityStatus === 'Assigned'){
                assignedCount = assignedCount + 1;
            } else if (rowData.activityStatus === 'Overdue/Expired'){
                overdueCount = overdueCount + 1;
            }
        }
        let activityStatusData = {
            satisfiedPercent : "",
            assignedPercent : "",
            overduePercent : ""
        };
        let defaultActivityStatusValue = this.dataTableConfiguration.defaultActivityStatusValue;

        activityStatusData.satisfiedPercent = util.isNumber(satisfiedCount/filteredRowData.length*100) ? this.createPercentDisplay(satisfiedCount, filteredRowData) : defaultActivityStatusValue;
        activityStatusData.assignedPercent = util.isNumber(assignedCount/filteredRowData.length*100) ? this.createPercentDisplay(assignedCount, filteredRowData) : defaultActivityStatusValue;
        activityStatusData.overduePercent = util.isNumber(overdueCount/filteredRowData.length*100) ? this.createPercentDisplay(overdueCount, filteredRowData) : defaultActivityStatusValue;
        
        this.dataTableConfiguration.activityStatusData = activityStatusData;
    }

    createPercentDisplay = (count, filteredRowData, ) => {
        let activityStatusValue = (Math.round(count/filteredRowData.length*100)).toString()+"% "+"("+count+")";
        return activityStatusValue;
    }

/**
 *
 * @desc - Come here to do special stuff to Endowed Chairs table data
 * @param {Array} rowData - array of row table data
 * @return {Array} rowData - reformatted rowData
 *
 **/
configureAPITableData(rowData = []) {
    let formattedRowData = super.configureAPITableData(rowData);
    formattedRowData = this.updateRowData(formattedRowData);
    return formattedRowData;
}
   /**
   *
   * @desc - shows the active case image and endowed chair link
   * @param {Array} formattedRowData - array of row table data
   * @param {Object} dataTableConfiguration - dtConfig for page
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
   updateRowData(formattedRowData) {
        for(let row in formattedRowData) {
            let rowData = formattedRowData[row];
            rowData.activityDueDate = rowData.activityDueDate ? moment(rowData.activityDueDate).format("L") : "";
            rowData.activityLastCompletedDate = rowData.activityLastCompletedDate ? moment(rowData.activityLastCompletedDate).format("L") : "";
        }
        return formattedRowData;
    }
/**
*
* @desc - get filters
* @param {Object} dataTableConfiguration - dataTableConfiguration
*
**/
async getFilters(dataTableConfiguration = this.dataTableConfiguration) {
    let urlParameters = this.getDataUrlParameters(dataTableConfiguration);;
    let url = dataTableConfiguration.filtersUrl;
    let resultsPromise = util.fetchJson(url, urlParameters);
    this.filterViews = await resultsPromise;
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
            let {categories, affirmativeSearch, exclusionarySearch} = searchCriteria;
            let filterKeys = Object.keys(outsideFilters);
             //Search keys for the 'Tenured', 'Senate', etc
            let affirmativeSearchKeys = intersection(filterKeys, affirmativeSearch);
            //Search keys for the 'Non-Tenured', 'Non-Senate', etc
            let exclusionarySearchKeys = intersection(filterKeys, exclusionarySearch);
            //Loop through each result of the rows in the table
            for(let each of rowData) {
                let isValid = true;//keep track of which results to save to array at the end
                //Loop through each of the simple true/false keys
                for(let key of affirmativeSearchKeys) {
                //If the key for each row results != true dont end up pushing the result
                        let key_name = categories[key].name;
                        if(!each.originalData[key_name]) {
                            isValid = false;
                        }
                }
                //Loop through each of the exclusionary keys
                for(let ex_key of exclusionarySearchKeys) {
                //If the key for each row results != true dont end up pushing the result
                    let alternate_flagname = categories[ex_key].alternateFlag;
                    let alt_keyname = categories[alternate_flagname].name;
                    if(each.originalData[alt_keyname] !== false) {
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
* @desc - Gets url parameters for main data request
* @return {Object} - params needed for rowData call
*
**/
  getDataUrlParameters(dataTableConfiguration = this.dataTableConfiguration) {
    let {pageName} = dataTableConfiguration;
    let {grouperPathText, access_token, adminData} = this;
    return {endowedChairStatusId:1,grouperPathText, access_token, loggedInOpusId: adminData.adminOpusId, opusScreenName: pageName};
}


async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
// This is so that the Time Difference console log works for initial load
    this.consoleLogDifference("START");
    let results = await this.retrieveResultsFromServer({dataTableConfiguration});
    this.filterViews = results["opusDisplayPreferences"];
    let rowData = results[dataTableConfiguration.dataRowName];
    this.rowData = rowData;
// this.checkForEditPermissions(rowData);
    this.maxRowCount = this.rowData.length;
    return this.rowData;
}


}
