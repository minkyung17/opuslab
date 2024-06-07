import React from "react";
import {keys} from "lodash";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

//My imports
import DataTableComponent from "./DataTableBase.jsx";
import * as util from "../../../opus-logic/common/helpers/";
import Roster from "../../../opus-logic/datatables/classes/Roster";
//import {cssConstants} from '../constants/DatatableConstants';
import {BootStrapModalCheckboxList} from
  "../../common/components/bootstrap/ModalCheckBoxes.jsx";
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import FilteredView from "../components/FilteredView.jsx";
import {searchCriteria} from "../../../opus-logic/datatables/constants/RosterConstants";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

/******************************************************************************
 *
 * @desc - Handles Roster via dataTableConfiguration file
 *
 ******************************************************************************/

export default class RosterTableComponent extends DataTableComponent {
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
    Logic = new Roster(this.props);

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
    }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
    state = {
        ...this.state,
        infoshowModal: false,
        resetNumber: 0,
        showOnlyButtonClass: "btn-gray"
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
        let {state: {dataTableConfiguration, sortingTextOrder, showModal, formattedColumnOptions = {}, loading}}
      = this;
        let {table_number = " modal-checkbox-list ", resetNumber} = this.state;
        let exportData = this.Logic.dataTableConfiguration.exportData;
        return (
      <div className=" button-row ">
        <BootStrapModalCheckboxList ref="modalCheckbox" key={table_number}
          options={formattedColumnOptions} isCheckedKey={this.visible_key}
          nameKey={this.name_key} displayNameKey={this.display_name_key}
          {...{showModal, resetNumber}} closeModal={this.closeChangeColumnsModal}
          onClickCheckbox={this.changeColumnVisibilityOnClick}
           />

        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        {filterButtons}

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration}
          showOnlyFilters={searchCriteria.categories} logicData={this.Logic}
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

    openInfoModal = () => this.setState({infoshowModal: true})

    closeInfoModal = () => this.setState({infoshowModal: false})

  /**
   *
   * @desc - gets JSX info modal for roster
   * @returns {JSX} - information modal
   *
   **/
    getInfoModal() {
        return (
      <div>
        <p id="instruction">A list of {
          this.Logic.dataTableConfiguration.pageName==="InactiveRoster" ?
            "inactive"
            :
            "current"
          } academic appointments in your organization. &nbsp;&nbsp;
          <a href="#" onClick={this.openInfoModal}>How do I correct errors?</a>
        </p>
        <Modal show={this.state.infoshowModal} onHide={this.closeInfoModal}>
          <Header className=" modal-info " closeButton>
            <h1 className="modal-title">
              Correct Errors
            </h1>
          </Header>
          <Body>
            <h3>Add an Appointment</h3>
            <p>If an appointment is missing from your Active Appointments or
              mistakenly appearing on your Inactive Appointments, contact
              <a href="mailto:'opushelp@ucla.edu'"> opushelp@ucla.edu </a>
              to resolve the issue.
            </p>
            <h3>Delete an Appointment</h3>
            <p>To delete an appointment that has ended, or if the appointment
              was never in your department, contact
            <a href="mailto:'opushelp@ucla.edu'"> opushelp@ucla.edu </a>
               to resolve the issue.
            </p>
          </Body>
          <Footer>
            <Dismiss onClick={this.closeInfoModal} className=" btn left btn-primary ">
              OK
            </Dismiss>
          </Footer>
        </Modal>
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
        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, resetTable, onMultiSelectClick,
    onSearchTextFilter, onClickSort} = this;

        return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>
        {this.getInfoModal()}
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
