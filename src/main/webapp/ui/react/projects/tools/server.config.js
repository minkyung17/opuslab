let SERVER_PORT = 3006;
let host = 'http://localhost';

let constants = {
  host,
  SERVER_PORT,
  API_PORT: 8080,
  serverUrl: `${host}:${SERVER_PORT}`,
  access_token_key: 'access_token',
  adminData_key: 'adminData',
  globalData_key: 'globalData',
  restDataUrl: '/opusWeb/rest/common/call',
  restDataArrayIndexes: {
    access_token: 0,
    adminData: 1
  },
  uclaLogon: null,
  env: 'http://localhost',
  testUID: '180248676',
  loggedInUserDataUrl: '/restServices/rest/access/getLoggedInUserData',
  applicationDataUrl: '/restServices/rest/activecase/getApplicationData',
  accessTokenUrl: '/restServices/oauth/token',
  accessTokenArgs: {
    grant_type: 'password',
    client_id: 'nCadre',
    client_secret: 'r3neG@d3',
    username: 'valkyrie',
    password: 'Fuhrer2'
  }
};


export default constants;
