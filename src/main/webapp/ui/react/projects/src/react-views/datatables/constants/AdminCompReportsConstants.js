import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for Admin Comp Reports Page
 *
 *
**/
export const adminCompReportsViewConfig = {
  heightPixelDiff: 2000,
  tableConfiguration: {
    page_table_height_offset: 40,
    // rowHeight: 115,
  }
};

export const config = deepmerge(defaultFixedDataTableState, adminCompReportsViewConfig);
