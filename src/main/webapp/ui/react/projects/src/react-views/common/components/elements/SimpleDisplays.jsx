import React from 'react';
import PropTypes from 'prop-types';
import {isPlainObject} from 'lodash';


/**
*
* @desc - Simple UL List
* @param - {Object} props
* @return {JSX} -
*
**/
export const ULSimpleDisplay = ({fields = [], ulProps = {}, liProps = {}}) => {
  let liFields = fields.map(text =>
    <li {...liProps} key={text}>{text}</li>);
  return <ul {...ulProps}> {liFields} </ul>;
};
ULSimpleDisplay.propTypes = {
  ulProps: PropTypes.object,
  liProps: PropTypes.object,
  fields: PropTypes.array.isRequired
};


export class ULDisplay extends React.Component {

  /**
  *
  * @desc - If fields is an object
  * @param {Object} field -
  * @param {Object} props -
  * @return {Array} -
  *
  **/
  getFieldsByObject(fields, props) {
    let results = [];
    let {liSeparator: sep, liProps, keyIsFirst} = props;

    //If I want the key to show first in the li tag
    if(keyIsFirst) {
      for(let key in fields) {
        results.push(<li {...liProps}> {`${key}${sep}${fields[key]}`} </li>);
      }
    }else{
      for(let key in fields) {
        results.push(<li {...liProps}> {`${fields[key]}${sep}${key}`} </li>);
      }
    }

    return results;
  }

  /**
  *
  * @desc -
  * @param - {Object} props
  * @return -
  *
  **/
  getLIFields({plainText, fields, liProps = {}, ...props} = this.props) {
    let results = [];

    if(isPlainObject(fields)) {
      results = this.getFieldsByObject(fields, props);
    }else if(plainText) {
      results = fields.map((text, index) => <li {...liProps} key={index}> {text} </li>);
    }else {
      results = fields.map(({text_key, elementProps = {}, ...data}, index) =>
        <li {...liProps} {...elementProps} key={index}>{data[text_key]}</li>);
    }

    return results;
  }

  render() {
    let {ulProps = {}, ulCss} = this.props;
    let liFields = this.getLIFields();

    return <ul {...ulProps} {...ulCss}> {liFields} </ul>;
  }
}
ULDisplay.propTypes = {
  ulProps: PropTypes.object,
  liProps: PropTypes.object,
  keyIsFirst: PropTypes.bool,
  plainText: PropTypes.bool,
  liSeparator: PropTypes.string,
  ulCss: PropTypes.object,
  field: PropTypes.shape({ //If array, will look like this
    text: PropTypes.string,
    elementProps: PropTypes.object
  }),
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
};
ULDisplay.defaultProps = {
  liSeparator: ':',
  keyIsFirst: true,
  ulCss: {
    className: ' noBullet '
  }
};
