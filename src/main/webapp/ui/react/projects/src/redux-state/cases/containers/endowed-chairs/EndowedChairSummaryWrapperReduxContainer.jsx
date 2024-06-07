import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import EndowedChairSummaryWrapper from
  '../../../../react-views/cases/endowed-chairs/EndowedChairSummaryWrapper.jsx';
import {endowedChairSummaryMapStateToProps, endowedChairSummaryDispatchMethods} from
  '../../utility/EndowedChairSummaryDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class EndowedChairSummaryWrapperReduxContainer extends EndowedChairSummaryWrapper {}

/**
*
* @desc - Connects EndowedChairSummary to redux
*
**/
export const EndowedChairSummaryWrapperContainer = connect(endowedChairSummaryMapStateToProps,
  endowedChairSummaryDispatchMethods)(EndowedChairSummaryWrapperReduxContainer);
