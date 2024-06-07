/**
 * Created by leonaburime on 6/29/16.
 **/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table/dist/fixed-data-table.css';

//My files
import DataTableColumnHeader from './DataTableColumnHeader.jsx';
import DataTableColumns from './DataTableColumns.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import {tableOptions, defaultFixedDataTableState} from '../constants/DatatableConstants';

//TODO: SHould not have variables that are not attached to this.state
// or this.props because this is a generic table that should only render
// data given not take care of defaults in any type of way


/*******************************************************************************
 *
 * FixedDataTable()
 * @desc - React FixedDataTable
 *
 ******************************************************************************/
export default class FixedDataTableComponent extends React.Component {

  /**
   *
   * @desc - types of props
   *
   **/
  static propTypes = {
    rowData: PropTypes.array.isRequired,
    maxRowCount: PropTypes.number.isRequired,
    tableConfiguration: PropTypes.object.isRequired,
    dataTableConfiguration: PropTypes.object.isRequired,
    minimizeTable: PropTypes.bool,
    //how many times Datatable has been created and destroyed
    resetNumber: PropTypes.number.isRequired,
    table_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClickSort: PropTypes.func.isRequired,
    onSearchTextFilter: PropTypes.func.isRequired,
    onMultiSelectClick: PropTypes.func.isRequired,
    onToggleSelectAll: PropTypes.func
  }

  /**
   *
   * @desc - props will take on these values if not defined
   *
   **/
  static defaultProps = {
    rowData: [],
    maxRowCount: 0,
    resetNumber: 0,
    table_number: '',
    tableConfiguration: {},
    dataTableConfiguration: {}
  };


  /**
   *
   * @desc -
   * @param {Object} props - initial data
   *
   **/
  constructor(props = {}) {
    super(props);
    this.setClassVariables();
  }

  /**
   *
   * @desc - Instance variables of this class
   *
   **/
  state = {
    rowData: [],
    columnConfiguration: [],
    ...defaultFixedDataTableState
  };


  /**
   *
   * @desc()
   * @returns {void}
   *
   **/
  componentWillMount() {}

  /**
   *
   * @desc -
   * @return {void}
   *
   **/
  componentDidMount() {
    this.setDomContainer();
    window.addEventListener('resize', this.handleResize);
    //Set initial size
    this.handleResize();
  }

  /**
   *
   * @desc - Lifecycle hook when recieving newProps
   * @param {Object} rowData - row data
   * @return {void}
   *
   **/
  componentWillReceiveProps({rowData} = {}) {
    //Check if more results in new results vs old results
    let rowDataLengthChanged = this.rowDataLengthChanged(rowData);

    this.setState({rowData}, (...args) => {
      //After setting the new rowData resize the table
      if(rowDataLengthChanged) {
        this.handleResize();
      }
      this.computeScrollCalculations(args);
    });
  }

  /**
  *
  * @desc
  * @return {void}
  *
  **/
  componentDidUpdate() {
    util.initJQueryBootStrapToolTipandPopover();
  }

  /**
   *
   * @desc -
   * @return {void}
   *
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   *
   * @desc - Class Variables
   *
   *
   **/
  DataTableColumns = new DataTableColumns();
  DataTableColumnHeader = new DataTableColumnHeader();


  /**
   *
   * @desc - For dynamic width and height lets set the dom element
   *      that the data table is wrapped in. Dependent on jquery
   * @return {void}
   *
   **/
  setDomContainer() {
    this.domContainer = $(ReactDOM.findDOMNode(this)).parent();
  }

  /**
   *
   * @desc - Simply setting up and binding class functions and variables
   * @return {void}
   *
   */
  setClassVariables() {
    //Functions for scrolling datatable operations
    this.onContentHeightChange = () => this.computeScrollCalculations();
    this.onScrollEnd = (horizontal_start, vertical_start) =>
      this.computeScrollCalculations({vertStart: vertical_start});
  }

  /**
   *
   * @desc - Have we got new rowData of a different length
   * @param {Array} rowData - rowData in the table
   * @return {Bool} - if its a different length or not
   *
   */
  rowDataLengthChanged(rowData = []) {
    return rowData.length !== this.props.rowData.length;
  }

