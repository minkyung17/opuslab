import * as util from '../../common/helpers/';


/*******************************************************************************
 *
 * FixedDataTable()
 * @desc - Logic Class dealing w/ sorting & all non-view layer responsibilities
 *
 ******************************************************************************/
export default class FixedDataTable {

  /**
   *
   * @desc - Set of filters for each instance
   *
   **/
  simpleFilters = {}
  sortColumnArray = []
  sortDirectionArray = []
  sortColumnDirection = {}
  columnStringMatchFilters = {}
  columnSelectOptionFilters = {}


  /**
   *
   * @desc -
   *
   **/
  constructor() {}

  /**
   * getUniqueKey()
   *
   * @desc
   * @param prefix
   * @returns {String}
   */
  // getUniqueID() {
  //   return util.getUniqueId();
  // }

  /**
   * getUniqueKey()
   *
   * @desc
   * @param prefix
   * @returns {String}
   */
  // getUniqueKey(prefix ='fdtable'){
  //   return util.getUniqueId(prefix);
  // }


  /**
   *
   * @desc - resets the Table to original results without filters
   * @return {void}
   *
   **/
  resetDatatableFilters() {
    let filters = {
      sortColumnDirection: {},
      columnStringMatchFilters: {},
      columnSelectOptionFilters: {},
      simpleFilters: {},
      sortColumnArray: [],
      sortDirectionArray: []
    };
    for(let name in filters) {
      this[name] = filters[name];
    }
  }

  /**
   *
   * @desc - After all the parameters for sorting and searching have been saved
   *    this runs the sorting and searching filters
   * @param {Object} params -
   * @return {Array} formattedRowData -
   *
   */
  runFilterQueue(params = {}) {
    let {destructureObjectIntoKeyValueArrays, filterCollectionByObjectBoolean,
      filterCollectionByObject, stringMatchCollectionByObject, orderByObjectArray}
      = util;

    //Lets copy the data
    let formattedRowData = [...this.props.rowData];
    let columnStringMatchFilters = this.currentTableFilters.columnStringMatch;
    //TODO switch .state to currentTableFilters...could this be a problem later on?
    let columnSelectOptionFilters = {...this.state.columnSelectOptionFilters,
          ...params.columnSelectOptionFilters};
    //Simple key value pairs
    let simpleFilters = {...params.simpleFilters};
    let simpleFiltersKeep = params.simpleFiltersKeep || this.simpleFiltersKeep || {};
    //let debounceInputFullTableSearchValue = this.refs.fullSearchInput.state.value;
    let specialFilterFunc = params.specialFilterFunc || this.specialFilterFunc;
    let specialFilters = params.specialFilters || this.specialFilters;

    //Destructure arrays for multi-column sorting i.e. sort_columns =
    //['name', 'departmentName'] and sort_directions = ['asc','desc']
    let sortColumnDirection = {...this.currentTableFilters.sortColumnDirection,
        ...params.sortColumnDirection};
    let [sortColumns, sortDirection] =
        destructureObjectIntoKeyValueArrays(sortColumnDirection);

    //SELECT OPTIONS - If there are valid keys lets filter the data
    if(Object.keys(columnSelectOptionFilters).length > 0) {
      //Get filtered values
      formattedRowData = filterCollectionByObjectBoolean(formattedRowData,
          columnSelectOptionFilters);
    }

    //SIMPLE FILTERS - If there are simple 'true,false' or key-value filters
    if(Object.keys(simpleFilters).length > 0) {
      //Get filtered values
      formattedRowData = filterCollectionByObject(formattedRowData, simpleFilters);
    }

    //SIMPLE FILTERS - If there are simple 'true,false' or key-value filters
    if(Object.keys(simpleFiltersKeep).length > 0) {
      this.simpleFiltersKeep = simpleFiltersKeep;
      formattedRowData = filterCollectionByObject(formattedRowData, simpleFiltersKeep);
    }

    //STRING TEXT OPTIONS - If there are valid keys lets filter the data
    if(Object.keys(columnStringMatchFilters).length > 0) {
      //Get filtered values
      formattedRowData = stringMatchCollectionByObject(formattedRowData,
        columnStringMatchFilters);
    }

    //If I want to use a non-standard filter
    if(specialFilterFunc && specialFilters) {
      this.specialFilterFunc = specialFilterFunc;
      this.specialFilters = specialFilters;
      formattedRowData = specialFilterFunc(formattedRowData, specialFilters);
    }

    //SORT OPTIONS - If there are options to sort
    if(sortColumns && sortColumns.length > 0) {
      console.log(sortColumns, sortDirection);
      formattedRowData = orderByObjectArray(formattedRowData,
        sortColumns, sortDirection);
    }

    console.log(columnSelectOptionFilters, columnStringMatchFilters);
  }

  /**
   *
   * @desc - Calculates the rows which we are currently seeing
   * @param config -
   * @return {Object}
   *
   **/
  computeScrollCalculations({lastVerticalScrollPosition, formattedRowData, rowHeight,
    headerHeight, dynamicTableHeight, vert_start, num_of_results: result_count} = {}) {
    //Starting from index 1 not 0
    let base_start_index = 1;
    //let {vert_start, num_of_results:result_count} = config;
    //Number of current filtered and unfiltered results
    let num_of_results = result_count !== undefined ? result_count : formattedRowData.length;
    //If no current vertical position set to last vertical position or zero
    let vertical_scroll_position = vert_start !== undefined ? vert_start :
      (lastVerticalScrollPosition || 0);

    //Table Size Variables
    //let {headerHeight, rowHeight} = tableConfiguration;
    let all_rows_height = dynamicTableHeight - headerHeight;

    //Calculations for table rows irrespective of result count
    let start_row = Math.floor(vertical_scroll_position / rowHeight) + base_start_index;
    let finish_row = start_row + Math.ceil(all_rows_height / rowHeight) - base_start_index;
    finish_row = Math.min(finish_row, num_of_results);//Should not go past # of results

    //outsizedTable -> Dont have enough rows to fill the table
    let outsizedTable = (finish_row - base_start_index) > num_of_results;
    //Calculations for table rows dependent on result count
    let begin_row_index = outsizedTable ? base_start_index : start_row;
    let end_row_index = outsizedTable ? num_of_results : finish_row;

    //If I get caught scrolling when they refilter
    if(begin_row_index > end_row_index) {
      begin_row_index = end_row_index - Math.ceil(all_rows_height / rowHeight);
      begin_row_index = Math.max(begin_row_index, 0);
    }

    //No results so nothing begin and ending row
    if(num_of_results === 0) {
      begin_row_index = end_row_index = 0;
    }

    return {
      lastVerticalScrollPosition: vertical_scroll_position,
      scrollRowStart: begin_row_index,
      scrollRowFinish: end_row_index,
      wasTableScrolled: true
    };
  }

  /**
   *
   * @desc - Tells the user what we are sorting by
   * @param {Array} columnNames - names of columns being used to sort
   * @param {Object} columnNameToInfo - name to column information
   * @return {String} sorting_text
   *
   **/
  renderSortingText(columnNames = [], columnNameToInfo = {}, {
    display_name_key = 'displayName'} = {}) {
    let sorting_text = '';

    if(columnNames.length) {
      let sortOrder = columnNames.map((name, index) =>
        `${index + 1}. ${columnNameToInfo[name][display_name_key]} `);
      sorting_text = `Sorting by ${sortOrder.join()}`;
    }

    return sorting_text;
  }


}
