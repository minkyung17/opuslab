import React from "react";
import PropTypes from "prop-types";

//My imports
import * as util from "../../../../opus-logic/common/helpers/";
import {EditIcon} from "../../../common/components/elements/Icon.jsx";
import {ShowIf} from "../../../common/components/elements/DisplayIf.jsx";
import {MultipleAppointmentsBlock} from "../../components/AppointmentBlocks.jsx";
import {EndowedChairBlock} from "../../components/EndowedChairBlock.jsx";
import {FormShell, VisibleFormGroup} from "../../../common/components/forms/FormRender.jsx";
import ProposedFields from "../../../../opus-logic/cases/classes/case-summary/ProposedFields";
import APIResponseModal from "../../../common/components/bootstrap/APIResponseModal.jsx";
import {DisplayTable, DisplayTableHeader, VisibleDisplayTableBody} from
  "../../../common/components/elements/DisplayTables.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../../common/components/bootstrap/ReactBootstrapModal.jsx";

export default class ProposedStatus extends React.Component {
    static propTypes = {
        caseId: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        attributeMap: PropTypes.object,
        actionDataInfo: PropTypes.object,
        caseSummaryDataFromAPI: PropTypes.object,
        setCaseSummaryDataAPIInGlobalState: PropTypes.func.isRequired
    }

    state = {
        fieldData: {},
        apiPromise: null,
        proposedStatus: {},
        showProposedStatusModal: false
    };

  /**
   *
   * @desc - Re-render the page for the first time
   * @return {void}
   *
   **/
    componentWillMount() {
        let {actionDataInfo, caseSummaryDataFromAPI} = this.props;
        this.renderPageFromProps(actionDataInfo, caseSummaryDataFromAPI);
    }

  /**
   *
   * @desc - If new caseSummaryDataFromAPI then rerender the page
   * @param {Object} - actionDataInfo, caseSummaryDataFromAPI
   * @return {void}
   *
   **/
    componentWillReceiveProps({actionDataInfo, caseSummaryDataFromAPI}) {
    //caseSummaryDataFromAPI must be new to rerender this page
        if(!this.isCurrentCaseSummaryAPIData(caseSummaryDataFromAPI)) {
            this.renderPageFromProps(actionDataInfo, caseSummaryDataFromAPI);
        }
    }

  /**
   *
   * @desc - Every time it updates
   * @return {void}
   *
   **/
    componentDidUpdate() {
        util.initJQueryBootStrapToolTipandPopover();
    }

    Logic = new ProposedFields(this.props);
  /**
   *
   * @name renderPageFromProps
   * @desc - Create fields, clone them several times and render the page
   * @param {Object} actionDataInfo -
   * @param {Object} caseSummaryDataFromAPI -
   * @returns {Boolean} -
   *
   **/
    async renderPageFromProps(actionDataInfo, caseSummaryDataFromAPI) {
        let {fieldData, tableData, apptBlockData, endowedChairBlockData, startingFieldData} =
      this.Logic.initProposedFieldsFromAPIData(caseSummaryDataFromAPI, actionDataInfo);

    //Now render visible data from field just created and formatted
        this.renderVisibleFieldData(fieldData);
      // Remove endowed chair search field on table data
        if(tableData.endowedChair){
          tableData.endowedChair.visibility = false;
        }
    //Everything has been rendered so show table
        this.setState({renderPage: true, tableData, startingFieldData, apptBlockData, endowedChairBlockData});
    }

  /**
   *
   * @name isCurrentCaseSummaryDataFromAPI
   * @desc - Gets if actionDataInfo being passed in is the same as the current one
   * @param {Object} caseSummaryDataFromAPI -
   * @returns {Boolean} -
   *
   **/
    isCurrentCaseSummaryAPIData(caseSummaryDataFromAPI) {
        return caseSummaryDataFromAPI === this.props.caseSummaryDataFromAPI;
    }

  /**
   *
   * @name reloadPage
   * @desc - Get from API and set data in state which causes page to rerender
   * @param {String} caseId -
   * @returns {Boolean} -
   *
   **/
    async reloadPage(caseId = this.props.caseId) {
        let caseSummaryDataFromAPI = await this.Logic.getCasesSummaryData(caseId);

    //Dispatch caseSummaryData into global state
        this.props.setCaseSummaryDataAPIInGlobalState(caseSummaryDataFromAPI);
    }

  /**
   *
   * @name showProposedStatusModal
   * @desc - Gets new cloned fieldData, sets in state, show them in modal
   * @returns {Boolean} -
   *
   **/
    showProposedStatusModal = () => {
        let fieldData = util.cloneObject(this.state.startingFieldData);

    //Get only visible fields after update
    //let fieldData = this.Logic.getVisibleFieldData(fieldData);

        this.setState({showProposedStatusModal: true, fieldData});
    }

  /**
   *
   * @name closeProposedStatusModal
   * @desc - show them in modal
   * @returns {Boolean} -
   *
   **/
    closeProposedStatusModal = () => this.setState({showProposedStatusModal: false,
    saveError: false, personWithEndowedChair: null});


