import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment";

//My imports
import * as util from "../../opus-logic/common/helpers";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../common/components/bootstrap/ReactBootstrapModal.jsx";
import {ShowIf} from "../common/components/elements/DisplayIf.jsx";
import {FormInput, FormTextArea, FormSelect, FormDate} from
    "../common/components/forms/FormElements.jsx";
import { descriptions } from "../../opus-logic/common/constants/Descriptions.js";
import {ToolTip} from "../common/components/elements/ToolTip.jsx";


/******************************************************************************
 *
 * @desc - Add or Edit Endowed Chair Modal
 *
 ******************************************************************************/
export default class EndowedChairHoldersModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {

    }

    static defaultProps = {
        showModal: false
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
        modalData: {},
        modalComments: {},
        errorData: {},
        modalDropdownOptions: {},
        showConfirmationModal: false,
        isFieldDisabled: false,
        isRankDisabled: false
    };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
    componentWillReceiveProps(props) {
        if(props.showModal!==this.state.showModal){
            this.setState({showModal: props.showModal})
        }
        if(props.modalData!==this.state.modalData){
            this.setState({modalData: props.modalData})
        }
        if(props.isFieldDisabled!==this.state.isFieldDisabled){
            this.setState({isFieldDisabled: props.isFieldDisabled})
        }
        if(props.isRankDisabled!==this.state.isRankDisabled){
            this.setState({isRankDisabled: props.isRankDisabled})
        }
        let modalDropdownOptions = {
            chairApptStatus: [],
            seriesList: [],
            rankList: []
        };

        modalDropdownOptions.chairApptStatus = props.Logic.dataTableConfiguration.chairApptStatusOptions;
        modalDropdownOptions.seriesList = props.Logic.dataTableConfiguration.seriesOptions;
        modalDropdownOptions.rankList = props.Logic.dataTableConfiguration.rankOptions;
        this.setState({modalDropdownOptions});
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


    /******************************************************************************
     *
     * @desc - Save function
     *
     ******************************************************************************/
    saveECHData = async () => {
        this.setState({isSaveButtonDisabled: true});
        let {modalData, modalDropdownOptions, modalComments} = this.state;
        let errorData = this.validateData(modalData);
        if(!errorData.hasErrors){
            try {
                let clonedModalData = util.cloneObject(modalData);    
                modalData['endowedChairAppointmentStatus'] = modalDropdownOptions.chairApptStatus[modalData.endowedChairAppointmentStatusId];
                if(modalData.seriesTypeId != null){
                    modalData['seriesType'] = modalDropdownOptions.seriesList[modalData.seriesTypeId];
                }
                if(modalData.rankTypeId != null){
                    modalData['rankType'] = modalDropdownOptions.rankList[modalData.rankTypeId];
                }   
                if(clonedModalData.originalData.employeeStatusId != null){
                    clonedModalData.employeeStatusId = parseInt(clonedModalData.originalData.employeeStatusId);
                }
                if(clonedModalData.effectiveDate != null){
                    clonedModalData.effectiveDate = moment(clonedModalData.effectiveDate).isValid() ? moment(clonedModalData.effectiveDate).format() : null;
                }
                if(clonedModalData.endDate != null){
                    clonedModalData.endDate = moment(clonedModalData.endDate).isValid() ? moment(clonedModalData.endDate).format() : null;
                }
                clonedModalData.endowedChairId = clonedModalData.originalData.endowedChairId;
                clonedModalData.endowedChairHolderAppointmentId = clonedModalData.originalData.endowedChairHolderAppointmentId;
                let endowedChairHolderData = await this.props.Logic.saveEditData(clonedModalData);
                console.log("Modal Comments ", modalComments.commentsText);
                if(modalComments.commentsText != undefined && modalComments.commentsText.trim() != ''){
                    modalComments.endowedChairId = clonedModalData.endowedChairId;
                    modalComments.endowedChairHolderAppointmentId = clonedModalData.endowedChairHolderAppointmentId; 
                    let comments = await this.props.Logic.saveComments(modalComments);
                    //Clear out comments from the modal after save
                    modalComments.commentsText = '';
                } 
                this.props.handleSave(endowedChairHolderData);
            } catch(e) {
                console.error(e);
                errorData.modalErrorMessage = "Something went wrong with the server. Please try again.";
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            errorData.modalErrorMessage = modalErrorMessage;
        }
        this.setState({modalData, errorData, isSaveButtonDisabled: false});
    }

    validateData = (modalData) => {
        let {errorData} = this.state;

        errorData.hasErrors = false;
        let fields = this.props.Logic.getValidationFields();
        let errorMessage = this.props.Logic.getErrorMessage();

        for(let each of fields){
            if(modalData[each] || modalData[each]===0){
                errorData[each+"Error"] = null;
            }else{
                errorData[each+"Error"] = errorMessage;
                errorData.hasErrors = true;
            }
        }
        return errorData;
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

    hideEndowedModal = () => {
        let {errorData, modalComments} = this.state;
        //errorData.modalErrorMessage = null;
        errorData = {};
        modalComments.commentsText = '';  
        this.setState({modalComments, errorData, isRankDisabled: true});
        this.props.hideEndowedModal();
    }

    onChange = (e, field) => {
        let {modalData} = this.state;
        modalData[field] = e.target.value;  
        this.setState({modalData});
    }

    onChangeComments = (e, field) => {
        let {modalComments} = this.state;
        modalComments[field] = e.target.value;  
        this.setState({modalComments});
    }

    onChangeDate = (e, field) => {
        let {modalData} = this.state;
        //let date = moment(e.target.value).isValid() ? moment(e.target.value).format() : null;
        modalData[field] = e.target.value;
        this.setState({modalData});
    }

    onChangeApptStatus  = (e, field) => {
        let {modalData} = this.state;
        if(e.target.value == '4') {
            this.setState({showConfirmationModal: true});
        } else {
            modalData[field] = e.target.value;
        } 
        this.setState({modalData});
    }
    
    onChangeSeries = async(e, field) => {
        let {modalData, modalDropdownOptions} = this.state;     
        modalData[field] = e.target.value; 
        if(e.target.value != ''){
            let rankOptions = [];
            rankOptions = await this.props.Logic.getRankOptions(e.target.value);
            modalDropdownOptions.rankList = rankOptions;
            this.setState({isRankDisabled: false});
        }else{
            modalDropdownOptions.rankList = [];
            modalData.rankTypeId = '';   
            this.setState({isRankDisabled: true});
        }
        this.setState({modalData, modalDropdownOptions});
    }

    hideConfirmationModal = () => {
        this.setState({showConfirmationModal: false});
    }

    updateStatus = async () => {
        let {modalData} = this.state;
        modalData['endowedChairAppointmentStatusId'] = 4;
        this.hideConfirmationModal();
    }

      /**
   *
   * @desc - Gets opus status modal
   * @return {JSX} - Opus status modal
   *
   **/
    getConfirmationModal() {
        return (
          <Modal show={this.state.showConfirmationModal}
            onHide={this.hideConfirmationModal}>
            <Header className=" modal-danger " closeButton>
              <h1 className="white" id="ModalHeader">Are you sure?</h1>
            </Header>
            <Body>
            The "Removed" status should be used to remove appointments added in error. If the appointment has ended, use the "Archived" status instead.
            </Body>
            <Footer>
              <button className={"left btn btn-danger"} onClick={this.updateStatus}>
                Update
              </button>
              <a className=" left btn btn-link" target="_blank"
                onClick={this.hideConfirmationModal}>
                Cancel
              </a>
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
        let {showModal, modalData, modalComments, errorData, modalDropdownOptions, isSaveButtonDisabled, isFieldDisabled, isRankDisabled} = this.state;
        return(
        <div>
            {this.getConfirmationModal()}
            <Modal className=" modal-lg " backdrop="static" show={showModal}
                onHide={this.hideEndowedModal}>
                <Header className=" modal-info modal-header " closeButton>
                    <Title> <h1 className=" modal-title black ">Chair Holder</h1> </Title>
                </Header>
                <Body>
                    <h2 className="flush-top">Edit Chair Holder</h2>
                        <span>
                            <table className=' table table-bordered table-responsive'>
                                <tbody>
                                    <tr>
                                        <th className={" col-md-12 "} colSpan="2">
                                            Chair Holder Details
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Chair Holder <ToolTip text={descriptions.chChairHolderForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormInput name="chairHolder" disabled="true"
                                                value={modalData.chairHolder}
                                                showLabel={false}
                                                right_field_css={' col-sm-4 '}/>
                                        </td>
                                    </tr>   
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Employee Status <ToolTip text={descriptions.chEmpStatusForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormInput name="employeeStatus" disabled="true"
                                                value={modalData.employeeStatus}
                                                showLabel={false}
                                                right_field_css={' col-sm-4 '}/>
                                        </td>
                                    </tr>                                 
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Chair Appt. Status <ToolTip text={descriptions.chairApptStatusForModal} placement={"right"}/>
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} valueIsText
                                                options={modalDropdownOptions.chairApptStatus}
                                                onChange={(e) => this.onChangeApptStatus(e, "endowedChairAppointmentStatusId")}
                                                value={modalData.endowedChairAppointmentStatusId}
                                                hasError={errorData.endowedChairAppointmentStatusIdError ? true : false}
                                                error={errorData.endowedChairAppointmentStatusIdError ? "Please select a Chair appt. status above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Chair Appt. Effective Date <ToolTip text={descriptions.chChairApptEffDateForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormDate onChange={(e) => this.onChangeDate(e, "effectiveDate")} disabled={isFieldDisabled}
                                                value={modalData.effectiveDate ? moment(modalData.effectiveDate).format("L") : null}
                                                hasError={errorData.effectiveDateError ? true : false}
                                                error={errorData.effectiveDateError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                        Chair Appt. End Date (optional) <ToolTip text={descriptions.chchairApptEndDateForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormDate onChange={(e) => this.onChangeDate(e, "endDate")} disabled={isFieldDisabled}
                                                value={modalData.endDate ? moment(modalData.endDate).format("L") : null}
                                                hasError={errorData.endDateError ? true : false}
                                                error={errorData.endDateError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Series at Time of Appt. (optional) <ToolTip text={descriptions.chSeriesForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} valueIsText disabled={isFieldDisabled}
                                                options={modalDropdownOptions.seriesList}
                                                onChange={(e) => this.onChangeSeries(e, "seriesTypeId")}
                                                value={modalData.seriesTypeId}
                                                 base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Rank at Time of Appt. (optional) <ToolTip text={descriptions.chRankForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} disabled={isRankDisabled}
                                                options={modalDropdownOptions.rankList}
                                                onChange={(e) => this.onChange(e, "rankTypeId")}
                                                value={modalData.rankTypeId}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>                                   

                                    
                                    <tr>
                                        <th className={" col-md-12 "} colSpan="2">
                                            Comments <ToolTip text={descriptions.chCommentsForModal} />
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column '} colSpan="2">
                                            Please explain why there are changes to this appointment. (optional) (Max 250 characters)
                                            <FormTextArea onChange={(e) => this.onChangeComments(e, "commentsText")}
                                                onBlur={this.onBlur}
                                                value={modalComments.commentsText} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <ShowIf show={errorData.hasErrors}>
                                <p className="error_message">{errorData.modalErrorMessage}</p>
                            </ShowIf>
                        </span>
                </Body>
                <Footer>
                    <Button className="left btn btn-primary" onClick={this.saveECHData}
                        disabled={isSaveButtonDisabled}>
                        Save
                    </Button>
                    <Dismiss onClick={this.hideEndowedModal} className="left btn btn-link">
                        Cancel
                    </Dismiss>
                </Footer>
            </Modal>
        </div>
    );
    }
}
