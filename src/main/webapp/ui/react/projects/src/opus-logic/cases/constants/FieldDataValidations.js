import * as validations from "../../common/helpers/validations";

export let defaultDateValidation = {
    onSaveValidations: [validations.stringNotBlank, validations.isYearBefore1900,
    validations.isYearAfter2100]
};

export let fieldNamesValidation = {
    affiliation: {
        onClickValidations: [validations.isNumberPresent],
        onSaveValidations: [validations.isNumberPresent]
    },
    appointmentAffiliation: {
        checkOnSave: true,
        onSaveValidations: [validations.isNumberPresent]
    },
    appointmentStatusType: {
        checkOnSave: true,
        onSaveValidations: [validations.stringNotBlank]
    },
    appointmentEndDt: {
        checkOnSave: true,
        onSaveValidations: [validations.stringNotBlank, validations.isYearBefore1900,
      validations.isYearAfter2100]
    },
    appointmentPctTime: {
        onBlurValidations: [validations.isNumberPresent, validations.isValidPercent,
      validations.isDecimalNumber, validations.isValidNumber, validations.isAtLeastZero],
        onSaveValidations: [validations.isNumberPresent, validations.isValidPercent,
      validations.isDecimalNumber, validations.isValidNumber, validations.isAtLeastZero]
    },
    approvedOutcome: {
        checkOnSave: true,
        onSaveValidations: [validations.isNumberPresent]
    },
    approvedEffectiveDate: defaultDateValidation,
    approvedYearsAcceleratedCnt: {
        checkOnSave: true,
        onSaveValidations: [validations.isWholeNumber_BlankOk, validations.isAtLeastZero_BlankOk]
    },
    approvedYearsDeferredCnt: {
        onSaveValidations: [validations.isWholeNumber_BlankOk, validations.isAtLeastZero_BlankOk]
    },
    apuCode: {
        onSaveValidations: [validations.isNumberPresent]
    },
    currentSalaryAmt: {
        onBlurValidations: [validations.isNumberPresent],
        onSaveValidations: [validations.isNumberPresent, validations.isAtLeastZero_BlankOk]
    },
    departmentCode: {
    // checkOnClick: true,
    // onClickValidations: [validations.isNumberPresent],
        onSaveValidations: [validations.isNumberPresent]
    },
    dentistryBaseSupplement: {
        onBlurValidations: [validations.isValidNumber],
        onSaveValidations: [validations.isValidNumber, validations.isAtLeastZero_BlankOk]
    },
    effectiveDt: defaultDateValidation,
    endowedChairType: {
        onSaveValidations: [validations.isNumberPresent]
    },
    lastAdvancementActionEffectiveDt: {},
    termEndDate: defaultDateValidation,
    // chairApptEndDate: defaultDateValidation,
    location: {
        onClickValidations: [validations.isNumberPresent],
        onSaveValidations: [validations.isNumberPresent]
    },
    proposedEffectiveDt: defaultDateValidation,
    proposedYearsAcceleratedCnt: {
        onSaveValidations: [validations.isWholeNumber_BlankOk, validations.isAtLeastZero_BlankOk]
    },
    proposedYearsDeferredCnt: {
        onSaveValidations: [validations.isWholeNumber_BlankOk, validations.isAtLeastZero_BlankOk]
    },
    salary: {
        onBlurValidations: [validations.isValidNumber],
        onSaveValidations: [validations.isValidNumber, validations.isAtLeastZero_BlankOk]
    },
    salaryEffectiveDt: {
        onSaveValidations: [validations.stringNotBlank]
    },
    step: {
        onSaveValidations: [validations.isNumberPresent, validations.isAtLeastZero]
    },
    startDateAtSeries: defaultDateValidation,
    startDateAtRank: defaultDateValidation,
    startDateAtStep: defaultDateValidation,
    titleCode: {
        onClickValidations: [validations.isNumberPresent],
        onSaveValidations: [validations.isNumberPresent]
    },
    waiverEndDt: defaultDateValidation
};

export const validationsByActionType = {
    endAppointment: {
        titleCode: {} //BR - 187
    }
};
