import React from "react";
import PropTypes from "prop-types";

//My imports
import ExcellenceClock from "./ExcellenceClockTable.jsx";
import ExcellenceLogic from "../../../opus-logic/datatables/classes/ExcellenceClock";
import APIResponseModal from "../../common/components/bootstrap/APIResponseModal.jsx";
import FixedRoleDisplay from "../../common/helpers/FixedRoleDisplay.jsx";


/******************************************************************************
 *
 * @desc - Excellence clock wrapper for multiple tables
 *
 ******************************************************************************/
export default class ExcellenceClockPage extends React.Component {

  /**
   *
   * @desc - Props
   *
   **/
    static propTypes = {
        opusPersonId: PropTypes.string
    };

  /**
   *
   * @desc - Initialize the page
   * @param {Object} props - opusPersonId, adminData, globalData, config_name
   * @return {void}
   *
   **/
    constructor(props = {}) {
        super(props);
    }

  /**
   *
   * @desc - Class variables
   *
   **/
    state = {
        ...this.state,
        ahPathIDs: []
    }

  /**
   *
   * @desc - Render the page, get the data
   * @return {void}
   *
   **/
    componentWillMount() {
        this.initPage(this.props);
    }

    Logic = new ExcellenceLogic(this.props);


  /**
   *
   * @desc - Get the rowData for multiple tables if they have different ahPathIDs
   *  Group them and render multiple tables
   * @return {void}
   *
   **/
    async initPage() {
    //Extract opusPersonId to set for Logic class to make API calls
        let {opusPersonId, profileAPIData: {opusPersonContAppArchived}} = this.props;
        this.Logic.setClassData({opusPersonId});

        let archiveMessage = this.Logic.getArchivedMessage(opusPersonContAppArchived);

    //Get all rows
        let failurePromise = this.Logic.getFormattedRowDataFromServer();
        this.setState({failurePromise});


        let originalRowData = await failurePromise;

    //Separate them by ahPathIDs
        let {dataByAHPathID, ahPathIDs} = this.Logic.getTableDataByAHPathId(originalRowData);

    //Set in state and render the table(s)
        this.setState({archiveMessage, ahPathIDs, dataByAHPathID});
    }

  /**
   *
   * @desc - Render tables(s)
   * @return {JSX}
   *
   **/
    render() {
        let {ahPathIDs, dataByAHPathID, failurePromise} = this.state;
        return (
      <div>
        <APIResponseModal {...{failurePromise}} />
        <h2>Excellence Review Clock</h2>
        <p className="instructions"> This table displays service accrued
          toward pre six-year service to determine when the appointee is due
          for their 4th year increase, needs assessment and excellence review.
        </p>
        <p>{this.state.archiveMessage}</p>
        {ahPathIDs.map(ahPathID =>
          <div key={ahPathID}>
            <h3>{dataByAHPathID[ahPathID].departmentName + " - " + dataByAHPathID[ahPathID].affiliation}</h3>
            <ExcellenceClock key={ahPathID} {...{...this.props,
              rowData: dataByAHPathID[ahPathID].rowData,
              maxRowCount: dataByAHPathID[ahPathID].maxRowCount}}/>
          </div>
        )}
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
    }
}
