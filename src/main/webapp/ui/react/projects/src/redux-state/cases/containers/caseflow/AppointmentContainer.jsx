import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import AppointmentModal from '../../../../react-views/cases/caseflow/AppointmentModal.jsx';
import {caseFlowMapStateToProps, caseFlowDispatchMethods} from
  '../../utility/CaseFlowDispatch';

/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors fro CaseFlowApp.
*
*
*******************************************************************************/
export class AppointmentModalReduxContainer extends AppointmentModal {}

export const AppointmentModalContainer = connect(caseFlowMapStateToProps,
  caseFlowDispatchMethods)(AppointmentModalReduxContainer);
