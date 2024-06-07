import React from "react";
import PropTypes from "prop-types";

//My imports
import * as util from "../../../opus-logic/common/helpers/";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {TextArea} from "../../common/components/forms/InputFields.jsx";
import ProfileLogic from "../../../opus-logic/cases/classes/profile/Profile";
import {FormShell, FormGroup, VisibleFormGroup} from "../../common/components/forms/FormRender.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {TextAreaFormElementWrapper} from "../../common/components/forms/FormElements.jsx";

/**
 *
 * @classdesc Class representing NewProfile Modal.
 * @extends React.Component
 *
 **/
export default class ProfileModal extends React.Component {
    static defaultProps = {
        title: "Edit Appointment",
        appointment: {},
        profileAPIData: {},
        onClickSave: () => {}
    };

    static propTypes = {
        onHide: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        show: PropTypes.bool,
        onClickSave: PropTypes.func.isRequired,
        appointment: PropTypes.object.isRequired,
        profileAPIData: PropTypes.object.isRequired
    }

    state = {
        editComments: "",
        show: this.props.show,
        isSaveButtonDisabled: false
    }

  /**
   *
   * @desc - Update field data on user action
   * @param {Object} props - props passed in
   * @return {void}
   *
   **/
    componentWillMount(props = this.props) {
        this.init(props);
    }

  /**
   *
   * @desc - If show variable is different reinitilaize this appointment
   * @param {Object} props - props passed in
   * @return {void}
   *
   **/
    componentWillReceiveProps({show, appointment}) {
    //Parent want to show this modal
        if(show && show !== this.props.show) {
      //If we are showing then reset the girlds
            this.init({appointment});
        }
    }

    Logic = new ProfileLogic(this.props);

  /**
   *
   * @desc - Every time it updates
   * @return {void}
   *
   **/
    componentDidUpdate() {
        setTimeout(() => util.initJQueryBootStrapToolTipandPopover(), 500);
    }

  /**
   *
   * @desc - Update field data on user action
   * @param {Object} appointment -
   * @return {void}
   *
   **/
    init({appointment} = {}) {
        let {fieldData} = this.Logic.getProfileFieldDataFromAppointment(appointment);
        let startingFieldData = util.cloneObject(fieldData);
        this.setState({startingFieldData});
        this.renderFormFields(fieldData);
    }

