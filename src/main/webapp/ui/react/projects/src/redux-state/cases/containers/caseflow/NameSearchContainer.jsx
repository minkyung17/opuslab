import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import NameSearchModal from '../../../../react-views/cases/caseflow/NameSearchModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class NameSearchModalReduxContainer extends NameSearchModal {

  /**
  *
  * @desc - This handles the state management for setting selected person into
  *   Redux state
  * @param {Object} person - selected person's data
  * @return {void}
  *
  **/
  setSelectedPersonInGlobalState = (person) => {
    this.props.setSelectedPersonInGlobalState(person);
  }
}

export const NameSearchModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(NameSearchModalReduxContainer);
