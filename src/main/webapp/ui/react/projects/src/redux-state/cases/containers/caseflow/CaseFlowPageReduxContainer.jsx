import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import CaseFlowApp from '../../../../react-views/cases/pages/CaseFlowPage.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
class CaseFlowReduxContainer extends CaseFlowApp {}

/**
*
* @desc - Connects CaseFlow to redux
*
**/
export const CaseFlowContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(CaseFlowReduxContainer);
