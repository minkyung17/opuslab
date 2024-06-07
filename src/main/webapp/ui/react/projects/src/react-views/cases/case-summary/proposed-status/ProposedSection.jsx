import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

//My imports
import ProposedStatus from './ProposedStatus.jsx';
import * as util from '../../../../opus-logic/common/helpers/';
import {tooltips} from '../../constants/Cases';
import {EditIcon} from '../../../common/components/elements/Icon.jsx';
import {ShowIf} from '../../../common/components/elements/DisplayIf.jsx';
import {FormShell, VisibleFormGroup} from '../../../common/components/forms/FormRender.jsx';
import APIResponseModal from '../../../common/components/bootstrap/APIResponseModal.jsx';
import ProposedStatusLogic from '../../../../opus-logic/cases/classes/case-summary/ProposedFields';
import CasesDossier from '../../../../opus-logic/cases/classes/CasesDossier';
import {DisplayTable, DisplayTableHeader, VisibleDisplayTableBody, DisplayTableRow} from
  '../../../common/components/elements/DisplayTables.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {ToolTip} from '../../../common/components/elements/ToolTip.jsx'


export default class ProposedFields extends React.Component {
  static propTypes = {
    caseId: PropTypes.string,
    caseSummaryDataFromAPI: PropTypes.object,
    setCaseSummaryDataAPIInGlobalState: PropTypes.func
  }

  state = {
    showProposedActionModal: false,
    proposedActionFlags: [],
    proposedActionFlagsDisplay: ''
  };

  /**
   *
   * @desc - When it mounts get the data
   * @return {void}
   *
   **/
  componentWillMount = () =>
    this.renderCaseSummaryPageFromAPIData(this.props.caseSummaryDataFromAPI);

  /**
   *
   * @desc -
   * @return {void}
   *
   **/
  componentWillReceiveProps({caseSummaryDataFromAPI}) {
    if(caseSummaryDataFromAPI !== this.props.caseSummaryDataFromAPI) {
      this.renderCaseSummaryPageFromAPIData(caseSummaryDataFromAPI);
    }
  }

  /**
   *
   * @desc - Every time it updates re-init the tooltips
   * @return {void}
   *
   **/
  componentDidUpdate() {
    util.initJQueryBootStrapToolTipandPopover();
  }

  //Class variables
  Logic = new ProposedStatusLogic(this.props);
  CasesDossierLogic = new CasesDossier(this.props);
  /**
  *
  * @desc - Renders the page starting from the arguments given
  * @param {Object} caseSummaryDataFromAPI - straight from API
  * @param {String} caseId - id of case were working on
  * @return {Object} fieldData
  *
  **/
  renderCaseSummaryPageFromAPIData(caseSummaryDataFromAPI, caseId = this.state.caseId) {
    //Get starting page data
    let {proposedAction, hasProposedStatusFields,
      startingData, tableData, actionDataSortedByAffiliation, opusCaseInfo,
      actionDataInfo, apoAnalystName} =
      this.Logic.initProposedFieldsSectionFromAPIData(caseSummaryDataFromAPI);

    // Find out which flagged actions should display and checked
    let actionType = this.Logic.getActionTypeFromActionData(caseSummaryDataFromAPI.actionDataInfo[0])
    let newProposedActionFlagsArray = this.CasesDossierLogic.setProposedActionFlagsDisplayInModal(actionType)

    newProposedActionFlagsArray = this.CasesDossierLogic.setCheckedValueForProposedActionFlags(
      caseSummaryDataFromAPI.actionDataInfo[0], newProposedActionFlagsArray);

    // This is to set the action flags display in case summary page (not in the modals)
    this.setActionFlagsDisplayInProposedActionTable(newProposedActionFlagsArray);

    //Values for tables and modals
    this.setState({caseSummaryDataFromAPI, proposedAction, caseId, opusCaseInfo,
      hasProposedStatusFields, actionDataInfo, renderTables: true, apoAnalystName,
      startingData, tableData, actionDataSortedByAffiliation, proposedActionFlags: newProposedActionFlagsArray});
  }

