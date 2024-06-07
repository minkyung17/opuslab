import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from "react-csv";
// import {keys} from 'lodash';
// import {Button} from 'react-bootstrap';
//My imports
import CasesTableComponent from './CasesTable.jsx';
import ActiveCases from '../../../opus-logic/datatables/classes/ActiveCases';
// import * as util from '../../../opus-logic/common/helpers/';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import FilteredView from '../components/FilteredView.jsx';
// import Modal, {Header, Title, Body, Dismiss, Footer} from
//   '../../common/components/bootstrap/ReactBootstrapModal.jsx';
// import {BootStrapModalCheckboxList} from
//   '../../common/components/bootstrap/ModalCheckBoxes.jsx';
// import {searchCriteria} from '../../../opus-logic/datatables/constants/ActiveCasesConstants';
// import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import APIFailureModal from '../../cases-admin/APIFailureModal.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

/******************************************************************************
 *
 * @desc - Handles Active Cases based on
 *    dataTableConfiguration file
 *
 ******************************************************************************/
export default class ActiveCasesTableComponent extends CasesTableComponent {

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
  Logic = new ActiveCases(this.props);
  tableClassName = 'cases';

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
    this.setGlobalReloadActiveCasesFunction();
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
    deleteOnly: false,
    specialShowOnlyFilter: 'all'
  };


  setGlobalReloadActiveCasesFunction() {
    window._reloadActiveCases = this.setRowDataInfo;
  }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
  setUpPage() {
    super.setUpPage();
    let {dataTableConfiguration} = this.Logic;
    this.attachOnClickForDeleteColumn(dataTableConfiguration);
  }

  resetDataTableConfiguration(){
    let {dataTableConfiguration} = this.Logic;
    this.attachOnClickForDeleteColumn(dataTableConfiguration);
    return dataTableConfiguration;
  }

  updateFromFilteredView(formattedColumnOptions, dataTableConfiguration, shouldShowFilterModal){
    //Find correct active/inactive status
    let dtConfig = this.setActiveStatus(dataTableConfiguration)

    super.updateFromFilteredView(formattedColumnOptions, dtConfig, shouldShowFilterModal)
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getButtonRow() {
    let filterButtons = this.getFilterButtonJSX();
    let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel,
      specialShowOnlyFilter, formattedColumnOptions = {}, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;
    return (
      <div className=" button-row form-inline ">
        <div className=" form-group">
          <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
            Change Columns
          </button>
        </div>

        {filterButtons}

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration} logicData={this.Logic}
          updateFromFilteredView={(visibleColumns, dataTableConfiguration, shouldShowFilterModal) =>
            this.updateFromFilteredView(visibleColumns, dataTableConfiguration, shouldShowFilterModal)}/>

          <CSVLink data={exportData}
            filename={dataTableConfiguration.excelFileName}
            className=" btn btn-sm btn-gray table-top export-to-excel pull-right black "
            target="_blank"
            asyncOnClick={true}
            onClick={() => this.getExportData()}>
            {loading ? 'Downloading...' : 'Export To Excel'}
          </CSVLink>

        <div className=" form-group">
          <div className=" sorting-text ">{sortingTextOrder}</div>
        </div>

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
    let getDeleteOrWithdrawCaseModal = this.getDeleteOrWithdrawCaseModal();
    let getDeleteOrWithdrawCaseFromInterfolioModal = this.getDeleteOrWithdrawCaseFromInterfolioModal();
    let getCasesAdminDeleteModal = this.getCasesAdminDeleteModal();
    let getCasesAdminSuccessModal = this.getCasesAdminSuccessModal();
    let resetTable = this.resetDataTableConfiguration();
    let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, onMultiSelectClick,
    onSearchTextFilter, onClickSort, tableClassName} = this;

    return (
      <div className=" datatable-root ">
        <p className=" error_message "> {error_message} </p>
        {getDeleteOrWithdrawCaseModal}
        {getDeleteOrWithdrawCaseFromInterfolioModal}
        {getCasesAdminDeleteModal}
        {getCasesAdminSuccessModal}
        {buttonRow}
        {changeColumnsModal}
        {this.showFilterModal()}
        <APIFailureModal {...{failurePromise: this.state.promise}} />
        <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
          resetNumber, tableConfiguration, resetTable, dataTableConfiguration,
          onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
          tableClassName}}/>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
