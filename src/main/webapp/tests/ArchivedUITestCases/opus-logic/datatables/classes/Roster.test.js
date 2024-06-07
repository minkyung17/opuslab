import {assert} from 'chai';
import {pick, map, every} from 'lodash';

//My imports
import '../../../test-utility/setup-tests';
import * as tableTests from './DataTable.common';
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import Roster from '../../../../opus-logic/datatables/classes/Roster';


describe('RosterLogic Logic Class', () => {
  let getRowDataFromCache = false;
  let dataTableConfiguration = null;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let RosterLogic = null;
  let apiResults = null;
  let rowData = null;
  let config_name = 'roster';
  let api_cache_name = 'rosterRowData';
  let programTestData = {};

  /**
   *
   * @desc - Lets get access token, globalData, and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getCacheDataAndCommonCallData(api_cache_name);
    apiResults = data.apiResults;
    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    let args = {config_name, adminData, globalData, access_token};
    RosterLogic = new Roster(args);
    dataTableConfiguration = RosterLogic.dataTableConfiguration;
    getRowDataFromCache = !!apiResults;
    done();
  });

  it('ensures access_token & adminData are in RosterLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(RosterLogic, keys);
  });

  it('filterAPITableData', ()=>{

  });


  it('ensures the urlParameters has requisite keys', ()=>{
    let urlParameters = RosterLogic.getDataUrlParameters();
    assert.isString(urlParameters.access_token);
    assert.isString(urlParameters.grouperPathText);
    assert.equal(urlParameters.fewRows, 'N');
    assert.isString(urlParameters.typeOfReq);
    assert.containsAllKeys(urlParameters, ['access_token', 'grouperPathText',
      'fewRows', 'typeOfReq']);
  });

  //Common tests
  it('gets results from API', async (done) => {
    apiResults = await tableTests.getAPIResults(RosterLogic,
      {programTestData, getRowDataFromCache, api_cache_name, apiResults});
    done();
  });

  it('ensures the extracted Roster\'s rowData is Correct', () => {
    rowData = RosterLogic.extractRowDataFromServerResults(apiResults,
      {dataTableConfiguration});

    assert.isArray(rowData);
    assert(rowData.length > 0, 'rowData from server is blank');
    // assert.containsAllKeys(rowData[0], ['appointeeInfo', 'pendingCases',
    //   'academicHierarchyInfo', 'appointmentInfo']);
  });

  it('ensures "configureAPITableData" has necessary "columnKeys" when omitting ' +
      '"edit" and "delete"', () => {
    rowData = RosterLogic.configureAPITableData(rowData);
    let {columnKeys} = dataTableConfiguration;
    assert.containsAllKeys(rowData[0], columnKeys);
  });

  it('ensures "configureAPITableData" has "affirmativeSearch" variable names in rowData', () => {
    let {affirmativeSearch, categories} = dataTableConfiguration.searchCategories;
    let affirmativeSearchFields = pick(categories, affirmativeSearch);
    programTestData.affirmativeSearchNames = map(affirmativeSearchFields, (e) => e.name);
    assert.containsAllKeys(rowData[0], programTestData.affirmativeSearchNames);
  });


  it('ensures "affirmativeSearch" variable names in rowData are all booleans', () => {
    let {affirmativeSearchNames} = programTestData;
    for(let name of affirmativeSearchNames) {
      assert.isBoolean(rowData[0][name]);
    }
  });

  it('ensures "setImagePathForPendingCases_UI" sets imagePaths for rows w/ ' +
      'pendingCases', () => {
    let {columnConfiguration} = dataTableConfiguration;
    for(let row of rowData) {
      if(row.caseInfo.pendingCases) {
        assert.equal(row.imagePath, columnConfiguration.pendingCases.image);
      }
    }
  });

  it('ensures "addProfileLinkToRowData" correctly sets link to profile" ', () => {
    let {profileLink} = dataTableConfiguration;
    assert.equal(profileLink, '/opusWeb/ui/admin/profile.shtml?id=');
    for(let {link, appointeeInfo: {opusPersonId}} of rowData) {
      assert.equal(profileLink + opusPersonId, link);
    }
  });


  it('ensures "updateOutsideFiltersInDatatableConfig" sets name and value(always true) in ' +
      ' outsideFilters in datatableConfig filters', () => {
    RosterLogic.dataTableConfiguration.dataColumnFilters.outsideFilters = {};
    let {dataColumnFilters: {outsideFilters}} = RosterLogic.dataTableConfiguration;

    RosterLogic.updateOutsideFiltersInDatatableConfig({name: 'tenure', value: true});
    RosterLogic.updateOutsideFiltersInDatatableConfig({name: 'academicSenate', value: true});
    RosterLogic.updateOutsideFiltersInDatatableConfig({name: 'appointmentSetFlag', value: true});
    assert.equal(outsideFilters.tenure, true);
    assert.equal(outsideFilters.academicSenate, true);
    assert.equal(outsideFilters.appointmentSetFlag, true);
  });

  it('ensures "updateOutsideFiltersInDatatableConfig" deletes "name" from ' +
      ' outsideFilters in datatableConfig filters', () => {
    RosterLogic.dataTableConfiguration.dataColumnFilters.outsideFilters = {};
    let {dataColumnFilters: {outsideFilters}} = RosterLogic.dataTableConfiguration;

    RosterLogic.updateOutsideFiltersInDatatableConfig({name: 'tenure', value: false});
    RosterLogic.updateOutsideFiltersInDatatableConfig({name: 'academicSenate', value: false});
    assert.isUndefined(outsideFilters.tenure);
    assert.isUndefined(outsideFilters.academicSenate);
  });


  it('ensures "filterRowDataByFlags" correctly filters from "affirmativeSearchKeys"' +
      '["senate", "tenured", "emeriti", "unit_18", "hscp", "appointmentSetFlag"] ', () => {
    let {affirmativeSearch, categories} = dataTableConfiguration.searchCategories;

    //Iterate through keys and filter data based on each key
    for(let key of affirmativeSearch) {
      let {name} = categories[key];
      //Update filter
      RosterLogic.updateOutsideFiltersInDatatableConfig({name: key, value: true});
      let filteredRosterData = RosterLogic.filterRowDataByFlags(rowData);

      //All values in array should be true
      let valueArray = filteredRosterData.map(e => e[name]);
      //Assert every value in "valueArray" is true
      assert(every(valueArray, (v)=> v === true) === true,
        `Please check as filteredRowdata for ${key} do not all equal true`);

      //Delete filter
      RosterLogic.updateOutsideFiltersInDatatableConfig({name: key, value: false});
    }
  });


  it('ensures "filterRowDataByFlags" correctly filters from "exclusionarySearch"' +
      '["non-senate", "non-tenured", "emeriti", "unit_18", "hscp"] ', () => {
    let {exclusionarySearch, categories} = dataTableConfiguration.searchCategories;

    //Iterate through keys and filter data based on each key
    for(let key of exclusionarySearch) {
      let {alternateFlag: name} = categories[key];
      let rowDataKey = categories[name].name;
      //Update filter
      RosterLogic.updateOutsideFiltersInDatatableConfig({name: key, value: true});
      let filteredRosterData = RosterLogic.filterRowDataByFlags(rowData);

      //All values in array should be true
      let valueArray = filteredRosterData.map(e => e[rowDataKey]);
      //Assert every value in "valueArray" is true
      assert(every(valueArray, (v)=> v === false) === true,
        `Please check as filteredRowdata for ${rowDataKey} do not all equal false`);

      //Delete filter
      RosterLogic.updateOutsideFiltersInDatatableConfig({name: key, value: false});
    }
  });

  it('reconcileRowValuesFromServerData', () => {});
});
