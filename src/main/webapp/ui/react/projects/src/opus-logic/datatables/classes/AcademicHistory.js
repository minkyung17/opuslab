import DataTable from "./DataTable";
import FileSaver from "file-saver";
import {get} from "lodash";
import * as util from "../../common/helpers/";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
/******************************************************************************
 *
 * @desc - AcademicHistory
 *
 ******************************************************************************/
export default class AcademicHistory extends DataTable {
  /**
   *
   * @desc -
   * @param {Object} props - inbound props
   * @return {void}
   *
   **/
    constructor(props = {}) {
        super(props);
        this.startLogic(props);
    }

  /**
   *
   * @desc -
   * @param {Object} - inbound props
   * @return {void}
   *
   **/
    startLogic({opusPersonId, ...props} = {}) {
        super.startLogic(props);
        this.setClassData({opusPersonId});
    }

  /**
   *
   * @desc - Formats the url used to get api row data
   * @param {Object} dataTableConfiguration - guess
   * @param {String} opusPersonId - guess
   * @return {String} url - url for api call
   *
   **/
    getRowDataUrl({opusPersonId, prependUrl = "", adminData: {dashboardRole, adminRoles}} = this) {
        return `${prependUrl}/restServices/rest/profile/${opusPersonId}/academicHistory/?loggedInUserRole=${adminRoles.toString()}`;
    }

  /**
 *
 * @desc - Gets key name results for rowData is hidden under
 * @param {Promise} resultsPromise - config for this table
 * @param {Object} dataTableConfiguration - config for this table
 * @return {Array} rowData - rows for datatable
 *
 **/
    async extractRowDataFromServerResultsPromise(resultsPromise,
    {dataTableConfiguration = this.dataTableConfiguration} = {}) {
        let results = await resultsPromise;

    // RE-224 Add checked field for pdf/excel selection
        for(let index in results){
            results[index].uiProps = {
                checked: false
            };
        }
        return results;
    }

  /**
   *
   * @name doesHaveCaseSummaryLink
   * @desc - Check if there should be a case summary link
   * @param - actionCategoryId, actionTypeId, caseId
   * @return {Boolean}
   *
   **/
    doesHaveCaseSummaryLink({actionCategoryId, actionTypeId, caseId} = {}) {
        return !!(actionCategoryId && actionTypeId && caseId);
    }

  /**
   *
   * @name createActionTypeLinkArgs
   * @desc - Add link to go to Case Summary Page
   * @param {Object} caseSummaryBaseUrl - case summary base link
   * @param {Arrays} - actionCategoryId, actionTypeId, caseId
   * @return {String}
   *
   **/
    createActionTypeLinkArgs(caseSummaryBaseUrl, {actionCategoryId, actionTypeId,
    caseId}) {
        let caseSummaryArgs = util.jsonToUrlArgs({actionCategoryId, actionTypeId});
        let link = caseSummaryBaseUrl + `${caseId}&${caseSummaryArgs}`;
        return link;
    }

  /**
   *
   * @desc - Reconciles data
   * @param {Object} row - each row
   * @param {Arrays} - args
   * @return {Object} - flattened data
   *
   **/
    reconcileRowValuesFromServerData(row, ...args) {
        let reconciled = super.reconcileRowValuesFromServerData(row, ...args);

    //Flattens data so its on the first level & is available to show in table
        return {...reconciled, ...row};
    }

  /**
   *
   * @name addActionTypeLinks
   * @desc - Add link to go to Case Summary Page
   * @param {Object} formattedRowData - incoming data without links
   * @param {Arrays} dataTableConfiguration - config for this table
   * @return {Array} formattedRowData - formattedRowData w/ with the case Summary
   *  link IF it should have one
   *
   **/
    addActionTypeLinks(formattedRowData = [], dataTableConfiguration =
    this.dataTableConfiguration) {
        let {editCasesUrl} = dataTableConfiguration;

        for(let row of formattedRowData) {
            let {caseId, actionTypeInfo: {actionCategoryId, actionTypeId}} = row;
            let args = {caseId, actionCategoryId, actionTypeId};
            let doesHaveLink = this.doesHaveCaseSummaryLink(args);
            if(doesHaveLink) {
                row.link = this.createActionTypeLinkArgs(editCasesUrl, args);
            }
        }

        return formattedRowData;
    }

  /**
   *
   * @desc
   * @param {Object} rowData -
   * @param {Object} dataTableConfiguration - Start time
   * @return {Object} formattedRowData - formattedRowData with links
   *
   **/
    configureData(rowData, {dataTableConfiguration = this.dataTableConfiguration} = {}) {
        let formattedRowData = super.configureData(rowData, {dataTableConfiguration});
        this.addActionTypeLinks(formattedRowData, dataTableConfiguration);

        return formattedRowData;
    }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {String} - formatted CSV url
   *
   **/
    getExportToExcelUrl(typeOfReq) {
        let {grouperPathText, access_token, dataTableConfiguration} = this;
        let {exportToExcelBaseUrl: url} = dataTableConfiguration;
        if(typeOfReq==="pdf"){
            url = dataTableConfiguration.exportToPDFBaseUrl;
        }
        let csv_url = this.addAccessTokenAndGrouperToUrl(url, access_token,
      {grouperPathText, addGrouper: false});
        return csv_url;
    }

