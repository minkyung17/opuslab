import React from "react";
import {add, keys} from "lodash";
import PropTypes from "prop-types";
import { Tabs, Tab, Button } from "react-bootstrap";

//My imports
import AdminCompTableComponent from "./AdminCompTable.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import Permissions from "../../../opus-logic/common/modules/Permissions";
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
export default class AdminCompAllocationsTableComponent extends AdminCompTableComponent {

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


/******************************************************************************
 *
 * @desc - Add Modal functions and components
 *
 ******************************************************************************/

 /**
   *
   * @desc - Filter table data by tab click and then update state
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    openAddModal = async () => {
        this.setState({addData: {}, showAddModal: true});
        let resultsPromise = this.Logic.getDropdownOptions();
        let results = await resultsPromise;
        console.log(results);
        let {addData, yearOptions, titleOptions, adminCompInfo} = this.state;
        let allocationTitleData;

        if(results.academicYearData){
            yearOptions = results.academicYearData;
        }else{
            console.log("WARNING: No year options given from API, will not be able to save");
        }
    // Need to split title options from numeric keys and save both to find on save
        if(results.allocationTitleData){
            let titles = Object.values(results.allocationTitleData).sort();
            titleOptions = titles;
            allocationTitleData = results.allocationTitleData;
        }else{
            console.log("WARNING: No title options given from API, will not be able to save");
        }
        if(results.defaultAcademicYear){
            addData.year = results.defaultAcademicYear;
        }
        if(results.adminCompInfo){
      // Save this template for later
            adminCompInfo = results.adminCompInfo;
        }
        this.setState({addData, yearOptions, titleOptions, allocationTitleData, adminCompInfo});
    }

  /**
   *
   * @desc - Hide Add Modal
   *
   **/
    hideAddModal = () => {
        this.setState({addData: {}, showAddModal: false, isSaveButtonDisabled: false, duplicateErrorMessage: null});
    }

    onChangeAddData = (e, fieldToChange) => {
        let {addData} = this.state;

        addData[fieldToChange] = e.target.value;
    // editData.originalData[fieldToChange] = e.target.value;

        this.setState({addData});
    }

    searchUnit = async ({term: searchString} = {}, response) => {
        let unitOptions = await this.Logic.onSearchUnit(searchString);
        this.setState({unitOptions});
        this.Logic.setClassData({unitOptions});

        response(Object.values(unitOptions));
    }

  // OPUSDEV-3518 Added Search Unit blank validation for string values less than 3
    onChangeSearchUnit = (e) => {
        let {addData} = this.state;
        let value = e.target.value;
        if(value.length<3){
            addData.unitName = null;
        }
        this.setState({addData});
    }

    onClickSearchUnit = (e) => {
        let {addData} = this.state;

        addData.unitName = e.target.value;
    // Split by : and reverse array to check from the last element
        let unitName = e.target.value.split(":").reverse();

    // Loop through and find first non N/A to display
        let organizationName;
        for(let name of unitName){
            if(name!=="N/A"){
                organizationName = name;
                break;
            }
        }

    // Set organization name
        addData.organizationName = organizationName;
        this.setState({addData});
    }

    validateAddData = (addData) => {
        let hasErrors = false;
        if(addData.unitName && addData.unitName!==""){
            addData.unitNameErrorMessage = null;
        }else{
            addData.unitNameErrorMessage = "This cannot be blank.";
            hasErrors = true;
        }
        if(addData.organizationName && addData.organizationName.length>0){
            addData.organizationNameErrorMessage = null;
        }else{
            addData.organizationNameErrorMessage = "This cannot be blank.";
            hasErrors = true;
        }
        if(addData.year && addData.year!==""){
            addData.yearErrorMessage = null;
        }else{
            addData.yearErrorMessage = "This cannot be blank.";
            hasErrors = true;
        }
        if(addData.title && addData.title!==""){
            addData.titleErrorMessage = null;
        }else{
            addData.titleErrorMessage = "This cannot be blank.";
            hasErrors = true;
        }
        return hasErrors;
    }

