import {get, pick, omit} from "lodash";

//My imports
import * as util from "../../common/helpers/";
import {fieldsInAPI} from "../constants/FieldDataConstants";

/**
*
* Creates Appointment blocks you see in CaseFlow and Case Summary
* @author - Leon Aburime
* @class AppointmentBlock
*
**/
export default class AppointmentBlock {

    invalid = {null: true, undefined: true};
    allInvalid = {"": true, null: true, undefined: true};
  //RE-319 - Fields must be in this order
    fieldsToShow = ["appointmentPctTime","locationPercentage1","locationPercentage2","locationPercentage3",
    "locationPercentage4","locationPercentage5","series", "rank", "step", "payrollSalary",
    "currentSalaryAmt", "scaleType", "onScaleSalary", "offScalePercent", "apuId",
    "hscpScale0", "hscpScale1to9", "hscpBaseScale", "hscpAddBaseIncrement",
    "startDateAtSeries", "startDateAtRank", "startDateAtStep", "waiverEndDt",
    "appointmentEndDt", "appointmentId"]

  /**
  *
  * @desc - Get formatted title
  * @param {Object} appointment - Appt from which to draw data from
  * @return {String} dept_affiliation_apptstatus_type - formatted title
  *
  **/
    getDeptCodeAffiliationApptStatusTypeTitle(appointment) {
    //Extract specific fields to create this title
        let {affiliationType: {affiliation}, appointmentStatusType,
      academicHierarchyInfo: {departmentName}} = appointment;

    //Some title are too long
        let deptAffilApptStatus = departmentName && affiliation ?
      `${departmentName} - ${affiliation} - ${appointmentStatusType}` : null;

    //Return concatted title
        return deptAffilApptStatus;
    }

  /**
  *
  * @desc - Get concatted title for payroll and titleCode
  * @param {Object} appointment - Appt from which to draw data from
  * @return {String} titleText - titleText
  *
  **/
    getTitleCodePayrollText(appointment = {}) {
        let {titleInformation: {titleCode, payrollTitle}} = appointment;
        let titleText = titleCode && payrollTitle ? `${titleCode} - ${payrollTitle}`
      : null;

        return titleText;
    }

  /**
  *
  * @desc - If value of field is valid get display string
  * @param {Object} field - single field
  * @param {Object} invalid - invalid values to check against
  * @return {String} - display string of field
  *
  **/
    getDisplayTextIfValueIsValid = (field = {}, invalid = this.invalid) =>
    field.value in invalid ? "" : this.getDisplayString(field);
    //this.getDisplayString(field);

  /**
  *
  * @desc - If value of field is valid get display string
  * @param {Object} field - single field
  * @param {Object} invalid - invalid values to check against
  * @return {String} - display string of field
  *
  **/
    getDisplayTextIfDisplayTextIsValid = (field = {}, invalid = this.invalid) =>
    field.displayText in invalid ? "" : this.getDisplayString(field);
    //this.getDisplayString(field);


  /**
  *
  * @desc - displayName and displayText concatted
  * @param {Object} - displayText, displayName
  * @return {String} - display string of field
  *
  **/
    getDisplayString = ({displayText, displayName}) => `${displayName}: ${displayText}`;

  /**
  *
  * @desc - If scaleType doesnt have displayText dont show it
  * @param {Object} fieldData -
  * @param {Object} stringFields -
  * @return {Object} - different string fields with step, appointmentPctTime, rank,
  *   etc
  *
  **/
    adjustScaleTypeField(fieldData, stringFields = {}) {
        if(!fieldData.scaleType || !fieldData.scaleType.displayText) {
            delete stringFields.scaleType;
        }
    }

