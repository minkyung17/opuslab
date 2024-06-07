import {assert} from 'chai';

import * as testHelpers from '../../../../test-utility/helpers';
import {constants} from '../../../../test-utility/testing-constants';
import {bulkActionsConfig}
  from '../../../../../opus-logic/datatables/constants/BulkActionsConstants';
import BulkActions from '../../../../../opus-logic/cases/classes/caseflow/BulkActions';
import {urls} from '../../../../../opus-logic/cases/constants/CasesConstants';

describe('Bulk Actions (Cases) Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiFormFieldData: 'bulkActions.formFieldsData',
    apiAttrPropsData: 'bulkActions.attrPropsData'
  };
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let formFieldDataFromAPI = null;
  let attrPropsDataFromAPI = null;

  let BulkActionsLogic = null;
  let formFieldResults = null;
  let attrPropsResults = null;
  let selectedActionType = '1-14'; //Reappointment
  let selectedRowList = {
    82: true,
    15136: true,
    15414: true
  };

  /**
   *
   * @desc - Lets get access token and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();

    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;

    BulkActionsLogic = new BulkActions({globalData, adminData, access_token});

    done();
  });

  /**
   *
   * @desc - Get cache data
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiFormFieldData, apiAttrPropsData} = cachePaths;

    formFieldDataFromAPI = await testHelpers.getAPIDataFromCache(apiFormFieldData);
    formFieldResults = formFieldDataFromAPI;

    attrPropsDataFromAPI = await testHelpers.getAPIDataFromCache(apiAttrPropsData);
    attrPropsResults = attrPropsDataFromAPI;

    done();
  });

  /**
   *
   * @desc - Gets URL
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures getCaseAttrDataUrl() gets the URL for CaseAttrData',
    async (done) => {
      let logicUrl = BulkActionsLogic.getCaseAttrDataUrl(selectedActionType, access_token);
      let testUrl = urls.getCaseAttrData({actionType: selectedActionType, access_token});
      assert.equal(logicUrl, testUrl);
      done();
    });

  /**
   *
   * @desc - Gets attribute properties based on action type
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures getAttributePropertiesByActionTypeFromAPI() gets attribute properties by action type',
    async (done) => {
      let {apiAttrPropsData} = cachePaths;

      let prependUrl = karmaAliasBaseUrl;
      if (!attrPropsResults) {
        attrPropsResults = await BulkActionsLogic.
          getAttributePropertiesByActionTypeFromAPI(selectedActionType, prependUrl);
        testHelpers.postAPIDataToCache(attrPropsResults, apiAttrPropsData);
      }
      assert.isObject(attrPropsResults);

      done();
    });

  /**
   *
   * @desc - Gets the fields for the selectedActionType
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures getFieldData() gets the proposed fields for the selected bulk action type',
    async (done) => {
      let {apiFormFieldData} = cachePaths;

      let prependUrl = karmaAliasBaseUrl;
      if (!formFieldResults) {
        formFieldResults = await BulkActionsLogic.getFieldData(selectedActionType, prependUrl);
        testHelpers.postAPIDataToCache(formFieldResults, apiFormFieldData);
      }

      assert.isObject(formFieldResults);

      let formFieldResultKeys = ['actionType', 'appointmentEndDt', 'proposedEffectiveDt', 'inactiveTitle'];
      for (let formFieldResult in formFieldResults.fieldData) {
        assert.oneOf(formFieldResult, formFieldResultKeys);
      }
      done();
    });

  /**
   *
   * @desc - Omit correct fields based on action type
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures configureFormFields() omits the correct fields',
    async (done) => {
      let actionType = '1-13'; //RENEWAL
      let fieldData = {
        actionType: {},
        appointmentEndDt: {},
        proposedEffectiveDt: {}
      };
      let renewalFields = BulkActionsLogic.configureFormFields(fieldData, actionType);
      let renewalKeys = ['appointmentEndDt', 'proposedEffectiveDt'];
      assert.hasAllKeys(renewalFields, renewalKeys);

      actionType = '3-37'; //CHANGE_APU
      fieldData = {
        actionType: {},
        apuCode: {},
        hscpAddBaseIncrement: {},
        hscpBaseScale: {},
        hscpScale0: {},
        hscpScale1to9: {},
        proposedEffectiveDt: {},
        rank: {},
        salary: {},
        series: {},
        step: {},
        titleCode: {}
      };
      let apuFields = BulkActionsLogic.configureFormFields(fieldData, actionType);
      let apuKeys = ['apuCode', 'hscpScale1to9', 'proposedEffectiveDt'];
      assert.hasAllKeys(apuFields, apuKeys);

      done();
    });

  /**
   *
   * @desc - Updates APU field visibility
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures updateAPUFieldVisibility() updates visibility correctly',
    async (done) => {
      let fieldData = {
        apuCode: {
          visibility: false
        },
        hscpScale1to9: {
          visibility: false
        }
      };
      let updatedFieldData = BulkActionsLogic.updateAPUFieldVisibility(fieldData);
      assert.equal(updatedFieldData.apuCode.visibility, true);
      assert.equal(updatedFieldData.hscpScale1to9.visibility, true);
      done();
    });

  /**
  *
  * @desc - Populates the template
  * @param {Function} done - when 'done' is executed all the tests will start
  *
  **/
  it('ensures populateBulkActionsTemplate() populates the template with values', async (done) => {
    //Mimic the user entering values for the form fields
    formFieldResults.fieldData.proposedEffectiveDt.value = '4/13/18';
    formFieldResults.fieldData.appointmentEndDt.value = '4/13/18';

    let template = BulkActionsLogic.populateBulkActionsTemplate(formFieldResults.fieldData,
      selectedActionType, selectedRowList);

    assert.isObject(template);
    assert.equal(template.apptIds, '82,15136,15414');
    assert.equal(template.actionType, selectedActionType);
    assert.equal(template.effectiveDt, formFieldResults.fieldData.proposedEffectiveDt.value);
    assert.equal(template.appointmentEndDt, formFieldResults.fieldData.appointmentEndDt.value);
    assert.equal(template.user, adminData.adminName);

    done();
  });

  /**
  *
  * @desc - Concatenate APU
  * @param {Function} done - when 'done' is executed all the tests will start
  *
  **/
  it('ensures concatenateAPU() concatenates apuId and apuCode correctly',
    async (done) => {
      //Mocking here because the cached formFields is using a Reappointment action type
      let formFields = {
        apuCode: {
          value: 7428
        }
      };
      let concatenatedAPU = BulkActionsLogic.concatenateAPU(formFields);
      assert.equal(concatenatedAPU, '1400AD-7428');
      done();
    });

  /**
   *
   * @desc - Gets the new template
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures getNewBulkActionsTemplate() gets the new template', async (done) => {
    let template = BulkActionsLogic.getNewBulkActionsTemplate();
    assert.isObject(template);

    let keys = ['actionType', 'appointmentEndDt', 'apptIds', 'effectiveDt', 'user'];
    assert.containsAllKeys(template, keys);

    done();
  });

  /**
   *
   * @desc - Formats the URL
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures formatSaveBulkActionsURL() formats the URL', async (done) => {
    let url = BulkActionsLogic.formatSaveBulkActionsURL();
    assert.equal(url, bulkActionsConfig.saveDataUrl + '?access_token=' + access_token);
    done();
  });
});
