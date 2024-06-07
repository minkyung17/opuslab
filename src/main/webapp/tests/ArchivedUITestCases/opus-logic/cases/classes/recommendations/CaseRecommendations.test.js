import axios from 'axios';
import {assert} from 'chai';

//Testing constants
import '../../../../test-utility/setup-tests';
import {constants} from '../../../../test-utility/testing-constants';
import * as testHelpers from '../../../../test-utility/helpers';

//My import
import CaseRecommendations from
  '../../../../../opus-logic/cases/classes/recommendations/CaseRecommendations';

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
    Logic = new CaseRecommendations({globalData, adminData, access_token, caseId});

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
  /************************** END OF API DATA RETRIEVAL*************************/

  it('Ensure extractRecommendationsData() returns caseRecommendations', () => {
    let data = Logic.extractRecommendationsData(recommendationsData);
    assert.isArray(data);
    assert.deepEqual(data, caseRecommendations);
  });

  //Gets tested as a part of getCAPSlateFieldData() and getCAPRCFieldData() in CAP.js
  // it('Ensure addOptionsToFieldData() creates fieldData options', () => {
  //
  // });

  it(`Ensure setFieldValuesFromDataByRecommendationPath() sets fieldData values
    based upon path`, () => {
    let fieldData = {
      proposedRole: {
        pathsInAPI: {
          cap: {
            displayText: 'committeeMemberProposedRoleId',
            value: 'committeeMemberProposedRoleId'
          }
        },
        value: ''
      },
      userComments: {
        pathsInAPI: {
          cap: {
            displayText: 'commentsText',
            value: 'commentsText'
          },
          recommendations: { //won't be used because project is 'cap'
            displayText: 'recommendationCommentsText',
            value: 'recommendationCommentsText'
          }
        },
        value: ''
      }
    };

    let data = {
      committeeMemberProposedRole: 'Member',
      committeeMemberProposedRoleId: 1,
      commentsText: 'Hi'
    };

    //Logic function will map the data object keyed on path (pathsInAPI.cap.value's value)
    //and set the fieldData[name].value to the data object's value.
    Logic.setFieldValuesFromDataByRecommendationPath(fieldData, data, 'cap');
    assert.equal(fieldData.proposedRole.value, 1);
    assert.equal(fieldData.userComments.value, 'Hi');
  });

  //Tested as a part of formatUpdateCaseAPITemplate() and formatMemberTemplate() in
  //Recommendations and CAP
  // it('Ensure setFieldDataValuesInTemplate() sets fieldData values correctly', () => {
  //
  // });

  it('Ensure getUrlForAPIData() gets the correct URL', () => {
    let url = Logic.getUrlForAPIData();
    let testUrl =
      '/restServices/rest/activecase/getRecommendationSummary?access_token=' + access_token;
    assert.equal(url, testUrl);
  });
});
