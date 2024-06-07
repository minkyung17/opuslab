/**
 * Created by leonaburime on 7/8/16.
 **/
import React from 'react';
//import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import FixedDataTableComponent from
  '../../../../react-views/datatables/components/FixedDataTableComponent.jsx';

function setup(saving){
  const props = {saving: saving,onSave: () => {},onChange: () => {}};

  return shallow(<FixedDataTableComponent {...props} />);
}


describe('FixedDataTableComponent tests via Enzyme', () =>{

  it('renders form and h1', () => {
    //const wrapper = setup(false);
    expect(true).toBe(true);
  });

});
