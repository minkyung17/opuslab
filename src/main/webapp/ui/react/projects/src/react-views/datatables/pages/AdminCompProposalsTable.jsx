import React from "react";
import {add, keys} from "lodash";
import PropTypes from "prop-types";
import { Tabs, Tab, Button } from "react-bootstrap";

//My imports
import AdminCompTableComponent from "./AdminCompTable.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import AdminCompProposals from "../../../opus-logic/datatables/classes/AdminCompProposals";
import {FormNumber, FormCurrency, FormTextAreaMaxChar, FormAutoComplete, FormSelect} from "../../common/components/forms/FormElements.jsx";
import {FormShell, FormGroup} from "../../common/components/forms/FormRender.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedDataTableComponentWithFixedMultiLineFooter from "../components/FixedDataTableComponentWithFixedMultiLineFooter.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import FilteredView from "../components/FilteredView.jsx";
import { descriptions } from "../../../opus-logic/common/constants/Descriptions.js";
import * as util from "../../../opus-logic/common/helpers";
//new proposal form 4-26-2021
import AutoComplete from "../../common/components/jquery-ui/AutoComplete.jsx";
import NameSearch from "../../../opus-logic/cases/classes/caseflow/NameSearch";
import AdminCompAddProposalModal from "../../cases-admin/AdminCompAddProposalModal.jsx";
import CompensationSuccessModal from "../../cases-admin/CompensationSuccessModal.jsx";
import EndowedChairModal from "../../cases-admin/EndowedChairModal.jsx";
import Profile from "../../../opus-logic/cases/classes/profile/Profile";

/******************************************************************************
 *
 * @desc - Handles Administrative Compensation via dataTableConfiguration file
 *
 ******************************************************************************/
export default class AdminCompProposalsTableComponent extends AdminCompTableComponent {

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
    Logic = new AdminCompProposals(this.props);
  // 4-22-2021 name search field
    noResultsMessage = NameSearch.noResults;
  //Logic = new NameSearch(this.props);

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
        duplicateErrorMessage: null,
    //new proposal form
        showAddProposalModal: false,
        opusPersonId: null,
        disableAddNewButton: false,
        showDeleteSuccessModal: false,
        totals: [],
        disableDeleteButton: false
    };

    componentDidUpdate(){
    // Need to keep state in sync with logic
        if(this.state.totals!==this.Logic.totals){
            let totals = this.Logic.findTotals();
            this.setState({totals});
        }
    }

    /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {String} dataTableConfiguration - guess
   * @returns {JSX} - jsx for table buttons
   *
   **/
    updateRowDatafromDataTableConfiguration(dataTableConfiguration =
      this.Logic.dataTableConfiguration) {
        super.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
        let totals = this.Logic.findTotals();
        this.setState({totals});
    }

    updateFromFilteredView = (formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal = true) => {
        super.updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal);
        let totals = this.Logic.findTotals();
        this.setState({totals});
    }

  /**
   *
   * @desc - Open proposal summary page in new tab
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    edit = (evt, row) => {
        window.open(row.rowData.originalData.link, "_blank");
    }


    refreshProposalsTable = async () => {
        console.log("refreshing table");
    // Refresh datatable
        let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true);
        this.setState({rowData, sortingTextOrder, maxRowCount});
    }

  /******************************************************************************
 *
 * @desc - Delete Modal functions and components
 *
 ******************************************************************************/

  /**
   *
   * @desc - Filter table data by tab click and then update state
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    delete = (event, row) => {
        console.log(row.rowData);
        this.setState({deleteData: row.rowData, showDeleteModal: true});
    }

    hideDeleteModal = () => {
        this.setState({deleteData: {}, showDeleteModal: false, disableDeleteButton: false});
    }

    deleteData = async () => {
        this.setState({disableDeleteButton: true});
        let {deleteData} = this.state;
        let deletePromise = this.Logic.deleteData(deleteData);
        await deletePromise;
        this.setState({showDeleteSuccessModal : true, compensationStringValue: "deleteProposal"});
        this.hideDeleteModal();
    }

  /**
   *
   * @desc - Gets opus status modal
   * @return {JSX} - Opus status modal
   *
   **/
    getDeleteModal() {
        let {disableDeleteButton} = this.state;
        return (
      <Modal show={this.state.showDeleteModal}
        onHide={this.hideDeleteModal}>
        <Header className=" modal-danger " closeButton>
          <h1 className="white" id="ModalHeader">Delete</h1>
        </Header>
        <Body>
          Are you sure? You cannot undo this.
        </Body>
        <Footer>
          <button className={"left btn btn-danger"} onClick={this.deleteData} disabled={disableDeleteButton}>
            Delete
          </button>
          <a className=" left btn btn-link" target="_blank"
            onClick={this.hideDeleteModal}>
            Cancel
          </a>
        </Footer>
      </Modal>
    );
    }

