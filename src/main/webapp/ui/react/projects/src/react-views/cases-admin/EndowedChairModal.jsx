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
 * @desc - Add or Edit Endowed Chair Modal
 *
 ******************************************************************************/
export default class EndowedChairModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        handleSave: PropTypes.func
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
        crudType: "Edit",
        modalData: {},
        errorData: {},
        modalDropdownOptions: {},
        // selectedPerson:{
        //     show: false
        // },
        // isSaveButtonDisabled: true,
        // hasLoaded: false,
        // showSuccessModal: false,
        // proposalPersonName: null
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
        if(props.crudType!==this.state.crudType){
            this.setState({crudType: props.crudType})
        }
        if(props.modalDropdownOptions!==this.state.modalDropdownOptions){
            this.setModalData(props);
        }
        if(props.modalData!==this.state.modalData){
            this.setState({modalData: props.modalData})
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
    * @desc - Filter table data by tab click and then update state
    * @param {String} tabName -
    * @returns {void}
    *
    **/
    setModalData = async (props) => {
        let modalData = props.modalData;
        if(props.comingFrom==="datatable"){
            modalData.endowedChairStatus = props.typeOfECTable;
        }
        this.setState({modalDropdownOptions: props.modalDropdownOptions, originalModalDropdownOptions: props.originalModalDropdownOptions, modalData});
    }

    /******************************************************************************
     *
     * @desc - Save function
     *
     ******************************************************************************/
    saveECModalData = async () => {
        this.setState({isSaveButtonDisabled: true});
        let {modalData} = this.state;
        let errorData = this.validateData(modalData);
        if(!errorData.hasErrors){
            try {
                // clone and remove unit field before saving (cloned due to original state of modal data being manipulated)
                let clonedModalData = util.cloneObject(modalData);
                delete clonedModalData.unit;

                // Need to find and set correct Id values from dropdown option
                let modalDropdownOptions = this.state.originalModalDropdownOptions;
                let endowedChairStatusFilterList = modalDropdownOptions.chairStatus;
                let key = Object.keys(endowedChairStatusFilterList).find(key => endowedChairStatusFilterList[key] === clonedModalData.endowedChairStatus);
                clonedModalData.endowedChairStatusId = parseInt(key);
                let endowedChairTypeFilterList = modalDropdownOptions.chairType;
                key = Object.keys(endowedChairTypeFilterList).find(key => endowedChairTypeFilterList[key] === clonedModalData.endowedChairType);
                clonedModalData.endowedChairTypeId = parseInt(key);

                // IOK-997 Optional fields should only be set when there is a value
                let endowedChairTermRenewableFilterList = modalDropdownOptions.termRenewable;
                key = Object.keys(endowedChairTermRenewableFilterList).find(key => endowedChairTermRenewableFilterList[key] === clonedModalData.endowedChairTermRenewable);
                if(key>=0){
                    clonedModalData.endowedChairTermRenewableId = parseInt(key);
                }else{
                    clonedModalData.endowedChairTermRenewableId = null;
                }

                let endowedChairFundingTypeFilterList = modalDropdownOptions.fundingType;
                key = Object.keys(endowedChairFundingTypeFilterList).find(key => endowedChairFundingTypeFilterList[key] === clonedModalData.endowedChairFundingType);
                if(key>=0){
                    clonedModalData.endowedChairFundingTypeId = parseInt(key);
                }else{
                    clonedModalData.endowedChairFundingTypeId = null;
                }
                
                let endowedChairData = await this.props.Logic.saveEndowedChairData(clonedModalData);
                this.props.handleSave(endowedChairData, clonedModalData.endowedChairName);
            } catch(e) {
                console.error(e);
                errorData.modalErrorMessage = "Something went wrong with the server. Please try again.";
            }
        }else{
            let modalErrorMessage = this.props.Logic.getModalErrorMessage();
            errorData.modalErrorMessage = modalErrorMessage;
        }
        this.setState({errorData, isSaveButtonDisabled: false});
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
        this.props.hideEndowedModal();
        this.resetErrorData();
    }

    resetErrorData =() => {
        let {errorData} = this.state;
        errorData.hasErrors = false;
        errorData.modalErrorMessage = null;
        errorData.completeUnitNameError = null;
        errorData.endowedChairNameError = null;
        errorData.endowedChairStatusError = null;
        errorData.endowedChairTypeError = null;
        errorData.organizationNameError = null;
        this.setState({errorData});
    }

    onChange = (e, field) => {
        let {modalData} = this.state;
        let value = e.target.value;
        modalData[field] = value;
        this.setState({modalData});
    }

    onChangeDate = (e, field) => {
        let {modalData} = this.state;
        let date = moment(e.target.value).isValid() ? moment(e.target.value).format() : null;
        modalData[field] = date;
        this.setState({modalData});
    }

    // validateDecimalInputs(e) {
    //     var beforeDecimal =2;
    //     var afterDecimal = 4;
    //     e.target.value = e.target.value
    //       .replace(/[^\d.]/g, "")
    //       .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), "$1")
    //       .replace(/(\..*)\./g, "$1")
    //       .replace(new RegExp("(\\.[\\d]{" + afterDecimal + "}).", "g"), "$1");
    // }


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
        let {modalData} = this.state;
        let value = e.target.value;
        if(value.length<3){
            modalData.completeUnitNameError = null;
        }
        this.setState({modalData});
    }

    onClickSearchUnit = (e) => {
        let {modalData, unitOptions} = this.state;
        let value = e.target.value;
        let ahPathId = Object.keys(unitOptions).find(key => unitOptions[key] === value);
        modalData.academicHierarchyPathId = parseInt(ahPathId);

        // Split by : and reverse array to check from the last element
        let unitName = value.split(":").reverse();
        modalData.completeUnitName = value;

        // Loop through and find first non N/A to display
        let organizationName;
        for(let name of unitName){
            if(name!=="N/A"){
                organizationName = name;
                break;
            }
        }

        // Set organization name
        modalData.organizationName = organizationName;
        this.setState({modalData})
    }

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {
        let {showModal, crudType, modalData, errorData, modalDropdownOptions, isSaveButtonDisabled} = this.state;
        return(
        <div>
            <Modal className=" modal-lg " backdrop="static" show={showModal}
                onHide={this.hideEndowedModal}>
                <Header className=" modal-info modal-header " closeButton>
                    <h1 className=" modal-title black ">Endowed Chair</h1>
                </Header>
                <Body>
                    <h2 className="flush-top">{crudType}</h2>
                        <span>
                            <table className=' table table-bordered table-responsive'>
                                <tbody>
                                    <tr>
                                        <th className={" col-md-12 "} colSpan="2">
                                            Main Details
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Endowed Chair ID
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormInput name="endowedChairId"
                                                    displayName={'Endowed Chair ID'}
                                                    value={modalData.endowedChairId}
                                                    showLabel={false}
                                                    disabled={true}
                                                    right_field_css={' col-sm-4 '}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Endowed Chair Name <ToolTip text={descriptions.endowedChairName} />
                                            <div>(Max. 250 characters)</div>
                                        </td>
                                        <td className={' col-md-8 '}>
                                        <FormTextAreaMaxChar name="endowedChairName" rows = "2"
                                              value={modalData.endowedChairName ? modalData.endowedChairName : undefined}
                                              onChange={(e) => this.onChange(e, "endowedChairName")}
                                              onBlur={this.onBlur}
                                              hasError={errorData.endowedChairNameError ? true : false}
                                              error={errorData.endowedChairNameError ? "Please enter a name above." : null}
                                              right_field_css={' col-sm-12 '}
                                              maxAllowableCharacters={250}
                                              base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={" col-md-12 "} colSpan="2">
                                            Location
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Unit Search <ToolTip text={descriptions.unitSearchForEndowedChairModaL} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormAutoComplete placeholder={'Search for unit name (minimum 3 characters)'}
                                                options={this.searchUnit} autoCompleteUIOptions={{}}
                                                onSearchClick={this.onClickSearchUnit}
                                                onChange={this.onChangeSearchUnit}
                                                id={'unitSearchAutocomplete'}
                                                input_css={' form-control  search-field '}
                                                hasError={errorData.completeUnitNameError ? true : false}
                                                error={errorData.completeUnitNameError ? "Please search and select a unit in the search bar above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}
                                                />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Unit Selected
                                        </td>
                                        <td className={' col-md-8 '}>
                                          <FormTextAreaMaxChar name="completeUnitName" rows="2"
                                              value={modalData.completeUnitName ? modalData.completeUnitName : undefined}
                                              hasError={errorData.completeUnitNameError ? true : false}
                                              error={errorData.completeUnitNameError ? "Please search and select a unit above." : null}
                                              disabled={true}
                                              right_field_css={' col-sm-12 '}
                                              base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Organization Name<ToolTip text={descriptions.organizationNameForEndowedChairModal} />
                                            <div>(Max. 250 characters)</div>
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormTextAreaMaxChar name="organizationName"
                                                value={modalData.organizationName ? modalData.organizationName : undefined}
                                                onChange={(e) => this.onChange(e, "organizationName")}
                                                onBlur={this.onBlur}
                                                hasError={errorData.organizationNameError ? true : false}
                                                error={errorData.organizationNameError}
                                                maxAllowableCharacters={250}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={" col-md-12 "} colSpan="2">
                                            Chair Details
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Chair Status<ToolTip text={descriptions.chairStatus} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} valueIsText
                                                options={modalDropdownOptions.chairStatus}
                                                onChange={(e) => this.onChange(e, "endowedChairStatus")}
                                                value={modalData.endowedChairStatus}
                                                hasError={errorData.endowedChairStatusError ? true : false}
                                                error={errorData.endowedChairStatusError ? "Please search and select a chair status above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Date Established (optional)<ToolTip text={descriptions.dateEstablished} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormDate onChange={(e) => this.onChangeDate(e, "dateEstablished")}
                                                value={modalData.dateEstablished ? moment(modalData.dateEstablished).format("L") : null}
                                                hasError={errorData.dateEstablishedError ? true : false}
                                                error={errorData.dateEstablishedError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Date Disestablished (optional)<ToolTip text={descriptions.dateDisestablished} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormDate onChange={(e) => this.onChangeDate(e, "dateDisestablished")}
                                                value={modalData.dateDisestablished ? moment(modalData.dateDisestablished).format("L") : null}
                                                hasError={errorData.dateDisestablishedError ? true : false}
                                                error={errorData.dateDisestablishedError}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Chair Type<ToolTip text={descriptions.chairTypeForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} valueIsText
                                                options={modalDropdownOptions.chairType}
                                                onChange={(e) => this.onChange(e, "endowedChairType")}
                                                value={modalData.endowedChairType}
                                                hasError={errorData.endowedChairTypeError ? true : false}
                                                error={errorData.endowedChairTypeError ? "Please search and select a Chair type above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Chair Term (optional)<ToolTip text={descriptions.chairTerm} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormNumber name="chairTerm"
                                                    displayName={'Chair Term'}  value={modalData.endowedChairTerm}
                                                    onChange={(e) => this.onChange(e, "endowedChairTerm")}
                                                    hasError={errorData.endowedChairTermError ? true : false}
                                                    error={errorData.endowedChairTermError}
                                                    showLabel={false}
                                                    right_field_css={' col-sm-4 '}/> Year(s)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Term Renewable (optional)<ToolTip text={descriptions.termRenewableForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} valueIsText
                                                options={modalDropdownOptions.termRenewable}
                                                onChange={(e) => this.onChange(e, "endowedChairTermRenewable")}
                                                value={modalData.endowedChairTermRenewable}
                                                hasError={errorData.endowedChairTermRenewableError ? true : false}
                                                error={errorData.endowedChairTermRenewableError ? "Please search and select a chair type above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Funding Type (optional)<ToolTip text={descriptions.fundingTypeForModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormSelect includeBlankOption={true} valueIsText
                                                options={modalDropdownOptions.fundingType}
                                                onChange={(e) => this.onChange(e, "endowedChairFundingType")}
                                                value={modalData.endowedChairFundingType}
                                                hasError={errorData.endowedChairFundingTypeError ? true : false}
                                                error={errorData.endowedChairFundingTypeError ? "Please search and select a chair type above." : null}
                                                base_css={''} left_field_css={''} right_field_css={'col-sm-12'} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Designation (optional)<ToolTip text={descriptions.designationForEndowedModal} />
                                            <div>(Max. 500 characters)</div>
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormTextAreaMaxChar name="designation"
                                                onChange={(e) => this.onChange(e, "designation")}
                                                onBlur={this.onBlur}
                                                value={modalData.designation ? modalData.designation : undefined}
                                                hasError={errorData.designationError ? true : false}
                                                error={errorData.designationError ? "Please enter a designation above" : null}
                                                right_field_css={' col-sm-12 '}
                                                maxAllowableCharacters={500}
                                                base_css={''} left_field_css={''} showLabel={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            Date Chair Last Vacated<ToolTip text={descriptions.lastOccupiedForEndowedModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormInput name="lastOccupiedDate"
                                                    displayName={'Date Chair Last Vacated'}
                                                    value={modalData.lastOccupiedDate!==null ? modalData.lastOccupiedDate : "unknown"}
                                                    showLabel={false}
                                                    disabled={true}
                                                    right_field_css={' col-sm-4 '}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={' label-column col-md-4 '}>
                                            # Years Unoccupied<ToolTip text={descriptions.yearsUnoccupiedForEndowedModal} />
                                        </td>
                                        <td className={' col-md-8 '}>
                                            <FormInput name="yearsUnoccupied"
                                                    displayName={'# Years Unoccupied'}
                                                    value={modalData.yearsUnoccupied!==null ? modalData.yearsUnoccupied : "unknown"}
                                                    showLabel={false}
                                                    disabled={true}
                                                    right_field_css={' col-sm-4 '}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={" col-md-12 "} colSpan="2">
                                            Comments
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className={' label-column '} colSpan="2">
                                            (optional) (Max 250 characters)
                                            <FormTextArea onChange={(e) => this.onChange(e, "userComment")}
                                                onBlur={this.onBlur} />
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
                    <Button className="left btn btn-primary" onClick={this.saveECModalData}
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
