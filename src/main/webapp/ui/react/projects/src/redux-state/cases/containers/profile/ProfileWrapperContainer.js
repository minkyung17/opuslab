import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import ProfileWrapper from '../../../../react-views/cases/profile/ProfileWrapper.jsx';
import {profileMapStateToProps, profileDispatchMethods} from
  '../../utility/ProfileDispatch';


/*******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from ProfilePage.
*
*
*******************************************************************************/
class ProfileWrapperReduxContainer extends ProfileWrapper {}

/**
*
* @desc - Connects CaseFlow to redux
*
**/
export const ProfileWrapperContainer = connect(profileMapStateToProps,
  profileDispatchMethods)(ProfileWrapperReduxContainer);
