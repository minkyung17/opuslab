import React from 'react';
import PropTypes from 'prop-types';

//My imports
import * as util from '../../../opus-logic/common/helpers';
import {DeleteIcon, EditIcon} from '../../common/components/elements/Icon.jsx';
import {FormShell, FormGroup} from '../../common/components/forms/FormRender.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';

import {MultiColumnTables} from '../../common/components/elements/DynamicTables.jsx';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import {FormAutoComplete, FormTextArea} from
  '../../common/components/forms/FormElements.jsx';
import CAPLogic from '../../../opus-logic/cases/classes/recommendations/CAP';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';

/**
 *
 * @classdesc Class representing Base CAP Modal.
 * @extends React.Component
 *
 **/
export class CAPModal extends React.Component {}

/**
*
* @classdesc CAP Table Base class that has modals and the table
* @author Leon Aburime
* @abstract
* @class CAPTable
* @extends React.Component
*
**/
export class CAPTable extends React.Component {

  /**
   *
   * @desc - Class variables
   *
   **/
  static defaultProps = {
    caseRecommendationsAPIData: {}
  };
  static propTypes = {
    caseId: PropTypes.string,
    caseRecommendationsAPIData: PropTypes.object,
    setCaseRecommendationsAPIDataInGlobalState: PropTypes.func
  }
  state = {
    showModal: false,
    tableRows: [],
    saveButtonDisabled: true,
    showPersonSearch: true,
    showExternalMemberFields: false,
    hideBackButton: false
  };

  /**
   *
   * @desc - Render page when mounted
   * @return {void}
   *
   **/
  componentWillMount() {
    this.initComponent(this.props.caseRecommendationsAPIData);
  }

  /**
   *
   * @desc - Everytime props are received
   * @param {Object} - caseRecommendationsAPIData
   * @return {void}
   *
   **/
  componentWillReceiveProps({caseRecommendationsAPIData}) {
    if(caseRecommendationsAPIData !== this.props.caseRecommendationsAPIData) {
      this.initComponent(caseRecommendationsAPIData);
    }
  }

  //Class variables
  Logic = new CAPLogic(this.props);

  /**
   *
   * @desc - Attach onClick events Icons to rows
   * @param {Array} rows - data from the modalFields to be changed over
   * @return {Object} rows - array of rows in table
   *
   **/
  attachOnClickIconsToRows(rows = []) {

    rows.map(row => {
      row.edit = <EditIcon onClick={() => {this.setUpEditModalForPerson(row);}} />;
      row.delete = <DeleteIcon onClick={() => {this.setUpDeleteModalForPerson(row)}} />;
    });

    return rows;
  }

  /**
   *
   * @desc - Starts the CAP Table off
   * @param {Object} caseRecommendationsAPIData - api data for case recommendations
   * @return {void}
   *
   **/
  initComponent(caseRecommendationsAPIData) {
    //If there is api data render it
    if(caseRecommendationsAPIData) {
      let tableRows = this.extractCAPDataForTable(caseRecommendationsAPIData);
      this.attachOnClickIconsToRows(tableRows);
      let canAddCAPMember = this.Logic.canAddCAPMember(caseRecommendationsAPIData);

      let fieldData = this.getFieldData();
      let startingFieldData = util.cloneObject(fieldData);

      this.setState({tableRows, fieldData, startingFieldData, canAddCAPMember});
    }
  }

  /**
   *
   * @override
   * @desc - Extracts cap field data
   * @return {Array} - blank array
   *
   **/
  extractCAPDataForTable() {
    return [];
  }

  /**
   *
   * @override
   * @desc - Gets blank fieldData
   * @return {Array} - blank array
   *
   **/
  getFieldData() {
    return [];
  }

  /**
   *
   * @desc - Gets fresh field that have no values in them
   * @return {Object} fieldData - pristine fieldData
   *
   **/
  getClonedStartingFieldData() {
    let {startingFieldData} = this.state;
    let fieldData = util.cloneObject(startingFieldData);

    return fieldData;
  }

