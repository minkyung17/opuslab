import React from 'react'; import PropTypes from 'prop-types';
export {Dialog, Header, Title, Footer} from 'react-bootstrap/lib/Modal';

import {caseFlowModalContainers} from '../constants/ReduxModalContainers';
import CaseFlow from '../../../opus-logic/cases/classes/caseflow/CaseFlow';
import ModalConductorContainer from
  '../../../redux-state/cases/containers/ModalConductorContainer.jsx';

/*******************************************************************************
*
* @desc - Case Flow jsx
*
*******************************************************************************/
export default class CaseFlowApp extends React.Component {

  /**
  *
  * @desc - Default Properties Types for CaseFlow
  *
  **/
  static propTypes = {
    currentModal: PropTypes.string,
    setDataInGlobalState: PropTypes.func,
    setCaseLogic: PropTypes.func,
    changeCurrentModalInGlobalState: PropTypes.func,
    adminData: PropTypes.object.isRequired,
    access_token: PropTypes.string.isRequired
  }
  static defaultProps = {}

  /**
  *
  * @desc -
  * @param {Object} props - input props
  *
  **/
  constructor(props) {
    super(props);

    this.initCaseFlow(props);
  }

  /**
  *
  * @desc - Initial instance variables
  *
  **/
  state = {enableStartButton: true};
  CaseFlow = new CaseFlow(this.props);
  startModal = 'NAME_SEARCH';
  multipleCasesModal = 'BULK_ACTIONS_SELECT';

  /**
  *
  * @desc - starts everything off
  * @return {void}
  *
  **/
  initCaseFlow({globalData, adminData} = {}) {
    let formattedLists = this.CaseFlow.getFormattedListsFromCommonCallData(
      {globalData, adminData});
    this.onGetFormattedGlobalLists(formattedLists);
  }

  /**
  *
  * @desc - updates formattedLists from globalData to state
  * @param {Object} formattedLists - All lists retrieved
  * @return {void}
  *
  **/
  onGetFormattedGlobalLists(formattedLists = {}) {
    let {actionTypes, actionOutcomes, titleCodeList} = formattedLists;
    let {access_token, adminData} = this.props;
    this.props.setDataInGlobalState({actionTypes, actionOutcomes, titleCodeList,
      access_token, adminData});
  }

  /**
  *
  * @desc - Brings up first modal in case flow
  * @return {void}
  *
  **/
  startCaseFlow = ()=>{
    this.props.changeCurrentModalInGlobalState(this.startModal);
  }

  startBulkAction = () => {
    this.props.changeCurrentModalInGlobalState(this.multipleCasesModal);
  }

  /**
  *
  * @desc - Opens a case summary page given case id
  * @return {JSX} - js
  *
  **/
  render() {
    let {modal_start_number, enableStartButton} = this.state;
    let props = {...this.props, key: modal_start_number};

    return (
      <div>
        <div className = "btn-group">
          <button type = "button" className = "btn btn-primary" id="start-new-case-button"
            onClick={this.startCaseFlow} disabled={!enableStartButton}>
            <img src="../images/case-tiny.png" alt="case icon" />&nbsp;
            Start a New Case
          </button>

          <button type = "button" className = "btn btn-primary dropdown-toggle"
            data-toggle = "dropdown">
            <span className = "caret"></span>
            <span className = "sr-only">Toggle Dropdown</span>
          </button>

          <ul className = "dropdown-menu start-case-menu" role = "menu">
            <li>
              <a className = "dropdown-item" onClick={this.startBulkAction}>
                <img src="../images/cases-tiny.gif" alt="case icon" />
                Start Multiple Cases
              </a>
            </li>
          </ul>
        </div>

        <ModalConductorContainer {...props} modalOptions={caseFlowModalContainers}
          {...{modal_start_number, currentModal: this.props.currentModal}} />
      </div>
    );
  }
}
