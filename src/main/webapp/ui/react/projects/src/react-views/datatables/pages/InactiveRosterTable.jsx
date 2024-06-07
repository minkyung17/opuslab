import React from 'react';
import {keys} from 'lodash';
import PropTypes from 'prop-types';
import { CSVLink } from "react-csv";

//My imports
import RosterTableComponent from './RosterTable.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import InactiveRoster from '../../../opus-logic/datatables/classes/InactiveRoster';
//import {cssConstants} from '../constants/DatatableConstants';
import {BootStrapModalCheckboxList} from
  '../../common/components/bootstrap/ModalCheckBoxes.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import {searchCriteria} from '../../../opus-logic/datatables/constants/InactiveRosterConstants';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

/******************************************************************************
 *
 * @desc - Handles Roster via dataTableConfiguration file
 *
 ******************************************************************************/

export default class InactiveRosterTableComponent extends RosterTableComponent {
  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
  static propTypes = {
    initialCount: PropTypes.number
  }

  static defaultProps = {
    initialCount: 0
  }

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new InactiveRoster(this.props);

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Datatable
   *
   **/
  constructor(props = {}) {
    super(props);
    this.setUpPage();
    this.Logic.setDataTableConfigurationShowOnlyFilters(searchCriteria);
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    infoshowModal: false,
    resetNumber: 0,
    showOnlyButtonClass: 'btn-gray'
  };

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
  componentDidUpdate() {
    util.initJQueryBootStrapToolTipandPopover();
  }


  /**
   *
   * @desc - Renders the datatable and button suite
   * @param {Array} names - data for search categories
   * @returns {JSX} - filter button
   *
   **/
  getFilterButtonJSX(names = keys(searchCriteria.categories)) {
    let {dataTableConfiguration} = this.Logic;
    let isChecked = dataTableConfiguration.dataColumnFilters.outsideFilters;

    return (
      <span className="dropdown">
        <button className={"btn btn-sm btn-gray table-top dropdown-toggle "
          +this.state.showOnlyButtonClass} type="button" data-toggle="dropdown">
          Show Only &nbsp;&nbsp;
          <span className="caret" />
        </button>
        <ul className="dropdown-menu">
          {names.map((name) =>
            (<li key={name}>
              <div className="checkbox">
                <label>
                  <input {...{name, id: name}} type="checkbox"
                    className="btn btn-sm btn-gray table-top dropdown-toggle"
                    onClick={this.filterOnClickCheckbox} checked={!!isChecked[name]}/>
                  {searchCriteria.categories[name].displayName}
                </label>
              </div>
            </li>)
          )
          }
        </ul>
      </span>
    );
  }

  /**
   *
   * @desc - Renders the datatable and button suite
   * @returns {void}
   *
   **/
  render() {
    if(!this.state.isPageViewable) {
      return null;
    }
    let buttonRow = this.getButtonRow();
    let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, resetTable, onMultiSelectClick,
    onSearchTextFilter, onClickSort} = this;

    return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>
        {this.getInfoModal()}
        {buttonRow}
        {this.getAPIResponseModal()}
        {this.showFilterModal()}
        <FixedDataTableComponent ref="datatable"
          key={resetNumber} resetNumber={resetNumber}
          {...{rowData, tableConfiguration, resetTable, dataTableConfiguration,
            onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
