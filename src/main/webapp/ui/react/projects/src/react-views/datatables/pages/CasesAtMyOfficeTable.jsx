import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
// import {keys} from 'lodash';
// import {Button} from 'react-bootstrap';
//My imports
import CasesTableComponent from "./CasesTable.jsx";
import CasesAtMyOffice from "../../../opus-logic/datatables/classes/CasesAtMyOffice";
import DeleteOrWithdrawCase from "../../../opus-logic/cases-admin/DeleteOrWithdrawCase";
// import * as util from '../../../opus-logic/common/helpers/';
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import FilteredView from "../components/FilteredView.jsx";
import APIFailureModal from "../../cases-admin/APIFailureModal.jsx";
import {Select} from "../../common/components/forms/SelectOption.jsx";
import {proposedActionFlags} from "../../../opus-logic/datatables/constants/DatatableConstants";
// import Modal, {Header, Title, Body, Dismiss, Footer} from
//   '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {BootStrapModalCheckboxList} from
  "../../common/components/bootstrap/ModalCheckBoxes.jsx";
import {DropdownButton, FormControl, FormGroup, MenuItem, Glyphicon
} from "react-bootstrap";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

/******************************************************************************
 *
 * @desc - Handles Completed Cases based on
 *    dataTableConfiguration file
 *
 ******************************************************************************/
