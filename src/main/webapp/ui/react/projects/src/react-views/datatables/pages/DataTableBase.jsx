import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink, CSVDownload } from "react-csv";

//My imports
//import * as util from '../../../opus-logic/common/helpers/';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import configOptions from '../constants/AllConfigConstants';
import DataTable from '../../../opus-logic/datatables/classes/DataTable';
import APIModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import {BootStrapModalCheckboxList} from
  '../../common/components/bootstrap/ModalCheckBoxes.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';


/**
 *
 * @desc - Component view of Datatable. Never instantiated though
 *
 **/
export default class DataTableComponent extends React.Component {

  static propTypes = {
    config_name: PropTypes.string.isRequired,
    resetNumber: PropTypes.number
  }

  static defaultProps = {
    resetNumber: 0
  }

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Datatable
   *
   **/
  constructor(props = {}) {
    super(props);


  }

  /**
   *
   * @desc - Instance variables
   *
   **/
  state = {
    ...this.state,
    rowData: [],
    originalRowData: [],
    maxRowCount: 0,
    resetNumber: this.props.resetNumber,
    showOnlyButtonClass: 'btn-gray',
    loading: false
  };


  /**
  *
  * @name componentWillMount
  * @desc - Right before the component is rendered. Set state has no penalty for
  *   being called here
  * @return {void}
  *
  **/
  componentWillMount() {
    this.isPageViewable();
    this.setRowDataInfo();
  }

  /**
   *
   * @desc - Instance variables
   *
   **/
  Logic = null; //Table Logic instantiation inside the view layer
  exportToExcel = true;
  name_key = DataTable.name_key;
  visible_key = DataTable.visible_key;
  display_name_key = DataTable.display_name_key;
  defaultViewConfigName = '';
  tableClassName = 'base'; //For multiple different types of tables on page
  modalId = ''; //By default, the datatable modalId is empty if it is not inside a modal


  isPageViewable() {
    let isPageViewable = this.Logic.isPageViewable();
    if(!isPageViewable) {
      window.location = '/opusWeb/ui/error/page-error.shtml';
    }
    this.setState({isPageViewable});
  }

  /**
   *
   * @desc - Abstract class not meant to be instantiated
   * @param {String} config_name - name of config passed from main page
   * @returns {void}
   *
   **/
  setViewConfigurationByConfigName(config_name = this.defaultViewConfigName) {
    let viewConfiguration = configOptions[config_name];
    let {tableConfiguration} = viewConfiguration;
    return {tableConfiguration};
  }


  /**
   *
   * @desc - get API results from server via Logic instance
   * @return {Promise} - Server data
   *
   **/
  async getFormattedRowDataInfo(shouldRefresh, comingFromReset) {
    let originalRowData = this.state.originalRowData;
    if(this.state.originalRowData.length===0 || shouldRefresh){
      originalRowData = await this.Logic.getFormattedRowDataFromServer();
    }
    let {maxRowCount} = this.Logic;
    let sortingTextOrder = this.Logic.getSortOrderText();
    let rowData = this.Logic.filterAPITableData(originalRowData);

    // I had to make an exception for Completed Cases because of the
    // the default time period filter
    let {dataTableConfiguration} = this.Logic;
    if(dataTableConfiguration.pageName==='Completed'){
      if(comingFromReset){
        rowData = this.Logic.getFilteredTimePeriodRowData('year', rowData);
      }else{
        rowData = this.Logic.getFilteredTimePeriodRowData(dataTableConfiguration.timePeriod, rowData);
      }
    }

    return {rowData, maxRowCount, sortingTextOrder, originalRowData};
  }

  /**
   *
   * @desc - Click event that handles exporting the page data to csv
   * @returns {void}
   *
   **/
  exportCSV = async (specialShowOnlyFilter) => {

    let failurePromise = this.Logic.exportCSV(specialShowOnlyFilter);

    //Disable export button
    this.setState({disableExportToExcel: true, failurePromise});

    await failurePromise;

    //Enable export button after it came back
    this.setState({disableExportToExcel: false, failurePromise});
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
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);

    //Get original columns
    let formattedColumnOptions = this.getBootStrapModalOptions();

