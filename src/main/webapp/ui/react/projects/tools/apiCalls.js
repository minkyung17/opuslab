import axios from 'axios';

import constants from './server.config';

/**
 * getAccessTokenAndAdminData()
 *
 * @desc - gets access_token and adminData
 * @return {Promise} -
 *
 **/
export async function getAccessToken() {
  let {env, accessTokenUrl, API_PORT, accessTokenArgs} = constants;
  let url = `${env}:${API_PORT}${accessTokenUrl}`;

  let promise = axios.get(url, {params: accessTokenArgs});

  promise.catch(e => {
    console.log(e.data);
    throw Error(`\n\nUnable to get access token from ${url} -
      Check connection to VPN! \n ERROR MESSAGE:${e}`);
  });

  let {data} = await promise;
  return data;
}


/**
 * getLoggedInUserData()
 *
 * @desc -
 * @return {Promise} -
 *
 **/
export async function getLoggedInUserData(access_token) {
  let {env, API_PORT, testUID: uid, loggedInUserDataUrl, uclaLogon} = constants;
  let url = `${env}:${API_PORT}${loggedInUserDataUrl}?access_token=${access_token}`;
  let args = {uclaLogon, uid};

  let promise = axios.post(url, args);

  promise.catch(e => {
    console.log(e);
    throw Error(`\n\nUnable to get access token from ${url} -
      Check connection to VPN! \n ERROR MESSAGE:${e}`);
  });

  let {data} = await promise;
  return data;
}


/**
 * getLoggedInUserData()
 *
 * @desc -
 * @return {Promise} -
 *
 **/
export async function getApplicationData(access_token) {
  let {env, API_PORT, applicationDataUrl} = constants;
  let url = `${env}:${API_PORT}${applicationDataUrl}?access_token=${access_token}`;

  let promise = axios.get(url);

  promise.catch(e => {
    console.log(e);
    throw Error(`\n\nUnable to get access token from ${url} -
      Check connection to VPN! \n ERROR MESSAGE:${e}`);
  });

  let {data} = await promise;
  return data;
}


/**
 * getAccessTokenAndAdminData()
 *
 * @desc - gets access_token and adminData
 * @return {Promise} -
 *
 **/
export async function getAccessTokenAdminDataAndGlobalData() {
  let {env, API_PORT, restDataUrl} = constants;
  let url = `${env}:${API_PORT}${restDataUrl}`;

  let promise = axios.get(url);

  promise.catch(e => {
    throw Error(`\n\nUnable to get access token from ${url} -
      Check connection to VPN! \n ERROR MESSAGE:${e}`);
  });

  let data = await promise;
  return data;
}
