/**
 * Created by leonaburime on 7/8/16.
 */


export const columnOptions = {
  displayName: 'displayName',
  fixed: 'fixed',
  selectOptions: 'selectOptions',
  width: 'columnWidth',
  dataName: 'name'
};

export const cssSortClassNames = {
  asc: ' sorting_asc sort ',
  desc: ' sorting_desc sort ',
  none: ' sorting_none sort '
};

export const defaultTableConfiguration = {
  rowHeight: 50,
  rowsCount: 5,
  width: 1500,
  height: 500,
  headerHeight: 100
};

export const defaultFixedDataTableState = {
  wasDataFiltered: false,
  wasTableScrolled: false,
  dynamicTableWidth: 1250,
  dynamicTableHeight: 150,
  widthScreenPercentage: 0.965,
  widthPixelDiff: 0,
  heightScreenPercentage: 0.5,
  heightPixelDiff: 300,
  scrollRowStart: 0,
  scrollRowFinish: '...',
  tableConfiguration: defaultTableConfiguration,
  columnShape: {
    columnWidth: 250
  }
};

export const tableOptions = {
  allOptions: 'All',
  minimum_datatable_height: 260 //px
};


export const cssConstants = {
  standard_button: 'btn btn-sm btn-gray table-top',
  select_tag: 'form-control'
};



export const constants = {
  tableOptions,
  cssConstants,
  columnOptions,
  defaultFixedDataTableState
};


/**
 *
 * @desc - Mirror values of certain keys. Fill in the column defaults and
 *   select options
 * @param json
 * @param dataTableConfiguration
 * @return
 *
 **/
export function mapColumnKeysInRowData(row = {}, columnMap = columnKeysMap) {
  for(let key in columnMap) {
    let value = columnMap[key];

    //If row['name'] is blank and row['fullName'] isnt then assign row['name'] = row['fullName']
    if(!row[value] && row[key]) {
      row[value] = row[key];
    }
  }
}

/**
 * configureTableColumnDefaultsAndOptions - NOT BEING USED RIGHT NOW
 *
 * @desc - Fill in the column defaults and select options
 * @param json
 * @param dataTableConfiguration
 * @return {Object}
 *
 **/
export function configureTableColumnDefaultsAndOptions(dataTableConfiguration,
  selectOptions = {}) {
    //Set the table configuration defaults
  dataTableConfiguration.tableConfiguration = {
    ...defaultFixedDataTableState.tableConfiguration,
    ...dataTableConfiguration.tableConfiguration
  };

  //Set the column configuration defaults
  dataTableConfiguration.columnKeys.map(columnName => {
    //Add default options for data in column
    let config = {
      ...dataTableConfiguration.columnConfigurationDefaults,
      ...dataTableConfiguration.columnConfiguration[columnName]
    };

    //Add select filter list if there is one
    config.selectOptions = config.selectOptions ||
          selectOptions[config.selectOptionsName] || null;
    dataTableConfiguration.columnConfiguration[columnName] = config;
  });

  return dataTableConfiguration;
}


/**
 * defaultEditFieldValues -
 *
 * @desc - Will default the 'fields' value in the datatable configuration files
 * @param {Object} dataTableConfig - Datatable Configuration file
 *
 **/
export function defaultEditFieldValues(dataTableConfig,
  column_config_names = 'columnConfiguration') {
  for(let key in dataTableConfig[column_config_names]) {
    let obj = dataTableConfig[column_config_names][key];
    if(obj.fieldEdit) {
      let extra_fields = {
        description: obj.description,
        displayName: obj.displayName,
        disabled: obj.disabled || false,
        name: key
      };
      obj.fieldEdit = {...{}, ...extra_fields, ...obj.fieldEdit};
    }
  }
}
