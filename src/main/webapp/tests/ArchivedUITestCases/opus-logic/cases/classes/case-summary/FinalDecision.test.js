import axios from 'axios';
import {assert} from 'chai';
import moment from 'moment';
import {flatten, flatMap} from 'lodash';

//Testing imports
import '../../../../test-utility/setup-tests';
import * as testHelpers from '../../../../test-utility/helpers';
import {constants as testConstants} from '../../../../test-utility/testing-constants';

//Application imports
import * as commonTests from '../Cases.common';
import * as caseSummaryCommonTests from './CaseSummary.common';
import * as util from '../../../../../opus-logic/common/helpers';
import FieldData from '../../../../../opus-logic/common/modules/FieldData';
import {fieldsInAPI} from '../../../../../opus-logic/cases/constants/FieldDataConstants';
import {urls, constants as caseConstants} from
  '../../../../../opus-logic/cases/constants/CasesConstants';
import {constants as caseSummaryConstants, actionDataTemplate} from
  '../../../../../opus-logic/cases/constants/case-summary/CaseSummaryConstants';
import FinalDecision from
  '../../../../../opus-logic/cases/classes/case-summary/FinalDecision';
import ProposedFields from
  '../../../../../opus-logic/cases/classes/case-summary/ProposedFields';

describe('Final Decision Logic Class', () => {
  let {karmaAliasBaseUrl} = testConstants;
  let cachePaths = {
    apiApptData: 'caseSummary.finalDecision.apiData'
  };
  let caseId = 4191;

  let actionDataInfo = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let casesProposedAttrMap = null;
  let casesApprovedAttrMap = null;
  let caseSummaryDataFromAPI = null;
  let opusCaseInfo = null;

  //Common variables
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let Logic = null;
  let FieldDataLogic = new FieldData();
  let ProposedFieldsLogic = null;


  /**
   *
   * @desc - Lets get access token and adminData to instantiate class
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();

    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    Logic = new FinalDecision({globalData, adminData, access_token, caseId});
    ProposedFieldsLogic = new ProposedFields({globalData, adminData, access_token, caseId});
    done();
  });

  /**
   *
   * @desc - Get cache data of nameSearchResults and apptData
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiApptData} = cachePaths;
    caseSummaryDataFromAPI = await testHelpers.getAPIDataFromCache(apiApptData);
    appointmentData = caseSummaryDataFromAPI;
    done();
  });

  /************************** RETRIEVE API DATA FIRST *************************/
  it('getCasesSummaryData() gets appointmentData & caches it', async (done) => {
    let {apiApptData} = cachePaths;

    if(!appointmentData) {
      let apptDataUrl = Logic.getCaseSummaryDataAPIUrl();
      let apiArgs = Logic.getCaseSummaryDataAPIArgs(caseId);
      let apiUrl = karmaAliasBaseUrl + apptDataUrl;
      let {data} = await axios.get(apiUrl, {params: apiArgs});
      appointmentData = data;
      testHelpers.postAPIDataToCache(appointmentData, apiApptData);
    }

    opusCaseInfo = appointmentData.opusCaseInfo;
    appointeeInfo = appointmentData.appointeeInfo;
    actionDataInfo = appointmentData.actionDataInfo;
    casesProposedAttrMap = appointmentData.casesProposedAttrMap;
    casesApprovedAttrMap = appointmentData.casesApprovedAttrMap;
    done();
  });
  // /************************** END OF API DATA RETRIEVAL*************************/


  it('isActionOutcomeDisapproved() ', () => {
    let {finalDecisionPopup} = Logic.createFinalDecisionFieldsFromCaseSummaryAPIData(
      caseSummaryDataFromAPI);

    let popupClone = util.cloneObject(finalDecisionPopup);
    let isDisapproved = Logic.isActionOutcomeDisapproved(popupClone);

    //Get value
    let {disapprovedOutcomeOptions} = caseSummaryConstants;
    let {value} = finalDecisionPopup.approvedOutcome;
    let testIsDisapproved = false;
    for(let each in disapprovedOutcomeOptions){
      if(Number(value) === disapprovedOutcomeOptions[each].value){
        testIsDisapproved = true;
        break;
      }
    }

    assert.equal(isDisapproved, testIsDisapproved);
  });

  //Not testing promises. Method is tested in super class
  it('getCommentsById() ', () => {});

  it('formatSaveCommentTemplate() ', () => {
    let commentsText = 'Some comments';
    let template = Logic.formatSaveCommentTemplate(commentsText, caseId);

    assert.equal(template.commentsText, commentsText);
    assert.equal(template.entityKeyColumnValue, caseId);
    assert.equal(template.screenName, 'case');
    assert.equal(template.loggedInUserName, adminData.adminName);
  });

  it('addOutcomeOptionList() ', () => {
    //Create approved fields, fill them with values and options
    let fieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesApprovedAttrMap, {fieldDataOptions: fieldsInAPI});

    //Add outcome list to approvedOutcome
    Logic.addOutcomeOptionList(fieldData.approvedOutcome, actionDataInfo[0]);

    //Get actionType to decide with which outcome list to use
    let actionType = Logic.getActionTypeFromActionData(actionDataInfo[0]);
    let options = Logic.formattedCommonCallLists.actionTypesToOutcomeSortedOptions[actionType];

    assert.deepEqual(fieldData.approvedOutcome.options, options);
  });

  it('createFinalDecisionFieldsFromCaseSummaryAPIData() is executed with no errors'
  + ' as all functions here tested elsewhere', () => {
    let formattedFields = Logic.createFinalDecisionFieldsFromCaseSummaryAPIData(
      caseSummaryDataFromAPI);

    //Make sure these fields are returned in "formattedFields"
    assert.containsAllKeys(formattedFields, ['finalDecisionMain', 'finalDecisionPopup',
      'finalDecisionByApptId']);


    //Functions here Tested elsewhere in this file
    //createApprovedFieldsFromAttrProps()
    //getFinalDecisionFieldsByApptIdFromActionData
    //formatFinalDecisionDataByActionData
    //addOutcomeOptionList


  });

  it('createApprovedFieldsFromAttrProps() ', () => {
    let fieldData = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let fields = Object.values(fieldData);
    let allFields = util.flattenArrayOfObjects(fields);
    let approvedTypes = {caseLocation: true, finalDecision: true,
      finalDecisionPopup: true, finalDecisionMain: true};

    for(let [, field] of Object.entries(allFields)) {
      assert.isTrue(field.attributeProperties.sectionName in approvedTypes);
    }
  });

  it('getFinalDecisionFieldsByApptIdFromActionData() checks apptId keys fields', () => {
    let {finalDecision} = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let fieldDataByApptId = Logic.getFinalDecisionFieldsByApptIdFromActionData(
      finalDecision, actionDataInfo);

    for(let {appointmentInfo: {appointmentId}} of actionDataInfo) {
      //Make sure appointmentId is a key for "fieldDataByApptId"
      assert.isTrue(appointmentId in fieldDataByApptId);
    }
  });

  it('getFinalDecisionFieldsByApptIdFromActionData() fields from finalDecision ' +
  'are the same as "fieldDataByApptId"', () => {
    let {finalDecision} = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let fieldDataByApptId = Logic.getFinalDecisionFieldsByApptIdFromActionData(
      finalDecision, actionDataInfo);

    for(let {appointmentInfo: {appointmentId}} of actionDataInfo) {
      //fields in finalDecisionByApptId should be drawn from 'finalDecision'
      let fieldNames = Object.keys(finalDecision);
      assert.containsAllKeys(fieldDataByApptId[appointmentId], fieldNames);
    }
  });

  it('formatFinalDecisionDataByActionData() ', () => {
    let actionData = actionDataInfo[0];
    let {finalDecision} = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    Logic.formatFinalDecisionDataByActionData(finalDecision, actionDataInfo[0]);

    caseSummaryCommonTests.addValuesToFieldData(Logic, finalDecision, actionData);
    commonTests.reformatDisplayValuesBasedOnViewType(Logic, finalDecision, actionData);

    commonTests.addOptionsListToFieldData(Logic, finalDecision);
    commonTests.addStepOptionsByTitleCodeValue(Logic, finalDecision);
    caseSummaryCommonTests.getActionTypeFromActionData(Logic, actionDataInfo[0]);

    //Handled in super class
    //handleJointSplitAffiliationException
  });

  it('setApprovedValuesFromProposedFieldData() ensures field values from proposed'
  + ' are transferred to approved', () => {
    //Final Decision will be blank on start
    let {finalDecision} = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);

    //Proposed status fields will have values from actionDataInfo[0]
    let proposedStatus = ProposedFieldsLogic.createProposedStatusFieldData(actionDataInfo[0],
      casesProposedAttrMap);

    Logic.setApprovedValuesFromProposedFieldData(finalDecision, proposedStatus);

    //Now lets make sure the values from proposed are in approved
    for(let name in proposedStatus) {
      let {value, editable, visibility, options, optionsInfo} = proposedStatus[name];

      assert.include(finalDecision[name], {value, editable, visibility,
        options, optionsInfo});
    }
  });

  it('formatSalaryException() formats the salary for null values', () => {
    let approvedFields = {
      salary: {
        value: null
      }
    };
    let formattedApprovedFields = Logic.formatSalaryException(approvedFields);
    assert.equal(formattedApprovedFields.salary.value, '');
  });

  it('doFinalDecisionFieldsHaveErrors() should have no errors', () => {
    let fields = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let {finalDecisionPopup, finalDecision} = fields;

    //Use a random key to set up for test
    let finalDecisionByApptId = {key: finalDecision};

    //Check if any fields "hasErrors" is true. Should not be
    let hasErrors = Logic.doFinalDecisionFieldsHaveErrors(finalDecisionPopup,
      finalDecisionByApptId, actionDataInfo[0]);

    //No errors as no field was validated
    assert.isNotTrue(hasErrors);
  });

  it('doFinalDecisionFieldsHaveErrors() no errors if approved outcome is disapproved', () => {
    let fields = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let {finalDecisionPopup, finalDecision} = fields;

    //Use a random key to set up for test
    let finalDecisionByApptId = {key: finalDecision};

    //If approvedOutcome is disapproved
    for(let each in caseSummaryConstants.disapprovedOutcomeOptions){
      let value = caseSummaryConstants.disapprovedOutcomeOptions[each].value;
      finalDecisionPopup.approvedOutcome.value = value;

      //and a finalDecisionByApptId hasError = true
      finalDecision.titleCode.hasError = true;

      //it should return false
      let hasErrors = Logic.doFinalDecisionFieldsHaveErrors(finalDecisionPopup,
        finalDecisionByApptId, actionDataInfo[0]);

      //since finalDecisionByApptId wont be tested
      assert.isNotTrue(hasErrors);
    }
  });

  it('doFinalDecisionFieldsHaveErrors() will haveError if approvedOutcome != Disapproved'
   + 'finalDecisionByApptId field has error', () => {
    let fields = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let {finalDecisionPopup, finalDecision} = fields;

    //Use a random key to set up for test
    let finalDecisionByApptId = {key: finalDecision};

    //and a finalDecisionByApptId hasError = true
    finalDecision.titleCode.hasError = true;

    //it should return false
    let hasErrors = Logic.doFinalDecisionFieldsHaveErrors(finalDecisionPopup,
      finalDecisionByApptId, actionDataInfo[0]);

    //since finalDecisionByApptId wont be tested
    assert.isTrue(hasErrors);
  });

  it('getErrorMessage() returns null when no errors', () => {
    //No errors so no error message
    let fieldsHaveErrors = false;
    let commentIsValid = true;
    let errorMessage = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);
    assert.isNull(errorMessage);
  });

  it('getErrorMessage() returns error message for fields when fields have errors', () => {
    //Field error so message asks to check for errors
    let fieldsHaveErrors = true;
    let commentIsValid = true;
    let errorMessage = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);
    assert.equal('Sorry, there was a problem. Please check the form for errors.',
      errorMessage);
  });

  it('getErrorMessage() returns error message for fields when both have errors', () => {
    //Both have errors so message asking to check form errors take precedence
    let fieldsHaveErrors = true;
    let commentIsValid = false;
    let errorMessage = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);
    assert.equal('Sorry, there was a problem. Please check the form for errors.',
      errorMessage);
  });

  it('getErrorMessage() returns error message for comment when only comment has errors', () => {
    //Only comment error so get appropriate message
    let fieldsHaveErrors = false;
    let commentIsValid = false;
    let errorMessage = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);

    //No errors so no error message
    assert.equal('Please add a comment to save.', errorMessage);
  });

  //Not testing promises. Functions here tested elsewhere
  it('saveComments() ', () => {
    //getSaveCommentArgs
    //formatSaveCommentTemplate
  });

  it('setFinalDecisionOutComeData() ', () => {
    //Create approved fields, fill them with values and options
    let fieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesApprovedAttrMap, {fieldDataOptions: fieldsInAPI});

    let blankActionData = util.cloneObject(actionDataTemplate);

    //Add disapproved value to "approvedOutcome"
    let {disapprovedOutcomeOptions} = caseSummaryConstants;

    //Format approvedOutcome values
    let {approvedOutcome} = fieldData;
    approvedOutcome.value = disapprovedOutcomeOptions[0].value;

    //Create actionType to index in "actionTypesToOutcomeOptions"
    let actionType = Logic.getActionTypeFromActionData(actionDataInfo[0]);

    //approvedActionOutcome should not be equal to approvedOutcome.value
    assert.notEqual(blankActionData.approvedActionOutcome.code, approvedOutcome.value);

    //Add outcome value and Name to approvedOutcome
    Logic.setFinalDecisionOutComeData(fieldData.approvedOutcome,
      blankActionData.approvedActionOutcome, actionType);

    //blankActionData.approvedActionOutcome === approvedOutcome code & name
    let {approvedActionOutcome} = blankActionData;

    //Code should be 2 for disapproved
    assert.equal(approvedActionOutcome.code, approvedOutcome.value);

    //Text should be "Disapproved"
    assert.equal(disapprovedOutcomeOptions[0].text, approvedActionOutcome.name);
  });

  it('addSaveConstantsToDataTemplate() checks if opusCaseInfo is correct ', () => {
    let saveType = {saveActive: true};

    //Just need a simple template as Im just testing opusCaseInfo constants
    let template = {actionsData: []};
    template = Logic.addSaveConstantsToDataTemplate(template, {caseId, saveType});

    //Assert caseId gets through
    assert.equal(template.opusCase.caseId, caseId);

    //Make sure saveConstants in opusCase are correct
    let opusCase = Logic.getOpusCaseSaveConstants(saveType);

    assert.include(template.opusCase, opusCase);
  });


  it('addSaveConstantsToDataTemplate() - check actionData via saveActive saveType'
  + ' has correct constants', () => {
    //Make sure assertion is executed inside the loop;
    let wasTested = false;
    let saveType = {saveActive: true};
    let actionDataFunc = Logic.getActionDataSaveFunc(saveType);

    //Just need a simple template as Im just testing opusCaseInfo constants
    let template = {actionsData: [{}, {}]};

    //Overlay the actionData constants in template.actionsData
    template = Logic.addSaveConstantsToDataTemplate(template, {caseId, saveType});

    //Iterate actionData constants and ensure each has required constants
    for(let actionData of template.actionsData) {
      wasTested = true;
      //Get constants JUST from saveType
      let actionDataConstants = actionDataFunc(actionData);

      //These constants MUST be in actionData from "addSaveConstantsToDataTemplate"
      assert.include(actionData, actionDataConstants);
    }

    assert.isTrue(wasTested);
  });

  it('addSaveConstantsToDataTemplate() - check actionData via saveCompleted saveType'
  + ' has correct constants', () => {
    //Make sure assertion is executed inside the loop;
    let wasTested = false;
    let saveType = {saveCompleted: true};
    let actionDataFunc = Logic.getActionDataSaveFunc(saveType);

    //Just need a simple template as Im just testing opusCaseInfo constants
    let template = {actionsData: [
      {rowStatusId: 100, actionStatusId: 200},
      {rowStatusId: 'any key', actionStatusId: 'can be used'}
    ]};

    //Overlay the actionData constants in template.actionsData
    template = Logic.addSaveConstantsToDataTemplate(template, {caseId, saveType});

    //Iterate actionData constants and ensure each has required constants
    for(let actionData of template.actionsData) {
      //Get constants JUST from saveType
      let actionDataConstants = actionDataFunc(actionData);

      wasTested = true;
      //These constants MUST be in actionData from "addSaveConstantsToDataTemplate"
      assert.include(actionData, actionDataConstants);
    }

    assert.isTrue(wasTested);
  });

  it('addSaveConstantsToDataTemplate() - check actionData via completeCase saveType'
  + ' has correct constants', () => {
    let wasTested = false;
    let saveType = {completeCase: true};
    let actionDataFunc = Logic.getActionDataSaveFunc(saveType);

    //Just need a simple template as Im just testing opusCaseInfo constants
    let template = {actionsData: [{}, {}]};

    //Overlay the actionData constants in template.actionsData
    template = Logic.addSaveConstantsToDataTemplate(template, {caseId, saveType});

    //Iterate actionData constants and ensure each has required constants
    for(let actionData of template.actionsData) {
      //Get constants JUST from saveType
      let actionDataConstants = actionDataFunc(actionData);

      //Make sure we came in here
      wasTested = true;

      //These constants MUST be in actionData from "addSaveConstantsToDataTemplate"
      assert.include(actionData, actionDataConstants);
    }

    assert.isTrue(wasTested);
  });

  it('getOpusCaseSaveConstants() returns correct saveActiveConstants constants', () => {
    let saveActiveConstants = Logic.getOpusCaseSaveConstants({saveActive: true});
    assert.deepEqual(saveActiveConstants, {isNewCase: 'N', isTrackingDatesChanged: 'N',
      isDeptDatesChanged: 'N'});
  });

  it('getOpusCaseSaveConstants() has correct saveCompletedConstants constants', () => {
    let saveCompletedConstants = Logic.getOpusCaseSaveConstants({saveCompleted: true});
    assert.deepEqual(saveCompletedConstants, {isNewCase: 'N', isTrackingDatesChanged: 'N',
      isDeptDatesChanged: 'N'});
  });

  it('getOpusCaseSaveConstants() has correct completeCaseConstants  constants', () => {
    let completeCaseConstants = Logic.getOpusCaseSaveConstants({completeCase: true});
    assert.deepEqual(completeCaseConstants, {isNewCase: 'N', isTrackingDatesChanged: 'Y',
      isDeptDatesChanged: 'Y', caseCompletedDt: (()=> moment().format('MM/DD/YYYY'))()
    });
  });

  it('getActionDataSaveFunc() is null when nothing passed in', () => {
    //Nothing passed in so should be empty
    let invokeFunc = Logic.getActionDataSaveFunc({});
    assert.isNull(invokeFunc);
  });

  it('getActionDataSaveFunc() ensures saveActive constants are correct', () => {
    let invokeFunc = Logic.getActionDataSaveFunc({saveActive: true});
    let saveConstants = invokeFunc();
    let correctAnswers = {pageName: 'active', sectionName: 'approved',
      rowStatusId: 1, actionStatusId: 1};
    assert.deepEqual(saveConstants, correctAnswers);
  });

  it('getActionDataSaveFunc() ensures saveCompleted constants are correct', () => {
    let invokeFunc = Logic.getActionDataSaveFunc({saveCompleted: true});
    let args = {rowStatusId: 1000, actionStatusId: 1001};
    let saveConstants = invokeFunc(args);

    assert.deepEqual(saveConstants, {pageName: 'completed', sectionName: 'approved',
      ...args});
  });

  it('getActionDataSaveFunc() ensures completeCase constants are correct', () => {
    let invokeFunc = Logic.getActionDataSaveFunc({completeCase: true});
    let saveConstants = invokeFunc();
    let todaysDate = moment().format('MM/DD/YYYY');
    let correctConstants = {rowStatusId: 2, actionStatusId: 2, pageName: 'active',
      sectionName: 'approved', actionCompletedDt: todaysDate};

    assert.deepEqual(saveConstants, correctConstants);
  });

  it('formatFinalDecisionTemplate() testing here for no errors', () => {
    let fields = Logic.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);
    let {finalDecisionPopup, finalDecision} = fields;
    let fieldDataByApptId = {key: finalDecision};
    let commentsText = 'some comment';
    let template = Logic.formatFinalDecisionTemplate(fieldDataByApptId, finalDecisionPopup,
      actionDataInfo, {opusCaseInfo, appointeeInfo, commentsText});

    //Make sure template minimum has these keys
    assert.containsAllKeys(template, ['actionsData', 'appointeeInfo', 'loggedInUserInfo']);

    //Check to make sure commentsText is in each actionData
    for(let actionData of template.actionsData) {
      assert.equal(actionData.userComments, commentsText);
    }

    //Check to make sure correct keys is in each actionData
    for(let actionData of template.actionsData) {
      assert.containsAllKeys(actionData, ['caseId', 'rowStatusId', 'actionStatusId',
        'actionId', 'proposedEffectiveDt', 'effectiveDt', 'approvedSeriesStartDt',
        'pageName', 'userComments', 'approvedActionOutcome', 'actionCompletedDt',
        'proposedAppointmentInfo', 'approvedAppointmentInfo', 'actionTypeInfo',
        'appointmentInfo', 'sectionName', 'renewalLengthTypeId', 'approvedYearsDeferredCnt',
        'approvedYearsAcceleratedCnt', 'proposedYearsDeferredCnt',
        'proposedEndowedChairTypeName', 'proposedEndowedChairTypeId',
        'proposedTermEndDate', 'approvedEndowedChairTypeName', 'approvedEndowedChairTypeId',
        'approvedTermEndDate', 'proposedYearsAcceleratedCnt', 'proposedActionOutcome']);
      assert.equal(actionData.userComments, commentsText);
    }


    let loggedInUserInfo = Logic.populateLoggedInUserInfoWithAdminData();
    assert.deepEqual(template.loggedInUserInfo, loggedInUserInfo);
    assert.deepEqual(template.appointeeInfo, appointeeInfo);

    //Already tested in other functions
    //keyActionDataByApptId
    //wipeValuesOfInvisibleFieldData
    //formatActionDataTemplate
    //addAHPathAndDeptCodeToAppointment
    //addApuCodeToApptByFieldDataApuId
    //addFieldValuesToActionData
    //getActionTypeFromActionData
    //populateLoggedInUserInfoWithAdminData
  });


  it('getSaveCaseUrl() ', () => {
    let url = Logic.getSaveCaseUrl();

    let testUrl = caseConstants.urls.saveCase + access_token;

    let testStringUrl = '/restServices/rest/activecase/saveCase?access_token='
      + access_token;

    assert.equal(url, testUrl);
    assert.equal(url, testStringUrl);
  });


  it('getCompleteByCCaseUrl() ', () => {
    let url = Logic.getCompleteByCCaseUrl();
    let testUrl = caseSummaryConstants.urls.completeCaseCloseByCPacket + access_token;
    let testStringUrl = '/restServices/rest/activecase/completeCloseAPacket?' +
      'access_token=' + access_token;

    assert.equal(url, testStringUrl);
    assert.equal(url, testUrl);
  });

  //Not testing promises
  it('saveFinalDecision() ', () => {

    //formatFinalDecisionTemplate
    //addSaveConstantsToDataTemplate
    //stringify
    //getSaveCaseUrl

  });

  //Not testing promises. Functions in here tested elsewhere
  it('completeCase() ', () => {
    //getCompleteByCCaseUrl()
    //stringify(opusCaseInfo)
  });

  //Not testing promises. Every function here tested elsewher
  it('saveFinalDecisionBySaveType() ', () => {
    //Logic.saveFinalDecision
    //Logic.completeCase()
  });
});