  /**
   *
   * @desc - Shows modal
   * @return {void}
   *
   **/
  addMember = () => {
    let fieldData = this.getClonedStartingFieldData();

    this.setState({addNewMember: true, showPersonSearch: true, showModal: true, fieldData,
      saveButtonDisabled: true, editName: null, showExternalMemberFields: false, hideBackButton: false});
  }

  /**
   *
   * @desc - Hide modal
   * @return {void}
   *
   **/
  hideModal = () => this.setState({showModal: false, showExternalMemberFields: false})

  /**
   *
   * @desc - Shows modal
   * @return {void}
   *
   **/
  showDeleteModal = () => this.setState({showDeleteModal: true})

  /**
   *
   * @desc - Hide modal
   * @return {void}
   *
   **/
  hideDeleteModal = () => this.setState({showDeleteModal: false})

  /**
   *
   * @desc - Deletes Cap member in Slate or RC. Supposed to be overriden by
   *  inheritor
   * @override
   * @return {void}
   *
   **/
  // deleteCAPMember = () => {
  //   let {currentPerson} = this.state;
  //
  //
  // }

  /**
   *
   * @desc - If receiving either of the to case arrays rerender the table
   * @param {Object} - searchString is the name to search for
   * @param {Func} response - send array to this function to populate dropdowns
   *  results
   * @return {void}
   *
   **/
  onSearchName = async ({term: searchString} = {}, response) => {
    let namesPromise = this.Logic.getNameSearchResults(searchString);

    //Switch modals and set promise for confirmation
    this.setState({failurePromise: namesPromise});

    let nameSearchResults = await namesPromise;
    let namesToData = this.Logic.formatNameSearchResults(nameSearchResults);
    this.Logic.setClassData({namesToData});

    response(Object.values(namesToData));
  }

  /**
   *
   * @desc - When user selects a person from the dropdown. Enables the button
   *  on click
   * @param {Object} evt - click event
   * @return {void}
   *
   **/
  onSelectPerson = (evt) => {
    let {target: {value: name}} = evt;
    let currentPerson = this.Logic.namesToData[name];
    this.setState({saveButtonDisabled: false, currentPerson});
  }


  /**
   *
   * @desc - Show modal and set person
   * @param {Object} row - current row being clicked on
   * @return {void}
   *
   **/
  setUpEditModalForPerson(row) {
    let {name} = row;
    if(row.extMmbrName && row.extMmbrName!==""){
      // Set modal for external members
      let {fieldData} = this.state;
      this.setExternalMemberFieldValues(row, fieldData);
    }else{
      let fieldData = this.getFieldData();
      let APIPath = 'cap';
      this.Logic.setFieldValuesFromDataByRecommendationPath(fieldData, row, APIPath);
      
      this.setState({showExternalMemberFields: false, fieldData});
    }
    this.setState({addNewMember: false, showPersonSearch: false, showModal: true, currentPerson: row,
      saveButtonDisabled: false, editName: name, hideBackButton: true})
  }

  setExternalMemberFieldValues(row, fieldData){
    // Look up fieldData and how to create all the fields
    let UCLAfieldData = this.Logic.getAddPersonOutsideUCLAFieldData();

    let combinedFieldData = {
      ...UCLAfieldData,
      ...fieldData
    }

    combinedFieldData.name.value = row.extMmbrName;
    combinedFieldData.organization.value = row.extMmbrOrg;
    combinedFieldData.title.value = row.extMmbrTitle;
    combinedFieldData.userComments.value = row.commentsText;
    combinedFieldData.proposedRole.value = row.committeeMemberProposedRoleId;

    if(combinedFieldData.finalRole){
      combinedFieldData.finalRole.value = row.committeeMemberFinalRoleId;
    }
    
    // OPUSDEV-3396 Reset validations on edit modal for external members
    combinedFieldData = this.validateFields(combinedFieldData);
    
    this.setState({showExternalMemberFields: true, fieldData: combinedFieldData})
  }

