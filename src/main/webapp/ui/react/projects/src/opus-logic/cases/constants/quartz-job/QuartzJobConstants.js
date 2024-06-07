export const urlConfig = {

  getQuartzJobInfoUrl: (access_token) =>
    `/restServices/rest/admin/getQuartzJobInfo?access_token=${access_token}`,

  updateJobOnOffUrl: ({access_token, jobId, jobName, jobFrequency, jobScheduleTime, jobOnOff,
      loggedInUserName, loggedInUserFirstName, loggedInUserEmail}) =>

    `/restServices/rest/admin/updateQuartzJobInfo/${jobId}/${jobName}/${jobFrequency}/${jobScheduleTime}/${jobOnOff}/${loggedInUserName}/${loggedInUserFirstName}/${loggedInUserEmail}/?access_token=${access_token}`

};

export const quartzConstants = {
  view_permissions: 'eligibility'
};
