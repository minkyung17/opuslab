import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import ProfileTableBlock from '../../../../react-views/cases/profile/ProfileTableBlock.jsx';
import {profileMapStateToProps, profileDispatchMethods} from
  '../../utility/ProfileDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class ProfileTableReduxContainer extends ProfileTableBlock {}

/**
*
* @desc - Connects CaseFlow to redux
*
**/
export const ProfileTableContainer = connect(profileMapStateToProps,
  profileDispatchMethods)(ProfileTableReduxContainer);
