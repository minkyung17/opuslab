import {connect} from 'react-redux';

/**
*
* @desc - My program imports
*
**/
import PermissionsByUnitWrapper from
  '../../../../react-views/cases/permissions/PermissionsByUnitWrapper.jsx';
import {permissionsByUnitMapStateToProps, permissionsByUnitDispatchMethods} from
  '../../utility/PermissionsForUnitDispatch';


/******************************************************************************
*
* @desc - Simply maps state to props. Also acts as an intermediate class in permissions
*  we need to overwrite any behaviors from PermissionByUnitPage.
*
*
*******************************************************************************/
class PermissionsByUnitWrapperReduxContainer extends PermissionsByUnitWrapper {}

/**
*
* @desc - Connects unitPermissions to redux
*
**/
export const PermissionsByUnitWrapperContainer = connect(permissionsByUnitMapStateToProps,
  permissionsByUnitDispatchMethods)(PermissionsByUnitWrapperReduxContainer);
