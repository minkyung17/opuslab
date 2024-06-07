import sinon from 'sinon';
import expect from 'expect';
import {hash as rsvpHash} from 'rsvp';
import {mount, shallow} from 'enzyme';
//import TestUtils from 'react-addons-test-utils';

import * as testHelpers from '../../../test-utility/helpers';
import CasesTable from '../../../../react-views/datatables/pages/CasesTable';
import {config} from '../../../../react-views/datatables/constants/ActiveCasesConstants';


describe('ActiveCasesTable', () =>{
  let access_token = null;
  let adminData = null;

  //Lets get access token and adminData before tests start
  beforeAll(async (done) => {//when 'done' is executed all the tests will start
    let data = await rsvpHash({
      adminData: testHelpers.getAdminData(),
      access_token: testHelpers.getAccessToken()
    });
    adminData = data.adminData;
    access_token = data.access_token;

    // console.log('access_token: ', access_token);
    // console.log('adminData: ', adminData);

    done();
  });



  it('acts as a dummy test', () => {
    let args = {access_token, adminData, config_name: 'activeCases'};
    //let element = shallow(<CasesTable {...args} />);
    expect(true).toBe(true);
    //expect(element.find(`.fixedDataTableLayout_main`).length).toBe(3);
      //expect(element.find('div').text()).toEqual('Stateful components working on react');
  });

});
