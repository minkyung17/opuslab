import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from "react-csv";

//My imports
import DataTableComponent from './DataTableBase.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import BulkActions from '../../../opus-logic/datatables/classes/BulkActions';

/******************************************************************************
 *
 * @desc - Handles Bulk Actions via dataTableConfiguration file
 *
 ******************************************************************************/
export default class BulkActionsTableComponent extends DataTableComponent {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
  static propTypes = {
    initialCount: PropTypes.number
  }

  static defaultProps = {
    initialCount: 0
  }

  defaultViewConfigName = 'bulkActions'; //Matches name in AllConstants.js
  tableClassName = 'bulkActions';
  modalId = 'bulk-actions-modal';

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new BulkActions(this.props);
  exportToExcel = true;
  selectedRows = {};

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Datatable
   *
   **/
  constructor(props = {}) {
    super(props);
    this.setUpPage();
  }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
  setUpPage() {
    super.setUpPage();
    let {dataTableConfiguration} = this.Logic;
    this.attachOnClickForCheckboxColumn(dataTableConfiguration);

    //NOTE: this is needed if using the alternate method of getting isChecked
    //this.attachCheckedForRow(dataTableConfiguration);
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    selectedRowIndexes: [],
    resetNumber: 0
  };

  /**
   *
   * @desc - Overriding this function from the superclass so that
   * we can attach uiProps to each row in rowData
   * @return {Promise} - Server data
   *
   **/
  async getFormattedRowDataInfo() {
    let {rowData, maxRowCount, sortingTextOrder, originalRowData}
      = await super.getFormattedRowDataInfo(true);

    rowData = this.attachUiProps(rowData);
    return {rowData, maxRowCount, sortingTextOrder, originalRowData};
  }

  /**
   *
   * @desc - Loop through each row in rowData and attach uiProps
   * @param {Object} rowData - rowData for the table
   * @return {Object} rowData - updated rowData
   *
   **/
  attachUiProps = (rowData) => {
    rowData.map(row => {
      row.uiProps = {checked: false};
    });
    return rowData;
  }

