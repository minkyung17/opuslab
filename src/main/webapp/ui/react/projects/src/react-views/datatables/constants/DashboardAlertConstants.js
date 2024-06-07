import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for Eligibility
 *
 *
**/
const dashboardAlertConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 5
  }
};

export const config = deepmerge(defaultFixedDataTableState, dashboardAlertConfig);
