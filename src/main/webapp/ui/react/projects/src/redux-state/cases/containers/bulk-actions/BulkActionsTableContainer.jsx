import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import BulkActionsTableModal from
  '../../../../react-views/cases/bulk-actions/BulkActionsTableModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from CaseFlowApp.
*
*
*******************************************************************************/
export class BulkActionsTableModalReduxContainer extends BulkActionsTableModal {}

export const BulkActionsTableModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(BulkActionsTableModalReduxContainer);
