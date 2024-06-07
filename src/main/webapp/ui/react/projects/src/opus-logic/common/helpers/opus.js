import {format} from 'util';

/************************************************************************
* @desc - Operations dealing specifically with Opus configured data
*
************************************************************************/

/**
*
* @desc - Takes in an object of arguments and sets the class variable to it i.e.
*  Object.assign(this, {key: value}) -> this.key = value
* @param {Object} args - key-value pair of arguments
* @return {void}
*
**/
export function setClassData({...args} = {}) {
  for(let key in args) {
    this[key] = args[key];
  }
}

/**
*
* @desc - Is a valid number. Returns false for null, undefined, '' and invalid
*   numbers
* @param {Object} number - number to be tested
* @return {Bool} - returns if its a valid #
*
**/
export const isNumber = (number) => !isNaN(parseFloat(number)) && !isNaN(number);


/**
 *
 * @name formatDataTablesUrl
 * @desc - returns formatted url for specific data for DataTable. Moved into Opus
 *   super class
 * @param {String} suffix -
 * @param {String} access_token -
 * @param - grouperPathText, access_token_key
 * @returns {String} - reformatted string
 *
 */
export function formatDataTablesUrl(suffix, access_token, {grouperPathText,
  access_token_key = 'access_token', addGrouper = false, grouper_key =
  'grouperPathText'} = {}) {
  let formatted_grouperPathText = encodeURIComponent(grouperPathText);
  let grouper_arg = addGrouper ? `&${grouper_key}=${formatted_grouperPathText}`
    : '';
  return format(`%s?${access_token_key}=%s%s`, suffix, access_token, grouper_arg);
}

/**
 *
 * @name reformatToMoneyDisplayValue
 * @desc - turns value into comma separated string with '$'
 * @param {String} value - value to reformat
 * @returns {String} - reformatted string
 *
 */
export function reformatToMoneyDisplayValue(value) {
  let returnValue;
  if(value!==null && value!==undefined && value!==''){
    returnValue = `$${value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
  }
  return returnValue;
}

/**
 *
 * @name reformatToMoneyDisplayValueExcludeDecimalPlaces
 * @desc - turns value into comma separated string with '$'
 * @param {String} value - value to reformat
 * @returns {String} - reformatted string
 *
 */
export function reformatToMoneyDisplayValueExcludeDecimalPlaces(value){
  value += '';
  var x = value.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  x1 = `$${x1.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
  return x1 + x2;
}


/**
*
* @desc - Get dept, division, school, if its not in
* @param {Object} deptText - whole string to choose dept, school, division from
* @param {Object} default_dept_text -
* @return {String} shortened_name - one of the three
*
**/
export function getShortenedDeptCodeText(deptText = '', default_dept_text = '') {
  let newDeptText = deptText || default_dept_text;//takes care of nulls
  let [school = '', division = '', dept = ''] = newDeptText.split(',');
  let shortened_name = this.getValidAcademicName(dept, school, division);

  return shortened_name.trim();
}


/**
*
* @desc - Get dept, division, school, if its not in invalid
* @param {Object} dept - whole string to choose dept, school, division from
* @param {Object} school - whole string to choose dept, school, division from
* @param {Object} division - whole string to choose dept, school, division from
* @param {Object} deptText - whole string to choose dept, school, division from
* @return {String} shortened_name - one of the three
*
**/
export function getValidAcademicNameSafe(dept, school, division, {invalid =
  {'N/A': true, null: true, '': true}} = {}) {
  let shortened_name = dept.trim() in invalid ? division.trim() in invalid
    ? school : division : dept;

  return shortened_name;
}

/**
*
* @desc - Get dept, division, school, if its not in invalid
* @param {Object} dept - whole string to choose dept, school, division from
* @param {Object} school - whole string to choose dept, school, division from
* @param {Object} division - whole string to choose dept, school, division from
* @return {String} shortened_name - one of the three
*
**/
export function getValidAcademicName(dept = '', school = '', division = '') {
  let shortened_name = this.getValidAcademicNameSafe(dept || '', school || '',
    division || '');

  return shortened_name;
}
