import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import moment from "moment";

//My imports
// import {ShowIf} from '../common/components/elements/DisplayIf.jsx';
import {AdminCompHeader, OtherHeader} from "./AdminCompHeader.jsx";
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
export default class AdminCompProposedModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        hideProposedEditModal: PropTypes.func,
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
        canEditAdminCompProposals: false,
        isSaveButtonDisabled: false,
        isSubmitButtonDisabled: false
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
            let clonedAdminCompSummaryData = util.cloneObject(props.clonedAdminCompSummaryData);
            // console.log(clonedAdminCompSummaryData);
            this.validateOtherSources(clonedAdminCompSummaryData);

            let canEditAdminCompProposals = this.props.Logic.canEditAdminCompProposals();
            let isSaveButtonDisabled = false;
            let isSubmitButtonDisabled = false;
            if(canEditAdminCompProposals){
                isSaveButtonDisabled = this.props.Logic.shouldSaveButtonBeDisabledForProposedModal(clonedAdminCompSummaryData);
                isSubmitButtonDisabled = this.props.Logic.shouldSubmitBeDisabledForProposedModal(clonedAdminCompSummaryData);
            }
            this.setState({clonedAdminCompSummaryData, editData: clonedAdminCompSummaryData.acPropComp,
              canEditAdminCompProposals, isSaveButtonDisabled, isSubmitButtonDisabled});
        }

        this.setState({academicYearList, multipleAdminApptsList,
             titleCodes, compTypeList, proAppList, sourceTypeList, typeOfApptList});
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


    resetButtons = () => {
        this.setState({isSaveButtonDisabled: false, isSubmitButtonDisabled: false});
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
                let savePromise = await this.props.Logic.saveProposedEditData(editData, this.props.adminCompSummaryDataFromAPI, false);
                this.props.handlePromise(savePromise, "save");
            } catch(e) {
                console.error(e);
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            editData.modalErrorMessage = modalErrorMessage;
        }
        this.setState({editData});
        this.resetButtons();
    }

    /******************************************************************************
     *
     * @desc - Submit function
     *
     ******************************************************************************/
    submitEditData = async () => {
        this.setState({isSubmitButtonDisabled: true});
        let editData = this.validateData();
        if(!editData.hasErrors){
            try {
                let savePromise = await this.props.Logic.saveProposedEditData(editData, this.props.adminCompSummaryDataFromAPI, true);
                this.props.handlePromise(savePromise, "submit");
            } catch(e) {
                console.error(e);
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            editData.modalErrorMessage = modalErrorMessage;
        }
        this.setState({editData});
        this.resetButtons();
    }

    validateData = () => {
        let {editData} = this.state;
        editData.hasErrors = false;
        let fields = this.props.Logic.getProposedValidationFields();
        let errorMessage = this.props.Logic.getErrorMessage();

        for(let each of fields){
            if(editData[each] || editData[each]===0){
                editData[each+"Error"] = null;
            }else{
                editData[each+"Error"] = errorMessage;
                editData.hasErrors = true;
            }
        }
        // Custom validation for 9ths rate based on values in evcp, dean and dept fields
        this.validateNinthsRate(editData, errorMessage);
        // validate stipend other and ninths other
        this.validateOtherFields(editData, "stipendOther", "proposedValue");
        this.validateOtherFields(editData, "ninthsOther", "proposedNinthsAmountValue");

        return editData;
    }

    validateNinthsRate = (editData, errorMessage) => {
        // OPUSDEV-3726 Admin 9ths Rate cannot be blank, but can be 0
        if(editData.proposedNinthsRate!==null && editData.proposedNinthsRate>=0){
            editData.proposedNinthsRateError = null;
        }else{
            editData.proposedNinthsRateError = errorMessage;
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
            if(each.recStatus==="D" || (each.name && each.name!=="" && each[field]>=0)){
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

    refresh = () => {
        setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
    }

    revertEditData = () => {
        this.props.hideProposedEditModal();
    }

    onChange = (e, field) => {
        let {editData} = this.state;
        let value = e.target.value;
        editData[field] = value;
        if (field === "academicYear") {
            this.getStipendHeaders(editData.academicHierarchyPathId, editData.academicYear);
            this.getNinthsHeaders(editData.academicHierarchyPathId, editData.academicYear);
        }
        this.setState({editData});
    }

    onChangeDate = (e, field) => {
        let {editData} = this.state;
        let proposedEffDt = moment(e.target.value).isValid() ? moment(e.target.value).format(this.props.dateFormat) : null;
        let date = moment(e.target.value).isValid() ? moment(e.target.value).format() : null;
        editData.proposedEffectiveDTDisplayValue = proposedEffDt;
        editData[field] = date;
        if(field === "proposedEffectiveDT"){
            this.getICLThreshold(editData);

        }
        this.setState({editData});
    }

    onChangeNumber = (e, field) => {
        let {editData} = this.state;
        let value = parseFloat(e.target.value);
        if(field==="proposedStipendEVCP" || field==="proposedStipendDean" || field==="proposedStipendDept"){
            editData[field] =  value;
            this.stipendTotalCalculations(editData);
        }else if(field==="proposedNinthsRate"){
            this.ninthsRateCalculations(editData, value);
            this.findNinthsTotals(editData);
        }else if(field==="proposedFteEVCP" || field==="proposedFteOther"){
            // OPUSDEV-3709 FTE input fields correctly rounds to 2 decimal places
            let formattedValue = value.toFixed(2);
            value = parseFloat(formattedValue);
            editData[field] = value;
        }else if(field==="proposedNinthsEVCPAmount" || field==="proposedNinthsDeanAmount" || field==="proposedNinthsDeptAmount"){
            value = this.props.Logic.validateDecimalInputsForAmount(e);
            editData[field] = parseFloat(value);
            this.ninthsCalculations(editData, field, value);
            this.findNinthsTotals(editData);
        }else if(field==="proposedBaseSalary"){
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

                this.props.Logic.findOtherTotal(editData, typeOfOther, "proposedStipendOtherTotal", "proposedValue");
                this.stipendTotalCalculations(editData);
            }else if(typeOfOther==="ninthsOther"){
                let value = this.props.Logic.validateDecimalInputsForAmount(e);
                let parsedValue = parseFloat(value);
                editData[typeOfOther][index][field] = parsedValue;
                editData[typeOfOther][index][field+"DisplayValue"] = value;
                this.ninthsOtherCalculations(editData, typeOfOther, parsedValue, index);
                editData = this.props.Logic.findOtherTotal(editData, typeOfOther, "proposedNinthsOtherNumberTotal", "proposedNinthsValue");
                editData = this.props.Logic.findOtherTotal(editData, typeOfOther, "proposedNinthsOtherAmountTotal", "proposedNinthsAmountValue");
                this.findNinthsTotals(editData);
            }
        }
        this.props.Logic.setRecStatus(editData, typeOfOther, index);
        this.findTotals(editData);
        this.setState({editData});
    }

    stipendTotalCalculations = (editData) => {
        editData.proposedStipendTotal = parseFloat((editData.proposedStipendEVCP + editData.proposedStipendDean + editData.proposedStipendDept
        + editData.proposedStipendOtherTotal).toFixed(2));
        editData.proposedStipendTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.proposedStipendTotal);
        return editData;
    }

    ninthsOtherCalculations = (editData, typeOfOther, parsedValue, index) => {
        let numberOfNinths = (parsedValue/editData.proposedNinthsRate);
        this.checkNinthsValue(numberOfNinths, typeOfOther+" "+index);
        editData[typeOfOther][index].proposedNinthsValue = parseFloat(numberOfNinths.toFixed(10));
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
        if(editData.proposedNinthsEVCPAmount!==null && editData.proposedNinthsEVCPAmount>=0){
            numberOfNinthsValue = (editData.proposedNinthsEVCPAmount/verifiedValue);
            this.checkNinthsValue(numberOfNinthsValue, "proposedNinthsEVCPAmount");
            editData.proposedNinthsEVCP = parseFloat(numberOfNinthsValue.toFixed(10));
        }
        if(editData.proposedNinthsDeanAmount!==null && editData.proposedNinthsDeanAmount>=0){
            numberOfNinthsValue = (editData.proposedNinthsDeanAmount/verifiedValue);
            this.checkNinthsValue(numberOfNinthsValue, "proposedNinthsDeanAmount");
            editData.proposedNinthsDean = parseFloat(numberOfNinthsValue.toFixed(10));
        }
        if(editData.proposedNinthsDeptAmount!==null && editData.proposedNinthsDeptAmount>=0){
            numberOfNinthsValue = (editData.proposedNinthsDeptAmount/verifiedValue);
            this.checkNinthsValue(numberOfNinthsValue, "proposedNinthsDeptAmount");
            editData.proposedNinthsDept = parseFloat(numberOfNinthsValue.toFixed(10));
        }
        // if(editData.proposedNinthsNumberTotal!==null && editData.proposedNinthsNumberTotal>=0){
        //     numberOfNinthsValue = (editData.proposedNinthsNumberTotal*verifiedValue);
        //     this.checkNinthsValue(numberOfNinthsValue, "proposedNinthsNumberTotal");
        //     editData.proposedNinthsAmountTotal = numberOfNinthsValue;
        //     editData.proposedNinthsAmountTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
        // }
        // Find ninths other sources amounts
        if(editData.ninthsOther && editData.ninthsOther.length>0){
            let ninthsTotal = 0;
            for(let each in editData.ninthsOther){
                if(editData.ninthsOther[each].proposedNinthsAmountValue!==null && editData.ninthsOther[each].proposedNinthsAmountValue>=0){
                    numberOfNinthsValue = (editData.ninthsOther[each].proposedNinthsAmountValue/verifiedValue);
                    this.checkNinthsValue(numberOfNinthsValue, "proposedNinthsValue - "+each.toString());
                    editData.ninthsOther[each].proposedNinthsValue = parseFloat(numberOfNinthsValue.toFixed(10));
                    ninthsTotal = ninthsTotal + parseFloat(numberOfNinthsValue.toFixed(10));
                }
            }
            editData.proposedNinthsOtherNumberTotal = parseFloat(ninthsTotal.toFixed(10));
        }
        editData.proposedNinthsRate = verifiedValue;
        return editData;
    }

    ninthsCalculations = (editData, field, value) => {
        let numberOfNinths = (value/editData.proposedNinthsRate);
        numberOfNinths = parseFloat(numberOfNinths.toFixed(10));
        if(field==="proposedNinthsEVCPAmount"){
            editData.proposedNinthsEVCP = numberOfNinths;
        }
        if(field==="proposedNinthsDeanAmount"){
            editData.proposedNinthsDean = numberOfNinths;
        }
        if(field==="proposedNinthsDeptAmount"){
            editData.proposedNinthsDept = numberOfNinths;
        }
        return editData;
    }

    findNinthsTotals = (editData) => {
        editData.proposedNinthsNumberTotal = editData.proposedNinthsEVCP + editData.proposedNinthsDean + editData.proposedNinthsDept + editData.proposedNinthsOtherNumberTotal;
        editData.proposedNinthsNumberTotalDisplayValue = parseFloat(editData.proposedNinthsNumberTotal.toFixed(10));
        editData.proposedNinthsAmountTotal = editData.proposedNinthsEVCPAmount + editData.proposedNinthsDeanAmount + editData.proposedNinthsDeptAmount + editData.proposedNinthsOtherAmountTotal;
        editData.proposedNinthsAmountTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.proposedNinthsAmountTotal);
        return editData;
    }

    findTotals = (editData) => {
        editData.proposedTotalAdminComp = parseFloat((editData.proposedNinthsAmountTotal + editData.proposedStipendTotal).toFixed(2));
        editData.proposedTotalAdminCompDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.proposedTotalAdminComp);
        editData.proposedTotalComp = parseFloat((editData.proposedTotalAdminComp + editData.proposedBaseSalary).toFixed(2));
        editData.proposedTotalCompDisplayValue = this.props.Logic.convertMoneyValueToDisplay(editData.proposedTotalComp);
        editData = this.props.setProposedICLMessage(editData, editData.proposedIclThreshold, editData.proposedTotalComp);
        return editData;
    }

    addNewOtherSource = (typeOfOther) => {
        let {editData} = this.state;
        let object = {
            approvedDisplayValue: null,
            approvedValue: null,
            name: "",
            recStatus: "N",
            proposedApproved: "Proposed",
            proposedDisplayValue: "$0",
            proposedValue: 0,
        };
        if(typeOfOther==="ninthsOther"){
            object ={
                approvedNinthsAmountDisplayValue: null,
                approvedNinthsAmountValue: null,
                approvedNinthsValue: null,
                approvedNinthsValueDisplayValue: null,
                name: "",
                recStatus: "N",
                proposedApproved: "Proposed",
                proposedNinthsAmountDisplayValue: "$0",
                proposedNinthsAmountValue: 0,
                proposedNinthsValue: 0,
                proposedNinthsValueDisplayValue: "$0"
            };
        }
        editData[typeOfOther].push(object);
        this.setState({editData});
        this.refresh();
    }

    deleteOtherCourse = (index, typeOfOther) => {
        let {editData} = this.state;
        // Only changed recStatus to "D" (Delete) if coming from backend ("U") or edited ("C")
        if(editData[typeOfOther][index].recStatus==="U" || editData[typeOfOther][index].recStatus==="C"){
            // Set correct values to check and set
            let valueToCheck = "approvedValue";
            let valuesToSet = ["proposedValue", "proposedDisplayValue"];
            if(typeOfOther==="ninthsOther"){
                valueToCheck = "approvedNinthsValue";
                valuesToSet = ["proposedNinthsValue", "proposedNinthsAmountValue", "proposedNinthsAmountDisplayValue"];
            }
            // When deleting other source, check for corresponding approved value , make sure it is not null.
            // If there is corresponding values, then recStatus is “C” and null values instead of changing the recStatus to “D”;
            if(editData[typeOfOther][index].disableApprovedFields){
                editData[typeOfOther][index].recStatus = "D";
            }else{
                for(let each of valuesToSet){
                    editData[typeOfOther][index][each] = null;
                }
                editData[typeOfOther][index].recStatus = "C";
                editData[typeOfOther][index].disableProposedFields = true;
            }
        }else{
            // Or else remove from array since it is new from ui side
            editData[typeOfOther].splice(index, 1);
        }
        // Subtract from totals
        if(typeOfOther==="stipendOther"){
            this.props.Logic.findOtherTotal(editData, typeOfOther, "proposedStipendOtherTotal", "proposedValue");
            this.stipendTotalCalculations(editData);
        }else if(typeOfOther==="ninthsOther"){
            this.props.Logic.findOtherTotal(editData, typeOfOther, "proposedNinthsOtherNumberTotal", "proposedNinthsValue");
            this.props.Logic.findOtherTotal(editData, typeOfOther, "proposedNinthsOtherAmountTotal", "proposedNinthsAmountValue");
            this.findNinthsTotals(editData);
        }
        this.setState({editData});
        this.refresh();
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
        this.getStipendHeaders(editData.academicHierarchyPathId, editData.academicYear);
        this.getNinthsHeaders(editData.academicHierarchyPathId, editData.academicYear);
    }

    /******************************************************************************
     *
     * @desc - Title Code Search functions
     *
     ******************************************************************************/
    searchTitleCode = async ({term: searchString} = {}, response) => {
        let titleCodes = [];
        for(let each of this.state.titleCodes){
            titleCodes.push(Object.values(each));
        }
        let mergedTitleCodes = [].concat.apply([], titleCodes);
        let searchedTitleCodes = [];
        for(let each of mergedTitleCodes){
            if(each.toLowerCase().includes(searchString.toLowerCase())){
                searchedTitleCodes.push(each);
            }
        }
        response(searchedTitleCodes);
    }

    onChangeSearchTitleCode = (e) => {
        let {editData} = this.state;
        let value = e.target.value;
        if(value.length<3){
            editData.titleCodeId = null;
        }
        this.setState({editData});
    }

    onClickSearchTitleCode = (e) => {
        let {editData, titleCodes} = this.state;
        let value = e.target.value;
        for(let each of titleCodes){
            let values = Object.values(each);
            if(values[0]===value){
                let keys = Object.keys(each);
                editData.titleCodeId = keys[0];
            }
        }
        this.setState({editData});
    }
    /******************************************************************************
     *
     * @desc - Stipend and Ninths Headers
     *
     ******************************************************************************/

    getStipendHeaders = async (ahPathId, academicYear) => {
        try {
            let {editData} = this.state;
            let stipendHeaders = await this.props.Logic.getStipendHeaders(ahPathId, academicYear);
            console.log(stipendHeaders);
            editData.stipendHeaders = stipendHeaders;
            this.setState({editData});
        } catch(e) {
            console.log("Stipend Header API ERROR:");
            console.error(e);
        }
    }

    getNinthsHeaders = async (ahPathId, academicYear) => {
        try {
            let {editData} = this.state;
            let ninthsHeaders = await this.props.Logic.getNinthsHeaders(ahPathId, academicYear);
            console.log(ninthsHeaders);
            editData.ninthsHeaders = ninthsHeaders;
            this.setState({editData});
        } catch(e) {
            console.log("Ninths Header API ERROR:");
            console.error(e);
        }
    }

    getICLThreshold = async (editData) => {
        try {
            let iclThreshold = await this.props.Logic.getProposedICLThreshold(editData);
            console.log(iclThreshold);
            editData.proposedIclThreshold = iclThreshold;
            editData = this.props.setProposedICLMessage(editData, editData.proposedIclThreshold, editData.proposedTotalComp);
            this.setState({editData});
        } catch(e) {
            console.log("ICL API ERROR:");
            console.error(e);
        }
    }

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {
        let {editData, clonedAdminCompSummaryData, academicYearList, multipleAdminApptsList,
        compTypeList, proAppList, sourceTypeList, typeOfApptList, titleCodes, isSaveButtonDisabled,
        isSubmitButtonDisabled} = this.state;
        return(
        <Modal className=" modal-lg " backdrop="static" show={this.props.showEditModal}
            onHide={this.revertEditData}>
            <Header className=" modal-info modal-header " closeButton>
                <Title> <h1 className=" modal-title black ">Administrative Compensation</h1> </Title>
            </Header>
            <Body>
                <h2 className="flush-top">Edit Proposal</h2>

                <AdminCompHeader adminCompSummaryData={editData}
                    adminCompSummaryDataFromAPI={clonedAdminCompSummaryData}/>

                <table className=' table table-bordered table-responsive'>
                    <tbody>
                        <tr>
                            <th className={" col-md-12 "} colSpan="2">
                                Admin. Comp. Summary
                            </th>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Academic Year
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={academicYearList}
                                    onChange={(e) => this.onChange(e, "academicYear")}
                                    value={editData.academicYear}
                                    hasError={editData.academicYearError ? true : false}
                                    error={editData.academicYearError}
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
                                    value={editData.typeOfApptId}
                                    hasError={editData.typeOfApptIdError ? true : false}
                                    error={editData.typeOfApptIdError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Effective Date
                            </td>
                            <td className={' col-md-8 '}>
                                <FormDate onChange={(e) => this.onChangeDate(e, "proposedEffectiveDT")}
                                    value={editData.proposedEffectiveDT ? moment(editData.proposedEffectiveDT).format("L") : null}
                                    hasError={editData.proposedEffectiveDTError ? true : false}
                                    error={editData.proposedEffectiveDTError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                End Date <ToolTip text={descriptions.endDate} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormDate onChange={(e) => this.onChangeDate(e, "proposedEndDT")}
                                    value={moment(editData.proposedEndDT).format("L")}
                                    hasError={editData.proposedEndDTError ? true : false}
                                    error={editData.proposedEndDTError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Unit Search <ToolTip text={descriptions.unitSearch} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormAutoComplete id="unitSearch"
                                    placeholder={'Search for unit name (minimum 3 characters)'} ref="autocomplete"
                                    options={this.searchUnit} autoCompleteUIOptions={{}}
                                    onSearchClick={this.onClickSearchUnit}
                                    onChange={this.onChangeSearchUnit}
                                    input_css={' form-control  search-field '}
                                    hasError={editData.unitError ? true : false}
                                    error={editData.unitError ? "Please search and select a unit in the search bar above." : null}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Unit Selected
                            </td>
                            <td className={' col-md-8 '}>
                              <FormTextAreaMaxChar name="unit" rows = "2"
                                  value={editData.unit}
                                  hasError={editData.unitError ? true : false}
                                  error={editData.unitError ? "Please search and select a unit above." : null}
                                  disabled={true}
                                  right_field_css={' col-sm-12 '}
                                  base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Organization Name (max 250 characters)<ToolTip text={descriptions.organizationNameForProposalsModal} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormTextAreaMaxChar name="organizationName"
                                    value={editData.organizationName}
                                    onChange={(e) => this.onChange(e, "organizationName")}
                                    onBlur={this.onBlur}
                                    hasError={editData.organizationNameError ? true : false}
                                    error={editData.organizationNameError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Title Code: Title <ToolTip text={descriptions.titleCodeForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormAutoComplete  id="titleCodeSearch"
                                    placeholder={'Search for title code'} ref="autocomplete"
                                    options={this.searchTitleCode} autoCompleteUIOptions={{}}
                                    onSearchClick={this.onClickSearchTitleCode}
                                    onChange={this.onChangeSearchTitleCode}
                                    input_css={' form-control  search-field '}
                                    hasError={editData.titleCodeIdError ? true : false}
                                    error={editData.titleCodeIdError ? "Please search and select a title code in the search bar above." : null}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Title Code Selected
                            </td>
                            <td className={' col-md-8 '}>
                                <FormSelect includeBlankOption={true} valueIsText
                                    options={titleCodes}
                                    onChange={(e) => this.onChange(e, "titleCodeId")}
                                    value={editData.titleCodeId}
                                    disabled={true}
                                    hasError={editData.titleCodeIdError ? true : false}
                                    error={editData.titleCodeIdError ? "Please search and select a title code above." : null}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Working Title / Role <ToolTip text={descriptions.workingTitleForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormTextAreaMaxChar name="workingTitle" value={editData.workingTitle}
                                    onChange={(e) => this.onChange(e, "workingTitle")}
                                    onBlur={this.onBlur}
                                    hasError={editData.workingTitleError ? true : false}
                                    error={editData.workingTitleError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Justification (optional) (max 250 characters) <ToolTip text={descriptions.justificationForProposals} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormTextAreaMaxChar name="justification" value={editData.justification}
                                    onChange={(e) => this.onChange(e, "justification")}
                                    onBlur={this.onBlur}
                                    hasError={editData.justificationErrorMessage ? true : false}
                                    error={editData.justificationErrorMessage}
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
                                    value={editData.multipleAdminApptsId}
                                    hasError={editData.multipleAdminApptsIdError ? true : false}
                                    error={editData.multipleAdminApptsIdError}
                                    base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                FTE - EVCP <ToolTip text={descriptions.FTEEVCP} />
                            </td>
                            <td className={' col-md-8 '}>
                                <FormNumber name="fullTimeEquivalent"
                                    value={editData.proposedFteEVCP}
                                    onChange={(e) => this.onChangeNumber(e, "proposedFteEVCP")}
                                    descriptionText={descriptions.proposedFteEVCP}
                                    hasError={editData.proposedFteEVCPError ? true : false}
                                    error={editData.proposedFteEVCPError}
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
                                    value={editData.proposedFteOther}
                                    onChange={(e) => this.onChangeNumber(e, "proposedFteOther")}
                                    descriptionText={descriptions.proposedFteOther}
                                    hasError={editData.proposedFteOtherError ? true : false}
                                    error={editData.proposedFteOtherError}
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
                                    value={editData.proposedBaseSalary}
                                    onChange={(e) => this.onChangeNumber(e, "proposedBaseSalary")}
                                    descriptionText={descriptions.proposedBaseSalary}
                                    hasError={editData.proposedBaseSalaryError ? true : false}
                                    error={editData.proposedBaseSalaryError}
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
                                    onChange={(e) => this.onChange(e, "proposedNSTP")}
                                    value={editData.proposedNSTP}
                                    hasError={editData.proposedNSTPError ? true : false}
                                    error={editData.proposedNSTPError}
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
                                <FormCurrency name="proposedStipendEVCP"
                                    value={editData.proposedStipendEVCP}
                                    onChange={(e) => this.onChangeNumber(e, "proposedStipendEVCP")}
                                    hasError={editData.proposedStipendEVCPError ? true : false}
                                    error={editData.proposedStipendEVCPError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Dean
                            </td>
                            <td className={' col-md-8 '}>
                                <FormCurrency name="proposedStipendDean"
                                    value={editData.proposedStipendDean}
                                    onChange={(e) => this.onChangeNumber(e, "proposedStipendDean")}
                                    hasError={editData.proposedStipendDeanError ? true : false}
                                    error={editData.proposedStipendDeanError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Dept.
                            </td>
                            <td className={' col-md-8 '}>
                                <FormCurrency name="proposedStipendDept"
                                    value={editData.proposedStipendDept}
                                    onChange={(e) => this.onChangeNumber(e, "proposedStipendDept")}
                                    hasError={editData.proposedStipendDeptError ? true : false}
                                    error={editData.proposedStipendDeptError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        {editData.stipendOther.map((other, index) => (
                            other.recStatus!=="D" ?
                            <tr key={index}>
                                <td className=' label-column col-md-6 '>
                                    <div>Other Source Name
                                        <ToolTip text={other.disableProposedFields ? descriptions.proposedSourceDisabledWithApprovedSource : descriptions.otherSourceStipendName} />
                                    </div>
                                    <FormInput name="proposedStipendOther"
                                        displayName={'Other Source Name'}  value={other.name}
                                        onChange={(e) => this.onChangeOther(e, "name", "stipendOther", index)}
                                        hasError={other.error ? true : false}
                                        error={other.error}
                                        showLabel={false}
                                        disabled={other.disableProposedFields}/>
                                </td>
                                <td className=' col-md-6 '>
                                    <div>&nbsp;</div>
                                    <div className= 'col-md-8'><FormCurrency name="proposedStipendOther"
                                        value = {other.proposedValue}
                                        onChange={(e) => this.onChangeOther(e, "proposedValue", "stipendOther", index)}
                                        hasError={other.error ? true : false}
                                        right_field_css={' '}
                                        base_css={''} left_field_css={''} showLabel={false}
                                        disabled={other.disableProposedFields}/>
                                    </div>
                                    <div className= 'col-md-4 form-control-static'>
                                        <ShowIf show={!other.disableProposedFields}>
                                            <Button className="btn btn-primary btn-sm" onClick={() => this.deleteOtherCourse(index, "stipendOther")}>
                                                Delete
                                            </Button>
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
                                {editData.proposedStipendTotalDisplayValue}
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
                                <FormCurrency name="proposedNinthsRate"
                                    value={editData.proposedNinthsRate}
                                    onChange={(e) => this.onChangeNumber(e, "proposedNinthsRate")}
                                    hasError={editData.proposedNinthsRateError ? true : false}
                                    error={editData.proposedNinthsRateError}
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
                                {editData.proposedNinthsEVCP}
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="proposedNinthsEVCPAmount"
                                    value={editData.proposedNinthsEVCPAmount}
                                    onChange={(e) => this.onChangeNumber(e, "proposedNinthsEVCPAmount")}
                                    hasError={editData.proposedNinthsEVCPAmountError ? true : false}
                                    error={editData.proposedNinthsEVCPAmountError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                                Dean
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.proposedNinthsDean}
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="proposedNinthsDeanAmount"
                                    value={editData.proposedNinthsDeanAmount}
                                    onChange={(e) => this.onChangeNumber(e, "proposedNinthsDeanAmount")}
                                    hasError={editData.proposedNinthsDeanAmountError ? true : false}
                                    error={editData.proposedNinthsDeanAmountError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={" label-column col-md-4 "}>
                                Dept.
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.proposedNinthsDept}
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="proposedNinthsDeptAmount"
                                    value={editData.proposedNinthsDeptAmount}
                                    onChange={(e) => this.onChangeNumber(e, "proposedNinthsDeptAmount")}
                                    hasError={editData.proposedNinthsDeptAmountError ? true : false}
                                    error={editData.proposedNinthsDeptAmountError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                        </tr>
                        {editData.ninthsOther.map((other, index) => (
                            other.recStatus!=="D" ?
                            <tr key={index}>
                                <td className=' label-column col-md-4 '>
                                    <div>Other Source Name <ToolTip text={other.disableProposedFields ? descriptions.proposedSourceDisabledWithApprovedSource : descriptions.otherSourceNinthsName} /></div>
                                    <FormInput name="proposedNinthsOther"
                                        displayName={'Other Source Name'}  value={other.name}
                                        onChange={(e) => this.onChangeOther(e, "name", "ninthsOther", index)}
                                        hasError={other.error ? true : false}
                                        error={other.error}
                                        showLabel={false}
                                        disabled={other.disableProposedFields}
                                        right_field_css={' col-sm-12 '}/>
                                </td>
                                <td className=' col-md-4 '>
                                    <div>&nbsp;</div>
                                    {other.proposedNinthsValue}

                                </td>
                                <td className=' col-md-4 '>
                                    <FormCurrency name="proposedNinthsOther"
                                        value = {other.proposedNinthsAmountValue}
                                        onChange={(e) => this.onChangeOther(e, "proposedNinthsAmountValue", "ninthsOther", index)}
                                        hasError={other.error ? true : false}
                                        right_field_css={' col-sm-8 '}
                                        base_css={''} left_field_css={''} showLabel={false}
                                        disabled={other.disableProposedFields}/>
                                    <div className='form-control-static'>
                                        <ShowIf show={!other.disableProposedFields}>
                                        <div>
                                            <br></br>
                                            <Button className="btn btn-primary btn-sm" onClick={() => this.deleteOtherCourse(index, "ninthsOther")}>
                                                Delete
                                            </Button>
                                        </div>
                                        </ShowIf>
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
                                {editData.proposedNinthsNumberTotalDisplayValue}
                            </td>
                            <td className={" col-md-4 "}>
                                {editData.proposedNinthsAmountTotalDisplayValue}
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
                                <FormNumber name="proposedCourseReleases"
                                    value={editData.proposedCourseReleases}
                                    onChange={(e) => this.onChangeNumber(e, "proposedCourseReleases")}
                                    descriptionText={descriptions.fullTimeEquivalentForAllocations}
                                    hasError={editData.proposedCourseReleasesError ? true : false}
                                    error={editData.proposedCourseReleasesError}
                                    right_field_css={' col-sm-8 '}
                                    base_css={''} left_field_css={''} showLabel={false}/>
                            </td>
                            <td className={" col-md-4 "}>
                                <FormCurrency name="proposedCourseReleasesEstCost"
                                    value={editData.proposedCourseReleasesEstCost}
                                    onChange={(e) => this.onChangeNumber(e, "proposedCourseReleasesEstCost")}
                                    hasError={editData.proposedCourseReleasesEstCostError ? true : false}
                                    error={editData.proposedCourseReleasesEstCostError}
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
                                {editData.proposedTotalAdminCompDisplayValue}
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Base Salary <ToolTip text={descriptions.baseSalaryEdit} />
                            </td>
                            <td className={' col-md-8 '}>
                                {this.props.Logic.convertMoneyValueToDisplay(editData.proposedBaseSalary)}
                            </td>
                        </tr>
                        <tr>
                            <td className={' label-column col-md-4 '}>
                                Total Comp. <ToolTip text={descriptions.totalProposedComp} />
                            </td>
                            <td className={" col-md-8 "+editData.proposedIclBackgroundClass}>
                                {editData.proposedTotalCompDisplayValue}
                            </td>
                        </tr>
                    </tbody>

                </table>
                <div className="row">
                    <div className="col-md-4"/>
                    <div className={"col-md-8 "+editData.proposedIclTextClass}>
                        {editData.proposedIclMessage}
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
                <Button className="left btn btn-primary" onClick={this.submitEditData}
                    disabled={isSubmitButtonDisabled}>
                    Submit
                </Button>
                <Dismiss onClick={this.revertEditData} className="left btn btn-link">
                    Cancel
                </Dismiss>
            </Footer>
        </Modal>
    );
    }
}