  onSearchClick = async (event) => {

    // let {fieldData} = this.state;
    let {name, value} = event.target;
    let {state: {fieldData}, props: {appointment}} = this;
    // let deptList = fieldData[name].options;
    // console.log(deptList);
    // let ahPathId = Object.keys(deptList).find(key => deptList[key] === value);
    // fieldData.academicHierarchyPathId = parseInt(ahPathId);
    // console.log(fieldData.academicHierarchyPathId);
    // Split by : and reverse array to check from the last element
    // let unitName = value.split(":").reverse();
    fieldData.departmentCode.value = value;
    name = "departmentCode";
    // fieldData[name].value = value;
    this.Logic.updateFieldDataOnChange(fieldData, name);
    this.renderFormFields(fieldData);

    // Need to set correct location visibility values on departmentCode toggle
    if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value==="Medicine" && fieldData.locationDisplayText2.visibility===false){
        fieldData.locationDisplayText1.isNumberDisabled = false;
        fieldData.locationDisplayText1.showAdd = true;
        fieldData.locationDisplayText1.showDelete = true;
        fieldData.locationDisplayText1.isDeleteDisabled = true;
        fieldData.locationDisplayText1.helpText = helpText;
        if(fieldData.locationDisplayText1.numberValue===null){
            fieldData.locationDisplayText1.isAddDisabled = true;
        }
    }else if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value!=="Medicine"){
        this.Logic.resetLocations(fieldData);
    }

    await this.Logic.updateFieldDataFromAPI(name, fieldData, appointment);
    fieldData.departmentCode.value = value;
    // fieldData.departmentSearch.value = null;
    this.Logic.validateFieldOnUpdate(fieldData[name]);
    this.renderFormFields(fieldData);

  }

  /**
   *
   * @desc - Update field data on user action
   * @param {Event} event - event from onChange
   * @return {void}
   *
   **/
    onChange = async (event) => {
        const fieldsToExclude = this.Logic.getExclusionFieldsForLocation();
        let {name, value} = event.target;
        let {state: {fieldData}, props: {appointment}} = this;
        let {helpText} = this.Logic
        console.log(value);
        if(fieldsToExclude.includes(name)){
          //Do not reload page
            event.preventDefault();
            this.Logic.handleLocationFields(name, value, fieldData);
        } else if (name === 'departmentSearch') {
          if(value.length>=3) {
            this.Logic.updateDeptSearchOnChange(fieldData, name, value);
            // this.renderFormFields(fieldData);
          }
        } else if (name === 'titleSearch') {
          if(value.length>=3) {
            this.Logic.updateTitleSearchOnChange(fieldData, name, value);
            // this.renderFormFields(fieldData);
          }
        }else{
          // Other non location based fields work normally
            fieldData[name].value = value;
            // If location 1 number input is disabled and user changes appointment percent time, update location 1 number input
            if(name==="appointmentPctTime" && fieldData.locationDisplayText1 && fieldData.locationDisplayText1.isNumberDisabled){
                fieldData.locationDisplayText1.numberValue = parseInt(value);
            }
        }

        this.Logic.updateFieldDataOnChange(fieldData, name);
        this.renderFormFields(fieldData);

        // Need to set correct location visibility values on departmentCode toggle
        if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value==="Medicine" && fieldData.locationDisplayText2.visibility===false){
            fieldData.locationDisplayText1.isNumberDisabled = false;
            fieldData.locationDisplayText1.showAdd = true;
            fieldData.locationDisplayText1.showDelete = true;
            fieldData.locationDisplayText1.isDeleteDisabled = true;
            fieldData.locationDisplayText1.helpText = helpText;
            if(fieldData.locationDisplayText1.numberValue===null){
                fieldData.locationDisplayText1.isAddDisabled = true;
            }
        }else if(name==="departmentCode" && fieldData.schoolName && fieldData.schoolName.value!=="Medicine"){
            this.Logic.resetLocations(fieldData);
        }

        await this.Logic.updateFieldDataFromAPI(name, fieldData, appointment);

        this.Logic.validateFieldOnUpdate(fieldData[name]);
        this.renderFormFields(fieldData);

    }

  /**
   *
   * @desc - Update field data onBlur
   * @param {Event} event - event from onChange
   * @return {void}
   *
   **/
    onBlur = () => {
        let {name} = event.target;
        this.Logic.validateFieldOnBlur(this.state.fieldData[name]);

        this.renderFormFields(this.state.fieldData);
    }

  /**
   *
   * @desc - resets formfields in state to original
   * @return {void}
   *
   **/
    resetFormFields() {
        let fieldData = util.cloneObject(this.state.startingFieldData);
        this.renderFormFields(fieldData);
    }

  /**
   *
   * @desc - Maintain comments in this modal
   * @param {Event} evt - event from onChange
   * @return {void}
   *
   **/
    onChangeCommentField = (evt) => {
        this.setState({editComments: evt.target.value});
    }

  /**
   *
   * @desc - Wipes out edit modal comments
   * @return {void}
   *
   **/
    resetEditModalEditComments() {
        this.setState({editComments: ""});
    }

  /**
   *
   * @desc - Create and set fieldData used for this modal
   * @param {Event} event - event from onChange
   * @return {void}
   *
   **/
    createNewAppointmentFieldData({appointment} = this.props) {
        let {fieldData} = this.Logic.getProfileFieldDataFromAppointment(appointment);

        this.setState({fieldData});
    }

  /**
  * @desc - Renders form fields in modal usually after value change
  * @param {Object} fieldData - current FieldData to turn to form fields
  * @param {Object} additionalState -
  * @return {void}
  *
  **/
    renderFormFields(fieldData = this.state.fieldData, additionalState = {}) {
        let {main, salary, appointment: apptFieldData} =
      this.Logic.getFieldDataBySection(fieldData);

        this.setState({fieldData, mainFields: main, salaryFields: salary,
      appointmentFields: apptFieldData, ...additionalState
    });
    }

  /**
   *
   * @desc - Erase error message and then conduct on hide
   * @param {Array} comments - array of comments from API
   * @return {JSX} - jsx
   *
   **/
    onHide = () => {
        this.setState({errorMessage: "", editComments: ""});
        this.props.onHide();
    }

  /**
   *
   * @desc - Edit Modal for Profile
   * @param {Array} comments - array of comments from API
   * @return {JSX} - jsx
   *
   **/
    getEditCaseModal() {
        let {state: {mainFields, salaryFields, appointmentFields,
      editComments, errorMessage}, onChangeCommentField} = this;
        let {onChange, onSearchClick, onBlur, props: {show, title}} = this;
        let {profileAPIData: {appointeeInfo: {uid, fullName}}} = this.props;
        let hasSalaryFields = !!Object.keys(salaryFields).length;
        let hasApptFields = !!Object.keys(appointmentFields).length;

        return (
      <Modal className=" modal-lg " {...{show}} onHide={this.onHide}
        backdrop="static">
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title"> {title} </h1>
        </Header>
        <Body>
          <h2>{fullName}</h2>
          <ShowIf show={uid}>
            <p>{`UID: ${uid}`}</p>
          </ShowIf>
          <FormShell>
            <VisibleFormGroup fields={mainFields} {...{onChange, onSearchClick, onBlur}} />

            <ShowIf show={hasSalaryFields}>
              <div>
                <h2> Salary Details </h2>
                <VisibleFormGroup fields={salaryFields} {...{onChange, onBlur}} />
              </div>
            </ShowIf>

            <ShowIf show={hasApptFields}>
              <div>
                <h2> Appointment Details </h2>
                <VisibleFormGroup fields={appointmentFields} {...{onChange, onBlur}} />
              </div>
            </ShowIf>

            <h2> Comments </h2>
            <p> Please explain why there are changes to this appointment.
              (Max 250 characters)
            </p>
            <TextAreaFormElementWrapper>
              <TextArea onChange={onChangeCommentField} value={editComments} />
            </TextAreaFormElementWrapper>

            <ShowIf show={errorMessage}>
              <p className="error_message">
                {errorMessage}
              </p>
            </ShowIf>
          </FormShell>
        </Body>
        <Footer>
          <button disabled={this.state.isSaveButtonDisabled}
            className="left btn btn-primary" onClick={this.validateProfile}>
            Save
          </button>
          <Dismiss onClick={this.onHide} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }

  /**
   *
   * @desc - Performs comment checks and field data validations
   * @return {void}
   *
   **/
    validateProfile = async () => {
        let {state: {fieldData, editComments}} = this;
        this.Logic.validateAllFieldDataOnSave(fieldData);

    //Do we have invalid comments? Check
        let commentIsValid = this.Logic.isCommentValid(editComments, fieldData);

    //Is appointment status change valid? Check
        this.Logic.isAppointmentStatusChangeValid(this.state.startingFieldData, fieldData);

    // Jira #3025 Extra condition to make sure location isn't blank
    // Updated: 9/2022
        this.Logic.locationValidation(fieldData);

    // Jira #3049 Added blank option in constants file and validation here for scaleTypeId
        this.Logic.scaleTypeValidation(fieldData);

    // ** Create all fieldData validations before this **
    // Do we have any field data errors?
        let fieldValuesHaveErrors = this.Logic.doFieldsHaveErrors(fieldData);

    //Valid fields & comment so save the data
        if(commentIsValid && !fieldValuesHaveErrors) {
      //Dont want them saving multiple times
      //this.setState({showEditModal: false});
            this.props.onClickSave(fieldData, editComments);
            this.resetEditModalEditComments();
        }

    //Get error message if there is one
        let errorMessage = this.Logic.getErrorMessage(fieldValuesHaveErrors,
      commentIsValid);

    //Rerender form fields so error messages show
        this.setState({errorMessage});

    //Rerender so we either show or get rid of form field error messages
        this.renderFormFields(fieldData);
    }

  /**
   *
   * @desc - Renders jsx
   * @return {void}
   *
   **/
    render() {
        return this.getEditCaseModal();
    }
}
