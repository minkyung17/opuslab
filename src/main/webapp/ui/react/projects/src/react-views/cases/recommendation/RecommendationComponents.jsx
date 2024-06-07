import React from 'react';
import PropTypes from 'prop-types';

//My imports
import * as util from '../../../opus-logic/common/helpers';
import {ToolTipWrapper} from '../../common/components/elements/ToolTip.jsx';
import {DeleteIcon, EditIcon} from '../../common/components/elements/Icon.jsx';
import {FormShell, VisibleFormGroup} from '../../common/components/forms/FormRender.jsx';
import {MultiColumnTables} from '../../common/components/elements/DynamicTables.jsx';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import RecommendationsLogic from
  '../../../opus-logic/cases/classes/recommendations/Recommendations';
import RecommendationsToggle from
  '../../../opus-logic/cases/classes/toggles/RecommendationsToggle';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';

/**
*
* Recommendations table and Modal
* @author - Leon Aburime
* @class AppointmentBlock
*
**/
export class RecommendationsBlock extends React.Component {

  static propTypes = {
    caseId: PropTypes.string,
    actionCategoryId: PropTypes.string,
    actionTypeId: PropTypes.string,
    caseRecommendationsAPIData: PropTypes.object,
    setCaseRecommendationsAPIDataInGlobalState: PropTypes.func
  };
  static defaultProps = {
    caseRecommendationsAPIData: {}
  }
  state = {
    showModal: false,
    allFieldData: {},
    fieldData: {}
  };
  /**
  * Title
  * @member {String}
  */
  title = 'Recommendations';

  /**
   *
   * @desc - Start to render the page
   * @return {void}
   *
   **/
  componentWillMount() {
    this.renderTableFromNewAPIData(this.props.caseRecommendationsAPIData);
  }

  /**
   *
   * @desc - When recieving new props, rerender the page
   * @return {void}
   *
   **/
  componentWillReceiveProps({caseRecommendationsAPIData}) {
    if(caseRecommendationsAPIData !== this.props.caseRecommendationsAPIData) {
      this.renderTableFromNewAPIData(caseRecommendationsAPIData);
    }
  }

  Toggle = new RecommendationsToggle();
  Logic = new RecommendationsLogic(this.props);
  valueKeys = ['edit', 'recommender', 'required', 'recommendation'];
  columnTitles = ['', 'Recommender/Approver', 'Required', 'Recommendation/Decision'];

  /**
   *
   * @desc - Show the modal
   * @param {Object} caseRecommendationsAPIData - caseRecommendations data from
   *  the backend
   * @return {void}
   *
   **/
  renderTableFromNewAPIData(caseRecommendationsAPIData) {
    if(caseRecommendationsAPIData) {
      let {actionCategoryId, actionTypeId} = this.props;
      let tableRows = this.Logic.extractRecommendationsData(caseRecommendationsAPIData);
      let allFieldData = this.Logic.createAllFieldData(caseRecommendationsAPIData,
        {actionCategoryId, actionTypeId});

      this.attachOnClickIcons(tableRows);
      this.setState({tableRows, allFieldData});
    }
  }

  /**
   *
   * @desc - Attaches onClick for editing data in modal
   * @param {Object} caseRecommendations - caseRecommendations data from
   *  the backend
   * @return {Object} caseRecommendations - caseRecommendations data from
   *  the backend
   *
   **/
  attachOnClickIcons(caseRecommendations = []) {
    for(let row of caseRecommendations) {
      let onClick = () => this.showModalWithRecommendation(row);
      let canEdit = this.Logic.canEditRecommendation(row);
      row.edit = canEdit ? <EditIcon {...{onClick}} /> : null;
    }

    return caseRecommendations;
  }

  /**
   *
   * @desc - Show the modal with new fields & values of row
   * @return {void}
   *
   **/
  showModalWithRecommendation = (currentRow) => {
    let {recommendationTypeId: id} = currentRow;
    let {fieldData, title} = this.Logic.getFieldDataInfoForRecommendationByTypeId(id);
    let clonedFieldData = util.cloneObject(fieldData);
    this.Logic.addValuesToFieldData(clonedFieldData, currentRow);
    this.Toggle.updateFieldDataByToggles(clonedFieldData);

    this.setState({showModal: true, modalTitle: title, currentRow, fieldData: clonedFieldData});
  }

  /**
   *
   * @desc - Hide the modal
   * @return {void}
   *
   **/
  hideModal = () => this.setState({showModal: false})

  /**
   *
   * @desc - Update fieldData and toggle the fields
   * @param {Object} evt - click event
   * @return {void}
   *
   **/
  onChange = (evt) => {
    let {target: {value, name}} = evt;
    let {fieldData} = this.state;
    fieldData[name].value = value;

    this.Toggle.updateFieldDataByToggles(fieldData);

    this.setState({fieldData});
  }

  onBlur() {

  }

  /**
  *
  * @desc - Validates fields. If all are valid then save
  * @return {void}
  *
  **/
  validateAndSaveData = async () => {
    let {state: {fieldData}} = this;

    this.Logic.validateAllFieldDataOnSave(fieldData);
    let fieldsHaveErrors = this.Logic.doFieldsHaveErrors(fieldData);

    if(!fieldsHaveErrors) {
      this.saveData();
    }

    this.setState({fieldData});
  }

  /**
  *
  * @desc - Saves data to the Logic side
  * @return {void}
  *
  **/
  async saveData() {
    let {state: {currentRow, fieldData}, props: {caseId}} = this;
    let recommendation = util.cloneObject(currentRow);

    //Removing Edit Icon jsx for the logic side
    delete recommendation.edit;

    //Get promise
    let promise = this.Logic.updateCaseAPI(fieldData, recommendation, {caseId});

    //Now hide the modal
    this.setState({showModal: false, promise});

    await promise;

    this.resetPage();
  }

  /**
   *
   * @desc - Gets api data and rerenders it for the front end
   * @return {void}
   *
   **/
  async resetPage() {
    let data = await this.Logic.getAPIData(this.props.caseId);
    this.props.setCaseRecommendationsAPIDataInGlobalState(data);
  }

  /**
   *
   * @desc - Modal that shows up for ediiting case
   * @return {JSX} - jsx modal
   *
   **/
  getModal() {
    return (
      <Modal className="modal-lg" show={this.state.showModal} onHide={this.hideModal}>
        <Header className=" modal-info " closeButton>
          <h1> {this.state.modalTitle} </h1>
        </Header>
        <Body>

          <FormShell>
            <VisibleFormGroup {...{onChange: this.onChange, onBlur: this.onBlur}}
              fields={this.state.fieldData}/>
          </FormShell>

        </Body>
        <Footer>
          <button className="btn left btn-primary" onClick={this.validateAndSaveData}>
            Save
          </button>
          <Dismiss className="btn left btn-link" onClick={this.hideModal}>
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
   *
   * @desc - Renders component
   * @return {JSX}
   *
   **/
  render() {
    let {valueKeys, columnTitles, state: {promise, tableRows}} = this;
    return (
      <div>
        <h1> {this.title} </h1>
        {this.getModal()}
        <APIResponseModal {...{promise}} />
        <MultiColumnTables rows={tableRows} {...{columnTitles, valueKeys}} />
      </div>
    );
  }
}
