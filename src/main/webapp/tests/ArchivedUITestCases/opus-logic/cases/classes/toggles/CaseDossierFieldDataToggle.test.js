import {assert} from 'chai';

//My import
import '../../../../test-utility/setup-tests';
import * as testHelpers from '../../../../test-utility/helpers';
import CaseDossierFieldDataToggle from
  '../../../../../opus-logic/cases/classes/toggles/CaseDossierFieldDataToggle';


describe('Case Dossier Toggle Logic Class', () => {
  let Logic = new CaseDossierFieldDataToggle();
  let adminData = null;
  let globalData = null;
  let access_token = null;

  //Already tested by successive functions & "updateFieldData" in FieldDataToggle
  it('updateFieldData() nothing changes because "nameOfChangedField" is not'
  + '"endowedChairType"', () => {
    let fieldData = {endowedChairType: {value: 2}, termEndDate: {visibility: false}};
    let returned = Logic.updateFieldData(fieldData);

    assert.isFalse(fieldData.termEndDate.visibility);
    assert.equal(fieldData, returned);
  });

  it('updateFieldDataByEndowedChairType() updates visibility when endowedChairType' +
  'is "Term Appt Chair"', () => {
    let fieldData = {endowedChairType: {value: 2}, termEndDate: {visibility: false}};
    Logic.updateFieldDataByEndowedChairType(fieldData);

    assert.isTrue(fieldData.termEndDate.visibility);
  });

  it('updateFieldDataByEndowedChairType() updates visibility when endowedChairType' +
  'is "Term Appt Chair"', () => {
    let fieldData = {endowedChairType: {value: 1}, termEndDate: {visibility: false}};
    Logic.updateFieldDataByEndowedChairType(fieldData);

    assert.isFalse(fieldData.termEndDate.visibility);
  });

  it('updateCasesAPUOptionsFromGlobalData() ensures APU options list is correctly populated', () => {
    let fieldData = {
      departmentCode: {value: 3}, apuCode: {options: null}};
    let commonCallList = {
      aHPathIdsToDeptCode: {
        3: 135000
      },
      casesDeptCodeToAPU: {
        135000: [
          {
            apuId: 90001,
            apuDesc: 'Test APU 1',
            apuCode: 'TEST01'
          },
          {
            apuId: 90002,
            apuDesc: 'Test APU 2',
            apuCode: 'TEST02'
          }
        ]
      }};
    let apuList1 = Logic.updateCasesAPUOptionsFromGlobalData(fieldData, '135000', commonCallList);
    assert.isNotNull(apuList1.apuCode.options);
    assert.equal(apuList1.apuCode.options, commonCallList.casesDeptCodeToAPU[135000]);

    let apuList2 = Logic.updateCasesAPUOptionsFromGlobalData(fieldData, '152000', commonCallList);
    assert.isNull(apuList2.apuCode.options);
  });
});
