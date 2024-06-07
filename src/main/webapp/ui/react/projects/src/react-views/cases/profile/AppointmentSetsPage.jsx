import React from 'react';
import PropTypes from 'prop-types';
import {Table, Button} from 'react-bootstrap';

//My imports
import * as util from '../../../opus-logic/common/helpers/';
import {ToolTip, ToolTipWrapper} from '../../common/components/elements/ToolTip.jsx';
import {ShowIf, HideIf} from '../../common/components/elements/DisplayIf.jsx';
import {descriptions} from '../../../opus-logic/common/constants/Descriptions';
import AppointmentSets from '../../../opus-logic/cases/classes/profile/AppointmentSets';
import ToggleView from '../../common/components/elements/ToggleView.jsx';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import {FormShell} from '../../common/components/forms/FormRender.jsx';
import {FormSelect} from '../../common/components/forms/FormElements.jsx';
import {EditIcon, DeleteIcon, CommentIcon} from '../../common/components/elements/Icon.jsx';

/**
*
* ProfilePage is the page next to the sidebar that holds the table & modals
* @author - Moses Jung
* @class ProfilePage
* @extends React.Component
*
**/
export default class AppointmentSetsPage extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
  static propTypes = {

  }

  static defaultProps = {

  }

  /**
  *
  *
  **/
  state = {
    hasActiveSet: false,
    activeSetDisplays: [],
    appointmentActiveSetId: '',
    hasDeletedSet: false,
    deletedSetDisplays: [],
    hasHistorySet: false,
    historySetDisplays: [],
    appointmentHistorySetId: '',
    showCrudModal: false,
    showWarningModal: false,
    canEditDeleteAppointmentSets: false,
    crudAction: null,
    categoryOptions: [],
    addNewAppointmentDropdownOptions: [],
    initialActiveSetDisplays: []
  };

  /**
  *
  * @desc - Class variables
  * @return {void}
  *
  **/
  componentWillMount() {
    this.initProfile();
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
  * @desc - Class variables
  *
  **/
  Logic = new AppointmentSets(this.props);


  /**
   *
   * @desc - guess
   * @return {void}
   *
   **/
  initProfile = async () => {
    let {id: opusPersonId} = util.getUrlArgs();
    if(opusPersonId) {
      this.setState({opusPersonId});
      this.loadPage();
      this.crudPermissions();
    }
  }

  /**
   *
   * @desc - Load page and reload page
   * @return {void}
   *
   **/
  loadPage = async() => {
    let results = await this.Logic.getAppointmentSetData(this.props.opusPersonId, this.props.access_token);
    let appointmentSetId = null;
    if(results.active){
      this.getDisplayData(results.active, 'initial');
      this.getDisplayData(results.active, 'active');
      if(results.active.length>0){
        appointmentSetId = results.active[0].appointmentSetId;
        this.setState({hasActiveSet: true, appointmentActiveSetId: appointmentSetId});
      }
    }
    if(results.history){
      this.getDisplayData(results.history, 'history');
      if(results.history.length>0 && results.active && results.active.length>0){
        this.setState({hasHistory: true});
      }else{
        this.setState({hasHistory: false});
      }
    }
    if(results.deleted){
      this.getDisplayData(results.deleted, 'deleted');
      if(results.deleted.length>0){
        let deletedApptSetIds = [];
        for(let each of results.deleted){
          if(!deletedApptSetIds.includes(each.appointmentSetId)){
            deletedApptSetIds.push(each.appointmentSetId)
          }
        }
        this.setState({hasDeletedSets: true});
      }
    }
    this.setState({active: results.active, deleted: results.deleted, history: results.history})

    let dropdownOptionsResults = await this.Logic.getAppointmentSetDropdownOptionsFromAPI(
      this.props.opusPersonId, this.props.access_token);
    if(dropdownOptionsResults.length>0){
      // Add appointment set id to dropdown results
      for(let index in dropdownOptionsResults){
        dropdownOptionsResults[index].appointmentSetId = appointmentSetId;
      }
      this.getDisplayData(dropdownOptionsResults, 'addNewDropdownOptions')
    }

    // Configure category dropdown list from global affiliation list
    let {affiliationTypeList} = this.props.globalData;
    let categoryOptions = this.Logic.getCategoryDropdownList(affiliationTypeList);
    this.setState({categoryOptions})
  }

  crudPermissions(){
    let canEditDeleteAppointmentSets = this.Logic.canEditDeleteAppointmentSets();
    this.setState({canEditDeleteAppointmentSets})
  }

  /**
  *
  * @desc - Title Text
  * @param {Object} appointeeInfo - uid and hire date
  * @return {JSX} - JSX for title
  *
  **/
  getTitleText() {

    return (
      <div className=" col-md-8 ">
        <h2>Appointment Sets</h2>
        <p>
          Sets allow individual cases to apply to multiple appointments. Use this page to work with existing
          appointments and/or sets.  To put a new appointment in a set, create a Joint or Split Appointment case instead.
        </p>
      </div>
    );
  }


   /**
   *
   * @desc - point to the correct state
   * @param {Array} appointments - array of appointment data
   * @param {String} typeOfReq - string that determines what state to save in at the end
   *
   **/
   getDisplayData(appointments, typeOfData) {
     if(typeOfData==='initial'){
       this.setState({initialActiveSetDisplays: appointments})
     }else if(typeOfData==='active'){
       this.setState({activeSetDisplays: appointments})
     }else if(typeOfData==='history'){
       this.setState({historySetDisplays: appointments})
     }else if(typeOfData==='deleted'){
       this.sortDeletedSetsBySetId(appointments)
     }else if(typeOfData==='addNewDropdownOptions'){
       this.setState({addNewAppointmentDropdownOptions: appointments})
     }
   }

  /*****************************************************************************
   *
   * @name Create a New Set
   * @desc - Section for creating a new appointment set
   *
   *****************************************************************************/

  /**
  *
  * @desc - Create a new set component
  * @return {JSX} - JSX for create a new set
  *
  **/
  getCreateSetComponent() {
    let {initialActiveSetDisplays, addNewAppointmentDropdownOptions} = this.state;
    return (
      <ShowIf show={this.state.canEditDeleteAppointmentSets}>
      <div className=" col-md-8 ">
        <h3>Create a New Set</h3>
        <p>
          If this appointee does <b>not</b> have an active set, but <b>does </b>
          have active appointments, you can combine two or more of their existing
          appointments to create a new set.
        </p>
        <button className='btn btn-primary'
          onClick={() => this.showCrudModal('create')}
          disabled={initialActiveSetDisplays.length>0 || addNewAppointmentDropdownOptions.length<2}>
          Create a New Set
        </button>
      </div>
      </ShowIf>
    );
  }

  /**
  *
  * @desc - actual save function
  * @param {Array} appointmentSetToSave - Array of appointments to save
  * @return {void}
  *
  **/
  saveAppointmentSet = async (appointmentSetToSave) => {
     let apiPromise = this.Logic.saveAppointmentSet(appointmentSetToSave,
       this.props.access_token, this.props.adminData.adminName);

     //Catch the promise so execution is not stopped if it has failed
     try {
       await apiPromise;
     } catch(e) {
      console.log("ERROR: api call in 'saveAppointmentSet' in AppointmentSetsPage.jsx")
       console.log(e);
     }

     this.setState({apiPromise});
     this.hideCrudModal();
  }

  /*****************************************************************************
   *
   * @name Active Set
   * @desc - Section for displaying active appointment sets
   *
   *****************************************************************************/

   /**
   *
   * @desc - active set component
   * @return {JSX} - JSX for active sets
   *
   **/
   getActiveSetComponent() {
     let {initialActiveSetDisplays, appointmentActiveSetId} = this.state;
     return (
       <ShowIf show={this.state.hasActiveSet && initialActiveSetDisplays.length>0}>
         <div className=" col-md-8 ">
           <h3>Active Set</h3>
           <p>
             Appointments in an active set can be selected as a group when starting a case.
             <ToolTip text={descriptions.activeSet}/>
           </p>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>
                  <ShowIf show={this.state.canEditDeleteAppointmentSets}>
                    <DeleteIcon onClick={() => this.showWarningModal('deleteIcon')}/>
                  </ShowIf>
                  <ShowIf show={this.state.canEditDeleteAppointmentSets}>
                    <EditIcon onClick={() => this.showCrudModal('edit')}/>
                  </ShowIf>
                  <h2 className="table-heading black">
                    Appointment Set {appointmentActiveSetId}
                  </h2>
                </th>
              </tr>
            </thead>
            {initialActiveSetDisplays.map((appointment, index) =>
              this.getAppointmentSetsDisplayBlock(appointment, index, 'active')
            )}
          </Table>
        </div>
       </ShowIf>
     );
   }

   startDelete = () => {
     let activeSetDisplays = this.state.activeSetDisplays;
     if(this.state.clickLocation==='deleteIcon'){
       for(let index in activeSetDisplays){
         activeSetDisplays[index].typeOfReq = 'delete';
       }
       this.updateAppointmentSet(activeSetDisplays);
     }else{
       this.startSave(activeSetDisplays);
     }
   }

 /*****************************************************************************
  *
  * @name Crud Modal
  * @desc - All add new appointment set and edit appointment set modal views and functions
  *
  *****************************************************************************/

   /**
    *
    * @desc - Show edit modal and api call add new appointments dropdown options
    * @return {void}
    *
    **/
   showCrudModal = async (typeOfAction) => {
     this.setState({showCrudModal: true});
     // Default is 'edit'
     let crudAction = 'edit'
     let crudHeaderText = 'Edit '
     // If the modal action is 'create'
     if(typeOfAction==='create'){
       crudAction = 'create';
       crudHeaderText = 'Create a New ';
     }
     this.setState({crudAction, crudHeaderText});

   }

   /**
    *
    * @desc - Erase error message and then conduct on hide
    * Also reverts any changes back to original
    *
    **/
   hideCrudModal = () => {
     this.setState({showCrudModal: false, notEnoughAppointmentsDisplay: null,
      crudAction: null, addNewAppointmentDropdownOptions: [], showWarningModal: false});
     this.loadPage();
   }

   /**
   *
   * @desc - Get appointment sets edit modal
   * @return {JSX} - JSX for edit modal
   *
   **/
   getCrudModal() {
     let {activeSetDisplays, newAppointmentsAddedDisplay, appointmentActiveSetId,
       addNewAppointmentDropdownOptions, notEnoughAppointmentsDisplay, crudAction,
       crudHeaderText} = this.state;

     return (
       <Modal backdrop="static" show={this.state.showCrudModal} onHide={this.hideCrudModal}>
         <Header className=" modal-info " closeButton>
          <h1 className="modal-title">{crudHeaderText} Appointment Set</h1>
         </Header>
         <Body>
          <div>
            <ShowIf show={crudAction==='edit'}>
              <span>
                <h1 className="modal-title">Set {this.state.appointmentActiveSetId}</h1>
                <p>
                  Remove or edit appointments in this set, or add other appointments to it.
                  <ToolTip text={descriptions.appointmentSetCrudModal}/>
                </p>
              </span>
            </ShowIf>
            <ShowIf show={crudAction==='create'}>
              <p>Add multiple appointments to create a new set.</p>
            </ShowIf>
            {activeSetDisplays.map((appointment, index) =>
              this.getModalAppointmentDisplayBlock(index)
            )}
            <span className="dropdown">
              <button className="btn btn-sm btn-gray table-top dropdown-toggle"
                type="button" data-toggle="dropdown" disabled={addNewAppointmentDropdownOptions.length===0}>
                Add Appointment &nbsp;&nbsp;
                <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                {addNewAppointmentDropdownOptions.map((appointment, index) =>
                  (<li key={index.toString()+appointment.appointmentId} onClick={()=>this.toggleAppointment(appointment, 'add')}>
                    <a>
                      {appointment.titleInformation.series+', '+appointment.academicHierarchyInfo.departmentName}
                    <br/>
                      <span className="text-smaller">Appointment ID: {appointment.appointmentId}</span>
                    </a>
                  </li>)
                  )
                }
              </ul>
            </span>
            <ShowIf show={addNewAppointmentDropdownOptions.length===0}>
              <div>There are no eligible appointments for addition.</div>
            </ShowIf>
            <ShowIf show={notEnoughAppointmentsDisplay}>
              <div className="error_message">{notEnoughAppointmentsDisplay}</div>
            </ShowIf>
          </div>
         </Body>
         <Footer>
           <button disabled={crudAction==='create' && activeSetDisplays.length<2} className="left btn btn-primary"
            onClick={() => this.validateAppointmentsBeforeSave()}>
             Save
           </button>
           <Dismiss onClick={this.hideCrudModal} className="left btn btn-link">
             Cancel
           </Dismiss>
         </Footer>
       </Modal>
     )
   }

   /**
   *
   * @desc - edit modal appointment display block
   * @return {JSX} - JSX for edit modal's appointment display block
   *
   **/
   getModalAppointmentDisplayBlock(index) {
     let appointment = this.state.activeSetDisplays[index];
     let {categoryOptions} = this.state;

     return (
       <Table bordered responsive key={index.toString()+appointment.appointmentId} className='table-borderless'>

          <thead>
            <tr>
              <th>
                <span className='col-md-12'>
                  <b>{appointment.titleInformation.series+', '+appointment.academicHierarchyInfo.departmentName}</b>
                  <button className='close x-smaller' onClick={() =>
                  this.toggleAppointment(appointment, 'delete')}>
                  x
                  </button>
                 </span>
               </th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>
               <span className='col-md-4'>
                 Appointment ID
               </span>
               <span className='col-md-8'>
                 {appointment.appointmentId}
               </span>
             </td>
           </tr>
           <tr>
             <td>
               <span className='col-md-4'>
                 Affiliation <ToolTip text={descriptions.affiliation}/>
               </span>
               <span className='col-md-8'>
                 {appointment.affiliationType.affiliation}
               </span>
             </td>
           </tr>
           <tr>
             <td>
             <FormShell>
               <FormSelect includeBlankOption={true} valueIsText
               displayName={'Affiliation Status '}
               descriptionText={descriptions.appointmentSetCrudModalCategory}
               hasError={appointment.categoryError ? true : false}
               error={appointment.categoryError}
               options={categoryOptions}
               onChange={(e) => this.changeSelection(e.target.value, index)}
               value={appointment.affiliationType.appointmentCategoryId ?
                 appointment.affiliationType.appointmentCategoryId : ''} />
              </FormShell>
             </td>
           </tr>

        </tbody>
       </Table>
     );
   }

   // /**
   // *
   // * @desc - using category dropdown state, find if appointment category is the same as affiliation
   // * @param {Object} appointment - appointment to check
   // * @return {Boolean} sameCategory - bool value if appointment category is the same as affiliation
   // *
   // **/
   // isCategorySameAsAffiliation = (appointment) => {
   //   let categoryOptions = this.state.categoryOptions;
   //   let sameCategory = false;
   //   let affiliationCategory = appointment.affiliationType.affiliation.split('-');
   //   for(let each in categoryOptions){
   //     if(affiliationCategory.length>1){
   //       // This condition is for checking 'Additional-Joint' and 'Additional-Split' affiliations
   //       if(affiliationCategory[1]===categoryOptions[each][appointment.affiliationType.appointmentCategoryId]){
   //         sameCategory = true;
   //         break;
   //       }
   //     }else if(affiliationCategory[0]===categoryOptions[each][appointment.affiliationType.appointmentCategoryId]){
   //       // This condition is for checking 'Primary' and 'Additional' affiliations
   //       sameCategory = true;
   //       break;
   //     }
   //   }
   //   return sameCategory;
   // }

   /**
   *
   * @desc - toggles appointments between active set and add new appointment dropdown options
   * @param {Object} appointment - appointment to check
   * @param {String} typeOfReq - add or delete request type
   * @return {void}
   *
   **/
   toggleAppointment = (appointment, typeOfReq) => {
     let crudAction = this.state.crudAction;
       // By default apply 'add' conditions
      let stateToRemoveAppointmentFrom= this.state.addNewAppointmentDropdownOptions;
      let stateToAddAppointmentInto = this.state.activeSetDisplays;
      if(typeOfReq==='delete'){
        // Delete conditions
        stateToRemoveAppointmentFrom= this.state.activeSetDisplays;
        stateToAddAppointmentInto = this.state.addNewAppointmentDropdownOptions;
      }
      if(crudAction==='edit'){
        // Edit an appointment set functionality for toggling
       if(typeOfReq==='delete'){
         // Checks if originally in set:
         if(appointment.wasOriginallyInSet==='Y'){
            appointment.typeOfReq = typeOfReq;
         }else{
            appointment.typeOfReq = null;
         }
       }else{
         // Edit conditions:
         // let isCategorySameAsAffiliation = this.isCategorySameAsAffiliation(appointment);
         // Checks if originally in set and if category is the same as affiliation:
         if(appointment.wasOriginallyInSet==='Y'
           // && isCategorySameAsAffiliation){
         //   appointment.typeOfReq = null;
         // }else if(appointment.wasOriginallyInSet==='Y'
         //   && !isCategorySameAsAffiliation
         ){
           appointment.typeOfReq = 'edit';
         }else{
           appointment.typeOfReq = 'add';
         }
       }
     }else{
       // Create a new appointment set functionality
       if(typeOfReq==='add'){
         appointment.typeOfReq = 'add';
       }else{
         appointment.typeOfReq = null;
       }
     }
     console.log('Appt '+appointment.appointmentId+' action being saved: '+appointment.typeOfReq)
     // Loop and find index of appointment, add/remove from correct state
     let index = 0;
     for(let each in stateToRemoveAppointmentFrom){
       if(stateToRemoveAppointmentFrom[each].appointmentId===appointment.appointmentId){
         index = each;
         break;
       }
     }
     stateToRemoveAppointmentFrom.splice(index, 1);
     stateToAddAppointmentInto.push(appointment);
     // Determine which state to save depending on add/delete action
     if(typeOfReq==='delete'){
       this.setState({activeSetDisplays: stateToRemoveAppointmentFrom})
       this.setState({addNewAppointmentDropdownOptions: stateToAddAppointmentInto})
     }else{
       this.setState({activeSetDisplays: stateToAddAppointmentInto})
       this.setState({addNewAppointmentDropdownOptions: stateToRemoveAppointmentFrom})
     }
     //code before the pause
      setTimeout(function(){
        util.initJQueryBootStrapToolTipandPopover();
      }, 500);
   }

   /**
   *
   * @desc - changes category values on selection
   * @param {String} value - value of appointment category Id
   * @param {Integer} index - index of appointment in appointment set
   * @return {void}
   *
   **/
   changeSelection = (value, index) => {
     let activeSetDisplays = this.state.activeSetDisplays;
     activeSetDisplays[index].affiliationType.appointmentCategoryId = parseInt(value,10);
     let crudAction = this.state.crudAction;
     if(crudAction==='edit'){
       // let isCategorySameAsAffiliation = this.isCategorySameAsAffiliation(activeSetDisplays[index]);
       if(
         // !isCategorySameAsAffiliation &&
         activeSetDisplays[index].typeOfReq!=='add'){
         activeSetDisplays[index].typeOfReq = 'edit';
       // }else if(isCategorySameAsAffiliation){
       //    activeSetDisplays[index].typeOfReq = null;
       }
     }
     console.log('Appt '+activeSetDisplays[index].appointmentId+' action being saved: '+activeSetDisplays[index].typeOfReq)
     this.setState({activeSetDisplays})
   }

   /**
   *
   * @desc - validates if each appointment has a category and at least 2 appointments in it
   * @return {void}
   *
   **/
   validateAppointmentsBeforeSave = () => {
     let activeSetDisplays = this.state.activeSetDisplays;
     let doesEachAppointmentHaveCategory = true;
     // Loop through and see if there is category for each appointment
     for(let each in activeSetDisplays){
       if(!activeSetDisplays[each].affiliationType.appointmentCategoryId){
         activeSetDisplays[each].categoryError = descriptions.categoryError;
         doesEachAppointmentHaveCategory = false;
       }else if(activeSetDisplays[each].affiliationType.appointmentCategoryId && activeSetDisplays[each].categoryError){
         delete activeSetDisplays[each].categoryError;
       }
     }
     let notEnoughAppointmentsDisplay = null;
     if(doesEachAppointmentHaveCategory && activeSetDisplays.length>=2){
       // Save if meets all conditions
       this.startSave(activeSetDisplays)
     }else if(activeSetDisplays.length===1){
       // Only one appointment left in set
       notEnoughAppointmentsDisplay = descriptions.notEnoughAppointmentsDisplay;
       this.setState({activeSetDisplays, notEnoughAppointmentsDisplay})
     }else if(activeSetDisplays.length===0){
       // Delete appointment set
       if(this.state.crudAction==='edit'){
         this.showWarningModal('editModal');
       }else{
         // Coming from create a new appt set so close crud modal
         this.hideCrudModal();
       }
     }else{
       // Validation errors etc
       this.setState({activeSetDisplays})
     }
     this.setState({notEnoughAppointmentsDisplay})
   }

   /**
   *
   * @desc - find the correct appointments to send to backend
   * @param {Array} activeSetDisplays - Array of active appointment set
   * @return {appointmentSetToSave}
   *
   **/
   startSave = (activeSetDisplays) => {
     let appointmentSetToSave = [];
     let dropdown = this.state.addNewAppointmentDropdownOptions;
     let originalSet = this.state.initialActiveSetDisplays;
     let allAppointments = activeSetDisplays.concat(dropdown);
     // Loop through all appointments available and push if typeOfReq is not null
     for(let each of allAppointments){
       if(each.typeOfReq!==null){
         appointmentSetToSave.push(each)
       }
     }
     if(this.state.crudAction==='edit'){
       this.updateAppointmentSet(appointmentSetToSave);
     }else if(this.state.crudAction==='create'){
       this.saveAppointmentSet(appointmentSetToSave);
     }
   }

   /**
   *
   * @desc - actual save function
   * @param {Array} appointmentSetToSave - Array of appointments to save
   * @return {void}
   *
   **/
   updateAppointmentSet = async (appointmentSetToSave) => {
     // Only hit update api if there are something to save
     if(appointmentSetToSave.length>0){
        let apiPromise = this.Logic.updateAppointmentSet(appointmentSetToSave,
          this.props.access_token, this.props.adminData.adminName);

        //Catch the promise so execution is not stopped if it has failed
        try {
          await apiPromise;
        } catch(e) {
          console.log("ERROR: api call in 'updateAppointmentSet' in AppointmentSetsPage.jsx")
          console.log(e);
        }
        this.setState({apiPromise});
      }
      this.hideCrudModal();
   }

   /*****************************************************************************
    *
    * @name History
    * @desc - Section for showing history of appointment sets
    *
    *****************************************************************************/

    /**
    *
    * @desc - history component
    * @return {JSX} - JSX for history
    *
    **/
    getHistoryComponent() {
      let {historySetDisplays} = this.state;

      return (
        <ShowIf show={this.state.hasHistory}>
          <div className=" col-md-8 ">
            <ToggleView contentClassName=" col-md-offset-1 "
              showText="Show History" hideText="Hide History">
              <Table bordered responsive>
                {historySetDisplays.map((appointment, index) =>
                  this.getAppointmentSetsDisplayBlock(appointment, index, 'history')
                )}
              </Table>
            </ToggleView>
           </div>
         </ShowIf>
      );
    }

    /*****************************************************************************
     *
     * @name Deleted Set
     * @desc - Section for Deleting an appointment set
     *
     *****************************************************************************/

     sortDeletedSetsBySetId(appointments){
       let deletedSetsArray = [];
       for(let each of appointments){
         let apptObject = {
           setId: each.appointmentSetId,
           appointmentSet: [each]
         }
         let foundSet = false;
         for(let deletedSetArrayEach of deletedSetsArray){
           if(deletedSetArrayEach.setId===each.appointmentSetId){
             deletedSetArrayEach.appointmentSet.push(each);
             foundSet = true;
           }
         }
         if(!foundSet){
           deletedSetsArray.push(apptObject)
         }
       }
      this.setState({deletedSetDisplays: deletedSetsArray})
     }

     /**
     *
     * @desc - delete set component
     * @return {JSX} - JSX for deleted sets
     *
     **/
     getDeletedSetsComponent() {
       let {deletedSetDisplays} = this.state;

       return (
         <ShowIf show={this.state.hasDeletedSets}>
           <div className=" col-md-8 ">
             <h3>Deleted Sets</h3>
             <p>Sets are deleted when they no longer combine multiple appointments.</p>
             {deletedSetDisplays.map((deletedSet, index) =>
               <Table bordered responsive key={index}>
                 <thead>
                   <tr>
                     <th>
                      <h2 className="table-heading black">Appointment Set {deletedSet.setId}</h2>
                     </th>
                   </tr>
                 </thead>
                 {deletedSet.appointmentSet.map((appointment, index) =>
                   this.getAppointmentSetsDisplayBlock(appointment, index, 'deleted')
                 )}
               </Table>
              )}
            </div>
          </ShowIf>
       );
     }

     /*****************************************************************************
      *
      * @name AppointmentSetsDisplayBlock
      * @desc - Section for displaying appointment sets data
      *
      *****************************************************************************/

      /**
      *
      * @desc - appointment sets display block
      * @return {JSX} - JSX for displaying appointment sets data
      *
      **/
      getAppointmentSetsDisplayBlock(appointment, index, typeOfAppointmentSet) {

        return (
          <tbody key={index.toString()+appointment.appointmentId+typeOfAppointmentSet}>

            <tr>
              <th>
                {appointment.titleInformation.series+', '+appointment.academicHierarchyInfo.departmentName}
              </th>
            </tr>

            <tr>
              <td>
                <span className='col-md-6'>
                  Appointment ID
                </span>
                <span className='col-md-6'>
                  {appointment.appointmentId}
                </span>
              </td>
            </tr>

            <ShowIf show={typeOfAppointmentSet==='deleted'}>
              <tr>
                <td>
                  <span className='col-md-6'>
                    Appointment Set ID
                  </span>
                  <span className='col-md-6'>
                    {appointment.appointmentSetId}
                  </span>
                </td>
              </tr>
            </ShowIf>

            <tr>
              <td>
                <span className='col-md-6'>
                  Affiliation <ToolTip text={descriptions.affiliation}/>
                </span>
                <span className='col-md-6'>
                  {appointment.affiliationType.affiliation}
                </span>
              </td>
            </tr>

            <tr>
              <td>
                <span className='col-md-6'>
                  Affiliation Status <ToolTip text={descriptions.appointmentSetCrudModalCategory}/>
                </span>
                <span className='col-md-6'>
                  {appointment.affiliationType.appointmentCategory}
                </span>
              </td>
            </tr>

            <tr>
              <td>
                <span className='col-md-6'>
                  Date Added to Set
                </span>
                <span className='col-md-6'>
                  {appointment.appointmentAddedToSetDt}
                </span>
              </td>
            </tr>

            <ShowIf show={typeOfAppointmentSet!=='active'}>
              <tr>
                <td>
                  <span className='col-md-6'>
                    Date Removed From Set
                  </span>
                  <span className='col-md-6'>
                    {appointment.appointmentRemovedFromSetDt}
                  </span>
                </td>
              </tr>
            </ShowIf>

          </tbody>
        );
      }

      /*****************************************************************************
       *
       * @name Warning Modal
       * @desc - Section for displaying warning modal
       *
       *****************************************************************************/

       /**
        *
        * @desc - Show warning modal
        * @return {void}
        *
        **/
       showWarningModal = (clickLocation) => {
         this.setState({showCrudModal: false, showWarningModal: true, clickLocation});
       }

       /**
        *
        * @desc - Hides warning modal
        *
        **/
       hideWarningModal = () => {
         this.setState({showWarningModal: false});
         this.loadPage();
       }

      /**
       *
       * @desc - Warning modal
       * @return {JSX} - jsx
       *
       **/
      getWarningModal() {
        let {clickLocation} = this.state;
        return (
          <Modal backdrop="static" onHide={this.hideWarningModal}
            show={this.state.showWarningModal}>
            <Header className=" modal-warning " closeButton>
              <Title> <h1 className="modal-title" > Warning </h1> </Title>
            </Header>
            <Body>
              <ShowIf show={clickLocation==='deleteIcon'}>
                <p>Each appointment currently in the set will be removed, and the set will be deleted.
                You cannot undo this.</p>
              </ShowIf>
              <ShowIf show={clickLocation==='editModal'}>
                <p>You have removed all appointments from the set, so the set will be deactivated.
                Click OK to proceed, or cancel to discard your changes.</p>
              </ShowIf>
            </Body>
            <Footer>
              <Button bsStyle="warning" className="left white"
                onClick={this.startDelete}>
                OK
              </Button>
              <Dismiss onClick={this.hideWarningModal}
                className="left btn btn-link">
                Cancel
              </Dismiss>
            </Footer>
          </Modal>
        );
      }

  /**
  *
  * @desc - The page
  * @return {JSX} - JSX for title
  *
  **/
  render() {


    return(
      <div>
        {this.getTitleText()}
        {this.getCreateSetComponent()}
        {this.getActiveSetComponent()}
        {this.getHistoryComponent()}
        {this.getDeletedSetsComponent()}

        {this.getCrudModal()}
        {this.getWarningModal()}
        <APIResponseModal promise={this.state.apiPromise}
          successMessage={descriptions.appointmentSetSaveSuccessMessage} />

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
