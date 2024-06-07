import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for ActiveCases Page
 *
 *
**/
export const linkPathPositionViewConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 5,
    rowHeight: 150,
  }
};

export const config = deepmerge(defaultFixedDataTableState, linkPathPositionViewConfig);
