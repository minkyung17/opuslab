import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import CaseSummaryWrapper from
  '../../../../react-views/cases/case-summary/CaseSummaryWrapper.jsx';
import {caseSummaryMapStateToProps, caseSummaryDispatchMethods} from
  '../../utility/CaseSummaryDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class CaseSummaryWrapperReduxContainer extends CaseSummaryWrapper {}

/**
*
* @desc - Connects CaseSummary to redux
*
**/
export const CaseSummaryWrapperContainer = connect(caseSummaryMapStateToProps,
  caseSummaryDispatchMethods)(CaseSummaryWrapperReduxContainer);
