import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import AdminCompSummaryWrapper from
  '../../../../react-views/cases/admin-comp-summary/AdminCompSummaryWrapper.jsx';
import {adminCompSummaryMapStateToProps, adminCompSummaryDispatchMethods} from
  '../../utility/AdminCompSummaryDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class AdminCompSummaryWrapperReduxContainer extends AdminCompSummaryWrapper {}

/**
*
* @desc - Connects AdminCompSummary to redux
*
**/
export const AdminCompSummaryWrapperContainer = connect(adminCompSummaryMapStateToProps,
  adminCompSummaryDispatchMethods)(AdminCompSummaryWrapperReduxContainer);
