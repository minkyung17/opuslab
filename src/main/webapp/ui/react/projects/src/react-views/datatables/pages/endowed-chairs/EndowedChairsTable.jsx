import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

//My imports
import DataTableComponent from "../DataTableBase.jsx";
import {ShowIf} from "../../../common/components/elements/DisplayIf.jsx";
import ActiveEndowedChairs from "../../../../opus-logic/datatables/classes/endowed-chairs/ActiveEndowedChairs.js";
import {FormNumber, FormCurrency, FormTextAreaMaxChar, FormAutoComplete, FormSelect} from "../../../common/components/forms/FormElements.jsx";
import {FormShell, FormGroup} from "../../../common/components/forms/FormRender.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedDataTableComponent from "../../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../../common/helpers/FixedRoleDisplay.jsx";
import FilteredView from "../../components/FilteredView.jsx";
import { descriptions } from "../../../../opus-logic/common/constants/Descriptions.js";
import * as util from "../../../../opus-logic/common/helpers/index.js";
// My imports for endowed chair modal
import EndowedChairModal from '../../../cases-admin/EndowedChairModal.jsx';
import {CommentsModal, CommentTitle, EndowedChairCommentList, CommentBody} from "../../../common/components/bootstrap/CommentComponents.jsx";

/******************************************************************************
 *
 * @desc - Handles Endowed Chairs via dataTableConfiguration file
 *
 ******************************************************************************/
export default class EndowedChairsTableComponent extends DataTableComponent {

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
    Logic = new ActiveEndowedChairs(this.props);

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
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
        showSuccessModal: false,
        isSaveButtonDisabled: false,
        originalEditData: {},
        editData: {},
        deleteData: {},
        yearOptions: {},
        titleOptions: {},
        allocationTitleData: {},
        adminCompInfo: {},
        duplicateErrorMessage: null,
        showCommentsModal: false,
        modalData: {},
        originalModalData: {},
        originalModalDropdownOptions: {},
        modalDropdownOptions: {}
    };


 /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
    componentDidMount() {
        this.setUpPage();
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
        this.attachOnClickForColumns(dataTableConfiguration);
    }

    /**
    *
    * @desc - Filter table data by tab click and then update state
    * @param {String} tabName -
    * @returns {void}
    *
    **/
    getEndowedChairObject = async () => {
      let endowedChairAPIResults =  await this.Logic.getEndowedChairObject();
      let originalModalDropdownOptions = {};
      let modalDropdownOptions = {
          fundingType: [],
          termRenewable: [],
          chairType: [],
          chairStatus: []
      };
      let originalModalData = util.cloneObject(endowedChairAPIResults.endowedChairInfo);
      let modalData = util.cloneObject(endowedChairAPIResults.endowedChairInfo);

      // Need to split endowedChairStatusData from numeric keys and save both to find on save
      if(endowedChairAPIResults.endowedChairStatusData){
          originalModalDropdownOptions.chairStatus = util.cloneObject(endowedChairAPIResults.endowedChairStatusData);
          let chairStatusOptions = Object.values(endowedChairAPIResults.endowedChairStatusData);
          modalDropdownOptions.chairStatus = chairStatusOptions;
      }else{
          console.log("WARNING: No endowedChairStatusData given from API, will not be able to save");
      }
      // Need to split endowedChairTypeData from numeric keys and save both to find on save
      if(endowedChairAPIResults.endowedChairTypeData){
          originalModalDropdownOptions.chairType = util.cloneObject(endowedChairAPIResults.endowedChairTypeData);
          let chairTypeOptions = Object.values(endowedChairAPIResults.endowedChairTypeData);
          modalDropdownOptions.chairType = chairTypeOptions;
      }else{
          console.log("WARNING: No endowedChairTypeData given from API, will not be able to save");
      }
      // Need to split endowedChairTermRenewableData from numeric keys and save both to find on save
      if(endowedChairAPIResults.endowedChairTermRenewableData){
          originalModalDropdownOptions.termRenewable = util.cloneObject(endowedChairAPIResults.endowedChairTermRenewableData);
          let termRenewableOptions = Object.values(endowedChairAPIResults.endowedChairTermRenewableData);
          modalDropdownOptions.termRenewable = termRenewableOptions;
      }else{
          console.log("WARNING: No endowedChairTermRenewableData given from API, will not be able to save");
      }
      // Need to split endowedChairFundingTypeData from numeric keys and save both to find on save
      if(endowedChairAPIResults.endowedChairFundingTypeData){
          originalModalDropdownOptions.fundingType = util.cloneObject(endowedChairAPIResults.endowedChairFundingTypeData);
          let fundingTypeOptions = Object.values(endowedChairAPIResults.endowedChairFundingTypeData);
          modalDropdownOptions.fundingType = fundingTypeOptions;
      }else{
          console.log("WARNING: No endowedChairFundingTypeData given from API, will not be able to save");
      }
      this.setState({originalModalDropdownOptions, modalDropdownOptions, modalData, originalModalData});
  }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
  attachOnClickForColumns = (dataTableConfiguration) => {
        if(dataTableConfiguration && dataTableConfiguration.columnConfiguration){
            let dtConfig = dataTableConfiguration.columnConfiguration;
      // edit on click event
            if(dtConfig.edit) {
                dtConfig.edit.onClick =
          (evt, row) => this.edit(evt, row);
            }
      // delete on click event
            if(dtConfig.delete) {
                dtConfig.delete.onClick =
          (evt, row) => this.delete(evt, row);
            }
      // comments on click event
          if(dtConfig.comments) {
            dtConfig.comments.onClick = (evt, row) => this.getComments(evt, row);
          }            
        }
        return dataTableConfiguration;
    }
  /**
   *
   * @desc - Gets comments from the API
   * @returns {void}
   *
   **/
  getComments = async(evt, row) => {
    let rowData = row.rowData;    
    let comments = []; 
    let endowedChairName = rowData.displayValue_endowedChairName;
    if(rowData.commentsCounter>0){
      comments = await this.Logic.getComments(rowData.endowedChairId);  
    }
    // IOK-1018 Reverse comments to display most recent comment at the top
    comments = comments.reverse();
    this.setState({endowedChairName, comments, showCommentsModal: true});
  }
  /**
   *
   * @desc - Hide Comments Modal
   *
   **/
  hideCommentsModal = () => {
    this.setState({showCommentsModal: false});
  }

  getCommentsModal = () => {
    let {comments, endowedChairName} = this.state;
        return (
      <CommentsModal show={this.state.showCommentsModal}
        {...{onHide: this.hideCommentsModal}}>    
        <CommentTitle>{endowedChairName}: Comments </CommentTitle>    
        <CommentBody>        
            <EndowedChairCommentList {...{comments}} />          
        </CommentBody>    
      </CommentsModal>);
  }     
    /******************************************************************************
       *
       * @desc - Add Modal functions and components
       *
       ******************************************************************************/

      /**
      *
      * @desc - Open Add Modal
      *
      **/
      openAddModal = async () => {
        this.setState({showAddModal: true});
      }

      /**
      *
      * @desc - Hide Add Modal
      *
      **/
      hideAddModal = () => {
          this.setState({showAddModal: false, isSaveButtonDisabled: false, duplicateErrorMessage: null});
          this.resetModalData();
      }

      /**
      *
      * @desc - Add Modal Component
      *
      **/
      getAddModal = () => {
        let {showAddModal, modalData, modalDropdownOptions, originalModalDropdownOptions, typeOfECTable} = this.state;
        return <EndowedChairModal {...{showModal: showAddModal, modalData, modalDropdownOptions, originalModalDropdownOptions, typeOfECTable}}
          Logic={this.Logic} hideEndowedModal={this.hideAddModal} handleSave={this.handleSave} comingFrom={"datatable"}/>;
      }



    handleSave = async (endowedChairId, endowedChairName) => {
      if(endowedChairId>0){
        let summaryPageUrl = "/opusWeb/ui/admin/endowed-chair-summary.shtml?endowedChairId="+endowedChairId;
        this.setState({summaryPageUrl})
      }
      this.setState({showAddModal: false, showSuccessModal: true, endowedChairName});
      this.refreshECTable();
    }

    resetModalData = () => {
      let {originalModalData} = this.state;
      this.setState({clonedEndowedChairSummaryData: util.cloneObject(originalModalData)});
    }

