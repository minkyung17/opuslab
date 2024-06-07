import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

//My imports
import EndowedChairsTableComponent from "./EndowedChairsTable.jsx";
import {ShowIf} from "../../../common/components/elements/DisplayIf.jsx";
import Permissions from "../../../../opus-logic/common/modules/Permissions.js";
import EndowedChairHolders from "../../../../opus-logic/datatables/classes/endowed-chairs/EndowedChairHolders.js";
import Modal, {Header, Body,Footer} from
  "../../../common/components/bootstrap/ReactBootstrapModal.jsx";
import FixedDataTableComponent from "../../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../../common/helpers/FixedRoleDisplay.jsx";
import * as util from "../../../../opus-logic/common/helpers/index.js";
// My imports for endowed chair holder modal
import EndowedChairHoldersModal from '../../../cases-admin/EndowedChairHoldersModal.jsx';
import EndowedChairHoldersAddModal from '../../../cases-admin/EndowedChairHoldersAddModal.jsx';
import {CommentsModal, CommentTitle, EndowedChairCommentList, CommentBody} from "../../../common/components/bootstrap/CommentComponents.jsx";
import {editEndowedChairConstants} from '../../../../opus-logic/cases/constants/endowed-chairs/EndowedChairSummaryConstants.js';

/******************************************************************************
 *
 * @desc - Handles Endowed Chair Holders Table via dataTableConfiguration file
 *
 ******************************************************************************/