  /**
   *
   * @desc - adds parameters to csv url
   * @param {String}  - csv_url -> url for pdf/excel
   * @param {Array}  - array -> array that will turn into a string
   * @return {String} - formatted CSV url
   *
   **/
    stringifyArray(array) {
        let string;
        for(let index in array){
            if(index==="0"){
                string = array[index];
            }else{
                string = string+","+array[index];
            }
        }
        return string;
    }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {Promise} - promise for Export To Excel CSV
   *
   **/
    async exportCSV(typeOfReq, selectedRowIndexes, fullName) {
        let csv_url = this.getExportToExcelUrl(typeOfReq);
        let dt = this.dataTableConfiguration;
        let {adminData} = this;
        let rowString = this.stringifyArray(selectedRowIndexes);

    // OPUSDEV-3349 Changed loggedInUserRole from adminData.dashboardRole ("OA") to adminData.adminRoles (["opus_admin"])
        csv_url = csv_url+"&opusPersonId="+this.opusPersonId+"&loggedInUserRole="
      +adminData.adminRoles+"&selectedRows="+rowString;

        let filterVariables = this.getFormattedExcelFilterVariables();
        let stringifiedFilterVariables = JSON.stringify(filterVariables);

        util.print("Current filter variables being sent to "+typeOfReq, filterVariables,
      "Sending request to ", csv_url);

        let promise = util.jqueryPostJson(csv_url, stringifiedFilterVariables);
        let response = await promise;

        let csvCreateFunc, csvArgs;
        let csvData = new Blob([response], {type: "attachment/csv;charset=utf-8;"});
        let {excelFileName = "Academic History - "+fullName+".csv"} = this.dataTableConfiguration;
        csvArgs = [csvData, excelFileName];
        let {msSaveBlob} = navigator;
        msSaveBlob = msSaveBlob ? msSaveBlob.bind(navigator) : null;
        csvCreateFunc = msSaveBlob ? msSaveBlob : FileSaver.saveAs;

        return csvCreateFunc(...csvArgs);
    }

    exportPDF(selectedRows, appointeeInfo){
        let dt = this.dataTableConfiguration;
        let columnConfig = dt.columnConfiguration;

        let visibleColumnNames = this.getVisibleColumnNames();
        let filterVariables = this.getFormattedExcelFilterVariables();
        let visibleColumns = filterVariables.visibleColumns;
        let header = [];
        let pathsInAPI = [];
        for(let columnName in visibleColumns){
            for(let singleColumnConfig in columnConfig){
        // Find headers and pathsInAPI for table
                if(visibleColumns[columnName]===columnConfig[singleColumnConfig].name){
                    header.push(columnConfig[singleColumnConfig].displayName);
                    pathsInAPI.push(columnConfig[singleColumnConfig].pathsInAPI.appointment.displayText);
                    break;
                }
            }
        }

    // Find row data info
        let mainBody = [];
        for(let singleRow of selectedRows){
            let subBody = [];
            for(let path of pathsInAPI){
                if(path==="appointmentInfo.academicYear"){
                    subBody.push(get(singleRow, path).replace(/\s/g, ""));
                }else if(path==="effectiveDate"){
                    subBody.push(get(singleRow, "displayValue_effectiveDate"));
                }else if(path==="appointmentInfo.salaryInfo.payrollSalary"){
                    subBody.push(get(singleRow, "displayValue_salary"));
                }else if(path==="actionCompletedDate"){
                    subBody.push(get(singleRow, "displayValue_actionCompletedDt"));
                }else if(path==="appointmentInfo.appointmentPctTime"){
                    subBody.push(get(singleRow, "displayValue_appointmentPctTime"));
                }else if(path==="appointmentInfo.appointmentEndDt"){
                    subBody.push(get(singleRow, "displayValue_appointmentEndDt"));
                }else{
                    subBody.push(get(singleRow, path));
                }
            }
            mainBody.push(subBody);
        }
    // console.log(mainBody)

    // let doc = new jsPDF('l');
    // doc.text('Academic History for '+appointeeInfo.fullName, 15, 10, 'left');
    // doc.setFontSize(9);
    // doc.text('UID: '+appointeeInfo.uid+'     '+appointeeInfo.officialEmail, 15, 25, 'left');
    // doc.autoTable({
    //   theme: 'grid',
    //   styles: {
    //     fontSize: 9
    //   // , minCellWidth: 10
    //   },
    //   headStyles: {
    //     fillColor: '#f5f5f5',
    //     textColor: 'black'
    //   },
    //   bodyStyles: {
    //     fillColor: 'white',
    //   },
    //   margin: { top: 40 },
    //   head: [header],
    //   body: mainBody,
    // });
    //
    // doc.save('AcademicHistory-'+this.opusPersonId+'.pdf');

    }

}
