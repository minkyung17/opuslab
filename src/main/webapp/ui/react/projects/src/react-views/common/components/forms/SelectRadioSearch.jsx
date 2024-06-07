import React from "react";
import PropTypes from "prop-types";
import {isPlainObject} from "lodash";

/******************************************************************************
*
* @desc - Flexible select options that takes array, object or array of objects
*   and displays them with the correct arguments
*
*******************************************************************************/
export class SelectRadioSearch extends React.Component {
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

    state = {
        nameForRadio: "code",
        results: []
    }

    constructor(props = {}) {
        super(props);
    }

  //Class variables
    textKey = "text";
    valueKey = "value";
    invalidValues = {null: true, undefined: true};

       /**
    *
    * @desc - Lifecycle hook when receiving newProps
    * @param {Object} props - props
    * @return {void}
    *
    **/
    componentWillReceiveProps = (props) => {
        this.setOptions(this.state.nameForRadio);
    }

    setOptions = (name) => {
        let results = [];
        if(name==="name"){
            results = this.getOptions(this.props, true);
            this.setState({nameForRadio: "name"})
        }else{
            results = this.getOptions(this.props, false);
            this.setState({nameForRadio: "code"})
        }
        this.setState({results})
    }

  /**
  *
  * @desc - If the options given as props is an object instead of an array
  * @param {Object} options - key value pair of options
  * @param {Object} props - input props
  * @return {Array} array of options
  *
  **/
    getOptionsByObject(options = {}, props = {}, searchByName) {
        let results = [];
        if(props.keyIsText) {
            for(let key in options) {
                results.push(<option key={options[key]} value={options[key]}>{key}</option>);
            }
        } else {
            for(let key in options) {
                let optionsKey = options[key];
                if(searchByName){
                    let split = optionsKey.split(":");
                    results.push(<option key={key} value={key}>{split[1]+" :"+split[0]}</option>);
                }else{
                    results.push(<option key={key} value={key}>{optionsKey}</option>);
                }
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
    ...props} = {}, searchByName) {
        let results = [];
        if(isPlainObject(options)) {
            results = this.getOptionsByObject(options, props, searchByName);
        } else if(options instanceof Array && options_value_key && options_text_key) {
            results = this.getComplexOptions(options, options_value_key, options_text_key);
        }
        //An array of simple objects (without options_value_key && options_text_key )
        else if(options instanceof Array && isPlainObject(options[0])) {
            results = options.map(each => this.getOptionsByObject(each, props, searchByName));
        } else if(options instanceof Array) {
            results = options.map(text => <option key={text} value={text}>{text}</option>);
        }
        //Add blank to front
        if(includeBlankOption) {
            results.unshift(<option key={''} />);
        }

        return results;
    }

    radioClick = (e) => {
        this.setOptions(e.target.value);
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
        console.log(event.target.value)
        // return this.props.onChange(event, this.props);
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
        let {results, nameForRadio} = this.state;
        value = value in this.invalidValues ? "" : value;

        return (
      <div>
        <div class="radio">
            <input type="radio" name={name} id={name+"code"} value="code" onClick={this.radioClick} checked={nameForRadio==="code"} />
                Search by Code
            &nbsp; &nbsp; &nbsp;
            <input type="radio" name={name} id={name+"name"} value="name" onClick={this.radioClick} checked={nameForRadio==="name"}/>
                Search by Name
        </div>
        <select {...{id: name, name, value, disabled, onChange, onBlur,
          ...elementProps}} className={" select-input form-control "+extraClass}>
          {results}
        </select>
      </div>
    );
    }
}
