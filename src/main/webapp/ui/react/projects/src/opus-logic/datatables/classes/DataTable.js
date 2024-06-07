import moment from "moment";
import FileSaver from "file-saver";
import {difference, pick, uniq, get, set, flattenDeep, values, keys, every,
  pickBy, keyBy, omit} from "lodash";

//My imports
import Opus from "../../common/classes/Opus";
import * as util from "../../common/helpers/";
import configOptions from "../constants/AllConfigConstants";
import {text, constants, dataViewTypes} from "../constants/DatatableConstants";

/**
*
* @classdesc Superclass for all the datatables
* @author Leon Aburime
* @abstract
* @class DataTable
* @extends Opus
*
**/
export default class DataTable extends Opus {
    static name_key = text.name_key;
    static visible_key = text.visible_key;
    static display_name_key = text.display_name_key;

  /**
   *
   * @desc - Instance variables
   *
   **/
    rowData = []; //Data from table
    permissions = {}
    columnConfiguration = null;
    dataTableConfiguration = null;
    startingDataTableConfiguration = null;
    name_key = text.name_key;
    visible_key = text.visible_key;
    display_name_key = text.display_name_key;

  /**
   *
   * @desc - Sets class data to have it for class operations
   * @param {Object} - options for constructor
   * @return {void}
   *
   **/
    constructor({adminData, globalData, access_token, config_name, ...options} = {}) {
        super({...options, adminData, globalData, access_token, config_name});

        this.setClassData({adminData, globalData, access_token, config_name});
    }


  /**
   *
   * @desc - Sets dataTableConfiguration, access_token, adminData, globalData,
   *  grouperPathText, permissions, formatted url to get rowData, permissions
   * @param {Object} - adminData, globalData, access_token, config_name
   * @return {Object} - options from globalData and adminData, the correct
   *  datatableConfiguration, and the visible column options and their displayNames
   *
   **/
    startLogic({adminData, globalData, access_token, config_name = this.defaultConfigName} = {}) {
    //Get datatable by config name
        let dataTableConfiguration = this.setDataTableConfigurationByConfigName(config_name);

    //Add options and modify datatable however need be on start
        this.initiallyFormatDataTableConfiguration({dataTableConfiguration, adminData,
      globalData, access_token});

    //Save starting data to this class for api call, getting options, etc
        this.setLogicClassVariables({dataTableConfiguration, adminData, access_token});

    //Extract dataTableConfiguration to save for easier access
        let {columnConfiguration, columnViewConfiguration, columnKeys, url} = dataTableConfiguration;

    //Format array of column options to display
        let formattedColumnOptions = this.configureColumnInformation(dataTableConfiguration);

        this.setClassData({columnConfiguration, columnViewConfiguration, columnKeys,
      formattedColumnOptions, rowDataUrl: url});

    //Get dropdown options
    //let options = this.getOptionsListFromAdminAndGlobalData({adminData, globalData});
    //this.addOptionsToDataTableConfigColumns(dataTableConfiguration, options);

        this.cloneToStartingDataTableConfiguration(dataTableConfiguration);
        return {dataTableConfiguration, formattedColumnOptions};
    }


  /**
   *
   * @desc - set dataTableConfiguration show only filters
   * @param {Object} dataTableConfiguration - config for class
   * @return {void}
   *
   **/
    setDataTableConfigurationShowOnlyFilters(showOnlyFilters){
        this.dataTableConfiguration.showOnlyFilters = showOnlyFilters;
    }

  /**
   *
   * @desc - Get url for error page
   * @return {String} - error url string
   *
   **/
    getErrorPageUrl() {
        return "/opusWeb/ui/error/page-error.shtml";
    }

  /**
   * TODO - No tests yet for this function
   * @desc - Checks if this datatable is able to be viewed
   * @param {Object} adminData - has view data to check
   * @param {Object} dataTableConfiguration - gets view data for that datatable
   *  and checks it with whats in adminData
   * @return {Bool} isPageViewable - if page is viewable or not
   *
   **/
    isPageViewable({adminData, dataTableConfiguration} = this) {
        let {resourceMap} = adminData;

        let {pagePermissions: {name, action} = {}, bypassViewCheck} = dataTableConfiguration;
        let isPageViewable = false;
        if(resourceMap[name] && resourceMap[name].action === action) {
            isPageViewable = true;
        } else if(bypassViewCheck) {
            isPageViewable = true;
        } else {
            isPageViewable = false;
        }

        return isPageViewable;
    }

  /**
   *
   * @desc - Gets data from datatable configuration
   * @param {Array} args - name of fields to get from dt config
   * @return {Object} data -
   *
   **/
    getDataFromDataTableConfiguration(args = [], ...rest) {
        if(!this.dataTableConfiguration) {
            throw Error("No Datatable Configuration Present!");
        }

        let data = {};
        for(let name of [...args, ...rest]) {
            data[name] = this.dataTableConfiguration[name];
        }
        return data;
    }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
    getDataUrlParameters() {
        let {grouperPathText, access_token} = this;
        return {grouperPathText, access_token};
    }

  /**
   *
   * @desc - Adds options and special logic to datatable. Done before its set
   *  to this class
   * @param {Object} dataTableConfiguration - config for this table
   * @return {void} -
   *
   **/
    initiallyFormatDataTableConfiguration({dataTableConfiguration, adminData,
    globalData}) {
    //Get dropdown options
        let options = this.getOptionsListFromAdminAndGlobalData({adminData, globalData});
        this.addOptionsToDataTableConfigColumns(dataTableConfiguration, options);

        return dataTableConfiguration;
    }

  /**
   *
   * @desc - just what it says
   * @param {Object} dataTableConfiguration - config for this table
   * @return {void} -
   *
   **/
    cloneToStartingDataTableConfiguration(dataTableConfiguration) {
        this.startingDataTableConfiguration = util.cloneObject(dataTableConfiguration);
        return this.startingDataTableConfiguration;
    }

  /**
   *
   * @desc - takes the clone of the datatableConfig made at the beginning
   *  and sets it to the current dataTableConfiguration
   * @return {void} -
   *
   **/
    resetDataTableConfiguration = () => {
        let {cloneObject} = util;
        this.dataTableConfiguration = cloneObject(this.startingDataTableConfiguration);
        let filters = this.dataTableConfiguration.dataColumnFilters;
    // Added this 7/17/18 for those scenarios where
    // name search was made before datatable loads
        filters.columnStringMatch = {};
    // Added 4/22/19 when adding new outside filters for cases
    // As part of RE-468 RE-194
        filters.outsideFilters = {};
    // Added 8/29/19 Jira #2940
    // deleting/withdrawing in datatable sets current filter as 'startingDataTableConfiguration'
    // Edited 1/14/20 #3015
    // Academic History, Excellence Clock and 8 Year Clock reset table kept trying to look for 'fullName'
        filters.columnSortOrder = {};
        let pageName = this.dataTableConfiguration.pageName;
        if(this.dataTableConfiguration.dataRowName==="eligibilityData"){
            filters.columnSortOrder = {academicYear: "asc", name: "asc"};
        }else if(pageName!=="academicHistory" && pageName!=="excellenceClock"
      && pageName!=="eightYearClock" && pageName !== 'endowedChairHolders'){
            filters.columnSortOrder = {fullName: "asc"};
        }
        filters.columnValueOptions = {};
        return this.dataTableConfiguration;
    }

