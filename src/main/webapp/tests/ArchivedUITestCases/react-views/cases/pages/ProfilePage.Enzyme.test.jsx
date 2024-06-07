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
import ProfilePage from '../../../../react-views/cases/profile/ProfilePage.jsx';


describe('ProfilePage tests via Enzyme', () => {
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let ProfilePageLogic = null;
  let ProfilePageComponent = null;

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
    done();
  });

  it('creates ProfilePageLogic', () =>{
    let props = {...{adminData, globalData, access_token}};
    ProfilePageLogic = new ProfilePage(props);
    assert.isDefined(ProfilePageLogic);
  });


  it('ensures ProfilePageLogic can render title jsx', () =>{
    let title = ProfilePageLogic.getTitleText();
    let Title = mount(title);
    assert.isDefined(Title);
  });

  it('creates ProfilePageLogic & successfully renders ProfilePageWrapper', () => {
    let props = {...{adminData, globalData, access_token}};
    ProfilePageComponent = mount(<ProfilePage {...props} />);
    assert.exists(ProfilePageComponent);
  });

  it('gets title text of <ProfilePage/>', () => {

  });
});
