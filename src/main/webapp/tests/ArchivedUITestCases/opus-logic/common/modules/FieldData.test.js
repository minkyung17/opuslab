import {assert} from 'chai';

import FieldData from '../../../../opus-logic/common/modules/FieldData';

describe('FieldData Logic Class', () => {
  let Logic = new FieldData();


  function assertStateOfAttribute(attributeNames = [], state, assertion) {
    let visibility = true;
    let visibilityField = Logic.getVisibilityField(visibility);
    assertion(visibilityField.visibility, true);
    assertion(visibilityField.show, true);
  }

  it('ensures "getVisibilityField" returns object matching boolean given', () => {
    let visibility = true;
    let visibilityField = Logic.getVisibilityField(visibility);
    assert.isTrue(visibilityField.visibility);

    visibility = false;
    visibilityField = Logic.getVisibilityField(visibility);
    assert.isFalse(visibilityField.visibility);
  });

  it('ensures "getEditabilityField" returns object matching boolean given', () => {
    let editable = true;
    let editableField = Logic.getEditabilityField(editable);
    assert.isTrue(editableField.editable);

    editable = false;
    editableField = Logic.getEditabilityField(editable);
    assert.isFalse(editableField.editable);
  });

  it('getVisEditFromAttrProps"', () => {
    let visibility = true;
    let editable = false;
    let attributes = Logic.getVisEditFromAttrProps({visibility, editable});

    assert.isTrue(attributes.visibility);
    assert.isFalse(attributes.editable);
  });


  it('setValuesInFieldDataFromDataByPath sets values in field data', () => {
    let data = {step: 'WOS', salary: 10000};
    let setValueKey = 'value';
    let fieldData = {
      step: {pathsInAPI: {appointment: {value: 'step'}}},
      salary: {pathsInAPI: {appointment: {value: 'salary'}}}
    };
    let pathToValueInDataKey = 'pathsInAPI.appointment.value';
    Logic.setValuesInFieldDataFromDataByPath(data, fieldData,
      {setValueKey, pathToValueInDataKey});

    assert.equal(fieldData.step[setValueKey], data.step);
    assert.equal(fieldData.salary[[setValueKey]], data.salary);
  });


  it('createFieldDataByAttributeProperties', () => {
    let apuCode = {visibility: true, editable: false};
    let titleCode = {visibility: false, editable: true};
    let attributeProperties = {apuCode, titleCode};

    let fieldData = Logic.createFieldDataByAttributeProperties(attributeProperties);

    assert.deepEqual(fieldData, {
      titleCode: {...titleCode, attributeProperties: attributeProperties.titleCode},
      apuCode: {...apuCode, attributeProperties: attributeProperties.apuCode}
    });
  });

  it('createFieldDataBySingleAttributeProperty', () => {
    let attributeProperties = {
      editable: true,
      visibility: false
    };
    let fields = ['apuCode', 'titleCode'];
    let fieldData = Logic.createFieldDataBySingleAttributeProperty(attributeProperties,
      fields);

    assert.deepEqual(fieldData, {
      apuCode: {...attributeProperties, attributeProperties},
      titleCode: {...attributeProperties, attributeProperties}
    });
  });

  it('updateSingleFieldByAttributeProperties', () => {
    let attributeProperties = {editable: true, visibility: false};
    let titleCode = {...attributeProperties, attributeProperties};

    assert.isTrue(titleCode.editable);
    assert.isFalse(titleCode.visibility);

    let differentProps = {editable: false, visibility: true};
    Logic.updateSingleFieldByAttributeProperties(titleCode, differentProps);

    assert.isFalse(titleCode.editable);
    assert.isTrue(titleCode.visibility);
  });

  it('updateFieldDataByAttributeProperties', () => {
    let attributeProperties = {editable: true, visibility: false};
    let fields = {
      titleCode: {...attributeProperties, attributeProperties},
      apuCode: {...attributeProperties, attributeProperties}
    };

    assert.isTrue(fields.titleCode.editable);
    assert.isFalse(fields.titleCode.visibility);
    assert.isTrue(fields.apuCode.editable);
    assert.isFalse(fields.apuCode.visibility);

    attributeProperties = {editable: false, visibility: true};
    let allAttrProps = {
      titleCode: {...attributeProperties}, apuCode: {...attributeProperties}
    };
    Logic.updateFieldDataByAttributeProperties(fields, allAttrProps);

    assert.isFalse(fields.titleCode.editable);
    assert.isTrue(fields.titleCode.visibility);
    assert.isFalse(fields.apuCode.editable);
    assert.isTrue(fields.apuCode.visibility);
  });
});
