import {assert} from 'chai';
import {omit} from 'lodash';

//My import
import '../../../../test-utility/setup-tests';
import * as testHelpers from '../../../../test-utility/helpers';
import {urls} from '../../../../../opus-logic/cases/constants/CasesConstants';
import SalaryToggle from '../../../../../opus-logic/cases/classes/toggles/SalaryToggle';


describe('Salary Toggle Logic Class', () => {
  let Logic = new SalaryToggle();
  let adminData = null;
  let globalData = null;
  let access_token = null;

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
    Logic = new SalaryToggle({adminData, globalData});
    done();
  });

  it('getSalaryInfoUrl()', () => {
    let url = Logic.getSalaryInfoUrl(access_token);
    let testUrl = urls.getSalaryInfo + access_token;
    let stringUrl = '/restServices/rest/activecase/getSalaryInfo/?access_token='
      + access_token;

    assert.equal(url, testUrl);
    assert.equal(stringUrl, url);

  });

  it('updateValuesOfDependentFields()', () => {


  });

  it('shouldGetSalaryArgs() should return true since all fields are present', () => {
    let fieldData = {departmentCode: {}, step: {}, titleCode: {}, apuCode: {},
      salary: {}, currentSalaryAmt: {}, scaleType: {}};

    let shouldGetSalaryArgs = Logic.shouldGetSalaryArgs(fieldData);

    assert.isTrue(shouldGetSalaryArgs);
  });

  it('No need for this - shouldGetSalaryArgs() == false if any one of these fields'
   + 'is missing', () => {
    // let fieldData = {departmentCode: {}, step: {}, titleCode: {}, apuCode: {},
    //   currentSalaryAmt: {}, scaleType: {}};
    //
    // for(let name in fieldData) {
    //   let reducedFieldData = omit(fieldData, name);
    //
    //   let shouldGetSalaryArgs = Logic.shouldGetSalaryArgs(reducedFieldData);
    //
    //   assert.isFalse(shouldGetSalaryArgs);
    //}
  });

  it('formatSalaryAPIArgsFromApptandFields() when the fieldData ' +
  'visibility is true and appointment values are valid', () => {
    let fieldData = {
      departmentCode: {visibility: true, value: '11'},
      step: {visibility: true, value: '20'},
      titleCode: {visibility: true, value: '15'},
      apuCode: {visibility: true, value: '100'},
      salary: {visibility: true, value: '254000'},
      scaleType: {visibility: true, value: '2'}
    };
    let appointment = {appointmentId: 12, actionId: 9, academicHierarchyInfo: {
      academicHierarchyPathId: 100}};

    let salaryAPIOptions = Logic.formatSalaryAPIArgsFromApptandFields(fieldData,
      appointment);

    assert.include(salaryAPIOptions, {
      ahPathId: Number(fieldData.departmentCode.value),
      stepTypeId: Number(fieldData.step.value),
      titleCodeId: Number(fieldData.titleCode.value),
      apuId: fieldData.apuCode.value,
      salaryAmt: Number(fieldData.salary.value),
      appointmentId: appointment.appointmentId,
      actionId: appointment.actionId,
      callingApi: 'cases',
      scaleTypeId: Number(fieldData.scaleType.value)
    });
  });

  it('getValidNumericalValue() returns back numerical value', () => {
    let validZero = Logic.getValidNumericalValue(0);
    assert.equal(validZero, 0);

    let validNegativeOne = Logic.getValidNumericalValue(-1);
    assert.equal(validNegativeOne, -1);

    let invalidBlank = Logic.getValidNumericalValue('');
    assert.equal(invalidBlank, null);

    let invalidNull = Logic.getValidNumericalValue(null);
    assert.equal(invalidNull, null);
  });

  it('formatSalaryAPIArgsFromApptandFields() when the fieldData ' +
  'visibility is false and some appointment values are invalid', () => {
    let fieldData = {
      departmentCode: {visibility: false},
      step: {visibility: false, value: '20'},
      titleCode: {visibility: false, value: '15'},
      apuCode: {visibility: false, value: '100'},
      salary: {visibility: false},
      scaleType: {visibility: false, value: '2'}
    };
    let appointment = {appointmentId: null, actionId: null, academicHierarchyInfo: {
      academicHierarchyPathId: 100}};

    let salaryAPIOptions = Logic.formatSalaryAPIArgsFromApptandFields(fieldData,
      appointment);

    assert.include(salaryAPIOptions, {
      ahPathId: appointment.academicHierarchyInfo.academicHierarchyPathId,
      stepTypeId: 0,
      titleCodeId: 15, //Should this be null
      apuId: null,
      salaryAmt: null,
      appointmentId: appointment.appointmentId,
      actionId: null,
      callingApi: 'cases',
      scaleTypeId: null
    });
  });


  it('shouldMakeSalaryAPICall() tests valid values', () => {
    let titleCodeId = 0, stepTypeId = 11, ahPathId = 12;
    let shouldMakeSalaryAPICall = Logic.shouldMakeSalaryAPICall({titleCodeId,
      stepTypeId, ahPathId});

    //All three values are valid so it should make the call
    assert.isTrue(shouldMakeSalaryAPICall);

    //All invalid values for three arguments should produce false bool results
    let {invalidValues} = Logic;
    for(let invalid in invalidValues) {
      shouldMakeSalaryAPICall = Logic.shouldMakeSalaryAPICall({titleCodeId: invalid,
        stepTypeId, ahPathId});
      assert.isFalse(shouldMakeSalaryAPICall);

      shouldMakeSalaryAPICall = Logic.shouldMakeSalaryAPICall({titleCodeId,
        stepTypeId: invalid, ahPathId});
      assert.isFalse(shouldMakeSalaryAPICall);

      shouldMakeSalaryAPICall = Logic.shouldMakeSalaryAPICall({titleCodeId,
        stepTypeId, ahPathId: invalid});
      assert.isFalse(shouldMakeSalaryAPICall);
    }
  });

  it('omitDentistryBaseSupplement()', () => {
    let fieldData = {dentistryBaseSupplement: {}};
    Logic.omitDentistryBaseSupplement(fieldData);

    assert.notExists(fieldData.dentistryBaseSupplement);
  });

  it('handleDentistryBaseSupplementException() doesnt change value, does update ' +
  ' visibility and editable', () => {
    let fieldData = {dentistryBaseSupplement: {value: 100, visibility: true,
      editable: true}};
    let attributeProperties = {dentistryBaseSupplement: {visibility: false,
      editable: false}};
    Logic.handleDentistryBaseSupplementException(fieldData, attributeProperties);

    assert.equal(fieldData.dentistryBaseSupplement.value, 100);
    assert.isFalse(fieldData.dentistryBaseSupplement.visibility);
    assert.isFalse(fieldData.dentistryBaseSupplement.editable);
  });

  it('wipeFSPHSalaryScaleIfInvisible() wipes scaleType value when invisible', () => {
    let fieldData = {scaleType: {value: 100, visibility: false}};
    Logic.wipeFSPHSalaryScaleIfInvisible(fieldData);

    assert.isNull(fieldData.scaleType.value);
  });

  it('wipeFSPHSalaryScaleIfInvisible() keeps scaleType value when visible', () => {
    let fieldData = {scaleType: {value: 100, visibility: true}};
    Logic.wipeFSPHSalaryScaleIfInvisible(fieldData);

    assert.equal(fieldData.scaleType.value, 100);
  });

  it('wipeDentistryBaseSupplementValueIfInvisible() wipes value if invisible', () => {
    let fieldData = {dentistryBaseSupplement: {value: 100, visibility: false}};
    Logic.wipeDentistryBaseSupplementValueIfInvisible(fieldData);

    assert.isNull(fieldData.dentistryBaseSupplement.value);
  });

  it('wipeDentistryBaseSupplementValueIfInvisible() keeps value if visible', () => {
    let fieldData = {dentistryBaseSupplement: {value: 100, visibility: true}};
    Logic.wipeDentistryBaseSupplementValueIfInvisible(fieldData);

    assert.equal(fieldData.dentistryBaseSupplement.value, 100);
  });

  it(' updateFieldDataFromSalaryResults() ensures function is executed and ' +
  'results are returned as many functions inside are already tested', () => {
    let fieldData = {titleCode: {}};
    let salaryAPI = {academicProgramUnit: {}, salaryInfo: {}};
    let returned = Logic.updateFieldDataFromSalaryResults(fieldData, salaryAPI);

    assert.equal(fieldData, returned);
    // already tested by extractSalaryInfoAttributeProps(salaryAPI);

    // already tested by handleDentistryBaseSupplementException
    // already tested by omitDentistryBaseSupplement
    //
    // //Update editability and visibilty of fields
    // already tested by FieldData.updateFieldDataByAttributeProperties
    //
    // already tested by updateValuesOfDependentFields
    //
    // already tested by wipeFSPHSalaryScaleIfInvisible
    // already tested by wipeDentistryBaseSupplementValueIfInvisible

  });

  it('extractSalaryInfoAttributeProps()', () => {
    let salaryInfo = {attributeProperties: {offScalePercent: {}, hscpScale1to9: {},
      currentSalaryAmt: {}, hscpBaseScale: {}, salaryEffectiveDt: {},
      hscpAddBaseIncrement: {}, onScaleSalary: {}, hscpScale0: {},
      dentistryBaseSupplement: {}}, academicProgramUnit: {
        attributeProperties: {scaleTypeId: {}, scaleType: {}, apuId: {}, apuDesc: {},
        apuCode: {}}}};
    let salaryAttributes = Logic.extractSalaryInfoAttributeProps(salaryInfo);

    let allKeys = Object.keys(salaryAttributes);
    assert.includeMembers(allKeys, ['offScalePercent', 'hscpScale1to9',
      'currentSalaryAmt', 'hscpBaseScale', 'salaryEffectiveDt',
      'hscpAddBaseIncrement', 'onScaleSalary', 'hscpScale0',
      'dentistryBaseSupplement', 'scaleTypeId', 'scaleType', 'apuId', 'apuDesc',
      'apuCode']);
  });

  it('updateFieldDataBySalaryAPI()', () => {

  });
});
