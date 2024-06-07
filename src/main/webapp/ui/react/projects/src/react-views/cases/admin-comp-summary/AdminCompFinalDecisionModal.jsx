import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import moment from "moment";

//My imports
// import {ShowIf} from '../common/components/elements/DisplayIf.jsx';
import {AdminCompHeader, OtherHeader} from "./AdminCompHeader.jsx";
import {PrePopulateButton} from "../case-summary/CaseSummaryComponents.jsx";
import * as util from "../../../opus-logic/common/helpers";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {FormShell, FormGroup} from "../../common/components/forms/FormRender.jsx";
import {FormInput, FormNumber, FormCurrency, FormTextArea, FormTextAreaMaxChar, FormAutoComplete, FormSelect, FormDate, FormDualInput} from
    "../../common/components/forms/FormElements.jsx";
import { descriptions } from "../../../opus-logic/common/constants/Descriptions.js";
import {ToolTip} from "../../common/components/elements/ToolTip.jsx";
import {EditIcon, DeleteIcon, CommentIcon} from "../../common/components/elements/Icon.jsx";
/******************************************************************************
 *
 * @desc - Selection for Delete or Withdraw Case Modal
 *
 ******************************************************************************/
export default class AdminCompFinalDecisionModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        hideFinalDecisionModal: PropTypes.func,
        dateFormat: PropTypes.string
    }

    static defaultProps = {
        showEditModal: false,
        dateFormat: "MM/DD/YYYY"
    }

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
     * @desc - Class variables
     *
     **/
    // Logic = new AdminCompSummary(this.props);

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
    state = {
        ...this.state,
        editData: {stipendOther: [], ninthsOther: []},
        adminCompSummaryDataFromAPI: {},
        typeOfApptList: {},
        multipleAdminApptsList: {},
        titleCodes: [],
        isPrepopulateDisabled: false,
        canEditAdminCompFinalDecision: false,
        isSaveButtonDisabled: false,
        isCompleteButtonDisabled: false
    };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
    componentWillReceiveProps(props) {
        let academicYearList = [];
        let multipleAdminApptsList = [];
        let compTypeList = [];
        let proAppList = [];
        let sourceTypeList = [];
        let typeOfApptList = [];
        let outcomeList = [];
        let titleCodes = this.props.Logic.formattedCommonCallLists.titleCodeOptions;

        if(props.clonedAdminCompSummaryData !== this.state.clonedAdminCompSummaryData){
            if(props.clonedAdminCompSummaryData.academicYearList){
                academicYearList = props.clonedAdminCompSummaryData.academicYearList;
            }
            if(props.clonedAdminCompSummaryData.multipleAdminApptsList){
                multipleAdminApptsList = props.clonedAdminCompSummaryData.multipleAdminApptsList;
            }
            if(props.clonedAdminCompSummaryData.compTypeList){
                compTypeList = props.clonedAdminCompSummaryData.compTypeList;
            }
            if(props.clonedAdminCompSummaryData.proAppList){
                proAppList = props.clonedAdminCompSummaryData.proAppList;
            }
            if(props.clonedAdminCompSummaryData.sourceTypeList){
                sourceTypeList = props.clonedAdminCompSummaryData.sourceTypeList;
            }
            if(props.clonedAdminCompSummaryData.typeOfApptList){
                typeOfApptList = props.clonedAdminCompSummaryData.typeOfApptList;
            }
            if(props.clonedAdminCompSummaryData.outcomeList){
                outcomeList = props.clonedAdminCompSummaryData.outcomeList;
            }
            let clonedAdminCompSummaryData = util.cloneObject(props.clonedAdminCompSummaryData);
            this.setUpClonedData(clonedAdminCompSummaryData);

            let canEditAdminCompFinalDecision = this.props.Logic.canEditAdminCompFinalDecision();
            let isSaveButtonDisabled = false;
            let isCompleteButtonDisabled = false;
            if(canEditAdminCompFinalDecision){
                isSaveButtonDisabled = this.props.Logic.shouldSaveButtonBeDisabledForFinalDecisionModal(clonedAdminCompSummaryData);
                isCompleteButtonDisabled = this.props.Logic.shouldCompleteBeDisabledForFinalDecisionModal(clonedAdminCompSummaryData);
            }
            this.setState({academicYearList, multipleAdminApptsList, outcomeList,
            titleCodes, compTypeList, proAppList, sourceTypeList, typeOfApptList,
            canEditAdminCompFinalDecision, isSaveButtonDisabled, isCompleteButtonDisabled});
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

    setUpClonedData = (clonedAdminCompSummaryData) => {

    // if(!clonedAdminCompSummaryData.acPropComp.hasOutcome){
    //     clonedAdminCompSummaryData.acPropComp.approvedStipendEVCP = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedStipendDean= null;
    //     clonedAdminCompSummaryData.acPropComp.approvedStipendDept = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedStipendTotal = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedFteOther = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedFteEVCP = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsEVCP = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsDean= null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsDept = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsEVCPAmount = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsDeanAmount = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsDeptAmount = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsRateAmount = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedCourseReleases = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsNumberTotal = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsAmountTotal = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedNinthsOtherAmountTotal = null;
    //     //clonedAdminCompSummaryData.acPropComp.approvedBaseSalary = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedTotalAdminComp = null;
    //     clonedAdminCompSummaryData.acPropComp.approvedTotalComp = null;
    // }

        this.validateOtherSources(clonedAdminCompSummaryData);
        this.setState({clonedAdminCompSummaryData, editData: clonedAdminCompSummaryData.acPropComp});
    }

    validateOtherSources = (clonedAdminCompSummaryData) => {
        if(clonedAdminCompSummaryData.acPropComp.stipendOther && clonedAdminCompSummaryData.acPropComp.stipendOther.length===1
            && !clonedAdminCompSummaryData.acPropComp.stipendOther[0].recStatus){
            clonedAdminCompSummaryData.acPropComp.stipendOther = [];
        }
        if(clonedAdminCompSummaryData.acPropComp.ninthsOther && clonedAdminCompSummaryData.acPropComp.ninthsOther.length===1
            && !clonedAdminCompSummaryData.acPropComp.ninthsOther[0].recStatus){
            clonedAdminCompSummaryData.acPropComp.ninthsOther = [];
        }
        return clonedAdminCompSummaryData;
    }


    /******************************************************************************
     *
     * @desc - Save function
     *
     ******************************************************************************/
    saveEditData = async () => {
        this.setState({isSaveButtonDisabled: true});
        let editData = this.validateData();
        if(!editData.hasErrors){
            try {
                let savePromise = await this.props.Logic.saveApprovedEditData(editData, this.props.adminCompSummaryDataFromAPI, false);
                this.setState({isPrepopulateDisabled: false});
                this.props.handlePromise(savePromise, "save");
            } catch(e) {
                console.error(e);
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            editData.modalErrorMessage = modalErrorMessage;
            this.setState({editData});
        }
        this.setState({isSaveButtonDisabled: false});
    }

    /******************************************************************************
     *
     * @desc - Complete function
     *
     ******************************************************************************/
    completeEditData = async () => {
        this.setState({isCompleteButtonDisabled: true});
        let editData = this.validateData();
        if(!editData.hasErrors){
            try {
                let savePromise = await this.props.Logic.saveApprovedEditData(editData, this.props.adminCompSummaryDataFromAPI, true);
                console.log(savePromise);
                this.setState({isPrepopulateDisabled: false});
                this.props.handlePromise(savePromise, "completeProposalFinalDecision");
            } catch(e) {
                console.error(e);
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            editData.modalErrorMessage = modalErrorMessage;
            this.setState({editData});
        }
        this.setState({isCompleteButtonDisabled: false});
    }

    validateData = () => {
        let {editData} = this.state;
        editData.hasErrors = false;
        let errorMessage = this.props.Logic.getErrorMessage();
        if(editData.hasOutcome){
            let fields = this.props.Logic.getApprovedValidationFields();
            for(let each of fields){
                if((editData[each] && editData[each]!=="-1") || editData[each]===0){
                    editData[each+"Error"] = null;
                }else{
                    editData[each+"Error"] = errorMessage;
                    editData.hasErrors = true;
                }
            }
            // Custom validation for 9ths rate
            this.validateNinthsRate(editData, errorMessage);

            // validate stipend other and ninths other
            this.validateOtherFields(editData, "stipendOther", "approvedValue");
            this.validateOtherFields(editData, "ninthsOther", "approvedNinthsAmountValue");
        }else{
            // OPUSDEV-3736 If disapproved, only validate outcome
            if(editData.outcomeId!=="4"){
                editData.hasErrors = true;
                editData.outcomeIdError = errorMessage;
            }
            // If disapproved, disable all other errors
            editData.approvedEffectiveDTError = false;
            editData.approvedEndDTError = false;
            editData.approvedFteEVCPError = false;
            editData.approvedFteOtherError = false;
            editData.approvedBaseSalaryError = false;
            editData.approvedStipendEVCPError = false;
            editData.approvedStipendDeanError = false;
            editData.approvedStipendDeptError = false;
            editData.approvedNinthsRateError = false;
            editData.approvedNinthsEVCPError = false;
            editData.approvedNinthsDeanError = false;
            editData.approvedNinthsDeptError = false;
            editData.approvedCourseReleasesEstCostError = false;
            editData.approvedCourseReleasesEstCostError = false;
            editData.modalErrorMessage = false;
        }
        return editData;
    }



    validateNinthsRate = (editData, errorMessage) => {
        // OPUSDEV-3726 Admin 9ths Rate cannot be blank, but can be 0
        if(editData.approvedNinthsRate!==null && editData.approvedNinthsRate>=0){
            editData.approvedNinthsRateError = null;
        }else{
            editData.approvedNinthsRateError = errorMessage;
            editData.hasErrors = true;
        }
        return editData;
    }

    validateOtherFields = (editData, arrayField, field) => {
        let errorMessage = "";
        if (arrayField === "stipendOther") {
            errorMessage = this.props.Logic.getStipendOtherFieldErrorMessage();
        }
        if (arrayField === "ninthsOther") {
            errorMessage = this.props.Logic.getNinthsOtherFieldErrorMessage();
        }
        for(let each of editData[arrayField]){
            // See if source name exists and values exist
            // OPUSDEV-3767 Added validation for all enabled fields and validation for null values
            if(each.disableApprovedFields || each.recStatus==="D" || (each.name && each.name!==""
                && each[field]!==null && each[field]>=0)){
                each.error = null;
            }else{
                each.error = errorMessage;
                editData.hasErrors = true;
            }
        }
        return editData;
    }

       /******************************************************************************
     *
     * @desc - Modal on change functions and calculations
     *
     ******************************************************************************/
    onBlur() {
        // OPUSDEV-3743
    }

    disablePrepopulateButton = () => {
        this.setState({isPrepopulateDisabled: true});
        this.refresh();
    }

    refresh = () => {
        setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
    }

    revertEditData = () => {
        this.props.hideFinalDecisionModal();
        this.setState({isPrepopulateDisabled: false});
    }

    wipeEditData = (editData) => {
        editData.hasOutcome = false;
        // editData.academicYear = null;
        // editData.typeOfApptId = null;
        editData.approvedEffectiveDT = null;
        editData.approvedEndDT = null;
        // editData.unit = null;
        // editData.organizationName = null;
        // editData.titleCodeId = null;
        // editData.workingTitle = null;
        // editData.justification = null;
        // editData.multipleAdminApptsId = null;

        editData.approvedFteEVCP = null;
        editData.approvedFteOther = null;
        editData.approvedBaseSalary = null;
        editData.approvedNSTP = null;

        editData.approvedStipendEVCP = null;
        editData.approvedStipendDean = null;
        editData.approvedStipendDept = null;
        editData.approvedStipendTotal = null;
        editData.approvedStipendTotalDisplayValue = null;

        editData.approvedNinthsRate = null;
        editData.approvedNinthsEVCP = null;
        editData.approvedNinthsEVCPAmountDisplayValue = null;
        editData.approvedNinthsDean = null;
        editData.approvedNinthsDeanAmountDisplayValue = null;
        editData.approvedNinthsDept = null;
        editData.approvedNinthsDeptAmountDisplayValue = null;

        editData.approvedNinthsNumberTotal = null;
        editData.approvedNinthsNumberTotalDisplayValue = null;
        editData.approvedNinthsAmountTotalDisplayValue = null;

        editData.approvedCourseReleases = null;
        editData.approvedCourseReleasesEstCost = null;

        editData.approvedTotalAdminComp = null;
        editData.approvedTotalAdminCompDisplayValue = null;
        editData.approvedTotalComp = null;
        editData.approvedTotalCompDisplayValue = null;
        // Delete stipend others
        this.wipeOtherSources(editData, "stipendOther");
        // Delete ninths others
        this.wipeOtherSources(editData, "ninthsOther");

        return editData;
    }

    wipeOtherSources = (editData, typeOfOther) => {
        for(let each in editData[typeOfOther]){
            let otherSource = editData[typeOfOther][each];
            if(otherSource.recStatus==="N"){
                editData[typeOfOther].splice(each, 1);
            }else{
                this.checkRecStatusBasedOnProposed(editData, typeOfOther, each);
            }
        }
        return editData;
    }

    onChange = (e, field) => {
        let {editData} = this.state;
        let value = e.target.value;
        editData[field] = value;
        if(field==="outcomeId" && value==="4"){
            this.wipeEditData(editData);
            editData.hasOutcome = false;
        }else if(field==="outcomeId" && value!==""){
            editData.hasOutcome = true;
        }
        this.setState({editData});
        this.disablePrepopulateButton();
    }

    onChangeDate = (e, field) => {
        let {editData} = this.state;
        let approvedEffDt = moment(e.target.value).isValid() ? moment(e.target.value).format(this.props.dateFormat) : null;
        let date = moment(e.target.value).isValid() ? moment(e.target.value).format() : null;
        editData.approvedEffectiveDTDisplayValue = approvedEffDt;
        editData[field] = date;
        if(field === "approvedEffectiveDT"){
            this.getICLThreshold(editData);
        }
        this.setState({editData});
        this.disablePrepopulateButton();
    }

    onChangeNumber = (e, field) => {
        let {editData} = this.state;
        let value = parseFloat(e.target.value);
        if(field==="approvedStipendEVCP" || field==="approvedStipendDean" || field==="approvedStipendDept"){
            editData[field] =  value;
            this.stipendTotalCalculations(editData);
        }else if(field==="approvedNinthsRate"){
            this.ninthsRateCalculations(editData, value);
            this.findNinthsTotals(editData);
        }else if(field==="approvedFteEVCP" || field==="approvedFteOther"){
            // OPUSDEV-3709 FTE input fields correctly rounds to 2 decimal places
            let formattedValue = value.toFixed(2);
            value = parseFloat(formattedValue);
            editData[field] = value;
        }else if(field==="approvedNinthsEVCPAmount" || field==="approvedNinthsDeanAmount" || field==="approvedNinthsDeptAmount"){
            value = this.props.Logic.validateDecimalInputsForAmount(e);
            editData[field] = parseFloat(value);
            this.ninthsCalculations(editData, field, value);
            this.findNinthsTotals(editData);
        }else if(field==="approvedBaseSalary"){
            editData[field] = value;
            // calculate ninths rate
            let ninthsRate = parseFloat((value/9));
            this.ninthsRateCalculations(editData, ninthsRate);
            this.findNinthsTotals(editData);
        }else{
            editData[field] = value;
        }

        this.findTotals(editData);
        this.setState({editData});
        this.disablePrepopulateButton();
    }

    onChangeOther = (e, field, typeOfOther, index) => {
        let {editData} = this.state;
        if(field==="name"){
            editData[typeOfOther][index][field] = e.target.value;
        }else{
            if(typeOfOther==="stipendOther"){
                let parsedValue = parseFloat(e.target.value);
                editData[typeOfOther][index][field] = parsedValue;
                editData[typeOfOther][index][field+"DisplayValue"] = e.target.value;
                this.props.Logic.findOtherTotal(editData, typeOfOther, "approvedStipendOtherTotal", "approvedValue");
                this.stipendTotalCalculations(editData);
            }else if(typeOfOther==="ninthsOther"){
                let value = this.props.Logic.validateDecimalInputsForAmount(e);
                let parsedValue = parseFloat(value);
                editData[typeOfOther][index][field] = parsedValue;
                editData[typeOfOther][index][field+"DisplayValue"] = value;
                this.ninthsOtherCalculations(editData, typeOfOther, parsedValue, index);
                this.props.Logic.findOtherTotal(editData, typeOfOther, "approvedNinthsOtherNumberTotal", "approvedNinthsValue");
                this.props.Logic.findOtherTotal(editData, typeOfOther, "approvedNinthsOtherAmountTotal", "approvedNinthsAmountValue");
                this.findNinthsTotals(editData);
            }
        }
        this.props.Logic.setRecStatus(editData, typeOfOther, index);
        this.findTotals(editData);
        this.setState({editData});
        this.disablePrepopulateButton();
    }



    stipendTotalCalculations = (editData) => {
        editData.approvedStipendTotal = parseFloat((editData.approvedStipendEVCP + editData.approvedStipendDean + editData.approvedStipendDept
        + editData.approvedStipendOtherTotal).toFixed(2));
        editData.approvedStipendTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.approvedStipendTotal);
        return editData;
    }

    ninthsOtherCalculations = (editData, typeOfOther, parsedValue, index) => {
        let numberOfNinths = (parsedValue/editData.approvedNinthsRate);
        this.checkNinthsValue(numberOfNinths, typeOfOther+" "+index);
        editData[typeOfOther][index].approvedNinthsValue = parseFloat(numberOfNinths.toFixed(10));
        return editData;
    }

    checkNinthsValue = (numberOfNinthsValue, field) => {
        if(numberOfNinthsValue!==0 && !numberOfNinthsValue){
            console.log("Error with Number of Ninths Value for "+field)
        }
    }

    ninthsRateCalculations = (editData, value) => {
        let numberOfNinthsValue = 0;
        let verifiedValue;
        if (parseFloat(value)>=0){
            verifiedValue = parseFloat(value.toFixed(2));
        }else{
            verifiedValue = 0;
        }
        if(editData.approvedNinthsEVCPAmount!==null && editData.approvedNinthsEVCPAmount>=0){
            numberOfNinthsValue = (editData.approvedNinthsEVCPAmount/verifiedValue);
            this.checkNinthsValue(numberOfNinthsValue, "approvedNinthsEVCPAmount");
            editData.approvedNinthsEVCP = parseFloat(numberOfNinthsValue.toFixed(10));
        }
        if(editData.approvedNinthsDeanAmount!==null && editData.approvedNinthsDeanAmount>=0){
            numberOfNinthsValue = (editData.approvedNinthsDeanAmount/verifiedValue);
            this.checkNinthsValue(numberOfNinthsValue, "approvedNinthsDeanAmount");
            editData.approvedNinthsDean = parseFloat(numberOfNinthsValue.toFixed(10));
        }
        if(editData.approvedNinthsDeptAmount!==null && editData.approvedNinthsDeptAmount>=0){
            numberOfNinthsValue = (editData.approvedNinthsDeptAmount/verifiedValue);
            this.checkNinthsValue(numberOfNinthsValue, "approvedNinthsDeptAmount");
            editData.approvedNinthsDept = parseFloat(numberOfNinthsValue.toFixed(10));
        }
        // if(editData.approvedNinthsNumberTotal!==null && editData.approvedNinthsNumberTotal>=0){
        //     numberOfNinthsValue = (editData.approvedNinthsNumberTotal*verifiedValue);
        //     this.checkNinthsValue(numberOfNinthsValue, "approvedNinthsNumberTotal");
        //     editData.approvedNinthsAmountTotal = numberOfNinthsValue;
        //     editData.approvedNinthsAmountTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
        // }
        // Find ninths other sources amounts
        if(editData.ninthsOther && editData.ninthsOther.length>0){
            let ninthsTotal = 0;
            for(let each in editData.ninthsOther){
                if(editData.ninthsOther[each].approvedNinthsAmountValue!==null && editData.ninthsOther[each].approvedNinthsAmountValue>=0){
                    numberOfNinthsValue = (editData.ninthsOther[each].approvedNinthsAmountValue/verifiedValue);
                    this.checkNinthsValue(numberOfNinthsValue, "approvedNinthsValue - "+each.toString());
                    editData.ninthsOther[each].approvedNinthsValue = parseFloat(numberOfNinthsValue.toFixed(10));
                    ninthsTotal = ninthsTotal + parseFloat(numberOfNinthsValue.toFixed(10));
                }
            }
            editData.approvedNinthsOtherNumberTotal = parseFloat(ninthsTotal.toFixed(10));
        }
        editData.approvedNinthsRate = verifiedValue;
        return editData;
    }

    ninthsCalculations = (editData, field, value) => {
        let numberOfNinths = (value/editData.approvedNinthsRate);
        numberOfNinths = parseFloat(numberOfNinths.toFixed(10));
        if(field==="approvedNinthsEVCPAmount"){
            editData.approvedNinthsEVCP = numberOfNinths;
        }
        if(field==="approvedNinthsDeanAmount"){
            editData.approvedNinthsDean = numberOfNinths;
        }
        if(field==="approvedNinthsDeptAmount"){
            editData.approvedNinthsDept = numberOfNinths;
        }

        return editData;
    }

    findNinthsTotals = (editData) => {
        editData.approvedNinthsNumberTotal = editData.approvedNinthsEVCP + editData.approvedNinthsDean + editData.approvedNinthsDept + editData.approvedNinthsOtherNumberTotal;
        editData.approvedNinthsNumberTotalDisplayValue = parseFloat(editData.approvedNinthsNumberTotal.toFixed(10));
        editData.approvedNinthsAmountTotal = editData.approvedNinthsEVCPAmount + editData.approvedNinthsDeanAmount + editData.approvedNinthsDeptAmount + editData.approvedNinthsOtherAmountTotal;
        editData.approvedNinthsAmountTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.approvedNinthsAmountTotal);
        return editData;
    }

    findTotals = (editData) => {
        editData.approvedTotalAdminComp = parseFloat((editData.approvedNinthsAmountTotal + editData.approvedStipendTotal).toFixed(2));
        editData.approvedTotalAdminCompDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.approvedTotalAdminComp);
        editData.approvedTotalComp = parseFloat((editData.approvedTotalAdminComp + editData.approvedBaseSalary).toFixed(2));
        editData.approvedTotalCompDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.approvedTotalComp);
        editData = this.props.setApprovedICLMessage(editData, editData.proposedIclThreshold, editData.approvedTotalComp);
        return editData;
    }

    addNewOtherSource = (typeOfOther) => {
        let {editData} = this.state;
        let object = {
            proposedDisplayValue: null,
            proposedValue: null,
            name: "",
            recStatus: "N",
            proposedApproved: "Approved",
            approvedDisplayValue: "$0",
            approvedValue: 0,
        };
        if(typeOfOther==="ninthsOther"){
            object ={
                proposedNinthsAmountDisplayValue: null,
                proposedNinthsAmountValue: null,
                proposedNinthsValue: null,
                proposedNinthsValueDisplayValue: null,
                name: "",
                recStatus: "N",
                proposedApproved: "Approved",
                approvedNinthsAmountDisplayValue: "$0",
                approvedNinthsAmountValue: 0,
                approvedNinthsValue: 0,
                approvedNinthsValueDisplayValue: "$0"
            };
        }
        editData[typeOfOther].push(object);
        this.setState({editData});
        this.disablePrepopulateButton();
    }

    deleteOtherCourse = (index, typeOfOther) => {
        let {editData} = this.state;

        // Only changed recStatus to "D" (Delete) if coming from backend ("U") or edited ("C")
        if(editData[typeOfOther][index].recStatus==="U" || editData[typeOfOther][index].recStatus==="C"){
            this.checkRecStatusBasedOnProposed(editData, typeOfOther, index);
        }else{
            // Or else remove from array
            editData[typeOfOther].splice(index, 1);
        }
        // Subtract from totals
        if(typeOfOther==="stipendOther"){
            this.props.Logic.findOtherTotal(editData, typeOfOther, "approvedStipendOtherTotal", "approvedValue");
            this.stipendTotalCalculations(editData);
        }else if(typeOfOther==="ninthsOther"){
            this.props.Logic.findOtherTotal(editData, typeOfOther, "approvedNinthsOtherNumberTotal", "approvedNinthsValue");
            this.props.Logic.findOtherTotal(editData, typeOfOther, "approvedNinthsOtherAmountTotal", "approvedNinthsAmountValue");
            this.findNinthsTotals(editData);
        }

        this.setState({editData});
        this.disablePrepopulateButton();
    }

    checkRecStatusBasedOnProposed = (editData, typeOfOther, index) => {
        // Set correct values to check and set
        let valueToCheck = "proposedValue";
        let valuesToSet = ["approvedValue", "approvedDisplayValue"];
        if(typeOfOther==="ninthsOther"){
            valueToCheck = "proposedNinthsValue";
            valuesToSet = ["approvedNinthsValue", "approvedNinthsAmountValue", "approvedNinthsAmountDisplayValue"];
        }
        // When deleting other source, check for corresponding proposed value , make sure it is not null.
        // If there is corresponding values, then recStatus is “C” and null values instead of changing the recStatus to “D”;
        if(editData[typeOfOther][index].disableProposedFields){
            editData[typeOfOther][index].recStatus = "D";
        }else{
            for(let each of valuesToSet){
                editData[typeOfOther][index][each] = null;
            }
            editData[typeOfOther][index].recStatus = "C";
            editData[typeOfOther][index].disableApprovedFields = true;
            editData[typeOfOther][index].disableOtherApprovedFields = true;
        }
        return editData;
    }

   /******************************************************************************
     *
     * @desc -Unit search functions
     *
     ******************************************************************************/
    searchUnit = async ({term: searchString} = {}, response) => {
        let unitOptions = await this.props.Logic.onSearchUnit(searchString);
        this.setState({unitOptions});
        this.props.Logic.setClassData({unitOptions});
        response(Object.values(unitOptions));
    }

    onChangeSearchUnit = (e) => {
        let {editData} = this.state;
        let value = e.target.value;
        if(value.length<3){
            editData.unit = null;
        }
        this.setState({editData});
    }

    onClickSearchUnit = (e) => {
        let {editData, unitOptions} = this.state;
        let value = e.target.value;
        let ahPathId = Object.keys(unitOptions).find(key => unitOptions[key] === value);
        editData.academicHierarchyPathId = parseInt(ahPathId);

        // Split by : and reverse array to check from the last element
        let unitName = value.split(":").reverse();
        editData.unit = value;

        // Loop through and find first non N/A to display
        let organizationName;
        for(let name of unitName){
            if(name!=="N/A"){
                organizationName = name;
                break;
            }
        }

        // Set organization name
        editData.organizationName = organizationName;
        this.getICLThreshold(editData);
    }

    getICLThreshold = async (editData) => {
        try {
            let iclThreshold = await this.props.Logic.getApprovedICLThreshold(editData);
            editData.approvedIclThreshold = iclThreshold;
            editData = this.props.setApprovedICLMessage(editData, editData.approvedIclThreshold, editData.approvedTotalComp);
            this.setState({editData});
        } catch(e) {
            console.log("ICL API ERROR:");
            console.error(e);
        }
    }

    // Prepopulate button
    onClickPrepopulate = () => {
        let {editData} = this.state;
        editData.outcome = null;
        editData.outcomeId = null;
        // OPUSDEV-3736 Prepopulate has to turn outcome true to bring over and turn on disabled mutual fields
        editData.hasOutcome = true;

        editData.approvedEffectiveDT = editData.proposedEffectiveDT;
        editData.approvedEndDT = editData.proposedEndDT;
        editData.approvedFteEVCP = editData.proposedFteEVCP;
        editData.approvedFteOther = editData.proposedFteOther;
        editData.approvedBaseSalary = editData.proposedBaseSalary;
        editData.approvedNSTP = editData.proposedNSTP;
        editData.approvedStipendEVCP = editData.proposedStipendEVCP;
        editData.approvedStipendDean = editData.proposedStipendDean;
        editData.approvedStipendDept = editData.proposedStipendDept;


        // Loop through proposed stipend other sources
        let stipendOther = [];
        for(let eachStipendOther of editData.stipendOther){

            if(eachStipendOther.proposedValue!==null){
                eachStipendOther.approvedValue = eachStipendOther.proposedValue;
                eachStipendOther.approvedDisplayValue = eachStipendOther.proposedDisplayValue;
                eachStipendOther.recStatus = "C";
                eachStipendOther.disableOtherApprovedFields = true;
            }else{
                eachStipendOther.recStatus = "D";
            }
            stipendOther.push(eachStipendOther);
        }
        editData.stipendOther = stipendOther;

        this.props.Logic.findOtherTotal(editData, "stipendOther", "approvedStipendOtherTotal", "approvedValue");
        this.stipendTotalCalculations(editData);
        editData.approvedNinthsRate = editData.proposedNinthsRate;
        editData.approvedNinthsEVCP = editData.proposedNinthsEVCP;
        editData.approvedNinthsEVCPAmount = editData.proposedNinthsEVCPAmount;
        editData.approvedNinthsDean = editData.proposedNinthsDean;
        editData.approvedNinthsDeanAmount = editData.proposedNinthsDeanAmount;
        editData.approvedNinthsDept = editData.proposedNinthsDept;
        editData.approvedNinthsDeptAmount = editData.proposedNinthsDeptAmount;

         // Loop through proposed ninths other sources
        let ninthsOther = [];
        for(let eachNinthsOther of editData.ninthsOther){
            if(eachNinthsOther.proposedNinthsValue!==null){
                eachNinthsOther.approvedNinthsValue = eachNinthsOther.proposedNinthsValue;
                eachNinthsOther.approvedNinthsAmountValue = eachNinthsOther.proposedNinthsAmountValue;
                eachNinthsOther.approvedNinthsAmountDisplayValue = eachNinthsOther.proposedNinthsAmountDisplayValue;
                eachNinthsOther.recStatus = "C";
                eachNinthsOther.disableOtherApprovedFields = true;
            }else{
                eachNinthsOther.recStatus = "D";
            }
            ninthsOther.push(eachNinthsOther);
        }
        editData.ninthsOther = ninthsOther;

        this.ninthsRateCalculations(editData, editData.approvedNinthsRate);
        this.props.Logic.findOtherTotal(editData, "ninthsOther", "approvedNinthsOtherNumberTotal", "approvedNinthsValue");

        editData.approvedCourseReleases = editData.proposedCourseReleases;
        editData.approvedCourseReleasesEstCost = editData.proposedCourseReleasesEstCost;
        this.findNinthsTotals(editData);
        this.findTotals(editData);

        this.setState({editData, isPrepopulateDisabled: true});
        this.refresh();
    }

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {
        let {editData, clonedAdminCompSummaryData, academicYearList, multipleAdminApptsList, outcomeList,
        compTypeList, proAppList, sourceTypeList, typeOfApptList, titleCodes, isSaveButtonDisabled,
        isPrepopulateDisabled, isCompleteButtonDisabled} = this.state;
        return(
        <Modal className=" modal-lg " backdrop="static" show={this.props.showEditModal}
            onHide={this.revertEditData}>
            <Header className=" modal-info modal-header " closeButton>
                <Title> <h1 className=" modal-title black ">Administrative Compensation</h1> </Title>
            </Header>
            <Body>
                <h2 className="flush-top">Edit Final Decision</h2>

                <AdminCompHeader adminCompSummaryData={editData}
                    adminCompSummaryDataFromAPI={clonedAdminCompSummaryData}/>

                <div>
                    <button onClick={this.onClickPrepopulate} className="btn btn-primary" disabled={isPrepopulateDisabled}>
                    Pre-Populate the Fields Below
                    </button>     <ToolTip text={descriptions.prepopulateDisabled} />
                    <p></p>
                    <p className="small">
                    Click this button to fill in the fields below with the proposed status.
                    </p>
                </div>

                <table className=' table table-bordered table-responsive'>
                    <tbody>
                        <tr>
                            <th className={" col-md-12 "} colSpan="2">
                                Admin. Comp. Summary
                            </th>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Outcome
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={outcomeList}
                                    onChange={(e) => this.onChange(e, "outcomeId")}
                                    value={editData.outcomeId}
                                    hasError={editData.outcomeIdError ? true : false}
                                    error={editData.outcomeIdError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Academic Year
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={academicYearList}
                                    onChange={(e) => this.onChange(e, "academicYear")}
                                    value={editData.hasOutcome ? editData.academicYear : null}
                                    hasError={editData.academicYearError ? true : false}
                                    error={editData.academicYearError}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Type of Appointment <ToolTip text={descriptions.typeOfAppointment} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={typeOfApptList}
                                    onChange={(e) => this.onChange(e, "typeOfApptId")}
                                    value={editData.hasOutcome ? editData.typeOfApptId : null}
                                    hasError={editData.typeOfApptIdError ? true : false}
                                    error={editData.typeOfApptIdError}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Effective Date
                            </td>
                            <td className={' col-md-8 '}>
                                <FormDate onChange={(e) => this.onChangeDate(e, "approvedEffectiveDT")}
                                    value={editData.approvedEffectiveDT ? moment(editData.approvedEffectiveDT).format("L") : null}
                                    hasError={editData.approvedEffectiveDTError ? true : false}
                                    error={editData.approvedEffectiveDTError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            End Date <ToolTip text={descriptions.endDate} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormDate onChange={(e) => this.onChangeDate(e, "approvedEndDT")}
                                    value={moment(editData.approvedEndDT).format("L")}
                                    hasError={editData.approvedEndDTError ? true : false}
                                    error={editData.approvedEndDTError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Unit Selected <ToolTip text={descriptions.unitSelected} />
                            </td>
                            <td className={' col-md-8 '}>
                              <FormTextAreaMaxChar name="unit" rows = "2"
                                  value={editData.hasOutcome ? editData.unit : ""}
                                  hasError={editData.unitError ? true : false}
                                  error={editData.unitError ? "Please search and select a unit above." : null}
                                  disabled={true}
                                  right_field_css={' col-sm-12 '}
                                  base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>

                            Organization Name (max 250 characters)<ToolTip text={descriptions.organizationNameForProposalsFinalDecision} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormTextAreaMaxChar name="organizationName"
                                    value={editData.hasOutcome ? editData.organizationName : ""}
                                    onChange={(e) => this.onChange(e, "organizationName")}
                                    onBlur={this.onBlur}
                                    hasError={editData.organizationNameError ? true : false}
                                    error={editData.organizationNameError}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Title Code: Title Selected <ToolTip text={descriptions.titleCodeForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={titleCodes}
                                    onChange={(e) => this.onChange(e, "titleCodeId")}
                                    onBlur={this.onBlur}
                                    value={editData.hasOutcome ? editData.titleCodeId : null}
                                    hasError={editData.titleCodeIdError ? true : false}
                                    error={editData.titleCodeIdError}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Working Title / Role <ToolTip text={descriptions.workingTitleForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormTextAreaMaxChar name="workingTitle" value={editData.hasOutcome ? editData.workingTitle : ""}
                                    onChange={(e) => this.onChange(e, "workingTitle")}
                                    onBlur={this.onBlur}
                                    hasError={editData.workingTitleError ? true : false}
                                    error={editData.workingTitleError}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Justification (optional) (max 250 characters) <ToolTip text={descriptions.justificationForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormTextAreaMaxChar name="justification" value={editData.hasOutcome ? editData.justification : ""}
                                    onChange={(e) => this.onChange(e, "justification")}
                                    onBlur={this.onBlur}
                                    hasError={editData.justificationErrorMessage ? true : false}
                                    error={editData.justificationErrorMessage}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Multiple Administrative Appts? <ToolTip text={descriptions.multipleAdminApptsForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={multipleAdminApptsList}
                                    onChange={(e) => this.onChange(e, "multipleAdminApptsId")}
                                    value={editData.hasOutcome ? editData.multipleAdminApptsId : null}
                                    hasError={editData.multipleAdminApptsIdError ? true : false}
                                    error={editData.multipleAdminApptsIdError}
                                    disabled={true}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            FTE - EVCP <ToolTip text={descriptions.FTEEVCP} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormNumber name="fullTimeEquivalent"
                                    value={editData.approvedFteEVCP}
                                    onChange={(e) => this.onChangeNumber(e, "approvedFteEVCP")}
                                    descriptionText={descriptions.approvedFteEVCP}
                                    hasError={editData.approvedFteEVCPError ? true : false}
                                    error={editData.approvedFteEVCPError}
                                    right_field_css={' col-sm-4 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            FTE - Other <ToolTip text={descriptions.FTEOther} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormNumber name="fullTimeEquivalent"
                                    value={editData.approvedFteOther}
                                    onChange={(e) => this.onChangeNumber(e, "approvedFteOther")}
                                    descriptionText={descriptions.approvedFteOther}
                                    hasError={editData.approvedFteOtherError ? true : false}
                                    error={editData.approvedFteOtherError}
                                    right_field_css={' col-sm-4 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Base Salary <ToolTip text={descriptions.baseSalaryEdit} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormCurrency name="stipend"
                                    value={editData.approvedBaseSalary}
                                    onChange={(e) => this.onChangeNumber(e, "approvedBaseSalary")}
                                    descriptionText={descriptions.approvedBaseSalary}
                                    hasError={editData.approvedBaseSalaryError ? true : false}
                                    error={editData.approvedBaseSalaryError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            NSTP <ToolTip text={descriptions.NSTPforProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={false} valueIsText
                                    options={["No", "Yes"]}
                                    onChange={(e) => this.onChange(e, "approvedNSTP")}
                                    value={editData.approvedNSTP}
                                    hasError={editData.approvedNSTPError ? true : false}
                                    error={editData.approvedNSTPError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className=' table table-bordered table-responsive'>
                    <tbody>
                        <tr>
                            <th className={" col-md-4 "}>
                                Stipends: Allocated Funds from EVCP's Office <ToolTip text={descriptions.StipendForProposal} />
                            </th>
                            <th className={" col-md-8 "}>
                                Amount
                            </th>
                        </tr>
                        <tr>
                            <th className={" col-md-4 "} colSpan="2">
                                <OtherHeader headers={editData.stipendHeaders}/>
                            </th>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            EVCP
                            </td>
                            <td className={' col-md-8 '}>
                                <FormCurrency name="approvedStipendEVCP"
                                    value={editData.approvedStipendEVCP}
                                    onChange={(e) => this.onChangeNumber(e, "approvedStipendEVCP")}
                                    hasError={editData.approvedStipendEVCPError ? true : false}
                                    error={editData.approvedStipendEVCPError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Dean
                            </td>
                            <td className={' col-md-8 '}>
                                <FormCurrency name="approvedStipendDean"
                                    value={editData.approvedStipendDean}
                                    onChange={(e) => this.onChangeNumber(e, "approvedStipendDean")}
                                    hasError={editData.approvedStipendDeanError ? true : false}
                                    error={editData.approvedStipendDeanError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Dept.
                            </td>
                            <td className={' col-md-8 '}>
                                <FormCurrency name="approvedStipendDept"
                                    value={editData.approvedStipendDept}
                                    onChange={(e) => this.onChangeNumber(e, "approvedStipendDept")}
                                    hasError={editData.approvedStipendDeptError ? true : false}
                                    error={editData.approvedStipendDeptError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        {editData.stipendOther.map((other, index) => (
                            other.recStatus!=="D" ?
                                <tr key={index}>
                                    <td className=' label-column col-md-6 '>
                                        <div>Other Source Name <ToolTip text={other.disableApprovedFields ? descriptions.approvedSourceDisabled : descriptions.otherSourceStipendName} /></div>
                                        <FormInput name="approvedStipendOther"
                                            displayName={'Other Source Name'}  value={other.name}
                                            onChange={(e) => this.onChangeOther(e, "name", "stipendOther", index)}
                                            hasError={other.error ? true : false}
                                            error={other.error}
                                            showLabel={false}
                                            descriptionText={descriptions.approvedStipendOther}
                                            disabled={other.disableOtherApprovedFields || other.recStatus!=="N"}/>
                                    </td>
                                    <td className=' col-md-6 '>
                                        <div>&nbsp;</div>
                                        <FormCurrency name="approvedStipendOther"
                                            value = {other.approvedValue}
                                            onChange={(e) => this.onChangeOther(e, "approvedValue", "stipendOther", index)}
                                            hasError={other.error ? true : false}
                                            right_field_css={' col-sm-8 '}
                                            base_css={''} left_field_css={''} showLabel={false}
                                            disabled={other.disableApprovedFields}/>
                                        <div className= 'col-md-4 form-control-static'>
                                            <ShowIf show={!other.disableApprovedFields}>
                                                <Button className="btn btn-primary btn-sm" onClick={() => this.deleteOtherCourse(index, "stipendOther")}>Delete</Button>
                                            </ShowIf>
                                        </div>
                                    </td>
                                </tr>
                            :
                            null
                        ))}
                        <tr>
                            <td className={' label-column col-md-4 '} />
                            <td className={' col-md-8 '}>
                                <div className="col-sm-12">
                                    <Button className="btn btn-primary btn-sm" onClick={() => this.addNewOtherSource("stipendOther")}>Add Another Source</Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Total
                            </td>
                            <td className={' col-md-8 '}>
                                {editData.approvedStipendTotalDisplayValue}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className=' table table-bordered table-responsive'>
                    <tbody>
                        <tr>
                            <th colSpan="3">
                                Administrative 9ths: Allocation from EVCP's Office <ToolTip text={descriptions.ninthsAllocated} />
                                <br/>
                                <OtherHeader headers={editData.ninthsHeaders}/>
                            </th>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                                Admin. 9ths Rate  <ToolTip text={descriptions.ninthsRateForProposal} />
                            </td>
                            <td className={" col-md-4 "} colSpan="2">
                                <FormCurrency name="approvedNinthsRate"
                                    value={editData.approvedNinthsRate}
                                    onChange={(e) => this.onChangeNumber(e, "approvedNinthsRate")}
                                    hasError={editData.approvedNinthsRateError ? true : false}
                                    error={editData.approvedNinthsRateError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <th className={" col-md-4 "}/>
                            <th className={" col-md-4 "}>
                                # of Admin. 9ths <ToolTip text={descriptions.numOfNinthsAdmin} />
                            </th>
                            <th className={" col-md-4 "}>
                                Amount
                            </th>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                            EVCP
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.approvedNinthsEVCP}
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="approvedNinthsEVCPAmount"
                                    value={editData.approvedNinthsEVCPAmount}
                                    onChange={(e) => this.onChangeNumber(e, "approvedNinthsEVCPAmount")}
                                    hasError={editData.approvedNinthsEVCPAmountError ? true : false}
                                    error={editData.approvedNinthsEVCPAmountError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                            Dean
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.approvedNinthsDean}
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="approvedNinthsDeanAmount"
                                    value={editData.approvedNinthsDeanAmount}
                                    onChange={(e) => this.onChangeNumber(e, "approvedNinthsDeanAmount")}
                                    hasError={editData.approvedNinthsDeanAmountError ? true : false}
                                    error={editData.approvedNinthsDeanAmountError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                            Dept.
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.approvedNinthsDept}
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="approvedNinthsDeptAmount"
                                    value={editData.approvedNinthsDeptAmount}
                                    onChange={(e) => this.onChangeNumber(e, "approvedNinthsDeptAmount")}
                                    hasError={editData.approvedNinthsDeptAmountError ? true : false}
                                    error={editData.approvedNinthsDeptAmountError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        {editData.ninthsOther.map((other, index) => (
                            other.recStatus!=="D" ?
                                <tr key={index}>
                                    <td className=' label-column col-md-4 '>
                                    <div>Other Source Name <ToolTip text={other.disableApprovedFields ? descriptions.approvedSourceDisabled : descriptions.otherSourceNinthsName} /></div>
                                        <FormInput name="approvedNinthsOther"
                                            displayName={'Other Source Name'}  value={other.name}
                                            onChange={(e) => this.onChangeOther(e, "name", "ninthsOther", index)}
                                            hasError={other.error ? true : false}
                                            error={other.error}
                                            showLabel={false}
                                            descriptionText={descriptions.approvedNinthsOther}
                                            disabled={other.disableOtherApprovedFields || other.recStatus!=="N"}
                                            right_field_css={' col-sm-12 '}/>
                                    </td>
                                    <td className=' col-md-4 '>
                                    <div>&nbsp;</div>
                                        {other.approvedNinthsValue}

                                    </td>
                                    <td className=' col-md-4 '>
                                        <FormCurrency name="approvedNinthsOther"
                                            value = {other.approvedNinthsAmountValue}
                                            onChange={(e) => this.onChangeOther(e, "approvedNinthsAmountValue", "ninthsOther", index)}
                                            hasError={other.error ? true : false}
                                            right_field_css={' col-sm-8 '}
                                            base_css={''} left_field_css={''} showLabel={false}
                                            disabled={other.disableApprovedFields}/>
                                        <div className= 'form-control-static'>
                                            <div>
                                                <br></br>
                                                <ShowIf show={!other.disableApprovedFields}>
                                                    <Button className="btn btn-primary btn-sm" onClick={() => this.deleteOtherCourse(index, "ninthsOther")}>Delete</Button>
                                                </ShowIf>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            :
                            null
                        ))}
                        <tr>
                            <td className={' label-column col-md-4 '} />
                            <td className={' col-md-4 '} colSpan="2">
                                <div className="col-sm-12">
                                    <Button className="btn btn-primary btn-sm" onClick={() => this.addNewOtherSource("ninthsOther")}>Add Another Source</Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                            Total
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.approvedNinthsNumberTotalDisplayValue}
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.approvedNinthsAmountTotalDisplayValue}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className=' table table-bordered table-responsive'>
                    <tbody>
                        <tr>
                            <th className={" col-md-4 "}>
                                Course Releases
                            </th>
                            <th className={" col-md-4 "}>
                                # of Courses
                            </th>
                            <th className={" col-md-4 "}>
                                Estimated cost to the school <ToolTip text={descriptions.estimatedCostSchool} />
                            </th>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                            Course Releases
                            </td>
                            <td className={" col-md-4 "}>
                                <FormNumber name="approvedCourseReleases"
                                    value={editData.approvedCourseReleases}
                                    onChange={(e) => this.onChangeNumber(e, "approvedCourseReleases")}
                                    descriptionText={descriptions.fullTimeEquivalentForAllocations}
                                    hasError={editData.approvedCourseReleasesEstCostError ? true : false}
                                    error={editData.approvedCourseReleasesEstCostError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="approvedCourseReleasesEstCost"
                                    value={editData.approvedCourseReleasesEstCost}
                                    onChange={(e) => this.onChangeNumber(e, "approvedCourseReleasesEstCost")}
                                    hasError={editData.approvedCourseReleasesEstCostError ? true : false}
                                    error={editData.approvedCourseReleasesEstCostError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}
                                    />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className=' table table-bordered table-responsive'>
                    <tbody>
                        <tr>
                            <th className={" col-md-12 "} colSpan="2">
                                Totals
                            </th>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Total Admin. Comp. <ToolTip text={descriptions.totalAdminComp} />
                            </td>
                            <td className={' col-md-8 '}>
                                {editData.approvedTotalAdminCompDisplayValue}
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Base Salary <ToolTip text={descriptions.baseSalaryEdit} />
                            </td>
                            <td className={' col-md-8 '}>
                                {this.props.Logic.convertMoneyValueToDisplay(editData.approvedBaseSalary)}
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                            Total Comp. <ToolTip text={descriptions.totalApprovedComp} />
                            </td>
                            <td className={" col-md-8 "+editData.approvedIclBackgroundClass}>
                                {editData.approvedTotalCompDisplayValue}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-md-4"/>
                    <div className={"col-md-8 "+editData.approvedIclTextClass}>
                        {editData.approvedIclMessage}
                    </div>
                </div>
                <br></br>
                Comments (Maximum 250 characters.)
                <FormTextArea onChange={(e) => this.onChange(e, "comments")}
                    onBlur={this.onBlur}
                    value={editData.comments ? editData.comments : ""}/>
                <ShowIf show={editData.hasErrors}>
                    <p className="error_message">{editData.modalErrorMessage}</p>
                </ShowIf>
            </Body>
            <Footer>
                  <Button className="left btn btn-primary" onClick={this.saveEditData}
                      disabled={isSaveButtonDisabled}>
                      Save
                  </Button>
                  <Button className="left btn btn-primary" onClick={this.completeEditData}
                      disabled={isCompleteButtonDisabled}>
                      Complete
                  </Button>
                <Dismiss onClick={this.revertEditData} className="left btn btn-link">
                    Cancel
                </Dismiss>
            </Footer>
        </Modal>
    );
    }
}
