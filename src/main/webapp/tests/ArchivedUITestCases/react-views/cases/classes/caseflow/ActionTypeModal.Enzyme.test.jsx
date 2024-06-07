import React from 'react';
import sinon from 'sinon';
import {assert} from 'chai';
import {mount, shallow} from 'enzyme';
//import TestUtils from 'react-addons-test-utils';
import '../../../../test-utility/setup-tests.js';
import '../../../../test-utility/setup-tests.enzyme.js';
import * as testHelpers from '../../../../test-utility/helpers';
// import {NameSearchModalContainer} from
//   '../../../../../redux-state/cases/containers/caseflow/NameSearchModal.jsx';
import ActionTypeModal from
  '../../../../../react-views/cases/caseflow/ActionTypeModal.jsx';

describe('<ActionTypeModal /> Component', () => {
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let ActionTypeModalComponent = null;

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

  it('renders <ActionTypeModal /> with props', () => {
    let args = {access_token, adminData, globalData, showModal: true};
    //ActionTypeModalComponent = shallow(<NameSearchModal {...args} />);
    //assert.isNotNull(ActionTypeModalComponent);
  });
});
