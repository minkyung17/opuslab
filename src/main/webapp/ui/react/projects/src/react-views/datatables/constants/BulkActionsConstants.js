import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for Bulk Actions
 *
 *
**/
export const bulkActionsViewConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 150
  }
};

export const config = deepmerge(defaultFixedDataTableState, bulkActionsViewConfig);
