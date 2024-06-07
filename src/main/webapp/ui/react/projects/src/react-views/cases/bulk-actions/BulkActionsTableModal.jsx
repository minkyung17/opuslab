import React from 'react';
import PropTypes from 'prop-types';

/**
*
* @desc - My imports
*
**/
import BaseModal from '../caseflow/BaseModal.jsx';

import BulkActions from '../../../opus-logic/datatables/classes/BulkActions';
import BulkActionsTable from '../../datatables/pages/BulkActionsTable.jsx';
import {actionTypeText, tableHelpText} from
  '../../../opus-logic/datatables/constants/BulkActionsConstants';
import Modal, {Header, Body} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';

/*******************************************************************************
*
* @desc - React JSX modal that shows Bulk Action DataTable
*
*******************************************************************************/
export default class BulkActionsTableModal extends BaseModal {
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
    nextModal: 'BULK_ACTIONS_FIELDS',
    previousModal: 'BULK_ACTIONS_SELECT',
    modalId: 'bulk-actions-modal'
  }

  /**
  *
  * @desc - Instance variables
  *
  **/
  BulkActionsLogic = new BulkActions(this.props);
  selectedRows = {};

  //React State variables
  state = {
    showModal: this.props.showModal,
    disableNextButton: true
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
   * @desc - Enable Next button if there are any selected rows
   * @param {Object} selectedRows - list of selected rows
   * @return {void}
   *
  **/
  updateButton = (selectedRows) => {
    this.selectedRows = selectedRows;
    let hasRows = Object.keys(selectedRows).length;
    this.setState({disableNextButton: !hasRows});
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

    //Dispatch selected row values and go to next modal
    this.props.setSelectedRowListInGlobalState(this.selectedRows);
    this.props.changeCurrentModalInGlobalState(nextModal);
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
  * @desc -
  * @return {JSX} -
  **/
  getModalBody() {
    return(
      <div>
        <h2 className="flush-top">{actionTypeText[this.props.selectedActionType]}</h2>
        <p>{tableHelpText[this.props.selectedActionType]}</p>
        <BulkActionsTable {...this.props} updateNextButton = {this.updateButton} />
      </div>
    );
  }

  /**
  *
  * @desc - Overrode render() so that we can make the modal larger
  * @return {void} -
  *
  **/
  render() {
    let {state: {showModal, disableNextButton}, closeModal} = this;
    let {modalId} = this.props;
    let header = this.getModalHeader({title: 'Start Multiple Cases'});
    let body = this.getModalBody();
    let footer = this.getModalFooter({disableNextButton});

    return(
      <Modal id={modalId} className="modal-xl" backdrop="static" ref="modal" show={showModal}
        onHide={closeModal}>
        {header}
        <Body> {body} </Body>
        {footer}
      </Modal>
    );
  }
}