  /**
   *
   * @desc - just what it says
   * @param {Object} dataTableConfiguration - config for this table
   * @return {void} -
   *
   **/
    setDataTableConfiguration(dataTableConfiguration) {
        this.dataTableConfiguration = dataTableConfiguration;
    }

  /**
   *
   * @desc - just what it says
   * @param {Object} config_name - config name for this table
   * @return {void}
   *
   **/
    setDataTableConfigurationByConfigName(config_name) {
        this.dataTableConfiguration = util.cloneObject(configOptions[config_name]);
        return this.dataTableConfiguration;
    }

  /**
   *
   * @desc - For some tables lets remove invalid options. All options MUST have
   *  a NAME!
   * @param {Object} formattedColumnOptions -
   * @param {Object} dataTableConfiguration -
   * @return {Object} formattedColumnOptions
   *
   **/
    removeInvalidShowColumnsOptions(formattedColumnOptions, dataTableConfiguration =
    this.dataTableConfiguration) {
        let {invalidChangeColumnsOptions = []} = dataTableConfiguration;
        let options = keyBy(formattedColumnOptions, "name");
        let validOptionsHash = omit(options, invalidChangeColumnsOptions);
        let validOptions = Object.values(validOptionsHash);

        return validOptions;
    }

  /**
   *
   * @desc -
   * @param {Object} - dataTableConfiguration
   * @return {void}
   *
   **/
    setLogicClassVariables({dataTableConfiguration = this.dataTableConfiguration,
    adminData = this.adminData, access_token = this.access_token} = {}) {
    //Get the Select Options
        let {grouperPathText: permissions_text, permissionNames, url}
      = dataTableConfiguration;
        let rawPermissions = adminData.resourceMap[permissions_text] || {};
        let columnFilters = rawPermissions.filterMap || [];
        let {formattedGrouperPathTexts: grouperPathText} = rawPermissions;

    //Permissions from adminData(i.e. backend API)
        let {permissions: apiPermissions, resourceMap} = adminData;
        this.setPermissions(permissionNames, resourceMap);
        this.setClassData({rawPermissions, grouperPathText, columnFilters});
    }


  /**
   *
   * @desc - Change visibility of given column
   * @param {Object} name - name of column to change
   * @param {Any} value - is it visible or not
   * @param {Object} dataTableConfiguration - visibility key in column
   * @return {void}
   *
   **/
    updateColumnVisibility(name, value, dataTableConfiguration =
    this.dataTableConfiguration) {
        if(dataTableConfiguration.columnConfiguration[name]){
            dataTableConfiguration.columnConfiguration[name].visible = value;
            let clonedDtConfig = util.cloneObject(dataTableConfiguration);
      // RE-131 If a column is not visible but part of the sort, remove the sort
            if(!value && dataTableConfiguration.dataColumnFilters.columnSortOrder[name]){
                delete clonedDtConfig.dataColumnFilters.columnSortOrder[name];
            }
            return clonedDtConfig;
        }else{
            console.log("Cannot find "+name+ " in dataTableConfiguration.columnConfiguration");
        }
    }

