import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {DisplayTableHeader} from '../../common/components/elements/DisplayTables.jsx';

//My imports
import * as util from '../../../opus-logic/common/helpers';
import {EditIcon, CommentIcon} from '../../common/components/elements/Icon.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import EndowedChairSummary from '../../../opus-logic/cases/classes/endowed-chairs/EndowedChairSummary';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
// My imports tooltips for proposals summary
import {ToolTip} from '../../common/components/elements/ToolTip.jsx'
import {descriptions} from '../../../opus-logic/common/constants/Descriptions.js'
// My imports for comment modal
import CompensationSuccessModal from '../../cases-admin/CompensationSuccessModal.jsx';
import {CommentsModal, CommentTitle, CommentList, CommentTextArea, CommentSave,
  CommentBody} from "../../common/components/bootstrap/CommentComponents.jsx";
import { isNull } from 'lodash';
// My imports for endowed chair modal
import EndowedChairModal from '../../cases-admin/EndowedChairModal.jsx';


export default class EndowedChairSummaryPage extends React.Component {
  static propTypes = {
    endowedChairSummaryDataFromAPI: PropTypes.object,
    setEndowedChairSummaryDataAPIInGlobalState: PropTypes.func,
    // 7-6-2021 adding comments
    comments: PropTypes.array
  }

   //7-6-2021 comment modal
   static defaultProps = {
    uid: null,
    comments: []
  }
    /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Case Summary Wrapper
   *
   **/
  constructor(props) {
    super(props);
  }

  state = {
    endowedChairSummaryData: {},
    showEditModal: false,
    canEditEndowedChair: false,
    stringValue: null,
    showSuccessModal: false,
    comments: [],
    showCommentModal: false,
    isCommentSaveButtonDisabled: false,
    originalModalDropdownOptions: {},
    modalDropdownOptions: {},
    originalECSummaryData: {}
  };

  /**
   *
   * @desc -Start page off
   * @return {void}
   *
   **/
  componentWillMount = () => this.initEndowedChairSummary();

  /**
   *
   * @desc - Every time component receives new props rerender page
   * @return {void}
   *
   **/
  componentWillReceiveProps({endowedChairSummaryDataFromAPI}) {
    if(endowedChairSummaryDataFromAPI !== this.props.endowedChairSummaryDataFromAPI) {
      this.renderEndowedChairSummaryPageFromAPIData(endowedChairSummaryDataFromAPI);
    }
  }

  /**
   *
   * @desc - Every time it updates
   * @return {void}
   *
   **/
  componentDidUpdate() {
    util.initJQueryBootStrapToolTipandPopover();
  }

  //Class variables
  Logic = new EndowedChairSummary(this.props);

  /**
   *
   * @desc - takes a name and sets it as the title of the page
   * @param {String} name -
   * @return {void}
   *
   **/
  setPageTitleByName(name) {
    if(name) {
      document.title = name + ' - Endowed Chair Summary';
    }
  }

  /**
   *
   * @desc - Get formatted case summary data
   * @return {void} -
   *
   **/
  initEndowedChairSummary = async () => {
    let {endowedChairId} = util.getUrlArgs();

    let {endowedChairSummaryDataFromAPI} = this.props;

    //If we already have api data no need to get it again from the backend
    if(endowedChairSummaryDataFromAPI) {
      this.renderEndowedChairSummaryPageFromAPIData(endowedChairSummaryDataFromAPI, endowedChairId);
    } else if(endowedChairId) {
      this.setState({endowedChairId});
      endowedChairSummaryDataFromAPI = await this.Logic.getEndowedChairSummaryData(endowedChairId);
      this.renderEndowedChairSummaryPageFromAPIData(endowedChairSummaryDataFromAPI);
      this.getEndowedChairObject(endowedChairSummaryDataFromAPI);
    }
    this.crudPermissions();
  }

  crudPermissions(){
    let canEditEndowedChair = this.Logic.canEditEndowedChair();
    this.setState({canEditEndowedChair});
  }

    /**
    *
    * @desc - Renders the page starting from the arguments given
    * @param {Object} endowedChairSummaryDataFromAPI - straight from API
    * @param {String} endowedChairId - id of case were working on
    *
    **/
  renderEndowedChairSummaryPageFromAPIData(endowedChairSummaryDataFromAPI) {

    let clonedEndowedChairSummaryData = util.cloneObject(endowedChairSummaryDataFromAPI);
    // Format data (dates, currency, etc)
    let endowedChairSummaryData = this.formatData(clonedEndowedChairSummaryData);

    let commentCount = endowedChairSummaryData.commentsCounter;

    this.getEndowedChairComments(endowedChairSummaryData);
    
    //Values for tables and modals
    this.setState({renderTables: true, endowedChairSummaryData, endowedChairSummaryDataFromAPI,
      clonedEndowedChairSummaryData: clonedEndowedChairSummaryData.endowedChair, commentCount, originalECSummaryData: util.cloneObject(clonedEndowedChairSummaryData.endowedChair)});
  }


