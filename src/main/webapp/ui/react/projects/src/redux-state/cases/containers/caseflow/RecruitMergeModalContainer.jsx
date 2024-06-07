import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import RecruitMergeModal from '../../../../react-views/cases/caseflow/RecruitMergeModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class RecruitMergeModalReduxContainer extends RecruitMergeModal {}

export const RecruitMergeModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(RecruitMergeModalReduxContainer);
