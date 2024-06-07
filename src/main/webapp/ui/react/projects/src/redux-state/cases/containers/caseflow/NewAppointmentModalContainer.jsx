import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import NewAppointmentModal from '../../../../react-views/cases/caseflow/NewAppointmentModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class NewAppointmentModalReduxContainer extends NewAppointmentModal {}

export const NewAppointmentModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(NewAppointmentModalReduxContainer);
