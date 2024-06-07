import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

//My imports
import EndowedChairsTableComponent from "./EndowedChairsTable.jsx";
import {ShowIf} from "../../../common/components/elements/DisplayIf.jsx";
import Permissions from "../../../../opus-logic/common/modules/Permissions.js";
import ModificationRequest from "../../../../opus-logic/datatables/classes/endowed-chairs/ModificationRequest.js";
import {FormNumber, FormCurrency, FormTextAreaMaxChar, FormAutoComplete, FormSelect} from "../../../common/components/forms/FormElements.jsx";
import {FormShell, FormGroup} from "../../../common/components/forms/FormRender.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedDataTableComponent from "../../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../../common/helpers/FixedRoleDisplay.jsx";
import FilteredView from "../../components/FilteredView.jsx";
import { descriptions } from "../../../../opus-logic/common/constants/Descriptions.js";
import * as util from "../../../../opus-logic/common/helpers/index.js";
import EndowedChairModal from '../../../cases-admin/EndowedChairModal.jsx';


/******************************************************************************
 *
 * @desc - Handles Modification Request via dataTableConfiguration file
 *
 ******************************************************************************/
export default class ModificationRequestTableComponent extends EndowedChairsTableComponent {

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
    Logic = new ModificationRequest(this.props);
    Permissions = new Permissions(this.props.adminData);

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Datatable
   *
   **/
    constructor(props = {}) {
        super(props);
    }


  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
    state = {
        ...this.state,
        typeOfECTable: "Modification Request",
        resetNumber: 0,
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
        showSuccessModal: false,
        isSaveButtonDisabled: false,
        addData: {},
        originalEditData: {},
        editData: {},
        deleteData: {},
        yearOptions: {},
        titleOptions: {},
        allocationTitleData: {},
        adminCompInfo: {},
        duplicateErrorMessage: null
    };

    /**
       *
       * @desc - On update it will reinitialize jquery tooltips
       * @returns {void}
       *
       **/
    componentDidMount() {
      this.setUpPage();
      this.getEndowedChairObject();
    }


/******************************************************************************
 *
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/



   /**
   *
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} checkedColumnsHash -
   * @return {void}
   *
   **/
    changeColumnVisibility = (checkedColumnsHash, event, dataTableConfiguration = this.dataTableConfiguration) => {
    //Check all is custom made and uncheck all reverts to a custom visibility so had to make a exception (Based off OPUSDEV-3131)
        let columns = checkedColumnsHash;
        if(event.target.value==="Check All"){
            for(let each in columns){
                columns[each] = event.target.checked;
            }
        }

        dataTableConfiguration = this.Logic.updateColumnVisibilityByHash(columns, dataTableConfiguration);
        let formattedColumnOptions = this.getBootStrapModalOptions();
        this.setState({formattedColumnOptions});
        this.updateRowDatafromDataTableConfiguration(dataTableConfiguration);
    }


  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow = () => {
        let {state: { dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}, loading}} = this;
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
        let changeColumnsModal = this.getChangeColumnsModal();

        let {state: {tableConfiguration, rowData, resetNumber, error_message, sortingTextOrder,
      dataTableConfiguration, maxRowCount}, tableClassName, resetTable,
      onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort, modalId} = this;
        let {isOA, isAPO, isAPOAdmin} = this.Permissions;
        return (

      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>

        {changeColumnsModal}
        {this.getAddModal()}
        {this.getSuccessModal()}
        {this.showFilterModal()}
        {this.getCommentsModal()}
          <div>

            <div className="col-md-12">
            <ShowIf show={isOA || isAPO || isAPOAdmin}>
              <div className="row">
                <button className={"left btn btn-primary bottom-space small-space"} onClick={this.openAddModal}>
                    Add a New Endowed Chair
                </button>
              </div>
            </ShowIf>
            </div>
            <br/><br/>

            {buttonRow}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/>
          </div>

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}