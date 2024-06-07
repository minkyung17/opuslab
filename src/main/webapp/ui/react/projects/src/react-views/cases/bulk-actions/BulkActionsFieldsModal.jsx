import React from 'react';
import PropTypes from 'prop-types';
import {omit} from 'lodash';

/**
*
* @desc - My imports
*
**/
import BaseModal from '../caseflow/BaseModal.jsx';
import BulkActions from '../../../opus-logic/cases/classes/caseflow/BulkActions';
import {actionTypeText, fieldsPreHelpText, fieldsPostHelpText, buttonText,
  successMessage} from '../../../opus-logic/datatables/constants/BulkActionsConstants';
import Modal, {Header, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {FormShell, VisibleFormGroup} from '../../common/components/forms/FormRender.jsx';
import APIResponseModal, {Failure} from '../../common/components/bootstrap/APIResponseModal.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import BulkActionsToggle from '../../../opus-logic/cases/classes/toggles/BulkActionsToggle';

/*******************************************************************************
*
* @desc - React JSX modal that shows Bulk Action fields
*
*******************************************************************************/
export default class BulkActionsFieldsModal extends BaseModal {
  /**
  *
  * @desc - Static vars for props
  *
  **/
  static propTypes = {
    showModal: PropTypes.bool

  }
  static defaultProps = {
    showModal: true,
    previousModal: 'BULK_ACTIONS_TABLE'
  }

  /**
  *
  * @desc - Instance variables
  *
  **/
  Logic = new BulkActions(this.props);

  //React State variables
  state = {
    disableNextButton: false, //TODO: switch this back to true later
    showModal: this.props.showModal,
    showSuccessModal: false,
    disableSaveButton: false
  };

  /**
  *
  * @desc - After component is rendered, determine correct action types to
  *   let the user choose from
  * @param {Object} props - props passed in on startup
  * @return {void}
  *
  **/
  constructor(props = {}) {
    super(props);
    this.initProposedFields(props);
    console.log('Fields Modal - Selected Row List: ', this.props.selectedRowList);
  }

  /**
  *
  * @desc - Delaying init for tooltips because for some reason its not working
  * @return {void}
  *
  **/
  componentDidMount() {
    setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
  }

  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @return {void}
   *
  **/
  componentWillReceiveProps({showModal} = {}) {
    this.setState({showModal});
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

  /**
   *
   * @desc - gets field data based on action type and sets it in state
   * @param {Object} props -
   * @return {void}
   *
  **/
  async initProposedFields(props = this.props) {
    //Create all needed fields for this modal
    this.proposedFields = await this.Logic.getFieldData(props.selectedActionType);

    //Now extract the fields for whatever purpose
    let {fieldData} = this.proposedFields;

    let updatedFieldData = this.Logic.configureFormFields(fieldData, props.selectedActionType);
    this.setState({fieldData: updatedFieldData});
  }

  /**
  *
  * @desc - Validation prior to saving
  * @return {JSX}
  *
  **/
  startSaveBulkActions = async () => {

    let {fieldData} = this.state;

    //Validate proposed action and status fields
    this.Logic.validateAllFieldDataOnSave(fieldData);
    let hasErrors = this.Logic.doFieldsHaveErrors(fieldData);

    //If so show errors on the page
    if(hasErrors) {
      this.setState({saveError: true});
    } else { //Set error status to false and save the case
      this.setState({saveError: false});
      this.saveBulkActions();
    }
  }

  /**
  *
  * @desc - Save and create new bulk actions
  * @return {JSX}
  *
  **/
  saveBulkActions = async () => {
    this.setState({disableSaveButton: true});

    //Extract updated data from state
    let {fieldData} = this.state;

    //Extract global data from props
    let {selectedActionType, selectedRowList} = this.props;

    //Go to Logic side to save case
    let promise =
      this.Logic.saveActions(fieldData, {actionType: selectedActionType, selectedRowList});

    //If it fails it will have a custom error message
    let saveData = null;
    try {
      saveData = await promise;
    } catch(e) {
      console.log("ERROR: api call in 'saveBulkActions' in BulkActionsFieldsModal.jsx")
      this.setState({failureMessage: e.responseJSON.message});
    }

    //Reset modals and buttons - explicit compare to 0 due to API return values
    this.setState({failurePromise: promise, disableSaveButton: false,
      showModal: false, showSuccessModal: saveData === 0});

    //Make sure the active cases table reloads to have the new cases in there
    this.reloadActiveCasesTable();
  }

  /**
  *
  * @desc - Update proposed action fields
  * @param {Event} event - on change event
  * @return {void}
  *
  **/
  onChange = (event) => {
    //Update value
    let {target: {name, value}} = event;
    let {fieldData} = this.state;
    fieldData[name].value = value;
    this.Logic.validateFieldOnUpdate(fieldData[name]);

    //Trigger toggle logic
    this.Logic.updateBulkActionFieldDataByToggle(fieldData, name);

    //Update form fields
    this.setState({fieldData});
  }

  /**
  *
  * @desc - When user clicks off a field
  * @param {Object} event -
  * @param {Object} props -
  * @return {JSX}
  *
  **/
  onBlur = (event) => {
    //Update value
    let {target: {name}} = event;
    let {state: {fieldData}} = this;

    this.Logic.validateFieldOnBlur(fieldData[name]);

    this.setState({fieldData});
  }

  /**
  *
  * @desc - This is the success
  * @return {void}
  *
  **/
  getSuccessModal() {
    let {showSuccessModal} = this.state;
    return (
      <Modal show={showSuccessModal} onHide={this.dismissSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Success! </h1>
        </Header>
        <Body>
          {successMessage[this.props.selectedActionType]}
        </Body>
        <Footer>
          <Dismiss className="left btn btn-success" onHide={this.dismissSuccessModal}>
            OK
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
  *
  * @desc - Closes the success modal
  * @return {void}
  *
  **/
  dismissSuccessModal = () => this.setState({showSuccessModal: false});

  /**
  *
  * @desc - gets the img path
  * @return {String} - img path
  *
  **/
  getImagePath() {
    return '../images/cases.png';
  }

  /**
  *
  * @desc -
  * @return {JSX} -
  **/
  getModalBody() {
    return(
      <div>
        <h2 className="flush-top">{actionTypeText[this.props.selectedActionType]}</h2>
        <p>{fieldsPreHelpText[this.props.selectedActionType]}</p>
        <br />

        <FormShell>
          <VisibleFormGroup fields={this.state.fieldData} onChange={this.onChange} onBlur={this.onBlur} />
        </FormShell>

        <br />
        <p>{fieldsPostHelpText[this.props.selectedActionType]}</p>
      </div>
    );
  }

  /**
  *
  * @desc -
  * @return {JSX} - jsx
  *
  **/
  getModalFooter() {
    return (
      <Footer>
        {/* <Dismiss className="btn btn-default">Cancel</Dismiss> */}
        <button className="btn btn-primary left" onClick={this.onClickBack}>
          <span className=" icon-left wizard" />
          Back
        </button>
        <button className="btn btn-primary left" onClick={this.startSaveBulkActions}
          disabled={this.state.disableSaveButton} >
          {buttonText[this.props.selectedActionType]}
        </button>
      </Footer>
    );
  }

  /**
  *
  * @desc - Reload table
  * @return {void}
  *
  **/
  reloadActiveCasesTable() {
    if(window._reloadActiveCases) {
      window._reloadActiveCases();
    }
  }

  /**
  *
  * @desc -
  * @return {JSX} -
  *
  **/
  render() {
    let {state: {showModal, disableSaveButton, failurePromise, failureMessage}, closeModal} = this;
    let successModal = this.getSuccessModal();
    let header = this.getModalHeader({title: 'Start Multiple Cases'});
    let body = this.getModalBody();
    let footer = this.getModalFooter({disableSaveButton});

    return(
      <div>
        {successModal}
        <APIResponseModal showChildren {...{failurePromise}}>
          <Failure>
            <div dangerouslySetInnerHTML={{__html: failureMessage}} />
          </Failure>
        </APIResponseModal>
        <Modal className="modal-lg" backdrop="static" ref="modal" show={showModal}
          onHide={closeModal}>
          {header}
          <Body> {body} </Body>
          {footer}
        </Modal>
      </div>
    );
  }
}