    handleResponseError = (e, addData) => {
    // Console log entire error event
        console.error(e);

    // Determine error message
        let errorMessage;
        if(e.responseJSON && e.responseJSON.message){
            errorMessage = e.responseJSON.message;
            this.setState({duplicateErrorMessage: errorMessage, addData});
        }else if(e.responseJSON){
      // responseJSON is there but no message
            errorMessage = "No responseJSON.message field from api call";
        }else{
            errorMessage = "No responseJSON object found. Status Code: "+e.status.toString()+" "+e.statusText;
        }
        this.setState({duplicateErrorMessage: errorMessage, isSaveButtonDisabled: false});
    }

  // Need to find titleOption key from allocationTitleData key value pair
    setTitleOption = (addData) => {
        let {allocationTitleData} = this.state;
        for(let each in allocationTitleData){
            if(allocationTitleData[each]===addData.title){
                addData.title = each;
                break;
            }
        }
        return addData;
    }

    saveAddData = async () => {
        this.setState({isSaveButtonDisabled: true});
        let {addData, adminCompInfo} = this.state;

    // Validation here
        let hasErrors = this.validateAddData(addData);
        if(!hasErrors){
            let addDataClone = util.cloneObject(addData);
            addDataClone = this.setTitleOption(addDataClone);
            adminCompInfo = this.Logic.setAddData(addDataClone, adminCompInfo);
            try {
                let savePromise = await this.Logic.saveAddData(adminCompInfo);
                this.handlePromise(savePromise);

        // On success show success modal
                this.setState({showSuccessModal: true, promise: savePromise, duplicateErrorMessage: null, isSaveButtonDisabled: false});
                this.hideAddModal();
            } catch(e) {
                this.handleResponseError(e, addData);
            }
        }else{
            this.setState({addData, duplicateErrorMessage: null, isSaveButtonDisabled: false});
        }
    }

