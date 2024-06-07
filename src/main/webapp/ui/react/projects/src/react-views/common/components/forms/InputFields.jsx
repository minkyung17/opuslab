import React from 'react';
import PropTypes from 'prop-types';
import DebounceInput from 'react-debounce-input';

//My imports
import * as util from '../../../../opus-logic/common/helpers/';


/*******************************************************************************
 *
 * @desc -
 *
 ******************************************************************************/
export class BaseInput extends React.Component {
  /**
   *
   * @desc - Handle on change action
   * @param {Event} event - event object
   * @return {void}
   *
   **/
  onChange = (event) => {
    this.props.onChange(event, this.props);
  };

  /**
   *
   * @desc - Handle on blur
   * @param {Event} event - event object
   * @return {void}
   *
   **/
  onBlur = (event) => {
    this.props.onBlur(event, this.props);
  };
}
BaseInput.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};
BaseInput.defaultProps = {
  onChange: ()=> {},
  onBlur: ()=> {}
};


/*******************************************************************************
 *
 * @desc - Allows for null values
 * @param {Any} value
 *
 * @return {Any} value
 *
 ******************************************************************************/
export class SimpleInput extends BaseInput {

  /**
   *
   * @desc - Simple input text field
   * @return {JSX} Simple input text field
   *
   **/
  render() {
    let {props: {disabled, name, inputProps, value}, onBlur, onChange} = this;

    return (
      <input className=" form-control " autoComplete="off" {...inputProps}
        {...{id: name, name, value, disabled, onChange, onBlur}}/>
    );
  }
}

/*******************************************************************************
 *
 * @desc -
 *
 ******************************************************************************/
export class NumberInput extends BaseInput {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    name: PropTypes.string,
    disabled: PropTypes.bool,
    classText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    maxNumericCharacters: PropTypes.number,
    default_text: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };
  static defaultProps = {
    value: '',
    classText: '',
    inputProps: {},
    disabled: false,
    onBlur: () =>{},
    onChange: () => {},
    maxNumericCharacters: 8
  };

  /**
   *
   * @desc - Restricts number of numerical characters to specified prop value
   * @param {Event} event - change event
   * @param {Object} - props
   * @return {void}
   *
   **/
  restrictInputNumberCharacters = (event, {maxNumericCharacters} = this.props) => {
    let {value} = event.target;
    if(value && value.length > maxNumericCharacters) {
      return;
    }
    this.props.onChange(event, this.props);
  }


  /**
   *
   * @desc - Specifically returns number
   * @return {JSX} - jsx
   *
   **/
  render() {
    let {onBlur, props: {disabled, name, id = name, inputProps, value}} = this;
    // 0 as a number does not display in the field properly but string 0 does
    if(value===0){ value = '0';}
    return (
      <input type="number" className=" form-control " autoComplete="off"
        {...{id, disabled, value: value || '', name, onBlur, ...inputProps}}
        onChange={this.restrictInputNumberCharacters} />
    );
  }
}


/*******************************************************************************
 *
 * @desc -
 *
 ******************************************************************************/
export class DebounceNumberInput extends NumberInput {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    name: PropTypes.string,
    disabled: PropTypes.bool,
    classText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    maxNumericCharacters: PropTypes.number,
    default_text: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };
  static defaultProps = {
    value: '',
    classText: '',
    inputProps: {},
    disabled: false,
    onBlur: () =>{},
    onChange: () => {},
    maxNumericCharacters: 8
  };

  /**
   *
   * @desc - Specifically returns number
   * @return {JSX} - jsx
   *
   **/
  render() {
    let {onBlur, props: {disabled, name, id = name, inputProps, value}} = this;
    // 0 as a number does not display in the field properly but string 0 does
    if(value===0){ value = '0';}
    return (
      <DebounceInput className=" form-control " autoComplete="off"
        {...{id, disabled, value, name, onBlur, ...inputProps}} element={NumberInput}
        debounceTimeout={500} onChange={this.restrictInputNumberCharacters} />
    );
  }
}

/*******************************************************************************
 *
 * @desc - Number input with decimal points
 *
 ******************************************************************************/
