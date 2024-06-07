import React from "react";
import PropTypes from "prop-types";

//My imports
import ClockTable from "./ClockTable.jsx";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import {FormShell, FormGroup} from "../../common/components/forms/FormRender.jsx";
import ExcellenceLogic from "../../../opus-logic/datatables/classes/ExcellenceClock";
import {FormTextArea} from "../../common/components/forms/FormElements.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import APIResponseModal from "../../common/components/bootstrap/APIResponseModal.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";


/******************************************************************************
 *
 * @desc - Handles Salary via dataTableConfiguration file
 *
 ******************************************************************************/
export default class ExcellenceClockTable extends ClockTable {
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
        config_name: "excellenceClock"
    }

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
    exportToExcel = false;
    Logic = new ExcellenceLogic(this.props);
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
        saveError: false,
        comments: null
    }

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
   * @desc - Start off the page
   * @return {void}
   *
   **/
    componentWillMount() {
        this.isPageViewable();
        this.setUpPage();
    }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
    async setUpPage({config_name, opusPersonId, profileAPIData, rowData, maxRowCount}
    = this.props) {
        let {fullName, fieldData} = this.Logic.initExcellenceClockPage(profileAPIData,
      {rowData, opusPersonId});
        this.getDataForAddNewModal(profileAPIData);
        this.setDataTableConfigurationInfo(config_name);
        this.addOnClickToEditColumnInDatatableConfig();
        this.addOnClickToDeleteColumnInDatatableConfig();
        let canEdit = this.Logic.canEditClockTable();

        this.setState({rowData, originalRowData: rowData, maxRowCount, fieldData,
      fullName, renderTable: true, canEdit});
    }

    getDataForAddNewModal = async (profileAPIData) => {
        let addNewPromise = await this.Logic.getDataForAddNewModal();
      
        if(addNewPromise.serviceUnitTypeMap){
            this.setState({serviceUnitTypeMap: addNewPromise.serviceUnitTypeMap, addNewPromise});
        }
    }

  /**
   *
   * @desc - After saving, reload the table by getting the row values by ahPath
   * @param {String} ahPathId - ahPath to filter rowData from
   * @returns {void}
   *
   **/
    async loadRowDataByAHPathID(ahPathId) {
        let {maxRowCount} = this.state;
        let failurePromise = this.Logic.getFormattedRowDataFromServer();

        //Set for error modal
        this.setState({failurePromise});
        let originalRowData = await failurePromise;
        let {oldRowDataByAHPathID} = this.Logic.getTableDataByAHPathId(originalRowData);
        this.setState({rowData: oldRowDataByAHPathID[ahPathId], maxRowCount: maxRowCount-1});
        this.Logic.rowData = oldRowDataByAHPathID[ahPathId];
        this.Logic.maxRowCount = maxRowCount-1;
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
        dataTableConfiguration.columnConfiguration.delete.onClick =  (evt, row) => this.openDeleteModal(evt, row);
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Updates fields you see in modal
   * @param {String} name - name of field
   * @param {String} value - value of field
   * @returns {void}
   *
   **/
    updateFieldData(name, value) {
        let {fieldData} = this.state;
        fieldData[name].value = value;
        this.setState({fieldData});
    }

  /**
   *
   * @desc - Change event handler
   * @param {Event} evt - Click event
   * @returns {void}
   *
   **/
    onChange = (evt) => {
        let {name, value} = evt.target;
        this.updateFieldData(name, value);
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
        
        let hasErrors = this.Logic.doFieldsHaveErrors(fieldData);
        if(!hasErrors) {
            this.saveData(fieldData, typeOfSave);
        }else{
            this.setState({saveError: true});
        }
  
        //Set state no matter what to rerender the fields
        // RE-313 Update state for edit or add new modal fields
        typeOfSave === "edit" ? this.setState({fieldData}) : this.setState({fieldDataForAddModal: fieldData});
    }

  /**
   *
   * @desc - Saves data, disables button when saving, and loads error modal
   * @returns {void}
   *
   **/
    saveData = async (fieldData, typeOfSave) => {
      //Extract variables to save
        let {currentAPIResult} = this.state;

        let {appointmentInfo: {academicHierarchyInfo: {academicHierarchyPathId}}} = currentAPIResult;

      // Attach comments field
        currentAPIResult.comments = this.state.comments;

      //Disable button so they cant keep saving & remove any save error messages
        this.setState({isSaveButtonDisabled: true, saveError: false});

      //Perform save
        let promise = this.Logic.saveData(fieldData, currentAPIResult, typeOfSave);

        try {
          //Wait for promise to resolve
            await promise;
        } catch(e) {
            console.log("ERROR: api call in 'saveData' in ExcellenceClockTable.jsx"); 
            console.log(e);
            if(e.responseJSON && e.responseJSON.message){
                this.setState({failureMessage: e.responseJSON.message, saveError: true});
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
        this.loadRowDataByAHPathID(academicHierarchyPathId);
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
        let {serviceUnitTypeMap, rowData, addNewPromise} = this.state;
        // let {rowData, rowData: {academicYear}} = props;
        let currentAPIResult = addNewPromise;
        let fieldDataForAddModal = this.Logic.createFieldData();

        this.Logic.attachServiceUnitTypeOptions(fieldDataForAddModal, serviceUnitTypeMap);
        fieldDataForAddModal.academicYear.dataType = "options";
        fieldDataForAddModal.academicYear.editable = true;
        currentAPIResult.opusPersonId = rowData[0].opusPersonId;
        
        // Set preset fields from rowData
        fieldDataForAddModal.continuingUnit18ElgEffDt.value = rowData[0].originalData.continuingUnit18ElgEffDt;
        fieldDataForAddModal.continuingUnit18Outcome.value = rowData[0].originalData.continuingUnit18Outcome;
        fieldDataForAddModal.continuingUnit18ReviewEffDt.value = rowData[0].originalData.continuingUnit18ReviewEffDt;

        // Attach years for academic year dropdown options:
        this.Logic.attachAcademicYearOptions(fieldDataForAddModal);

        let ahPathId = rowData[0].originalData.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId;
        currentAPIResult.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId = ahPathId;

        //Set state to show
        this.setState({showAddModal: true, fieldDataForAddModal, currentAPIResult, comments: null});
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
        this.updateFieldDataForAddModal(name, value);
    }

    onChangeModalComment = (evt) => {
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
    <Modal bsSize="large" className="modal-lg" backdrop="static" show={showAddModal}
        onHide={this.closeAddModal}>
        <Header className=" modal-info " closeButton>
          <Title id="ModalHeader"> <h1> Excellence Review Clock </h1> </Title>
        </Header>
        <Body>
          <h2 className="flush-top">{fullName}</h2>
          <FormShell>
            <FormGroup onChange={this.onChangeAddModal} fields={fieldDataForAddModal} />
            Comments (Maximum 250 characters.)
            <FormTextArea onChange={this.onChangeModalComment}
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
            className="left btn btn-primary">Save</button>
          <Dismiss onClick={this.closeAddModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
  );
    }

  /******************************************************************************
 *
 * @desc - Edit Modal functions
 *
 ******************************************************************************/

  /**
   *
   * @desc - Opens the modal. Sets the values from the row in form fields
   * @param {Event} evt - Click event
   * @param {Object} props - Opens the modal. Sets the values from the row in
   *  form fields
   * @returns {void}
   *
   **/
    openEditModal = (evt, props = {}) => {
    //Extract the data
        let {fieldData} = this.state;
        let {rowData, rowData: {originalData, academicYear}} = props;
        let {appointmentInfo: {academicHierarchyInfo: {departmentName}, affiliationType: {affiliation}}} = originalData;

    //Attach values to form fields
        this.Logic.attachRowValuesToFieldData(fieldData, rowData);

    //Set state to show
        this.setState({showEditModal: true, departmentName, affiliation, fieldData,
      academicYear, currentAPIResult: originalData, comments: originalData.comments});
    }

  /**
   *
   * @desc - Close edit modal for fields
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
   * @desc - Gets modal for editing fields
   * @returns {JSX} - jsx for edit modal
   *
   **/
    getEditModal() {
        let {departmentName, affiliation, academicYear, fullName, fieldData, comments,
      showEditModal} = this.state;
        return (
      <Modal bsSize="large" className="modal-lg" backdrop="static" show={showEditModal}
        onHide={this.closeEditModal}>
        <Header className=" modal-info " closeButton>
          <Title id="ModalHeader"> <h1> Excellence Review Clock </h1> </Title>
        </Header>
        <Body>
          <h2 className="flush-top">{fullName}</h2>
          <p>
            {`${departmentName} - ${affiliation}`} <br/>
            {academicYear}
          </p>
          <FormShell>
            <FormGroup onChange={this.onChange} fields={fieldData} />
            Comments (Maximum 250 characters.)
            <FormTextArea onChange={this.onChangeModalComment}
              value={comments} />
          </FormShell>
          <ShowIf show={this.state.saveError}>
            <p className="error_message">
              Please check form for errors
            </p>
          </ShowIf>
        </Body>
        <Footer>
          <button disabled={this.state.isSaveButtonDisabled} onClick={() => this.startSave("edit")}
            className="left btn btn-primary">Save</button>
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
        let deletePromise =this.Logic.getDeletePromise(selectedDeleteData, "Excellence");
          //Wait for api to save or error out before proceeding
        try {
            await deletePromise;
            //Reload the page
            this.loadRowDataByAHPathID(selectedDeleteData.originalData.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId);
        } catch(e) {
            console.log("ERROR: api call in 'startDelete' in ExcellenceClockTable.jsx"); 
            this.setState({promise: deletePromise});
        }

        this.setState({showWarningModal: false, isWarningSaveButtonDisabled: false});
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
        let addModal = this.getAddModal();
        let editModal = this.getEditModal();
        let warningModalForDelete = this.getWarningModalForDelete();
        let buttonRow = this.getButtonRow();
        let changeColumnsModal = this.getChangeColumnsModal();
        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount, failurePromise, promise, failureMessage}, resetTable, onMultiSelectClick,
      onSearchTextFilter, onClickSort} = this;

        return (
      <div className=" datatable-root ">
        <h2> </h2>
        <p className=" error_message "> {error_message} </p>
        {addModal}
        {editModal}
        {warningModalForDelete}
        {buttonRow}
        {changeColumnsModal}
        <APIResponseModal {...{failurePromise, promise, failureMessage}} />
        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, tableConfiguration, maxRowCount, resetTable,
            dataTableConfiguration, onMultiSelectClick, onSearchTextFilter,
            onClickSort}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
