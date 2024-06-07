import axios from 'axios';
import {hash as rsvpHash} from 'rsvp';

export {fetchJson} from '../../opus-logic/common/helpers/';
import serverConfig from '../../../tools/server.config';


export async function getData({config = serverConfig, url} = {}) {
  let {env, SERVER_PORT} = config;
  let access_token_url = `${env}:${SERVER_PORT}/${url}`;

  let results = await axios.get(access_token_url);
  let {data} = results;

  return data;
}

/**
*
* @desc - Gets access_token
* @param {Object} config -  Server Configuration
* @return {Promise} - object promise with access_token and adminData
*
**/
export async function getAccessToken({config = serverConfig} = {}) {
  let {access_token_key} = config;
  let access_token = await getData({url: access_token_key});

  return access_token;
}


/**
*
* @desc - Gets access_token
* @param - config: Server Configuration
* @return {Promise} - object promise with access_token and adminData
*
**/
export async function getGlobalData({config = serverConfig} = {}) {
  let {globalData_key} = config;
  let globalData = await getData({url: globalData_key});

  return globalData;
}

/**
 *
 * @desc - Gets access_token
 * @param - config: Server Configuration
 * @return {Promise} - object promise with access_token and adminData
 *
 **/
export async function getAdminData({config = serverConfig} = {}) {
  let {adminData_key} = config;
  let adminData = await getData({url: adminData_key});

  return adminData;
}

/**
 *
 * @desc - May want to post data to the cache for later
 * @param -  data
 * @param {String} cache_location - Address at which to save the data in the cache.
 *  Must NOT be prefixed with '/'
 * @return {String} success -
 *
 **/
export async function postAPIDataToCache(data, cache_location, {cache_prefix = 'cache',
  config = serverConfig} = {}) {
  if(!cache_location) {
    throw Error('No Valid Server url to save data to');
  }

  let {serverUrl} = config;
  let url = `${serverUrl}/${cache_prefix}/${cache_location}`;
  let success = await axios.post(url, {data});
  return success;
}


/**
 *
 * @desc - Get data from the cache as the call seems to be takikng very long
 * @param {String} cache_location - Address at which to get the data from the cache.
 *  Must NOT be prefixed with '/'
 * @return {String} success -
 *
 **/
export async function getAPIDataFromCache(cache_location, {cache_prefix = 'cache',
  config = serverConfig} = {}) {
  if(!cache_location) {
    throw Error('No Valid Server url to save data to');
  }

  let {serverUrl} = config;
  let url = `${serverUrl}/${cache_prefix}/${cache_location}`;
  let results = await axios.get(url);
  return results.data;
}


/**
 *
 * @desc - guess
 *
 **/
export async function getAccessTokenAdminDataGlobalData() {
  let data = await rsvpHash({
    adminData: getAdminData(),
    globalData: getGlobalData(),
    access_token: getAccessToken()
  });

  return data;
}

/**
 *
 * @desc - guess
 *
 **/
export async function getAccessTokenAdminData() {
  let data = await rsvpHash({
    adminData: getAdminData(),
    access_token: getAccessToken()
  });

  return data;
}


/**
 *
 * @desc - guess
 *
 **/
export async function getCacheDataAndCommonCallData(api_cache_name, {
  addGlobalData = true} = {}) {
  let dataHash = {
    adminData: getAdminData(),
    access_token: getAccessToken(),
    apiResults: getAPIDataFromCache(api_cache_name)
  };

  if(addGlobalData) {
    dataHash.globalData = getGlobalData();
  }
  let data = await rsvpHash(dataHash);
  return data;
}
