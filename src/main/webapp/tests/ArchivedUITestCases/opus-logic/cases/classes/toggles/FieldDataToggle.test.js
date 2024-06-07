import {assert} from 'chai';

//My import
import '../../../../test-utility/setup-tests';
import * as testHelpers from '../../../../test-utility/helpers';
import FieldDataToggle from '../../../../../opus-logic/cases/classes/toggles/FieldDataToggle';


describe('FieldData Toggle Logic Class', () => {
  let Logic = new FieldDataToggle();
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
    done();
  });

  it('updateValuesOfDependentFields()', () => {
    let template = {location: 'Los Angeles', schoolName: 'UCLA', department: {
      name: 'Opus'}};
    let fieldData = {location: {}, schoolName: {}, department: {}};
    let pathsToDisplayValue = {location: 'location', schoolName: 'schoolName',
      department: 'department.name'};

    Logic.updateValuesOfDependentFields(fieldData, template, pathsToDisplayValue);
    assert.equal(fieldData.location.value, 'Los Angeles');
    assert.equal(fieldData.schoolName.value, 'UCLA');
    assert.equal(fieldData.department.value, 'Opus');
  });

  //already tested by other functions
  it('updateFieldData() test ensures function executes', () => {
    let fieldData = {startDateAtRank: {}, rank: {visibility: true}};
    Logic.updateFieldData(fieldData);
    assert.isTrue(fieldData.startDateAtRank.visibility);
    //test for updateFieldDataByDepartmentCode
    //test for updateFieldDataByTitleCode
    //test for updateFieldDataByStep
    //test for updateAllStartDateDependentFields
  });

  it('updateFieldsDependentOnDeptCode()', () => {
    let fieldData = {
      departmentCode: {value: 3}, location: {value: 'Santa Monica', visibility:
      true}, divisionName: {editable: true}, departmentName: {}, areaName: {}, schoolName: {},
      dentistryBaseSupplement: {visibility: false, value: 500}};
    let commonCallList = {ahPathToDepartment: {3: {schoolName: 'Art',
      areaName: 'A & A', divisionName: 'Liberal', location: 'UCLA',
      departmentName: 'Art Dept.', attributeProperties: {
        location: {visibility: false},
        divisionName: {editable: false}
      }}},
      aHPathIdsToDeptCode: {
        3: 135000
      }};

    Logic.updateFieldsDependentOnDeptCode(fieldData, commonCallList);

    let deptHash = commonCallList.ahPathToDepartment[fieldData.departmentCode.value];
    assert.equal(fieldData.schoolName.value, deptHash.schoolName);
    assert.equal(fieldData.areaName.value, deptHash.areaName);
    assert.equal(fieldData.divisionName.value, deptHash.divisionName);
    assert.equal(fieldData.departmentName.value, deptHash.departmentName);

    //Location doesnt change on departmentCode change
    assert.equal(fieldData.location.value, 'Santa Monica');

    //Check Attributes
    assert.isFalse(fieldData.location.visibility);
    assert.isFalse(fieldData.divisionName.editable);
  });

  it('updateFieldDataByDepartmentCode()', () => {
    let fieldData = {departmentCode: {}, location: {value: 100},
      dentistryBaseSupplement: {visibility: false, value: 500}};
    let commonCallList = {ahPathToDepartment: {}, aHPathIdsToDeptCode: {}};
    let returned = Logic.updateFieldDataByDepartmentCode(fieldData, commonCallList);

    //already tested by updateFieldsDependentOnDeptCode
    assert.equal(fieldData, returned);
    assert.isNull(fieldData.location.value);
    assert.isNull(fieldData.dentistryBaseSupplement.value);
  });

  it('wipeDentistryBaseSupplementValueIfInvisible() if dsb is invisble', () => {
    let fieldData = {dentistryBaseSupplement: {value: 100, visibility: false}};
    Logic.wipeDentistryBaseSupplementValueIfInvisible(fieldData);

    assert.isNull(fieldData.dentistryBaseSupplement.value);
  });

  it('wipeDentistryBaseSupplementValueIfInvisible() if dsb is visble', () => {
    let fieldData = {dentistryBaseSupplement: {value: 100, visibility: true}};
    Logic.wipeDentistryBaseSupplementValueIfInvisible(fieldData);

    assert.equal(fieldData.dentistryBaseSupplement.value, 100);
  });

  it('wipeAPUOnUpdate()', () => {
    let fieldData = {apuCode: {value: 100}};
    Logic.wipeAPUOnUpdate(fieldData);

    assert.isNull(fieldData.apuCode.value);
  });

  it('wipeLocationValue()', () => {
    let fieldData = {location: {value: 100}};
    Logic.wipeLocationValue(fieldData);

    assert.isNull(fieldData.location.value);
  });

  it('updateFieldsDependentOnTitleCode()', () => {
    let fieldData = {
      titleCode: {value: 3}, series: {value: 'Santa Monica', visibility:
      true}, rank: {editable: true}, step: {visibility: false, value: 6}};
    let commonCallList = {titleCodesById: {3: {series: 'HS Clinical',
      rank: {rankTypeDisplayText: 'Professor'}, attributeProperties: {
        series: {visibility: false},
        rank: {editable: false}
      }}}};

    Logic.updateFieldsDependentOnTitleCode(fieldData, commonCallList);

    let titleCodeData = commonCallList.titleCodesById[fieldData.titleCode.value];
    assert.equal(fieldData.series.value, titleCodeData.series);
    assert.equal(fieldData.rank.value, titleCodeData.rank.rankTypeDisplayText);

    //Check Attributes
    assert.isFalse(fieldData.series.visibility);
    assert.isFalse(fieldData.rank.editable);
  });

  it('updateFieldDataByTitleCode() making sure this function executes as its '
  + 'tested by other functions', () => {
    let fieldData = {titleCode: {value: 3}, apuCode: {value: 100}};
    let commonCallList = {titleCodesById: {3: {series: 'HS Clinical',
      rank: {rankTypeDisplayText: 'Professor'}, attributeProperties: {
        series: {visibility: false},
        rank: {editable: false}
      }}}};
    //Simple test of wipeAPU
    Logic.updateFieldDataByTitleCode(fieldData, commonCallList);
    assert.isNull(fieldData.apuCode.value);


    // already tested by updateFieldsDependentOnTitleCode
    // already tested by updateStep
    // already tested by wipeAPUOnUpdate
    // already tested by hideSalaryDependentFieldsOnHiddenStep
    // already tested by appointmentEndDateLogic
    // already tested by updateYearsAtCurrent
  });

  it('updateFieldDataByStep() making sure this function executes', () => {
    let fieldData = {step: {}};
    let returned = Logic.updateFieldDataByStep(fieldData);

    assert.equal(returned, fieldData);
    //already tested by updateOnScaleSalaryByStep
    //already tested by updateOffScalePercentByStep
  });

  it('updateYearsAtCurrent() only tests rank to make sure sub functions are' +
  'executed', () => {
    let fieldData = {yearsAtCurrentRank: {visibility: false}, rank: {visibility: true}};
    Logic.updateYearsAtCurrentRank(fieldData);

    assert.isTrue(fieldData.yearsAtCurrentRank.visibility);
  });

  it('updateYearsAtCurrentRank() turns on visibility for "yearsAtCurrentRank"',
  () => {
    let fieldData = {yearsAtCurrentRank: {visibility: false}, rank: {visibility: true}};
    Logic.updateYearsAtCurrentRank(fieldData);

    assert.isTrue(fieldData.rank.visibility);
    assert.isTrue(fieldData.yearsAtCurrentRank.visibility);
  });

  it('updateYearsAtCurrentRank() turns off visibility for "yearsAtCurrentRank"',
  () => {
    let fieldData = {yearsAtCurrentRank: {visibility: true}, rank: {visibility:
      false}};
    Logic.updateYearsAtCurrentRank(fieldData);

    assert.isFalse(fieldData.rank.visibility);
    assert.isFalse(fieldData.yearsAtCurrentRank.visibility);
  });

  it('updateYearsAtCurrentStep() turns on visibility for "yearsAtCurrentStep"',
  () => {
    let fieldData = {yearsAtCurrentStep: {visibility: false}, step: {visibility: true}};
    Logic.updateYearsAtCurrentStep(fieldData);

    assert.isTrue(fieldData.step.visibility);
    assert.isTrue(fieldData.yearsAtCurrentStep.visibility);
  });

  it('updateYearsAtCurrentRank() turns off visibility for "yearsAtCurrentRank"',
  () => {
    let fieldData = {yearsAtCurrentRank: {visibility: true}, rank: {visibility:
      false}};
    Logic.updateYearsAtCurrentRank(fieldData);

    assert.isFalse(fieldData.rank.visibility);
    assert.isFalse(fieldData.yearsAtCurrentRank.visibility);
  });

  it('updateOnScaleSalaryByStep() when step is not present', () => {
    let fieldData = {onScaleSalary: {visibility: true, value: 100}};

    Logic.updateOnScaleSalaryByStep(fieldData);
    assert.isFalse(fieldData.onScaleSalary.visibility);
  });

  it('updateOnScaleSalaryByStep() when step is visible', () => {
    let fieldData = {step: {visibility: true},
      onScaleSalary: {visibility: true, value: 100}};

    Logic.updateOnScaleSalaryByStep(fieldData);
    assert.isTrue(fieldData.onScaleSalary.visibility);
  });

  it('updateOnScaleSalaryByStep() when step is not visible', () => {
    let fieldData = {step: {visibility: false},
      onScaleSalary: {visibility: true, value: 100}};

    Logic.updateOnScaleSalaryByStep(fieldData);
    assert.isFalse(fieldData.onScaleSalary.visibility);
  });

  it('updateOffScalePercentByStep() when step does not exist', () => {
    let fieldData = {offScalePercent: {visibility: true, value: 100}};

    Logic.updateOffScalePercentByStep(fieldData);
    assert.isFalse(fieldData.offScalePercent.visibility);
  });

  it('updateOffScalePercentByStep() when step is visible', () => {
    let fieldData = {step: {visibility: true},
      offScalePercent: {visibility: true, value: 100}};

    Logic.updateOffScalePercentByStep(fieldData);
    assert.isTrue(fieldData.offScalePercent.visibility);
  });

  it('updateOffScalePercentByStep() when step is not visible', () => {
    let fieldData = {step: {visibility: false},
      offScalePercent: {visibility: true, value: 100}};

    Logic.updateOffScalePercentByStep(fieldData);
    assert.isFalse(fieldData.offScalePercent.visibility);
  });

  it('appointmentEndDateLogic() should wipe apptEndDt values and visibility', () => {
    let fieldData = {appointmentEndDt: {value: 100, conditionalVisibility: true},
      titleCode: {value: 3}};
    //Mock formatted common call lists
    let formattedCommonCallLists = {titleCodesById: {3: {attributeProperties: {
      appointmentEndDt: {visibility: false}}
    }}};

    Logic.appointmentEndDateLogic(fieldData, formattedCommonCallLists);

    assert.isNull(fieldData.appointmentEndDt.value);
    assert.isFalse(fieldData.appointmentEndDt.visibility);
  });

  it('appointmentEndDateLogic() should keep apptEndDt values', () => {
    let fieldData = {appointmentEndDt: {value: 100, conditionalVisibility: true},
      titleCode: {value: 3}};
    //Mock formatted common call lists
    let formattedCommonCallLists = {titleCodesById: {3: {attributeProperties: {
      appointmentEndDt: {visibility: true}}
    }}};

    Logic.appointmentEndDateLogic(fieldData, formattedCommonCallLists);

    assert.equal(fieldData.appointmentEndDt.value, 100);
    assert.isTrue(fieldData.appointmentEndDt.visibility);
  });

  it('updateTitleCodeVisibilityByApptEndDtValue() when "appointmentEndDt" has a value',
  () => {
    let fieldData = {titleCode: {visibility: false}, appointmentEndDt: {value: 100}};
    Logic.updateTitleCodeVisibilityByApptEndDtValue(fieldData);

    assert.isTrue(fieldData.titleCode.visibility);
  });

  it('updateTitleCodeVisibilityByApptEndDtValue() when "appointmentEndDt" has no value',
  () => {
    let fieldData = {titleCode: {visibility: true}, appointmentEndDt: {value: null}};
    Logic.updateTitleCodeVisibilityByApptEndDtValue(fieldData);

    assert.isFalse(fieldData.titleCode.visibility);
  });

  it('hideSalaryDependentFieldsOnInvalidField()', () => {
    let fieldData = {location: {visibility: true, value: null}, step:
      {visibility: true}, schoolName: {visibility: true}};

    Logic.hideSalaryDependentFieldsOnInvalidField(fieldData, fieldData.location,
      ['step', 'schoolName']);

    assert.isFalse(fieldData.step.visibility);
    assert.isFalse(fieldData.schoolName.visibility);
  });

  it('hideSalaryDependentFieldsOnHiddenStep()', () => {
    let fieldData = {step: {visibility: true, value: null}, schoolName:
      {visibility: true}, location: {visibility: true}};

    Logic.hideSalaryDependentFieldsOnInvalidField(fieldData, fieldData.step,
      ['location', 'schoolName']);

    assert.isFalse(fieldData.location.visibility);
    assert.isFalse(fieldData.schoolName.visibility);
  });

  //Already taken care of by three succeeding tests
  it('updateAllStartDateDependentFields()', () => {
    let fieldData = {series: {visibility: false},
      startDateAtSeries: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtSeries(fieldData);
    assert.equal(fieldData.startDateAtSeries.visibility, fieldData.series.visibility);
    assert.isNull(fieldData.startDateAtSeries.value);
    // tested by updateStartDateAtStep
    // tested by updateStartDateAtSeries
    // tested by updateStartDateAtRank
  });

  it('updateStartDateAtSeries() when series is false', () => {
    let fieldData = {series: {visibility: false},
      startDateAtSeries: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtSeries(fieldData);
    assert.equal(fieldData.startDateAtSeries.visibility, fieldData.series.visibility);
    assert.isNull(fieldData.startDateAtSeries.value);
  });

  it('updateStartDateAtSeries() when series is true', () => {
    let fieldData = {series: {visibility: true},
      startDateAtSeries: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtSeries(fieldData);
    assert.equal(fieldData.startDateAtSeries.visibility, fieldData.series.visibility);
    assert.equal(fieldData.startDateAtSeries.value, '01/01/2001');
  });

  it('updateStartDateAtRank() when rank is false', () => {
    let fieldData = {rank: {visibility: false},
      startDateAtRank: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtRank(fieldData);
    assert.equal(fieldData.startDateAtRank.visibility, fieldData.rank.visibility);
    assert.isNull(fieldData.startDateAtRank.value);
  });

  it('updateStartDateAtRank() when rank is true', () => {
    let fieldData = {rank: {visibility: true},
      startDateAtRank: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtRank(fieldData);
    assert.equal(fieldData.startDateAtRank.visibility, fieldData.rank.visibility);
    assert.equal(fieldData.startDateAtRank.value, '01/01/2001');
  });

  it('updateStartDateAtStep() when step is false', () => {
    let fieldData = {step: {visibility: false},
      startDateAtStep: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtStep(fieldData);
    assert.equal(fieldData.startDateAtStep.visibility, fieldData.step.visibility);
    assert.isNull(fieldData.startDateAtStep.value);
  });

  it('updateStartDateAtStep() when step is true', () => {
    let fieldData = {step: {visibility: true},
      startDateAtStep: {value: '01/01/2001', visibility: true}};

    Logic.updateStartDateAtStep(fieldData);
    assert.equal(fieldData.startDateAtStep.visibility, fieldData.step.visibility);
    assert.equal(fieldData.startDateAtStep.value, '01/01/2001');
  });

  it('updateStartDateDependentFieldVisibility() when parent start date is visible',
  () => {
    let startDateField = {visibility: false, value: 100},
        startDateParent = {visibility: true};

    Logic.updateStartDateDependentFieldVisibility(startDateField, startDateParent);

    assert.isTrue(startDateField.visibility);
    assert.equal(startDateField.value, 100);
  });

  it('updateStartDateDependentFieldVisibility() when parent start date is invisible',
  () => {
    let startDateField = {visibility: true, value: 100}, startDateParent =
      {visibility: false};

    Logic.updateStartDateDependentFieldVisibility(startDateField, startDateParent);

    assert.isFalse(startDateField.visibility);
    assert.isNull(startDateField.value);
  });

  it('updateStep() is conditionally "Restricted", titleCode has '
  + ' has value', () => {
    let options = ['some array'];
    let fieldData = {titleCode: {value: 3}, step: {value: 3, visibility: false,
      attributeProperties: {conditional: 'Restricted'}}};
    let commonCallLists = {titleCodeIdToStepOptions: {3: options},
      titleCodesById: {3: {attributeProperties: {step: {editable: false}}}}};

    let returned = Logic.updateStep(fieldData, commonCallLists);

    assert.isFalse(fieldData.step.editable);
    assert.equal(fieldData.step.options, options);
    assert.equal(fieldData.step.value, 0);//Because its not visible
    assert.equal(fieldData, returned);
  });


  it('updateStep() is NOT conditionally "Restricted", and titleCode has '
  + ' has value', () => {
    let options = ['some array'];
    let fieldData = {titleCode: {value: 3}, step: {value: 3, visibility: false,
      editable: true, attributeProperties: {conditional: 'Full'}}};
    let commonCallLists = {titleCodeIdToStepOptions: {3: options},
      titleCodesById: {3: {attributeProperties: {step: {editable: false}}}}};

    let returned = Logic.updateStep(fieldData, commonCallLists);

    assert.isTrue(fieldData.step.editable);
    assert.notExists(fieldData.step.options);
    assert.equal(fieldData.step.value, 3);//Because its not visible
    assert.equal(fieldData, returned);
  });

  it('updateStep() is conditionally "Restricted", but titleCode has '
  + ' has no value', () => {
    let options = ['some array'];
    let fieldData = {titleCode: {value: null}, step: {value: 3, visibility: false,
      editable: true, attributeProperties: {conditional: 'Full'}}};
    let commonCallLists = {titleCodeIdToStepOptions: {3: options},
      titleCodesById: {3: {attributeProperties: {step: {editable: false}}}}};

    let returned = Logic.updateStep(fieldData, commonCallLists);

    assert.isTrue(fieldData.step.editable);
    assert.notExists(fieldData.step.options);
    assert.equal(fieldData.step.value, 3);//Because its not visible
    assert.equal(fieldData, returned);
  });

  it('wipeStepValueIfInvisible() if step is visible', () => {
    let fieldData = {step: {value: 100, visibility: true}};
    Logic.wipeStepValueIfInvisible(fieldData);
    assert.equal(fieldData.step.value, 100);
  });

  it('wipeStepValueIfInvisible() if step is invisible', () => {
    let fieldData = {step: {value: 100, visibility: false}};
    Logic.wipeStepValueIfInvisible(fieldData);
    assert.equal(fieldData.step.value, 0);
  });

  it('updateStepAttributesFromTitleCode()', () => {
    let fieldData = {titleCode: {value: 3}, step: {}};
    let formattedCommonCallLists = {titleCodesById: {3: {attributeProperties:
      {step: {visibility: true, editable: false}}}}};

    Logic.updateStepAttributesFromTitleCode(fieldData, formattedCommonCallLists);

    assert.isTrue(fieldData.step.visibility);
    assert.isFalse(fieldData.step.editable);
  });

  it('updateStepOptionsFromTitleCode()', () => {
    let options = {1: 'random', 2: 'options'};
    let fieldData = {titleCode: {value: 3}, step: {}};
    let formattedCommonCallLists = {titleCodeIdToStepOptions: {3: options}};

    Logic.updateStepOptionsFromTitleCode(fieldData, formattedCommonCallLists);

    assert.deepEqual(fieldData.step.options, options);
  });

  it('updateStepVisibilityIfOptionsAreBlankAndNA() hides step since options ' +
  'are "Blank" and "N/A"', () => {
    let fieldData = {step: {visibility: true, options: [{'-1': ''}, {0: 'N/A'}]}};
    Logic.updateStepVisibilityIfOptionsAreBlankAndNA(fieldData);

    assert.isFalse(fieldData.step.visibility);
  });

  it('updateStepVisibilityByInvalidStepValue() hides step if value ' +
  'is "N/A"', () => {
    let fieldData = {step: {value: 0}};
    Logic.updateStepVisibilityByInvalidStepValue(fieldData);

    assert.isFalse(fieldData.step.visibility);
  });

  it('updateSeriesRankFromTitleCodeLogic() everything already tested', () => {
    let fieldData = {titleCode: {}, series: {}, rank: {}};
    let commonCallLists = {titleCodesById: {}};
    let returned = Logic.updateSeriesRankFromTitleCodeLogic(fieldData, commonCallLists);

    assert.equal(fieldData, returned);
    //tested by updateSeriesFromTitleCodeLogic
    //tesetd by updateRankFromTitleCodeLogic
  });

  it('updateSeriesFromTitleCodeLogic() changes series values', () => {
    let fieldData = {titleCode: {value: 3}, series: {conditionalVisibility: true,
      attributeProperties: {}}};
    let formattedCommonCallLists = {titleCodesById: {3: {series: 'HS Clinical',
      attributeProperties: {series: {visibility: true, editable: false}}}}};

    Logic.updateSeriesFromTitleCodeLogic(fieldData, formattedCommonCallLists);

    assert.equal(fieldData.series.value, 'HS Clinical');
    assert.isTrue(fieldData.series.visibility);
    assert.isFalse(fieldData.series.editable);
  });

  it('updateRankFromTitleCodeLogic()', () => {
    let fieldData = {titleCode: {value: 3}, rank: {conditionalVisibility: true,
      attributeProperties: {}}};
    let formattedCommonCallLists = {titleCodesById: {3: {rank:
      {rankTypeDisplayText: 'Assistant'}, attributeProperties: {rank:
        {visibility: true, editable: false}}}}};

    Logic.updateRankFromTitleCodeLogic(fieldData, formattedCommonCallLists);

    assert.equal(fieldData.rank.value, 'Assistant');
    assert.isTrue(fieldData.rank.visibility);
    assert.isFalse(fieldData.rank.editable);
  });
});
