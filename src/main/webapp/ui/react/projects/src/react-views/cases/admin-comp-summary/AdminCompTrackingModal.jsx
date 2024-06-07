import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import moment from 'moment';

//My imports
// import {ShowIf} from '../common/components/elements/DisplayIf.jsx';
import {AdminCompHeader, OtherHeader} from './AdminCompHeader.jsx';
import {text, urlConfig, profileSaveTemplate, profileConstants} from
  '../../../opus-logic/cases/constants/profile/ProfileConstants';
import * as util from '../../../opus-logic/common/helpers/';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {FormShell, FormGroup} from '../../common/components/forms/FormRender.jsx';
import {FormInput, FormNumber, FormCurrency, FormTextAreaMaxChar, FormAutoComplete, FormSelect, FormDate} from
    '../../common/components/forms/FormElements.jsx';
import { descriptions } from '../../../opus-logic/common/constants/Descriptions.js';
import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
// import { isNull } from 'lodash';
/******************************************************************************
 *
 * @desc - Selection for Tracking Dates Modal
 *
 ******************************************************************************/
export default class AdminCompTrackingModal extends React.Component {

   /**
    *
    * @desc - Static variables. Only one value throughout all instances
    *
    **/
    static propTypes = {
        hideTrackingEditModal: PropTypes.func
    }

    static defaultProps = {
        showTrackingModal: false
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
        trackingData: {},
        opusPersonId1: null,
        fullName1: null,
        opusPersonId2: null,
        fullName2: null,

    };

