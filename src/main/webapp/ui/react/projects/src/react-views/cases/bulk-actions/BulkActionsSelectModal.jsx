import React from 'react';
import PropTypes from 'prop-types';

/**
*
* @desc - My imports
*
**/
import BaseModal from '../caseflow/BaseModal.jsx';
import {Header, Footer} from '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {Select} from '../../common/components/forms/SelectOption.jsx';
import BulkActions from '../../../opus-logic/datatables/classes/BulkActions';
import {actionTypeList} from '../../../opus-logic/datatables/constants/BulkActionsConstants';

/*******************************************************************************
*
* @desc - React JSX modal that shows Action Types available for Bulk Actions
*
*******************************************************************************/
export default class BulkActionsSelectModal extends BaseModal {
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
    nextModal: 'BULK_ACTIONS_TABLE'
  }

  /**
  *
  * @desc - Instance variables
  *
  **/
  BulkActionsLogic = new BulkActions(this.props);

  dropdowns = {
    options_value_key: BulkActions.code_text,
    options_text_key: BulkActions.action_type_display_key
  };

  //React State variables
  state = {
    disableNextButton: true,
    showModal: this.props.showModal
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
  }

  /**
  *
  * @desc - After component is rendered
  * @return {void}
  *
  **/
  componentDidMount() {

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
  * @desc - Whenever user selects an action type update here
  * @param {Object} event - click event
  * @return {void}
  *
  **/
  selectActionType = ({target: {value} = {}} = event) => {
    this.selectedActionType = value;

    let disableNextButton = value ? false : true;
    this.setState({disableNextButton, value});
  }

  /**
  *
  * @desc - sets next modal with action type
  * @return {void} -
  *
  **/
  onClickNext = () => {
    let {nextModal: next} = this.props;

    //Choose the default next modal or next calculated modal based on dropdown selection
    let nextModal = this.nextAssignedModal || next; //Switch next modal if necessary
    this.props.changeCurrentModalWithSelectedActionTypeInGlobalState(nextModal,
      this.selectedActionType);
  }

  /**
  *
  * @desc - Gets header
  * @return {void}
  *
  **/
  getModalHeader({title, closeButton = true} = {}) {
    return(
      <Header className=" modal-info " {...{closeButton}}>
        <h1 className="modal-title" id="ModalHeader">
          <img src={this.getImagePath()} className="modal-header-icon"
            alt="case icon" />
          &nbsp; &nbsp; Start Multiple Cases
        </h1>
      </Header>
    );
  }

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
  * @desc - Gets modal body
  * @return {JSX} -
  **/
  getModalBody() {
    let {state: {value}} = this;
    let {options_value_key: code, options_text_key: actionTypeDisplayText} = this.dropdowns;

    return(
      <div>
        <h2 className="flush-top">Start a case for more than one person.</h2>
        <p> <label>What type of case would you like to start?</label></p> 

        <Select {...{value}} options_value_key={code} options_text_key={actionTypeDisplayText}
          options={actionTypeList} onChange={this.selectActionType} alphabetized />
      </div>
    );
  }

  /**
  *
  * @desc - Gets footer
  * @param {Object} props - var to enable next  button
  * @return {void}
  *
  **/
  getModalFooter({disableNextButton = true} = {}) {
    return (
      <Footer>
        {/* <Dismiss className="btn btn-default">Cancel</Dismiss> */}
        <button className="btn btn-primary left" disabled={disableNextButton}
          onClick={this.onClickNext}>
          <span className=" icon-right wizard icon-position " />
          Next
        </button>
      </Footer>
    );
  }
}
