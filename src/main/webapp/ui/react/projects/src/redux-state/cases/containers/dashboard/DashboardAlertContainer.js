import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import DashboardAlert from
  '../../../../react-views/cases/dashboard-alert/DashboardAlert.jsx';
import {dashboardAlertMapStateToProps, dashboardAlertDispatchMethods} from
  '../../utility/DashboardAlertDispatch';


/******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in dashboard alert
*  we need to overwrite any behaviors from DashboardAlertPage.
*
*
*******************************************************************************/
class DashboardAlertReduxContainer extends DashboardAlert {}

/**
*
* @desc - Connects unitPermissions to redux
*
**/
export const DashboardAlertContainer = connect(dashboardAlertMapStateToProps,
  dashboardAlertDispatchMethods)(DashboardAlertReduxContainer);
