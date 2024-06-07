import React from "react";
import PropTypes from "prop-types";

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import ReviewProcess from "../../../opus-logic/cases/classes/review-process/ReviewProcess";
import CaseSummary from "../../../opus-logic/cases/classes/case-summary/CaseSummary";
import * as util from "../../../opus-logic/common/helpers/";
import {urls} from "../../../opus-logic/cases/constants/CasesConstants";
import APIResponseModal, {Failure} from "../../common/components/bootstrap/APIResponseModal.jsx";
import {ShowIf, HideIf} from "../../common/components/elements/DisplayIf.jsx";
import Modal, {Header, Body, Footer, Dismiss} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {Select} from "../../common/components/forms/SelectOption.jsx";
import {RadioGroup, Radio} from "react-radio-group";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import {FormShell} from "../../common/components/forms/FormRender.jsx";
import {FormElementWrapper, FormSelect, FormInput} from "../../common/components/forms/FormElements.jsx";
import {SearchBarWithButton} from "../../common/components/elements/SearchBarWithButton.jsx";

export default class ReviewProcessPage extends React.Component {
  /**
  *
  * @desc -
  *
  **/
    static propTypes = {
        showTemplateModal: PropTypes.bool,
        showExistingCaseModal: PropTypes.bool,
        showEnterPacketIdModal: PropTypes.bool,
        showUnlinkWarningModal: PropTypes.bool,
        modal_body_div_class: PropTypes.string,
        caseSummaryDataFromAPI: PropTypes.object
    };
    static defaultProps = {
        modal_body_div_class: "",
        caseSummaryDataFromAPI: {}
    };

  /**
  *
  * @desc - State vars
  * @param {Object} props - input props
  * @return {void}
  *
  **/
    constructor(props = {}) {
        super(props);
    }

  /**
  *
  * @desc - Instance variables
  *
  **/
    ReviewProcess = new ReviewProcess(this.props);
    CaseSummary = new CaseSummary(this.props); //to use the getCasesSummaryData function
    dropdowns = {
        options_value_key: "templateId-packetTypeId",
        options_text_key: "templateName"
    };
    selectedTemplateDisplayText = null;
    selectedPacketTypeName = null;
    bycUnitId = null; //Needed for templates API call
    bycPacketId = null; //Needed for URL API call
    existingBycCases = null; //The list of existing ByC cases

  /**
  *
  * @desc - State vars
  *
  **/
    state = {
        modal: {
            title: "Choose a Template"
        },
        templates: [],
        url: "",
        caseExistsInByC: false,
        errorText: "",
        selectedExistingBycCase: null, //The ID for the selected ByC case to link to the Opus case
        selectedTemplate: null,
        showTemplateModal: false,
        showExistingCaseModal: false,
        showEnterPacketIdModal: false,
        closeButton: true,
        showUnlinkWarningModal: false,
        showUnlinkSuccessModal: false,
        showEmailModal: false,
        email: null,
        noEppn: false,
        disableContinueButton: false,
        showOatsStatus: false,
        oatsInfoDisplay: {},
        packetInfoResults:{},
        disableGoToInterfolioButton: false,
        statusText: "",
        isSubmitButtonDisabled: true
    }

  /**
  *
  * @desc -
  * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
  * @return {void}
  *
  **/
    componentWillMount(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
    //Calling this earlier because it affects the render function's map() call
        this.getExistingBycCases(caseSummaryDataFromAPI);
        this.setOatsStatus(caseSummaryDataFromAPI);
    }

  /**
  *
  * @desc -
  * @return {void}
  *
  **/
    componentDidMount() {
        this.setReviewProcessFields(this.props.caseSummaryDataFromAPI);
    }

  /**
   * @desc - Initialize fields needed
   * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
   * @return {void}
   **/
    setReviewProcessFields(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
        this.hasExistingCaseInByC(caseSummaryDataFromAPI);
        this.getByCUnitId(caseSummaryDataFromAPI);
        this.getByCPacketId(caseSummaryDataFromAPI);
        this.checkEmailStatus(caseSummaryDataFromAPI);
    }

  /**
   *
   * @desc -
   * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
   * @return {void}
   *
   **/
    hasExistingCaseInByC(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
        if (caseSummaryDataFromAPI) {
            let {opusCaseInfo} = caseSummaryDataFromAPI;
            let exists = this.ReviewProcess.hasExistingCaseInByC({opusCaseInfo});
            this.setState({caseExistsInByC: exists});
        }
    }

