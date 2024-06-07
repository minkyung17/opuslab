import React from 'react';
import PropTypes from 'prop-types';

//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../common/components/bootstrap/ReactBootstrapModal.jsx';

/******************************************************************************
 *
 * @desc - Merge Records modal
 *
 ******************************************************************************/
export default class MergeRecordsModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
  static propTypes = {
    mergeRecords: PropTypes.func
  }

  static defaultProps = {

  }

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Modal
   *
   **/
  constructor(props = {}) {
    super(props);
    this.addToMergingRecords = this.addToMergingRecords.bind(this);
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    mergeData: {},
    fuzzyMatches: [],
    mergingRecords: [],
    clickedNoDoNotMergeRecords: false,
    isMergeRecordsButtonsDisabled: false,
    hasMoreThanOneFuzzyMatch: true
  };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
  componentWillReceiveProps(props) {
    this.setState({
      mergeData: props.mergeData,
      showMergeRecordsModal: props.showMergeRecordsModal,
      clickedNoDoNotMergeRecords: false,
      isMergeRecordsButtonsDisabled: false,
      displayName: props.displayName
    })
    if(props.fuzzyMatches) {
      this.setState({fuzzyMatches: props.fuzzyMatches})
      if(props.fuzzyMatches.length === 1) {
        this.setState({mergingRecords: props.fuzzyMatches[0].appointeeInfo.opusPersonId,
        hasMoreThanOneFuzzyMatch: false})
      }else{
        this.setState({mergingRecords: [],
        hasMoreThanOneFuzzyMatch: true})
      }
    }
  }

  /**
   *
   * @desc - Closes MergeRecordsModal
   * @returns {void}
   *
   **/
  closeMergeRecordsModal = () => {
    this.props.changeStateOfMergeRecordsModal();
    this.setState({mergingRecords: []})
  };

  /**
   *
   * @desc - adds to merging records array
   * @param {evt} - click event info
   * @param {fuzzyMatch} - the fuzzy match the checkbox was clicked from
   * @returns {void}
   *
   **/
  addToMergingRecords = (evt, fuzzyMatch) => {
    let mergingRecords = this.state.mergingRecords;
    if(evt.target.checked){
      mergingRecords.push(fuzzyMatch.appointeeInfo.opusPersonId);
    }else{
      let index = mergingRecords.indexOf(fuzzyMatch.appointeeInfo.opusPersonId);
      if(index> -1){
        mergingRecords.splice(index, 1);
      }
    }
    this.setState({mergingRecords: mergingRecords})
  };

  /**
   *
   * @desc - Merges Records
   * @returns {void}
   *
   **/
  mergeRecords = (selection) => {
    if(selection==="no"){
      this.setState({clickedNoDoNotMergeRecords: true})
    }else {
      this.setState({isMergeRecordsButtonsDisabled: true})
      if(selection==="yes"){
        // hit parent component Merge Logic here
        this.props.mergeRecords("yes", this.state.mergingRecords)
      }else{
        // hit parent component Merge Logic for not merging
        this.props.mergeRecords("no", [])
      }
    }
  };

  /**
   *
   * @desc - Renders the Modal
   * @returns {void}
   *
   **/
  render() {
    let {state: {mergeData, fuzzyMatches, mergingRecords,
    isMergeRecordsButtonsDisabled, showMergeRecordsModal,
    hasMoreThanOneFuzzyMatch, clickedNoDoNotMergeRecords, displayName}} = this;
    return (
      <Modal show={showMergeRecordsModal}
        onHide={this.closeMergeRecordsModal}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title" id="ModalHeader">
          {/* <img src="../images/case.png" className="modal-header-icon" alt="case icon" /> */}
            {/* &nbsp; &nbsp;  */}
            Merge Records
          </h1>
        </Header>
        {clickedNoDoNotMergeRecords ?
          <Body>
            Since these are not the same people, we will create a new Opus record for {displayName}.
            Thank you!
          </Body>
          :
        <Body>
          <p>
            Are these the same people? Would you like to merge their records?
          </p>

          {mergeData.originalData ?
            <div>
              <h2>From UCPath:</h2>
              <p className="indent-45">
                <b>{mergeData.fullName}</b><br/>
                <span className="small">
                  {'UID: ' + mergeData.uid}<br/>
                  {mergeData.originalData.appointeeInfo.officialEmail ?
                    <span>Email: {mergeData.originalData.appointeeInfo.officialEmail}<br/></span>
                  :
                    null
                  }
                  {'Department Code: ' + mergeData.departmentCode}<br/>
                  {'Hire Date: ' + mergeData.displayValue_hireDt}<br/>
                  {'Title Code: ' +mergeData.titleCode}
                  {mergeData.payrollTitle ?
                    <span>: {mergeData.payrollTitle}</span>
                    : null }
                  <br/>
                  {'Employee Type: ' +mergeData.employeeType}
                </span>
              </p>
            </div>
            :
            null
          }

          {fuzzyMatches.length >= 1 ?
            <span>
              <div>
                <h2>From Opus:</h2>
              </div>
              <span>{fuzzyMatches.map((fuzzyMatch, index) =>
                  <div key={index}>

                    {fuzzyMatches.length > 1 ?
                      <input type="checkbox" className="left" name="fuzzyMatch"
                      onChange={(evt) => this.addToMergingRecords(evt, fuzzyMatch)}/>
                    :
                      <p/>
                    }
                    <p className="indent-45">
                      <b>{fuzzyMatch.appointeeInfo.fullName}</b>
                      <br/>
                      <span className="small">
                        {'Recruit Tracking Number: ' + fuzzyMatch.appointeeInfo.jobNumber}<br/>
                        {fuzzyMatch.appointeeInfo.officialEmail ?
                          <span>Email: {fuzzyMatch.appointeeInfo.officialEmail}<br/></span>
                        :
                          null
                        }
                      </span>
                    </p>
                    {fuzzyMatch.appointmentInfoList.map((appointment, appointmentIndex) =>
                      <span key={index + '-' + appointmentIndex} className="small">
                        <p className="indent-45">
                        {'Department Code: ' +appointment.academicHierarchyInfo.departmentCode + ': '
                          + appointment.academicHierarchyInfo.departmentName}<br/>
                        {'Title Code: ' +appointment.titleInformation.titleCode}
                        {appointment.titleInformation.payrollTitle ?
                          <span>: {appointment.titleInformation.payrollTitle}<br/></span>
                          : null}
                        {'Series: ' + appointment.titleInformation.series}<br/>
                        {'Rank: ' + appointment.titleInformation.rank.rankTypeDisplayText}<br/>
                        {'Step: ' + appointment.titleInformation.step.stepName}
                        </p><br/>
                      </span>
                    )}

                  </div>
              )}</span>
            </span>
            :
            <p/>
            }
        </Body>
        }
        <Footer>
          {clickedNoDoNotMergeRecords ?
            <button
              onClick={() => this.mergeRecords("ok")}
              className="left btn btn-primary"
              disabled={isMergeRecordsButtonsDisabled
              && hasMoreThanOneFuzzyMatch}
              >
              OK
            </button>
            :
            <span>
            <button
              onClick={() => this.mergeRecords("yes")}
              className="left btn btn-primary"
              disabled={mergingRecords.length === 0
                || isMergeRecordsButtonsDisabled}
              >
              Yes, Merge Records
            </button>
            <button
              onClick={() => this.mergeRecords("no")}
              className="left btn btn-primary"
              disabled={mergingRecords.length > 0
              && hasMoreThanOneFuzzyMatch}
              >
              No, Do Not Merge Records
            </button>
            </span>
          }
          <Dismiss onClick={this.closeMergeRecordsModal} className=" left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }
}
