import React from "react";
import {keys} from "lodash";
import PropTypes from "prop-types";
// import {keys} from 'lodash';
// import {Button} from 'react-bootstrap';
//My imports
import DataTableComponent from "./DataTableBase.jsx";
import Cases from "../../../opus-logic/datatables/classes/Cases";
import DeleteOrWithdrawCase from "../../../opus-logic/cases-admin/DeleteOrWithdrawCase";
import DeleteOrWithdrawCaseModal from "../../cases-admin/DeleteOrWithdrawCaseModal.jsx";
import DeleteOrWithdrawCaseFromInterfolioModal from "../../cases-admin/DeleteOrWithdrawCaseFromInterfolioModal.jsx";
import CasesAdminDeleteModal from "../../cases-admin/CasesAdminDeleteModal.jsx";
import ReopenCase from "../../../opus-logic/cases-admin/ReopenCase";
import ReopenCaseModal from "../../cases-admin/ReopenCaseModal.jsx";
import CasesAdminSuccessModal from "../../cases-admin/CasesAdminSuccessModal.jsx";
import {proposedActionFlags} from "../../../opus-logic/datatables/constants/DatatableConstants";

// import * as util from '../../../opus-logic/common/helpers/';
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
// import Modal, {Header, Title, Body, Dismiss, Footer} from
//   '../../common/components/bootstrap/ReactBootstrapModal.jsx';
// import {BootStrapModalCheckboxList} from
//   '../../common/components/bootstrap/ModalCheckBoxes.jsx';
// import {searchCriteria} from '../../../opus-logic/datatables/constants/ActiveCasesConstants';
// import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

/******************************************************************************
 *
 * @desc - Handles Active Cases and Completed Cases based on
 *    dataTableConfiguration file
 *
 ******************************************************************************/