  /**
   * @desc - Extract the ByCUnitId from caseSummaryDataFromAPI
   * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
   * @return {void}
   **/
    getByCUnitId(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
        let {actionDataInfo} = caseSummaryDataFromAPI;
        this.bycUnitId = this.ReviewProcess.getByCUnitId({actionDataInfo});
    }

  /**
   * @desc Extract the ByCPacketId from caseSummaryDataFromAPI
   * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
   * @return {void}
   **/
    getByCPacketId(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
        let {opusCaseInfo: {bycPacketId}} = caseSummaryDataFromAPI;
        this.bycPacketId = bycPacketId;
    }

  /**
   * @desc Extract the list of existing ByC cases from caseSummaryDataFromAPI
   * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
   * @return {void}
   **/
    getExistingBycCases(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
        let {byCUserCases: existingBycCases} = caseSummaryDataFromAPI;
        this.existingBycCases = existingBycCases;
        this.setState({disableGoToInterfolioButton: false});
    }

    setOatsStatus(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI){
    // if(true){
    //   let oatsData = {fiscalYear: '2020', unitTitle: 'Professor', policyName: 'Policy 42', status: 'Not Submitted', dueDate: '12/24/2020'}

        if(caseSummaryDataFromAPI.opusCaseInfo.oatsInfo && caseSummaryDataFromAPI.opusCaseInfo.oatsInfo.status!=="N/A"){
            let oatsData = caseSummaryDataFromAPI.opusCaseInfo.oatsInfo;

            let oatsInfoDisplay = {
                icon: "check.png",
                header: "OATS certification is complete.",
                body: "The candidate has submitted their annual certification for their outside activities for "+
        oatsData.fiscalYear+", "+oatsData.unitTitle+", "+oatsData.policyName+" on time.",
                showLink: false
            };

            if(oatsData.status==="Not Submitted"){
                oatsInfoDisplay = {
                    icon: "x.png",
                    header: "Reminder! Annual OATS certification is not complete.",
                    body: "The candidate has not yet submitted their annual certification for outside activities for "+
            oatsData.fiscalYear+", "+oatsData.unitTitle+", "+oatsData.policyName+".  The annual certification was due on "+
            oatsData.dueDate+", but the status is still "+oatsData.status+". Please have the candidate complete their ",
                    showLink: true
                };
            }
            this.setState({showOatsStatus: true, oatsInfoDisplay});
        }
    }

    checkEmailStatus(caseSummaryDataFromAPI){
        let isEmailLegit = true;
        let emailFieldStatus = caseSummaryDataFromAPI.emailFieldStatus;
        if(emailFieldStatus === "Not A Valid Email" || emailFieldStatus === "Empty Contact Value"){
            isEmailLegit = false;
        }
        this.setState({isEmailLegit, emailFieldStatus});
        if(!caseSummaryDataFromAPI.appointeeInfo.eppn || caseSummaryDataFromAPI.appointeeInfo.eppn===""){
            this.setState({noEppn: true});
        }
    }

  /**
   * @desc - Handles the different paths when the Go to Interfolio button is clicked
   * @return {void}
   **/
    handleGoToInterfolioButtonClick = () => {
        if (this.state.caseExistsInByC) {
      //Open ByC window
            let bycPacketId = this.bycPacketId;
            let {access_token} = this.props;
            let reviewProcessTemplate = this.ReviewProcess.formatTemplateForSaveCaseInByC({bycPacketId});
            let getURLPromise = this.ReviewProcess.saveCaseInByC({reviewProcessTemplate, access_token});
            this.setState({failurePromise: getURLPromise});
            this.onFinishGetURL(getURLPromise);
        }
        else if (this.existingBycCases !== null) {
            this.setState({disableGoToInterfolioButton: true});

      //Clear the selected value in case the modal was closed/cancelled previously
            this.setState({selectedExistingBycCase: null});
            this.setState({selectedTemplate: null});
            this.selectedTemplateDisplayText = null;
            this.selectedPacketTypeName = null;

      //Link to Existing ByC Case modal (modal opening handled by the button initilization)
            this.setState({modal: {title: "Link to an Existing Case?"}});
            this.setState({showExistingCaseModal: true});
        }
    else {
            this.setState({disableGoToInterfolioButton: true});

      //Clear the selected value in case the modal was closed/cancelled previously
            this.setState({selectedTemplate: null});
            this.selectedTemplateDisplayText = null;
            this.selectedPacketTypeName = null;

      //Template modal (modal opening handled by the button initilization)
            this.makeTemplateAPICall();
            this.setState({showTemplateModal: true});
        }
    }

