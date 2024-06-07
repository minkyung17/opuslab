import React from "react";
import {add, keys} from "lodash";
import PropTypes from "prop-types";
import { Tabs, Tab, Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
//My imports
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import Permissions from "../../../opus-logic/common/modules/Permissions.js";
import Compliance from "../../../opus-logic/datatables/classes/Compliance.js";
import FixedDataTableComponentWithActivityStatusFooter from "../components/FixedDataTableComponentWithActivityStatusFooter.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import FilteredView from "../components/FilteredView.jsx";
import DataTableComponent from "./DataTableBase.jsx";
import {searchCriteria} from "../../../opus-logic/datatables/constants/ComplianceConstants";

/******************************************************************************
 *
 * @desc - Handles Compliance table via dataTableConfiguration file
 *
 ******************************************************************************/
export default class ComplianceTableComponent extends DataTableComponent {

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
    Logic = new Compliance(this.props);
    Permissions = new Permissions(this.props.adminData);

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
        showOnlyButtonClass: "btn-gray"

    };

     /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
     componentDidMount() {
      this.setUpPage();
  }
   
/******************************************************************************
 *
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/
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
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} checkedColumnsHash -
   * @return {void}
   *
   **/
    changeColumnVisibility = (checkedColumnsHash, event, dataTableConfiguration = this.dataTableConfiguration) => {
        dataTableConfiguration = this.Logic.updateColumnVisibilityByHash(checkedColumnsHash, dataTableConfiguration);
        let formattedColumnOptions = this.getBootStrapModalOptions();
        this.setState({formattedColumnOptions});
        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration, formattedColumnOptions);
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
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow = () => {
        
      let filterButtons = this.getFilterButtonJSX();

        let {state: { dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}, loading}} = this;
        let exportData = this.Logic.dataTableConfiguration.exportData;

        return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        {filterButtons}

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

        let {state: {tableConfiguration, rowData, resetNumber, error_message, sortingTextOrder,
      dataTableConfiguration, maxRowCount}, tableClassName, resetTable,
      onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort, modalId} = this;
        let {isOA, isAPO, isAPOAdmin} = this.Permissions;
        return (

      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>

        {changeColumnsModal}
        {this.showFilterModal()}
          <div>

            {buttonRow}
            <FixedDataTableComponentWithActivityStatusFooter ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}