import DataTable from "./DataTable";
import {postJson, jsonToUrlArgs} from "../../common/helpers/index";
import * as util from "../../common/helpers";

/******************************************************************************
 *
 * @desc - SalaryCompensation
 *
 ******************************************************************************/

export default class LinkPathPosition extends DataTable {

  /**
   *
   * @desc -
   * @param {Object}
   *
   **/
    constructor(args = {}) {
        super(args);
        this.startLogic(args);
        this.noMatches = {
            length: 0,
            rowData: []
        };
        this.possibleMatches = {
            length: 0,
            rowData: []
        };
        this.goodMatches = {
            length: 0,
            rowData: []
        };
        this.confirmed = {
            length: 0,
            rowData: []
        };
        this.multiMatch = {
            length: 0,
            rowData: []
        };
        this.maxLinkPathPositionMatches = 0;
    }


  /**
   *
   * @desc - Split incoming data into separate tabs
   * @param {Array} rowData - array of row table data
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
    async getFormattedRowDataFromServer(rowData = [], reset) {
        console.log("in logic class");
        let formattedRowData = await super.getFormattedRowDataFromServer(rowData);
        let noMatches = this.noMatches;
        let possibleMatches = this.possibleMatches;
        let goodMatches = this.goodMatches;
        let confirmed = this.confirmed;
        let multiMatch = this.multiMatch;

        // OPUSDEV-4082 Need to set length to 0 when refresh data from api call
        if(reset){
            noMatches = {rowData: [], length: 0},
            possibleMatches = {rowData: [], length: 0},
            goodMatches = {rowData: [], length: 0},
            confirmed = {rowData: [], length: 0},
            multiMatch = {rowData: [], length: 0};
        }

        for(let each in formattedRowData){
            let match = formattedRowData[each];
            match = this.formatDisplay(match);
            if(match.originalData.tabName==="No Matches"){
                noMatches.length += 1;
                noMatches.rowData.push(match);
            }else if(match.originalData.tabName==="Possible Matches"){
                possibleMatches.length += 1;
                possibleMatches.rowData.push(match);
            }else if(match.originalData.tabName==="Good Match"){
                goodMatches.length += 1;
                goodMatches.rowData.push(match);
            }else if(match.originalData.tabName==="confirmed"){
                confirmed.length += 1;
                confirmed.rowData.push(match);
            }
            if(match.ucPathPosition!=="No UCPath Positions" && match.ucPathPosition.length>1){
                multiMatch.length += 1;
                multiMatch.rowData.push(match);
                if(match.ucPathPosition.length>this.maxLinkPathPositionMatches){
                    this.maxLinkPathPositionMatches = match.ucPathPosition.length;
                }
            }
        }


    // Set the matches to different logic for view to access later
        this.noMatches = noMatches;
        this.possibleMatches = possibleMatches;
        this.goodMatches = goodMatches;
        this.confirmed = confirmed;

    // This is defaulting the initial load data
    // If changing this, dont forget to change the
    // Tabs defaultActiveKey in LinkPathPosition.jsx
        formattedRowData = noMatches.rowData;

        return formattedRowData;
    }

  /**
   *
   * @desc - Format incoming data to display correctly
   * @desc - ucPathPosition comes in separate  by # and @
   * @param {Object} match - match coming in
   * @return {Object} match - reformatted match
   *
   **/
    formatDisplay(match){
        if(match.originalData.tabName==="No Matches"){
            match.ucPathPosition = "No UCPath Positions";
        }else{
            match.uniqueKey = match.originalData.appointeeInfo.opusPersonId+match.originalData.appointmentInfo.appointmentId;
            let radioGroups = [];
            match.ucPathPosition = match.ucPathPosition.split("#");
            for(let index in match.ucPathPosition){
                let position = match.ucPathPosition[index];
                position = position.split("@");
                position[0] = "Position #: " + position[0];
                position[1] = "Dept. Code: " + position[1];
                position[2] = "Title Code: " + position[2];
                if(position[3] && position[3]>=0){
                    position[3] = "FTE: " + Math.round((position[3]*100)).toString() +"%";
                }else{
                    position.splice(3);
                }
                position[4] = "Step: " + position[4];
                position[5] = "Confidence Level: " + position[5];
                radioGroups.push(position);
            }
            match.ucPathPosition = radioGroups;
        }
        let opusApptDisplay = [];
        let data = match.originalData;
        opusApptDisplay.push("Appt ID: " + data.appointmentInfo.appointmentId);
        opusApptDisplay.push("Dept. Code: " + data.appointmentInfo.academicHierarchyInfo.deptCodeAndName);
        opusApptDisplay.push("Title Code: " + data.appointmentInfo.titleInformation.titleName);
    // OPUSDEV-3163 we need to do display Percent Time if 0%
    // if(data.appointmentInfo.appointmentPctTime && data.appointmentInfo.appointmentPctTime>=0){
        opusApptDisplay.push("Percent Time: " + data.appointmentInfo.appointmentPctTime+"%");
        if(null != data.appointmentInfo.locationPercentage1){
            opusApptDisplay.push("Location 1: " + data.appointmentInfo.locationPercentage1);
        }
        if(null != data.appointmentInfo.locationPercentage2){
            opusApptDisplay.push("Location 2: " + data.appointmentInfo.locationPercentage2);
        }
        if(null != data.appointmentInfo.locationPercentage3){
            opusApptDisplay.push("Location 3: " + data.appointmentInfo.locationPercentage3);
        }
        if(null != data.appointmentInfo.locationPercentage4){
            opusApptDisplay.push("Location 4: " + data.appointmentInfo.locationPercentage4);
        }
        if(null != data.appointmentInfo.locationPercentage5){
            opusApptDisplay.push("Location 5: " + data.appointmentInfo.locationPercentage5);
        }
    // }
        opusApptDisplay.push("Step: " + data.appointmentInfo.titleInformation.step.stepName);
        match.opusAppointmentDisplay = opusApptDisplay;

        return match;
    }

