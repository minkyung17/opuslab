import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import ProposedFieldsModal
  from '../../../../react-views/cases/caseflow/ProposedFieldsModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class ProposedFieldsReduxContainer extends ProposedFieldsModal {}

export const ProposedFieldsModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(ProposedFieldsReduxContainer);
