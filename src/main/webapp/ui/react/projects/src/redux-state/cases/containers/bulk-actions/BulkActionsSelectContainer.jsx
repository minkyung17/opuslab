import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import BulkActionsSelectModal from
  '../../../../react-views/cases/bulk-actions/BulkActionsSelectModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from CaseFlowApp.
*
*
*******************************************************************************/
export class BulkActionsSelectModalReduxContainer extends BulkActionsSelectModal {}

export const BulkActionsSelectModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(BulkActionsSelectModalReduxContainer);
