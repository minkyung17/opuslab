import React from 'react';
import PropTypes from 'prop-types';

//My imports
import * as util from '../../../opus-logic/common/helpers';
import CaseRecommendations from
  '../../../opus-logic/cases/classes/recommendations/CaseRecommendations';
import {RecommendationsBlock} from './RecommendationComponents.jsx';
import {CAPRCTable, CAPSlateTable} from './CAPComponents.jsx';
import FixedRoleDisplay from '../../common/helpers/FixedRoleDisplay.jsx';
import {ShowIf} from '../../common/components/elements/DisplayIf.jsx';

/**
 *
 * @class RecommendationsPage
 * @classdesc Class representing NewProfile Modal.
 * @extends React.Component
 *
 **/
export default class RecommendationsPage extends React.Component {
  /**
  *
  * @desc - Starting values and their types
  *
  **/
  static defaultProps = {
    caseRecommendationsAPIData: null
  }
  static propTypes = {
    caseRecommendationsAPIData: PropTypes.object,
    setCaseRecommendationsAPIDataInGlobalState: PropTypes.func.isRequired
  }
  state = {
    renderPage: false
  };


  /**
  *
  * @desc - Right before mounting start the page
  * @return {void} - results of text
  *
  **/
  componentWillMount() {
    this.initRecPage();
  }

  //Class variables
  Logic = new CaseRecommendations(this.props);

  /**
  *
  * @desc - Gets caseId from url and uses that to get APIData then sets it in
  *   global state
  * @return {void} - results of text
  *
  **/
  async initRecPage() {
    let {caseId, actionTypeId, actionCategoryId} = util.getUrlArgs();
    if(!this.props.caseRecommendationsAPIData){
      let data = await this.Logic.getAPIData(caseId);
      this.props.setCaseRecommendationsAPIDataInGlobalState(data);
    }

    // RE-320 CAP Tables is ONLY visible to APO/VCAP/OA roles
    let canSeeCAPRCSLATE = false;
    if(this.Logic.Permissions.isOA || this.Logic.Permissions.isAPO
      || this.Logic.Permissions.isVCAP){
      canSeeCAPRCSLATE = true;
    }
    let canSeeCAPSLATE = false;
    if(this.Logic.Permissions.isOA || this.Logic.Permissions.isAPO
      || this.Logic.Permissions.isVCAP || this.Logic.Permissions.isCAP){
      canSeeCAPSLATE = true;
    }
    this.setState({renderPage: true, caseId, actionTypeId, actionCategoryId, canSeeCAPRCSLATE, canSeeCAPSLATE});
  }

  /**
  *
  * @desc - All Recommendations elements
  * @return {Object} - results of text
  *
  **/
  render() {
    if(!this.state.renderPage) {
      return null;
    }

    let {props: {caseRecommendationsAPIData}, state: {caseId, actionTypeId,
      actionCategoryId, canSeeCAPRCSLATE, canSeeCAPSLATE}} = this;

    let args = {caseId, actionTypeId, actionCategoryId, caseRecommendationsAPIData};

    return (
      <div className="col-md-8">
        <RecommendationsBlock {...{...this.props, ...args}} />
        <span>
          <ShowIf show={canSeeCAPSLATE}>
            <CAPSlateTable {...{...this.props, ...args}} />
          </ShowIf>
          <ShowIf show={canSeeCAPRCSLATE}>
            <CAPRCTable {...{...this.props, ...args}} />
          </ShowIf>
        </span>
        <FixedRoleDisplay {...this.Logic.adminData}/>
      </div>
    );
  }
}