  formatData = (clonedEndowedChairSummaryData) => {
    // Clone main data object
    let endowedChairSummaryData = util.cloneObject(clonedEndowedChairSummaryData.endowedChair);

    // Set date fields correctly
    endowedChairSummaryData.dateEstablished = endowedChairSummaryData.dateEstablished ? moment(endowedChairSummaryData.dateEstablished).format('L') : null;
    endowedChairSummaryData.dateDisestablished = endowedChairSummaryData.dateDisestablished ? moment(endowedChairSummaryData.dateDisestablished).format('L') : null;
    // IOK-1455 Exception handler for Unknown
    if(endowedChairSummaryData.lastOccupiedDate && endowedChairSummaryData.lastOccupiedDate!=="Unknown"){
      endowedChairSummaryData.lastOccupiedDate = moment(endowedChairSummaryData.lastOccupiedDate).format('L');
    }else if(endowedChairSummaryData.lastOccupiedDate==="Unknown"){

    }else{
      endowedChairSummaryData.lastOccupiedDate = null;
    }

    return endowedChairSummaryData;
  }

  setEditedData = (promise, stringValue) => {
    let {endowedChairId} = util.getUrlArgs();
    this.renderEndowedChairSummaryPageFromAPIData(promise, endowedChairId);
    this.setState({showEditModal: false, showSuccessModal: true, stringValue})
  }

  /**
   *
   * @desc - Gets comments from api and sets in state to rerender
   * @param {String} adminCompId - Gets comments from api and sets in state to rerender
   * @return {JSX} - Final Decision Comment Modal
   *
   **/

   async getEndowedChairComments(endowedChairSummaryData) {
    this.setState({comments: []});
    let {endowedChairId} = util.getUrlArgs();
    let comments = await this.Logic.getEndowedChairComments(endowedChairId);
    this.setState({comments, commentCount: comments.length});
  }

  /**
    *
    * @desc - Filter table data by tab click and then update state
    * @param {String} tabName -
    * @returns {void}
    *
    **/
  getEndowedChairObject = async (endowedChairSummaryDataFromAPI) => {
    let endowedChairStatusId;
    if(endowedChairSummaryDataFromAPI.endowedChair && endowedChairSummaryDataFromAPI.endowedChair.endowedChairStatusId){
      endowedChairStatusId = endowedChairSummaryDataFromAPI.endowedChair.endowedChairStatusId;
    }
    let endowedChairAPIResults =  await this.Logic.getEndowedChairObject(endowedChairStatusId);
    let originalModalDropdownOptions = {

    }
    let modalDropdownOptions = {
        fundingType: [],
        termRenewable: [],
        chairType: [],
        chairStatus: []
    };
    // let modalData = util.cloneObject(endowedChairAPIResults.endowedChairInfo);

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
    this.setState({originalModalDropdownOptions, modalDropdownOptions});
}



/******************************************************************************
 *
 * @desc - Edit Modal
 *
 ******************************************************************************/

  showEditModal = () => {
    this.setState({showEditModal: true});
  }

  hideEditModal = () => {
    this.setState({showEditModal: false});
    this.resetModalData();
  }

  getEditModal = () => {
    let {showEditModal, originalModalDropdownOptions, modalDropdownOptions, clonedEndowedChairSummaryData} = this.state;
    return <EndowedChairModal {...{showModal: showEditModal, originalModalDropdownOptions, modalDropdownOptions, modalData: clonedEndowedChairSummaryData }}
      Logic={this.Logic} hideEndowedModal={this.hideEditModal} handleSave={this.handleSave} comingFrom={"summary"}/>;
  }

  handleSave = async (endowedChairId) => {
    this.hideEditModal();
    this.setState({showSuccessModal: true});
    let endowedChairSummaryDataFromAPI = await this.Logic.getEndowedChairSummaryData(endowedChairId);
    this.renderEndowedChairSummaryPageFromAPIData(endowedChairSummaryDataFromAPI);
  }

  resetModalData = () => {
    let {originalECSummaryData} = this.state;
    this.setState({clonedEndowedChairSummaryData: util.cloneObject(originalECSummaryData)});
  }

