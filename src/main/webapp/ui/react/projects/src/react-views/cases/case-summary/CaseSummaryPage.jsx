import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

//My imports
import FinalDecision from './final-decision/FinalDecision.jsx';
import ProposedSection from './proposed-status/ProposedSection.jsx';
import * as util from '../../../opus-logic/common/helpers/';
import {EditIcon} from '../../common/components/elements/Icon.jsx';
import {HideIf, ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import ToggleView from '../../common/components/elements/ToggleView.jsx';
import {FormSelect, FormDate, FormInput} from '../../common/components/forms/FormElements.jsx';
import {MultipleAppointmentsBlock} from '../components/AppointmentBlocks.jsx';
import {ToolTipWrapper} from '../../common/components/elements/ToolTip.jsx';
import {FormShell, FormGroup} from '../../common/components/forms/FormRender.jsx';
//import AppointmentBlock from '../../../opus-logic/cases/modules/AppointmentBlock';
import CaseSummary from '../../../opus-logic/cases/classes/case-summary/CaseSummary';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import {DisplayTable, DisplayTableHeader, DisplayTableBody} from
  '../../common/components/elements/DisplayTables.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

export default class CaseSummaryPage extends React.Component {
  static propTypes = {
    caseSummaryDataFromAPI: PropTypes.object,
    setCaseSummaryDataAPIInGlobalState: PropTypes.func
  }
  state = {
    showAnalystModal: false,
    showProposedActionModal: false,
    isSaveAPOAnalystButtonDisabled: false,
    showWarningInterfolioModal: false,
    boxURL: null,
    shouldShowBoxURL: false,
    shouldShowFormerApoAnalyst: false,
    shouldShowFormerDeansAnalyst: false,
    shouldShowFormerDeptAnalyst: false
  };

  //AppointmentBlock = new AppointmentBlock();

  /**
   *
   * @desc -Start page off
   * @return {void}
   *
   **/
  componentWillMount = () => this.initCaseSummary();

  /**
   *
   * @desc - Every time component receives new props rerender page
   * @return {void}
   *
   **/
  componentWillReceiveProps({caseSummaryDataFromAPI}) {
    if(caseSummaryDataFromAPI !== this.props.caseSummaryDataFromAPI) {
      this.renderCaseSummaryPageFromAPIData(caseSummaryDataFromAPI);
    }
    if(caseSummaryDataFromAPI.caseSummaryByCCaseError!==null){
      this.setState({showWarningInterfolioModal: true,
        interfolioError: caseSummaryDataFromAPI.caseSummaryByCCaseError})
    }
  }

   /**
   *
   * @desc - Every time it updates re-init the tooltips
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
  Logic = new CaseSummary(this.props);

  /**
   *
   * @desc - takes a name and sets it as the title of the page
   * @param {String} name -
   * @return {void}
   *
   **/
  setPageTitleByName(name) {
    if(name) {
      document.title = name + ' - Case Summary';
    }
  }

  /**
   *
   * @desc - Get formatted case summary data
   * @return {void} -
   *
   **/
  initCaseSummary = async () => {
    let {caseId} = util.getUrlArgs();
    let {caseSummaryDataFromAPI} = this.props;

    //If we already have api data no need to get it again from the backend
    if(caseSummaryDataFromAPI) {
      this.renderCaseSummaryPageFromAPIData(caseSummaryDataFromAPI, caseId);
    } else if(caseId) {
      this.setState({caseId});
      caseSummaryDataFromAPI = await this.Logic.getCasesSummaryData(caseId);

      //Dispatch caseSummaryData into global state
      this.props.setCaseSummaryDataAPIInGlobalState(caseSummaryDataFromAPI);
      this.renderCaseSummaryPageFromAPIData(caseSummaryDataFromAPI, caseId);
    }
  }

  /**
  *
  * @desc - Renders the page starting from the arguments given
  * @param {Object} caseSummaryDataFromAPI - straight from API
  * @param {String} caseId - id of case were working on
  *
  **/
  renderCaseSummaryPageFromAPIData(caseSummaryDataFromAPI, caseId = this.state.caseId) {
    //Take a name and set it as the title of this page
    this.setPageTitleByName(caseSummaryDataFromAPI.appointeeInfo.fullName);

    let {casesProposedAttrMap, apptBlockData, caseLocation, startingCaseLocationFields,
      actionDataInfo,workFlowData, hasWorkFlow, endowedChairBlockData,
      apoAnalyst, startingApoAnalystField, canEditAnalyst, canEditApoAnalyst, apoAnalystOptions,
      deansOfficeAnalyst, startingDeansOfficeAnalystField, canEditDeansOfficeAnalyst,
      departmentAnalyst, startingDepartmentAnalystField, canEditDepartmentAnalyst,
       opusCaseInfo, casesApprovedAttrMap} =
      this.Logic.getStartingCaseSummaryData(caseSummaryDataFromAPI);

    this.findBoxURLConditions(caseSummaryDataFromAPI);

    //Values for tables and modals
    this.setState({caseLocation, startingCaseLocationFields, caseId, opusCaseInfo,
      actionDataInfo, hasWorkFlow, workFlowData, casesProposedAttrMap, endowedChairBlockData,
      casesApprovedAttrMap, caseSummaryDataFromAPI, renderTables: true, apptBlockData,
      apoAnalyst, startingApoAnalystField, canEditAnalyst, canEditApoAnalyst, apoAnalystOptions,
      deansOfficeAnalyst, startingDeansOfficeAnalystField, canEditDeansOfficeAnalyst,
      departmentAnalyst, startingDepartmentAnalystField, canEditDepartmentAnalyst,
    });

    // Find appointment ids for case

    this.setState({caseLocationDisplayText: opusCaseInfo.caseLocation});

    // Find analysts after case summary loads
    this.findAnalysts(opusCaseInfo, caseSummaryDataFromAPI, startingApoAnalystField, startingDeansOfficeAnalystField, startingDepartmentAnalystField);
  }

  /**
  *
  * @desc - Gets data from API and sends to global state to rerender everything
  * @param {String} caseId -
  * @return {void}
  *
  **/
  async reloadPage(caseId = this.state.caseId) {
    let caseSummaryDataFromAPI = await this.Logic.getCasesSummaryData(caseId);

    //Dispatch caseSummaryData into global state
    this.props.setCaseSummaryDataAPIInGlobalState(caseSummaryDataFromAPI);
  }

  findBoxURLConditions(caseSummaryDataFromAPI){
    let boxURL;
    let shouldShowBoxURL = false;
    let {isOA, isAPO, isVCAP} = this.Logic.Permissions;
    if(caseSummaryDataFromAPI.opusCaseInfo && caseSummaryDataFromAPI.opusCaseInfo.boxURL
      && caseSummaryDataFromAPI.opusCaseInfo.boxURL!==null){
      boxURL = caseSummaryDataFromAPI.opusCaseInfo.boxURL;
    }
    if(boxURL && (isOA || isAPO || isVCAP)){
      shouldShowBoxURL = true;
    }
    this.setState({boxURL, shouldShowBoxURL})
  }

  findAnalysts = async (opusCaseInfo, caseSummaryDataFromAPI, startingApoAnalystField, startingDeansOfficeAnalystField, startingDepartmentAnalystField) => {
    let apoAnalyst = util.cloneObject(startingApoAnalystField);
    apoAnalyst = this.Logic.findFormerAnalysts(apoAnalyst);
    let shouldShowFormerApoAnalyst = (apoAnalyst.formerName && apoAnalyst.formerName.shouldShow) ? true : false ;
    this.setState({apoAnalyst})

    let apoAnalystName = opusCaseInfo.apoAnalyst;
    let deansOfficeAnalystName = opusCaseInfo.deanAnalyst;
    let deptAnalystName = opusCaseInfo.deptAnalyst;
    let apoAnalystDate = opusCaseInfo.apoAnalystCaseAssignDate;
    let deansAnalystDate = opusCaseInfo.deanAnalystCaseAssignDate;
    let deptAnalystDate = opusCaseInfo.deptAnalystCaseAssignDate;
    if(opusCaseInfo.apoAnalystCaseAssignDate){
      apoAnalystName = apoAnalystName + "  (" + opusCaseInfo.apoAnalystCaseAssignDate + ")";
    }
    if(opusCaseInfo.deanAnalystCaseAssignDate){
      deansOfficeAnalystName = deansOfficeAnalystName + "  (" + opusCaseInfo.deanAnalystCaseAssignDate + ")";
    }
    if(opusCaseInfo.deptAnalystCaseAssignDate){
      deptAnalystName = deptAnalystName + "  (" + opusCaseInfo.deptAnalystCaseAssignDate + ")";
    }
    this.setState({apoAnalystName, deansOfficeAnalystName, deptAnalystName, apoAnalystDate, deansAnalystDate, deptAnalystDate});

    let deansOfficeAnalyst = util.cloneObject(startingDeansOfficeAnalystField);
    let departmentAnalyst = util.cloneObject(startingDepartmentAnalystField);
    let academicHierarchyPathId = this.findAHPathId(caseSummaryDataFromAPI);
    let deansOfficeAnalystOptions = await this.Logic.getDeansOfficeAnalystOptions(academicHierarchyPathId);
    deansOfficeAnalyst.name.options = util.reformatObjectIntoCollectionSortedByValue(deansOfficeAnalystOptions);;
    deansOfficeAnalyst.name.value = opusCaseInfo.deanAnalystOpusId;
    deansOfficeAnalyst = this.Logic.findFormerAnalysts(deansOfficeAnalyst);
    this.setState({deansOfficeAnalyst})

    let shouldShowFormerDeansAnalyst = (deansOfficeAnalyst.formerName && deansOfficeAnalyst.formerName.shouldShow) ? true : false ;

    let departmentAnalystOptions = await this.Logic.getDepartmentAnalystOptions(academicHierarchyPathId);

    departmentAnalyst.name.options = util.reformatObjectIntoCollectionSortedByValue(departmentAnalystOptions);
    departmentAnalyst.name.value = opusCaseInfo.deptAnalystOpusId;
    departmentAnalyst = this.Logic.findFormerAnalysts(departmentAnalyst);
    let shouldShowFormerDeptAnalyst = (departmentAnalyst.formerName && departmentAnalyst.formerName.shouldShow) ? true : false ;
    this.setState({departmentAnalyst,
      shouldShowFormerApoAnalyst, shouldShowFormerDeansAnalyst, shouldShowFormerDeptAnalyst});

      setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
  }

  /*****************************************************************************
   *
   * @name APO ANALYST
   * @desc - Section for Creating Table and Modal. Updating and saving
   *  apoAnalyst changes
   *
   *****************************************************************************/
  /**
   *
   * @desc - Show apo analyst modal
   * @return {void}
   *
   **/
  showAnalystModal = async () => {
    this.setState({showAnalystModal: true});
  }

  /**
   *
   * @desc - Hid apo analyst modal
   * @return {void}
   *
   **/
   closeAnalystModal = () => {
    let {apoAnalyst, deansOfficeAnalyst, departmentAnalyst} = this.state;
    apoAnalyst.name.hasError = false;
    apoAnalyst.name.error = null;
    apoAnalyst.name.value = apoAnalyst.formerName.value;
    apoAnalyst.date.value = this.state.apoAnalystDate;
    deansOfficeAnalyst.name.hasError = false;
    deansOfficeAnalyst.name.error = null;
    deansOfficeAnalyst.name.value = deansOfficeAnalyst.formerName.value;
    deansOfficeAnalyst.date.value = this.state.deansAnalystDate;
    departmentAnalyst.name.hasError = false;
    departmentAnalyst.name.error = null;
    departmentAnalyst.name.value = departmentAnalyst.formerName.value;
    departmentAnalyst.date.value = this.state.deptAnalystDate;
    this.setState({showAnalystModal: false, apoAnalyst, deansOfficeAnalyst, departmentAnalyst,
      shouldShowFormerApoAnalyst: apoAnalyst.formerName.shouldShow,
      shouldShowFormerDeansAnalyst: deansOfficeAnalyst.formerName.shouldShow,
      shouldShowFormerDeptAnalyst: departmentAnalyst.formerName.shouldShow
    });
   };

  /**
   *
   * @desc - Hide apo analyst modal
   * @param {Event} evt - apoAnalyst updates name and value from this evt
   * @return {void}
   *
   **/
  onChangeAPOAnalyst = (evt) => {
    //Extract field
    let {apoAnalyst} = this.state;

    //Update field value
    apoAnalyst.name.value = evt.target.value!=="" ? parseInt(evt.target.value): null;

    //Update field in UI
    this.setState({apoAnalyst, shouldShowFormerApoAnalyst: false});
  }

  onChangeDate = (e, fieldValue) => {
    let value = e.target.value;
    if(fieldValue==="apoAnalystCaseAssignDate"){
      let {apoAnalyst} = this.state;
      apoAnalyst.date.value = value;
      this.setState({apoAnalyst})
    }else if(fieldValue==="deanAnalystCaseAssignDate"){
      let {deansOfficeAnalyst} = this.state;
      deansOfficeAnalyst.date.value = value;
      this.setState({deansOfficeAnalyst})
    }else if(fieldValue==="deptAnalystCaseAssignDate"){
      let {departmentAnalyst} = this.state;
      departmentAnalyst.date.value = value;
      this.setState({departmentAnalyst})
    }
  }

  /**
  *
  * @desc - Onclick save the apoAnalyst
  * @return {void}
  *
  **/
  saveAnalysts = async () => {
    let {apoAnalyst, deansOfficeAnalyst, departmentAnalyst} = this.state;
    this.Logic.validateAnalystFields(apoAnalyst);
    this.Logic.validateAnalystFields(deansOfficeAnalyst);
    this.Logic.validateAnalystFields(departmentAnalyst);

    //Check if any fields have errors
    let hasErrors = this.Logic.doFieldsHaveErrors({apoAnalyst: apoAnalyst.name});
      hasErrors = hasErrors || this.Logic.doFieldsHaveErrors({deansOfficeAnalyst: deansOfficeAnalyst.name});
      hasErrors = hasErrors || this.Logic.doFieldsHaveErrors({departmentAnalyst: departmentAnalyst.name});

    //Now rerender this field to show error if any
    this.setState({apoAnalyst, deansOfficeAnalyst, departmentAnalyst});

    ///If there are no errors lets save
    if(!hasErrors) {
      this.saveAnalystsToAPI();
    }
  }

  /**
   *
   * @desc - Onclick save the apoAnalyst
   * @return {void}
   *
   **/
   saveAnalystsToAPI = async () => {
    let {apoAnalyst, deansOfficeAnalyst, departmentAnalyst, opusCaseInfo} = this.state;

    //Disable so we cant save multiple times
    this.setState({isSaveAnalystButtonDisabled: true});
    let apiPromise = this.Logic.saveAnalysts(apoAnalyst, deansOfficeAnalyst, departmentAnalyst, opusCaseInfo);

    //Catch the promise so execution is not stopped if it has failed
    try {
      await apiPromise;
      // IOK-759 Await Reload page on successful save
      await this.reloadPage();

      //Enable the save button, hide apo modal, and send promise to error modal
      this.setState({apiPromise, isSaveAnalystButtonDisabled: false, showAnalystModal: false});
    } catch(e) {
      console.log("ERROR: api call in 'saveAnalysts' in CaseSummaryPage.jsx")
      console.log(e);
      //Enable the save button, hide apo modal, and send promise to error modal
      this.setState({apiPromise, isSaveAnalystButtonDisabled: false, showAnalystModal: false});
    }
  }

  /**
   *
   * @desc - Gets modal with title of APO Analyst at the top
   * @return {JSX} - APO Analyst modal
   *
   **/
  getAnalystModal() {
    let {apoAnalyst, deansOfficeAnalyst, departmentAnalyst, shouldShowFormerApoAnalyst, shouldShowFormerDeansAnalyst,
      shouldShowFormerDeptAnalyst,
      canEditApoAnalyst, canEditDeansOfficeAnalyst, canEditDepartmentAnalyst} = this.state;
    return (
      <Modal backdrop="static" show={this.state.showAnalystModal}
        onHide={this.closeAnalystModal}>
        <Header className=" modal-info " closeButton>
          <Title> <h1 className=" black "> Analysts </h1> </Title>
        </Header>
        <Body>
          <FormShell>

            <h2 className=" black "> APO Analyst </h2>
            <p>This field cannot be updated by department or dean's office staff.</p>
            <FormSelect name="apoAnalyst" {...apoAnalyst.name}
              onChange={this.onChangeAPOAnalyst} disabled={!canEditApoAnalyst}/>
            <ShowIf show={shouldShowFormerApoAnalyst}>
              <FormInput name="formerAPO" disabled={true} {...apoAnalyst.formerName}
                value={apoAnalyst.formerName && apoAnalyst.formerName.displayText ? apoAnalyst.formerName.displayText : null} />
            </ShowIf>

            <FormDate onChange={(e) => this.onChangeDate(e, "apoAnalystCaseAssignDate")}
              {...apoAnalyst.date} disabled={!canEditApoAnalyst}/>

            <h2 className=" black "> Dean's Office Analyst </h2>
            <p>This field cannot be updated by department staff.</p>
            <FormSelect name="deansOfficeAnalyst" {...deansOfficeAnalyst.name}
              onChange={this.onChangeDeansOfficeAnalyst} disabled={!canEditDeansOfficeAnalyst}/>
            <ShowIf show={shouldShowFormerDeansAnalyst}>
              <FormInput name="formerDeansAnalyst" disabled={true} {...deansOfficeAnalyst.formerName}
                value={deansOfficeAnalyst.formerName && deansOfficeAnalyst.formerName.displayText ? deansOfficeAnalyst.formerName.displayText : null} />
            </ShowIf>
            <FormDate onChange={(e) => this.onChangeDate(e, "deanAnalystCaseAssignDate")}
              {...deansOfficeAnalyst.date} disabled={!canEditDeansOfficeAnalyst}/>

            <h2 className=" black "> Department Analyst </h2>
            <FormSelect name="departmentAnalyst" {...departmentAnalyst.name}
              onChange={this.onChangeDepartmentAnalyst} disabled={!canEditDepartmentAnalyst}/>
            <ShowIf show={shouldShowFormerDeptAnalyst}>
              <FormInput name="formerDeptAnalyst" disabled={true} {...departmentAnalyst.formerName}
                value={departmentAnalyst.formerName && departmentAnalyst.formerName.displayText ? departmentAnalyst.formerName.displayText : null} />
            </ShowIf>
            <FormDate onChange={(e) => this.onChangeDate(e, "deptAnalystCaseAssignDate")}
              {...departmentAnalyst.date} disabled={!canEditDepartmentAnalyst}/>

          </FormShell>
        </Body>
        <Footer>
          <Button className="left btn btn-primary" onClick={this.saveAnalysts}
            disabled={this.state.isSaveAnalystButtonDisabled}>
            Save
          </Button>
          <Dismiss onClick={this.closeAnalystModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /*****************************************************************************
   *
   * @name Dean's Office ANALYST
   * @desc - Section for Creating Table and Modal. Updating and saving
   *  deansOfficeAnalyst changes
   *
   *****************************************************************************/

  /**
   *
   * @desc - Hide deans office analyst modal
   * @param {Event} evt - deansOfficeAnalyst updates name and value from this evt
   * @return {void}
   *
   **/
  onChangeDeansOfficeAnalyst = (evt) => {
    //Extract field
    let {deansOfficeAnalyst} = this.state;

    //Update field value
    deansOfficeAnalyst.name.value = evt.target.value!=="" ? parseInt(evt.target.value): null;

    //Update field in UI
    this.setState({deansOfficeAnalyst, shouldShowFormerDeansAnalyst: false});
  }


  /*****************************************************************************
   *
   * @name Department ANALYST
   * @desc - Section for Creating Table and Modal. Updating and saving
   *  departmentAnalyst changes
   *
   *****************************************************************************/

  /**
   *
   * @desc - Hide Department analyst modal
   * @param {Event} evt - departmentAnalyst updates name and value from this evt
   * @return {void}
   *
   **/
  onChangeDepartmentAnalyst = (evt) => {
    //Extract field
    let {departmentAnalyst} = this.state;

    //Update field value
    departmentAnalyst.name.value = evt.target.value!=="" ? parseInt(evt.target.value): null;

    //Update field in UI
    this.setState({departmentAnalyst, shouldShowFormerDeptAnalyst: false});
  }


  /*****************************************************************************
   *
   * @name Common functions between dean's office and department analyst
   * @desc - Since it is not the same as apo analyst
   *
   *
   *****************************************************************************/

  findAHPathId(caseSummaryDataFromAPI){
    let data = caseSummaryDataFromAPI.actionDataInfo;
    let primaryAppt = data[0];
    let ahName = data[0].appointmentInfo.academicHierarchyInfo.ahName;

    // OPUSDEV-3428 Need to find primary appointment
    if(data.length>1){
      for(let each in data){
        if(data[each].appointmentInfo.affiliationType.affiliationTypeId===1){
          primaryAppt = data[each];
          ahName = data[each].appointmentInfo.academicHierarchyInfo.ahName;
          break;
        }
      }
    }

    let ahPathId = primaryAppt.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId;
    // If there is no current AH Path Id, use proposed appointment info
    if(!ahPathId){
      ahPathId = primaryAppt.proposedAppointmentInfo.academicHierarchyInfo.academicHierarchyPathId;
      console.log("Using Proposed ahPathId: "+ahPathId+" from "+ahName)
    }else{
      console.log("Using Current ahPathId: "+ahPathId+" from "+ahName)
    }

    return ahPathId;
  }

  /*****************************************************************************
   *
   * @name CASE LOCATION
   * @desc - Section for handling creating Table and Modal for Proposed Status.
   *  Updating and saving Proposed Status field updates
   *
   *****************************************************************************/
  /**
   *
   * @desc - self explanatory
   * @return {JSX} - Case Location Table
   *
   **/
  getCaseLocationTable() {
    let {opusCaseInfo} = this.state;
    let canViewTrackingDates = this.Logic.canViewTrackingDates(opusCaseInfo);
    return (
      <div>
        <p> {this.state.caseLocationDisplayText} </p>
        <ShowIf show={canViewTrackingDates}>
          <ToggleView showText="Show Tracking Dates" hideText="Hide Tracking Dates">
            <DisplayTable >
              <DisplayTableHeader>
                Tracking Dates
                <ShowIf show={this.Logic.canEditProposedStatus}>
                  <EditIcon {...{onClick: this.showCaseLocationModal}} />
                </ShowIf>
              </DisplayTableHeader>
              <DisplayTableBody fieldOptions={this.state.caseLocation}
                valueKey="displayValue" />
            </DisplayTable>
          </ToggleView>
        </ShowIf>
      </div>
    );
  }

  /**
  *
  * @desc - updates case location value in state
  * @param {String} name -
  * @param {String} value -
  * @return {void}
  *
  **/
  updateCaseLocation(name, value) {
    //Extract current caseLocation fields
    let {caseLocation} = this.state;

    //Update the case Location
    caseLocation[name].value = value;

    //Update them in the UI
    this.setState({caseLocation});
  }

  /**
  *
  * @desc - updates case location value in state
  * @param {Event} event -
  * @return {void}
  *
  **/
  onChangeCaseLocation = (event) => {
    //Extract name and value
    let {target: {name, value}} = event;

    this.updateCaseLocation(name, value);
  }

  /**
  *
  * @desc - updates case location value in state on blur
  * @param {Event} event -
  * @return {void}
  *
  **/
  onBlurCaseLocation = (event) => {
    //Extract name and value
    let {target: {name, value}} = event;

    this.updateCaseLocation(name, value);
  }

  /**
  *
  * @desc - Extract case location data and save to api on Logic side
  * @return {void}
  *
  **/
  saveCaseLocation = async () => {
    //Extract relevant fields
    let {state: {caseLocation}, props: {caseSummaryDataFromAPI}} = this;

    //Save case location fields and return the promise
    let caseLocationPromise = this.Logic.saveCaseLocation(caseLocation,
      caseSummaryDataFromAPI);

    //Disable the button so no double saving
    this.setState({isCaseLocationButtonDisabled: true});

    //Catch the promise so execution is not stopped if it has failed
    try {
      await caseLocationPromise;

      await this.reloadPage();

    } catch(e) {
      console.log("ERROR: api call in 'saveCaseLocation' in CaseSummaryPage.jsx")
      console.log(e);
    }
    //Enable the button, hide  the case location modal, show the confirmation modal
    this.setState({apiPromise: caseLocationPromise, showCaseLocationModal: false,
      isCaseLocationButtonDisabled: false});
  }

  /**
   *
   * @desc - Show case location modal
   * @return {void}
   *
   **/
  hideCaseLocationModal = () => this.setState({showCaseLocationModal: false})

  /**
   *
   * @desc - Show case location modal
   * @return {void}
   *
   **/
  showCaseLocationModal = () => {
    let {startingCaseLocationFields} = this.state;
    let caseLocation = util.cloneObject(startingCaseLocationFields);
    this.setState({showCaseLocationModal: true, caseLocation});
  }

  /**
   *
   * @desc - self explanatory
   * @return {JSX} - Case Location Table
   *
   **/
  getCaseLocationModal() {
    let {caseLocation, showCaseLocationModal} = this.state;
    return (
      <Modal backdrop="static" show={showCaseLocationModal}
        onHide={this.hideCaseLocationModal}>
        <Header className=" modal-info " closeButton>
          <Title> <h1 className=" black "> Case Location </h1> </Title>
        </Header>
        <Body>
          <FormShell >
            <FormGroup fields={caseLocation} onChange={this.onChangeCaseLocation}
              onBlur={this.onBlurCaseLocation} />
          </FormShell>
        </Body>
        <Footer>
          <Button className="btn btn-primary left" onClick={this.saveCaseLocation}
            disabled={this.state.isCaseLocationButtonDisabled}>
            Save
          </Button>
          <Dismiss onClick={this.hideCaseLocationModal} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }

  /**
  *
  * @name getWorkFlowTable
  * @desc - Section for Creating Case Locations Table.
  * @return {void}
  *
  **/
  getWorkFlowTable() {
    let {opusCaseInfo} = this.state;
    let canViewTrackingDates = this.Logic.canViewTrackingDates(opusCaseInfo);
    let {workFlowData} = this.state;
    return (
      <div>
        <p> {this.state.caseLocationDisplayText} </p>
        <ShowIf show={canViewTrackingDates}>
          <ToggleView showText="Show Tracking Dates" hideText="Hide Tracking Dates">
            <DisplayTable >
              <DisplayTableHeader> Tracking Dates </DisplayTableHeader>
              <DisplayTableBody fieldOptions={workFlowData} valueKey={'value'}
                displayNameKey={'name'} />
            </DisplayTable>
          </ToggleView>
        </ShowIf>
      </div>
    );
  }

    /**
   *
   * @desc - Get ApoAnalyst section
   * @return {JSX} - Tracking Table
   *
   **/
     getAnalystSection() {
      let analystModal = this.getAnalystModal();
      return (
        <div className='pull-right'>
          <p>
            <b>Analysts &nbsp;&nbsp;</b>
            <ShowIf show={this.state.canEditAnalyst}>
              <EditIcon {...{onClick: this.showAnalystModal}} />
            </ShowIf>
          </p>
          <p className="small hidden-print">
            APO: {this.state.apoAnalystName}
          </p>
          <p className="small hidden-print">
            Dean's Office: {this.state.deansOfficeAnalystName}
          </p>
          <p className="small hidden-print">
            Department: {this.state.deptAnalystName}
          </p>
          {analystModal}
           <br/>
        </div>
      );
    }

  /**
   *
   * @desc - If there are workflow steps get the ByCommittee table. If not
   *  get Case Location table;
   * @return {JSX} - Tracking Table
   *
   **/
  getTrackingTable() {
    let {hasWorkFlow} = this.state;
    let table = hasWorkFlow ? this.getWorkFlowTable() : this.getCaseLocationTable();
    return table;
  }

  /**
   *
   * @desc - Get summary API data
   * @return {Object} -
   *
   **/
  getOpusCaseInfoText() {
    return this.Logic.getOpusCaseInfoText(this.props.caseSummaryDataFromAPI);
  }

  /**
   *
   * @desc - Gets proposed status fields
   * @param {Object} props - props for this Component
   * @return {JSX} - proposedStatus section
   *
   **/
  getProposedSection(props = this.props) {
    let {caseSummaryDataFromAPI, caseId} = this.state;
    return (<ProposedSection {...props} {...{caseSummaryDataFromAPI, caseId}}/>);
  }

  hideWarningModal(){
    this.setState({showWarningInterfolioModal: false})
  }

  /**
   *
   * @desc - Warning modal
   * @return {JSX} - jsx
   *
   **/
  getWarningModal() {
    let {interfolioError} = this.state;
    return (
      <Modal backdrop="static" onHide={() => this.hideWarningModal()}
        show={this.state.showWarningInterfolioModal}>
        <Header className=" modal-warning " closeButton>
          <Title> <h1 className="modal-title" > Warning </h1> </Title>
        </Header>
        <Body>
          <p>
            We are currently experiencing issues retrieving data from Interfolio.
            The Case Tracking information may not accurately reflect the current location.
            You can continue to view and edit Opus information.
            If you need to view the case location details, 
            please log in to Interfolio directly or try again later.
          </p>
        </Body>
        <Footer>
          <Button bsStyle="warning" className="left white"
            onClick={() => this.hideWarningModal()}>
            OK
          </Button>
        </Footer>
      </Modal>
    );
  }



  /*****************************************************************************
   *
   * @name Render Page
   * @desc -
   *
   *****************************************************************************/

  render() {
    let {state: {renderTables, failurePromise, apiPromise, actionDataInfo, apptBlockData, caseId, boxURL, shouldShowBoxURL},
      props: {caseSummaryDataFromAPI}, props} = this;


    if(!renderTables) {
      return null;
    }

    let opusCaseInfoText = this.getOpusCaseInfoText();

    let caseLocationModal = this.getCaseLocationModal();
    let proposedSection = this.getProposedSection();
    let getWarningModal = this.getWarningModal();
    let trackingTable = this.getTrackingTable();
    let analystJSX = this.getAnalystSection();

    return (
      <div className="col-md-8">
        <h1> Case Summary </h1>

        <APIResponseModal {...{failurePromise}} promise={apiPromise} />

        {analystJSX}

        <p className= " small ">
          {opusCaseInfoText.uid ? <span>{opusCaseInfoText.uid}<br/></span> : null}
          {opusCaseInfoText.email ? <span>{opusCaseInfoText.email}<br/></span> : null}
          {opusCaseInfoText.caseId ? <span>{opusCaseInfoText.caseId}<br/></span> : null}
          {opusCaseInfoText.jobNumber ? <span>{opusCaseInfoText.jobNumber}<br/></span> : null}
          {opusCaseInfoText.hireDt ? <span>{opusCaseInfoText.hireDt}<br/></span> : null}
          {opusCaseInfoText.yearsAtCurrentRank ? <span>{opusCaseInfoText.yearsAtCurrentRank}<br/></span> : null}
          {opusCaseInfoText.yearsAtCurrentStep ? <span>{opusCaseInfoText.yearsAtCurrentStep}<br/></span> : null}
          {opusCaseInfoText.yearsOnTheClock ? <span>{opusCaseInfoText.yearsOnTheClock}<br/></span> : null}
          {opusCaseInfoText.timeOffTheClock ? <span>{opusCaseInfoText.timeOffTheClock}<br/></span> : null}
          {opusCaseInfoText.serviceAsProposedEffDt ?
            <span>{opusCaseInfoText.serviceAsProposedEffDt}<br/></span> : null}
        </p>

        <MultipleAppointmentsBlock apptDisplays={apptBlockData}/>

        {caseLocationModal}
        {proposedSection}
        {getWarningModal}

        <h2 className="hidden-print"> Case Location </h2>
        {trackingTable}

        <h2 className="breaker"> Final Decision </h2>

        <ShowIf show={shouldShowBoxURL}>
          <a href={boxURL} tabIndex="-1" target="_blank">View Case Materials in Box</a>
        </ShowIf>

        <FinalDecision {...props} {...{caseId, actionDataInfo, caseSummaryDataFromAPI}}/>

        <br /><br /><br />
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
