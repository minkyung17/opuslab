import {createConfigFromTemplate} from './DatatableConfigTemplate';
import {dataViewTypes} from './DatatableConstants';

/**
 * @desc - Configuration constant for DashboardAlert Records
 *
 *
**/
export const dashboardAlertConfig = {
  grouperPathText: 'eligibility',
  url: '/restServices/rest/alert/getAlert',
  saveAlertUrl: '/restServices/rest/alert/saveAlert',
  columnFilterKey: 'eligibleFilterMap',
  pagePermissions: {
    name: 'eligibility',
    action: 'view'
  },
  columnKeys: ['alertOnOff', 'dashboard', 'alertTitle', 'alertText', 'alertExpiryDt'],
  //Columns will appear in array order shown here
  columnConfiguration: {
    alertOnOff: {
      name: 'alertOnOff',
      displayName: 'On/Off',
      // viewType: dataViewTypes.checkbox,
      visible: true,
      fixed: true,
      sortable: false,
      width: 50,
      uiProps: {
        checked: false
      },
      pathsInAPI: {
        appointment: {
          value: 'alertOnOff',
          displayText: 'alertOnOff'
        }
      }
    },
    dashboard: {
      name: 'dashboard',
      displayName: 'Dashboard',
      pathsInAPI: {
        appointment: {
          value: 'dashboard',
          displayText: 'dashboard'
        }
      },
      visible: true,
      sortable: false,
      fixed: true,
      width: 100
    },
    alertTitle: {
      name: 'alertTitle',
      displayName: 'Alert Title',
      viewType: dataViewTypes.textArea,
      pathsInAPI: {
        appointment: {
          value: 'alertTitle',
          displayText: 'alertTitle'
        }
      },
      visible: true,
      sortable: false,
      fixed: true,
      width: 200
    },
    alertText: {
      name: 'alertText',
      displayName: 'Alert Text',
      pathsInAPI: {
        appointment: {
          value: 'alertText',
          displayText: 'alertText'
        }
      },
      visible: true,
      sortable: false,
      fixed: true,
      width: 400
    },
    alertExpiryDt: {
      name: 'alertExpiryDt',
      displayName: 'Expires on',
      pathsInAPI: {
        appointment: {
          value: 'alertExpiryDt',
          displayText: 'alertExpiryDt'
        }
      },
      visible: true,
      sortable: false,
      fixed: true,
      width: 100
    }
  }
};

export const config = createConfigFromTemplate(dashboardAlertConfig);
