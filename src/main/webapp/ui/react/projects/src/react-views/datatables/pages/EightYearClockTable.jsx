import React from "react";
import PropTypes from "prop-types";

//My imports
import ClockTable from "./ClockTable.jsx";
import EightYearLogic from "../../../opus-logic/datatables/classes/EightYearClock";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import APIResponseModal from "../../common/components/bootstrap/APIResponseModal.jsx";

import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {FormShell, FormGroup} from "../../common/components/forms/FormRender.jsx";
import {FormTextArea} from "../../common/components/forms/FormElements.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

/******************************************************************************
 *
 * @desc - Handles EightYearClockTable via dataTableConfiguration file
 *
 ******************************************************************************/

export default class EightYearClockTable extends ClockTable {
  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        initialCount: PropTypes.number,
        config_name: PropTypes.string
    };

    static defaultProps = {
        initialCount: 0,
        config_name: "eightYearClock"
    }

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
    exportToExcel = false;
    Logic = new EightYearLogic(this.props);
    state = {
        ...this.state,
        renderTable: false,
        canEdit: false,
        showAddModal: false,
        showEditModal: false,
        isSaveButtonDisabled: false,
        isWarningSaveButtonDisabled: false,
        resetNumber: 0,
        fieldDataForAddModal: {},
        serviceUnitTypeMap: {},
        addNewFieldData: {},
        saveError: false,
        comments: null
    }

  /**
   * constructor
   * @desc -
   * @param {Object} props - Props for Datatable
   * @return {void}
   *
   **/
    constructor(props = {}) {
        super(props);
        this.setUpPage();
    }

  /**
   *
   * @desc -
   * @param {Object} this.props - config_name, opusPersonId, profileAPIData
   * @return {void} -
   *
   **/
    async setUpPage({config_name, opusPersonId, profileAPIData} = this.props) {
        this.Logic.setClassData({opusPersonId});
        this.setDataTableConfigurationInfo(config_name);
        this.addOnClickToEditColumnInDatatableConfig();
        this.addOnClickToDeleteColumnInDatatableConfig();
        this.getDataForAddNewModal();
        let {opusPersonTenureArchived} = profileAPIData;
        let archiveMessage = this.Logic.getArchivedMessage(opusPersonTenureArchived);

        let failurePromise = this.getFormattedRowDataInfo(true);
    // debugger;
    //Now set in state for error modal
    //this.setState({failurePromise});

    //Extract the data to format and set in state
        let {rowData, sortingTextOrder, maxRowCount, originalRowData} =
      await failurePromise;

        let {serviceUnitTypeMap} = rowData[0].originalData;
        let fieldData = this.Logic.createFieldData();
        this.Logic.setClassData({fieldData});
        this.Logic.attachServiceUnitTypeOptions(fieldData, serviceUnitTypeMap);


        fieldData.unitTOCYearCount.editable = this.Logic.canEditTOC();
        let canEdit = this.Logic.canEditClockTable();

        let {appointeeInfo: {fullName}} = profileAPIData;
        this.setState({rowData, sortingTextOrder, maxRowCount, originalRowData,
      failurePromise, fieldData, fullName, renderTable: true, archiveMessage, canEdit});
    }

  /**
   *
   * @desc - Catch the error if this promise fails so it doesnt stop execution
   * @param {String} promise - ahPath to filter rowData from
   * @returns {void}
   *
   **/
    async loadFreshRowDataIntoTable() {
        let failurePromise = this.getFormattedRowDataInfo(true);

        let {rowData, sortingTextOrder, maxRowCount, originalRowData} = await failurePromise;

    //Set in state for error modal
        this.setState({failurePromise, rowData, sortingTextOrder, maxRowCount, originalRowData});
    }

    getDataForAddNewModal = async () => {
        let {dataTableConfiguration} = this.state;
        let addNewPromise = await this.Logic.getDataForAddNewModal();
        if(addNewPromise.serviceUnitTypeMap){
            this.setState({serviceUnitTypeMap: addNewPromise.serviceUnitTypeMap, 
              addNewFieldData: addNewPromise});
        }else{
            console.log("getDataForAddNewModal API Error");
        }
    }

  /**
   *
   * @desc - Resets parameters
   * @returns {void}
   *
   **/
    resetTable = () => {
        let {resetNumber} = this.state;
        let dataTableConfiguration = this.Logic.resetDataTableConfiguration();

        this.addOnClickToEditColumnInDatatableConfig(dataTableConfiguration);
        this.addOnClickToDeleteColumnInDatatableConfig(dataTableConfiguration);

        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
        let formattedColumnOptions = this.getBootStrapModalOptions();
        this.setState({dataTableConfiguration, formattedColumnOptions,
      resetNumber: ++resetNumber});
    }

  /**
   *
   * @desc - Add onClick function for "edit" to show modal
   * @param {Object} dataTableConfiguration -
   * @returns {Object} dataTableConfiguration
   *
   **/
    addOnClickToEditColumnInDatatableConfig(dataTableConfiguration =
    this.Logic.dataTableConfiguration) {
        dataTableConfiguration.columnConfiguration.edit.onClick = this.openEditModal;
        return dataTableConfiguration;
    }

      /**
   *
   * @desc - Add onClick function for "edit" to show modal
   * @param {Object} dataTableConfiguration -
   * @returns {Object} dataTableConfiguration
   *
   **/
    addOnClickToDeleteColumnInDatatableConfig(dataTableConfiguration =
    this.Logic.dataTableConfiguration) {
        dataTableConfiguration.columnConfiguration.delete.onClick = (evt, row) => this.openDeleteModal(evt, row);
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Saves data, disables button when saving, and loads error modal
   * @returns {void}
   *
   **/
    startSave = async (typeOfSave) => {
      //Extract variables to save
        let fieldData = this.state.fieldData;

      // RE-313 Validate academic year for add new modal
        if(typeOfSave==="add"){
            fieldData = this.state.fieldDataForAddModal;
            this.Logic.validateAcademicYear(fieldData);
        }
        this.Logic.validateFieldData(fieldData);
        let hasErrors = this.Logic.doFieldsHaveErrors(fieldData);

        if(!hasErrors) {
            this.saveFields(fieldData, typeOfSave);
        }else{
            this.setState({saveError: true});
        }

      //Set state no matter what to rerender the fields
      // RE-313 Update state for edit or add new modal fields
        typeOfSave === "edit" ? this.setState({fieldData}) : this.setState({fieldDataForAddModal: fieldData});
    }

  /**
   *
   * @desc - Saves data, disables and enables buttons, sets up promise for modal
   * @returns {void}
   *
   **/
    saveFields = async (fieldData, typeOfSave) => {
      //Extract variables to save
        let originalData = {};
      // RE-313 Add new blank object for field data
        if(typeOfSave==="add"){
            originalData = this.state.addNewFieldData;
        }else{
            originalData = this.state.currentAPIResult.originalData;
        }
      // Attach comments field
        originalData.comments = this.state.comments;

      //Disable button so they cant keep saving
        this.setState({isSaveButtonDisabled: true, saveError: false});

      //Perform save
        let promise = this.Logic.saveData(fieldData, originalData, typeOfSave);

        try {
          //Wait for promise to resolve
            await promise;
        } catch(e) {
            console.log("ERROR: api call in 'saveFields' in EightYearClockTable.jsx"); 
            console.log(e);
            if(e.responseJSON && e.responseJSON.message){
                this.setState({failureMessage: e.responseJSON.message});
            }
        }

    //Send promise to APIRResponseModal for error notification
        this.setState({promise, isSaveButtonDisabled: false});


        //Hide the add/edit modal
        if(typeOfSave==="edit"){
            this.closeEditModal();
        }else{
            this.closeAddModal();
        }

    //Reload the page
        this.loadFreshRowDataIntoTable();
    }


  /******************************************************************************
 *
 * @desc - Add New Modal functions
 *
 ******************************************************************************/
/**
   *
   * @desc - Opens modal and sets the original field data
   * @param {Event} evt - click event for opening modal
   * @param {Object} props -
   * @returns {void}
   *
   **/
    openAddModal = (evt, props = {}) => {
        let {serviceUnitTypeMap, rowData, addNewFieldData} = this.state;
        let fieldDataForAddModal = this.Logic.createFieldData();

        this.Logic.attachServiceUnitTypeOptions(fieldDataForAddModal, serviceUnitTypeMap);
        fieldDataForAddModal.academicYear.dataType = "options";
        fieldDataForAddModal.academicYear.editable = true;
        fieldDataForAddModal.serviceUnitType.value = "-1";
        addNewFieldData.opusPersonId = rowData[0].opusPersonId;
        
        // Set TOC fields
        fieldDataForAddModal.unitTOCYearCount.editable = this.Logic.canEditTOC();
        fieldDataForAddModal.unitTOCYearCount.value = 0;
        fieldDataForAddModal.unitTOCTakenCount.value = 0;
        this.Logic.fieldData.unitTOCYearCount.value = 0;
        
        // Set preset fields from rowData
        fieldDataForAddModal.fourthYearAppraisalEffDt.value = rowData[0].fourthYearAppraisalEffDt;
        fieldDataForAddModal.fourthYearAppraisalElgEffDt.value = rowData[0].fourthYearAppraisalElgEffDt;
        fieldDataForAddModal.fourthYearAppraisalOutcome.value = rowData[0].fourthYearAppraisalOutcome;

        fieldDataForAddModal.eightYearLimitEffDt.value = rowData[0].eightYearLimitEffDt;
        fieldDataForAddModal.eightYearLimitElgEffDt.value = rowData[0].eightYearLimitElgEffDt;
        fieldDataForAddModal.eightYearLimitOutcome.value = rowData[0].eightYearLimitOutcome;

        // Attach years for academic year dropdown options:
        this.Logic.attachAcademicYearOptions(fieldDataForAddModal);
    
        //Set state to show
        this.setState({showAddModal: true, fieldDataForAddModal, addNewFieldData, comments: null});
    }

/**
 *
 * @desc - Closes modal
 * @returns {void}
 *
 **/
    closeAddModal = () => {
        this.setState({showAddModal: false});
        let {fieldDataForAddModal} = this.state;
        fieldDataForAddModal = this.Logic.clearValidationErrors(fieldDataForAddModal);
        this.setState({fieldDataForAddModal, saveError: false});
    }

/**
 *
 * @desc - Change event handler
 * @param {Event} evt - Click event
 * @returns {void}
 *
 **/
    onChangeAddModal = (evt) => {
        let {name, value} = evt.target;
        // RE-313 Add New Modal needs this value consistent for validation
        if(name==="unitTOCYearCount"){
            this.Logic.fieldData.unitTOCYearCount.value = value;
        }
        this.updateFieldDataForAddModal(name, value);
    }

    onChangeAddModalComment = (evt) => {
        let comments = evt.target.value;
        this.setState({comments});
    }

/**
 *
 * @desc - Gets modal for editing fields
 * @returns {void}
 *
 **/
    getAddModal() {
        let {fullName, fieldDataForAddModal, showAddModal, comments, isSaveButtonDisabled}
    = this.state;
        return (
    <Modal bsSize="large" className="modal-lg" backdrop="static"
      show={showAddModal} onHide={this.closeAddModal}>
      <Header className=" modal-info " closeButton>
        <Title id="ModalHeader"> <h1> Eight Year Clock </h1> </Title>
      </Header>
      <Body>
        <h2 className="flush-top">{fullName}</h2>
        <FormShell>
          <FormGroup onChange={this.onChangeAddModal} fields={fieldDataForAddModal} />
          Comments (Maximum 250 characters.)
          <FormTextArea onChange={this.onChangeAddModalComment}
            value={comments} />
        </FormShell>

        <ShowIf show={this.state.saveError}>
          <p className="error_message">
            Please check form for errors
          </p>
        </ShowIf>
      </Body>
      <Footer>
        <button disabled={isSaveButtonDisabled} onClick={() => this.startSave("add")}
          className="left btn btn-primary" >
          Save
        </button>
        <Dismiss onClick={this.closeAddModal} className="left btn btn-link">
          Cancel
        </Dismiss>
      </Footer>
    </Modal>
  );
    }

/******************************************************************************
 *
 * @desc - Edit Modal Functions
 *
 ******************************************************************************/
  /**
   *
   * @desc - Opens modal and sets the original field data
   * @param {Event} evt - click event for opening modal
   * @param {Object} props -
   * @returns {void}
   *
   **/
    openEditModal = (evt, props = {}) => {
    //Extract the data
        let {fieldData} = this.state;
        let {rowData, rowData: {academicYear, affiliation}} = props;

    //Attach values to form fields
        this.Logic.attachRowValuesToFieldData(fieldData, rowData);

    //Set state to show
        this.setState({showEditModal: true, affiliation, fieldData, academicYear,
      currentAPIResult: rowData, comments: rowData.originalData.comments});
    }

  /**
   *
   * @desc - Closes modal
   * @returns {void}
   *
   **/
    closeEditModal = () => {
        this.setState({showEditModal: false});
        let {fieldData} = this.state;
        fieldData = this.Logic.clearValidationErrors(fieldData);
        this.setState({fieldData, saveError: false});
    }

  /**
   *
   * @desc - Change event handler
   * @param {Event} evt - Click event
   * @returns {void}
   *
   **/
    onChangeEditModal = (evt) => {
        let {name, value} = evt.target;
        this.updateFieldData(name, value);
    }

  /**
   *
   * @desc - Gets modal for editing fields
   * @returns {void}
   *
   **/
    getEditModal() {
        let {academicYear, fullName, fieldData, showEditModal, isSaveButtonDisabled, comments}
      = this.state;
        return (
      <Modal bsSize="large" className="modal-lg" backdrop="static"
        show={showEditModal} onHide={this.closeEditModal}>
        <Header className=" modal-info " closeButton>
          <Title id="ModalHeader"> <h1> Eight Year Clock </h1> </Title>
        </Header>
        <Body>
          <h2 className="flush-top">{fullName}</h2>
          <p> {academicYear} </p>
          <FormShell>
            <FormGroup onChange={this.onChangeEditModal} fields={fieldData} />
          </FormShell>
          Comments (Maximum 250 characters.)
          <FormTextArea onChange={this.onChangeAddModalComment}
            value={comments} />
          <ShowIf show={this.state.saveError}>
            <p className="error_message">
              Please check form for errors
            </p>
          </ShowIf>
        </Body>
        <Footer>
          <button disabled={isSaveButtonDisabled} onClick={() => this.startSave("edit")}
            className="left btn btn-primary" >
            Save
          </button>
          <Dismiss onClick={this.closeEditModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

    startDelete = async () => {
        let {selectedDeleteData} = this.state;
        this.setState({isWarningSaveButtonDisabled: true});
        let deletePromise =this.Logic.getDeletePromise(selectedDeleteData, "8YC");
          //Wait for api to save or error out before proceeding
        try {
            await deletePromise;
            //Reload the page
            this.loadFreshRowDataIntoTable();
        } catch(e) {
            console.log("ERROR: api call in 'startDelete' in EightYearClockTable.jsx"); 
            this.setState({promise: deletePromise});
        }

        this.setState({showWarningModal: false, isWarningSaveButtonDisabled: false});
    }


    getEightYearClockDisplay = () => {
        let {rowData} = this.state;
        let displayObject = {};
        if(rowData.length>0){
            let data = rowData[0];
            if(data.fourthYearAppraisalEffDt!==null){
                displayObject.eff4th = data.displayValue_fourthYearAppraisalEffDt;
                displayObject.outcome4th = data.fourthYearAppraisalOutcome;
                displayObject.showOutcome4th = true;
            }else{
                displayObject.est4th = data.fourthYearAppraisalElgEffDt;
                displayObject.showOutcome4th = false;
            }
            if(data.eightYearLimitEffDt!==null){
                displayObject.eff8year = data.displayValue_eightYearLimitEffDt;
                displayObject.outcome8year = data.eightYearLimitOutcome;
                displayObject.showOutcome8Year = true;
            }else{
                displayObject.est8year = data.eightYearLimitElgEffDt;
                displayObject.showOutcome8Year = false;
            }
        }
        return (
      <div>
        {displayObject.showOutcome4th ? 
          <span>
            <div>Effective Date of 4th Year Appraisal: {displayObject.eff4th}</div>
            <div>Outcome of 4th Year Appraisal: {displayObject.outcome4th}</div>
          </span>
        :
          <span>
            <div>Estimated Date of 4th Year Appraisal: {displayObject.est4th}</div>
          </span>
        }
        {displayObject.showOutcome8Year ? 
          <span>
            <div>Effective Date of Eight-Year Review: {displayObject.eff8year}</div>
            <div>Outcome of Eight-Year Review: {displayObject.outcome8year}</div>
          </span>
        :
          <span>
            <div>Estimated Date of Eight-Year Review: {displayObject.est8year}</div>
          </span>
        } 
      </div>
    );
    }

    /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow() {
        let {state: {sortingTextOrder, disableExportToExcel, canEdit}} = this;
  
        return (
        <div className=" button-row ">
          <ShowIf show={canEdit}>
            <button className="btn btn-sm btn-gray table-top" onClick={this.openAddModal}>
              Add Row
            </button>
          </ShowIf>

          <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
            Change Columns
          </button>
  
          <button className=" btn btn-sm btn-gray table-top"
            onClick={this.resetTable}>
            Reset Table
          </button>
  
          <ShowIf show={this.exportToExcel}>
            <button className=" btn btn-sm btn-gray table-top export-to-excel pull-right"
              disabled={disableExportToExcel} onClick={this.exportCSV} >
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
        let eightYearClockDisplay = this.getEightYearClockDisplay();
        let addModal = this.getAddModal();
        let editModal = this.getEditModal();
        let warningModalForDelete = this.getWarningModalForDelete();
        let buttonRow = this.getButtonRow();
        let changeColumnsModal = this.getChangeColumnsModal();
        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount, failurePromise, promise, failureMessage}, resetTable,
    onMultiSelectClick, onSearchTextFilter, onClickSort} = this;

        return (
      <div className=" datatable-root ">
        <h2>Eight Year Clock</h2>
        <p className="instructions">
          This table displays service accrued toward the Eight-Year Limit
          for assistant professors and researchers. See Appendix 14 of the
          CALL for details on how time towards the Eight-Year Limit is
          calculated and for information about requesting time off the clock
          for your faculty.
        </p>
        <p>{this.state.archiveMessage}</p>
        <p className=" error_message "> {error_message} </p>
        {eightYearClockDisplay}
        {addModal}
        {editModal}
        {warningModalForDelete}
        {buttonRow}
        {changeColumnsModal}
        <APIResponseModal {...{failurePromise, promise, failureMessage}} />
        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, tableConfiguration, resetTable, maxRowCount,
            dataTableConfiguration, onMultiSelectClick, onClickSort,
            onSearchTextFilter}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
