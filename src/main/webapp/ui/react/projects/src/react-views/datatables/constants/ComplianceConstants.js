import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 *
 * @desc - Configuration constant for Compliance Page
 *
 *
**/
const complianceReportConfig = {
  heightPixelDiff: 1000,
  tableConfiguration: {
    page_table_height_offset: 30
  }
};

export const config = deepmerge(defaultFixedDataTableState, complianceReportConfig);
