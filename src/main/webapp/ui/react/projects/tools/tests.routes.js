import {hash} from 'rsvp';
import {Router} from 'express';
import Cache from 'node-cache';
import * as APICalls from './apiCalls';


let testCache = new Cache();
let quickCache = { cache: {}};
let router = Router();


(async function routerInit() {
  let accessTokenCall = await APICalls.getAccessToken();
  let {access_token} = accessTokenCall;
  let {applicationData, loggedInUser} = await hash({
    applicationData: APICalls.getApplicationData(access_token),
    loggedInUser: APICalls.getLoggedInUserData(access_token)
  });

  //let loggedInUser = await APICalls.getLoggedInUserData(access_token);
  let {adminData} = loggedInUser;
  let {globalData} = applicationData;
  quickCache = Object.assign(quickCache, {access_token, adminData, globalData});

  testCache.set('access_token', access_token);
  testCache.set('adminData', adminData);
  testCache.set('globalData', globalData);
  console.log('Setting adminData, globalData, and access_token');
})();


router.get('/access_token', (req, res) => {
  let access_token = quickCache.access_token || testCache.get('access_token');
  quickCache.access_token = access_token;
  res.send(access_token);
});

router.get('/adminData', (req, res) => {
  let adminData = quickCache.adminData || testCache.get('adminData');
  quickCache.adminData = adminData;
  res.send(adminData);
});

router.get('/globalData', (req, res) => {
  let globalData = quickCache.globalData || testCache.get('globalData');
  quickCache.globalData = globalData;
  res.send(globalData);
});

router.get('/cache/:name', (req, res) => {
  let {name} = req.params;
  let data = quickCache.cache[name] || testCache.get(name);
  res.send(data);
});

router.post('/cache/:name', (req, res) => {
  let {name} = req.params;
  let success = testCache.set(name, req.body.data);
  quickCache.cache[name] = req.body.data;
  res.send(success);
});


export default router;
