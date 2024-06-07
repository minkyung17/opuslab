

/******************************************************************************
 *
 * @desc - Class that takes care of all the operations to manipulate
 *  and transform dataTableConfiguration
 *
 ******************************************************************************/
export default class DataTablConfigOps {

  dataTableConfiguration = null;
  startingDataTableConfiguration = null;

  /**
   *
   * @desc - Set datatable
   * @param {Object} dataTableConfiguration - datatable to use
   *
   **/
  constructor(dataTableConfiguration) {
    if(dataTableConfiguration) {
      this.setDataTableConfiguration(dataTableConfiguration);
    }else {
      console.error(`Please use "setDataTableConfiguration" to
        set datatable config file`);
    }
  }

  /**
   *
   * @desc - Set datatable
   * @param {Object} dataTableConfiguration - datatable to use
   *
   **/
  setDataTableConfiguration(dataTableConfiguration) {
    this.dataTableConfiguration = dataTableConfiguration;
  }



}
