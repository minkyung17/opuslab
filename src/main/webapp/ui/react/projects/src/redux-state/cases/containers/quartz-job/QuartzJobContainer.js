import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import QuartzJob from
  '../../../../react-views/cases/quartz-job/QuartzJob.jsx';
import {quartzJobMapStateToProps, quartzJobDispatchMethods} from
  '../../utility/QuartzJobDispatch';


/******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in quartz job
*  we need to overwrite any behaviors from QuartzJobPage.
*
*
*******************************************************************************/
class QuartzJobReduxContainer extends QuartzJob {}

/**
*
* @desc - Connects unitPermissions to redux
*
**/
export const QuartzJobContainer = connect(quartzJobMapStateToProps,
  quartzJobDispatchMethods)(QuartzJobReduxContainer);
