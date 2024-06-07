import React from 'react';
import PropTypes from 'prop-types';

/**
*
* Local Imports
*
**/
import { Table, Button } from 'react-bootstrap';
import * as util from '../../../opus-logic/common/helpers/';
import {Cell} from 'fixed-data-table-2';
import {cssSortClassNames} from '../../datatables/constants/DatatableConstants';
import Permissions from '../../../opus-logic/common/modules/Permissions';
import QuartzJobLogic from '../../../opus-logic/cases/classes/quartz-job/QuartzJob';
import Modal, { Header, Title, Body, Dismiss, Footer } from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import { ShowIf } from '../../common/components/elements/DisplayIf.jsx';
import APIResponseModal from '../../common/components/bootstrap/APIResponseModal.jsx';

export default class QuartzJob extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
  static propTypes = {
    Page: PropTypes.func,
    quartzJobAPIData: PropTypes.object,
    adminData: PropTypes.object.isRequired,
    onChange: PropTypes.func
  };
  static defaultProps = {
    onChange: () => {},
    quartzJobAPIData: {},
    setQuartzJobApiDataInGlobalState: () => {
      console.error('You have no state management function for this call!');
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
  }

  /**
   *
   * @desc - Instance variables
   *
   **/
  state = {
    dailyJobDisplays: [],
    weeklyJobDisplays: [],
    yearlyJobDisplays: [],
    quartzJobAPIData: {}
  };

  /**
   *
   * @desc - When component will be rendered Get args needed to run the page
   * @return {void}
   *
   **/
  componentWillMount() {
    console.log("QuartzJobPage");
      this.getQuartzJobAPIData();
  }

  //Class variables
  Permissions = new Permissions(this.props.adminData);
  Logic = new QuartzJobLogic(this.props);

  /**
   *
   * @desc - Makes api call to get data from dashboard alert api
   * @return {void}
   *
   **/
  async getQuartzJobAPIData(quartzJobDisplays) {
    let quartzJobAPIData = quartzJobDisplays;
    if(!quartzJobDisplays){
      quartzJobAPIData = await this.Logic.getQuartzJobInfo();
      console.log(quartzJobAPIData)
    }
    console.log(quartzJobAPIData)
    this.setState({quartzJobAPIData, showHeader: true });
    this.getDailyJobDisplayData(quartzJobAPIData.dailyJobList);
    this.getWeeklyJobDisplayData(quartzJobAPIData.weeklyJobList);
    this.getYearlyJobDisplayData(quartzJobAPIData.yearlyJobList);
    //Set it in global state
    this.props.setQuartzJobApiDataInGlobalState(quartzJobAPIData);
  }

  /**
   *
   * @desc - Get quartz job display fields from daily quartz job data
   * @param {Array} permissions - array of permissions data
   * @param {String} typeOfAction - string that determines what state to save in at the end
   *
   **/
  getDailyJobDisplayData(dailyQuartzJob) {
    let quartzJobDisplay = [];
      for (let each of dailyQuartzJob) {
        let quartzJobObject = {};
        quartzJobObject.jobId = each.jobId;
        quartzJobObject.jobName = each.jobName;
        quartzJobObject.jobDisplayName = each.jobDisplayName;
        quartzJobObject.jobSmallText = each.jobSmallText;
        quartzJobObject.jobLongText = each.jobLongText;
        quartzJobObject.jobFrequency = each.jobFrequency;
        quartzJobObject.jobScheduleTime = each.jobScheduleTime;
        quartzJobObject.jobOnOff = each.jobOnOff;
        quartzJobDisplay.push(quartzJobObject);
      }
      this.setState({ dailyJobDisplays: quartzJobDisplay })
  }

  getWeeklyJobDisplayData(weeklyQuartzJob) {
    let quartzJobDisplay = [];
      for (let each of weeklyQuartzJob) {
        let quartzJobObject = {};
        quartzJobObject.jobId = each.jobId;
        quartzJobObject.jobName = each.jobName;
        quartzJobObject.jobDisplayName = each.jobDisplayName;
        quartzJobObject.jobSmallText = each.jobSmallText;
        quartzJobObject.jobLongText = each.jobLongText;
        quartzJobObject.jobFrequency = each.jobFrequency;
        quartzJobObject.jobScheduleTime = each.jobScheduleTime;
        quartzJobObject.jobOnOff = each.jobOnOff;
        quartzJobDisplay.push(quartzJobObject);
      }
      this.setState({ weeklyJobDisplays: quartzJobDisplay })
  }

  getYearlyJobDisplayData(yearlyQuartzJob) {
    let quartzJobDisplay = [];
      for (let each of yearlyQuartzJob) {
        let quartzJobObject = {};
        quartzJobObject.jobId = each.jobId;
        quartzJobObject.jobName = each.jobName;
        quartzJobObject.jobDisplayName = each.jobDisplayName;
        quartzJobObject.jobSmallText = each.jobSmallText;
        quartzJobObject.jobLongText = each.jobLongText;
        quartzJobObject.jobFrequency = each.jobFrequency;
        quartzJobObject.jobScheduleTime = each.jobScheduleTime;
        quartzJobObject.jobOnOff = each.jobOnOff;
        quartzJobDisplay.push(quartzJobObject);
      }
      this.setState({ yearlyJobDisplays: quartzJobDisplay })
  }

  /**
   *
   * @desc - Update the value
   * @param {Object} alertIndex -
   * @param {Event} event -
   * @return {void}
   *
   **/
  turnJobOnOff = async (quartzJob, event) => {
    let checked = event.target.checked;
    if(checked){
      quartzJob.jobOnOff = true;
    }else{
      quartzJob.jobOnOff = false;
    }
    console.log(quartzJob);
    // Only hit update api if there are something to save
    let apiPromise = this.Logic.turnJobOnOff(quartzJob, this.props.access_token);

    //Catch the promise so execution is not stopped if it has failed
    try {
      await apiPromise;
    } catch (e) {
      console.log(e);
    }
    this.getQuartzJobAPIData();
    this.setState({ apiPromise });
  }

  displayDailyQuartzJobData() {
    let { dailyJobDisplays } = this.state;
    return (

      <table className={` table table-responsive `}>
        <tr>
          <th colspan="4">Daily Jobs</th>
        </tr>
        <tbody>
          {dailyJobDisplays.map((quartzJob, quartzJobIndex) =>
            <tr>
              <td><p className={` small `}> {quartzJob.jobDisplayName}</p></td>
              <td><p className={` small `}> {quartzJob.jobSmallText} </p><p className={` small `}> {quartzJob.jobLongText}</p></td>
              <td><p className={` small `}> {quartzJob.jobScheduleTime}</p></td>
              <td><label className={` switch `}><input type="checkbox" checked={!!quartzJob.jobOnOff} onClick={(e) => this.turnJobOnOff(quartzJob, e)} /><span className={` slider round `} /></label></td>
            </tr>
          )}
          </tbody>
        </table>
    );
  }

  displayWeeklyQuartzJobData() {
    let { weeklyJobDisplays } = this.state;
    return (

      <table className={` table table-responsive `}>
        <tr>
          <th colspan="4">Weekly Jobs</th>
        </tr>
        <tbody>
          {weeklyJobDisplays.map((quartzJob, quartzJobIndex) =>
            <tr>
              <td><p className={` small `}> {quartzJob.jobDisplayName}</p></td>
              <td><p className={` small `}> {quartzJob.jobSmallText} </p><p className={` small `}> {quartzJob.jobLongText}</p></td>
              <td><p className={` small `}> {quartzJob.jobScheduleTime}</p></td>
              <td><label className={` switch `}><input type="checkbox" checked={!!quartzJob.jobOnOff} onClick={(e) => this.turnJobOnOff(quartzJob, e)} /><span className={` slider round `}></span></label></td>
            </tr>
          )}
          </tbody>
        </table>
    );
  }

  displayYearlyQuartzJobData() {
    let { yearlyJobDisplays } = this.state;
    return (

      <table className={` table table-responsive `}>
        <tr>
          <th colspan="4">Yearly Jobs</th>
        </tr>
        <tbody>
          {yearlyJobDisplays.map((quartzJob, quartzJobIndex) =>
            <tr>
              <td><p className={` small `}> {quartzJob.jobDisplayName}</p></td>
              <td><p className={` small `}> {quartzJob.jobSmallText} </p><p className={` small `}> {quartzJob.jobLongText}</p></td>
              <td><p className={` small `}> {quartzJob.jobScheduleTime}</p></td>
              <td><label className={` switch `}><input type="checkbox" checked={!!quartzJob.jobOnOff} onClick={(e) => this.turnJobOnOff(quartzJob, e)} /><span className={` slider round `}></span></label></td>
            </tr>
          )}
          </tbody>
        </table>
    );
  }

  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
  render() {
    let { state: {failurePromise, apiPromise } } = this;
    return (
        <span>
          <APIResponseModal {...{failurePromise}} promise={apiPromise} />
          {this.displayDailyQuartzJobData()}
          {this.displayWeeklyQuartzJobData()}
          {this.displayYearlyQuartzJobData()}
        </span>
    );
  }

}