  /**
   *
   * @desc - Gets add allocations modal
   * @return {JSX} - add allocations modal
   *
   **/
    getAddModal() {
        let {addData, yearOptions, titleOptions, duplicateErrorMessage, isSaveButtonDisabled} = this.state;
        return (
      <Modal backdrop="static" show={this.state.showAddModal}
        onHide={this.hideAddModal}>
        <Header className=" modal-info modal-header " closeButton>
          <Title> <h1 className=" modal-title black ">Administrative Allocation</h1> </Title>
        </Header>
        <Body>
          <FormShell>
            <FormAutoComplete  displayName={'Unit'}
              placeholder={'Search for unit name (minimum 3 characters)'} ref="autocomplete"
              options={this.searchUnit} autoCompleteUIOptions={{}}
              onSearchClick={this.onClickSearchUnit}
              onChange={this.onChangeSearchUnit}
              input_css={' form-control  search-field '}
              descriptionText={descriptions.unitForAllocationsInAddModal}
              hasError={addData.unitNameErrorMessage ? true : false}
              error={addData.unitNameErrorMessage}
              />
            <FormTextAreaMaxChar name="organizationName" label={'Organization Name (max 250 characters)'}
              displayName={'Organization Name'} value={addData.organizationName}
              onChange={(e) => this.onChangeAddData(e, "organizationName")}
              descriptionText={descriptions.organizationNameForAllocationsInAddModal}
              hasError={addData.organizationNameErrorMessage ? true : false}
              error={addData.organizationNameErrorMessage}/>
            <FormSelect includeBlankOption={true} valueIsText
              displayName={'Year'}
              options={yearOptions}
              onChange={(e) => this.onChangeAddData(e, "year")}
              value={addData.year}
              hasError={addData.yearErrorMessage ? true : false}
              error={addData.yearErrorMessage}/>
            <FormSelect includeBlankOption={true} valueIsText
              displayName={'Title'}
              descriptionText={descriptions.titleForAllocations}
              options={titleOptions}
              onChange={(e) => this.onChangeAddData(e, "title")}
              value={addData.title}
              hasError={addData.titleErrorMessage ? true : false}
              error={addData.titleErrorMessage}/>
            <FormCurrency name="stipend"
              displayName={'Stipend'} value={addData.stipend}
              onChange={(e) => this.onChangeAddData(e, "stipend")}
              descriptionText={descriptions.stipendForAllocations}
              right_field_css={' col-sm-4 '}/>
            <FormNumber name="ninths"
              displayName={'9ths'} value={addData.ninths}
              onChange={(e) => this.onChangeAddData(e, "ninths")}
              descriptionText={descriptions.ninthsForAllocations}
              right_field_css={' col-sm-4 '}/>
            <FormCurrency name="ninthsAmount"
              displayName={'9ths Amount'} value={addData.ninthsAmount}
              onChange={(e) => this.onChangeAddData(e, "ninthsAmount")}
              descriptionText={descriptions.ninthsAmountForAllocations}
              right_field_css={' col-sm-4 '}/>
            <FormNumber name="fullTimeEquivalent"
              displayName={'FTE'} value={addData.fullTimeEquivalent}
              onChange={(e) => this.onChangeAddData(e, "fullTimeEquivalent")}
              descriptionText={descriptions.fullTimeEquivalentForAllocations}
              right_field_css={' col-sm-4 '}/>
          </FormShell>
        </Body>
        <Footer>
          <ShowIf show={duplicateErrorMessage}>
            <div className=" col-sm-12 red">
              {duplicateErrorMessage}
            </div>
          </ShowIf>
          <Button className="left btn btn-primary" onClick={this.saveAddData}
            disabled={isSaveButtonDisabled}>
            Save
          </Button>
          <Dismiss onClick={this.hideAddModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

/******************************************************************************
 *
 * @desc - Edit Modal functions and components
 *
 ******************************************************************************/

  /**
   *
   * @desc - Filter table data by tab click and then update state
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    edit = (evt, row) => {
        let originalEditData = this.Logic.cloneEditData(row.rowData);
        let rowIndexForEditData = row.rowIndex;

    // Figure out display for unitName in edit modal
        let editData = row.rowData;
        if(editData.departmentName!=="N/A"){
            editData.unitName = editData.departmentName;
        }else if(editData.divisionName!=="N/A"){
            editData.unitName = editData.divisionName;
        }else{
            editData.unitName = editData.schoolName;
        }
        editData.organizationNameHasError = false;

        this.setState({rowIndexForEditData, originalEditData, editData, showEditModal: true});
    }

    revertEditData = () => {
        let {rowIndexForEditData, originalEditData, rowData} = this.state;
        rowData[rowIndexForEditData] = originalEditData;
        this.hideEditModal();
    }

  /**
   *
   * @desc - Hide Edit Modal
   *
   **/
    hideEditModal = () => {
        this.setState({originalEditData:{}, editData: {}, showEditModal: false, isSaveButtonDisabled: false});
    }

    onChangeEditData = (e, fieldToChange) => {
        let {editData} = this.state;

        if(e.target.value.length>0){
            editData[fieldToChange] = e.target.value;
        }else{
      // OPUSDEV-3492: Upon successful edit save, blank strings "" cause sort issues against null values
            editData[fieldToChange] = null;
        }

        this.setState({editData});
    }

    validateEditData = (editData) => {
        let hasErrors = false;
        if(editData.organizationName && editData.organizationName.length>0){
            editData.organizationNameErrorMessage = null;
        }else{
            editData.organizationNameErrorMessage = "This cannot be blank.";
            hasErrors = true;
        }
        return hasErrors;
    }


    saveEditData = async () => {
        this.setState({isSaveButtonDisabled: true});
        let {editData, dataTableConfiguration} = this.state;
        const editableKeys = dataTableConfiguration.editableKeys;

    // Validation here
        let hasErrors = this.validateEditData(editData);
        if(!hasErrors){
      // Loop through set of editable keys that will change the originalData being sent to backend on save
            for(let each of editableKeys){
                if(editData.originalData[each]!==editData[each]){
                    editData.originalData[each] = editData[each];
          // Change displayValue for datatable after save
                    if(each==="stipend" || each==="ninthsAmount"){
                        editData["displayValue_"+each] = util.reformatToMoneyDisplayValue(editData[each]);
                    }
                }
            }

            try {
                let savePromise = await this.Logic.saveEditData(editData);
                this.handlePromise(savePromise);

         // On success show success modal
                this.setState({showSuccessModal: true, promise: savePromise, editData, isSaveButtonDisabled: false});
                this.hideEditModal();
            } catch(e) {
                console.error(e);
                this.setState({isSaveButtonDisabled: false});
            }
        }else{
            this.setState({editData, isSaveButtonDisabled: false});
        }
    }

  /**
   *
   * @desc - Gets edit allocations modal
   * @return {JSX} - edit allocations modal
   *
   **/
    getEditModal() {
        let {editData, isSaveButtonDisabled} = this.state;
        return (
      <Modal backdrop="static" show={this.state.showEditModal}
        onHide={this.revertEditData}>
        <Header className=" modal-info modal-header " closeButton>
          <Title> <h1 className=" modal-title black ">Administrative Allocation</h1> </Title>
        </Header>
        <Body>
          <h2 className="flush-top">{editData.unitName}</h2>
          <p>
            {editData.titleDescription}
            <br></br>
            {editData.academicYear}
          </p>
          <br/>
          <FormShell>
            <FormTextAreaMaxChar name="organizationName" label={'Organization Name (max 250 characters)'}
              displayName={'Organization Name'} value={editData.organizationName}
              onChange={(e) => this.onChangeEditData(e, "organizationName")}
              descriptionText={descriptions.organizationNameForAllocations}
              hasError={editData.organizationNameErrorMessage ? true : false}
              error={editData.organizationNameErrorMessage}/>
            <FormCurrency name="stipend"
              displayName={'Stipend'} value={editData.stipend}
              onChange={(e) => this.onChangeEditData(e, "stipend")}
              descriptionText={descriptions.stipendForAllocations}
              right_field_css={' col-sm-4 '}/>
            <FormNumber name="ninths"
              displayName={'9ths'} value={editData.ninths}
              onChange={(e) => this.onChangeEditData(e, "ninths")}
              descriptionText={descriptions.ninthsForAllocations}
              right_field_css={' col-sm-4 '}/>
            <FormCurrency name="ninthsAmount"
              displayName={'9ths Amount'} value={editData.ninthsAmount}
              onChange={(e) => this.onChangeEditData(e, "ninthsAmount")}
              descriptionText={descriptions.ninthsAmountForAllocations}
              right_field_css={' col-sm-4 '}/>
            <FormNumber name="fullTimeEquivalent"
              displayName={'FTE'} value={editData.fullTimeEquivalent}
              onChange={(e) => this.onChangeEditData(e, "fullTimeEquivalent")}
              descriptionText={descriptions.fullTimeEquivalentForAllocations}
              right_field_css={' col-sm-4 '}/>
          </FormShell>
        </Body>
        <Footer>
          <Button className="left btn btn-primary" onClick={this.saveEditData}
            disabled={isSaveButtonDisabled}>
            Save
          </Button>
          <Dismiss onClick={this.revertEditData} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
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
        this.setState({deleteData: {}, showDeleteModal: false});
    }

    deleteData = async () => {
        let {deleteData} = this.state;
        let deletePromise = this.Logic.deleteData(deleteData);
        this.handlePromise(deletePromise);
        this.hideDeleteModal();
    }

  /**
   *
   * @desc - Gets opus status modal
   * @return {JSX} - Opus status modal
   *
   **/
    getDeleteModal() {
    // let {deleteData} = this.state;
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
          <button className={"left btn btn-danger"} onClick={this.deleteData}>
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
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/


    handlePromise = async (promise) => {
        let response = await promise;
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
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} checkedColumnsHash -
   * @return {void}
   *
   **/
    changeColumnVisibility = (checkedColumnsHash, event, dataTableConfiguration = this.dataTableConfiguration) => {
    //Check all is custom made and uncheck all reverts to a custom visibility so had to make a exception (Based off OPUSDEV-3131)
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
        let {isOA, isAPO, isAPOAdmin} = this.Permissions;
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
            <ShowIf show={isOA || isAPO || isAPOAdmin}>
              <div className="row">
                <button className={"left btn btn-primary bottom-space small-space"} onClick={this.openAddModal}>
                    Add Allocation
                </button>
              </div>
            </ShowIf>
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