  /**
  * @desc - Executes if the Unlink the Case in Interfolio button is clicked
  * @returns {void}
  **/
    handleUnlinkInterfolioCaseButtonClick = () => {
        this.setState({showUnlinkWarningModal: true});
    }

  /**
  * @desc Helper function so that this block can be called independently
  * @returns {Object} templates
  **/
    makeTemplateAPICall = async () => {
        this.setState({modal: {title: "Choose a Template"}});
    //let {actionDataInfo} = this.props.caseSummaryDataFromAPI;
        let bycUnitId = this.bycUnitId;

        let templatesPromise = this.ReviewProcess.getTemplates({bycUnitId});
        this.setState({failurePromise: templatesPromise});
        let templates = await templatesPromise;

        this.formatTemplateList(templates);
        this.setState({templates});

        return templates;
    }

  /**
  * @desc Helper function to format the templates
  * @param {Object} templates - list of templates
  * @returns {void}
  **/
    formatTemplateList = (templates) => {
        templates.map(template => {
            template["templateId-packetTypeId"] = template.templateId + "-"
      + template.packetTypeId;
        });
    }

  /**
  * @desc Processing for when a ByC template is selected
  * @param {Event} event - the event
  * @returns {void}
  **/
    onSelectBycTemplate = (event) => {
        this.setState({selectedTemplate: event.target.value});
        let selectedIndex = event.target.selectedIndex;
        this.selectedTemplateDisplayText = event.target[selectedIndex].text;
        let templates = this.state.templates;
        for(let index in templates){
            if(templates[index].templateName === event.target[selectedIndex].text){
                this.selectedPacketTypeName = templates[index].packetTypeName;
                break;
            }
        }
    }

  /**
  *
  * @desc - Updates the ByC case choice user clicks on
  * @param {String} value - value
  * @returns {void}
  *
  **/
    onSelectExistingBycCase = (value) => {
        this.setState({selectedExistingBycCase: value});
    }

  /**
  * @desc - Executes after the Submit button in Template modal is clicked
  * @returns {void}
  **/
    handleSaveCaseButtonClick = () => {
        if (!this.state.selectedTemplate) {
            this.setState({errorText: "Please select a template."});
            return;
        }

    //Reset error text
        this.setState({errorText: ""});

    //Prepare for the Save
        let modalName = ".choose_template";
        this.saveCaseInByCPreprocessing({modalName});
    }

  /**
  * @desc - Executes after the OK button in the Link to Existing Case modal is clicked
  * @returns {void}
  **/
    handleLinkToBycCaseButtonClick = () => {
        if (this.state.selectedExistingBycCase === null) {
            this.setState({errorText: "Please choose an option."});
            return;
        }

    //Reset error text
        this.setState({errorText: ""});

        if (this.state.selectedExistingBycCase === "") {
      //Then the user chose "Do not link to an existing case" -
      //must close this modal and open the template modal
            this.makeTemplateAPICall();
            this.setState({showExistingCaseModal: false, showTemplateModal: true});
        }
        else {
      //The user chose to link to an existing case - must call the existing Save function
            let modalName = ".link_to_existing_byc_case";
            let linkWithExistingCase = true;
            this.saveCaseInByCPreprocessing({modalName, linkWithExistingCase});

      //Close existing case modal
            this.setState({showExistingCaseModal: false});
        }
    }

  /**
  * @desc - Executes if the OK button is clicked in the Unlink Interfolio Case modal
  * @returns {void}
  **/
    handleUnlinkInterfolioCaseConfirmationButtonClick = async () => {
        let {caseId} = util.getUrlArgs();
        let user = this.props.adminData.adminName;
        let unlinkPromise = this.ReviewProcess.unlinkInterfolioCase({caseId, user});

        try {
            await unlinkPromise;
            this.setState({showUnlinkSuccessModal: true});
        } catch(error) {
            this.setState({failureMessage: error, failurePromise: unlinkPromise});
        }

    //Hide the warning modal
        this.setState({showUnlinkWarningModal: false});

    //Reload data so that the unlink button will disappear without refreshing page
        this.reloadCaseSummaryData();
    }


