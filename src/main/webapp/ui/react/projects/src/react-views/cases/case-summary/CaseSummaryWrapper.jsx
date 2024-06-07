import React from 'react';
import PropTypes from 'prop-types';

//My imports
import CaseSummaryPage from './CaseSummaryPage.jsx';
import {RecommendationsPage} from '../state-containers';
import * as util from '../../../opus-logic/common/helpers/';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions';
import OffScaleReport from '../off-scale-report/OffScaleReport.jsx';
import ReviewProcess from '../review-process/ReviewProcessPage.jsx';
import CAPVoteBoard from '../cap-vote-board/CAPVoteBoardPage.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import CaseSummary from '../../../opus-logic/cases/classes/case-summary/CaseSummary';
import DeleteOrWithdrawCase from '../../../opus-logic/cases-admin/DeleteOrWithdrawCase';
import APIFailureModal from '../../cases-admin/APIFailureModal.jsx';
import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import DeleteOrWithdrawCaseModal from '../../cases-admin/DeleteOrWithdrawCaseModal.jsx';
import DeleteOrWithdrawCaseFromInterfolioModal from '../../cases-admin/DeleteOrWithdrawCaseFromInterfolioModal.jsx';
import CasesAdminSuccessModal from '../../cases-admin/CasesAdminSuccessModal.jsx';
import CasesAdminDeleteModal from '../../cases-admin/CasesAdminDeleteModal.jsx';
import {urls} from '../../common/constants/ComponentConstants'
/**
 *
 * @desc - Outside border of the case summary page that sections of sidebar
 *  and main page
 * @param {Object} - fullName, uid, and type of action for this case
 * @return {JSX}  - outer covering of Case Summary Page
 *
**/
const OutsideBorder = (props) => {
  return (
    <div>
      <div>
        <ul className=" nav nav-tabs case-no-bottom-border" role="tablist">
          <li role="presentation">
            <a role="tab" className=" color-gray case-round-top">
              <ul className="case-tab">
                <li>
                  <img src="../images/case-med.png" className="hidden-print"/> &nbsp; &nbsp;
                  <span className=" med-gray black">
                    {props.fullName} &nbsp; &nbsp;
                  </span>
                </li>
              </ul>
            </a>
          </li>
        </ul>
      </div>

      <div className="row-fluid color-gray case-padding-left case-round-right-top">
        {props.actionTypeDisplayText}
        <ShowIf show={props.showButton==='yes'}>
           <button type="button" className="btn btn-primary btn-sm right margin-right-20 margin-top-5 hidden-print"
             onClick={props.showDeleteOrWithdrawCaseModal}>
             Delete/Withdraw <ToolTip text={descriptions.deleteAndWithdraw} placement={"left"}/>
           </button>
        </ShowIf>
        <ShowIf show={props.showButton==='deleteOnly'}>
           <button type="button" className="btn btn-primary btn-sm right margin-right-20 margin-top-5 hidden-print"
             onClick={props.showDeleteOrWithdrawCaseModal}>
             Delete <ToolTip text={descriptions.delete} placement={"left"}/>
           </button>
        </ShowIf>
      </div>
    </div>
  );
};
OutsideBorder.propTypes = {
  fullName: PropTypes.string,
  uid: PropTypes.string,
  actionTypeDisplayText: PropTypes.string,
  showButton: PropTypes.string,
  showDeleteOrWithdrawCaseModal: PropTypes.func
};

/**
 *
 * @desc - Outside wrapper and sidebar for case summar page
 * @return {JSX} - Case Summary Page
 *
**/
export default class CaseSummaryWrapper extends React.Component {
  static propTypes = {
    adminData: PropTypes.object.isRequired,
    appointeeInfo: PropTypes.object,
    caseSummaryDataFromAPI: PropTypes.object
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
    this.changeStateOfDeleteOrWithdrawModal = this.changeStateOfDeleteOrWithdrawModal.bind(this);
    this.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal = this.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal.bind(this);
    this.changeStateOfCasesAdminDeleteModal = this.changeStateOfCasesAdminDeleteModal.bind(this);
    this.changeStateOfSuccessModal = this.changeStateOfSuccessModal.bind(this);
  }

  state = {
    activePage: 'caseSummary',
    showDeleteOrWithdrawButton: 'no',
    showDeleteOrWithdrawCaseModal: false,
    showDeleteOrWithdrawCaseFromInterfolioModal: false,
    showCasesAdminDeleteModal: false,
    showSuccessModal: false,
    isDeleteOrWithdrawButtonDisabled: false
  };

