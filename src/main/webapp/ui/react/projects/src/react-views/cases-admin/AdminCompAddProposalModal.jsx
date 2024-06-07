import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import moment from "moment";

//My imports
// import {ShowIf} from '../common/components/elements/DisplayIf.jsx';
// import {AdminCompHeader, OtherHeader} from './AdminCompHeader.jsx';
import * as util from "../../opus-logic/common/helpers";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../common/components/bootstrap/ReactBootstrapModal.jsx";
import {ShowIf} from "../common/components/elements/DisplayIf.jsx";
import {FormShell, FormGroup} from "../common/components/forms/FormRender.jsx";
import {FormInput, FormNumber, FormCurrency, FormTextArea, FormTextAreaMaxChar, FormAutoComplete, FormSelect, FormDate, FormDualInput} from
    "../common/components/forms/FormElements.jsx";
import { descriptions } from "../../opus-logic/common/constants/Descriptions.js";
import {ToolTip} from "../common/components/elements/ToolTip.jsx";
import {EditIcon, DeleteIcon, CommentIcon} from "../common/components/elements/Icon.jsx";
import { add } from "lodash";
import ToggleView from "../common/components/elements/ToggleView.jsx";
import {OtherHeader} from "../cases/admin-comp-summary/AdminCompHeader.jsx";

/******************************************************************************
 *
 * @desc - Selection for Admin Comp Add Proposal Modal
 *
 ******************************************************************************/
