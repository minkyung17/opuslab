import axios from 'axios';
import {assert} from 'chai';
import {keys, values} from 'lodash';

//Testing constants
import '../../../../test-utility/setup-tests';
import {constants} from '../../../../test-utility/testing-constants';
import * as testHelpers from '../../../../test-utility/helpers';

//My import
import CAP from '../../../../../opus-logic/cases/classes/recommendations/CAP';

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
    Logic = new CAP({globalData, adminData, access_token, caseId});

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

  it('Ensure getCAPCommitteeOptions() gets the list for the committee member roles', () => {
    //From the Logic class
    let capCommitteeOptions = Logic.getCAPCommitteeOptions();

    //Mock data
    let mockCapCommitteeOptions = {
      committeeMemberProposedRoles: {
        0: 'N/A',
        1: 'Member',
        2: 'Alternate Member',
        3: 'Chair',
        4: 'Alternate Chair',
        5: 'Dept. Rep',
        6: 'Alternate Dept. Rep'
      },
      committeeMemberRoles: {
        0: 'N/A',
        1: 'Member',
        2: 'Alternate Member',
        3: 'Chair',
        4: 'Alternate Chair',
        5: 'Dept. Rep',
        6: 'Alternate Dept. Rep',
        7: 'Declined to Serve'
      }
    }

    assert.isObject(capCommitteeOptions);

    let committeeKeys = ['committeeMemberProposedRoles', 'committeeMemberRoles'];
    assert.containsAllKeys(capCommitteeOptions, committeeKeys);

    let rolesKeys = keys(capCommitteeOptions.committeeMemberRoles);
    let rolesValues = values(capCommitteeOptions.committeeMemberRoles);
    let mockRolesKeys = keys(mockCapCommitteeOptions.committeeMemberRoles);
    let mockRolesValues = values(mockCapCommitteeOptions.committeeMemberRoles);

    assert.deepEqual(rolesKeys, mockRolesKeys);
    assert.deepEqual(rolesValues, mockRolesValues);

    let proposedRolesKeys = keys(capCommitteeOptions.committeeMemberProposedRoles);
    let proposedRolesValues = values(capCommitteeOptions.committeeMemberProposedRoles);
    let mockProposedRolesKeys = keys(mockCapCommitteeOptions.committeeMemberProposedRoles);
    let mockProposedRolesValues = values(mockCapCommitteeOptions.committeeMemberProposedRoles);

    assert.deepEqual(proposedRolesKeys, mockProposedRolesKeys);
    assert.deepEqual(proposedRolesValues, mockProposedRolesValues);
  });

  it('Ensure getCAPSlateFieldData() gets fieldData for CAP Slate', () => {
    //From the Logic class
    let capSlateFieldData = Logic.getCAPSlateFieldData();

    assert.isObject(capSlateFieldData);

    //Just check for structure since it would be too much to check every field
    assert.exists(capSlateFieldData.proposedRole);
    assert.exists(capSlateFieldData.proposedRole.attributeProperties);
    assert.exists(capSlateFieldData.proposedRole.options);
    assert.exists(capSlateFieldData.proposedRole.pathsInAPI);

    assert.exists(capSlateFieldData.userComments);
    assert.exists(capSlateFieldData.userComments.attributeProperties);
    assert.exists(capSlateFieldData.userComments.pathsInAPI);
  });

  it('Ensure getCAPRCFieldData() gets fieldData for CAP RC', () => {
    //From the Logic class
    let capRCFieldData = Logic.getCAPRCFieldData();

    assert.isObject(capRCFieldData);

    //Just check for structure since it would be too much to check every field
    assert.exists(capRCFieldData.proposedRole);
    assert.exists(capRCFieldData.proposedRole.attributeProperties);
    assert.exists(capRCFieldData.proposedRole.options);
    assert.exists(capRCFieldData.proposedRole.pathsInAPI);

    assert.exists(capRCFieldData.finalRole);
    assert.exists(capRCFieldData.finalRole.attributeProperties);
    assert.exists(capRCFieldData.finalRole.options);
    assert.exists(capRCFieldData.finalRole.pathsInAPI);

    assert.exists(capRCFieldData.userComments);
    assert.exists(capRCFieldData.userComments.attributeProperties);
    assert.exists(capRCFieldData.userComments.pathsInAPI);
  });

  it('Ensure canAddCAPMember() allows adding member if CAP RC is Yes', () => {
    let mockCaseRecommendationsAPIDataRequiredYes = {
      caseRecommendations: [
        {
          recommender: 'CAP RC',
          required: 'Yes'
        }
      ]
    };

    let mockCaseRecommendationsAPIDataRequiredNo = {
      caseRecommendations: [
        {
          recommender: 'CAP RC',
          required: 'No'
        }
      ]
    };

    //From the Logic class
    let requiredYesCanAdd = Logic.canAddCAPMember(mockCaseRecommendationsAPIDataRequiredYes);
    assert.isTrue(requiredYesCanAdd);

    let requiredNoCannotAdd = Logic.canAddCAPMember(mockCaseRecommendationsAPIDataRequiredNo);
    assert.isNotTrue(requiredNoCannotAdd);
  });

  it('Ensure extractCAPDataFromAPI() extracts capRC and capSlate rows from API', () => {
    let capData = Logic.extractCAPDataFromAPI(caseRecommendationsAPIData);
    let {capRC, capSlate} = capData;
    let capKeys = ['caseId', 'caseReviewCommitteeId', 'commentsText',
      'committeeAddedByGroupId', 'committeeMemberFinalRole', 'committeeMemberFinalRoleId',
      'committeeMemberProposedRole', 'committeeMemberProposedRoleId', 'committeeTypeId',
      'delete', 'loggedInUserInfo', 'name'];
    //Even though there could be more than one element in the array, checking the first one is
    //fine since we are just comparing structure (which would be the same for all elements)
    if(capRC.length!==0){
      assert.containsAllKeys(capRC[0], capKeys);
    }else{
      console.log("WARNING: capRC Table is blank")
    }
    if(capSlate.length!==0){
      assert.containsAllKeys(capSlate[0], capKeys);
    }else{
      console.log("WARNING: capSlate Table is blank")
    }

  });

  it('Ensure extractAcademicDataFromApptInfo() gets deptName, rank and step', () => {
    let mockAppointmentInfo = {
      academicHierarchyInfo: {
        departmentName: 'Law'
      },
      titleInformation: {
        rank: {
          rankTypeDisplayText: 'Lecturer'
        },
        step: {
          stepTypeDescription: 'N/A'
        }
      }
    };
    let academicData = Logic.extractAcademicDataFromApptInfo(mockAppointmentInfo);

    assert.equal(academicData.departmentName, 'Law');
    assert.equal(academicData.rank, 'Lecturer');
    assert.equal(academicData.step, 'N/A');
  });

  it('Ensure extractCAPDisplayFields() gets display text that will be shown on page', () => {
    let capRCDisplayFields = Logic.extractCAPRCDisplayFields(caseRecommendationsAPIData);
    let capDisplayFields = Logic.extractCAPDisplayFields(capRCDisplayFields);

    assert.exists(capDisplayFields[0].appointmentInfo);
    assert.equal(capDisplayFields[0].name, 'Feramisco, Celia ');
    assert.equal(capDisplayFields[0].committeeMemberProposedRole, 'Alternate Member');

    let capKeys = ['caseId', 'caseReviewCommitteeId', 'commentsText',
      'committeeAddedByGroupId', 'committeeMemberFinalRole', 'committeeMemberFinalRoleId',
      'committeeMemberProposedRole', 'committeeMemberProposedRoleId', 'committeeTypeId',
      'delete', 'loggedInUserInfo', 'name', 'series', 'rank', 'step'];

    //Even though there could be more than one element in the array, checking the first one is
    //fine since we are just comparing structure (which would be the same for all elements)
    assert.containsAllKeys(capDisplayFields[0], capKeys);
  });

  it('Ensure extractCAPRCDisplayFields() extracts cap RC data', () => {
    let capRCDisplayFields = Logic.extractCAPRCDisplayFields(caseRecommendationsAPIData);

    assert.exists(capRCDisplayFields[0].appointmentInfo);
    assert.equal(capRCDisplayFields[0].name, 'Feramisco, Celia ');
    assert.equal(capRCDisplayFields[0].committeeMemberProposedRole, 'Alternate Member');
    assert.equal(capRCDisplayFields[0].committeeMemberFinalRole, 'Alternate Chair');

    let capKeys = ['caseId', 'caseReviewCommitteeId', 'commentsText',
      'committeeAddedByGroupId', 'committeeMemberFinalRole', 'committeeMemberFinalRoleId',
      'committeeMemberProposedRole', 'committeeMemberProposedRoleId', 'committeeTypeId',
      'delete', 'loggedInUserInfo', 'name', 'series', 'rank', 'step'];

    //Even though there could be more than one element in the array, checking the first one is
    //fine since we are just comparing structure (which would be the same for all elements)
    assert.containsAllKeys(capRCDisplayFields[0], capKeys);
  });

  it('Ensure extractCAPSlateDisplayFields() extracts cap slate data', () => {
    let capSlateDisplayFields = Logic.extractCAPSlateDisplayFields(caseRecommendationsAPIData);

    assert.exists(capSlateDisplayFields[0].appointmentInfo);
    assert.equal(capSlateDisplayFields[0].name, 'Feramisco, Celia ');
    assert.equal(capSlateDisplayFields[0].committeeMemberProposedRole, 'Alternate Member');
    assert.equal(capSlateDisplayFields[0].committeeMemberFinalRole, null);


    let capKeys = ['caseId', 'caseReviewCommitteeId', 'commentsText',
      'committeeAddedByGroupId', 'committeeMemberFinalRole', 'committeeMemberFinalRoleId',
      'committeeMemberProposedRole', 'committeeMemberProposedRoleId', 'committeeTypeId',
      'delete', 'loggedInUserInfo', 'name', 'series', 'rank', 'step'];

    //Even though there could be more than one element in the array, checking the first one is
    //fine since we are just comparing structure (which would be the same for all elements)
    assert.containsAllKeys(capSlateDisplayFields[0], capKeys);
  });

  it('Ensure getNameSearchAPIArgs() gets grouperPathText and string for nameSearch', () => {
    let testString = 'Test';
    let nameSearchAPIArgs = Logic.getNameSearchAPIArgs(testString);
    let {grouperPathText, searchString} = nameSearchAPIArgs;
    assert.equal(grouperPathText, 'ucla:hierarchy%');
    assert.equal(searchString, testString);
  });

  it('Ensure formatNameSearchResults() gets grouperPathText and string for nameSearch', () => {
    let mockNameSearchResults = [
      {
        appointeeInfo: {
          fullName: 'Caswell, Michelle L'
        },
        appointmentInfo: [{
          academicHierarchyInfo: {
            departmentName: 'Education and Information Studies, N/A, Information Studies'
          },
          titleInformation: {
            rank: {
              rankTypeDisplayText: 'Associate'
            },
            step: {
              stepTypeDescription: '1'
            },
            series: 'Reg Professor'
          },
          affiliationType: {
            affiliation: 'Primary'
          }
        }]
      }
    ];

    let formattedNameSearchResults = Logic.formatNameSearchResults(mockNameSearchResults);
    let {series, rank, step, affiliation, department, name, rank_step}
      = formattedNameSearchResults['Caswell, Michelle L - Education and Information Studies, N/A, Information Studies - Primary - Reg Professor/Associate/1'];
    assert.equal(rank, 'Associate');
    assert.equal(step, '1');
    assert.equal(department, 'Education and Information Studies, N/A, Information Studies');
    assert.equal(name, 'Caswell, Michelle L');
    assert.equal(affiliation, 'Primary');
    assert.equal(rank_step, 'Associate/1');
    assert.equal(series, 'Reg Professor');
  });

  it('Ensure getNameSearchURL() get nameSearch URL', () => {
    let mockNameSearchUrl
      = '/restServices/rest/activecase/getCommitteeMembersResultset?access_token=' + access_token;
    let nameSearchUrl = Logic.getNameSearchURL();
    assert.equal(nameSearchUrl, mockNameSearchUrl);
  });

  it('Ensure getUpdateMemberUrl() gets update member url with access token', () => {
    let mockUpdateMemberUrl
      = '/restServices/rest/activecase/updateReviewCommittee?access_token=' + access_token;
    let updateMemberUrl = Logic.getUpdateMemberUrl(access_token);
    assert.equal(updateMemberUrl, mockUpdateMemberUrl)
  });

  it('Ensure setCommitteeTypeIdInMemberTemplate() set committeeTypeId to 8', () => {
    let template = {
      committeeTypeId: null
    };
    let updatedTemplate = Logic.setCommitteeTypeIdInMemberTemplate(template);
    assert.equal(updatedTemplate.committeeTypeId, 8);
  });

  it('Ensure formatTemplateFromMemberAPIData() formats template by adding appointmentInfo and name of user updating template', () => {
    let memberAPIData = {
      name: 'Caswell, Michelle L',
      appointmentInfo: {}
    };
    let template = {};
    let updatedTemplate = Logic.formatTemplateFromMemberAPIData(template, memberAPIData);

    assert.exists(updatedTemplate.appointmentInfo);
    assert.equal(updatedTemplate.name, 'Caswell, Michelle L');
  });

  it('Ensure formatTemplateFromCaseData() sets caseData specifically caseId into template', () => {
    let template = {};
    let caseData = {
      caseId: '12345'
    };
    let updatedTemplate = Logic.formatTemplateFromCaseData(template, caseData);
    assert.equal(updatedTemplate.caseId, caseData.caseId);
  });

  it('Ensure formatMemberTemplate() updates member', () => {
    let fieldData = {
      finalRole: {
        pathsInAPI: {
          cap: {
            displayText: 'committeeMemberFinalRoleId',
            value: 'committeeMemberFinalRoleId'
          }
        },
        value: 1
      },
      proposedRole: {
        pathsInAPI: {
          cap: {
            displayText: 'committeeMemberProposedRoleId',
            value: 'committeeMemberProposedRoleId'
          }
        },
        value: 1
      },
      userComments: {
        pathsInAPI: {
          cap: {
            displayText: 'commentsText',
            value: 'commentsText'
          }
        },
        value: 'Hi'
      }
    };
    let memberAPIData = {
      caseReviewCommitteeId: 66,
      committeeTypeId: 8,
      name: 'Caswell, Michelle L'
    };
    let caseData = {
      caseId: 3265
    };
    let memberTemplate = Logic.formatMemberTemplate(fieldData, memberAPIData, caseData);
    assert.equal(memberTemplate.caseId, 3265);
    assert.equal(memberTemplate.caseReviewCommitteeId, 66);
    assert.equal(memberTemplate.commentsText, 'Hi');
    assert.equal(memberTemplate.committeeMemberFinalRoleId, 1);
    assert.equal(memberTemplate.committeeMemberProposedRoleId, 1);
    assert.equal(memberTemplate.committeeTypeId, 8);
    assert.equal(memberTemplate.name, 'Caswell, Michelle L');
  });

  // Not testing this one because it just returns a call to the save function
  // it('Ensure updateCAPRCMember() updates CAPRC table and specifically adds the groupId of capRC', () => {
  //
  // });

  // Not testing this one because it just returns a call to the save function
  // it('Ensure updateCAPSlateMember() updates CAPSlate table and specifically adds the groupId of cap slate', () => {
  //
  // });

  it('Ensure formatDeleteCAPMemberTemplate() formatting the delete template', () => {
    let data = {
      name: 'Caswell, Michelle L',
      committeeAddedByGroupId: 2,
      appointmentInfo: {},
      caseReviewCommitteeId: 66
    };
    let mockCaseId = 3256;
    let deleteTemplate = Logic.formatDeleteCAPMemberTemplate(data, mockCaseId);
    assert.equal(deleteTemplate.committeeTypeId, 8);
    assert.equal(deleteTemplate.delete, 'Y');
    assert.exists(deleteTemplate.loggedInUserInfo.adminName);
    assert.exists(deleteTemplate.name);
    assert.equal();
    assert.exists(deleteTemplate.appointmentInfo);
    assert.exists(deleteTemplate.committeeAddedByGroupId);
    assert.equal(deleteTemplate.committeeAddedByGroupId, 2);
    assert.exists(deleteTemplate.caseReviewCommitteeId);
    assert.equal(deleteTemplate.caseReviewCommitteeId, 66);
    assert.exists(deleteTemplate.caseId);
    assert.equal(deleteTemplate.caseId, 3256);
  });

  it('Ensure getDeleteUrl() gets delete URL', () => {
    let mockDeleteUrl =
      '/restServices/rest/activecase/updateReviewCommittee?access_token=' + access_token;
    let deleteUrl = Logic.getDeleteUrl();
    assert.equal(deleteUrl, mockDeleteUrl);
  });
});
