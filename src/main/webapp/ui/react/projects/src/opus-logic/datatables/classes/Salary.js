import DataTable from "./DataTable";
import * as util from "../../common/helpers/";
import Permissions from "../../common/modules/Permissions";

/******************************************************************************
 *
 * @desc - Salary
 *
 ******************************************************************************/

export default class Salary extends DataTable {

  /**
   *
   * @desc -
   * @param {Object}
   *
   **/
    constructor(args = {}) {
        super(args);

        this.startLogic(args);
        this.Permissions = new Permissions(adminData);
        this.canViewSalaryTabs();
    }

  /**
   *
   * @desc - Everyone except DA, CAP and Chair cannot see salary report tabs
   * @desc - Jira #3128 4/27/20
   **/
    canViewSalaryTabs() {
        let {isCAP, isDA, isAA, isChair} = this.Permissions;
    // Jira #3128 Added Area Admin as exception
        if(!isCAP && !isDA && !isChair && !isAA){
            document.getElementById("salaryTabs").style.display = "block";
        }
    }

  /**
   *
   * @desc - Come here to do special stuff to Salary Report table data
   * @param {Array} rowData - array of row table data
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
    configureAPITableData(rowData = []) {
        let formattedRowData = super.configureAPITableData(rowData);
    // formattedRowData = this.changeOffScalePercentFromStringToInteger(formattedRowData);
        return formattedRowData;
    }

  /**
   *
   * @desc - get filters for salary report
   * @param {Object} dataTableConfiguration - dataTableConfiguration
   *
   **/
    async getFilters(dataTableConfiguration = this.dataTableConfiguration) {
        let {pageName} = dataTableConfiguration;
        let {grouperPathText, access_token, adminData} = this;
        let urlParameters = {grouperPathText, pageName, access_token,
        loggedInOpusId: adminData.adminOpusId, opusScreenName: dataTableConfiguration.pageName};
        let url = dataTableConfiguration.filtersUrl;
        let resultsPromise = util.fetchJson(url, urlParameters);
        this.filterViews = await resultsPromise;
    }

  /**
   *
   * @desc - Hijack rowData and change the changeInOffScalePercent field from
   *        string to integer to sort correctly in datatable
   *        If it is null, it stays as null
   *        If it is a string representing a number, it gets changed into an integer
   *        If it comes as a blank string, change to null to keep it consistent and sort correctly
   * @param {Array} rowData - array of row table data
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
    changeOffScalePercentFromStringToInteger(rowData){
        for(let each in rowData){
            if(rowData[each].changeInOffScalePercent
        && rowData[each].changeInOffScalePercent !== ""){
                rowData[each].changeInOffScalePercent = parseInt(rowData[each].changeInOffScalePercent, 10);
            }else if(rowData[each].changeInOffScalePercent === ""){
                rowData[each].changeInOffScalePercent = null;
            }
            if(rowData[each].approvedChangeInOffScalePercent
        && rowData[each].approvedChangeInOffScalePercent !== ""){
                rowData[each].approvedChangeInOffScalePercent = parseInt(rowData[each].approvedChangeInOffScalePercent, 10);
            }else if(rowData[each].approvedChangeInOffScalePercent === ""){
                rowData[each].approvedChangeInOffScalePercent = null;
            }
        }
        return rowData;
    }

  /**
   * reconcileColumnValuesFromServerData - Main function to be used that will
   *  reconcile how the object is stored or 'flattened' from the server so it
   *  can be shown best in the UI datatable
   *
   * @desc - Fill in the column defaults and select options
   * @param
   * @param
   *
   **/
    reconcileRowValuesFromServerData(row, {columnConfiguration = {}, columnKeys = []}) {
        let formattedRowData = super.reconcileRowValuesFromServerData(row, {
            columnConfiguration, columnKeys});
        let {appointeeInfo, appointmentInfo, approvedAppointmentInfo, proposedAppointmentInfo} = row;

        return {
            appointeeInfo,
            appointmentInfo,
            approvedAppointmentInfo,
            proposedAppointmentInfo,
            ...appointeeInfo,
            ...appointmentInfo,
            ...approvedAppointmentInfo,
            ...proposedAppointmentInfo,
            ...row, //affiliation, approvedChangeInOffScaleAmount, approvedChangeInOffScalePercent,
      //changeInOffScaleAmount, changeInOffScalePercent, lastAdvancementActionEffectiveDt
            ...formattedRowData
        };
    }

}
