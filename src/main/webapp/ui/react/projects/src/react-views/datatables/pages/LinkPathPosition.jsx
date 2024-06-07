import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Button } from "react-bootstrap";
 
//My imports
import DataTableComponent from "./DataTableBase.jsx";
import Modal, {Header, Title, Body, Footer, Dismiss} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import LinkPathPosition from "../../../opus-logic/datatables/classes/LinkPathPosition";
import FixedDataTableComponent from "../components/FixedDataTableComponent.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import {SearchBarWithButton} from '../../common/components/elements/SearchBarWithButton.jsx';
import {RadioGroup, Radio} from 'react-radio-group';
 
/******************************************************************************
 *
 * @desc - Handles Link Path Position via dataTableConfiguration file
 *
 ******************************************************************************/
export default class LinkPathPositionTableComponent extends DataTableComponent {
 
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
    Logic = new LinkPathPosition(this.props);
 
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
        tabName: "noMatches",
        noMatchesLength: 0,
        possibleMatchesLength: 0,
        goodMatchesLength: 0,
        confirmedLength: 0,
        shouldShowTab: false,
        maxLinkPathPositionMatches: 0,
        selectedPathPosition: {},
        showConfirmModal: false,
        showLoading: true,
        hasLoaded: false,
        showLinkManuallyModal: false,
        showSuccessModal: false,
        showData: false,
        noData: false,
        showError: false,
        isButtonDisabled: false,
        positionData: [],
        positionNo: '',
        appointmentId: '',
        emplId: '',
        errorMessage: '',
        inputError: ''
    };
 
    componentDidMount(){
        this.checkEnvironment();
    }
 
    componentDidUpdate(){
        // Need to keep state in sync with logic
        this.syncLogicAndViewStates();
        // OPUSDEV-4086 Set "Loading..." text until table is loaded
        if(this.state.rowData.length>0 && this.state.hasLoaded===false){
            this.setState({showLoading: false, hasLoaded: true});
        }
    }
 
  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @returns {void}
   *
   **/
    setUpPage() {
        this.setState({showLoading: true});
        super.setUpPage();
        let {dataTableConfiguration} = this.Logic;
        this.attachOnClickForColumns(dataTableConfiguration);
    }
 
  /**
   *
   * @desc - On update it will reinitialize jquery tooltips
   * @param {Object} dataTableConfiguration -
   * @returns {void}
   *
   **/
    attachOnClickForColumns(dataTableConfiguration) {
        let dtConfig = dataTableConfiguration.columnConfiguration;
        // Confirm column on click event
        if(dtConfig.confirm) {
            dtConfig.confirm.onClick =
      (evt, rowData) => this.confirm("confirm", evt, rowData);
        }
        // UC Path Position column radio button on click event
        if(dtConfig.ucPathPosition) {
            dtConfig.ucPathPosition.onClick =
        this.selectUCPathPosition;
        }
        // UC Path Position unlink on click event
        if(dtConfig.unlink) {
            dtConfig.unlink.onClick =
        (evt, rowData) => this.confirm("unconfirm", evt, rowData);
        }
        // UC Path Position link manually on click event
        if(dtConfig.ucPathPositionNoMatch) {
            dtConfig.ucPathPositionNoMatch.onClick =
            (evt, rowData) => this.linkManually(evt, rowData);
        }
        return dataTableConfiguration;
    }
 
    // Need to keep state in sync with logic
    syncLogicAndViewStates = () => {
        if(this.state.noMatchesLength!==this.Logic.noMatches.length){
            this.setState({noMatchesLength: this.Logic.noMatches.length});
        }
        if(this.state.possibleMatchesLength!==this.Logic.possibleMatches.length){
            this.setState({possibleMatchesLength: this.Logic.possibleMatches.length});
        }
        if(this.state.goodMatchesLength!==this.Logic.goodMatches.length){
            this.setState({goodMatchesLength: this.Logic.goodMatches.length});
        }
        if(this.state.confirmedLength!==this.Logic.confirmed.length){
            this.setState({confirmedLength: this.Logic.confirmed.length});
        }
        if(this.state.multiMatchLength!==this.Logic.multiMatch.length){
            this.setState({multiMatchLength: this.Logic.multiMatch.length});
        }
        if(this.state.maxLinkPathPositionMatches!==this.Logic.maxLinkPathPositionMatches){
            this.setState({maxLinkPathPositionMatches: this.Logic.maxLinkPathPositionMatches});
        }
    }
 
   /**
   *
   * @desc - sets environment display as well as
   *  boolean value to display component at all
   *
   **/
    checkEnvironment(){
        let shouldShowTab = false;
        if(window.location.hostname==="localhost"){
            shouldShowTab = true;
        }
        // if(shouldShowTab){
        //   document.getElementById("secretTab").style.display = "block";
        // }
        this.setState({shouldShowTab});
    }
 
 
    dismissConfirmModal = () => {
        this.setState({showConfirmModal: false});
    }

    /**
     *
     * @desc - Need to disable/enable buttons based on if they have chosen a valid
     *   job number.
     * @param {Object} jobNumber - Job number
     * @return {void}
     *
     **/
    getJobSearchResults = async (positionNo) => {
        let {emplId} = this.state;   
        if(positionNo.trim() === ''){
            this.setState({inputError: 'Please enter the position number', positionData: [], noData:''});  
            return;
        }
        let results = await this.Logic.searchJob(positionNo, emplId);        
        if(null != results && results.length !== 0) { 
            let data = this.Logic.getFormattedResults(results);
            if(results[0].ended === 'Y'){
                let errorMsg = "This job has ended and cannot be linked to an Opus Appointment. Update the end date in UCPath to make the position available for linking.";
                this.setState({errorMessage: errorMsg, showError: true, isButtonDisabled: true});
            }
            if(results[0].effective === 'N'){
                let errorMsg = "This job is not yet effective. The position will be available for linking on the effective date.";
                this.setState({errorMessage: errorMsg, showError: true, isButtonDisabled: true});
            }
            this.setState({positionNo: results[0].positionNbr, positionData: data, showData: true, noData: false});   
        } else {
            this.setState({noData: true, showData: false, inputError:''});   
        }
    }

    linkManually = async (evt, {rowData} = {}) => {
        this.setState({showLinkManuallyModal: true});
        let apptId = rowData.originalData.appointmentInfo.appointmentId;
        let emplId = rowData.originalData.appointeeInfo.emplId;
        this.setState({appointmentId: apptId, emplId: emplId});
    }

    hideLinkManuallyModal = () => {
        this.setState({showLinkManuallyModal: false, showData: false, noData: false, showError: false, errorMessage: '', 
        positionData: [], inputError: '', isButtonDisabled: false});
    }

    getLinkManuallyModal = () => {
        let {showLinkManuallyModal, showData, noData, positionData, isButtonDisabled, showError, errorMessage, inputError} = this.state;
        return (
            <Modal onHide={this.hideLinkManuallyModal}
            show={showLinkManuallyModal}>
            <Header className=" modal-info modal-header " closeButton>
              <Title> Link UCPath Position </Title>
            </Header>
            <Body>
            <p>
            <label>
                Position Number
            </label>
            </p>
            <SearchBarWithButton onClick={this.getJobSearchResults} buttonText='Search'/>
            <p className=" error_message "> {inputError} </p>
            <ShowIf show={showData}>
                <div>
                    <label>
                        Confirm Position Information 
                    </label><br/>
                        {positionData.map((each, index) =>
                            <div key={index}>
                            <label>                  
                                {each.map((value, index) => {
                                    return <span key={index}>{value} <br /></span>;
                                })}
                            </label>
                            </div>
                        )}
                   <ShowIf show={showError}>
                    <div>
                        <label className="error_message">
                           {errorMessage} 
                        </label><br/>
                    </div>
                    </ShowIf> <br/>  
                    <Button className="btn btn-primary" disabled={isButtonDisabled} onClick={this.linkToUCPath}>
                        Confirm and Link to UCPath
                    </Button>
                </div>
            </ShowIf>
            <ShowIf show={noData}>
                <div>
                <label>
                We cannot find that position number in UCPath. <br/>
                If you feel this is in error, contact <a href="mailto:opushelp@ucla.edu">opushelp@ucla.edu</a>.
                </label>
                </div>
            </ShowIf>
            </Body>
        </Modal>
        );
    }
   /**
   *
   * @desc - Delete case and reload the profile page
   * @return {void}
   *
   **/
   linkToUCPath = async () => {
    //Extract
        let {appointmentId, positionNo} = this.state;
        let promise = await this.Logic.linkToUCPath(appointmentId, positionNo);
        this.setState({showLinkManuallyModal: false, showSuccessModal: true});
        //Now we can reload the page
        //this.reloadProfile();
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
    dismissSuccessModal = () => {
        this.setState({showSuccessModal: false});
        this.refreshBrowser();
    }
    refreshBrowser = () => {
        window.location.reload();
      }

    getConfirmModal = () => {
        let {showConfirmModal} = this.state;
        return (
          <Modal show={showConfirmModal} onHide={console.log("")}>
            <Header className=" modal-warning ">
              <h1 className="white" id="ModalHeader"> Processing… </h1>
            </Header>
            <Body>
              <p>This will take some time to complete as Opus rebuilds the Match tables in response to the position you edited.  We ask for your patience during this process.  Thank you.</p>
            </Body>
          </Modal>
        );
    }
 
    confirm = async (typeOfReq, evt, {rowData} = {}) => {
        let {selectedPathPosition} = this.state;
        let confirmedCase = rowData.ucPathPosition[0];
        let shouldRefreshWithAPICall = rowData.originalData.multipleOffer==="Y" ? true : false;
        console.log("Is this a multiple offer? "+rowData.originalData.multipleOffer);
   
        if(typeOfReq==="confirm"){
        // Checks if row has more than 1 uc path position match, has any path position has been selected,
        // and if selected path position is the same as the row confirming
            if(rowData.ucPathPosition.length>1 && selectedPathPosition.uniqueKey
                && rowData.uniqueKey===selectedPathPosition.uniqueKey){
                confirmedCase = rowData.ucPathPosition[selectedPathPosition.radioGroupIndex];
            }
        }
 
        let positionNbr = confirmedCase[0].replace("Position #: ","");
        let confirmedCaseParams = {
            opusPersonId: rowData.originalData.appointeeInfo.opusPersonId,
            appointmentId: rowData.originalData.appointmentInfo.appointmentId,
            positionNbr: positionNbr,
            adminName: this.props.adminData.adminName,
            typeOfReq: typeOfReq
        };
        if(shouldRefreshWithAPICall){
            // OPUSDEV-4001 OPUSDEV-4082 Show confirm modal for multiple offers
            this.setState({showConfirmModal: true});
        }else{
            // OPUSDEV-4085 Need else statement to correctly handle confirm/unconfirm on ui side only
            this.refreshRowData(typeOfReq, rowData);
        }

        // Promise gets handled after ui changes
        // This means that api can error out but not show anything on ui side
        let confirmPromise = this.Logic.confirmCase(confirmedCaseParams);
        try {
            let promiseResults = await confirmPromise;
            console.log("SUCCESS API: "+typeOfReq+"ed Position #: "+positionNbr);
            if(shouldRefreshWithAPICall){
                this.refreshRowDataWithApiCall(rowData);
            }else{
                if (promiseResults && promiseResults.length>=1) {
                    console.log(promiseResults);
                    this.refreshNoMatchRowData(typeOfReq, promiseResults[0], positionNbr);
                }
                this.dismissConfirmModal();
            }
        } catch(e) {
            console.log("ERROR: api call in 'confirm' in LinkPathPosition.jsx");
            console.log(e); 
            this.dismissConfirmModal();
        }
    }
 
    refreshRowDataWithApiCall = async (rowData) => {
        this.setState({showConfirmModal: true});

        // OPUSDEV-4086 Need to clear out name search filter
        let dtConfig = this.state.dataTableConfiguration;
        dtConfig.dataColumnFilters.columnStringMatch = {};
        this.Logic.dataTableConfiguration = dtConfig;

        let newRowData = await this.Logic.getFormattedRowDataFromServer([], true);
        if(rowData.originalData.tabName==="No Matches"){
            newRowData = this.Logic.noMatches.rowData;
        }else if(rowData.originalData.tabName==="Possible Matches"){
            newRowData = this.Logic.possibleMatches.rowData;
        }else if(rowData.originalData.tabName==="Good Match"){
            newRowData = this.Logic.goodMatches.rowData;
        }else if(rowData.originalData.tabName==="confirmed"){
            newRowData = this.Logic.confirmed.rowData;
        }
 
        // OPUSDEV-4082 Logic rowData is used for name search filter
        this.Logic.rowData = newRowData;

        this.setState({rowData: newRowData, originalRowData: newRowData, dataTableConfiguration: dtConfig});
        console.log("FINISH API CALL FOR DATA LOAD REFRESH");
        this.dismissConfirmModal();
    }
 
    refreshRowData = (typeOfReq, rowData) => {
        let tabRowData = this.state.originalRowData;
        let {tabName} = this.state;
 
        for(let each in tabRowData){
            if(tabRowData[each].uniqueKey===rowData.uniqueKey){
                // Remove from current row data
                tabRowData.splice(each, 1);
                this.setState({rowData: tabRowData});
                this.Logic[tabName].rowData = tabRowData;
 
                if(typeOfReq==="confirm"){
                    // Change tabName to confirmed
                    rowData.originalData.tabName = "confirmed";
 
                    //Insert into confirm row data
                    let confirmed = this.Logic.confirmed.rowData;
                    confirmed.push(rowData);
 
                    // Set Logic new rowData & tab lengths
                    this.Logic.confirmed.rowData = confirmed;
                    this.Logic.confirmed.length = this.Logic.confirmed.length + 1;
                    this.Logic[tabName].length = this.Logic[tabName].length - 1;
                    this.handleLengthStates("confirmed", tabName);
                    this.syncLogicAndViewStates();
                    console.log("FINISH UI SIDE FOR CONFIRM");
                }else{
                    // OPUSDEV-4086 Set matchName from confidenceLvl field in api
                    let matchName = "goodMatches";
                    if(rowData.originalData.confidenceLvl==="Medium"){
                        matchName = "possibleMatches";
                    }else if(rowData.originalData.confidenceLvl==="Low"){
                        matchName = "noMatches";
                    }
 
                    // change tabName for selected rowData
                    rowData.originalData.tabName = matchName;
 
                    // Find tab to push selected rowData into
                    let matchRowData = this.Logic[matchName].rowData;
                    matchRowData.push(rowData);
 
                    // Set Logic new rowData & tab lengths
                    this.Logic[matchName].rowData = matchRowData;
                    this.Logic[matchName].length = this.Logic[matchName].length + 1;
                    this.Logic.confirmed.length = this.Logic.confirmed.length - 1;
                    this.syncLogicAndViewStates();
                    console.log("FINISH UI SIDE FOR UNCONFIRM");
                }
                break;
            }
        }
    }
 
    refreshNoMatchRowData(typeOfReq, rowData, positionNbr){
        let tabRowData = this.state.rowData;
        let {tabName} = this.state;
        let checkAppointmentTab = false;

        // This works only if both appointments in in the same tab eg: {possibleMatches}
        for(let each in tabRowData){
            let ucPathPositionData = tabRowData[each].ucPathPosition;
            let linkPosition = ucPathPositionData[0];//.replace("Position #: ","");
            let positionNumber = linkPosition[0].replace("Position #: ","");
            if(positionNumber===positionNbr){
                // Remove from current row data
                tabRowData.splice(each, 1);
                this.setState({rowData: tabRowData});
                this.Logic[tabName].rowData = tabRowData;
 
                if(typeOfReq==="confirm"){
                    // Change tabName to confirmed
                    // rowData.originalData.tabName = "No Matches";
 
                    //Insert into confirm row data
                    let noMatches = this.Logic.noMatches.rowData;
                    noMatches.push(rowData);
 
                    // Set Logic new rowData & tab lengths
                    this.Logic.noMatches.rowData = noMatches;
                    this.Logic.noMatches.length = this.Logic.noMatches.length + 1;
                    this.Logic[tabName].length = this.Logic[tabName].length - 1;
                    this.handleLengthStates("No Matches", tabName);
                    checkAppointmentTab = true;
                    this.syncLogicAndViewStates();
                    console.log("FINISH UI SIDE FOR No Matches");
                }
                break;
            }
        }
        // If appointment is in different tab
        if(!checkAppointmentTab) {
            console.log("In check appointment tab block");
            //Insert into confirm row data
            let noMatches = this.Logic.noMatches.rowData;
            noMatches.push(rowData);
            if(tabName==="goodMatches"){
                tabName = "possibleMatches";
            } else if(tabName==="possibleMatches"){
                tabName = "goodMatches";
            }
            // Set Logic new rowData & tab lengths
            this.Logic.noMatches.rowData = noMatches;
            this.Logic.noMatches.length = this.Logic.noMatches.length + 1;
            this.Logic[tabName].length = this.Logic[tabName].length - 1;
            this.handleLengthStates("No Matches", tabName);
            checkAppointmentTab = true;
            this.syncLogicAndViewStates();
            console.log("FINISH UI SIDE FOR No Matches");
        }
    }
 
  /**
   *
   * @desc - Filter table data by tab click and then update state
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    handleLengthStates(addLengthValue, subtractLengthValue){
        let addLengthString = addLengthValue+"Length";
        let subtractLengthString = subtractLengthValue+"Length";
        this.setState({
            [addLengthString]: this.state[addLengthString]+1,
            [subtractLengthString]: this.state[subtractLengthString]-1,
        });
 
    }
 
    selectUCPathPosition = (evt, {rowData, mainRadioGroupIndex} = {}) => {
        let pathObject = {
            uniqueKey: rowData.uniqueKey,
            radioGroupIndex: mainRadioGroupIndex
        };
        this.setState({selectedPathPosition: pathObject});
    }
 
  /**
   *
   * @desc - Filter table data by tab click and then update state
   * @param {String} tabName -
   * @returns {void}
   *
   **/
    tabClick = (tabName) => {
        let matches = this.Logic[tabName];
        // let length = matches.length;
        this.changeVisibleColumns(tabName);
        let dataTableConfiguration = this.resetColumnFilters();
 
        let rowData = matches.rowData;
        rowData = this.Logic.filterAPITableData(rowData, dataTableConfiguration);
        let sortingTextOrder = this.Logic.getSortOrderText();
        this.Logic.rowData = rowData;
 
        this.setState({rowData, tabName, sortingTextOrder, originalRowData: rowData});
    }
 
  /**
   *
   * @desc - Changes visible columns based on tab click
   *
   **/
  changeVisibleColumns(tabName){
    let dtConfig = this.state.dataTableConfiguration;
    if(tabName==="noMatches" || tabName==="confirmed"){
        dtConfig.columnConfiguration.confirm.visible = false;
        this.state.tableConfiguration.rowHeight = 150;
        if(tabName==="confirmed"){
            dtConfig.columnConfiguration.unlink.visible = true;
            dtConfig.columnConfiguration.ucPathPosition.visible = true;
            dtConfig.columnConfiguration.ucPathPositionNoMatch.visible = false;
        }else{
            dtConfig.columnConfiguration.unlink.visible = false;
            dtConfig.columnConfiguration.ucPathPosition.visible = false;
            dtConfig.columnConfiguration.ucPathPositionNoMatch.visible = true;
        }
    }else if(tabName==="possibleMatches" || tabName==="goodMatches" || tabName==="multiMatch"){
        dtConfig.columnConfiguration.confirm.visible = true;
        dtConfig.columnConfiguration.unlink.visible = false;
        dtConfig.columnConfiguration.ucPathPosition.visible = true;
        dtConfig.columnConfiguration.ucPathPositionNoMatch.visible = false;
        if(tabName==="goodMatches"){
            this.state.tableConfiguration.rowHeight = 150;
        }else{
            this.state.tableConfiguration.rowHeight = (this.state.maxLinkPathPositionMatches*40)+300;
        }
    }
}
 
  /**
   *
   * @desc - Resets column sort order and string match
   *
   **/
    resetColumnFilters(){
        let dataTableConfiguration = this.state.dataTableConfiguration;
        dataTableConfiguration.dataColumnFilters.columnSortOrder = {fullName: "asc"};
        dataTableConfiguration.dataColumnFilters.columnStringMatch = {};
        this.setState({dataTableConfiguration});
        this.Logic.dataTableConfiguration = dataTableConfiguration;
        return dataTableConfiguration;
    }
 
  /**
   *
   * @desc - Renders the buttons you see above the datatable
   * @param {String} dataTableConfiguration - guess
   * @returns {JSX} - jsx for table buttons
   *
   **/
    updateRowDatafromDataTableConfiguration(dataTableConfiguration =
    this.Logic.dataTableConfiguration) {
        let rowData = this.Logic.filterAPITableData(this.state.originalRowData, dataTableConfiguration);
        let sortingTextOrder = this.Logic.getSortOrderText();
        this.setState({rowData, dataTableConfiguration, sortingTextOrder});
        return rowData;
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
 
        let {state: {tableConfiguration, rowData, resetNumber, error_message, sortingTextOrder,
      dataTableConfiguration, maxRowCount, shouldShowTab, noMatchesLength, possibleMatchesLength,
      goodMatchesLength, confirmedLength, multiMatchLength, showLoading}, tableClassName, resetTable,
      onMultiSelectClick, onSearchTextFilter, onToggleSelectAll, onClickSort, modalId} = this;
 
        return (
      <div className=" datatable-root ">
        <ShowIf show={!!this.pageTitle}>
          <h2>{this.pageTitle}</h2>
        </ShowIf>
        <ShowIf show={showLoading}>
            <div>Loading...</div>
        </ShowIf>
        <div className=" sorting-text ">{sortingTextOrder}</div>
        <p className=" error_message "> {error_message} </p>
        {this.getConfirmModal()}
        {this.getAPIResponseModal()}
        {this.getLinkManuallyModal()}
        {this.getSuccessModal()}
        {shouldShowTab?
        <Tabs defaultActiveKey="noMatches" id="matchesTabs" onSelect={this.tabClick}>
          <Tab eventKey="noMatches" title={"No Match - "+noMatchesLength}>
            <div />
          </Tab>
          <Tab eventKey="possibleMatches" title={"Possible Matches - "+possibleMatchesLength}>
            <div />
          </Tab>
          <Tab eventKey="goodMatches" title={"Good Matches - "+goodMatchesLength}>
            <div />
          </Tab>
          <Tab eventKey="confirmed" title={"Confirmed - "+confirmedLength}>
            <div />
          </Tab>
          <Tab eventKey="multiMatch" title={"MultiMatch - "+multiMatchLength}>
            <div />
          </Tab>
        </Tabs>
        :
        <Tabs defaultActiveKey="noMatches" id="matchesTabs" onSelect={this.tabClick}>
          <Tab eventKey="noMatches" title={"No Match - "+noMatchesLength}>
            <div />
          </Tab>
          <Tab eventKey="possibleMatches" title={"Possible Matches - "+possibleMatchesLength}>
            <div />
          </Tab>
          <Tab eventKey="goodMatches" title={"Good Matches - "+goodMatchesLength}>
            <div />
          </Tab>
          <Tab eventKey="confirmed" title={"Confirmed - "+confirmedLength}>
            <div />
          </Tab>
        </Tabs>
        }
        <span id="secretTab" hidden>
          <Tabs defaultActiveKey="" id="secretTabs" onSelect={this.tabClick} bsStyle={'pills'}>
 
          </Tabs>
        </span>
 
        <FixedDataTableComponent ref="datatable" key={resetNumber}
          {...{resetNumber, rowData, maxRowCount, tableConfiguration, resetTable,
            dataTableConfiguration, tableClassName, onMultiSelectClick, onClickSort,
            onToggleSelectAll, onSearchTextFilter, modalId}} />
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}