import axios from 'axios';
import {assert} from 'chai';

//Testing constants
import '../../../../test-utility/setup-tests';
import {constants} from '../../../../test-utility/testing-constants';
import * as testHelpers from '../../../../test-utility/helpers';

//My import
import Recommendations from
  '../../../../../opus-logic/cases/classes/recommendations/Recommendations';

describe('Recommendations Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiApptData: 'caseRecommendations.apiData'
  };
  let caseId = 16854;
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let Logic = null;
  let caseRecommendationsAPIData = null;

  let recommendationsData = null;
  let caseRecommendations = null;
  let caseReviewCommittes = null;

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
    Logic = new Recommendations({globalData, adminData, access_token, caseId});

    done();
  });

  /**
   *
   * @desc - Get cache data
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiApptData} = cachePaths;
    caseRecommendationsAPIData = await testHelpers.getAPIDataFromCache(apiApptData);
    recommendationsData = caseRecommendationsAPIData;
    done();
  });

  /************************** RETRIEVE API DATA FIRST *************************/
  it('Get Recommendations data and caches it', async (done) => {
    let {apiApptData} = cachePaths;

    if(!recommendationsData) {
      let recommendationsUrl = Logic.getUrlForAPIData();
      let caseIdParam = '&caseId=' + caseId;
      let apiUrl = karmaAliasBaseUrl + recommendationsUrl + caseIdParam;
      let {data} = await axios.get(apiUrl);
      recommendationsData = data;
      testHelpers.postAPIDataToCache(recommendationsData, apiApptData);
    }

    caseRecommendations = recommendationsData.caseRecommendations;
    caseReviewCommittes = recommendationsData.caseReviewCommittes;

    done();
  });
  // /************************** END OF API DATA RETRIEVAL*************************/

  //Is this function actually being used?  It gets called but the resulting Object
  //allFieldData doesn't look like it's being used - just set in state of
  //RecommendationComponents.jsx
  it('Ensure formatActionOutcomes() format the actionIds and their options', () => {
    let actionOutcomes = {
      '1-8': [
        {
          code: 3,
          name: 'Completed'
        }
      ],
      '2-7': [
        {
          code: 2,
          name: 'Approved'
        },
        {
          code: 5,
          name: 'Disapproved'
        }
      ]
    };
    let expectedOutcomes = {
      '1-8': {
        3: 'Completed'
      },
      '2-7': {
        2: 'Approved',
        5: 'Disapproved'
      }
    }
    let outcomes = Logic.formatActionOutcomes(actionOutcomes);
    assert.deepEqual(outcomes, expectedOutcomes);
  });

  it(`Ensure canEditRecommendation() determines if the user can edit the
   recommendations based on role. Must be no waiver`, () => {
    let recommendationRequired1 = {
      required: 'Yes'
    };
    let recommendationRequired2 = {
      required: 'No-Waiver'
    };

    //A required 'Yes' should return true for canEditRecommendation
    let test1 = Logic.canEditRecommendation(recommendationRequired1);
    assert.equal(test1, true);

    //A required 'No-Waiver' should return false for canEditRecommendation
    let test2 = Logic.canEditRecommendation(recommendationRequired2);
    assert.equal(test2, false);
  });

  it('Ensure formatOptions() format the actionIds and their options', () => {
    let actionCategoryId = 2;
    let actionTypeId = 7;

    let formatOptions = Logic.formatOptions({actionTypeId, actionCategoryId});
    assert.isObject(formatOptions);

    let formatOptionsKeys = ['actionOutcomesOptions', 'capCommitteeType',
      'rank', 'recommendationOptions', 'recommendationOutcomes', 'recommendationStrengthIds',
      'recommendationTypes', 'requiredOptions', 'step'];
    assert.containsAllKeys(formatOptions, formatOptionsKeys);

    for (let record in formatOptions) {
      assert.isNotEmpty(record);
    }
  });

  it('Ensure getFormattedListsFromAdminData() get rank and step array list', () => {
    let formattedLists = Logic.getFormattedListsFromAdminData(adminData);
    let formattedListsKeys = ['rank', 'step'];
    assert.containsAllKeys(formattedLists, formattedListsKeys);
  });

  it('Ensure addBlankOptionToStepList() adds blank string to step array', () => {
    let step = ['N/A', '1'];
    let stepWithBlankOption = ['', 'N/A', '1'];
    let stepOptions = Logic.addBlankOptionToStepList(step);
    assert.deepEqual(stepOptions, stepWithBlankOption);

  });

  it(`Ensure getActionOutcomeOptions() gets formatted actionOutcomes from
  actionType and actionCategory`, () => {
    let actionCategoryId = 2;
    let actionTypeId = 7;
    let actionOutcomesOptions = Logic.getActionOutcomeOptions(globalData,
      {actionTypeId, actionCategoryId});

    //Note that formatActionOutcomes, which is called inside this function,
    //has already been tested above
    let mockActionOutcomesOptions = {
      actionOutcomesOptions: {
        2: 'Approved',
        5: 'Disapproved',
        14: 'Approved Higher Step',
        15: 'Approved Lower Step',
        16: 'Approved Date Modified',
        17: 'Approved Salary Modified',
        18: 'Disapproved Salary Modified'
      }
    };
    assert.deepEqual(actionOutcomesOptions, mockActionOutcomesOptions);
  });

  it('Ensure getCommonTypeReferencesOptionsFromGlobalData() gets dropdown options for ui menu', () => {
    let commonTypeRefOptions = Logic.getCommonTypeReferencesOptionsFromGlobalData(globalData);
    assert.isObject(commonTypeRefOptions);

    let commonTypeRefOptionsKeys = ['requiredOptions', 'capCommitteeType', 'recommendationOptions',
      'recommendationOutcomes', 'recommendationTypes', 'recommendationStrengthIds'];
    assert.containsAllKeys(commonTypeRefOptions, commonTypeRefOptionsKeys);

    for (let record in commonTypeRefOptions) {
      assert.isNotEmpty(record);
    }
  });

  //This function just calls one other function, createFieldDataBySingleAttributeProperty(),
  //that is already tested as part of the FieldData logic class
  // it('Ensure createFieldData() put values from template to data', () => {
  //
  // });

  it('Ensure addValuesToFieldData() put values from template to data', () => {
    let fieldData = {
      deptVotingCommitteeResultsDt: {
        pathsInAPI: {
          recommendations: {
            displayText: 'opusCase.deptVotingCommitteeResultsDt',
            value: 'opusCase.deptVotingCommitteeResultsDt'
          }
        }
      },
      recommendation: {
        pathsInAPI: {
          recommendations: {
            displayText: 'recommendation',
            value: 'outComeTypeId'
          }
        }
      },
      salary: {
        pathsInAPI: {
          appointment: {
            displayText: 'salaryInfo.currentSalaryAmt',
            value: 'salaryInfo.currentSalaryAmt'
          },
          recommendations: {
            value: 'recommendationSalaryAmt'
          }
        }
      }
    };
    let template = {
      opusCase: {
        deptVotingCommitteeResultsDt: '07/01/2018'
      },
      outComeTypeId: null,
      recommendationSalaryAmt: '100000'
    };
    Logic.addValuesToFieldData(fieldData, template);
    assert.equal(fieldData.deptVotingCommitteeResultsDt.value, '07/01/2018');
    assert.equal(fieldData.recommendation.value, null);
    assert.equal(fieldData.salary.value, '100000');
  });

  it('Ensure createAllFieldData() creates fieldData for all recommendation fields', () => {
    let actionCategoryId = 2;
    let actionTypeId = 7;
    let fieldData = Logic.createAllFieldData({actionCategoryId, actionTypeId});
    //Returns back a very complicated object - just check these for now
    assert.isObject(fieldData);
    assert.isNotEmpty(fieldData);
    assert.lengthOf(Object.keys(fieldData), 7);
  });

  it(`Ensure getFieldDataInfoForRecommendationByTypeId() retrieve title and
    fieldData by recommendationTypeId`, () => {
    let recommendationTypeId = 1;
    let mockFieldDataInfo = {
      title: 'Department Chair Recommendation', fieldData: {}, fields: ['recommendation',
        'deptVotingCommitteeResultsDt', 'rank', 'step', 'salary', 'userComments']
    };
    let fieldDataInfo = Logic.getFieldDataInfoForRecommendationByTypeId(recommendationTypeId);
    //Not comparing a deepEqual to fieldData because it gets set at some other point
    //and won't match the empty object defined in mockFieldDataInfo
    assert.deepEqual(fieldDataInfo.fields, mockFieldDataInfo.fields);
  });

  it(`Ensure setRecommendationTypeIdToCapCommitteeTypeId() if typeOfCAPCommittee
    and recommendation exists then set recommendation to value of typeOfCAPCommittee`, () => {
    let fieldData1 = {
      recommendation: {
        value: 1
      },
      typeOfCAPCommittee: {
        value: 3
      }
    };
    let fieldData2 = {
      recommendation: {
        value: null
      },
      typeOfCAPCommittee: {
        value: null
      }
    };
    let updatedFieldData1 = Logic.setRecommendationTypeIdToCapCommitteeTypeId(fieldData1);

    //Since recommendation and typeOfCAPCommittee do not hold invalid values,
    //the fieldData.recommendation.value will get set to the original fieldData's
    //typeOfCAPCommittee value
    assert.equal(updatedFieldData1.recommendation.value,
      fieldData1.typeOfCAPCommittee.value);

    let updatedFieldData2 = Logic.setRecommendationTypeIdToCapCommitteeTypeId(fieldData2);

    //Since the recommendation and typeOfCAPCommittee values are invalid, the original
    //fieldData gets returned
    assert.deepEqual(updatedFieldData2, fieldData2);
  });

  //Gets tested as a part of the Validator's validateAllFieldDataOnSave() function
  // it('Ensure validateAllFieldDataOnSave() create and format template for Profile Save', () => {
  //
  // });

  it('Ensure getUpdateCaseAPI() get url w/ access token to save data', () => {
    let testUrl = '/restServices/rest/activecase/saveCaseRecommendation?access_token='
      + access_token;
    let url = Logic.getUpdateCaseAPI(access_token);
    assert.equal(url, testUrl);
  });

  it('Ensure formatUpdateCaseAPITemplate() gets the formatted Case API template', () => {
    let fieldData = {
      deptVotingCommitteeResultsDt: {
        pathsInAPI: {
          recommendations: {
            displayText: 'opusCase.deptVotingCommitteeResultsDt',
            value: 'opusCase.deptVotingCommitteeResultsDt'
          }
        },
        value: '07/01/2018'
      },
      recommendation: {
        pathsInAPI: {
          recommendations: {
            displayText: 'recommendation',
            value: 'outComeTypeId'
          }
        },
        value: 1
      }
    };
    let recommendation = {
      opusCase: {
        deptVotingCommitteeResultsDt: ''
      },
      outComeTypeId: null
    };
    let caseData = {
      caseId: '16854'
    };
    //Is this just copying over fieldData values into the template?  Seems similar
    //to other functions tested before
    let template = Logic.formatUpdateCaseAPITemplate(fieldData, recommendation, caseData);
    assert.equal(template.opusCase.caseId, '16854');
    assert.equal(template.opusCase.deptVotingCommitteeResultsDt, '07/01/2018');
    assert.equal(template.outComeTypeId, 1);
  });
});
