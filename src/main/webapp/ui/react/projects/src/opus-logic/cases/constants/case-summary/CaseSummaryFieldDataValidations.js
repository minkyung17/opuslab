import * as validations from "../../../common/helpers/validations";
import {fieldNamesValidation as fields} from "../FieldDataValidations";

const commonValidations = {
    apoAnalyst: {
        onSaveValidations: [validations.isNumberPresent]
    },
    appointmentPctTime: {
        onBlurValidations: [validations.isNumberPresent, validations.isDecimalNumber,
      validations.isValidPercent],
        onSaveValidations: [validations.isNumberPresent, validations.isDecimalNumber,
      validations.isAtLeastZero, validations.isValidPercent]
    },
    affiliation: {
    //concatenated actionCategoryId & actionTypeId i.e. '1-1'
        onClickValidations: [validations.isNumberPresent],
        onSaveValidations: [validations.isNumberPresent]
    },
    salaryEffectiveDt: {
        onSaveValidations: [validations.stringNotBlank]
    }
};

let finalDecision = {
    salary: {
        onSaveValidations: [validations.isNumberPresent, validations.isAtLeastZero]
    }
};

export let finalDecisionValidations = {...fields, ...commonValidations,
  ...finalDecision};

export const fieldNamesValidation = {...fields, ...commonValidations};
