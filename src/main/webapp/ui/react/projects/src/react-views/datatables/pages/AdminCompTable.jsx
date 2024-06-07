import React from "react";
import {add, keys} from "lodash";
import PropTypes from "prop-types";
import { Tabs, Tab, Button } from "react-bootstrap";

//My imports
import DataTableComponent from "./DataTableBase.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import AdminCompAllocations from "../../../opus-logic/datatables/classes/AdminCompAllocations";
import {FormNumber, FormCurrency, FormTextAreaMaxChar, FormAutoComplete, FormSelect} from "../../common/components/forms/FormElements.jsx";
import {FormShell, FormGroup} from "../../common/components/forms/FormRender.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import FilteredView from "../components/FilteredView.jsx";
import { descriptions } from "../../../opus-logic/common/constants/Descriptions.js";
import * as util from "../../../opus-logic/common/helpers";

/******************************************************************************
 *
 * @desc - Handles Administrative Compensation Allocations via dataTableConfiguration file
 *
 ******************************************************************************/
export default class AdminCompTableComponent extends DataTableComponent {

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
    Logic = new AdminCompAllocations(this.props);

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
        resetNumber: 0,
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
        showSuccessModal: false,
        isSaveButtonDisabled: false,
        addData: {},
        originalEditData: {},
        editData: {},
        deleteData: {},
        yearOptions: {},
        titleOptions: {},
        allocationTitleData: {},
        adminCompInfo: {},
        duplicateErrorMessage: null
    };


 /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
    componentDidMount() {
        let {dataTableConfiguration} = this.Logic;
        this.attachOnClickForColumns(dataTableConfiguration);
        this.setState({dataTableConfiguration});
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
        this.attachOnClickForColumns(dataTableConfiguration);
    }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
    attachOnClickForColumns(dataTableConfiguration) {
        if(dataTableConfiguration && dataTableConfiguration.columnConfiguration){
            let dtConfig = dataTableConfiguration.columnConfiguration;
      // edit on click event
            if(dtConfig.edit) {
                dtConfig.edit.onClick =
          (evt, row) => this.edit(evt, row);
            }
      // delete on click event
            if(dtConfig.delete) {
                dtConfig.delete.onClick =
          (evt, row) => this.delete(evt, row);
            }
        }
        return dataTableConfiguration;
    }


/******************************************************************************
 *
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/


    handlePromise = async (promise) => {
        let response = await promise;
        if(response && response.length>=0){
            let rowData = await this.Logic.configureData(response);
            rowData = this.Logic.filterAPITableData(rowData);
            let sortingTextOrder = this.Logic.getSortOrderText();
            this.Logic.rowData = rowData;
            this.setState({rowData, sortingTextOrder});
        }else{
            console.log("Response from API does not contain array of rowData");
            console.log(response.toString());
        }
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

    dismissSuccessModal = () => {
    // this.handlePromise(this.state.savePromise)
        this.setState({showSuccessModal: false});
    }

    getSuccessModal = () => {
        let {showSuccessModal} = this.state;
        return (
      <Modal show={showSuccessModal} onHide={this.dismissSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Success! </h1>
        </Header>
        <Body>
          <p>Your edits have been saved!</p>
        </Body>
        <Footer>
          <button className={"left btn btn-success"} onClick={this.dismissSuccessModal}>
            OK
          </button>
        </Footer>
      </Modal>
    );
    }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow = () => {

        let {state: { dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}}} = this;

        return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration} logicData={this.Logic}
          updateFromFilteredView={(visibleColumns, dataTableConfiguration, shouldShowFilterModal) =>
            this.updateFromFilteredView(visibleColumns, dataTableConfiguration, shouldShowFilterModal)}/>

        <ShowIf show={this.exportToExcel}>
          <button className=" btn btn-sm btn-gray table-top export-to-excel pull-right"
            disabled={disableExportToExcel} onClick={() => this.exportCSV()} >
            Export To Excel
          </button>
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

        return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>

        {changeColumnsModal}
        {this.getAddModal()}
        {this.getEditModal()}
        {this.getDeleteModal()}
        {this.getSuccessModal()}
        {this.showFilterModal()}

          <div>
            <div className="col-md-12">
              <div className="row">
                <button className={"left btn btn-primary bottom-space small-space"} onClick={this.openAddModal}>
                    Add Allocation
                </button>
              </div>
            </div>
            <br/><br/>

            {buttonRow}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
