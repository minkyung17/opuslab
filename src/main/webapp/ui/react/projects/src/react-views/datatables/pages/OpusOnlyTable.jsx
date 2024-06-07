import React from "react";
import {keys} from "lodash";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

//My imports
import DataTableComponent from "./DataTableBase.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import OpusOnly from "../../../opus-logic/datatables/classes/OpusOnly";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import {BootStrapModalCheckboxList} from
  "../../common/components/bootstrap/ModalCheckBoxes.jsx";
import FilteredView from "../components/FilteredView.jsx";

/******************************************************************************
 *
 * @desc - OpusOnlyTable via dataTableConfiguration file
 *
 ******************************************************************************/
export default class OpusOnlyTableComponent extends DataTableComponent {

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
    Logic = new OpusOnly(this.props);

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
        resetNumber: 0,
        showOnlyButtonClass: "btn-gray",
        specialShowOnlyFilter: "OpusOnly"
    };


  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow() {
        let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel,
      specialShowOnlyFilter, formattedColumnOptions = {}, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;
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
          <CSVLink data={exportData}
            filename={dataTableConfiguration.excelFileName}
            className=" btn btn-sm btn-gray table-top export-to-excel pull-right black "
            target="_blank"
            asyncOnClick={true}
            onClick={() => this.getExportData()}>
            {loading ? 'Downloading...' : 'Export To Excel'}
          </CSVLink>
        </ShowIf>

        <div className=" sorting-text ">{sortingTextOrder}</div>

      </div>

    );
    }

}
