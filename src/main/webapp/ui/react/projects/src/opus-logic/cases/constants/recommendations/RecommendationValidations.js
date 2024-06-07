import * as validations from '../../../common/helpers/validations';

export const recommendationValidations = {
  typeOfCAPCommittee: {
    onSaveValidations: [validations.isNumberPresent]
  }
};
