import React from 'react';
import ReactDOM from 'react-dom';

import * as util from '../../../../opus-logic/common/helpers/';


export default class AutoComplete extends React.Component {

  /**
  *
  * @desc -
  *
  **/
  static defaultProps = {
    delay: 0,
    id: 'search-field',
    name: 'autocomplete-search-field',
    minLength: 3,
    options: [],
    autoCompleteUIOptions: {},
    inputProps: {},
    onChange: ()=>{},
    autocomplete_css: ' form-group search ',
    input_css: ' form-control  search-field profile-search-width '
  };

  /**
  *
  * @desc -
  *
  **/
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    delay: React.PropTypes.number,
    value: React.PropTypes.string,
    input_css: React.PropTypes.string,
    autocomplete_css: React.PropTypes.string,
    minLength: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    inputProps: React.PropTypes.object,
    autoCompleteUIOptions: React.PropTypes.object,
    onSearchClick: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    source: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.func
    ]),
    options: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.func
    ])
  }

  /**
  *
  * @desc -
  * @param {Object} props -
  * @return {void}
  *
  **/
  constructor(props) {
    super(props);

    this.attachClassVariables();
  }

  //this.state variables for render change
  state = {};


  /**
  *
  * @desc -
  * @return {void}
  *
  **/
  componentDidMount() {
    this.updateAutocomplete();
    this.disableEnterFromSubmitting();
  }

  /**
   *
   * @desc -
   *
   * @return {void}
   *
   **/
  componentWillReceiveProps({options, value}) {
    if(this.props.options !== options) {
      $(this.selector).autocomplete('option', 'source', options);
    }
    if(value !== this.props.value || !util.isUndefined(value)) {
      this.setState({value});
    }
  }

  /**
  *
  * @desc -
  * @return {void}
  *
  **/
  componentDidUpdate() {
    this.updateAutocomplete();
  }

  /**
  *
  * @desc -
  * @return {void}
  *
  **/
  disableEnterFromSubmitting() {
    const node = ReactDOM.findDOMNode(this.refs.autocomplete);

    // Evergreen event listener || IE8 event listener
    const addEvent = node.addEventListener || node.attachEvent;
    const boundaddEvent = addEvent.bind(node);
    boundaddEvent('keypress', this.handleKeyPress, false);
  }

  /**
  *
  * @desc -
  * @return {void}
  *
  **/
  attachClassVariables() {
    this.selector = '#' + (this.props.id || this.props.inputProps.id);
  }


  /**
  *
  * @desc - [Enter] should not submit and reload the page.
  * @param {Event} event -
  * @return {void}
  *
  **/
  handleKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  /**
  *
  * @desc - Lets check here if we want the search to go through
  *
  **/
  //autocompleteSearch(request, response){}

  /**
  *
  * @desc - Lets check here if we want the search to go through
  * @param {Object} event -
  * @return {void}
  **/
  autocompleteSelectOption = (event) => {
    //Check for a min length to proceed
    if(event.target.value.length >= this.props.minLength) {
      this.props.onChange(event);
    }
  }

  /**
  *
  * @desc - When the user selects an option from the dropdown that appears
  * @param {Object} evt -
  * @param {Object} ui -
  * @return {void}
  *
  **/
  onOptionSelect = (evt, ui) => {
    this.setState({value: ui.item.value}, () =>{
      this.props.onSearchClick(evt, ui.item);
    });
  }

  /**
  *
  * @desc - Every time the user hits a button
  * @param {Object} event -
  * @return {void}
  *
  **/
  onKeyPress = (event) => {
    event.persist();
    this.setState({value: event.target.value}, () => this.props.onChange(event));
  }


  /**
  *
  * @desc -
  * @return {void}
  *
  **/
  updateAutocomplete() {
    $(this.selector).autocomplete({
      source: this.props.source || this.props.options,
      search: this.autocompleteSelectOption,
      minLength: this.props.minLength,
      ...this.props.autoCompleteUIOptions,
      select: this.onOptionSelect
    });
  }

  /**
   *
   * @desc - Makes sure we have a valid value
   * @param {Any} - value
   * @return {Any} value
   *
   **/
  getValue({value = this.state.value, propsValue = this.props.value} = {}) {
    value = !util.isUndefined(value) ? value : propsValue || '';
    return value;
  }

  /**
   *
   * @desc - Reset the options
   * @return {void}
   **/
  render() {
    let {id, autocomplete_css, input_css, placeholder, name, minLength,
      inputProps = {}} = this.props;
    let value = this.getValue();

    return(
      <div className={autocomplete_css}>
        <input {...{id, minLength, value, placeholder, name}} required
          className={input_css} {...inputProps} onChange={this.onKeyPress}
          ref="autocomplete" />
      </div>
    );
  }
}
