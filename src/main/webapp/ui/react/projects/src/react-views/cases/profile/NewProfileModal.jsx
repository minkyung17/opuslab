import React from 'react';

//My import
import ProfileEditModal from './ProfileEditModal.jsx';
import NewProfileLogic from '../../../opus-logic/cases/classes/profile/NewProfile';

/**
 *
 * Class representing NewProfile Modal.
 * @extends ProfileEditModal
 *
 **/
export default class NewProfileModal extends ProfileEditModal {

  /**
   *
   * Class variables
   *
   **/
  Logic = new NewProfileLogic(this.props);
}