  /**
  * @desc - Preprocessing prior to saving the case in ByC
  * @returns {void}
  **/
    saveCaseInByCPreprocessing = ({modalName = "", linkWithExistingCase = false} = {}) => {
    // If email is legit, save case in byc
        if(this.state.isEmailLegit){
            this.saveActualCaseInBYC({linkWithExistingCase});
        }else{
      // Open email modal
            this.setState({modal: {title: "Enter Email Address"}, showEmailModal: true, linkWithExistingCase});
        }

    //Close the previous modal
        if (modalName === ".choose_template") {
            this.setState({showTemplateModal: false});
        }
        else if (modalName === ".link_to_existing_byc_case") {
            this.setState({showExistingCaseModal: false});
        }
    else {
      // do nothing
        }
    }

    savePacketInfo = () => {
        let {packetInfoResults} = this.state;
        let{props: {access_token, adminData: {adminName}}} = this;
        let {caseId} = util.getUrlArgs();
        console.log(caseId);
        console.log(adminName);
        let bycPacketId = packetInfoResults.bycPacketId;
        let bycPacketTypeId = packetInfoResults.bycPacketTypeId;
        let bycCaseCreateDt = packetInfoResults.bycCaseCreateDt;
        console.log(bycPacketId);
        console.log(bycPacketTypeId);
        console.log(bycCaseCreateDt);

        let reviewProcessTemplate = this.ReviewProcess.formatTemplateForUpdateCaseInOpus(
      {caseId, bycPacketId, bycPacketTypeId, adminName, bycCaseCreateDt}
    );

    // Dismiss enter packet id modal before saving
        this.setState({showEnterPacketIdModal: false});

        let getUpdatePromise = this.ReviewProcess.updateCaseInOpus({reviewProcessTemplate, access_token});
        this.setState({failurePromise: getUpdatePromise});
        let byCCaseCreatedPromise = this.onFinishGetURL(getUpdatePromise);
        byCCaseCreatedPromise.then(() => {
            this.reloadCaseSummaryData();
        });
    }

    saveActualCaseInBYC = ({linkWithExistingCase = false, emailComingIn} = {}) => {
        let {selectedTemplateDisplayText, selectedPacketTypeName, bycUnitId, props: {access_token,
      caseSummaryDataFromAPI: {appointeeInfo}, adminData: {adminName}}} = this;
        let {selectedTemplate, selectedExistingBycCase, emailFieldStatus, email} = this.state;
        let {caseId} = util.getUrlArgs();
        let shouldEmailSave = false;
        let emailToSave;
    // Email to save is either direct email coming in or state of email
        if(emailComingIn){
            shouldEmailSave = true;
            emailToSave = emailComingIn;
        }else if(email){
            shouldEmailSave = true;
            emailToSave = email;
        }

    // Only save if there is something to save
        if(shouldEmailSave){
            console.log("Email being saved: "+emailToSave);
            appointeeInfo.officialEmail = emailToSave;
        }

        let reviewProcessTemplate = this.ReviewProcess.formatTemplateForSaveCaseInByC(
      {selectedTemplate, selectedTemplateDisplayText, selectedPacketTypeName, selectedExistingBycCase,
        linkWithExistingCase, bycUnitId, appointeeInfo, caseId, adminName, emailFieldStatus}
    );
    // Dismiss email modal before saving
        this.setState({showEmailModal: false});

        let getSavePromise = this.ReviewProcess.saveCaseInByC({reviewProcessTemplate, access_token});
        this.setState({failurePromise: getSavePromise});
        let byCCaseCreatedPromise = this.onFinishGetURL(getSavePromise);
        byCCaseCreatedPromise.then(() => {
            this.reloadCaseSummaryData();
        });
    }

  /**
   * @desc - Reloads the data automatically without a manual refresh
   * @returns {void}
   **/
    reloadCaseSummaryData = async () => {
        let {caseId} = util.getUrlArgs();

        let results = await this.CaseSummary.getCasesSummaryData(caseId);

    //Call this prior to setting results into global state because this needs to
    //calculate prior to the re-render.  As above in the componentWillMount,
    //I am calling this earlier because it affects the render function's map() call
        this.getExistingBycCases(results);

    //Dispatch caseSummaryDataFromAPI into global state
        this.props.setCaseSummaryDataAPIInGlobalState(results);

        this.setReviewProcessFields(results);
    }

  /**
  * @desc - After the save in ByC is successful, this gets the URL to redirect
  * the page to
  * @param {Promise} urlPromise - the promise
  * @returns {String} url - the URL
  **/
    onFinishGetURL = async (urlPromise) => {
        let url = null;
        try {
            url = await urlPromise;
            this.setState({url}, this.openURLByC.bind(this));
        }
    catch (error) {
        console.log("ERROR: ", error);
        this.setState({failureMessage: error.responseJSON.message});
    }

        this.setState({failurePromise: urlPromise});
        return url;
    }