export default class CasesAtMyOfficeComponent extends CasesTableComponent {

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
    Logic = new CasesAtMyOffice(this.props);
    DeleteOrWithdrawCaseLogic = new DeleteOrWithdrawCase(this.props);
    tableClassName = "cases";

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
        deleteOnly: false,
        specialShowOnlyFilter: "active",
        showOnlyButtonClass: "btn-gray",
        queueDropdownOptions: [],
        currentQueueTitle: ""
    };

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
    setUpPage() {
        super.setUpPage();
        let {dataTableConfiguration} = this.Logic;
        this.attachOnClickForDeleteColumn(dataTableConfiguration);
    }

    setGlobalReloadActiveCasesFunction() {
        window._reloadActiveCases = this.setRowDataInfo;
    }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
    componentDidMount() {
        this.setupQueues(); 
    }

    updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal){
        let dtConfig = dataTableConfiguration;

    //Find correct active/inactive status
        dtConfig = this.setActiveStatus(dtConfig);

        super.updateFromFilteredView(formattedColumnOptions, dtConfig, shouldShowFilterModal);

        this.Logic.dataTableConfiguration = dtConfig;
    }

    async setupQueues(){
        let count = 0;
        let adminQueues = this.Logic.adminData.casesQueueMap;
    // let columnConfig = this.state.dataTableConfiguration.columnConfiguration;
        let dropdownOptions = [];
        let queues = [];
        let currentQueueTitle = this.Logic.findDefaultQueue();

    // Sort adminQueues alphabetically first
        let ordered = {};
        Object.keys(adminQueues).sort().forEach(function(key) {
            ordered[key] = adminQueues[key];
        });

        for(let each in ordered){
            let columns = ordered[each].split(",");
            let object = {
                id: count,
                name: each,
                columns: columns
            };
            dropdownOptions.push(each);
            count++;
            queues.push(object);
        }

        let apoQueueConfig = this.Logic.getAPOQueueConfig();
        let deansOfficeQueueConfig = this.Logic.getDeansOfficeQueueConfig();
        let deptQueueConfig = this.Logic.getDepartmentQueueConfig();
        let capQueueConfig = this.Logic.getCAPQueueConfig();
        let libraryQueueConfig = this.Logic.getLibraryQueueConfig();

        this.setState({queueDropdownOptions: dropdownOptions, queues, currentQueueTitle,
      apoQueueConfig, deansOfficeQueueConfig, deptQueueConfig, capQueueConfig, libraryQueueConfig
    });

        this.queueSelection(currentQueueTitle);
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
        {name: "5", value: true}, configuration);
        return dataTableConfiguration;
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

        if(name==="5" || name==="6"){
            dataTableConfiguration = this.specialShowOnlyAPICall(name, checked, dataTableConfiguration);
        }

        let rowData = this.Logic.filterAPITableData();
        let sortingTextOrder = this.Logic.getSortOrderText();

        this.setShowOnlyButtonClass();
        this.setState({rowData, dataTableConfiguration, sortingTextOrder});
    }

    async queueSelection(name){
        this.setState({rowData: [], currentQueueTitle: name});
        let {dataTableConfiguration, rowData, maxRowCount, sortingTextOrder, originalRowData} = await this.Logic.queueSelection(name);
        this.Logic.setDataTableConfigurationShowOnlyFilters(proposedActionFlags);
        this.attachOnClickForDeleteColumn(dataTableConfiguration);
        this.setState({dataTableConfiguration, rowData, maxRowCount, sortingTextOrder, originalRowData});
    }

   /**
   *
   * @desc - This will set the delete/withdraw row data and show modal
   * @param {Event} evt - click event
   * @param {Object} rowData - case that will be deleted/withdrawn
   * @returns {void}
   *
   **/
    setDeleteOrWithdrawCaseInfo = (evt, {rowData} = {}) => {
        this.setState({showDeleteWithdrawSuccessModal: false,
    showCasesAdminDeleteModal: false,
    isDeleteOrWithdrawButtonDisabled: false,                   
    showDeleteOrWithdrawCaseFromInterfolioModal: false});
    
    // Checks for linked actions in interfolio case
    // and attaches formatted info
        if(rowData.originalData.actionLinkedToByCCase){
            rowData.actionLinkedToByCCase
      = this.DeleteOrWithdrawCaseLogic.formatActionsLinkedToByCCase(rowData.originalData.actionLinkedToByCCase);
        }

        rowData.effectiveTypeForDisplayInModal = "proposed";
        rowData.effectiveDateForDisplayInModal = rowData.originalData.proposedEffectiveDate;
        rowData.unitValueForDisplayInModal = rowData.originalData.ahName;
    // OPUSDEV-3323 change current workflow step from location to caseLocation
        rowData.caseLocationForDisplayInModal = rowData.originalData.caseLocation;
        let adminName= this.Logic.adminData.adminName;
        let adminFirstName= this.Logic.adminData.adminFirstName;
        this.setState({showDeleteOrWithdrawCaseModal: true, deleteOrWithdrawData: rowData, adminName, adminFirstName});
    }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow = (queueConfig) => {
        let filterButtons = this.getFilterButtonJSX();
        let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel,
      specialShowOnlyFilter, formattedColumnOptions, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;
        return (
      <div className=" button-row form-inline ">
        <div className=" form-group">
          <button className="btn btn-sm btn-gray table-top " onClick={this.openChangeColumnsModal}>
            Change Columns
          </button>
        </div>

        {filterButtons}

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={queueConfig} logicData={this.Logic}
          updateFromFilteredView={(visibleColumns, queueConfig, shouldShowFilterModal) =>
            this.updateFromFilteredView(visibleColumns, queueConfig, shouldShowFilterModal)}/>

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

        let changeColumnsModal = this.getChangeColumnsModal();
        let getDeleteOrWithdrawCaseModal = this.getDeleteOrWithdrawCaseModal();
        let getDeleteOrWithdrawCaseFromInterfolioModal = this.getDeleteOrWithdrawCaseFromInterfolioModal();
        let getCasesAdminDeleteModal = this.getCasesAdminDeleteModal();
        let getCasesAdminSuccessModal = this.getCasesAdminSuccessModal();
        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount, queueDropdownOptions, currentQueueTitle,
      apoQueueConfig, deansOfficeQueueConfig, deptQueueConfig, capQueueConfig, libraryQueueConfig}, onMultiSelectClick,
      onSearchTextFilter, onClickSort, tableClassName} = this;

        return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>
        <label>View &nbsp;</label>
        <span>
          <DropdownButton
            bsStyle={'default'}
            title={currentQueueTitle}
            key={0}
            id={`dropdown-basic-${0}`}
            className={'btn-sm table-top form-group dropdown btn-gray '}
          >
            {queueDropdownOptions.map((name, index)=>
              <MenuItem key={index} eventKey={index} onClick={() => this.queueSelection(name)}>{name}</MenuItem>
            )}
          </DropdownButton>
        </span>
        {getDeleteOrWithdrawCaseModal}
        {getDeleteOrWithdrawCaseFromInterfolioModal}
        {getCasesAdminDeleteModal}
        {getCasesAdminSuccessModal}
        {changeColumnsModal}

        {this.showFilterModal(currentQueueTitle)}
        <APIFailureModal {...{failurePromise: this.state.promise}} />

        <ShowIf show={currentQueueTitle==="APO"}>
          <div>
            {this.getButtonRow(apoQueueConfig)}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration: apoQueueConfig,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>
        </ShowIf>

        <ShowIf show={currentQueueTitle==="Dean's Office"}>
          <div>
            {this.getButtonRow(deansOfficeQueueConfig)}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration: deansOfficeQueueConfig,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>
        </ShowIf>

        <ShowIf show={currentQueueTitle==="Department"}>
          <div>
            {this.getButtonRow(deptQueueConfig)}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration: deptQueueConfig,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>
        </ShowIf>

        <ShowIf show={currentQueueTitle==="CAP"}>
          <div>
            {this.getButtonRow(capQueueConfig)}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration: capQueueConfig,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>
        </ShowIf>

        <ShowIf show={currentQueueTitle==="Library"}>
          <div>
            {this.getButtonRow(libraryQueueConfig)}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration: libraryQueueConfig,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>
        </ShowIf>

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
