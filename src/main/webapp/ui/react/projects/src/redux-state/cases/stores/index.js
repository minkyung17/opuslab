import thunkMiddleware from 'redux-thunk';
//import createLogger from 'redux-logger';
import {compose, createStore, applyMiddleware} from 'redux';
import {rootReducer} from '../reducers';
import {profileReducer} from '../reducers/ProfileReducers';
import {permissionsByUserReducer} from '../reducers/PermissionsByUserReducers';
import {permissionsByUnitReducer} from '../reducers/PermissionsByUnitReducers';
import {caseFlowReducer} from '../reducers/CaseFlowReducers';
import {caseSummaryReducer} from '../reducers/CaseSummaryReducers';
import {dashboardAlertReducer} from '../reducers/DashboardAlertReducers';
import {adminCompSummaryReducer} from '../reducers/AdminCompSummaryReducers';
import {quartzJobReducer} from '../reducers/QuartzJobReducers';
import {endowedChairSummaryReducer} from '../reducers/EndowedChairSummaryReducers';


//const loggerMiddleware = createLogger();

//All reducers in one if you need it
export let casesStore = createStore(rootReducer, {},
  // applyMiddleware(  //for asynchronous actions
  //   thunkMiddleware, // lets us dispatch() functions
  //   loggerMiddleware // neat middleware that logs actions
  // ),
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let profileStore = createStore(profileReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let permissionsByUserStore = createStore(permissionsByUserReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let permissionsByUnitStore = createStore(permissionsByUnitReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let caseSummaryStore = createStore(caseSummaryReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let caseFlowStore = createStore(caseFlowReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let dashboardAlertStore = createStore(dashboardAlertReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let adminCompSummaryStore = createStore(adminCompSummaryReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let quartzJobStore = createStore(quartzJobReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);

export let endowedChairSummaryStore = createStore(endowedChairSummaryReducer, {},
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);