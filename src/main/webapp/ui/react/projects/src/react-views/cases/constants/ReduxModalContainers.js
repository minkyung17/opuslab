import {caseFlowSectionNames as modalNames} from
  '../../../opus-logic/cases/constants/caseflow/CaseFlowConstants';


/**
*
* @desc Only Redux containers should go in this file. When you put these
*  in any other constants file you run the risk of getting a circular dependency
*  So please dont add anything else in here.
*
**/

//import {SuccessModalContainer} from '../containers/caseflow/SuccessModal.jsx';
import {RecruitJobModalContainer} from
  '../../../redux-state/cases/containers/caseflow/RecruitJobModalContainer.jsx';
import {RecruitUIDModalContainer} from
  '../../../redux-state/cases/containers/caseflow/RecruitUIDModalContainer.jsx';
import {RecruitMergeModalContainer} from
  '../../../redux-state/cases/containers/caseflow/RecruitMergeModalContainer.jsx';
import {NameSearchModalContainer} from
  '../../../redux-state/cases/containers/caseflow/NameSearchContainer.jsx';
import {ActionTypeModalContainer} from
  '../../../redux-state/cases/containers/caseflow/ActionTypeContainer.jsx';
import {AppointmentModalContainer} from
  '../../../redux-state/cases/containers/caseflow/AppointmentContainer.jsx';
import {ProposedFieldsModalContainer} from
  '../../../redux-state/cases/containers/caseflow/ProposedFieldsContainer.jsx';
import {NewAppointmentModalContainer} from
  '../../../redux-state/cases/containers/caseflow/NewAppointmentModalContainer.jsx';

import {BulkActionsSelectModalContainer} from
  '../../../redux-state/cases/containers/bulk-actions/BulkActionsSelectContainer.jsx';
import {BulkActionsTableModalContainer} from
  '../../../redux-state/cases/containers/bulk-actions/BulkActionsTableContainer.jsx';
import {BulkActionsFieldsModalContainer} from
  '../../../redux-state/cases/containers/bulk-actions/BulkActionsFieldsContainer.jsx';

export const caseFlowModalContainers = {
  [modalNames.actionType]: ActionTypeModalContainer,
  [modalNames.appointment]: AppointmentModalContainer,
  [modalNames.nameSearch]: NameSearchModalContainer,
  [modalNames.proposedFields]: ProposedFieldsModalContainer,
  //[successFields]: SuccessModalContainer
  [modalNames.recruit]: RecruitJobModalContainer,
  [modalNames.newAppointment]: NewAppointmentModalContainer,
  [modalNames.recruitUID]: RecruitUIDModalContainer,
  [modalNames.recruitMerge]: RecruitMergeModalContainer,

  [modalNames.bulkActionsSelect]: BulkActionsSelectModalContainer,
  [modalNames.bulkActionsTable]: BulkActionsTableModalContainer,
  [modalNames.bulkActionsFields]: BulkActionsFieldsModalContainer
};
