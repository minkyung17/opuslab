import {caseFlowSectionNames as modalNames} from
  '../../../opus-logic/cases/constants/caseflow/CaseFlowConstants';


export {modalNames};
export const defaultModalProps = {
  modalBase: {},
  modalHeader: {
    modalTitle: ' Start a Case',
    headerColor: 'modal-info'
  },
  modal_body_div_class: 'modal-body'
};

export const constants = {
  modalNames
};

export const tooltips = {
  recruitEmail: `Please make sure this email address
  is valid. Sometimes Recruit sends us a generic email or one with
  extra characters in it.
  <br> We will not email this person. This is for records purposes
  only. If the appointment is approved, their new UCLA email address will
  replace this old one.`,
  inactiveAndBlankEmail: `We will not email this person. This is for records purposes
  only. If the appointment is approved, their new UCLA email address will
  replace this old one.`,
  proposedActionFlag: `Flag this action as Retention, Retroactive, Chair's Merit or Dean's Merit, if applicable.`
}
