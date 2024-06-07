import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import RecruitUIDModal from '../../../../react-views/cases/caseflow/RecruitUIDModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class RecruitUIDModalReduxContainer extends RecruitUIDModal {}

export const RecruitUIDModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(RecruitUIDModalReduxContainer);
