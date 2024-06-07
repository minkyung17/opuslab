import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from "react-csv";
// import {keys} from 'lodash';
// import {Button} from 'react-bootstrap';
//My imports
import CasesTableComponent from './CasesTable.jsx';
import CompletedCases from '../../../opus-logic/datatables/classes/CompletedCases';

// import * as util from '../../../opus-logic/common/helpers/';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import FilteredView from '../components/FilteredView.jsx';
import APIFailureModal from '../../cases-admin/APIFailureModal.jsx';
import {Select} from '../../common/components/forms/SelectOption.jsx'
// import Modal, {Header, Title, Body, Dismiss, Footer} from
//   '../../common/components/bootstrap/ReactBootstrapModal.jsx';
// import {BootStrapModalCheckboxList} from
//   '../../common/components/bootstrap/ModalCheckBoxes.jsx';
import {timePeriods} from '../../../opus-logic/datatables/constants/CompletedCasesConstants';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

/******************************************************************************
 *
 * @desc - Handles Completed Cases based on
 *    dataTableConfiguration file
 *
 ******************************************************************************/
export default class CompletedCasesTableComponent extends CasesTableComponent {

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

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new CompletedCases(this.props);
  tableClassName = 'cases';

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
    this.setGlobalReloadActiveCasesFunction();
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    resetNumber: 0,
    showActiveAppointments: true,
    specialShowOnlyFilter: 'active',
    value: 'year',
    timePeriodArray: [],
    showOnlyButtonClass: 'btn-primary'
  };

  setGlobalReloadActiveCasesFunction() {
    window._reloadActiveCases = this.setRowDataInfo;
  }

  componentDidMount(){
    this.setTimePeriodArray();
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
    this.attachOnClickForReopenColumn(dataTableConfiguration);
  }

  setTimePeriodArray(){
    let timePeriodArray = [];
    for(let each of timePeriods){
      timePeriodArray.push(each.name)
    }
    this.setState({timePeriodArray})
  }

  updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal){
    let dtConfig = dataTableConfiguration;

    for(let each of timePeriods){
      if(each.value===dtConfig.timePeriod){
        let e = {target: {value: each.name}};
        this.selectFilteredTimePeriod(e);
        break;
      }
    }

    //Find correct active/inactive status
    dtConfig = this.setActiveStatus(dtConfig)

    super.updateFromFilteredView(formattedColumnOptions, dtConfig, shouldShowFilterModal);

    this.Logic.dataTableConfiguration = dataTableConfiguration;
  }



  /**
   *
   * @desc - By default, 'active appointments' is checked
   * @param {Object} dataTableConfiguration -
   * @returns {Object} dataTableConfiguration
   *
   **/
  setUpDefaultShowOnlyFilters(configuration){
    let dataTableConfiguration = this.Logic.updateOutsideFiltersInDatatableConfig(
        {name: '5', value: true}, configuration);
    return dataTableConfiguration;
  }

  /**
   *
   * @desc - Resets datatable configuration to its default
   * @returns {Object} dataTableConfiguration
   *
   **/
  resetDataTableConfiguration(){
    let {dataTableConfiguration} = this.Logic;
    dataTableConfiguration = this.attachOnClickForReopenColumn(dataTableConfiguration);

    return dataTableConfiguration;
  }

  resetTableClick = async () => {
    this.resetTable();
    let {dataTableConfiguration} = this.Logic;
    dataTableConfiguration = this.setUpDefaultShowOnlyFilters(dataTableConfiguration);

    // Refresh datatable
    let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(false, true);
    this.setState({rowData, sortingTextOrder, maxRowCount,
      dataTableConfiguration, value: 'year'});
  }

  /**
  *
  * @desc - Whenever user selects an action type update here
  * @param {Object} event - click event
  * @return {void}
  *
  **/
  selectFilteredTimePeriod = async ({target: {value} = {}} = event) => {
    let {dataTableConfiguration} = this.Logic;
    let timePeriod;

    // Find time period in object
    for(let each of timePeriods){
      if(each.name===value){
        dataTableConfiguration.timePeriod = each.value;
        timePeriod = each.value;
        break;
      }
    }
    let rowData;
    // Show all reverts to original row data, if not run function to determine filtered rowData
    if(value==='show all'){
      rowData = this.state.originalRowData;
    }else{
      rowData = this.Logic.getFilteredTimePeriodRowData(timePeriod, this.state.originalRowData)
    }
    rowData = this.Logic.filterRowDataByFlags(rowData)

    //SORT OPTIONS - If there are options to sort (Jira #2944)
    let {visibleColumnSortOrder} = this.Logic.getVisibleTableFilters(dataTableConfiguration);
    rowData = this.Logic.sortRowDataByObject(rowData,
      visibleColumnSortOrder);

    this.setState({rowData, value, dataTableConfiguration});

  }

  /**
   *
   * @desc - Filter table data by checked checkboxes and then update table
   * @param {Object} evt -
   * @returns {void}.
   *
   **/
  filterOnClickCheckbox = (evt) => {
    let {target: {name, checked}} = evt;
    let dataTableConfiguration = this.Logic.updateOutsideFiltersInDatatableConfig(
      {name, value: checked});
    if(name==='5' || name==='6'){
      dataTableConfiguration = this.specialShowOnlyAPICall(name, checked, dataTableConfiguration);
    }

    let rowData = this.Logic.filterAPITableData();
    if(dataTableConfiguration.timePeriod!=='all'){
      rowData = this.Logic.getFilteredTimePeriodRowData(dataTableConfiguration.timePeriod, rowData);
    }
    let sortingTextOrder = this.Logic.getSortOrderText();

    this.setShowOnlyButtonClass();
    this.setState({rowData, dataTableConfiguration, sortingTextOrder});
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getButtonRow() {
    let filterButtons = this.getFilterButtonJSX();
    let {state: {dataTableConfiguration, value, sortingTextOrder, disableExportToExcel,
      specialShowOnlyFilter, formattedColumnOptions = {}, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;
    return (
      <div className=" button-row form-inline ">
        <div className=" form-group">
          <button className="btn btn-sm btn-gray table-top " onClick={this.openChangeColumnsModal}>
            Change Columns
          </button>
        </div>

        {filterButtons}

        <div className=" form-group">
          <label className= "form-control-static  sorting-text padding-right-10">
            Show cases closed in the last
          </label>
        </div>

        <div className=" form-group table-top">
          <Select {...{value}}
            extraClass=' input-sm '
            includeBlankOption={false}
            options={this.state.timePeriodArray}
            onChange={this.selectFilteredTimePeriod}
          />
        </div>

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration} logicData={this.Logic}
          updateFromFilteredView={(visibleColumns, dataTableConfiguration, shouldShowFilterModal) =>
            this.updateFromFilteredView(visibleColumns, dataTableConfiguration, shouldShowFilterModal)}/>

          <CSVLink data={exportData}
            filename={dataTableConfiguration.excelFileName}
            className=" btn btn-sm btn-gray table-top export-to-excel pull-right black "
            target="_blank"
            asyncOnClick={true}
            onClick={() => this.getExportData()}>
            {loading ? 'Downloading...' : 'Export To Excel'}
          </CSVLink>

        <div className=" form-group">
          <div className=" sorting-text ">{sortingTextOrder}</div>
        </div>

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
    let getReopenCaseModal = this.getReopenCaseModal();
    let caseReopenedSuccessModal = this.getCaseReopenSuccessModal();
    let resetTable = () => this.resetDataTableConfiguration();
    let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, onMultiSelectClick,
      onSearchTextFilter, onClickSort, tableClassName} = this;
    return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>
        {buttonRow}
        {changeColumnsModal}
        {getReopenCaseModal}
        {caseReopenedSuccessModal}
        {this.showFilterModal()}
        <APIFailureModal {...{failurePromise: this.state.promise}} />
        <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
          resetNumber, tableConfiguration, resetTable, dataTableConfiguration,
          onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
          tableClassName}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
