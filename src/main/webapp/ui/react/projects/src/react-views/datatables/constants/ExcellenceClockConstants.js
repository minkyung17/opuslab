import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 *
 * @desc - Configuration constant for ActiveCases Page
 *
 *
**/
const excellenceConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 350
  }
};

export const config = deepmerge(defaultFixedDataTableState, excellenceConfig);
