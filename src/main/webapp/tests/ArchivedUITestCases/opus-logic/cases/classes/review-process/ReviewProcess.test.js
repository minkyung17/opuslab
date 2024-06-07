import axios from 'axios';
import {assert} from 'chai';

//My import
import '../../../../test-utility/setup-tests';
import {constants} from '../../../../test-utility/testing-constants';
import * as testHelpers from '../../../../test-utility/helpers';
import CaseSummary from '../../../../../opus-logic/cases/classes/case-summary/CaseSummary';
import ReviewProcess from '../../../../../opus-logic/cases/classes/review-process/ReviewProcess';
import {urls} from '../../../../../opus-logic/cases/constants/review-process/ReviewProcessConstants';
import * as util from '../../../../../opus-logic/common/helpers/';

describe('Review Process Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiApptData: 'reviewProcess.apiApptData',
    apiTemplateData: 'reviewProcess.templateData'
  };
  let caseId = 4191;
  let actionDataInfo = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let casesProposedAttrMap = null;
  let casesApprovedAttrMap = null;
  let caseSummaryDataFromAPI = null;
  let templateDataFromAPI = null;
  let opusCaseInfo = null;
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let CaseSummaryLogic = null;

  let ReviewProcessLogic = null;
  let templates = null;
  let bycUnitId = null;
  let reviewProcessTemplate = null;
  let selectedTemplate = '468-1';
  let selectedTemplateDisplayText = 'Appointment: Assistant Professor - Appointment';
  let selectedExistingBycCase = '';
  let linkWithExistingCase = false;
  let templateUrl = urls.getTemplates;
  let unlinkUrl = urls.unlinkInterfolioCase;

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
    CaseSummaryLogic = new CaseSummary({globalData, adminData, access_token});
    ReviewProcessLogic = new ReviewProcess({globalData, adminData, access_token, caseId});

    done();
  });

  /**
   *
   * @desc - Get cache data of templateData and apptData
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiApptData, apiTemplateData} = cachePaths;
    caseSummaryDataFromAPI = await testHelpers.getAPIDataFromCache(apiApptData);
    appointmentData = caseSummaryDataFromAPI;

    templateDataFromAPI = await testHelpers.getAPIDataFromCache(apiTemplateData);
    templates = templateDataFromAPI;
    done();
  });


  /************************** RETRIEVE API DATA FIRST *************************/
  it('getCasesSummaryData() gets appointmentData & caches it', async (done) => {
    let {apiApptData} = cachePaths;

    if(!appointmentData) {
      let apptDataUrl = CaseSummaryLogic.getCaseSummaryDataAPIUrl();
      let apiArgs = CaseSummaryLogic.getCaseSummaryDataAPIArgs(caseId);
      let apiUrl = karmaAliasBaseUrl + apptDataUrl;
      let {data} = await axios.get(apiUrl, {params: apiArgs});
      //let data = await util.fetchJson(apiUrl, apiArgs);
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

  it('ensures "appointmentData" is correct', () => {
    assert.isObject(appointeeInfo);
    assert.isObject(appointmentData);
    assert.isArray(actionDataInfo);
    assert.isObject(casesProposedAttrMap);
    assert.isObject(casesApprovedAttrMap);
    assert.isObject(actionDataInfo[0], 'No appointments to run tests!');
  });

  it('ensures initReviewProcess() sets common call data', () => {
    assert.isString(ReviewProcessLogic.access_token);
    assert.isObject(ReviewProcessLogic.adminData);
    assert.isObject(ReviewProcessLogic.globalData);
  });

  it('ensures hasExistingCaseInByC() returns correct boolean', () => {
    let hasExistingCaseInByCResult = ReviewProcessLogic.hasExistingCaseInByC({opusCaseInfo});
    let {bycPacketId, packetTypeId} = opusCaseInfo;
    let testResult = bycPacketId && packetTypeId ? true : false;
    assert.equal(hasExistingCaseInByCResult, testResult);
  });

  it('ensures getByCUnitId() gets the correct bycUnitId', () => {
    bycUnitId = ReviewProcessLogic.getByCUnitId({actionDataInfo});

    let {length} = actionDataInfo;
    let testBycUnitId = null;
    if (length === 1) {
      testBycUnitId = actionDataInfo[0].appointmentInfo.academicHierarchyInfo.byCUnitId;
    }
    else {
      actionDataInfo.map(actionData => {
        if (actionData.appointmentInfo.affiliationType.affiliation === 'Primary') {
          testBycUnitId = actionData.appointmentInfo.academicHierarchyInfo.byCUnitId;
        }
      });
    }

    assert.equal(bycUnitId, testBycUnitId);
  });

  it('ensures formatUnlinkCaseUrl() gets correct unlink URL', async (done) => {
    let baseUrl = karmaAliasBaseUrl + unlinkUrl + 'access_token='
      + access_token + '&caseId=14183&user=Test%20User';

    let unlinkParams = {
      caseId: 14183,
      user: "Test User"
    };

    let prependUrl = karmaAliasBaseUrl;
    let testUrl = ReviewProcessLogic.formatUnlinkCaseUrl(unlinkParams, prependUrl);
    assert.equal(baseUrl, testUrl);

    done();
  });

  it('ensures getTemplates() returns the list of templates', async (done) => {
    let {apiTemplateData} = cachePaths;
    let url = karmaAliasBaseUrl + templateUrl;
    if(!templates) {
      templates = await ReviewProcessLogic.getTemplates({bycUnitId}, url);
      testHelpers.postAPIDataToCache(templates, apiTemplateData);
    }
    assert.isArray(templates);

    let templateKeys = ['packetTypeId', 'packetTypeName', 'templateId', 'templateName'];
    for (let template of templates) {
      assert.containsAllKeys(template, templateKeys);
    }
    done();
  });

  it('ensures formatTemplateForSaveCaseInByC() formats the template correctly', () => {
    let adminName = adminData.adminName;
    reviewProcessTemplate = ReviewProcessLogic.formatTemplateForSaveCaseInByC(
      {selectedTemplate, selectedTemplateDisplayText, selectedExistingBycCase,
        linkWithExistingCase, bycUnitId, appointeeInfo, caseId, adminName}
    );
    assert.isObject(reviewProcessTemplate);

    let reviewProcessTemplateKeys = ['adminName', 'appointeeInfo', 'bycPacketId',
      'bycUnitId', 'caseId', 'template', 'tieWithExistingCase'];
    assert.containsAllKeys(reviewProcessTemplate, reviewProcessTemplateKeys);

    let reviewProcessTemplateSelectedTemplate = reviewProcessTemplate.template.templateId
      + '-' + reviewProcessTemplate.template.packetTypeId;

    assert.equal(reviewProcessTemplate.adminName, adminName);
    assert.deepEqual(reviewProcessTemplate.appointeeInfo, appointeeInfo);
    assert.equal(reviewProcessTemplate.bycPacketId, opusCaseInfo.bycPacketId);
    assert.equal(reviewProcessTemplate.bycUnitId, bycUnitId);
    assert.equal(reviewProcessTemplate.caseId, caseId);
    assert.equal(reviewProcessTemplateSelectedTemplate, selectedTemplate);
    assert.equal(reviewProcessTemplate.tieWithExistingCase, linkWithExistingCase);
  });
});