  /****************************************************************** */
  /* START OF EMAIL FUNCTIONS #EMAILFUNCTIONS */

   /**
  *
  * @desc - Keep track of email changes on input field
  * @param {Event} evt - event object for typing in email input field
  * @return {void}
  *
  **/
    onChangeEmail = (evt) => {
        this.setState({email: evt.target.value});
    }

 /**
  *
  * @desc - Handles button press in email modal
  * @return {void}
  *
  **/
    handleEmailClick = async() => {
        let {email, linkWithExistingCase} = this.state;
        let hasErrors = false;
  // Check if email is blank
        hasErrors = this.isEmailBlank(email);
  // If email is not blank, check if unique and valid
        if(!hasErrors){
            await !this.checkIfEmailIsUniqueAndValid(email);
        }else{
    // Set error state if any
            hasErrors = this.setEmailHasErrorState(hasErrors);
    // If no errors, save case
            if(!hasErrors){
                this.saveActualCaseInBYC({linkWithExistingCase});
            }
        }
    }

  /**
  *
  * @desc - Makes sure email is not blank
  * @return {Boolean} - value if email is blank or not
  *
  **/
    isEmailBlank(email) {
        let isEmailBlank = true;
        let emailFieldErrors = this.ReviewProcess.validateIfEmailIsBlank(email);
        if(emailFieldErrors.isValid){
            isEmailBlank = false;
            this.setState({emailHasError: false, emailErrorText: null});
        }else{
            this.setState({emailErrorText: emailFieldErrors.message});
        }
        return isEmailBlank;
    }

  /**
  *
  * @desc - checks if email is unique and valid
  * @return {Boolean} - boolean value of email being unique and valid
  **/
    checkIfEmailIsUniqueAndValid = async(email) => {
        let hasErrors = false;
        let {opusPersonId} = this.props.caseSummaryDataFromAPI.appointeeInfo;
        let {linkWithExistingCase} = this.state;

    // Disable Continue button on email modal
        this.setState({disableContinueButton: true});

    // Gets email validation promise and reponse
        let emailValidationPromise = this.ReviewProcess.getEmailValidationPromise(email, opusPersonId);
        let response = await emailValidationPromise;

    // Console log response
        console.log(response);

    // Checks if response is not unique or invalid
        if(response === "Found Match"
      || response === "Not A Valid Email"
      || response === "Empty Contact Value"){
            hasErrors = true;
            let errorMessage = this.ReviewProcess.getEmailErrorMessages();
            if(response === "Found Match"){
                this.setState({emailErrorText: errorMessage.isNotUnique});
            }else if(response === "Not A Valid Email"){
                this.setState({emailErrorText: errorMessage.isInvalid});
            }else{
                this.setState({emailErrorText: errorMessage.isBlank});
            }
            this.setState({isEmailLegit: !hasErrors, email, disableContinueButton: false});
            this.setEmailHasErrorState(hasErrors);
        }
        if(response === "No Match Found"){
            this.setState({emailHasError: false, emailErrorText: null,
        isEmailLegit: !hasErrors});
            this.saveActualCaseInBYC({linkWithExistingCase, email});
        }
    }

  /**
  *
  * @desc - Sets error state of email modal
  * @param {Boolean} hasErrors - previous boolean value of errors in other fields
  * @param {Boolean} isEmailLegit - previous boolean value if email is legit
  * @return {Boolean} - boolean value if any fields have errors
  *
  **/
    setEmailHasErrorState(hasErrors){
    // If after all the previous validations email still has errors
    // set email error to be true
        if(hasErrors){
            this.setState({emailHasError: true});
        }else{
            this.setState({emailHasError: false, emailErrorText: null});
        }
        return hasErrors;
    }

  /****************************************************************** */

  /**
  * @desc - Opens the new window with the ByC URL
  * @return {void}
  **/
    openURLByC = () => {
        window.open(this.state.url);
    }

  /**
  *
  * @desc - does what it says
  * @return {void}
  *
  **/
    closeTemplateModal = () => {
        this.setState({showTemplateModal: false, disableGoToInterfolioButton: false});
    }

   /**
  *
  * @desc - does what it says
  * @return {void}
  *
  **/
    closeEmailModal = () => {
        this.setState({showEmailModal: false});
    }

