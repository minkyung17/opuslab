import React from 'react';
import PropTypes from 'prop-types';

//My imports
import DataTableComponent from './DataTableBase.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import AcademicHistory from '../../../opus-logic/datatables/classes/AcademicHistory';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

/******************************************************************************
 *
 * @desc - Handles Active Cases and Completed Cases based on
 *    dataTableConfiguration file
 *
 ******************************************************************************/
export default class AcademicHistoryTableComponent extends DataTableComponent {

  static propTypes = {
    config_name: PropTypes.string,
    initialCount: PropTypes.number
  }
  static defaultProps = {
    config_name: 'academicHistory',
    initialCount: 0
  }

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new AcademicHistory(this.props);
  exportToExcel = false;
  pageTitle = 'Academic History';

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Datatable
   *
   **/
  constructor(props = {}) {
    super(props);
    this.setUpPage(props);
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
    selectedRows: [],
    resetNumber: 0,
    disableExportButtons: true
  };

  setUpPage({opusPersonId} = {}) {
    super.setUpPage();
    let {dataTableConfiguration} = this.Logic;
    this.attachOnClickForCheckboxColumn(dataTableConfiguration);
    this.Logic.setClassData({opusPersonId});
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
  * @desc - Updates the list holding the selected rows appointmentId's
  * for single rows
  * @param {Object} rowData - individual rowData
  * @param {Integer} rowIndex - index of row
  * @param {Boolean} isChecked - flag indicating if the row is checked or not
  * @return {void} -
  *
  **/
  updateSelectedRowList = (rowData, rowIndex, isChecked) => {
    let actionId = rowData.actionId;
    let {selectedRowIndexes, selectedRows} = this.state;
    if (isChecked) {
      selectedRowIndexes.push(actionId)
      selectedRows.push(rowData);
    }
    else {
      let index = selectedRowIndexes.indexOf(actionId);

      if (index > -1) {
         selectedRowIndexes.splice(index, 1);
         selectedRows.splice(index, 1);
      }
    }
    let disableExportButtons = false;
    if(selectedRowIndexes.length===0){
      disableExportButtons = true;
    }
    this.updateUiRowStatus(rowIndex, isChecked);
    this.setState({selectedRowIndexes, selectedRows, disableExportButtons})
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
   * @desc - Updates select all checkbox
   * @param {Object} evt - the event object
   * @returns {void}
   *
   **/
  onToggleSelectAll = (evt) => {
    this.updateSelectedRowListForSelectAll(evt.target.checked);
  }

  /**
  *
  * @desc - Updates the list holding the selected rows appointmentId's
  * for the select all
  * @param {Boolean} isChecked - flag indicating if the row is checked or not
  * @return {void} -
  *
  **/
  updateSelectedRowListForSelectAll = (isChecked, incomingRowData) => {
    let {rowData, selectedRowIndexes, selectedRows} = this.state;
    if(incomingRowData){
      rowData = incomingRowData;
    }

    let disableExportButtons = true;
    if (isChecked) {
      rowData.map(row => {
        let actionId = row.actionId;
        selectedRowIndexes.push(actionId);
        selectedRows.push(row);
      });
      disableExportButtons = false;
    }
    else {
      selectedRowIndexes = [];
      selectedRows = [];
    }

    this.updateUiRowStatusForSelectAll(rowData, isChecked);
    this.setState({selectedRowIndexes, selectedRows, disableExportButtons});
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
   * @desc - Resets parameters
   * @returns {void}
   *
   **/
  resetTable = () => {
    //Extract reset number to iterate after reset
    let {resetNumber} = this.state;

    //Get starting configuration
    let dataTableConfiguration = this.Logic.resetDataTableConfiguration();

    //Filter rowData
    let rowData = this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);

    //Get original columns
    let formattedColumnOptions = this.getBootStrapModalOptions();

    //Reattach onClick for each checkbox
    this.attachOnClickForCheckboxColumn(dataTableConfiguration);

    //Now reset everything
    this.setState({dataTableConfiguration, formattedColumnOptions,
      resetNumber: ++resetNumber});

    //Update the selectedRowList, row status, and buttons
    this.updateSelectedRowListForSelectAll(false, rowData)
  }

  /**
   *
   * @desc - Click event that handles exporting the page data to csv
   * @returns {void}
   *
   **/
  exportSelectedRows = async (typeOfReq) => {
    //Disable export button
    this.setState({disableExportButtons: true});

    if(typeOfReq==='excel'){
      let failurePromise = this.Logic.exportCSV(typeOfReq, this.state.selectedRowIndexes, this.props.profileAPIData.appointeeInfo.fullName);

      await failurePromise;

      this.setState({failurePromise});
    }else{
      this.Logic.exportPDF(this.state.selectedRows, this.props.profileAPIData.appointeeInfo);
    }

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
    let {state: {sortingTextOrder, disableExportButtons}} = this;

    return (
      <div className=" button-row ">

        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <button className=" btn btn-sm btn-gray table-top"
          onClick={this.resetTable}>
          Reset Table
        </button>

        <button className=" btn btn-sm btn-gray table-top export-to-excel pull-right"
          disabled={disableExportButtons} onClick={() => this.exportSelectedRows('excel')} >
          Export Selected Rows To Excel
        </button>

        <div className=" sorting-text ">{sortingTextOrder}</div>

      </div>
    );
  }

  /**
   *
   * @desc - Renders the datatable and button suite
   * @returns {void}
   *
   **/
  render() {
    if(!this.state.isPageViewable) {
      return null;
    }
    let buttonRow = this.getButtonRow();
    let changeColumnsModal = this.getChangeColumnsModal();
    let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, tableClassName, resetTable,
    onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort} = this;

    return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p>
          Only actions effective 7/1/18 and beyond are visible to schools and departments as this is when
          most schools were fully utilizing Opus and Interfolio.
          Clicking on the action will link to the Case Summary page. Some actions (e.g. corrections to the Profile)
          do not have a Case Summary in Opus and so will not have a link.
        </p>
        <p className=" error_message "> {error_message} </p>
        {buttonRow}
        {changeColumnsModal}
        {this.getAPIResponseModal()}

        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, maxRowCount, tableConfiguration, resetTable,
            dataTableConfiguration, tableClassName, onMultiSelectClick, onClickSort,
            onToggleSelectAll, onSearchTextFilter}} />
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
