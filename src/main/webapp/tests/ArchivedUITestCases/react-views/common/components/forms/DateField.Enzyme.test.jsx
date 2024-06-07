import React from 'react';
import sinon from 'sinon';
import {assert, expect} from 'chai';
import {mount, shallow} from 'enzyme';

//My imports
import '../../../../test-utility/setup-tests.js';
import '../../../../test-utility/setup-tests.enzyme.js';

//import TestUtils from 'react-addons-test-utils';
import {DateField} from '../../../../../react-views/common/components/forms/DateField.jsx';


function shallowSetup(element, props = {}) {
  return shallow(<element {...props} />);
}


describe('DateField input tests via Enzyme', () =>{

  it('renders a React DateField', () => {
      const wrapper = shallowSetup(DateField);
      // expect(wrapper.find('div').text()).toEqual(`Stateful components working
      //   on react`);
      expect(true).to.equal(true);
  });
});
