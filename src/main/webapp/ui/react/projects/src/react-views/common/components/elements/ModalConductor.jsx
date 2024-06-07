import React from 'react';


/**
 *
 * @desc - A way to switch modals
 * @param {Object} props - properties passed in
 * @return {JSX} - switchable modal contents
 *
 **/
export const ModalConductor = props => {
  let {modalOptions, currentModal} = props;

  let Modal = modalOptions[currentModal];
  return Modal ? <Modal {...props} /> : null;
};
ModalConductor.propTypes = {
  currentModal: React.PropTypes.string,
  modalOptions: React.PropTypes.object
};