  /**
   *
   * @desc - initializes sidebar and get url arguments on mount
   * @return {void}
   *
   **/
  componentWillMount() {
    this.initPage();
  }

  /**
   *
   * @desc - Reloads case summary page
   * @param {Object} caseSummaryDataFromAPI - props for this Component
   * @return {void}
   *
   **/
  componentWillReceiveProps = ({caseSummaryDataFromAPI}) => {
    if(caseSummaryDataFromAPI) {
      this.setWrapperConstantsFromCaseSummaryData(caseSummaryDataFromAPI);
      // The 2 conditions: one for completed cases and one for withdrawn cases
      if (caseSummaryDataFromAPI.opusCaseInfo.caseLocation !== 'Completed' &&
        caseSummaryDataFromAPI.actionDataInfo[0].actionStatusId!==3) {
        this.setState({showDeleteOrWithdrawButton: 'yes'});
      }else if(caseSummaryDataFromAPI.actionDataInfo[0].actionStatusId===3){
        this.setState({showDeleteOrWithdrawButton: 'deleteOnly'});
      }else{
        this.setState({showDeleteOrWithdrawButton: 'no'});
      }
    }
  }

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  Logic = new CaseSummary(this.props);
  DeleteOrWithdrawCaseLogic = new DeleteOrWithdrawCase(this.props);

  /**
   *
   * @desc - Start page off
   * @return {void}
   *
   **/
  initPage() {
    this.setViewStatuses();
    //this.getSideBarLinks();
    this.setPageFromUrl();
  }

  /**
   *
   * @desc - Set view permissions for pages like Recommendations and CAP Vote Board
   * @return {void}
   *
   **/
  setViewStatuses() {
    let canViewRecommendations = this.Logic.canViewRecommendations();
    let canViewCAPVoteBoard = this.Logic.canViewCAPVoteBoard();
    this.setState({canViewRecommendations, canViewCAPVoteBoard});
  }

  /**
   *
   * @desc - Gets proposed status fields
   * @param {Object} caseSummaryDataFromAPI - props for this Component
   * @return {void}
   *
   **/
  setWrapperConstantsFromCaseSummaryData(caseSummaryDataFromAPI) {
    let {appointeeInfo: {fullName, uid}, actionDataInfo} = caseSummaryDataFromAPI;
    let {actionTypeDisplayText} = actionDataInfo[0].actionTypeInfo;
    this.setState({fullName, uid, actionTypeDisplayText});
  }

  /**
   *
   * @desc - Class variables
   *
   **/
  //Permissions = new Permissions(this.props.adminData);
  sideBar = {
    caseSummary: {
      name: 'caseSummary',
      title: 'Case Summary',
      Page: CaseSummaryPage
    },
    offScaleReport: {
      name: 'offScaleReport',
      title: 'Off Scale Report',
      Page: OffScaleReport
    },
    recommendation: {
      name: 'recommendation',
      title: 'Recommendations',
      Page: RecommendationsPage
    },
    reviewProcess: {
      name: 'reviewProcess',
      title: 'Review Process',
      Page: ReviewProcess
    },
    capVoteBoard: {
      name: 'capVoteBoard',
      title: 'CAP Vote Board',
      Page: CAPVoteBoard
    }
  }

  /**
   *
   * @desc - css says if link should be bolded if matching current page
   * @param {String} page - which page we are in
   * @return {void}
   *
   **/
  getUIClass = (page) => {
    let {activePage} = this.state;
    return page === activePage ? 'strong' : null;
  }

  /**
   *
   * @desc - get sidebar links for this page
   * @return {void}
   *
   **/
  getSideBarLinks() {
    let onClick = this.onClickGetPageFromSideBar;
    let {getUIClass: ui} = this;

    return (
      <ul id="leftnav" className="nav nav-pills nav-stacked">
        <li className={` ${ui('caseSummary')} sidebar-link `}>
          <a {...{name: 'caseSummary', onClick}} href="#"> Case Summary </a>
        </li>
        <li className={` ${ui('offScaleReport')} sidebar-link `}>
          <a {...{name: 'offScaleReport', onClick}} href="#">Off-Scale Report</a>
        </li>
        <li className={` ${ui('reviewProcess')} sidebar-link `}>
          <a {...{name: 'reviewProcess', onClick}} href="#"> Review Process </a>
        </li>
        <ShowIf show={this.state.canViewRecommendations}>
          <li className={` ${ui('recommendation')} sidebar-link `}>
            <a {...{name: 'recommendation', onClick}} href="#">Recommendations</a>
          </li>
        </ShowIf>
        <ShowIf show={this.state.canViewCAPVoteBoard}>
          <li className={` ${ui('capVoteBoard')} sidebar-link `}>
            <a {...{name: 'capVoteBoard', onClick}} href="#">CAP Vote Board</a>
          </li>
        </ShowIf>
      </ul>);
  }

