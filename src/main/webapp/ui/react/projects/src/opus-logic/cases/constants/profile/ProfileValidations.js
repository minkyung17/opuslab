//My imports
import * as validations from '../../../common/helpers/validations';
import {fieldNamesValidation} from '../FieldDataValidations';


let baseProfileValidations = {
  ...fieldNamesValidation,
  affiliation: {
    onClickValidations: [validations.stringNotBlank],
    onSaveValidations: [validations.stringNotBlank]
  },
  appointmentEndDt: {
    onSaveValidations: null
  },
  location: {
    onClickValidations: null,
    onSaveValidations: null
  },
  appointmentStatusType: {
    onSaveValidations: [validations.isNumberPresent]
  },
  waiverEndDt: {
    onSaveValidations: null
  },
  dentistryBaseSupplement: {
    onSaveValidations: [validations.isAtLeastZero_BlankOk]
  }
};


export let profileValidations = baseProfileValidations;
