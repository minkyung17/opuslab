/**
 *
 * @name tocCreditedNumberBounds
 * @desc - TOC Taken must be integer 0,1,2, & 3 (RE-313)
 * @param {String} fieldValue - value to be checked
 * @param {Bool} returnMessage - whether to return a message
 * @return {Object} validation - validation w/ status
 *
 **/
export function tocCreditedNumberBounds(fieldValue, returnMessage = false) {
  let isMatch = fieldValue >= 0 && fieldValue <= 3 && fieldValue % 1 === 0;

  if(returnMessage) {
    isMatch = {isValid: isMatch, message: 'Please enter a number from 0 to 3.'};
  }

  return isMatch;
}


/**
 *
 * @desc  - TOC Taken must be integer 0,1,2, & 3 (RE-313)
 * @param {String} fieldValue - fieldValue
 * @param {Boolean} returnMessage -
 * @param {Boolean} tocCredited -
 * @return {Boolean} tocCredited
 *
 **/
export function tocTakenBelowTOCCredited(fieldValue, returnMessage = false, tocCredited) {
  let isMatch = fieldValue >= 0 && fieldValue <= tocCredited && fieldValue % 1 === 0;
  if(returnMessage) {
    isMatch = {message: 'Field cannot be greater than TOC Credited',
      isValid: isMatch};
  }
  return isMatch;
}
