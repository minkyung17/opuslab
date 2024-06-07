/**
 * Created by leonaburime on 6/29/16.
 **/
/* eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';

//Redux Imports
import {Provider} from 'react-redux';

//My imports
import {datatables} from './react-views/datatables/pages/AllPages';

//Cases, Profiles Imports
import {caseFlowStore, caseSummaryStore, adminCompSummaryStore, profileStore, permissionsByUserStore, permissionsByUnitStore, dashboardAlertStore, quartzJobStore, endowedChairSummaryStore} from
  './redux-state/cases/stores';
import {CaseFlowContainer} from
  './redux-state/cases/containers/caseflow/CaseFlowPageReduxContainer.jsx';

import {CaseSummaryWrapperContainer} from
  './redux-state/cases/containers/case-summary/CaseSummaryWrapperReduxContainer.jsx';
import {AdminCompSummaryWrapperContainer} from
  './redux-state/cases/containers/admin-comp-summary/AdminCompSummaryWrapperReduxContainer.jsx';
import {EndowedChairSummaryWrapperContainer} from
  './redux-state/cases/containers/endowed-chairs/EndowedChairSummaryWrapperReduxContainer.jsx';
import {ProfileWrapper} from './react-views/cases/state-containers/';
import {PermissionsByUserWrapper} from './react-views/cases/state-containers/';
import {PermissionsByUnitWrapper} from './react-views/cases/state-containers/';
import {DashboardAlert} from './react-views/cases/state-containers/';
import {QuartzJob} from './react-views/cases/state-containers/';

//Datatables
window._initReactDataTable = (id, datatable_name, config_name,
  access_token, adminData, globalData) => {
  let DataTable = datatables[datatable_name];
  let args = {access_token, adminData, globalData, config_name};

  render(<DataTable {...args}/>, document.getElementById(id));
};

//Profile Page
window._initReactProfile = (...args) => {
  let [id,,, access_token, adminData, globalData] = args;
  let data = {access_token, adminData, globalData};
  render(
    <Provider store={profileStore}><ProfileWrapper {...data} /></Provider>,
    document.getElementById(id));
};

//Alert Page
window._initReactDashboardAlert = (...args) => {
  let [id,,, access_token, adminData, globalData] = args;
  let data = {access_token, adminData, globalData};
  render(
    <Provider store={dashboardAlertStore}><DashboardAlert {...data} /></Provider>,
    document.getElementById(id));
};

//QuartzJob Page
window._initReactQuartzJob = (...args) => {
  let [id,,, access_token, adminData, globalData] = args;
  let data = {access_token, adminData, globalData};
  render(
    <Provider store={quartzJobStore}><QuartzJob {...data} /></Provider>,
    document.getElementById(id));
};

//Permission by User Page
window._initReactPermissionsByUser = (...args) => {
  let [id,,, access_token, adminData, globalData] = args;
  let data = {access_token, adminData, globalData};
  render(
    <Provider store={permissionsByUserStore}><PermissionsByUserWrapper {...data} /></Provider>,
    document.getElementById(id));
};

//Permission by Unit Page
window._initReactPermissionsByUnit = (...args) => {
  let [id,,, access_token, adminData, globalData] = args;
  let data = {access_token, adminData, globalData};
  render(
    <Provider store={permissionsByUnitStore}><PermissionsByUnitWrapper {...data} /></Provider>,
    document.getElementById(id));
};

//Cases
window._initReactCases = (id, access_token, adminData, globalData) => {
  let args = {access_token, globalData, adminData};
  render(
    <Provider store={caseFlowStore} ><CaseFlowContainer {...args} /></Provider>,
    document.getElementById(id)
  );
};

//Case Summary
window._initReactCaseSummary = (id, access_token, adminData, globalData) => {
  let args = {access_token, globalData, adminData};
  render(
    <Provider store={caseSummaryStore}><CaseSummaryWrapperContainer {...args} /></Provider>,
    document.getElementById(id)
  );
};

//Admin Comp Summary
window._initAdminCompSummary = (id, access_token, adminData, globalData) => {
  let args = {access_token, globalData, adminData};
  render(
    <Provider store={adminCompSummaryStore}><AdminCompSummaryWrapperContainer {...args} /></Provider>,
    document.getElementById(id)
  );
};

//Endowed Chair Summary
window._initEndowedChairSummary = (id, access_token, adminData, globalData) => {
  let args = {access_token, globalData, adminData};
  render(
    <Provider store={endowedChairSummaryStore}><EndowedChairSummaryWrapperContainer {...args} /></Provider>,
    document.getElementById(id)
  );
};
