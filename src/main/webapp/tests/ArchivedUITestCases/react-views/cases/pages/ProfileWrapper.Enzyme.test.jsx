import React from 'react';
import sinon from 'sinon';
import {assert} from 'chai';
import {mount, shallow} from 'enzyme';

/**
*
* @desc - My imports
*
**/
//import TestUtils from 'react-addons-test-utils';
import '../../../test-utility/setup-tests.js';
import '../../../test-utility/setup-tests.enzyme.js';
import * as testHelpers from '../../../test-utility/helpers';
import ProfileWrapper from '../../../../react-views/cases/profile/ProfileWrapper.jsx';
import ProfilePage from '../../../../react-views/cases/profile/ProfilePage.jsx';

describe('ProfileWrapper tests via Enzyme', () => {
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let ProfileWrapperComponent = null;

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

  it('successfully renders the ProfilePageWrapper', () => {
    let props = {...{adminData, globalData, access_token}};
    ProfileWrapperComponent = mount(<ProfileWrapper {...{Page: ProfilePage,
      ...props}}/>);
    assert.exists(ProfileWrapperComponent);
  });

  it('ensures ProfilePageWrapper renders <input id="search-field" />', () => {
    assert.equal(1, ProfileWrapperComponent.find('input#search-field').length);
  });
});
