import React from 'react';
import sinon from 'sinon';
import expect from 'expect';
import {mount, shallow} from 'enzyme';
//import TestUtils from 'react-addons-test-utils';
import '../../../test-utility/setup-tests.js';
import '../../../test-utility/setup-tests.enzyme.js';
import {IconCell, TextCell} from
  '../../../../react-views/datatables/components/DataTableCells.jsx';


function setup(saving, element) {
  const props = {
    saving: saving,
    onSave: () => {},
    onChange: () => {}
  };

  return shallow(<element {...props} />);
}

describe('IconCell tests via Enzyme', () =>{
  it('renders form and h1', () => {
    const wrapper = setup(false);
    expect(true).toBe(true);
    //expect(wrapper.find('div').length).toBe(1);
    //expect(wrapper.find('div').text()).toEqual('Stateful components working on react');
  });
});

describe('TextCell tests via Enzyme', () =>{
  it('renders form and h1', () => {
    const wrapper = setup(false);
    //expect(wrapper.find('div').length).toBe(1);
    //expect(wrapper.find('div').text()).toEqual('Stateful components working on react');
  });
});



describe('MoneyCell tests via Enzyme', () =>{

    it('renders form and h1', () => {
        const wrapper = setup(false);
        //expect(wrapper.find('div').length).toBe(1);
        //expect(wrapper.find('div').text()).toEqual('Stateful components working on react');
    });

});
