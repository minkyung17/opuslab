import React from 'react';
import {assert} from 'chai';
import {mount, shallow} from 'enzyme';

//My imports
import '../../../../test-utility/setup-tests.js';
import '../../../../test-utility/setup-tests.enzyme.js';
import {FormShell, FormGroup, FormElementWrapper, TextAreaFormElementWrapper,
  FormElement} from '../../../../../react-views/common/components/forms/FormRender.jsx';

describe('Enzyme: (FormRender)', () => {
  describe('[FormShell]', () => {
    let text = 'text';

    it('renders the outside of a form <div><form></form></div>', () => {
      const wrapper = shallow(<FormShell>{text}</FormShell>);
      assert.isAbove(wrapper.find('div form').length, 0);
      assert.equal(wrapper.text(), text);
    });
  });


  describe('[FormGroup]', () => {
    let inputField = {dataType: 'input'};
    let selectField = {dataType: 'options'};
    let fields = [inputField, selectField];
    let wrapper = mount(<FormGroup {...{fields}} />);

    it('renders <input /> and <select />', () => {
      assert.isAbove(wrapper.find('div input').length, 0,
        '<input /> not rendered');
      assert.isAbove(wrapper.find('div select').length, 0,
        '<select /> not rendered');
    });
  });

  describe('[TextAreaFormElementWrapper]', () => {
    let text = 'text';
    let error = 'Error';
    let displayName = 'Text for Comment';
    const wrapper = shallow(
      <TextAreaFormElementWrapper {...{displayName, error}}>
        {text}
      </TextAreaFormElementWrapper>);

    it('renders <div className=" comment-form-group form-group "></div>', () => {
      assert.isAbove(wrapper.find('div.comment-form-group.form-group').length, 0);
    });

    it('renders <div className=" error_message "> Error </div>', () => {
      let element = wrapper.find('div.error_message');
      assert.isAbove(element.length, 0);
      assert.include(element.text(), error);
    });

    it('renders <label className=" comment-label">Text for Comment</div>', () => {
      let element = wrapper.find('label.comment-label');
      assert.isAbove(element.length, 0);
      assert.include(element.text(), displayName);
    });
  });


  describe('[FormElementWrapper]', () => {
    let error = 'Error';
    let helpText = 'Help me';
    let formElementText = 'Form Element Text';
    let displayName = 'Form Element Display Name';

    let wrapper = shallow(
      <FormElementWrapper {...{error, helpText, displayName}}>
        {formElementText}
      </FormElementWrapper>);

    it('renders <div class="form-group"><label /> </div>', () => {
      assert.isAbove(wrapper.find('div.form-group').length, 0);
      assert.isAbove(wrapper.find('div label').length, 0);
    });

    it('renders <div class="form-control-static" />', () => {
      assert.isAbove(wrapper.find('div.form-control-static').length, 0);
      assert.isAbove(wrapper.find('div label').length, 0);
    });

    it('renders <div class="error_message" /> ', () => {
      let element = wrapper.find('div.error_message');
      assert.isAbove(element.length, 0);
      assert.include(element.text(), error);
    });

    it('renders <p class="help-block" /> ', () => {
      let element = wrapper.find('p.help-block');
      assert.isAbove(element.length, 0);
      assert.include(element.text(), helpText);
    });

    it('ensures text of <FormElementWrapper displayName="Name"> == "Name"', () => {
      let text = wrapper.find('div label').text();
      assert.include(text, displayName);
    });

    it('ensures "Form Element Text" in of <FormElementWrapper>Form Element Text'
    + ' </FormElementWrapper> is rendered', () => {
      let text = wrapper.find('div.form-control-static').text();
      assert.include(text, formElementText);
    });
  });


  describe('[FormElement]', () => {
    let onChange = () => 'Returns onChange';
    let onBlur = () => 'Returns onBlur';

    let autocomplete = {name: 'autocomplete', id: 'autocomplete',
      dataType: 'autocomplete', value: 'Hello', newValue: 'different'};
    let input = {name: 'input', dataType: 'input', value: 'Hello', disabled: true,
      helpMessageBottom: 'Help Me', newValue: 'different'};
    let select = {id: 'select', name: 'select', dataType: 'options',
      options: ['Picked', 'Unpicked'], value: 'Picked', disabled: true,
      newValue: 'different'};
    let number = {id: 'number', name: 'number', dataType: 'number', value: '5',
      disabled: true, newValue: 'different'};
    let date = {id: 'date', name: 'date', dataType: 'date', value: '12/12/1986',
      disabled: true, newValue: '01/01/2000'};
    let textarea = {id: 'textarea', name: 'textarea', dataType: 'textarea',
      disabled: true, value: 'Comments Text', newValue: 'different'};
    let defaultInput = {id: 'default', name: 'default', value: 'Hello',
      disabled: true, newValue: 'different'};

    it('renders <FormElement /> as "autocomplete" with correct props', () => {
      let wrapper = mount(<FormElement {...{...autocomplete, onChange,
        onSearchClick: onChange}}/>);
      let element = wrapper.find('input');
      assert.isAtLeast(element.length, 1);

      let {id, name, value, onChange: onChangeFunc} = element.props();
      assert.equal(id, autocomplete.id);
      assert.equal(name, autocomplete.name);
      assert.equal(value, autocomplete.value);
      assert.isFunction(onChangeFunc);

      //Reset the value and check its rendered
      wrapper.setProps({value: autocomplete.newValue});
      assert.equal(wrapper.find('input').props().value, autocomplete.newValue);
    });

    it('renders <FormElement /> as "<input />" with correct props', () => {
      let wrapper = mount(<FormElement {...{...input, onChange, onBlur}}/>);
      let element = wrapper.find('input');
      assert.isAtLeast(element.length, 1);

      let {id, name, value, disabled, onChange: onChangeFunc,
        onBlur: onBlurFunc} = element.props();
      assert.equal(id, input.name);
      assert.equal(name, input.name);
      assert.equal(value, input.value);
      assert.equal(disabled, input.disabled);
      assert.equal(onChangeFunc(), onChange());
      assert.equal(onBlurFunc(), onBlur());
      assert.equal(wrapper.find('p.input-bottom').text(), input.helpMessageBottom);

      //Reset the value and check its rendered
      wrapper.setProps({value: input.newValue});
      assert.equal(wrapper.find('input').props().value, input.newValue);
    });


    it('renders <FormElement /> as "<select />" with correct props', () => {
      let wrapper = mount(<FormElement {...{...select, onChange, onBlur}}/>);
      let element = wrapper.find('select');
      let options = element.find('option');
      assert.isAtLeast(element.length, 1);

      let {id, name, value, disabled, onChange: onChangeFunc,
        onBlur: onBlurFunc} = element.props();
      assert.equal(id, select.id);
      assert.equal(name, select.name);
      assert.equal(value, select.value);
      assert.equal(disabled, select.disabled);
      assert.equal(onBlurFunc(), onBlur());
      assert.equal(onChangeFunc(), onChange());
      assert.isAtLeast(options.length, select.options.length); //Num of options

      //Reset the value and check its rendered
      wrapper.setProps({value: select.newValue});
      assert.equal(wrapper.find('select').props().value, select.newValue);
    });

    it('renders <FormElement /> as "<number />" with correct props', () => {
      let wrapper = mount(<FormElement {...{...number, onChange, onBlur}}/>);
      let element = wrapper.find('input');
      assert.isAtLeast(element.length, 1);

      let {id, name, value, disabled, onChange: onChangeFunc, onBlur: onBlurFunc}
        = element.props();
      assert.equal(id, number.id);
      assert.equal(name, number.name);
      assert.equal(value, number.value);
      assert.equal(disabled, number.disabled);
      assert.isFunction(onBlurFunc);
      assert.isFunction(onChangeFunc);

      //Reset the value and check its rendered
      wrapper.setProps({value: number.newValue});
      assert.equal(wrapper.find('input').props().value, number.newValue);
    });

    it('renders <FormElement /> as "<input type="date" />" with correct props', () => {
      let wrapper = mount(<FormElement {...{...date, onChange, onBlur}}/>);
      let element = wrapper.find('input');
      let {id, name, value, disabled, onChange: onChangeFunc,
        onBlur: onBlurFunc} = element.props();

      assert.equal(id, date.id);
      assert.equal(name, date.name);
      assert.equal(value, date.value);
      assert.equal(disabled, date.disabled);
      assert.isFunction(onBlurFunc);
      assert.isFunction(onChangeFunc);

      //Reset the value and check its rendered
      wrapper.setProps({value: date.newValue});
      assert.equal(wrapper.find('input').props().value, date.newValue);
    });

    it('renders <FormElement /> as "<textarea />" with correct props', () => {
      let wrapper = mount(<FormElement {...{...textarea, onChange, onBlur}}/>);
      let element = wrapper.find('textarea');
      assert.isAtLeast(element.length, 1);

      let {id, name, value, disabled, onChange: onChangeFunc, onBlur: onBlurFunc}
        = element.props();
      assert.equal(id, textarea.id);
      assert.equal(name, textarea.name);
      assert.equal(value, textarea.value);
      assert.equal(disabled, textarea.disabled);
      assert.isFunction(onBlurFunc);
      assert.isFunction(onChangeFunc);

      //Reset the value and check its rendered
      wrapper.setProps({value: textarea.newValue});
      assert.equal(wrapper.find('textarea').props().value, textarea.newValue);
    });

    it('renders <FormElement /> as DEFAULT "<input />" with correct props', () => {
      let wrapper = mount(<FormElement {...{...defaultInput, onChange, onBlur}}/>);
      let element = wrapper.find('input');
      assert.isAtLeast(element.length, 1);

      let {id, name, value, disabled, onChange: onChangeFunc, onBlur: onBlurFunc}
        = element.props();
      assert.equal(id, defaultInput.name);
      assert.equal(name, defaultInput.name);
      assert.equal(value, defaultInput.value);
      assert.equal(disabled, defaultInput.disabled);
      assert.equal(onChangeFunc(), onChange());
      assert.equal(onBlurFunc(), onBlur());

      //Reset the value and check its rendered
      wrapper.setProps({value: defaultInput.newValue});
      assert.equal(wrapper.find('input').props().value, defaultInput.newValue);
    });
  });
});
