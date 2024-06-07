import {keys} from 'lodash';

import * as util from '../../../opus-logic/common/helpers/';


/******************************************************************************
 *
 * @desc - Class that takes care of all the operations to manipulate
 *  and transform dataTableConfiguration
 *
 ******************************************************************************/
export default class TableDataOps {

  rowData = null;
  originalRowData = null;

  /**
   *
   * @desc - Set datatable
   * @param {Object} rowData - datatable to use
   *
   **/
  constructor(rowData) {
    if(rowData) {
      this.setRowData(rowData);
    }else {
      console.error(`Please use "setRowData" to set rowData`);
    }
  }

  /**
   *
   * @desc - Set rowData
   * @param {Object} rowData - rowData to use
   *
   **/
  setRowData(rowData) {
    this.rowData = rowData;
    this.originalRowData = util.cloneObject(rowData);
  }

  /**
   *
   * @desc - Clones startingRowData and resets this classes rowData
   * @return {Array} this.rowData - new cloned rowData
   *
   **/
  resetRowData() {
    this.rowData = util.cloneObject(this.originalRowData);
    return this.rowData;
  }


  /**
   *
   * @desc - Filters data using saved filters in dataTableConfiguration
   * @param {Array} rowData - array of row data results from server
   * @param {Object} dataTableConfiguration -
   * @return {Object} filteredRowData - filtered
   *
   **/
  filterAPITableDataFromDataTableConfig(dataTableConfiguration, visibleFilters = {},
    rowData = this.rowData) {
    let filteredRowData = rowData;
    let {visibleColumnValueOptions, visibleColumnStringMatch,
      visibleColumnSortOrder, simpleFilters} = visibleFilters;
    console.log('Current Filters -> ', dataTableConfiguration.dataColumnFilters);

    //SELECT OPTIONS - If there are valid keys lets filter the data
    if(keys(visibleColumnValueOptions).length > 0) {
      //Get filtered values
      filteredRowData = util.filterCollectionByObjectBoolean(filteredRowData,
        visibleColumnValueOptions);
    }

    //SIMPLE FILTERS - If there are simple 'true,false' or key-value filters
    if(Object.keys(simpleFilters).length > 0) {
      //Get filtered values
      filteredRowData = util.filterCollectionByObject(filteredRowData, simpleFilters);
    }

    //SIMPLE FILTERS - If there are simple 'true,false' or key-value filters
    // if(keys(simpleFiltersKeep).length > 0){
    //   this.simpleFiltersKeep = simpleFiltersKeep;
    //   filteredRowData = util.filterCollectionByObject(filteredRowData, simpleFiltersKeep);
    // }

    //STRING TEXT OPTIONS - If there are valid keys lets filter the data
    if(keys(visibleColumnStringMatch).length > 0) {
      //Get filtered values
      filteredRowData = util.stringMatchCollectionByObject(filteredRowData,
        visibleColumnStringMatch);
    }

    //SORT OPTIONS - If there are options to sort
    let [sortColumns, sortDirection] =
      util.destructureObjectIntoKeyValueArrays(visibleColumnSortOrder);
    if(sortColumns && sortColumns.length > 0) {
      filteredRowData = util.orderByObjectArray(filteredRowData,
        sortColumns, sortDirection);
    }

    return filteredRowData;
  }




}
