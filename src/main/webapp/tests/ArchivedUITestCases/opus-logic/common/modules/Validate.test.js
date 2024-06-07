import {assert} from 'chai';

import Validate from '../../../../opus-logic/common/modules/Validate';
import {fieldNamesValidation} from
  '../../../../opus-logic/cases/constants/FieldDataValidations';


describe('Validate Logic Class', () => {
  let Logic = new Validate();

  it('constructor()', () => {
    assert.isFalse(Logic.validateDisabledFields);
    assert.isFalse(Logic.validateInvisibleFields);
    assert.isTrue(Logic.returnErrorMessage);
  });

  it('setClassData()', () => {
    let data = {key: 'value', school: 'Opus'};
    Logic.setClassData(data);
    assert.equal(Logic.key, data.key);
    assert.equal(Logic.school, data.school);
  });

  it('validateAllFieldDataOnSave()', () => {
    let fieldData = {
      step: {value: null, visibility: true, editable: true},
      titleCode: {hasError: true, error: 'Hey', visibility: false},
      departmentCode: {hasError: true, error: 'Hey', editable: false}
    };

    Logic.validateAllFieldDataOnSave(fieldData, fieldNamesValidation);

    assert.isTrue(fieldData.step.hasError);
    assert.isString(fieldData.step.error);

    //Invisible so should be no errors
    assert.isFalse(fieldData.titleCode.hasError);
    assert.isNull(fieldData.titleCode.error);

    //Uneditable so should be no errors
    assert.isFalse(fieldData.departmentCode.hasError);
    assert.isNull(fieldData.departmentCode.error);
  });

  it('wipeErrorsFromField()', () => {
    let field = {hasError: true, error: 'Hello World'};
    Logic.wipeErrorsFromField(field);

    assert.isFalse(field.hasError);
    assert.isNull(field.error);
  });

  it('wipeErrorsFromDisabledFields()', () => {
    let field = {
      step: {editable: false, hasError: true, error: 'Hello World'},
      school: {editable: true, hasError: true, error: 'Hello World'}
    };
    Logic.wipeErrorsFromDisabledFields(field);

    assert.isFalse(field.step.hasError);
    assert.isNull(field.step.error);

    assert.isTrue(field.school.hasError);
    assert.equal(field.school.error, 'Hello World');
  });

  it('wipeErrorsFromInvisibleFields()', () => {
    let field = {
      step: {visibility: false, hasError: true, error: 'Hello World'},
      school: {visibility: true, hasError: true, error: 'Hello World'}
    };
    Logic.wipeErrorsFromInvisibleFields(field);

    assert.isFalse(field.step.hasError);
    assert.isNull(field.step.error);

    assert.isTrue(field.school.hasError);
    assert.equal(field.school.error, 'Hello World');
  });

  it('setErrorDataOnField() where isValid is false', () => {
    let step = {hasError: false, error: 'Hello World'};
    let isValid = false;
    let message = 'This is an error';
    Logic.setErrorDataOnField(step, isValid, message);

    assert.isTrue(step.hasError);
    assert.equal(step.error, message);
  });

  it('setErrorDataOnField() where isValid is true', () => {
    let step = {hasError: true, error: 'Hello World'};
    let isValid = true;
    let message = 'This is an error';
    Logic.setErrorDataOnField(step, isValid, message);

    assert.isFalse(step.hasError);
    assert.isNull(step.error);
  });

  it('validateFieldByFunctionList() shows first error of "isNumberPresent"', () => {
    let step = {value: null, visibility: true, editable: true};
    let {step: {onSaveValidations}} = fieldNamesValidation;
    Logic.validateFieldByFunctionList(step, onSaveValidations);

    assert.isTrue(step.hasError);
    assert.isString(step.error);
  });

  it('validateFieldByFunctionList() shows second error of "isAtLeastZero"', () => {
    let step = {value: -1, visibility: true, editable: true};
    let {step: {onSaveValidations}} = fieldNamesValidation;
    Logic.validateFieldByFunctionList(step, onSaveValidations);

    assert.isTrue(step.hasError);
    assert.isString(step.error);
  });

  it('validateFieldByFunctionList() shows noErrors', () => {
    let step = {value: 1, visibility: true, editable: true};
    let {step: {onSaveValidations}} = fieldNamesValidation;
    Logic.validateFieldByFunctionList(step, onSaveValidations);

    assert.isFalse(step.hasError);
    assert.isNull(step.error);
  });
});
