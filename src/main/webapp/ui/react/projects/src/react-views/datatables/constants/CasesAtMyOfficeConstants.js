import deepmerge from 'deepmerge';
import {defaultFixedDataTableState} from './DatatableConstants';

/**
 * @desc - Configuration constant for ActiveCases Page
 *
**/
export const casesAtMyOfficeConfig = {
  tableConfiguration: {
    page_table_height_offset: 50
  }
};

export const config = deepmerge(defaultFixedDataTableState, casesAtMyOfficeConfig);
