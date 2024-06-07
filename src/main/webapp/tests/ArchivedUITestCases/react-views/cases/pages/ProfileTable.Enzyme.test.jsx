import React from 'react';
import sinon from 'sinon';
import {assert} from 'chai';

/**
*
* @desc - My imports
*
**/
import {mount, shallow} from 'enzyme';
//import TestUtils from 'react-addons-test-utils';
import '../../../test-utility/setup-tests.js';
import '../../../test-utility/setup-tests.enzyme.js';
import * as testHelpers from '../../../test-utility/helpers';
import ProfileTable from '../../../../react-views/cases/profile/ProfileTableBlock.jsx';
import ProfileLogic from '../../../../opus-logic/cases/classes/profile/Profile';

describe('ProfileTable tests via Enzyme', () => {
  let opusPersonId = '23384';
  let profileData = null;
  let appointment = {};
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let args = null;
  let ProfileTableClass = null;
  let ProfileTableComponent = null;
  let ProfileLogicClass = null;
  let cachePaths = {
    apiProfileData: 'profile.profileData'
  };

  /**
   *
   * @desc - Lets get access token, globalData, and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();
    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    args = {adminData, globalData, access_token};
    ProfileLogicClass = new ProfileLogic(args);
    done();
  });

  /**
   *
   * @desc - Get profileData
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiProfileData} = cachePaths;

    profileData = await testHelpers.getAPIDataFromCache(apiProfileData);
    if(!profileData) {
      profileData = await ProfileLogicClass.getProfileDataByOpusId(opusPersonId);
    }
    ProfileLogicClass = new ProfileLogic(args);
    done();
  });

  it('creates ProfileTableClass', () =>{
    ProfileTableClass = new ProfileTable(args);
    assert.exists(ProfileTableClass);
  });

  it('creates ProfileTableComponent', () =>{

    ProfileTableComponent = mount(<ProfileTable {...{appointment, ...args}}/>);


    assert.exists(ProfileTableComponent);
  });
  //
  // it('creates ProfileTableClass & successfully renders ProfileTableWrapper', () => {
  //   let args = {...{adminData, globalData, access_token}};
  //   ProfileTableComponent = mount(<ProfileTable {...args} />);
  //   assert.isDefined(ProfileTableComponent);
  // });
  //
  // it('gets title text of <ProfileTable/>', () => {
  //
  // });
});