  /**
   *
   * @desc -
   * @param {Object} confirmCaseParams - specific parameters
   * @return {String} - full confirm url
   *
   **/

    formatConfirmCaseUrl(confirmCaseParams = {}) {
        let {access_token, grouperPathText} = this;
        let args = jsonToUrlArgs({access_token, grouperPathText, ...confirmCaseParams});
        let {confirmUrl} = this.dataTableConfiguration;
        let url = `${confirmUrl}${args}`;
        return url;
    }

  /**
   *
   * @desc
   * @param {Object} rowData - formatted url with all args for confirm
   * @return {Promise} confirmCasePromise - promise request
   *
   **/
    confirmCase(confirmedCaseParams = {}) {
        let url = this.formatConfirmCaseUrl(confirmedCaseParams);
        let confirmCasePromise = postJson(url);
        return confirmCasePromise;
    }

    /**
     *
     * @desc - Gets job info
     * @param {Promise}  - promise
     *  OPUSDEV-3487 Added access_token, grouperPathText
     *
     **/
    async searchJob(positionNo, emplId) {
        let {grouperPathText, access_token} = this;
        let {getPathPositionInfoUrl} = this.dataTableConfiguration;
        getPathPositionInfoUrl = this.addAccessTokenAndGrouperToUrl(getPathPositionInfoUrl, access_token, {grouperPathText, addGrouper: false});
        getPathPositionInfoUrl = getPathPositionInfoUrl+ "&positionNo=" + positionNo + "&emplId=" + emplId;       
        let result = util.fetchJson(getPathPositionInfoUrl);
        return result;
    }
    /**
     *
     * @desc - Format job results
     * @param {Object} results - The initial unformatted job search results
     * @return {Object} - Formatted results
     *
     **/
    getFormattedResults(results) {
        let datatDisplay = [];
        let displayResults = [];
        for(let each in results)
        {   
            let result = results[each];
            datatDisplay.push("Name: " + result.name);
            datatDisplay.push("Department Code: " + result.deptDesc);
            datatDisplay.push("Job Code: " + result.jobDesc);
            datatDisplay.push("Effective " + result.effectiveDate);
            datatDisplay.push("Ends " + result.endDate);
            displayResults.push(datatDisplay);
        }
        return displayResults;
    }

    /**
     *
     * @desc - Formats url 
     * @param appointmentId
     * @param positionNo
     * @return {Promise} - json request
     *
     **/
    async linkToUCPath(appointmentId, positionNo) {
        let {grouperPathText, access_token} = this;
        let {linktPathPositionUrl} = this.dataTableConfiguration;
        linktPathPositionUrl = this.addAccessTokenAndGrouperToUrl(linktPathPositionUrl, access_token, {grouperPathText, addGrouper: false});
        linktPathPositionUrl = linktPathPositionUrl+ "&positionNo=" + positionNo + "&appointmentId=" + appointmentId;    
        return util.postJson(linktPathPositionUrl);
    }

}