  /**
   *
   * @desc - Chooses the page on start. Defaults to Profile if none specified
   *  or if the page given is not valid
   * @return {void}
   *
   **/
  setPageFromUrl() {
    let {view = 'caseSummary', page = view} = util.getUrlArgs();
    let {[page]: {Page} = {}} = this.sideBar;
    let {Page: DefaultPage} = this.sideBar.caseSummary;
    this.setState({Page: Page || DefaultPage}); //CaseSummaryPage
  }

  /**
  *
  * @desc - Gets Case Summary, Recommendation, or Review Process
  * @return {void}
  *
  **/
  getPage() {
    return CaseSummaryPage;
  }

  /**
   *
   * @desc - Switch between 8 year, exellence clock, academic history & profile
   * @param {Object} evt -
   * @return {Object} formattedResults - results ready made for autocomplete
   *
   **/
  onClickGetPageFromSideBar = (evt) => {
    let {name} = evt.target;
    let {Page} = this.sideBar[name];
    this.setState({Page, activePage: name});
  }

  /******************************************************************************
   *
   * @desc - Delete/Withdraw functions
   *
   ******************************************************************************/

  /**
   *
   * @desc - This will show the delete/withdraw modal
   * @returns {void}
   *
   **/
  showDeleteOrWithdrawCaseModal = () => {
    this.setState({showSuccessModal: false,
    showCasesAdminDeleteModal: false,
    showDeleteOrWithdrawCaseFromInterfolioModal: false})
    if(this.state.showDeleteOrWithdrawButton==='deleteOnly'){
      this.setState({deleteOnly: true})
    }
    // Need to format data due to data being pulled in being different from completedCases
    let effectiveDate = this.props.caseSummaryDataFromAPI.actionDataInfo[0].effectiveDt;
    let effectiveType = 'approved';
    if(!effectiveDate){
      effectiveDate = this.props.caseSummaryDataFromAPI.actionDataInfo[0].proposedEffectiveDt;
      effectiveType = 'proposed';
    }
    let formattedData = {fullName: this.props.caseSummaryDataFromAPI.appointeeInfo.fullName,
      actionType: this.props.caseSummaryDataFromAPI.actionDataInfo[0].actionTypeInfo.actionTypeDisplayText,
      effectiveTypeForDisplayInModal: effectiveType, effectiveDateForDisplayInModal: effectiveDate
    }
    // Checks for linked actions in interfolio case
    // and attaches formatted info
    if(this.props.caseSummaryDataFromAPI.actionLinkedToByCCase){
      formattedData.actionLinkedToByCCase
      = this.DeleteOrWithdrawCaseLogic.formatActionsLinkedToByCCase(this.props.caseSummaryDataFromAPI.actionLinkedToByCCase);
    }
    // If more than one appointment for a case, find primary appointment
    if(this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId
      && this.props.caseSummaryDataFromAPI.actionDataInfo.length===1){
        formattedData.unitValueForDisplayInModal = this.props.caseSummaryDataFromAPI.actionDataInfo[0].appointmentInfo.academicHierarchyInfo.ahName;
      }else if(this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId
        && this.props.caseSummaryDataFromAPI.actionDataInfo.length>1){
          let caseData = this.props.caseSummaryDataFromAPI.actionDataInfo;
          for(let index in caseData){
            if (caseData[index].appointmentInfo.affiliationType.affiliation === 'Primary') {
              formattedData.unitValueForDisplayInModal = caseData[index].appointmentInfo.academicHierarchyInfo.ahName;
              break;
            }
          }
      }
    formattedData.caseLocationForDisplayInModal = this.props.caseSummaryDataFromAPI.opusCaseInfo.caseLocation;
    let adminName= this.Logic.adminData.adminName;
    let adminFirstName= this.Logic.adminData.adminFirstName;
    this.setState({showDeleteOrWithdrawCaseModal: true,
    deleteOrWithdrawData: formattedData, adminName, adminFirstName});
  }

