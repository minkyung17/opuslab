import {fieldNamesValidation} from "../FieldDataValidations";
import * as validations from "../../../common/helpers/validations";

export let proposedFieldValidations = {
    ...fieldNamesValidation,
    appointmentPctTime: {
        onBlurValidations: [validations.isNumberPresent,  validations.isDecimalNumber, validations.isValidPercent],
        onSaveValidations: [validations.isNumberPresent, validations.isDecimalNumber,
      validations.isAtLeastZero, validations.isValidPercent]
    },
    salary: {
        onSaveValidations: [validations.isAtLeastZero_BlankOk]
    },
    dentistryBaseSupplement: {
        onBlurValidations: [validations.isAtLeastZero_BlankOk],
        onSaveValidations: [validations.isAtLeastZero_BlankOk]
    }
};