  /**
   *
   * @desc - Get minimal height of table
   * @param {Array} rowData - rowData in the table
   * @param {Object} tableConfig - table configuration
   * @return {Number} - minimal table height
   *
   */
  getMinimalTableHeight(rowData = this.props.rowData, tableConfig = this.props.tableConfiguration) {
    let {headerHeight, rowHeight} = tableConfig;
    return headerHeight + rowHeight * Math.max(rowData.length, 1) + 35;
  }

  /**
   * @desc - Resizes the table to fit the screen
   * @param {Object} event - variable that encapsulates window resize event
   * @return {void}
   */
  handleResize = () => {
    let {state: { widthPixelDiff, heightPixelDiff}, props} = this;
    let {minimum_datatable_height} = tableOptions;
    let dynamicTableWidth = this.domContainer.outerWidth() - widthPixelDiff;
    let {minimizeTable, tableConfiguration: {page_table_height_offset = 0} = {}} = props;
    let dynamicTableHeight = window.innerHeight - heightPixelDiff - page_table_height_offset;

    //Minimum height the table needs to be
    dynamicTableHeight = Math.max(dynamicTableHeight, minimum_datatable_height);

    if(minimizeTable) {
      dynamicTableHeight = this.getMinimalTableHeight();
    }

    //Force state change
    this.setState({dynamicTableWidth, dynamicTableHeight}, this.computeScrollCalculations);
  }

  /**
   *
   * @desc - Calculates the rows which we are currently seeing
   * @param {Object} config -
   * @return {void}
   *
   **/
  computeScrollCalculations({vertStart} = {}) {
    let {state: {lastVerticalScrollPosition, dynamicTableHeight, tableConfiguration},
      props: {rowData}} = this;

    //Number of current filtered and unfiltered results
    let rowCount = rowData.length;

    //If there is no current vertical position lets set it to the last
    //vertical position we had or zero
    let vertical_scroll_position = vertStart !== undefined ? vertStart :
      (lastVerticalScrollPosition || 0);
    //Starting from index 1 not 0
    const base_start_index = 1;

    //Table Size Variables
    const header_height = tableConfiguration.headerHeight;//Height of header row
    const each_row_height = tableConfiguration.rowHeight;
    let all_rows_height = dynamicTableHeight - header_height;

    //Calculations for table rows irrespective of result count
    let start_row = Math.floor(vertical_scroll_position / each_row_height) + base_start_index;
    let finish_row = start_row + Math.ceil(all_rows_height / each_row_height) - base_start_index;
    finish_row = Math.min(finish_row, rowCount);//Should not go past # of results

    //outsizedTable -> Dont have enough rows to fill the table
    let outsizedTable = (finish_row - base_start_index) > rowCount ? true : false;
    //Calculations for table rows dependent on result count
    let begin_row_index = outsizedTable ? base_start_index : start_row;
    let end_row_index = outsizedTable ? rowCount : finish_row;

    //If I get caught scrolling when they refilter
    if(begin_row_index > end_row_index) {
      begin_row_index = end_row_index - Math.ceil(all_rows_height / each_row_height);
      begin_row_index = Math.max(begin_row_index, 0);
    }

    //No results so nothing begin and ending row
    if(rowCount === 0) {
      begin_row_index = end_row_index = 0;
    }

    this.setState({
      lastVerticalScrollPosition: vertical_scroll_position,
      scrollRowStart: begin_row_index,
      scrollRowFinish: end_row_index,
      wasTableScrolled: true
    });
  }

  /**
   *
   * @desc - Displays the appropriate text for which rows we are seeing
   * @param {String} count - number of current results in table
   * @return {String} - text to be displayed
   *
   */
  getScrollCalculationText(count) {
    let {state: {wasDataFiltered, wasTableScrolled, scrollRowFinish,
      scrollRowStart}, props: {maxRowCount}} = this;

    let text = `Showing ${scrollRowStart} to ${scrollRowFinish} of ${count} records`;

    //If filtered results attach '(filtered from ...'
    if(count !== maxRowCount) {
      text += ` (filtered from ${maxRowCount} total records)`;
    }

    return (wasDataFiltered || wasTableScrolled ? text : null);
  }

  /**
   *
   * @desc - Gets the header for each column
   * @param {String} columnConfig -
   * @param {String} data - data
   * @return {JSX} - ColumnHeader
   *
   */
  getHeader(columnConfig = {}, data = {}) {
    return this.DataTableColumnHeader.getHeader(columnConfig, data);
  }

