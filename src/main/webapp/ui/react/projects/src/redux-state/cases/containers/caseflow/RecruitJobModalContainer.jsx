import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import RecruitJobModal from '../../../../react-views/cases/caseflow/RecruitJobModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class RecruitJobModalReduxContainer extends RecruitJobModal {}

export const RecruitJobModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(RecruitJobModalReduxContainer);