   /**
    *
    * @desc - Lifecycle hook when receiving newProps
    * @param {Object} props - props
    * @return {void}
    *
    **/
    componentWillReceiveProps(props) {
	    let clonedAdminCompSummaryData = util.cloneObject(props.clonedAdminCompSummaryData);
      let trackingData = clonedAdminCompSummaryData.acProposalTracking;

        // add values from acPropComp object to trackingData to appear in modal form fields
        trackingData.adminCompProposalId = clonedAdminCompSummaryData.acPropComp.adminCompProposalId;
        trackingData.evcpapprovedDT = clonedAdminCompSummaryData.acPropComp.evcpapprovedDT;

        // convert deanSubmissionDT MM/DD/YYYY received from API to JS Date
        let deanSubmissionDT = new Date(clonedAdminCompSummaryData.acPropComp.deanSubmissionDT);
        trackingData.deanSubmissionDT = clonedAdminCompSummaryData.acPropComp.deanSubmissionDT ? deanSubmissionDT : null;
        trackingData.deanSubmissionByName = clonedAdminCompSummaryData.acPropComp.deanSubmissionByName;

        // convert completedDT MM/DD/YYYY received from API to JS Date
        let completedDT = new Date(clonedAdminCompSummaryData.acPropComp.completedDT);
        trackingData.completedDT = clonedAdminCompSummaryData.acPropComp.completedDT ? completedDT : null;
        trackingData.completedByName = clonedAdminCompSummaryData.acPropComp.completedByName;

        trackingData.evcpapprovedById = clonedAdminCompSummaryData.acPropComp.evcpapprovedById;
        //5-20-2021 set Date format
        let evcpapprovedDT = new Date(clonedAdminCompSummaryData.acPropComp.evcpapprovedDT);
        trackingData.evcpapprovedDT = clonedAdminCompSummaryData.acPropComp.evcpapprovedDT ? evcpapprovedDT : null;
        let ucopapprovedDT = new Date(clonedAdminCompSummaryData.acPropComp.ucopapprovedDT);
        trackingData.ucopapprovedDT = clonedAdminCompSummaryData.acPropComp.ucopapprovedDT ? ucopapprovedDT : null;

        trackingData.ucopapprovedById = clonedAdminCompSummaryData.acPropComp.ucopapprovedById;
        // 5-21-2021 adding new selected label
        trackingData.ucopapprovedByName = clonedAdminCompSummaryData.acPropComp.ucopapprovedByName;
        trackingData.evcpapprovedByName = clonedAdminCompSummaryData.acPropComp.evcpapprovedByName;

        // 3-1-2023 Added revisionRequestedDT and revisionRequestedById
        trackingData.revisionRequestedDT = clonedAdminCompSummaryData.acPropComp.revisionRequestedDT;
        trackingData.revisionRequestedById = clonedAdminCompSummaryData.acPropComp.revisionRequestedById;

        this.setState({clonedAdminCompSummaryData, trackingData});
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
     * @desc -Search functions
     *
     ******************************************************************************/


    /**
    *
    * @desc - Reformats the data from Profile API to array of objects
    *  with specific data
    * @param {Object} suggestions -
    * @return {Array} - array of objects with names, labels, and opusPersonIds
    *
    **/
    formatNameSearchSuggestions(suggestions = [], {additionalNameKey = 'label'} = {}) {
      return suggestions.map(({fullName: name, opusPersonId: id, uid, contactValue}) => {
        let uid_str = uid ? ', '+uid : '';
        let contactValue_str = contactValue ? ', '+contactValue : '';
        return {name, [additionalNameKey]: name+uid_str+contactValue_str, value: name, id};
      });
    }

    /**
    *
    * @desc - gets formatted url with proper args for name search
    * @param {String} name -
    * @param {String} - access_token, grouperPathText
    * @return {String} - url string
    *
    **/
    getNameOptionsUrl = (name, {access_token, grouperPathText} = this.props.Logic) => {
        //console.log(access_token)
        let pageName = 'trackingDates';

        let nameUrl = urlConfig.searchProfileNamesUrl({name, access_token,
          grouperPathText, pageName});
        nameUrl = encodeURI(nameUrl);
        return nameUrl;
    }

    /**
    *
    * @desc - gets raw API results from nameSearch
    * @param {String} name - string to search for
    * @return {Array} - API results
    *
    **/
    getNameOptionsFromSearch = async (name) => {
      let validNameString = name.replace(/[#{?\\]/g, "");
      if(validNameString!==''){
        let nameUrl = this.getNameOptionsUrl(validNameString);
        return await util.fetchJson(nameUrl);
      }else{
        console.log('invalid name search')
      }
    }

    /**
    *
    * @desc - gets raw API results from nameSearch
    * @param {String} name - string to search for
    * @return {Array} - API results
    *
    **/
    getFormattedNameSearchOptions = async (name) => {
        let results = await this.getNameOptionsFromSearch(name);
        return this.formatNameSearchSuggestions(results);
    }

    onChangeSearchPersonEVCP = (e) => {
        let {trackingData} = this.state;
        let value = e.target.value;
        if(value.length<3){
          trackingData.evcpapprovedByName = '';
        }
        this.setState({trackingData})
    }

    onChangeSearchPersonUCOP = (e) => {
      let {trackingData} = this.state;
      let value = e.target.value;
      if(value.length<3){
          trackingData.ucopapprovedByName = '';
      }
      this.setState({trackingData})
  }


    onAutocompleteSearchKeypressEVCP = async ({term: searchText}, response) => {
        let formattedResultsPromise = this.getFormattedNameSearchOptions(searchText);

        //Send to error modal
        this.setState({failurePromise: formattedResultsPromise});

        //Get from API
        let formattedResults = await formattedResultsPromise;

        // set error message if no search results found
        let trackingSearchErrorMessageEVCP = this.props.Logic.getTrackingSearchErrorMessage();
        formattedResults = formattedResults.length ? formattedResults : [trackingSearchErrorMessageEVCP];

        //Send back to autocomplete to populate dropdown
        response(formattedResults);

        return formattedResults;
    }

    onAutocompleteSearchKeypressUCOP = async ({term: searchText}, response) => {
      let formattedResultsPromise = this.getFormattedNameSearchOptions(searchText);

      //Send to error modal
      this.setState({failurePromise: formattedResultsPromise});

      //Get from API
      let formattedResults = await formattedResultsPromise;

      // set error message if no search results found
      let trackingSearchErrorMessageUCOP = this.props.Logic.getTrackingSearchErrorMessage();
      formattedResults = formattedResults.length ? formattedResults : [trackingSearchErrorMessageUCOP];

      //Send back to autocomplete to populate dropdown
      response(formattedResults);

      return formattedResults;
  }

    onChooseAutoCompleteNameEVCP = (event, {id: opusPersonId1, name: fullName1 = {}} = {}, ) => {
        //this.reloadPageWithOpusPersonId(opusPersonId);
        let {trackingData} = this.state;
	    trackingData['evcpapprovedById'] = opusPersonId1;
      trackingData['evcpapprovedByName'] = fullName1;
        this.setState(trackingData);
        console.log("EVCP name selected");
        console.log(trackingData);
    }

    onChooseAutoCompleteNameUCOP = (event, {id: opusPersonId2, name: fullName2} = {}) => {

        let {trackingData} = this.state;
	      trackingData['ucopapprovedById'] = opusPersonId2;
        trackingData['ucopapprovedByName'] = fullName2;
        this.setState(trackingData);
        console.log("UCOP name selected");
        console.log(trackingData);
    }

	onChangeDate = (e, field) => {
	    let {trackingData} = this.state;

      // 5-14-2021 date format
      let date = moment(e.target.value).isValid() ? moment(e.target.value).format() : null;
      trackingData[field] = date;

	    this.setState(trackingData);

      console.log(field + "date changed");
      console.log(trackingData);
	}


   /******************************************************************************
     *
     * @desc -Save functions
     *
     ******************************************************************************/


    validateTrackingData = () => {

    // new validation logic pairs of UCOP fields and EVCP fields
    let {trackingData} = this.state;
    trackingData.hasErrors = false;

    let dataHasErrors = false;

     if (trackingData.evcpapprovedDT && trackingData.evcpapprovedDT !== "") {
       if(trackingData.evcpapprovedById && trackingData.evcpapprovedById !== ""){
          if(trackingData.evcpapprovedByName ===""){
            trackingData.evcpapprovedByIdError = "Please search for and select a person.";
            dataHasErrors = true;
          }else{
            trackingData.evcpapprovedByIdError =null;
          }
       }else{
         trackingData.evcpapprovedByIdError = "Please search for and select a person.";
         dataHasErrors = true;
       }
     } // end of EVCP date

     if (trackingData.evcpapprovedById && trackingData.evcpapprovedById !== "") {
      if(trackingData.evcpapprovedDT && trackingData.evcpapprovedDT !== ""){
         trackingData.evcpapprovedDTError =null;
      }else{
        trackingData.evcpapprovedDTError = "EVCP Approval Date cannot be blank if you have selected a person.";
        dataHasErrors = true;
      }
    } // end of EVCP name

    if (trackingData.ucopapprovedDT && trackingData.ucopapprovedDT !== "") {
      if(trackingData.ucopapprovedById && trackingData.ucopapprovedById !== ""){
         trackingData.ucopapprovedByIdError =null;
      }else{
        trackingData.ucopapprovedByIdError = "Please search for and select a person.";
        dataHasErrors = true;
      }
    } // end of UCOP name

    if (trackingData.ucopapprovedById && trackingData.ucopapprovedById!== "") {
      if(trackingData.ucopapprovedDT && trackingData.ucopapprovedDT !== ""){
         trackingData.ucopapprovedDTError =null;
      }else{
        trackingData.ucopapprovedDTError = "UCOP Approval Date cannot be blank if you have selected a person.";
        dataHasErrors = true;
      }
    } // end of UCOP name

      trackingData.hasErrors = dataHasErrors;
      return trackingData;
    }

    saveTrackingData = async () => {
        this.setState({isSaveButtonDisabled: true})

        // validate here
        let trackingData = this.validateTrackingData();

        if(!trackingData.hasErrors){
            try {
                let savePromise = await this.props.Logic.saveTrackingData(trackingData, this.props.adminCompSummaryDataFromAPI);

                console.log("returned promise");
                console.log(savePromise);

                this.props.handlePromise(savePromise);


              } catch(e) {
                console.error(e);
                this.setState({isSaveButtonDisabled: false})

              }
        }else{

             this.setState({trackingData, duplicateErrorMessage: null, isSaveButtonDisabled: false});
        }
        this.setState({isSaveButtonDisabled: false});

    }

    revertTrackingData = () => {
        this.props.hideTrackingEditModal();
    }

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
  render() {
      let {trackingData, isSaveButtonDisabled} = this.state;
      let labelColumnClass = ' col-md-5 ';
      let dateColumnClass = ' col-md-12 ';
      let nameColumnClass = ' col-md-2 ';
    return(
        <Modal className=" modal-lg " backdrop="static" show={this.props.showTrackingModal}
            onHide={this.revertTrackingData}>
            <Header className=" modal-info modal-header " closeButton>
                <Title className=" modal-title black ">Tracking Dates</Title>
            </Header>
            <Body>

                <table className='table table-responsive'>
                    <tbody>
						<tr>
                            <th className={labelColumnClass}>
                            </th>
                            <th className={dateColumnClass}>
                                Date
                            </th>
                            <th className={nameColumnClass}>
                                Name
                            </th>
                        </tr>
                        <tr>
                            <td className={labelColumnClass}>
                                Dean Submission <ToolTip text={descriptions.deanSubmission} />
                            </td>
                            <td className={dateColumnClass}>
                                <FormDate
                                    value={trackingData.deanSubmissionDT ? moment(trackingData.deanSubmissionDT).format('L') : null}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}
                                    disabled={true}/>
                                    This field is populated when the proposal is submitted.
                            </td>
                            <td className={nameColumnClass}>
                                <FormInput
                                    value={trackingData.deanSubmissionByName}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}
                                    disabled="true"/>
                            </td>
                        </tr>
                        <tr>
                            <td className={labelColumnClass}>
                                Revision Requested <ToolTip text={descriptions.revisionRequestedDate} />
                            </td>
                            <td className={dateColumnClass}>
                             {/*<div><br/><br/><br/></div>*/}
                             <FormDate
                                    disabled={true}
                                    value={trackingData.revisionRequestedDT ? moment(trackingData.revisionRequestedDT).format('L') : null}
                                    onChange={(e) => this.onChangeDate(e, 'revisionRequestedDT')}
                                    hasError={trackingData.revisionRequestedDTError ? true : false}
                                    error={trackingData.revisionRequestedDTError}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}/>
                            {/* Selected Date: {trackingData.evcpapprovedDT ? moment(trackingData.evcpapprovedDT).format('L') : null} */}
                            </td>
                            <td className={nameColumnClass}>
                                <FormInput
                                    value={trackingData.revisionRequestedById}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}
                                    disabled="true"/>
                            </td>
                        </tr>
                        <tr>
                            <td className={labelColumnClass}>
                                EVCP Approval <ToolTip text={descriptions.EVCPApproval} />
                            </td>
                            <td className={dateColumnClass}>
                             {/*<div><br/><br/><br/></div>*/}
                             <FormDate
                                    value={trackingData.evcpapprovedDT ? moment(trackingData.evcpapprovedDT).format('L') : null}
                                    onChange={(e) => this.onChangeDate(e, 'evcpapprovedDT')}
                                    hasError={trackingData.evcpapprovedDTError ? true : false}
                                    error={trackingData.evcpapprovedDTError}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}/>
                            {/* Selected Date: {trackingData.evcpapprovedDT ? moment(trackingData.evcpapprovedDT).format('L') : null} */}
                            </td>
                            <td className={nameColumnClass}>
                                <FormAutoComplete placeholder={trackingData.evcpapprovedByName ? trackingData.evcpapprovedByName : 'Search for a person by name (last, first) or UID'}
                                    id="evcpapprovedById"
                                    options={this.onAutocompleteSearchKeypressEVCP} autoCompleteUIOptions={{}}
                                    onSearchClick={this.onChooseAutoCompleteNameEVCP}
                                    onChange={this.onChangeSearchPersonEVCP}
                                    hasError={trackingData.evcpapprovedByIdError ? true : false}
                                    error={trackingData.evcpapprovedByIdError}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}/>

                            Selected Name: {trackingData.evcpapprovedByName}
                            </td>
                        </tr>

                        <tr>
                            <td className={labelColumnClass}>
                                UCOP Approval <ToolTip text={descriptions.UCOPApproval} />
                            </td>
                            <td className={dateColumnClass}>

                              {/*<div><br/><br/><br/></div>*/}
                                <FormDate
                                    value={trackingData.ucopapprovedDT ? moment(trackingData.ucopapprovedDT).format('L') : null}
                                    onChange={(e) => this.onChangeDate(e, 'ucopapprovedDT')}
                                    hasError={trackingData.ucopapprovedDTError ? true : false}
                                    error={trackingData.ucopapprovedDTError}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}/>
                            {/* Selected Date: {trackingData.ucopapprovedDT ? moment(trackingData.ucopapprovedDT).format('L') : null} */}
                            </td>
                            <td className={nameColumnClass}>
                                <FormAutoComplete placeholder={trackingData.ucopapprovedByName ? trackingData.ucopapprovedByName : 'Search for a person by name (last, first) or UID'}
                                    id="ucopapprovedById"
                                    options={this.onAutocompleteSearchKeypressUCOP} autoCompleteUIOptions={{}}
                                    onSearchClick={this.onChooseAutoCompleteNameUCOP}
                                    onChange={this.onChangeSearchPersonUCOP}
                                    hasError={trackingData.ucopapprovedByIdError ? true : false}
                                    error={trackingData.ucopapprovedByIdError}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}/>

                            Selected Name: {trackingData.ucopapprovedByName}
                            </td>
                        </tr>
                        <tr>
                            <td className={labelColumnClass}>
                                Completed <ToolTip text={descriptions.completed} /> 
                            </td>
                            <td className={dateColumnClass}>
                                <FormDate
                                    value={trackingData.completedDT ? moment(trackingData.completedDT).format('L') : null}
                                    base_css={''} left_field_css={''} right_field_css={''} showLabel={false}
                                    disabled={true}/>
                                This field is populated when you edit the final decision and
                                click the "Save and Complete" button.
                            </td>
                            <td className={nameColumnClass}>
                                <FormInput
                                        displayName={''}  value={trackingData.completedByName}
                                        descriptionText={''}
                                        base_css={''} left_field_css={''} right_field_css={''} showLabel={false}
                                        disabled={true}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Body>
            <Footer>
                <Button className="left btn btn-primary" onClick={this.saveTrackingData}
                disabled={isSaveButtonDisabled}>
                Save
                </Button>
                <Dismiss onClick={this.revertTrackingData} className="left btn btn-link">
                Cancel
                </Dismiss>
            </Footer>
        </Modal>
    )
  }
}
