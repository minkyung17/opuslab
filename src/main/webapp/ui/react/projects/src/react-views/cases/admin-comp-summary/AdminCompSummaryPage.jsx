import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import moment from 'moment';
import {keys, pick} from 'lodash';

//My imports
import * as util from '../../../opus-logic/common/helpers';
import {EditIcon, CommentIcon} from '../../common/components/elements/Icon.jsx';
import {HideIf, ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import {FormSelect} from '../../common/components/forms/FormElements.jsx';
import {MultipleAppointmentsBlock} from '../components/AppointmentBlocks.jsx';
import {ToolTipWrapper} from '../../common/components/elements/ToolTip.jsx';
import {FormShell, FormGroup} from '../../common/components/forms/FormRender.jsx';
import AdminCompProposedModal from './AdminCompProposedModal.jsx';
import AdminCompFinalDecisionModal from './AdminCompFinalDecisionModal.jsx';
import AdminCompTrackingModal from './AdminCompTrackingModal.jsx';
//import AppointmentBlock from '../../../opus-logic/cases/modules/AppointmentBlock';
import AdminCompSummary from '../../../opus-logic/cases/classes/admin-comp-summary/AdminCompSummary';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import AdminCompProposalRevisions from "../../../opus-logic/cases-admin/AdminCompProposalRevisions";
import {DisplayTable, DisplayTableHeader, DisplayTableBody} from
  '../../common/components/elements/DisplayTables.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import {AdminCompHeader, OtherHeader} from './AdminCompHeader.jsx';
// My imports tooltips for proposals summary
import {ToolTip} from '../../common/components/elements/ToolTip.jsx'
import {descriptions} from '../../../opus-logic/common/constants/Descriptions.js'
// My imports for comment modal
import CommentModal from '../../common/components/bootstrap/CommentModal.jsx';
import AdminCompProposalRevisionsModal from "../../cases-admin/AdminCompProposalRevisionsModal.jsx";
import CompensationSuccessModal from '../../cases-admin/CompensationSuccessModal.jsx';


export default class AdminCompSummaryPage extends React.Component {
  static propTypes = {
    adminCompSummaryDataFromAPI: PropTypes.object,
    setAdminCompSummaryDataAPIInGlobalState: PropTypes.func,
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
    imageSource: '../images/revise-resubmit.png',
    header: ' ',
    smallHeader: ' padding-8 col-md-2 ',
    leftColumn: ' padding-8 label-column col-md-4 ',
    middleColumn: ' padding-8 data-column col-md-4 ',
    rightColumn: ' padding-8 data-column col-md-4 ',
    columnSmall: ' padding-8 data-column col-md-2 ',
    adminCompSummaryData: {},
    highlights: {},
    showEditModal: false,
    showTrackingModal: false,
    // 7-6-2021 add comment modal
    comments: [],
    commentsText: '',
    showCommentModalProposed: false,
    showCommentModalApproved: false,
    canEditAdminCompProposals: false,
    canEditAdminCompFinalDecision: false,
    compensationStringValue: null,
    showSuccessModal: false,
    canRequestRevisionsToAProposal: false,
    showACProposalRevisionsModal: false,
    revisionText: 'Request Revision',
    existingProposals: '',
    empName: ''
  };

  /**
   *
   * @desc -Start page off
   * @return {void}
   *
   **/
  componentWillMount = () => this.initAdminCompSummary();

  /**
   *
   * @desc - Every time component receives new props rerender page
   * @return {void}
   *
   **/
  componentWillReceiveProps({adminCompSummaryDataFromAPI}) {
    if(adminCompSummaryDataFromAPI !== this.props.adminCompSummaryDataFromAPI) {
      this.renderAdminCompSummaryPageFromAPIData(adminCompSummaryDataFromAPI);
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

  /**
   *
   * @desc - Every time it updates re-init the tooltips
   * @return {void}
   *
   **/
  // componentDidUpdate() {
  //   //util.initJQueryBootStrapToolTipandPopover();
  // }

  //Class variables
  Logic = new AdminCompSummary(this.props);
  AdminCompProposalRevisionsLogic = new AdminCompProposalRevisions(this.props);

  /**
   *
   * @desc - takes a name and sets it as the title of the page
   * @param {String} name -
   * @return {void}
   *
   **/
  setPageTitleByName(name) {
    if(name) {
      document.title = name + ' - Admin Comp Summary';
    }
  }

  /**
   *
   * @desc - Get formatted case summary data
   * @return {void} -
   *
   **/
  initAdminCompSummary = async () => {
    let {adminCompId} = util.getUrlArgs();
    let {adminCompSummaryDataFromAPI} = this.props;

    //If we already have api data no need to get it again from the backend
    if(adminCompSummaryDataFromAPI) {
      this.renderAdminCompSummaryPageFromAPIData(adminCompSummaryDataFromAPI, adminCompId);
    } else if(adminCompId) {
      this.setState({adminCompId});
      adminCompSummaryDataFromAPI = await this.Logic.getAdminCompSummaryData(adminCompId);
      // //Dispatch adminCompSummaryData into global state
      // this.props.setAdminCompSummaryDataAPIInGlobalState(adminCompSummaryDataFromAPI);
      this.renderAdminCompSummaryPageFromAPIData(adminCompSummaryDataFromAPI, adminCompId);
    }
    this.crudPermissions();
  }

  crudPermissions(){
    let canEditAdminCompProposals = this.Logic.canEditAdminCompProposals();
    let canEditAdminCompFinalDecision = this.Logic.canEditAdminCompFinalDecision();
    this.setState({canEditAdminCompProposals, canEditAdminCompFinalDecision})
  }

    /**
    *
    * @desc - Renders the page starting from the arguments given
    * @param {Object} adminCompSummaryDataFromAPI - straight from API
    * @param {String} adminCompId - id of case were working on
    *
    **/
  renderAdminCompSummaryPageFromAPIData(adminCompSummaryDataFromAPI, adminCompId = this.state.adminCompId) {
    // console.log(adminCompSummaryDataFromAPI)
    let clonedAdminCompSummaryData = util.cloneObject(adminCompSummaryDataFromAPI);
    // Format data (dates, currency, etc)
    let adminCompSummaryData = this.formatData(clonedAdminCompSummaryData);
    clonedAdminCompSummaryData.acPropComp = adminCompSummaryData;

    let proposalCommentCount = adminCompSummaryData.proposalCommentCount;
    let approvedProposalCommentCount = adminCompSummaryData.approvedProposalCommentCount;

    // Check differences between proposed and approved
    this.setHighlight(adminCompSummaryData);

    // RE-498 Check if user can request a revision to a proposal
    let canRequestRevisionsToAProposal = this.AdminCompProposalRevisionsLogic.canReviseProposal(clonedAdminCompSummaryData);
    let canOpenRevisionModal = false;
    if(canRequestRevisionsToAProposal){
      canOpenRevisionModal = this.AdminCompProposalRevisionsLogic.canOpenRevisionModal(clonedAdminCompSummaryData);
    }

    if(!canOpenRevisionModal){
      let revisionText = 'Revisions may only be requested while the proposal has a status of "Submitted" or "Under Review."';
      this.setState({revisionText});
      this.setState({imageSource: '../images/revise-resubmit_disabled.png'})
      this.refresh();
    } else {
      let revisionText = 'Request Revision';
      this.setState({revisionText});
      this.setState({imageSource: '../images/revise-resubmit.png'})
    }
    let existingProposals = clonedAdminCompSummaryData.existingProposals;   
    let name = clonedAdminCompSummaryData.acPropComp.emplName;
    let nameArray = name.split(",");
    let empName = nameArray[1] + " " + nameArray[0];
    console.log("Empl Name: ",empName);

    //Values for tables and modals
    this.setState({renderTables: true, adminCompSummaryData, adminCompSummaryDataFromAPI,
      clonedAdminCompSummaryData, proposalCommentCount, approvedProposalCommentCount, canRequestRevisionsToAProposal,
      canOpenRevisionModal, existingProposals, empName});
  }


  formatData = (clonedAdminCompSummaryData) => {
    // Clone main data object
    let adminCompSummaryData = util.cloneObject(clonedAdminCompSummaryData.acPropComp);
    // Set outcome status
    let hasOutcome = false;
    if(adminCompSummaryData.outcome!==null && adminCompSummaryData.outcome!=="Disapproved"){
      hasOutcome = true;
    }
    adminCompSummaryData.hasOutcome = hasOutcome;

    // Set date fields correctly
    adminCompSummaryData.proposedEffectiveDTDisplayValue = adminCompSummaryData.proposedEffectiveDT ? moment(adminCompSummaryData.proposedEffectiveDT).format('L') : null;
    adminCompSummaryData.approvedEffectiveDTDisplayValue = adminCompSummaryData.approvedEffectiveDT ? moment(adminCompSummaryData.approvedEffectiveDT).format('L') : null;
    adminCompSummaryData.proposedEndDTDisplayValue = adminCompSummaryData.proposedEndDT ? moment(adminCompSummaryData.proposedEndDT).format('L') : null;
    adminCompSummaryData.approvedEndDTDisplayValue = adminCompSummaryData.approvedEndDT ? moment(adminCompSummaryData.approvedEndDT).format('L') : null;

    adminCompSummaryData.deanSubmissionDT = adminCompSummaryData.deanSubmissionDT ? moment(adminCompSummaryData.deanSubmissionDT).format('L') : null;
    adminCompSummaryData.evcpapprovedDT = adminCompSummaryData.evcpapprovedDT ? moment(adminCompSummaryData.evcpapprovedDT).format('L') : null;
    adminCompSummaryData.ucopapprovedDT = adminCompSummaryData.ucopapprovedDT ? moment(adminCompSummaryData.ucopapprovedDT).format('L') : null;
    adminCompSummaryData.completedDT = adminCompSummaryData.completedDT ? moment(adminCompSummaryData.completedDT).format('L') : null;

    // Find correct unit
    if(adminCompSummaryData.department!=='N/A'){
      adminCompSummaryData.unit = adminCompSummaryData.department;
    }else if(adminCompSummaryData.division!=='N/A'){
      adminCompSummaryData.unit = adminCompSummaryData.division;
    }else{
      adminCompSummaryData.unit = adminCompSummaryData.school;
    }

    // Find fields from components
    let dataComponents = adminCompSummaryData.components;

    let proposedStipendTotal = 0;
    let approvedStipendTotal = 0;
    let proposedNinthsNumberTotal = 0;
    let approvedNinthsNumberTotal = 0;
    let proposedNinthsAmountTotal = 0;
    let approvedNinthsAmountTotal = 0;
    let proposedStipendOther = [];
    let proposedNinthsOther = [];
    let approvedStipendOther = [];
    let approvedNinthsOther = [];

    for(let index in dataComponents){
      let each = dataComponents[index];
      if(each.proposedApproved==="Proposed"){
        // Handle proposed fields
        if(each.componentType==="FTE"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.proposedFteEVCPIndex = index;
            adminCompSummaryData.proposedFteEVCP = each.componentValue;
          }else{
            adminCompSummaryData.proposedFteOtherIndex = index;
            adminCompSummaryData.proposedFteOther = each.componentValue;
          }
        }else if(each.componentType==="Stipend"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.proposedStipendEVCPIndex = index;
            adminCompSummaryData.proposedStipendEVCP = each.componentValue;
            adminCompSummaryData.proposedStipendEVCPDisplayValue = this.Logic.convertMoneyValueToDisplay(each.componentValue);
          }else if(each.sourceType=="Dean"){
            adminCompSummaryData.proposedStipendDeanIndex = index;
            adminCompSummaryData.proposedStipendDean = each.componentValue;
            adminCompSummaryData.proposedStipendDeanDisplayValue = this.Logic.convertMoneyValueToDisplay(each.componentValue);
          }else if(each.sourceType=="Dept."){
            adminCompSummaryData.proposedStipendDeptIndex = index;
            adminCompSummaryData.proposedStipendDept = each.componentValue;
            adminCompSummaryData.proposedStipendDeptDisplayValue = this.Logic.convertMoneyValueToDisplay(each.componentValue);
          }else{
            each.index = index;
            proposedStipendOther.push(each)
          }
          // Add to proposed stipend total
          proposedStipendTotal = proposedStipendTotal + each.componentValue;
        }else if(each.componentType==="9ths Number"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.proposedNinthsEVCPIndex = index;
            adminCompSummaryData.proposedNinthsEVCP = each.componentValue;
          }else if(each.sourceType=="Dean"){
            adminCompSummaryData.proposedNinthsDeanIndex = index;
            adminCompSummaryData.proposedNinthsDean = each.componentValue;
          }else if(each.sourceType=="Dept."){
            adminCompSummaryData.proposedNinthsDeptIndex = index;
            adminCompSummaryData.proposedNinthsDept = each.componentValue;
          }else{
            each.index = index;
            proposedNinthsOther.push(each)
          }
          // Add to proposed ninths total
          proposedNinthsNumberTotal = proposedNinthsNumberTotal + each.componentValue;
        }else if(each.componentType==="9ths Amount"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.proposedNinthsEVCPAmountIndex = index;
            adminCompSummaryData.proposedNinthsEVCPAmount = each.componentValue;
          }else if(each.sourceType=="Dean"){
            adminCompSummaryData.proposedNinthsDeanAmountIndex = index;
            adminCompSummaryData.proposedNinthsDeanAmount = each.componentValue;
          }else if(each.sourceType=="Dept."){
            adminCompSummaryData.proposedNinthsDeptAmountIndex = index;
            adminCompSummaryData.proposedNinthsDeptAmount = each.componentValue;
          // }else{
          //   each.index = index;
          //   proposedNinthsOther.push(each);
          }
          // Add to proposed ninths total
          proposedNinthsAmountTotal = proposedNinthsAmountTotal + each.componentValue;
        }
      }else if(each.proposedApproved==="Approved"){
        // Handle approved fields
        if(each.componentType==="FTE"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.approvedFteEVCPIndex = index;
            adminCompSummaryData.approvedFteEVCP = each.componentValue;
          }else{
            adminCompSummaryData.approvedFteOtherIndex = index;
            adminCompSummaryData.approvedFteOther = each.componentValue;
          }
        }else if(each.componentType==="Stipend"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.approvedStipendEVCPIndex = index;
            adminCompSummaryData.approvedStipendEVCP = each.componentValue;
          }else if(each.sourceType=="Dean"){
            adminCompSummaryData.approvedStipendDeanIndex = index;
            adminCompSummaryData.approvedStipendDean = each.componentValue;
          }else if(each.sourceType=="Dept."){
            adminCompSummaryData.approvedStipendDeptIndex = index;
            adminCompSummaryData.approvedStipendDept = each.componentValue;
          }else{
            each.index = index;
            approvedStipendOther.push(each);
          }
          // Add to approved stipend total
          approvedStipendTotal = approvedStipendTotal + each.componentValue;
        }else if(each.componentType==="9ths Number"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.approvedNinthsEVCPIndex = index;
            adminCompSummaryData.approvedNinthsEVCP = each.componentValue;
          }else if(each.sourceType=="Dean"){
            adminCompSummaryData.approvedNinthsDeanIndex = index;
            adminCompSummaryData.approvedNinthsDean = each.componentValue;
          }else if(each.sourceType=="Dept."){
            adminCompSummaryData.approvedNinthsDeptIndex = index;
            adminCompSummaryData.approvedNinthsDept = each.componentValue;
          }else{
            each.index = index;
            approvedNinthsOther.push(each);
          }
          // Add to approved ninths total
          approvedNinthsNumberTotal = approvedNinthsNumberTotal + each.componentValue;
        }else if(each.componentType==="9ths Amount"){
          if(each.sourceType=="EVCP"){
            adminCompSummaryData.approvedNinthsEVCPAmountIndex = index;
            adminCompSummaryData.approvedNinthsEVCPAmount = each.componentValue;
          }else if(each.sourceType=="Dean"){
            adminCompSummaryData.approvedNinthsDeanAmountIndex = index;
            adminCompSummaryData.approvedNinthsDeanAmount = each.componentValue;
          }else if(each.sourceType=="Dept."){
            adminCompSummaryData.approvedNinthsDeptAmountIndex = index;
            adminCompSummaryData.approvedNinthsDeptAmount = each.componentValue;
          // }else{
          //   each.index = index;
          //   approvedNinthsOther.push(each);
          }
          // Add to approved ninths total
          approvedNinthsAmountTotal = approvedNinthsAmountTotal + each.componentValue;
        }
      }
    }
    // Find FTE amounts
    adminCompSummaryData.proposedFteEVCPDisplayValue = adminCompSummaryData.proposedFteEVCP && adminCompSummaryData.proposedFteEVCP>0 ? adminCompSummaryData.proposedFteEVCP.toFixed(2) : "0";
    adminCompSummaryData.proposedFteOtherDisplayValue = adminCompSummaryData.proposedFteOther && adminCompSummaryData.proposedFteOther>0 ? adminCompSummaryData.proposedFteOther.toFixed(2) : "0";

    // Find ninths rate
    adminCompSummaryData.proposedNinthsRateDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedNinthsRate);

    // Find stipend/9ths other sources and other totals
    this.findStipendOtherFields(adminCompSummaryData, proposedStipendOther, approvedStipendOther);
    this.findNinthsOtherFields(adminCompSummaryData, proposedNinthsOther, approvedNinthsOther);

    // See if proposed ninths other has an amount
    let proposedNinthsArray = [adminCompSummaryData.proposedNinthsOtherAmountTotal, adminCompSummaryData.proposedNinthsEVCPAmount, adminCompSummaryData.proposedNinthsDeanAmount, adminCompSummaryData.proposedNinthsDeptAmount]
    //proposedNinthsAmountTotal = this.Logic.addValuesToTotal(proposedNinthsAmountTotal, proposedNinthsArray);

    // Convert 9ths Amounts to correct currency display
    adminCompSummaryData.proposedNinthsEVCPAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedNinthsEVCPAmount);
    adminCompSummaryData.proposedNinthsDeanAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedNinthsDeanAmount);
    adminCompSummaryData.proposedNinthsDeptAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedNinthsDeptAmount);
    adminCompSummaryData.proposedNinthsAmountTotal = proposedNinthsAmountTotal;
    adminCompSummaryData.proposedNinthsAmountTotalDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedNinthsAmountTotal);

    // Find proposed totals
    adminCompSummaryData.proposedStipendTotal = proposedStipendTotal;
    adminCompSummaryData.proposedStipendTotalDisplayValue = this.Logic.convertMoneyValueToDisplay(proposedStipendTotal);
    adminCompSummaryData.proposedNinthsNumberTotal = proposedNinthsNumberTotal;
    adminCompSummaryData.proposedNinthsNumberTotalDisplayValue = proposedNinthsNumberTotal.toFixed(10);;
    let proposedTotalAdminComp = proposedStipendTotal + proposedNinthsAmountTotal;
    adminCompSummaryData.proposedTotalAdminComp = proposedTotalAdminComp;
    adminCompSummaryData.proposedTotalAdminCompDisplayValue = this.Logic.convertMoneyValueToDisplay(proposedTotalAdminComp);
    let proposedTotalComp = parseFloat((proposedTotalAdminComp + adminCompSummaryData.proposedBaseSalary).toFixed(2));
    adminCompSummaryData.proposedTotalComp = proposedTotalComp;
    adminCompSummaryData.proposedTotalCompDisplayValue = this.Logic.convertMoneyValueToDisplay(proposedTotalComp);
    adminCompSummaryData.proposedCourseReleasesDisplayValue = adminCompSummaryData.proposedCourseReleases && adminCompSummaryData.proposedCourseReleases>0 ? adminCompSummaryData.proposedCourseReleases.toFixed(2) : "0";
    adminCompSummaryData.proposedCourseReleasesEstCostDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedCourseReleasesEstCost);

    adminCompSummaryData.proposedBaseSalaryDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.proposedBaseSalary);

    let approvedTotalComp;
    // If there is an outcome, show fields and totals for final decision
    if(hasOutcome){
      // Find FTE amounts
    adminCompSummaryData.approvedFteEVCPDisplayValue = adminCompSummaryData.approvedFteEVCP && adminCompSummaryData.approvedFteEVCP>0 ? adminCompSummaryData.approvedFteEVCP.toFixed(2) : "0";
    adminCompSummaryData.approvedFteOtherDisplayValue = adminCompSummaryData.approvedFteOther && adminCompSummaryData.approvedFteOther>0 ? adminCompSummaryData.approvedFteOther.toFixed(2) : "0";

      // Find and set Stipends amount display value
      adminCompSummaryData.approvedStipendEVCPDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedStipendEVCP);
      adminCompSummaryData.approvedStipendDeanDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedStipendDean);
      adminCompSummaryData.approvedStipendDeptDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedStipendDept);

      // Find ninths rate
      adminCompSummaryData.approvedNinthsRateDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedNinthsRate);

      // See if approved ninths other has an amount
      let approvedNinthsArray = [adminCompSummaryData.approvedNinthsOtherAmountTotal, adminCompSummaryData.approvedNinthsEVCPAmount, adminCompSummaryData.approvedNinthsDeanAmount, adminCompSummaryData.approvedNinthsDeptAmount]
      // approvedNinthsAmountTotal = this.Logic.addValuesToTotal(approvedNinthsAmountTotal, approvedNinthsArray);

      // Convert 9ths Amounts to correct currency display
      adminCompSummaryData.approvedNinthsOtherAmount>0 ? adminCompSummaryData.approvedNinthsAmountTotal = approvedNinthsAmountTotal + approvedNinthsOtherAmount : null;
      adminCompSummaryData.approvedNinthsEVCPAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedNinthsEVCPAmount);
      adminCompSummaryData.approvedNinthsDeanAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedNinthsDeanAmount);
      adminCompSummaryData.approvedNinthsDeptAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedNinthsDeptAmount);
      adminCompSummaryData.approvedNinthsAmountTotal = approvedNinthsAmountTotal;
      adminCompSummaryData.approvedNinthsAmountTotalDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedNinthsAmountTotal);

      // Find approved totals
      adminCompSummaryData.approvedStipendTotal = approvedStipendTotal;
      adminCompSummaryData.approvedStipendTotalDisplayValue = this.Logic.convertMoneyValueToDisplay(approvedStipendTotal);
      adminCompSummaryData.approvedNinthsNumberTotal = approvedNinthsNumberTotal;
      adminCompSummaryData.approvedNinthsNumberTotalDisplayValue = approvedNinthsNumberTotal.toFixed(10);;
      let approvedTotalAdminComp = approvedStipendTotal + approvedNinthsAmountTotal;
      adminCompSummaryData.approvedTotalAdminComp = approvedTotalAdminComp;
      adminCompSummaryData.approvedTotalAdminCompDisplayValue = this.Logic.convertMoneyValueToDisplay(approvedTotalAdminComp);
      approvedTotalComp = approvedTotalAdminComp + adminCompSummaryData.approvedBaseSalary;
      adminCompSummaryData.approvedTotalComp = approvedTotalComp;
      adminCompSummaryData.approvedTotalCompDisplayValue = this.Logic.convertMoneyValueToDisplay(approvedTotalComp);
      adminCompSummaryData.approvedCourseReleasesDisplayValue = adminCompSummaryData.approvedCourseReleases && adminCompSummaryData.approvedCourseReleases>0 ? adminCompSummaryData.approvedCourseReleases.toFixed(2) : "0";
      adminCompSummaryData.approvedCourseReleasesEstCostDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedCourseReleasesEstCost);

      adminCompSummaryData.approvedBaseSalaryDisplayValue = this.Logic.convertMoneyValueToDisplay(adminCompSummaryData.approvedBaseSalary);
    }


    // Find Headers
    adminCompSummaryData.stipendHeaders = clonedAdminCompSummaryData.allocationStipend;
    adminCompSummaryData.ninthsHeaders = clonedAdminCompSummaryData.allocationNinths;

    // Find if stipend/ninths other is blank, then insert blank row
    if(adminCompSummaryData.stipendOther.length===0){
      let approvedValue, approvedDisplayValue;
      if(hasOutcome){
        approvedValue = 0;
        approvedDisplayValue = "$0"
      }
      adminCompSummaryData.stipendOther = [{name: null, approvedValue, approvedDisplayValue, proposedValue: 0, proposedDisplayValue: "$0"}];

    }

    if(adminCompSummaryData.ninthsOther.length===0){
      adminCompSummaryData.ninthsOther = [{
        approvedNinthsAmountValue: null,
        approvedNinthsAmountDisplayValue: null,
        approvedNinthsValue: null,
        approvedNinthsValueDisplayValue: null,
        name: null,
        proposedNinthsAmountValue: 0,
        proposedNinthsAmountDisplayValue: "$0",
        proposedNinthsValue: 0,
        proposedNinthsValueDisplayValue: "$0"
      }]
      if(hasOutcome){
        adminCompSummaryData.ninthsOther[0].approvedNinthsValue = 0;
        adminCompSummaryData.ninthsOther[0].approvedNinthsAmountDisplayValue = "$0";
        adminCompSummaryData.ninthsOther[0].approvedNinthsAmountValue = 0;
        adminCompSummaryData.ninthsOther[0].approvedNinthsValueDisplayValue = "$0";
      }
    }
    console.log("ApprovedTotalComp from caller = " + approvedTotalComp);
    // Sets ICL Message
    this.setProposedICLMessage(adminCompSummaryData, clonedAdminCompSummaryData.proposedICLThreshold, proposedTotalComp)
    this.setApprovedICLMessage(adminCompSummaryData, clonedAdminCompSummaryData.approvedICLThreshold, approvedTotalComp)

    return adminCompSummaryData;
  }

   /**
  *
  * @desc - Find Stipends Other Fields
  * @param {Object} adminCompSummaryData -
  * @return {void}
  *
  **/
  findStipendOtherFields = (adminCompSummaryData, proposedStipendOther, approvedStipendOther) => {
    let stipendOtherFields = [];
    let proposedTotal = 0;
    let proposedOtherTotal = 0;
    let approvedOtherTotal = 0;

    // Find other sources by Proposed fields and corresponding approved values
    for(let index in proposedStipendOther){
      let proposedSource = proposedStipendOther[index]
      let name = proposedSource.otherDescription;
      let approvedValue, approvedSource;

      // Find corresponding approved
      for(let eachApprovedSource of approvedStipendOther){
        if(eachApprovedSource.sourceTypeSequence===proposedSource.sourceTypeSequence){
          approvedValue = eachApprovedSource.componentValue;
          approvedSource = eachApprovedSource
          break;
        }
      }

      let proposedValue = proposedSource.componentValue;
      let disableProposedFields = false;
      if(proposedValue===null){
        disableProposedFields = true;
      }
      let proposedDisplayValue = this.Logic.convertMoneyValueToDisplay(proposedSource.componentValue);

      let disableApprovedFields = false;
      let approvedDisplayValue;
      if(adminCompSummaryData.hasOutcome){
        approvedDisplayValue = this.Logic.convertMoneyValueToDisplay(approvedValue);
      }

      let stipendHighlight = '';
      if(adminCompSummaryData.hasOutcome){
        if(proposedDisplayValue !== approvedDisplayValue) {
          stipendHighlight = ' light-yellow ';
        }

        // Approved totals
        let approvedTotal = 0;
        for(let approvedSource of approvedStipendOther){
          approvedTotal = approvedSource.componentValue && approvedSource.componentValue>0 ? approvedTotal + approvedSource.componentValue : null;
        }
        adminCompSummaryData.approvedStipendTotal = this.Logic.addValuesToTotal(adminCompSummaryData.approvedStipendTotal, [approvedTotal]);

      }else{
        adminCompSummaryData.approvedStipendTotal = null;
      }

      let object = {
        name,
        proposedValue,
        proposedDisplayValue,
        approvedValue,
        approvedDisplayValue,
        recStatus: proposedSource.recStatus,
        originalProposedFields: proposedSource,
        originalApprovedFields: approvedSource,
        disableProposedFields,
        stipendHighlight,
        disableApprovedFields
      }
      proposedTotal = proposedTotal + proposedSource.componentValue;
      stipendOtherFields.push(object);

      // Find other totals
      proposedOtherTotal = proposedOtherTotal + proposedValue;
      approvedOtherTotal = approvedValue ? approvedOtherTotal + approvedValue : approvedOtherTotal;
    }
    // Calculate entire 9th totals
    adminCompSummaryData.proposedStipendTotalDisplayValue = this.Logic.addValuesToTotal(adminCompSummaryData.proposedStipendTotal, [proposedTotal]);

    adminCompSummaryData.proposedStipendOtherTotal = proposedOtherTotal;
    adminCompSummaryData.approvedStipendOtherTotal = approvedOtherTotal;
    adminCompSummaryData.stipendOther = stipendOtherFields;
  }

  /**
    *
    * @desc - Find Ninths Other Fields
    * @param {Object} adminCompSummaryData -
    * @return {void}
    *
    **/
  findNinthsOtherFields = (adminCompSummaryData, proposedNinthsOther, approvedNinthsOther) => {
    let approvedNinthsOtherAmount;
    let proposedNinthsOtherAmount;
    let ninthsOtherFields = [];
    let proposedOtherNumberTotal = 0;
    let approvedOtherNumberTotal = 0;

    // Proposed fields & totals
    let proposedAmountTotal = 0;
    for(let proposedSource of proposedNinthsOther){
      let name = proposedSource.otherDescription;
      let approvedValue, approvedSource;

      // Find corresponding approved
      for(let eachApprovedSource of approvedNinthsOther){
        if(eachApprovedSource.sourceTypeSequence===proposedSource.sourceTypeSequence){
          approvedValue = eachApprovedSource.componentValue;
          approvedSource = eachApprovedSource;
          break;
        }
      }

      let proposedValue = (proposedSource.componentValue);

      let disableProposedFields = false;
      if(proposedValue===null){
        disableProposedFields = true;
      }
      proposedNinthsOtherAmount = (proposedValue*adminCompSummaryData.proposedNinthsRate);

      // Find corresponding 9ths Amount component
      for(let each of adminCompSummaryData.components){
        let fields = proposedSource;
        if(fields.proposedApprovedId===each.proposedApprovedId
            && fields.sourceTypeId===each.sourceTypeId
            && fields.sourceTypeSequence===each.sourceTypeSequence
            && each.componentTypeId === 3 && each.componentValue!==null){
                proposedNinthsOtherAmount = each.componentValue;
            }
      }

      let proposedNinthsAmountValue = proposedNinthsOtherAmount;
      let proposedNinthsAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(proposedNinthsOtherAmount);
      // Find and format approved amounts and value

      let approvedNinthsAmountValue;
      let approvedNinthsAmountDisplayValue;
      let ninthsHighlight = '';
      let ninthsAmountHighlight = '';
      let disableApprovedFields = false;

      if(adminCompSummaryData.hasOutcome){
        approvedNinthsOtherAmount = (approvedValue*adminCompSummaryData.approvedNinthsRate);

        // Find corresponding 9ths Amount component
        for(let each of adminCompSummaryData.components){
          let fields = approvedSource;
          if(fields.proposedApprovedId===each.proposedApprovedId
              && fields.sourceTypeId===each.sourceTypeId
              && fields.sourceTypeSequence===each.sourceTypeSequence
              && each.componentTypeId === 3 && each.componentValue!==null){
                approvedNinthsOtherAmount = each.componentValue;
              }
        }

        approvedNinthsAmountValue = approvedNinthsOtherAmount;
        approvedNinthsAmountDisplayValue = this.Logic.convertMoneyValueToDisplay(approvedNinthsOtherAmount);

        if(proposedValue!==approvedValue){
          ninthsHighlight = ' light-yellow ';
        }
        if(proposedNinthsOtherAmount!==approvedNinthsOtherAmount){
          ninthsAmountHighlight = ' light-yellow ';
        }
      }else{
        approvedValue = null;
      }
      let object = {
        name,
        proposedNinthsValue: proposedValue,
        proposedNinthsAmountValue,
        proposedNinthsAmountDisplayValue,
        approvedNinthsValue: approvedValue,
        approvedNinthsAmountDisplayValue,
        approvedNinthsAmountValue,
        ninthsHighlight,
        ninthsAmountHighlight,
        recStatus: proposedSource.recStatus,
        originalProposedFields: proposedSource,
        originalApprovedFields: approvedSource,
        disableProposedFields,
        disableApprovedFields
      }

      // Use same float in display to add to total
      proposedNinthsOtherAmount = parseFloat((proposedNinthsOtherAmount).toFixed(2));
      proposedAmountTotal = proposedAmountTotal + proposedNinthsOtherAmount;

      // Push object into ninthsOtherFields array
      ninthsOtherFields.push(object);

      // Find other totals
      proposedOtherNumberTotal = proposedOtherNumberTotal + proposedValue;
      approvedOtherNumberTotal = approvedValue ? approvedOtherNumberTotal + approvedValue : approvedOtherNumberTotal;
    }

    // Calculate entire 9th totals
    // Start with Proposed # of 9ths total
    adminCompSummaryData.proposedNinthsOtherAmountTotal = adminCompSummaryData.proposedNinthsOtherAmountTotal && adminCompSummaryData.proposedNinthsOtherAmountTotal>=0 ? adminCompSummaryData.proposedNinthsOtherTotalAmount + proposedAmountTotal : proposedAmountTotal;
    if(adminCompSummaryData.hasOutcome){

      // Approved totals
      let approvedNumberTotal = 0;
      let approvedAmountTotal = 0;
      for(let approvedSource of approvedNinthsOther){
        let approvedValue = (approvedSource.componentValue);
        approvedNumberTotal = approvedValue && approvedValue>0 ? approvedNumberTotal + approvedValue : approvedNumberTotal;

        // Use same float in display to add to total
        let approvedNinthsOtherAmount = parseFloat((approvedValue*adminCompSummaryData.approvedNinthsRate).toFixed(2));
        approvedAmountTotal = approvedNinthsOtherAmount && approvedNinthsOtherAmount>0 ? approvedAmountTotal + approvedNinthsOtherAmount : approvedAmountTotal;
      }
      adminCompSummaryData.approvedNinthsOtherAmountTotal = adminCompSummaryData.approvedNinthsOtherAmountTotal && adminCompSummaryData.approvedNinthsOtherAmountTotal>=0 ? adminCompSummaryData.approvedNinthsOtherTotalAmount + approvedAmountTotal : approvedAmountTotal;
    }else{
      adminCompSummaryData.approvedNinthsOtherAmountTotal = null;
    }

    adminCompSummaryData.proposedNinthsOtherNumberTotal = proposedOtherNumberTotal;
    adminCompSummaryData.approvedNinthsOtherNumberTotal = approvedOtherNumberTotal;
    adminCompSummaryData.ninthsOther = ninthsOtherFields;

  }

  setProposedICLMessage = (adminCompSummaryData, threshold, proposedTotalComp) => {
    let shouldProposedICLMessageShow = false;
  	console.log("HSCP " + adminCompSummaryData.isHSCP);
  	if(adminCompSummaryData.isHSCP === 'N'){
  	    for(let each of threshold){
  	      if(each>0){
  	        if(proposedTotalComp>each){
  	          adminCompSummaryData.proposedIclBackgroundClass = ' bg-danger ';
  	          adminCompSummaryData.proposedIclTextClass = ' text-danger ';
  	          adminCompSummaryData.proposedIclMessage = 'Warning: The proposed compensation exceeds the ICL of '+this.Logic.convertMoneyValueToDisplay(each)+'.';
  	          shouldProposedICLMessageShow = true;
  	        }
  	      }
  	    }

  	    if(!shouldProposedICLMessageShow){
  	      adminCompSummaryData.proposedIclBackgroundClass = ' bg-success ';
  	      adminCompSummaryData.proposedIclTextClass = ' text-success ';
  	      adminCompSummaryData.proposedIclMessage = `The proposed compensation is under the ICL based on the information you have entered.
  	      If you have flagged the candidate as a participant in the NSTP,
  	      APO will contact you if the NSTP rate causes the candidate’s proposed compensation to exceed the ICL.`;
  	    }
  	    adminCompSummaryData.proposedIclThreshold = threshold;
  	}
    return adminCompSummaryData;
  }

  setApprovedICLMessage = (adminCompSummaryData, threshold, approvedTotalComp) => {
    let shouldApprovedICLMessageShow = false;
  	if(adminCompSummaryData.isHSCP === 'N'){
  	    for(let each of threshold){
  	      if(each>0){
  	        if(approvedTotalComp>each){
  	          adminCompSummaryData.approvedIclBackgroundClass = ' bg-danger ';
  	          adminCompSummaryData.approvedIclTextClass = ' text-danger ';
  	          adminCompSummaryData.approvedIclMessage = 'Warning: The approved compensation exceeds the ICL of '+this.Logic.convertMoneyValueToDisplay(each)+'.';
  	          shouldApprovedICLMessageShow = true;
  	        }
  	      }
  	    }
  	    if(!shouldApprovedICLMessageShow){
  	      adminCompSummaryData.approvedIclBackgroundClass = ' bg-success ';
  	      adminCompSummaryData.approvedIclTextClass = ' text-success ';
  	      adminCompSummaryData.approvedIclMessage = `The approved compensation is under the ICL based on the information you have entered.
  	      If you have flagged the candidate as a participant in the NSTP,
  	      APO will contact you if the NSTP rate causes the candidate’s approved compensation to exceed the ICL.`;
  	    }
  	    adminCompSummaryData.approvedIclThreshold = threshold;
  	}
    return adminCompSummaryData;
  }

   /**
  *
  * @desc - Set highlights
  * @param {Object} adminCompSummaryData -
  * @return {void}
  *
  **/
 setHighlight = (adminCompSummaryData) => {
    if(adminCompSummaryData.hasOutcome){
      let highlights = this.Logic.setHighlight(adminCompSummaryData);
      this.setState({highlights});
    }
  }

  setEditedData = (promise, compensationStringValue) => {
    let {adminCompId} = util.getUrlArgs();
    this.renderAdminCompSummaryPageFromAPIData(promise, adminCompId);
    this.setState({showEditModal: false, showFinalDecisionModal: false, showTrackingModal: false, showSuccessModal: true, compensationStringValue})
  }



  /******************************************************************************
 *
 * @desc - Edit Modal
 *
 ******************************************************************************/

  showProposedEditModal = () => {
    this.setState({showEditModal: true})
  }

  hideProposedEditModal = () => {
    this.setState({showEditModal: false})
  }

  getEditModal = () => {
    let {showEditModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData} = this.state;
    return (
      <AdminCompProposedModal {...{showEditModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData}}
        hideProposedEditModal={this.hideProposedEditModal} setProposedICLMessage={this.setProposedICLMessage}
        handlePromise={this.setEditedData}
        Logic={this.Logic}/>
    );
  }

  /******************************************************************************
 *
 * @desc - Final Decision Modal
 *
 ******************************************************************************/

  showFinalDecisionModal = () => {
    this.setState({showFinalDecisionModal: true})
  }

  hideFinalDecisionModal = () => {
    this.setState({showFinalDecisionModal: false})
  }

  getFinalDecisionModal = () => {
    let {showFinalDecisionModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData} = this.state;
    return (
      <AdminCompFinalDecisionModal {...{showEditModal: showFinalDecisionModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData}}
        hideFinalDecisionModal={this.hideFinalDecisionModal}  setApprovedICLMessage={this.setApprovedICLMessage}
        handlePromise={this.setEditedData}
        Logic={this.Logic}/>
    );
  }

  /******************************************************************************
 *
 * @desc - Tracking Dates Modal
 *
 ******************************************************************************/

  showTrackingEditModal = () => {
    this.setState({showTrackingModal: true})
  }

  hideTrackingEditModal = () => {
    this.setState({showTrackingModal: false})
  }

  getTrackingModal = () => {
    let {showTrackingModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData} = this.state;
    return (
      <AdminCompTrackingModal {...{showTrackingModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData}}
        hideTrackingEditModal={this.hideTrackingEditModal} handlePromise={this.setEditedData}
        Logic={this.Logic}/>
    );
  }

  //7-6-2021 adminComp proposed, approved comment modal
  /**
   *
   * @desc - Gets comments from api and sets in state to rerender
   * @param {String} adminCompId - Gets comments from api and sets in state to rerender
   * @return {JSX} - Final Decision Comment Modal
   *
   **/

   async refreshCommentsProposed(adminCompSummaryData = this.props.adminCompSummaryData) {
    this.setState({comments: []});
    let {adminCompId} = util.getUrlArgs();
    let comments = await this.Logic.getCommentsByIdProposed(adminCompId);
    this.setState({comments, proposalCommentCount: comments.length});
  }

  async refreshCommentsApproved(adminCompSummaryData = this.props.adminCompSummaryData) {
    this.setState({comments: []});
    let {adminCompId} = util.getUrlArgs();
    let comments = await this.Logic.getCommentsByIdApproved(adminCompId);
    this.setState({comments, approvedProposalCommentCount: comments.length});
  }

  /**
   *
   * @desc - Save text comment to adminComp
   * @param {String} commentsText - comments that user wants to save
   * @return {void} - jsx
   **/

  saveCommentProposed = async (commentsText) => {

    let {props: {adminCompSummaryData}} = this;
    let {adminCompId} = util.getUrlArgs();
    this.setState({isCommentSaveButtonDisabled: true});

    //7-21-2021 not allow save blank comment
    if (commentsText.length>0){
    let commentPromise = this.Logic.saveCommentProposed(commentsText, adminCompId );

    try{
      await commentPromise;
    } catch(e) { //If it fails show error modal and close comment modal
      console.log("ERROR: api call in 'saveCommentProposed' in AdminCompSummaryPage.jsx")
      console.log(e)
      this.setState({failurePromise: commentPromise, showCommentModalProposed: false});
    }
    this.refreshCommentsProposed();
    this.setState({commentsText: '', isCommentSaveButtonDisabled: false});

   }else{
    this.refreshCommentsProposed();
    this.setState({commentsText: '', isCommentSaveButtonDisabled: false});
   }

  }

  saveCommentApproved = async (commentsText) => {

    let {props: {adminCompSummaryData}} = this;
    let {adminCompId} = util.getUrlArgs();
    this.setState({isCommentSaveButtonDisabled: true});

    if (commentsText.length>0){
    let commentPromise = this.Logic.saveCommentApproved(commentsText, adminCompId);

    try{
      await commentPromise;
    } catch(e) { //If it fails show error modal and close comment modal
      console.log("ERROR: api call in 'saveCommentApproved' in AdminCompSummaryPage.jsx")
      console.log(e)
      this.setState({failurePromise: commentPromise, showCommentModalApproved: false});
    }
    this.refreshCommentsApproved();
    this.setState({commentsText: '', isCommentSaveButtonDisabled: false});
    } else{
    this.refreshCommentsApproved();
    this.setState({commentsText: '', isCommentSaveButtonDisabled: false});
    }
  }

  /**
   *
   * @desc - Shows the danger modal for success
   * @returns {JSX}
   *
   **/
   getCompensationSuccessModal({showSuccessModal, compensationStringValue,
     comingFromDatatable, existingProposals, empName} = this.state) {
     return <CompensationSuccessModal {...{showSuccessModal: showSuccessModal,
             compensationStringValue, comingFromDatatable, existingProposals, empName}}
             changeStateOfSuccessModal={this.changeStateOfSuccessModal} />;
   }

   changeStateOfSuccessModal = async () => {
     // Dismissing success Modal changes state of success modal in parent
     // to disable success modal from showing twice due to formatting completed cases datatable
     this.setState({showSuccessModal: false, compensationStringValue: null});

     // Refresh datatable
     // let {rowData, sortingTextOrder, maxRowCount} = await this.getFormattedRowDataInfo(true, false);
     // this.setState({rowData, sortingTextOrder, maxRowCount});
   }

  /**
   *
   * @desc - On Change that updates comments text to be save
   * @param {String} evt - comments that user wants to save
   * @return {void} - jsx
   *
   **/
  updateCommentsTextProposed = (evt) => {
    this.setState({commentsText: evt.target.value});
  }

  updateCommentsTextApproved = (evt) => {
    this.setState({commentsText: evt.target.value});
  }

  onCommentModalHideProposed = () => this.setState({showCommentModalProposed: false});

  onCommentModalHideApproved = () => this.setState({showCommentModalApproved: false});

  showCommentModalProposed = () => {
    this.refreshCommentsProposed();
    this.setState({showCommentModalProposed: true, commentsText: ''});
  }

  showCommentModalApproved = () => {
    this.refreshCommentsApproved();
    this.setState({showCommentModalApproved: true, commentsText: ''});
  }

  /**
   *
   * @desc - Proposed, Approved adminComp Proposal
   * @param {Array} comments - array of comments from API
   * @return {JSX} - jsx
   *
   **/
  getCommentsModalProposed(comments = this.state.comments) {
    let {state: {showCommentModalProposed, commentsText}, saveCommentProposed, updateCommentsTextProposed,
      onCommentModalHideProposed} = this;

    return (
    <CommentModal {...{comments}} show={showCommentModalProposed}
      text={commentsText} onClickSave={saveCommentProposed} onHide={onCommentModalHideProposed}
      updateComment={updateCommentsTextProposed} title={'Administrative Compensation Comments - Proposed'}
      />);
  }

  getCommentsModalApproved(comments = this.state.comments) {
    let {state: {showCommentModalApproved, commentsText}, saveCommentApproved, updateCommentsTextApproved,
      onCommentModalHideApproved} = this;

    return (<CommentModal {...{comments}} show={showCommentModalApproved}
      text={commentsText} onClickSave={saveCommentApproved} onHide={onCommentModalHideApproved}
      updateComment={updateCommentsTextApproved} title={'Administrative Compensation Comments - Final Decision'}/>);
  }
  // 7-6-2021 end of comment modal

   /*****************************************************************************
   *
   * @name Admin Comp Proposal Revisions Modal
   * @desc -
   *
   *****************************************************************************/

   showACProposalRevisionsModal = () => {
    let {canOpenRevisionModal} = this.state;
    if(canOpenRevisionModal){
      this.setState({showACProposalRevisionsModal: true})
    }
  }

  hideACProposalRevisionsModal = () => {
    this.setState({showACProposalRevisionsModal: false})
  }

  getACProposalRevisionModal = () => {
    let {showACProposalRevisionsModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData,
      isRevisionButtonDisabled} = this.state;
    return (
      <AdminCompProposalRevisionsModal {...{showACProposalRevisionsModal, adminCompSummaryDataFromAPI, clonedAdminCompSummaryData, isRevisionButtonDisabled}}
      hideACProposalRevisionsModal={this.hideACProposalRevisionsModal} sendRevisionRequest={this.sendRevisionRequest}
        Logic={this.Logic}/>
    );
   }

   sendRevisionRequest = async (revisionData) => {
    let {clonedAdminCompSummaryData} = this.state;
    this.setState({isRevisionButtonDisabled: true})
    //Perform save
    try {
      let promise = await this.AdminCompProposalRevisionsLogic.saveRevision(clonedAdminCompSummaryData, revisionData);
      this.setState({promise});
      this.setState({showSuccessModal: true, canRequestRevisionsToAProposal: false, compensationStringValue: 'revision'});
      this.successfulRevision();
    } catch(e) {
        console.error(e);
    }

    //Hide the Revise modal
    this.hideACProposalRevisionsModal();

    this.setState({isRevisionButtonDisabled: false})
   }

   successfulRevision = () => {
    this.initAdminCompSummary();
    this.refresh();
   }

   refresh = () => {
    setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
  }

  /*****************************************************************************
   *
   * @name Render Page
   * @desc -
   *
   *****************************************************************************/

  render() {
    let {state: {imageSource, renderTables, failurePromise, adminCompId, adminCompSummaryData, clonedAdminCompSummaryData,
      header, smallHeader, columnSmall, leftColumn, middleColumn, rightColumn, highlights, canEditAdminCompProposals,
      canEditAdminCompFinalDecision, canRequestRevisionsToAProposal, revisionText}} = this;
    let getEditModal = this.getEditModal();
    let getFinalDecisionModal = this.getFinalDecisionModal();
    let getTrackingModal = this.getTrackingModal();
    let getACProposalRevisionModal = this.getACProposalRevisionModal();
    //7-8-2021 get proposed comment modal
    let getCommentsModalProposed = this.getCommentsModalProposed();
    let getCommentsModalApproved = this.getCommentsModalApproved();
    let getCompensationSuccessModal = this.getCompensationSuccessModal();
    if(!renderTables) {
      return null;
    }

    return (
      <div >
        <div className="page-header">
          <h1> Administrative Compensation </h1>
        </div>
        {getEditModal}
        {getFinalDecisionModal}
        {getTrackingModal}
        {getACProposalRevisionModal}

        {getCommentsModalProposed}
        {getCommentsModalApproved}
        <AdminCompHeader adminCompSummaryData={adminCompSummaryData}
          adminCompSummaryDataFromAPI={clonedAdminCompSummaryData}/>

        <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <th className={header}>
                      Admin. Comp. Summary
                    </th>
                    <th className={header+" border-right "}>
                      Proposed <CommentIcon onClick={this.showCommentModalProposed} placeholder={this.state.proposalCommentCount} position={null} className={'button edit-icon icon-pencil edit-case-button'} className1={'comment-icon-container'} className2={'comment-icon-centered'} />
                      <ShowIf show={canEditAdminCompProposals}>
                        <EditIcon {...{onClick: this.showProposedEditModal}} position={null} className={'button edit-icon icon-pencil edit-case-button'}/>
                      </ShowIf>
                      &nbsp;&nbsp;
                      <ShowIf show={canRequestRevisionsToAProposal}>
                          <EditIcon {...{onClick: this.showACProposalRevisionsModal}} position={null}
                            className={'button edit-icon icon-pencil edit-case-button'}
                            src={imageSource} text={revisionText}/>
                      </ShowIf>
                    </th>
                    <th className={header+" border-left "}>
                      Final Decision <CommentIcon onClick={this.showCommentModalApproved} placeholder={this.state.approvedProposalCommentCount} position={null} className={'button edit-icon icon-pencil edit-case-button'} className1={'comment-icon-container'} className2={'comment-icon-centered'} />
                      <ShowIf show={canEditAdminCompFinalDecision}>
                        <EditIcon {...{onClick: this.showFinalDecisionModal}} position={null} className={'button edit-icon icon-pencil edit-case-button'}/>
                      </ShowIf>
                      <br/>
                      <span className="no-bold">Outcome: {adminCompSummaryData.outcome}</span>
                    </th>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Academic Year
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.academicYear}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.academicYear : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Type of Appointment
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.typeOfAppt}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.typeOfAppt : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Effective Date
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedEffectiveDTDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.effectiveDT}>
                      {adminCompSummaryData.approvedEffectiveDTDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      End Date  <ToolTip text={descriptions.endDate} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedEndDTDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.endDT}>
                      {adminCompSummaryData.approvedEndDTDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Unit
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.unit}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.unit : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Organization Name
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.organizationName}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.organizationName : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Title Code: Title
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.titleCodeDescription}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.titleCodeDescription : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Working Title / Role
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.workingTitle}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.workingTitle : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Justification
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.justification}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.justification : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Multiple Administrative Appts? <ToolTip text={descriptions.multipleAdminApptsForProposals} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.multipleAdminAppts}
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.hasOutcome ? adminCompSummaryData.multipleAdminAppts : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      FTE - EVCP
                      <ToolTip text={descriptions.FTEEVCP} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedFteEVCPDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.fteEVCP}>
                      {adminCompSummaryData.approvedFteEVCPDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      FTE - Other
                      <ToolTip text={descriptions.FTEOther} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedFteOtherDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.fteOther}>
                      {adminCompSummaryData.approvedFteOtherDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Base Salary
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedBaseSalaryDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.baseSalary}>
                      {adminCompSummaryData.approvedBaseSalaryDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      NSTP
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedNSTP}
                    </td>
                    <td className={rightColumn+highlights.nstp}>
                      {adminCompSummaryData.approvedNSTP}
                    </td>
                  </tr>
                </tbody>
            </table>

            <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <th className={header}>
                      Stipends: Allocated Funds from EVCP's Office:
                      <ToolTip text={descriptions.StipendForProposal} />
                      <br/>
                      <OtherHeader headers={adminCompSummaryData.stipendHeaders}/>
                    </th>
                    <th className={header}>
                      Proposed
                    </th>
                    <th className={header}>
                      Final Decision
                    </th>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      EVCP
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedStipendEVCPDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.stipendEVCP}>
                      {adminCompSummaryData.approvedStipendEVCPDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Dean
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedStipendDeanDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.stipendDean}>
                      {adminCompSummaryData.approvedStipendDeanDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Dept.
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedStipendDeptDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.stipendDept}>
                      {adminCompSummaryData.approvedStipendDeptDisplayValue}
                    </td>
                  </tr>

                  {adminCompSummaryData.stipendOther.map((source, index) => (
                       <tr key={index}>
                         <td className={leftColumn}>
                          Other{source.name ? ": "+source.name : null}
                        </td>
                        <td className={middleColumn}>
                          {source.proposedDisplayValue}
                        </td>
                        <td className={rightColumn+source.stipendHighlight}>
                          {source.approvedDisplayValue}
                        </td>
                       </tr>
                  ))}

                  <tr className="strong">
                    <td className={leftColumn}>
                      Total
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedStipendTotalDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.totalStipend}>
                      {adminCompSummaryData.approvedStipendTotalDisplayValue}
                    </td>
                  </tr>
                </tbody>
            </table>

            <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <th className={header+ " padding-bottom-0 "}>
                      Administrative 9ths: Allocation from EVCP's Office:
                      <ToolTip text={descriptions.ninthsAllocated} />
                      <br/>
                      <OtherHeader headers={adminCompSummaryData.ninthsHeaders}/>
                    </th>
                    <th className={smallHeader+ " padding-bottom-0 "} colSpan={2}>
                      Proposed
                      <br/>
                      <span className="no-bold">
                        {adminCompSummaryData.proposedNinthsRateDisplayValue ? "Admin. 9ths Rate: "+adminCompSummaryData.proposedNinthsRateDisplayValue : null}
                      </span>
                    </th>
                    <th className={smallHeader+ " padding-bottom-0 "} colSpan={2}>
                      Final Decision
                      <br/>
                        <span className="no-bold">
                        {adminCompSummaryData.approvedNinthsRateDisplayValue ? "Admin. 9ths Rate: "+adminCompSummaryData.approvedNinthsRateDisplayValue : null}
                        </span>
                    </th>
                  </tr>
                  <tr className="padding-top-0">
                    <th className={header}/>
                    <th className={smallHeader+" no-bold padding-top-0 "}>
                      # of Admin. 9ths
                    </th>
                    <th className={smallHeader+" no-bold padding-top-0 "}>
                      Total Amount
                    </th>
                    <th className={smallHeader+" no-bold padding-top-0 "}>
                      # of Admin. 9ths
                    </th>
                    <th className={smallHeader+" no-bold padding-top-0 "}>
                      Total Amount
                    </th>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      EVCP
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsEVCP}
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsEVCPAmountDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.ninthsEVCP}>
                      {adminCompSummaryData.approvedNinthsEVCP}
                    </td>
                    <td className={columnSmall+highlights.ninthsEVCPAmount}>
                      {adminCompSummaryData.approvedNinthsEVCPAmountDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Dean
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsDean}
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsDeanAmountDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.ninthsDean}>
                      {adminCompSummaryData.approvedNinthsDean}
                    </td>
                    <td className={columnSmall+highlights.ninthsDeanAmount}>
                      {adminCompSummaryData.approvedNinthsDeanAmountDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Dept.
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsDept}
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsDeptAmountDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.ninthsDept}>
                      {adminCompSummaryData.approvedNinthsDept}
                    </td>
                    <td className={columnSmall+highlights.ninthsDeptAmount}>
                      {adminCompSummaryData.approvedNinthsDeptAmountDisplayValue}
                    </td>
                  </tr>

                  {adminCompSummaryData.ninthsOther.map((source, index) => (
                       <tr key={index}>
                         <td className={leftColumn}>
                         Other{source.name ? ": "+source.name : null}
                        </td>
                        <td className={columnSmall}>
                          {source.proposedNinthsValue}
                        </td>
                        <td className={columnSmall}>
                          {source.proposedNinthsAmountDisplayValue}
                        </td>
                        <td className={columnSmall+source.ninthsHighlight}>
                          {source.approvedNinthsValue}
                        </td>
                        <td className={columnSmall+source.ninthsAmountHighlight}>
                          {source.approvedNinthsAmountDisplayValue}
                        </td>
                       </tr>
                  ))}

                  <tr className="strong">
                    <td className={leftColumn}>
                      Total
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsNumberTotalDisplayValue}
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedNinthsAmountTotalDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.ninthsTotal}>
                      {adminCompSummaryData.approvedNinthsNumberTotalDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.ninthsAmountTotal}>
                      {adminCompSummaryData.approvedNinthsAmountTotalDisplayValue}
                    </td>
                  </tr>
                </tbody>
            </table>

            <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <th className={header}>
                      Courses Releases
                    </th>
                    <th className={smallHeader}>
                      Proposed
                    </th>
                    <th className={smallHeader}/>
                    <th className={smallHeader}>
                      Final Decision
                    </th>
                    <th className={smallHeader}/>
                  </tr>
                  <tr>
                    <th className={header}/>
                    <th className={smallHeader+" no-bold "}>
                      # of Courses
                    </th>
                    <th className={smallHeader+" no-bold "}>
                      Estimated Cost to the School
                    </th>
                    <th className={smallHeader+" no-bold "}>
                      # of Courses
                    </th>
                    <th className={smallHeader+" no-bold "}>
                      Estimated Cost to the School
                    </th>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Course Releases
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedCourseReleasesDisplayValue}
                    </td>
                    <td className={columnSmall}>
                      {adminCompSummaryData.proposedCourseReleasesEstCostDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.courseReleases}>
                      {adminCompSummaryData.approvedCourseReleasesDisplayValue}
                    </td>
                    <td className={columnSmall+highlights.courseReleasesEstCost}>
                      {adminCompSummaryData.approvedCourseReleasesEstCostDisplayValue}
                    </td>
                  </tr>
                </tbody>
            </table>

            <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <th className={header}>
                      Totals
                    </th>
                    <th className={header}>
                      Proposed
                    </th>
                    <th className={header}>
                      Final Decision
                    </th>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Total Admin. Comp.  <ToolTip text={descriptions.totalAdminComp} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedTotalAdminCompDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.totalAdminComp}>
                      {adminCompSummaryData.approvedTotalAdminCompDisplayValue}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Base Salary
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.proposedBaseSalaryDisplayValue}
                    </td>
                    <td className={rightColumn+highlights.baseSalary}>
                      {adminCompSummaryData.approvedBaseSalaryDisplayValue}
                    </td>
                  </tr>
                  <tr className="strong">
                    <td className={leftColumn} >
                      Total Comp. <ToolTip text={descriptions.totalComp} />
                    </td>
                    <td className={middleColumn+adminCompSummaryData.proposedIclBackgroundClass}>
                      {adminCompSummaryData.proposedTotalCompDisplayValue}
                    </td>
                    <td className={adminCompSummaryData.hasOutcome ? rightColumn+adminCompSummaryData.approvedIclBackgroundClass : rightColumn}>
                      {adminCompSummaryData.approvedTotalCompDisplayValue}
                    </td>
                  </tr>
                </tbody>
            </table>
            <div className="row">
              <div className="col-md-4"/>
              <div className={"col-md-4 "+adminCompSummaryData.proposedIclTextClass}>
                {adminCompSummaryData.proposedIclMessage}
              </div>
              <div className={"col-md-4 "+adminCompSummaryData.approvedIclTextClass}>
                {adminCompSummaryData.hasOutcome ? adminCompSummaryData.approvedIclMessage : null}
              </div>
            </div>
            <br/>

            <h2>Tracking Dates
              <ShowIf show={this.state.canEditAdminCompFinalDecision}>
                <EditIcon {...{onClick: this.showTrackingEditModal}} position={null} className={'button edit-icon icon-pencil edit-case-button'}/>
              </ShowIf>

            </h2>
            <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <th className={header}>

                    </th>
                    <th className={header}>
                      Date
                    </th>
                    <th className={header}>
                      Name
                    </th>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Dean Submission  <ToolTip text={descriptions.deanSubmission} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.deanSubmissionDT ? moment(adminCompSummaryData.deanSubmissionDT).format('L') : null }
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.deanSubmissionByName}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Revision Requested  <ToolTip text={descriptions.revisionRequestedDate} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.revisionRequestedDT ? moment(adminCompSummaryData.revisionRequestedDT).format('L') : null }
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.revisionRequestedById}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      EVCP Approval <ToolTip text={descriptions.EVCPApproval} />
                    </td>
                    <td className={middleColumn}>
                     {adminCompSummaryData.evcpapprovedDT ? moment(adminCompSummaryData.evcpapprovedDT).format('L') : null }
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.evcpapprovedByName}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      UCOP Approval <ToolTip text={descriptions.UCOPApproval} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.ucopapprovedDT ? moment(adminCompSummaryData.ucopapprovedDT).format('L') : null }
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.ucopapprovedByName}
                    </td>
                  </tr>
                  <tr>
                    <td className={leftColumn}>
                      Completed <ToolTip text={descriptions.completed} />
                    </td>
                    <td className={middleColumn}>
                      {adminCompSummaryData.completedDT? moment(adminCompSummaryData.completedDT).format('L') : null }
                    </td>
                    <td className={rightColumn}>
                      {adminCompSummaryData.completedByName}
                    </td>
                  </tr>
                </tbody>
            </table>
            <br/><br/><br/><br/><br/><br/>

        {getCompensationSuccessModal}
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