  /**
  *
  * @desc - get certain formatted fields from fieldData
  * @param {Object} fieldData -
  * @param {Object} invalid - invalid value definitions
  * @return {Object} - different string fields with step, appointmentPctTime, rank,
  *   etc
  *
  **/
    formatApptDisplayFields(fieldData) {
        let {appointment, salary, currentSalaryAmt = salary, apuId = {}} = fieldData;

        let {academicProgramUnit: {apuDesc, apuCode, budgetYear} = {}} = appointment.salaryInfo;
        let apuText = apuId.value in this.invalid ? null :
      `${apuId.displayName} - ${apuCode}: ${apuDesc} - ${budgetYear}`;

        let scaleType = this.getDisplayTextIfDisplayTextIsValid(fieldData.scaleType);
        let step = this.getDisplayTextIfValueIsValid(fieldData.step);
        let rank = this.getDisplayTextIfDisplayTextIsValid(fieldData.rank);
        let series = this.getDisplayTextIfValueIsValid(fieldData.series);
	let locationPercentage1 = this.getDisplayTextIfValueIsValid(fieldData.locationPercentage1);
	let locationPercentage2 = this.getDisplayTextIfValueIsValid(fieldData.locationPercentage2);
	let locationPercentage3 = this.getDisplayTextIfValueIsValid(fieldData.locationPercentage3);
	let locationPercentage4 = this.getDisplayTextIfValueIsValid(fieldData.locationPercentage4);
	let locationPercentage5 = this.getDisplayTextIfValueIsValid(fieldData.locationPercentage5);
        let appointmentPctTime = this.getDisplayTextIfValueIsValid(fieldData.appointmentPctTime);
        let currentSalaryAmtText = this.getDisplayTextIfValueIsValid(currentSalaryAmt);
        let payrollSalary = this.getDisplayTextIfValueIsValid(fieldData.payrollSalary);
        let onScaleSalary = this.getDisplayTextIfValueIsValid(fieldData.onScaleSalary);
        let isValid = !(fieldData.offScalePercent.displayText in {null: true, "": true, undefined: true});
        let isNumber = util.isNumber(fieldData.offScalePercent.displayText);
        if(isValid && isNumber) {
            fieldData.offScalePercent.displayText = parseFloat(Math.round(fieldData.offScalePercent.displayText * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2) + "%";
        }
        let offScalePercent = this.getDisplayTextIfValueIsValid(fieldData.offScalePercent);
        let appointmentEndDt = this.getDisplayTextIfValueIsValid(fieldData.appointmentEndDt);
        let hscpScale1to9 = this.getDisplayTextIfDisplayTextIsValid(fieldData.hscpScale1to9);
        let hscpScale0 = this.getDisplayTextIfValueIsValid(fieldData.hscpScale0);
        let hscpBaseScale = this.getDisplayTextIfValueIsValid(fieldData.hscpBaseScale);
        let startDateAtSeries = this.getDisplayTextIfValueIsValid(fieldData.startDateAtSeries);
        let startDateAtRank = this.getDisplayTextIfValueIsValid(fieldData.startDateAtRank);
        let startDateAtStep = this.getDisplayTextIfValueIsValid(fieldData.startDateAtStep);
        let waiverEndDt = this.getDisplayTextIfValueIsValid(fieldData.waiverEndDt);
        let hscpAddBaseIncrement = this.getDisplayTextIfValueIsValid(fieldData.hscpAddBaseIncrement);
        let appointmentId = this.getDisplayTextIfValueIsValid(fieldData.appointmentId);

        let data = {
	    appointmentPctTime,
	    locationPercentage1,
	    locationPercentage2,
	    locationPercentage3,
	    locationPercentage4,
	    locationPercentage5,
            series,
            rank,
            step,
            payrollSalary,
            currentSalaryAmt: currentSalaryAmtText,
            scaleType,
            onScaleSalary,
            offScalePercent,
            apuId: apuText,
            hscpScale1to9,
            hscpScale0,
            hscpBaseScale,
            hscpAddBaseIncrement,
            startDateAtSeries,
            startDateAtRank,
            startDateAtStep,
            waiverEndDt,
            appointmentEndDt,
            appointmentId
        };

    //If displayText for scaleType is null then dont show scaleType field
        this.adjustScaleTypeField(fieldData, data);

        return data;
    }

  /**
  *
  * @desc - Get the relevant field values to display in appt. sets
  * @param {Array} appointment - appointments to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getClonedApptDisplayData(appointment, fields = this.fieldsToShow) {
    //Clone used to save values
        let clone = pick(util.cloneObject(fieldsInAPI), fields);

    //Iterate through the name fields and get text data and value
        fields.map(name => {
            let {pathsInAPI: {appointment: {displayText, value} = {}} = {}} = fieldsInAPI[name];
            clone[name].value = get(appointment, value);
            clone[name].displayText = get(appointment, displayText);
            this.formatDisplayText(clone[name]);
        });
        clone.appointment = appointment;//Add the appt to use for later

    // OPUSDEV-2654 2/25/19 Wanted step to not display value if N/A
        if(clone.step.displayText==="N/A"){
            delete clone.step;
        }

    // OPUSDEV-3073 2/27/20 Wanted APU ID to not display value if N/A
        if(clone.apuId.value===0){
            delete clone.apuId;
        }
        if(!clone.appointment.academicHierarchyInfo.schoolName==="Medicine"){
            delete clone.locationPercentage1;
	    delete clone.locationPercentage2;
	    delete clone.locationPercentage3;
	    delete clone.locationPercentage4;
	    delete clone.locationPercentage5;
        }
        return clone;
    }

  /**
  *
  * @desc - Change fieldData display to money and percent
  * @param {Object} fieldData - fields to use and show
  * @return {Object} - results of text
  *
  **/
    formatDisplayText(fieldData = {}) {
        if(fieldData.displayType === "money") {
            fieldData.displayText = "$" + util.formatMoney(Number(fieldData.displayText));
        } else if (fieldData.displayType === "percent") {
            fieldData.displayText = fieldData.displayText + "%";
        }
    }

  /**
  *
  * @desc - Get the relevant field values to display in appt. sets
  * @param {Array} appts - appointments to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getDisplayFieldsFromAppointments(appts = []) {
    //Extract values from nested API Object
        let appointments = appts || [];//handles nulls

    //Format appt and get display fields
        let apptFields = appointments.map(appointment => {
      //Clone appointment and get display and value text
            let clonedDisplayBlock = this.getClonedApptDisplayData(appointment);

      //Now format and extract the text
            let apptDisplay = this.formatApptDisplayFields(clonedDisplayBlock);
            let subtitle = this.getTitleCodePayrollText(appointment);
      //let subtitle = this.getFormattedTitle(apptDisplay.titleText);
            let title = this.getDeptCodeAffiliationApptStatusTypeTitle(appointment);
            let list = Object.values(apptDisplay);

            return {fields: apptDisplay, appointment, list, title, subtitle};
        });

        return apptFields;
    }

  /**
  *
  * @desc - Get the relevant field values just for displaying the col-md-6
  * @param {Array} appts - appointments to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getDisplayFieldsFromAppointmentsForDisplayLayout(apptIdsForCase, appts = []) {
    //Extract values from nested API Object
        let appointments = appts || [];//handles nulls

        let apptFields = [];

        for(let i=0; i<appointments.length;i+=2){
            let appt = {};
      //Clone appointment and get display and value text
            let clonedDisplayBlock = this.getClonedApptDisplayData(appointments[i]);

      //Now format and extract the text
            let apptDisplay = this.formatApptDisplayFields(clonedDisplayBlock);
            let subtitle = this.getTitleCodePayrollText(appointments[i]);
      //let subtitle = this.getFormattedTitle(apptDisplay.titleText);
            let title = this.getDeptCodeAffiliationApptStatusTypeTitle(appointments[i]);
            let list = Object.values(apptDisplay);

            appt.subtitle = subtitle;
            appt.title = title;
            appt.list = list;
            appt.apptId = appointments[i].appointmentId;

      // Determine whether to show the suitcase icon or not
      // Jira #2630
            appt.showIcon = false;
            for(let each of apptIdsForCase){
                if(each===appointments[i].appointmentId){
                    appt.showIcon = true;
                }
            }

            if(appointments[i+1]){
        //Clone appointment and get display and value text
                let secondClonedDisplayBlock = this.getClonedApptDisplayData(appointments[i+1]);

        //Now format and extract the text
                let secondApptDisplay = this.formatApptDisplayFields(secondClonedDisplayBlock);
                let secondSubtitle = this.getTitleCodePayrollText(appointments[i+1]);
                let secondTitle = this.getDeptCodeAffiliationApptStatusTypeTitle(appointments[i+1]);
                let secondList = Object.values(secondApptDisplay);

                appt.secondSubtitle = secondSubtitle;
                appt.secondTitle = secondTitle;
                appt.secondList = secondList;
                appt.secondApptId = appointments[i+1].appointmentId;

                appt.secondShowIcon = false;
                for(let each of apptIdsForCase){
                    if(each===appointments[i+1].appointmentId){
                        appt.secondShowIcon = true;
                    }
                }

            }
            apptFields.push(appt);
        }

        return apptFields;
    }
}
