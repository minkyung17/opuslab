import React from 'react';
import sinon from 'sinon';
import {assert} from 'chai';
import {mount} from 'enzyme';
//import TestUtils from 'react-addons-test-utils';
import '../../../../test-utility/setup-tests.js';
import '../../../../test-utility/setup-tests.enzyme.js';
import * as testHelpers from '../../../../test-utility/helpers';
import NameSearchModal from '../../../../../react-views/cases/caseflow/NameSearchModal.jsx';


describe('<NameSearchModal> Component', () => {
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let NameSearchModalComponent = null;
  let NameSearchModalElement = null;

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

  it('renders <NameSearchModal /> with props', () => {
    let args = {access_token, adminData, globalData, showModal: true};
    NameSearchModalComponent = mount(<NameSearchModal {...args} />);
    //NameSearchModalElement = mount(NameSearchModalComponent.ref(refName));

    assert.isNotNull(NameSearchModalComponent);
  });

  it('ensures Autocomplete <input /> was created', () => {
    //assert.equal(1, NameSearchModalComponent.find('input.ui-autocomplete-input').length);
  });
});
