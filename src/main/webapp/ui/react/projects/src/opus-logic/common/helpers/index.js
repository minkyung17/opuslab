/**
 * Created by leonaburime on 7/5/16.
 **/
import axios from 'axios';
import {uniqueId, get} from 'lodash';

/**
 *
 * @name fetchJson()
 *
 * @desc - Fetches url and extract and returns the JSON
 * @param url
 * @returns {Promise}
 *
 **/
export async function fetchJson(url, params = {}) {
  let {data} = await axios.get(url, {params});
  return data;
}
export let getJson = fetchJson;

/**
 *
 * postJson()
 *
 * @desc - Posts json to url
 * @param {String} - url
 * @param {Object} - json
 * @returns {Promise}
 *
 */
export async function postJson(url, args = {}, options = {}) {
  let {data} = await axios.post(url, {
    headers: {
      //'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: args,
    ...options
  });
  return data;
}


/**
 *
 * postJson()
 *
 * @desc - Posts json to url
 * @param {String} - url
 * @param {Object} - json
 * @returns {Promise}
 *
 */
export async function postJsonNoHeaders(url, args = {}, options = {}) {
  let {data} = await axios.post(url, {
    data: args,
    ...options
  });
  return data;
}

/**
 *
 * postJson()
 *
 * @desc - Posts json to url
 * @param {String} - url
 * @param {Object} - json
 * @returns {Promise}
 */
export function deleteJson(url, params = {}) {
  return axios.delete(url, {
    params,
    headers: {
      //'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

/**
 *
 * @desc - returns a unique id prefixed by a string if sent to this
 *   function i.e. getUniqueId('check') == 'check1'
 * @param {String} prefix - optional prefix to add
 * @returns {String} - unique id
 *
 **/
export function getUniqueId(prefix = '') {
  return uniqueId(prefix);
}

/**
 *
 * @desc - Parses and returns url args
 * @param {Object} url_args - strings with the url
 * @return {Object} - url arguments in object form
 */
export function getUrlArgs(url_args = location.search.substring(1)) {
  let results = null;
  try{
    results = JSON.parse('{"' + decodeURI(url_args).replace(/"/g,
      '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }catch(e) {
    results = {};
  }

  return results;
}

/**
 *
 * @desc - http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 * @param {Array} a- array to transpose
 * @return {Array} - transposed array
 *
 */
export function cloneObject(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}


/**
 *
 * @desc
 * @param {String} str -
 * @return {String} args -
 * @return {String} string
 *
 **/
export function parseAPIPath(str, ...args) {
  let i = 0;
  let string = str.replace(/%s/g, () => {
    return args[i++];
  });
  return string;
}

/**
 * @desc - Takes an array of names, looks for those names in the object via
 *  the path taken from apiPaths
 * @param {Array} variable_names - Names of variables to retrieve from object
 * @param {Object} object - Object that holds the values
 * @param {Object} apiPaths - key value pair of names to paths
 * @return {Object} -
 *
 **/
export function getDataFromPathsInObject(variable_names = [], object = {}, apiPaths = {}) {
  let results = {};
  for(let name of variable_names) {
    results[name] = get(object, apiPaths[name]);
  }

  return results;
}


/**
 *
 * @desc - Reset the tooltips
 * @param {String} value - value to be rounded
 * @return {String} - number thats numerized and rounded
 *
 */
export function roundHundred(value) {
  let rounded = Number(value);
  return Math.round(rounded / 100) * 100;
}


/**
 *
 * @desc -
 * @param - {String} value - value to be rounded
 */
export function formatMoney(n, toFixed = 2) {
  return n ? n.toFixed(toFixed).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : n;
}

/**
 *
 * @desc -
 * @param {String} x - value to be rounded
 * @return {String} - rounded value
 *
 **/
export function formatMoneyHundreds(x) {
  let round = roundHundred(x);
  return round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 *
 * @desc - Parses and returns url args
 * @param {Object} url_args - strings with the url
 * @return {Object} - url arguments in object form
 *
 **/
export function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err);
}

/**
 *
 * @desc - Parses and returns url args
 * @param {Object} url_args - strings with the url
 * @return {Object} - url arguments in object form
 *
 */
export function rearrangeDate(date = '', split = '-', join = '/') {
  if(!date) return '';

  let [year, month, day] = date.split(split);
  return [month, day, year].join(join);
}

/**
 *
 * @desc - Zero should show, Undefined or null should not
 * @param value
 *
 * @return {Bool}
 *
 **/
export function isUndefined(value) {
  return (value === undefined);
}

/**
 *
 * @desc - Zero should show, Undefined or null should not
 * @param value
 *
 * @return {Bool}
 *
 **/
export function isUndefinedOrNull(value) {
  return (value == undefined || value == null) ? true : false;
}



/**
 *
 * @desc - Turns json object to url args
 * @param {Object} data - data to be serializd
 * @param {Object} join -
 * @return {Object} - url arguments in object form
 */
export function jsonToUrlArgs(data, join = '&') {
  return Object.keys(data).map((k) => {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  }).join(join);
}

/**
 * @desc - Made this so I dont have to see the syntax warning for console.log everywhere
 * @param {String} message -
 * @return {String} -
 **/
export function print(...args) {
  console.log(...args);
}


/**
 *
 * @desc -
 * @param {Object} data - data to be serializd
 * @param {Object} join -
 * @return {Object} -
 */
export function detectBrowser() {
  // Opera 8.0+
  let isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera
    || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  let isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  let isSafari = /constructor/i.test(window.HTMLElement) || (function (p)
    { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari']
    || window.safari.pushNotification);

  // Internet Explorer 6-11
  let isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  let isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1+
  let isChrome = !!window.chrome && !!window.chrome.webstore;

  // Blink engine detection
  let isBlink = (isChrome || isOpera) && !!window.CSS;

  return {isOpera, isSafari, isFirefox, isIE, isEdge, isChrome, isBlink};
}

/**
 *
 * @desc - >IE 10 doesnt support dataset which is causing problems
 *  extracting needed data
 * @param {Object} domElem -
 * @param {String} attribute - attribute
 * @param {Object} data_prefix - html data attribute
 * @return {Object} -
 *
 **/
export function getDataSetValue(domElem, attribute,
  {data_prefix = 'data-'} = {}) {
  return domElem.getAttribute(`${data_prefix}-${attribute}`);
}


/**
 *
 * @desc -
 * @param {Object} domElem -
 * @param {String} attribute -
 * @param {Object} -
 *
 *
 **/
export function DEBUG(message, {...args} = {}) {
  switch(window.__ENV){
  case '':
    print(message);
  }
}

export * from './opus';
export * from './html-operations';
export * from './jquery-operations';
export * from './collection-operations';
