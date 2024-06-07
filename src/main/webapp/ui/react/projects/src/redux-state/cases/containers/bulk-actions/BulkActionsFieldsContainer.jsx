import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import BulkActionsFieldsModal from
  '../../../../react-views/cases/bulk-actions/BulkActionsFieldsModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from CaseFlowApp.
*
*
*******************************************************************************/
export class BulkActionsFieldsModalReduxContainer extends BulkActionsFieldsModal {}

export const BulkActionsFieldsModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(BulkActionsFieldsModalReduxContainer);