export default class EndowedChairHoldersTableComponent extends EndowedChairsTableComponent {

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
    Logic = new EndowedChairHolders(this.props);
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
        this.setUpPage();
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
        showCommentsModal: false,
        showSuccessModal: false,
        isSaveButtonDisabled: false,
        isFieldDisabled: false,
        isRankDisabled: false,
        isAddRankDisabled: false,
        isAddModal: false,
        addData: {},
        addComments: {},
        originalEditData: {},
        editData: {},
        yearOptions: {},
        titleOptions: {},
        allocationTitleData: {},
        adminCompInfo: {},
        duplicateErrorMessage: null,
        errorData: {}
    };

  /**
     *
     * @desc - On update it will reinitialize jquery tooltips
     * @returns {void}
     *
     **/
  componentDidMount() {
    this.getEndowedChairHolderObject();    
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

  refreshBrowser = () => {
    window.location.reload();
  }

  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
    attachOnClickForColumns(dataTableConfiguration) {
      if(dataTableConfiguration && dataTableConfiguration.columnConfiguration){
        let dtConfig = dataTableConfiguration.columnConfiguration;
        // edit on click event
        if(dtConfig.edit) {
          dtConfig.edit.onClick = (evt, row) => this.edit(evt, row);
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
  * @desc - New Endowed Chair Object for Modal
  *
  **/
    getEndowedChairHolderObject = async () => {
      try{
        let endowedChairHolderObject = await this.Logic.getEndowedChairHolderObject();
        let commentsObject = await this.Logic.getCommentsObject();
        commentsObject.commentsText = "";
        this.setState({newEndowedChairHolderObject: util.cloneObject(endowedChairHolderObject), newCommentsObject: util.cloneObject(commentsObject)})
      } catch(e) { //If it fails show error modal and close comment modal
        console.log("ERROR: api call in 'getEndowedChairHolderObject' in EndowedChairHoldersTable.jsx")
        console.log(e)
      }
    }

      /**
   *
   * @desc - Gets comments from the API
   * @returns {void}
   *
   **/
    getComments = async(evt, row) => {
      let editData = row.rowData;    
      let comments = [];    
      let endowedChairHolder = editData.chairHolder;
      if(editData.commentsCounter>0){
        comments = await this.Logic.getComments(editData.originalData.endowedChairId, editData.originalData.endowedChairHolderAppointmentId);     
      }
       // IOK-1018 Reverse comments to display most recent comment at the top
      comments = comments.reverse();
      this.setState({endowedChairHolder, comments, showCommentsModal: true});

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
      let {comments, endowedChairHolder} = this.state;
          return (
        <CommentsModal show={this.state.showCommentsModal}
          {...{onHide: this.hideCommentsModal}}>    
          <CommentTitle>{endowedChairHolder}: Comments </CommentTitle>    
          <CommentBody>  
            <EndowedChairCommentList {...{comments}} />
          </CommentBody>    
        </CommentsModal>);
    }

          /**
     *
     * @desc - Check if user can edit EC
     * @param {Object} adminData - has edit resource
     * @return {Object} - can edit ec
     *
     **/
    canEditChairHolders() {
        let {resourceMap} = this.Logic.adminData;
        let accessGranted = false;
        if(resourceMap[editEndowedChairConstants.name]
            && resourceMap[editEndowedChairConstants.name].action === editEndowedChairConstants.action) {
            accessGranted = true;
        }
        return  accessGranted;
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
      let {newEndowedChairHolderObject, newCommentsObject} = this.state;
      this.setState({addData: util.cloneObject(newEndowedChairHolderObject), addComments: util.cloneObject(newCommentsObject), showAddModal: true, isAddRankDisabled: true, isAddModal: true});
    }
    /**
    *
    * @desc - Add Modal Component
    *
    **/
    getAddModal = () => {
      let {showAddModal, addData, addComments, isAddRankDisabled} = this.state;
      return <EndowedChairHoldersAddModal {...{showModal: showAddModal, modalData: addData, modalComments: addComments, isAddRankDisabled: isAddRankDisabled }}
        Logic={this.Logic} hideEndowedModal={this.hideAddModal} handleSave={this.handleSaveForAdd}/>;
    }
  /**
   *
   * @desc - Hide Add Modal
   *
   **/
    hideAddModal = () => {
        this.setState({addData: {}, showAddModal: false, isSaveButtonDisabled: false, duplicateErrorMessage: null});
    }

    onChangeAddData = (e, fieldToChange) => {
        let {addData} = this.state;

        addData[fieldToChange] = e.target.value;
    // editData.originalData[fieldToChange] = e.target.value;

        this.setState({addData});
    }

    handleResponseError = (e, addData) => {
    // Console log entire error event
        console.error(e);

    // Determine error message
        let errorMessage;
        if(e.responseJSON && e.responseJSON.message){
            errorMessage = e.responseJSON.message;
            this.setState({duplicateErrorMessage: errorMessage, addData});
        }else if(e.responseJSON){
      // responseJSON is there but no message
            errorMessage = "No responseJSON.message field from api call";
        }else{
            errorMessage = "No responseJSON object found. Status Code: "+e.status.toString()+" "+e.statusText;
        }
        this.setState({duplicateErrorMessage: errorMessage, isSaveButtonDisabled: false});
    }

/******************************************************************************
 *
 * @desc - Edit Modal functions and components
 *
 ******************************************************************************/

  /**
   *
   * @desc - Filter table data by tab click and then update state
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    edit = async(evt, row) => {
        let originalEditData = this.Logic.cloneEditData(row.rowData);
        let rowIndexForEditData = row.rowIndex;
        let editData = row.rowData;    
        let rankOptions = [];    
        if(editData.seriesTypeId != null){
          rankOptions = await this.Logic.getRankOptions(editData.seriesTypeId);
          this.Logic.dataTableConfiguration.rankOptions = rankOptions;
        }  
        if(editData.linkedToOpusCase != '' || editData.activeAppointment == 'Y') {
          this.setState({isFieldDisabled: true, isRankDisabled: true});
        } else {
          this.setState({isFieldDisabled: false, isRankDisabled: false});
        } 
        if(editData.seriesTypeId == null){
          this.setState({isRankDisabled: true});
        }          
        this.setState({rowIndexForEditData, originalEditData, editData, showEditModal: true});

    }

    revertEditData = () => {
        let {rowIndexForEditData, originalEditData, rowData} = this.state;
        rowData[rowIndexForEditData] = originalEditData;
        this.hideEditModal();
    }

  /**
   *
   * @desc - Hide Edit Modal
   *
   **/
    hideEditModal = () => {
        this.setState({originalEditData:{}, editData: {}, showEditModal: false, isSaveButtonDisabled: false});
    }

    getEditModal = () => {
      let {showEditModal, editData, newCommentsObject, isFieldDisabled, isRankDisabled} = this.state;
      return <EndowedChairHoldersModal {...{showModal: showEditModal, modalData: editData, modalComments: newCommentsObject, isFieldDisabled: isFieldDisabled, isRankDisabled: isRankDisabled}}
        Logic={this.Logic} hideEndowedModal={this.revertEditData} handleSave={this.handleSave} />;
    }

    handleSave = (data) => {
      console.log(data)
      this.hideEditModal();
      this.setState({showSuccessModal: true});
    }  

    handleSaveForAdd = (data) => {
      console.log(data)
      this.hideAddModal();
      this.setState({showSuccessModal: true});
    } 

/******************************************************************************
 *
 * @desc - Main datatable functions and components
 *
 ******************************************************************************/


    handlePromise = async (promise) => {
        let response = await promise;
        if(response && response.length>=0){
            let rowData = await this.Logic.configureData(response);
            // rowData = this.Logic.filterAPITableData(rowData);
            let sortingTextOrder = this.Logic.getSortOrderText();
            this.Logic.rowData = rowData;
            let maxRowCount = rowData.length;
            this.setState({rowData, sortingTextOrder, maxRowCount});
        }else{
            console.log("Response from API does not contain array of rowData");
            console.log(response.toString());
        }
    }

   /**
   *
   * @desc - Changes visibility of dataTableConfiguration column
   * @param {Object} checkedColumnsHash -
   * @return {void}
   *
   **/
    changeColumnVisibility = (checkedColumnsHash, event, dataTableConfiguration = this.Logic.dataTableConfiguration) => {
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

    dismissSuccessModal = () => {
        this.setState({showSuccessModal: false});
        this.refreshBrowser();
    }

    refreshChairHoldersTable = async () => {
      // Refresh datatable
      let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true);
      this.setState({rowData, sortingTextOrder, maxRowCount});
    }

    getSuccessModal = () => {
        let {showSuccessModal} = this.state;
        return (
      <Modal show={showSuccessModal} onHide={this.dismissSuccessModal}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Success! </h1>
        </Header>
        <Body>
          <p>Your edits have been saved!</p>
        </Body>
        <Footer>
          <button className={"left btn btn-success"} onClick={this.dismissSuccessModal}>
            OK
          </button>
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

        let {state: {sortingTextOrder}} = this;

        return (
      <div className=" button-row ">
        <button className="btn btn-sm btn-gray table-top" onClick={this.openChangeColumnsModal}>
          Change Columns
        </button>

        <button className=" btn btn-sm btn-gray table-top"
          onClick={this.resetTable}>
          Reset Table
        </button>
        <div className=" sorting-text ">{sortingTextOrder}</div>

      </div>

    );
    }

      /**
   *
   * @desc - Renders the export button
   * @returns {JSX} - jsx for table buttons
   *
   **/
    getExportButton = () => {
      let {state: {disableExportToExcel, loading}} = this;
      let exportData = this.Logic.dataTableConfiguration.exportData;
      
      return (
    <div className=" button-row ">
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
    </div>

  );
  }

  /**
   *
   * @desc - Resets parameters
   * @returns {void}
   *
   **/
  resetTable = () => {
    // IOK-1025 Table wasn't resetting sort display text correctly:
    this.refreshChairHoldersTable();

    //Extract reset number to iterate after reset
    let {resetNumber} = this.state;

    //Get starting configuration
    let dataTableConfiguration = this.Logic.resetDataTableConfiguration();

    //Get original columns
    let formattedColumnOptions = this.getBootStrapModalOptions(dataTableConfiguration);

    //Reattach onClick
    this.attachOnClickForColumns(dataTableConfiguration);

    //Now reset everything
    this.setState({dataTableConfiguration, formattedColumnOptions,
      resetNumber: ++resetNumber});
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
        let exportButton = this.getExportButton();
        let changeColumnsModal = this.getChangeColumnsModal();
        let editChairHolder = this.canEditChairHolders();

        let {state: {tableConfiguration, rowData, resetNumber, error_message,
      dataTableConfiguration, maxRowCount}, tableClassName, resetTable,
      onMultiSelectClick, onSearchTextFilter, onClickSort} = this;
        return (

      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>

        <p className=" error_message "> {error_message} </p>

        {changeColumnsModal}
        {this.getAddModal()}
        {this.getEditModal()}
        {this.getCommentsModal()}
        {this.getSuccessModal()}
        {this.showFilterModal()}
          <div>
            <h2> Export Options </h2><br/>
            {exportButton}
            <div className="col-md-12">
              <div className="row">                  
                Excel report includes Chair Overview and Chair Holders Information.
              </div>
            </div><br/><br/>
          </div>
          <div>
            <h2> Chair Holders </h2><br/>
            <div className="col-md-12">
              <ShowIf show={editChairHolder}>
                <div className="row">                  
                  As an APO Administrator, you may <a href="#" onClick={this.openAddModal}>add a historical Chair Holder</a> to complete this Chair Holder history. 
                  New Chairs should be added by starting an Endowed Chair Appt. case.
                </div>
              </ShowIf>
              <ShowIf show={!editChairHolder}>
                <div className="row">                  
                To add a new Chair Holder, start an Endowed Chair Appt. case.
                </div>
              </ShowIf>
            </div><br/> <br/>
            {buttonRow}
            <FixedDataTableComponent ref="datatable" key={resetNumber} {...{rowData,
              resetNumber, tableConfiguration, dataTableConfiguration, resetTable,
              onMultiSelectClick, onSearchTextFilter, onClickSort, maxRowCount,
              tableClassName}}/> 
          </div> 
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