  /**
   *
   * @desc - Show delete modal and set person
   * @param {Object} row - current row being clicked on
   * @return {void}
   *
   **/
  setUpDeleteModalForPerson(row) {
    this.setState({showDeleteModal: true, currentPerson: row});
  }

  /**
   *
   * @desc - the JSX table
   * @return {Object} - JSX
   *
   **/
  getTable = () =>
      <MultiColumnTables rows={this.state.tableRows} valueKeys={this.valueKeys}
        columnTitles={this.columnTitles} />

  /**
   *
   * @desc - the JSX modal
   * @return {Object} - JSX
   *
   **/
  getDeleteModal() {
    return (
      <Modal show={this.state.showDeleteModal}
        onHide={this.hideDeleteModal}>
        <Header className=" modal-danger " closeButton>
          <Title> <h1 className=" white "> {this.deleteModalTitle} </h1> </Title>
        </Header>
        <Body>

          <p>
            Are you sure you want to delete this committee member?
            If you need to re-add them click the "Add Member" button.
          </p>

        </Body>
        <Footer>
          <button onClick={this.deleteCAPMember}className="btn btn-danger left">
            Delete
          </button>
          <Dismiss onClick={this.hideDeleteModal} className="btn btn-link left">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
   *
   * @desc - Updates value
   * @return {void}
   *
   **/
  onChange = (evt) => {
    let {target: {value, name}} = evt;
    let {fieldData} = this.state;
    fieldData[name].value = value;

    this.setState({fieldData});
  }


  /**
   *
   * @override
   * @desc - Subclass will save member
   * @return {void}
   *
   **/
  saveMember = (fieldData, memberData, caseData, showExternalMemberFields) => {
    let promise = this.Logic.updateMember(fieldData, memberData, caseData, showExternalMemberFields);
    return promise;
  }

  /**
   *
   * @desc - Subclass will save member
   * @return {void}
   *
   **/
  saveFromUI = async () => {
    let {props: {caseId}, state: {currentPerson, fieldData}} = this;

    let caseData = {caseId};
    let {showExternalMemberFields} = this.state;
    //let memberData = this.Logic.namesToData[selectedPerson];

    if(showExternalMemberFields){
      fieldData = this.validateFields(fieldData);
      this.setState({fieldData});
      this.Logic.appointmentId = this.props.caseSummaryDataFromAPI.actionDataInfo[0].appointmentInfo.appointmentId;
    }

    if(showExternalMemberFields && (fieldData.name.hasError || fieldData.organization.hasError)){
      // Dont save
    }else{
      let savePromise = this.saveMember(fieldData, currentPerson, caseData, showExternalMemberFields);
      this.setState({promise: savePromise, showModal: false});

      await savePromise;

      this.resetPage();
    }
  }


  // OPUSDEV-3396 Validate name and organization fields before save
  validateFields = (fieldData) => {
    if(fieldData.name.value && fieldData.name.value.length>0){
      fieldData.name.hasError = false;
      fieldData.name.error = null;
    }else{
      fieldData.name.hasError = true;
      fieldData.name.error = "Please fill out this required field."
    }
    if(fieldData.organization.value && fieldData.organization.value.length>0){
      fieldData.organization.hasError = false;
      fieldData.organization.error = null;
    }else{
      fieldData.organization.hasError = true;
      fieldData.organization.error = "Please fill out this required field."
    }
    return fieldData;
  }

  /**
   *
   * @desc - Deletes Cap member.
   * @override
   * @return {void}
   *
   **/
  deleteCAPMember = async () => {
    let {props: {caseId}, state: {currentPerson}} = this;

    let promise = this.Logic.deleteCAPMember(currentPerson, caseId);

    this.setState({promise, showDeleteModal: false});

    await promise;

    this.resetPage();
  }

  addPersonOutsideUCLA = () => {
    let {fieldData} = this.state;

    // Look up fieldData and how to create all the fields
    let UCLAfieldData = this.Logic.getAddPersonOutsideUCLAFieldData();
    
    let combinedFieldData = {
      ...UCLAfieldData,
      ...fieldData
    }

    this.setState({showPersonSearch: false, showExternalMemberFields: true,
      fieldData: combinedFieldData, saveButtonDisabled: false, currentPerson: null})

  }

  backToAddModal = () => {
    // Look up fieldData and how to create all the fields
    let fieldData = this.getFieldData();

    this.setState({showPersonSearch: true, showExternalMemberFields: false,
      fieldData, saveButtonDisabled: true})
  }

  /**
   *
   * @desc - Modal that pops up on click to search for
   * @return {Object} - JSX
   *
   **/
  getModal() {
    return (
      <Modal className="modal-lg" show={this.state.showModal} onHide={this.hideModal}>
        <Header className="modal-info" closeButton>
          <ShowIf show={this.state.addNewMember}>
            <Title><h1>{this.modalTitleAddMember}</h1></Title>
          </ShowIf>
          <ShowIf show={!this.state.addNewMember}>
            <Title><h1>{this.modalTitleEditMember}</h1></Title>
          </ShowIf>
        </Header>
        <Body>

          <ShowIf show={this.state.editName}>
            <h2>{this.state.editName}</h2>
          </ShowIf>

          <FormShell>
            <ShowIf show={this.state.showPersonSearch}>
              <span>
                <div className='col-md-8'/>
                <div className='col-md-4'>
                  <button className='btn btn-link' onClick={this.addPersonOutsideUCLA}>
                    Add a person outside of UCLA
                  </button>
                </div>
                <FormAutoComplete displayName={'Who would you like to add?'}
                  placeholder={'Search for a person in UCLA'} ref="autocomplete"
                  options={this.onSearchName} autoCompleteUIOptions={{}}
                  onSearchClick={this.onSelectPerson} />
              </span>
            </ShowIf>

            <FormGroup onChange={this.onChange} fields={this.state.fieldData} />

          </FormShell>

        </Body>
        <Footer>
          <button onClick={this.saveFromUI} disabled={this.state.saveButtonDisabled}
            className="btn btn-primary left">
            Save
          </button>
          <ShowIf show={this.state.showExternalMemberFields && !this.state.hideBackButton}>
            <button onClick={this.backToAddModal} className=" left btn btn-link">
              Back
            </button>
          </ShowIf>
          <Dismiss onClick={this.hideModal} className="btn btn-link left">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
   *
   * @desc - Gets api data and rerenders it for the front end
   * @return {void}
   *
   **/
  async resetPage() {
    this.setState({showExternalMemberFields: false})
    let data = await this.Logic.getAPIData(this.props.caseId);
    this.props.setCaseRecommendationsAPIDataInGlobalState(data);
  }

  /**
   *
   * @desc - Renders table, modal, and modal button
   * @return {JSX} - JSX
   *
   **/
  render() {
    return (
      <div>
        <h2> {this.title} </h2>
        <APIResponseModal promise={this.state.promise} />
        <APIResponseModal failurePromise={this.state.failurePromise} />
        <p>To add members, first make the CAP RC required above</p>
        <button className="bottom-space btn btn-primary" onClick={this.addMember}
          disabled={!this.state.canAddCAPMember}>
          Add Member
        </button>
        <ShowIf show={this.state.tableRows.length}>
          {this.getTable()}
        </ShowIf>
        {this.getModal()}
        {this.getDeleteModal()}
      </div>
    );
  }
}

/**
*
* CAP Slate Table class
* @author - Leon Aburime
* @class CAPSlateTable
* @extends CAPTable
*
**/
export class CAPSlateTable extends CAPTable {
  /**
  * Keys to index data of array of objects that gets data
  * @member {Array}
  */
  valueKeys = ['edit', 'name', 'committeeMemberProposedRole', 'series', 'rank', 'step',
    'departmentName', 'delete'];
  /**
  * Name of table headers
  * @member {Array}
  */
  columnTitles = ['', 'Name',	'Proposed Role', 'Series or Title', 'Rank', 'Step', 'Department or Organization',
    'Delete'];
  /**
  * Modal title for Add New Member
  * @member {Array}
  */
  modalTitleAddMember = 'Add a CAP Slate Member';
  /**
  * Modal title for Editing a Member
  * @member {Array}
  */
  modalTitleEditMember = 'Edit a CAP Slate Member';
  /**
  * Title
  * @member {String}
  */
  title = 'CAP Slate';
  /**
  * Delete Modal Title
  * @member {String}
  */
  deleteModalTitle = 'Delete a CAP Slate Member';

  /**
   *
   * @desc - Get slate field data
   * @return {Object} - slate field data
   *
   **/
  getFieldData() {
    return this.Logic.getCAPSlateFieldData();
  }

  /**
   *
   * @desc - Saves CAP Slate member
   * @param {Object} caseRecommendationsAPIData - case rec data from the api
   * @return {Array} results - cap slate fields
   *
   **/
  extractCAPDataForTable(caseRecommendationsAPIData) {
    let results = this.Logic.extractCAPSlateDisplayFields(caseRecommendationsAPIData);

    return results;
  }

  /**
   *
   * @desc - Saves CAP Slate member
   * @param {Object} fieldData - fieldData seen in page
   * @param {Object} memberData - data for this member from the API
   * @param {Object} caseData - sepcifics for this case
   * @return {Promise} - promise for saving this member
   *
   **/
  saveMember = (fieldData, memberData, caseData, showExternalMemberFields) =>
    this.Logic.updateCAPSlateMember(fieldData, memberData, caseData, showExternalMemberFields);
}

/**
*
* CAP RC Table class
* @author - Leon Aburime
* @class CAPRCTable
* @extends CAPTable
*
**/
export class CAPRCTable extends CAPTable {
  /**
  * Keys to index data of array of objects
  * @member {Array}
  */
  valueKeys = ['edit', 'name', 'committeeMemberProposedRole', 'committeeMemberFinalRole',
    'series', 'rank', 'step', 'departmentName', 'delete'];
  /**
  * Name of table headers
  * @member {Array}
  */
  columnTitles = ['', 'Name',	'Proposed Role', 'Final Role', 'Series or Title', 'Rank', 'Step',
    'Department or Organization', 'Delete'];
  /**
  * Modal title
  * @member {Array}
  */
  modalTitleAddMember = 'Add a CAP RC (Review Committee) Member';
  /**
  * Modal title for Editing a Member
  * @member {Array}
  */
  modalTitleEditMember = 'Edit a CAP RC (Review Committee) Member';
  /**
  * Title
  * @member {String}
  */
  title = 'CAP RC (Review Committee)';
  /**
  * Delete Modal Title
  * @member {String}
  */
  deleteModalTitle = 'Delete a CAP RC (Review Committee) Member';

  /**
   *
   * @desc - Gets field data for CAPRC
   * @param {Object} caseRecommendationsAPIData - rec data from the API
   * @return {Object} - field data
   *
   **/
  extractCAPDataForTable(caseRecommendationsAPIData) {
    return this.Logic.extractCAPRCDisplayFields(caseRecommendationsAPIData);
  }

  /**
   *
   * @desc - Gets field data for CAPRC
   * @return {Object} - field data
   *
   **/
  getFieldData() {
    return this.Logic.getCAPRCFieldData();
  }

  /**
   *
   * @desc - Saves CAPRC member
   * @param {Object} fieldData - fieldData seen in page
   * @param {Object} memberData - data for this member from the API
   * @param {Object} caseData - sepcifics for this case
   * @return {Promise} - promise for saving this member
   *
   **/
  saveMember = (fieldData, memberData, caseData, showExternalMemberFields) =>
    this.Logic.updateCAPRCMember(fieldData, memberData, caseData, showExternalMemberFields);

}