export default class AdminCompAddProposalModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        hideProposedEditModal: PropTypes.func
    }

    static defaultProps = {
        showEditModal: false
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
        addData: {stipendOther: [], ninthsOther: [], stipendHeaders: [], ninthsHeaders: []},
        originalACPropComp: {},
        typeOfApptList: {},
        multipleAdminApptsList: {},
        titleCodes: [],
        selectedPerson:{
            show: false
        },
        isSaveButtonDisabled: true,
        hasLoaded: false,
        showSuccessModal: false,
        proposalPersonName: null
    };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
    componentWillReceiveProps(props) {
        if(props.showAddProposalModal && !this.state.hasLoaded){
            this.getACLists();
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

    async getACLists(){
        let {addData, originalACPropComp} = {};
        let {academicYearList, multipleAdminApptsList, compTypeList, proAppList, sourceTypeList, typeOfApptList} = [];
        let titleCodes = this.props.Logic.formattedCommonCallLists.titleCodeOptions;
        try {
            let acProposalObject = await this.props.Logic.getNewACProposal();
            addData = util.cloneObject(acProposalObject.acPropComp);
            addData.stipendOther = [];
            addData.ninthsOther = [];
            addData.stipendHeaders = [];
            addData.ninthsHeaders = [];
            addData.headerFacultyAppointment = [];
            addData.headerActionInProgress = [];


        // Initial stipend/ninths fields to 0
            addData.proposedStipendEVCP = 0;
            addData.proposedStipendDean = 0;
            addData.proposedStipendDept = 0;
            addData.proposedNinthsEVCP = 0;
            addData.proposedNinthsDean = 0;
            addData.proposedNinthsDept = 0;
            addData.proposedNinthsEVCPAmount = 0;
            addData.proposedNinthsDeanAmount = 0;
            addData.proposedNinthsDeptAmount = 0;
        // Set totals to 0
            addData.proposedStipendTotal = 0;
            addData.proposedStipendOtherTotal = 0;
            addData.proposedNinthsAmountTotal = 0;
            addData.proposedNinthsNumberTotal = 0;
            addData.proposedNinthsOtherNumberTotal = 0;
            addData.proposedNinthsOtherAmountTotal= 0;
            addData.proposedTotalAdminComp = 0;
            addData.proposedTotalComp = 0;
            addData.proposedNSTP = "No";
            addData.proposedFteEVCP = 0;
            addData.proposedFteOther = 0;
            addData.proposedCourseReleases = 0;
            addData.proposedCourseReleasesEstCost = 0;


            originalACPropComp = util.cloneObject(acProposalObject.acPropComp);
            academicYearList = acProposalObject.academicYearList;
            multipleAdminApptsList = acProposalObject.multipleAdminApptsList;
            compTypeList = acProposalObject.compTypeList;
            proAppList = acProposalObject.proAppList;
            sourceTypeList = acProposalObject.sourceTypeList;
            typeOfApptList = acProposalObject.typeOfApptList;
        // console.log(acProposalObject)
        // Sets ICL Message
            let iclthreshold = acProposalObject.iclthreshold ? acProposalObject.iclthreshold : [];
            this.props.setICLMessage(addData, iclthreshold, addData.proposedTotalComp);

            this.setState({hasLoaded: true});
        } catch(e) {
            console.error(e);
        }

        this.setState({addData, originalACPropComp, academicYearList, multipleAdminApptsList,
        titleCodes, compTypeList, proAppList, sourceTypeList, typeOfApptList});
    }


    /******************************************************************************
     *
     * @desc - Save function
     *
     ******************************************************************************/
    saveNewData = async () => {
        this.setState({isSaveButtonDisabled: true});
        let addData = this.validateData();
        if(!addData.hasErrors){
            try {
                let adminCompId = await this.props.Logic.saveAddData(addData, this.state.originalACPropComp);
                this.revertAddData();
                if(adminCompId>0){
                    let summaryPageUrl = "/opusWeb/ui/admin/admin-comp-proposals-summary.shtml?adminCompId="+adminCompId;
                    this.setState({showSuccessModal: true, summaryPageUrl});
                }else{
                    console.log("Error from save api: ");
                    console.log(adminCompId);
                }

            } catch(e) {
                console.error(e);
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            addData.modalErrorMessage = modalErrorMessage;
            this.setState({addData});
        }
        this.setState({isSaveButtonDisabled: false});
    }

    validateData = () => {
        let {addData} = this.state;

        addData.hasErrors = false;
        let fields = this.props.Logic.getAddNewValidationFields();
        let errorMessage = this.props.Logic.getErrorMessage();

        for(let each of fields){
            if(addData[each] || addData[each]===0){
                addData[each+"Error"] = null;
            }else{
                addData[each+"Error"] = errorMessage;
                addData.hasErrors = true;
            }
        }

        // Custom validation for 9ths rate based on values in evcp, dean and dept fields
        this.validateNinthsRate(addData, errorMessage);

        // validate stipend other and ninths other
        this.validateOtherFields(addData, "stipendOther", "proposedValue");
        this.validateOtherFields(addData, "ninthsOther", "proposedNinthsAmountValue");

        return addData;
    }

    validateNinthsRate = (addData, errorMessage) => {
        // OPUSDEV-3726 Admin 9ths Rate cannot be blank, but can be 0
        if(addData.proposedNinthsRate!==null && addData.proposedNinthsRate>=0){
            addData.proposedNinthsRateError = null;
        }else{
            addData.proposedNinthsRateError = errorMessage;
            addData.hasErrors = true;
        }
        return addData;
    }

    validateOtherFields = (addData, typeOfOther, field) => {
        let errorMessage = "";
        if (typeOfOther === "stipendOther") {
            errorMessage = this.props.Logic.getStipendOtherFieldErrorMessage();
        }
        if (typeOfOther === "ninthsOther") {
            errorMessage = this.props.Logic.getNinthsOtherFieldErrorMessage();
        }
        for(let each of addData[typeOfOther]){
            // See if source name exists and values exist
            if(each.name && each.name!=="" && each[field]>=0){
                each.error = null;
            }else{
                each.error = errorMessage;
                addData.hasErrors = true;
            }
        }
        return addData;
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

    revertAddData = () => {
        this.props.hideAddProposalModal();

        this.getACLists();
        let resultsMessage = "";
        this.setState({resultsMessage, selectedPerson: {show: false}, isSaveButtonDisabled: true});

    }

    onChange = (e, field) => {
        let {addData} = this.state;
        addData[field] = e.target.value;
        if (field === "academicYear") {
            this.getStipendHeaders(addData.academicHierarchyPathId, addData.academicYear);
            this.getNinthsHeaders(addData.academicHierarchyPathId, addData.academicYear);
        }
        this.setState({addData});
    }

    onChangeDate = (e, field) => {
        let {addData} = this.state;
        let date = moment(e.target.value).isValid() ? moment(e.target.value).format() : null;
        addData[field] = date;
        if(field === "proposedEffectiveDT"){
            this.getICLThreshold(addData);
        }
        this.setState({addData});
    }

    validateDecimalInputs(e) {
        // var beforeDecimal = 2;
        var afterDecimal = 2;
        e.target.value = e.target.value
          .replace(/[^\d.]/g, "")
        //   .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), "$1")
          .replace(/(\..*)\./g, "$1")
          .replace(new RegExp("(\\.[\\d]{" + afterDecimal + "}).", "g"), "$1");
          return e.target.value;
    }

    onChangeNumber = (e, field) => {
        let {addData} = this.state;
        let value = parseFloat(e.target.value);
        if(field==="proposedStipendEVCP" || field==="proposedStipendDean" || field==="proposedStipendDept"){
            addData[field] =  value;
            this.stipendTotalCalculations(addData);
        }else if(field==="proposedNinthsRate"){
            this.ninthsRateCalculations(addData, value);
            this.findNinthsTotals(addData);
        }else if(field==="proposedFteEVCP" || field==="proposedFteOther"){
            // OPUSDEV-3709 FTE input fields correctly rounds to 2 decimal places
            let formattedValue = value.toFixed(2);
            value = parseFloat(formattedValue);
            addData[field] = value;
        }else if(field==="proposedNinthsEVCPAmount" || field==="proposedNinthsDeanAmount" || field==="proposedNinthsDeptAmount"){
            value = this.validateDecimalInputs(e);
            addData[field] = parseFloat(value);
            this.ninthsCalculations(addData, field, value);
            this.findNinthsTotals(addData);
        }else if(field==="proposedBaseSalary"){
            addData[field] = value;
            // calculate ninths rate
            let ninthsRate = parseFloat((value/9));
            addData.proposedNinthsRate = ninthsRate;
            this.ninthsRateCalculations(addData, ninthsRate);
            this.findNinthsTotals(addData);
        }else{
            addData[field] = value;
        }

        this.findTotals(addData);
        this.setState({addData});
    }

    onChangeOther = (e, field, typeOfOther, index) => {
        let {addData} = this.state;
        if(field==="name"){
            addData[typeOfOther][index][field] = e.target.value;
        }else{
            if(typeOfOther==="stipendOther"){
                let parsedValue = parseFloat(e.target.value);
                addData[typeOfOther][index][field] = parsedValue;
                addData[typeOfOther][index][field+"DisplayValue"] = e.target.value;
                this.findOtherTotal(addData, typeOfOther, "proposedStipendOtherTotal", "proposedValue");
                this.stipendTotalCalculations(addData);
            }else if(typeOfOther==="ninthsOther"){
                let value = this.validateDecimalInputs(e);
                let parsedValue = parseFloat(value);
                addData[typeOfOther][index][field] = parsedValue;
                addData[typeOfOther][index][field+"DisplayValue"] = value;
                this.ninthsOtherCalculations(addData, typeOfOther, parsedValue, index);
                this.findOtherTotal(addData, typeOfOther, "proposedNinthsOtherNumberTotal", "proposedNinthsValue");
                this.findOtherTotal(addData, typeOfOther, "proposedNinthsOtherAmountTotal", "proposedNinthsAmountValue");
                this.findNinthsTotals(addData);
            }
        }
        this.setRecStatus(addData, typeOfOther, index);
        this.findTotals(addData);
        this.setState({addData});
    }

    setRecStatus = (addData, typeOfOther, index) => {
        if(addData[typeOfOther][index].recStatus!=="N"){
            addData[typeOfOther][index].recStatus = "C";
        }
        return addData;
    }

    findOtherTotal = (addData, typeOfOther, fieldToSave, fieldToGet) => {
        let total = 0;
        let array = addData[typeOfOther];

        for(let each in array){
            if(array[each].recStatus!=="D"){
                total = total + array[each][fieldToGet];
            }
        }
        addData[fieldToSave] = total;
        return addData;
    }

    stipendTotalCalculations = (addData) => {
        addData.proposedStipendTotal = parseFloat((addData.proposedStipendEVCP + addData.proposedStipendDean + addData.proposedStipendDept
        + addData.proposedStipendOtherTotal).toFixed(2));
        addData.proposedStipendTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(addData.proposedStipendTotal);
        return addData;
    }

    ninthsOtherCalculations = (addData, typeOfOther, parsedValue, index) => {
        let numberOfNinths = (parsedValue/addData.proposedNinthsRate);
        addData[typeOfOther][index].proposedNinthsValue = parseFloat(numberOfNinths.toFixed(10));
        // addData[typeOfOther][index].proposedNinthsAmountDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinths);
        return addData;
    }

    ninthsRateCalculations = (addData, value) => {
        let numberOfNinthsValue = 0;
        let verifiedValue;
        if (parseFloat(value)>=0){
            verifiedValue = parseFloat(value.toFixed(2));
        }else{
            verifiedValue = 0;
        }
        if(addData.proposedNinthsEVCP!==null && addData.proposedNinthsEVCP>=0){
            numberOfNinthsValue = (addData.proposedNinthsEVCPAmount/verifiedValue);
            addData.proposedNinthsEVCP = parseFloat(numberOfNinthsValue.toFixed(10));
            addData.proposedNinthsEVCPDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
        }
        if(addData.proposedNinthsDean!==null && addData.proposedNinthsDean>=0){
            numberOfNinthsValue = (addData.proposedNinthsDeanAmount/verifiedValue);
            addData.proposedNinthsDean = parseFloat(numberOfNinthsValue.toFixed(10));
            addData.proposedNinthsDeanDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
        }
        if(addData.proposedNinthsDept!==null && addData.proposedNinthsDept>=0){
            numberOfNinthsValue = (addData.proposedNinthsDeptAmount/verifiedValue);
            addData.proposedNinthsDept = parseFloat(numberOfNinthsValue.toFixed(10));
            addData.proposedNinthsDeptDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
        }
        // if(addData.proposedNinthsNumberTotal!==null && addData.proposedNinthsNumberTotal>=0){
        //     numberOfNinthsValue = (addData.proposedNinthsNumberTotal*verifiedValue);
        //     addData.proposedNinthsAmountTotal = parseFloat(numberOfNinthsValue.toFixed(4));
        //     addData.proposedNinthsAmountTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
        // }
        // Find ninths other sources amounts
        if(addData.ninthsOther && addData.ninthsOther.length>0){
            let ninthsTotal = 0;
            for(let each in addData.ninthsOther){
                if(addData.ninthsOther[each].proposedNinthsValue!==null && addData.ninthsOther[each].proposedNinthsValue>=0){
                    numberOfNinthsValue = (addData.ninthsOther[each].proposedNinthsValue/verifiedValue);
                    addData.ninthsOther[each].proposedNinthsAmountValue = parseFloat(numberOfNinthsValue.toFixed(10));
                    addData.ninthsOther[each].proposedNinthsAmountDisplayValue = this.props.Logic.convertMoneyValueToDisplay(numberOfNinthsValue);
                    ninthsTotal = ninthsTotal + parseFloat(numberOfNinthsValue.toFixed(10));
                }
            }
            addData.proposedNinthsOtherAmountTotal = parseFloat(ninthsTotal.toFixed(10));
        }
        addData.proposedNinthsRate = verifiedValue;
        return addData;
    }

    ninthsCalculations = (addData, field, value) => {
        let numberOfNinthsValue = (value/addData.proposedNinthsRate);
        numberOfNinthsValue = parseFloat(numberOfNinthsValue.toFixed(10));
        if(field==="proposedNinthsEVCPAmount"){
            addData.proposedNinthsEVCP = numberOfNinthsValue;
        }
        if(field==="proposedNinthsDeanAmount"){
            addData.proposedNinthsDean = numberOfNinthsValue;
        }
        if(field==="proposedNinthsDeptAmount"){
            addData.proposedNinthsDept = numberOfNinthsValue;
        }

        return addData;
    }

    findNinthsTotals = (addData) => {
        addData.proposedNinthsNumberTotal = addData.proposedNinthsEVCP + addData.proposedNinthsDean + addData.proposedNinthsDept + addData.proposedNinthsOtherNumberTotal;
        addData.proposedNinthsNumberTotalDisplayValue = parseFloat(addData.proposedNinthsNumberTotal.toFixed(10));
        addData.proposedNinthsAmountTotal = addData.proposedNinthsEVCPAmount + addData.proposedNinthsDeanAmount + addData.proposedNinthsDeptAmount + addData.proposedNinthsOtherAmountTotal;
        addData.proposedNinthsAmountTotalDisplayValue = this.props.Logic.convertMoneyValueToDisplay(addData.proposedNinthsAmountTotal);
        return addData;
    }

    findTotals = (addData) => {
        addData.proposedTotalAdminComp = parseFloat((addData.proposedNinthsAmountTotal + addData.proposedStipendTotal).toFixed(2));
        addData.proposedTotalAdminCompDisplayValue = this.props.Logic.convertMoneyValueToDisplay(addData.proposedTotalAdminComp);
        addData.proposedTotalComp = parseFloat((addData.proposedTotalAdminComp + addData.proposedBaseSalary).toFixed(2));
        addData.proposedTotalCompDisplayValue = this.props.Logic.convertMoneyValueToDisplay(addData.proposedTotalComp);
        addData = this.props.setICLMessage(addData, addData.iclThreshold, addData.proposedTotalComp);
        return addData;
    }

    addNewOtherSource = (typeOfOther) => {
        let {addData} = this.state;

        let object = {
            name: "",
            recStatus: "N",
            proposedApproved: "Proposed",
            proposedDisplayValue: "$0",
            proposedValue: 0,
        };
        if(typeOfOther==="ninthsOther"){
            object ={
                name: "",
                recStatus: "N",
                proposedApproved: "Proposed",
                proposedNinthsAmountDisplayValue: "$0",
                proposedNinthsAmountValue: 0,
                proposedNinthsValue: 0,
                proposedNinthsValueDisplayValue: "$0"
            };
        }
        addData[typeOfOther].push(object);
        this.setState({addData});
        this.refresh();
    }

    deleteOtherCourse = (index, typeOfOther) => {
        let {addData} = this.state;
        addData[typeOfOther].splice(index, 1);

        // Subtract from totals
        if(typeOfOther==="stipendOther"){
            this.findOtherTotal(addData, typeOfOther, "proposedStipendOtherTotal", "proposedValue");
            this.stipendTotalCalculations(addData);
        }else if(typeOfOther==="ninthsOther"){
            this.findOtherTotal(addData, typeOfOther, "proposedNinthsOtherNumberTotal", "proposedNinthsValue");
            this.findOtherTotal(addData, typeOfOther, "proposedNinthsOtherAmountTotal", "proposedNinthsAmountValue");
            this.findNinthsTotals(addData);
        }
        this.setState({addData});
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
        let {addData} = this.state;
        let value = e.target.value;
        if(value.length<3){
            addData.unit = null;
        }
        this.setState({addData});
    }

    onClickSearchUnit = (e) => {
        let {addData, unitOptions} = this.state;
        let value = e.target.value;
        let ahPathId = Object.keys(unitOptions).find(key => unitOptions[key] === value);
        addData.academicHierarchyPathId = parseInt(ahPathId);

        // Split by : and reverse array to check from the last element
        let unitName = value.split(":").reverse();
        addData.unit = value;

        // Loop through and find first non N/A to display
        let organizationName;
        for(let name of unitName){
            if(name!=="N/A"){
                organizationName = name;
                break;
            }
        }

        // Set organization name
        addData.organizationName = organizationName;
        this.getICLThreshold(addData);
        this.getStipendHeaders(addData.academicHierarchyPathId, addData.academicYear);
        this.getNinthsHeaders(addData.academicHierarchyPathId, addData.academicYear);
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
        let {addData} = this.state;
        let value = e.target.value;
        if(value.length<3){
            addData.titleCodeId = null;
        }
        this.setState({addData});
    }

    onClickSearchTitleCode = (e) => {
        let {addData, titleCodes} = this.state;
        let value = e.target.value;
        for(let each of titleCodes){
            let values = Object.values(each);
            if(values[0]===value){
                let keys = Object.keys(each);
                addData.titleCodeId = keys[0];
            }
        }
        this.setState({addData});
    }

    getStipendHeaders = async (ahPathId, academicYear) => {
        if (ahPathId !== null && academicYear !== null) {
            try {
                let {addData} = this.state;
                let stipendHeaders = await this.props.Logic.getStipendHeaders(ahPathId, academicYear);
                console.log(stipendHeaders);
                addData.stipendHeaders = stipendHeaders;
                this.setState({addData});
            } catch(e) {
                console.log("Stipend Header API ERROR:");
                console.error(e);
            }
        }
    }

    getNinthsHeaders = async (ahPathId, academicYear) => {
        if (ahPathId !== null && academicYear !== null) {
            try {
                let {addData} = this.state;
                let ninthsHeaders = await this.props.Logic.getNinthsHeaders(ahPathId, academicYear);
                console.log(ninthsHeaders);
                addData.ninthsHeaders = ninthsHeaders;
                this.setState({addData});
            } catch(e) {
                console.log("Ninths Header API ERROR:");
                console.error(e);
            }
        }
    }

    getICLThreshold = async (addData) => {
        try {
            let iclThreshold = await this.props.Logic.getICLThreshold(addData);
            addData.iclThreshold = iclThreshold;
            addData = this.props.setICLMessage(addData, addData.iclThreshold, addData.proposedTotalComp);
            this.setState({addData});
        } catch(e) {
            console.log("ICL API ERROR:");
            console.error(e);
        }
    }

    async getACProposalHeaderForNew(selectedOpusId) {
        let {addData} = this.state;

        let acProposalObject =  await this.props.Logic.getNewACProposalHeader(selectedOpusId);
        addData.headerFacultyAppointment = acProposalObject.headerFacultyAppointment;
        addData.headerActionInProgress = acProposalObject.headerActionInProgress;
        this.setState({addData});
    }

    onChooseAutoCompleteName = (event, value) => {
        let {addData} = this.state;
        let info = value.label.split(",");
        let name = info[0]+", "+info[1];
        let selectedPerson = {
            name,
            uid: info[2],
            email: info[3],
            show: true
        };
        addData.email = info[3];
        addData.emplName = name;
        let proposalPersonName = name.trim();
        addData.uid = info[2];
        addData.opusId = value.id;
        this.setState({selectedPerson, proposalPersonName, isSaveButtonDisabled: false, addData});
        let acProposalObject =  this.getACProposalHeaderForNew(value.id);
    }

    onAutocompleteSearchKeypress = async ({term: searchText}, response) => {
        let formattedResultsPromise = this.props.Logic.getFormattedNameSearchOptions(
          searchText);

        //Send to error modal
        this.setState({failurePromise: formattedResultsPromise});

        //Get from API
        let formattedResults = await formattedResultsPromise;

        //Send back to autocomplete to populate dropdown
        response(formattedResults);

        //Get error message if we did or didnt find people
        let resultsMessage = formattedResults.length ? "" :
          `No results found for "${searchText}".`;

        //Set the message in state
        this.setState({resultsMessage});
        return formattedResults;
    }

  /**
  *
  * @desc - Hides success modal
  * @return {void}
  *
  **/
    dismissSuccessModal = () => {
        this.getACLists();
        this.setState({showSuccessModal: false});
    }

    refreshProposalsTable = () => {
        this.dismissSuccessModal();
        this.props.refreshProposalsTable();
    }

    /**
  *
  * @desc - This is the create a proposal modal
  * @return {void}
  *
  **/
    getProposalCreatedModal() {
        let {summaryPageUrl: href, showSuccessModal, addData, proposalPersonName} = this.state;

        return (
      <Modal show={showSuccessModal} onHide={this.refreshProposalsTable}>
        <Header className=" modal-success " closeButton>
          <h1 className="white" id="ModalHeader"> Congratulations! </h1>
        </Header>
        <Body>
          You have created a proposal for {proposalPersonName}. <br/> <br/>
        </Body>
        <Footer>
          <a {...{href}} className="white left btn btn-success" target="_blank" >
            Go to Proposal Summary
          </a>
          <Dismiss className="left btn btn-link" onClick={this.dismissSuccessModal}>
            Back to Proposal Table
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {
        let {addData, resultsMessage, selectedPerson, academicYearList, multipleAdminApptsList,
        compTypeList, proAppList, sourceTypeList, typeOfApptList, titleCodes, isSaveButtonDisabled} = this.state;
        let proposalCreatedModal = this.getProposalCreatedModal();
        return(
        <div>
             {proposalCreatedModal}

            <Modal className=" modal-lg " backdrop="static" show={this.props.showAddProposalModal}
                onHide={this.revertAddData}>
                <Header className=" modal-info modal-header " closeButton>
                    <Title> <h1 className=" modal-title black ">Administrative Compensation</h1> </Title>
                </Header>
                <Body>
                    <h2 className="flush-top">Add New Proposal</h2>

                    <div>
                        <label>
                            Who would you like to start a proposal for?
                        </label>
                        <FormAutoComplete placeholder={'Search for a person by name (last, first) or UID'}
                        options={this.onAutocompleteSearchKeypress} autoCompleteUIOptions={{}}
                        onSearchClick={this.onChooseAutoCompleteName} id={'nameSearchAutocomplete'}
                        base_css={''} left_field_css={''} right_field_css={''} showLabel={false}/>
                        <p className="no-results-namesearch">{resultsMessage}</p>
                    </div>
                    <ShowIf show={selectedPerson.show}>
                        <span>
                            <h3>{selectedPerson.name}</h3>
                            <div>UID: {selectedPerson.uid}</div>
                            <div>Email: {selectedPerson.email}</div>
                            <br/>
                            <ToggleView contentClassName=" col-md-offset-1 "
                                showText="Show Details" hideText="Hide Details">

                                <div>
                                <p>
                                    <span className="strong">Faculty Appointments</span>
                                    <div className="small">
                                    {addData.headerFacultyAppointment && addData.headerFacultyAppointment.length>0 ?
                                    <span>
                                    {addData.headerFacultyAppointment.map((source, index) => (
                                        <span key={index}>
                                        {source}
                                        <br/>
                                        </span>

                                    ))}
                                    </span>
                                    :
                                    <div>
                                        None
                                    </div>
                                }
                                </div>
                                </p>
                                </div>

                                <div>
                                <p><span className="strong">Actions in Progress</span>
                                <div className="small">
                                {addData.headerActionInProgress && addData.headerActionInProgress.length>0 ?
                                    <span>
                                    {addData.headerActionInProgress.map((source, index) => (
                                        <span key={index}>
                                        {source}
                                        <br/>
                                        </span>
                                    ))}
                                    </span>
                                    :
                                    <div>
                                        None
                                    </div>
                                }
                                </div>
                                </p>
                                </div>

                            </ToggleView>
                            <br/>
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
                                                value={addData.academicYear}
                                                hasError={addData.academicYearError ? true : false}
                                                error={addData.academicYearError}
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
                                                value={addData.typeOfApptId}
                                                hasError={addData.typeOfApptIdError ? true : false}
                                                error={addData.typeOfApptIdError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Effective Date
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormDate onChange={(e) => this.onChangeDate(e, "proposedEffectiveDT")}
                                                value={addData.proposedEffectiveDT ? moment(addData.proposedEffectiveDT).format("L") : null}
                                                hasError={addData.proposedEffectiveDTError ? true : false}
                                                error={addData.proposedEffectiveDTError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        End Date <ToolTip text={descriptions.endDate} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormDate onChange={(e) => this.onChangeDate(e, "proposedEndDT")}
                                                value={addData.proposedEndDT ? moment(addData.proposedEndDT).format("L") : null}
                                                hasError={addData.proposedEndDTError ? true : false}
                                                error={addData.proposedEndDTError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Unit Search <ToolTip text={descriptions.organizationNameForProposalsModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormAutoComplete placeholder={'Search for unit name (minimum 3 characters)'} ref="autocomplete"
                                                options={this.searchUnit} autoCompleteUIOptions={{}}
                                                onSearchClick={this.onClickSearchUnit}
                                                onChange={this.onChangeSearchUnit}
                                                id={'unitSearchAutocomplete'}
                                                input_css={' form-control  search-field '}
                                                hasError={addData.unitError ? true : false}
                                                error={addData.unitError ? "Please search and select a unit in the search bar above." : null}
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
                                              value={addData.unit}
                                              hasError={addData.unitError ? true : false}
                                              error={addData.unitError ? "Please search and select a unit above." : null}
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
                                                value={addData.organizationName}
                                                onChange={(e) => this.onChange(e, "organizationName")}
                                                onBlur={this.onBlur}
                                                hasError={addData.organizationNameError ? true : false}
                                                error={addData.organizationNameError}
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
                                                hasError={addData.titleCodeIdError ? true : false}
                                                error={addData.titleCodeIdError ? "Please search and select a title code in the search bar above." : null}
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
                                                value={addData.titleCodeId}
                                                disabled={true}
                                                hasError={addData.titleCodeIdError ? true : false}
                                                error={addData.titleCodeIdError ? "Please search and select a title code above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Working Title / Role <ToolTip text={descriptions.workingTitleForProposals} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormTextAreaMaxChar name="workingTitle" value={addData.workingTitle}
                                                onChange={(e) => this.onChange(e, "workingTitle")}
                                                onBlur={this.onBlur}
                                                hasError={addData.workingTitleError ? true : false}
                                                error={addData.workingTitleError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Justification (optional) (max 250 characters) <ToolTip text={descriptions.justificationForProposals} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormTextAreaMaxChar name="justification" value={addData.justification}
                                                onChange={(e) => this.onChange(e, "justification")}
                                                onBlur={this.onBlur}
                                                hasError={addData.justificationErrorMessage ? true : false}
                                                error={addData.justificationErrorMessage}
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
                                                value={addData.multipleAdminApptsId}
                                                hasError={addData.multipleAdminApptsIdError ? true : false}
                                                error={addData.multipleAdminApptsIdError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        FTE - EVCP <ToolTip text={descriptions.FTEEVCP} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormNumber name="fullTimeEquivalent"
                                                value={addData.proposedFteEVCP}
                                                onChange={(e) => this.onChangeNumber(e, "proposedFteEVCP")}
                                                descriptionText={descriptions.proposedFteEVCP}
                                                hasError={addData.proposedFteEVCPError ? true : false}
                                                error={addData.proposedFteEVCPError}
                                                right_field_css={' col-sm-4 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        FTE - Other
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormNumber name="fullTimeEquivalent"
                                                value={addData.proposedFteOther}
                                                onChange={(e) => this.onChangeNumber(e, "proposedFteOther")}
                                                descriptionText={descriptions.proposedFteOther}
                                                hasError={addData.proposedFteOtherError ? true : false}
                                                error={addData.proposedFteOtherError}
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
                                                value={addData.proposedBaseSalary}
                                                onChange={(e) => this.onChangeNumber(e, "proposedBaseSalary")}
                                                descriptionText={descriptions.proposedBaseSalary}
                                                hasError={addData.proposedBaseSalaryError ? true : false}
                                                error={addData.proposedBaseSalaryError}
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
                                                value={addData.proposedNSTP}
                                                hasError={addData.proposedNSTPError ? true : false}
                                                error={addData.proposedNSTPError}
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
                                            <OtherHeader headers={addData.stipendHeaders}/>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        EVCP
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormCurrency name="proposedStipendEVCP"
                                                value={addData.proposedStipendEVCP}
                                                onChange={(e) => this.onChangeNumber(e, "proposedStipendEVCP")}
                                                hasError={addData.proposedStipendEVCPError ? true : false}
                                                error={addData.proposedStipendEVCPError}
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
                                                value={addData.proposedStipendDean}
                                                onChange={(e) => this.onChangeNumber(e, "proposedStipendDean")}
                                                hasError={addData.proposedStipendDeanError ? true : false}
                                                error={addData.proposedStipendDeanError}
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
                                                value={addData.proposedStipendDept}
                                                onChange={(e) => this.onChangeNumber(e, "proposedStipendDept")}
                                                hasError={addData.proposedStipendDeptError ? true : false}
                                                error={addData.proposedStipendDeptError}
                                                right_field_css={' col-sm-8 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    {addData.stipendOther.map((other, index) => (
                                        <tr key={index}>
                                            <td className=' label-column col-md-6 '>
                                                <div>Other Source Name
                                                    <ToolTip text={descriptions.proposedStipendOther} />
                                                </div>
                                                <FormInput name="proposedStipendOther"
                                                    displayName={'Other Source Name'}  value={other.name}
                                                    onChange={(e) => this.onChangeOther(e, "name", "stipendOther", index)}
                                                    hasError={other.error ? true : false}
                                                    error={other.error}
                                                    showLabel={false}
                                                    disabled={other.name===null}/>
                                            </td>
                                            <td className=' col-md-6 '>
                                            <div>&nbsp;</div>
                                                <div className= 'col-md-8'><FormCurrency name="proposedStipendOther"
                                                    value = {other.proposedValue}
                                                    onChange={(e) => this.onChangeOther(e, "proposedValue", "stipendOther", index)}
                                                    hasError={other.error ? true : false}
                                                    right_field_css={''}
                                                    base_css={''} left_field_css={''} showLabel={false}
                                                    disabled={other.proposedValue===null}/>
                                                </div>
                                                <div className= 'col-md-4 form-control-static'>
                                                    <ShowIf show={other.proposedValue!==null}>
                                                        <Button className="btn btn-primary btn-sm" onClick={() => this.deleteOtherCourse(index, "stipendOther")}>
                                                            Delete
                                                        </Button>
                                                    </ShowIf>
                                                </div>
                                            </td>
                                        </tr>
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
                                            {addData.proposedStipendTotalDisplayValue}
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
                                            <OtherHeader headers={addData.ninthsHeaders}/>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={" label-column col-md-4 "}>
                                            Admin. 9ths Rate  <ToolTip text={descriptions.ninthsRateForProposal} />
                                        </td>
                                        <td className={" col-md-4 "} colSpan="2">
                                            <FormCurrency name="proposedNinthsRate"
                                                value={addData.proposedNinthsRate}
                                                onChange={(e) => this.onChangeNumber(e, "proposedNinthsRate")}
                                                hasError={addData.proposedNinthsRateError ? true : false}
                                                error={addData.proposedNinthsRateError}
                                                right_field_css={' col-sm-8 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={" col-md-4 "}/>
                                        <th className={" col-md-4 "}>
                                            # of Admin. 9ths
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
                                            {addData.proposedNinthsEVCP}
                                        </td>
                                        <td className={" col-md-4 "}>
                                            <FormCurrency name="proposedNinthsEVCPAmount"
                                                value={addData.proposedNinthsEVCPAmount}
                                                onChange={(e) => this.onChangeNumber(e, "proposedNinthsEVCPAmount")}
                                                hasError={addData.proposedNinthsEVCPAmountError ? true : false}
                                                error={addData.proposedNinthsEVCPAmountError}
                                                right_field_css={' col-sm-8 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={" label-column col-md-4 "}>
                                        Dean
                                        </td>
                                        <td className={" col-md-4 "}>
                                            {addData.proposedNinthsDean}
                                        </td>
                                        <td className={" col-md-4 "}>
                                            <FormCurrency name="proposedNinthsDeanAmount"
                                                value={addData.proposedNinthsDeanAmount}
                                                onChange={(e) => this.onChangeNumber(e, "proposedNinthsDeanAmount")}
                                                hasError={addData.proposedNinthsDeanAmountError ? true : false}
                                                error={addData.proposedNinthsDeanAmountError}
                                                right_field_css={' col-sm-8 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={" label-column col-md-4 "}>
                                        Dept.
                                        </td>
                                        <td className={" col-md-4 "}>
                                            {addData.proposedNinthsDept}       
                                        </td>
                                        <td className={" col-md-4 "}>
                                            <FormCurrency name="proposedNinthsDeptAmount"
                                                value={addData.proposedNinthsDeptAmount}
                                                onChange={(e) => this.onChangeNumber(e, "proposedNinthsDeptAmount")}
                                                hasError={addData.proposedNinthsDeptAmountError ? true : false}
                                                error={addData.proposedNinthsDeptAmountError}
                                                right_field_css={' col-sm-8 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    {addData.ninthsOther.map((other, index) => (
                                        <tr key={index}>
                                            <td className=' label-column col-md-4 '>
                                                <div>Other Source Name
                                                    <ToolTip text={descriptions.proposedNinthsOther} />
                                                </div>
                                                <FormInput name="proposedNinthsOther"
                                                    displayName={'Other Source Name'}  value={other.name}
                                                    onChange={(e) => this.onChangeOther(e, "name", "ninthsOther", index)}
                                                    hasError={other.error ? true : false}
                                                    error={other.error}
                                                    showLabel={false}
                                                    disabled={other.name===null}
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
                                            {addData.proposedNinthsNumberTotalDisplayValue}
                                        </td>
                                        <td className={" col-md-4 "}>
                                            {addData.proposedNinthsAmountTotalDisplayValue}
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
                                            # of Courses <ToolTip text={descriptions.numberCourses} />
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
                                                value={addData.proposedCourseReleases}
                                                onChange={(e) => this.onChangeNumber(e, "proposedCourseReleases")}
                                                descriptionText={descriptions.fullTimeEquivalentForAllocations}
                                                hasError={addData.proposedCourseReleasesError ? true : false}
                                                error={addData.proposedCourseReleasesError}
                                                right_field_css={' col-sm-8 '}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                        <td className={" col-md-4 "}>
                                            <FormCurrency name="proposedCourseReleasesEstCost"
                                                value={addData.proposedCourseReleasesEstCost}
                                                onChange={(e) => this.onChangeNumber(e, "proposedCourseReleasesEstCost")}
                                                hasError={addData.proposedCourseReleasesEstCostError ? true : false}
                                                error={addData.proposedCourseReleasesEstCostError}
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
                                        Total Admin. Comp. <ToolTip text={descriptions.totalComp} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            {addData.proposedTotalAdminCompDisplayValue}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Base Salary <ToolTip text={descriptions.baseSalaryEdit} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            {this.props.Logic.convertMoneyValueToDisplay(addData.proposedBaseSalary)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Total Comp. <ToolTip text={descriptions.totalApprovedComp} />
                                        </td>
                                        <td className={" col-md-8 "+addData.proposedIclBackgroundClass}>
                                            {addData.proposedTotalCompDisplayValue}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="row">
                                <div className="col-md-4"/>
                                <div className={"col-md-8 "+addData.proposedIclTextClass}>
                                    {addData.proposedIclMessage}
                                </div>
                            </div>
                            <br></br>
                            Comments (Maximum 250 characters.)
                            <FormTextArea onChange={(e) => this.onChange(e, "comments")}
                                onBlur={this.onBlur}
                                value={addData.comments ? addData.comments : ""} />
                            <ShowIf show={addData.hasErrors}>
                                <p className="error_message">{addData.modalErrorMessage}</p>
                            </ShowIf>
                        </span>
                    </ShowIf>
                </Body>
                <Footer>
                    <Button className="left btn btn-primary" onClick={this.saveNewData}
                        disabled={isSaveButtonDisabled}>
                        Save
                    </Button>
                    <Dismiss onClick={this.revertAddData} className="left btn btn-link">
                        Cancel
                    </Dismiss>
                </Footer>
            </Modal>
        </div>
    );
    }
}
