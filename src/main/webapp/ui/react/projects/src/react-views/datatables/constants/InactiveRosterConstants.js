import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
const inactiveRosterConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 5
  }
};

export const config = deepmerge(defaultFixedDataTableState, inactiveRosterConfig);