  /**
   *
   * @name renderPageFromProps
   * @desc - Render only visible fields
   * @param {Object} fieldData - fields in the modal
   * @param {Object} caseSummaryDataFromAPI -
   * @returns {Boolean} -
   *
   **/
    renderVisibleFieldData(fieldData = this.state.fieldData) {
        this.setState({fieldData});
    }

  /**
   *
   * @name renderPageFromProps
   * @desc - Render only visible fields
   * @param {Object} evt -
   * @returns {Boolean} -
   *
   **/
    onBlur = (evt) => {
        let {name, value} = evt.target;

    //Return if invalid blur elements
        let canUpdateField = this.Logic.canUpdateFieldDataViaOnBlur(name);
        if(!canUpdateField) {
            return;
        }

        let {fieldData} = this.state;
        fieldData[name].value = value;

        this.Logic.validateFieldOnBlur(fieldData[name]);
        fieldData = this.onChangeStatusFields(name, value, fieldData);

        this.renderVisibleFieldData(fieldData);
    }

  /**
   *
   * @desc - Lets create field data
   * @param {String} name -
   * @param {String} value -
   * @param {Object} fieldData -
   * @return {void}
   *
   **/
    onChangeStatusFields = (name, value, fieldData) => {
        this.Logic.updateFieldDataByToggle(fieldData, name);
        this.Logic.validateFieldOnUpdate(fieldData[name]);

        return fieldData;
    }

  /**
   *
   * @desc - Get salary fields updated
   * @param {String} name -
   * @param {Object} fieldData -
   * @return {void}
   *
   **/
    onChangeStatusFieldsFromAPI = async (name, fieldData) => {
        let {actionDataInfo: {actionId, appointmentInfo}} = this.props;
        await this.Logic.updateFieldDataFromSalaryAPI(name, fieldData, appointmentInfo, actionId, "proposed");

        return fieldData;
    }

  onSearchEndowedChairClick = async (event, {value: name}) => {
    let {fieldData} = this.state;
    let {caseSummaryDataFromAPI} = this.props;
    //No name so go back
    if(!name) {
      return;
    }
    // console.log(caseSummaryDataFromAPI);
    let opusPersonId = caseSummaryDataFromAPI.appointeeInfo.opusPersonId;
    let seriesType = caseSummaryDataFromAPI.actionDataInfo[0].appointmentInfo.titleInformation.series;
    let rankType = caseSummaryDataFromAPI.actionDataInfo[0].appointmentInfo.titleInformation.rank.rankTypeDisplayText;
    let actionId = caseSummaryDataFromAPI.actionDataInfo[0].actionId;
    let promise = this.Logic.getEndowedChairDataFromName(event.target.value, opusPersonId, actionId);
    let results = await promise;

    let {personWithEndowedChair} = results;
    let {endowedChair, endowedChairBlockData} = this.Logic.formatEndowedChairObject(name, results, seriesType, rankType);

    this.Logic.setSelectedEndowedChair = endowedChair;
    fieldData.selectedEndowedChair.value = event.target.value;
    this.renderVisibleFieldData(fieldData);
    this.setState({endowedChairBlockData, endowedChair, personWithEndowedChair});
    // this.setSelectedEndowedChair(formattedObject);
  }

