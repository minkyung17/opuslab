import React from "react";
import PropTypes from "prop-types";

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import CaseSummary from "../../../opus-logic/cases/classes/case-summary/CaseSummary";
import CasesDossier from "../../../opus-logic/cases/classes/CasesDossier";
import CaseRecommendations from
  "../../../opus-logic/cases/classes/recommendations/CaseRecommendations";
import * as util from "../../../opus-logic/common/helpers/";
import APIResponseModal, {Failure} from "../../common/components/bootstrap/APIResponseModal.jsx";
import {HideIf, ShowIf} from "../../common/components/elements/DisplayIf.jsx";

import Modal, {Header, Body, Footer, Dismiss} from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import {Select} from "../../common/components/forms/SelectOption.jsx";
import {MultipleAppointmentsBlock} from "../components/AppointmentBlocks.jsx";
import {DisplayTable, DisplayTableHeader} from
  "../../common/components/elements/DisplayTables.jsx";
import {ToolTip} from "../../common/components/elements/ToolTip.jsx";
import {descriptions} from "../../../opus-logic/common/constants/Descriptions";
// import {RadioGroup, Radio} from 'react-radio-group';
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";

export default class OffScaleReport extends React.Component {
  /**
  *
  * @desc -
  *
  **/
    static propTypes = {

    };
    static defaultProps = {

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
    Logic = new CaseSummary(this.props); //to use the getCasesSummaryData function


  /**
  *
  * @desc - State vars
  *
  **/
    state = {

    }

  /**
  *
  * @desc -
  * @param {Object} caseSummaryDataFromAPI - caseSummaryDataFromAPI
  * @return {void}
  *
  **/
    componentWillMount(caseSummaryDataFromAPI = this.props.caseSummaryDataFromAPI) {
        this.setUpPage(caseSummaryDataFromAPI);
    }

  /**
  *
  * @desc -
  * @return {void}
  *
  **/
    componentDidMount() {
        util.initJQueryBootStrapToolTipandPopover();
    }

  /**
  *
  * @desc - Set up Page
  *
  **/
    setUpPage(caseSummaryDataFromAPI){
        let {appointeeInfo: {fullName}} = caseSummaryDataFromAPI;
        let actionDataInfo = caseSummaryDataFromAPI.actionDataInfo[0];
        let currentDetails = {};
        let proposedDetails = {};
        let shouldDisplay = false;

    // Find primary appointment
        for(let each of caseSummaryDataFromAPI.actionDataInfo){
            if(each.appointmentInfo.affiliationType.affiliation==="Primary" ||
        each.proposedAppointmentInfo.affiliationType.affiliation==="Primary"){
                actionDataInfo = each;
                shouldDisplay = true;
                break;
            }
        }

        let affiliation = actionDataInfo.appointmentInfo.affiliationType.affiliation;
        let current = actionDataInfo.appointmentInfo;

    // Don't display if hSCP is true or nstpComp field is populated with something
        if(current.titleInformation.hSCP || current.salaryInfo.nstpComp!==null){
            shouldDisplay = false;
        }else{
      // Current appointment details
            if(current.titleInformation.series){
                currentDetails.seriesRankStep = current.titleInformation.series;
            }
            if(current.titleInformation.rank && current.titleInformation.rank.rankTypeDisplayText){
                currentDetails.seriesRankStep = currentDetails.seriesRankStep+", "+
        current.titleInformation.rank.rankTypeDisplayText;
            }
            if(current.titleInformation.step && current.titleInformation.step.stepName
        && current.titleInformation.step.stepName!=="N/A"){
                currentDetails.seriesRankStep = currentDetails.seriesRankStep+" "+
        current.titleInformation.step.stepName;
            }
            currentDetails.salary = util.reformatToMoneyDisplayValue(current.salaryInfo.payrollSalary);
            currentDetails.onScaleSalary = util.reformatToMoneyDisplayValue(current.salaryInfo.onScaleSalary);
            currentDetails.offScaleAmount = util.reformatToMoneyDisplayValue(current.salaryInfo.offScaleAmount);
            currentDetails.offScalePercent = current.salaryInfo.offScalePercent!==null ?
        parseFloat(Math.round(current.salaryInfo.offScalePercent * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2)+"%" : "";

      // Proposed appointment details
            let proposed = actionDataInfo.proposedAppointmentInfo;

            if(proposed.titleInformation.series){
                proposedDetails.seriesRankStep = proposed.titleInformation.series;
            }
            if(proposed.titleInformation.rank && proposed.titleInformation.rank.rankTypeDisplayText){
                proposedDetails.seriesRankStep = proposedDetails.seriesRankStep+", "+
        proposed.titleInformation.rank.rankTypeDisplayText;
            }
            if(proposed.titleInformation.step && proposed.titleInformation.step.stepName
        && proposed.titleInformation.step.stepName!=="N/A"){
                proposedDetails.seriesRankStep = proposedDetails.seriesRankStep+" "+
        proposed.titleInformation.step.stepName;
            }
            proposedDetails.salary = util.reformatToMoneyDisplayValue(proposed.salaryInfo.currentSalaryAmt);
            proposedDetails.onScaleSalary = util.reformatToMoneyDisplayValue(proposed.salaryInfo.onScaleSalary);
            proposedDetails.offScaleAmount = util.reformatToMoneyDisplayValue(proposed.salaryInfo.offScaleAmount);
            proposedDetails.offScalePercent = proposed.salaryInfo.offScalePercent!==null ?
      parseFloat(Math.round(proposed.salaryInfo.offScalePercent * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2)+"%" : "";

            proposedDetails.changeInOffScaleAmount = "";
            if(proposed.salaryInfo.offScaleAmount!==null && current.salaryInfo.offScaleAmount!==null){
                let changeInOffScaleAmount = "";
                changeInOffScaleAmount = proposed.salaryInfo.offScaleAmount - current.salaryInfo.offScaleAmount;
                proposedDetails.changeInOffScaleAmount = util.reformatToMoneyDisplayValue(changeInOffScaleAmount);
            }

            proposedDetails.changeInOffScalePercent = "";
            if(proposed.salaryInfo.offScalePercent!==null && current.salaryInfo.offScalePercent!==null){
                let changeInOffScalePercent = "";
                changeInOffScalePercent = proposed.salaryInfo.offScalePercent - current.salaryInfo.offScalePercent;
                proposedDetails.changeInOffScalePercent = parseFloat(Math.round(changeInOffScalePercent * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2)+"%";
            }

            proposedDetails.changeInSalaryAmount = util.reformatToMoneyDisplayValue(proposed.salaryInfo.changeInSalaryAmount);
            proposedDetails.changeInSalaryPercent = proposed.salaryInfo.changeInSalaryPercent!==null ?
      parseFloat(Math.round(proposed.salaryInfo.changeInSalaryPercent * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2)+"%" : "";
            //proposedDetails.thresholdAmt = util.reformatToMoneyDisplayValue(proposed.salaryInfo.thresholdAmt);
          proposedDetails.thresholdAmt = proposed.salaryInfo.onScaleSalary !==null ? util.reformatToMoneyDisplayValue(Math.round((proposed.salaryInfo.onScaleSalary +(proposed.salaryInfo.onScaleSalary * (current.salaryInfo.offScalePercent!==null ?
        parseFloat(Math.round(current.salaryInfo.offScalePercent * Math.pow(10, 2)) /Math.pow(10,2)) : "")/100))/100)*100) : "";
        }

        this.setState({shouldDisplay, fullName, currentDetails, proposedDetails});
    }

    render() {
        let {state: {shouldDisplay, fullName, currentDetails, proposedDetails}} = this;

        return (
      <div>
        <h1>Off-Scale Report</h1>
        <hr/>
        <HideIf hide={!shouldDisplay}>
          <table className=' table table-bordered table-responsive'>
            <thead>
              <tr>
                <th className={" padding-8 col-md-6 "}>
                  Current Series, Rank & Step
                </th>
                <th className={" padding-8 col-md-3 "}>
                  Payroll Salary
                </th>
                <th className={" padding-8 col-md-3 "}>
                  On-Scale Salary
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={" padding-8 data-column col-md-6 "}>
                  {currentDetails.seriesRankStep ? currentDetails.seriesRankStep : <br/>}
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {currentDetails.salary ? currentDetails.salary : <br/>}
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {currentDetails.onScaleSalary ? currentDetails.onScaleSalary : <br/>}
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th className={" padding-8 col-md-6 "}>
                  Proposed Series, Rank & Step
                </th>
                <th className={" padding-8 col-md-3 "}>
                  Proposed Salary
                </th>
                <th className={" padding-8 col-md-3 "}>
                  On-Scale Salary
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td className={" padding-8 data-column col-md-6 "}>
                {proposedDetails.seriesRankStep ? proposedDetails.seriesRankStep : <br/>}
              </td>
              <td className={" padding-8 data-column col-md-3 "}>
                {proposedDetails.salary ? proposedDetails.salary : <br/>}
              </td>
              <td className={" padding-8 data-column col-md-3 "}>
                {proposedDetails.onScaleSalary ? proposedDetails.onScaleSalary : <br/>}
              </td>
              </tr>
            </tbody>
          </table>
        </HideIf>

        <HideIf hide={!shouldDisplay}>
          <table className=' table table-bordered table-responsive'>
            <thead>
              <tr>
                <th className={" padding-8 col-md-6 "}>
                  Calculation
                </th>
                <th className={" padding-8 col-md-3 "}>
                  Percentage
                </th>
                <th className={" padding-8 col-md-3 "}>
                  Dollars
                </th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td className={" padding-8 data-column col-md-6 "}>
                Current Off-Scale
              </td>
              <td className={" padding-8 data-column col-md-3 "}>
                {currentDetails.offScalePercent}
              </td>
              <td className={" padding-8 data-column col-md-3 "}>
                {currentDetails.offScaleAmount}
              </td>
            </tr>
              <tr>
                <td className={" padding-8 data-column col-md-6 "}>
                  Proposed Off-Scale
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.offScalePercent}
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.offScaleAmount}
                </td>
              </tr>
              <tr>
                <td className={" padding-8 data-column col-md-6 "}>
                  Change in Off-Scale
                  <ToolTip text={descriptions.change_in_off_scale}/>
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.changeInOffScalePercent}
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.changeInOffScaleAmount}
                </td>
              </tr>
              <tr>
                <td className={" padding-8 data-column col-md-6 "}>
                  Overall proposed increase in salary
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.changeInSalaryPercent}
                </td>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.changeInSalaryAmount}
                </td>
              </tr>
              <tr>
                <td className={" padding-8 data-column col-md-6 "}>
                  <b>Maximum salary threshold without further justification</b>
                  <ToolTip text={descriptions.max_salary_thresh}/>
                </td>
                <td className={" padding-8 data-column col-md-3 "}/>
                <td className={" padding-8 data-column col-md-3 "}>
                  {proposedDetails.thresholdAmt}
                </td>
              </tr>
            </tbody>
          </table>
        </HideIf>

        <ShowIf show={!shouldDisplay}>
          <div>
            The Offscale Report is not available for this appointment.
            The report is only displayed for the primary appointment.
            We do not display the report if the primary appointment is paid through the Health Science Compensation Plan,
            or if the person participates in the Negotiated Salary Trial Program.
          </div>
        </ShowIf>

        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
