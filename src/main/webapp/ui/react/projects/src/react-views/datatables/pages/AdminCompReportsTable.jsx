import React from 'react';
import PropTypes from 'prop-types';


//My imports
import DataTableComponent from './DataTableBase.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import AdminCompReports from '../../../opus-logic/datatables/classes/AdminCompReports';
import FilteredView from '../components/FilteredView.jsx';

/******************************************************************************
 *
 * @desc - Handles AdminCompReports via dataTableConfiguration file
 *
 ******************************************************************************/
export default class AdminCompReportsTableComponent extends DataTableComponent {

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
  Logic = new AdminCompReports(this.props);

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
    this.getFilters();
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    resetNumber: 0
  };

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getButtonRow() {
    let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}}} = this;

    return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration}
          logicData={this.Logic}
          updateFromFilteredView={(visibleColumns, dataTableConfiguration, shouldShowFilterModal) =>
            this.updateFromFilteredView(visibleColumns, dataTableConfiguration, shouldShowFilterModal)}/>

        <ShowIf show={this.exportToExcel}>
          <button className=" btn btn-sm btn-gray table-top export-to-excel pull-right"
            disabled={disableExportToExcel} onClick={this.exportCSV} >
            Export To Excel
          </button>
        </ShowIf>

        <div className=" sorting-text ">{sortingTextOrder}</div>

      </div>

    );
  }

}
