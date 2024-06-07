import {combineReducers} from 'redux';
import {caseFlowReducer as caseFlow} from './CaseFlowReducers';
import {caseSummaryReducer as caseSummary} from './CaseSummaryReducers';
import {adminCompSummaryReducer as adminCompSummary} from './AdminCompSummaryReducers';
import {profileReducer as profile} from './ProfileReducers';
import {permissionsByUserReducer as permissionsByUser} from './PermissionsByUserReducers';
import {permissionsByUnitReducer as permissionsByUnit} from './PermissionsByUnitReducers';
import {dashboardAlertReducer as dashboardAlert} from './DashboardAlertReducers';
import {quartzJobReducer as quartzJob} from './QuartzJobReducers';
import {endowedChairSummaryReducer as endowedChairSummary} from './EndowedChairSummaryReducers';

export const rootReducer = combineReducers({caseFlow, caseSummary, adminCompSummary, profile, permissionsByUser, permissionsByUnit, dashboardAlert, quartzJob, endowedChairSummary});
