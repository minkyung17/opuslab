import React from 'react';
import PropTypes from 'prop-types';

/*******************************************************************************
*
* @desc - My imports
*
********************************************************************************/
import CaseSummary from '../../../opus-logic/cases/classes/case-summary/CaseSummary';
import CasesDossier from '../../../opus-logic/cases/classes/CasesDossier';
import CaseRecommendations from
  '../../../opus-logic/cases/classes/recommendations/CaseRecommendations';
import * as util from '../../../opus-logic/common/helpers/';
import APIResponseModal, {Failure} from '../../common/components/bootstrap/APIResponseModal.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';
import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import Modal, {Header, Body, Footer, Dismiss} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {Select} from '../../common/components/forms/SelectOption.jsx';
// import {MultipleAppointmentsBlock} from '../components/AppointmentBlocks.jsx';
import {DisplayTable, DisplayTableHeader} from
  '../../common/components/elements/DisplayTables.jsx';
// import {RadioGroup, Radio} from 'react-radio-group';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';

export default class CAPVoteBoard extends React.Component {
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
    this.onSelectVoteBoard = this.onSelectVoteBoard.bind(this);
  }

  /**
  *
  * @desc - Instance variables
  *
  **/
  Logic = new CaseSummary(this.props); //to use the getCasesSummaryData function
  CasesDossierLogic = new CasesDossier(this.props);
  CaseRecommendationsLogic = new CaseRecommendations(this.props);

  /**
  *
  * @desc - State vars
  *
  **/
  state = {
    templates: ['Full CAP', 'CAP - 4th Year Appraisal', 'CAP Subcommittee',
      'CAP Subcommittee - 4th Year Appraisal', 'ClinCAP', 'ClinCAP - 4th Year Appraisal',
      'CAP - 5 Year Review'],
    caseRecommendations: [],
    apptBlockData: [],
    value: 'Full CAP',
    capInfoText: {},
    proposedActionFlagsDisplay: ''
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
    this.getCaseRecommendationsData();
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
    let capInfoText = this.Logic.getCAPInfoText(caseSummaryDataFromAPI);
    let {apptBlockData} = this.Logic.getStartingCaseSummaryData(caseSummaryDataFromAPI);
    // Find out which flagged actions should display and checked
    let actionType = this.Logic.getActionTypeFromActionData(caseSummaryDataFromAPI.actionDataInfo[0])
    let newProposedActionFlagsArray = this.CasesDossierLogic.setProposedActionFlagsDisplayInModal(actionType)

    newProposedActionFlagsArray = this.CasesDossierLogic.setCheckedValueForProposedActionFlags(
      caseSummaryDataFromAPI.actionDataInfo[0], newProposedActionFlagsArray);

    let proposedActionFlagsDisplay = '';
    for(let each in newProposedActionFlagsArray){
      if(newProposedActionFlagsArray[each].shouldDisplay && newProposedActionFlagsArray[each].checked){
        if(proposedActionFlagsDisplay===''){
          proposedActionFlagsDisplay = newProposedActionFlagsArray[each].displayName;
        }else{
          proposedActionFlagsDisplay += ', '+newProposedActionFlagsArray[each].displayName;
        }
      }
    }

   this.setState({capInfoText, apptBlockData, proposedActionFlagsDisplay})
  }

  /**
  *
  * @desc - Get Case Recommendations Data
  *
  **/
  async getCaseRecommendationsData(){
    if(!this.props.caseRecommendationsAPIData){
      let {caseId, actionTypeId, actionCategoryId} = util.getUrlArgs();
      let data = await this.CaseRecommendationsLogic.getAPIData(caseId);
      this.props.setCaseRecommendationsAPIDataInGlobalState(data);
      this.setState({caseRecommendations: data.caseRecommendations})
    }else{
      this.setState({caseRecommendations: this.props.caseRecommendationsAPIData.caseRecommendations})
    }
  }

  /**
  *
  * @desc - Select which vote board to display
  *
  **/
  onSelectVoteBoard(e){
    let value = e.target.value;
    this.setState({value})
  }

  /**
  *
  * @desc - Full CAP Vote Board
  *
  **/
  getFullCAP(){
    return (
      <div>
        <div className='col-md-12 padding-left-0 clearfix'>
          <table className=' table table-bordered table-responsive print-table clearfix'>
            <tbody>
              <tr>
                <td className={` padding-8 label-column col-xs-4 `}>
                  Review Committee (RC)
                </td>
                <td className={` padding-8 data-column col-xs-8 `}>
                  <span className='col-md-6'>
                    <input type="checkbox" name="WithoutRC" value="WORC" checked={false}/>
                      &nbsp; Without RC (WORC)
                  </span>
                  <span className='col-xs-6'>
                    <input type="checkbox" name="RecommendRC" value="RRC" checked={false}/>
                      &nbsp; Recommend RC
                  </span>
                </td>
              </tr>
              <tr>
                <td className={` padding-8 label-column col-xs-4 `}>
                  RC Outcome
                </td>
                <td className={` padding-8 data-column col-xs-8 `}>
                  <span className='col-xs-6'>
                    <input type="checkbox" name="Favorable" value="Fav" checked={false}/>
                      &nbsp; Favorable
                  </span>
                  <span className='col-xs-6'>
                    <input type="checkbox" name="Unfavorable" value="Unfav" checked={false}/>
                      &nbsp; Unfavorable
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        <div className='clearfix'>
        <div className='col-xs-6 padding-left-0 clearfix'>
          <table className=' table table-bordered table-responsive print-table clearfix'>
            <tbody>
              <tr>
                <th className={` padding-8 col-md-7 `}>
                  CAP Vote
                </th>
                <th className={` padding-8 data-column col-md-5 `}/>
              </tr>
              <tr>
                <td className={` padding-8 label-column col-md-7 `}>
                  Favorable
                </td>
                <td className={` padding-8 data-column col-md-5 `}/>
              </tr>
              <tr>
                <td className={` padding-8 label-column col-md-7 `}>
                  Unfavorable
                </td>
                <td className={` padding-8 data-column col-md-5 `}/>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='col-xs-6 clearfix'>
          <table className=' table table-bordered table-responsive print-table clearfix'>
            <tbody>
              <tr>
                <th className={` padding-8 col-md-7 `}>
                  Alt Action / Alt Motion
                </th>
                <th className={` padding-8 data-column col-md-5 `}/>
              </tr>
              <tr>
                <td className={` padding-8 label-column col-md-7 `}>
                  Favorable
                </td>
                <td className={` padding-8 data-column col-md-5 `}/>
              </tr>
              <tr>
                <td className={` padding-8 label-column col-md-7 `}>
                  Unfavorable
                </td>
                <td className={` padding-8 data-column col-md-5 `}/>
              </tr>
            </tbody>
          </table>
        </div>

        </div>
      </div>
  )}

  /**
  *
  * @desc - CAP 4th Year Appraisal Vote Board
  *
  **/
  getCAP4thYearAppraisal(){
    return (
      <div className='col-md-6 padding-left-0'>
        <table className=' table table-bordered table-responsive'>
          <DisplayTableHeader>
            CAP Vote - 4th Year Appraisal
          </DisplayTableHeader>
          <tbody>
            <tr>
              <td className={` padding-8 label-column col-md-8 `}>
                Favorable
              </td>
              <td className={` padding-8 data-column col-md-4 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-8 `}>
                With Reservations
              </td>
              <td className={` padding-8 data-column col-md-4 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-8 `}>
                Unfavorable with Continuation
              </td>
              <td className={` padding-8 data-column col-md-4 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-8 `}>
                Unfavorable
              </td>
              <td className={` padding-8 data-column col-md-4 `}/>
            </tr>
          </tbody>
        </table>
      </div>
  )}

  /**
  *
  * @desc - CAP Subcommittee Vote Board
  *
  **/
  getSubcommittee(){
    return (
      <div className='col-md-12 padding-left-0'>
        <table className=' table table-bordered table-responsive'>
          <DisplayTableHeader colSpan={'4'}>
            CAP Subcommittee
          </DisplayTableHeader>
          <thead>
            <tr>
              <th className={` padding-8 col-md-6 `}>
                CAP Member
              </th>
              <th className={` padding-8 col-md-2 `}>
                Favorable
              </th>
              <th className={` padding-8 col-md-2 `}>
                Unfavorable
              </th>
              <th className={` padding-8 col-md-2 `}>
                Discussion
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={` padding-8 data-column col-md-6 `}><br/></td>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 data-column col-md-6 `}><br/></td>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 data-column col-md-6 `}><br/></td>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
          </tbody>
        </table>
      </div>
  )}

  /**
  *
  * @desc - CAP Subcommittee 4th Year Appraisal Vote Board
  *
  **/
  getSubcommittee4thYearAppraisal(){
    return (
      <div className='col-md-12 padding-left-0'>
        <table className=' table table-bordered table-responsive'>
          <DisplayTableHeader colSpan={'6'}>
            CAP Subcommittee - 4th Year Appraisal
          </DisplayTableHeader>
          <thead>
            <tr>
              <th className={` padding-8 col-md-4 `}>
                CAP Member
              </th>
              <th className={` padding-8 col-md-1 `}>
                Favorable
              </th>
              <th className={` padding-8 col-md-2 `}>
                With Reservations
              </th>
              <th className={` padding-8 col-md-2 `}>
                Unfavorable with Continuation
              </th>
              <th className={` padding-8 col-md-1 `}>
                Unfavorable
              </th>
              <th className={` padding-8 col-md-2 `}>
                Discussion
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={` padding-8 data-column col-md-4 `}><br/></td>
              <td className={` padding-8 data-column col-md-1 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-1 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 data-column col-md-4 `}><br/></td>
              <td className={` padding-8 data-column col-md-1 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-1 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 data-column col-md-4 `}><br/></td>
              <td className={` padding-8 data-column col-md-1 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
              <td className={` padding-8 data-column col-md-1 `}/>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
          </tbody>
        </table>
      </div>
  )}

  /**
  *
  * @desc - ClinCAP Vote Board
  *
  **/
  getClinCAP(){
    return (
      <div className='col-md-4 padding-left-0'>
        <DisplayTable>
          <tbody>
            <tr>
              <th className={` padding-8 col-md-8 `}>
                ClinCAP Vote
              </th>
              <th className={` padding-8 data-column col-md-4 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-8 `}>
                Favorable
              </td>
              <td className={` padding-8 data-column col-md-4 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-8 `}>
                Unfavorable
              </td>
              <td className={` padding-8 data-column col-md-4 `}/>
            </tr>
          </tbody>
        </DisplayTable>
      </div>
  )}

  /**
  *
  * @desc - ClinCAP 4th Year Appraisal Vote Board
  *
  **/
  getClinCAP4thYearAppraisal(){
    return (
      <div className='col-md-5 padding-left-0'>
        <table className=' table table-bordered table-responsive'>
          <DisplayTableHeader>
            ClinCAP - 4th Year Appraisal
          </DisplayTableHeader>
          <tbody>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                Favorable
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                With Reservations
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                Unfavorable with Continuation
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                Unfavorable
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
          </tbody>
        </table>
      </div>
  )}

  /**
  *
  * @desc - CAP 5 Year Review Vote Board
  *
  **/
  getCAP5YearReview(){
    return (
      <div className='col-md-6 padding-left-0'>
        <table className=' table table-bordered table-responsive'>
          <DisplayTableHeader>
            CAP Vote: 5 Year Review
          </DisplayTableHeader>
          <tbody>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                Advancement
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                No Advancement - Performance Satisfactory
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
            <tr>
              <td className={` padding-8 label-column col-md-10 `}>
                No Advancement - Performance Unsatisfactory
              </td>
              <td className={` padding-8 data-column col-md-2 `}/>
            </tr>
          </tbody>
        </table>
      </div>
  )}

  render() {
    let {state: {templates, value, apptBlockData, capInfoText,
      caseRecommendations}} = this;

    return (
      <div className="col-md-12">
        <h1>CAP Vote Board</h1>

        <br></br>

        <form className='form-inline'>
          <div className='form-group'>
            <label className="col-xs-5 padding-left-0">Type of Vote Board:  &nbsp; &nbsp;</label>
              <div className="col-xs-3 padding-left-0">
                <Select {...{value}}
                  extraClass=' input-sm form-control '
                  includeBlankOption={false}
                  options={this.state.templates}
                  onChange={this.onSelectVoteBoard} />
               </div>
            </div>
            <div className="form-group">
              <label className="indent-50">Case Specialist:</label>
              {/* <input type="text" className="form-control input-sm " ></input> */}
            </div>
        </form>



        <div className='col-xs-12 padding-left-0'>
          <p className= " small ">
            {capInfoText.hireDt ? <span>{capInfoText.hireDt}<br/></span> : null}
            {capInfoText.yearsAtCurrentRank ? <span>{capInfoText.yearsAtCurrentRank}<br/></span> : null}
            {capInfoText.yearsAtCurrentStep ? <span>{capInfoText.yearsAtCurrentStep}<br/></span> : null}
            {capInfoText.dateCapReceived ? <span>{capInfoText.dateCapReceived}<br/></span> : null}
            {capInfoText.apoAnalyst ? <span>{capInfoText.apoAnalyst}<br/></span> : null}
          </p>
        </div>
          <br></br>
        <div className='col-xs-10 padding-left-0	'>
          <span className='strong'>Current Appointment</span>
            {apptBlockData.map((appointment, index) => {
            return (
              <div key={index} className='col-xs-12 small padding-left-0'>
                <div className='col-xs-6 padding-left-0'>
                  <div><b>{appointment.title}</b></div>
                  <div>{appointment.subtitle}</div>
                  <div>{appointment.list[0]}</div>
                  <div>{appointment.list[1]}</div>
                  <div>{appointment.list[2]}</div>
                  <div>{appointment.list[3]}</div>
                </div>
                {appointment.secondTitle ?
                  <div className='col-xs-6 padding-left-0'>
                    <div><b>{appointment.secondTitle}</b></div>
                    <div>{appointment.secondSubtitle}</div>
                    <div>{appointment.secondList[0]}</div>
                    <div>{appointment.secondList[1]}</div>
                    <div>{appointment.secondList[2]}</div>
                    <div>{appointment.secondList[3]}</div>
                  </div>
                  :
                  null
                }
                <div className="col-xs-12"><br></br></div>
              </div>
          )})}
        </div>
        <div className='col-xs-12 padding-left-0'>
          <h2>Proposed Appointment</h2>

        <div className='col-md-12 padding-left-0'>

          <div className='col-xs-6 padding-left-0'>
            <table className=' table table-bordered table-responsive'>
                <tbody>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Action Type
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.actionType}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Proposed Effective Date
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.proposedEffectiveDt}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Years Accelerated
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.yearsAccelerated}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Years Deferred
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.yearsDeferred}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Action Flags
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {this.state.proposedActionFlagsDisplay}
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
         </div>

          {capInfoText.showProposedApptTable ?
          <div className='col-xs-6 padding-left-0'>
            <table className=' table table-bordered table-responsive'>
              <DisplayTableHeader>
                {apptBlockData.map((appointment, index) => {
                  return(
                    <span>
                      {index!==0 ?
                        ", "
                        :
                        null
                      }
                      {appointment.title}
                      {appointment.secondTitle ?
                        ", "+appointment.secondTitle
                        :
                        null
                      }
                    </span>
                  )
                })}
              </DisplayTableHeader>
                <tbody>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Title Code
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.titleCode}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Series
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.series}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Rank
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.rank}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Step
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.step}
                    </td>
                  </tr>
                  <tr>
                    <td className={` padding-8 label-column col-md-5 `}>
                      Percent Time
                      <ToolTip text={`The percentage of full time the faculty member will work.
                        For faculty based at affiliate hospitals the percentage entered should be based on actual service rather than pay.`} />
                    </td>
                    <td className={` padding-8 data-column col-md-7 `}>
                      {capInfoText.percentTime}
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
          :
          null
          }
        </div>

        <div className='col-xs-12 padding-left-0'>
          <h2>Recommendations</h2>
          <div className='col-xs-12 padding-left-0'>
            <table className=' table table-bordered table-responsive'>
              <thead>
                <tr>
                  <th className={` padding-8 col-xs-5 `}>
                    Recommender
                  </th>
                  <th className={` padding-8 col-xs-3 `}>
                    Recommendation/Decision
                  </th>
                  <th className={` padding-8 col-xs-4 `}>
                    Comments
                  </th>
                </tr>
              </thead>
              {caseRecommendations.map((each, index) =>
                <ShowIf key={index} show={each.recommendationTypeId===1 || each.recommendationTypeId===2}>
                  <tbody>
                    <tr>
                      <td className={` padding-8 label-column col-md-3 `}>
                        {each.recommender}
                      </td>
                      <td className={` padding-8 data-column col-md-4 `}>
                        {each.recommendation}
                      </td>
                      <td className={` padding-8 data-column col-md-5 `}>
                        {each.recommendationCommentsText}
                      </td>
                    </tr>
                  </tbody>
                </ShowIf>
              )}
            </table>
          </div>
        </div>

        <div className='col-xs-12 padding-left-0'>
          <h2>Vote Board</h2>
          { value==='Full CAP' ? this.getFullCAP() : null }
          { value==='CAP - 4th Year Appraisal' ? this.getCAP4thYearAppraisal() : null }
          { value==='CAP Subcommittee' ? this.getSubcommittee() : null }
          { value==='CAP Subcommittee - 4th Year Appraisal' ? this.getSubcommittee4thYearAppraisal() : null }
          { value==='ClinCAP' ? this.getClinCAP() : null }
          { value==='ClinCAP - 4th Year Appraisal' ? this.getClinCAP4thYearAppraisal() : null }
          { value==='CAP - 5 Year Review' ? this.getCAP5YearReview() : null }
        </div>

        <FixedRoleDisplay {...this.Logic.adminData}/>

      </div>

    );
  }
}
<br></br>