  /**
   *
   * @desc - Attach onclicks for the checkbox column
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
  attachOnClickForCheckboxColumn(dataTableConfiguration) {
    if(dataTableConfiguration.columnConfiguration.checkbox) {
      dataTableConfiguration.columnConfiguration.checkbox.onClick =
        this.setSelectedRowData;
    }
  }

  /**
   *
   * @desc - Click event that handles exporting the page data to csv
   * @returns {void}
   *
   **/
  exportSelectedRows = async (selectedRows) => {
    //Disable export button
    this.setState({disableExportButtons: true});
    console.log(this.state.selectedRowIndexes);
    let failurePromise = this.Logic.exportCSV(this.state.selectedRowIndexes);

    await failurePromise;

    this.setState({failurePromise});

    //Enable export button after it came back
    this.setState({disableExportButtons: false});
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
   // TODO: PDF
   // <button className=" btn btn-sm btn-gray table-top"
   //   disabled={disableExportButtons} onClick={() => this.exportSelectedRows('pdf')} >
   //   Export Selected Rows To PDF
   // </button>

  getButtonRow() {
    let {state: {dataTableConfiguration, sortingTextOrder, disableExportButtons, loading}} = this;
    let exportData = this.Logic.dataTableConfiguration.exportData;
    return (
      <div className=" button-row ">

        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <button className=" btn btn-sm btn-gray table-top"
          onClick={this.resetTable}>
          Reset Table
        </button>

        <CSVLink data={exportData}
          filename={dataTableConfiguration.excelFileName}
          className=" btn btn-sm btn-gray table-top export-to-excel pull-right black "
          target="_blank"
          asyncOnClick={true}
          onClick={() => this.getExportData()}>
          {loading ? 'Downloading...' : 'Export To Excel'}
        </CSVLink>

        <div className=" sorting-text ">{sortingTextOrder}</div>

      </div>
    );
  }

  /**
   *
   * @desc - onclick function that calls another function to process the data
   * @param {Object} evt - the event object
   * @returns {void}
   *
   **/
  setSelectedRowData = (evt, {rowData, rowIndex} = {}) => {
    this.updateSelectedRowList(rowData, rowIndex, evt.target.checked);
  }

  /**
   *
   * @desc - Updates select all checkbox
   * @param {Object} evt - the event object
   * @returns {void}
   *
   **/
  onToggleSelectAll = (evt) => {
    let dataTableConfiguration = this.Logic.updateSelectAllInDataTableConfig();
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
    this.updateSelectedRowListForSelectAll([], evt.target.checked);
  }

  /**
  *
  * @desc - Updates the list holding the selected rows appointmentId's
  * for single rows
  * @param {Object} rowData - individual rowData
  * @param {Integer} rowIndex - index of row
  * @param {Boolean} isChecked - flag indicating if the row is checked or not
  * @return {void} -
  *
  **/
  updateSelectedRowList = (rowData, rowIndex, isChecked) => {
    let {appointmentId} = rowData.originalData;
    let {selectedRowIndexes} = this.state;
    console.log(rowData);
    if (isChecked) {
      console.log('ADDED - Name: ' + rowData.fullName, '.  Appointment ID: ' + appointmentId);
      console.log('Table Modal - Selected Row List: ', this.selectedRows);
      this.selectedRows[appointmentId] = isChecked;
      selectedRowIndexes.push(appointmentId);
    }
    else {
      console.log('REMOVED - Name: ' + rowData.fullName, '.  Appointment ID: ' + appointmentId);
      console.log('Table Modal - Selected Row List: ', this.selectedRows);
      delete this.selectedRows[appointmentId];
      let index = selectedRowIndexes.indexOf(appointmentId);

      if (index > -1) {
         selectedRowIndexes.splice(index, 1);
      }
    }
    this.updateUiRowStatus(rowIndex, isChecked);
    this.updateButtons(this.selectedRows);
    this.setState({selectedRowIndexes});
  }


  /**
  *
  * @desc - Updates the list holding the selected rows appointmentId's
  * for the select all
  * @param {Boolean} isChecked - flag indicating if the row is checked or not
  * @return {void} -
  *
  **/
  updateSelectedRowListForSelectAll = (localRowData, isChecked) => {
    let {rowData, selectedRowIndexes} = this.state;
    if(localRowData.length>0){
      rowData = localRowData;
    }
    if (isChecked) {
      rowData.map(row => {
        let {appointmentId} = row.originalData;
        this.selectedRows[appointmentId] = isChecked;
        selectedRowIndexes.push(appointmentId);
      });
    }
    else {
      this.selectedRows = {};
      selectedRowIndexes = [];
    }
    this.updateUiRowStatusForSelectAll(rowData, isChecked);
    this.updateButtons(this.selectedRows);
    this.setState({selectedRowIndexes});
  }

  /**
  *
  * @desc - Updates the uiProps' checked value for single rows.  This allows
  * for showing the checkmark in the UI.
  * @param {Integer} rowIndex - index of row
  * @param {Boolean} isChecked - flag indicating if the row is checked or not
  * @return {void} -
  *
  **/
  updateUiRowStatus(rowIndex, isChecked) {
    let {rowData} = this.state;
    rowData[rowIndex].uiProps.checked = isChecked;
  }

  /**
  *
  * @desc - Updates the uiProps' checked value for the select all.  This allows
  * for showing the checkmark in the UI.
  * @param {Boolean} isChecked - flag indicating if the row is checked or not
  * @return {void} -
  *
  **/
  updateUiRowStatusForSelectAll(rowData, isChecked) {
    rowData.map(row => {
      row.uiProps.checked = isChecked;
    });
    this.setState({rowData});
  }

  /**
   *
   * @desc - this function calls the function defined in the superclass and
   * passes it the selectedRows list
   * @param {Object} selectedRows - the selected rows object
   * @returns {void}
   *
   **/
  updateButtons = (selectedRows) => {
    this.props.updateNextButton(selectedRows);
  }

  /**
   *
   * @desc - Resets parameters
   * @returns {void}
   *
   **/
  resetTable = () => {
    //Note: the super call was not working, so had to copy over the function here
    //super.resetTable();

    let {resetNumber} = this.state;

    //Get starting configuration
    let dataTableConfiguration = this.Logic.resetDataTableConfiguration();

    //Filter rowData
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
    let localRowData = this.Logic.filterAPITableData();

    //Get original columns
    let formattedColumnOptions = this.getBootStrapModalOptions();

    //Reattach onClick for each checkbox
    this.attachOnClickForCheckboxColumn(dataTableConfiguration);

    //Now reset everything
    this.setState({dataTableConfiguration, formattedColumnOptions,
      resetNumber: ++resetNumber});

    //Update the selectedRowList, row status, and buttons
    this.updateSelectedRowListForSelectAll(localRowData, false);
  }

  //NOTE: This is an alternate way to do this - attaching a getCheckedState
  //function to each checkbox, and returning a boolean to DataTableCells which
  //indicates the value of isChecked based upon if the appointmentId for the
  //row is stored in the selected rows list.

  // attachCheckedForRow(dataTableConfiguration) {
  //   if(dataTableConfiguration.columnConfiguration.checkbox) {
  //     dataTableConfiguration.columnConfiguration.checkbox.getCheckedState =
  //       this.getCheckedState;
  //   }
  // }

  // getCheckedState = (rowData, rowIndex) => {
  //   return (rowData.appointmentInfo.appointmentId in this.selectedRows);
  // }
}