  /**
  *
  * @desc - Gets data from API and sends to global state to rerender everything
  * @param {String} caseId -
  * @return {void}
  *
  **/
  async reloadPage(caseId = this.props.caseId) {
    let caseSummaryDataFromAPI = await this.Logic.getCasesSummaryData(caseId);

    //Dispatch caseSummaryData into global state
    this.props.setCaseSummaryDataAPIInGlobalState(caseSummaryDataFromAPI);
  }

  /*****************************************************************************
   *
   * @name PROPOSED ACTION
   * @desc - Section for handling creating Table and Modal for Proposed Action.
   *  Updating and saving Proposed Action field updates
   *
   *****************************************************************************/

   /**
    *
    * @desc - This is to set the action flags display in case summary page (not in the modals)
    * @param {Array} newProposedActionFlagsArray - proposed action flags array
    * @return {void}
    *
    **/
   setActionFlagsDisplayInProposedActionTable = (newProposedActionFlagsArray) => {
     let proposedActionFlagsDisplay = '';
     for(let each in newProposedActionFlagsArray){
       if(newProposedActionFlagsArray[each].shouldDisplay && newProposedActionFlagsArray[each].checked){
         if(proposedActionFlagsDisplay===''){
           proposedActionFlagsDisplay = newProposedActionFlagsArray[each].displayName;
         }else{
           proposedActionFlagsDisplay += ', '+newProposedActionFlagsArray[each].displayName;
         }
       }
     }
    this.setState({proposedActionFlagsDisplay: proposedActionFlagsDisplay})
   }

  /**
   *
   * @desc - Open proposedAction modal
   * @return {void}
   *
   **/
  closeProposedActionModal = () => this.setState({showProposedActionModal: false});

  /**
  *
  * @desc - Open proposedAction modal. Copy over new fields
  * @return {void}
  *
  **/
  showProposedActionModal = () => {
    let proposedAction = util.cloneObject(this.state.startingData.proposedAction);

    this.setState({proposedAction, showProposedActionModal: true});
  }

  /**
  *
  * @desc - Updates Proposed Action values in state
  * @param {Object} evt - evt for proposedAction change
  * @return {void}
  *
  **/
  onChangeProposedAction = (evt) => {
    let {name, value} = evt.target;
    let {proposedAction} = this.state;
    proposedAction[name].value = value;

    this.Logic.updateFieldDataByToggle(proposedAction, name);

    //let proposedAction = this.Logic.getVisibleFieldData(proposedAction);

    this.setState({proposedAction});
  }

  /**
  *
  * @desc - Extract proposedAction data and sends to API to be saved
  * @return {void}
  *
  **/
  saveProposedAction = async () => {
    let {proposedAction, opusCaseInfo, proposedActionFlags} = this.state;

    this.Logic.validateAllFieldDataOnSave(proposedAction);

    let fieldsHaveErrors = this.Logic.doFieldsHaveErrors(proposedAction);

    if(fieldsHaveErrors) {
      this.setState({proposedAction});
      return;
    }

    //Lets clone the action fields in case we need to keep the original
    let clonedFieldData = util.cloneObject(proposedAction);

    //Send off clonedData to be saved
    let apiPromise = this.Logic.saveProposedAction(clonedFieldData, opusCaseInfo, proposedActionFlags);

    //Disable the button so no double save
    this.setState({isProposedActionButtonDisabled: true});

    //Catch the promise so execution is not stopped if it has failed
    try {
      await apiPromise;
    } catch(e) {
      console.log("ERROR: api call in 'saveProposedAction' in ProposedSection.jsx")
      console.log(e);
    }

    //Enable save button, hide proposed action modal, send promise to error modal
    this.setState({apiPromise, isProposedActionButtonDisabled: false,
      showProposedActionModal: false});

    //Reload the page
    this.reloadPage();
  }

  /**
  *
  * @desc - Changes checked attribute for proposed action flags
  * @return {void}
  *
  **/
  changeProposedActionFlags(evt, action){
    let proposedActionFlags = this.CasesDossierLogic.changeProposedActionFlags(
      evt.target.checked, action, this.state.proposedActionFlags)
    this.setState({proposedActionFlags: proposedActionFlags})
  }

