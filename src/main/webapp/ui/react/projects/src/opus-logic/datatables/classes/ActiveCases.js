// import {keyBy, omit} from 'lodash';

import Cases from './Cases';
// import {postJson, jsonToUrlArgs} from '../../common/helpers/';
// import * as util from '../../common/helpers/';
import {activeCasesConfig} from '../constants/ActiveCasesConstants'

/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Active cases section
 *
 ******************************************************************************/
export default class ActiveCases extends Cases {
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

}
