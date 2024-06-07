import deepmerge from 'deepmerge';
import {columnOptions} from './FieldDataConstants';
import {columnViewOptions} from './ColumnViewConstants';
import {dataViewTypes} from './DatatableConstants';

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
export const configTemplate = {
  type: 'dataTable',
  exportToExcelBaseUrl: '/restServices/rest/eligibles/downloadCSV',
  grouperPathText: 'eligibility',
  url: '/restServices/rest/profile/rosterData',
  columnFilterKey: 'eligibleFilterMap',
  permissionNames: {},
  dataRowName: 'data',
  visibleColumnKey: 'visible',
  dataColumnFilters: {
    columnSortOrder: {},
    columnStringMatch: {},
    columnValueOptions: {},
    simpleFilters: {},
    outsideFilters: {}
  },
  omitUIColumns: ['edit', 'reopen', 'delete', 'merge'],
  columnViewConfiguration: {},
  columnViewConfigurationDefaults: {},
  columnConfigurationDefaults: {
    width: 200,
    fixed: false, //If column will always show when sliding left to right,
    optionsListName: null, //Name in returned JSON data that we will query for filtering
    valueOptions: null, //If we want to create our own select filters
    visible: false, //Will this be a column automatically shown on start
    viewType: dataViewTypes.text, //Is it a regular text cell, image cell, etc...
    descriptionTag: false, //Should we have a pop up description
    descriptionImage: null, //What is the image for the description? ?, ! or something else
    textSearch: false,
    sortable: true //Attach an arrow to sort the column alphabetically or numerically
  },
  columnConfiguration: {}
};

/**
 * mergeKeys()
 *
 * @desc - Will merge objects together by keynames
 * @param {Array} keys - list of key names to be used for object overlay
 * @param {Object} primaryTemplate - Object to be populated
 * @param {Object} foundationConfig - This will add key-value pairs into
 *   each individual object created in the for loop
 * @param {Object} defaultForEachEntry - Default values for each object
 * @return {Object} baseTemplate - holds the 'default' values to be
 *              used for object population
 *
 **/
export function mergeKeys(keys = [], primaryTemplate = {}, foundationConfig = {},
  defaultForEachEntry = {}) {
  let mergedKeys = {};

  for(let key of keys) {
    mergedKeys[key] = {
      ...defaultForEachEntry,
      ...foundationConfig[key],
      ...primaryTemplate[key]
    };
  }

  return mergedKeys;
}


export function createConfigFromTemplate(primaryConfig = {}, baseColumnOptions =
  columnOptions, foundationTemplate = configTemplate) {
  //Default values that will fill in the gaps for the objects unless theyre overridden
  primaryConfig.columnConfigurationDefaults = {...foundationTemplate.columnConfigurationDefaults,
    ...primaryConfig.columnConfigurationDefaults};

  primaryConfig.columnViewConfigurationDefaults = {
    ...foundationTemplate.columnViewConfigurationDefaults,
    ...primaryConfig.columnViewConfigurationDefaults};

  //Generate new columns from keynames in 'columnKeys' and merge with with the foundationTemplate
  //and any defaults
  let {columnConfigurationDefaults, columnViewConfigurationDefaults, columnConfiguration,
    columnKeys, columnViewConfiguration} = primaryConfig;
  let mergedColumnConfiguration = mergeKeys(columnKeys, columnConfiguration,
    baseColumnOptions, columnConfigurationDefaults);

  //Sets config for view layer
  let mergedColumnViewConfiguration = mergeKeys(columnKeys, columnViewConfiguration,
    columnViewOptions, columnViewConfigurationDefaults);


  //Now lets combine them into one config, especially our new columnConfiguration
  let newBaseConfig = {
    columnConfiguration: mergedColumnConfiguration,
    columnViewConfiguration: mergedColumnViewConfiguration
  };

  newBaseConfig = deepmerge.all([foundationTemplate, primaryConfig, newBaseConfig]);

  return newBaseConfig;
}
