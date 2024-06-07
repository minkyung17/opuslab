
import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from "react-csv";

//My imports
import DataTableComponent from './DataTableBase.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import Eligibility from '../../../opus-logic/datatables/classes/Eligibility';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FilteredView from '../components/FilteredView.jsx';

/******************************************************************************
 *
 * @desc - Handles Active Cases and Completed Cases based on
 *  dataTableConfiguration file
 *
 ******************************************************************************/
export default class EligibilityTableComponent extends DataTableComponent {

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

  state = {
    ...this.state,
    mandatoryActionFlagIsChecked: false,
    waiverFlagIsChecked: false
  };

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new Eligibility(this.props);

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
    this.getFilters();
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    resetNumber: 0
  };

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
  componentDidUpdate() {
    util.initJQueryBootStrapToolTipandPopover();
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {String} dataTableConfiguration - guess
   * @returns {JSX} - jsx for table buttons
   *
   **/
  updateRowDatafromDataTableConfiguration(dataTableConfiguration) {
    let rowData = this.Logic.filterAPITableData();
    let sortingTextOrder = this.Logic.getSortOrderText();
    this.setState({rowData, dataTableConfiguration, sortingTextOrder});
  }

  /**
   *
   * @desc - Filter table data by checked checkboxes and then update table
   * @param {Object} evt
   * @returns {void}
   *
   **/
  filterOnClickCheckbox = (evt) => {
    let {target: {name, checked}} = evt;
    let dataTableConfiguration = this.Logic.updateOutsideFiltersInDatatableConfig(
      {name, value: checked});
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
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

    //Save button row filters
    let {dataColumnFilters: {outsideFilters}} = this.Logic.dataTableConfiguration;

    //Reset table
    let dataTableConfiguration = this.Logic.resetDataTableConfiguration();

    // Removed as of 1/15/19 Jira #2587
    // this.Logic.replaceFilters({outsideFilters});

    // Uncheck outside checkboxes
    document.getElementById("mandatory-actions-checkbox").checked = false;
    document.getElementById("waiver-checkbox").checked = false;

    //Filter rowData
    this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);

    //Get modal
    let formattedColumnOptions = this.getBootStrapModalOptions();

    //Rerender table
    this.setState({dataTableConfiguration, formattedColumnOptions, resetNumber:
      ++resetNumber});
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getButtonRow() {
    let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}, loading}} = this;
    let exportData = this.Logic.dataTableConfiguration.exportData;
    return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration}
          logicData={this.Logic}
          updateFromFilteredView={(visibleColumns, dataTableConfiguration, shouldShowFilterModal) =>
           this.updateFromFilteredView(visibleColumns, dataTableConfiguration, shouldShowFilterModal)}/>

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
   * @desc - Eligibility button row
   * @param {Object} props - props
   * @returns {void}
   *
   **/
  getEligibilityFilterJSX(dataTableConfiguration = this.Logic.dataTableConfiguration) {
    let {flags: {waiverFlag, mandatoryActionFlag}} = dataTableConfiguration;
    return (
      <div>
        <label htmlFor="action-filters"> Show Only </label>
        <ul id="action-filters">
          <li>
            <input className=" filter-checkbox " type="checkbox"
             onClick={this.filterOnClickCheckbox} name={mandatoryActionFlag}
             id="mandatory-actions-checkbox" title="Mandatory actions checkbox" />
              Mandatory Actions
            </li>
          <li>
            <input className=" filter-checkbox " type="checkbox" name={waiverFlag}
              id="waiver-checkbox" title="Waiver checkbox"
              onClick={this.filterOnClickCheckbox}/>
                Appointees without a review waiver
            <a role="button" aria-label="help tip" data-html="true"
              data-trigger="hover" tabIndex="0" className="ttip" title=""
              data-placement="top" data-toggle="popover"
              data-content={descriptions.waiver} data-original-title="" >
              <span aria-hidden="true" className="icon-help-circled help ttip"></span>
            </a>
          </li>
        </ul>
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
    let filterButtons = this.getEligibilityFilterJSX();
    let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, resetTable, onMultiSelectClick,
    onSearchTextFilter, onClickSort} = this;

    return (
      <div className=" datatable-root ">
        <p className="error_message"> {error_message} </p>
        {filterButtons}
        {changeColumnsModal}
        {buttonRow}
        {this.getAPIResponseModal()}
        {this.showFilterModal()}
        <FixedDataTableComponent ref="datatable"
          key={resetNumber} resetNumber={resetNumber}
          {...{rowData, tableConfiguration, resetTable, dataTableConfiguration,
            onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
