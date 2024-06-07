import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for Admin Comp Page
 *
 *
**/
export const adminCompViewConfig = {
  heightPixelDiff: 2000,
  tableConfiguration: {
    page_table_height_offset: 40,
    // rowHeight: 130,
  }
};

export const config = deepmerge(defaultFixedDataTableState, adminCompViewConfig);