  /**
  *
  * @desc - does what it says
  * @return {void}
  *
  **/
    closeExistingCaseModal = () => {
        this.setState({showExistingCaseModal: false, disableGoToInterfolioButton: false});
    }

  /**
  *
  * @desc - does what it says
  * @return {void}
  *
  **/
    closeUnlinkWarningModal = () => {
        this.setState({showUnlinkWarningModal: false});
    }

  /**
  *
  * @desc - Closes the success modal
  * @return {void}
  *
  **/
    closeUnlinkSuccessModal = () => {
        this.setState({showUnlinkSuccessModal: false});
    }

  /**
   *
   * @desc - Show enter packet Id modal
   * @return {void}
   *
   **/
    openEnterPacketIdButtonClick = () => {

        this.setState({showEnterPacketIdModal: true, statusText: ""});
    }

  /**
  *
  * @desc - does what it says
  * @return {void}
  *
  **/
    closeEnterPacketIdModal = () => {
        this.setState({showEnterPacketIdModal: false});
    }

  /**
  *
  * @desc - Get the results for the Packet ID entered
  * @param {String} packet ID - packetId
  * @return {void}
  *
  **/
    getPacketIDResults = async (packetID) => {
        var isnum = /^\d+$/.test(packetID);
        if(isnum){
            let checkPacketIDPromise = this.ReviewProcess.checkPacketID(packetID);
            this.setState({failurePromise: checkPacketIDPromise});

            let packetInfo = await checkPacketIDPromise;

            let statusText = this.ReviewProcess.getPacketIDStatusText(packetInfo);
            if (statusText !== "There are no packets with that ID in Interfolio.") {
                this.setState({isSubmitButtonDisabled: false});
            }
            this.setState({statusText});

            this.setState({packetInfoResults: packetInfo});
        }else{
            let statusText = "Please enter an Interfolio Packet ID Number.";
            this.setState({statusText});
        }
    }

