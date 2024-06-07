import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";

/**
*
* Local Imports
*
**/
import { Table, Button } from "react-bootstrap";
import * as util from "../../../opus-logic/common/helpers/";
import {Cell} from "fixed-data-table-2";
import {cssSortClassNames} from "../../datatables/constants/DatatableConstants";
import Permissions from "../../../opus-logic/common/modules/Permissions";
import DashboardAlertLogic from "../../../opus-logic/cases/classes/dashboard-alert/DashboardAlert";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";
import Modal, { Header, Title, Body, Dismiss, Footer } from
  "../../common/components/bootstrap/ReactBootstrapModal.jsx";
import { ShowIf } from "../../common/components/elements/DisplayIf.jsx";
import {DateField} from "../../common/components/forms/DateField.jsx";
import APIResponseModal from "../../common/components/bootstrap/APIResponseModal.jsx";

export default class DashboardAlert extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
    static propTypes = {
        Page: PropTypes.func,
        dashboardAlertAPIData: PropTypes.object,
        adminData: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        dateFormat: PropTypes.string,
        originalDateFormat: PropTypes.string,
    };
    static defaultProps = {
        onBlur: () =>{},
        onChange: () => {},
        dateFormat: "MM/DD/YYYY",
        dashboardAlertAPIData: {},
        setDashboardAlertApiDataInGlobalState: () => {
            console.error("You have no state management function for this call!");
        }
    };

  /**
   *
   * @desc - Set it all off
   * @return {void}
   *
   **/
    constructor(props = {}) {
        super(props);
        this.attachClassVariables();
    }

  /**
   *
   * @desc - Instance variables
   *
   **/
    state = {
        dashboardAlertDisplays: [],
        dashboardAlertAPIData: {}
    };

  /**
   *
   * @desc - When component will be rendered Get args needed to run the page
   * @return {void}
   *
   **/
    componentWillMount() {
        this.getDashboardAlertsAPIData();
    }

  //Component imports
    datePatternToRegex = {
        "MM/DD/YYYY": /^\d{2}([.\/-])\d{2}\1\d{4}$/,
        "DD/MM/YYYY": /^\d{2}([.\/-])\d{2}\1\d{4}$/,
        "YYYY/DD/MM": /^\d{4}([.\/-])\d{2}\1\d{2}$/,
        "YYYY/MM/DD": /^\d{4}([.\/-])\d{2}\1\d{2}$/,
        "YYYY-MM-DD": /^\d{4}([.\/-])\d{2}\1\d{2}$/
    };

  //Class variables
    Permissions = new Permissions(this.props.adminData);
    Logic = new DashboardAlertLogic(this.props);

  /**
   *
   * @desc - Makes api call to get data from dashboard alert api
   * @return {void}
   *
   **/
    async getDashboardAlertsAPIData(dashboardAlertDisplays) {
        let dashboardAlertAPIData = dashboardAlertDisplays;
        if(!dashboardAlertDisplays){
            dashboardAlertAPIData = await this.Logic.getDashboardAlerts();
            console.log(dashboardAlertAPIData);
        }
        console.log(dashboardAlertAPIData);
        this.setState({dashboardAlertAPIData, showHeader: true });
        this.getDisplayData(dashboardAlertAPIData);
    //Set it in global state
        this.props.setDashboardAlertApiDataInGlobalState(dashboardAlertAPIData);
    }

  /**
   *
   * @desc - Get dashboard alert display fields from dashboard alert data
   * @param {Array} permissions - array of permissions data
   * @param {String} typeOfAction - string that determines what state to save in at the end
   *
   **/
    getDisplayData(dashboardAlert) {
        let dashboardAlertDisplay = [];
        for (let each of dashboardAlert) {
            let dashboardAlertObject = {};
            dashboardAlertObject.alertId = each.alertId;
            console.log("In Seting values to display on Alerts UI");
            dashboardAlertObject.alertOnOff = each.alertOnOff;
            dashboardAlertObject.dashboard = each.dashboard;
            dashboardAlertObject.alertTitle = each.alertTitle;
            dashboardAlertObject.alertText = each.alertText;
            if (each.alertExpiryDt === "01/01/1900") {
                dashboardAlertObject.alertExpiryDt = "";
            } else {
                dashboardAlertObject.alertExpiryDt = each.alertExpiryDt;
            }
            dashboardAlertDisplay.push(dashboardAlertObject);
        }
        this.setState({ dashboardAlertDisplays: dashboardAlertDisplay });
    }

  /**
   *
   * @desc -
   * @return {void}
   *
   **/
    attachClassVariables() {
        let {value, dateFormat, minDate, maxDate} = this.props;
        let args = {...this.state, value, dateFormat, minDate: moment(minDate),
      maxDate: moment(maxDate)};
        let {isFirefox} = util.detectBrowser();
    //If date lets set that date to the dropdown
        args.datePickerValue = value ? moment(value, dateFormat) : null;

        this.state = args;
    // this.setDatePicker = this.setDatePicker.bind(this);
    // this.handleDatePicker = this.handleDatePicker.bind(this);
        this.nonMozillaArgs = isFirefox ? {} : {showMonthDropdown: true,
      showYearDropdown: true};
    }


  /**
   *
   * @desc - Need to format date for DatePicker
   * @param {Object} - args
   * @return {Bool}
   *
   **/
    formatDateOnload(dashboardAlertDisplays) {
        let {originalDateFormat, dateFormat} = this.props;
        let transformDate = originalDateFormat || dateFormat;
        let regexPattern = this.datePatternToRegex[transformDate];
        for (let each of dashboardAlertDisplays) {
            let value = each.alertExpiryDt;
            if(value !== "") {
                each.alertExpiryDt = moment(value, transformDate);
            } else {
                each.alertExpiryDt = "";
            }
        }
    }

  /**
   *
   * @desc - Update the value
   * @param {Object} alertIndex -
   * @param {Event} event -
   * @return {void}
   *
   **/
    onAlertCheck = (alertIndex, event) => {
        let checked = event.target.checked;
        let dashboardAlertDisplays = this.state.dashboardAlertDisplays;
        if(checked){
            dashboardAlertDisplays[alertIndex].alertOnOff = true;
        }else{
            dashboardAlertDisplays[alertIndex].alertOnOff = false;
        }
        this.setState({dashboardAlertDisplays});
    }

  /**
   *
   * @desc - Update the value
   * @param {Object} alertIndex -
   * @param {Event} event -
   * @return {void}
   *
   **/
    setDatePicker = (alertIndex, event) => {
        let dashboardAlertDisplays = this.state.dashboardAlertDisplays;
        let value = event._d;
        let isValid = moment(value).isValid();
        if(isValid) {//Update the element
            value = moment(value).format(this.props.dateFormat);
            dashboardAlertDisplays[alertIndex].alertExpiryDt = value;
            this.setState({dashboardAlertDisplays});
        } else {
            dashboardAlertDisplays[alertIndex].alertExpiryDt = "";
            this.setState({dashboardAlertDisplays});
        }

    }

  /**
  *
  * @desc - changes alertTitle or alertText values
  * @param {String} value
  * @param {String} name
  * @param {Integer} index - index of dashboardalert
  * @return {void}
  *
  **/
    onTextChange = (value, index) => {
        let dashboardAlertDisplays = this.state.dashboardAlertDisplays;
        dashboardAlertDisplays[index].alertText = value;
        this.setState({dashboardAlertDisplays});
    }

  /**
  *
  * @desc - changes alertTitle or alertText values
  * @param {String} value
  * @param {String} name
  * @param {Integer} index - index of dashboardalert
  * @return {void}
  *
  **/
    onTitleChange = (value, index) => {
        let dashboardAlertDisplays = this.state.dashboardAlertDisplays;
        dashboardAlertDisplays[index].alertTitle = value;
        this.setState({dashboardAlertDisplays});
    }

  /**
  *
  * @desc - actual save function
  * @param {Array} dashboardAlert - Array of alerts to save
  * @return {void}
  *
  **/
    saveAlerts = async () => {
        let dashboardAlertDisplays = this.state.dashboardAlertDisplays;
        for (let each of dashboardAlertDisplays) {
            each.opusLastUpdatedById = this.props.adminData.adminName;
            console.log("In Saving Alerts");
            console.log(each.alertOnOff);
        }

        console.log(this.props.adminData.adminName);
        let apiPromise = this.Logic.saveDashboardAlertsUrl(dashboardAlertDisplays,
      this.props.access_token);

      //Catch the promise so execution is not stopped if it has failed
        try {
            await apiPromise;
        } catch(e) {
            console.log("ERROR: api call in 'saveAlerts' in DashboardAlert.jsx");
            console.log(e);
        }
        this.getDashboardAlertsAPIData(dashboardAlertDisplays);

        this.setState({apiPromise});
    }


    displayDashboardAlertsData() {
        let { dashboardAlertDisplays } = this.state;
        this.formatDateOnload(dashboardAlertDisplays);
        return (
      <div className=" datatable_root ">
        <Table bordered responsive>
          <thead>
            <tr>
              <th>On/Off</th>
              <th>Dashboard</th>
              <th>Alert Title</th>
              <th>Alert Text</th>
              <th>Expires On</th>
            </tr>
          </thead>
          {dashboardAlertDisplays.map((dashboardAlert, alertIndex) =>
            <tbody key={"alert"+dashboardAlert.alertId}>
              <tr>
                <td width="50">
                  <span>
                    <input type="checkbox" name="alertOnOff" checked={!!dashboardAlert.alertOnOff} onChange={(e) => this.onAlertCheck(alertIndex, e)} />
                  </span>
                </td>
                <td width="200">
                  <span>
                    {dashboardAlert.dashboard}
                  </span>
                </td>
                <td width="300">
                  <span>
                    <textarea className={" form-control comment-modal-field "} name="alertTitle" maxLength="99" onChange={(e) => this.onTitleChange(e.target.value, alertIndex)} defaultValue={dashboardAlert.alertTitle} />
                  </span>
                </td>
                <td width="500">
                  <span>
                    <textarea className={" form-control comment-modal-field "} name="alertText" maxLength="999" onChange={(e) => this.onTextChange(e.target.value, alertIndex)} defaultValue={dashboardAlert.alertText} />
                  </span>
                </td>
                <td width="150">
                  <span>
                  <DatePicker className=" form-control "  name="alertExpiryDt"
                    dropdownMode="select" onChange={(e) => this.setDatePicker(alertIndex, e)} {...this.nonMozillaArgs}
                    //onChangeRaw={this.handleDatePicker}
                    selected={dashboardAlert.alertExpiryDt}
                    // selected={this.props.value}
                    disabledKeyboardNavigation scrollableYearDropdown
                  />
                  </span>
                </td>
              </tr>
            </tbody>
          )}
        </Table>

        <div className="row">
          <div className="col-md-2">
            <button className="btn btn-primary hidden-print small table-top" onClick={() => this.saveAlerts()}>
              Save
            </button>
          </div>
        </div>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }

  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
    render() {
        let { state: { showHeader, failurePromise, apiPromise } } = this;
        return (
      <ShowIf show={showHeader}>
        <span>
          <APIResponseModal {...{failurePromise}} promise={apiPromise} />
          {this.displayDashboardAlertsData()}
        </span>
      </ShowIf>
    );
    }

}
