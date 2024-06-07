import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
const opusOnlyConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 100
  }
};

export const config = deepmerge(defaultFixedDataTableState, opusOnlyConfig);
