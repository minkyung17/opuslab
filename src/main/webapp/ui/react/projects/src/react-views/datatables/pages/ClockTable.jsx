import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

//My imports
import DataTableComponent from "./DataTableBase.jsx";
import * as util from "../../../opus-logic/common/helpers/";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import {FormShell, FormGroup} from "../../common/components/forms/FormRender.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

/******************************************************************************
 *
 * @desc - Base JSX for 8 Year and Excellence clocks
 *
 ******************************************************************************/
export default class ClockTable extends DataTableComponent {

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
    state = {
        ...this.state,
        renderTable: false,
        showEditModal: false,
        showWarningModal: false,
        isSaveButtonDisabled: false,
        isWarningSaveButtonDisabled: false,
        resetNumber: 0
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
        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
        let formattedColumnOptions = this.getBootStrapModalOptions();
        this.setState({dataTableConfiguration, formattedColumnOptions,
      resetNumber: ++resetNumber});
    }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
    async setUpPage({config_name, opusPersonId, profileAPIData, rowData, maxRowCount}
    = this.props) {
        this.Logic.setClassData({opusPersonId, rowData});
        this.setDataTableConfigurationInfo(config_name);
        this.addOnClickToEditColumnInDatatableConfig();

        let {serviceUnitTypeMap} = rowData[0].originalData;
        let fieldData = this.Logic.createFieldData();
        this.Logic.attachServiceUnitTypeOptions(fieldData, serviceUnitTypeMap);

        let {appointeeInfo: {fullName}} = profileAPIData;
        this.setState({rowData, originalRowData: rowData, maxRowCount, fieldData,
      fullName, renderTable: true});
    }


  /**
   *
   * @desc - Allows user to be able to click the edit button to bring up modal
   * @returns {Object} dataTableConfiguration- config for table
   *
   **/
    addOnClickToEditColumnInDatatableConfig() {
        let {dataTableConfiguration} = this.Logic;
        dataTableConfiguration.columnConfiguration.edit.onClick = this.openModal;
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - Gets the list of columns needed to render bootstrap modal
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
    getBootStrapModalOptions(dataTableConfiguration = this.dataTableConfiguration) {
        let formattedColumnOptions = this.Logic.configureColumnInformation(
      dataTableConfiguration);

        formattedColumnOptions = this.Logic.removeInvalidShowColumnsOptions(
      formattedColumnOptions);
        return formattedColumnOptions;
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
   * @desc - Updates fields you see in modal
   * @param {String} name - name of field
   * @param {String} value - value of field
   * @returns {void}
   *
   **/
    updateFieldDataForAddModal(name, value) {
        let {fieldDataForAddModal} = this.state;
        fieldDataForAddModal[name].value = value;
        this.setState({fieldDataForAddModal});
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
    saveData = async () => {
    //Extract variables to save
        let {fieldData, currentAPIResult} = this.state;
        let {academicHierarchyPathId} = currentAPIResult;

    //Disable button so they cant keep saving
        this.setState({isSaveButtonDisabled: true});

    //Perform save
        let promise = this.Logic.saveData(fieldData, currentAPIResult);
        this.setState({promise});

    //Wait for promise to resolve
        await promise;

    //Show success or failure modal and hide the edit modal
        this.setState({showEditModal: false, isSaveButtonDisabled: false});

    //Reload the page
        this.loadRowDataByAHPathID(academicHierarchyPathId);
    }

  /**
   *
   * @desc - Opens the modal. Sets the values from the row in form fields
   * @param {Event} evt - Click event
   * @param {Object} props - Opens the modal. Sets the values from the row in
   *  form fields
   * @returns {void}
   *
   **/
    openModal = (evt, props = {}) => {
    //Extract the data
        let {fieldData} = this.state;
        let {rowData: {originalData, academicYear}} = props;
        let {affiliation, academicHierarchyInfo: {departmentName}} = originalData;

    //Attach values to form fields
        this.Logic.attachRowValuesToFieldData(fieldData, originalData);

    //Set state to show
        this.setState({showEditModal: true, departmentName, affiliation, fieldData,
      academicYear, currentAPIResult: originalData});
    }

  /**
   *
   * @desc - Close edit modal for fields
   * @returns {void}
   *
   **/
    closeModal = () => this.setState({showEditModal: false});

  /**
   *
   * @desc - Gets modal for editing fields
   * @returns {JSX} - jsx for edit modal
   *
   **/
    getEditModal() {
        let {departmentName, affiliation, academicYear, fullName, fieldData,
      showEditModal} = this.state;
        return (
      <Modal bsSize="large" show={showEditModal} onHide={this.closeModal}>
        <Header className=" modal-info " closeButton>
          <Title id="ModalHeader"> <h1> Excellence Review Clock </h1> </Title>
        </Header>
        <Body>
          <h2>{fullName}</h2>
          <p>
            {`${departmentName} - ${affiliation}`} <br/>
            {academicYear}
          </p>
          <FormShell>
            <FormGroup onChange={this.onChange} fields={fieldData} />
          </FormShell>
        </Body>
        <Footer>
          <button disabled={this.state.isSaveButtonDisabled} onClick={this.saveData}
            className="left btn btn-primary">Save</button>
          <Dismiss onClick={this.closeModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

   // Delete modal and functions
    openDeleteModal = (evt, row) => {
        this.setState({showWarningModal: true, selectedDeleteData: row.rowData});
    }

    hideWarningModal = () => {
        this.setState({showWarningModal: false});
    }

    getWarningModalForDelete = () => {
        let {showWarningModal, isWarningSaveButtonDisabled} = this.state;
        return (
      <Modal backdrop="static" onHide={this.hideWarningModal}
        show={showWarningModal}>
        <Header className=" modal-warning " closeButton>
          <Title> <h1 className="modal-title" > Warning </h1> </Title>
        </Header>
        <Body>
          <p>
            Are you sure you want to delete?
          </p>
        </Body>
        <Footer>
          <Button bsStyle="warning" className="left white"
            disabled = {isWarningSaveButtonDisabled}
            onClick={() => this.startDelete()}>
            Delete
          </Button>
          <Dismiss onClick={this.hideWarningModal}
            className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
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
        let modal = this.getEditModal();
        let buttonRow = this.getButtonRow();
        let changeColumnsModal = this.getChangeColumnsModal();
        let apiResponseModal = this.getAPIResponseModal();
        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, resetTable, onMultiSelectClick,
    onSearchTextFilter, onClickSort} = this;

        return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>
        {modal}
        {buttonRow}
        {apiResponseModal}
        {changeColumnsModal}
        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, tableConfiguration, maxRowCount, resetTable,
            dataTableConfiguration, onMultiSelectClick, onSearchTextFilter,
            onClickSort}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
