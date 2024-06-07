// import {keyBy, omit} from 'lodash';
import moment from "moment";

import Cases from "./Cases";
// import {postJson, jsonToUrlArgs} from '../../common/helpers/';
// import * as util from '../../common/helpers/';
import {completedCasesConfig, timePeriods} from "../constants/CompletedCasesConstants";
/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Completed cases section
 *
 ******************************************************************************/
export default class CompletedCases extends Cases {
    startingDataTableConfiguration = null;


  /**
   *
   * @desc - init class with datatable params
   * @param {Object} args - config for class
   * @return {void}
   *
   **/
    constructor(args = {}) {
        super(args);
    }

  /**
   *
   * @desc - intercept data and attach messages and status
   * @return {Array} originalRowData -
   *
   **/
    getFormattedRowDataFromServer = async () => {
        let originalRowData = await super.getFormattedRowDataFromServer();
        this.attachStatusToRowData(originalRowData);
        return originalRowData;
    }

}