  /**
   *
   * @desc - Whenever a field changes update it if necessary
   * @param {Event} evt -
   * @return {void}
   *
   **/
    onChange = async (evt) => {
        const fieldsToExclude = this.Logic.getExclusionFieldsForLocation();

        let {name, value} = evt.target;
        let {fieldData} = this.state;
        let {helpText} = this.Logic;

        if (name === 'endowedChairNameSearch') {
          if(value.length>=3) {
            let endowedChairOptions = await  this.Logic.searchForEndowedChairOnChange(fieldData, name, value);
            this.setState({endowedChairOptions});
            // this.props.Logic.setClassData({endowedChairOptions});
            // response(Object.values(searchoptions));
            // this.renderFormFields(fieldData);
          }
        } else if(fieldsToExclude.includes(name)){
          //Do not reload page
            evt.preventDefault();
            this.Logic.handleLocationFields(name, value, fieldData);
        }else{
        // Other non location based fields work normally
            fieldData[name].value = value;
        // If location 1 number input is disabled and user changes appointment percent time, update location 1 number input
            if(name==="appointmentPctTime" && fieldData.locationDisplayText1 && fieldData.locationDisplayText1.isNumberDisabled){
                fieldData.locationDisplayText1.numberValue = parseInt(value);
            }
        }

        fieldData = this.onChangeStatusFields(name, value, fieldData);
        this.renderVisibleFieldData(fieldData);

    // Need to set correct location visibility values on departmentCode toggle
        if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value==="Medicine" && fieldData.locationDisplayText2.visibility===false){
            fieldData.locationDisplayText1.isNumberDisabled = false;
            fieldData.locationDisplayText1.showAdd = true;
            fieldData.locationDisplayText1.showDelete = true;
            fieldData.locationDisplayText1.isDeleteDisabled = true;
            fieldData.locationDisplayText1.helpText = helpText;
            if(fieldData.locationDisplayText1.numberValue===null){
                fieldData.locationDisplayText1.isAddDisabled = true;
            }
        }else if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value!=="Medicine"){
            this.Logic.resetLocations(fieldData);
        }

        fieldData = await this.onChangeStatusFieldsFromAPI(name, fieldData);
        this.renderVisibleFieldData(fieldData);
    }

  /**
   *
   * @desc - self explanatory
   * @param {Object} fields -
   * @return {JSX} - Proposed Action Modal
   *
   **/
    getModal(fields) {
        let {caseSummaryDataFromAPI: {appointeeInfo}, actionDataInfo} = this.props;

        return (
      <Modal className="modal-lg" backdrop="static" show={this.state.showProposedStatusModal}
        {...{onHide: this.closeProposedStatusModal}}>
        <Header className=" modal-info " closeButton>
          <h1 className=" black "> Proposed Status </h1>
        </Header>
        <Body>

          <h2 className="flush-top"> {appointeeInfo.fullName} </h2>

          <p>
            {actionDataInfo.actionTypeInfo.actionTypeDisplayText}
          </p>
          <ShowIf show={appointeeInfo.uid}>
            <p>UID: {appointeeInfo.uid}</p>
          </ShowIf>

          <MultipleAppointmentsBlock apptDisplays={this.state.apptBlockData}/>

          <br />
          <FormShell >
            <VisibleFormGroup onBlur={this.onBlur} onChange={this.onChange} onSearchClick={this.onSearchEndowedChairClick} {...{fields}} />
          </FormShell>
          <ShowIf show={actionDataInfo.proposedEndowedChairId}>
            <EndowedChairBlock endowedChairDisplays={this.state.endowedChairBlockData}/>
          </ShowIf>
          <br/>
          <ShowIf show={this.state.personWithEndowedChair} >
            <p className="error_message"> {this.state.personWithEndowedChair} </p>
          </ShowIf>
          <ShowIf show={this.state.saveError} >
            <p className="error_message"> Please check form for errors </p>
          </ShowIf>
        </Body>
        <Footer>
          <button disabled={this.state.isProposedStatusButtonDisabled}
            onClick={this.validateAllFieldDataOnSave} className="left btn btn-primary">
            Save
          </button>
          <Dismiss onClick={this.closeProposedStatusModal}
            className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
   *
   * @desc - self explanatory
   * @return {JSX} - Proposed Action Table
   *
   **/
    getTable() {
        let {state: {tableData}, props: {actionDataInfo}} = this;
        let hasFields = Object.keys(tableData).length;
        let title = this.Logic.getTableTitleFromActionDataInfo(actionDataInfo);

        return (
      <ShowIf show={hasFields}>
        <DisplayTable >
          <DisplayTableHeader>
            {title}
            <ShowIf show={this.Logic.canEditProposedStatus}>
              <EditIcon {...{onClick: this.showProposedStatusModal}} />
            </ShowIf>
          </DisplayTableHeader>
          <VisibleDisplayTableBody {...{fieldOptions: tableData}}
            valueKey="displayValue" />
        </DisplayTable>
      </ShowIf>
    );
    }

  /**
   *
   * @desc - Validate fields and if rerender the fields to show errors.  If no
   *  error then save it
   * @return {void}
   *
   **/
    validateAllFieldDataOnSave = () => {
        let {state: {fieldData}} = this;
        this.Logic.validateAllFieldDataOnSave(fieldData);
        if(fieldData.locationDisplayText1){
            this.Logic.locationValidation(fieldData);
        }
        let fieldsHaveErrors = this.Logic.doFieldsHaveErrors(fieldData);
        this.renderVisibleFieldData(fieldData);

        if(fieldsHaveErrors) {
            this.setState({saveError: true});
        } else {
            this.setState({saveError: false});
            this.saveProposedStatus();
        }
    }

  /**
   *
   * @desc - Save proposedStatus fields, send promise off to error modal,
   *  disable buttons to stop from saving multiple times, re-enable after save
   * @return {void}
   *
   **/
    saveProposedStatus = async () => {
        let {props: {actionDataInfo, caseSummaryDataFromAPI}} = this;
        this.setState({isProposedStatusButtonDisabled: true});
        let {endowedChair} = this.state;
        // console.log(endowedChair);
        // actionDataInfo.proposedEndowedChairId = endowedChair.endowedChairId;
        // console.log(actionDataInfo);

    //Send off to Logic side to save
        let promise = this.Logic.saveProposedStatus(this.state.fieldData, actionDataInfo,
                        endowedChair, caseSummaryDataFromAPI);

        await promise;
        await this.reloadPage();
        // IOK-794 Enable api modal and hide proposed status modal after
        this.setState({promise, isProposedStatusButtonDisabled: false,
          showProposedStatusModal: false});
    }

  /**
   *
   * @desc - All jsx for the page
   * @return {JSX}
   *
   **/
    render() {
        if(!this.state.renderPage) {
            return null;
        }
        let {promise, fieldData} = this.state;
        let table = this.getTable(fieldData);
        let modal = this.getModal(fieldData);

        return (<div> {table} {modal} <APIResponseModal {...{promise}} /> </div>);
    }
}