  /**
   *
   * @desc - Gets each datatable cell
   * @param {String} columnConfig -
   * @param {Array} rowData - each row
   * @param {String} name - name of column
   * @return {JSX} - Cells
   *
   */
  getCellContents(columnConfig, rowData, name) {
    return this.DataTableColumns.getCellContents(columnConfig, rowData, name);
  }

  /**
   *
   * @desc - Each total columns complete with header contents and whole column
   * @param {Object} columnConfig -
   * @param {Array} data -
   * @return {JSX} - Array of visible columns
   *
   */
  getColumn(columnConfig = {}, data = {}) {
    let {rowData} = data;
    let {name, fixed, width} = columnConfig;
    let headerJSX = this.getHeader(columnConfig, data);
    let cellContent = this.getCellContents(columnConfig, rowData, name);
    return (<Column key={`column-${name}`} {...{fixed, width, flexGrow: 1}}
      cell={cellContent} header={headerJSX} />);
  }

  /**
   *
   * @desc - Gets names of visible columns
   * @param {String} columnKeys -
   * @param {Array} columnConfiguration - each row
   * @return {Array} - Array of visible columns
   *
   */
  getVisibleColumnsKeys(columnKeys = [], columnConfiguration = {}) {
    return columnKeys.filter(name => columnConfiguration[name].visible);
  }

  /**
   *
   * @desc - Gets all columns
   * @param {Object} - configuration for the columns
   * @return {Array} - Array of jsx columns
   *
   */
  getAllColumns({columnKeys = [], columnViewConfiguration, columnConfiguration,
    rowData, columnSortOrder, columnStringMatch, columnValueOptions, ...options} = {}) {
    //Filter only visible columns
    let visibleColumnKeys = this.getVisibleColumnsKeys(columnKeys, columnConfiguration);

    let columns = visibleColumnKeys.map(columnName => {
      //Get the config data for each column
      let columnConfig = columnConfiguration[columnName];

      //Get the view data for each column
      let columnViewData = columnViewConfiguration[columnName];

      //Get each column with all args
      return this.getColumn(columnConfig, {rowData, columnViewData, columnSortOrder,
        columnStringMatch, columnValueOptions, ...options});
    });

    return columns;
  }

  /**
   *
   * @desc - renders table with columns
   * @return {JSX} - FixedDataTableComponent jsx
   *
   **/
  render() {
    //Return prop results or filtered results
    let {onContentHeightChange, onScrollEnd, props: {rowData, tableConfiguration,
      dataTableConfiguration, onClickSort, onSearchTextFilter, onMultiSelectClick,
      onToggleSelectAll, resetNumber}, state: {dynamicTableWidth: width,
      dynamicTableHeight: height}} = this;

    //Extract datatable information
    let {sortOrder, columnConfiguration, columnViewConfiguration, columnKeys,
      dataColumnFilters: {columnSortOrder, columnStringMatch, columnValueOptions}
      = {}} = dataTableConfiguration;
    let {rowHeight, headerHeight} = tableConfiguration;
    let rowsCount = rowData.length;

    //Get each column
    // let columns = this.DataTableColumns.getColumns({rowData, sortOrder,
    //   onMultiSelectClick, columnConfiguration, onClickSort, onSearchTextFilter,
    //   onToggleSelectAll, columnViewConfiguration, columnKeys, columnSortOrder,
    //   columnStringMatch, columnValueOptions, resetNumber, ...this.props});


    let columns = this.getAllColumns({rowData, sortOrder, onMultiSelectClick,
      columnConfiguration, onClickSort, onSearchTextFilter, onToggleSelectAll,
      columnViewConfiguration, columnKeys, columnSortOrder, columnStringMatch,
      columnValueOptions, resetNumber, ...this.props});


    return (
      <div className=" datatable_root ">
        <Table ref="datatable" touchScrollEnabled {...{rowHeight, headerHeight,
          width, height, onScrollEnd, onContentHeightChange, rowsCount}}>
          {columns}
        </Table>
        <p className=" results_legend ">
          {this.getScrollCalculationText(rowsCount)}
        </p>
      </div>);
  }
}