    /**
   *
   * @desc - Hide comment modal
   * @return {void}
   *
   **/
  onCommentModalHide = () => this.setState({showCommentModal: false});

  /**
   *
   * @desc - Reset comment to empty in text area and show comment modal
   * @return {void}
   *
   **/
  showCommentModal = () => this.setState({ecComments: "",
    showCommentModal: true});

  /**
   *
   * @desc - Gets comments from api and sets in state to rerender
   * @param {Event} evt - Event from clicking in the comment text area
   * @return {void}
   *
   **/
  onChangeComment = (evt) => {
        this.setState({ecComments: evt.target.value});
    }

  /**
  *
  * @desc - Saves final decision comment and refreshes the comments
  * @return {void}
  *
  **/
  saveComment = async () => {
    let commentsText = this.state.ecComments;
    let {props: {endowedChairSummaryData}} = this;
    let {endowedChairId} = util.getUrlArgs();
    this.setState({isCommentSaveButtonDisabled: true});

    //7-21-2021 not allow save blank comment
    if (commentsText.length>0){
    let commentPromise = this.Logic.saveEndowedChairComment(commentsText, endowedChairId );

    try{
      await commentPromise;
    } catch(e) { //If it fails show error modal and close comment modal
      console.log("ERROR: api call in 'saveComment' in EndowedChairSummaryPage.jsx")
      console.log(e)
      this.setState({failurePromise: commentPromise, showCommentModal: false});
    }
    this.getEndowedChairComments();
    this.setState({ecComments: '', isCommentSaveButtonDisabled: false});

   }else{
    this.getEndowedChairComments();
    this.setState({ecComments: '', isCommentSaveButtonDisabled: false});
   }
  }
  /**
   *
   * @desc - Gets the modal from clicking on the commont icon on the table
   * @return {JSX} - Final Decision Comment Modal
   *
   **/
  getCommentModal() {
      let {state: {comments, isCommentSaveButtonDisabled, ecComments:
    value}, onChangeComment} = this;
      return (
    <CommentsModal show={this.state.showCommentModal}
      {...{onHide: this.onCommentModalHide}}>
      <CommentTitle>Endowed Chair Comments </CommentTitle>      
      <CommentBody>     
        <ShowIf show={this.state.canEditEndowedChair}>
          <CommentTextArea {...{value, maxCount: 250}}
            onChange={onChangeComment} />
        </ShowIf> 
        <ShowIf show={this.state.canEditEndowedChair}>
          <CommentSave disabled={isCommentSaveButtonDisabled}
            onClick={this.saveComment} />   
        </ShowIf>        
         <br />
        <CommentList {...{comments}} />
      </CommentBody>    
    </CommentsModal>);
  }
  /**
   *
   * @desc - Shows the danger modal for success
   * @returns {JSX}
   *
   **/
   getSuccessModal({showSuccessModal, stringValue,
     comingFromDatatable} = this.state) {
     return <CompensationSuccessModal {...{showSuccessModal: showSuccessModal,
             stringValue, comingFromDatatable, compensationStringValue: 'save'}}
             changeStateOfSuccessModal={this.changeStateOfSuccessModal} />;
   }

   changeStateOfSuccessModal = async () => {
     // Dismissing success Modal changes state of success modal in parent
     // to disable success modal from showing twice due to formatting completed cases datatable
     this.setState({showSuccessModal: false});

     // Refresh datatable
     // let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true, false);
     // this.setState({rowData, sortingTextOrder, maxRowCount});
   }




  /*****************************************************************************
   *
   * @name Render Page
   * @desc -
   *
   *****************************************************************************/

