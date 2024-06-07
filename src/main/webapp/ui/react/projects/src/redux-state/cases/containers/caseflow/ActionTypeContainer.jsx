import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import ActionTypeModal from '../../../../react-views/cases/caseflow/ActionTypeModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class ActionTypeModalReduxContainer extends ActionTypeModal {}

export const ActionTypeModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(ActionTypeModalReduxContainer);
