
export const UPDATE_DATATABLE_CONFIG = 'UPDATE_DATATABLE_CONFIG';
export function onUpdateDatatableConfiguration(dataTableConfiguration) {
  return {
    type: UPDATE_DATATABLE_CONFIG,
    dataTableConfiguration
  };
}


export const UPDATE_ORIGINAL_ROWDATA = 'UPDATE_ORIGINAL_ROWDATA';
export function onUpdateOriginalRowData(originalRowData) {
  return {
    type: UPDATE_ORIGINAL_ROWDATA,
    originalRowData
  };
}


export const UPDATE_FORMATTED_ROWDATA = 'UPDATE_FORMATTED_ROWDATA';
export function onUpdateFormattedRowData(formattedRowData) {
  return {
    type: UPDATE_FORMATTED_ROWDATA,
    formattedRowData
  };
}


export const UPDATE_FILTERED_ROWDATA = 'UPDATE_FILTERED_ROWDATA';
export function onUpdateFilteredRowData(filteredRowData) {
  return {
    type: UPDATE_FILTERED_ROWDATA,
    filteredRowData
  };
}
