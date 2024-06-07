import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import ProfilePage from '../../../../react-views/cases/profile/ProfilePage.jsx';
import {profileMapStateToProps, profileDispatchMethods} from
  '../../utility/ProfileDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class ProfilePageReduxContainer extends ProfilePage {}

/**
*
* @desc - Connects CaseFlow to redux
*
**/
export const ProfilePageContainer = connect(profileMapStateToProps,
  profileDispatchMethods)(ProfilePageReduxContainer);