/******************************************************************************
 *
 * @desc - Show New Proposal Modal -4-26-2021
 *
 ******************************************************************************/
    showAddProposalModal = () => {
        this.setState({showAddProposalModal: true});
    }

    hideAddProposalModal = () => {
        this.setState({showAddProposalModal: false});
    }
    getAddProposalModal = () => {
        let {showAddProposalModal, adminCompSummaryDataFromAPI} = this.state;
        return (
    <AdminCompAddProposalModal {...{showAddProposalModal, adminCompSummaryDataFromAPI}}
      hideAddProposalModal={this.hideAddProposalModal} refreshProposalsTable={this.refreshProposalsTable}
      setICLMessage={this.setICLMessage}
      Logic={this.Logic}/>
  );
    }

    setICLMessage = (adminCompSummaryData, threshold, proposedTotalComp, approvedTotalComp) => {
        let shouldProposedICLMessageShow = false;
        let shouldApprovedICLMessageShow = false;
	if(adminCompSummaryData.isHSCP == 'N'){
	        for(let each of threshold){
		            if(each>0){
		                if(proposedTotalComp>each){
		                    adminCompSummaryData.proposedIclBackgroundClass = " bg-danger ";
		                    adminCompSummaryData.proposedIclTextClass = " text-danger ";
		                    adminCompSummaryData.proposedIclMessage = "Warning: The proposed compensation exceeds the ICL of "+this.Logic.convertMoneyValueToDisplay(each)+".";
		                    shouldProposedICLMessageShow = true;
		                }
		                if(approvedTotalComp>each){
		                    adminCompSummaryData.approvedIclBackgroundClass = " bg-danger ";
		                    adminCompSummaryData.approvedIclTextClass = " text-danger ";
		                    adminCompSummaryData.approvedIclMessage = "Warning: The approved compensation exceeds the ICL of "+this.Logic.convertMoneyValueToDisplay(each)+".";
		                    shouldApprovedICLMessageShow = true;
		                }
		            }
		        }
		
		        if(!shouldProposedICLMessageShow){
		            adminCompSummaryData.proposedIclBackgroundClass = " bg-success ";
		            adminCompSummaryData.proposedIclTextClass = " text-success ";
		            adminCompSummaryData.proposedIclMessage = `The proposed compensation is under the ICL based on the information you have entered.
		    		If you have flagged the candidate as a participant in the NSTP,
		    		APO will contact you if the NSTP rate causes the candidate’s proposed compensation to exceed the ICL.`;
		        }
		        if(!shouldApprovedICLMessageShow){
		            adminCompSummaryData.approvedIclBackgroundClass = " bg-success ";
		            adminCompSummaryData.approvedIclTextClass = " text-success ";
		            adminCompSummaryData.approvedIclMessage = `The approved compensation is under the ICL based on the information you have entered.
		    		If you have flagged the candidate as a participant in the NSTP,
		    		APO will contact you if the NSTP rate causes the candidate’s approved compensation to exceed the ICL.`;
		        }
		        adminCompSummaryData.iclThreshold = threshold;
		}
        return adminCompSummaryData;
    }

/******************************************************************************
 *
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/


    handlePromise = async (promise) => {
        let response = await promise;
        console.log("In handle Promise to refresh datatable after delete");
        if(response && response.length>=0){
            let rowData = await this.Logic.configureData(response);
            rowData = this.Logic.formatRowDataAfterDelete(rowData);
            rowData = this.Logic.filterAPITableData(rowData);
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
   * @desc - Shows the danger modal for success
   * @returns {JSX}
   *
   **/
    getCompensationSuccessModal({showDeleteSuccessModal, compensationStringValue,
     comingFromDatatable} = this.state) {
        return <CompensationSuccessModal {...{showSuccessModal: showDeleteSuccessModal,
             compensationStringValue, comingFromDatatable}}
             changeStateOfSuccessModal={this.changeStateOfDeleteSuccessModal} />;
    }

    changeStateOfDeleteSuccessModal = async () => {
     // Dismissing success Modal changes state of success modal in parent
     // to disable success modal from showing twice due to formatting completed cases datatable
        this.setState({showDeleteSuccessModal: false});

     // Refresh datatable
        let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true, false);
        this.setState({rowData, sortingTextOrder, maxRowCount});
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
        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
    }

    dismissSuccessModal = () => {
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

        let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}}} = this;

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

    /******************************************************************************
     *
     * @desc - Endowed Chair modal
     *
     ******************************************************************************/

    /**
   *
   * @desc - Shows the danger modal for success
   * @returns {JSX}
   *
   **/
    getEndowedChairModal({showDeleteSuccessModal, compensationStringValue,
      comingFromDatatable} = this.state) {
         return <EndowedChairModal {...{showSuccessModal: showDeleteSuccessModal,
              compensationStringValue, comingFromDatatable}}
              changeStateOfSuccessModal={this.changeStateOfDeleteSuccessModal} />;
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
      dataTableConfiguration, maxRowCount, disableAddNewButton, totals}, tableClassName, resetTable,
      onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort, modalId} = this;
    // new proposal modal 4-26-2021
        let getAddProposalModal = this.getAddProposalModal();
        let getCompensationSuccessModal = this.getCompensationSuccessModal();
        let getEndowedChairModal = this.getEndowedChairModal();
        return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>

        {changeColumnsModal}
        {this.getDeleteModal()}
        {this.getSuccessModal()}
        {this.showFilterModal()}
        {/* new proposal modal  control k c*/}
        {getAddProposalModal}
        {getCompensationSuccessModal}
        {/* {getEndowedChairModal} */}
        <div className="col-md-12">
              <div className="row">
                {/* <button className={"left btn btn-primary bottom-space small-space"} onClick={this.showAddProposalModal}>
                    Add New Proposal
                </button> */}
                <ShowIf show={this.Logic.canAddAdminCompProposals()}>
                  <button className={"left btn btn-primary bottom-space small-space"} onClick={this.showAddProposalModal}
                    disabled={disableAddNewButton}>
                      Add New Proposal
                  </button>
                </ShowIf>

              </div>
        </div>
        <br/><br/>

        {buttonRow}
        <FixedDataTableComponentWithFixedMultiLineFooter ref="datatable" key={resetNumber} {...{rowData,
          resetNumber, tableConfiguration, dataTableConfiguration, totals,
          onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
          tableClassName}}/>

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
