export const urlConfig = {

  getAlertsUrl: (access_token) =>
    `/restServices/rest/alert/getAlert?access_token=${access_token}`,

  saveAlertUrl: (access_token) =>
    `/restServices/rest/alert/saveAlert?access_token=${access_token}`

};

export const dashboardConstants = {
  view_permissions: 'profile'
};
