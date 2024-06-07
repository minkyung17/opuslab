import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for ActiveCases Page
 *
 *
**/
export const salaryCompensationViewConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    //jira opus-5673 change height constant from 5 to 100
    page_table_height_offset: 100
  }
};

export const config = deepmerge(defaultFixedDataTableState, salaryCompensationViewConfig);