/******************************************************************************
 *
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/
    

    refreshECTable = async () => {
      // Refresh datatable
      let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true);
      this.setState({rowData, sortingTextOrder, maxRowCount});
      this.resetModalData();
  }

    /**
   *
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} event - event passed from click event
   * @param {Object} checkedColumnsHash - event passed from click event
   * @return {void}
   *
   **/
    changeColumnVisibilityOnClick = (event, checkedColumnsHash = {}) => {
        this.changeColumnVisibility(checkedColumnsHash, event);
    }

    resetModal = () => {
      let {originalModalData} = this.state;
      let modalData = util.cloneObject(originalModalData);
      this.setState({modalData});
    }

    dismissSuccessModal = () => {
        this.setState({showSuccessModal: false});
        this.resetModal();
        this.refreshECTable();
    }

    getSuccessModal = () => {
      let {summaryPageUrl: href, showSuccessModal, endowedChairName} = this.state;

      return (
        <Modal show={showSuccessModal} onHide={this.refreshProposalsTable}>
          <Header className=" modal-success ">
            <h1 className="white" id="ModalHeader"> Congratulations! </h1>
          </Header>
          <Body>
            You have created an Endowed Chair Summary for {endowedChairName}. <br/> <br/>
          </Body>
          <Footer>
            <a {...{href}} className="white left btn btn-success" target="_blank" >
              Go to Endowed Chair Summary
            </a>
            <Dismiss className="left btn btn-link" onClick={this.dismissSuccessModal}>
              Back to Endowed Chair Table
            </Dismiss>
          </Footer>
        </Modal>
    );
    }

  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getButtonRow = () => {
      let {state: {dataTableConfiguration, sortingTextOrder, disableExportToExcel, formattedColumnOptions = {}, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;

        return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <FilteredView formattedColumnOptions={formattedColumnOptions}
          dataTableConfiguration={dataTableConfiguration} logicData={this.Logic}
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

        return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>

        {changeColumnsModal}
        {this.getAddModal()}
        {this.getEditModal()}
        {this.getDeleteModal()}
        {this.getSuccessModal()}
        {this.showFilterModal()}
          <div>
            <div className="col-md-12">
              <div className="row">
                <button className={"left btn btn-primary bottom-space small-space"} onClick={this.openAddModal}>
                    Add a New Endowed Chair
                </button>
              </div>
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