  render() {
    let {state: {renderTables, endowedChairSummaryData}} = this;
    let getEditModal = this.getEditModal();
    let getSuccessModal = this.getSuccessModal();
    let getCommentModal = this.getCommentModal();
    if(!renderTables) {
      return null;
    }

    return (
      <div>
        <div className="page-header">
        <h1> <img src="../images/endowed-chairs.png" alt="report icon"/> &nbsp; &nbsp; {endowedChairSummaryData.endowedChairName} </h1>
        </div>
        {getEditModal}
        {getCommentModal}
        <div className="col-md-6">
        <h2> Chair Overview </h2>
        <table className=' table table-bordered table-responsive'>
              <DisplayTableHeader>
              {endowedChairSummaryData.endowedChairName}&nbsp;({endowedChairSummaryData.endowedChairStatus})
              <CommentIcon onClick={this.showCommentModal} placeholder={this.state.commentCount} position={null} className={'button edit-icon icon-pencil edit-case-button'} className1={'comment-icon-container'} className2={'comment-icon-centered'} />
                <ShowIf show={this.state.canEditEndowedChair}>
                  <EditIcon {...{onClick: this.showEditModal}} position={null} className={'button edit-icon icon-pencil edit-case-button'}/>
                </ShowIf>
              </DisplayTableHeader>
              <tbody>
                <tr>
                  <td className='label-column' colSpan={2}><b> Location</b></td>
                </tr>
                <ShowIf show={endowedChairSummaryData.school != 'N/A'}>
                <tr>
                  <td className='label-column' width={200} > School </td>
                  <td className='label-column' >
                    {endowedChairSummaryData.school ? endowedChairSummaryData.school : null}
                  </td>
                </tr>
                </ShowIf>
                <ShowIf show={endowedChairSummaryData.division != 'N/A'}>
                <tr>
                  <td className='label-column'>
                    Division
                  </td>
                  <td className='label-column'>
                    {endowedChairSummaryData.division ? endowedChairSummaryData.division : null}
                  </td>
                </tr>
                </ShowIf>
                <ShowIf show={endowedChairSummaryData.department != 'N/A'}>
                <tr>
                  <td className='label-column'>
                    Department
                  </td>
                  <td className='label-column'>
                    {endowedChairSummaryData.department ? endowedChairSummaryData.department : null}
                  </td>
                </tr>
                </ShowIf>
                <ShowIf show={endowedChairSummaryData.area != 'N/A'}>
                <tr>
                  <td className='label-column'>
                    Area <ToolTip text={descriptions.area} placement="right" />
                  </td>
                  <td className='label-column'>
                    {endowedChairSummaryData.area ? endowedChairSummaryData.area : null}
                  </td>
                </tr>
                </ShowIf>
                <tr>
                  <td className='label-column'>
                    Organization Name <ToolTip text={descriptions.orgName} placement="right" />
                  </td>
                  <td className='label-column'>
                    {endowedChairSummaryData.organizationName ? endowedChairSummaryData.organizationName : null}
                  </td>
                </tr>

                <tr>
                    <td colSpan={2}><b> Chair Details</b></td>
                </tr>
                <tr>
                    <td>
                      Status <ToolTip text={descriptions.chairStatus} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.endowedChairStatus ? endowedChairSummaryData.endowedChairStatus : null}
                    </td>
                </tr>
                <tr>
                    <td>
                      Date Established <ToolTip text={descriptions.dateEstablished} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.dateEstablished ? endowedChairSummaryData.dateEstablished : null}
                    </td>
                </tr>
                <ShowIf show={!isNull(endowedChairSummaryData.dateDisestablished)}>
                <tr>
                    <td>
                      Date Disestablished <ToolTip text={descriptions.dateDisestablished} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.dateDisestablished ? endowedChairSummaryData.dateDisestablished : null}
                    </td>
                </tr>
                </ShowIf>
                <tr>
                    <td>
                      Chair Type <ToolTip text={descriptions.chairTypeForTable} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.endowedChairType ? endowedChairSummaryData.endowedChairType : null}
                    </td>
                </tr>
                <tr>
                    <td>
                      Chair Term <ToolTip text={descriptions.chairTerm} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.endowedChairTerm ? endowedChairSummaryData.endowedChairTerm : null}
                    </td>
                </tr>
                <tr>
                    <td>
                      Term Renewable<ToolTip text={descriptions.termRenewableForTables} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.endowedChairTermRenewable}
                    </td>
                </tr>
                <tr>
                    <td>
                      Funding Type <ToolTip text={descriptions.fundingTypeForTables} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.endowedChairFundingType}
                    </td>
                </tr>
                <tr>
                    <td>
                      Designation <ToolTip text={descriptions.designation} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.designation ? endowedChairSummaryData.designation : null}
                    </td>
                </tr>
                <tr>
                    <td>
                      Date Chair Last Vacated <ToolTip text={descriptions.lastOccupied} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.lastOccupiedDate ? endowedChairSummaryData.lastOccupiedDate : null}
                    </td>
                </tr>
                <tr>
                    <td>
                      # Years Unoccupied <ToolTip text={descriptions.yearsUnoccupied} placement="right" />
                    </td>
                    <td>
                      {endowedChairSummaryData.yearsUnoccupied ? endowedChairSummaryData.yearsUnoccupied : null}
                    </td>
                </tr>
              </tbody>
            </table>
            </div>
        {getSuccessModal}
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