  /**
   *
   * @desc - Gets table with title of Proposed Action at the top
   * @return {JSX} - Proposed Action Modal
   *
   **/
  getProposedActionModal() {
    let {proposedAction, showProposedActionModal, proposedActionFlags} = this.state;
    let {caseSummaryDataFromAPI: {appointeeInfo, actionDataInfo}} = this.props;

    return (
      <Modal className="modal-lg" backdrop="static" show={showProposedActionModal}
        onHide={this.closeProposedActionModal}>
        <Header className=" modal-info " closeButton>
          <h1 className=" black "> Proposed Action </h1>
        </Header>
        <Body>
          <h2 className="flush-top">
            {appointeeInfo.fullName}
          </h2>

          <p>
            {actionDataInfo[0].actionTypeInfo.actionTypeDisplayText}
          </p>
          <ShowIf show={appointeeInfo.uid}>
            <p>UID: {appointeeInfo.uid}</p>
          </ShowIf>

          <FormShell >
            <VisibleFormGroup onChange={this.onChangeProposedAction}
              fields={proposedAction} />

              {proposedActionFlags.length>0 ?
                <div className={` form-group `}>
                  <div className=' col-sm-4 '>
                    <label className={`  form-control-static control-label `}>
                        Action Flags
                        <ToolTip text={tooltips.proposedActionFlag} />
                    </label>
                  </div>
                  <div className=' col-sm-8 '>
                    {proposedActionFlags.map((action, index) =>
                        action.shouldDisplay ?
                        <div key={index} className={` form-control-static `}>
                          <input type="checkbox" className="left" name={action.name}
                            checked={!!action.checked}
                            onChange={(evt) => this.changeProposedActionFlags(evt, action)}
                            />
                            {action.displayName}
                        </div>
                        :
                        null
                    )}
                  </div>
                </div>
                :
                null
              }

          </FormShell>
        </Body>
        <Footer>
          <Button className="btn btn-primary left" onClick={this.saveProposedAction}
            disabled={this.state.isProposedActionButtonDisabled}>
            Save
          </Button>
          <Dismiss onClick={this.closeProposedActionModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
   *
   * @desc - Gets table with title of Proposed Action at the top
   * @return {JSX} - Proposed Action Table
   *
   **/
  getProposedActionTable() {
    return (
      <div>
        <h2> Proposed Action </h2>
        <DisplayTable >
          <DisplayTableHeader>
            <ShowIf show={this.Logic.canEditProposedStatus}>
              <EditIcon {...{onClick: this.showProposedActionModal}} />
            </ShowIf>
          </DisplayTableHeader>
          <VisibleDisplayTableBody fieldOptions={this.state.tableData.proposedAction}
            valueKey="displayValue" />
            <tbody>
              <tr>
                <td className={` padding-8 label-column col-md-5 `}>
                  Action Flags <ToolTip text={tooltips.proposedActionFlag} />
                </td>
                <td className={` padding-8 data-column col-md-7 `}>
                  {this.state.proposedActionFlagsDisplay}
                </td>
              </tr>
            </tbody>
        </DisplayTable>
      </div>
    );
  }

  /**
   *
   * @desc - Gets proposed status fields
   * @param {Object} props - props for this Component
   * @return {JSX} - proposedStatus section
   *
   **/
  getProposedStatusSection(props = this.props) {
    let {caseSummaryDataFromAPI} = props;
    let {hasProposedStatusFields, actionDataSortedByAffiliation} = this.state;

    return (
      <ShowIf show={hasProposedStatusFields}>
        <div>
          <h2> Proposed Status </h2>
          {actionDataSortedByAffiliation.map((actionData, index) =>
            <ProposedStatus key={index} {...props} actionDataInfo={actionData}
              {...{caseSummaryDataFromAPI}}/>
          )}
        </div>
      </ShowIf>);
  }

  /*****************************************************************************
   *
   * @name Render Page
   * @desc -
   *
   *****************************************************************************/

  render() {
    if(!this.state.renderTables) {
      return null;
    }

    let proposedActionTable = this.getProposedActionTable();
    let proposedActionModal = this.getProposedActionModal();
    let proposedStatusSection = this.getProposedStatusSection();

    //Extract promises for failure and success modals
    let {state: {failurePromise, apiPromise}} = this;

    return (
      <div>
        <APIResponseModal {...{failurePromise}} promise={apiPromise} />

        {proposedActionTable}
        {proposedActionModal}
        {proposedStatusSection}
      </div>
    );
  }
}