export default class CasesTableComponent extends DataTableComponent {

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
    Logic = new Cases(this.props);
    DeleteOrWithdrawCaseLogic = new DeleteOrWithdrawCase(this.props);
    ReopenLogic = new ReopenCase(this.props);
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
        this.changeStateOfDeleteOrWithdrawModal = this.changeStateOfDeleteOrWithdrawModal.bind(this);
        this.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal
      = this.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal.bind(this);
        this.changeStateOfCasesAdminDeleteModal = this.changeStateOfCasesAdminDeleteModal.bind(this);
        this.changeStateOfDeleteSuccessModal = this.changeStateOfDeleteSuccessModal.bind(this);
        this.changeStateOfReopenSuccessModal = this.changeStateOfReopenSuccessModal.bind(this);
        this.changeStateOfReopenModal = this.changeStateOfReopenModal.bind(this);
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
        comingFromDatatable: true,
        showActiveAppointments: false,
        showInactiveAppointments: false,
        showDeleteOrWithdrawCaseModal: false,
        showDeleteOrWithdrawCaseFromInterfolioModal: false,
        showCasesAdminDeleteModal: false,
        showDeleteWithdrawSuccessModal: false,
        showReopenSuccessModal: false,
        isDeleteOrWithdrawButtonDisabled: false,
        showOnlyButtonClass: "btn-gray"
    };


    setGlobalReloadActiveCasesFunction() {
        window._reloadActiveCases = this.setRowDataInfo;
    }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
    setUpPage() {
        super.setUpPage();
        this.Logic.setDataTableConfigurationShowOnlyFilters(proposedActionFlags);
    }

  /*****************************************************************************
   *
   * @name Delete Or Withdraw Section
   * @desc - Section for deleting or withdrawing a case
   *
   *****************************************************************************/

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
    attachOnClickForDeleteColumn(dataTableConfiguration) {
        if(dataTableConfiguration.columnConfiguration.delete) {
            dataTableConfiguration.columnConfiguration.delete.onClick =
        this.setDeleteOrWithdrawCaseInfo;
        }
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
    showDeleteOrWithdrawCaseFromInterfolioModal: false});

    //  format data so that the delete/withdraw modals show the correct info
        let effectiveDate = rowData.originalData.approvedEffectiveDt;
        let effectiveType = "approved";
        if(!effectiveDate){
            effectiveDate = rowData.displayValue_proposedEffectiveDate;
            effectiveType = "proposed";
        }
    // Checks for linked actions in interfolio case
    // and attaches formatted info
        if(rowData.originalData.actionLinkedToByCCase){
            rowData.actionLinkedToByCCase
      = this.DeleteOrWithdrawCaseLogic.formatActionsLinkedToByCCase(rowData.originalData.actionLinkedToByCCase);
        }
        rowData.effectiveTypeForDisplayInModal = effectiveType;
        rowData.effectiveDateForDisplayInModal = effectiveDate;
        rowData.unitValueForDisplayInModal = rowData.originalData.ahName;
    // OPUSDEV-3323 change current workflow step from location to caseLocation
        rowData.caseLocationForDisplayInModal = rowData.originalData.caseLocation;
        let adminName= this.Logic.adminData.adminName;
        let adminFirstName= this.Logic.adminData.adminFirstName;
        this.setState({showDeleteOrWithdrawCaseModal: true, deleteOrWithdrawData: rowData, adminName, adminFirstName});
    }

  /**
   *
   * @desc - Intermediary to send to the logic class to delete this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
    deleteOrWithdrawCase = async (DeleteOrWithdrawSelection) => {
        this.setState({deleteOrWithdrawSelection: DeleteOrWithdrawSelection,
      casesAdminTypeStringValue: DeleteOrWithdrawSelection,
      showDeleteOrWithdrawCaseModal: false});
    // First checks to see if it attached to an interfolio case
        if(this.state.deleteOrWithdrawData.originalData.bycPacketId){
            this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: true});
        }else{
      // If not, then proceed with either delete danger modal or
      // go forward with deleteOrWithdrawOpusCaseAndInterfolioCase
      // if(DeleteOrWithdrawSelection==="delete"){
            this.setState({showCasesAdminDeleteModal: true});
      // }else{
      //   this.deleteOrWithdrawOpusCaseAndInterfolioCase("withdrawJustOpusCase", DeleteOrWithdrawSelection)
      // }
        }
    }

  /**
   *
   * @desc - Intermediary to send to the logic class to delete this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
    interfolioSelection = async (interfolioSelection) => {
        this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: false});
    // if(this.state.deleteOrWithdrawSelection==="delete"){
        this.setState({showCasesAdminDeleteModal: true, interfolioSelection: interfolioSelection});
    // }else{
    //   this.deleteOrWithdrawOpusCaseAndInterfolioCase(interfolioSelection, this.state.deleteOrWithdrawSelection)
    // }
    }

  /**
   *
   * @desc - Intermediary to send to the logic class to delete this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
    deleteOrWithdrawOpusCaseAndInterfolioCase = async (comments) => {

    //Must disable buttons to ensure no double/triple saves
        this.setState({isDeleteOrWithdrawButtonDisabled: true});
    // Set local variables from state
        let DeleteOrWithdrawSelectionLocal = this.state.deleteOrWithdrawSelection;
        let DeleteOrWithdrawInterfolioCaseSelectionLocal = this.state.interfolioSelection;

    // //  withdraw with no interfolio case
    // if(DeleteOrWithdrawInterfolioCaseSelection === 'withdrawJustOpusCase'
    //   || (DeleteOrWithdrawSelection === 'withdraw' && DeleteOrWithdrawInterfolioCaseSelection === 'no')){
    //   DeleteOrWithdrawSelectionLocal = DeleteOrWithdrawSelection;
    //   DeleteOrWithdrawInterfolioCaseSelectionLocal = 'no';
    // }
    //
    // // withdraw with interfolio case
    // if(DeleteOrWithdrawInterfolioCaseSelection === 'yes'
    //   && DeleteOrWithdrawSelection === 'withdraw') {
    //   DeleteOrWithdrawInterfolioCaseSelectionLocal = DeleteOrWithdrawInterfolioCaseSelection;
    //   DeleteOrWithdrawSelectionLocal = DeleteOrWithdrawSelection;
    // }

    //Delete row and get promise back
        let deletePromise = this.DeleteOrWithdrawCaseLogic.deleteOrWithdrawCase(
      this.state.deleteOrWithdrawData, DeleteOrWithdrawInterfolioCaseSelectionLocal,
      DeleteOrWithdrawSelectionLocal, comments);

        try {
            await deletePromise;
            this.setState({showDeleteWithdrawSuccessModal : true});
        } catch(e) {
            console.log("ERROR: api call in 'deleteOrWithdrawOpusCaseAndInterfolioCase' in CasesTable.jsx"); 
            this.setState({promise: deletePromise});
        }

    // Enable buttons & Dismiss modals from wherever you're coming from
        this.setState({isDeleteOrWithdrawButtonDisabled: false,
	showDeleteOrWithdrawCaseFromInterfolioModal: false,
    showCasesAdminDeleteModal: false,
    showDeleteOrWithdrawCaseModal: false});
    }

    changeStateOfDeleteOrWithdrawModal(){
        this.setState({showDeleteOrWithdrawCaseModal: false});
    }

    changeStateOfDeleteOrWithdrawCaseFromInterfolioModal(){
        this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: false});
    }

    changeStateOfCasesAdminDeleteModal(){
        this.setState({showCasesAdminDeleteModal: false});
    }

    back(selection){
        if(selection==="interfolio"){
            this.setState({
                showDeleteOrWithdrawCaseModal: true,
                showDeleteOrWithdrawCaseFromInterfolioModal: false
            });
        }else if(selection==="danger" && this.state.deleteOrWithdrawData.originalData.bycPacketId){
            this.setState({
                showDeleteOrWithdrawCaseFromInterfolioModal: true,
                showCasesAdminDeleteModal: false
            });
        }else if(selection==="danger" && !this.state.deleteOrWithdrawData.originalData.bycPacketId){
            this.setState({
                showDeleteOrWithdrawCaseModal: true,
                showCasesAdminDeleteModal: false
            });
        }
    }

  /**
   *
   * @desc - Shows the modal alert for delete/withdraw case
   * @returns {JSX}
   *
   **/
    getDeleteOrWithdrawCaseModal({showDeleteOrWithdrawCaseModal, 
	deleteOrWithdrawData, isDeleteOrWithdrawButtonDisabled, deleteOnly} = this.state) {
        return <DeleteOrWithdrawCaseModal {...{showDeleteOrWithdrawCaseModal, 
		deleteOrWithdrawData, isDeleteOrWithdrawButtonDisabled, deleteOnly}}
               changeStateOfDeleteOrWithdrawModal={this.changeStateOfDeleteOrWithdrawModal}
               deleteOrWithdrawCase={(DeleteOrWithdrawSelection) =>
               this.deleteOrWithdrawCase(DeleteOrWithdrawSelection)}/>;
    }

   /**
  *
  * @desc - Shows the modal alert for delete/withdraw conneceted to an interfolio case
  * @returns {JSX}
  *
  **/
    getDeleteOrWithdrawCaseFromInterfolioModal({showDeleteOrWithdrawCaseFromInterfolioModal,
    deleteOrWithdrawData, deleteOrWithdrawSelection, isDeleteOrWithdrawButtonDisabled} = this.state) {
        return <DeleteOrWithdrawCaseFromInterfolioModal {...{showDeleteOrWithdrawCaseFromInterfolioModal,
      deleteOrWithdrawData, deleteOrWithdrawSelection, isDeleteOrWithdrawButtonDisabled}}
              changeStateOfDeleteOrWithdrawCaseFromInterfolioModal={this.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal}
              interfolioSelection={(DeleteOrWithdrawInterfolioCaseSelection) =>
              this.interfolioSelection(DeleteOrWithdrawInterfolioCaseSelection)}
              back={() => this.back("interfolio")}
            />;
    }

  /**
   *
   * @desc - Shows the danger modal for delete
   * @returns {JSX}
   *
   **/
    getCasesAdminDeleteModal({showCasesAdminDeleteModal, isDeleteOrWithdrawButtonDisabled, deleteOrWithdrawData, adminName, adminFirstName} = this.state) {
        return <CasesAdminDeleteModal {...{showCasesAdminDeleteModal, isDeleteOrWithdrawButtonDisabled, deleteOrWithdrawData, adminName, adminFirstName}}
               changeStateOfCasesAdminDeleteModal={this.changeStateOfCasesAdminDeleteModal}
               deleteOrWithdrawOpusCaseAndInterfolioCase={this.deleteOrWithdrawOpusCaseAndInterfolioCase}
               deleteOrWithdrawSelection={this.state.deleteOrWithdrawSelection}
               interfolioSelection={this.state.interfolioSelection}
               back={() => this.back("danger")}
             />;
    }

   /**
    *
    * @desc - Shows the danger modal for success
    * @returns {JSX}
    *
    **/
    getCasesAdminSuccessModal({showDeleteWithdrawSuccessModal, casesAdminTypeStringValue,
      comingFromDatatable} = this.state) {
        return <CasesAdminSuccessModal {...{showSuccessModal: showDeleteWithdrawSuccessModal,
              casesAdminTypeStringValue, comingFromDatatable}}
              changeStateOfSuccessModal={this.changeStateOfDeleteSuccessModal} />;
    }

    async changeStateOfDeleteSuccessModal(){
      // Dismissing success Modal changes state of success modal in parent
      // to disable success modal from showing twice due to formatting completed cases datatable
        this.setState({showDeleteWithdrawSuccessModal: false});

      // Refresh datatable
        let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true, false);
        this.setState({rowData, sortingTextOrder, maxRowCount});
    }

  /*****************************************************************************
   *
   * @name Reopen Section
   * @desc - Section for reopening a case
   *
   *****************************************************************************/

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
    attachOnClickForReopenColumn(dataTableConfiguration) {
        if(dataTableConfiguration.columnConfiguration.reopen) {
            dataTableConfiguration.columnConfiguration.reopen.onClick =
        this.setReopenCaseInfo;
        }
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - determines if there is an interfolio case attached to the opus case
   * @param {Event} evt - click event
   * @param {Object} rowData - case that will be reopened
   * @returns {void}
   *
   **/
    setReopenCaseInfo = (evt, {rowData} = {}) => {
        this.setState({showReopenSuccessModal: false, casesAdminTypeStringValue: "reopen"});

    // Checks to see if interfolio case is attached to opus case
    // by checking if case has a bycPacketId
        if(rowData.originalData.bycPacketId){
            this.setState({showReopenCaseModal: true, reopenData: rowData});
        }else{
            this.reopenOpusCaseAndInterfolioCase("reopenJustOpusCase", rowData);
        }
    }

  /**
   *
   * @desc - Intermediary to send to the logic class to reopen this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
    reopenOpusCaseAndInterfolioCase = async (reopenInterfolioCaseSelection, rowDataReopenDataInput) => {

    // ReopenInterfolioCaseSelection is the input of either 'yes' or 'no' from the reopen case modal or
    //  "reopenJustOpusCase" which means there is no interfolio case attached to it
        let rowDataLocal = this.state.reopenData;
        if(reopenInterfolioCaseSelection === "reopenJustOpusCase"){
            rowDataLocal = rowDataReopenDataInput;
        }

    // Gets actionCategoryId & actionTypeId and sets into state
        let caseId = rowDataLocal.originalData.caseId;
        let actionType = rowDataLocal.originalData.actionCategoryId
      + "-" + rowDataLocal.originalData.actionTypeId;

    // Gets the url for the 'go to case summary' button after successfully reopening case
        let href = this.ReopenLogic.getCaseCreatedUrl(caseId, actionType);
        this.setState({caseSummaryCaseUrl: href});

    //get promise back
        let reopenPromise = this.ReopenLogic.reopenCase(rowDataLocal, reopenInterfolioCaseSelection, "Reopened Case");

    //Wait for api to save or error out before proceeding
        try {
            await reopenPromise;
            this.setState({showReopenSuccessModal : true});
        } catch(e) {
            console.log("ERROR: api call in 'reopenOpusCaseAndInterfolioCase' in CasesTable.jsx"); 
            this.setState({promise: reopenPromise});
        }

        this.setState({showReopenCaseModal: false});
    }

    changeStateOfReopenModal(){
    // Dismissing reopen Modal changes state of reopen modal in parent
    // to disable reopen modal from showing twice due to reopening final decision modal
        this.setState({showReopenCaseModal: false});
    }

  /**
   *
   * @desc - rendering ReopenCaseModal determined by the state of showReopenCaseModal
   * @returns {JSX} - ReopenCaseModal jsx
   *
   **/
    getReopenCaseModal({showReopenCaseModal, reopenData} = this.state) {
        return <ReopenCaseModal {...{showReopenCaseModal, reopenData}}
              changeStateOfReopenModal={this.changeStateOfReopenModal}
              reopenOpusCaseAndInterfolioCase={(selection, rowDataInput) =>
              this.reopenOpusCaseAndInterfolioCase(selection, rowDataInput)}/>;
    }

    async changeStateOfReopenSuccessModal(){
    // Dismissing success Modal changes state of success modal in parent
    // to disable success modal from showing twice due to formatting completed cases datatable
        this.setState({showReopenSuccessModal: false});

    // Refresh datatable
        let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true, false);
        this.setState({rowData, sortingTextOrder, maxRowCount});
    }

  /**
  *
  * @desc - This is the success modal
  * @return {JSX} - caseReopenedSuccessModal jsx
  *
  **/
    getCaseReopenSuccessModal({showReopenSuccessModal, caseSummaryCaseUrl,
    comingFromDatatable, casesAdminTypeStringValue, deleteOnly} = this.state) {
        return <CasesAdminSuccessModal {...{showSuccessModal: showReopenSuccessModal, redirectUrl: caseSummaryCaseUrl,
      comingFromDatatable, casesAdminTypeStringValue, deleteOnly}}
      changeStateOfSuccessModal={this.changeStateOfReopenSuccessModal}/>;
    }

  /*****************************************************************************
   *
   * @name Show Only Filters
   * @desc -
   *
   *****************************************************************************/

  /**
   *
   * @desc - Filter table data by checked checkboxes and then update table
   * @param {Object} evt -
   * @returns {void}
   *
   **/
    specialShowOnlyAPICall = (showOnlyFilterIndex, checked, dataTableConfiguration) => {
        let showActive = this.state.showActiveAppointments;
        let showInactive = this.state.showInactiveAppointments;
        let showOnlyFilterString = "all";
        if(showOnlyFilterIndex==="5"){
      // Active Appointments clicked
            if(checked){
        // Checked active
                this.setState({showActiveAppointments: true});
                showInactive ? showOnlyFilterString = "none" : showOnlyFilterString = "active";
            }else{
        // Unchecked active
                this.setState({showActiveAppointments: false});
                showInactive ? showOnlyFilterString = "inactive" : showOnlyFilterString = "all";
            }
        }else{
      // Inactive appointments clicked
            if(checked){
        // Checked Inactive
                this.setState({showInactiveAppointments: true});
                showActive ? showOnlyFilterString = "none" : showOnlyFilterString = "inactive";
            }else{
        // Unchecked Inactive
                this.setState({showInactiveAppointments: false});
                showActive ? showOnlyFilterString = "active" : showOnlyFilterString = "all";
            }
        }
        this.setState({specialShowOnlyFilter: showOnlyFilterString});
        dataTableConfiguration.apptStatus = showOnlyFilterString;

        return dataTableConfiguration;
    }

    setActiveStatus(dataTableConfiguration){
        let outsideFilters = dataTableConfiguration.currentView.filters.dataColumnFilters.outsideFilters;
        let active = false;
        let inactive = false;
        if(outsideFilters[5]){
            active = true;
        }
        if(outsideFilters[6]){
            inactive = true;
        }
        let showOnlyFilterString = "all";
        if(active && inactive){
            showOnlyFilterString = "none";
        }else if(active && !inactive){
            showOnlyFilterString = "active";
        }else if(!active && inactive){
            showOnlyFilterString = "inactive";
        }
        this.setState({specialShowOnlyFilter: showOnlyFilterString});
        dataTableConfiguration.apptStatus = showOnlyFilterString;

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
    getFilterButtonJSX(names = keys(proposedActionFlags)) {
        let {dataTableConfiguration} = this.Logic;
        let isChecked = dataTableConfiguration.dataColumnFilters.outsideFilters;

        return (
      <span className="form-group dropdown">
        <button className={"btn btn-sm table-top dropdown-toggle "
          +this.state.showOnlyButtonClass} type="button" data-toggle="dropdown">
          Show Only &nbsp; &nbsp;
          <span className="caret" />
        </button>
        <ul className="dropdown-menu cases-show-only">
          {names.map((name) =>
            (<li key={name}>
              <div className="checkbox">
                <label>
                  <input {...{name, id: name}} type="checkbox"
                    className="table-top dropdown-toggle"
                    onClick={this.filterOnClickCheckbox}
                    checked={!!isChecked[name]}/>
                  {proposedActionFlags[name].displayName}
                </label>
              </div>
            </li>))
          }
        </ul>
      </span>
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
        let responseModal = this.getAPIResponseModal();
        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, resetTable, onMultiSelectClick,
      onSearchTextFilter, onClickSort, tableClassName} = this;

        return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>

        {buttonRow}
        {responseModal}
        {changeColumnsModal}
        {this.showFilterModal()}
        <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
          resetNumber, tableConfiguration, resetTable, dataTableConfiguration,
          onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
          tableClassName}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
