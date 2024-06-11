import React from "react";
import {keys} from "lodash";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

//My imports
import DataTableComponent from "./DataTableBase.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import OpusMismatches from "../../../opus-logic/datatables/classes/OpusMismatches";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import {BootStrapModalCheckboxList} from
  "../../common/components/bootstrap/ModalCheckBoxes.jsx";
import {searchCriteria} from "../../../opus-logic/datatables/constants/OpusMismatchesConstants";
import FilteredView from "../components/FilteredView.jsx";

/******************************************************************************
 *
 * @desc - Handles Opus Mismatches via dataTableConfiguration file
 *
 ******************************************************************************/
export default class OpusMismatchesTableComponent extends DataTableComponent {

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
    Logic = new OpusMismatches(this.props);

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
        this.Logic.setDataTableConfigurationShowOnlyFilters(searchCriteria);
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
        resetNumber: 0,
        showOnlyButtonClass: "btn-gray",
        specialShowOnlyFilter: "OpusMismatch"
    };

    componentDidUpdate(){

    }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {String} dataTableConfiguration - guess
   * @returns {JSX} - jsx for table buttons
   *
   **/
    updateRowDatafromDataTableConfiguration(dataTableConfiguration = this.Logic.dataTableConfiguration) {
        super.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
    }

    updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal = true){
        super.updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal);
    }

    /**
   *
   * @desc - Filter table data by checked checkboxes and then update table
   * @param {Object} evt -
   * @returns {void}
   *
   **/
    filterOnClickCheckbox = (evt) => {
        let {target: {name, checked}} = evt;
        let dataTableConfiguration = this.Logic.updateOutsideFiltersInDatatableConfig(
      {name, value: checked});
        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
        this.setShowOnlyButtonClass();
    }

    /**
   *
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} checkedColumnsHash -
   * @return {void}
   *
   **/
    changeColumnVisibility = (checkedColumnsHash, event, dataTableConfiguration = this.dataTableConfiguration) => {
    // OPUSDEV-3131 Check all is custom made and uncheck all reverts to a custom visibility so had to make a exception
        let columns = checkedColumnsHash;
        if(event.target.value==="Check All"){
            for(let each in columns){
                columns[each] = event.target.checked;
            }
        }

        dataTableConfiguration = this.Logic.updateColumnVisibilityByHash(columns, dataTableConfiguration);
        let formattedColumnOptions = this.getBootStrapModalOptions();
        this.setState({formattedColumnOptions});
        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
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
        this.changeColumnVisibility(checkedColumnsHash, event);
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
        this.attachOnClickForHideRow(dataTableConfiguration);
    }

    attachOnClickForHideRow(dataTableConfiguration) {
        let dtConfig = dataTableConfiguration.columnConfiguration;
      // Hide column on click event
        if(dtConfig.hideRow) {
            dtConfig.hideRow.onClick = (evt, rowData) => this.hideRow("Y", evt, rowData);
        }
        return dataTableConfiguration;
    }

    hideRow = async (isHiddenFlag, evt, {rowData} = {}) => {
        let originalData = rowData.originalData;

        let hidePromise = this.Logic.hideRow(originalData, isHiddenFlag);
        this.handlePromise(hidePromise);
    }

  /******************************************************************************
   *
   * @desc - Main datatable functions and components
   *
   ******************************************************************************/


    handlePromise = async (promise) => {
        let response = await promise;
        console.log(response);
        console.log(response.length);
        if(response && response.length>=0){
            let rowData = await this.Logic.configureData(response);
            // rowData = this.Logic.filterAPITableData(rowData);
            let sortingTextOrder = this.Logic.getSortOrderText();
            this.Logic.rowData = rowData;
            let maxRowCount = rowData.length;
            this.setState({rowData, sortingTextOrder, maxRowCount});
        }else{
            console.log("Response from API does not contain array of rowData");
            console.log(response.toString());
        }
    }

  /**
   *
   * @desc - Renders the datatable and button suite
   * @param {Array} names - data for search categories
   * @returns {JSX} - filter button
   *
   **/
    getFilterButtonJSX(names = keys(searchCriteria.categories)) {
        let {dataTableConfiguration} = this.Logic;
        let isChecked = dataTableConfiguration.dataColumnFilters.outsideFilters;

        return (
      <span className="dropdown">
        <button className={"btn btn-sm table-top dropdown-toggle "
          +this.state.showOnlyButtonClass} type="button" data-toggle="dropdown">
          Show Only &nbsp;&nbsp;
          <span className="caret" />
        </button>
        <ul className="dropdown-menu cases-show-only">
          {names.map((name) =>
            (<li key={name}>
              <div className="checkbox">
                <label>
                  <input {...{name, id: name}} type="checkbox"
                    className="btn btn-sm btn-gray table-top dropdown-toggle"
                    onClick={this.filterOnClickCheckbox} checked={!!isChecked[name]}/>
                  {searchCriteria.categories[name].displayName}
                </label>
              </div>
            </li>)
          )
          }
        </ul>
      </span>
    );
    }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow() {
        let filterButtons = this.getFilterButtonJSX();
        let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel,
      specialShowOnlyFilter, formattedColumnOptions = {}, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;

        return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        {filterButtons}

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration}
          logicData={this.Logic} showOnlyFilters={searchCriteria.categories}
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
      dataTableConfiguration, maxRowCount, totals}, tableClassName, resetTable,
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
          {...{resetNumber, rowData, maxRowCount, tableConfiguration, resetTable, totals,
            dataTableConfiguration, tableClassName, onMultiSelectClick, onClickSort,
            onToggleSelectAll, onSearchTextFilter, modalId}} />
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}