  /**
   *
   * @desc - Change visibility of given column
   * @param {Object} visibilityHash - name to value of whether its visible or not
   * @param {Object} dataTableConfiguration - visibility key in column
   * @return {void}
   *
   **/
    updateColumnVisibilityByHash(visibilityHash, dataTableConfiguration =
    this.dataTableConfiguration) {
    //Iterate through each name and update their visibility
        for(let name in visibilityHash) {
            this.updateColumnVisibility(name, visibilityHash[name]);
        }

        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Get the visible columns in order
   * @param {Object} dataTableConfiguration - name of column to change
   * @return {Array} visibleColumns
   *
   **/
    getVisibleColumnNames(dataTableConfiguration = this.dataTableConfiguration) {
        let {columnConfiguration, columnKeys} = dataTableConfiguration;
        let visibleColumns = [];
        for(let name of columnKeys) {
            if(columnConfiguration[name].visible) {
                visibleColumns.push(name);
            }
        }
        return visibleColumns;
    }


  /**
   *
   * @desc - Change visibility of given column
   * @param {Object} name - name of column to change
   * @param {Object} visible - is it visible or not
   * @param {Array} visibility_key - visibility key in column
   * @return {void}
   *
   **/
    updateOutsideFiltersInDatatableConfig({name, value}) {
        this.dataTableConfiguration.dataColumnFilters.outsideFilters[name] = value;
        return this.dataTableConfiguration;
    }

  /**
   *
   * @desc - Update filter in dataTableConfiguration for search text
   * @param {Object} name - name of column to change
   * @param {Object} value -
   * @param {Object} dataTableConfiguration -
   * @return {Object} this.dataTableConfiguration
   *
   **/
    updateSearchTextFilterInDataTableConfig(name, value, dataTableConfiguration =
    this.dataTableConfiguration) {
        let {dataColumnFilters: {columnStringMatch}} = dataTableConfiguration;
        columnStringMatch[name] = value;
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Updates the config file for the select all checkbox
   * @param {Object} dataTableConfiguration -
   * @param {Boolean} isChecked - if select all checkbox is checked
   * @return {Object} this.dataTableConfiguration
   *
   **/
    updateSelectAllInDataTableConfig(dataTableConfiguration =
    this.dataTableConfiguration, isChecked) {
        let {columnConfiguration: {checkbox: {uiProps}}} = dataTableConfiguration;
        uiProps.checked = isChecked;
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Checks to see if this column should sort Jira #2502
   * @param {String} name - name of column to change the sort of
   * @param {Object} dataTableConfiguration -
   * @return {Boolean} shouldSort - value for if the column should sort
   *
   **/
    shouldSort(name, dataTableConfiguration =
    this.dataTableConfiguration) {
        let shouldSort = true;
        for(let each in dataTableConfiguration.omitUIColumns){
            if(dataTableConfiguration.omitUIColumns[each] === name){
                shouldSort = false;
                break;
            }
        }
        // IOK-586 If shouldSort is still true, and datatable has a notSortable array, loop and set correct sort status on applicable columns
        if(dataTableConfiguration.notSortable && shouldSort){
            for(let each in dataTableConfiguration.notSortable){
                if(dataTableConfiguration.notSortable[each] === name){
                    shouldSort = false;
                    break;
                }
            }
        }
        return shouldSort;
    }

  /**
   *
   * @desc - Update sorting filter in dataTableConfiguration by iterating the
   *  current filter
   * @param {String} name - name of column to change the sort of
   * @param {Object} dataTableConfiguration - name of column to change the sort of
   * @return {Object} this.dataTableConfiguration
   *
   **/
    updateSortOrderFilterInDataTableConfig(name, dataTableConfiguration =
    this.dataTableConfiguration) {

        let {dataColumnFilters: {columnSortOrder}} = dataTableConfiguration;
        let {sortOrder, sortOrderHash, default_sort_type} = constants;

    //Find current sort direction
        let oldSortDirection = columnSortOrder[name] || default_sort_type;
        let oldSortDirectionIndex = sortOrderHash[oldSortDirection];

    //Get new sort direction
        let newSortDirectionIndex = (++oldSortDirectionIndex) % sortOrder.length;
        let sortDirection = constants.sortOrder[newSortDirectionIndex];

    //Update sort direction for column
        columnSortOrder[name] = sortDirection;

    //If direction is 'none' then delete it from 'columnSortOrder'
        if(sortDirection === "none") {
            delete columnSortOrder[name];
        }

        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Get sorting text order string
   * Be aware this is for roster and inactive roster.  If you need to change the
   * active, completed or withdrawn show only filters, look in Cases.js with the same function name
   * @param {Object} dataTableConfiguration - dataTableConfiguration
   * @return {String} sortingText
   *
   **/
    getSortOrderText(dataTableConfiguration = this.dataTableConfiguration) {
        let {dataColumnFilters: {columnSortOrder, outsideFilters}, columnConfiguration} =
      dataTableConfiguration;
        let sortingText = "";
        let columns = keys(columnSortOrder);

        if(columns.length) {
            sortingText = "Sorting by ";
            columns.map((name, index) => {
                sortingText += `${(index + 1)}. ${columnConfiguration[name].displayName} `;
            });
        }

        if(dataTableConfiguration.pageName==="Roster" || dataTableConfiguration.pageName==="InactiveRoster"
       || dataTableConfiguration.pageName==="SalaryCompensation"){
            let outsideFilterColumns = keys(outsideFilters);
            let showOnlyFilters = dataTableConfiguration.showOnlyFilters.categories;
            let showOnlyFilterCount = 0;
        // Check if there is any filters inside the outside filters
            if(outsideFilterColumns.length>0){
            // Set initial text
                sortingText = sortingText+ "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "Show Only: ";
            // Loop through outside filters
                for(let outsideFilterIndex in outsideFilterColumns){
            // Loop through show only filters display
                    for(let showOnlyIndex in showOnlyFilters){
                // Find outside filter in show only filters display
                        if(showOnlyIndex===outsideFilterColumns[outsideFilterIndex]){
                            if(showOnlyFilterCount===0){
                                sortingText = sortingText+showOnlyFilters[showOnlyIndex].displayName;
                                showOnlyFilterCount++;
                            }else{
                                sortingText = sortingText+", "+showOnlyFilters[showOnlyIndex].displayName;
                            }
                        }
                    }
                }
            }
        }

        return sortingText;
    }

  /**
   *
   * @desc - Update filter value options in dataTableConfiguration
   * @param {Object} name - name of column to change the sort of
   * @param {Object} valuesHash - hash of values to true false if the column
   *  currently has those values as filterable
   * @param {Object} dataTableConfiguration - name of column to change the sort of
   * @return {Object} this.dataTableConfiguration
   *
   **/
    updateValueOptionsFilterInDataTableConfig(name, valuesHash = {}, dataTableConfiguration =
    this.dataTableConfiguration) {
        let {dataColumnFilters: {columnValueOptions}} = dataTableConfiguration;
        columnValueOptions[name] = valuesHash;
        let filterMapValues = Object.values(valuesHash);
        let allValuesAreTrue = every(filterMapValues);
        if(allValuesAreTrue) {
            delete columnValueOptions[name];
        }
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Get visible columns and extract the visible names from the filters
   * @param {Object} dataTableConfiguration - dtConfig
   * @return {Object}
   *
   **/
    getVisibleTableFilters(dataTableConfiguration = this.dataTableConfiguration) {
    //Extract current filters
        let {dataColumnFilters} = dataTableConfiguration;
        let {columnSortOrder, columnStringMatch, columnValueOptions}
      = dataColumnFilters;
    //Filter visible column arrays
        let visibleColumns = this.getVisibleColumnNames();

    //Extract by visible keys of each filter
        let visibleColumnValueOptions = pick(columnValueOptions, visibleColumns);
        let visibleColumnStringMatch = pick(columnStringMatch, visibleColumns);

    //Get column sort order that keeps the insertion order of object
        let visibleColumnSortOrder = this.getVisibleColumnSortOrder(columnSortOrder,
      visibleColumns);

        return {visibleColumnValueOptions, visibleColumnStringMatch,
      visibleColumnSortOrder};
    }

  /**
   *
   * @desc - To keep insertion order of columnSorterOrder must iterate through
   *  columnSort order instead of using 'pick' from lodash
   * @param {Object} columnSortOrder -
   * @param {Array} visibleColumns -
   * @return {Object} visibleColumnSortOrder
   *
   **/
    getVisibleColumnSortOrder(columnSortOrder, visibleColumns) {
    //The answer I want to save to
        let visibleColumnSortOrder = {};

    //Turn the visibleColumns array into an array of arrays where each key is "true"
        let visibleColumnHash = visibleColumns.map(each => {
            return {[each]: true};
        });

    //Flatten the array of arrays into a hash
        visibleColumnHash = Object.assign({}, ...visibleColumnHash);

    //Iterate thru columnSortOrder to keep the order & filter out invisible fields
        for(let name in columnSortOrder) {
            if(visibleColumnHash[name]) {
                visibleColumnSortOrder[name] = columnSortOrder[name];
            }
        }

    //return columns with saved sort order
        return visibleColumnSortOrder;
    }

  /**
   *
   * @desc - Filters data using saved filters in dataTableConfiguration
   * @param {Array} rowData - array of row data results from server
   * @param {Object} dataTableConfiguration -
   * @return {Array} formattedRowData
   *
   **/
    filterAPITableData(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {

        let formattedRowData = rowData;
        let {visibleColumnValueOptions, visibleColumnStringMatch, simpleFilters = {},
      visibleColumnSortOrder} = this.getVisibleTableFilters(dataTableConfiguration);


    //FIlter collection by key-> object possibilities
        formattedRowData = this.filterColumnValueOptions(formattedRowData,
      visibleColumnValueOptions);

    //SIMPLE FILTERS - If there are simple 'true,false' or key-value filters
        formattedRowData = this.filterBySimpleObject(formattedRowData, simpleFilters);

    //STRING TEXT OPTIONS - If there are valid strings lets filter the collection
        formattedRowData = this.filterByStringMatch(formattedRowData,
      visibleColumnStringMatch);

    //SORT OPTIONS - If there are options to sort
        formattedRowData = this.sortRowDataByObject(formattedRowData,
      visibleColumnSortOrder);

    // OPUSDEV-3684
    // this.createDynamicFilterOptions(formattedRowData, dataTableConfiguration);
        return formattedRowData;
    }

  /**
   *
   * @desc - filters collection by simple object set in child classes
   * @param {Array} rowData - rowData from the server
   * @param {Object} simpleFilters - key/value pair of possible options to
   *  filter by
   * @return {Array} formattedRowData - filtered options
   *
   **/
    filterBySimpleObject(rowData = [], simpleFilters = {}) {
        let formattedRowData = rowData;
        if(Object.keys(simpleFilters).length > 0) {
      //Get filtered values
            formattedRowData = util.filterCollectionByObject(formattedRowData,
        simpleFilters);
        }
        return formattedRowData;
    }

  /**
   *
   * @desc - filters collection by ensuring string is in value
   * @param {Array} rowData - rowData from the server
   * @param {Object} columnStringMatch - key/string pair of possible options
   * @return {Array} formattedRowData - filtered options
   *
   **/
    filterByStringMatch(rowData = [], columnStringMatch = {}) {
        let formattedRowData = rowData;
    //STRING TEXT OPTIONS - If there are valid keys lets filter the data
        if(keys(columnStringMatch).length > 0) {
      //Get filtered values
            formattedRowData = util.stringMatchCollectionByObject(formattedRowData,
        columnStringMatch);
        }
    // OPUSDEV-3684
    // this.createDynamicFilterOptions(formattedRowData, this.dataTableConfiguration);
        return formattedRowData;
    }

  /**
   *
   * @desc - Filters Collection by checking if the values of keys in row data
   *  are included in columnValueOptions
   * @param {Array} rowData - rowData from the server
   * @param {Object} columnValueOptions - key/object pair of possible options
   * @return {Array} formattedRowData - filtered options
   *
   **/
    filterColumnValueOptions(rowData = [], columnValueOptions = {}) {
        let formattedRowData = rowData;
        if(keys(columnValueOptions).length > 0) {
      //Get filtered values
            formattedRowData = util.filterCollectionByObjectBoolean(formattedRowData,
        columnValueOptions);
        }
    // OPUSDEV-3684
    // this.createDynamicFilterOptions(formattedRowData, this.dataTableConfiguration);
        return formattedRowData;
    }

  /**
   *
   * @desc - Sort data
   * @param {Array} rowData - url from the server
   * @param {Object} columnSortOrder - visible columns to use to sort
   * @return {Array} formattedRowData - filtered row data
   *
   **/
    sortRowDataByObject(rowData = [], columnSortOrder = {}) {
        let formattedRowData = rowData;

        //SORT OPTIONS - If there are options to sort
        let [sortColumns, sortDirection] =
          util.destructureObjectIntoKeyValueArrays(columnSortOrder);

        if(sortColumns && sortColumns.length > 0) {
            formattedRowData = util.orderByObjectArray(formattedRowData,
            sortColumns, sortDirection);
        }

        return formattedRowData;
    }


  /**
   *
   * @desc - Formats the url used to get api row data
   * @param {Object} dataTableConfiguration - guess
   * @return {String} url - url for api call
   *
   **/
    getRowDataUrl(dataTableConfiguration = this.dataTableConfiguration) {
        let {url} = dataTableConfiguration;
        return url;
    }

  /**
   *
   * @desc -All it does it get the data from the url
   * @param {String} url - url from the server
   * @return {Promise} datatableAPIRequest -
   *
   **/
    async retrieveResultsFromServer({dataTableConfiguration = this.dataTableConfiguration}
    = {}) {
        let urlParameters = this.getDataUrlParameters();
        let url = this.getRowDataUrl();
        this.consoleLogDifference("START");
        this.consoleLog("START","retrieveResultsFromServer");
        let resultsPromise = util.fetchJson(url, urlParameters);
        this.serverRowResults = await resultsPromise;
        this.consoleLog("FINISH", "retrieveResultsFromServer");
        this.printLoadTime(resultsPromise, dataTableConfiguration);
        return this.serverRowResults;
    }

  /**
   *
   * @desc - gets data from server and then parses it out from the unique key i.e.
   *  {activeCaseDataRows: Array[9000 results]} via dtConfig
   * @param {Object} dataTableConfiguration - d.t. config
   * @return {Array} - configured column information
   *
   **/
    async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
        let resultsPromise = this.retrieveResultsFromServer({dataTableConfiguration});
        this.rowData = await this.extractRowDataFromServerResultsPromise(resultsPromise);
        this.maxRowCount = this.rowData.length;
        return this.rowData;
    }

  /**
   *
   * @desc - get rowData from API then configure for display
   * @param {Object} - various args being passed down
   * @return {Array} rowData -
   *
   **/
    async getFormattedRowDataFromServer({...args} = {}) {

        let rowData = await this.getRowDataFromServer(args);
        rowData = this.configureData(rowData);
        return rowData;
    }

  /**
   *
   * @desc - If rowData calls comes back and I have it then send it back. O.w.
   *  get the promise and send it back
   * @param {Object} dataTableConfiguration - config for this table
   * @return {Array} rowData - rows for datatable
   *
   **/
    getRowData(...args) {
        if(this.rowData) {
            return this.rowData;
        }
        return this.getRowDataFromServer(...args);
    }

  /**
   *
   * @desc - Formats column options. Usually for a modal that will display
   *  list of columns
   * @param {Object} dataTableConfiguration - d.t. config
   * @return {Object} - configured column information
   *
   **/
    configureColumnInformation(dataTableConfiguration = this.dataTableConfiguration,
    {name_key = this.name_key, visibility_key = this.visible_key,
      display_name_key = this.display_name_key} = {}) {
        let {columnConfiguration = {}, columnKeys = []} = dataTableConfiguration;

    //Create array to reference columns by 'name' and 'displayName'
        let columnInformation = columnKeys.map(columnName => {
            let {
        [display_name_key]: displayName,
        [name_key]: name,
        [visibility_key]: visible
      } = columnConfiguration[columnName];

            return {visible, name, displayName};
        });

        return columnInformation;
    }

  /**
   *
   * @desc - Add options to columns that show what the values of each row in
   *  the column could be
   * @param {Object} this - extract adminData and globalData
   * @param {Object} - constants
   * @return {Object} hash
   *
   **/
    getOptionsListFromAdminAndGlobalData({adminData, globalData} = this,
    {adminDeptList = constants.adminDeptFieldToNameOfList} = {}) {
        let {filterMap} = adminData;
        let {affiliationTypeList: affiliationArray, orgLocations, actionOutcomes,
      actionTypes, apoAnalyst} = globalData;
        let actionOptions = uniq(flattenDeep(values(actionOutcomes)).map(e =>
      e.name));
    // OPUSDEV-3292 Sort Outcome types alphabetically
        actionOptions.sort((a,b) => (a > b) ? 1 : -1);

        let eligibilityActionTypeList = uniq(flattenDeep(values(actionTypes)).map(e =>
      e.actionTypeDisplayText)).sort();
        let affiliationTypeList = uniq(affiliationArray.map(e => e.affiliation)).sort();
        let apoAnalystList = values(apoAnalyst).sort();

    // Data clean up: Location: removed sorting (UCLA Campus is at top of list)
        let orgLocationList = values(orgLocations).sort();

        let appointmentStatusType = uniq(globalData.commonTypeReferences.AppointmentStatusType.map(e => e.commonTypeValue)).sort();

    // OPUSDEV-2767 Remove 'Removed' from dropdown since reusing same list as profile
    // for(let index in appointmentStatusType){
    //   if(appointmentStatusType[index]==='Removed'){
    //     delete appointmentStatusType[index];
    //     break;
    //   }
    // }
    // OPUSDEV-3123 Had to remove condition above; kept just in case

        let hash = {...filterMap, actionOutcomes: actionOptions, orgLocationList,
      apoAnalystList, eligibilityActionTypeList, affiliationTypeList, appointmentStatusType};

    //These options should be sorted unlike values on the previous line
        let {adminDepartments} = adminData;
        for(let [key, list_name] of Object.entries(adminDeptList)) {
            hash[list_name] = uniq(adminDepartments.map(e => e[key])).sort();
        }

        return hash;
    }

  /**
   *
   * @desc - Adds array of options to columns in dataTableConfiguration
   * @param {Object} dataTableConfiguration -
   * @param {Object} options -
   * @return {void}
   *
   **/
    addOptionsToDataTableConfigColumns(dataTableConfiguration, options = {}) {
        let {columnConfiguration} = dataTableConfiguration;

        for(let name in columnConfiguration) {
            let {optionsList, optionsListName} = columnConfiguration[name];
            if(optionsList) {
                columnConfiguration[name].valueOptions = optionsList;
            } else if(optionsListName) {
                columnConfiguration[name].valueOptions = options[optionsListName];
            }
        }
    }

  /**
   *
   * @desc - Gets unique values of keys in rowData and sets them as select options
   * @param {Array} rowData -
   * @param {Object} dataTableConfiguration -
   * @return {Object} dataTableConfiguration
   *
   **/
    createDynamicFilterOptions(rowData = [], dataTableConfiguration = {},
    {select_options_key = "valueOptions"} = {}) {
        let {columnConfiguration} = dataTableConfiguration;

        for(let columnName in columnConfiguration) {
            let column = columnConfiguration[columnName];
            if(column.dynamicFilterSearch) {
        //Sort Unique option values
                let options = [];
                // if(column.viewType === dataViewTypes.datetime) {
                //     options = uniq(rowData.map(e =>e[columnName])).slice().sort((a, b) => {
                //         return new Date(a[columnName]) - new Date(b[columnName]);
                //     });
                // } else
                if(column.viewType === dataViewTypes.number) {
                    options = uniq(rowData.map(e => e[columnName])).sort(util.comparator);
                } else if(column.viewType === dataViewTypes.mixedString) {
                    options = uniq(rowData.map(e => e[columnName])).sort((a, b) => {
                        return a.localeCompare(b, undefined, {sensitivity: "base"});
                    });
                } else {
                    options = uniq(rowData.map(e => e[columnName])).sort();
                }

        // // 1/3/18 Uncomment out to remove blank option
        // for(let each in options){
        //   if(options[each]===''){
        //     options.splice(each,1);
        //   }
        // }

                columnConfiguration[columnName][select_options_key] = options;
            }
        }

        return dataTableConfiguration;
    }

  /**
   *
   * @desc - If you want to change data in the columns, such as making the
   *  'department' column 'visible'
   * @param {String} columnName - name of column to change
   * @param {String} key - key that will change
   * @param {any} value - value to change key in column to
   * @return {void}
   *
   **/
    changeColumnFieldValue(columnName, key, value) {
        this.dataTableConfiguration.columnConfiguration[columnName][key] = value;
    }

  /**
   *
   * @desc - get rowData and format them for viewing as well as add dropdown options
   *  and cloning the starting fields
   * @param {Object} rowData - array of rowData
   * @param {Object} - dataTableConfiguration
   * @return {Array} formattedRowData
   *
   **/
    configureData(rowData, {dataTableConfiguration = this.dataTableConfiguration,
    ...args} = {}) {
        let {columnConfiguration} = dataTableConfiguration;
        let formattedRowData = this.configureAPITableData(rowData, args);
        this.createSortingTextDisplayValue(columnConfiguration, rowData);
        this.createLinkDisplayValue(columnConfiguration, rowData);
        this.transformDatesInData(columnConfiguration, rowData);
        this.createMoneyDisplayValue(columnConfiguration, rowData);
        this.createPercentDisplayValue(columnConfiguration, rowData);
        this.create2DecimalPercentDisplayValue(columnConfiguration, rowData);
        let dtConfig = this.createDynamicFilterOptions(rowData, dataTableConfiguration);
        this.cloneToStartingDataTableConfiguration(dtConfig);

        return formattedRowData;
    }


  /**
   *
   * @desc - Gets key name results for rowData is hidden under
   * @param {Promise} resultsPromise - config for this table
   * @param {Object} dataTableConfiguration - config for this table
   * @return {Array} rowData - rows for datatable
   *
   **/
    async extractRowDataFromServerResultsPromise(resultsPromise,
    {dataTableConfiguration = this.dataTableConfiguration} = {}) {
        let results = await resultsPromise;
        let rowData = results;

        if(dataTableConfiguration.dataRowName!=="rosterDataList"
            && dataTableConfiguration.dataRowName!=="eligibilityData"
            && dataTableConfiguration.dataRowName!=="offScales"
            && dataTableConfiguration.dataRowName!=="casesAtMyOffice"){
            rowData = results[dataTableConfiguration.dataRowName];
            if(dataTableConfiguration.dataRowName==="casesDataRows"){
                this.filterViews = results["opusDisplayPreferences"];
            }
        }else if(dataTableConfiguration.dataRowName==="rosterDataList"){
            rowData = results["rosterData"];
            this.filterViews = results["opusDisplayPreferences"];
        }
        return rowData;
    }

  /**
   *
   * @desc - Gets key name results for rowData is hidden under
   *  This is mainly used for test functions
   * @param {Promise} apiResults - config for this table
   * @param {Object}  - dataTableConfiguration
   * @return {Array} rowData - rows for datatable
   *
   **/
    extractRowDataFromServerResults(apiResults, {
    dataTableConfiguration = this.dataTableConfiguration} = {}) {
        let {dataRowName} = dataTableConfiguration;
        let rowData = apiResults;
        if(dataRowName!=="rosterDataList"
      && dataRowName!=="eligibilityData"
      && dataRowName!=="offScales"){
            rowData = apiResults[dataRowName];
        }
        return rowData;
    }

  /**
   *
   * @desc - just see hows long it takes to get data from the backend
   * @param {Promise} resultsPromise - promise that holds rowData
   * @param {Object} dataTableConfiguration - guess
   * @return {String} - load time message
   *
   **/
    async printLoadTime(resultsPromise, dataTableConfiguration) {
        let start = new Date();
        let results = await resultsPromise;
        let data = results;
        if(dataTableConfiguration.dataRowName!=="rosterDataList"
    && dataTableConfiguration.dataRowName!=="eligibilityData"
    && dataTableConfiguration.dataRowName!=="offScales"){
            data = results[dataTableConfiguration.dataRowName];
        }
        let server_load_seconds = (new Date() - start) / 1000;
        let message = `Server request for data took ${server_load_seconds} seconds
      at ${new Date()}`;
        message += data ? ` for ${data.length} results.` : "";
        return message;
    }

  /**
   *
   * @desc - Main function to be used that will
   *  reconcile how the object is stored or 'flattened' from the server so it
   *  can be shown best in the UI datatable
   * @param {Object} row - each row from the results of the datatable
   * @return {Object} row - just returns it here as the default
   *
   **/
    reconcileRowValuesFromServerData(row, {columnConfiguration = {}, columnKeys = []}) {
        let formattedRow = {originalData: row};

        for(let key of columnKeys) {
            let {pathsInAPI: {appointment: {displayText = key} = {}} = {}} =
        columnConfiguration[key];
            formattedRow[key] = get(row, displayText);
        }
        return formattedRow;
    }


  /**
   *
   * @desc - Need to flatten objects of objects into one for display
   * @param {Object} rowData - raw rowData from API
   * @param {Object} - various args
   * @return {Array} rowData
   *
   **/
    configureAPITableData(rowData = [], {columnKeys = this.dataTableConfiguration.columnKeys,
    columnConfiguration = this.dataTableConfiguration.columnConfiguration}
    = {}) {
        for(let index in rowData) {
            rowData[index] = this.reconcileRowValuesFromServerData(rowData[index],
        {columnConfiguration, columnKeys});
        }
        return rowData;
    }

  /**
   *
   * @desc - Need to transform data from one form to another when it cant be done
   *    on the API side. Here its dates from the backend API
   * @param {Object} columns -
   * @param {Array} rowData -
   * @return {Array}
   *
   **/
    transformDatesInData(columns = {}, rowData = []) {
    //Go thru the columns to see if they tell me to transform anything
        for(let name in columns) {
            if(columns[name].transformDate) {//Should we transform the date
                let {transformDate: {from, to, pathToGetValue = name, pathToSetValue =
          pathToGetValue}, saveOriginalValueByKey = name} = columns[name];

        //Transform values in row results
                rowData.map(each => {
                    let value = get(each, pathToGetValue);//Get current value
                    each[saveOriginalValueByKey] = value;//Save original value
                    if(value) { //Not all rows have values to be transformed
                        value = moment(value, from).format(to);//Transform Date
                        set(each, pathToSetValue, value);//Set value back in row
                    }
                });
            }
        }
        return rowData;
    }

    reformatToMoneyDisplayValue(value) {
        if(util.isNumber(value)) {
            return util.reformatToMoneyDisplayValueExcludeDecimalPlaces(value);
        }

        return value;
    }

  /**
   *
   * @desc - Attaches $ to money in results and sets it do a display value key
   * @param {Object} columns - columns in datatable
   * @param {Array} rowData - each row from api
   * @return {Array} rowData
   *
   **/
    createMoneyDisplayValue(columns = {}, rowData = []) {
    //Go thru the columns to see if they tell me to transform anything
        for(let name in columns) {
            if(columns[name].viewType === dataViewTypes.money) {//Should we transform the date
                let {displayKey, pathToGetValue = name} = columns[name];

        //Transform values in row results
                rowData.map(each => {
                    let value = get(each, pathToGetValue);//Get current value
                    let isValid = !(value in {null: true, "": true, undefined: true});
                    if(isValid) {
                        value = this.reformatToMoneyDisplayValue(value);
                    }
                    set(each, displayKey, value);//Set value back in row
                });
            }
        }
        return rowData;
    }


  /**
   *
   * @desc - Attaches % to number in results and sets it do a display value key
   * @param {Object} columns - columns in datatable
   * @param {Array} rowData - each row from api
   * @return {Array} rowData
   *
   **/
    createPercentDisplayValue(columns = {}, rowData = []) {
    //Go thru the columns to see if they tell me to transform anything
        for(let name in columns) {
            if(columns[name].viewType === dataViewTypes.percent) {//Should we transform the date
                let {displayKey, pathToGetValue = name} = columns[name];

        //Transform values in row results
                rowData.map(each => {
                    let value = get(each, pathToGetValue);//Get current value
                    let isValid = !(value in {null: true, "": true, undefined: true});
                    let isNumber = util.isNumber(value);
                    if(isValid && isNumber) {
                        value += "%";
                    }
                    set(each, displayKey, value);//Set value back in row
                });
            }
        }
        return rowData;
    }

    /**
     *
     * @desc - Attaches % to number in results and sets it do a display value key
     * @param {Object} columns - columns in datatable
     * @param {Array} rowData - each row from api
     * @return {Array} rowData
     *
     **/
    create2DecimalPercentDisplayValue(columns = {}, rowData = []) {
      //Go thru the columns to see if they tell me to transform anything
        for(let name in columns) {
            if(columns[name].viewType === dataViewTypes.round2DecimalPercent) {//Should we transform the date
                let {displayKey, pathToGetValue = name} = columns[name];

          //Transform values in row results
                rowData.map(each => {
                    let value = get(each, pathToGetValue);//Get current value
                    let isValid = !(value in {null: true, "": true, undefined: true});
                    let isNumber = util.isNumber(value);
                    if(isValid && isNumber) {
                        value = parseFloat(Math.round(value * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2) + "%";
                    }
                    set(each, displayKey, value);//Set value back in row
                });
            }
        }
        return rowData;
    }

    /**
     *
     * @desc - Need to transform name from one form to another for sorting and
     * preserve the orginal value for display.
     * @param {Object} columns - columns in datatable
     * @param {Array} rowData - each row from api
     * @return {Array} rowData
     *
     **/
    createSortingTextDisplayValue(columns = {}, rowData = []) {
      //Go thru the columns to see if they tell me to transform anything
        for(let name in columns) {
            if(columns[name].viewType === dataViewTypes.sortingText
                  || columns[name].viewType === dataViewTypes.nameLink) {//Should we transform the name
                let {displayKey, pathToGetValue = name} = columns[name];

                  //Transform values in row results
                rowData.map(each => {
                    let value = get(each, pathToGetValue);//Get current value
                    if (value !== null) {
                        set(each, name, value.toLowerCase());//Set value back in row for sorting
                    }
                    set(each, displayKey, value);//Set value back in row

                });
            }
        }
        return rowData;
    }

    /**
     *
     * @desc - Need to transform name from one form to another for link and
     * preserve the orginal value for display.
     * @param {Object} columns - columns in datatable
     * @param {Array} rowData - each row from api
     * @return {Array} rowData
     *
     **/
    createLinkDisplayValue(columns = {}, rowData = []) {
      //Go thru the columns to see if they tell me to transform anything
        for(let name in columns) {
            if(columns[name].viewType === dataViewTypes.link) {//Should we transform the name
                let {displayKey, pathToGetValue = name} = columns[name];

                  //Transform values in row results
                rowData.map(each => {
                    let value = get(each, pathToGetValue);//Get current value
                    if (value !== null) {
                        set(each, name, value);//Set value back in row for sorting
                    }
                    set(each, displayKey, value);//Set value back in row

                });
            }
        }
        return rowData;
    }

  /**
   *
   * @desc - Overlays filter sections and not just each individual name in one filter
   * @param {Object} filters -
   * @param {Object} dataTableConfiguration -
   * @return {Object} dataTableConfiguration
   *
   **/
    replaceFilters(filters = {}, dataTableConfiguration = this.dataTableConfiguration) {
        let {dataColumnFilters } = dataTableConfiguration;
        dataTableConfiguration.dataColumnFilters = {...dataColumnFilters,
      ...filters};
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Takes the columnSortOrder and split it into two columns -
  *   sortFields and sortOrder
   * @param {Object} dataTableConfiguration -
   * @return {Object} - two arrays, one with ordered array to sort, and then
   *  whether to sort them ascending or descending
   *
   **/
    splitSortIntoNameAndDirection(dataTableConfiguration) {
        let {visibleColumnSortOrder} = this.getVisibleTableFilters(dataTableConfiguration);
    //SORT OPTIONS - If there are options to sort
        let [sortColumns, sortDirection] =
      util.destructureObjectIntoKeyValueArrays(visibleColumnSortOrder);

        return {sortColumns, sortDirection};
    }

  /**
   *
   * @desc - Formats excel arguments that go to the backend
   * @return {Object} - various arguments
   *
   **/
    getFormattedExcelFilterVariables() {
        let {dataColumnFilters, omitUIColumns} = this.dataTableConfiguration;
        let {columnSortOrder, columnStringMatch, columnValueOptions, outsideFilters,
      simpleFilters} = dataColumnFilters;
        let visibleColumnNames = this.getVisibleColumnNames();
        visibleColumnNames = difference(util.cloneObject(visibleColumnNames),
      omitUIColumns);

        let {sortColumns: sortFields, sortDirection: sortOrder}
      = this.splitSortIntoNameAndDirection();

    //Turn column select options into array
        let tempColumnSelectOptions = {};
        for(let [key, value] of Object.entries(columnValueOptions)) {
      //Get array of option names for which value is Boolean 'true'
            let clickedOptions = keys(pickBy(value, (val) => val === true));
            tempColumnSelectOptions[key] = clickedOptions;
        }

        return {extraFilters: outsideFilters, simpleFilters, columnStringMatch,
      columnSelectOptions: tempColumnSelectOptions, visibleColumns: visibleColumnNames,
      sortFields, sortOrder, sortColumnDirection: columnSortOrder};
    }


    getFilteredTimePeriodRowData = (value, rowData) => {
        let valueDate = moment().subtract("1", value);
        let filteredRowData = [];
        if(value==="twoyears"){
            valueDate = moment().subtract("2", "years");
        }else if(value==="fiveyears"){
            valueDate = moment().subtract("5", "years");
        }
        for(let each in rowData){
            let dateToCheck = moment(rowData[each].actionCompletedDt);
            if(moment(dateToCheck).isSameOrAfter(valueDate, "day")){
                filteredRowData.push(rowData[each]);
            }
        }

        return filteredRowData;
    }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {String} - formatted CSV url
   *
   **/
    getExportToExcelUrl() {
        let {grouperPathText, access_token, dataTableConfiguration} = this;
        let {exportToExcelBaseUrl: url} = dataTableConfiguration;
        let csv_url = this.addAccessTokenAndGrouperToUrl(url, access_token,
      {grouperPathText, addGrouper: true});
        return csv_url;
    }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {Promise} - promise for Export To Excel CSV
   *
   **/
    async exportCSV(specialShowOnlyFilter) {
        let csv_url = this.getExportToExcelUrl();

        let pageName = this.dataTableConfiguration.pageName;
        if(pageName === "Active" || pageName === "Withdrawn"){
            csv_url = csv_url+"&timePeriod=null&apptStatus="+specialShowOnlyFilter;
        }else if(pageName === "Completed"){
            csv_url = csv_url+"&timePeriod="+this.dataTableConfiguration.timePeriod+"&apptStatus="+specialShowOnlyFilter;
        }else if(pageName === "Roster" || pageName === "InactiveRoster"){
            csv_url = this.setTypeOfReq(csv_url, pageName);
        } else if (pageName === "Mismatch" || pageName === "Hidden"
                    || pageName === "OpusOnly" || pageName === "PathOnly"
                    || pageName === "OpusMismatch" || pageName === "opusHidden") {
            csv_url = csv_url+"&opusScreenName="+specialShowOnlyFilter;
        }
    // else if(pageName==='apoQueue' ||pageName==='deansOfficeQueue'
    //   || pageName==='deptQueue' || pageName==='capQueue' || pageName==='libraryQueue'){
    //   csv_url = csv_url+'&timePeriod='+this.dataTableConfiguration.timePeriod;
      // console.log(csv_url)
    // }

        let filterVariables = this.getFormattedExcelFilterVariables();
        let visibleColumns = filterVariables.visibleColumns;
    // Jira #3097 Remove any sort if it is not visible
        let sortColumnDirection = filterVariables.sortColumnDirection;
        for(let each in sortColumnDirection){
            if(!visibleColumns.includes(each)){
                delete sortColumnDirection[each];
            }
        }

        // IOK-957 PROD's 1 minute timeout causing issues with string filter variables so have to look for ids
        if(pageName === "Roster" || pageName === "InactiveRoster"){
            this.setCorrectColumnSelectOptions(filterVariables);
        }

        // IOK-987 PROD's 1 minute timeout causing issues with string filter variables so have to look for ids
        // if(pageName === "Mismatch" || pageName === "Hidden" || pageName === "PathOnly"){
        //     this.setCorrectColumnSelectOptionsForUCPathComparisonTables(filterVariables);
        // }

        let stringifiedFilterVariables = JSON.stringify(filterVariables);

        util.print("Current filter variables being sent to excel ", filterVariables,
      "Sending request to ", csv_url);

        let promise = util.jqueryPostJson(csv_url, stringifiedFilterVariables);
        console.log(csv_url);
        let csv = await promise;

        let csvData = new Blob([csv], {type: "attachment/csv;charset=utf-8;"});
        let {excelFileName = "Eligibility.csv"} = this.dataTableConfiguration;
        let csvArgs = [csvData, excelFileName];
        let {msSaveBlob} = navigator;
        msSaveBlob = msSaveBlob ? msSaveBlob.bind(navigator) : null;
        let csvCreateFunc = msSaveBlob ? msSaveBlob : FileSaver.saveAs;
        return csvCreateFunc(...csvArgs);
    }

  /**
   *
   * @desc - sets the type of request at the end of excel url if coming from roster datatable
   * @param {String} csv_url - url that contains the excel download url
   * @param {String} pageName - page name (Active or Inactive)
   * @return {String} - formatted CSV url
   *
   **/
    setTypeOfReq = (csv_url, pageName) => {
        let url = csv_url;
        if(pageName === "Roster"){
            url = csv_url+"&typeOfReq=active&testAutomationFlag=N";
        }else if(pageName === "InactiveRoster"){
            url = csv_url+"&typeOfReq=inactive&testAutomationFlag=N";
        }
        return url;
    }

        /**
     *
     * @name setCorrectColumnSelectOptionsForUCPathComparisonTables
     * @desc - IOK-957 PROD's 1 minute timeout causing issues with string filter variables so have to look for ids
     * @param {Object} filterVariables -
     * @return {Object} filterVariables -
     *
     **/
        setCorrectColumnSelectOptionsForUCPathComparisonTables = (filterVariables) => {
            if(filterVariables.columnSelectOptions.ucPathDeptCode){      
                let ucPathDeptCodeArray = [];
                let ucPathDeptCodeValueOptions = this.columnConfiguration.ucPathDeptCode.valueOptions;
                for(let each of filterVariables.columnSelectOptions.ucPathDeptCode){
                    let key = Object.keys(ucPathDeptCodeValueOptions).find(key => ucPathDeptCodeValueOptions[key] === each)
                    ucPathDeptCodeArray.push(key)
                }
                filterVariables.columnSelectOptions.ucPathDeptCode = ucPathDeptCodeArray;
            }
            return filterVariables;
        }

  /**
   *
   * @desc - sets various permissions for viewing and editing page
   * @param {Object} permissionNames - Names of permissions
   * @param {Object} resourceMap - Name of API data that has the actions, grouperPathText
   *  and whatever else needed
   * @return {Object} this.permissions
   *
   **/
    setPermissions(permissionNames = {}, resourceMap = this.adminData.resourceMap) {
        let {view_page: view, edit_page: edit} = permissionNames;
        this.permissions.view_page = (view in resourceMap) ? resourceMap[view] : null;
        this.permissions.edit_page = (edit in resourceMap) ? resourceMap[edit] : null;

        return this.permissions;
    }

    /**
     *
     * @desc - sets export data
     * @param {Object} rowData - rowData
     * @return {Object} exportData
     *
     **/
    findExportData = (rowData, formattedColumnOptions) => {
        // console.log(rowData)
        // console.log(formattedColumnOptions)
        let exportData = [];
        let {pageName} = this.dataTableConfiguration;
        let {columnConfiguration, omitUIColumns, dataColumnFilters, excelFileName} = this.dataTableConfiguration;
        
        let exceptionList = {
            pendingCases: true,
            edit: true,
            reopen: true,
            delete: true,
            merge: true,
            caseExist: true,
            hideRow: true,
            unhideRow: true
        }
        // Location Array of objects
        let locationArray = [
            {name: "ahs", displayName: "UCLA Campus", display: true},
            {name: "cdrew", displayName: "CDU", display: false},
            {name: "cdumlk", displayName: "CDU/MLK", display: false},
            {name: "cedarsSinai", displayName: "CSMC", display: false},
            {name: "doheny", displayName: "Doheny", display: false},
            {name: "harborUCLA", displayName: "HUCLA", display: false},
            {name: "kaiser", displayName: "Kaiser", display: false},
            {name: "kern", displayName: "Kern", display: false},
            {name: "oic", displayName: "OIC", display: false},
            {name: "oliveView", displayName: "OVMC", display: false},
            {name: "stMary", displayName: "St Mary", display: false},
            {name: "va", displayName: "VAGLAHS", display: false},
        ]
        // Find correct place to find fields
        let dataToFindField = "originalData";
        if(pageName === "Roster" || pageName === "InactiveRoster" || pageName === "Salary"){
            dataToFindField = "appointmentInfo";
        }

        // Dynamically display locations based on row data fields
        for(let each of rowData){
            for(let location of locationArray){
                let locationName = location.name;
                let rowDataObject = each[dataToFindField];
                if(pageName==="ExcellenceReviewClockSummary" || pageName === "eightYearClockSummary"){
                    rowDataObject = rowDataObject.appointmentInfo;
                }
                if(!location.display && util.isNumber(rowDataObject[locationName])){
                        location.display = true;
                }
            }
        }
        if(rowData.length>0){
            for(let each of rowData){
                // console.log(each)
                let row = {};
                
                for(let columnOption of formattedColumnOptions){
                    let columnName = columnOption.name;
                    // Check is column has a different display key
                    if(columnConfiguration[columnName].displayKey){
                        columnName = columnConfiguration[columnName].displayKey;
                    }
                    let columnDisplayName = columnOption.displayName;
                    let omittedColumn = false;
                    // // TODO: Check if column is omitted (edit, delete, withdraw, merge)
                    // for(let omittedColumn of omitUIColumns){
                    //     if(omittedColumn===columnName){
                            
                    //     }
                    // }

                    // Check is column is visible
                    if(columnOption.visible && !omittedColumn){
                        // Check to make sure not on the exception list:
                        if(exceptionList[columnName]){
                            // console.log(columnName)

                        // Specific multi location logic here:
                        }else if(columnName==="location"){
                            // IOK-1180:
                        
                            for(let location of locationArray){
                                let locationDisplayName = location.displayName;
                                let locationName = location.name;
                                let locationPercentage = "";
                                let rowDataObject = each[dataToFindField];
                                if(pageName==="ExcellenceReviewClockSummary" || pageName === "eightYearClockSummary"){
                                    rowDataObject = rowDataObject.appointmentInfo;
                                }
                                if(location.display && util.isNumber(rowDataObject[locationName])){
                                    locationPercentage = rowDataObject[locationName]+"%";
                                    row[locationDisplayName] = locationPercentage;
                                }else if(location.display){
                                    row[locationDisplayName] = locationPercentage;
                                }
                            }
                        }else{
                            let columnValue = each[columnName];
                            // IOK-1399 Asked for single-double quotes to be double-double quotes
                            if(typeof columnValue === "string"){
                                columnValue = columnValue.replace(/"/g, '""')
                            }
                            row[columnDisplayName] = columnValue;
                        }
                    }else{
                        // console.log(columnOption)
                    }
                }
                exportData.push(row);
            }
        }else{
            // Also in Descriptions.js 'exportDataDefaultMessage'
            exportData = "There is no data available for export. Please check your datatable settings and try again.";
        }
        // console.log(exportData)
        this.dataTableConfiguration.exportData = exportData;
    
        return exportData;
    }

}