  deleteOrWithdrawCase = (DeleteOrWithdrawSelection) => {
    this.setState({deleteOrWithdrawSelection: DeleteOrWithdrawSelection,
      showDeleteOrWithdrawCaseModal: false})
    // First checks to see if it attached to an interfolio case
    if(this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId){
      this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: true});
    }else{
      // If not, then proceed with either delete danger modal or
      // go forward with deleteOrWithdrawOpusCaseAndInterfolioCase
      // if(DeleteOrWithdrawSelection==="delete"){
        this.setState({showCasesAdminDeleteModal: true})
      // }else{
      //   this.deleteOrWithdrawOpusCaseAndInterfolioCase("withdrawJustOpusCase", DeleteOrWithdrawSelection)
      // }
    }
  }

  /**
   *
   * @desc - Intermediary to send to the logic class to delete this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
  interfolioSelection = (interfolioSelection) => {
    this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: false});
    // if(this.state.deleteOrWithdrawSelection==="delete"){
        this.setState({showCasesAdminDeleteModal: true, interfolioSelection: interfolioSelection})
    // }else{
    //     this.deleteOrWithdrawOpusCaseAndInterfolioCase(interfolioSelection, this.state.deleteOrWithdrawSelection)
    // }

  }

  /**
   *
   * @desc - Intermediary to send to the logic class to delete this case
   * @param {Object} rowData - data of specific case
   * @returns {void}
   **/
  deleteOrWithdrawOpusCaseAndInterfolioCase = async (comments) => {
    //Must disable buttons to ensure no double/triple saves
    this.setState({isDeleteOrWithdrawButtonDisabled: true})

    // Set local variables from state
    let DeleteOrWithdrawSelectionLocal = this.state.deleteOrWithdrawSelection;
    let DeleteOrWithdrawInterfolioCaseSelectionLocal = this.state.interfolioSelection;

    // //  withdraw with no interfolio case
    // if(DeleteOrWithdrawInterfolioCaseSelection === 'withdrawJustOpusCase'
    //   || (DeleteOrWithdrawSelection === 'withdraw' && DeleteOrWithdrawInterfolioCaseSelection === 'no')){
    //   DeleteOrWithdrawSelectionLocal = DeleteOrWithdrawSelection;
    //   DeleteOrWithdrawInterfolioCaseSelectionLocal = 'no';
    // }
    //
    // // withdraw with interfolio case
    // if(DeleteOrWithdrawInterfolioCaseSelection === 'yes'
    //   && DeleteOrWithdrawSelection === 'withdraw') {
    //   DeleteOrWithdrawInterfolioCaseSelectionLocal = DeleteOrWithdrawInterfolioCaseSelection;
    //   DeleteOrWithdrawSelectionLocal = DeleteOrWithdrawSelection;
    // }

    let formattedData = {
      originalData: {
        caseId: this.props.caseSummaryDataFromAPI.opusCaseInfo.caseId,
        bycPacketId: this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId
      }
    }
    //Delete row and get promise back
    let deletePromise = this.DeleteOrWithdrawCaseLogic.deleteOrWithdrawCase(
      formattedData, DeleteOrWithdrawInterfolioCaseSelectionLocal,
      DeleteOrWithdrawSelectionLocal, comments);

    try {
      await deletePromise;
      this.setState({showSuccessModal : true})
    } catch(e) {
      console.log("ERROR: api call in 'deleteOrWithdrawOpusCaseAndInterfolioCase' in CaseSummaryWrapper.jsx")
      this.setState({promise: deletePromise});
    }

    // Enable buttons and Dismiss modals from wherever you're coming from
    this.setState({isDeleteOrWithdrawButtonDisabled: false,
    showDeleteOrWithdrawCaseFromInterfolioModal: false,
    showCasesAdminDeleteModal: false,
    showDeleteOrWithdrawCaseModal: false});
  }


  changeStateOfDeleteOrWithdrawModal(){
    this.setState({showDeleteOrWithdrawCaseModal: false});
  }

  changeStateOfDeleteOrWithdrawCaseFromInterfolioModal(){
    this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: false});
  }

  changeStateOfCasesAdminDeleteModal(){
    this.setState({showCasesAdminDeleteModal: false});
  }

  changeStateOfSuccessModal(){
    this.setState({showSuccessModal: false});
    let url = urls.activeCases;
    if(this.props.caseSummaryDataFromAPI.actionDataInfo[0].actionStatusId===3){
      url = urls.withdrawnCases;
    }
    window.location = url;
  }

  back(selection){
    if(selection==="interfolio"){
      this.setState({
        showDeleteOrWithdrawCaseModal: true,
        showDeleteOrWithdrawCaseFromInterfolioModal: false
      })
    }else if(selection==="danger" && this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId){
      this.setState({
        showDeleteOrWithdrawCaseFromInterfolioModal: true,
        showCasesAdminDeleteModal: false
      })
    }else if(selection==="danger" && !this.props.caseSummaryDataFromAPI.opusCaseInfo.bycPacketId){
      this.setState({
        showDeleteOrWithdrawCaseModal: true,
        showCasesAdminDeleteModal: false
      })
    }
  }

  /**
   *
   * @desc - Shows the modal alert for delete/withdraw case
   * @returns {JSX}
   *
   **/
   getDeleteOrWithdrawCaseModal({showDeleteOrWithdrawCaseModal,
     deleteOrWithdrawData, isDeleteOrWithdrawButtonDisabled, deleteOnly} = this.state) {
     return <DeleteOrWithdrawCaseModal {...{showDeleteOrWithdrawCaseModal,
       deleteOrWithdrawData, isDeleteOrWithdrawButtonDisabled, deleteOnly}}
               changeStateOfDeleteOrWithdrawModal={this.changeStateOfDeleteOrWithdrawModal}
               deleteOrWithdrawCase={(DeleteOrWithdrawSelection) =>
               this.deleteOrWithdrawCase(DeleteOrWithdrawSelection)}/>;
   }

   /**
  *
  * @desc - Shows the modal alert for delete/withdraw conneceted to an interfolio case
  * @returns {JSX}
  *
  **/
  getDeleteOrWithdrawCaseFromInterfolioModal({showDeleteOrWithdrawCaseFromInterfolioModal,
    deleteOrWithdrawData, deleteOrWithdrawSelection, isDeleteOrWithdrawButtonDisabled} = this.state) {
    return <DeleteOrWithdrawCaseFromInterfolioModal {...{showDeleteOrWithdrawCaseFromInterfolioModal,
      deleteOrWithdrawData, deleteOrWithdrawSelection, isDeleteOrWithdrawButtonDisabled}}
              changeStateOfDeleteOrWithdrawCaseFromInterfolioModal={this.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal}
              interfolioSelection={(DeleteOrWithdrawInterfolioCaseSelection) =>
              this.interfolioSelection(DeleteOrWithdrawInterfolioCaseSelection)}
              back={() => this.back("interfolio")}
            />;
  }

  /**
   *
   * @desc - Shows the danger modal for delete
   * @returns {JSX}
   *
   **/
   getCasesAdminDeleteModal({showCasesAdminDeleteModal, isDeleteOrWithdrawButtonDisabled, deleteOrWithdrawData, adminName, adminFirstName} = this.state) {
     return <CasesAdminDeleteModal {...{showCasesAdminDeleteModal, isDeleteOrWithdrawButtonDisabled, deleteOrWithdrawData, adminName, adminFirstName}}
               changeStateOfCasesAdminDeleteModal={this.changeStateOfCasesAdminDeleteModal}
               deleteOrWithdrawOpusCaseAndInterfolioCase={this.deleteOrWithdrawOpusCaseAndInterfolioCase}
               deleteOrWithdrawSelection={this.state.deleteOrWithdrawSelection}
               interfolioSelection={this.state.interfolioSelection}
               back={() => this.back("danger")}
             />;
   }

   /**
    *
    * @desc - Shows the danger modal for delete
    * @returns {JSX}
    *
    **/
    getCasesAdminSuccessModal({showSuccessModal, deleteOrWithdrawSelection} = this.state) {
      return <CasesAdminSuccessModal {...{showSuccessModal, casesAdminTypeStringValue: deleteOrWithdrawSelection}}
                changeStateOfSuccessModal={this.changeStateOfSuccessModal} />;
    }

  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
  render() {
    let getDeleteOrWithdrawCaseModal = this.getDeleteOrWithdrawCaseModal();
    let getDeleteOrWithdrawCaseFromInterfolioModal = this.getDeleteOrWithdrawCaseFromInterfolioModal();
    let getCasesAdminDeleteModal = this.getCasesAdminDeleteModal();
    let getCasesAdminSuccessModal = this.getCasesAdminSuccessModal();
    let {state: {Page, fullName, uid, actionTypeDisplayText}} = this;

    return (
      <div>
        <OutsideBorder {...{fullName, uid, actionTypeDisplayText}}
          showDeleteOrWithdrawCaseModal={this.showDeleteOrWithdrawCaseModal}
          showButton={this.state.showDeleteOrWithdrawButton}/>
        <div className="row case-border">
          <div className="col-md-2 leftnav left-side-nav hidden-print" role="navigation">
            {this.getSideBarLinks()}
          </div>
          <div className="col-md-10">
            {getDeleteOrWithdrawCaseModal}
            {getDeleteOrWithdrawCaseFromInterfolioModal}
            {getCasesAdminDeleteModal}
            {getCasesAdminSuccessModal}
            <APIFailureModal {...{failurePromise: this.state.promise}} />
            <Page {...{...this.props}} />
          </div>
        </div>
      </div>
    );
  }
}
