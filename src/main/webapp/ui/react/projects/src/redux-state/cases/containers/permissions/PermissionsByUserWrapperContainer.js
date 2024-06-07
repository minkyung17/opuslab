import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import PermissionsByUserWrapper from
  '../../../../react-views/cases/permissions/PermissionsByUserWrapper.jsx';
import {permissionsByUserMapStateToProps, permissionsByUserDispatchMethods} from
  '../../utility/PermissionsDispatch';


/******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in case
*  we need to overwrite any behaviors from PermissionByUserPage.
*
*
*******************************************************************************/
class PermissionsByUserWrapperReduxContainer extends PermissionsByUserWrapper {}

/**
*
* @desc - Connects CaseFlow to redux
*
**/
export const PermissionsByUserWrapperContainer = connect(permissionsByUserMapStateToProps,
  permissionsByUserDispatchMethods)(PermissionsByUserWrapperReduxContainer);