    render() {
        let {state: {modal: {title}, showTemplateModal, showExistingCaseModal,
      showUnlinkWarningModal, showUnlinkSuccessModal, templates, selectedTemplate,
      errorText, selectedExistingBycCase, failurePromise, failureMessage,
      email, showEmailModal, emailHasError, emailErrorText, disableContinueButton,
      showOatsStatus, oatsInfoDisplay, disableGoToInterfolioButton, showEnterPacketIdModal},
    onSelectBycTemplate, handleSaveCaseButtonClick, onSelectExistingBycCase,
    existingBycCases, handleLinkToBycCaseButtonClick,savePacketInfo,
    handleUnlinkInterfolioCaseConfirmationButtonClick, closeTemplateModal, closeEmailModal,
    closeExistingCaseModal, closeUnlinkWarningModal, closeEnterPacketIdModal,
    dropdowns: {options_value_key, options_text_key}} = this;

        let baseButtonProps = {
            className: " btn-primary btn",
            disabled: disableGoToInterfolioButton,
            onClick: this.handleGoToInterfolioButtonClick
        };
        let templateModalProps = {
            "data-toggle": "modal",
            "data-target": ".choose_template"
        };
        let linkToExistingCasesModalProps = {
            "data-toggle": "modal",
            "data-target": ".link_to_existing_byc_case"
        };
        let unlinkInterfolioCaseProps = {
            className: " btn-primary btn",
            onClick: this.handleUnlinkInterfolioCaseButtonClick,
            "data-toggle": "modal",
            "data-target": ".unlink_warning_modal"
        };
        let enterPacketIdProps = {
            className: " btn-primary btn",
            onClick: this.openEnterPacketIdButtonClick,
            "data-toggle": "modal",
            "data-target": ".enter_packet_id_modal"
        };
        return (
      <div>
        <h1>Review Process</h1>

        {showOatsStatus ?
          <div className='alert alert-info oatsInfoDisplay black' role='alert'>
        	  <div className="row">
            	<div className='col-md-1 center'><img src={"../images/"+oatsInfoDisplay.icon} alt="oats icons" /></div>
            	<div className='col-md-11'>
                <h4>{oatsInfoDisplay.header}</h4>
                <div>
                  {oatsInfoDisplay.body}
                  <ShowIf show={oatsInfoDisplay.showLink}>
                    <a href='https://ucla.ucoats.org/' tabIndex="-1" target="_blank">annual certification.</a>
                  </ShowIf>
                </div>
              </div>
          	</div>
          </div>
        :
          null
        }

        <p>
          You can continue this case in Interfolio at any time. When you do so, please use the "Notify Candidate" feature immediately (this must be done before moving the case forward).
        </p>
        <p>
        {" If you haven't done this before, please go to the Solutions area on our "}
          <a target="_blank" href="https://uclaopus.freshdesk.com/support/solutions">
            UCLA Opus Support Site
          </a>&nbsp;for more information.
        </p>

        {
          this.state.caseExistsInByC ?
            <button {...baseButtonProps} >Go to Interfolio</button> :
            ((this.existingBycCases !== null) ?
              <button {...baseButtonProps} {...linkToExistingCasesModalProps} >
                Go to Interfolio
              </button> :
              <button {...baseButtonProps} {...templateModalProps} > Go to Interfolio</button>
            )
        }
        &nbsp;&nbsp;&nbsp;&nbsp;
        {
          this.state.caseExistsInByC ? <button {...unlinkInterfolioCaseProps}>
          Unlink the Case in Interfolio</button> : null
        }

        <p></p> <p className="small">You may need to disable your pop up blocker.</p><p></p>
        <p></p>
        {
          this.state.caseExistsInByC ?
          null :
          ((this.ReviewProcess.isOAOrAPO() || this.ReviewProcess.isSAOrDA()) ?
          <p className="small">Having trouble linking an Opus case with Interfolio? <a href="#" className='toggle-message' onClick={() => this.openEnterPacketIdButtonClick()}>Enter an Interfolio Packet ID.</a></p> : null
          )
        }
        <p></p>
        <Modal className={' choose_template '} ref="modal" show={showTemplateModal}
          onHide={closeTemplateModal}>
          <Header className=" modal-info " closeButton>
            <h1 className="modal-title" id="ModalHeader">
              <img src="../images/case.png" className="modal-header-icon"
                alt="case icon" />
              &nbsp; &nbsp; {title}
            </h1>
          </Header>
          <Body>
            <p>
              {`Before you start, please choose a template for Interfolio to use for your case.
                For example, if the action is a Dean's Final merit for an Assistant Professor,
                choose the template "Review: Professorial & Research: Dean's Final."`}
            </p>
            <p>For more help with templates, please visit&nbsp;
              <a href="https://uclaopus.freshdesk.com/support/solutions"
                target="_blank">
                UCLA Opus Support
              </a>.
            </p>
            <Select options_value_key={options_value_key} options_text_key={options_text_key}
              options={templates} onChange={onSelectBycTemplate}
              value={selectedTemplate} />
            <p className=" error_message ">{errorText}</p>
            <p>Please click submit only once.</p>
          </Body>
          <Footer>
            <button className="btn btn-primary left"
              onClick={handleSaveCaseButtonClick} >Submit</button>
            <Dismiss onClick={closeTemplateModal} className="left btn btn-link">
              Cancel
            </Dismiss>
          </Footer>
        </Modal>

        <Modal className={' link_to_existing_byc_case '} ref="modal" show={showExistingCaseModal}
          onHide={closeExistingCaseModal}>
          <Header className=" modal-info " closeButton>
            <h1 className="modal-title" id="ModalHeader">
              {title}
            </h1>
          </Header>
          <Body>
            <p>
              {`Would you like to link this to an existing case in Interfolio?  This means
                that the two cases will have the same dossier and go through the
                review process together.`}
            </p>
            <RadioGroup selectedValue={selectedExistingBycCase}
              name="byc-cases" onChange={onSelectExistingBycCase}>

              {<label className=" block " key={'0'}>
                <Radio value={''} className=" col-sm-1 "/>
                <div className="indent-45">
                  <p>Do not link to an existing case</p>
                </div>
              </label>}

              {
                existingBycCases !== null ? (
                  existingBycCases.map((each, index) =>
                    <label className=" block " key={index}>
                      <Radio value={each.bycPacketId + "-" + each.packetTypeId}
                        className=" col-sm-1 "/>
                      <div className="indent-45">
                        <p>Link to: {each.actionType} - {each.byCCaseTemplateType}</p>
                        {(
                          (each.byCCaseReviewStep) !== null ?
                            <p className="small">{each.byCCaseReviewStep}</p> :
                            <p className="small">Case Created: Waiting for an
                            administrator to notify candidate</p>
                        )}
                      </div>
                    </label>
                  )
                ) : null
              }
            </RadioGroup>
            <p className=" error_message ">{errorText}</p>
            <p>Please click OK only once.</p>
          </Body>
          <Footer>
            <button className="btn btn-primary left" onClick={handleLinkToBycCaseButtonClick} >
              OK
            </button>
            <Dismiss onClick={closeExistingCaseModal} className="left btn btn-link">
              Cancel
            </Dismiss>
          </Footer>
        </Modal>

        <Modal className={' unlink_warning_modal '} ref="modal" show={showUnlinkWarningModal}
          onHide={closeUnlinkWarningModal}>
          <Header className=" modal-warning " closeButton>
            <h1 className="modal-title" id="ModalHeader">
              Unlink the Case in Interfolio
            </h1>
          </Header>
          <Body>
            <p>
              {`This will unlink the Opus and Interfolio case. Are you sure you want to do this?
                If you would like to delete the Opus case, please delete the case by using the button on the upper right side of the screen.
                If you would like to delete the case in Interfolio, please go
                to Interfolio and withdraw the case.`}
            </p>
          </Body>
          <Footer>
            <button className="btn btn-warning left"
              onClick={handleUnlinkInterfolioCaseConfirmationButtonClick}>OK
            </button>
            <Dismiss onClick={closeUnlinkWarningModal} className="left btn btn-link">
              Cancel
            </Dismiss>
          </Footer>
        </Modal>

        <Modal className={' email_modal '} ref="modal" show={showEmailModal}
          onHide={closeEmailModal}>
          <Header className=" modal-info " closeButton>
            <h1 className="modal-title" id="ModalHeader">
              <img src="../images/case.png" className="modal-header-icon"
                alt="case icon" />
              &nbsp; &nbsp; {title}
            </h1>
          </Header>
          <Body>
            <FormShell>
              <label>Opus does not have a valid email address for this candidate.
                Please enter an email address below. This email address will be used when you share files with the candidate in Interfolio.
              </label>
              <FormInput name="email" displayName={'Email'} onChange={this.onChangeEmail}
                value={email} hasError={emailHasError} error={emailErrorText}
              />
              <ShowIf show={this.state.noEppn}>
                <p className="error_message">This person does not have a UCLA logon, they won't be able to log in to Interfolio until they create a logon ID.</p>
              </ShowIf>
            </FormShell>
          </Body>
          <Footer>
            <button className="btn btn-primary left"
              onClick={this.handleEmailClick} disabled={disableContinueButton}>Continue</button>
            <Dismiss onClick={closeEmailModal} className="left btn btn-link">
              Cancel
            </Dismiss>
          </Footer>
        </Modal>

        <Modal className={' enter_packet_id_modal '} ref="modal" show={showEnterPacketIdModal}
          onHide={closeEnterPacketIdModal}>
          <Header className=" modal-info " closeButton>
            <h1 className="modal-title" id="ModalHeader">
              &nbsp; &nbsp; Enter an Interfolio Packet ID Number
            </h1>
          </Header>
          <Body>
            <p>
              {`Please enter the Packet ID Number for the Interfolio case you'd
              like to link to. More than one Opus case can be linked to an
              Interfolio case.`}
            </p>
            <br></br>
            <SearchBarWithButton
              placeholder={'Please enter an Interfolio Packet ID Number'}
              onClick={this.getPacketIDResults} buttonText="Search for Packet ID"
            />
            <br></br>
            <p className='blue'>{this.state.statusText}</p>
            <APIResponseModal failurePromise={this.state.failurePromise} />
            <br></br>
          </Body>
          <Footer>
            <button className="btn btn-primary left" disabled={this.state.isSubmitButtonDisabled}
              onClick={savePacketInfo} >Submit</button>
            <Dismiss onClick={closeEnterPacketIdModal} className="left btn btn-link">
              Cancel
            </Dismiss>
          </Footer>
        </Modal>

        <Modal show={showUnlinkSuccessModal} onHide={this.closeUnlinkSuccessModal}>
          <Header className=" modal-success " closeButton>
            <h1 className="white" id="ModalHeader"> Success! </h1>
          </Header>
          <Body>
            You have successfully unlinked this Opus case from the Interfolio case.
          </Body>
          <Footer>
            <Dismiss className="left btn btn-success" onClick={this.closeUnlinkSuccessModal}>
              OK
            </Dismiss>
          </Footer>
        </Modal>

        <APIResponseModal showChildren {...{failurePromise}}>
          <Failure>
            <div dangerouslySetInnerHTML={{__html: failureMessage}} />
          </Failure>
        </APIResponseModal>
        <FixedRoleDisplay {...this.ReviewProcess.adminData}/>
      </div>
    );
    }
}
