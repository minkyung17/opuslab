import React from "react";
import PropTypes from "prop-types";
import {isPlainObject} from "lodash";
import Select from "react-select";

/******************************************************************************
*
* @desc - Flexible select options that takes array, object or array of objects
*   and displays them with the correct arguments
*
*******************************************************************************/
export class SelectOptionComponent extends React.Component {

    static propTypes = {
        includeBlankOption: PropTypes.bool,
        options: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        disabled: PropTypes.bool,
        keyIsText: PropTypes.bool,
        valueIsText: PropTypes.bool,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        name: PropTypes.string,
        options_value_key: PropTypes.string,
        options_text_key: PropTypes.string
    };
    static defaultProps = {
        value: "",
        includeBlankOption: true,
        select_class: " select-input form-control ",
        onBlur: () => {
            console.log("No OnBlur given to select options");
        },
        onChange: () => {
            console.log("No OnChange given to select options");
        }
    };


    constructor(props = {}) {
        super(props);
    }

  //Class variables
    textKey = "text";
    valueKey = "value";
    invalidValues = {null: true, undefined: true};

  /**
  *
  * @desc - If the options given as props is an object instead of an array
  * @param {Object} options - key value pair of options
  * @param {Object} props - input props
  * @return {Array} array of options
  *
  **/
    getOptionsByObject(options = {}, props = {}) {
        let results = [];
        if(props.keyIsText) {
      // for(let key in options) {
      //   results.push(<option key={options[key]} value={options[key]}>{key}</option>);
      //   // results.push(<option key={options[key]} value={options[key]}>{key}</option>);
      // }
        } else {
            for(let each of options) {
                let key = Object.keys(each);
                let label = Object.values(each);
                let obj = { value: key, label: label };
                results.push(obj);
        // results.push(<option key={key} value={key}>{options[key]}</option>);
            }
        }
        return results;
    }

  /**
  *
  * @desc - Given an array of objects extract the value & text by keys
  * @param {Object} options -
  * @param {String} valueKey -
  * @param {String} textKey -
  * @return {Array} results
  *
  **/
    getComplexOptions(options, valueKey = this.valueKey, textKey = this.textKey) {
    //Options is an array of objects with keys
        let results = [];
        for (let index in options) {
            let option = options[index];
            let value = option[valueKey];
            let text = option[textKey];

            results.push(<option key={index} {...{value}}>{text}</option>);
      // results.push(<option key={index} {...{value}}>{text}</option>);
        }
        return results;
    }


  /**
  *
  * @desc -
  * @param
  *
  **/
    getOptions({options, options_value_key, options_text_key, includeBlankOption,
    ...props} = {}) {
        let results = [];
        if(isPlainObject(options)) {
            console.log("is plain object block");
            results = this.getOptionsByObject(options, props);
        } else if(options instanceof Array && options_value_key && options_text_key) {
            console.log("is complex object block");
            results = this.getComplexOptions(options, options_value_key, options_text_key);
        }
    //An array of simple objects (without options_value_key && options_text_key )
    else if(options instanceof Array && isPlainObject(options[0])) {
        console.log("is plain object block 2");
      // results = options.map(each => this.getOptionsByObject(each, props));
        results = this.getOptionsByObject(options, props);
    } else if(options instanceof Array) {
        console.log("else block ");
        results = options.map(text => <option key={text} value={text}>{text}</option>);
      // results = options.map(text => <option key={text} value={text}>{text}</option>);
    }
    //Add blank to front
        if(includeBlankOption) {
            results.unshift(<option key={''} />);
        }
        return results;
    }

  /**
  *
  * @desc - Internal method to update value
  * @param {Object} event - key value pair of options
  * @return {void}
  *
  **/
    onChange = (event) => {
    //event.persist();
        return this.props.onChange(event, this.props);
    }

  /**
  *
  * @desc - hook for onBlur to send props
  * @param {Event} event - onBlur event
  * @return {void}
  *
  **/
    onBlur = (event) => {
        return this.props.onBlur(event, this.props);
    }

  /**
  *
  * @desc - renders the jsx
  * @return {void}
  *
  **/
    render() {
        let {onBlur, onChange, props} = this;
        let {value, name, disabled, elementProps, extraClass} = props;
        let results = this.getOptions(this.props);
        value = value in this.invalidValues ? "" : value;
    // const results = [
    //   { value: 'chocolate', label: 'Chocolate' },
    //   { value: 'strawberry', label: 'Strawberry' },
    //   { value: 'vanilla', label: 'Vanilla' }
    // ]

        return (
      <div>
        <Select options={results}/>
      </div>
    );
    }
}
