import React from 'react';
import PropTypes from 'prop-types';

//My imports
import DataTableComponent from './DataTableBase.jsx';
import DuplicateRecords from '../../../opus-logic/datatables/classes/DuplicateRecords';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import MergeRecordsModal from '../../cases-admin/MergeRecordsModal.jsx';
import FixedDataTableComponent from '../components/FixedDataTableComponent.jsx';
import CasesAdminSuccessModal from '../../cases-admin/CasesAdminSuccessModal.jsx';
import APIFailureModal from '../../cases-admin/APIFailureModal.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

/******************************************************************************
 *
 * @desc - Handles Duplicate Records via dataTableConfiguration file
 *
 ******************************************************************************/
export default class DuplicateRecordsTableComponent extends DataTableComponent {
  /*
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

  defaultViewConfigName = 'duplicateRecords'; //Matches name in AllConstants.js
  tableClassName = 'duplicateRecords';

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new DuplicateRecords(this.props);
  exportToExcel = true;
  selectedRows = {};

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
    let {dataTableConfiguration} = this.Logic;
    this.changeStateOfMergeRecordsModal = this.changeStateOfMergeRecordsModal.bind(this);
    this.attachOnClickForMergeRecordsColumn(dataTableConfiguration);
    this.changeStateOfSuccessModal = this.changeStateOfSuccessModal.bind(this);
  }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
  attachOnClickForMergeRecordsColumn(dataTableConfiguration) {
    if(dataTableConfiguration.columnConfiguration.merge) {
      dataTableConfiguration.columnConfiguration.merge.onClick =
        this.setMergeRecordsInfo;
    }
  }

  resetDataTableConfiguration(){
    let {dataTableConfiguration} = this.Logic;
    this.attachOnClickForMergeRecordsColumn(dataTableConfiguration);
    return dataTableConfiguration;
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
    showMergeRecordsModal: false,
    mergeData: {}
  };

  /**
   *
   * @desc - determines is there is an cases-admin case attached to the opus case
   * @param {Event} evt - click event
   * @param {Object} rowData - case that will be merged
   * @returns {void}
   *
   **/
  setMergeRecordsInfo = (evt, {rowData} = {}) => {
    this.setState({showMergeRecordsModal: true,
    mergeData: rowData})
    this.getFuzzyMatches(rowData.uid);
  }

  /**
   *
   * @desc - api request to get all fuzzy matches
   * @param {Object} rowData - case that will be used to find fuzzy matches
   * @returns {void}
   *
   **/
  getFuzzyMatches = async (rowData) => {
    this.setState({fuzzyMatches: []})
    let fuzzyMatchLogic = this.Logic.getFuzzyMatches(rowData);
    try{
      let fuzzyMatchResponse = await fuzzyMatchLogic;
      this.setState({fuzzyMatches: fuzzyMatchResponse.matchingOpusPersonRecordsList,
        displayName: fuzzyMatchResponse.appointeeInfo.firstName+' '+fuzzyMatchResponse.appointeeInfo.lastName})
    }catch(e){
      console.log('No Fuzzy Matches')
    }

  }

  changeStateOfMergeRecordsModal() {
    // Dismissing merge records Modal changes state of reopen modal in parent
    // to disable merge records modal from showing again
    this.setState({showMergeRecordsModal: false, fuzzyMatches: []});
  }

  /**
   *
   * @desc - rendering ReopenCaseModal determined by the state of showReopenCaseModal
   * @returns {JSX} - ReopenCaseModal jsx
   *
   **/
  getMergeRecordsModal({showMergeRecordsModal, mergeData, fuzzyMatches, displayName} = this.state) {
    return <MergeRecordsModal {...{showMergeRecordsModal, mergeData, fuzzyMatches, displayName}}
      changeStateOfMergeRecordsModal={this.changeStateOfMergeRecordsModal}
      mergeRecords={(selection, mergingRecords) => this.mergeRecords(selection, mergingRecords)}
    />;
  }

  mergeRecords = async (selection, mergingRecords) => {
    let mergeRecordsPromise = this.Logic.mergeRecordsPromise(
      this.state.mergeData.originalData.appointeeInfo.opusPersonId, mergingRecords
    )
    try{
      await mergeRecordsPromise;
      if(selection==="yes") {
        this.setState({showSuccessModal: true})
      }
    }catch(e) {
      console.log("ERROR: api call in 'mergeRecords' in DuplicateRecordsTable.jsx") 
      this.setState({promise: mergeRecordsPromise});
    }
    this.setState({showMergeRecordsModal: false})

    // Refresh datatable
    let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true);
    this.setState({rowData, sortingTextOrder, maxRowCount});
  }

  changeStateOfSuccessModal(){
    // Dismissing success Modal changes state of success modal in parent
    // to disable success modal from showing twice due to formatting completed cases datatable
    this.setState({showSuccessModal: false});
  }

  /**
  *
  * @desc - This is the create a case modal
  * @param {Object} component data - data need for component
  * @return {JSX} - caseReopenedSuccessModal jsx
  *
  **/
  getCaseMergeRecordsSuccessModal({showSuccessModal} = this.state) {
    return <CasesAdminSuccessModal {...{showSuccessModal,
      casesAdminTypeStringValue: 'merge'}}
      changeStateOfSuccessModal={this.changeStateOfSuccessModal}/>;
  }

  /**
   *
   * @desc - Renders the buttons you see above the datatable.  Override
   * this because we don't want to see a Change Columns button in this table
   * @returns {JSX} - jsx for table buttons
   *
   **/
  getButtonRow() {
    let {state: {sortingTextOrder, disableExportToExcel}} = this;

    return (
      <div className=" button-row ">
        <button className=" btn btn-sm btn-gray table-top "
          onClick={this.resetTable}>
          Reset Table
        </button>

        <div className=" sorting-text ">{sortingTextOrder}</div>

        <ShowIf show={this.exportToExcel}>
          <button className=" btn btn-sm btn-gray table-top export-to-excel "
            disabled={disableExportToExcel} onClick={this.exportCSV} >
            Export To Excel
          </button>
        </ShowIf>
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
    let getMergeRecordsModal = this.getMergeRecordsModal();
    let getCaseMergeRecordsSuccessModal = this.getCaseMergeRecordsSuccessModal();
    let resetTable = this.resetDataTableConfiguration();
    let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, tableClassName,
    onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort} = this;

    return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>
        {buttonRow}
        {getMergeRecordsModal}
        {getCaseMergeRecordsSuccessModal}
        <APIFailureModal {...{failurePromise: this.state.promise}} />
        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, maxRowCount, tableConfiguration, resetTable,
            dataTableConfiguration, tableClassName, onMultiSelectClick, onClickSort,
            onToggleSelectAll, onSearchTextFilter}} />
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
