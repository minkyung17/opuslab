import {assert} from 'chai';

import * as testHelpers from '../../../test-utility/helpers';
import {Cases} from '../../../../opus-logic/cases/classes/Cases';


describe('Case Logic Class', () => {
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;

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
    Logic = new Cases({globalData, adminData, access_token});

    done();
  });

  it('constructor() ensures "CommonCallLists" & "Permissions" are created', () => {
    assert.exists(Logic.CommonCallLists);
    assert.exists(Logic.Permissions);
  });

  it('initClassVariables()', () => {
    let resource_name = 'eligibility';
    Logic.initClassVariables({access_token, adminData, globalData}, resource_name);

    let grouperPathText = adminData.resourceMap[resource_name].grouperPathTexts;

    assert.equal(Logic.access_token, access_token);
    assert.deepEqual(Logic.adminData, adminData);
    assert.deepEqual(Logic.globalData, globalData);
    assert.equal(Logic.grouperPathText, grouperPathText);
  });

  it('getDisplayFieldsFromAppointments()', () => {

  });

  it('stringify()', () => {
    let string = 'string';
    assert.equal(Logic.stringify(string), JSON.stringify(string));
  });

  it('getShortenedDeptCodeText()', () => {
    let deptCode = 'College of Letters and Science, L&S Social Sciences ' +
      'Division, African American Studies';

    let shortened = Logic.getShortenedDeptCodeText(deptCode);

    assert.equal(shortened, 'African American Studies');
  });

  it('getValidAcademicName() gets proper name from concatted department name', () => {
    let department = 'African American Studies';
    let division = 'L&S Social Sciences Division';
    let school = 'College of Letters and Science';


    let shortened = Logic.getValidAcademicName(department, division, school);
    assert.equal(shortened, department);

    shortened = Logic.getValidAcademicName('N/A', school, division);
    assert.equal(shortened, division);

    shortened = Logic.getValidAcademicName('N/A', school, 'N/A');
    assert.equal(shortened, school);
  });

  it('getValidAcademicNameSafe()', () => {
    let department = 'African American Studies';
    let school = 'College of Letters and Science';
    let division = 'L&S Social Sciences Division';

    let shortened = Logic.getValidAcademicNameSafe(department, division, school);
    assert.equal(shortened, department);

    shortened = Logic.getValidAcademicNameSafe('', school, division);
    assert.equal(shortened, division);

    shortened = Logic.getValidAcademicNameSafe('', school, 'N/A');
    assert.equal(shortened, school);
  });

  it('reformatDisplayValuesBasedOnViewType()', () => {
    let fieldData = {appointmentPctTime: {displayValue: '5', displayType: 'percent'},
      percentTime: {displayValue: '5'},
      salary: {displayValue: '10000', displayType: 'money'},
      currentSalary: {displayValue: '10000'}};
    Logic.reformatDisplayValuesBasedOnViewType(fieldData);

    assert.equal(fieldData.appointmentPctTime.displayValue, '5%');
    assert.equal(fieldData.percentTime.displayValue, '5');
    assert.equal(fieldData.salary.displayValue, '$10,000');
    assert.equal(fieldData.currentSalary.displayValue, '10000');
  });

  it('getVisibleFieldData()', () => {
    let fieldData = {step: {visibility: true}, apuCode: {visibility: false},
      location: {visibility: true}};

    let visible = Logic.getVisibleFieldData(fieldData);

    assert.exists(visible.step);
    assert.exists(visible.location);
    assert.notExists(visible.apuCode);

    //# of visible keys in fieldData
    assert.deepEqual(['step', 'location'], Object.keys(visible));
  });

  it('getAttributePropertiesFromAppointment()', () => {
    let fieldData = {};
    let commonCall = {}
  });

  it('addOptionsListToFieldData()', () => {
    let lists = {rankOptions: ['Assistant', 'Full'], stepOptions: ['1', '2']};
    let fieldData = {
      step: {dataType: 'options', optionsInfo: {formattedListName: 'stepOptions'}},
      rank: {dataType: 'options', optionsInfo: {formattedListName: 'rankOptions'}}
    };
    Logic.addOptionsListToFieldData(fieldData, lists);

    assert.equal(fieldData.step.options, lists.stepOptions);
    assert.equal(fieldData.rank.options, lists.rankOptions);
  });

  it('getAPIListsFromCommonCallData()', () => {

  });

  it('getFormattedListsFromCommonCallData()', () => {

  });

  it('getCachedCommonCallLists()', () => {
  });

  it('sortAppointmentsByOpusStandards()', () => {
    let first = {affiliationType: {affiliationTypeId: 2, appointmentCategoryId: 100}};
    let second = {affiliationType: {affiliationTypeId: 3, appointmentCategoryId: 2}};
    let third = {affiliationType: {affiliationTypeId: 3, appointmentCategoryId: 1},
      academicHierarchyInfo: {departmentName: 'BB'}};
    let fourth = {affiliationType: {affiliationTypeId: 3, appointmentCategoryId: 1},
      academicHierarchyInfo: {departmentName: 'AA'}};
    let appointments = [third, fourth, second, first];
    let sorted = Logic.sortAppointmentsByOpusStandards(appointments);

    assert.deepEqual(sorted, [first, fourth, third, second]);
  });

  it('sortAppointmentsByAffiliationTypeId()', () => {
    let first = {affiliationType: {affiliationTypeId: 2, appointmentCategoryId: 100}};
    let second = {affiliationType: {affiliationTypeId: 3, appointmentCategoryId: 2}};
    let third = {affiliationType: {affiliationTypeId: 3, appointmentCategoryId: 1}};
    let appointments = [third, second, first];

    let sorted = Logic.sortAppointmentsByAffiliationTypeId(appointments);

    assert.deepEqual(sorted, [first, third, second]);
  });

  it('getAffiliationList()', () => {
    let {affiliationTypeList} = Logic.CommonCallLists.getAPIListsFromCommonCallData();
    let affiliationList = Logic.getAffiliationList(affiliationTypeList);

    assert.deepEqual({1: 'Primary', 2: 'Additional'}, affiliationList);
  });

  it('addStepOptionsByTitleCodeValue()', () => {
    let fieldData = {titleCode: {value: 3}, step: {}};
    let stepOptions = [0, 1, 2];
    let commonCallLists = {titleCodeIdToStepOptions: {3: stepOptions}};

    Logic.addStepOptionsByTitleCodeValue(fieldData, commonCallLists);

    assert.equal(fieldData.step.options, stepOptions);
  });

  it('omitFieldsFromFieldData() omits "series" and "rank" from fieldData', () => {
    let mockFieldData = {series: {}, rank: {}, step: {}};
    let omittedFieldData = Logic.omitFieldsFromFieldData(mockFieldData,
      ['series', 'rank']);

    assert.exists(omittedFieldData.step);
    assert.notExists(omittedFieldData.rank);
    assert.notExists(omittedFieldData.series);
  });

  it('addFieldValuesToTemplateByAttrPropsPath()', () => {
    let fieldData = {
      apuCode: {attributeProperties: {pathToFieldValue: 'apuCode'}, value: 3},
      step: {attributeProperties: {pathToFieldValue: 'titleInfo.step'}, value: 5},
      salary: {attributeProperties: {pathToFieldValue: 'salary'}, value: 50000}
    };

    let template = Logic.addFieldValuesToTemplateByAttrPropsPath(fieldData);

    assert.equal(template.apuCode, 3);
    assert.equal(template.salary, 50000);
    assert.equal(template.titleInfo.step, 5);
  });

  it('addApuCodeToApptByFieldDataApuId()', () => {
    let fieldData = {apuCode: {value: 3}};
    let commonCallLists = {apuIdToCodeWithPast: {3: '3B'}};
    let appointment = {salaryInfo: {academicProgramUnit: {}}};

    Logic.addApuCodeToApptByFieldDataApuId(fieldData, appointment, commonCallLists);

    assert.equal(appointment.salaryInfo.academicProgramUnit.apuCode, '3B');
  });

  it('addAHPathAndDeptCodeToApptFromFieldData()', () => {
    let fieldData = {departmentCode: {value: 3}};
    let commonCallLists = {aHPathIdsToDeptCode: {3: '3B'}};
    let appointment = {academicHierarchyInfo: {academicHierarchyPathId: {}}};

    Logic.addAHPathAndDeptCodeToApptFromFieldData(fieldData, appointment,
      commonCallLists);

    assert.equal(appointment.academicHierarchyInfo.departmentCode, '3B');
    assert.equal(appointment.academicHierarchyInfo.academicHierarchyPathId, 3);
  });

  //already tested by other functions
  it('updateFieldDataByToggle()', () => {
    //already tested by this.getCachedCommonCallLists
    //already tested by this.FieldDataToggle.updateFieldData
  });

  //already tested by other functions
  it('updateFieldDataFromSalaryAPI()', () => {
    //tested by this.updateFieldData "departmentCode"
    //tested by this.updateFieldData "titleCode"
    //tested by this.updateFieldData "step"
  });

  it('populateLoggedInUserInfoWithAdminData()', () => {
    let loggedInUserInfo = Logic.populateLoggedInUserInfoWithAdminData();

    assert.include(adminData, loggedInUserInfo);
  });

  it('wipeValuesOfInvisibleFieldData()', () => {
    let fieldData = {step: {value: 34, visibility: false},
      titleCode: {value: 123, visibility: false},
      departmentCode: {value: 5, visibility: true}};

    Logic.wipeValuesOfInvisibleFieldData(fieldData);

    assert.isNull(fieldData.step.value);
    assert.isNull(fieldData.titleCode.value);
    assert.equal(fieldData.departmentCode.value, 5);
  });

  it('wipeValuesOfInvisibleFieldDataSubset()', () => {
    let fieldData = {step: {value: 34, visibility: false},
      titleCode: {value: 123, visibility: false},
      departmentCode: {value: 5, visibility: true}};

    //Only wipes value for fields given
    Logic.wipeValuesOfInvisibleFieldDataSubset(fieldData, {
      wipeInvisibleFieldDataValues: ['titleCode', 'departmentCode']});

    assert.equal(fieldData.step.value, 34);
    assert.isNull(fieldData.titleCode.value);
    assert.equal(fieldData.departmentCode.value, 5);
  });

  it('wipeErrorsFromFieldData()', () => {
    let fieldData = {key: {hasError: true, error: 'error'}};
    Logic.wipeErrorsFromFieldData(fieldData);

    for(let key in fieldData) {
      let {hasError, error} = fieldData[key];
      assert.isFalse(hasError);
      assert.isNull(error);
    }
  });

  it('validateAllFieldDataOnSave()', () => {

  });

  it('validateKeyedFieldsOnSave()', () => {

  });

  it('validateFieldOnUpdate()', () => {

  });

  it('validateFieldOnBlur()', () => {

  });

  it('editStepValueByVisibility() sets value to 0 if invisible', () => {
    let fieldData = {step: {visibility: false, value: 1000}};
    Logic.editStepValueByVisibility(fieldData);

    assert.isFalse(fieldData.step.visibility);
    assert.equal(fieldData.step.value, 0);
  });

  it('setValueOfInvisibleFields()', () => {
    let fieldData = {location: {visibility: false, value: 5}, departmentCode:
    {visibility: true, value: 5}};
    Logic.setValueOfInvisibleFields(fieldData);

    //Value should be wiped since location is not visible
    assert.isNull(fieldData.location.value);

    //DeptCode not invisible so value isnt going anywhere
    assert.equal(fieldData.departmentCode.value, 5);
  });

  it('getSaveHeaders()', () => {
    let headers = Logic.getSaveHeaders();
    let testHeaders = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    assert.deepEqual(headers, testHeaders);
  });

  it('formatSaveCommentTemplate()', () => {
    let commentsText = 'comment';
    let entityKeyColumnValue = 100;
    let screenName = 'cases';

    let template = Logic.formatSaveCommentTemplate(commentsText, entityKeyColumnValue,
      screenName);

    let testTemplate = {commentsText, entityKeyColumnValue, screenName,
      loggedInUserName: adminData.adminName};

    assert.deepEqual(template, testTemplate);
  });

  it('getAddCommentUrl()', () => {
    let commentUrl = Logic.getAddCommentUrl();
    assert.equal(commentUrl, '/restServices/rest/common/comments/?access_token='
      + access_token);
  });

  it('getCommentsUrlById()', () => {
    let id = 'anyId';
    let screenName = 'cases';
    let commentUrl = Logic.getCommentsUrlById(id, screenName, {access_token});

    assert.equal(commentUrl, `/restServices/rest/common/comments/${screenName}/`
      + `${id}?access_token=${access_token}`);
  });

  //Not testing promises
  it('getCommentsById()', () => {});

  it('isCommentValid()', () => {
    let isCommentValid = Logic.isCommentValid();
    assert.isFalse(isCommentValid);

    let comment = 'comment';
    isCommentValid = Logic.isCommentValid(comment);
    assert.isTrue(isCommentValid);
  });
});
