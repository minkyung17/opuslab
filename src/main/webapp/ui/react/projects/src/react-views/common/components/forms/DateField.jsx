import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';

//My imports
import * as util from '../../../../opus-logic/common/helpers/';


/*******************************************************************************
*
* @desc -
*
*******************************************************************************/
export class DateField extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    name: PropTypes.string,
    dataType: PropTypes.string,
    displayName: PropTypes.string,
    descriptionText: PropTypes.string,
    disabled: PropTypes.bool,
    classText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    default_text: PropTypes.string,
    dateFormat: PropTypes.string,
    inputProps: PropTypes.object,
    originalDateFormat: PropTypes.string,
    elementProps: PropTypes.object,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    value: PropTypes.string
  };
  static defaultProps = {
    value: '',
    classText: '',
    inputProps: {},
    disabled: false,
    onBlur: () =>{},
    onChange: () => {},
    default_text: 'N/A',
    dateFormat: 'MM/DD/YYYY',
    minDate: '1900-01-01',
    maxDate: '2100-12-31'
    //originalDateFormat:'YYYY-MM-DD' - Dates come in properly formatted so dont default
  };


  constructor(props = {}) {
    super(props);
    this.attachClassVariables();
  }

  /**
   *
   * @desc -
   * @return {void}
   *
   **/
  componentWillMount() {
    //MUST format the date onstart!
    this.formatDateOnload();
  }

  /**
   *
   * @desc -
   * @param {Object}  - nextProps
   * @return {void}
   *
   **/
  componentWillReceiveProps({value, dataType, ...nextProps}) {
    this.formatDateOnload({value, dataType, ...nextProps});
  }

  //Component imports
  datePatternToRegex = {
    'MM/DD/YYYY': /^\d{2}([.\/-])\d{2}\1\d{4}$/,
    'DD/MM/YYYY': /^\d{2}([.\/-])\d{2}\1\d{4}$/,
    'YYYY/DD/MM': /^\d{4}([.\/-])\d{2}\1\d{2}$/,
    'YYYY/MM/DD': /^\d{4}([.\/-])\d{2}\1\d{2}$/,
    'YYYY-MM-DD': /^\d{4}([.\/-])\d{2}\1\d{2}$/
  };

  /**
   *
   * @desc -
   * @return {void}
   *
   **/
  attachClassVariables() {
    let {value, dateFormat, minDate, maxDate} = this.props;
    let args = {...this.state, value, dateFormat, minDate: moment(minDate),
      maxDate: moment(maxDate)};
    let {isFirefox} = util.detectBrowser();
    //If date lets set that date to the dropdown
    args.datePickerValue = value ? moment(value, dateFormat) : null;

    this.state = args;
    // this.setDatePicker = this.setDatePicker.bind(this);
    // this.handleDatePicker = this.handleDatePicker.bind(this);
    this.nonMozillaArgs = isFirefox ? {} : {showMonthDropdown: true,
      showYearDropdown: true};
  }

  /**
   *
   * @desc - Update the value
   * @param {Event} event -
   * @param {Object} props -
   * @return {void}
   *
   **/
  onChange = (event, props = this.props) => {
    this.props.onChange(event, props);
  }

  /**
   *
   * @desc - Update the value
   * @param {Event} event -
   * @param {Object} props -
   * @return {void}
   *
   **/
  onBlur = (event, props = this.props) => {
    this.props.onBlur(event, props);
  }

  /**
   *
   * @desc - Need to format date for DatePicker
   * @param {Object} - args
   * @return {Bool}
   *
   **/
  formatDateOnload({value: safe_value, originalDateFormat, dateFormat} = this.props) {
    let value = safe_value || '';
    let transformDate = originalDateFormat || dateFormat;
    let regexPattern = this.datePatternToRegex[transformDate];
    if(regexPattern && value.match(regexPattern)) {
      this.setState({value, datePickerValue: moment(value, transformDate)});
    } else {
      this.setState({value, datePickerValue: null});
    }
  }

  /**
   *
   * @desc - Update the value
   * @param {Object} momentValue -
   * @param {Event} event -
   * @return {void}
   *
   **/
  setDatePicker = (momentValue, event = {}) => {
    let {props: {name, name: id}, state: {correctedDateFormat}} = this;
    let value = momentValue ? momentValue.format(correctedDateFormat) : null;
    let isValid = moment(value).isValid();

    if(isValid) {//Update the element
      value = moment(value).format(this.props.dateFormat);
      this.setState({datePickerValue: momentValue, value});
    } else {
      this.setState({datePickerValue: null, value});
    }

    event.target = {...event.target, name, id, value};
    this.props.onChange(event, this.props);
  }

  /**
   *
   * @desc - Update the value
   * @param {Event} event - onChangeRaw event
   * @return {void}
   *
   **/
  handleDatePicker = (event) => {
    this.props.onChange(event, this.props);
  }


  render() {
    let {props, state: {minDate, maxDate}, onBlur} = this;
    let {name, id = name, dateFormat, disabled} = props;
    let args = {id, name, dateFormat, disabled, minDate, maxDate};

    return (
      <DatePicker className=" form-control " {...{onBlur}} {...args}
        dropdownMode="select" onChange={this.setDatePicker} {...this.nonMozillaArgs}
        //onChangeRaw={this.handleDatePicker}
        selected={this.state.datePickerValue}
        //selected={this.props.value}
        disabledKeyboardNavigation scrollableYearDropdown
      />
    );
  }
}