    // Jira #2919 Had to create state resets for cases datatables
    //  due to show only filters and related states
    if(dataTableConfiguration.pageName==="Active"
      || dataTableConfiguration.pageName==="Withdrawn"){
      this.setState({specialShowOnlyFilter: 'all',
        showActiveAppointments: false,
        showInactiveAppointments: false})
      dataTableConfiguration.apptStatus = 'all';
      dataTableConfiguration = this.setShowOnlyButtonClass(dataTableConfiguration);
    }else if(dataTableConfiguration.pageName==="Completed"){
      this.setState({specialShowOnlyFilter: 'active',
        showActiveAppointments: true,
        showInactiveAppointments: false,
        showOnlyButtonClass: 'btn-primary'})
      dataTableConfiguration.apptStatus = 'active';
    }else{
      dataTableConfiguration = this.setShowOnlyButtonClass(dataTableConfiguration);
    }

    //Now reset everything
    this.setState({dataTableConfiguration, formattedColumnOptions,
      resetNumber: ++resetNumber});
  }

  /**
   *
   * @desc - Gets dataTableConfiguration, bootstrap options and tableConfig
   * @param {String} config_name - name of config files to use
   * @returns {void}
   *
   **/
  getDataTableInfo(config_name = this.props.config_name) {
    let {tableConfiguration} = this.setViewConfigurationByConfigName(config_name);
    let formattedColumnOptions = this.getBootStrapModalOptions();
    let {dataTableConfiguration} = this.Logic;
    return {tableConfiguration, formattedColumnOptions, dataTableConfiguration};
  }

  /**
   *
   * @desc - Takes config name and uses that to set dataTableConfiguration,
   *  then sets a lot of that data in state
   * @param {Object} config_name - name of dataTableConfiguration file
   * @returns {void}
   *
   **/
  setDataTableConfigurationInfo(config_name = this.props.config_name) {
    //Get the view info to set up table data
    let {tableConfiguration, formattedColumnOptions, dataTableConfiguration}
      = this.getDataTableInfo(config_name);
    this.state = {...this.state, tableConfiguration, formattedColumnOptions,
      dataTableConfiguration};
  }

  /**
   *
   * @desc - Get API row data and sets data in state
   * @returns {void}
   *
   **/
  setRowDataInfo = async () => {
    let failurePromise = this.getFormattedRowDataInfo(true);

    this.setState({failurePromise});

    let {rowData, sortingTextOrder, maxRowCount, originalRowData} = await failurePromise;

    this.setState({rowData, sortingTextOrder, originalRowData, maxRowCount});
    this.Logic.consoleLog('FINISH', 'setRowDataInfo')
    this.Logic.consoleLogDifference('FINISH');
    // added for opusdev-3567
    this.setState({showFilterModal: false});
    return {rowData, sortingTextOrder, maxRowCount, originalRowData};
  }

  /**
   *
   * @desc - Sets up datatable and sets API row data in state
   * @param {String} config_name - name of config files to use
   * @returns {void}
   *
   **/
  async setUpPage(config_name = this.props.config_name) {
    this.setDataTableConfigurationInfo(config_name);
  }

  /**
   *
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} checkedColumnsHash -
   * @return {void}
   *
   **/
  changeColumnVisibility = (checkedColumnsHash, dataTableConfiguration = this.dataTableConfiguration) => {
    dataTableConfiguration = this.Logic.updateColumnVisibilityByHash(checkedColumnsHash, dataTableConfiguration);
    let formattedColumnOptions = this.getBootStrapModalOptions();
    this.setState({formattedColumnOptions});
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration, formattedColumnOptions);
  }

  /**
   *
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} event - event passed from click event
   * @param {Object} checkedColumnsHash - event passed from click event
   * @return {void}
   *
   **/
  changeColumnVisibilityOnClick = (event, checkedColumnsHash = {}) => {
    this.changeColumnVisibility(checkedColumnsHash);
  }

  /**
   *
   * @desc - Simply opens 'Change Columns' modal
   * @returns {void}
   *
   **/
  openChangeColumnsModal = () => this.setState({showModal: true});

  /**
   *
   * @desc - Simply closes 'Change Columns' modal
   * @returns {void}
   *
   **/
  closeChangeColumnsModal = () => this.setState({ showModal: false });

  /**
   *
   * @desc - Gets the list of columns needed to render bootstrap modal
   * @param {String} dataTableConfiguration - guess
   * @returns {void}
   *
   **/
  getBootStrapModalOptions(dataTableConfiguration = this.dataTableConfiguration) {
    let formattedColumnOptions = this.Logic.configureColumnInformation(
      dataTableConfiguration);
    formattedColumnOptions = this.Logic.removeInvalidShowColumnsOptions(formattedColumnOptions);
    return formattedColumnOptions;
  }


  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {String} dataTableConfiguration - guess
   * @returns {JSX} - jsx for table buttons
   *
   **/
  updateRowDatafromDataTableConfiguration(dataTableConfiguration =
    this.Logic.dataTableConfiguration, formattedColumnOptions = this.state.formattedColumnOptions) {
    let rowData = this.Logic.filterAPITableData();
    let sortingTextOrder = this.Logic.getSortOrderText();
    this.setState({rowData, dataTableConfiguration, sortingTextOrder});
    return rowData;
  }

  async getFilters(){
    await this.Logic.getFilters();
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * Added should sort logic Jira #2502 10/24/18
   * @param {String} name - name of column that was clicked
   * @returns {JSX} - jsx for table buttons
   *
   **/
  onClickSort = (name) => {
    let shouldSort = this.Logic.shouldSort(name);
    if(shouldSort) {
      let dataTableConfiguration = this.Logic.updateSortOrderFilterInDataTableConfig(
        name);
      this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
    }
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {Object} evt - typing event for search field in column header
   * @returns {JSX} - jsx for table buttons
   *
   **/
  onSearchTextFilter = (evt) => {
    let {target: {name, value}} = evt;
    let dataTableConfiguration = this.Logic.updateSearchTextFilterInDataTableConfig(
      name, value);
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {String} name - name of column
   * @param {String} filterMap - key value pair of values that are included
   * @returns {JSX} - jsx for table buttons
   *
   **/
  onMultiSelectClick = (name, filterMap = {}) => {
    let dataTableConfiguration = this.Logic.updateValueOptionsFilterInDataTableConfig(
      name, filterMap);
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
  }

  /**
   *
   * @desc - Gets the modal change columns
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getChangeColumnsModal() {
    let {state: {showModal, formattedColumnOptions = []}} = this;
    let {resetNumber, table_number = ' modal-checkbox-list '} = this.state;

    return (
      <BootStrapModalCheckboxList key={table_number} {...{resetNumber}}
        options={formattedColumnOptions} isCheckedKey={this.visible_key}
        nameKey={this.name_key} displayNameKey={this.display_name_key}
        {...{showModal}} onClickCheckbox={this.changeColumnVisibilityOnClick}
        closeModal={this.closeChangeColumnsModal} />
    );
  }

  /**
   *
   * @desc - API response modal to tell whether api call failed or succeeded
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getAPIResponseModal({failurePromise, promise} = this.state) {
    return <APIModal {...{failurePromise, promise}} />;
  }

  /**
   *
   * @desc - Set button color for show only filters
   *
   **/
  setShowOnlyButtonClass = () => {
    let {dataTableConfiguration} = this.Logic;
    let filters = dataTableConfiguration.dataColumnFilters.outsideFilters;
    let hasFilters = false;
    for(let key in filters) {
        if(filters.hasOwnProperty(key)){
          hasFilters = true;
        }
    }
    if(hasFilters){
      this.setState({showOnlyButtonClass: 'btn-primary'})
    }else{
      this.setState({showOnlyButtonClass: 'btn-gray'})
    }
  }

  /**
   *
   * @desc - Update dataTableConfiguration from filtered view component changes. Because react doesn't update states if it doesn't change,
   *    need to hit this function twice
   *
   **/
  updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal = true){
    // If coming from datatable filter view click, turn all columns visible false.  If coming from filters modal,
    // set to correct visibility
    let checkedColumnsHash = {};
    for(let each in formattedColumnOptions){
      let columnName = formattedColumnOptions[each].name;
      shouldShowFilterModal ? checkedColumnsHash[columnName] = false : checkedColumnsHash[columnName] = formattedColumnOptions[each].visible;
    }
    dataTableConfiguration = this.Logic.updateColumnVisibilityByHash(checkedColumnsHash, dataTableConfiguration);

    // Since the first time around columns are set to false which removes sort filters
    // so need to set correct sort filters on the second time around
    if(!shouldShowFilterModal){
      dataTableConfiguration.dataColumnFilters = dataTableConfiguration.currentView.filters.dataColumnFilters;
    }

    // Outside Show only filters for Eligibility
    if(dataTableConfiguration.pageName==="Eligibility"){
      this.handleEligibilityShowOnlyFilters(dataTableConfiguration);
    }

    // formattedColumnOptions = this.getBootStrapModalOptions(dataTableConfiguration);
    let rowData = this.Logic.filterAPITableData();
    let sortingTextOrder = this.Logic.getSortOrderText(dataTableConfiguration);
    this.setShowOnlyButtonClass(dataTableConfiguration);
    this.setState({formattedColumnOptions, rowData, dataTableConfiguration, sortingTextOrder, showFilterModal: shouldShowFilterModal});
    // Set automatically timer to dismiss filter change modal
    if(shouldShowFilterModal){
      // Change state of reset number for check all to be unchecked in change columns modals #checkAllReset
      this.setState({resetNumber: this.state.resetNumber+1})
      setTimeout(
        function() {
          this.filterModalTimer();
        }.bind(this), 2000
      );
    }
  }

  handleEligibilityShowOnlyFilters(dataTableConfiguration){
    let flags = dataTableConfiguration.currentView.filters.dataColumnFilters.outsideFilters;
    if(flags.waiverFlag){
      document.getElementById("waiver-checkbox").checked = true;
    }else{
      document.getElementById("waiver-checkbox").checked = false;
    }
    if(flags.mandatoryActionFlag){
      document.getElementById("mandatory-actions-checkbox").checked = true;
    }else{
      document.getElementById("mandatory-actions-checkbox").checked = false;
    }
  }

  getExportData = () => {
    if(!this.state.loading) {
      this.setState({
        loading: true
      });
      console.log("Downloading...")
      let {rowData, formattedColumnOptions} = this.state;
      this.Logic.findExportData(rowData, formattedColumnOptions);
      this.setState({
        loading: false
      });
    }
  }

  filterModalTimer(){
    let {state: {dataTableConfiguration, formattedColumnOptions = {}}} = this;
    this.updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, false)
    this.setState({showFilterModal: false})
  }

  showFilterModal(){
    let {state: {dataTableConfiguration, showFilterModal, formattedColumnOptions = {}, currentQueueTitle}}
      = this;
    return(
      <Modal show={showFilterModal} backdrop="static">
        <Header className=" modal-info modal-header">
          <h1 className="modal-title">Loading</h1>
        </Header>
        <Body >
          {currentQueueTitle ?
            <p>Loading {currentQueueTitle} Queue.</p>
          :
            <p>Loading custom views.</p>
          }
          </Body>
        <Footer>
          <Dismiss onClick={() => this.updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, false)} className=" left btn btn-primary">
            OK
          </Dismiss>
        </Footer>
      </Modal>
    )
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getButtonRow() {
    let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel, loading}} = this;
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

        <ShowIf show={this.exportToExcel}>
          <CSVLink data={exportData}
            filename={dataTableConfiguration.excelFileName}
            className=" btn btn-sm btn-gray table-top export-to-excel pull-right black "
            target="_blank"
            asyncOnClick={true}
            onClick={() => this.getExportData()}>
            {loading ? 'Downloading...' : 'Export To Excel'}
          </CSVLink>
        </ShowIf>

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
    onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort, modalId} = this;

    return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>
        {buttonRow}
        {changeColumnsModal}
        {this.getAPIResponseModal()}
        {this.showFilterModal()}
        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, maxRowCount, tableConfiguration, resetTable,
            dataTableConfiguration, tableClassName, onMultiSelectClick, onClickSort,
            onToggleSelectAll, onSearchTextFilter, modalId}} />
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