export class CurrencyInput extends BaseInput {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    name: PropTypes.string,
    disabled: PropTypes.bool,
    classText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    maxNumericCharacters: PropTypes.number,
    default_text: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };
  static defaultProps = {
    value: '',
    classText: '',
    inputProps: {},
    disabled: false,
    onBlur: () =>{},
    onChange: () => {},
    maxNumericCharacters: 10
  };

  /**
   *
   * @desc - Restricts number of numerical characters to specified prop value
   * @param {Event} event - change event
   * @param {Object} - props
   * @return {void}
   *
   **/
  restrictInputNumberCharacters = (event, {maxNumericCharacters} = this.props) => {
    let {value} = event.target;
    if(value && value.length > maxNumericCharacters) {
      return;
    }
    this.props.onChange(event, this.props);
  }


  /**
   *
   * @desc - Specifically returns number
   * @return {JSX} - jsx
   *
   **/
  render() {
    let {onBlur, props: {disabled, name, id = name, inputProps, value}} = this;
    // 0 as a number does not display in the field properly but string 0 does
    if(value===0){ value = '0';}
    return (
      <input type="number" min="0.00" step="0.01" max ="99999999.99" className=" form-control " autoComplete="off"
        {...{id, disabled, value: value || '', name, onBlur, ...inputProps}}
        onChange={this.restrictInputNumberCharacters} />
    );
  }
}


/*******************************************************************************
 *
 * @desc -
 *
 ******************************************************************************/
export class TextArea extends BaseInput {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    message: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    elementProps: PropTypes.object,
    maxAllowableCharacters: PropTypes.number
  };

  static defaultProps = {
    message: '',
    maxAllowableCharacters: 255,
    base_css: ' form-control comment-modal-field '
  };


  /**
   *
   * @desc - Update the value but not if over "maxAllowableCharacters"
   * @param {Event} event - event object that executes when typed
   * @param {Object} props - elements props
   * @return {Any}
   *
   **/
  onChange = (event, props = this.props) => {
    event.persist();
    let {value} = event.target;

    //Dont go over max allowable characters
    if(value.length >= this.props.maxAllowableCharacters) {
      return null;
    }

    return this.props.onChange(event, props);
  }

  /**
   *
   * @desc - Update the value onBlur but not if over "maxAllowableCharacters"
   * @param {Event} event - event object that executes when typed
   * @param {Object} props - elements props
   * @return {Any}
   *
   **/
  onBlur = (event, props = this.props) => {
    event.persist();
    let {value} = event.target;

    //Dont go over max allowable characters
    if(value.length >= this.props.maxAllowableCharacters) {
      return null;
    }

    return this.props.onBlur(event, props);
  }

  /**
   *
   * @desc - text area
   * @return {JSX} - jsx text
   *
   **/
  render() {
    let {onChange, onBlur, props, props: {disabled, name, className, value}}
      = this;

    return (
      <div>
        <textarea {...{id: name, name, value, disabled, onChange, onBlur}}
          {...props.elementProps}
          className={` form-control  ${className} `}/>
      </div>
    );
  }
}

/*******************************************************************************
 *
 * @desc - Text Area with Max character validation
 *
 ******************************************************************************/
export class TextAreaMaxChar extends BaseInput {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    message: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    elementProps: PropTypes.object,
    maxAllowableCharacters: PropTypes.number
  };

  static defaultProps = {
    message: '',
    maxAllowableCharacters: 250,
    base_css: ' form-control text-area-max-char-field '
  };


  /**
   *
   * @desc - Update the value but not if over "maxAllowableCharacters"; IOK-1030 removed equal sign from value check
   * @param {Event} event - event object that executes when typed
   * @param {Object} props - elements props
   * @return {Any}
   *
   **/
  onChange = (event, props = this.props) => {
    event.persist();
    let {value} = event.target;

    //Dont go over max allowable characters
    if(value.length > this.props.maxAllowableCharacters) {
      return null;
    }

    return this.props.onChange(event, props);
  }

  /**
   *
   * @desc - Update the value onBlur but not if over "maxAllowableCharacters"; IOK-1030 removed equal sign from value check
   * @param {Event} event - event object that executes when typed
   * @param {Object} props - elements props
   * @return {Any}
   *
   **/
  onBlur = (event, props = this.props) => {
    event.persist();
    let {value} = event.target;

    //Dont go over max allowable characters
    if(value.length > this.props.maxAllowableCharacters) {
      return null;
    }

    return this.props.onBlur(event, props);
  }

  /**
   *
   * @desc - text area
   * @return {JSX} - jsx text
   *
   **/
  render() {
    let {onChange, onBlur, props, props: {disabled, name, className, value}}
      = this;

    return (
      <div>
        <textarea rows={props.rows ? props.rows : 6} {...{id: name, name, value, disabled, onChange, onBlur}}
          {...props.elementProps}
          className={` form-control text-area-max-char-field ${className} `}/>
      </div>
    );
  }
}