export const urls = {
  getTemplates: '/restServices/rest/wfm/getTemplateAtUnit/?access_token=',
  saveCaseInByC: '/restServices/rest/wfm/caseInByC/?access_token=',
  unlinkInterfolioCase: '/restServices/rest/activecase/unlinkACase/?',
  emailValidationURL: '/restServices/rest/activecase/checkForDuplicateEmail?',
  getPacketIDInfo: ({packetID, access_token}) =>
    `/restServices/rest/activecase/searchForPacketID/${packetID}?access_token=${access_token}`,
  updateCaseInOpus: '/restServices/rest/activecase/updateCaseInOpus/?access_token='
};

export let reviewProcessTemplate = {
  template: null,
  appointeeInfo: {
    firstName: '',
    lastName: '',
    contactValue: ''
  },
  tieWithExistingCase: false,
  bycUnitId: null,
  caseId: null,
  bycPacketId: null,
  adminName: ''
};

export const messages = {
  blankEmailError: `This field is required. If you do not know the email address, enter a unique address such as JPF1234Bruin@ucla.edu. This address will be overwritten once this person has an official email.`,
  uniqueEmailError: `The email address you entered is not unique. If you do not know the email address, enter a unique address such as JPF1234Bruin@ucla.edu. This address will be overwritten once this person has an official email.`,
  invalidEmailError: `The email address you entered is not valid. If you do not know the email address, enter a unique address such as JPF1234Bruin@ucla.edu. This address will be overwritten once this person has an official email.`
}
