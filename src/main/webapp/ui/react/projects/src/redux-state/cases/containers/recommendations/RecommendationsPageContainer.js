import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import RecommendationsPage from
  '../../../../react-views/cases/recommendation/RecommendationsPage.jsx';
import {caseSummaryMapStateToProps, caseSummaryDispatchMethods} from
  '../../utility/CaseSummaryDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class RecommendationsPageReduxContainer extends RecommendationsPage {}

/**
*
* @desc - Connects CaseSummary to redux
*
**/
export const RecommendationsPageContainer = connect(caseSummaryMapStateToProps,
  caseSummaryDispatchMethods)(RecommendationsPageReduxContainer);
